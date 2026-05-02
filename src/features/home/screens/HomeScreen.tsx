import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Wine, 
  Lightbulb, 
  Factory, 
  Trophy 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RecipeCard } from '@/components/recipe-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFunding } from '@/contexts/FundingContext';
import { getFundingProjectImageSource, getPopularRecipes, isCompletedFundingStatus, sortFundingProjectsByPopularity } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const bannerSlides = [
  {
    id: 1,
    title: "MEET YOUR TASTE",
    subtitle: "전통을 잇는 새로운 맛",
    description: "매일 마주하는 일상을\n특별하게 만들어 줄 우리 술 이야기",
    image: require('../../../../newpicutre/home1.png'),
  },
  {
    id: 2,
    title: "CRAFT YOUR DREAM",
    subtitle: "당신만의 술을 만드세요",
    description: "펀딩으로 함께 완성하는\n세상에 하나뿐인 전통주",
    image: require('../../../../newpicutre/home2.jpg'),
  },
  {
    id: 3,
    title: "DISCOVER TRADITION",
    subtitle: "전통의 재발견",
    description: "오랜 시간이 만든 깊은 맛\n우리 술의 새로운 가능성",
    image: require('../../../../newpicutre/home3.jpg'),
  },
];

const processSteps = [
  { number: "01", title: "레시피\n제안", description: "당신이 원하는 맛을 제안하세요", icon: Lightbulb },
  { number: "02", title: "양조장\n선택", description: "양조장이 레시피를 선택합니다", icon: Factory },
  { number: "03", title: "펀딩\n시작", description: "함께 만들 사람들을 모집합니다", icon: Users },
  { number: "04", title: "양조\n과정", description: "실시간으로 제작 과정을 확인하세요", icon: Wine },
];

