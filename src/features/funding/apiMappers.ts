import type { BrewingStage, FundingProject, JournalEntry, ProjectStatus } from '@/constants/data';
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

function getVolumeFromDescription(description?: string) {
  return description?.match(/\d+\s?ml/i)?.[0].replace(/\s/g, '') || undefined;
}

function normalizeText(value?: string) {
  return (value || '').replace(/\s/g, '').toLowerCase();
}

export function normalizeSupportOptionId(value: FundingSupportOption['optionId'] | null | undefined) {
  const optionId = Number(value);
  return Number.isFinite(optionId) ? optionId : null;
}

function isSameFundingText(current?: string, incoming?: string) {
  const currentText = normalizeText(current);
  const incomingText = normalizeText(incoming);
  if (!currentText || !incomingText) return false;
  return currentText.includes(incomingText) || incomingText.includes(currentText);
}

export function mergeFundingListItem(existing: FundingProject | undefined, item: FundingListItem): FundingProject {
  const status = mapFundingStatus(item.status, item.currentAmount, item.targetAmount);
  const thumbnailUrl = normalizeFundingImageUrl(item.thumbnailUrl);
  return {
    id: item.fundingId,
    title: item.title || existing?.title || '',
    brewery: item.breweryName || existing?.brewery || '양조장 안내 예정',
    breweryLogo: existing?.breweryLogo || '🍶',
    location: existing?.location || '지역 안내 예정',
    category: existing?.category || '막걸리',
    shortTitle: existing?.shortTitle || item.title,
    shortDescription: item.description || existing?.shortDescription || existing?.projectSummary || item.title,
    image: thumbnailUrl || existing?.image || '',
    images: existing?.images,
    localImage: existing?.localImage,
    popularRank: existing?.popularRank,
    creatorId: existing?.creatorId,
    breweryId: existing?.breweryId,
    favoriteCount: existing?.favoriteCount,
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
    mainIngredients: existing?.mainIngredients,
    subIngredients: existing?.subIngredients,
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
    breweryBio: existing?.breweryBio,
    breweryProfileImage: existing?.breweryProfileImage,
    productType: existing?.productType,
    ingredients: existing?.ingredients,
    journals: existing?.journals || [],
    createdAt: existing?.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeFundingDetail(existing: FundingProject, detail: FundingDetailResponse): FundingProject {
  const supportOption = detail.supportOptions?.[0];
  const bottleSize = getVolumeFromDescription(supportOption?.description);
  const thumbnailUrl = normalizeFundingImageUrl(detail.thumbnailUrl);
  const sameProject =
    detail.fundingId === existing.id ||
    isSameFundingText(existing.title, detail.title) ||
    isSameFundingText(existing.shortTitle, detail.title);
  return {
    ...existing,
    title: sameProject ? detail.title || existing.title : existing.title,
    brewery: sameProject ? detail.breweryName || existing.brewery : existing.brewery,
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
    pricePerBottle: sameProject ? supportOption?.price ?? existing.pricePerBottle : existing.pricePerBottle,
    rewardItems: sameProject && supportOption ? [supportOption.name] : existing.rewardItems,
    bottleSize: sameProject ? bottleSize || existing.bottleSize : existing.bottleSize,
    tasteProfile: sameProject && detail.tasteProfile
      ? {
          sweetness: normalizeTasteValue(detail.tasteProfile.sweetness),
          aroma: existing.tasteProfile?.aroma ?? normalizeTasteValue(detail.tasteProfile.alcoholIntensity),
          acidity: normalizeTasteValue(detail.tasteProfile.acidity),
          body: normalizeTasteValue(detail.tasteProfile.body),
          carbonation: normalizeTasteValue(detail.tasteProfile.carbonation),
        }
      : existing.tasteProfile,
    tags: sameProject && detail.tasteProfile?.flavorNotes?.length ? detail.tasteProfile.flavorNotes : existing.tags,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeFundingIntro(existing: FundingProject, intro: FundingIntroResponse): FundingProject {
  const sameProject = isSameFundingText(existing.title, intro.title) || isSameFundingText(existing.shortTitle, intro.title);
  if (!sameProject) return existing;
  const introImages = normalizeFundingImageUrls(intro.images);
  return {
    ...existing,
    projectSummary: existing.projectSummary || intro.introduction,
    introduction: intro.introduction || existing.introduction,
    story: intro.story || existing.story,
    images: introImages.length ? introImages : existing.images,
    updatedAt: new Date().toISOString(),
  };
}

function mapBreweryStage(step?: string): BrewingStage {
  if (!step) return 1;
  if (step === 'INGREDIENT') return 1;
  if (step === 'FERMENTATION') return 3;
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
    likes: 0,
    comments: [],
  }));
}

export function mapFundingReview(projectId: number, item: FundingReviewItem): FundingReview {
  return {
    id: item.reviewId,
    projectId,
    userName: item.writerNickname,
    rating: item.rating,
    date: formatDate(item.createdAt),
    comment: item.content,
    rewardName: '후원 리워드',
    images: normalizeFundingImageUrls(item.imageUrls),
    tags: [],
    likes: 0,
    timestamp: formatDate(item.createdAt),
  };
}

export function mergeSupportOption(existing: FundingProject, option: FundingSupportOption): FundingProject {
  const bottleSize = getVolumeFromDescription(option.description);
  return {
    ...existing,
    pricePerBottle: option.price,
    rewardItems: [option.name],
    bottleSize: bottleSize || existing.bottleSize,
    updatedAt: new Date().toISOString(),
  };
}
