import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, BookOpen, Camera, Check, ChevronDown, ChevronLeft, ChevronUp, Star, Wine, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import FundingAlertModal, { type FundingAlertButton, type FundingAlertTone } from '@/features/funding/components/FundingAlertModal';
import { reviewPresetTags } from '@/features/funding/reviews';
import {
  createMyPageArchiveWithImages,
  getMyPageApiErrorMessage,
  getMyPageArchiveDetail,
  getMyPageArchiveTags,
  getMyPageFundingArchiveReview,
  getMyPageParticipatedFundings,
  updateMyPageArchiveWithImages,
  type MyPageArchiveImage,
  type MyPageImageUploadFile,
  type MyPageParticipatedFunding,
} from '@/features/mypage/api';
import { pickMultipleImages } from '@/utils/imagePicker';

type ArchiveKind = 'normal' | 'funding';

type ArchiveAlert = {
  title: string;
  body: string;
  tone?: FundingAlertTone;
  buttons?: FundingAlertButton[];
};

const ARCHIVE_TAG_ID_BY_NAME: Record<string, number> = {
  달콤한: 21,
  깔끔한: 22,
  묵직한: 23,
  산미있는: 24,
  쓴맛: 25,
  고소한: 26,
  부드러운: 27,
  탄산있는: 28,
  구수한: 29,
  과일향: 30,
  혼술: 11,
  친구모임: 32,
  데이트: 33,
  특별한날: 34,
  식사중: 35,
  야외: 36,
  집들이: 37,
  기념일: 14,
  행복한: 39,
  설레는: 40,
  그리운: 41,
  편안한: 17,
  들뜬: 43,
  차분한: 44,
};

function getTodayArchiveDate() {
  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
}

function parseArchiveDateParts(date: string) {
  const [year = '', month = '', day = ''] = date.match(/\d+/g) || [];
  return { year, month, day };
}

function formatArchiveApiDate(year: string, month: string, day: string) {
  return `${year.trim()}-${month.trim().padStart(2, '0')}-${day.trim().padStart(2, '0')}`;
}

function getArchiveImageFile(uri: string, index: number): MyPageImageUploadFile {
  const name = uri.split('/').pop() || `archive-${Date.now()}-${index + 1}.jpg`;
  const extension = name.split('.').pop()?.toLowerCase();
  const type = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
  return { uri, name, type };
}

function isLocalArchiveImage(uri: string) {
  return !/^https?:\/\//i.test(uri);
}

function parseAbv(value: string) {
  const number = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function getArchiveTagIds(tags: string[], tagIdByName: Record<string, number>) {
  return tags
    .map((tag) => tagIdByName[tag])
    .filter((tagId): tagId is number => Number.isFinite(tagId));
}

function isSuccessfulParticipatedFunding(funding: Pick<MyPageParticipatedFunding, 'fundingStatus'>) {
  const status = String(funding.fundingStatus || '').trim();
  const normalized = status.toUpperCase();
  return normalized === 'SUCCESS' || status.includes('성공') || status.includes('달성');
}

function RatingStars({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <View style={styles.ratingWrap}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} style={styles.ratingButton} activeOpacity={0.75} onPress={() => onChange(star)}>
          <Star size={32} color={value >= star ? '#F59E0B' : '#E5E7EB'} fill={value >= star ? '#F59E0B' : '#F3F4F6'} />
        </TouchableOpacity>
      ))}
      <Text style={value > 0 ? styles.ratingValue : styles.ratingPlaceholder}>
        {value > 0 ? value.toFixed(1) : '별점을 선택해주세요'}
      </Text>
    </View>
  );
}

function normalizeReviewImages(images: MyPageArchiveImage[]) {
  return images
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.imageUrl)
    .filter(Boolean)
    .slice(0, 3);
}

