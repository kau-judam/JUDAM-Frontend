import type { BrewingStage, BudgetItem, FundingProject, JournalEntry, ProjectStatus, ScheduleItem } from '@/constants/data';
import type {
  FundingBreweryLogItem,
  FundingDetailResponse,
  FundingIntroResponse,
  FundingListItem,
  FundingReviewItem,
  FundingSupportOption,
} from '@/features/funding/api';
import { normalizeFundingImageUrl, normalizeFundingImageUrls } from '@/features/funding/imageUrls';
import type { FundingReview } from '@/features/funding/reviews';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value.replace(/-/g, '. ');
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
}

function getDaysLeft(value?: string) {
  if (!value) return 0;
  const endDate = new Date(value);
  if (!Number.isFinite(endDate.getTime())) return 0;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
  return Math.max(0, Math.ceil((end - startOfToday) / (1000 * 60 * 60 * 24)));
}

export function mapFundingStatus(status: string, currentAmount = 0, targetAmount = 0): ProjectStatus {
  if (status === 'UPCOMING') return '펀딩 예정';
  if (status === 'ONGOING' || status === 'ACTIVE') return '진행 중';
  if (status === 'ENDED') return currentAmount >= targetAmount ? '펀딩 성공' : '펀딩 실패';
  return '진행 중';
}

function normalizeTasteValue(value?: number) {
  if (typeof value !== 'number') return 0;
  if (value <= 5) return Math.max(0, Math.min(100, value * 20));
  return Math.max(0, Math.min(100, value));
}

function normalizeMatchScore(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getFundingMatchScore(item: {
  sulbtiMatchScore?: number | null;
  matchScore?: number | null;
  tasteMatchScore?: number | null;
  matchRate?: number | null;
  matchPercent?: number | null;
  recommendationScore?: number | null;
}) {
  return normalizeMatchScore(item.sulbtiMatchScore)
    ?? normalizeMatchScore(item.matchScore)
    ?? normalizeMatchScore(item.tasteMatchScore)
    ?? normalizeMatchScore(item.matchRate)
    ?? normalizeMatchScore(item.matchPercent)
    ?? normalizeMatchScore(item.recommendationScore);
}

function getPlanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeBudgetPlanItems(value: unknown): BudgetItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<{ category: unknown; item: unknown; amount: unknown }>;
      const label = typeof source.category === 'string'
        ? source.category
        : typeof source.item === 'string'
          ? source.item
          : '';
      const amount = Number(source.amount);
      if (!label.trim() || !Number.isFinite(amount)) return null;
      return { item: label.trim(), amount };
    })
    .filter((item): item is BudgetItem => Boolean(item));
}

function normalizeSchedulePlanItems(value: unknown): ScheduleItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<{ date: unknown; description: unknown; step: unknown }>;
      const description = typeof source.description === 'string'
        ? source.description
        : typeof source.step === 'string'
          ? source.step
          : '';
      const date = typeof source.date === 'string' ? source.date : '';
      if (!description.trim()) return null;
      return { date: date.trim(), description: description.trim() };
    })
    .filter((item): item is ScheduleItem => Boolean(item));
}

function joinTextList(value?: string[] | string | null) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean).join(', ');
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeIngredientName(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const source = value as Record<string, unknown>;
  return (
    typeof source.ingredient === 'string' ? source.ingredient :
    typeof source.name === 'string' ? source.name :
    typeof source.mainIngredient === 'string' ? source.mainIngredient :
    typeof source.main_ingredient === 'string' ? source.main_ingredient :
    typeof source.rawMaterial === 'string' ? source.rawMaterial :
    typeof source.raw_material === 'string' ? source.raw_material :
    typeof source.materialName === 'string' ? source.materialName :
    typeof source.material_name === 'string' ? source.material_name :
    ''
  ).trim();
}

function normalizeIngredientOrigin(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const source = value as Record<string, unknown>;
  return (
    typeof source.origin === 'string' ? source.origin :
    typeof source.originName === 'string' ? source.originName :
    typeof source.origin_name === 'string' ? source.origin_name :
    typeof source.countryOfOrigin === 'string' ? source.countryOfOrigin :
    typeof source.country_of_origin === 'string' ? source.country_of_origin :
    typeof source.productionArea === 'string' ? source.productionArea :
    typeof source.production_area === 'string' ? source.production_area :
    ''
  ).trim();
}

