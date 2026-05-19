import type { ImageSourcePropType } from 'react-native';

export type ProjectStatus =
  | "작성 중"
  | "심사 중"
  | "심사 반려"
  | "펀딩 예정"
  | "진행 중"
  | "목표 달성"
  | "펀딩 성공"
  | "펀딩 실패"
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
  content: string;
  date: string;
  likes: number;
}

export interface JournalComment {
  id: number;
  journalId: number;
  userName: string;
  isBrewery?: boolean;
  content: string;
  date: string;
  likes: number;
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
  creatorId?: string;
  breweryId?: string;
  liked?: boolean;
  favoriteCount?: number;
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
  mainIngredients?: string;
  subIngredients?: string;
  tags?: string[];
  projectSummary?: string;
  introduction?: string;
  story?: string;
  projectPolicy?: string;
  expectedDifficulties?: string;
  rewardDetails?: string;
  budget?: BudgetItem[];
  schedule?: ScheduleItem[];
  tasteProfile?: TasteProfile;
  team?: string;
  breweryBio?: string;
  breweryProfileImage?: string;
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

export const activeFundingStatuses: ProjectStatus[] = ["펀딩 예정", "진행 중", "목표 달성"];

export const completedFundingStatuses: ProjectStatus[] = ["펀딩 성공", "펀딩 실패", "제작 중", "배송 중", "완료"];

export function isActiveFundingStatus(status: ProjectStatus) {
  return activeFundingStatuses.includes(status);
}

export function isSupportableFundingStatus(status: ProjectStatus) {
  return status === "진행 중" || status === "목표 달성";
}

export function isCompletedFundingStatus(status: ProjectStatus) {
  return completedFundingStatuses.includes(status);
}

export function getFundingStatusLabel(status: ProjectStatus) {
  if (status === "목표 달성") return "목표 달성";
  if (status === "펀딩 성공") return "펀딩 성공";
  if (status === "펀딩 실패") return "펀딩 실패";
  return status;
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
