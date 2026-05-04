import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { AlertCircle, Camera, Check, ChevronDown, ChevronLeft, ChevronUp, Plus, Star, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFundingProjectImageSource } from '@/constants/data';
import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { reviewPresetTags } from '@/features/funding/reviews';
import { showLoginRequired } from '@/utils/authPrompt';

function RatingStars({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <View style={styles.ratingWrap}>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => {
          const full = value >= star;
          const half = !full && value >= star - 0.5;
          return (
            <View key={star} style={styles.ratingStarBox}>
              <Star size={36} color="#E5E7EB" fill="#F3F4F6" />
              {full && <Star size={36} color="#F59E0B" fill="#F59E0B" style={styles.ratingStarFill} />}
              {half && (
                <View style={styles.ratingHalfFill}>
                  <Star size={36} color="#F59E0B" fill="#F59E0B" />
                </View>
              )}
              <TouchableOpacity style={[styles.ratingHitArea, styles.ratingHitLeft]} onPress={() => onChange(star - 0.5)} />
              <TouchableOpacity style={[styles.ratingHitArea, styles.ratingHitRight]} onPress={() => onChange(star)} />
            </View>
          );
        })}
      </View>
      <Text style={value > 0 ? styles.ratingValue : styles.ratingPlaceholder}>
        {value > 0 ? value.toFixed(1) : '별점을 선택해주세요'}
      </Text>
    </View>
  );
}

