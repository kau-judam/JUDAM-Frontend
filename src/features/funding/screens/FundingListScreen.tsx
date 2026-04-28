import React, { useState } from 'react';
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
import { router } from 'expo-router';
import {
  Search,
  Plus,
  TrendingUp,
  Users,
  ChevronDown,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Progress } from '@/components/ui/progress';
import { fundingProjects } from '@/constants/data';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FundingListScreen() {
  const { user } = useAuth();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체 프로젝트");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ["전체 프로젝트", "진행중인 프로젝트", "성사된 프로젝트"];
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified;

  const filteredProjects = fundingProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.brewery.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus === "진행중인 프로젝트") {
      matchesStatus = project.status === "진행 중";
    } else if (selectedStatus === "성사된 프로젝트") {
      matchesStatus = project.status === "성공";
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const pagedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <View style={styles.container}>
      <PageHeader title="펀딩" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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
              <Text style={styles.heroTitle}>당신의 선택으로{'\n'}완성되는 전통주</Text>
              {isBrewery ? (
                <TouchableOpacity 
                  style={styles.createBtn} 
                  onPress={() => router.push('/brewery/project/terms' as any)}
                  activeOpacity={0.9}
                >
                  <Plus size={20} color="#000" />
                  <Text style={styles.createBtnTxt}>프로젝트 등록</Text>
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
                placeholder="프로젝트 또는 양조장 검색..."
                placeholderTextColor="#9CA3AF"
                value={searchTerm}
                onChangeText={setSearchTerm}
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
        </View>

        {/* 3. Funding Project Feed */}
        <View style={styles.listSection}>
          {pagedProjects.length === 0 ? (
            <View style={styles.emptyBox}>
              <Search size={48} color="#E5E7EB" />
              <Text style={styles.emptyTxt}>해당하는 펀딩 프로젝트가 없습니다.</Text>
            </View>
          ) : (
            pagedProjects.map((project, index) => {
              const progressPercentage = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
              return (
                <Animated.View key={project.id} entering={FadeInUp.delay(index * 50)} style={styles.fundingCard}>
                  <TouchableOpacity 
                    style={styles.cardInner} 
                    activeOpacity={0.9}
                    onPress={() => router.push(`/funding/${project.id}`)}
                  >
                    <View style={styles.thumbBox}>
                      <Image source={{ uri: project.image }} style={styles.thumb} />
                      <TouchableOpacity 
                        style={styles.heartBtn} 
                        onPress={() => toggleFavoriteFunding(project.id)}
                      >
                        <Heart 
                          size={14} 
                          color="#FFF" 
                          fill={isFavoriteFunding(project.id) ? "#FFF" : "transparent"} 
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoBox}>
                      <View style={styles.tagRow}>
                        <Text style={styles.breweryName}>{project.brewery}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryTxt}>{project.category}</Text>
                        </View>
                        <View style={[styles.statusBadge, project.status === '성공' ? styles.statusBadgeSuccess : styles.statusBadgeActive]}>
                          <Text style={[styles.statusTxt, project.status === '성공' && { color: '#2563EB' }]}>{project.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
                      <View style={styles.progressRow}>
                        <View style={styles.progressTextRow}>
                           <Text style={styles.progressPct}>{progressPercentage.toFixed(0)}%</Text>
                           <Text style={styles.amountTxt}>{(project.currentAmount / 10000).toLocaleString()}만원</Text>
                        </View>
                        <Text style={styles.daysLeft}>
                          {project.status === '성공' ? '펀딩 종료' : `${project.daysLeft}일 남음`}
                        </Text>
                      </View>
                      <Progress 
                        value={progressPercentage} 
                        style={styles.progressBar} 
                        indicatorStyle={{ backgroundColor: '#111' }}
                      />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}

          {/* Pagination */}
          {filteredProjects.length > itemsPerPage && (
            <View style={styles.pagination}>
              <TouchableOpacity 
                disabled={currentPage === 1} 
                onPress={() => setCurrentPage(prev => prev - 1)}
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
                    onPress={() => setCurrentPage(i + 1)}
                  >
                    <Text style={[styles.pageBtnTxt, currentPage === i + 1 && styles.pageBtnTxtActive]}>{i + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                disabled={currentPage === totalPages} 
                onPress={() => setCurrentPage(prev => prev + 1)}
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

          <View style={styles.statsGrid}>
            <StatCard 
              icon={<TrendingUp size={22} color="#FFF" />} 
              val={fundingProjects.filter(p => p.status === "진행 중").length.toString()} 
              label="진행중인 펀딩" 
              sub="지금 참여 가능"
            />
            <StatCard 
              icon={<Users size={22} color="#FFF" />} 
              val={fundingProjects.reduce((sum, p) => sum + p.backers, 0).toLocaleString()} 
              label="총 참여자" 
              sub="함께한 사람들"
            />
            <StatCard 
              icon={<Text style={{ fontSize: 18, color: '#FFF' }}>✓</Text>} 
              val={fundingProjects.filter(p => p.status === "성공").length.toString()} 
              label="성공 프로젝트" 
              sub="여러분의 선택"
            />
          </View>

          <View style={styles.milestoneContainer}>
            <View style={styles.milestoneBox}>
              <Text style={styles.milestoneTxt}>
                총 <Text style={styles.milestoneVal}>{(fundingProjects.reduce((sum, p) => sum + p.currentAmount, 0) / 100000000).toFixed(1)}억원</Text> 이상 모금 달성
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, val, label, sub }: any) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>{icon}</View>
      <Text style={styles.statVal}>{val}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSubLabel}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  hero: { height: SCREEN_HEIGHT * 0.65, backgroundColor: '#000' },
  heroImg: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  heroContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  heroTitle: { color: '#FFF', fontSize: 44, fontWeight: '800', textAlign: 'center', lineHeight: 54, marginBottom: 24, letterSpacing: -1 },
  heroDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 14, textAlign: 'center', lineHeight: 24, fontWeight: '500' },
  createBtn: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  createBtnTxt: { fontSize: 18, fontWeight: '800', color: '#000' },
  searchSection: { paddingHorizontal: 20, marginTop: -45, zIndex: 20 },
  searchCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 12, flexDirection: 'row', gap: 10, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 25, borderWidth: 1, borderColor: '#F3F4F6' },
  searchBar: { flex: 1, height: 56, backgroundColor: '#F9FAFB', borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#000' },
  filterBtn: { height: 56, paddingHorizontal: 16, backgroundColor: '#F9FAFB', borderRadius: 20, borderWidth: 2, borderColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6 },
  filterTxt: { fontSize: 14, fontWeight: '700', color: '#111' },
  dropdown: { position: 'absolute', top: 75, right: 12, backgroundColor: '#FFF', borderRadius: 20, width: 200, elevation: 25, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  dropItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropTxt: { fontSize: 14, color: '#4B5563' },
  listSection: { padding: 20, paddingTop: 40 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTxt: { fontSize: 16, color: '#9CA3AF', marginTop: 16, fontWeight: '500' },
  fundingCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 3, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10 },
  cardInner: { flexDirection: 'row', gap: 16 },
  thumbBox: { width: 100, height: 100, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartBtn: { position: 'absolute', bottom: 8, left: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  infoBox: { flex: 1, justifyContent: 'space-between' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  breweryName: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryTxt: { fontSize: 10, fontWeight: '800', color: '#4B5563' },
  statusBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeActive: { backgroundColor: '#ECFDF5' },
  statusBadgeSuccess: { backgroundColor: '#EFF6FF' },
  statusTxt: { fontSize: 10, fontWeight: '900', color: '#059669' },
  projectTitle: { fontSize: 16, fontWeight: '800', color: '#111', lineHeight: 22, marginBottom: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  progressTextRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  progressPct: { fontSize: 22, fontWeight: '900', color: '#111' },
  amountTxt: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  daysLeft: { fontSize: 12, fontWeight: '800', color: '#111' },
  progressBar: { height: 6, borderRadius: 3 },
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
  statsSubtitle: { fontSize: 15, color: '#9CA3AF', marginBottom: 48, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', gap: 12, width: '100%' },
  statCard: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 28, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  statIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statVal: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  statSubLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },
  milestoneContainer: { marginTop: 40 },
  milestoneBox: { backgroundColor: '#111', paddingHorizontal: 28, paddingVertical: 16, borderRadius: 32, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15 },
  milestoneTxt: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  milestoneVal: { fontSize: 20, fontWeight: '900' },
});
