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
  liked?: boolean;
}

export interface JournalComment {
  id: number;
  journalId: number;
  userName: string;
  isBrewery?: boolean;
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
  productType?: string;
  ingredients?: { id: number; ingredient: string; origin: string }[];
  journals?: JournalEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export const fundingProjects: FundingProject[] = [
  {
    id: 9001,
    title: '코코 시그니처 막걸리',
    brewery: '코코양조장',
    breweryLogo: 'ㅋ',
    location: '[10357] 경기 고양시 일산동구 산두로229번길 18-10',
    category: '막걸리',
    shortTitle: '코코 시그니처',
    shortDescription: '쌀의 고소함과 산뜻한 산미를 살린 양조장 대표 프로젝트입니다.',
    image: '',
    localImage: require('../../newpicutre/funding1.jpg'),
    isMine: true,
    goalAmount: 3000000,
    currentAmount: 1680000,
    backers: 42,
    daysLeft: 12,
    status: '진행 중',
    startDate: '2026. 05. 20',
    endDate: '2026. 06. 08',
    pricePerBottle: 12000,
    bottleSize: '500ml',
    alcoholContent: '6%',
    rewardItems: ['코코 시그니처 막걸리 2병 세트'],
    breweryBio: '지역 쌀과 계절 재료로 작은 배치의 전통주를 빚는 양조장입니다.',
    journals: [
      {
        id: 9101,
        stage: 1,
        date: '2026. 05. 21',
        title: '원료 입고 및 세척 완료',
        content: '고양 지역 쌀 120kg을 입고하고 선별 세척을 마쳤습니다. 수분 상태가 좋아 예정대로 침지 공정을 시작했습니다.',
        likes: 12,
        comments: [],
      },
      {
        id: 9102,
        stage: 2,
        date: '2026. 05. 23',
        title: '고두밥 찌기와 밑술 준비',
        content: '쌀을 고르게 증자한 뒤 냉각하여 누룩과 섞었습니다. 발효실 온도는 24도로 맞춰 초반 발효를 안정적으로 유도하고 있습니다.',
        likes: 18,
        comments: [],
      },
    ],
  },
  {
    id: 9002,
    title: '고양 배꽃 약주',
    brewery: '코코양조장',
    breweryLogo: 'ㅋ',
    location: '[10357] 경기 고양시 일산동구 산두로229번길 18-10',
    category: '약주',
    shortTitle: '고양 배꽃 약주',
    shortDescription: '은은한 배 향과 맑은 목넘김을 담은 종료 프로젝트입니다.',
    image: '',
    localImage: require('../../newpicutre/funding2.jpg'),
    isMine: true,
    goalAmount: 4500000,
    currentAmount: 5120000,
    backers: 128,
    daysLeft: 0,
    status: '펀딩 성공',
    startDate: '2026. 04. 01',
    endDate: '2026. 04. 30',
    pricePerBottle: 18000,
    bottleSize: '375ml',
    alcoholContent: '13%',
    rewardItems: ['고양 배꽃 약주 1병'],
    breweryBio: '지역 쌀과 계절 재료로 작은 배치의 전통주를 빚는 양조장입니다.',
    journals: [
      {
        id: 9201,
        stage: 1,
        date: '2026. 04. 03',
        title: '배 원료 검수 완료',
        content: '향이 좋은 배 원료를 선별하고 당도와 산도를 확인했습니다. 약주 베이스와 어울리도록 착즙량을 조정했습니다.',
        likes: 24,
        comments: [],
      },
      {
        id: 9202,
        stage: 5,
        date: '2026. 04. 28',
        title: '병입 및 라벨 부착 완료',
        content: '숙성 후 여과를 마친 약주를 병입하고 라벨 부착을 완료했습니다. 리워드 출고 전 최종 품질 검사를 진행했습니다.',
        likes: 31,
        comments: [],
      },
    ],
  },
];
const DEFAULT_FUNDING_IMAGE = require('../../newpicutre/funding3.jpg');

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
  return project.localImage || getImageSource(project.image) || DEFAULT_FUNDING_IMAGE;
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
