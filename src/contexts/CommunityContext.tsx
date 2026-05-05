import { createContext, useContext, useState, ReactNode } from "react";

export interface Post {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  category: string;
  tags: string[];
}

interface CommunityContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  deletePost: (id: number) => void;
  likePost: (id: number) => void;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "전통주러버",
    authorType: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    title: "처음 만든 막걸리, 생각보다 쉬웠어요",
    content: "오늘 처음으로 막걸리 담가봤어요! 국내산 쌀로 만들었는데 생각보다 쉽더라구요. 다들 한번 도전해보세요! 🍶",
    likes: 42,
    comments: 8,
    timestamp: "2시간 전",
    liked: false,
    category: "자유게시판",
    tags: ["막걸리", "첫도전"],
  },
  {
    id: 2,
    author: "술샘양조장",
    authorType: "brewery",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    title: "이번 주말 전통 누룩 양조장 투어 안내",
    content: "이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!",
    image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
    likes: 127,
    comments: 23,
    timestamp: "5시간 전",
    liked: true,
    category: "정보게시판",
    tags: ["양조장투어", "누룩"],
  },
  {
    id: 3,
    author: "막걸리마스터",
    authorType: "user",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
    title: "장미 막걸리 레시피 공유",
    content: "장미 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 레시피 공유할게요:\n\n1. 국내산 쌀 2kg\n2. 누룩 200g\n3. 장미꽃잎 100g\n\n발효는 3일 정도 걸렸어요 🌹",
    likes: 89,
    comments: 15,
    timestamp: "어제",
    liked: false,
    category: "정보게시판",
    tags: ["레시피", "장미막걸리"],
  },
  {
    id: 4,
    author: "청주러버",
    authorType: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    title: "청주 빚을 때 온도 관리 팁",
    content: "청주 빚을 때 온도 관리가 제일 중요한 것 같아요. 18-20도를 유지하니 훨씬 깔끔한 맛이 나더라구요!",
    likes: 56,
    comments: 12,
    timestamp: "2일 전",
    liked: false,
    category: "정보게시판",
    tags: ["청주", "온도관리"],
  },
  {
    id: 5,
    author: "소주마니아",
    authorType: "user",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    title: "집에서 증류식 소주 만드는 법 정리 예정",
    content: "집에서 증류식 소주 만드는 법 궁금하신 분 계신가요? 초보자도 할 수 있는 간단한 방법 알려드려요!",
    likes: 73,
    comments: 19,
    timestamp: "3일 전",
    liked: false,
    category: "정보게시판",
    tags: ["소주", "증류"],
  },
  {
    id: 6,
    author: "한산양조장",
    authorType: "brewery",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    title: "한산소곡주 체험 프로그램 오픈",
    content: "한산소곡주 체험 프로그램 오픈합니다! 전통주 빚기부터 시음까지 알찬 3시간 코스예요. 많은 관심 부탁드립니다 🙏",
    likes: 145,
    comments: 31,
    timestamp: "4일 전",
    liked: true,
    category: "정보게시판",
    tags: ["체험", "한산소곡주"],
  },
];

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const likePost = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <CommunityContext.Provider value={{ posts, addPost, deletePost, likePost }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