function normalizeProjectIngredients(value?: unknown[]) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      const ingredient = normalizeIngredientName(item);
      if (!ingredient) return null;
      return {
        id: index + 1,
        ingredient,
        origin: normalizeIngredientOrigin(item),
      };
    })
    .filter((item): item is { id: number; ingredient: string; origin: string } => Boolean(item));
}

function normalizeSupportOptionIngredients(value?: unknown[]) {
  return normalizeProjectIngredients(value);
}

function formatProjectIngredients(value: { ingredient: string; origin: string }[]) {
  return value
    .map((item) => [item.ingredient, item.origin].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ');
}

function getFundingDetailIngredients(detail: FundingDetailResponse) {
  const rawMaterials = normalizeProjectIngredients(detail.legalInfo?.rawMaterials);
  if (rawMaterials.length > 0) return rawMaterials;

  const legalIngredients = normalizeProjectIngredients(detail.legalInfo?.ingredients);
  if (legalIngredients.length > 0) return legalIngredients;

  return normalizeProjectIngredients(detail.ingredients);
}

function getVolumeFromDescription(description?: string) {
  return description?.match(/\d+\s?ml/i)?.[0].replace(/\s/g, '') || undefined;
}

function getAlcoholFromDescription(description?: string) {
  return description?.match(/\d+(?:\.\d+)?\s?%/)?.[0].replace(/\s/g, '') || undefined;
}

function formatVolumeSpec(value?: number | string | null) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return `${value}ml`;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /\d+\s?ml/i.test(trimmed) ? trimmed.replace(/\s/g, '') : `${trimmed}ml`;
}

function formatAlcoholSpec(value?: number | string | null) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return `${value}%`;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.includes('%') ? trimmed.replace(/\s/g, '') : `${trimmed}%`;
}

function normalizeText(value?: string) {
  return (value || '').replace(/\s/g, '').toLowerCase();
}

