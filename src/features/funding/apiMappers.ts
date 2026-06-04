import type { BrewingStage, BudgetItem, FundingProject, JournalEntry, ProjectStatus, ScheduleItem } from '@/constants/data';
import type {
  FundingBreweryLogItem,
  FundingDetailResponse,
  FundingOfficialBreweryInfo,
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

export function mapFundingStatus(status: string, _currentAmount = 0, _targetAmount = 0, _endDate?: string): ProjectStatus {
  const normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'READY') return '준비 중';
  if (normalized === 'REVIEWING') return '심사 중';
  if (normalized === 'REJECTED' || normalized === 'REJECT' || normalized === 'DENIED') return '펀딩 반려';
  if (normalized === 'UPCOMING') return '펀딩 예정';
  if (normalized === 'ACTIVE') return 'ACTIVE';
  if (normalized === 'ONGOING') return 'ONGOING';
  if (normalized === 'SUCCESS') return '펀딩 성공';
  if (normalized === 'FAILED') return '펀딩 실패';
  if (normalized === 'ENDED') return '종료';
  if (normalized === 'CANCELED' || normalized === 'CANCELLED') return '취소된 펀딩';
  return '대기 중';
}

function normalizeSupporterCount(value: unknown, fallback = 0) {
  if (value === null) return 0;
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return fallback;
  return Math.trunc(count);
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

function isBrokenKoreanText(value: string) {
  return /[\uFFFD\uF900-\uFAFF]/.test(value);
}

function sanitizeApiText(value: unknown) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || isBrokenKoreanText(text)) return '';
  return text;
}

function sanitizeApiTextList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map(sanitizeApiText)
    .filter(Boolean);
}

function sanitizeApiId(value: unknown) {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function readOfficialBreweryText(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const text = sanitizeApiText(source[key]);
    if (text) return text;
  }
  return '';
}

function readOfficialBreweryId(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const id = sanitizeApiId(source[key]);
    if (id) return id;
  }
  return undefined;
}

function hasOfficialBreweryInfo(value?: FundingOfficialBreweryInfo | null) {
  if (!value || typeof value !== 'object') return false;
  const source = value as Record<string, unknown>;
  return [
    'breweryUserId',
    'brewery_user_id',
    'breweryName',
    'brewery_name',
    'mainName',
    'main_name',
    'oneLineIntroduction',
    'one_line_introduction',
    'shortIntroduction',
    'short_introduction',
    'creatorIntroduction',
    'creator_introduction',
    'breweryBio',
    'brewery_bio',
    'introduction',
    'bio',
    'description',
    'brandStory',
    'brand_story',
    'history',
    'establishedYear',
    'established_year',
    'businessRegistrationNumber',
    'business_registration_number',
    'address',
    'businessAddress',
    'business_address',
    'businessAddressDetail',
    'business_address_detail',
    'breweryAddress',
    'brewery_address',
    'representativeName',
    'representative_name',
    'profileImageUrl',
    'profile_image_url',
    'profileImage',
    'profile_image',
    'imageUrl',
    'image_url',
    'businessRegistrationFileUrl',
    'business_registration_file_url',
  ].some((key) => Boolean(source[key]));
}

