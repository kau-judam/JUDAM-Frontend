import React, { useMemo, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, BookOpen, Camera, Check, ChevronDown, ChevronLeft, ChevronUp, Star, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFundingProjectImageSource, type FundingProject } from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import FundingAlertModal, { type FundingAlertButton, type FundingAlertTone } from '@/features/funding/components/FundingAlertModal';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { isFundingReviewOwnedByUser, reviewPresetTags } from '@/features/funding/reviews';

type ArchiveKind = 'normal' | 'funding';

type ArchiveAlert = {
  title: string;
  body: string;
  tone?: FundingAlertTone;
  buttons?: FundingAlertButton[];
};

const NORMAL_ARCHIVE_PROJECT_ID = 0;
const ARCHIVE_DUMMY_FUNDING_PROJECT: FundingProject = {
  id: -1001,
  title: '아카이브 테스트 펀딩 전통주',
  brewery: '주담 테스트 양조장',
  location: '서울',
  category: '막걸리',
  image: '',
  localImage: require('../../../../newpicutre/funding3.jpg'),
  goalAmount: 3000000,
  currentAmount: 3000000,
  backers: 128,
  daysLeft: 0,
  status: '완료' as FundingProject['status'],
  bottleSize: '375ml',
  alcoholContent: '6%',
  rewardItems: ['테스트 리워드 1병'],
  mainIngredients: '쌀',
};

function getTodayArchiveDate() {
  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
}

function parseArchiveDateParts(date: string) {
  const [year = '', month = '', day = ''] = date.match(/\d+/g) || [];
  return { year, month, day };
}

