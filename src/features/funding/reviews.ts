export interface FundingReview {
  id: number;
  projectId: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  rewardName: string;
  images: string[];
  mood?: string;
  pairing?: string;
  showRecordInReview?: boolean;
  tags: string[];
  likes: number;
  timestamp: string;
}

export interface FundingReviewComment {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

export const fundingReviews: FundingReview[] = [
  {
    id: 1,
    projectId: 5,
    userName: "전통주러버",
    rating: 5,
    date: "2026. 03. 25",
    rewardName: "얼리버드 2병 세트",
    comment: "정말 기대 이상이었어요! 벚꽃의 은은한 향이 정말 좋았습니다.",
    images: [
      "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop",
    ],
    mood: "기대보다 더 산뜻했어요",
    pairing: "봄나물전",
    showRecordInReview: true,
    tags: ["깔끔한", "탄산있는", "특별한날"],
    likes: 23,
    timestamp: "3일 전",
  },
  {
    id: 2,
    projectId: 5,
    userName: "막걸리매니아",
    rating: 5,
    date: "2026. 03. 23",
    rewardName: "스탠다드 1병 세트",
    comment: "펀딩에 참여해서 받아본 첫 전통주인데 너무 만족스럽습니다. 다음 프로젝트도 기대할게요!",
    images: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop",
    ],
    mood: "첫 펀딩이라 설렜어요",
    pairing: "두부김치",
    showRecordInReview: false,
    tags: ["달콤한", "친구모임"],
    likes: 18,
    timestamp: "5일 전",
  },
  {
    id: 3,
    projectId: 6,
    userName: "술BTI_약주",
    rating: 4,
    date: "2026. 03. 22",
    rewardName: "시음 리워드 1병",
    comment: "향은 좋은데 조금 더 달았으면 좋겠어요. 그래도 전반적으로 만족합니다.",
    images: [],
    mood: "",
    pairing: "",
    showRecordInReview: false,
    tags: ["과일향", "차분한"],
    likes: 9,
    timestamp: "6일 전",
  },
];

export const fundingReviewComments: FundingReviewComment[] = [
  {
    id: 1,
    author: "청사초롱 양조장",
    authorType: "brewery",
    content: "소중한 후기 남겨주셔서 정말 감사드립니다! 앞으로도 더 좋은 술로 보답하겠습니다.",
    timestamp: "2일 전",
    likes: 5,
    liked: false,
  },
  {
    id: 2,
    author: "막걸리마스터",
    authorType: "user",
    content: "저도 참여했는데 너무 만족스러웠어요! 다음 프로젝트도 꼭 참여할 예정입니다.",
    timestamp: "2일 전",
    likes: 2,
    liked: false,
  },
];

export const reviewPresetTags = {
  "맛·향": ["달콤한", "깔끔한", "묵직한", "산미있는", "쓴맛", "고소한", "부드러운", "탄산있는", "구수한", "과일향"],
  "상황": ["혼술", "친구모임", "데이트", "특별한날", "식사중", "야외", "집들이", "기념일"],
  "감성": ["행복한", "설레는", "그리운", "편안한", "들뜬", "차분한"],
};
