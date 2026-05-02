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
  {
    id: 4,
    title: "한약재 약주 - 건강한 술",
    author: "약주마스터",
    description: "당귀, 황기 등 한약재를 넣어 몸에 좋은 약주를 만들어봤어요. 은은한 한약 향이 매력적입니다.",
    ingredients: ["찹쌀", "누룩", "당귀", "황기", "대추"],
    likes: 54,
    comments: 12,
    timestamp: "2일 전",
    liked: false,
  },
  {
    id: 5,
    title: "사과 막걸리 레시피",
    author: "전통주연구소",
    description: "청송 사과를 사용한 프리미엄 막걸리. 지역 특산물로 만든 건강한 술입니다.",
    ingredients: ["청송사과", "국산 쌀", "전통 누룩", "꿀"],
    likes: 156,
    comments: 42,
    timestamp: "3시간 전",
    liked: true,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "전통 방식 쌀 소주",
    author: "전통주애호가",
    description: "전통 증류 방식으로 만든 순한 쌀소주. 깊은 맛과 향이 일품입니다.",
    ingredients: ["국산 쌀", "전통 누룩", "천연 발효"],
    likes: 203,
    comments: 51,
    timestamp: "5시간 전",
    liked: false,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
  },
  {
    id: 7,
    title: "프리미엄 복분자주",
    author: "발효연구가",
    description: "정읍 복분자 100%로 만든 프리미엄 과실주. 진한 복분자 향과 달콤한 맛이 특징입니다.",
    ingredients: ["정읍 복분자", "쌀 누룩", "유기농 설탕"],
    likes: 187,
    comments: 39,
    timestamp: "1일 전",
    liked: false,
    image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop",
  },
];

// 인기순으로 정렬된 레시피 (좋아요 수 기준)
export const getPopularRecipes = (limit?: number): Recipe[] => {
  const sorted = [...recipesData].sort((a, b) => b.likes - a.likes);
  return limit ? sorted.slice(0, limit) : sorted;
};

// 최신순으로 정렬된 레시피
export const getLatestRecipes = (limit?: number): Recipe[] => {
  const sorted = [...recipesData].sort((a, b) => b.id - a.id);
  return limit ? sorted.slice(0, limit) : sorted;
};
