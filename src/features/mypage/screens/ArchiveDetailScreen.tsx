import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFundingProjectImageSource } from '@/constants/data';
import { useFunding } from '@/contexts/FundingContext';
import { deleteMyPageArchive, getMyPageApiErrorMessage, getMyPageArchiveDetail, type MyPageArchive } from '@/features/mypage/api';


type ArchiveDetailData = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  brewery?: string;
  alcohol?: string;
  userName: string;
  date: string;
  rating: number;
  body: string;
  rewardName: string;
  images: (string | ImageSourcePropType)[];
  mood?: string;
  pairing?: string;
  tags: string[];
  likes: number;
  projectId?: number;
  projectTitle?: string;
};

const SAMPLE_ARCHIVES: ArchiveDetailData[] = [
  {
    id: 201,
    title: '달빛 담은 배 막걸리',
    subtitle: '주담 테스트 양조장 · 막걸리',
    badge: '펀딩 술',
    brewery: '주담 테스트 양조장',
    alcohol: '6%',
    userName: '나',
    date: '2026.05.21',
    rating: 4.5,
    body: '펀딩으로 받아본 전통주 기록입니다. 배의 은은한 단맛과 막걸리 특유의 부드러운 질감이 잘 어울렸어요.',
    rewardName: '달빛 담은 배 막걸리 1병',
    images: [require('../../../../newpicutre/funding3.jpg')],
    mood: '기다린 만큼 반가웠던 날',
    pairing: '감자전',
    tags: ['부드러움', '은은한단맛'],
    likes: 0,
  },
  {
    id: 101,
    title: '안동 증류식 소주',
    subtitle: '안동양조 · 소주',
    badge: '일반 술',
    alcohol: '13%',
    userName: '나',
    date: '2025.02.20',
    rating: 4,
    body: '향은 깔끔하고 끝맛은 묵직했어요. 기름진 음식과 같이 마셨을 때 밸런스가 좋았습니다.',
    rewardName: '안동 증류식 소주',
    images: [require('../../../../newpicutre/bottle.jpg')],
    mood: '차분하게 마신 날',
    pairing: '전, 묵은지',
    tags: ['깔끔함', '묵직함'],
    likes: 0,
  },
  {
    id: 102,
    title: '꽃향기 주',
    subtitle: '과일청양조 · 청주',
    badge: '일반 술',
    alcohol: '6%',
    userName: '나',
    date: '2025.01.30',
    rating: 5,
    body: '과실 향이 먼저 올라오고 뒤에는 은은한 단맛이 남았습니다. 가볍게 마시기 좋았어요.',
    rewardName: '꽃향기 주',
    images: [require('../../../../newpicutre/food.jpg')],
    mood: '기분 좋은 저녁',
    pairing: '치즈, 과일',
    tags: ['과일향', '깔끔함'],
    likes: 0,
  },
  {
    id: 103,
    title: '감귤 막걸리',
    subtitle: '꽃담양조 · 막걸리',
    badge: '일반 술',
    alcohol: '6%',
    userName: '나',
    date: '2025.01.15',
    rating: 4.5,
    body: '상큼한 감귤 향이 막걸리의 부드러운 질감과 잘 어울렸습니다.',
    rewardName: '감귤 막걸리',
    images: [require('../../../../newpicutre/funding3.jpg')],
    mood: '가볍게 들뜬 날',
    pairing: '감자전',
    tags: ['상큼함', '과일향'],
    likes: 0,
  },
];

function getImageSource(image: string | ImageSourcePropType) {
  return typeof image === 'string' ? { uri: image } : image;
}

