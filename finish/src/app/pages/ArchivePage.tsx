import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Star,
  Search,
  ChevronRight,
  Wine,
  X,
  Droplet,
  Heart,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../contexts/AuthContext";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
interface FundedDrink {
  id: number;
  name: string;
  category: string;
  brewery: string;
  image: string;
  amount: number;
  option: string;
  participatedAt: string;
  deliveredAt: string | null;
  deliveryStatus: "예정" | "완료" | "취소";
  hasReview: boolean;
  fundingId: number;
}

interface ExperiencedDrink {
  id: number;
  name: string;
  brewery: string;
  category: string;
  image: string;
  rating: number;
  date: string;
  tags: string[];
  isFunding: boolean;
  alcohol: number;
}

// ────────────────────────────────────────────
// Mock Data (fundingId aligned with FundingDetailPage)
// ────────────────────────────────────────────
const fundedDrinksData: FundedDrink[] = [
  {
    id: 1,
    name: "봄을 담은 벚꽃 막걸리",
    category: "막걸리",
    brewery: "꽃샘양조장",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    amount: 28000,
    option: "375ml × 2병",
    participatedAt: "2025.01.10",
    deliveredAt: "2025.03.14",
    deliveryStatus: "완료",
    hasReview: false,
    fundingId: 1,
  },
  {
    id: 2,
    name: "전통 누룩의 재발견",
    category: "막걸리",
    brewery: "술샘양조장",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    amount: 35000,
    option: "500ml × 1병",
    participatedAt: "2024.11.22",
    deliveredAt: "2025.01.08",
    deliveryStatus: "완료",
    hasReview: true,
    fundingId: 2,
  },
  {
    id: 5,
    name: "산사 막걸리",
    category: "막걸리",
    brewery: "산사양조",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    amount: 42000,
    option: "300ml × 2병",
    participatedAt: "2025.03.01",
    deliveredAt: null,
    deliveryStatus: "예정",
    hasReview: false,
    fundingId: 5,
  },
];

const experiencedDrinksData: ExperiencedDrink[] = [
  {
    id: 1,
    name: "봄을 담은 벚꽃 막걸리",
    brewery: "꽃샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.5,
    date: "2025.03.14",
    tags: ["달콤한", "부드러운", "특별한날"],
    isFunding: true,
    alcohol: 6,
  },
  {
    id: 2,
    name: "전통 누룩의 재발견",
    brewery: "술샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 5.0,
    date: "2025.01.08",
    tags: ["묵직한", "고소한"],
    isFunding: true,
    alcohol: 7,
  },
  {
    id: 3,
    name: "안동 증류식 소주",
    brewery: "안동양조",
    category: "소주",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.0,
    date: "2025.02.20",
    tags: ["깔끔한", "묵직한"],
    isFunding: false,
    alcohol: 45,
  },
  {
    id: 4,
    name: "꽃향기 주",
    brewery: "과일청양조",
    category: "청주",
    image: "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 5.0,
    date: "2025.01.30",
    tags: ["과일향", "깔끔한"],
    isFunding: false,
    alcohol: 13,
  },
  {
    id: 5,
    name: "감귤 막걸리",
    brewery: "꽃담양조",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    rating: 4.5,
    date: "2025.01.15",
    tags: ["달콤한", "과일향"],
    isFunding: false,
    alcohol: 6,
  },
];

// ────────────────────────────────────────────
// StarRating
// ────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

// ────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────
export function ArchivePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL ?tab=all 로 탭 상태 유지 → 뒤로가기 시 복원됨
  const activeTab = (searchParams.get("tab") as "funded" | "all") ?? "funded";
  const setActiveTab = (tab: "funded" | "all") => {
    setSearchParams({ tab }, { replace: true });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFunded = fundedDrinksData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brewery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAll = experiencedDrinksData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brewery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddClick = () => {
    if (!user) navigate("/login");
    else navigate("/archive/add");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">술 아카이브</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            새로운 술 작성하기
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Tabs */}
        <div className="flex mt-4 bg-gray-100 rounded-xl p-1">
          {(["funded", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "funded" ? "내가 참여했던 펀딩 술" : "전체 경험한 술"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-3 mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="이름, 종류, 태그 등으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 rounded-xl text-sm focus:border-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "funded" ? (
            <motion.div key="funded" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.18 }}>
              <FundedTab data={filteredFunded} />
            </motion.div>
          ) : (
            <motion.div key="all" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
              <AllTab data={filteredAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Funded Tab
// ────────────────────────────────────────────
function FundedTab({ data }: { data: FundedDrink[] }) {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Wine className="w-9 h-9 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm">참여한 펀딩 술이 없습니다</p>
        <p className="text-gray-400 text-xs mt-1">펀딩에 참여해 나만의 전통주를 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {data.map((item, index) => {
        const progressPercentage = 75; // 더미값

        return (
          <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0" onClick={() => navigate(`/archive/order/${item.id}`)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-600">{item.brewery}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold">{item.category}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-md font-bold ${
                      item.deliveryStatus === "완료" ? "bg-emerald-50 text-emerald-700"
                      : item.deliveryStatus === "예정" ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.deliveryStatus === "완료" ? "배송완료" : item.deliveryStatus === "예정" ? "배송예정" : "취소됨"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-3 line-clamp-2 leading-tight">{item.name}</h3>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-black">{progressPercentage}%</span>
                    <span className="text-xs text-gray-500">{item.participatedAt}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5 bg-gray-100" indicatorClassName="bg-gradient-to-r from-gray-800 to-black" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────
// All Drinks Tab
// ────────────────────────────────────────────
function AllTab({ data }: { data: ExperiencedDrink[] }) {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Wine className="w-9 h-9 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm">경험한 술이 없습니다</p>
        <p className="text-gray-400 text-xs mt-1">마신 술을 기록해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 cursor-pointer active:scale-[0.98]"
          onClick={() => navigate(`/archive/${item.id}`)}
        >
          <div className="flex gap-4">
            {/* 왼쪽: 썸네일 */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.isFunding && (
                <span className="absolute top-1.5 left-1.5 bg-white text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-gray-200">
                  펀딩 술
                </span>
              )}
            </div>

            {/* 오른쪽: 내용 */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* 날짜 - 최상단에 위치 */}
              <span className="text-[10px] text-gray-400 whitespace-nowrap self-end mb-1">
                {item.date}
              </span>
              <div>
                {/* 양조장 + 카테고리 */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs font-bold text-gray-500">{item.brewery}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>
                {/* 제목 */}
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-black line-clamp-1 leading-tight flex-1">
                    {item.name}
                  </h3>
                </div>
                {/* 별점 */}
                <StarRating rating={item.rating} />
              </div>

              {/* 하단: 태그 */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Droplet className="w-2.5 h-2.5" />
                  {item.alcohol}%
                </span>
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}