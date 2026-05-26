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
  PartyPopper,
  Wine,
  BookOpen,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInRight } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
  isSupportableFundingStatus,
  type ProjectStatus,
} from '@/constants/data';
import { getFundingApiErrorMessage, getFundingList } from '@/features/funding/api';
import { mergeFundingListItem } from '@/features/funding/apiMappers';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import { initialNotifications, type AppNotification } from '@/features/notifications/data';

const unreadDashboardNotifications = initialNotifications.filter((notification) => !notification.read);
const FUNDINGS_PER_PAGE = 3;

const getDashboardNotificationIcon = (type: AppNotification["type"]) => {
  switch (type) {
    case "funding_success":
      return <PartyPopper size={16} color="#FFF" />;
    case "funding_end":
      return <AlertCircle size={16} color="#FFF" />;
    case "funding_new":
      return <Wine size={16} color="#FFF" />;
    case "funding_progress":
      return <TrendingUp size={16} color="#FFF" />;
    case "recipe_popular":
      return <BookOpen size={16} color="#FFF" />;
  }
};

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

export default function BreweryDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { projects, mergeProjects, updateProjectStatus } = useFunding();
  const projectsRef = useRef(projects);
  const [fundingFilter, setFundingFilter] = useState<"active" | "completed">("active");
  const [fundingPage, setFundingPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedStatusProject, setSelectedStatusProject] = useState<number | null>(null);
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
  const ownProjects = projects.filter((project) => isFundingProjectOwnedByBrewery(user, project));
  const dashboardProjects = ownProjects;
  const filteredFundings = fundingFilter === "active"
    ? dashboardProjects.filter((project) => isSupportableFundingStatus(project.status) || project.status === "심사 중" || project.status === "펀딩 예정")
    : dashboardProjects.filter((project) => isCompletedFundingStatus(project.status));
  const fundingPageCount = Math.max(1, Math.ceil(filteredFundings.length / FUNDINGS_PER_PAGE));
  const visibleFundings = useMemo(
    () => filteredFundings.slice(fundingPage * FUNDINGS_PER_PAGE, fundingPage * FUNDINGS_PER_PAGE + FUNDINGS_PER_PAGE),
    [filteredFundings, fundingPage],
  );
  const canGoPrevFundingPage = fundingPage > 0;
  const canGoNextFundingPage = fundingPage < fundingPageCount - 1;
  const activeFundingCount = dashboardProjects.filter((project) => isSupportableFundingStatus(project.status)).length;
  const totalFundingCount = dashboardProjects.length;
  const totalBackers = dashboardProjects.reduce((sum, project) => sum + project.backers, 0);
  const selectedStatusFunding = selectedStatusProject
    ? projects.find((project) => project.id === selectedStatusProject)
    : null;
  const currentJournalEntry = journalData[selectedJournalStage];

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    if (!currentUserId || currentUserType !== 'brewery') return;

    let mounted = true;

    getFundingList({ mine: true, page: 0, size: 50 })
      .then((response) => {
        if (!mounted) return;
        const nextProjects = response.data.map((item) =>
          mergeFundingListItem(projectsRef.current.find((project) => project.id === item.fundingId), item)
        );
        mergeProjects(nextProjects);
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '내 프로젝트 목록을 불러오지 못했습니다.'));
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
            <View style={styles.notifBadge} />
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
                <Factory size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoName}>{user.breweryName || "양조장 이름"}</Text>
                <Text style={styles.infoLoc}>{user.breweryLocation || "양조장 위치"}</Text>
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
              const progress = Math.min((funding.currentAmount / funding.goalAmount) * 100, 100);
              const status = getFundingStatusLabel(funding.status);

              return (
                <TouchableOpacity key={funding.id} style={styles.fundingItemCard} activeOpacity={0.8} onPress={() => router.push(`/funding/${funding.id}` as any)}>
                   <View style={styles.fundingRow}>
                      <Image source={getFundingProjectImageSource(funding)} style={styles.fundingThumb} />
                      <View style={{ flex: 1 }}>
                         <View style={styles.rowBetween}>
                            <Text style={styles.fundingBrewery}>{funding.brewery}</Text>
                            <TouchableOpacity
                              style={[styles.statusBadge, isCompletedFundingStatus(funding.status) ? styles.statusBadgeSuccess : styles.statusBadgeActive]}
                              activeOpacity={0.85}
                              onPress={() => setSelectedStatusProject(funding.id)}
                            >
                               <Text style={styles.statusBadgeTxt}>{status}</Text>
                            </TouchableOpacity>
                         </View>
                         <Text style={styles.fundingTitle} numberOfLines={1}>{funding.title}</Text>
                         <View style={styles.rowBetweenBottom}>
                            <View style={styles.rowAlign}>
                               <Text style={styles.progressPct}>{progress}%</Text>
                               <Text style={styles.progressAmt}>{funding.currentAmount.toLocaleString()}원</Text>
                            </View>
                            <Text style={styles.dday}>{isCompletedFundingStatus(funding.status) ? '종료' : `D-${funding.daysLeft}`}</Text>
                         </View>
                         <Progress value={progress} style={styles.progressBar} />
                         <TouchableOpacity style={styles.stageUpdateBtnMini} onPress={() => router.push(`/brewery/project/${funding.id}/journal` as any)}>
                           <Text style={styles.stageUpdateBtnMiniText}>양조일지 관리</Text>
                         </TouchableOpacity>
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
              {unreadDashboardNotifications.length === 0 ? (
                <View style={styles.notifEmpty}>
                  <Bell size={28} color="#D1D5DB" />
                  <Text style={styles.notifEmptyText}>새로운 알림이 없습니다</Text>
                </View>
              ) : (
                unreadDashboardNotifications.map((notification, i) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notifItem,
                      i < unreadDashboardNotifications.length - 1 && styles.notifBorder,
                      styles.notifUnread,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (notification.link) router.push(notification.link as any);
                    }}
                  >
                    <View style={styles.notifIcon}>
                      {getDashboardNotificationIcon(notification.type)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifMsg}>{notification.title}</Text>
                      <Text style={styles.notifContent} numberOfLines={2}>{notification.content}</Text>
                      <Text style={styles.notifTime}>{notification.timestamp}</Text>
                    </View>
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
          <Animated.View entering={SlideInRight} style={styles.modalSheet}>
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

      {/* Modal - Funding Status */}
      {selectedStatusFunding && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedStatusProject(null)} />
          <Animated.View entering={SlideInRight} style={styles.modalSheet}>
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
  infoIconBox: { width: 48, height: 48, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
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
  statusBadgeSuccess: { backgroundColor: '#EFF6FF' },
  statusBadgeTxt: { fontSize: 10, fontWeight: '800', color: '#059669' },
  fundingTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginVertical: 6 },
  rowBetweenBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  rowAlign: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPct: { fontSize: 18, fontWeight: '800', color: '#111' },
  progressAmt: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  dday: { fontSize: 11, fontWeight: '700', color: '#111' },
  progressBar: { height: 4 },
  stageUpdateBtnMini: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#111' },
  stageUpdateBtnMiniText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreTxt: { fontSize: 13, color: '#111', fontWeight: '600' },
  notifBox: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginVertical: 16 },
  notifItem: { flexDirection: 'row', padding: 16, gap: 12, alignItems: 'center' },
  notifBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  notifUnread: { backgroundColor: '#F1F3F5' },
  notifIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  notifMsg: { fontSize: 13, color: '#111', fontWeight: '500', marginBottom: 4 },
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
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  modalSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  modalList: { padding: 24 },
  listLab: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 16 },
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
