import React, { useCallback, useRef, useState } from 'react';
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
import { recipesData, sortRecipesByPopularity } from '@/constants/data';

const ACTION_CONTROL_HEIGHT = 40;
const SORT_BUTTON_WIDTH = 104;

export default function RecipeScreen() {
  const { user } = useAuth();
  const { scrollToTop } = useLocalSearchParams<{ scrollToTop?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순" | "내 추천순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [recipes, setRecipes] = useState(recipesData);

  const handleRecipeLike = (recipeId: number) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const filteredRecipes = recipes.filter(r => {
    const query = searchQuery.toLowerCase();
    return !query || r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query) || r.author.toLowerCase().includes(query);
  });

  const sortedRecipes =
    sortOption === "최신순"
      ? [...filteredRecipes].sort((a, b) => b.id - a.id)
      : sortRecipesByPopularity(filteredRecipes);

  useFocusEffect(
    useCallback(() => {
      if (!scrollToTop) return;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
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
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
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
              <TouchableOpacity style={styles.loginReqBtn} onPress={() => router.push('/login' as any)}>
                 <Text style={styles.loginReqBtnTxt}>로그인하고 제안하기</Text>
              </TouchableOpacity>
            )}

            <View style={styles.sortContainer}>
               <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortDropdown(!showSortDropdown)}>
                  <Text style={styles.sortBtnTxt}>{sortOption}</Text>
                  <ChevronDown size={14} color="#6B7280" />
               </TouchableOpacity>
               {showSortDropdown && (
                 <View style={styles.sortDropdown}>
                    {(["인기순", "최신순", "내 추천순"] as const).map(opt => (
                      <TouchableOpacity key={opt} style={styles.dropItem} onPress={() => { setSortOption(opt); setShowSortDropdown(false); }}>
                         <Text style={[styles.dropTxt, sortOption === opt && { fontWeight: '800' }]}>{opt}</Text>
                         {sortOption === opt && <Check size={14} color="#111" />}
                      </TouchableOpacity>
                    ))}
                 </View>
               )}
            </View>
         </View>

         <View style={styles.recipeList}>
            {sortedRecipes.map((item, index) => (
              <RecipeCard 
                key={item.id} 
                recipe={item} 
                index={index}
                onLike={handleRecipeLike}
                showLikeButton={true}
              />
            ))}
            {sortedRecipes.length === 0 && (
              <View style={styles.emptyState}>
                 <Text style={styles.emptyTxt}>검색 결과가 없습니다.</Text>
              </View>
            )}
         </View>
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
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyTxt: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
});
