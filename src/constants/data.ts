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