function normalizeOwnerId(value?: number | string | null) {
  if (value === null || value === undefined) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

function getFundingIsMine(item: { isMine?: boolean; is_mine?: boolean }) {
  return item.isMine ?? item.is_mine;
}

function getFundingBreweryUserId(item: {
  breweryUserId?: number | string;
  brewery_user_id?: number | string;
}) {
  return normalizeOwnerId(item.breweryUserId ?? item.brewery_user_id);
}

function getFundingOwnerUserId(item: {
  ownerUserId?: number | string;
  owner_user_id?: number | string;
}) {
  return normalizeOwnerId(item.ownerUserId ?? item.owner_user_id);
}

export function normalizeSupportOptionId(value: FundingSupportOption['optionId'] | null | undefined) {
  const optionId = Number(value);
  return Number.isInteger(optionId) && optionId > 0 ? optionId : null;
}

function isSameFundingText(current?: string, incoming?: string) {
  const currentText = normalizeText(current);
  const incomingText = normalizeText(incoming);
  if (!currentText || !incomingText) return false;
  return currentText.includes(incomingText) || incomingText.includes(currentText);
}

export function mergeFundingListItem(existing: FundingProject | undefined, item: FundingListItem): FundingProject {
  const status = mapFundingStatus(item.status, item.currentAmount, item.targetAmount);
  const listImages = normalizeFundingImageUrls(
    item.allImageUrls?.length ? item.allImageUrls : item.imageUrls?.length ? item.imageUrls : item.images
  ).slice(0, 5);
  const thumbnailUrl = normalizeFundingImageUrl(item.thumbnailUrl) || listImages[0] || '';
  const matchScore = getFundingMatchScore(item);
  const mainIngredient = item.mainIngredient || item.primaryIngredient;
  const subIngredients = joinTextList(item.subIngredients) || item.subIngredient;
  return {
    id: item.fundingId,
    title: item.title || existing?.title || '',
    brewery: item.breweryName || existing?.brewery || '',
    breweryLogo: existing?.breweryLogo || '🍶',
    location: existing?.location || '',
    category: existing?.category || '',
    shortTitle: existing?.shortTitle || item.title,
    shortDescription: item.description || existing?.shortDescription || existing?.projectSummary || item.title,
    image: thumbnailUrl || existing?.image || '',
    images: listImages.length ? listImages : existing?.images,
    localImage: undefined,
    popularRank: existing?.popularRank,
    isMine: getFundingIsMine(item) ?? existing?.isMine,
    breweryUserId: getFundingBreweryUserId(item) ?? existing?.breweryUserId,
    ownerUserId: getFundingOwnerUserId(item) ?? existing?.ownerUserId,
    creatorId: existing?.creatorId,
    breweryId: existing?.breweryId,
    liked: item.liked ?? existing?.liked,
    favoriteCount: item.likeCount ?? existing?.favoriteCount,
    sulbtiMatchScore: matchScore ?? existing?.sulbtiMatchScore,
    matchScore: matchScore ?? existing?.matchScore,
    tasteMatchScore: matchScore ?? existing?.tasteMatchScore,
    matchRate: matchScore ?? existing?.matchRate,
    goalAmount: item.targetAmount || existing?.goalAmount || 1,
    currentAmount: item.currentAmount ?? existing?.currentAmount ?? 0,
    backers: existing?.backers || 0,
    daysLeft: getDaysLeft(item.endDate) || existing?.daysLeft || 0,
    status,
    startDate: existing?.startDate,
    endDate: formatDate(item.endDate) || existing?.endDate,
    pricePerBottle: existing?.pricePerBottle,
    bottleSize: existing?.bottleSize,
    volume: existing?.volume,
    alcoholContent: existing?.alcoholContent,
    totalQuantity: existing?.totalQuantity,
    targetQuantity: existing?.targetQuantity,
    estimatedDelivery: existing?.estimatedDelivery,
    rewardItems: existing?.rewardItems,
    shippingFee: existing?.shippingFee,
    mainIngredientLabel: item.mainIngredientLabel || item.primaryIngredientLabel || existing?.mainIngredientLabel,
    primaryIngredientLabel: item.primaryIngredientLabel || item.mainIngredientLabel || existing?.primaryIngredientLabel,
    mainIngredients: mainIngredient || existing?.mainIngredients,
    subIngredients: subIngredients || existing?.subIngredients,
    tags: existing?.tags,
    projectSummary: existing?.projectSummary,
    introduction: existing?.introduction,
    story: existing?.story,
    projectPolicy: existing?.projectPolicy,
    expectedDifficulties: existing?.expectedDifficulties,
    rewardDetails: existing?.rewardDetails,
    budget: existing?.budget,
    schedule: existing?.schedule,
    tasteProfile: existing?.tasteProfile,
    team: existing?.team,
    breweryBio: '',
    breweryProfileImage: '',
    productType: existing?.productType,
    ingredients: existing?.ingredients,
    journals: existing?.journals || [],
    createdAt: existing?.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeFundingDetail(existing: FundingProject, detail: FundingDetailResponse): FundingProject {
  const supportOption = detail.supportOptions?.[0];
  const bottleSize =
    formatVolumeSpec(detail.bottleSize) ||
    formatVolumeSpec(detail.volume) ||
    getVolumeFromDescription(supportOption?.description);
  const alcoholContent =
    formatAlcoholSpec(detail.alcoholContent) ||
    formatAlcoholSpec(detail.alcoholPercentage) ||
    getAlcoholFromDescription(supportOption?.description);
  const thumbnailUrl = normalizeFundingImageUrl(detail.thumbnailUrl);
  const detailImages = normalizeFundingImageUrls(
    detail.allImageUrls?.length ? detail.allImageUrls : detail.imageUrls?.length ? detail.imageUrls : detail.images
  );
  const sameProject =
    detail.fundingId === existing.id ||
    isSameFundingText(existing.title, detail.title) ||
    isSameFundingText(existing.shortTitle, detail.title);
  const matchScore = getFundingMatchScore(detail);
  const businessAddress = detail.businessAddress || detail.breweryAddress || detail.breweryLocation || detail.breweryInfo?.businessAddress || detail.breweryInfo?.breweryAddress;
  const detailIngredients = getFundingDetailIngredients(detail);
  const mainIngredient =
    detail.mainIngredient ||
    detail.primaryIngredient ||
    detail.legalInfo?.mainIngredient ||
    detail.legalInfo?.primaryIngredient ||
    detailIngredients[0]?.ingredient;
  const subIngredients =
    joinTextList(detail.subIngredients) ||
    detail.subIngredient ||
    joinTextList(detail.legalInfo?.subIngredients) ||
    detail.legalInfo?.subIngredient ||
    formatProjectIngredients(detailIngredients.slice(1));
  const budgetPlanText = getPlanText(detail.plan?.budgetPlan);
  const schedulePlanText = getPlanText(detail.plan?.schedulePlan);
  const budgetItems = normalizeBudgetPlanItems(detail.plan?.budgetPlan);
  const scheduleItems = normalizeSchedulePlanItems(detail.plan?.schedulePlan);
  const projectPolicy = detail.plan?.policy || detail.notices?.policy || detail.notices?.refundPolicy;
  return {
    ...existing,
    title: sameProject ? detail.title || existing.title : existing.title,
    brewery: sameProject ? detail.breweryName || existing.brewery : existing.brewery,
    location: sameProject ? businessAddress || existing.location : existing.location,
    category: sameProject ? detail.category || existing.category : existing.category,
    shortTitle: sameProject ? detail.shortTitle || existing.shortTitle : existing.shortTitle,
    shortDescription: sameProject ? detail.description || detail.summary || existing.shortDescription : existing.shortDescription,
    currentAmount: sameProject ? detail.currentAmount ?? existing.currentAmount : existing.currentAmount,
    goalAmount: sameProject ? detail.targetAmount || existing.goalAmount : existing.goalAmount,
    backers: sameProject ? detail.supporterCount ?? existing.backers : existing.backers,
    daysLeft: sameProject ? getDaysLeft(detail.endDate) || existing.daysLeft : existing.daysLeft,
    status: sameProject ? mapFundingStatus(detail.status, detail.currentAmount, detail.targetAmount) : existing.status,
    endDate: sameProject ? formatDate(detail.endDate) || existing.endDate : existing.endDate,
    startDate: sameProject ? formatDate(detail.startDate) || existing.startDate : existing.startDate,
    estimatedDelivery: sameProject ? formatDate(detail.expectedDeliveryDate) || existing.estimatedDelivery : existing.estimatedDelivery,
    projectSummary: sameProject ? detail.summary || detail.description || existing.projectSummary : existing.projectSummary,
    image: sameProject ? thumbnailUrl || existing.image || '' : existing.image,
    images: sameProject ? (detailImages.length ? detailImages : existing.images) : existing.images,
    pricePerBottle: sameProject ? detail.pricePerBottle ?? supportOption?.price ?? existing.pricePerBottle : existing.pricePerBottle,
    totalQuantity: sameProject ? detail.totalQuantity ?? existing.totalQuantity : existing.totalQuantity,
    targetQuantity: sameProject ? detail.totalQuantity ?? existing.targetQuantity : existing.targetQuantity,
    shippingFee: sameProject ? detail.shippingFee ?? existing.shippingFee : existing.shippingFee,
    rewardItems: sameProject && supportOption ? [supportOption.name] : existing.rewardItems,
    bottleSize: sameProject ? bottleSize || existing.bottleSize : existing.bottleSize,
    volume: sameProject ? bottleSize || existing.volume : existing.volume,
    alcoholContent: sameProject ? alcoholContent || existing.alcoholContent : existing.alcoholContent,
    isMine: sameProject ? getFundingIsMine(detail) ?? existing.isMine : existing.isMine,
    breweryUserId: sameProject ? getFundingBreweryUserId(detail) ?? existing.breweryUserId : existing.breweryUserId,
    ownerUserId: sameProject ? getFundingOwnerUserId(detail) ?? existing.ownerUserId : existing.ownerUserId,
    liked: sameProject ? detail.liked ?? existing.liked : existing.liked,
    favoriteCount: sameProject ? detail.likeCount ?? existing.favoriteCount : existing.favoriteCount,
    sulbtiMatchScore: sameProject ? matchScore ?? existing.sulbtiMatchScore : existing.sulbtiMatchScore,
    matchScore: sameProject ? matchScore ?? existing.matchScore : existing.matchScore,
    tasteMatchScore: sameProject ? matchScore ?? existing.tasteMatchScore : existing.tasteMatchScore,
    matchRate: sameProject ? matchScore ?? existing.matchRate : existing.matchRate,
    tasteProfile: sameProject && detail.tasteProfile
      ? {
          sweetness: normalizeTasteValue(detail.tasteProfile.sweetness),
          aroma: existing.tasteProfile?.aroma ?? normalizeTasteValue(detail.tasteProfile.finish ?? detail.tasteProfile.aftertaste ?? detail.tasteProfile.aromaIntensity ?? detail.tasteProfile.alcoholIntensity ?? detail.tasteProfile.alcohol),
          acidity: normalizeTasteValue(detail.tasteProfile.acidity),
          body: normalizeTasteValue(detail.tasteProfile.body),
          carbonation: normalizeTasteValue(detail.tasteProfile.carbonation),
        }
      : existing.tasteProfile,
    tags: sameProject && detail.tasteProfile?.flavorNotes?.length
      ? detail.tasteProfile.flavorNotes
      : sameProject && detail.tasteProfile?.flavor?.length
        ? detail.tasteProfile.flavor
        : existing.tags,
    introduction: sameProject ? detail.plan?.introduction || existing.introduction : existing.introduction,
    story: sameProject ? detail.plan?.introduction || existing.story : existing.story,
    videoUrl: sameProject ? detail.plan?.videoUrl || existing.videoUrl : existing.videoUrl,
    businessAddress: sameProject ? detail.businessAddress || detail.breweryInfo?.businessAddress || existing.businessAddress : existing.businessAddress,
    breweryAddress: sameProject ? detail.breweryAddress || detail.breweryInfo?.breweryAddress || businessAddress || existing.breweryAddress : existing.breweryAddress,
    mainIngredientLabel: sameProject ? detail.mainIngredientLabel || detail.primaryIngredientLabel || existing.mainIngredientLabel : existing.mainIngredientLabel,
    primaryIngredientLabel: sameProject ? detail.primaryIngredientLabel || detail.mainIngredientLabel || existing.primaryIngredientLabel : existing.primaryIngredientLabel,
    mainIngredients: sameProject ? mainIngredient || existing.mainIngredients : existing.mainIngredients,
    subIngredients: sameProject ? subIngredients || existing.subIngredients : existing.subIngredients,
    projectPolicy: sameProject ? projectPolicy || existing.projectPolicy : existing.projectPolicy,
    refundPolicy: sameProject ? detail.notices?.refundPolicy || existing.refundPolicy : existing.refundPolicy,
    exchangePolicy: sameProject ? detail.notices?.exchangePolicy || existing.exchangePolicy : existing.exchangePolicy,
    expectedDifficulties: sameProject ? detail.notices?.riskNotice || existing.expectedDifficulties : existing.expectedDifficulties,
    budgetPlanText: sameProject ? budgetPlanText || existing.budgetPlanText : existing.budgetPlanText,
    schedulePlanText: sameProject ? schedulePlanText || existing.schedulePlanText : existing.schedulePlanText,
    budget: sameProject ? (budgetItems.length ? budgetItems : existing.budget) : existing.budget,
    schedule: sameProject ? (scheduleItems.length ? scheduleItems : existing.schedule) : existing.schedule,
    breweryBio: existing.breweryBio || '',
    breweryProfileImage: existing.breweryProfileImage || '',
    ingredients: sameProject && detailIngredients.length
      ? detailIngredients
      : existing.ingredients,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeFundingIntro(existing: FundingProject, intro: FundingIntroResponse): FundingProject {
  const sameProject = isSameFundingText(existing.title, intro.title) || isSameFundingText(existing.shortTitle, intro.title);
  if (!sameProject) return existing;
  const introImages = normalizeFundingImageUrls(
    intro.allImageUrls?.length ? intro.allImageUrls : intro.imageUrls?.length ? intro.imageUrls : intro.images
  );
  const mainIngredient = intro.mainIngredient || intro.primaryIngredient;
  const subIngredients = joinTextList(intro.subIngredients) || intro.subIngredient;
  const budgetPlanText = intro.budgetPlan || intro.projectBudget || '';
  const schedulePlanText = intro.schedulePlan || intro.projectSchedule || '';
  const projectPolicy = intro.policy || intro.projectPolicy || '';
  return {
    ...existing,
    projectSummary: existing.projectSummary || intro.introduction,
    introduction: intro.introduction || existing.introduction,
    story: intro.story || existing.story,
    videoUrl: intro.videoUrl || existing.videoUrl,
    mainIngredientLabel: intro.mainIngredientLabel || intro.primaryIngredientLabel || existing.mainIngredientLabel,
    primaryIngredientLabel: intro.primaryIngredientLabel || intro.mainIngredientLabel || existing.primaryIngredientLabel,
    mainIngredients: mainIngredient || existing.mainIngredients,
    subIngredients: subIngredients || existing.subIngredients,
    budgetPlanText: budgetPlanText || existing.budgetPlanText,
    schedulePlanText: schedulePlanText || existing.schedulePlanText,
    projectPolicy: projectPolicy || existing.projectPolicy,
    images: introImages.length ? introImages : existing.images,
    updatedAt: new Date().toISOString(),
  };
}

function mapBreweryStage(step?: string): BrewingStage {
  if (!step) return 1;
  if (step === 'INGREDIENT') return 1;
  if (step === 'PROCESSING') return 2;
  if (step === 'FERMENTATION') return 3;
  if (step === 'FILTERING') return 4;
  if (step === 'AGING') return 4;
  if (step === 'BOTTLING') return 5;
  if (step === 'SHIPPING') return 5;
  if (step.includes('원재료')) return 1;
  if (step.includes('가공') || step.includes('혼합')) return 2;
  if (step.includes('발효')) return 3;
  if (step.includes('숙성') || step.includes('제술') || step.includes('정제')) return 4;
  if (step.includes('병입') || step.includes('배송')) return 5;
  return 1;
}

export function mapBreweryLogs(logs: FundingBreweryLogItem[]): JournalEntry[] {
  return logs.map((log) => ({
    id: log.logId,
    stage: mapBreweryStage(log.stage || log.step),
    date: formatDate(log.createdAt),
    title: log.title,
    content: log.content,
    images: normalizeFundingImageUrls(log.imageUrls),
    likes: log.likeCount || 0,
    liked: log.liked,
    comments: [],
  }));
}

export function mapFundingReview(projectId: number, item: FundingReviewItem): FundingReview {
  const imageUrls = normalizeFundingImageUrls(item.imageUrls);
  return {
    id: item.reviewId,
    projectId,
    userId: item.writerId ? String(item.writerId) : undefined,
    userName: item.writerNickname,
    rating: item.rating,
    date: formatDate(item.createdAt),
    comment: item.content,
    rewardName: '후원 리워드',
    imageUrls,
    images: imageUrls,
    mood: item.mood,
    pairing: item.pairing,
    showRecordInReview: item.recordVisibility,
    tags: item.tags || [],
    likes: item.likeCount || 0,
    liked: item.liked,
    timestamp: formatDate(item.createdAt),
  };
}

export function mergeSupportOption(existing: FundingProject, option: FundingSupportOption): FundingProject {
  const bottleSize = formatVolumeSpec(option.volume) || getVolumeFromDescription(option.description);
  const alcoholContent = formatAlcoholSpec(option.alcohol) || formatAlcoholSpec(option.alcoholPercentage) || getAlcoholFromDescription(option.description);
  const optionIngredients = normalizeSupportOptionIngredients(option.ingredients);
  const optionIngredientText = formatProjectIngredients(optionIngredients);
  const mainIngredient = option.mainIngredient || option.primaryIngredient || optionIngredientText;
  const subIngredients = joinTextList(option.subIngredients) || option.subIngredient;
  return {
    ...existing,
    pricePerBottle: option.price,
    rewardItems: [option.name],
    bottleSize: bottleSize || existing.bottleSize,
    volume: bottleSize || existing.volume,
    alcoholContent: alcoholContent || existing.alcoholContent,
    estimatedDelivery: option.expectedDeliveryDate ? formatDate(option.expectedDeliveryDate) : existing.estimatedDelivery,
    mainIngredientLabel: option.mainIngredientLabel || option.primaryIngredientLabel || existing.mainIngredientLabel,
    primaryIngredientLabel: option.primaryIngredientLabel || option.mainIngredientLabel || existing.primaryIngredientLabel,
    mainIngredients: mainIngredient || existing.mainIngredients,
    subIngredients: subIngredients || existing.subIngredients,
    ingredients: optionIngredients.length ? optionIngredients : existing.ingredients,
    updatedAt: new Date().toISOString(),
  };
}
