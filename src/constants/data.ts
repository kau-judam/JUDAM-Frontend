import type { ImageSourcePropType } from 'react-native';

export type ProjectStatus =
  | "READY"
  | "REVIEWING"
  | "ONGOING"
  | "ACTIVE"
  | "ENDED"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED"
  | "CANCELLED"
  | "REJECTED"
  | "REJECT"
  | "DENIED"
  | "작성 중"
  | "대기 중"
  | "준비 중"
  | "심사 중"
  | "심사 반려"
  | "펀딩 반려"
  | "펀딩 예정"
  | "진행 중"
  | "목표 달성"
  | "펀딩 성공"
  | "펀딩 실패"
  | "취소된 펀딩"
  | "성공 종료"
  | "실패 종료"
  | "종료"
  | "제작 중"
  | "배송 중"
  | "완료";

export interface TasteProfile {
  sweetness: number;
  aroma: number;
  acidity: number;
  body: number;
  carbonation: number;
}

export interface BudgetItem {
  item: string;
  amount: number;
}

export interface ScheduleItem {
  date: string;
  description: string;
}

export type BrewingStage = 1 | 2 | 3 | 4 | 5;

export const BREWING_STAGES = [
  { id: 1 as BrewingStage, name: "엄선된 원료 준비 및 검수" },
  { id: 2 as BrewingStage, name: "원료 가공 및 혼합" },
  { id: 3 as BrewingStage, name: "자연의 기다림, 발효" },
  { id: 4 as BrewingStage, name: "제술 및 정제" },
  { id: 5 as BrewingStage, name: "병입" },
];

export interface JournalReply {
  id: number;
  commentId: number;
  userName: string;
  isBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  date: string;
  likes: number;
  liked?: boolean;
}

export interface JournalComment {
  id: number;
  journalId: number;
  userName: string;
  isBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  date: string;
  likes: number;
  liked?: boolean;
  replies: JournalReply[];
}

export interface JournalEntry {
  id: number;
  stage: BrewingStage;
  date: string;
  title: string;
  content: string;
  images?: string[];
  videoUrl?: string;
  likes: number;
  liked?: boolean;
  comments: JournalComment[];
}

