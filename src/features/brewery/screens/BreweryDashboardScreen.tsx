import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { 
  TrendingUp, 
  Users, 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ChevronLeft,
  ChevronRight, 
  Factory, 
  Target, 
  X,
  Camera,
  Send,
  Truck,
  Lock,
  CreditCard,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInUp } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  getFundingProjectImageSource,
  getFundingStatusTone,
  getFundingStatusLabel,
  isCompletedFundingStatus,
  isSupportableFundingStatus,
  type FundingProject,
  type ProjectStatus,
} from '@/constants/data';
import {
  getBreweryApiErrorMessage,
  getBreweryDashboardBasicInfo,
  getBreweryDashboardFundings,
  getBreweryDashboardNotifications,
  getBreweryFundingDelivery,
  getBreweryFundingSummary,
  updateBreweryFundingDelivery,
  type BreweryDashboardBasicInfo,
  type BreweryDashboardNotification,
  type BreweryFundingSummary,
} from '@/features/brewery/api';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import type { AppNotification } from '@/features/notifications/data';

const FUNDINGS_PER_PAGE = 3;

// TODO: Remove after checking the real completed funding response.
const TEMP_COMPLETED_FUNDING_FOR_DELIVERY_UI: FundingProject = {
  id: 990001,
  title: 'Delivery Test Makgeolli',
  brewery: 'Coco Brewery',
  breweryLogo: 'B',
  location: 'Goyang-si, Gyeonggi-do',
  category: 'Makgeolli',
  shortDescription: 'Temporary completed funding for delivery UI testing.',
  image: '',
  localImage: require('../../../../newpicutre/funding2.jpg'),
  isMine: true,
  goalAmount: 3000000,
  currentAmount: 3150000,
  backers: 24,
  daysLeft: 0,
  status: 'completed' as ProjectStatus,
  startDate: '2026. 04. 01',
  endDate: '2026. 04. 30',
  pricePerBottle: 12000,
  bottleSize: '500ml',
  alcoholContent: '6%',
  rewardItems: ['Delivery test reward'],
};

const mapDashboardFundingToProject = (item: {
  fundingId: number;
  title: string;
  breweryName: string;
  thumbnailUrl: string | null;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  status: string;
  remainingDays: number;
  endDate: string;
}): FundingProject => ({
  id: item.fundingId,
  title: item.title,
  brewery: item.breweryName,
  breweryLogo: 'B',
  location: '',
  category: '',
  image: item.thumbnailUrl || '',
  isMine: true,
  goalAmount: item.targetAmount || 1,
  currentAmount: item.currentAmount || 0,
  backers: 0,
  daysLeft: item.remainingDays || 0,
  status: item.status as ProjectStatus,
  endDate: item.endDate,
});

const mapDashboardNotificationType = (type: string): AppNotification['type'] => {
  switch (type) {
    case 'FUNDING_SUCCESS':
      return 'funding_success';
    case 'FUNDING_ENDED':
      return 'funding_end';
    case 'FUNDING_CREATED':
      return 'funding_new';
    case 'FUNDING_PROGRESS':
      return 'funding_progress';
    case 'RECIPE_POPULAR':
      return 'recipe_popular';
    default:
      return 'funding_progress';
  }
};

const mapDashboardNotification = (notification: BreweryDashboardNotification): AppNotification => ({
  id: notification.notificationId,
  type: mapDashboardNotificationType(notification.type),
  title: notification.title,
  content: notification.content,
  timestamp: notification.createdAt,
  read: notification.isRead,
  link: notification.linkUrl || undefined,
  image: notification.imageUrl ? { uri: notification.imageUrl } : undefined,
  fundingId: notification.fundingId ?? null,
  recipeId: notification.recipeId ?? null,
  progressThreshold: notification.progressThreshold ?? null,
  metadata: notification.metadata ?? null,
});

const manufacturingStages = ["원료준비", "원료 가공", "발효", "제성", "병입"];

type JournalEntryState = {
  content: string;
  images: string[];
  isCompleted: boolean;
};

const statusOptions: ProjectStatus[] = [
  "작성 중",
  "심사 중",
  "심사 반려",
  "펀딩 예정",
  "진행 중",
  "목표 달성",
  "펀딩 성공",
  "펀딩 실패",
  "제작 중",
  "배송 중",
  "완료",
];

function getDashboardStatusBadgeStyle(tone: ReturnType<typeof getFundingStatusTone>) {
  if (tone === 'success') return styles.statusBadgeSuccess;
  if (tone === 'failed') return styles.statusBadgeFailed;
  if (tone === 'ended') return styles.statusBadgeEnded;
  if (tone === 'reviewing') return styles.statusBadgeReviewing;
  if (tone === 'neutral') return styles.statusBadgeNeutral;
  return styles.statusBadgeActive;
}

function getDashboardStatusTextStyle(tone: ReturnType<typeof getFundingStatusTone>) {
  if (tone === 'success') return styles.statusBadgeTxtSuccess;
  if (tone === 'failed') return styles.statusBadgeTxtFailed;
  if (tone === 'ended') return styles.statusBadgeTxtEnded;
  if (tone === 'reviewing') return styles.statusBadgeTxtReviewing;
  if (tone === 'neutral') return styles.statusBadgeTxtNeutral;
  return styles.statusBadgeTxtActive;
}

