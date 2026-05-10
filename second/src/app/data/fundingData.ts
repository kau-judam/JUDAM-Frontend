// 프로젝트 상태 타입
export type ProjectStatus =
  | "작성 중"        // 임시저장
  | "심사 중"        // 제출됨
  | "심사 반려"      // 수정 필요
  | "펀딩 예정"      // 승인됨, 시작 전
  | "진행 중"        // 펀딩 진행 중
  | "목표 달성"      // 진행 중이지만 목표 달성
  | "펀딩 성공"      // 펀딩 종료, 성공
  | "펀딩 실패"      // 펀딩 종료, 실패
  | "제작 중"        // 펀딩 성공 후 제조 중
  | "배송 중"        // 배송 시작
  | "완료";          // 모든 배송 완료

// 맛 프로필
export interface TasteProfile {
  sweetness: number;    // 단맛 (0-100)
  aroma: number;        // 잔향 (0-100)
  acidity: number;      // 산미 (0-100)
  body: number;         // 바디감 (0-100)
  carbonation: number;  // 탄산감 (0-100)
}

// 예산 항목
export interface BudgetItem {
  item: string;
  amount: number;
}

// 일정 항목
export interface ScheduleItem {
  date: string;
  description: string;
}

// 양조일지 단계
export type BrewingStage = 1 | 2 | 3 | 4 | 5;

export const BREWING_STAGES = [
  { id: 1 as BrewingStage, name: "엄선된 원료 준비 및 검수" },
  { id: 2 as BrewingStage, name: "원료 가공 및 혼합" },
  { id: 3 as BrewingStage, name: "자연의 기다림, 발효" },
  { id: 4 as BrewingStage, name: "제술 및 정제" },
  { id: 5 as BrewingStage, name: "병입" },
];

// 양조일지 대댓글
export interface JournalReply {
  id: number;
  commentId: number;
  userName: string;
  content: string;
  date: string;
  likes: number;
}

// 양조일지 댓글
export interface JournalComment {
  id: number;
  journalId: number;
  userName: string;
  content: string;
  date: string;
  likes: number;
  replies: JournalReply[];
}

// 양조일지 항목
export interface JournalEntry {
  id: number;
  stage: BrewingStage; // 단계 번호 (1-5)
  date: string;
  title: string;
  content: string;
  images?: string[];
  videoUrl?: string;
  likes: number;
  comments: JournalComment[];
}

export interface FundingProject {
  // 기본 정보
  id: number;
  title: string;
  brewery: string;
  breweryLogo?: string;
  location: string;
  category: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  videoUrl?: string;

  // 펀딩 정보
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;

  // 제품 상세
  mainIngredients?: string;
  subIngredients?: string;
  alcoholContent?: string;
  bottleSize?: string;
  volume?: string;
  pricePerBottle?: number;
  targetQuantity?: number;
  estimatedDelivery?: string;

  // 맛 지표
  tasteProfile?: TasteProfile;

  // 프로젝트 계획
  introduction?: string;
  rewardDetails?: string;
  budget?: BudgetItem[];
  schedule?: ScheduleItem[];
  team?: string;

  // 양조장 정보
  breweryBio?: string;
  breweryProfileImage?: string;

  // 법적 고시 정보
  productType?: string;
  ingredients?: { id: number; ingredient: string; origin: string }[];

  // 양조일지
  journals?: JournalEntry[];

  // 메타 정보
  createdAt?: string;
  updatedAt?: string;
}

