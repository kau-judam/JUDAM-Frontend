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
import { router, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Image as ImageIcon, Plus, Wand2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { recipesData } from '@/constants/data';
import { createFundingDraft, generateFundingDraftAiImage } from '@/features/funding/api';
import { normalizeFundingImageUrls } from '@/features/funding/imageUrls';
import {
  createRecipe,
  decodeRecipeJwtPayload,
  fetchIngredientRegions,
  getRecipeAccessToken,
  isJwtExpired,
  suggestRecipeSubIngredients,
  suggestRecipeFlavorTags,
  suggestRecipeSummary,
} from '@/features/recipe/api';
import { markCurrentUserRecipe } from '@/features/recipe/interestState';

const ALCOHOL_RANGES = ['3%~5%', '6%~8%', '9%~12%', '13%~15%', '15% 이상'];
const RECIPE_AI_IMAGE_STORAGE_ROOT = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
const RECIPE_AI_IMAGE_CACHE_DIR = `${RECIPE_AI_IMAGE_STORAGE_ROOT}judam-recipe-ai-images/`;

type SubIngredientRegionSuggestion = {
  region: string;
  subIngredients: string[];
};


type NoticeState = {
  title: string;
  body?: string;
  onConfirm?: () => void;
} | null;

function isRemoteRecipeImageUri(uri?: string | null) {
  return Boolean(uri && /^https?:\/\//i.test(uri));
}

function getRecipeImageFileName(uri: string) {
  const rawName = uri.split('?')[0]?.split('#')[0]?.split('/').pop();
  const decodedName = rawName ? decodeURIComponent(rawName) : '';
  const safeName = (decodedName || `recipe-ai-${Date.now()}.jpg`).replace(/[^\w.-]+/g, '-');
  return safeName.includes('.') ? safeName : `${safeName}.jpg`;
}

function getRecipeImageMimeType(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

async function downloadRecipeAiImageForUpload(imageUrl: string) {
  if (!RECIPE_AI_IMAGE_STORAGE_ROOT) {
    throw new Error('AI 생성 이미지를 업로드할 임시 저장소를 찾을 수 없습니다.');
  }

  const fileName = getRecipeImageFileName(imageUrl);
  await FileSystem.makeDirectoryAsync(RECIPE_AI_IMAGE_CACHE_DIR, { intermediates: true });
  const targetUri = `${RECIPE_AI_IMAGE_CACHE_DIR}${Date.now()}-${fileName}`;
  const result = await FileSystem.downloadAsync(imageUrl, targetUri);
  if (result.status < 200 || result.status >= 300) {
    throw new Error('AI 생성 이미지 파일을 내려받지 못했습니다.');
  }

  const info = await FileSystem.getInfoAsync(result.uri);
  if (!info.exists) {
    throw new Error('AI 생성 이미지 파일을 확인하지 못했습니다.');
  }

  return {
    uri: result.uri,
    name: fileName,
    type: getRecipeImageMimeType(fileName),
  };
}

export default function RecipeCreateScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ editRecipeId?: string }>();
  const { user } = useAuth();
  const editRecipeId = Number(Array.isArray(params.editRecipeId) ? params.editRecipeId[0] : params.editRecipeId);
  const editRecipe = recipesData.find((recipe) => recipe.id === editRecipeId);
  const [title, setTitle] = useState(editRecipe?.title || '');
  const [mainIngredients, setMainIngredients] = useState(
    editRecipe?.ingredients?.length ? editRecipe.ingredients.slice(0, 3) : ['']
  );
  const [subIngredientRegions, setSubIngredientRegions] = useState<SubIngredientRegionSuggestion[]>([]);
  const [selectedSubIngredientRegion, setSelectedSubIngredientRegion] =
    useState<SubIngredientRegionSuggestion | null>(null);
  const [generatedSubIngredients, setGeneratedSubIngredients] = useState<string[]>([]);
  const [selectedSubIngredients, setSelectedSubIngredients] = useState<string[]>([]);
  const [alcoholRange, setAlcoholRange] = useState('');
  const [generatedFlavorTags, setGeneratedFlavorTags] = useState<string[]>([]);
  const [selectedFlavorTags, setSelectedFlavorTags] = useState<string[]>([]);
  const [customFlavorInput, setCustomFlavorInput] = useState('');
  const [customFlavorTags, setCustomFlavorTags] = useState<string[]>([]);
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState(editRecipe?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isGeneratingRecipeImage, setIsGeneratingRecipeImage] = useState(false);
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

  const getMainIngredientText = () => mainIngredients.map((ingredient) => ingredient.trim()).filter(Boolean).join(', ');

  const getSelectedFlavorTags = () => [...selectedFlavorTags, ...customFlavorTags];

  const getCurrentBreweryId = () => {
    if (!user || user.type !== 'brewery') return null;
    const breweryId = Number(user.id);
    return Number.isFinite(breweryId) && breweryId > 0 ? breweryId : null;
  };

  const getAiAbvRangeText = () => {
    if (!alcoholRange) return '';
    if (alcoholRange.includes('이상')) return alcoholRange.replace('%', '도');
    return `${alcoholRange.replace(/%/g, '')}도`;
  };

  const getApiErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

  const handleGenerateSubIngredients = async () => {
    if (!hasMainIngredient) {
      showNotice('\uBA54\uC778 \uC7AC\uB8CC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.');
      return;
    }
    const mainIngredient = getMainIngredientText();
    try {
      console.log('Recipe ingredient region request', { ingredient: mainIngredient });
      const regions = await fetchIngredientRegions(mainIngredient);
      console.log('Recipe ingredient region response', regions);
      if (regions.length === 0) {
        setSubIngredientRegions([]);
        setSelectedSubIngredientRegion(null);
        setGeneratedSubIngredients([]);
        setSelectedSubIngredients([]);
        showNotice(
          '\uC0DD\uC0B0\uC9C0\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694.',
          '\uD574\uB2F9 \uBA54\uC778 \uC7AC\uB8CC\uC758 \uC0DD\uC0B0\uC9C0 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.'
        );
        return;
      }
      setSubIngredientRegions(regions.map((region) => ({ region, subIngredients: [] })));
      setSelectedSubIngredientRegion(null);
      setGeneratedSubIngredients([]);
      setSelectedSubIngredients([]);
    } catch (error) {
      console.warn('Failed to fetch ingredient regions', error);
      showNotice(
        'AI \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.',
        getApiErrorMessage(error, '\uC0DD\uC0B0\uC9C0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.')
      );
    }
  };

  const handleSelectSubIngredientRegion = async (suggestion: SubIngredientRegionSuggestion) => {
    const isSameRegion = selectedSubIngredientRegion?.region === suggestion.region;
    setSelectedSubIngredientRegion(suggestion);
    setSelectedSubIngredients([]);
    if (isSameRegion && suggestion.subIngredients.length > 0) {
      setGeneratedSubIngredients(suggestion.subIngredients);
      return;
    }
    try {
      const payload = {
        main_ingredient: getMainIngredientText(),
        mainIngredient: getMainIngredientText(),
        region: suggestion.region,
      };
      console.log('Recipe sub ingredient AI request', payload);
      const subIngredients = await suggestRecipeSubIngredients(payload);
      console.log('Recipe sub ingredient AI response', subIngredients);
      setSubIngredientRegions((prev) =>
        prev.map((item) =>
          item.region === suggestion.region ? { ...item, subIngredients } : item
        )
      );
      setGeneratedSubIngredients(subIngredients);
      if (subIngredients.length === 0) {
        showNotice(
          '\uCD94\uCC9C\uD560 \uC11C\uBE0C \uC7AC\uB8CC\uAC00 \uC5C6\uC5B4\uC694.',
          '\uD574\uB2F9 \uC9C0\uC5ED\uC5D0\uC11C \uCD94\uCC9C \uAC00\uB2A5\uD55C \uC11C\uBE0C \uC7AC\uB8CC\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694.'
        );
      }
    } catch (error) {
      console.warn('Failed to suggest recipe sub ingredients', error);
      showNotice(
        'AI \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.',
        getApiErrorMessage(error, '\uC11C\uBE0C \uC7AC\uB8CC\uB97C \uCD94\uCC9C\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.')
      );
    }
  };

  const toggleSubIngredient = (ingredient: string) => {
    setSelectedSubIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((item) => item !== ingredient) : [...prev, ingredient]
    );
  };

  const handleGenerateFlavorTags = async () => {
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('메인 재료와 서브 재료를 먼저 입력해주세요.');
      return;
    }
    try {
      const payload = {
        title: title.trim(),
        main_ingredient: getMainIngredientText(),
        sub_ingredients: selectedSubIngredients,
        abv_range: getAiAbvRangeText(),
      };
      console.log('Recipe flavor tag AI request', payload);
      const suggestions = await suggestRecipeFlavorTags({
        title: payload.title,
        main_ingredient: payload.main_ingredient,
        sub_ingredients: payload.sub_ingredients,
        abv_range: payload.abv_range,
      });
      console.log('Recipe flavor tag AI response', suggestions);
      if (suggestions.length === 0) {
        console.warn('Recipe flavor tag AI returned an empty array.');
      }
      setGeneratedFlavorTags(suggestions);
      setSelectedFlavorTags([]);
    } catch (error) {
      console.warn('Failed to suggest recipe flavor tags', error);
      showNotice('AI 생성에 실패했습니다.', getApiErrorMessage(error, '맛 태그를 추천하지 못했어요.'));
    }
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

  const handleGenerateSummary = async () => {
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('메인 재료와 서브 재료를 먼저 입력해주세요.');
      return;
    }
    try {
      const summary = await suggestRecipeSummary({
        title: title.trim(),
        main_ingredient: getMainIngredientText(),
        sub_ingredients: selectedSubIngredients,
        abv_range: getAiAbvRangeText(),
        flavor_tags: getSelectedFlavorTags(),
        concept: concept.trim() || null,
      });
      setDescription(summary);
    } catch (error) {
      console.warn('Failed to suggest recipe summary', error);
      showNotice('AI 생성에 실패했습니다.', getApiErrorMessage(error, '요약문을 추천하지 못했어요.'));
    }
  };

  const handleGenerateImage = async () => {
    if (isGeneratingRecipeImage) return;
    if (!hasMainIngredient || !hasSubIngredient) {
      showNotice('\uBA54\uC778 \uC7AC\uB8CC\uC640 \uC11C\uBE0C \uC7AC\uB8CC\uB97C \uBA3C\uC800 \uC785\uB825\uD574\uC8FC\uC138\uC694.');
      return;
    }
    const breweryId = getCurrentBreweryId();
    if (!breweryId) {
      showNotice(
        'AI \uC774\uBBF8\uC9C0 \uC0DD\uC131\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC5B4\uC694.',
        '\uD380\uB529 AI \uC774\uBBF8\uC9C0 API\uB294 \uC591\uC870\uC7A5 \uC784\uC2DC\uC800\uC7A5 draftId\uAC00 \uD544\uC694\uD574\uC11C \uC591\uC870\uC7A5 \uACC4\uC815\uC5D0\uC11C\uB9CC \uD638\uCD9C\uD560 \uC218 \uC788\uC5B4\uC694.'
      );
      return;
    }
    setIsGeneratingRecipeImage(true);
    try {
      const mainIngredient = getMainIngredientText();
      const selectedTags = getSelectedFlavorTags();
      const draft = await createFundingDraft({
        breweryId,
        title: title.trim() || mainIngredient,
        mainIngredient,
        subIngredient: selectedSubIngredients.join(', '),
        summary: description.trim() || concept.trim(),
      });
      const payload = {
        name: title.trim() || mainIngredient,
        description: description.trim() || concept.trim() || [mainIngredient, selectedSubIngredients.join(', ')].filter(Boolean).join(', '),
        flavorTags: selectedTags,
        region: user?.breweryLocation || '',
      };
      console.log('Recipe image AI request via funding API', { draftId: draft.draftId, ...payload });
      const result = await generateFundingDraftAiImage(draft.draftId, payload);
      console.log('Recipe image AI response via funding API', result);
      const responseImageUrls = normalizeFundingImageUrls(result.images);
      const generatedImageUrls = responseImageUrls.length
        ? responseImageUrls
        : normalizeFundingImageUrls([result.imageUrl, result.thumbnailUrl]);
      const nextImageUrl = generatedImageUrls[0];
      if (!nextImageUrl) {
        showNotice(
          'AI \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.',
          result.message || '\uC0DD\uC131\uB41C \uC774\uBBF8\uC9C0 URL\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC5B4\uC694.'
        );
        return;
      }
      setImagePreview(nextImageUrl);
      setImageAsset(null);
    } catch (error) {
      console.warn('Failed to generate recipe image via funding AI image API', error);
      showNotice(
        'AI \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.',
        getApiErrorMessage(error, '\uC774\uBBF8\uC9C0\uB97C \uC0DD\uC131\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.')
      );
    } finally {
      setIsGeneratingRecipeImage(false);
    }
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
      const asset = result.assets[0];
      setImagePreview(asset.uri);
      setImageAsset(asset);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageAsset(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !hasMainIngredient) {
      showNotice('필수 항목을 모두 입력해 주세요.');
      return;
    }
    if (!alcoholRange) {
      showNotice('도수 범위를 선택해 주세요.');
      return;
    }
    if (getSelectedFlavorTags().length === 0) {
      showNotice('지향하는 맛을 선택하거나 직접 입력해 주세요.');
      return;
    }
    if (!concept.trim()) {
      showNotice('프로젝트 컨셉을 입력해 주세요.');
      return;
    }
    if (!description.trim()) {
      showNotice('프로젝트 요약을 입력해 주세요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showNotice('API 로그인 연결 후 이용할 수 있어요.');
      return;
    }
    if (isJwtExpired(token)) {
      showNotice('로그인 시간이 만료되었습니다.', '다시 로그인한 뒤 레시피를 제안해 주세요.');
      return;
    }
    const tokenPayload = decodeRecipeJwtPayload(token);
    if (!tokenPayload?.role) {
      showNotice(
        '레시피 작성용 토큰이 필요합니다.',
        '현재 저장된 토큰에는 권한 정보가 없어 레시피 작성자를 확인할 수 없습니다. role이 포함된 access token으로 다시 로그인해 주세요.'
      );
      return;
    }
    try {
      let uploadImage = imageAsset
        ? {
            uri: imageAsset.uri,
            name: imageAsset.fileName,
            type: imageAsset.mimeType,
          }
        : null;
      if (!uploadImage && isRemoteRecipeImageUri(imagePreview)) {
        try {
          uploadImage = await downloadRecipeAiImageForUpload(imagePreview as string);
        } catch (error) {
          console.warn('Failed to prepare generated recipe image for upload', error);
          showNotice(
            'AI 생성 이미지를 준비하지 못했습니다.',
            error instanceof Error ? error.message : '이미지를 다시 생성한 뒤 레시피를 제안해주세요.'
          );
          return;
        }
      }
      console.log('Recipe create request', {
        title: title.trim(),
        abv_range: alcoholRange,
        main_ingredient: getMainIngredientText(),
        sub_ingredient: selectedSubIngredients.join(', '),
        target_flavor: getSelectedFlavorTags().join(', '),
        hasImageAsset: Boolean(imageAsset),
        hasUploadImage: Boolean(uploadImage),
        imageUrl: !imageAsset && imagePreview ? imagePreview : undefined,
        imageName: uploadImage?.name,
        imageType: uploadImage?.type,
        imageUri: uploadImage?.uri,
      });
      const createdRecipe = await createRecipe({
        title: title.trim(),
        content: description.trim() || concept.trim(),
        abv_range: alcoholRange,
        main_ingredient: getMainIngredientText(),
        sub_ingredient: selectedSubIngredients.join(', '),
        target_flavor: getSelectedFlavorTags().join(', '),
        concept: concept.trim(),
        summary: description.trim(),
        imageUrl: !imageAsset ? imagePreview : null,
        image: uploadImage,
      });
      markCurrentUserRecipe(createdRecipe.id);
    } catch (error) {
      console.warn('Failed to create recipe through API', error);
      showNotice(
        '레시피 제안에 실패했습니다.',
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'
      );
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
            {subIngredientRegions.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.regionScrollContent}
                style={styles.regionScroll}
              >
                {subIngredientRegions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.region}
                    style={[
                      styles.regionChip,
                      selectedSubIngredientRegion?.region === suggestion.region && styles.regionChipActive,
                    ]}
                    onPress={() => handleSelectSubIngredientRegion(suggestion)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.regionChipText,
                        selectedSubIngredientRegion?.region === suggestion.region && styles.regionChipTextActive,
                      ]}
                    >
                      {suggestion.region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
            {subIngredientRegions.length > 0 ? (
              <Text style={styles.regionHelpText}>서브재료는 한 지역에서만 선택 가능합니다.</Text>
            ) : null}
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
          <Text style={styles.label}>도수 범위 *</Text>
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
            <Text style={styles.labelNoMargin}>지향하는 맛 * (다중 선택 가능)</Text>
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
          <Text style={styles.label}>프로젝트 컨셉 *</Text>
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
            <Text style={styles.labelNoMargin}>프로젝트 요약 *</Text>
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
              <TouchableOpacity style={styles.previewRemoveBtn} onPress={handleRemoveImage}>
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
  regionScroll: { marginBottom: 12 },
  regionScrollContent: { gap: 8, paddingRight: 8 },
  regionHelpText: { marginTop: -4, marginBottom: 12, fontSize: 12, fontWeight: '700', color: '#6B7280', lineHeight: 18 },
  regionChip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  regionChipActive: { backgroundColor: '#111', borderColor: '#111' },
  regionChipText: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  regionChipTextActive: { color: '#FFF' },
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
