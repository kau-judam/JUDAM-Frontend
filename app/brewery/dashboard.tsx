import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Wine, 
  Package, 
  Droplets, 
  Factory, 
  FileCheck, 
  Target, 
  X 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, SlideInRight, FadeIn, FadeOut } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock Data
const summaryStats = {
  activeFundings: 3,
  pendingRecipes: 8,
  newNotifications: 5,
  totalBackers: 847,
};

const activeFundings = [
  {
    id: 1,
    title: "벚꽃 막걸리",
    description: "봄을 담은 벚꽃향이 가득한 프리미엄 막걸리",
    progress: 87,
    supporters: 156,
    dday: 12,
    goalAmount: "5,000,000",
    currentAmount: "4,350,000",
    image: "https://images.unsplash.com/photo-1697862469018-0fa7c93a8d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 2,
    title: "전통 누룩 막걸리",
    description: "100% 전통 누룩으로 빚은 깊은 맛의 막걸리",
    progress: 64,
    supporters: 98,
    dday: 8,
    goalAmount: "3,000,000",
    currentAmount: "1,920,000",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 3,
    title: "제주 한라봉 소주",
    description: "제주 한라봉의 상큼함이 살아있는 증류식 소주",
    progress: 45,
    supporters: 67,
    dday: 15,
    goalAmount: "7,000,000",
    currentAmount: "3,150,000",
    image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 4,
    title: "산사 막걸리",
    description: "산사나무 열매로 빚은 건강한 막걸리",
    progress: 112,
    supporters: 178,
    dday: 0,
    goalAmount: "4,000,000",
    currentAmount: "4,500,000",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 5,
    title: "한라봉 소주 특별판",
    description: "제주 한라봉으로 만든 프리미엄 소주",
    progress: 117,
    supporters: 234,
    dday: 0,
    goalAmount: "7,000,000",
    currentAmount: "8,200,000",
    image: "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

const productionStages = [
  {
    id: 1,
    project: "벚꽃 막걸리",
    stage: "발효",
    progress: 60,
    status: "진행중",
    nextUpdate: "2일 후",
    daysElapsed: 12,
    totalDays: 20,
  },
  {
    id: 2,
    project: "한라봉 소주",
    stage: "증류",
    progress: 80,
    status: "진행중",
    nextUpdate: "내일",
    daysElapsed: 16,
    totalDays: 20,
  },
  {
    id: 3,
    project: "전통 누룩 막걸리",
    stage: "숙성",
    progress: 30,
    status: "진행중",
    nextUpdate: "5일 후",
    daysElapsed: 6,
    totalDays: 20,
  },
];

const recentNotifications = [
  { id: 1, type: "recipe", message: "새로운 레시피 제안이 도착했습니다", time: "10분 전", unread: true },
  { id: 2, type: "funding", message: "벚꽃 막걸리 펀딩이 85%를 달성했습니다", time: "1시간 전", unread: true },
  { id: 3, type: "comment", message: "누군가 프로젝트에 댓글을 남겼습니다", time: "2시간 전", unread: false },
  { id: 4, type: "system", message: "제조 진행 현황이 업데이트되었습니다", time: "5시간 전", unread: false },
];

const stages = ["원료 투입", "발효", "증류", "숙성", "병입", "출고 준비"];

export default function BreweryDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [fundingFilter, setFundingFilter] = useState<"active" | "completed">("active");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const filteredFundings = fundingFilter === "active"
    ? activeFundings.filter(f => f.progress < 100)
    : activeFundings.filter(f => f.progress >= 100);

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
          <Text style={styles.headerTitle}>양조장 대시보드</Text>
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
            onPress={() => router.push('/brewery/verification' as any)}
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
              <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/brewery/project/terms' as any)}>
                 <Plus size={16} color="#FFF" />
                 <Text style={styles.addBtnTxt}>새펀딩</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
               <View style={styles.statsIconCircle}><TrendingUp size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>{summaryStats.activeFundings}</Text>
               <Text style={styles.statsLab}>진행 중</Text>
            </View>
            <View style={[styles.statsCard, {backgroundColor: '#F3F4F6'}]}>
               <View style={[styles.statsIconCircle, {backgroundColor: '#4B5563'}]}><Users size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>{summaryStats.totalBackers}</Text>
               <Text style={styles.statsLab}>총 참여자</Text>
            </View>
            <View style={[styles.statsCard, {backgroundColor: '#F3F4F6'}]}>
               <View style={[styles.statsIconCircle, {backgroundColor: '#1F2937'}]}><Target size={16} color="#FFF" /></View>
               <Text style={styles.statsVal}>72%</Text>
               <Text style={styles.statsLab}>평균 달성률</Text>
            </View>
          </View>

          {/* Funding List */}
          <View style={styles.fundingList}>
            {filteredFundings.map((funding, index) => {
              const progress = Math.min(funding.progress, 100);
              const status = funding.progress >= 100 ? "성공" : "진행 중";

              return (
                <TouchableOpacity key={funding.id} style={styles.fundingItemCard} activeOpacity={0.8}>
                   <View style={styles.fundingRow}>
                      <Image source={{ uri: funding.image }} style={styles.fundingThumb} />
                      <View style={{ flex: 1 }}>
                         <View style={styles.rowBetween}>
                            <Text style={styles.fundingBrewery}>{user.breweryName}</Text>
                            <View style={[styles.statusBadge, status === '성공' ? styles.statusBadgeSuccess : styles.statusBadgeActive]}>
                               <Text style={styles.statusBadgeTxt}>{status}</Text>
                            </View>
                         </View>
                         <Text style={styles.fundingTitle} numberOfLines={1}>{funding.title}</Text>
                         <View style={styles.rowBetweenBottom}>
                            <View style={styles.rowAlign}>
                               <Text style={styles.progressPct}>{progress}%</Text>
                               <Text style={styles.progressAmt}>{funding.currentAmount}원</Text>
                            </View>
                            <Text style={styles.dday}>{status === '성공' ? '종료' : `D-${funding.dday}`}</Text>
                         </View>
                         <Progress value={progress} style={styles.progressBar} />
                      </View>
                   </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: 내 제조 진행 현황 관리 */}
        <View style={styles.sectionGray}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>제조 진행 현황</Text>
            <Text style={styles.sectionSubtitle}>실시간으로 제조 과정을 관리하세요</Text>
          </View>

          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentStageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {productionStages.map((stage) => (
              <View key={stage.id} style={styles.stageCardContainer}>
                <LinearGradient colors={['#2B1810', '#3D2416']} style={styles.stageCard}>
                  <Text style={styles.stageProj}>{stage.project}</Text>
                  <Text style={styles.stageDays}>{stage.daysElapsed}일 / {stage.totalDays}일</Text>
                  <View style={styles.stageRow}>
                     <Wine size={20} color="#FFF" />
                     <Text style={styles.stageName}>{stage.stage}</Text>
                  </View>
                  <View style={styles.stageProgressRow}>
                     <Text style={styles.stageLab}>진행률</Text>
                     <Text style={styles.stageVal}>{stage.progress}%</Text>
                  </View>
                  <View style={styles.stageBarBg}>
                     <View style={[styles.stageBarFill, { width: `${stage.progress}%` }]} />
                  </View>
                  <TouchableOpacity style={styles.stageUpdateBtn} onPress={() => setSelectedProject(stage)}>
                     <FileCheck size={16} color="#FFF" />
                     <Text style={styles.stageUpdateTxt}>진행 상황 업데이트</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
             {productionStages.map((_, i) => (
               <View key={i} style={[styles.dot, currentStageIndex === i && styles.dotActive]} />
             ))}
          </View>
        </View>

        {/* Section 3: 알림 및 정보 */}
        <View style={styles.sectionGray}>
           <View style={styles.rowBetween}>
              <View>
                 <Text style={styles.sectionTitle}>알림 및 정보</Text>
                 <Text style={styles.sectionSubtitle}>최근 활동과 중요한 알림</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/notifications' as any)}>
                 <Text style={styles.moreTxt}>전체보기 <ChevronRight size={14} color="#8B5A3C" /></Text>
              </TouchableOpacity>
           </View>

           <View style={styles.notifBox}>
              {recentNotifications.map((n, i) => (
                <View key={n.id} style={[styles.notifItem, i < recentNotifications.length - 1 && styles.notifBorder, n.unread && styles.notifUnread]}>
                   <View style={[styles.notifIcon, {backgroundColor: n.type === 'recipe' ? '#DBEAFE' : n.type === 'funding' ? '#D1FAE5' : '#F3E8FF'}]}>
                      {n.type === 'recipe' ? <FileCheck size={16} color="#2563EB" /> : n.type === 'funding' ? <TrendingUp size={16} color="#059669" /> : <MessageCircle size={16} color="#9333EA" />}
                   </View>
                   <View style={{ flex: 1 }}>
                      <Text style={styles.notifMsg}>{n.message}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                   </View>
                   {n.unread && <View style={styles.notifDot} />}
                </View>
              ))}
           </View>

           <View style={styles.row}>
              <View style={styles.quickStat}>
                 <View style={[styles.qsIcon, {backgroundColor: '#F3E8FF'}]}><MessageCircle size={20} color="#9333EA" /></View>
                 <View>
                    <Text style={styles.qsVal}>24</Text>
                    <Text style={styles.qsLab}>새 댓글</Text>
                 </View>
              </View>
              <View style={[styles.quickStat, {marginLeft: 12}]}>
                 <View style={[styles.qsIcon, {backgroundColor: '#FCE7F3'}]}><Heart size={20} color="#DB2777" /></View>
                 <View>
                    <Text style={styles.qsVal}>156</Text>
                    <Text style={styles.qsLab}>새 좋아요</Text>
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>

      {/* Modal - Stage Update */}
      {selectedProject && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedProject(null)} />
          <Animated.View entering={SlideInRight} style={styles.modalSheet}>
             <View style={styles.modalHandle} />
             <View style={styles.modalHeader}>
                <View>
                   <Text style={styles.modalTitle}>{selectedProject.project}</Text>
                   <Text style={styles.modalSub}>현재: {selectedProject.stage}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedProject(null)}><X size={24} color="#6B7280" /></TouchableOpacity>
             </View>

             <ScrollView style={styles.modalList}>
                <Text style={styles.listLab}>제조 단계 선택</Text>
                {stages.map((s, i) => {
                  const isCurrent = s === selectedProject.stage;
                  const curIdx = stages.indexOf(selectedProject.stage);
                  const isPassed = i < curIdx;

                  return (
                    <TouchableOpacity 
                      key={s} 
                      style={[styles.stageItem, isCurrent && styles.stageItemActive]}
                      onPress={() => {
                        Alert.alert('알림', `'${s}' 단계로 업데이트 하시겠습니까?`, [
                          { text: '취소', style: 'cancel' },
                          { text: '확인', onPress: () => {
                              Alert.alert('완료', '단계가 성공적으로 업데이트되었습니다.');
                              setSelectedProject(null);
                          }}
                        ]);
                      }}
                    >
                       <View style={styles.rowAlign}>
                          <View style={[styles.stageNum, isCurrent && styles.stageNumActive, isPassed && styles.stageNumPassed]}>
                             <Text style={[styles.stageNumTxt, (isCurrent || isPassed) && {color: '#FFF'}]}>{i+1}</Text>
                          </View>
                          <Text style={[styles.stageItemName, isCurrent && styles.stageItemNameActive]}>{s}</Text>
                       </View>
                       {isCurrent && <View style={styles.curBadge}><Text style={styles.curBadgeTxt}>현재</Text></View>}
                       {isPassed && <CheckCircle size={20} color="#059669" />}
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
  addBtn: { width: 52, height: 40, backgroundColor: '#111', borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 2 },
  addBtnTxt: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statsCard: { flex: 1, backgroundColor: '#111', borderRadius: 16, padding: 12 },
  statsIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statsVal: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  statsLab: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  fundingList: { gap: 12 },
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
  stageCardContainer: { width: SCREEN_WIDTH, paddingHorizontal: 20 },
  stageCard: { flex: 1, borderRadius: 24, padding: 20 },
  stageProj: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  stageDays: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  stageName: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  stageProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stageLab: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  stageVal: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  stageBarBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden', marginBottom: 20 },
  stageBarFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 5 },
  stageUpdateBtn: { height: 48, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  stageUpdateTxt: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  dotActive: { width: 18, backgroundColor: '#111' },
  moreTxt: { fontSize: 13, color: '#8B5A3C', fontWeight: '600' },
  notifBox: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginVertical: 16 },
  notifItem: { flexDirection: 'row', padding: 16, gap: 12, alignItems: 'center' },
  notifBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  notifUnread: { backgroundColor: '#EFF6FF' },
  notifIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  notifMsg: { fontSize: 13, color: '#111', fontWeight: '500', marginBottom: 4 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
  notifDot: { width: 6, height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
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
});
