import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock3, Heart, Package, TrendingUp, Users } from 'lucide-react-native';

import { Progress } from '@/components/ui/progress';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import { getMyPageApiErrorMessage, getMyPageParticipatedFundings, type MyPageParticipatedFunding } from '@/features/mypage/api';
import {
  FundingProject,
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
} from '@/constants/data';

type MyFundingProject = FundingProject & {
  myAmount: number;
  myDate: string;
  orderId?: number;
  canViewDelivery?: boolean;
  hasTrackingNumber?: boolean;
};

const PAGE_SIZE = 3;

function formatManwon(amount: number) {
  return `${Math.round(amount / 10000).toLocaleString()}만원`;
}

function isSuccessProject(project: FundingProject) {
  const label = getFundingStatusLabel(project.status);
  return label.includes('성공') || label.includes('달성');
}

function formatFundingDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeSupporterCount(...values: (number | string | null | undefined)[]) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const count = Number(value);
    if (Number.isFinite(count) && count >= 0) return Math.trunc(count);
  }
  return 0;
}

function mapParticipatedFundingToProject(item: MyPageParticipatedFunding): MyFundingProject {
  const goalAmount = item.goalAmount || 1;
  return {
    id: item.fundingId,
    title: item.projectName || item.drinkName,
    brewery: item.breweryName || '',
    location: '',
    category: item.ingredients || '',
    shortTitle: item.drinkName || item.projectName,
    shortDescription: item.ingredients || '',
    image: item.thumbnailUrl || '',
    goalAmount,
    currentAmount: item.currentAmount ?? 0,
    backers: normalizeSupporterCount(
      item.supporterCount,
      item.participantCount,
      item.supporter_count,
      item.participant_count,
      item.supporters,
      item.backers
    ),
    daysLeft: 0,
    status: item.fundingStatus as FundingProject['status'],
    alcoholContent: item.abv ? `${item.abv}%` : undefined,
    mainIngredients: item.ingredients || undefined,
    myAmount: item.myAmount ?? 0,
    myDate: formatFundingDate(item.participatedAt),
    orderId: item.orderId,
    canViewDelivery: item.canViewDelivery ?? item.fundingStatus === 'SUCCESS',
    hasTrackingNumber: item.hasTrackingNumber ?? false,
  };
}

