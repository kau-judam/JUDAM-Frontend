import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  Plus,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Factory,
  ShieldCheck,
  Trophy,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PageHeader } from '@/components/PageHeader';
import { StatsGrid } from '@/components/StatsGrid';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import { getBtiDisplayType, getBtiTasteAxisValuesFromScores, getBtiTasteAxisValuesFromTasteVector, resolveSulbtiCode } from '@/features/bti/data';
import FundingAlertModal, { type FundingAlertButton, type FundingAlertTone } from '@/features/funding/components/FundingAlertModal';
import FundingProjectCard from '@/features/funding/components/FundingProjectCard';
import { getFundingList, getFundingApiErrorMessage } from '@/features/funding/api';
import { mergeFundingListItem } from '@/features/funding/apiMappers';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import { getMyPageApiErrorMessage, getMyPageSulbti } from '@/features/mypage/api';
import { getEmptyStatsSummary, getStatsSummary, type FundingStatsSummary } from '@/features/stats/api';
import {
  getTasteProfileFromSulbti,
  matchesFundingSearch,
  matchesFundingStatusFilter,
  sortOptions,
  statusOptions,
  type FundingSortOption,
  type FundingStatusFilter,
} from '@/features/funding/recommendation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FUNDING_ITEMS_PER_PAGE = 5;
type FundingListAlert = {
  title: string;
  body: string;
  tone?: FundingAlertTone;
  buttons?: FundingAlertButton[];
};

function formatCountWithUnit(value: number, unit: string) {
  return `${Math.max(0, Math.round(value || 0)).toLocaleString()}${unit}`;
}

function formatWon(value: number) {
  return `${Math.max(0, Math.round(value || 0)).toLocaleString()}원`;
}

function getFundingApiStatus(status: FundingStatusFilter, sort: FundingSortOption) {
  if (status === "전체 프로젝트" && sort === "인기순") return "ACTIVE";
  if (status === "진행중인 프로젝트") return "ACTIVE";
  if (status === "성사된 프로젝트") return "SUCCESS";
  return undefined;
}

function getFundingApiSort(sort: FundingSortOption) {
  if (sort === "추천순") return "RECOMMENDED";
  if (sort === "마감임박") return "DEADLINE";
  if (sort === "최신순") return "LATEST";
  return "POPULAR";
}