function formatArchiveDate(year: string, month: string, day: string) {
  return `${year.trim()}. ${month.trim().padStart(2, '0')}. ${day.trim().padStart(2, '0')}`;
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

export default function ArchiveWriteScreen() {
  const insets = useSafeAreaInsets();
  const { type, fundingId } = useLocalSearchParams<{ type?: string; fundingId?: string }>();
  const archiveKind: ArchiveKind = type === 'funding' ? 'funding' : 'normal';
  const projectId = Number(Array.isArray(fundingId) ? fundingId[0] : fundingId);
  const { user } = useAuth();
  const { projects, fundingReviews, addFundingReview } = useFunding();

  const project = useMemo(
    () =>
      archiveKind === 'funding'
        ? projects.find((item) => item.id === projectId) || (projectId === ARCHIVE_DUMMY_FUNDING_PROJECT.id ? ARCHIVE_DUMMY_FUNDING_PROJECT : null)
        : null,
    [archiveKind, projectId, projects]
  );
  const ownExistingFundingReview = useMemo(
    () =>
      archiveKind === 'funding'
        ? fundingReviews.find((item) => item.projectId === projectId && isFundingReviewOwnedByUser(item, user)) || null
        : null,
    [archiveKind, fundingReviews, projectId, user]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [drinkName, setDrinkName] = useState('');
  const [drinkAlcohol, setDrinkAlcohol] = useState('');
  const initialDateParts = useMemo(() => parseArchiveDateParts(getTodayArchiveDate()), []);
  const [recordYear, setRecordYear] = useState(initialDateParts.year);
  const [recordMonth, setRecordMonth] = useState(initialDateParts.month);
  const [recordDay, setRecordDay] = useState(initialDateParts.day);
  const [rating, setRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [mood, setMood] = useState('');
  const [pairing, setPairing] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [openTagSection, setOpenTagSection] = useState<string | null>('留쎛룻뼢');
  const [alertModal, setAlertModal] = useState<ArchiveAlert | null>(null);

  const allTags = [...selectedTags, ...customTags];
  const recordDate = formatArchiveDate(recordYear, recordMonth, recordDay);
  const headerTitle = archiveKind === 'funding' ? '펀딩 술 기록' : '일반 술 기록';
  const rewardName = archiveKind === 'funding'
    ? project?.rewardItems?.[0] || `${project?.bottleSize || '375ml'} 1병`
    : drinkName.trim();

  const showAlert = (title: string, body: string, tone: FundingAlertTone = 'info', buttons?: FundingAlertButton[]) => {
    setAlertModal({ title, body, tone, buttons });
  };

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert('권한 필요', '사진을 첨부하려면 갤러리 접근 권한이 필요합니다.', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 3 - uploadedImages.length,
      quality: 0.9,
    });

    if (result.canceled) return;
    const uris = result.assets.map((asset) => asset.uri).filter(Boolean);
    setUploadedImages((prev) => [...prev, ...uris].slice(0, 3));
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

  const loadExistingFundingReview = () => {
    if (!ownExistingFundingReview) {
      showAlert('불러올 후기가 없어요', '이 펀딩에 작성한 후기가 아직 없습니다.', 'info');
      return;
    }

    const loadedDateParts = parseArchiveDateParts(ownExistingFundingReview.date || getTodayArchiveDate());
    setRating(ownExistingFundingReview.rating);
    setRecordYear(loadedDateParts.year);
    setRecordMonth(loadedDateParts.month);
    setRecordDay(loadedDateParts.day);
    setUploadedImages(ownExistingFundingReview.images || []);
    setReviewText(ownExistingFundingReview.comment || '');
    setMood(ownExistingFundingReview.mood || '');
    setPairing(ownExistingFundingReview.pairing || '');
    setSelectedTags(ownExistingFundingReview.tags.filter((tag) => Object.values(reviewPresetTags).flat().includes(tag)));
    setCustomTags(ownExistingFundingReview.tags.filter((tag) => !Object.values(reviewPresetTags).flat().includes(tag)));
    const firstOpenSection = Object.entries(reviewPresetTags).find(([, tags]) =>
      tags.some((tag) => ownExistingFundingReview.tags.includes(tag))
    )?.[0];
    setOpenTagSection(firstOpenSection || '留쎛룻뼢');
    showAlert('후기를 불러왔어요', '작성해둔 펀딩 후기를 아카이브 기록에 채웠습니다.', 'success');
  };

  const handleSubmit = () => {
    if (!user) {
      showAlert('로그인이 필요합니다', '아카이브 기록은 로그인 후 이용할 수 있습니다.', 'info', [
        { label: '로그인하기', onPress: () => router.push('/login' as any) },
        { label: '닫기', variant: 'secondary' },
      ]);
      return;
    }
    if (archiveKind === 'funding' && !project) {
      showAlert('프로젝트를 찾을 수 없습니다', '선택한 펀딩 술 정보를 다시 확인해주세요.', 'warning');
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
      showAlert('상세 기록 입력', '마신 느낌을 기록해주세요.', 'warning');
      return;
    }
    if (!mood.trim() || !pairing.trim()) {
      showAlert('그날의 기록 입력', '기분과 함께한 안주를 모두 입력해주세요.', 'warning');
      return;
    }

    setIsSaving(true);
    const saved = addFundingReview({
      projectId: archiveKind === 'funding' ? projectId : NORMAL_ARCHIVE_PROJECT_ID,
      userId: user.id,
      userName: user.name || '사용자',
      date: recordDate.trim(),
      rating,
      comment: reviewText.trim(),
      rewardName: rewardName || '나의 전통주 기록',
      images: uploadedImages,
      mood: mood.trim(),
      pairing: pairing.trim(),
      showRecordInReview: false,
      tags: archiveKind === 'normal' ? [drinkAlcohol.trim(), ...allTags] : allTags,
    });
    setIsSaving(false);

    if (!saved) {
      showAlert('저장 실패', '기록을 저장하지 못했습니다. 다시 시도해주세요.', 'warning');
      return;
    }
    showAlert('저장 완료', '내 아카이브에 기록이 저장되었습니다.', 'success', [
      { label: '확인', onPress: () => router.replace('/mypage/archive' as any) },
    ]);
  };

  if (archiveKind === 'funding' && !project) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <AlertCircle size={44} color="#F59E0B" />
        <Text style={styles.noticeTitle}>프로젝트를 찾을 수 없습니다</Text>
        <Text style={styles.noticeBody}>아카이브에 기록할 펀딩 술 정보가 없습니다.</Text>
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
          {archiveKind === 'funding' && project ? (
            <>
              <Image source={getFundingProjectImageSource(project)} style={styles.summaryImage} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryBadge}>펀딩 술</Text>
                <Text style={styles.summaryTitle} numberOfLines={2}>{project.title}</Text>
                <Text style={styles.summarySub}>{project.brewery} · {getFundingMainIngredientLabel(project)}</Text>
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
                <Text style={styles.summarySub}>펀딩과 별개로 자유롭게 기록해요</Text>
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
                <TouchableOpacity style={styles.imageRemove} onPress={() => setUploadedImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
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
          <TextInput style={styles.input} value={mood} onChangeText={setMood} placeholder="예: 오래 기다린 만큼 설렜어요" placeholderTextColor="#9CA3AF" />
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
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>아카이브 저장하기</Text>}
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
