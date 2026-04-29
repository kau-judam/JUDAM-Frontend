export interface FundingProject {
  id: number;
  title: string;
  brewery: string;
  breweryLogo?: string;
  location: string;
  category: string;
  shortDescription?: string;
  image: string;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  status: string;
  startDate?: string;
  endDate?: string;
  pricePerBottle?: number;
  bottleSize?: string;
  alcoholContent?: string;
  totalQuantity?: number;
  estimatedDelivery?: string;
  rewardItems?: string[];
  shippingFee?: number;
  mainIngredients?: string;
  subIngredients?: string;
  projectSummary?: string;
  story?: string;
  budget?: { item: string; amount: number }[];
  schedule?: { date: string; description: string }[];
  tasteProfile?: {
    sweetness: number;
    aroma: number;
    acidity: number;
    body: number;
    carbonation: number;
  };
}

export const fundingProjects: FundingProject[] = [
  {
    id: 1,
    title: "봄을 담은 벚꽃 막걸리 프로젝트",
    brewery: "꽃샘양조장",
    breweryLogo: "🌸",
    location: "경기 양평",
    category: "막걸리",
    shortDescription: "우리나라 전통의 맛을 현대적으로 재해석한 막걸리입니다.",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 4350000,
    backers: 156,
    daysLeft: 12,
    status: "진행 중",
    startDate: "2026. 03. 20",
    endDate: "2026. 04. 18",
    pricePerBottle: 20000,
    bottleSize: "375ml",
    alcoholContent: "6%",
    totalQuantity: 500,
    estimatedDelivery: "2026. 06. 15",
    rewardItems: ["벚꽃 막걸리 375ml x 1", "프로젝트 스토리 카드", "양조 일지 알림"],
    shippingFee: 2000,
    mainIngredients: "국내산 쌀, 전통 누룩",
    subIngredients: "식용 벚꽃잎, 봄꽃 발효액",
    projectSummary: "봄철 벚꽃이 만개할 때 수확한 식용 벚꽃잎을 활용하여 전통 누룩 발효 방식으로 빚어내는 계절 한정 막걸리입니다.",
    story: "3대째 이어온 전통 누룩 제조 기술을 바탕으로 봄의 청량한 기운과 벚꽃의 은은한 향을 한 병에 담는 프로젝트입니다. 후원자는 양조 일지를 통해 원료 준비부터 병입까지의 과정을 함께 지켜볼 수 있습니다.",
    budget: [
      { item: "원료비", amount: 180 },
      { item: "양조 인건비", amount: 150 },
      { item: "병입 및 포장 비용", amount: 100 },
      { item: "배송비", amount: 80 },
      { item: "디자인 및 마케팅", amount: 60 },
      { item: "플랫폼 수수료 7%", amount: 40 },
    ],
    schedule: [
      { date: "3월 20일", description: "펀딩 시작 및 원료 준비 완료" },
      { date: "4월 18일", description: "펀딩 종료 및 최종 레시피 확정" },
      { date: "4월 25일", description: "벚꽃 수확 및 양조 시작" },
      { date: "5월 25일", description: "발효 완료 및 숙성" },
      { date: "6월 1일", description: "병입 및 라벨링 작업" },
      { date: "6월 15일", description: "배송 시작" },
    ],
    tasteProfile: { sweetness: 70, aroma: 55, acidity: 80, body: 65, carbonation: 75 },
  },
  {
    id: 2,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    brewery: "술샘양조장",
    breweryLogo: "🍶",
    location: "경기 양평",
    category: "막걸리",
    shortDescription: "전통 누룩을 사용한 현대적인 막걸리를 함께 만들어요.",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 3750000,
    backers: 127,
    daysLeft: 18,
    status: "진행 중",
    startDate: "2026. 03. 15",
    endDate: "2026. 04. 13",
    pricePerBottle: 22000,
    bottleSize: "500ml",
    alcoholContent: "7%",
    totalQuantity: 420,
    estimatedDelivery: "2026. 06. 20",
    rewardItems: ["현대적 막걸리 500ml x 1", "전통 누룩 소개 카드", "양조장 감사 메시지"],
    shippingFee: 2000,
    mainIngredients: "경기 쌀, 수제 누룩",
    subIngredients: "천연 효모, 정제수",
    projectSummary: "전통 누룩의 깊은 풍미를 현대적인 산미와 깔끔한 목넘김으로 재해석한 막걸리 프로젝트입니다.",
    story: "술샘양조장은 오래된 누룩실의 발효 데이터를 바탕으로 전통의 묵직함은 살리고, 젊은 소비자가 부담 없이 즐길 수 있는 산뜻한 막걸리를 만들고자 합니다.",
    budget: [
      { item: "쌀 및 누룩 원료비", amount: 160 },
      { item: "효모 배양 및 발효 관리", amount: 120 },
      { item: "양조 인건비", amount: 130 },
      { item: "병입 및 냉장 포장", amount: 90 },
      { item: "시음 테스트", amount: 40 },
      { item: "플랫폼 수수료 7%", amount: 35 },
    ],
    schedule: [
      { date: "3월 15일", description: "펀딩 시작 및 누룩 배양" },
      { date: "4월 13일", description: "펀딩 종료" },
      { date: "4월 20일", description: "본 발효 시작" },
      { date: "5월 18일", description: "숙성 및 맛 안정화" },
      { date: "6월 5일", description: "병입 및 냉장 검수" },
      { date: "6월 20일", description: "순차 배송" },
    ],
    tasteProfile: { sweetness: 58, aroma: 68, acidity: 62, body: 72, carbonation: 45 },
  },
  {
    id: 3,
    title: "꽃향기 가득한 약주 프로젝트",
    brewery: "꽃담양조",
    breweryLogo: "🌺",
    location: "전북 전주",
    category: "약주",
    shortDescription: "계절의 꽃향기를 담은 프리미엄 약주입니다.",
    image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 8000000,
    currentAmount: 6400000,
    backers: 203,
    daysLeft: 8,
    status: "진행 중",
    startDate: "2026. 03. 25",
    endDate: "2026. 04. 10",
    pricePerBottle: 28000,
    bottleSize: "500ml",
    alcoholContent: "10%",
    totalQuantity: 350,
    estimatedDelivery: "2026. 07. 05",
    rewardItems: ["꽃향기 약주 500ml x 1", "시음 노트 카드", "프리미엄 패키지"],
    shippingFee: 2500,
    mainIngredients: "찹쌀, 전통 누룩",
    subIngredients: "계절 꽃잎, 천연 꿀",
    projectSummary: "은은한 꽃향과 맑은 약주의 질감을 살린 프리미엄 계절 약주 프로젝트입니다.",
    story: "꽃담양조는 전주 지역의 계절 꽃을 활용해 향은 풍부하지만 맛은 과하지 않은 약주를 목표로 합니다. 향미 밸런스 테스트를 여러 차례 거쳐 식전주와 선물용에 어울리는 술을 완성합니다.",
    budget: [
      { item: "찹쌀 및 누룩 원료비", amount: 220 },
      { item: "꽃 원료 선별", amount: 90 },
      { item: "저온 숙성 관리", amount: 180 },
      { item: "프리미엄 패키지", amount: 150 },
      { item: "배송 및 완충 포장", amount: 110 },
      { item: "플랫폼 수수료 7%", amount: 56 },
    ],
    schedule: [
      { date: "3월 25일", description: "펀딩 시작 및 꽃 원료 계약" },
      { date: "4월 10일", description: "펀딩 종료" },
      { date: "4월 17일", description: "담금 및 1차 발효" },
      { date: "5월 20일", description: "저온 숙성" },
      { date: "6월 18일", description: "여과 및 패키지 검수" },
      { date: "7월 5일", description: "배송 시작" },
    ],
    tasteProfile: { sweetness: 66, aroma: 88, acidity: 54, body: 58, carbonation: 15 },
  },
  {
    id: 4,
    title: "증류식 소주의 부활",
    brewery: "안동양조",
    breweryLogo: "🥃",
    location: "경북 안동",
    category: "소주",
    shortDescription: "전통 증류식 소주의 진정한 맛을 경험해보세요.",
    image: "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 10000000,
    currentAmount: 4500000,
    backers: 89,
    daysLeft: 22,
    status: "진행 중",
    startDate: "2026. 03. 10",
    endDate: "2026. 04. 20",
    pricePerBottle: 45000,
    bottleSize: "375ml",
    alcoholContent: "25%",
    totalQuantity: 260,
    estimatedDelivery: "2026. 07. 15",
    rewardItems: ["증류식 소주 375ml x 1", "향미 설명 카드", "전용 포장 박스"],
    shippingFee: 3000,
    mainIngredients: "안동 쌀, 전통 누룩",
    subIngredients: "숙성 원액, 정제수",
    projectSummary: "전통 증류 방식과 현대적인 숙성 관리를 결합해 묵직하고 깨끗한 증류식 소주를 만드는 프로젝트입니다.",
    story: "안동양조는 지역 쌀과 누룩을 활용해 깊은 곡물 향을 지닌 소주를 빚습니다. 소량 증류와 숙성 과정을 통해 강하지만 거친 느낌은 줄인 프리미엄 소주를 목표로 합니다.",
    budget: [
      { item: "쌀 및 누룩 원료비", amount: 260 },
      { item: "증류 설비 운영", amount: 240 },
      { item: "숙성 용기 관리", amount: 170 },
      { item: "병입 및 전용 박스", amount: 150 },
      { item: "품질 검사", amount: 70 },
      { item: "플랫폼 수수료 7%", amount: 70 },
    ],
    schedule: [
      { date: "3월 10일", description: "펀딩 시작 및 원료 확보" },
      { date: "4월 20일", description: "펀딩 종료" },
      { date: "4월 27일", description: "발효 및 원주 준비" },
      { date: "5월 25일", description: "증류 및 블렌딩" },
      { date: "6월 20일", description: "숙성 안정화" },
      { date: "7월 15일", description: "배송 시작" },
    ],
    tasteProfile: { sweetness: 22, aroma: 72, acidity: 28, body: 86, carbonation: 5 },
  },
  {
    id: 5,
    title: "산사 막걸리 프로젝트",
    brewery: "산사양조",
    breweryLogo: "🏔️",
    location: "강원 평창",
    category: "막걸리",
    shortDescription: "깨끗한 산의 기운을 담은 막걸리입니다.",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 4000000,
    currentAmount: 4500000,
    backers: 178,
    daysLeft: 0,
    status: "성공",
    startDate: "2026. 02. 15",
    endDate: "2026. 03. 20",
    pricePerBottle: 25000,
    bottleSize: "500ml",
    alcoholContent: "6%",
    totalQuantity: 300,
    estimatedDelivery: "2026. 05. 30",
    rewardItems: ["산사 막걸리 500ml x 1", "산사 원료 이야기 카드"],
    shippingFee: 2000,
    mainIngredients: "강원 쌀, 산사 열매",
    subIngredients: "전통 누룩, 산사 농축액",
    projectSummary: "산사의 산뜻한 산미와 막걸리의 부드러운 질감을 함께 살린 완료형 프로젝트입니다.",
    story: "산사양조는 평창의 깨끗한 물과 산사 열매를 활용해 산뜻한 향을 가진 막걸리를 선보였습니다. 성공한 펀딩 이후 후원자들의 후기와 개선 의견을 수집하고 있습니다.",
    budget: [
      { item: "쌀 및 산사 원료비", amount: 140 },
      { item: "발효 관리", amount: 110 },
      { item: "병입 및 포장", amount: 80 },
      { item: "배송비", amount: 70 },
      { item: "품질 테스트", amount: 35 },
      { item: "플랫폼 수수료 7%", amount: 28 },
    ],
    schedule: [
      { date: "2월 15일", description: "펀딩 시작" },
      { date: "3월 20일", description: "펀딩 성공 마감" },
      { date: "3월 27일", description: "본 양조 시작" },
      { date: "4월 30일", description: "병입 완료" },
      { date: "5월 15일", description: "후원자 배송" },
      { date: "5월 30일", description: "후기 수집" },
    ],
    tasteProfile: { sweetness: 48, aroma: 52, acidity: 78, body: 55, carbonation: 60 },
  },
  {
    id: 6,
    title: "한라봉 소주 특별판",
    brewery: "제주양조",
    breweryLogo: "🍊",
    location: "제주",
    category: "소주",
    shortDescription: "제주 한라봉의 상큼함을 담은 프리미엄 소주입니다.",
    image: "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goalAmount: 7000000,
    currentAmount: 8200000,
    backers: 234,
    daysLeft: 0,
    status: "성공",
    startDate: "2026. 02. 01",
    endDate: "2026. 03. 10",
    pricePerBottle: 39000,
    bottleSize: "375ml",
    alcoholContent: "16%",
    totalQuantity: 240,
    estimatedDelivery: "2026. 05. 20",
    rewardItems: ["한라봉 소주 375ml x 1", "제주 감귤 향미 카드", "한정 패키지"],
    shippingFee: 3000,
    mainIngredients: "제주 쌀, 증류 원액",
    subIngredients: "한라봉 껍질, 감귤 발효액",
    projectSummary: "제주 한라봉의 상큼한 향을 담은 한정판 소주 프로젝트입니다.",
    story: "제주양조는 한라봉 껍질의 향을 섬세하게 추출해 증류 원액과 블렌딩했습니다. 과일 향은 선명하지만 단맛은 절제해 식사와 함께 즐기기 좋은 소주를 목표로 했습니다.",
    budget: [
      { item: "증류 원액 및 쌀", amount: 210 },
      { item: "한라봉 원료 수급", amount: 150 },
      { item: "블렌딩 및 숙성", amount: 170 },
      { item: "한정 패키지 제작", amount: 130 },
      { item: "제주 배송 물류", amount: 120 },
      { item: "플랫폼 수수료 7%", amount: 49 },
    ],
    schedule: [
      { date: "2월 1일", description: "펀딩 시작" },
      { date: "3월 10일", description: "펀딩 성공 마감" },
      { date: "3월 18일", description: "한라봉 향 추출" },
      { date: "4월 12일", description: "블렌딩 및 숙성" },
      { date: "5월 5일", description: "병입 및 패키지 완료" },
      { date: "5월 20일", description: "후원자 배송" },
    ],
    tasteProfile: { sweetness: 35, aroma: 82, acidity: 64, body: 48, carbonation: 8 },
  },
];

export interface Recipe {
  id: number;
  title: string;
  author: string;
  description: string;
  ingredients?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
  image?: string;
}

export const recipesData: Recipe[] = [
  {
    id: 1,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    author: "전통주러버",
    description: "전통 누룩과 국내산 쌀을 사용한 현대적인 막걸리 레시피입니다. 부드러운 단맛과 은은한 탄산이 특징이에요.",
    ingredients: ["국내산 유기농 쌀", "전통 누룩", "천연 효모", "생수"],
    likes: 89,
    comments: 23,
    timestamp: "2시간 전",
    liked: false,
    image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=600&fit=crop",
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
    image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?w=800&h=600&fit=crop",
  },
];
