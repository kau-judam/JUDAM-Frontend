import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Image as ImageIcon, Plus, Wand2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';

const FLAVOR_TAG_POOL = [
  '달콤함',
  '상큼함',
  '깔끔함',
  '고소함',
  '스파이시',
  '가벼움',
  '부드러움',
  '탄산감',
  '묵직함',
  '청량감',
  '씁쓸함',
  '시원함',
  '진한향',
  '꽃향기',
  '과일향',
  '구수함',
];

const ALCOHOL_RANGES = ['3%~5%', '6%~8%', '9%~12%', '13%~15%', '15% 이상'];
const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop';
const AI_SUB_INGREDIENTS = ['딸기', '바나나', '복숭아', '사과'];

type NoticeState = {
  title: string;
  body?: string;
  onConfirm?: () => void;
} | null;

export default function RecipeCreateScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [mainIngredients, setMainIngredients] = useState(['']);
  const [generatedSubIngredients, setGeneratedSubIngredients] = useState<string[]>([]);
  const [selectedSubIngredients, setSelectedSubIngredients] = useState<string[]>([]);
  const [alcoholRange, setAlcoholRange] = useState('');
  const [generatedFlavorTags, setGeneratedFlavorTags] = useState<string[]>([]);
  const [selectedFlavorTags, setSelectedFlavorTags] = useState<string[]>([]);
  const [customFlavorInput, setCustomFlavorInput] = useState('');
  const [customFlavorTags, setCustomFlavorTags] = useState<string[]>([]);
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const hasMainIngredient = mainIngredients.some((ingredient) => ingredient.trim() !== '');
  const hasSubIngredient = selectedSubIngredients.length > 0;

  const showNotice = (title: string, body?: string, onConfirm?: () => void) => {
    setNotice({ title, body, onConfirm });
  };

  const handleNoticeConfirm = () => {
    const nextAction = notice?.onConfirm;
    setNotice(null);
    nextAction?.();
  };

  const handleMainIngredientChange = (index: number, value: string) => {
    setMainIngredients((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const handleRemoveMainIngredient = (index: number) => {
    setMainIngredients((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleGenerateSubIngredients = () => {
    if (!hasMainIngredient) {
      showNotice('메인 재료를 입력해주세요.');
      return;
    }
    setGeneratedSubIngredients(AI_SUB_INGREDIENTS);
    setSelectedSubIngredients([]);
  };

  const toggleSubIngredient = (ingredient: string) => {
    setSelectedSubIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((item) => item !== ingredient) : [...prev, ingredient]
    );
  };

  const handleGenerateFlavorTags = () => {
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('메인 재료와 서브 재료를 먼저 입력해주세요.');
      return;
    }
    const shuffled = [...FLAVOR_TAG_POOL].sort(() => Math.random() - 0.5);
    setGeneratedFlavorTags(shuffled.slice(0, 4));
    setSelectedFlavorTags([]);
  };

  const toggleFlavorTag = (tag: string) => {
    setSelectedFlavorTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomFlavorTag = () => {
    const trimmed = customFlavorInput.trim();
    if (!trimmed) return;
    if (!customFlavorTags.includes(trimmed)) {
      setCustomFlavorTags((prev) => [...prev, trimmed]);
    }
    setCustomFlavorInput('');
  };

  const handleRemoveCustomFlavorTag = (tag: string) => {
    setCustomFlavorTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleGenerateSummary = () => {
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('메인 재료와 서브 재료를 먼저 입력해주세요.');
      return;
    }
    setDescription('무난한 메인 재료와 독특한 서브 재료를 가진 유니크한 술 입니다.');
  };

  const handleGenerateImage = () => {
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('메인 재료와 서브 재료를 먼저 입력해주세요.');
      return;
    }
    setImagePreview(DUMMY_IMAGE);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showNotice('갤러리 접근 권한이 필요합니다.', '이미지를 선택하려면 갤러리 접근 권한을 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });
    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !hasMainIngredient) {
      showNotice('필수항목을 모두 입력해 주세요.');
      return;
    }
    showNotice(
      '레시피가 제안되었습니다.',
      '많은 분들이 좋아하시면 양조장에서 연락을 드릴 거예요.',
      () => router.replace('/recipe' as any)
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 56 }]}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <ChevronLeft size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>레시피 제안하기</Text>
          <View style={styles.headerIconBtn} />
        </View>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedTitle}>로그인이 필요합니다</Text>
          <Text style={styles.lockedDesc}>레시피 제안은 로그인한 사용자만 이용할 수 있어요.</Text>
          <TouchableOpacity style={styles.lockedButton} onPress={() => router.push('/login' as any)}>
            <Text style={styles.lockedButtonText}>로그인하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 56 }]}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>레시피 제안하기</Text>
        <View style={styles.headerIconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 34 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Section>
          <Text style={styles.label}>레시피 제목 *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="예: 전통 누룩의 재발견 - 현대적 막걸리"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </Section>

        <Section>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>메인 재료 *</Text>
            <View style={styles.stack}>
              {mainIngredients.map((ingredient, index) => (
                <View key={index} style={styles.inputRow}>
                  <TextInput
                    value={ingredient}
                    onChangeText={(value) => handleMainIngredientChange(index, value)}
                    placeholder="예: 국내산 찹쌀"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, styles.rowInput]}
                  />
                  {mainIngredients.length > 1 && (
                    <TouchableOpacity style={styles.removeInputBtn} onPress={() => handleRemoveMainIngredient(index)}>
                      <X size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View>
            <View style={styles.sectionHead}>
              <Text style={styles.labelNoMargin}>서브 재료</Text>
              <SmallDarkButton label="AI 생성" icon={<Wand2 size={12} color="#FFF" />} onPress={handleGenerateSubIngredients} />
            </View>
            {generatedSubIngredients.length > 0 ? (
              <View style={styles.chipWrap}>
                {generatedSubIngredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    selected={selectedSubIngredients.includes(ingredient)}
                    onPress={() => toggleSubIngredient(ingredient)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.helpText}>메인 재료를 입력한 후 AI 생성 버튼을 눌러보세요.</Text>
            )}
          </View>
        </Section>

        <Section>
          <Text style={styles.label}>도수 범위</Text>
          <View style={styles.chipWrap}>
            {ALCOHOL_RANGES.map((range) => (
              <Chip
                key={range}
                label={range}
                selected={alcoholRange === range}
                onPress={() => setAlcoholRange(range)}
              />
            ))}
          </View>
        </Section>

        <Section>
          <View style={styles.sectionHead}>
            <Text style={styles.labelNoMargin}>지향하는 맛 (다중 선택 가능)</Text>
            <SmallDarkButton label="AI 생성" icon={<Wand2 size={12} color="#FFF" />} onPress={handleGenerateFlavorTags} />
          </View>
          {generatedFlavorTags.length > 0 ? (
            <View style={styles.chipWrap}>
              {generatedFlavorTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  selected={selectedFlavorTags.includes(tag)}
                  onPress={() => toggleFlavorTag(tag)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.helpText}>메인·서브 재료를 입력한 후 AI 생성 버튼을 눌러보세요.</Text>
          )}

          <View style={styles.customTagArea}>
            <Text style={styles.subLabel}>직접 입력</Text>
            <View style={styles.addTagRow}>
              <TextInput
                value={customFlavorInput}
                onChangeText={setCustomFlavorInput}
                placeholder="예: 허브향, 은은함..."
                placeholderTextColor="#9CA3AF"
                style={[styles.input, styles.tagInput]}
                returnKeyType="done"
                onSubmitEditing={handleAddCustomFlavorTag}
              />
              <TouchableOpacity style={styles.addTagBtn} onPress={handleAddCustomFlavorTag}>
                <Plus size={13} color="#FFF" />
                <Text style={styles.addTagText}>추가</Text>
              </TouchableOpacity>
            </View>
            {customFlavorTags.length > 0 && (
              <View style={[styles.chipWrap, styles.customChipWrap]}>
                {customFlavorTags.map((tag) => (
                  <View key={tag} style={styles.customChip}>
                    <Text style={styles.customChipText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => handleRemoveCustomFlavorTag(tag)}>
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Section>

        <Section>
          <Text style={styles.label}>프로젝트 컨셉</Text>
          <TextInput
            value={concept}
            onChangeText={setConcept}
            placeholder="이 술이 담고자 하는 컨셉이나 스토리를 입력해주세요."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textArea, styles.conceptArea]}
            multiline
            textAlignVertical="top"
          />
        </Section>

        <Section>
          <View style={styles.sectionHead}>
            <Text style={styles.labelNoMargin}>프로젝트 요약</Text>
            <SmallDarkButton label="AI 생성" icon={<Wand2 size={12} color="#FFF" />} onPress={handleGenerateSummary} />
          </View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="레시피 및 관련 정보를 간략하게 요약해주세요."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />
        </Section>

        <Section>
          <View style={styles.sectionHead}>
            <Text style={styles.labelNoMargin}>이미지 업로드</Text>
            <SmallDarkButton label="AI 생성" icon={<Wand2 size={12} color="#FFF" />} onPress={handleGenerateImage} />
          </View>

          {imagePreview ? (
            <View style={styles.previewBox}>
              <Image source={{ uri: imagePreview }} style={styles.previewImage} />
              <TouchableOpacity style={styles.previewRemoveBtn} onPress={() => setImagePreview(null)}>
                <X size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage} activeOpacity={0.8}>
              <ImageIcon size={34} color="#6B7280" />
              <Text style={styles.uploadText}>이미지 선택</Text>
              <Text style={styles.uploadSubText}>또는 AI 생성 버튼을 눌러보세요</Text>
            </TouchableOpacity>
          )}
        </Section>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitText}>레시피 제안하기</Text>
        </TouchableOpacity>

        <View style={styles.guideBox}>
          <Text style={styles.guideText}>
            주담은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 지향합니다. 타인을 비방하거나 모욕하는 글, 무분별한 홍보 게시물은 무통보 삭제될 수 있습니다.
          </Text>
        </View>
      </ScrollView>

      <NoticeModal notice={notice} onClose={() => setNotice(null)} onConfirm={handleNoticeConfirm} />
    </KeyboardAvoidingView>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

function SmallDarkButton({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.smallDarkBtn} onPress={onPress} activeOpacity={0.8}>
      {icon}
      <Text style={styles.smallDarkText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.chipActive]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function NoticeModal({
  notice,
  onClose,
  onConfirm,
}: {
  notice: NoticeState;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent visible={notice !== null} animationType="fade" onRequestClose={onClose}>
      <View style={styles.noticeOverlay}>
        <View style={styles.noticeCard}>
          <View style={[styles.noticeHeader, !notice?.body && styles.noticeHeaderCompact]}>
            <Text style={styles.noticeTitle}>{notice?.title}</Text>
          </View>
          {notice?.body && (
            <View style={styles.noticeBody}>
              <Text style={styles.noticeBodyText}>{notice.body}</Text>
            </View>
          )}
          <View style={styles.noticeFooter}>
            <TouchableOpacity style={styles.noticeConfirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={styles.noticeConfirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerIconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  content: { paddingHorizontal: 16, paddingTop: 20, gap: 14 },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldBlock: { marginBottom: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 12 },
  labelNoMargin: { flex: 1, fontSize: 14, fontWeight: '800', color: '#111' },
  subLabel: { fontSize: 12, fontWeight: '800', color: '#4B5563', marginBottom: 8 },
  input: {
    minHeight: 48,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowInput: { flex: 1 },
  removeInputBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  stack: { gap: 8 },
  smallDarkBtn: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  smallDarkText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  helpText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', lineHeight: 18 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  chipActive: { backgroundColor: '#111' },
  chipText: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  chipTextActive: { color: '#FFF' },
  customTagArea: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  addTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagInput: { flex: 1 },
  addTagBtn: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  addTagText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  customChipWrap: { marginTop: 10 },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  customChipText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  textArea: { minHeight: 120, paddingTop: 14, paddingBottom: 14, lineHeight: 20 },
  conceptArea: { minHeight: 100 },
  previewBox: { position: 'relative', height: 192, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  previewRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    height: 144,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
  },
  uploadText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  uploadSubText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 10 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  lockedButtonText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  guideBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  guideText: { fontSize: 12, fontWeight: '600', color: '#6B7280', lineHeight: 19 },
  noticeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  noticeCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 18,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  noticeHeader: {
    minHeight: 82,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 18,
  },
  noticeHeaderCompact: {
    minHeight: 94,
    paddingBottom: 14,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 28,
  },
  noticeBody: {
    paddingHorizontal: 28,
    paddingTop: 2,
    paddingBottom: 24,
  },
  noticeBodyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 26,
  },
  noticeFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  noticeConfirmBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeConfirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