export default function ArchiveWriteScreen() {
  const insets = useSafeAreaInsets();
  const { type, fundingId, orderId, reviewId, editId } = useLocalSearchParams<{
    type?: string;
    fundingId?: string;
    orderId?: string;
    reviewId?: string;
    editId?: string;
  }>();
  const archiveKind: ArchiveKind = type === 'funding' ? 'funding' : 'normal';
  const projectId = Number(Array.isArray(fundingId) ? fundingId[0] : fundingId);
  const routeOrderId = Number(Array.isArray(orderId) ? orderId[0] : orderId);
  const routeReviewId = Number(Array.isArray(reviewId) ? reviewId[0] : reviewId);
  const targetEditId = Number(Array.isArray(editId) ? editId[0] : editId);
  const isEditMode = Number.isFinite(targetEditId);
  const { user } = useAuth();

  const initialDateParts = useMemo(() => parseArchiveDateParts(getTodayArchiveDate()), []);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState<MyPageParticipatedFunding | null>(null);
  const [drinkName, setDrinkName] = useState('');
  const [drinkAlcohol, setDrinkAlcohol] = useState('');
  const [recordYear, setRecordYear] = useState(initialDateParts.year);
  const [recordMonth, setRecordMonth] = useState(initialDateParts.month);
  const [recordDay, setRecordDay] = useState(initialDateParts.day);
  const [rating, setRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFilesByUri, setImageFilesByUri] = useState<Record<string, MyPageImageUploadFile>>({});
  const [serverImageIdsByUrl, setServerImageIdsByUrl] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState('');
  const [mood, setMood] = useState('');
  const [pairing, setPairing] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagIdByName, setTagIdByName] = useState<Record<string, number>>(ARCHIVE_TAG_ID_BY_NAME);
  const [openTagSection, setOpenTagSection] = useState<string | null>('맛·향');
  const [alertModal, setAlertModal] = useState<ArchiveAlert | null>(null);

  useEffect(() => {
    let mounted = true;
    getMyPageArchiveTags()
      .then((groups) => {
        if (!mounted) return;
        const nextMap = { ...ARCHIVE_TAG_ID_BY_NAME };
        groups.forEach((group) => {
          group.tags.forEach((tag) => {
            nextMap[tag.name] = tag.tagId;
          });
        });
        setTagIdByName(nextMap);
      })
      .catch((error) => {
        console.warn(getMyPageApiErrorMessage(error, '아카이브 태그 목록을 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (archiveKind !== 'funding' || !Number.isFinite(projectId)) return;
    let mounted = true;
    setIsInitialLoading(true);
    getMyPageParticipatedFundings()
      .then((items) => {
        if (!mounted) return;
        const matchedFunding = items.find((item) => item.fundingId === projectId);
        setSelectedFunding(matchedFunding && isSuccessfulParticipatedFunding(matchedFunding) ? matchedFunding : null);
      })
      .catch((error) => {
        console.warn(getMyPageApiErrorMessage(error, '참여 펀딩 정보를 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (mounted) setIsInitialLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [archiveKind, projectId]);

  useEffect(() => {
    if (!isEditMode || !Number.isFinite(targetEditId)) return;
    let mounted = true;
    setIsInitialLoading(true);
    getMyPageArchiveDetail(targetEditId)
      .then((archive) => {
        if (!mounted) return;
        const dateParts = parseArchiveDateParts(archive.recordDate || '');
        setDrinkName(archive.drinkName || '');
        setDrinkAlcohol(archive.abv ? `${archive.abv}%` : '');
        setRecordYear(dateParts.year || initialDateParts.year);
        setRecordMonth(dateParts.month || initialDateParts.month);
        setRecordDay(dateParts.day || initialDateParts.day);
        setRating(archive.rating || 0);
        setReviewText(archive.tastingNote || '');
        setMood(archive.mood || '');
        setPairing(archive.pairing || '');
        setUploadedImages(archive.images.map((image) => image.imageUrl));
        setImageFilesByUri({});
        setServerImageIdsByUrl(
          archive.images.reduce<Record<string, number>>((map, image) => {
            map[image.imageUrl] = image.imageId;
            return map;
          }, {})
        );
        setSelectedTags(archive.tags.filter((tag) => tag.category !== 'CUSTOM').map((tag) => tag.name));
        setCustomTags(archive.tags.filter((tag) => tag.category === 'CUSTOM').map((tag) => tag.name));
      })
      .catch((error) => {
        console.warn(getMyPageApiErrorMessage(error, '아카이브 상세 정보를 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (mounted) setIsInitialLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialDateParts.day, initialDateParts.month, initialDateParts.year, isEditMode, targetEditId]);

  const allTags = [...selectedTags, ...customTags];
  const headerTitle = isEditMode ? '술 기록 수정' : archiveKind === 'funding' ? '펀딩 술 기록' : '일반 술 기록';
  const fundingReviewId = Number.isFinite(routeReviewId) ? routeReviewId : selectedFunding?.reviewId || undefined;
  const fundingOrderId = Number.isFinite(routeOrderId) ? routeOrderId : selectedFunding?.orderId;
  const fundingAbv = selectedFunding?.abv ?? parseAbv(drinkAlcohol);
  const fundingProjectName = selectedFunding?.projectName || drinkName;
  const fundingBreweryName = selectedFunding?.breweryName || '양조장';
  const fundingIngredients = selectedFunding?.ingredients || '재료 정보 없음';
  const rewardName = archiveKind === 'funding' ? selectedFunding?.drinkName || fundingProjectName : drinkName.trim();
  const canUseFundingArchive = archiveKind !== 'funding' || Boolean(selectedFunding) || isEditMode;

  const showAlert = (title: string, body: string, tone: FundingAlertTone = 'info', buttons?: FundingAlertButton[]) => {
    setAlertModal({ title, body, tone, buttons });
  };

  const pickImages = async () => {
    const remaining = 3 - uploadedImages.length;
    const result = await pickMultipleImages('archive', remaining, 0.9);
    if (result.canceled && result.denied) {
      showAlert('권한 필요', '사진을 첨부하려면 갤러리 접근 권한이 필요합니다.', 'warning');
      return;
    }
    if (result.canceled) return;
    setUploadedImages((prev) => [...prev, ...result.files.map((file) => file.uri)].slice(0, 3));
    setImageFilesByUri((prev) => {
      const next = { ...prev };
      result.files.forEach((file) => {
        next[file.uri] = file;
      });
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const addCustomTag = () => {
    const tag = customInput.trim().replace(/^#/, '');
    if (tag && !allTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag]);
    }
    setCustomInput('');
  };

  const loadExistingFundingReview = async () => {
    if (archiveKind !== 'funding' || !Number.isFinite(projectId)) {
      showAlert('후기를 불러올 수 없어요', '선택한 펀딩 정보를 확인하지 못했습니다.', 'warning');
      return;
    }

    try {
      const review = await getMyPageFundingArchiveReview(projectId);
      if (!review) {
        showAlert('불러올 후기가 없어요', '이 펀딩에 작성한 후기가 아직 없습니다.', 'info');
        return;
      }

      setRating(review.rating || 0);
      setReviewText(review.tastingNote || '');
      setMood(review.mood || '');
      setPairing(review.pairing || '');
      setUploadedImages(normalizeReviewImages(review.images || []));
      setImageFilesByUri({});
      setServerImageIdsByUrl(
        (review.images || []).reduce<Record<string, number>>((map, image) => {
          map[image.imageUrl] = image.imageId;
          return map;
        }, {})
      );
      showAlert('후기를 불러왔어요', '작성해둔 펀딩 후기를 아카이브 기록에 채웠습니다.', 'success');
    } catch (error) {
      showAlert('후기 불러오기 실패', getMyPageApiErrorMessage(error, '후기를 불러오지 못했습니다.'), 'warning');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      showAlert('로그인이 필요합니다', '아카이브 기록은 로그인 후 이용할 수 있습니다.', 'info', [
        { label: '로그인하기', onPress: () => router.push('/login' as any) },
        { label: '닫기', variant: 'secondary' },
      ]);
      return;
    }
    if (!canUseFundingArchive) {
      showAlert('펀딩 성공 후 기록할 수 있습니다', '펀딩 성공으로 종료된 술만 아카이브에 기록할 수 있습니다.', 'warning');
      return;
    }
    if (archiveKind === 'normal' && !drinkName.trim()) {
      showAlert('술 이름 입력', '기록할 술 이름을 입력해주세요.', 'warning');
      return;
    }
    if (archiveKind === 'normal' && !drinkAlcohol.trim()) {
      showAlert('도수 입력', '기록할 술의 도수를 입력해주세요.', 'warning');
      return;
    }
    if (!recordYear.trim() || !recordMonth.trim() || !recordDay.trim()) {
      showAlert('기록 날짜 입력', '기록 날짜를 입력해주세요.', 'warning');
      return;
    }
    if (rating === 0) {
      showAlert('별점 입력', '별점을 선택해주세요.', 'warning');
      return;
    }
    if (!reviewText.trim()) {
      showAlert('상세 기록 입력', '마신 경험을 기록해주세요.', 'warning');
      return;
    }
    if (!mood.trim() || !pairing.trim()) {
      showAlert('그날의 기록 입력', '기분과 함께한 안주를 모두 입력해주세요.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const newImages = uploadedImages
        .filter(isLocalArchiveImage)
        .map((uri, index) => imageFilesByUri[uri] || getArchiveImageFile(uri, index));
      const deletedServerImageIds = Object.entries(serverImageIdsByUrl)
        .filter(([imageUrl]) => !uploadedImages.includes(imageUrl))
        .map(([, imageId]) => imageId);
      const basePayload = {
        archiveType: archiveKind === 'funding' ? ('FUNDING' as const) : ('NORMAL' as const),
        customName: rewardName || undefined,
        category: '전통주',
        abv: archiveKind === 'normal' ? parseAbv(drinkAlcohol) : fundingAbv,
        rating,
        tastingNote: reviewText.trim(),
        recordDate: formatArchiveApiDate(recordYear, recordMonth, recordDay),
        mood: mood.trim(),
        pairing: pairing.trim(),
        tagIds: getArchiveTagIds(selectedTags, tagIdByName),
        customTags,
      };

      const savedArchive = isEditMode
        ? await updateMyPageArchiveWithImages(targetEditId, {
            ...basePayload,
            deleteImageIds: deletedServerImageIds,
            images: newImages,
          })
        : await createMyPageArchiveWithImages({
            ...basePayload,
            fundingId: archiveKind === 'funding' ? projectId : undefined,
            orderId: archiveKind === 'funding' ? fundingOrderId : undefined,
            reviewId: archiveKind === 'funding' ? fundingReviewId : undefined,
            images: newImages,
          });

      showAlert(isEditMode ? '수정 완료' : '저장 완료', '아카이브 기록이 저장되었습니다.', 'success', [
        {
          label: '확인',
          onPress: () => {
            if (savedArchive.archiveId) {
              router.replace(`/mypage/archive/detail/${savedArchive.archiveId}?kind=archive` as any);
              return;
            }
            router.replace('/mypage/archive' as any);
          },
        },
      ]);
    } catch (error) {
      showAlert('저장 실패', getMyPageApiErrorMessage(error, '기록을 저장하지 못했습니다. 다시 시도해주세요.'), 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  if (archiveKind === 'funding' && isInitialLoading && !selectedFunding && !isEditMode) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <ActivityIndicator color="#111827" />
        <Text style={styles.noticeTitle}>펀딩 정보를 불러오는 중</Text>
      </View>
    );
  }

  if (archiveKind === 'funding' && !selectedFunding && !isEditMode) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <AlertCircle size={44} color="#F59E0B" />
        <Text style={styles.noticeTitle}>펀딩 성공 후 기록할 수 있습니다</Text>
        <Text style={styles.noticeBody}>펀딩 성공으로 종료된 술만 아카이브에 기록할 수 있습니다.</Text>
        <TouchableOpacity style={styles.noticeButton} onPress={() => router.back()}>
          <Text style={styles.noticeButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.summaryCard}>
          {archiveKind === 'funding' ? (
            <>
              {selectedFunding?.thumbnailUrl ? (
                <Image source={{ uri: selectedFunding.thumbnailUrl }} style={styles.summaryImage} />
              ) : (
                <View style={styles.normalIconBox}>
                  <Wine size={27} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryBadge}>펀딩 술</Text>
                <Text style={styles.summaryTitle} numberOfLines={2}>
                  {fundingProjectName}
                </Text>
                <Text style={styles.summarySub} numberOfLines={1}>
                  {fundingBreweryName} · {fundingIngredients}
                </Text>
              </View>
              <TouchableOpacity style={styles.loadButton} onPress={loadExistingFundingReview}>
                <Text style={styles.loadButtonText}>후기 불러오기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.normalIconBox}>
                <BookOpen size={27} color="#FFFFFF" />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryBadge}>일반 술</Text>
                <Text style={styles.summaryTitle}>새로운 술 기록</Text>
                <Text style={styles.summarySub}>펀딩과 별개로 자유롭게 기록해요.</Text>
              </View>
            </>
          )}
        </View>

        {archiveKind === 'normal' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>술 이름 *</Text>
            <TextInput style={styles.input} value={drinkName} onChangeText={setDrinkName} placeholder="예: 안동 증류식 소주" placeholderTextColor="#9CA3AF" />
            <Text style={styles.fieldLabel}>도수 *</Text>
            <TextInput style={styles.input} value={drinkAlcohol} onChangeText={setDrinkAlcohol} placeholder="예: 6%" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" />
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>기록 날짜 *</Text>
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputGroup}>
              <TextInput style={styles.dateInput} value={recordYear} onChangeText={setRecordYear} placeholder="2026" placeholderTextColor="#9CA3AF" keyboardType="number-pad" maxLength={4} />
              <Text style={styles.dateInputLabel}>년</Text>
            </View>
            <View style={styles.dateInputGroup}>
              <TextInput style={styles.dateInput} value={recordMonth} onChangeText={setRecordMonth} placeholder="05" placeholderTextColor="#9CA3AF" keyboardType="number-pad" maxLength={2} />
              <Text style={styles.dateInputLabel}>월</Text>
            </View>
            <View style={styles.dateInputGroup}>
              <TextInput style={styles.dateInput} value={recordDay} onChangeText={setRecordDay} placeholder="21" placeholderTextColor="#9CA3AF" keyboardType="number-pad" maxLength={2} />
              <Text style={styles.dateInputLabel}>일</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>사진 첨부 (최대 3장)</Text>
          <View style={styles.imageRow}>
            {uploadedImages.map((image, index) => (
              <View key={`${image}-${index}`} style={styles.imageThumbWrap}>
                <Image source={{ uri: image }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.imageRemove} onPress={() => {
                  setUploadedImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
                  setImageFilesByUri((prev) => {
                    const next = { ...prev };
                    delete next[image];
                    return next;
                  });
                }}>
                  <X size={13} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {uploadedImages.length < 3 && (
              <TouchableOpacity style={styles.imageAddButton} onPress={pickImages}>
                <Camera size={22} color="#9CA3AF" />
                <Text style={styles.imageAddText}>추가</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>이 술은 어땠나요? *</Text>
          <RatingStars value={rating} onChange={setRating} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>상세 기록 *</Text>
          <TextInput
            style={styles.reviewTextArea}
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="맛, 향, 질감, 좋았던 점을 자유롭게 남겨주세요."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.countText}>{reviewText.length}자</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>그날의 기록 *</Text>
          <Text style={styles.fieldLabel}>어떤 기분이었나요?</Text>
          <TextInput style={styles.input} value={mood} onChangeText={setMood} placeholder="예: 오래 기다린 만큼 설레요" placeholderTextColor="#9CA3AF" />
          <Text style={styles.fieldLabel}>함께한 안주</Text>
          <TextInput style={styles.input} value={pairing} onChangeText={setPairing} placeholder="예: 파전, 묵은지" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>태그</Text>
          <View style={styles.tagSections}>
            {Object.entries(reviewPresetTags).map(([section, tags]) => {
              const selectedCount = selectedTags.filter((tag) => tags.includes(tag)).length;
              const opened = openTagSection === section;
              return (
                <View key={section} style={styles.tagSection}>
                  <TouchableOpacity style={styles.tagSectionHeader} onPress={() => setOpenTagSection(opened ? null : section)} activeOpacity={0.82}>
                    <Text style={styles.tagSectionTitle}>{section}</Text>
                    <View style={styles.tagSectionRight}>
                      {selectedCount > 0 && (
                        <View style={styles.tagCountBadge}>
                          <Text style={styles.tagCountText}>{selectedCount}</Text>
                        </View>
                      )}
                      {opened ? <ChevronUp size={17} color="#9CA3AF" /> : <ChevronDown size={17} color="#9CA3AF" />}
                    </View>
                  </TouchableOpacity>
                  {opened && (
                    <View style={styles.tagWrap}>
                      {tags.map((tag) => {
                        const selected = selectedTags.includes(tag);
                        return (
                          <TouchableOpacity key={tag} style={[styles.tagButton, selected && styles.tagButtonActive]} onPress={() => toggleTag(tag)}>
                            {selected && <Check size={12} color="#FFFFFF" />}
                            <Text style={[styles.tagButtonText, selected && styles.tagButtonTextActive]}>{tag}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.customTagInputRow}>
            <TextInput
              style={styles.customTagInput}
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="나만의 태그 추가..."
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              onSubmitEditing={addCustomTag}
            />
            <TouchableOpacity style={[styles.customTagAdd, !customInput.trim() && styles.customTagAddDisabled]} onPress={addCustomTag} disabled={!customInput.trim()}>
              <Text style={styles.customTagAddText}>추가</Text>
            </TouchableOpacity>
          </View>
          {customTags.length > 0 && (
            <View style={styles.customTagWrap}>
              {customTags.map((tag) => (
                <TouchableOpacity key={tag} style={styles.customTagPill} onPress={() => setCustomTags((prev) => prev.filter((item) => item !== tag))}>
                  <Text style={styles.customTagPillText}>#{tag}</Text>
                  <X size={12} color="#FFFFFF" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={[styles.submitButton, isSaving && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>{isEditMode ? '수정 완료하기' : '아카이브 저장하기'}</Text>}
        </TouchableOpacity>
      </ScrollView>

      <FundingAlertModal
        visible={Boolean(alertModal)}
        title={alertModal?.title || ''}
        body={alertModal?.body || ''}
        tone={alertModal?.tone}
        buttons={alertModal?.buttons}
        onClose={() => setAlertModal(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F5F7' },
  header: { minHeight: 56, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '900', color: '#111827' },
  content: { padding: 16, gap: 16 },
  summaryCard: { position: 'relative', minHeight: 94, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryImage: { width: 66, height: 66, borderRadius: 14, backgroundColor: '#E5E7EB' },
  normalIconBox: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  summaryInfo: { flex: 1, minWidth: 0 },
  summaryBadge: { alignSelf: 'flex-start', fontSize: 10, fontWeight: '900', color: '#FFFFFF', backgroundColor: '#111827', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginBottom: 6 },
  summaryTitle: { fontSize: 15, lineHeight: 21, fontWeight: '900', color: '#111827' },
  summarySub: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#9CA3AF', marginTop: 3 },
  loadButton: { position: 'absolute', top: 14, right: 14, minHeight: 32, borderRadius: 11, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  loadButtonText: { fontSize: 12, fontWeight: '900', color: '#111827' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#F3F4F6' },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#111827', marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginTop: 8, marginBottom: 6 },
  input: { height: 46, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, color: '#111827', fontSize: 14, fontWeight: '700' },
  dateInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateInputGroup: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 5 },
  dateInput: { flex: 1, minWidth: 0, height: 38, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 8, color: '#111827', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  dateInputLabel: { fontSize: 13, fontWeight: '900', color: '#6B7280' },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageThumbWrap: { width: 82, height: 82, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  imageThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageRemove: { position: 'absolute', top: 5, right: 5, width: 23, height: 23, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.62)', alignItems: 'center', justifyContent: 'center' },
  imageAddButton: { width: 82, height: 82, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', gap: 4 },
  imageAddText: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  ratingButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  ratingValue: { marginLeft: 6, fontSize: 24, fontWeight: '900', color: '#111827' },
  ratingPlaceholder: { marginLeft: 6, fontSize: 13, fontWeight: '800', color: '#9CA3AF' },
  reviewTextArea: { minHeight: 132, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 14, fontSize: 14, color: '#111827', lineHeight: 21, fontWeight: '700' },
  countText: { alignSelf: 'flex-end', fontSize: 11, fontWeight: '700', color: '#D1D5DB', marginTop: 5 },
  tagSections: { gap: 8 },
  tagSection: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
  tagSectionHeader: { minHeight: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagSectionTitle: { fontSize: 13, fontWeight: '900', color: '#374151' },
  tagSectionRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tagCountBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  tagCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  tagButton: { minHeight: 32, borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 11 },
  tagButtonActive: { backgroundColor: '#111827', borderColor: '#111827' },
  tagButtonText: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  tagButtonTextActive: { color: '#FFFFFF' },
  customTagInputRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  customTagInput: { flex: 1, height: 42, borderRadius: 13, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 12, color: '#111827', fontSize: 13, fontWeight: '700' },
  customTagAdd: { height: 42, borderRadius: 13, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  customTagAddDisabled: { opacity: 0.35 },
  customTagAddText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  customTagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 },
  customTagPill: { minHeight: 30, borderRadius: 999, backgroundColor: '#111827', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10 },
  customTagPillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  submitButton: { height: 56, borderRadius: 18, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { opacity: 0.65 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  noticeScreen: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 28 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  noticeBody: { fontSize: 14, lineHeight: 22, color: '#6B7280', fontWeight: '700', textAlign: 'center', marginBottom: 22 },
  noticeButton: { height: 50, borderRadius: 15, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  noticeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