export default function FundingListScreen() {
  const { user, updateUser } = useAuth();
  const { scrollToTop, sort } = useLocalSearchParams<{ scrollToTop?: string; sort?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const currentScrollYRef = useRef(0);
  const pendingPaginationScrollYRef = useRef<number | null>(null);
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const { projects, replaceProjects, mergeProject } = useFunding();
  const projectsRef = useRef(projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FundingStatusFilter>("전체 프로젝트");
  const [selectedSort, setSelectedSort] = useState<FundingSortOption>("인기순");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertModal, setAlertModal] = useState<FundingListAlert | null>(null);
  const [serverFundingStats, setServerFundingStats] = useState<FundingStatsSummary>(() => getEmptyStatsSummary().funding);
  const [serverFundingOrderIds, setServerFundingOrderIds] = useState<number[]>([]);
  const [hasLoadedServerFundingList, setHasLoadedServerFundingList] = useState(false);
  const [isSulbtiRestoring, setIsSulbtiRestoring] = useState(false);
  const sulbtiRestorePromiseRef = useRef<Promise<boolean> | null>(null);

  const isBreweryAccount = user?.type === "brewery";
  const isVerifiedBrewery = isBreweryAccount && user?.isBreweryVerified;
  const userTasteProfile = useMemo(() => getTasteProfileFromSulbti(user?.sulbti), [user?.sulbti]);
  const displaySulbti = useMemo(() => getBtiDisplayType(user?.sulbti), [user?.sulbti]);
  const isTasteSortActive = selectedSort === "추천순" && Boolean(userTasteProfile);
  const effectiveStatusFilter = useMemo<FundingStatusFilter>(
    () => selectedStatus === "전체 프로젝트" && selectedSort === "인기순" ? "진행중인 프로젝트" : selectedStatus,
    [selectedSort, selectedStatus]
  );
  const restoreSulbtiResult = useCallback(async () => {
    if (!user) return false;
    if (getTasteProfileFromSulbti(user.sulbti)) return true;
    if (sulbtiRestorePromiseRef.current) return sulbtiRestorePromiseRef.current;

    const restorePromise = (async () => {
      try {
        setIsSulbtiRestoring(true);
        const result = await getMyPageSulbti();
        if (!result.hasResult) return false;
        const restoredCode = resolveSulbtiCode(result.btiCode || result.type);
        if (!restoredCode) return false;
        await updateUser({
          sulbti: restoredCode,
          sulbtiProfile: getBtiTasteAxisValuesFromScores(result.scores)
            || (result.tasteVector
              ? getBtiTasteAxisValuesFromTasteVector(result.tasteVector)
              : undefined),
        });
        return true;
      } catch (error) {
        console.warn(getMyPageApiErrorMessage(error, '술BTI 결과를 불러오지 못했습니다.'));
        return false;
      } finally {
        setIsSulbtiRestoring(false);
        sulbtiRestorePromiseRef.current = null;
      }
    })();

    sulbtiRestorePromiseRef.current = restorePromise;
    return restorePromise;
  }, [updateUser, user]);
  const showLoginPrompt = (message: string) => {
    setAlertModal({
      title: '로그인이 필요합니다',
      body: message,
      tone: 'info',
      buttons: [
        { label: '로그인하기', onPress: () => router.push('/login' as any) },
        { label: '닫기', variant: 'secondary' },
      ],
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedSort]);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    if (!user?.id || user.sulbti) return;
    void restoreSulbtiResult();
  }, [restoreSulbtiResult, user?.id, user?.sulbti]);

  useEffect(() => {
    if (sort !== "recommend" || !user) return;
    if (userTasteProfile) {
      setSelectedSort("추천순");
      return;
    }
    void restoreSulbtiResult().then((restored) => {
      if (restored) setSelectedSort("추천순");
    });
  }, [restoreSulbtiResult, sort, user, userTasteProfile]);

  useEffect(() => {
    let mounted = true;
    const status = getFundingApiStatus(effectiveStatusFilter, selectedSort);
    const apiSort = getFundingApiSort(selectedSort);
    setServerFundingOrderIds([]);
    setHasLoadedServerFundingList(false);

    getFundingList({ status, sort: apiSort, page: 0, size: 100 })
      .then((response) => {
        if (!mounted) return;
        const nextProjects = response.data.map((item) =>
          mergeFundingListItem(projectsRef.current.find((project) => project.id === item.fundingId), item)
        );
        const displayProjects = nextProjects.filter((project) => matchesFundingStatusFilter(project, effectiveStatusFilter));
        setServerFundingOrderIds(displayProjects.map((project) => project.id));
        replaceProjects(displayProjects);
        setHasLoadedServerFundingList(true);
      })
      .catch((error) => {
        if (mounted) {
          setServerFundingOrderIds([]);
          replaceProjects([]);
          setHasLoadedServerFundingList(true);
        }
        console.warn(getFundingApiErrorMessage(error, '펀딩 목록을 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [effectiveStatusFilter, replaceProjects, selectedSort, user?.id, user?.sulbti]);

  useEffect(() => {
    let mounted = true;

    getStatsSummary()
      .then((stats) => {
        if (mounted) setServerFundingStats(stats.funding);
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '통계를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!scrollToTop) return;
      requestAnimationFrame(() => {
        currentScrollYRef.current = 0;
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    }, [scrollToTop])
  );

  const restorePaginationScroll = useCallback(() => {
    const targetY = pendingPaginationScrollYRef.current;
    if (targetY === null) return;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: targetY, animated: false });
      pendingPaginationScrollYRef.current = null;
    });
  }, []);

  const filteredProjects = useMemo(() => {
    if (!hasLoadedServerFundingList || serverFundingOrderIds.length === 0) return [];
    const serverFundingIds = new Set(serverFundingOrderIds);
    return projects.filter((project) => {
      return serverFundingIds.has(project.id) && matchesFundingSearch(project, searchTerm) && matchesFundingStatusFilter(project, effectiveStatusFilter);
    });
  }, [effectiveStatusFilter, hasLoadedServerFundingList, projects, searchTerm, serverFundingOrderIds]);

  const sortedProjects = useMemo(() => {
    const orderMap = new Map(serverFundingOrderIds.map((id, index) => [id, index]));
    return [...filteredProjects].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
  }, [filteredProjects, serverFundingOrderIds]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedProjects.length / FUNDING_ITEMS_PER_PAGE)),
    [sortedProjects.length]
  );
  const pagedProjects = useMemo(
    () => sortedProjects.slice((currentPage - 1) * FUNDING_ITEMS_PER_PAGE, currentPage * FUNDING_ITEMS_PER_PAGE),
    [currentPage, sortedProjects]
  );
  const totalRaisedMilestoneText = useMemo(
    () => formatWon(serverFundingStats.totalRaisedAmount),
    [serverFundingStats.totalRaisedAmount]
  );

  useEffect(() => {
    restorePaginationScroll();
  }, [currentPage, restorePaginationScroll]);

  const handleScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    currentScrollYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const handlePageChange = useCallback((page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;
    pendingPaginationScrollYRef.current = currentScrollYRef.current;
    setCurrentPage(nextPage);
  }, [currentPage, totalPages]);

  const handleHeroAction = () => {
    if (!user) {
      showLoginPrompt('펀딩 프로젝트 등록은 로그인 후 이용할 수 있어요.');
      return;
    }
    if (isVerifiedBrewery) {
      router.push('/brewery/project/terms' as any);
      return;
    }
    setAlertModal({
      title: '양조장 인증 대기 중',
      body: '아직 양조장 인증이 승인되지 않았습니다.\n승인이 된 후 이용 가능합니다.',
      tone: 'info',
    });
  };

  const handleFavoritePress = async (projectId: number) => {
    if (!user) {
      showLoginPrompt('펀딩 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const response = await toggleFavoriteFunding(projectId);
    if (!response) return;
    mergeProject(response.fundingId || projectId, {
      liked: response.liked,
      favoriteCount: response.likeCount,
    });
  };

  const handleSortPress = async (option: FundingSortOption) => {
    if (option === "추천순") {
      if (!user) {
        showLoginPrompt('술BTI 맞춤 추천은 로그인 후 이용할 수 있어요.');
        return;
      }
      if (!userTasteProfile) {
        const restored = await restoreSulbtiResult();
        if (restored) {
          setSelectedSort(option);
          return;
        }
        setAlertModal({
          title: '술BTI 결과가 필요합니다',
          body: '마이페이지에서 술BTI 검사를 완료하면 취향에 맞는\n펀딩을 추천받을 수 있어요.',
          tone: 'info',
          buttons: [
            { label: '마이페이지로 이동', onPress: () => router.push('/mypage' as any) },
            { label: '닫기', variant: 'secondary' },
          ],
        });
        return;
      }
    }
    setSelectedSort(option);
  };

  return (
    <View style={styles.container}>
      <PageHeader title="펀딩" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onContentSizeChange={restorePaginationScroll}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Hero Section */}
        <View style={styles.hero}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" }}
            style={styles.heroImg}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Animated.View entering={FadeInUp.duration(800)}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>{isBreweryAccount ? "양조장 파트너" : "주담 펀딩"}</Text>
              </View>
              <Text style={styles.heroTitle}>당신의 선택으로{'\n'}완성되는 전통주</Text>
              {isBreweryAccount ? (
                <TouchableOpacity 
                  style={[styles.createBtn, isVerifiedBrewery ? styles.createBtnCompact : styles.createBtnWide]}
                  onPress={handleHeroAction}
                  activeOpacity={0.9}
                >
                  {isVerifiedBrewery ? <Plus size={20} color="#000" /> : <ShieldCheck size={20} color="#000" />}
                  <Text style={styles.createBtnTxt}>{isVerifiedBrewery ? "프로젝트 등록" : "양조장 인증 후 등록"}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.heroDesc}>
                  지금 참여 가능한 프로젝트를 탐색하고,{'\n'}당신만의 전통주를 함께 만들어보세요
                </Text>
              )}
            </Animated.View>
          </View>
        </View>

        {/* 2. Floating Search & Filter Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
            <View style={styles.searchBar}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="프로젝트·양조장 검색"
                placeholderTextColor="#9CA3AF"
                value={searchTerm}
                onChangeText={setSearchTerm}
                multiline={false}
                numberOfLines={1}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={() => setShowDropdown(!showDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.filterTxt}>
                {selectedStatus === "전체 프로젝트" ? "전체" : 
                 selectedStatus === "진행중인 프로젝트" ? "진행중" : "성사됨"}
              </Text>
              <ChevronDown size={14} color="#111" />
            </TouchableOpacity>
            
            {showDropdown && (
              <View style={styles.dropdown}>
                {statusOptions.map((opt) => (
                  <TouchableOpacity 
                    key={opt} 
                    style={styles.dropItem} 
                    onPress={() => { setSelectedStatus(opt); setShowDropdown(false); }}
                  >
                    <Text style={[styles.dropTxt, selectedStatus === opt && { fontWeight: '800', color: '#000' }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.sortPanel}>
            <View style={styles.sortHeader}>
              <Text style={styles.sortLabel}>정렬/추천</Text>
              <Text style={styles.sortHint}>
                {user?.sulbti && userTasteProfile
                  ? `나의 술BTI ${displaySulbti} 기준`
                  : isSulbtiRestoring
                    ? "저장된 술BTI 불러오는 중"
                    : "술BTI 검사 후 맞춤 추천 가능"}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortChipRow}>
              {sortOptions.map((option) => {
                const selected = selectedSort === option;
                const needsBti = option === "추천순" && !userTasteProfile;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.sortChip, selected && styles.sortChipActive, needsBti && styles.sortChipLocked]}
                    onPress={() => handleSortPress(option)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.sortChipTxt, selected && styles.sortChipTxtActive]}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* 3. Funding Project Feed */}
        <View style={styles.listSection}>
          {pagedProjects.length === 0 ? (
            <View style={styles.emptyBox}>
              <Search size={48} color="#E5E7EB" />
              <Text style={styles.emptyTxt}>해당하는 펀딩 프로젝트가 없습니다.</Text>
            </View>
          ) : (
            pagedProjects.map((project) => {
              const isOwnProject = isFundingProjectOwnedByBrewery(user, project);
              return (
                <View key={project.id} style={styles.projectCardSpacing}>
                  <FundingProjectCard
                    project={project}
                    favorite={isFavoriteFunding(project.id)}
                    ownProject={isOwnProject}
                    showTasteMatch={isTasteSortActive}
                    tasteProfile={userTasteProfile}
                    onPress={() => router.push(`/funding/${project.id}`)}
                    onFavoritePress={handleFavoritePress}
                  />
                </View>
              );
            })
          )}

          {/* Pagination */}
          {sortedProjects.length > FUNDING_ITEMS_PER_PAGE && (
            <View style={styles.pagination}>
              <TouchableOpacity 
                disabled={currentPage === 1} 
                onPress={() => handlePageChange(currentPage - 1)}
                style={[styles.pageArrow, currentPage === 1 && { opacity: 0.3 }]}
              >
                <ChevronLeft size={20} color="#111" />
                <Text style={styles.pageArrowTxt}>이전</Text>
              </TouchableOpacity>

              <View style={styles.pageNumbers}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.pageBtn, currentPage === i + 1 && styles.pageBtnActive]} 
                    onPress={() => handlePageChange(i + 1)}
                  >
                    <Text style={[styles.pageBtnTxt, currentPage === i + 1 && styles.pageBtnTxtActive]}>{i + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                disabled={currentPage === totalPages} 
                onPress={() => handlePageChange(currentPage + 1)}
                style={[styles.pageArrow, currentPage === totalPages && { opacity: 0.3 }]}
              >
                <Text style={styles.pageArrowTxt}>다음</Text>
                <ChevronRight size={20} color="#111" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. Stats Section */}
        <View style={styles.statsSection}>
          <Animated.View entering={FadeInUp} style={{ alignItems: 'center' }}>
            <Text style={styles.statsTitle}>주담과 함께한 순간들</Text>
            <Text style={styles.statsSubtitle}>함께 만들어가는 전통주의 미래</Text>
          </Animated.View>

          <StatsGrid
            items={[
              {
                key: 'supportable',
                icon: <TrendingUp size={20} color="#FFF" />,
                value: formatCountWithUnit(serverFundingStats.supportableFundingCount, '개'),
                label: '참여 가능 펀딩',
                description: '지금 후원 가능',
              },
              {
                key: 'backers',
                icon: <Users size={20} color="#FFF" />,
                value: formatCountWithUnit(serverFundingStats.totalBackerCount, '명'),
                label: '총 참여자',
                description: '함께한 사람들',
              },
              {
                key: 'amount',
                icon: <Factory size={20} color="#FFF" />,
                value: totalRaisedMilestoneText,
                label: '누적 모금액',
                description: '전통주에 모인 금액',
              },
              {
                key: 'success',
                icon: <Trophy size={20} color="#FFF" />,
                value: formatCountWithUnit(serverFundingStats.successfulProjectCount, '개'),
                label: '성공 프로젝트',
                description: '여러분의 선택',
              },
            ]}
          />
        </View>
      </ScrollView>
      <FundingAlertModal
        visible={Boolean(alertModal)}
        title={alertModal?.title || ''}
        body={alertModal?.body || ''}
        tone={alertModal?.tone}
        buttons={alertModal?.buttons}
        onClose={() => setAlertModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  hero: { height: SCREEN_HEIGHT * 0.65, backgroundColor: '#000' },
  heroImg: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  heroContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  heroPill: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', marginBottom: 14 },
  heroPillText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  heroTitle: { color: '#FFF', fontSize: 44, fontWeight: '800', textAlign: 'center', lineHeight: 54, marginBottom: 24, letterSpacing: -1 },
  heroDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 14, textAlign: 'center', lineHeight: 24, fontWeight: '500' },
  createBtn: { height: 52, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', gap: 8, paddingHorizontal: 16, borderRadius: 16, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  createBtnCompact: { width: 170 },
  createBtnWide: { width: 220 },
  createBtnTxt: { fontSize: 15, fontWeight: '800', color: '#000', textAlign: 'center' },
  searchSection: { paddingHorizontal: 20, marginTop: -45, zIndex: 20 },
  searchCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 12, flexDirection: 'row', gap: 10, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 25, borderWidth: 1, borderColor: '#F3F4F6', zIndex: 30 },
  searchBar: { flex: 1, height: 56, backgroundColor: '#F9FAFB', borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchInput: { flex: 1, minWidth: 0, height: '100%', marginLeft: 12, paddingVertical: 0, fontSize: 15, fontWeight: '600', color: '#000', textAlignVertical: 'center' },
  filterBtn: { height: 56, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 20, borderWidth: 2, borderColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6 },
  filterTxt: { fontSize: 14, fontWeight: '700', color: '#111' },
  dropdown: { position: 'absolute', top: 75, right: 12, backgroundColor: '#FFF', borderRadius: 20, width: 200, elevation: 25, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  dropItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropTxt: { fontSize: 14, color: '#4B5563' },
  sortPanel: { marginTop: 12, backgroundColor: '#FFF', borderRadius: 24, padding: 14, borderWidth: 1, borderColor: '#F3F4F6', gap: 12, zIndex: 10 },
  sortHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sortLabel: { fontSize: 13, fontWeight: '900', color: '#111' },
  sortHint: { flex: 1, textAlign: 'right', fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  sortChipRow: { gap: 8, paddingRight: 4 },
  sortChip: { minHeight: 36, borderRadius: 999, paddingHorizontal: 13, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  sortChipActive: { backgroundColor: '#111', borderColor: '#111' },
  sortChipLocked: { opacity: 0.72 },
  sortChipTxt: { fontSize: 12, fontWeight: '900', color: '#6B7280' },
  sortChipTxtActive: { color: '#FFF' },
  listSection: { padding: 20, paddingTop: 40 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTxt: { fontSize: 16, color: '#9CA3AF', marginTop: 16, fontWeight: '500' },
  projectCardSpacing: { marginBottom: 16 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  pageNumbers: { flexDirection: 'row', gap: 8 },
  pageArrow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pageArrowTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  pageBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  pageBtnActive: { backgroundColor: '#111', borderColor: '#111', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  pageBtnTxt: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  pageBtnTxtActive: { color: '#FFF' },
  statsSection: { padding: 24, paddingTop: 80, alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  statsTitle: { fontSize: 32, fontWeight: '800', color: '#111', marginBottom: 8, letterSpacing: -0.5 },
  statsSubtitle: { fontSize: 15, color: '#9CA3AF', marginBottom: 28, fontWeight: '500' },
});
