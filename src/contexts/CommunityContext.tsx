import { createContext, useContext, useState, ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";

export interface Post {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: ImageSourcePropType | string;
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
    avatar: require("../../newpicutre/person1.png"),
    title: "첫 막걸리 도전 성공기!",
    content:
      "처음으로 막걸리 담그기에 도전해봤는데요! 생각보다 어렵지 않았어요. 국내산 쌀과 전통 누룩을 사용했고, 발효 과정에서 은은한 쌀 향이 정말 좋았습니다.",
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
    avatar: require("../../newpicutre/person2.png"),
    title: "이번 주말 전통 누룩 양조장 투어 안내",
    content:
      "이번 주말에 양조장 투어를 진행합니다. 전통 누룩을 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!",
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
    avatar: require("../../newpicutre/person3.png"),
    title: "딸기 막걸리 레시피 공유",
    content:
      "딸기 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 국내산 쌀 2kg, 누룩 200g, 딸기청 100g으로 만들었고 발효는 3일 정도 걸렸어요.",
    likes: 89,
    comments: 15,
    timestamp: "어제",
    liked: false,
    category: "정보게시판",
    tags: ["레시피", "딸기막걸리"],
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