export default function FundingReviewWriteScreen() {
  const insets = useSafeAreaInsets();
  const { fundingId } = useLocalSearchParams<{ fundingId?: string }>();
  const { user } = useAuth();
  const { projects, participatedFundings, addFundingReview } = useFunding();
  const projectId = Number(Array.isArray(fundingId) ? fundingId[0] : fundingId);
  const project = useMemo(() => projects.find((item) => item.id === projectId) || null, [projectId, projects]);
  const hasParticipated = Boolean(user) && participatedFundings.some((item) => item.fundingId === projectId);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [openSection, setOpenSection] = useState<string | null>('맛·향');
  const [reviewText, setReviewText] = useState('');
  const [mood, setMood] = useState('');
  const [pairing, setPairing] = useState('');
  const [showRecordInReview, setShowRecordInReview] = useState(false);

  const allTags = [...selectedTags, ...customTags];
  const rewardName = project?.rewardItems?.[0] || `${project?.bottleSize || '375ml'} 1병`;

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

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '후기 사진을 첨부하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }

    const remaining = 3 - uploadedImages.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.9,
    });

    if (result.canceled) return;
    const selected = result.assets.map((asset) => asset.uri).filter(Boolean);
    setUploadedImages((prev) => [...prev, ...selected].slice(0, 3));
  };

  const handleSubmit = async () => {
    if (!user) {
      showLoginRequired('후기 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    if (rating === 0) {
      Alert.alert('별점 입력', '별점을 입력해주세요.');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('상세 후기 입력', '후기 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const createdReview = addFundingReview({
      projectId,
      userName: user.name || '사용자',
      rating,
      comment: reviewText.trim(),
      rewardName,
      images: uploadedImages,
      mood: mood.trim(),
      pairing: pairing.trim(),
      showRecordInReview,
      tags: allTags,
    });
    setIsLoading(false);
    Alert.alert('후기가 등록되었습니다!', '소중한 후기를 남겨주셔서 감사합니다.', [
      { text: '확인', onPress: () => router.replace(`/funding/${projectId}/review/${createdReview.id}` as any) },
    ]);
  };

  if (!project) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <AlertCircle size={44} color="#F59E0B" />
        <Text style={styles.noticeTitle}>프로젝트를 찾을 수 없습니다</Text>
        <Text style={styles.noticeBody}>후기를 작성할 펀딩 프로젝트 정보가 없습니다.</Text>
        <TouchableOpacity style={styles.noticeButton} onPress={() => router.back()}>
          <Text style={styles.noticeButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user || !hasParticipated) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <AlertCircle size={48} color="#F59E0B" />
        <Text style={styles.noticeTitle}>{user ? '리뷰 작성 권한이 없습니다' : '로그인이 필요합니다'}</Text>
        <Text style={styles.noticeBody}>
          {user ? '이 펀딩 프로젝트에 참여한 사용자만 리뷰를 작성할 수 있습니다.' : '후기 작성은 로그인 후 이용할 수 있습니다.'}
        </Text>
        <TouchableOpacity style={styles.noticeButton} onPress={() => (user ? router.back() : showLoginRequired('후기 작성은 로그인 후 이용할 수 있어요.'))}>
          <Text style={styles.noticeButtonText}>{user ? '돌아가기' : '로그인 안내 보기'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>펀딩 술 후기 작성</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 36 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.projectCard}>
          <Image source={getFundingProjectImageSource(project)} style={styles.projectImage} />
          <View style={styles.projectInfo}>
            <View style={styles.projectMetaRow}>
              <Text style={styles.projectBadge}>펀딩 술</Text>
              <Text style={styles.projectCategory}>{project.category}</Text>
            </View>
            <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
            <Text style={styles.projectBrewery}>{project.brewery}</Text>
            <Text style={styles.projectReward} numberOfLines={1}>{rewardName}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>사진 첨부 (최대 3장)</Text>
          <View style={styles.imageRow}>
            {uploadedImages.map((image, index) => (
              <View key={`${image}-${index}`} style={styles.imageThumbWrap}>
                <Image source={{ uri: image }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.imageRemove} onPress={() => setUploadedImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}>
                  <X size={13} color="#FFF" />
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
          <Text style={styles.sectionTitle}>이 술이 마음에 드셨나요? *</Text>
          <RatingStars value={rating} onChange={setRating} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>상세 후기 *</Text>
          <TextInput
            style={styles.reviewTextArea}
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="맛, 향, 질감, 기대와 비교해서 어떠셨나요? 솔직하게 남겨주세요."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.countText}>{reviewText.length}자</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>그날의 기록 (선택)</Text>
          <Text style={styles.sectionSub}>아카이브에는 자동 기록되고, 아래 선택에 따라 후기에도 표시됩니다.</Text>
          <Text style={styles.fieldLabel}>어떤 기분이었나요?</Text>
          <TextInput style={styles.input} value={mood} onChangeText={setMood} placeholder="예: 설레고 기대됐어요" placeholderTextColor="#9CA3AF" />
          <Text style={styles.fieldLabel}>함께한 안주</Text>
          <TextInput style={styles.input} value={pairing} onChangeText={setPairing} placeholder="예: 파전, 두부김치" placeholderTextColor="#9CA3AF" />
          <TouchableOpacity style={styles.recordToggle} activeOpacity={0.85} onPress={() => setShowRecordInReview((prev) => !prev)}>
            <View style={[styles.recordCheckbox, showRecordInReview && styles.recordCheckboxActive]}>
              {showRecordInReview && <Check size={14} color="#FFF" />}
            </View>
            <View style={styles.recordToggleTextArea}>
              <Text style={styles.recordToggleTitle}>후기에도 표시하도록 할까요?</Text>
              <Text style={styles.recordToggleSub}>체크하면 기분과 함께한 안주가 후기 게시글에 함께 보입니다.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>태그</Text>
          <View style={styles.tagSections}>
            {Object.entries(reviewPresetTags).map(([section, tags]) => {
              const selectedCount = selectedTags.filter((tag) => tags.includes(tag)).length;
              const opened = openSection === section;
              return (
                <View key={section} style={styles.tagSection}>
                  <TouchableOpacity style={styles.tagSectionHeader} onPress={() => setOpenSection(opened ? null : section)}>
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
                            {selected && <Check size={12} color="#FFF" />}
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

          <View style={styles.customTagBox}>
            <Text style={styles.customTagTitle}>직접 입력</Text>
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
                <Plus size={17} color="#FFF" />
              </TouchableOpacity>
            </View>
            {customTags.length > 0 && (
              <View style={styles.customTagWrap}>
                {customTags.map((tag) => (
                  <TouchableOpacity key={tag} style={styles.customTagPill} onPress={() => setCustomTags((prev) => prev.filter((item) => item !== tag))}>
                    <Text style={styles.customTagPillText}>#{tag}</Text>
                    <X size={12} color="#FFF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {allTags.length > 0 && (
            <View style={styles.selectedTagWrap}>
              {allTags.map((tag) => (
                <Text key={tag} style={styles.selectedTagText}>#{tag}</Text>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>후기 등록하기</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F5F7' },
  header: { minHeight: 56, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '900', color: '#111' },
  content: { padding: 16, gap: 16 },
  projectCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', gap: 12 },
  projectImage: { width: 66, height: 66, borderRadius: 14, backgroundColor: '#E5E7EB' },
  projectInfo: { flex: 1, minWidth: 0, justifyContent: 'center' },
  projectMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  projectBadge: { fontSize: 10, fontWeight: '900', color: '#FFF', backgroundColor: '#111', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  projectCategory: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },
  projectTitle: { fontSize: 14, lineHeight: 20, fontWeight: '900', color: '#111' },
  projectBrewery: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginTop: 3 },
  projectReward: { alignSelf: 'flex-start', fontSize: 11, fontWeight: '900', color: '#4B5563', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, marginTop: 7, maxWidth: '100%' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#F3F4F6' },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#111', marginBottom: 12 },
  sectionSub: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', lineHeight: 18, marginTop: -6, marginBottom: 14 },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageThumbWrap: { width: 82, height: 82, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  imageThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageRemove: { position: 'absolute', top: 5, right: 5, width: 23, height: 23, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.62)', alignItems: 'center', justifyContent: 'center' },
  imageAddButton: { width: 82, height: 82, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', gap: 4 },
  imageAddText: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },
  ratingWrap: { gap: 8 },
  ratingStars: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingStarBox: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  ratingStarFill: { position: 'absolute' },
  ratingHalfFill: { position: 'absolute', left: 1, top: 1, width: 18, height: 36, overflow: 'hidden' },
  ratingHitArea: { position: 'absolute', top: 0, bottom: 0, width: 19 },
  ratingHitLeft: { left: 0 },
  ratingHitRight: { right: 0 },
  ratingValue: { fontSize: 26, fontWeight: '900', color: '#111' },
  ratingPlaceholder: { fontSize: 13, fontWeight: '800', color: '#9CA3AF' },
  reviewTextArea: { minHeight: 132, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 14, fontSize: 14, color: '#111', lineHeight: 21, fontWeight: '700' },
  countText: { alignSelf: 'flex-end', fontSize: 11, fontWeight: '700', color: '#D1D5DB', marginTop: 5 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginTop: 8, marginBottom: 6 },
  input: { height: 46, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, color: '#111', fontSize: 14, fontWeight: '700' },
  recordToggle: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, marginTop: 14 },
  recordCheckbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', marginTop: 1 },
  recordCheckboxActive: { backgroundColor: '#111', borderColor: '#111' },
  recordToggleTextArea: { flex: 1, minWidth: 0 },
  recordToggleTitle: { fontSize: 13, fontWeight: '900', color: '#111', marginBottom: 3 },
  recordToggleSub: { fontSize: 12, fontWeight: '700', color: '#6B7280', lineHeight: 18 },
  tagSections: { gap: 8 },
  tagSection: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
  tagSectionHeader: { minHeight: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagSectionTitle: { fontSize: 13, fontWeight: '900', color: '#374151' },
  tagSectionRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tagCountBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  tagCountText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 14 },
  tagButton: { minHeight: 32, borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 11 },
  tagButtonActive: { backgroundColor: '#111', borderColor: '#111' },
  tagButtonText: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  tagButtonTextActive: { color: '#FFF' },
  customTagBox: { marginTop: 10, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14 },
  customTagTitle: { fontSize: 13, fontWeight: '900', color: '#374151', marginBottom: 8 },
  customTagInputRow: { flexDirection: 'row', gap: 8 },
  customTagInput: { flex: 1, height: 42, borderRadius: 13, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', paddingHorizontal: 12, color: '#111', fontSize: 13, fontWeight: '700' },
  customTagAdd: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  customTagAddDisabled: { opacity: 0.35 },
  customTagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 },
  customTagPill: { minHeight: 30, borderRadius: 999, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10 },
  customTagPillText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  selectedTagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  selectedTagText: { fontSize: 12, fontWeight: '800', color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  submitButton: { height: 56, borderRadius: 18, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { opacity: 0.65 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  noticeScreen: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 28 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  noticeBody: { fontSize: 14, lineHeight: 22, color: '#6B7280', fontWeight: '700', textAlign: 'center', marginBottom: 22 },
  noticeButton: { height: 50, borderRadius: 15, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  noticeButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
});