function pushTabToTop(pathname: '/recipe' | '/funding') {
  router.push({
    pathname,
    params: { scrollToTop: Date.now().toString() },
  } as any);
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { projects } = useFunding();
  const [currentSlide, setCurrentSlide] = useState(0);
  const popularFundingProjects = sortFundingProjectsByPopularity(projects).slice(0, 3);
  const popularRecipes = getPopularRecipes(3);
  const totalBackers = projects.reduce((sum, project) => sum + project.backers, 0);
  const activeProjects = projects.filter((project) => !isCompletedFundingStatus(project.status)).length;
  const completedProjects = projects.filter((project) => isCompletedFundingStatus(project.status)).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="홈" showIcons={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Carousel */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={bannerSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentSlide(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.bannerSlide}>
                <View style={styles.bannerImageFrame}>
                  <Image source={item.image} style={styles.bannerImage} resizeMode="contain" />
                </View>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.bannerText}>
                  <Text style={styles.bannerBadge}>EVERYDAY ESSENTIAL</Text>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.bannerDesc}>{item.description}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.bannerPagination}>
            <Text style={styles.bannerPaginationTxt}>{currentSlide + 1} / {bannerSlides.length}</Text>
          </View>
        </View>

        {/* Process Steps */}
        <View style={styles.processSection}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.processTitle}>주담이 만들어지는 과정</Text>
            <Text style={styles.processSubtitle}>여러분의 아이디어가 술이 되기까지</Text>
          </View>

          <View style={styles.processGrid}>
            {processSteps.map((step, index) => (
              <View key={index} style={styles.processItem}>
                <View style={styles.processIconBox}>
                  <step.icon size={24} color="#FFF" />
                </View>
                <Text style={styles.processNumber}>{step.number}</Text>
                <Text style={styles.processStepTitle}>{step.title}</Text>
                <Text style={styles.processStepDesc}>{step.description}</Text>
              </View>
            ))}
          </View>

          <Button 
            label="레시피 제안하러 가기" 
            variant="outline"
            style={styles.processBtn}
            labelStyle={styles.processBtnLabel}
            onPress={() => pushTabToTop('/recipe')}
          />
        </View>

        {/* Popular Funding */}
        <View style={styles.fundingSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>현재 인기 펀딩</Text>
              <Text style={styles.sectionSubtitle}>지금 가장 뜨거운 프로젝트</Text>
            </View>
            <TouchableOpacity onPress={() => pushTabToTop('/funding')}>
              <View style={styles.moreBtn}>
                <Text style={styles.moreBtnTxt}>전체보기</Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.fundingList}>
            {popularFundingProjects.map((project) => {
              const progress = (project.currentAmount / project.goalAmount) * 100;
              return (
                <TouchableOpacity 
                  key={project.id} 
                  style={styles.fundingCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/funding/${project.id}`)}
                >
                  <View style={styles.fundingRow}>
                    <View style={styles.fundingThumbBox}>
                      <Image source={getFundingProjectImageSource(project)} style={styles.fundingThumb} resizeMode="contain" />
                    </View>
                    <View style={styles.fundingInfo}>
                      <View style={styles.fundingMeta}>
                        <Text style={styles.breweryName}>{project.brewery}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryTxt}>{project.category}</Text>
                        </View>
                      </View>
                      <Text style={styles.fundingTitle} numberOfLines={2}>{project.title}</Text>
                      <View style={styles.fundingProgressRow}>
                        <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
                        <Text style={styles.fundingAmount}>{(project.currentAmount / 10000).toLocaleString()}만원</Text>
                        <Text style={styles.daysLeft}>{isCompletedFundingStatus(project.status) ? '펀딩 종료' : `${project.daysLeft}일 남음`}</Text>
                      </View>
                      <Progress value={progress} style={styles.progressBar} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Popular Recipes */}
        <View style={[styles.recipeSection, { backgroundColor: colors.secondary }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>인기 레시피 제안</Text>
              <Text style={styles.sectionSubtitle}>커뮤니티에서 가장 인기있는 레시피</Text>
            </View>
            <TouchableOpacity onPress={() => pushTabToTop('/recipe')}>
              <View style={styles.moreBtn}>
                <Text style={styles.moreBtnTxt}>더보기</Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.recipeList}>
            {popularRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Trophy size={40} color={colors.primary} style={styles.statsIcon} />
            <Text style={styles.sectionTitle}>주담과 함께한 순간들</Text>
            <Text style={styles.sectionSubtitle}>함께 만들어가는 전통주 문화</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statsItem}>
              <View style={[styles.statsIconCircle, { backgroundColor: '#111' }]}>
                <Users size={20} color="#FFF" />
              </View>
              <Text style={styles.statsValue}>{totalBackers.toLocaleString()}</Text>
              <Text style={styles.statsLabel}>가입 회원</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.statsIconCircle, { backgroundColor: colors.primary }]}>
                <Factory size={20} color="#FFF" />
              </View>
              <Text style={styles.statsValue}>42</Text>
              <Text style={styles.statsLabel}>참여 양조장</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.statsIconCircle, { backgroundColor: '#111' }]}>
                <TrendingUp size={20} color="#FFF" />
              </View>
              <Text style={styles.statsValue}>{activeProjects}</Text>
              <Text style={styles.statsLabel}>진행중인 펀딩</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.statsIconCircle, { backgroundColor: '#111' }]}>
                <Trophy size={20} color="#FFF" />
              </View>
              <Text style={styles.statsValue}>{completedProjects}</Text>
              <Text style={styles.statsLabel}>성공한 펀딩</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  bannerContainer: { height: SCREEN_WIDTH * 1.1, position: 'relative' },
  bannerSlide: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.1 },
  bannerImageFrame: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  bannerImage: { width: '100%', height: '100%', objectFit: 'contain' },
  bannerText: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 40 },
  bannerBadge: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  bannerTitle: { color: '#FFF', fontSize: 40, fontWeight: '900', letterSpacing: -1, marginBottom: 4 },
  bannerSubtitle: { color: '#FFF', fontSize: 22, fontWeight: '600', marginBottom: 12 },
  bannerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 },
  bannerPagination: { position: 'absolute', bottom: 24, right: 24, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bannerPaginationTxt: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  processSection: { paddingVertical: 60, paddingHorizontal: 20, backgroundColor: '#000' },
  sectionHeaderCenter: { alignItems: 'center', marginBottom: 40 },
  processTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  processSubtitle: { color: '#9CA3AF', fontSize: 14 },
  processGrid: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  processItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  processIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  processNumber: { color: '#6B7280', fontSize: 12, fontWeight: '800', marginBottom: 4 },
  processStepTitle: { color: '#FFF', fontSize: 13, fontWeight: '800', textAlign: 'center', marginBottom: 8, height: 36 },
  processStepDesc: { color: '#9CA3AF', fontSize: 10, textAlign: 'center', lineHeight: 14 },
  processBtn: { borderColor: '#FFF', height: 56, borderRadius: 28 },
  processBtnLabel: { color: '#FFF', fontSize: 15 },
  fundingSection: { paddingVertical: 60, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280' },
  moreBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreBtnTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  fundingList: { gap: 16 },
  fundingCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  fundingRow: { flexDirection: 'row', gap: 16 },
  fundingThumbBox: { width: 100, height: 100, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  fundingThumb: { width: '100%', height: '100%', objectFit: 'contain' },
  fundingInfo: { flex: 1, justifyContent: 'space-between' },
  fundingMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  breweryName: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  categoryTxt: { fontSize: 10, fontWeight: '800', color: '#4B5563' },
  fundingTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 8 },
  fundingProgressRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  progressPct: { fontSize: 24, fontWeight: '900', color: '#111' },
  fundingAmount: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginBottom: 4 },
  daysLeft: { marginLeft: 'auto', fontSize: 12, fontWeight: '800', color: '#111', marginBottom: 4 },
  progressBar: { height: 6 },
  recipeSection: { paddingVertical: 60, paddingHorizontal: 20 },
  recipeList: { gap: 12 },
  statsSection: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  statsHeader: { alignItems: 'center', marginBottom: 40 },
  statsIcon: { marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statsItem: { width: (SCREEN_WIDTH - 50) / 2, backgroundColor: '#F9FAFB', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  statsIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statsValue: { fontSize: 24, fontWeight: '900', color: '#111', marginBottom: 4 },
  statsLabel: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
});