export const fundingProjects: FundingProject[] = [
  {
    id: 1,
    title: "봄을 담은 벚꽃 막걸리 프로젝트",
    brewery: "꽃샘양조장",
    breweryLogo: "🌸",
    location: "경기 양평",
    category: "막걸리",
    shortDescription: "우리나라 전통의 맛을 현대적으로 재해석한 항수입니다.",
    image:
      "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlcyUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzQ1OTU2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 4350000,
    backers: 156,
    daysLeft: 12,
    status: "진행 중",
    startDate: "2026. 03. 20",
    endDate: "2026. 04. 18",
    mainIngredients: "국내산 쌀, 전통 누룩",
    subIngredients: "식용 벚꽃잎",
    alcoholContent: "6%",
    bottleSize: "375ml",
    pricePerBottle: 20000,
    targetQuantity: 500,
    estimatedDelivery: "2026. 06. 15",
    tasteProfile: {
      sweetness: 70,
      aroma: 55,
      acidity: 80,
      body: 65,
      carbonation: 75,
    },
    budget: [
      { item: "원료비 (쌀, 누룩, 벚꽃)", amount: 180 },
      { item: "양조 인건비", amount: 150 },
      { item: "병입 및 포장 비용", amount: 100 },
      { item: "배송비", amount: 80 },
      { item: "디자인 및 마케팅", amount: 60 },
      { item: "플랫폼 수수료 (7%)", amount: 40 },
    ],
    schedule: [
      { date: "3월 20일", description: "펀딩 시작 및 원료 준비 완료" },
      { date: "4월 18일", description: "펀딩 종료 및 최종 레시피 확정" },
      { date: "4월 25일", description: "벚꽃 수확 및 양조 시작 (발효 30일)" },
      { date: "5월 25일", description: "발효 완료 및 숙성" },
      { date: "6월 1일", description: "병입 및 라벨링 작업" },
      { date: "6월 15일", description: "배송 시작 (순차 발송)" },
    ],
    journals: [],
  },
  {
    id: 2,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    brewery: "술샘양조장",
    breweryLogo: "🍶",
    location: "경기 양평",
    category: "막걸리",
    shortDescription: "전통 누룩을 사용한 현대적인 막걸리를 함께 만들어요.",
    image:
      "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGxpcXVvciUyMGJvdHRsZSUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NTk1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 3750000,
    backers: 127,
    daysLeft: 18,
    status: "진행 중",
    startDate: "2026. 03. 15",
    endDate: "2026. 04. 13",
    mainIngredients: "국내산 쌀, 자가제 누룩",
    subIngredients: "발효효모",
    alcoholContent: "7%",
    bottleSize: "500ml",
    pricePerBottle: 25000,
    targetQuantity: 400,
    estimatedDelivery: "2026. 06. 10",
    tasteProfile: {
      sweetness: 60,
      aroma: 70,
      acidity: 65,
      body: 80,
      carbonation: 50,
    },
    budget: [
      { item: "원료비 (쌀, 누룩)", amount: 200 },
      { item: "양조 인건비", amount: 180 },
      { item: "병입 및 포장 비용", amount: 120 },
      { item: "배송비", amount: 70 },
      { item: "디자인 및 마케팅", amount: 50 },
      { item: "플랫폼 수수료 (7%)", amount: 35 },
    ],
    schedule: [
      { date: "3월 15일", description: "펀딩 시작 및 누룩 제조 시작" },
      { date: "4월 13일", description: "펀딩 종료" },
      { date: "4월 20일", description: "양조 시작 (발효 35일)" },
      { date: "5월 25일", description: "발효 완료 및 숙성" },
      { date: "6월 5일", description: "병입 및 라벨링" },
      { date: "6월 10일", description: "배송 시작" },
    ],
    journals: [],
  },
  {
    id: 3,
    title: "꽃향기 가득한 약주 프로젝트",
    brewery: "꽃담양조",
    breweryLogo: "🌺",
    location: "전북 전주",
    category: "약주",
    shortDescription: "계절의 꽃향기를 담은 프리미엄 약주입니다.",
    image:
      "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBicmV3aW5nJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NzQ1OTU2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 8000000,
    currentAmount: 6400000,
    backers: 203,
    daysLeft: 8,
    status: "진행 중",
    startDate: "2026. 03. 25",
    endDate: "2026. 04. 10",
    mainIngredients: "국내산 찹쌀, 백국 누룩",
    subIngredients: "장미, 국화, 매화",
    alcoholContent: "13%",
    bottleSize: "500ml",
    pricePerBottle: 35000,
    targetQuantity: 300,
    estimatedDelivery: "2026. 07. 01",
    tasteProfile: {
      sweetness: 85,
      aroma: 90,
      acidity: 40,
      body: 75,
      carbonation: 20,
    },
    budget: [
      { item: "원료비 (찹쌀, 누룩, 꽃)", amount: 280 },
      { item: "양조 인건비", amount: 220 },
      { item: "병입 및 포장 비용", amount: 150 },
      { item: "배송비", amount: 90 },
      { item: "디자인 및 마케팅", amount: 80 },
      { item: "플랫폼 수수료 (7%)", amount: 56 },
    ],
    schedule: [
      { date: "3월 25일", description: "펀딩 시작 및 꽃 계약 진행" },
      { date: "4월 10일", description: "펀딩 종료" },
      { date: "4월 15일", description: "양조 시작 (발효 50일)" },
      { date: "6월 5일", description: "발효 완료 및 숙성" },
      { date: "6월 25일", description: "병입 및 라벨링" },
      { date: "7월 1일", description: "배송 시작" },
    ],
    journals: [],
  },
  {
    id: 4,
    title: "증류식 소주의 부활",
    brewery: "안동양조",
    breweryLogo: "🥃",
    location: "경북 안동",
    category: "소주",
    image:
      "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwd2luZSUyMGZlcm1lbnRhdGlvbiUyMGNlcmFtaWMlMjBqYXJ8ZW58MXx8fHwxNzc0NTk1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 10000000,
    currentAmount: 4500000,
    backers: 89,
    daysLeft: 22,
    status: "진행 중",
    journals: [],
  },
  {
    id: 5,
    title: "산사 막걸리 프로젝트",
    brewery: "산사양조",
    breweryLogo: "🍃",
    location: "강원 평창",
    category: "막걸리",
    image:
      "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYWxjb2hvbCUyMGJvdHRsZSUyMGVsZWdhbnQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc0NTk1Njg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 4000000,
    currentAmount: 4500000,
    backers: 178,
    daysLeft: 0,
    status: "펀딩 성공",
    journals: [],
  },
  {
    id: 6,
    title: "한라봉 소주 특별판",
    brewery: "제주양조",
    breweryLogo: "🍊",
    location: "제주",
    category: "소주",
    image:
      "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlJTIwcG91cmluZyUyMGdsYXNzJTIwZGFya3xlbnwxfHx8fDE3NzQ1OTU2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 7000000,
    currentAmount: 8200000,
    backers: 234,
    daysLeft: 0,
    status: "펀딩 성공",
    journals: [],
  },
];