export interface FundingProject {
  id: number;
  title: string;
  brewery: string;
  breweryLogo?: string;
  location: string;
  category: string;
  shortTitle?: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  localImage?: ImageSourcePropType;
  videoUrl?: string;
  popularRank?: number;
  isMine?: boolean;
  breweryUserId?: string;
  ownerUserId?: string;
  creatorId?: string;
  breweryId?: string;
  liked?: boolean;
  favoriteCount?: number;
  sulbtiMatchScore?: number | null;
  matchScore?: number | null;
  tasteMatchScore?: number | null;
  matchRate?: number | null;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  pricePerBottle?: number;
  bottleSize?: string;
  volume?: string;
  alcoholContent?: string;
  totalQuantity?: number;
  targetQuantity?: number;
  estimatedDelivery?: string;
  rewardItems?: string[];
  shippingFee?: number;
  businessAddress?: string;
  breweryAddress?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  mainIngredients?: string;
  subIngredients?: string;
  tags?: string[];
  projectSummary?: string;
  introduction?: string;
  story?: string;
  projectPolicy?: string;
  refundPolicy?: string;
  exchangePolicy?: string;
  expectedDifficulties?: string;
  rewardDetails?: string;
  budgetPlanText?: string;
  schedulePlanText?: string;
  budget?: BudgetItem[];
  schedule?: ScheduleItem[];
  tasteProfile?: TasteProfile;
  team?: string;
  breweryBio?: string;
  breweryProfileImage?: string;
  breweryInfo?: {
    breweryUserId?: string;
    breweryName?: string;
    mainName?: string;
    oneLineIntroduction?: string;
    shortIntroduction?: string;
    brandStory?: string;
    history?: string;
    establishedYear?: string;
    businessRegistrationNumber?: string;
    address?: string;
    businessAddress?: string;
    businessAddressDetail?: string;
    representativeName?: string;
    profileImageUrl?: string;
    businessRegistrationFileUrl?: string;
    missingFields?: string[];
  };
  productType?: string;
  ingredients?: { id: number; ingredient: string; origin: string }[];
  journals?: JournalEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export const fundingProjects: FundingProject[] = [];

export interface Recipe {
  id: number;
  title: string;
  author: string;
  description: string;
  ingredients?: string[];
  subIngredients?: string[];
  flavorTags?: string[];
  alcoholRange?: string;
  concept?: string;
  summary?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
  image?: string | ImageSourcePropType;
  popularRank?: number;
  status?: string;
  isFundable?: boolean;
  authorType?: string;
  authorId?: string;
  authorAvatar?: string | ImageSourcePropType;
  createdAt?: string;
}

export const recipesData: Recipe[] = [
  {
    id: 1,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    author: "김주담",
    description: "전통 누룩과 국내산 쌀을 사용한 현대적인 막걸리 레시피입니다. 부드러운 단맛과 은은한 탄산이 특징이에요.",
    ingredients: ["국내산 유기농 쌀", "전통 누룩", "천연 효모", "생수"],
    likes: 89,
    comments: 23,
    timestamp: "2시간 전",
    liked: false,
    image: require('../../newpicutre/recipe1.jpg'),
    popularRank: 1,
  },
  {
    id: 2,
    title: "장미향 가득한 봄날의 약주",
    author: "꽃술연구가",
    description: "유기농 장미꽃잎으로 만든 은은한 향의 약주입니다. 여성분들에게 특히 인기가 많아요!",
    ingredients: ["유기농 쌀", "누룩", "장미꽃잎", "꿀"],
    likes: 142,
    comments: 37,
    timestamp: "5시간 전",
    liked: true,
    image: require('../../newpicutre/recipe2.jpg'),
    popularRank: 2,
  },
  {
    id: 3,
    title: "제주 감귤 막걸리",
    author: "감귤러버",
    description: "제주산 무농약 감귤을 듬뿍 넣은 상큼한 막걸리. 새콤달콤한 맛이 일품입니다.",
    ingredients: ["멥쌀", "누룩", "제주 감귤", "황설탕"],
    likes: 67,
    comments: 18,
    timestamp: "1일 전",
    liked: false,
    image: require('../../newpicutre/recipe3.png'),
    popularRank: 3,
  },
];

export function getImageSource(image?: string | ImageSourcePropType) {
  if (!image) return undefined;
  return typeof image === 'string' ? { uri: image } : image;
}

export function getFundingProjectImageSource(project: FundingProject) {
  return project.localImage || getImageSource(project.image);
}

export type FundingStatusTone = "active" | "reviewing" | "success" | "failed" | "ended" | "neutral";

export const activeFundingStatuses: ProjectStatus[] = ["ACTIVE"];

export const completedFundingStatuses: ProjectStatus[] = [
  "펀딩 성공",
  "펀딩 실패",
  "취소된 펀딩",
  "종료",
  "제작 중",
  "배송 중",
  "완료",
  "ENDED",
  "SUCCESS",
  "FAILED",
  "CANCELED",
  "CANCELLED",
];

function normalizeFundingStatus(status: ProjectStatus | string) {
  return String(status || '').trim().toUpperCase();
}

function getFundingStatusText(status: ProjectStatus | string) {
  return String(status || '').trim();
}

export function isActiveFundingStatus(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  return activeFundingStatuses.includes(status) || normalized === "ACTIVE";
}

export function isSupportableFundingStatus(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  return normalized === "ACTIVE";
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function getKstDateString(date = new Date()) {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeFundingDateOnly(value?: string) {
  if (!value) return '';
  const trimmed = String(value).trim();
  const dateMatch = trimmed.match(/(\d{4})[-./]\s*(\d{1,2})[-./]\s*(\d{1,2})/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return '';
  return getKstDateString(date);
}

export function isFundingEndDateExpired(project: Pick<FundingProject, 'endDate'> | null | undefined) {
  const endDate = normalizeFundingDateOnly(project?.endDate);
  if (!endDate) return false;
  return endDate < getKstDateString();
}

export function isFundingProjectSupportable(project: Pick<FundingProject, 'status' | 'endDate'> | null | undefined) {
  return Boolean(project && isSupportableFundingStatus(project.status) && !isFundingEndDateExpired(project));
}

export function isFundingProjectManageable(project: Pick<FundingProject, 'status' | 'endDate'> | null | undefined) {
  if (!project || isFundingEndDateExpired(project)) return false;
  const normalized = normalizeFundingStatus(project.status);
  const text = getFundingStatusText(project.status);
  return normalized === "READY" || normalized === "REVIEWING" || normalized === "ACTIVE" || text === "펀딩 예정" || text === "진행 중";
}

export function isCompletedFundingStatus(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  return (
    completedFundingStatuses.includes(status) ||
    normalized === "SUCCESS" ||
    normalized === "FAILED" ||
    normalized === "ENDED" ||
    normalized === "CANCELLED" ||
    normalized === "CANCELED"
  );
}

export function isSuccessfulFundingStatus(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  const text = getFundingStatusText(status);
  return normalized === "SUCCESS" || text === "펀딩 성공" || text === "성공 종료" || text === "목표 달성";
}

export function isFailedFundingStatus(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  const text = getFundingStatusText(status);
  return normalized === "FAILED" || text === "펀딩 실패" || text === "실패 종료";
}

export function getFundingStatusTone(status: ProjectStatus): FundingStatusTone {
  const normalized = normalizeFundingStatus(status);
  if (isSuccessfulFundingStatus(status)) return "success";
  if (isFailedFundingStatus(status)) return "failed";
  if (
    normalized === "ENDED" ||
    normalized === "CANCELLED" ||
    normalized === "CANCELED" ||
    getFundingStatusText(status) === "종료" ||
    getFundingStatusText(status) === "취소된 펀딩"
  ) return "ended";
  if (isSupportableFundingStatus(status)) return "active";
  if (normalized === "REVIEWING" || getFundingStatusText(status) === "심사 중") return "reviewing";
  return "neutral";
}

export function getFundingProjectStatusTone(project: Pick<FundingProject, 'status' | 'endDate'>): FundingStatusTone {
  if (isSupportableFundingStatus(project.status) && isFundingEndDateExpired(project)) return "ended";
  return getFundingStatusTone(project.status);
}

export function getFundingStatusLabel(status: ProjectStatus | string) {
  const normalized = normalizeFundingStatus(status);
  const text = getFundingStatusText(status);
  if (normalized === "READY") return "준비 중";
  if (normalized === "REVIEWING") return "심사 중";
  if (normalized === "REJECTED" || normalized === "REJECT" || normalized === "DENIED") return "펀딩 반려";
  if (normalized === "ACTIVE") return "진행 중";
  if (normalized === "ONGOING") return "진행 중";
  if (normalized === "SUCCESS") return "펀딩 성공";
  if (normalized === "FAILED") return "펀딩 실패";
  if (normalized === "ENDED") return "종료";
  if (normalized === "CANCELLED" || normalized === "CANCELED") return "취소된 펀딩";
  if (text === "준비 중") return "준비 중";
  if (text === "심사 중") return "심사 중";
  if (text === "심사 반려" || text === "펀딩 반려") return "펀딩 반려";
  if (text === "목표 달성") return "목표 달성";
  if (text === "성공 종료") return "펀딩 성공";
  if (text === "실패 종료") return "펀딩 실패";
  if (text === "펀딩 예정" || text === "진행 중" || text === "펀딩 성공" || text === "펀딩 실패" || text === "취소된 펀딩" || text === "종료") return text;
  return "대기 중";
}

export function getFundingProjectStatusLabel(project: Pick<FundingProject, 'status' | 'endDate'>) {
  if (isSupportableFundingStatus(project.status) && isFundingEndDateExpired(project)) return "펀딩 마감";
  return getFundingStatusLabel(project.status);
}

export function getFundingSupportUnavailableMessage(status: ProjectStatus) {
  const normalized = normalizeFundingStatus(status);
  const text = getFundingStatusText(status);
  if (normalized === "REJECTED" || normalized === "REJECT" || normalized === "DENIED" || text === "심사 반려" || text === "펀딩 반려") return "펀딩 반려된 프로젝트입니다.";
  if (normalized === "CANCELED" || normalized === "CANCELLED" || text === "취소된 펀딩") return "취소된 펀딩에는 후원할 수 없습니다.";
  if (isSuccessfulFundingStatus(status)) return "목표 금액을 달성한 펀딩입니다.";
  if (isFailedFundingStatus(status)) return "목표 금액을 달성하지 못한 펀딩입니다.";
  if (isCompletedFundingStatus(status)) return "종료된 펀딩에는 후원할 수 없습니다.";
  return "진행 중인 펀딩만 후원할 수 있습니다.";
}

export function getFundingProjectSupportUnavailableMessage(project: Pick<FundingProject, 'status' | 'endDate'>) {
  if (isSupportableFundingStatus(project.status) && isFundingEndDateExpired(project)) {
    return "종료된 펀딩에는 후원할 수 없습니다.";
  }
  return getFundingSupportUnavailableMessage(project.status);
}

export function sortFundingProjectsByPopularity(projects: FundingProject[]) {
  return [...projects].sort((a, b) => {
    const favoriteDiff = (b.favoriteCount || 0) - (a.favoriteCount || 0);
    if (favoriteDiff !== 0) return favoriteDiff;
    const aRank = a.popularRank ?? Number.MAX_SAFE_INTEGER;
    const bRank = b.popularRank ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return b.backers - a.backers;
  });
}

export function sortRecipesByPopularity(recipes: Recipe[]) {
  return [...recipes].sort((a, b) => {
    const aRank = a.popularRank ?? Number.MAX_SAFE_INTEGER;
    const bRank = b.popularRank ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return b.likes - a.likes;
  });
}

export function getPopularFundingProjects(limit = 3) {
  return sortFundingProjectsByPopularity(fundingProjects).slice(0, limit);
}

export function getPopularRecipes(limit = 3) {
  return sortRecipesByPopularity(recipesData).slice(0, limit);
}
