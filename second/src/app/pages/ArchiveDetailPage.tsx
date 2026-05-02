import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Droplet,
  Thermometer,
  Wine,
  Edit2,
  Trash2,
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { toast } from "sonner";

// ────────────────────────────────────────────
// Mock entry data
// ────────────────────────────────────────────
const mockEntries: Record<
  number,
  {
    id: number;
    name: string;
    brewery: string;
    type: string;
    rating: number;
    date: string;
    image: string;
    alcohol: number;
    volume: number;
    temperature: string;
    shelfLife: string;
    isFunding: boolean;
    fundingId?: number;
    tags: string[];
    diary: { mood: string; situation: string; pairing: string; notes: string; photos: string[] };
    tasteProfile: { sweetness: number; acidity: number; body: number; aroma: number };
    myVotes?: { sweetness: string; carbonation: string; rice: string };
    fundingReview?: { matchesExpectation: number; comment: string; likes: number };
  }
> = {
  1: {
    id: 1,
    name: "봄을 담은 벚꽃 막걸리",
    brewery: "꽃샘양조장",
    type: "막걸리",
    rating: 4.5,
    date: "2025-03-14",
    image:
      "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    alcohol: 6,
    volume: 375,
    temperature: "7-10°C",
    shelfLife: "30일",
    isFunding: true,
    fundingId: 1,
    tags: ["달콤한", "부드러운", "특별한날"],
    diary: {
      mood: "설렘 가득한 첫 시음",
      situation: "집에서 혼자 조용히",
      pairing: "전, 파전",
      notes:
        "기다렸던 펀딩 술이 드디어 도착했다! 내가 투표했던 단맛 중간 옵션이 정말 딱 맞게 나왔다. 달콤하면서도 부담스럽지 않은 단맛이 일품.",
      photos: [
        "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    tasteProfile: { sweetness: 4, acidity: 2, body: 3, aroma: 4 },
    myVotes: { sweetness: "중간", carbonation: "높음", rice: "백미" },
    fundingReview: {
      matchesExpectation: 5,
      comment: "투표했던 단맛 중간 옵션이 정말 그대로 반영되었어요! 탄산도 높게 투표했는데 딱 맞게 나왔습니다.",
      likes: 12,
    },
  },
  2: {
    id: 2,
    name: "전통 누룩의 재발견",
    brewery: "술샘양조장",
    type: "막걸리",
    rating: 5.0,
    date: "2025-01-08",
    image:
      "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    alcohol: 7,
    volume: 500,
    temperature: "5-8°C",
    shelfLife: "14일",
    isFunding: true,
    fundingId: 2,
    tags: ["묵직한", "고소한"],
    diary: {
      mood: "기대가 잔뜩",
      situation: "친구들과 함께",
      pairing: "흑돼지 구이",
      notes: "전통 누룩으로 만든 막걸리. 묵직하고 고소한 맛이 압권이었다.",
      photos: [
        "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    tasteProfile: { sweetness: 2, acidity: 3, body: 5, aroma: 4 },
  },
  3: {
    id: 3,
    name: "안동 증류식 소주",
    brewery: "안동양조",
    type: "소주",
    rating: 4.0,
    date: "2025-02-20",
    image:
      "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    alcohol: 45,
    volume: 375,
    temperature: "상온",
    shelfLife: "무기한",
    isFunding: false,
    tags: ["깔끔한", "묵직한"],
    diary: {
      mood: "진지하게",
      situation: "혼술",
      pairing: "안주 없이",
      notes: "전통 방식으로 증류한 소주. 깊고 깔끔한 맛이 인상적이었다.",
      photos: [],
    },
    tasteProfile: { sweetness: 1, acidity: 1, body: 4, aroma: 3 },
  },
  4: {
    id: 4,
    name: "꽃향기 청주",
    brewery: "과일청양조",
    type: "청주",
    rating: 5.0,
    date: "2025-01-30",
    image:
      "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    alcohol: 13,
    volume: 500,
    temperature: "10-12°C",
    shelfLife: "60일",
    isFunding: false,
    tags: ["과일향", "깔끔한"],
    diary: {
      mood: "기분 좋은 저녁",
      situation: "친구 집들이",
      pairing: "전채요리, 샐러드",
      notes: "은은한 꽃향기가 정말 인상적이었다. 13도인데도 부담스럽지 않고 깔끔하게 넘어간다. 다음에 또 사고 싶다.",
      photos: [
        "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    tasteProfile: { sweetness: 3, acidity: 4, body: 2, aroma: 5 },
  },
  5: {
    id: 5,
    name: "감귤 막걸리",
    brewery: "꽃담양조",
    type: "막걸리",
    rating: 4.5,
    date: "2025-01-15",
    image:
      "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    alcohol: 6,
    volume: 375,
    temperature: "6-9°C",
    shelfLife: "14일",
    isFunding: false,
    tags: ["달콤한", "과일향"],
    diary: {
      mood: "상큼한 오후",
      situation: "혼자 집에서",
      pairing: "유자청 떡",
      notes: "제주 감귤의 상큼함이 막걸리와 정말 잘 어울린다. 달콤하면서도 막걸리 특유의 텁텁함이 없어서 좋았다.",
      photos: [
        "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    tasteProfile: { sweetness: 4, acidity: 3, body: 2, aroma: 4 },
  },
};

// ────────────────────────────────────────────
// Star Rating component
// ────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-lg font-bold text-gray-900">{rating.toFixed(1)}</span>
    </div>
  );
}

// ────────────────────────────────────────────
// Stat Card
// ────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-amber-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
      <div className="text-amber-500">{icon}</div>
      <span className="text-xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

// ────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────
export function ArchiveDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"diary" | "taste" | "funding">("diary");

  const entry = mockEntries[parseInt(id || "1")] || mockEntries[1];

  const handleDelete = () => {
    if (confirm("정말로 이 기록을 삭제하시겠습니까?")) {
      toast.success("기록이 삭제되었습니다.");
      navigate("/archive");
    }
  };

  const tasteLabels: Record<string, string> = {
    sweetness: "단맛",
    acidity: "산미",
    body: "바디감",
    aroma: "향",
  };

  const voteLabels: Record<string, string> = {
    sweetness: "단맛",
    carbonation: "탄산",
    rice: "쌀 종류",
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-28">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ height: "320px" }}
        className="relative"
      >
        {/* Back button — inside relative hero */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-30 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 mb-2">
            {entry.isFunding && (
              <span className="bg-gray-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                펀딩 술
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/30">
              {entry.type}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1.5 leading-tight">{entry.name}</h1>
          <div className="flex items-center gap-4 text-white/85">
            <span className="flex items-center gap-1 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {entry.brewery}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {entry.date}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4">
        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-4 overflow-hidden"
        >
          {/* Rating + Edit/Delete */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-50">
            <StarRating rating={entry.rating} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/archive/${entry.id}/edit`)}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 p-4">
            <StatCard icon={<Droplet className="w-6 h-6" />} value={`${entry.alcohol}%`} label="도수" />
            <StatCard icon={<Wine className="w-6 h-6" />} value={`${entry.volume}ml`} label="용량" />
            <StatCard icon={<Thermometer className="w-6 h-6" />} value={entry.temperature} label="권장 온도" />
            <StatCard icon={<Package className="w-6 h-6" />} value={entry.shelfLife} label="유통기한" />
          </div>

          {/* Tags */}
          <div className="px-4 pb-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex gap-2 mt-4 overflow-x-auto pb-1"
        >
          {(["diary", "taste", ...(entry.isFunding ? ["funding"] : [])] as const).map((section) => {
            const labels: Record<string, string> = {
              diary: "주류 일기",
              taste: "맛 프로필",
              funding: "펀딩 후기",
            };
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section as "diary" | "taste" | "funding")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex-shrink-0 ${
                  activeSection === section
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-gray-300"
                }`}
              >
                {labels[section]}
              </button>
            );
          })}
        </motion.div>

        {/* Diary */}
        {activeSection === "diary" && (
          <motion.div
            key="diary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-3 p-5"
          >
            <h3 className="font-bold text-gray-900 mb-4">마신 날의 기록</h3>
            <div className="space-y-4">
              {[
                { label: "그날의 기분", value: entry.diary.mood },
                { label: "어울리는 상황", value: entry.diary.situation },
                { label: "함께한 안주", value: entry.diary.pairing },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs font-semibold text-gray-400 w-20 flex-shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-sm text-gray-800 leading-relaxed">{value}</span>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">상세 노트</p>
                <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-4">
                  {entry.diary.notes}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-400 mb-3">그날의 사진</p>
              <div className="grid grid-cols-3 gap-2">
                {entry.diary.photos.map((photo, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img src={photo} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <button className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                  <span className="text-[10px] text-gray-400">추가</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Taste Profile */}
        {activeSection === "taste" && (
          <motion.div
            key="taste"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-3 p-5"
          >
            <h3 className="font-bold text-gray-900 mb-5">맛 프로필</h3>
            <div className="space-y-4">
              {Object.entries(entry.tasteProfile).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{tasteLabels[key]}</span>
                    <span className="text-sm text-gray-400">{value}/5</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 5) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-2.5 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-amber-50 rounded-2xl">
              <p className="text-xs font-semibold text-gray-600 mb-2">추천 안주</p>
              <p className="text-sm text-gray-700">전, 파전, 부침개, 치즈, 과일</p>
            </div>
            <div className="mt-3 p-4 bg-blue-50 rounded-2xl">
              <p className="text-xs font-semibold text-gray-600 mb-2">어울리는 상황</p>
              <p className="text-sm text-gray-700">친구 모임, 집들이, 비 오는 날</p>
            </div>
          </motion.div>
        )}

        {/* Funding Review */}
        {activeSection === "funding" && entry.isFunding && entry.myVotes && entry.fundingReview && (
          <motion.div
            key="funding"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-3 p-5"
          >
            <h3 className="font-bold text-gray-900 mb-4">펀딩 참여 후기</h3>
            <div className="bg-amber-50 rounded-2xl p-4 mb-5">
              <p className="text-xs font-bold text-gray-600 mb-3">내가 투표한 옵션</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(entry.myVotes).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 mb-1">{voteLabels[key]}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">투표한 맛과의 일치도</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < entry.fundingReview!.matchesExpectation
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm font-bold text-gray-900">
                  {entry.fundingReview.matchesExpectation}/5
                </span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 mb-2">상세 후기</p>
              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-4">
                {entry.fundingReview.comment}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                도움됨 ({entry.fundingReview.likes})
              </button>
              {entry.fundingId && (
                <Link
                  to={`/funding/${entry.fundingId}`}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  프로젝트 보기
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}