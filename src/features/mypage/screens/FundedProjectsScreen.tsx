import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock3, Heart, Package, TrendingUp, Users } from 'lucide-react-native';

import { Progress } from '@/components/ui/progress';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import {
  FundingProject,
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
} from '@/constants/data';

type MyFundingProject = FundingProject & {
  myAmount: number;
  myDate: string;
};

const PAGE_SIZE = 3;
const DELIVERY_ORDER_PROJECT_ID = 5;

function formatManwon(amount: number) {
  return `${Math.round(amount / 10000).toLocaleString()}만원`;
}

function isSuccessProject(project: FundingProject) {
  const label = getFundingStatusLabel(project.status);
  return label.includes('성공') || label.includes('달성');
}

export default function FundedProjectsScreen() {
  const insets = useSafeAreaInsets();
  const { projects, participatedFundings } = useFunding();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const [page, setPage] = useState(1);

  const myFundings = useMemo<MyFundingProject[]>(() => {
    return participatedFundings
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
  }, [participatedFundings, projects]);

  const totalAmount = participatedFundings.reduce((sum, item) => sum + item.amount, 0);
  const activeCount = myFundings.filter((project) => !isCompletedFundingStatus(project.status)).length;
  const doneCount = myFundings.filter((project) => isCompletedFundingStatus(project.status)).length;
  const totalPages = Math.max(1, Math.ceil(myFundings.length / PAGE_SIZE));
  const paginatedFundings = myFundings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              <TrendingUp size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.summaryCaption}>나의 펀딩 현황</Text>
              <Text style={styles.summaryTitle}>총 {participatedFundings.length}개 프로젝트 참여</Text>
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

        {myFundings.length === 0 && (
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
  const showDeliveryButton = project.id === DELIVERY_ORDER_PROJECT_ID && isSuccessProject(project);

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
            <Heart size={18} color="#FFFFFF" fill={favorite ? '#FFFFFF' : 'transparent'} />
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
              <Users size={13} color="#9CA3AF" />
              <Text style={styles.myInfoText}>{project.backers}명 참여</Text>
            </View>
            <View style={styles.myInfoItem}>
              <Clock3 size={13} color="#9CA3AF" />
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
                router.push(`/funding/order/${project.id}` as any);
              }}
            >
              <Package size={15} color="#FFFFFF" />
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
  content: { paddingHorizontal: 16, paddingTop: 14 },
  summaryCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  summaryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCaption: { fontSize: 13, fontWeight: '700', color: '#D1D5DB', marginBottom: 2 },
  summaryTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  summaryStats: {
    minHeight: 82,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 7 },
  summaryStatBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  summaryStatLabel: { fontSize: 12, fontWeight: '800', color: '#D1D5DB' },
  summaryStatValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  list: { gap: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    padding: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardBody: { flexDirection: 'row', gap: 12 },
  thumbnailWrap: {
    width: 104,
    height: 104,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartButton: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1, minWidth: 0, justifyContent: 'space-between' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 9 },
  breweryName: { maxWidth: 62, fontSize: 11, fontWeight: '900', color: '#374151' },
  categoryBadge: {
    maxWidth: 64,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  categoryText: { fontSize: 10, fontWeight: '900', color: '#4B5563' },
  statusBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusDone: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 10, fontWeight: '900' },
  statusActiveText: { color: '#059669' },
  statusDoneText: { color: '#4B5563' },
  projectTitle: { fontSize: 16, fontWeight: '900', color: '#000000', lineHeight: 22, marginBottom: 10 },
  progressHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 28, fontWeight: '900', color: '#000000', letterSpacing: 0 },
  daysText: { fontSize: 12, fontWeight: '900', color: '#000000', marginBottom: 4 },
  progressBar: { height: 7, borderRadius: 4, backgroundColor: '#F1F2F4' },
  progressIndicator: { backgroundColor: '#050505' },
  myInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  myInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 3, minWidth: 0, flexShrink: 1 },
  myInfoText: { fontSize: 11, fontWeight: '700', color: '#8B95A1', flexShrink: 1 },
  amountText: { marginLeft: 'auto', maxWidth: 66, textAlign: 'right', fontSize: 12, fontWeight: '900', color: '#111827' },
  deliveryButton: {
    height: 42,
    borderRadius: 11,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
  },
  deliveryText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  paginationWrap: { alignItems: 'center', paddingTop: 22, paddingBottom: 10, gap: 14 },
  paginationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  pageControlButton: {
    minWidth: 58,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  pageControlDisabled: { backgroundColor: '#F3F4F6', borderColor: '#F3F4F6' },
  pageControlText: { fontSize: 15, fontWeight: '900', color: '#111827' },
  pageControlTextDisabled: { color: '#A1AAB8' },
  pageNumberButton: {
    width: 50,
    height: 50,
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
  pageNumberText: { fontSize: 16, fontWeight: '900', color: '#374151' },
  pageNumberTextActive: { color: '#FFFFFF' },
  pageSummary: { fontSize: 13, fontWeight: '800', color: '#9CA3AF' },
  emptyBox: { alignItems: 'center', paddingVertical: 72, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  emptyButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#111827' },
  emptyButtonText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
});