export default function ArchiveDetailScreen() {
  const insets = useSafeAreaInsets();
  const { archiveId, kind, fundingId } = useLocalSearchParams<{ archiveId?: string; kind?: string; fundingId?: string }>();
  const { projects, participatedFundings, fundingReviews, deleteFundingReview } = useFunding();
  const [showMenu, setShowMenu] = useState(false);
  const [serverArchive, setServerArchive] = useState<MyPageArchive | null>(null);
  const targetArchiveId = Number(Array.isArray(archiveId) ? archiveId[0] : archiveId);
  const targetFundingId = Number(Array.isArray(fundingId) ? fundingId[0] : fundingId);
  const rawKind = Array.isArray(kind) ? kind[0] : kind;

  useEffect(() => {
    if (!Number.isFinite(targetArchiveId) || rawKind === 'sample' || rawKind === 'funding') return;
    let mounted = true;
    getMyPageArchiveDetail(targetArchiveId)
      .then((nextArchive) => {
        if (!mounted) return;
        setServerArchive(nextArchive);
      })
      .catch((error) => {
        console.warn(getMyPageApiErrorMessage(error, '아카이브 상세 정보를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [rawKind, targetArchiveId]);

  const archive = useMemo<ArchiveDetailData | null>(() => {
    if (serverArchive) {
      const localArchive = fundingReviews.find((item) => item.id === serverArchive.archiveId);
      return {
        id: serverArchive.archiveId,
        title: serverArchive.drinkName || '나의 전통주 기록',
        subtitle: serverArchive.archiveType === 'FUNDING' ? '펀딩 술' : '직접 기록',
        badge: serverArchive.archiveType === 'FUNDING' ? '펀딩' : '일반 술',
        alcohol: serverArchive.abv ? `${serverArchive.abv}%` : undefined,
        userName: '',
        date: serverArchive.recordDate || serverArchive.createdAt?.slice(0, 10) || '',
        rating: serverArchive.rating || 0,
        body: serverArchive.tastingNote || '',
        rewardName: serverArchive.drinkName || '나의 전통주 기록',
        images: serverArchive.images.map((image) => image.imageUrl),
        mood: serverArchive.mood || localArchive?.mood,
        pairing: serverArchive.pairing || localArchive?.pairing,
        tags: serverArchive.tags.map((tag) => tag.name),
        likes: 0,
        projectId: serverArchive.fundingId || undefined,
      };
    }

    if (rawKind === 'sample') {
      return SAMPLE_ARCHIVES.find((item) => item.id === targetArchiveId) || null;
    }

    const savedReview = fundingReviews.find((item) => item.id === targetArchiveId);
    if (savedReview) {
      const project = projects.find((item) => item.id === savedReview.projectId);
      const savedAlcohol = !project ? savedReview.tags.find((tag) => /%/.test(tag)) : undefined;
      return {
        id: savedReview.id,
        title: project?.shortTitle || project?.title || savedReview.rewardName || '나의 전통주 기록',
        subtitle: project ? `${project.brewery} · ${project.category}` : '직접 기록',
        badge: project ? '펀딩 술' : '일반 술',
        brewery: project?.brewery,
        alcohol: project?.alcoholContent || savedAlcohol,
        userName: savedReview.userName,
        date: savedReview.date,
        rating: savedReview.rating,
        body: savedReview.comment,
        rewardName: savedReview.rewardName,
        images: savedReview.images,
        mood: savedReview.mood,
        pairing: savedReview.pairing,
        tags: savedAlcohol ? savedReview.tags.filter((tag) => tag !== savedAlcohol) : savedReview.tags,
        likes: savedReview.likes,
        projectId: savedReview.projectId,
        projectTitle: project?.title,
      };
    }

    if (rawKind === 'funding') {
      const project = projects.find((item) => item.id === targetFundingId);
      const participation = participatedFundings.find((item) => item.fundingId === targetFundingId);
      if (!project) return null;
      return {
        id: project.id,
        title: project.shortTitle || project.title,
        subtitle: `${project.brewery} · ${project.category}`,
        badge: '펀딩 술',
        brewery: project.brewery,
        alcohol: project.alcoholContent,
        userName: '나',
        date: participation?.date || '기록 전',
        rating: 0,
        body: '아직 작성된 아카이브 기록이 없습니다. 새 기록을 작성해 이 술의 맛과 분위기를 남겨보세요.',
        rewardName: project.rewardItems?.[0] || `${project.bottleSize || '375ml'} 1병`,
        images: [getFundingProjectImageSource(project)].filter(Boolean) as ImageSourcePropType[],
        tags: project.tags || [],
        likes: 0,
        projectId: project.id,
        projectTitle: project.title,
      };
    }

    return null;
  }, [fundingReviews, participatedFundings, projects, rawKind, serverArchive, targetArchiveId, targetFundingId]);

  const savedArchive = useMemo(
    () => fundingReviews.find((item) => item.id === targetArchiveId) || null,
    [fundingReviews, targetArchiveId]
  );

  const handleEdit = () => {
    setShowMenu(false);
    if (serverArchive) {
      const editType = serverArchive.archiveType === 'FUNDING' ? 'funding' : 'normal';
      const fundingQuery = serverArchive.fundingId ? `&fundingId=${serverArchive.fundingId}` : '';
      router.replace(`/mypage/archive/write?type=${editType}&editId=${serverArchive.archiveId}${fundingQuery}` as any);
      return;
    }
    if (savedArchive) {
      const editType = savedArchive.projectId === 0 ? 'normal' : 'funding';
      const fundingQuery = savedArchive.projectId === 0 ? '' : `&fundingId=${savedArchive.projectId}`;
      router.replace(`/mypage/archive/write?type=${editType}&editId=${savedArchive.id}${fundingQuery}` as any);
      return;
    }
    if (rawKind === 'funding' && archive?.projectId) {
      router.replace(`/mypage/archive/write?type=funding&fundingId=${archive.projectId}` as any);
      return;
    }
    Alert.alert('수정할 수 없어요', '샘플 기록은 수정 화면으로 불러올 수 없습니다.');
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (serverArchive) {
      try {
        await deleteMyPageArchive(serverArchive.archiveId);
        router.replace('/mypage/archive' as any);
      } catch (error) {
        Alert.alert('삭제 실패', getMyPageApiErrorMessage(error, '아카이브를 삭제하지 못했습니다.'));
      }
      return;
    }
    if (!savedArchive) {
      Alert.alert('삭제할 수 없어요', '저장된 기록만 삭제할 수 있습니다.');
      return;
    }
    deleteFundingReview(savedArchive.id);
    router.replace('/mypage/archive' as any);
  };


  if (!archive) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <Text style={styles.noticeTitle}>기록을 찾을 수 없습니다</Text>
        <Text style={styles.noticeBody}>요청한 아카이브 기록이 없거나 삭제되었습니다.</Text>
        <TouchableOpacity style={styles.noticeButton} onPress={() => router.back()}>
          <Text style={styles.noticeButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 술 기록</Text>
        <View style={styles.menuWrap}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowMenu((prev) => !prev)}>
            <MoreVertical size={22} color="#111827" />
          </TouchableOpacity>
          {showMenu && (
            <View style={styles.menuBox}>
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Text style={styles.menuText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={handleDelete}>
                <Text style={styles.menuText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.detailDate}>{archive.date}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.archiveTitle}>{archive.title}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{archive.badge}</Text>
          </View>
        </View>
        {archive.brewery ? <Text style={styles.breweryName}>{archive.brewery}</Text> : null}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={18} color={star <= archive.rating ? '#F59E0B' : '#D1D5DB'} fill={star <= archive.rating ? '#F59E0B' : 'transparent'} />
          ))}
          <Text style={styles.ratingText}>{archive.rating > 0 ? archive.rating.toFixed(1) : '-'}</Text>
        </View>
        <Text style={styles.reviewBody}>{archive.body}</Text>

        {(archive.alcohol || archive.tags.length > 0) && (
          <View style={styles.tagWrap}>
            {archive.alcohol ? (
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>{archive.alcohol}</Text>
              </View>
            ) : null}
            {archive.tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {(archive.mood || archive.pairing) && (
          <View style={styles.recordBox}>
            <Text style={styles.recordTitle}>그날의 기록</Text>
            {archive.mood ? (
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>기분</Text>
                <Text style={styles.recordValue}>{archive.mood}</Text>
              </View>
            ) : null}
            {archive.pairing ? (
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>함께한 안주</Text>
                <Text style={styles.recordValue}>{archive.pairing}</Text>
              </View>
            ) : null}
          </View>
        )}

        {archive.images.length > 0 && (
          <View style={archive.images.length === 1 ? styles.imageSingleGrid : styles.imageGrid}>
            {archive.images.map((image, index) => (
              <View key={index} style={archive.images.length === 1 ? styles.reviewSingleImageWrap : styles.reviewImageWrap}>
                <Image source={getImageSource(image)} style={styles.reviewImage} />
              </View>
            ))}
          </View>
        )}

      </ScrollView>
</View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 56, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '900', color: '#111827' },
  menuWrap: { position: 'relative' },
  menuBox: {
    position: 'absolute',
    top: 42,
    right: 4,
    minWidth: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 13 },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  menuText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  detailDate: { fontSize: 13, fontWeight: '800', color: '#9CA3AF', marginBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 5 },
  typeBadge: { borderRadius: 999, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5 },
  typeBadgeText: { fontSize: 12, fontWeight: '900', color: '#4B5563' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 18 },
  ratingText: { marginLeft: 6, fontSize: 13, fontWeight: '900', color: '#4B5563' },
  archiveTitle: { flex: 1, minWidth: 0, fontSize: 24, lineHeight: 30, fontWeight: '900', color: '#111827' },
  breweryName: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginBottom: 12 },
  reviewBody: { fontSize: 16, lineHeight: 26, fontWeight: '600', color: '#111827', marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 22 },
  tagChip: { alignSelf: 'flex-start', justifyContent: 'center', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, lineHeight: 13, fontWeight: '900', color: '#4B5563', includeFontPadding: false },
  recordBox: { backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, gap: 8, marginBottom: 16 },
  recordTitle: { fontSize: 14, fontWeight: '900', color: '#111827' },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recordLabel: { width: 82, fontSize: 12, fontWeight: '800', color: '#6B7280' },
  recordValue: { flex: 1, fontSize: 13, fontWeight: '800', color: '#111827' },
  imageSingleGrid: { marginBottom: 18 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  reviewSingleImageWrap: { width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  reviewImageWrap: { width: '48%', height: 168, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  reviewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  noticeScreen: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 8 },
  noticeBody: { fontSize: 14, lineHeight: 22, color: '#6B7280', textAlign: 'center', fontWeight: '700', marginBottom: 22 },
  noticeButton: { height: 48, borderRadius: 14, backgroundColor: '#111827', paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  noticeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