export default function FundedProjectsScreen() {
  const insets = useSafeAreaInsets();
  const { projects, participatedFundings } = useFunding();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const [serverFundings, setServerFundings] = useState<MyFundingProject[]>([]);
  const [serverLoadAttempted, setServerLoadAttempted] = useState(false);
  const [page, setPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getMyPageParticipatedFundings()
        .then((fundings) => {
          if (!active) return;
          setServerFundings(fundings.map(mapParticipatedFundingToProject));
          setServerLoadAttempted(true);
        })
        .catch((error) => {
          if (!active) return;
          setServerFundings([]);
          setServerLoadAttempted(true);
          console.warn(getMyPageApiErrorMessage(error, '참여 펀딩 목록을 불러오지 못했습니다.'));
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const myFundings = useMemo<MyFundingProject[]>(() => {
    if (serverLoadAttempted) return serverFundings;
    const realFundings = participatedFundings
      .map((participation) => {
        const project = projects.find((item) => item.id === participation.fundingId);
        if (!project) return null;
        return {
          ...project,
          myAmount: participation.amount,
          myDate: participation.date,
        };
      })
      .filter((item): item is MyFundingProject => Boolean(item));
    return realFundings;
  }, [participatedFundings, projects, serverFundings, serverLoadAttempted]);

  const totalAmount = myFundings.reduce((sum, item) => sum + item.myAmount, 0);
  const activeCount = myFundings.filter((project) => !isCompletedFundingStatus(project.status)).length;
  const doneCount = myFundings.filter((project) => isCompletedFundingStatus(project.status)).length;
  const totalPages = Math.max(1, Math.ceil(myFundings.length / PAGE_SIZE));
  const paginatedFundings = myFundings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const loadingFundings = !serverLoadAttempted && myFundings.length === 0;

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.75} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>참여 펀딩</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIconBox}>
              <TrendingUp size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.summaryCaption}>나의 펀딩 현황</Text>
              <Text style={styles.summaryTitle}>총 {myFundings.length}개 프로젝트 참여</Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <SummaryStat label="총 참여금액" value={formatManwon(totalAmount)} />
            <SummaryStat label="진행 중" value={`${activeCount}개`} bordered />
            <SummaryStat label="완료" value={`${doneCount}개`} />
          </View>
        </View>

        <View style={styles.list}>
          {paginatedFundings.map((project) => (
            <FundingParticipationCard
              key={project.id}
              project={project}
              favorite={isFavoriteFunding(project.id)}
              onFavoritePress={() => toggleFavoriteFunding(project.id)}
            />
          ))}
        </View>

        {loadingFundings && (
          <View style={styles.emptyBox}>
            <TrendingUp size={42} color="#D1D5DB" />
            <Text style={styles.emptyText}>참여 펀딩 목록을 불러오는 중입니다</Text>
          </View>
        )}

        {!loadingFundings && myFundings.length === 0 && (
          <View style={styles.emptyBox}>
            <TrendingUp size={42} color="#D1D5DB" />
            <Text style={styles.emptyText}>아직 참여한 펀딩이 없습니다</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/funding' as any)}>
              <Text style={styles.emptyButtonText}>펀딩 둘러보기</Text>
            </TouchableOpacity>
          </View>
        )}

        {myFundings.length > PAGE_SIZE && (
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
            <Text style={styles.pageSummary}>총 {myFundings.length}개 펀딩 · {page} / {totalPages} 페이지</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryStat({ label, value, bordered }: { label: string; value: string; bordered?: boolean }) {
  return (
    <View style={[styles.summaryStat, bordered && styles.summaryStatBorder]}>
      <Text style={styles.summaryStatLabel}>{label}</Text>
      <Text style={styles.summaryStatValue}>{value}</Text>
    </View>
  );
}

function FundingParticipationCard({
  project,
  favorite,
  onFavoritePress,
}: {
  project: MyFundingProject;
  favorite: boolean;
  onFavoritePress: () => void;
}) {
  const progress = Math.min(Math.round((project.currentAmount / project.goalAmount) * 100), 100);
  const completed = isCompletedFundingStatus(project.status);
  const statusLabel = getFundingStatusLabel(project.status);
  const showDeliveryButton =
    Boolean(project.orderId) && (project.canViewDelivery ?? (completed && isSuccessProject(project)));

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/funding/${project.id}` as any)}
    >
      <View style={styles.cardBody}>
        <View style={styles.thumbnailWrap}>
          <Image source={getFundingProjectImageSource(project)} style={styles.thumbnail} />
          <TouchableOpacity
            style={styles.heartButton}
            activeOpacity={0.8}
            onPress={(event) => {
              event.stopPropagation();
              onFavoritePress();
            }}
          >
            <Heart size={15} color="#FFFFFF" fill={favorite ? '#FFFFFF' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.metaRow}>
            <Text style={styles.breweryName} numberOfLines={1}>
              {project.brewery}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {getFundingMainIngredientLabel(project)}
              </Text>
            </View>
            <View style={[styles.statusBadge, completed ? styles.statusDone : styles.statusActive]}>
              <Text style={[styles.statusText, completed ? styles.statusDoneText : styles.statusActiveText]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <Text style={styles.projectTitle} numberOfLines={2}>
            {project.title}
          </Text>

          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>{progress}%</Text>
            <Text style={styles.daysText}>{completed ? '0일 남음' : `${project.daysLeft}일 남음`}</Text>
          </View>
          <Progress value={progress} style={styles.progressBar} indicatorStyle={styles.progressIndicator} />

          <View style={styles.myInfoRow}>
            <View style={styles.myInfoItem}>
              <Users size={11} color="#9CA3AF" />
              <Text style={styles.myInfoText}>{project.backers}명 참여</Text>
            </View>
            <View style={styles.myInfoItem}>
              <Clock3 size={11} color="#9CA3AF" />
              <Text style={styles.myInfoText}>{project.myDate}</Text>
            </View>
            <Text style={styles.amountText} numberOfLines={1}>{project.myAmount.toLocaleString()}원</Text>
          </View>

          {showDeliveryButton && (
            <TouchableOpacity
              style={styles.deliveryButton}
              activeOpacity={0.85}
              onPress={(event) => {
                event.stopPropagation();
                router.push(`/funding/order/${project.orderId ?? project.id}` as any);
              }}
            >
              <Package size={13} color="#FFFFFF" />
              <Text style={styles.deliveryText}>배송 내역</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    height: 104,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 21, fontWeight: '900', color: '#111827' },
  content: { paddingHorizontal: 24, paddingTop: 18 },
  summaryCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCaption: { fontSize: 11, fontWeight: '800', color: '#D1D5DB', marginBottom: 2 },
  summaryTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  summaryStats: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  summaryStatBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  summaryStatLabel: { fontSize: 10, fontWeight: '800', color: '#D1D5DB' },
  summaryStatValue: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  list: { gap: 13 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    padding: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardBody: { flexDirection: 'row', gap: 10 },
  thumbnailWrap: {
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartButton: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1, minWidth: 0, justifyContent: 'space-between' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  breweryName: { maxWidth: 58, fontSize: 10, fontWeight: '900', color: '#374151' },
  categoryBadge: {
    maxWidth: 58,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  categoryText: { fontSize: 9, fontWeight: '900', color: '#4B5563' },
  statusBadge: { marginLeft: 'auto', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 999 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusDone: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 9, fontWeight: '900' },
  statusActiveText: { color: '#059669' },
  statusDoneText: { color: '#4B5563' },
  projectTitle: { fontSize: 14, fontWeight: '900', color: '#000000', lineHeight: 19, marginBottom: 7 },
  progressHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 22, fontWeight: '900', color: '#000000', letterSpacing: 0 },
  daysText: { fontSize: 10, fontWeight: '900', color: '#000000', marginBottom: 3 },
  progressBar: { height: 5, borderRadius: 4, backgroundColor: '#F1F2F4' },
  progressIndicator: { backgroundColor: '#050505' },
  myInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 9,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  myInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 3, minWidth: 0, flexShrink: 1 },
  myInfoText: { fontSize: 10, fontWeight: '700', color: '#8B95A1', flexShrink: 1 },
  amountText: { marginLeft: 'auto', maxWidth: 62, textAlign: 'right', fontSize: 11, fontWeight: '900', color: '#111827' },
  deliveryButton: {
    height: 34,
    borderRadius: 11,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  deliveryText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF' },
  paginationWrap: { alignItems: 'center', paddingTop: 20, paddingBottom: 10, gap: 12 },
  paginationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pageControlButton: {
    minWidth: 48,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pageControlDisabled: { backgroundColor: '#F3F4F6', borderColor: '#F3F4F6' },
  pageControlText: { fontSize: 13, fontWeight: '900', color: '#111827' },
  pageControlTextDisabled: { color: '#A1AAB8' },
  pageNumberButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pageNumberText: { fontSize: 14, fontWeight: '900', color: '#374151' },
  pageNumberTextActive: { color: '#FFFFFF' },
  pageSummary: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  emptyBox: { alignItems: 'center', paddingVertical: 72, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  emptyButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#111827' },
  emptyButtonText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
});