function normalizeOfficialBreweryInfo(
  breweryInfo?: FundingOfficialBreweryInfo | null,
  breweryProfile?: FundingOfficialBreweryInfo | null,
  fallback?: FundingProject['breweryInfo']
): FundingProject['breweryInfo'] | undefined {
  const source = hasOfficialBreweryInfo(breweryInfo) ? breweryInfo : breweryProfile;
  if (!source) return fallback;
  const sourceRecord = source as Record<string, unknown>;
  const next: FundingProject['breweryInfo'] = {
    breweryUserId: readOfficialBreweryId(sourceRecord, ['breweryUserId', 'brewery_user_id']) || fallback?.breweryUserId,
    breweryName: readOfficialBreweryText(sourceRecord, ['breweryName', 'brewery_name']) || fallback?.breweryName,
    mainName: readOfficialBreweryText(sourceRecord, ['mainName', 'main_name']) || fallback?.mainName,
    oneLineIntroduction: readOfficialBreweryText(sourceRecord, ['oneLineIntroduction', 'one_line_introduction']) || fallback?.oneLineIntroduction,
    shortIntroduction: readOfficialBreweryText(sourceRecord, [
      'shortIntroduction',
      'short_introduction',
      'creatorIntroduction',
      'creator_introduction',
      'breweryBio',
      'brewery_bio',
      'introduction',
      'bio',
      'description',
    ]) || fallback?.shortIntroduction,
    brandStory: readOfficialBreweryText(sourceRecord, ['brandStory', 'brand_story']) || fallback?.brandStory,
    history: readOfficialBreweryText(sourceRecord, ['history']) || fallback?.history,
    establishedYear: readOfficialBreweryId(sourceRecord, ['establishedYear', 'established_year']) || fallback?.establishedYear,
    businessRegistrationNumber: readOfficialBreweryText(sourceRecord, ['businessRegistrationNumber', 'business_registration_number']) || fallback?.businessRegistrationNumber,
    address: readOfficialBreweryText(sourceRecord, ['address', 'businessAddress', 'business_address', 'breweryAddress', 'brewery_address']) || fallback?.address,
    businessAddress: readOfficialBreweryText(sourceRecord, ['businessAddress', 'business_address', 'address', 'breweryAddress', 'brewery_address']) || fallback?.businessAddress,
    businessAddressDetail: readOfficialBreweryText(sourceRecord, ['businessAddressDetail', 'business_address_detail']) || fallback?.businessAddressDetail,
    representativeName: readOfficialBreweryText(sourceRecord, ['representativeName', 'representative_name']) || fallback?.representativeName,
    profileImageUrl: normalizeFundingImageUrl(readOfficialBreweryText(sourceRecord, [
      'profileImageUrl',
      'profile_image_url',
      'profileImage',
      'profile_image',
      'imageUrl',
      'image_url',
    ])) || fallback?.profileImageUrl,
    businessRegistrationFileUrl: normalizeFundingImageUrl(source.businessRegistrationFileUrl || source.business_registration_file_url) || fallback?.businessRegistrationFileUrl,
    missingFields: Array.isArray(source.missingFields) ? source.missingFields.filter(Boolean) : Array.isArray(source.missing_fields) ? source.missing_fields.filter(Boolean) : fallback?.missingFields,
  };
  return Object.values(next).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value)) ? next : fallback;
}

function getOfficialBreweryDisplayName(info?: FundingProject['breweryInfo']) {
  return sanitizeApiText(info?.mainName) || sanitizeApiText(info?.breweryName);
}

function getOfficialBreweryIntro(info?: FundingProject['breweryInfo']) {
  return sanitizeApiText(info?.oneLineIntroduction) || sanitizeApiText(info?.shortIntroduction);
}

function getPlanText(value: unknown) {
  return sanitizeApiText(value);
}

function normalizeBudgetPlanItems(value: unknown): BudgetItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<{ category: unknown; item: unknown; amount: unknown }>;
      const label = sanitizeApiText(source.category) || sanitizeApiText(source.item);
      const amount = Number(source.amount);
      if (!label || !Number.isFinite(amount)) return null;
      return { item: label, amount };
    })
    .filter((item): item is BudgetItem => Boolean(item));
}

function normalizeSchedulePlanItems(value: unknown): ScheduleItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<{ date: unknown; description: unknown; step: unknown }>;
      const description = sanitizeApiText(source.description) || sanitizeApiText(source.step);
      const date = sanitizeApiText(source.date);
      if (!description) return null;
      return { date, description };
    })
    .filter((item): item is ScheduleItem => Boolean(item));
}

function joinTextList(value?: string[] | string | null) {
  if (Array.isArray(value)) return sanitizeApiTextList(value).join(', ');
  return sanitizeApiText(value);
}

function normalizeIngredientName(value: unknown) {
  if (typeof value === 'string') return sanitizeApiText(value);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const source = value as Record<string, unknown>;
  return (
    sanitizeApiText(source.ingredient) ||
    sanitizeApiText(source.name) ||
    sanitizeApiText(source.mainIngredient) ||
    sanitizeApiText(source.main_ingredient) ||
    sanitizeApiText(source.rawMaterial) ||
    sanitizeApiText(source.raw_material) ||
    sanitizeApiText(source.materialName) ||
    sanitizeApiText(source.material_name)
  );
}

