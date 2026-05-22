import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Droplet, Plus, Search, Star, Wine, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFundingProjectImageSource } from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { isFundingReviewOwnedByUser } from '@/features/funding/reviews';

type ArchiveTab = 'all' | 'funded' | 'general';

type ArchiveDrink = {
  id: number;
  name: string;
  brewery: string;
  category: string;
  image: ImageSourcePropType;
  rating: number;
  date: string;
  tags: string[];
  isFunding: boolean;
  alcohol: number;
  fundingId?: number;
};

const GENERAL_DRINKS: ArchiveDrink[] = [
  {
    id: 101,
    name: '안동 증류식 소주',
    brewery: '안동양조',
    category: '소주',
    image: require('../../../../newpicutre/bottle.jpg'),
    rating: 4.0,
    date: '2025.02.20',
    tags: ['깔끔한', '묵직한'],
    isFunding: false,
    alcohol: 45,
  },
  {
    id: 102,
    name: '꽃향기 주',
    brewery: '과일청양조',
    category: '청주',
    image: require('../../../../newpicutre/food.jpg'),
    rating: 5.0,
    date: '2025.01.30',
    tags: ['과일향', '깔끔한'],
    isFunding: false,
    alcohol: 13,
  },
  {
    id: 103,
    name: '감귤 막걸리',
    brewery: '꽃담양조',
    category: '막걸리',
    image: require('../../../../newpicutre/funding3.jpg'),
    rating: 4.5,
    date: '2025.01.15',
    tags: ['달콤한', '과일향'],
    isFunding: false,
    alcohol: 6,
  },
];

const SAMPLE_FUNDING_DRINKS: ArchiveDrink[] = [
  {
    id: 201,
    name: '달빛 담은 배 막걸리',
    brewery: '주담 테스트 양조장',
    category: '막걸리',
    image: require('../../../../newpicutre/funding3.jpg'),
    rating: 4.5,
    date: '2026.05.21',
    tags: ['부드러움', '은은한단맛'],
    isFunding: true,
    alcohol: 6,
  },
];

const TAB_LABELS: Record<ArchiveTab, string> = {
  all: '전체',
  funded: '펀딩 술',
  general: '일반 술',
};

