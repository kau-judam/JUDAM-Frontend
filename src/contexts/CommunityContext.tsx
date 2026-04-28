import { createContext, useContext, useState, ReactNode } from "react";

export interface Post {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
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
    avatar: "👤",
    content: "오늘 처음으로 막걸리 담가봤어요! 국내산 쌀로 만들었는데 생각보다 쉽더라구요. 다들 한번 도전해보세요! 🍶",
    likes: 42,
    comments: 8,
    timestamp: "2시간 전",
    liked: false,
    tags: ["막걸리", "첫도전"],
  },
  {
    id: 2,
    author: "술샘양조장",
    authorType: "brewery",
    avatar: "🏭",
    content: "이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!",
    image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
    likes: 127,
    comments: 23,
    timestamp: "5시간 전",
    liked: true,
    tags: ["양조장투어", "누룩"],
  },
  {
    id: 3,
    author: "막걸리마스터",
    authorType: "user",
    avatar: "👤",
    content: "장미 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 레시피 공유할게요:\n\n1. 국내산 쌀 2kg\n2. 누룩 200g\n3. 장미꽃잎 100g\n\n발효는 3일 정도 걸렸어요 🌹",
    likes: 89,
    comments: 15,
    timestamp: "어제",
    liked: false,
    tags: ["레시피", "장미막걸리"],
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