function normalizeIngredientOrigin(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const source = value as Record<string, unknown>;
  return (
    sanitizeApiText(source.origin) ||
    sanitizeApiText(source.originName) ||
    sanitizeApiText(source.origin_name) ||
    sanitizeApiText(source.countryOfOrigin) ||
    sanitizeApiText(source.country_of_origin) ||
    sanitizeApiText(source.productionArea) ||
    sanitizeApiText(source.production_area)
  );
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
  const status = mapFundingStatus(item.status, item.currentAmount, item.targetAmount, item.endDate);
  const listImages = normalizeFundingImageUrls(
    item.allImageUrls?.length ? item.allImageUrls : item.imageUrls?.length ? item.imageUrls : item.images
  ).slice(0, 5);
  const thumbnailUrl = normalizeFundingImageUrl(item.thumbnailUrl) || listImages[0] || '';
  const matchScore = getFundingMatchScore(item);
  const mainIngredient = sanitizeApiText(item.mainIngredient) || sanitizeApiText(item.primaryIngredient);
  const subIngredients = joinTextList(item.subIngredients) || sanitizeApiText(item.subIngredient);
  const officialBreweryInfo = normalizeOfficialBreweryInfo(item.breweryInfo || item.brewery_info, item.breweryProfile || item.brewery_profile, existing?.breweryInfo);
  const officialBreweryName = getOfficialBreweryDisplayName(officialBreweryInfo);
  const officialBreweryIntro = getOfficialBreweryIntro(officialBreweryInfo);
  const officialBreweryImage = normalizeFundingImageUrl(officialBreweryInfo?.profileImageUrl);
  const officialBusinessAddress = sanitizeApiText(officialBreweryInfo?.address) || sanitizeApiText(officialBreweryInfo?.businessAddress);
  return {
    id: item.fundingId,
    title: sanitizeApiText(item.title) || existing?.title || '',
    brewery: officialBreweryName || sanitizeApiText(item.breweryName) || existing?.brewery || '',
    breweryLogo: existing?.breweryLogo || '🍶',
    location: officialBusinessAddress || existing?.location || '',
    category: existing?.category || '',
    shortTitle: existing?.shortTitle || sanitizeApiText(item.title),
    shortDescription: sanitizeApiText(item.description) || existing?.shortDescription || existing?.projectSummary || sanitizeApiText(item.title),
    image: thumbnailUrl || existing?.image || '',
    images: listImages.length ? listImages : existing?.images,
    localImage: undefined,
    popularRank: existing?.popularRank,
    isMine: getFundingIsMine(item) ?? existing?.isMine,
    breweryUserId: sanitizeApiId(officialBreweryInfo?.breweryUserId) ?? getFundingBreweryUserId(item) ?? existing?.breweryUserId,
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
    backers: normalizeSupporterCount(item.supporterCount, existing?.backers ?? 0),
    daysLeft: item.endDate ? getDaysLeft(item.endDate) : existing?.daysLeft || 0,
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
    mainIngredientLabel: sanitizeApiText(item.mainIngredientLabel) || sanitizeApiText(item.primaryIngredientLabel) || existing?.mainIngredientLabel,
    primaryIngredientLabel: sanitizeApiText(item.primaryIngredientLabel) || sanitizeApiText(item.mainIngredientLabel) || existing?.primaryIngredientLabel,
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
    breweryBio: officialBreweryIntro || existing?.breweryBio || '',
    breweryProfileImage: officialBreweryImage || existing?.breweryProfileImage || '',
    breweryInfo: officialBreweryInfo,
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
  const officialBreweryInfo = normalizeOfficialBreweryInfo(detail.breweryInfo || detail.brewery_info, detail.breweryProfile || detail.brewery_profile, existing.breweryInfo);
  const officialBreweryName = getOfficialBreweryDisplayName(officialBreweryInfo);
  const officialBreweryIntro = getOfficialBreweryIntro(officialBreweryInfo);
  const officialBreweryImage = normalizeFundingImageUrl(officialBreweryInfo?.profileImageUrl);
  const officialBusinessAddress = sanitizeApiText(officialBreweryInfo?.address) || sanitizeApiText(officialBreweryInfo?.businessAddress);
  const businessAddress =
    officialBusinessAddress ||
    sanitizeApiText(detail.businessAddress) ||
    sanitizeApiText(detail.breweryAddress) ||
    sanitizeApiText(detail.breweryLocation) ||
    sanitizeApiText(detail.breweryInfo?.businessAddress) ||
    sanitizeApiText(detail.breweryInfo?.breweryAddress);
  const detailIngredients = getFundingDetailIngredients(detail);
  const mainIngredient =
    sanitizeApiText(detail.mainIngredient) ||
    sanitizeApiText(detail.primaryIngredient) ||
    sanitizeApiText(detail.legalInfo?.mainIngredient) ||
    sanitizeApiText(detail.legalInfo?.primaryIngredient) ||
    detailIngredients[0]?.ingredient;
  const subIngredients =
    joinTextList(detail.subIngredients) ||
    sanitizeApiText(detail.subIngredient) ||
    joinTextList(detail.legalInfo?.subIngredients) ||
    sanitizeApiText(detail.legalInfo?.subIngredient) ||
    formatProjectIngredients(detailIngredients.slice(1));
  const budgetPlanText = getPlanText(detail.plan?.budgetPlan);
  const schedulePlanText = getPlanText(detail.plan?.schedulePlan);
  const budgetItems = normalizeBudgetPlanItems(detail.plan?.budgetPlan);
  const scheduleItems = normalizeSchedulePlanItems(detail.plan?.schedulePlan);
  const projectPolicy = sanitizeApiText(detail.plan?.policy) || sanitizeApiText(detail.notices?.policy) || sanitizeApiText(detail.notices?.refundPolicy);
  const breweryProfileImage = normalizeFundingImageUrl(detail.breweryInfo?.profileImageUrl);
  const breweryBio =
    officialBreweryIntro ||
    sanitizeApiText(detail.breweryInfo?.shortIntroduction) ||
    existing.breweryBio ||
    sanitizeApiText(detail.breweryInfo?.creatorIntroduction) ||
    sanitizeApiText(detail.breweryInfo?.breweryBio) ||
    sanitizeApiText(detail.breweryInfo?.history);
  return {
    ...existing,
    title: sameProject ? sanitizeApiText(detail.title) || existing.title : existing.title,
    brewery: sameProject ? officialBreweryName || sanitizeApiText(detail.breweryInfo?.breweryName) || sanitizeApiText(detail.breweryName) || existing.brewery : existing.brewery,
    location: sameProject ? businessAddress || existing.location : existing.location,
    category: sameProject ? sanitizeApiText(detail.category) || existing.category : existing.category,
    shortTitle: sameProject ? sanitizeApiText(detail.shortTitle) || existing.shortTitle : existing.shortTitle,
    shortDescription: sameProject ? sanitizeApiText(detail.description) || sanitizeApiText(detail.summary) || existing.shortDescription : existing.shortDescription,
    currentAmount: sameProject ? detail.currentAmount ?? existing.currentAmount : existing.currentAmount,
    goalAmount: sameProject ? detail.targetAmount || existing.goalAmount : existing.goalAmount,
    backers: sameProject ? normalizeSupporterCount(detail.supporterCount, existing.backers) : existing.backers,
    daysLeft: sameProject ? (detail.endDate ? getDaysLeft(detail.endDate) : existing.daysLeft) : existing.daysLeft,
    status: sameProject ? mapFundingStatus(detail.status, detail.currentAmount, detail.targetAmount, detail.endDate) : existing.status,
    endDate: sameProject ? formatDate(detail.endDate) || existing.endDate : existing.endDate,
    startDate: sameProject ? formatDate(detail.startDate) || existing.startDate : existing.startDate,
    estimatedDelivery: sameProject ? formatDate(detail.expectedDeliveryDate) || existing.estimatedDelivery : existing.estimatedDelivery,
    projectSummary: sameProject ? sanitizeApiText(detail.summary) || sanitizeApiText(detail.description) || existing.projectSummary : existing.projectSummary,
    image: sameProject ? thumbnailUrl || existing.image || '' : existing.image,
    images: sameProject ? (detailImages.length ? detailImages : existing.images) : existing.images,
    pricePerBottle: sameProject ? detail.pricePerBottle ?? supportOption?.price ?? existing.pricePerBottle : existing.pricePerBottle,
    totalQuantity: sameProject ? detail.totalQuantity ?? existing.totalQuantity : existing.totalQuantity,
    targetQuantity: sameProject ? detail.totalQuantity ?? existing.targetQuantity : existing.targetQuantity,
    shippingFee: sameProject ? detail.shippingFee ?? existing.shippingFee : existing.shippingFee,
    rewardItems: sameProject && sanitizeApiText(supportOption?.name) ? [sanitizeApiText(supportOption?.name)] : existing.rewardItems,
    bottleSize: sameProject ? bottleSize || existing.bottleSize : existing.bottleSize,
    volume: sameProject ? bottleSize || existing.volume : existing.volume,
    alcoholContent: sameProject ? alcoholContent || existing.alcoholContent : existing.alcoholContent,
    isMine: sameProject ? getFundingIsMine(detail) ?? existing.isMine : existing.isMine,
    breweryUserId: sameProject ? sanitizeApiId(officialBreweryInfo?.breweryUserId) ?? getFundingBreweryUserId(detail) ?? existing.breweryUserId : existing.breweryUserId,
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
    tags: sameProject && sanitizeApiTextList(detail.tasteProfile?.flavorNotes).length
      ? sanitizeApiTextList(detail.tasteProfile?.flavorNotes)
      : sameProject && sanitizeApiTextList(detail.tasteProfile?.flavor).length
        ? sanitizeApiTextList(detail.tasteProfile?.flavor)
        : existing.tags,
    introduction: sameProject ? sanitizeApiText(detail.plan?.introduction) || existing.introduction : existing.introduction,
    story: sameProject ? sanitizeApiText(detail.plan?.introduction) || existing.story : existing.story,
    videoUrl: sameProject ? sanitizeApiText(detail.plan?.videoUrl) || existing.videoUrl : existing.videoUrl,
    businessAddress: sameProject ? businessAddress || existing.businessAddress : existing.businessAddress,
    breweryAddress: sameProject ? sanitizeApiText(detail.breweryAddress) || sanitizeApiText(detail.breweryInfo?.breweryAddress) || businessAddress || existing.breweryAddress : existing.breweryAddress,
    mainIngredientLabel: sameProject ? sanitizeApiText(detail.mainIngredientLabel) || sanitizeApiText(detail.primaryIngredientLabel) || existing.mainIngredientLabel : existing.mainIngredientLabel,
    primaryIngredientLabel: sameProject ? sanitizeApiText(detail.primaryIngredientLabel) || sanitizeApiText(detail.mainIngredientLabel) || existing.primaryIngredientLabel : existing.primaryIngredientLabel,
    mainIngredients: sameProject ? mainIngredient || existing.mainIngredients : existing.mainIngredients,
    subIngredients: sameProject ? subIngredients || existing.subIngredients : existing.subIngredients,
    projectPolicy: sameProject ? projectPolicy || existing.projectPolicy : existing.projectPolicy,
    refundPolicy: sameProject ? sanitizeApiText(detail.notices?.refundPolicy) || existing.refundPolicy : existing.refundPolicy,
    exchangePolicy: sameProject ? sanitizeApiText(detail.notices?.exchangePolicy) || existing.exchangePolicy : existing.exchangePolicy,
    expectedDifficulties: sameProject ? sanitizeApiText(detail.notices?.riskNotice) || existing.expectedDifficulties : existing.expectedDifficulties,
    budgetPlanText: sameProject ? budgetPlanText || existing.budgetPlanText : existing.budgetPlanText,
    schedulePlanText: sameProject ? schedulePlanText || existing.schedulePlanText : existing.schedulePlanText,
    budget: sameProject ? (budgetItems.length ? budgetItems : existing.budget) : existing.budget,
    schedule: sameProject ? (scheduleItems.length ? scheduleItems : existing.schedule) : existing.schedule,
    breweryBio: sameProject ? breweryBio || existing.breweryBio || '' : existing.breweryBio,
    breweryProfileImage: sameProject ? officialBreweryImage || breweryProfileImage || existing.breweryProfileImage || '' : existing.breweryProfileImage,
    breweryInfo: sameProject ? officialBreweryInfo || existing.breweryInfo : existing.breweryInfo,
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
  const mainIngredient = sanitizeApiText(intro.mainIngredient) || sanitizeApiText(intro.primaryIngredient);
  const subIngredients = joinTextList(intro.subIngredients) || sanitizeApiText(intro.subIngredient);
  const budgetPlanText = sanitizeApiText(intro.budgetPlan) || sanitizeApiText(intro.projectBudget);
  const schedulePlanText = sanitizeApiText(intro.schedulePlan) || sanitizeApiText(intro.projectSchedule);
  const projectPolicy = sanitizeApiText(intro.policy) || sanitizeApiText(intro.projectPolicy);
  const officialBreweryInfo = normalizeOfficialBreweryInfo(intro.breweryInfo || intro.brewery_info, intro.breweryProfile || intro.brewery_profile, existing.breweryInfo);
  const officialBreweryName = getOfficialBreweryDisplayName(officialBreweryInfo);
  const officialBreweryIntro = getOfficialBreweryIntro(officialBreweryInfo);
  const officialBreweryImage = normalizeFundingImageUrl(officialBreweryInfo?.profileImageUrl);
  const officialBusinessAddress = sanitizeApiText(officialBreweryInfo?.address) || sanitizeApiText(officialBreweryInfo?.businessAddress);
  return {
    ...existing,
    projectSummary: existing.projectSummary || sanitizeApiText(intro.introduction),
    introduction: sanitizeApiText(intro.introduction) || existing.introduction,
    story: sanitizeApiText(intro.story) || existing.story,
    videoUrl: sanitizeApiText(intro.videoUrl) || existing.videoUrl,
    mainIngredientLabel: sanitizeApiText(intro.mainIngredientLabel) || sanitizeApiText(intro.primaryIngredientLabel) || existing.mainIngredientLabel,
    primaryIngredientLabel: sanitizeApiText(intro.primaryIngredientLabel) || sanitizeApiText(intro.mainIngredientLabel) || existing.primaryIngredientLabel,
    mainIngredients: mainIngredient || existing.mainIngredients,
    subIngredients: subIngredients || existing.subIngredients,
    budgetPlanText: budgetPlanText || existing.budgetPlanText,
    schedulePlanText: schedulePlanText || existing.schedulePlanText,
    projectPolicy: projectPolicy || existing.projectPolicy,
    images: introImages.length ? introImages : existing.images,
    brewery: officialBreweryName || existing.brewery,
    location: officialBusinessAddress || existing.location,
    breweryBio: officialBreweryIntro || existing.breweryBio,
    breweryProfileImage: officialBreweryImage || existing.breweryProfileImage,
    breweryUserId: sanitizeApiId(officialBreweryInfo?.breweryUserId) || existing.breweryUserId,
    breweryInfo: officialBreweryInfo || existing.breweryInfo,
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
    videoUrl: log.videoUrl,
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
    writerRole: item.writerRole,
    isBrewery: item.isBrewery,
    writerIsBrewery: item.writerIsBrewery,
    showBreweryBadge: item.showBreweryBadge,
    isProjectOwner: item.isProjectOwner,
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
  const mainIngredient = sanitizeApiText(option.mainIngredient) || sanitizeApiText(option.primaryIngredient) || optionIngredientText;
  const subIngredients = joinTextList(option.subIngredients) || sanitizeApiText(option.subIngredient);
  return {
    ...existing,
    pricePerBottle: option.price,
    rewardItems: sanitizeApiText(option.name) ? [sanitizeApiText(option.name)] : existing.rewardItems,
    bottleSize: bottleSize || existing.bottleSize,
    volume: bottleSize || existing.volume,
    alcoholContent: alcoholContent || existing.alcoholContent,
    estimatedDelivery: option.expectedDeliveryDate ? formatDate(option.expectedDeliveryDate) : existing.estimatedDelivery,
    mainIngredientLabel: sanitizeApiText(option.mainIngredientLabel) || sanitizeApiText(option.primaryIngredientLabel) || existing.mainIngredientLabel,
    primaryIngredientLabel: sanitizeApiText(option.primaryIngredientLabel) || sanitizeApiText(option.mainIngredientLabel) || existing.primaryIngredientLabel,
    mainIngredients: mainIngredient || existing.mainIngredients,
    subIngredients: subIngredients || existing.subIngredients,
    ingredients: optionIngredients.length ? optionIngredients : existing.ingredients,
    updatedAt: new Date().toISOString(),
  };
}