export default function MyArchiveScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { projects, participatedFundings, fundingReviews } = useFunding();
  const [activeTab, setActiveTab] = useState<ArchiveTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fundedDrinks = useMemo<ArchiveDrink[]>(() => {
    const nextDrinks: ArchiveDrink[] = [];
    participatedFundings.forEach((participation, index) => {
      const project = projects.find((item) => item.id === participation.fundingId);
      if (!project) return;
      nextDrinks.push({
          id: project.id,
          name: project.shortTitle || project.title.replace(/\s*프로젝트$/, ''),
          brewery: project.brewery,
          category: project.category,
          image: getFundingProjectImageSource(project)!,
          rating: index === 1 ? 5.0 : 4.5,
          date: participation.date,
          tags: index === 1 ? ['묵직한', '고소한'] : ['달콤한', '부드러운'],
          isFunding: true,
          alcohol: Number.parseFloat(project.alcoholContent || '') || 6,
          fundingId: project.id,
      });
    });
    return nextDrinks;
  }, [participatedFundings, projects]);

  const savedArchiveDrinks = useMemo<ArchiveDrink[]>(() => {
    return fundingReviews
      .filter((review) => isFundingReviewOwnedByUser(review, user))
      .map((review) => {
        const project = projects.find((item) => item.id === review.projectId);
        const isFunding = Boolean(project);
        const image = review.images[0]
          ? { uri: review.images[0] }
          : project
            ? getFundingProjectImageSource(project)!
            : require('../../../../newpicutre/bottle.jpg');
        return {
          id: review.id,
          name: isFunding ? project!.shortTitle || project!.title : review.rewardName || '나의 전통주 기록',
          brewery: isFunding ? project!.brewery : '직접 기록',
          category: isFunding ? project!.category : '일반 술',
          image,
          rating: review.rating,
          date: review.date,
          tags: review.tags,
          isFunding,
          alcohol: isFunding ? Number.parseFloat(project!.alcoholContent || '') || 6 : 0,
          fundingId: isFunding ? project!.id : undefined,
        };
      });
  }, [fundingReviews, projects, user]);

  const allDrinks = useMemo(
    () => [...savedArchiveDrinks, ...SAMPLE_FUNDING_DRINKS, ...fundedDrinks, ...GENERAL_DRINKS],
    [fundedDrinks, savedArchiveDrinks]
  );

  const filteredDrinks = useMemo(() => {
    const source =
      activeTab === 'funded'
        ? allDrinks.filter((item) => item.isFunding)
        : activeTab === 'general'
          ? allDrinks.filter((item) => !item.isFunding)
          : allDrinks;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return source;
    return source.filter((item) => {
      const haystack = [item.name, item.brewery, item.category, ...item.tags].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [activeTab, allDrinks, searchQuery]);

  const handleAddPress = () => {
    if (!user) {
      router.push('/login' as any);
      return;
    }
    router.push('/mypage/archive/add' as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.75} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>술 아카이브</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.tabTrack}>
          {(['all', 'funded', 'general'] as ArchiveTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{TAB_LABELS[tab]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="이름, 종류, 태그 등으로 검색..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.list}>
          {filteredDrinks.map((drink) => (
            <ArchiveDrinkCard key={`${drink.isFunding ? 'funded' : 'general'}-${drink.id}`} drink={drink} />
          ))}
        </View>

        {filteredDrinks.length === 0 && (
          <View style={styles.emptyBox}>
            <Wine size={46} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>경험한 술이 없습니다</Text>
            <Text style={styles.emptyDesc}>마신 술을 기록해보세요!</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.86}
        onPress={handleAddPress}
      >
        <Plus size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

function ArchiveDrinkCard({ drink }: { drink: ArchiveDrink }) {
  const goDetail = () => {
    const kind = drink.fundingId ? 'funding' : drink.id >= 100 ? 'sample' : 'archive';
    const fundingQuery = drink.fundingId ? `&fundingId=${drink.fundingId}` : '';
    router.push(`/mypage/archive/detail/${drink.id}?kind=${kind}${fundingQuery}` as any);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={goDetail}>
      <View style={styles.imageWrap}>
        <Image source={drink.image} style={styles.image} />
        {drink.isFunding && (
          <View style={styles.fundingBadge}>
            <Text style={styles.fundingBadgeText}>펀딩 술</Text>
          </View>
        )}
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.dateText}>{drink.date}</Text>
        <Text style={styles.drinkName} numberOfLines={1}>{drink.name}</Text>
        <StarRating rating={drink.rating} />
        <View style={styles.tagRow}>
          <View style={styles.tagChip}>
            <Droplet size={11} color="#6B7280" />
            <Text style={styles.tagText}>{drink.alcohol}%</Text>
          </View>
          {drink.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          <ChevronRight size={16} color="#D1D5DB" style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const half = !filled && index < rating;
        return (
          <Star
            key={index}
            size={18}
            color={filled || half ? '#F4B000' : '#E5E7EB'}
            fill={filled ? '#F4B000' : half ? '#FCD34D' : '#E5E7EB'}
          />
        );
      })}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F5' },
  header: {
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 21, fontWeight: '900', color: '#111827' },
  content: { paddingHorizontal: 24, paddingTop: 18 },
  tabTrack: { flexDirection: 'row', backgroundColor: '#F1EEEA', borderRadius: 22, padding: 5, gap: 4, marginBottom: 2 },
  tabButton: { flex: 1, height: 42, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tabButtonActive: {
    backgroundColor: '#111827',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tabText: { fontSize: 14, fontWeight: '900', color: '#8B95A1' },
  tabTextActive: { color: '#FFFFFF' },
  searchBox: {
    height: 56,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE1E7',
    marginTop: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 16, fontWeight: '700', color: '#111827' },
  list: { gap: 13 },
  card: {
    minHeight: 124,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F2',
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageWrap: { width: 96, height: 96, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  fundingBadge: { position: 'absolute', top: 7, left: 7, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 7, paddingVertical: 3 },
  fundingBadgeText: { fontSize: 9, fontWeight: '900', color: '#111827' },
  cardInfo: { flex: 1, minWidth: 0 },
  dateText: { alignSelf: 'flex-end', fontSize: 11, fontWeight: '700', color: '#8B95A1', marginBottom: 6 },
  drinkName: { fontSize: 16, fontWeight: '900', color: '#000000', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 1, marginBottom: 6 },
  ratingText: { marginLeft: 5, fontSize: 12, fontWeight: '900', color: '#111827' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  tagChip: { minHeight: 23, borderRadius: 999, backgroundColor: '#F3F4F6', paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 3 },
  tagText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  chevron: { marginLeft: 'auto' },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  emptyBox: { alignItems: 'center', paddingVertical: 82, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '900', color: '#6B7280' },
  emptyDesc: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
});