export default function BreweryDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { projects, mergeProjects, updateProjectStatus } = useFunding();
  const projectsRef = useRef(projects);
  const [fundingFilter, setFundingFilter] = useState<"active" | "completed">("active");
  const [fundingPage, setFundingPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedStatusProject, setSelectedStatusProject] = useState<number | null>(null);
  const [selectedDeliveryProject, setSelectedDeliveryProject] = useState<FundingProject | null>(null);
  const [deliveryCourier, setDeliveryCourier] = useState('');
  const [deliveryTrackingNumber, setDeliveryTrackingNumber] = useState('');
  const [deliveryInfoByProjectId, setDeliveryInfoByProjectId] = useState<Record<number, { courier: string; trackingNumber: string }>>({});
  const [isDeliveryEditing, setIsDeliveryEditing] = useState(false);
  const [isDeliveryLoading, setIsDeliveryLoading] = useState(false);
  const [isDeliverySaving, setIsDeliverySaving] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [isInsightPaymentVisible, setIsInsightPaymentVisible] = useState(false);
  const [dashboardBasicInfo, setDashboardBasicInfo] = useState<BreweryDashboardBasicInfo | null>(null);
  const [fundingSummary, setFundingSummary] = useState<BreweryFundingSummary | null>(null);
  const [apiFundings, setApiFundings] = useState<Record<'active' | 'completed', FundingProject[]>>({ active: [], completed: [] });
  const [dashboardNotifications, setDashboardNotifications] = useState<AppNotification[]>([]);
  const [selectedJournalStage, setSelectedJournalStage] = useState(manufacturingStages[0]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [journalData, setJournalData] = useState<Record<string, JournalEntryState>>({
    원료준비: { content: "신선한 쌀 100kg 입고 완료\n품질 검수 이상 없음", images: [], isCompleted: true },
    "원료 가공": { content: "쌀 세척 및 침지 완료\n12시간 침지 후 수분 함량 확인", images: [], isCompleted: true },
    발효: { content: "", images: [], isCompleted: false },
    제성: { content: "", images: [], isCompleted: false },
    병입: { content: "", images: [], isCompleted: false },
  });

  const currentUserId = user?.id;
  const currentUserType = user?.type;
  const apiDashboardProjects = useMemo(
    () => [...apiFundings.active, ...apiFundings.completed],
    [apiFundings.active, apiFundings.completed],
  );
  const contextOwnProjects = useMemo(
    () => projects.filter((project) => isFundingProjectOwnedByBrewery(user, project)),
    [projects, user],
  );
  const dashboardProjects = apiDashboardProjects.length > 0
    ? apiDashboardProjects
    : contextOwnProjects;
  const locallyFilteredFundings = useMemo(
    () => fundingFilter === "active"
      ? dashboardProjects.filter((project) => isSupportableFundingStatus(project.status) || project.status === "심사 중" || project.status === "펀딩 예정")
      : dashboardProjects.filter((project) => isCompletedFundingStatus(project.status)),
    [dashboardProjects, fundingFilter],
  );
  const filteredFundings = useMemo(
    () => fundingFilter === "completed"
      ? [...(apiFundings.completed.length > 0 ? apiFundings.completed : locallyFilteredFundings), TEMP_COMPLETED_FUNDING_FOR_DELIVERY_UI]
      : apiFundings.active.length > 0
        ? apiFundings.active
        : locallyFilteredFundings,
    [apiFundings.active, apiFundings.completed, fundingFilter, locallyFilteredFundings],
  );
  const fundingPageCount = Math.max(1, Math.ceil(filteredFundings.length / FUNDINGS_PER_PAGE));
  const visibleFundings = useMemo(
    () => filteredFundings.slice(fundingPage * FUNDINGS_PER_PAGE, fundingPage * FUNDINGS_PER_PAGE + FUNDINGS_PER_PAGE),
    [filteredFundings, fundingPage],
  );
  const canGoPrevFundingPage = fundingPage > 0;
  const canGoNextFundingPage = fundingPage < fundingPageCount - 1;
  const listedActiveFundingCount = apiFundings.active.length;
  const listedTotalFundingCount = apiDashboardProjects.length;
  const localActiveFundingCount = dashboardProjects.filter((project) => isSupportableFundingStatus(project.status)).length;
  const activeFundingCount = Math.max(fundingSummary?.activeFundingCount ?? 0, listedActiveFundingCount, localActiveFundingCount);
  const totalFundingCount = Math.max(fundingSummary?.totalFundingCount ?? 0, listedTotalFundingCount, dashboardProjects.length);
  const totalBackers = fundingSummary?.totalParticipantCount ?? dashboardProjects.reduce((sum, project) => sum + project.backers, 0);
  const selectedStatusFunding = selectedStatusProject
    ? projects.find((project) => project.id === selectedStatusProject)
    : null;
  const currentJournalEntry = journalData[selectedJournalStage];
  const selectedDeliveryInfo = selectedDeliveryProject
    ? deliveryInfoByProjectId[selectedDeliveryProject.id]
    : null;

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    if (!currentUserId || currentUserType !== 'brewery') return;

    let mounted = true;

    Promise.allSettled([
      getBreweryDashboardBasicInfo(),
      getBreweryFundingSummary(),
      getBreweryDashboardFundings({ status: 'active', page: 0, size: 50 }),
      getBreweryDashboardFundings({ status: 'completed', page: 0, size: 50 }),
      getBreweryDashboardNotifications(),
    ]).then(([basicInfoResult, summaryResult, activeFundingsResult, completedFundingsResult, notificationsResult]) => {
      if (!mounted) return;

      if (basicInfoResult.status === 'fulfilled') {
        setDashboardBasicInfo(basicInfoResult.value);
      } else {
        console.warn(getBreweryApiErrorMessage(basicInfoResult.reason, '양조장 기본 정보를 불러오지 못했습니다.'));
      }

      if (summaryResult.status === 'fulfilled') {
        setFundingSummary(summaryResult.value);
      } else {
        console.warn(getBreweryApiErrorMessage(summaryResult.reason, '펀딩 요약을 불러오지 못했습니다.'));
      }

      if (activeFundingsResult.status === 'fulfilled' || completedFundingsResult.status === 'fulfilled') {
        const active =
          activeFundingsResult.status === 'fulfilled'
            ? (activeFundingsResult.value.content || activeFundingsResult.value.data || []).map(mapDashboardFundingToProject)
            : [];
        const completed =
          completedFundingsResult.status === 'fulfilled'
            ? (completedFundingsResult.value.content || completedFundingsResult.value.data || []).map(mapDashboardFundingToProject)
            : [];
        setApiFundings({ active, completed });
        mergeProjects([...active, ...completed]);
      }

      if (notificationsResult.status === 'fulfilled') {
        const notifications = notificationsResult.value.notifications || notificationsResult.value.content || [];
        setDashboardNotifications(notifications.map(mapDashboardNotification).filter((notification) => !notification.read));
      } else {
        console.warn(getBreweryApiErrorMessage(notificationsResult.reason, '알림 목록을 불러오지 못했습니다.'));
      }
    });

    return () => {
      mounted = false;
    };
  }, [currentUserId, currentUserType, mergeProjects]);

  useEffect(() => {
    setFundingPage(0);
  }, [fundingFilter]);

  useEffect(() => {
    setFundingPage((currentPage) => Math.min(currentPage, fundingPageCount - 1));
  }, [fundingPageCount]);

  const handleJournalContentChange = (content: string) => {
    setJournalData((prev) => ({
      ...prev,
      [selectedJournalStage]: {
        ...prev[selectedJournalStage],
        content,
      },
    }));
  };

  const handleJournalSubmit = () => {
    if (!currentJournalEntry.content.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    setJournalData((prev) => ({
      ...prev,
      [selectedJournalStage]: {
        ...prev[selectedJournalStage],
        isCompleted: true,
      },
    }));
    setIsEditMode(false);
    Alert.alert("완료", `${selectedJournalStage} 단계의 양조일지가 저장되었습니다.`);
  };

  const handleMockImageAdd = () => {
    if (currentJournalEntry.images.length >= 3) {
      Alert.alert("알림", "사진은 최대 3장까지 첨부할 수 있습니다.");
      return;
    }

    setJournalData((prev) => ({
      ...prev,
      [selectedJournalStage]: {
        ...prev[selectedJournalStage],
        images: [...prev[selectedJournalStage].images, `mock-image-${Date.now()}`],
      },
    }));
  };

  const handleImageRemove = (index: number) => {
    setJournalData((prev) => ({
      ...prev,
      [selectedJournalStage]: {
        ...prev[selectedJournalStage],
        images: prev[selectedJournalStage].images.filter((_, imageIndex) => imageIndex !== index),
      },
    }));
  };

  const handleStatusChange = (projectId: number, status: ProjectStatus) => {
    updateProjectStatus(projectId, status);
    setSelectedStatusProject(null);
    Alert.alert("완료", `프로젝트 상태가 '${status}'로 변경되었습니다.`);
  };

  const openDeliveryModal = async (project: FundingProject) => {
    const savedInfo = deliveryInfoByProjectId[project.id];
    setSelectedDeliveryProject(project);
    setDeliveryCourier(savedInfo?.courier || '');
    setDeliveryTrackingNumber(savedInfo?.trackingNumber || '');
    setIsDeliveryEditing(!savedInfo);

    setDeliveryMessage('');
    if (project.id === TEMP_COMPLETED_FUNDING_FOR_DELIVERY_UI.id) return;

    setIsDeliveryLoading(true);
    try {
      const delivery = await getBreweryFundingDelivery(project.id);
      const hasDeliveryInfo = Boolean(delivery.courier && delivery.trackingNumber);

      if (hasDeliveryInfo) {
        const nextInfo = {
          courier: delivery.courier || '',
          trackingNumber: delivery.trackingNumber || '',
        };
        setDeliveryInfoByProjectId((prev) => ({
          ...prev,
          [project.id]: nextInfo,
        }));
        setDeliveryCourier(nextInfo.courier);
        setDeliveryTrackingNumber(nextInfo.trackingNumber);
        setIsDeliveryEditing(false);
      } else {
        setDeliveryCourier('');
        setDeliveryTrackingNumber('');
        setIsDeliveryEditing(true);
      }
    } catch (error) {
      console.warn(getBreweryApiErrorMessage(error, 'Failed to load delivery information.'));
      setDeliveryMessage('배송 정보를 불러오지 못했습니다.');
    } finally {
      setIsDeliveryLoading(false);
    }
  };

  const closeDeliveryModal = () => {
    setSelectedDeliveryProject(null);
    setDeliveryCourier('');
    setDeliveryTrackingNumber('');
    setIsDeliveryEditing(false);
    setIsDeliveryLoading(false);
    setIsDeliverySaving(false);
    setDeliveryMessage('');
  };

  const handleDeliverySubmit = async () => {
    if (!selectedDeliveryProject) return;
    if (!deliveryCourier.trim() || !deliveryTrackingNumber.trim()) {
      Alert.alert('알림', '택배사와 송장번호를 모두 입력해주세요.');
      return;
    }

    const nextInfo = {
      courier: deliveryCourier.trim(),
      trackingNumber: deliveryTrackingNumber.trim(),
    };

    if (selectedDeliveryProject.id === TEMP_COMPLETED_FUNDING_FOR_DELIVERY_UI.id) {
      setDeliveryInfoByProjectId((prev) => ({
        ...prev,
        [selectedDeliveryProject.id]: nextInfo,
      }));
      setIsDeliveryEditing(false);
      return;
    }

    setIsDeliverySaving(true);
    setDeliveryMessage('');
    try {
      const savedDelivery = await updateBreweryFundingDelivery(selectedDeliveryProject.id, nextInfo);
      const savedInfo = {
        courier: savedDelivery.courier || nextInfo.courier,
        trackingNumber: savedDelivery.trackingNumber || nextInfo.trackingNumber,
      };
      setDeliveryInfoByProjectId((prev) => ({
        ...prev,
        [selectedDeliveryProject.id]: savedInfo,
      }));
      setDeliveryCourier(savedInfo.courier);
      setDeliveryTrackingNumber(savedInfo.trackingNumber);
      setIsDeliveryEditing(false);
    } catch (error) {
      const message = getBreweryApiErrorMessage(error, '배송 정보를 저장하지 못했습니다.');
      setDeliveryMessage(message);
      Alert.alert('알림', message);
    } finally {
      setIsDeliverySaving(false);
    }
  };

  if (!user || user.type !== "brewery") {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <View style={styles.errorBox}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>접근 권한 없음</Text>
          <Text style={styles.errorDesc}>양조장 계정만 접근할 수 있는 페이지입니다.</Text>
          <Button label="홈으로 돌아가기" onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    );
  }

  if (!user.isBreweryVerified) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <View style={styles.errorBox}>
          <Clock size={48} color="#F59E0B" />
          <Text style={styles.errorTitle}>인증이 필요합니다</Text>
          <Text style={styles.errorDesc}>프로젝트를 생성하려면 양조장 인증을 먼저 완료해주세요.</Text>
          <Button label="인증하러 가기" onPress={() => router.push('/brewery/verification' as any)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)/mypage' as any)}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="마이페이지로 돌아가기"
            >
              <ChevronLeft size={24} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>양조장 대시보드</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={styles.headerIcon}>
            <Bell size={22} color="#000" />
            {dashboardNotifications.length > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Section 0: 양조장 기본 정보 */}
        <View style={styles.sectionGray}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>양조장 기본 정보</Text>
            <Text style={styles.sectionSubtitle}>양조장 정보를 관리하세요</Text>
          </View>

          <TouchableOpacity 
            style={styles.infoCard} 
            onPress={() => router.push('/brewery/profile' as any)}
          >
            <View style={styles.row}>
              <View style={styles.infoIconBox}>
                {user.breweryProfileImage || dashboardBasicInfo?.profileImageUrl ? (
                  <Image source={{ uri: user.breweryProfileImage || dashboardBasicInfo?.profileImageUrl || '' }} style={styles.infoIconImage} />
                ) : (
                  <Factory size={24} color="#FFF" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoName}>{dashboardBasicInfo?.breweryName || user.breweryName || "양조장 이름"}</Text>
                <Text style={styles.infoLoc}>
                  {[dashboardBasicInfo?.address || user.breweryLocation, dashboardBasicInfo?.addressDetail || user.breweryLocationDetail].filter(Boolean).join(' ') || "양조장 위치"}
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 1: 내 펀딩 현황 */}
        <View style={styles.sectionWhite}>
          <View style={styles.fundingHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>내 펀딩 현황</Text>
              <Text style={styles.sectionSubtitle}>진행 중인 프로젝트를 관리하세요</Text>
            </View>
            <View style={styles.fundingFilterBtns}>
              <TouchableOpacity 
                style={[styles.filterBtn, fundingFilter === 'active' && styles.filterBtnActive]}
                onPress={() => setFundingFilter('active')}
              >
                <Text style={[styles.filterBtnTxt, fundingFilter === 'active' && styles.filterBtnTxtActive]}>진행중</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterBtn, fundingFilter === 'completed' && styles.filterBtnActive]}
                onPress={() => setFundingFilter('completed')}
              >
                <Text style={[styles.filterBtnTxt, fundingFilter === 'completed' && styles.filterBtnTxtActive]}>종료됨</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
               <View style={styles.statsIconCircle}><TrendingUp size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>{activeFundingCount}</Text>
               <Text style={styles.statsLab}>진행 중</Text>
            </View>
            <View style={styles.statsCard}>
               <View style={styles.statsIconCircle}><Target size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>{totalFundingCount}</Text>
               <Text style={styles.statsLab}>전체 펀딩 수</Text>
            </View>
            <View style={styles.statsCard}>
               <View style={styles.statsIconCircle}><Users size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>{totalBackers.toLocaleString()}</Text>
               <Text style={styles.statsLab}>총 참여자</Text>
            </View>
          </View>

          {/* Funding List */}
          <View style={styles.fundingList}>
            {visibleFundings.map((funding) => {
              const progress = funding.goalAmount > 0 ? (funding.currentAmount / funding.goalAmount) * 100 : 0;
              const progressBarValue = Math.min(progress, 100);
              const progressLabel = Math.round(progress);
              const status = getFundingStatusLabel(funding.status);
              const statusTone = getFundingStatusTone(funding.status);
              const isDeliveryTarget = isCompletedFundingStatus(funding.status) || funding.id === TEMP_COMPLETED_FUNDING_FOR_DELIVERY_UI.id;

              return (
                <TouchableOpacity key={funding.id} style={styles.fundingItemCard} activeOpacity={0.8} onPress={() => router.push(`/funding/${funding.id}` as any)}>
                   <View style={styles.fundingRow}>
                      <Image source={getFundingProjectImageSource(funding)} style={styles.fundingThumb} />
                      <View style={{ flex: 1 }}>
                         <View style={styles.rowBetween}>
                            <Text style={styles.fundingBrewery}>{funding.brewery}</Text>
                            <TouchableOpacity
                              style={[styles.statusBadge, getDashboardStatusBadgeStyle(statusTone)]}
                              activeOpacity={0.85}
                              onPress={() => setSelectedStatusProject(funding.id)}
                            >
                               <Text style={[styles.statusBadgeTxt, getDashboardStatusTextStyle(statusTone)]}>{status}</Text>
                            </TouchableOpacity>
                         </View>
                         <Text style={styles.fundingTitle} numberOfLines={1}>{funding.title}</Text>
                         <View style={styles.rowBetweenBottom}>
                            <View style={styles.rowAlign}>
                               <Text style={styles.progressPct}>{progressLabel}%</Text>
                               <Text style={styles.progressAmt} numberOfLines={1}>{funding.currentAmount.toLocaleString()}원</Text>
                            </View>
                            <Text style={styles.dday}>{isDeliveryTarget ? '종료' : `D-${funding.daysLeft}`}</Text>
                         </View>
                         <Progress value={progressBarValue} style={styles.progressBar} />
                         {isDeliveryTarget ? (
                           <TouchableOpacity style={styles.stageUpdateBtnMini} onPress={() => openDeliveryModal(funding)}>
                             <Truck size={13} color="#FFF" />
                             <Text style={styles.stageUpdateBtnMiniText}>배송 관리</Text>
                           </TouchableOpacity>
                         ) : (
                           <TouchableOpacity style={styles.stageUpdateBtnMini} onPress={() => router.push(`/brewery/project/${funding.id}/journal` as any)}>
                             <Text style={styles.stageUpdateBtnMiniText}>양조일지 관리</Text>
                           </TouchableOpacity>
                         )}
                      </View>
                   </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {filteredFundings.length > FUNDINGS_PER_PAGE && (
            <View style={styles.fundingPagination}>
              <TouchableOpacity
                style={[styles.paginationButton, !canGoPrevFundingPage && styles.paginationButtonDisabled]}
                activeOpacity={0.85}
                disabled={!canGoPrevFundingPage}
                onPress={() => setFundingPage((page) => Math.max(0, page - 1))}
              >
                <ChevronLeft size={18} color={canGoPrevFundingPage ? '#111827' : '#D1D5DB'} />
              </TouchableOpacity>
              <Text style={styles.paginationText}>
                {fundingPage + 1} / {fundingPageCount}
              </Text>
              <TouchableOpacity
                style={[styles.paginationButton, !canGoNextFundingPage && styles.paginationButtonDisabled]}
                activeOpacity={0.85}
                disabled={!canGoNextFundingPage}
                onPress={() => setFundingPage((page) => Math.min(fundingPageCount - 1, page + 1))}
              >
                <ChevronRight size={18} color={canGoNextFundingPage ? '#111827' : '#D1D5DB'} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 2: Brewery Insight */}
        <View style={styles.sectionWhite}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>양조장 인사이트</Text>
            <Text style={styles.sectionSubtitle}>판매 흐름과 후원자 반응을 확인하세요</Text>
          </View>
          <TouchableOpacity
            style={styles.insightLockedCard}
            activeOpacity={0.9}
            onPress={() => setIsInsightPaymentVisible(true)}
          >
            <View style={styles.insightPreviewDim}>
              <View style={styles.insightPreviewRow}>
                <View style={styles.insightPreviewBlockLarge} />
                <View style={styles.insightPreviewStack}>
                  <View style={styles.insightPreviewLine} />
                  <View style={[styles.insightPreviewLine, styles.insightPreviewLineShort]} />
                  <View style={styles.insightPreviewBar} />
                </View>
              </View>
              <View style={styles.insightPreviewChart}>
                <View style={[styles.insightChartBar, { height: 30 }]} />
                <View style={[styles.insightChartBar, { height: 52 }]} />
                <View style={[styles.insightChartBar, { height: 40 }]} />
                <View style={[styles.insightChartBar, { height: 66 }]} />
              </View>
            </View>
            <View style={styles.insightLockOverlay}>
              <View style={styles.insightLockButton}>
                <Lock size={26} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 3: 알림 및 정보 */}
        <View style={styles.sectionGray}>
           <View style={styles.rowBetween}>
              <View>
                 <Text style={styles.sectionTitle}>알림 및 정보</Text>
                 <Text style={styles.sectionSubtitle}>새로운 알림</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/notifications' as any)}>
                 <View style={styles.moreLink}>
                   <Text style={styles.moreTxt}>전체보기</Text>
                   <ChevronRight size={14} color="#111" />
                 </View>
              </TouchableOpacity>
           </View>

           <View style={styles.notifBox}>
              {dashboardNotifications.length === 0 ? (
                <View style={styles.notifEmpty}>
                  <Bell size={28} color="#D1D5DB" />
                  <Text style={styles.notifEmptyText}>새로운 알림이 없습니다</Text>
                </View>
              ) : (
                dashboardNotifications.slice(0, 3).map((notification, i) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.simpleNotifItem,
                      i < Math.min(dashboardNotifications.length, 3) - 1 && styles.notifBorder,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => router.push('/notifications' as any)}
                  >
                    <Text style={styles.simpleNotifTitle} numberOfLines={1}>{notification.title}</Text>
                    <View style={styles.notifDot} />
                  </TouchableOpacity>
                ))
              )}
           </View>
        </View>
      </ScrollView>

      {/* Modal - Brewing Journal */}
      {selectedProject && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedProject(null)} />
          <Animated.View entering={SlideInUp} style={styles.modalSheet}>
             <View style={styles.modalHandle} />
             <View style={styles.modalHeader}>
                <View>
                   <Text style={styles.modalTitle}>양조일지</Text>
                   <Text style={styles.modalSub}>{selectedProject.project} - {selectedProject.stage}</Text>
                </View>
                <TouchableOpacity onPress={() => { setSelectedProject(null); setIsEditMode(false); }}><X size={24} color="#6B7280" /></TouchableOpacity>
             </View>

             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journalStageTabs}>
                {manufacturingStages.map((stage) => {
                  const isSelected = stage === selectedJournalStage;
                  const isCompleted = journalData[stage].isCompleted;
                  return (
                    <TouchableOpacity
                      key={stage}
                      style={[styles.journalStageTab, isSelected && styles.journalStageTabActive, isCompleted && !isSelected && styles.journalStageTabDone]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedJournalStage(stage);
                        setIsEditMode(false);
                      }}
                    >
                      <Text style={[styles.journalStageTabText, isSelected && styles.journalStageTabTextActive]}>{stage}</Text>
                      {isCompleted && !isSelected && <CheckCircle size={12} color="#6B7280" />}
                    </TouchableOpacity>
                  );
                })}
             </ScrollView>

             <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                {currentJournalEntry.isCompleted && !isEditMode ? (
                  <View style={styles.journalForm}>
                    <Text style={styles.listLab}>기록 내용</Text>
                    <View style={styles.journalReadBox}>
                      <Text style={styles.journalReadText}>{currentJournalEntry.content}</Text>
                    </View>
                    {currentJournalEntry.images.length > 0 && (
                      <>
                        <Text style={styles.listLab}>첨부 사진</Text>
                        <View style={styles.journalImageGrid}>
                          {currentJournalEntry.images.map((image, index) => (
                            <View key={`${image}-${index}`} style={styles.journalImageBox}>
                              <Camera size={20} color="#9CA3AF" />
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                    <TouchableOpacity style={styles.journalSubmitButton} onPress={() => setIsEditMode(true)}>
                      <Send size={16} color="#FFF" />
                      <Text style={styles.journalSubmitText}>양조일지 수정</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.journalForm}>
                    <Text style={styles.listLab}>양조일지 내용</Text>
                    <TextInput
                      style={styles.journalInput}
                      value={currentJournalEntry.content}
                      onChangeText={handleJournalContentChange}
                      placeholder="오늘의 양조 과정을 기록해주세요..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      textAlignVertical="top"
                    />
                    <Text style={styles.listLab}>사진 첨부 (최대 3장)</Text>
                    {currentJournalEntry.images.length < 3 && (
                      <TouchableOpacity style={styles.journalImageAdd} onPress={handleMockImageAdd}>
                        <Camera size={18} color="#6B7280" />
                        <Text style={styles.journalImageAddText}>사진 추가 ({currentJournalEntry.images.length}/3)</Text>
                      </TouchableOpacity>
                    )}
                    {currentJournalEntry.images.length > 0 && (
                      <View style={styles.journalImageGrid}>
                        {currentJournalEntry.images.map((image, index) => (
                          <View key={`${image}-${index}`} style={styles.journalImageBox}>
                            <Camera size={20} color="#9CA3AF" />
                            <TouchableOpacity style={styles.journalImageRemove} onPress={() => handleImageRemove(index)}>
                              <X size={12} color="#FFF" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    <TouchableOpacity style={styles.journalSubmitButton} onPress={handleJournalSubmit}>
                      <Send size={16} color="#FFF" />
                      <Text style={styles.journalSubmitText}>{currentJournalEntry.isCompleted ? "양조일지 수정 완료" : "양조일지 작성 완료"}</Text>
                    </TouchableOpacity>
                  </View>
                )}
             </ScrollView>
          </Animated.View>
        </View>
      )}

      {/* Modal - Delivery */}
      {selectedDeliveryProject && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeDeliveryModal} />
          <Animated.View entering={SlideInUp} style={[styles.modalSheet, styles.deliveryModalSheet]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>배송 관리</Text>
              </View>
              <TouchableOpacity onPress={closeDeliveryModal}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {isDeliveryLoading ? (
              <View style={styles.deliveryForm}>
                <Text style={styles.deliveryLoadingText}>배송 정보를 불러오는 중입니다.</Text>
              </View>
            ) : selectedDeliveryInfo && !isDeliveryEditing ? (
              <View style={styles.deliverySummary}>
                <View style={styles.deliverySummaryHeader}>
                  <View>
                    <Text style={styles.deliverySummaryTitle}>배송 정보</Text>
                    <Text style={styles.deliverySummaryDesc}>저장된 택배사와 송장번호입니다.</Text>
                  </View>
                  <TouchableOpacity style={styles.deliveryEditButton} onPress={() => setIsDeliveryEditing(true)}>
                    <Text style={styles.deliveryEditButtonText}>수정</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.deliveryInfoBox}>
                  <View style={styles.deliveryInfoRow}>
                    <Text style={styles.deliveryInfoLabel}>택배사</Text>
                    <Text style={styles.deliveryInfoValue}>{selectedDeliveryInfo.courier}</Text>
                  </View>
                  <View style={styles.deliveryInfoDivider} />
                  <View style={styles.deliveryInfoRow}>
                    <Text style={styles.deliveryInfoLabel}>송장번호</Text>
                    <Text style={styles.deliveryInfoValue}>{selectedDeliveryInfo.trackingNumber}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.deliveryForm}>
                {deliveryMessage ? <Text style={styles.deliveryMessageText}>{deliveryMessage}</Text> : null}
                <Text style={styles.listLab}>택배사</Text>
                <TextInput
                  value={deliveryCourier}
                  onChangeText={setDeliveryCourier}
                  placeholder="예: CJ대한통운"
                  placeholderTextColor="#9CA3AF"
                  style={styles.deliveryInput}
                />
                <Text style={styles.listLab}>송장번호</Text>
                <TextInput
                  value={deliveryTrackingNumber}
                  onChangeText={setDeliveryTrackingNumber}
                  placeholder="송장번호를 입력해주세요"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  style={styles.deliveryInput}
                />
                <TouchableOpacity
                  style={[styles.deliverySubmitButton, isDeliverySaving && styles.deliverySubmitButtonDisabled]}
                  onPress={handleDeliverySubmit}
                  disabled={isDeliverySaving}
                >
                  <Truck size={16} color="#FFF" />
                  <Text style={styles.deliverySubmitText}>
                    {isDeliverySaving ? '저장 중...' : selectedDeliveryInfo ? '배송 정보 수정' : '배송 정보 저장'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      )}

      {/* Modal - Insight Payment */}
      {isInsightPaymentVisible && (
        <View style={styles.centerModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setIsInsightPaymentVisible(false)} />
          <View style={styles.paymentModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>양조장 인사이트</Text>
                <Text style={styles.modalSub}>데이터 리포트 이용권</Text>
              </View>
              <TouchableOpacity onPress={() => setIsInsightPaymentVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.paymentContent}>
              <View style={styles.paymentIconBox}>
                <CreditCard size={24} color="#111827" />
              </View>
              <Text style={styles.paymentTitle}>인사이트 기능을 구매하시겠어요?</Text>
              <Text style={styles.paymentDesc}>후원자 반응, 펀딩 전환율, 매출 흐름을 대시보드에서 확인할 수 있습니다.</Text>
              <TouchableOpacity style={styles.paymentPrimaryButton} activeOpacity={0.88}>
                <Text style={styles.paymentPrimaryText}>결제하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal - Funding Status */}
      {selectedStatusFunding && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedStatusProject(null)} />
          <Animated.View entering={SlideInUp} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>프로젝트 상태 변경</Text>
                <Text style={styles.modalSub}>현재: {selectedStatusFunding.status}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedStatusProject(null)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              <Text style={styles.listLab}>상태 선택</Text>
              {statusOptions.map((status) => {
                const isCurrent = status === selectedStatusFunding.status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusOptionItem, isCurrent && styles.statusOptionItemActive]}
                    activeOpacity={0.85}
                    onPress={() => handleStatusChange(selectedStatusFunding.id, status)}
                  >
                    <Text style={[styles.statusOptionText, isCurrent && styles.statusOptionTextActive]}>{status}</Text>
                    {isCurrent && <Text style={styles.currentStatusLabel}>현재</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorBox: { alignItems: 'center', gap: 16 },
  errorTitle: { fontSize: 24, fontWeight: '700', color: '#111' },
  errorDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerInner: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  headerIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1.5, borderColor: '#FFF' },
  sectionGray: { backgroundColor: '#F9FAFB', paddingVertical: 24, paddingHorizontal: 20 },
  sectionWhite: { backgroundColor: '#FFF', paddingVertical: 24, paddingHorizontal: 20 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: '#6B7280' },
  infoCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconBox: { width: 48, height: 48, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  infoIconImage: { width: '100%', height: '100%' },
  infoName: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 2 },
  infoLoc: { fontSize: 12, color: '#9CA3AF' },
  fundingHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  fundingFilterBtns: { flexDirection: 'row', gap: 6 },
  filterBtn: { width: 52, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#111' },
  filterBtnTxt: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  filterBtnTxtActive: { color: '#FFF' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statsCard: { flex: 1, backgroundColor: '#111', borderRadius: 16, padding: 12 },
  statsIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statsVal: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  statsLab: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  insightLockedCard: {
    minHeight: 172,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  insightPreviewDim: { flex: 1, padding: 18, opacity: 0.35, gap: 16 },
  insightPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  insightPreviewBlockLarge: { width: 74, height: 74, borderRadius: 16, backgroundColor: '#111827' },
  insightPreviewStack: { flex: 1, gap: 10 },
  insightPreviewLine: { height: 14, borderRadius: 7, backgroundColor: '#111827' },
  insightPreviewLineShort: { width: '62%' },
  insightPreviewBar: { height: 8, borderRadius: 4, backgroundColor: '#6B7280' },
  insightPreviewChart: { height: 72, flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  insightChartBar: { flex: 1, borderRadius: 8, backgroundColor: '#111827' },
  insightLockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.52)' },
  insightLockButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  fundingList: { gap: 12 },
  fundingPagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 },
  paginationButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  paginationButtonDisabled: { backgroundColor: '#F9FAFB', borderColor: '#F3F4F6' },
  paginationText: { minWidth: 48, textAlign: 'center', fontSize: 13, fontWeight: '800', color: '#111827' },
  fundingItemCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  fundingRow: { flexDirection: 'row', gap: 12 },
  fundingThumb: { width: 80, height: 80, borderRadius: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fundingBrewery: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBadgeActive: { backgroundColor: '#ECFDF5' },
  statusBadgeSuccess: { backgroundColor: '#DCFCE7' },
  statusBadgeFailed: { backgroundColor: '#F3F4F6' },
  statusBadgeEnded: { backgroundColor: '#F3F4F6' },
  statusBadgeReviewing: { backgroundColor: '#FEF3C7' },
  statusBadgeNeutral: { backgroundColor: '#F3F4F6' },
  statusBadgeTxt: { fontSize: 10, fontWeight: '800' },
  statusBadgeTxtActive: { color: '#059669' },
  statusBadgeTxtSuccess: { color: '#15803D' },
  statusBadgeTxtFailed: { color: '#6B7280' },
  statusBadgeTxtEnded: { color: '#6B7280' },
  statusBadgeTxtReviewing: { color: '#B45309' },
  statusBadgeTxtNeutral: { color: '#4B5563' },
  fundingTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginVertical: 6 },
  rowBetweenBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  rowAlign: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPct: { fontSize: 18, fontWeight: '800', color: '#111', flexShrink: 0 },
  progressAmt: { flex: 1, minWidth: 0, fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  dday: { marginLeft: 8, fontSize: 11, fontWeight: '700', color: '#111', flexShrink: 0 },
  progressBar: { height: 4 },
  stageUpdateBtnMini: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 5 },
  stageUpdateBtnMiniText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreTxt: { fontSize: 13, color: '#111', fontWeight: '600' },
  notifBox: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginVertical: 16 },
  notifItem: { flexDirection: 'row', padding: 16, gap: 12, alignItems: 'center' },
  simpleNotifItem: { minHeight: 52, flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 12, alignItems: 'center' },
  notifBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  notifUnread: { backgroundColor: '#F1F3F5' },
  notifIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  notifMsg: { fontSize: 13, color: '#111', fontWeight: '500', marginBottom: 4 },
  simpleNotifTitle: { flex: 1, minWidth: 0, fontSize: 14, color: '#111827', fontWeight: '800' },
  notifContent: { fontSize: 12, color: '#4B5563', lineHeight: 17, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
  notifDot: { width: 6, height: 6, backgroundColor: '#9CA3AF', borderRadius: 3 },
  notifEmpty: { minHeight: 112, alignItems: 'center', justifyContent: 'center', gap: 8 },
  notifEmptyText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  quickStat: { flex: 1, backgroundColor: '#FFF', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  qsIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  qsVal: { fontSize: 16, fontWeight: '800', color: '#111' },
  qsLab: { fontSize: 11, color: '#6B7280' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, justifyContent: 'flex-end' },
  centerModalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)', zIndex: 100, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
  deliveryModalSheet: { paddingBottom: 18 },
  paymentModalCard: { width: '100%', maxWidth: 360, borderRadius: 24, backgroundColor: '#FFF', overflow: 'hidden' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  modalSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  modalList: { padding: 24 },
  listLab: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 16 },
  deliveryForm: { padding: 24, gap: 10 },
  deliveryLoadingText: { fontSize: 14, fontWeight: '800', color: '#6B7280', textAlign: 'center' },
  deliveryMessageText: { fontSize: 12, fontWeight: '700', color: '#EF4444', marginBottom: 2 },
  deliveryInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  deliverySubmitButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  deliverySubmitButtonDisabled: { opacity: 0.55 },
  deliverySubmitText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  deliverySummary: { padding: 24, gap: 16 },
  deliverySummaryHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  deliverySummaryTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  deliverySummaryDesc: { marginTop: 4, fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  deliveryEditButton: {
    minWidth: 48,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryEditButtonText: { fontSize: 12, fontWeight: '900', color: '#111827' },
  deliveryInfoBox: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, overflow: 'hidden', backgroundColor: '#FFF' },
  deliveryInfoRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingHorizontal: 16 },
  deliveryInfoLabel: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  deliveryInfoValue: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '900', color: '#111827' },
  deliveryInfoDivider: { height: 1, backgroundColor: '#F3F4F6' },
  paymentContent: { padding: 24, alignItems: 'center', gap: 14 },
  paymentIconBox: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  paymentTitle: { fontSize: 18, fontWeight: '900', color: '#111827', textAlign: 'center' },
  paymentDesc: { fontSize: 13, lineHeight: 20, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  paymentPrimaryButton: { width: '100%', height: 52, borderRadius: 16, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  paymentPrimaryText: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  stageItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: '#F3F4F6', marginBottom: 12 },
  stageItemActive: { borderColor: '#111', backgroundColor: '#F9FAFB' },
  stageNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  stageNumActive: { backgroundColor: '#111' },
  stageNumPassed: { backgroundColor: '#9CA3AF' },
  stageNumTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  stageItemName: { fontSize: 15, fontWeight: '600', color: '#4B5563', marginLeft: 12 },
  stageItemNameActive: { color: '#111' },
  curBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  curBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#111' },
  journalStageTabs: { paddingHorizontal: 24, paddingVertical: 14, gap: 8 },
  journalStageTab: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  journalStageTabActive: { backgroundColor: '#111827', borderColor: '#111827' },
  journalStageTabDone: { backgroundColor: '#F3F4F6', borderColor: '#F3F4F6' },
  journalStageTabText: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  journalStageTabTextActive: { color: '#FFF' },
  journalForm: { gap: 14, paddingBottom: 12 },
  journalReadBox: {
    minHeight: 128,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  journalReadText: { fontSize: 14, lineHeight: 21, color: '#374151' },
  journalInput: {
    minHeight: 132,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    fontSize: 14,
    lineHeight: 21,
    color: '#111827',
  },
  journalImageAdd: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  journalImageAddText: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  journalImageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  journalImageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  journalImageRemove: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalSubmitButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
  },
  journalSubmitText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  statusOptionItem: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusOptionItemActive: { backgroundColor: '#111827', borderColor: '#111827' },
  statusOptionText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  statusOptionTextActive: { color: '#FFF' },
  currentStatusLabel: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
