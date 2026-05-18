import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  Sparkles,
  Search,
  X,
  ChevronDown,
  Check,
} from 'lucide-react-native';

import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { RecipeCard } from '@/components/recipe-card';
import { sortRecipesByPopularity } from '@/constants/data';
import type { Recipe } from '@/constants/data';
import {
  deleteRecipeInterest,
  fetchRecipes,
  getRecipeAccessToken,
  registerRecipeInterest,
} from '@/features/recipe/api';
import {
  applyRecipeInterestState,
  getRecipeInterestState,
  setRecipeInterestState,
} from '@/features/recipe/interestState';
import { showLoginRequired } from '@/utils/authPrompt';

const ACTION_CONTROL_HEIGHT = 40;
const SORT_BUTTON_WIDTH = 104;
const RECIPE_PAGE_SIZE = 7;

type SortOption = 'popular' | 'newest' | 'recommended';

const SORT_LABELS: Record<SortOption, string> = {
  popular: '인기순',
  newest: '최신순',
  recommended: '내 추천순',
};

const SORT_OPTIONS: SortOption[] = ['popular', 'newest', 'recommended'];

export default function RecipeScreen() {
  const { user, isAuthReady } = useAuth();
  const { scrollToTop } = useLocalSearchParams<{ scrollToTop?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const applyLocalInterestState = useCallback((items: Recipe[]) => applyRecipeInterestState(items), []);

  const loadRecipes = useCallback(async () => {
    if (!isAuthReady) return;

    if (sortOption === 'recommended') {
      setRecipes([]);
      setLoadError(false);
      setIsLoading(false);
      setTotalPages(1);
      setTotalElements(0);
      return;
    }

    setIsLoading(true);
    setLoadError(false);
    setRecipes([]);
    try {
      const response = await fetchRecipes({
        sort: sortOption === 'newest' ? 'newest' : 'popular',
        page: page - 1,
        size: RECIPE_PAGE_SIZE,
      });
      setRecipes(applyLocalInterestState(response.recipes));
      setTotalPages(Math.max(1, response.totalPages || 1));
      setTotalElements(response.totalElements || response.recipes.length);
    } catch (error) {
      console.warn('Failed to load recipes from API', error);
      setLoadError(true);
      setRecipes([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [applyLocalInterestState, isAuthReady, page, sortOption]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleRecipeLike = async (recipeId: number) => {
    if (!user) {
      showLoginRequired('레시피 관심은 로그인 후 이용할 수 있어요.');
      return;
    }

    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }

    const target = recipes.find((recipe) => recipe.id === recipeId);
    if (!target) return;

    const nextLiked = !target.liked;
    const previousInterestState = getRecipeInterestState(recipeId);
    const optimisticState = {
      liked: nextLiked,
      likes: nextLiked ? target.likes + 1 : Math.max(0, target.likes - 1),
      isFundable: target.isFundable,
    };
    setRecipeInterestState(recipeId, optimisticState);

    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, ...optimisticState }
          : recipe
      )
    );

    try {
      const response = nextLiked
        ? await registerRecipeInterest(recipeId)
        : await deleteRecipeInterest(recipeId);
      setRecipeInterestState(recipeId, {
        liked: nextLiked,
        likes: response.data.interest_count,
        isFundable: response.data.is_fundable,
      });
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? applyRecipeInterestState([
                {
                  ...recipe,
                  liked: nextLiked,
                  likes: response.data.interest_count,
                  isFundable: response.data.is_fundable,
                },
              ])[0]
            : recipe
        )
      );
    } catch (error) {
      console.warn('Failed to update recipe interest', error);
      setRecipeInterestState(recipeId, previousInterestState);
      setRecipes((prev) => prev.map((recipe) => (recipe.id === recipeId ? target : recipe)));
    }
  };

  const handleRecipeComment = (recipeId: number) => {
    if (!user) {
      showLoginRequired('레시피 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }
    router.push(`/recipe/${recipeId}` as any);
  };

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.author.toLowerCase().includes(query)
    );
  });

  const sortedRecipes =
    sortOption === 'newest'
      ? [...filteredRecipes].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
          return bTime - aTime;
        })
      : sortRecipesByPopularity(filteredRecipes);

  useFocusEffect(
    useCallback(() => {
      setRecipes((prev) => applyRecipeInterestState(prev));
      if (scrollToTop) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: false });
        });
      }
    }, [scrollToTop])
  );

  return (
    <View style={styles.container}>
      <PageHeader title="주담" />
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="레시피, 재료, 작성자로 검색..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.actionRow}>
          {user ? (
            <TouchableOpacity style={styles.proposeBtn} onPress={() => router.push('/recipe/create' as any)}>
              <Sparkles size={16} color="#FFF" />
              <Text style={styles.proposeBtnTxt}>레시피 제안하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginReqBtn}
              onPress={() => showLoginRequired('레시피 제안은 로그인 후 이용할 수 있어요.')}
            >
              <Text style={styles.loginReqBtnTxt}>로그인하고 제안하기</Text>
            </TouchableOpacity>
          )}

          <View style={styles.sortContainer}>
            <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortDropdown(!showSortDropdown)}>
              <Text style={styles.sortBtnTxt}>{SORT_LABELS[sortOption]}</Text>
              <ChevronDown size={14} color="#6B7280" />
            </TouchableOpacity>
            {showSortDropdown && (
              <View style={styles.sortDropdown}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropItem}
                    onPress={() => {
                      setSortOption(option);
                      setPage(1);
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropTxt, sortOption === option && { fontWeight: '800' }]}>
                      {SORT_LABELS[option]}
                    </Text>
                    {sortOption === option && <Check size={14} color="#111" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.recipeList}>
          {isLoading && (
            <View style={styles.stateBox}>
              <Text style={styles.stateTxt}>레시피 목록을 불러오고 있어요.</Text>
            </View>
          )}
          {loadError && !isLoading && (
            <TouchableOpacity style={styles.stateBox} onPress={loadRecipes} activeOpacity={0.8}>
              <Text style={styles.stateTxt}>
                서버 목록을 잠시 불러오지 못했어요. 다시 시도
              </Text>
            </TouchableOpacity>
          )}
          {!isLoading && !loadError && sortOption === 'recommended' && (
            <View style={styles.stateBox}>
              <Text style={styles.stateTxt}>내 추천순 API가 아직 준비되지 않았어요.</Text>
            </View>
          )}
          {!isLoading && sortedRecipes.map((item, index) => (
            <RecipeCard
              key={item.id}
              recipe={item}
              index={index}
              onLike={handleRecipeLike}
              onComment={handleRecipeComment}
              showLikeButton={true}
            />
          ))}
          {sortedRecipes.length === 0 && !isLoading && !loadError && sortOption !== 'recommended' && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTxt}>검색 결과가 없습니다.</Text>
            </View>
          )}
        </View>
        {totalPages > 1 && !isLoading && !loadError && sortOption !== 'recommended' && (
          <View style={styles.paginationWrap}>
            <View style={styles.paginationRow}>
              <TouchableOpacity
                style={[styles.pageControlButton, page === 1 && styles.pageControlDisabled]}
                activeOpacity={0.8}
                disabled={page === 1}
                onPress={() => changePage(page - 1)}
              >
                <Text style={[styles.pageControlText, page === 1 && styles.pageControlTextDisabled]}>이전</Text>
              </TouchableOpacity>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <TouchableOpacity
                  key={pageNumber}
                  style={[styles.pageNumberButton, page === pageNumber && styles.pageNumberActive]}
                  activeOpacity={0.85}
                  onPress={() => changePage(pageNumber)}
                >
                  <Text style={[styles.pageNumberText, page === pageNumber && styles.pageNumberTextActive]}>
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.pageControlButton, page === totalPages && styles.pageControlDisabled]}
                activeOpacity={0.8}
                disabled={page === totalPages}
                onPress={() => changePage(page + 1)}
              >
                <Text style={[styles.pageControlText, page === totalPages && styles.pageControlTextDisabled]}>다음</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pageSummary}>총 {totalElements}개 레시피 · {page} / {totalPages} 페이지</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  searchSection: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchBar: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#111' },
  scrollContent: { padding: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18, zIndex: 100 },
  proposeBtn: { flex: 1, height: ACTION_CONTROL_HEIGHT, backgroundColor: '#111', borderRadius: ACTION_CONTROL_HEIGHT / 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  proposeBtnTxt: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  loginReqBtn: { flex: 1, height: ACTION_CONTROL_HEIGHT, backgroundColor: '#F3F4F6', borderRadius: ACTION_CONTROL_HEIGHT / 2, alignItems: 'center', justifyContent: 'center' },
  loginReqBtnTxt: { color: '#6B7280', fontSize: 13, fontWeight: '700' },
  sortContainer: { position: 'relative', width: SORT_BUTTON_WIDTH },
  sortBtn: { width: SORT_BUTTON_WIDTH, height: ACTION_CONTROL_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F3F4F6', borderRadius: ACTION_CONTROL_HEIGHT / 2 },
  sortBtnTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  sortDropdown: { position: 'absolute', top: 40, right: 0, backgroundColor: '#FFF', borderRadius: 16, width: 140, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropTxt: { fontSize: 13, color: '#374151' },
  recipeList: { gap: 12 },
  stateBox: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
  stateTxt: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyTxt: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  paginationWrap: { alignItems: 'center', paddingTop: 20, paddingBottom: 6, gap: 12 },
  paginationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  pageControlButton: { minWidth: 48, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  pageControlDisabled: { backgroundColor: '#F3F4F6', borderColor: '#F3F4F6' },
  pageControlText: { fontSize: 13, fontWeight: '900', color: '#111827' },
  pageControlTextDisabled: { color: '#A1AAB8' },
  pageNumberButton: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  pageNumberActive: { backgroundColor: '#000000', borderColor: '#000000' },
  pageNumberText: { fontSize: 14, fontWeight: '900', color: '#374151' },
  pageNumberTextActive: { color: '#FFFFFF' },
  pageSummary: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
});
