import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Star,
  Camera,
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useFunding } from "../contexts/FundingContext";

// ── Mock funding project data (aligned with FundingDetailPage IDs) ──
const fundingProjects: Record<
  number,
  {
    id: number;
    title: string;
    brewery: string;
    category: string;
    image: string;
    myVotes: { label: string; choice: string }[];
  }
> = {
  1: {
    id: 1,
    title: "봄을 담은 벚꽃 막걸리",
    brewery: "꽃샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    myVotes: [
      { label: "단맛", choice: "중간" },
      { label: "탄산", choice: "높음" },
      { label: "쌀 종류", choice: "백미" },
    ],
  },
  2: {
    id: 2,
    title: "전통 누룩의 재발견",
    brewery: "술샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    myVotes: [
      { label: "단맛", choice: "적게" },
      { label: "탄산", choice: "중간" },
      { label: "숙성도", choice: "전통방식" },
    ],
  },
  5: {
    id: 5,
    title: "산사 막걸리",
    brewery: "산사양조",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    myVotes: [
      { label: "단맛", choice: "많이" },
      { label: "바디감", choice: "가볍게" },
      { label: "첨가물", choice: "없음" },
    ],
  },
  3: {
    id: 3,
    title: "꽃향기 가득한 약주",
    brewery: "꽃담양조",
    category: "약주",
    image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    myVotes: [
      { label: "향", choice: "강하게" },
      { label: "도수", choice: "13%" },
    ],
  },
};

// ── Preset tags ──
const PRESET_TAGS = {
  "맛·향": ["달콤한", "깔끔한", "묵직한", "산미있는", "쓴맛", "고소한", "부드러운", "탄산있는", "구수한", "과일향"],
  "상황": ["혼술", "친구모임", "데이트", "특별한날", "식사중", "야외", "집들이", "기념일"],
  "감성": ["행복한", "설레는", "그리운", "편안한", "들뜬", "차분한"],
};

// ── Half Star Rating ──
function HalfStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const full = display >= star;
          const half = !full && display >= star - 0.5;
          return (
            <div key={star} className="relative w-10 h-10">
              <Star className="absolute inset-0 w-10 h-10 fill-gray-100 text-gray-200" />
              {full && (
                <Star className="absolute inset-0 w-10 h-10 fill-amber-400 text-amber-400" />
              )}
              {half && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="w-10 h-10 fill-amber-400 text-amber-400" />
                </div>
              )}
              <div
                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onMouseEnter={() => setHover(star - 0.5)}
                onClick={() => onChange(star - 0.5)}
              />
              <div
                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onMouseEnter={() => setHover(star)}
                onClick={() => onChange(star)}
              />
            </div>
          );
        })}
        <div className="ml-2">
          {value > 0 ? (
            <span className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</span>
          ) : (
            <span className="text-sm text-gray-400">별점을 선택해주세요</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Match Rating (1-5 for vote match) ──
function MatchRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const labels = ["별로예요", "조금 달라요", "비슷해요", "잘 맞아요", "완벽해요!"];
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
              value === n
                ? "bg-gray-900 border-gray-900 text-white"
                : "border-gray-100 text-gray-500 bg-white hover:border-gray-300"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-xs text-center text-gray-500 mt-2">{labels[value - 1]}</p>
      )}
    </div>
  );
}

// ── Tags Section ──
function TagsSection({
  selected,
  onToggle,
  customInput,
  setCustomInput,
  onAddCustom,
  onRemoveCustom,
  customTags,
}: {
  selected: string[];
  onToggle: (t: string) => void;
  customInput: string;
  setCustomInput: (v: string) => void;
  onAddCustom: () => void;
  onRemoveCustom: (t: string) => void;
  customTags: string[];
}) {
  const [openSection, setOpenSection] = useState<string | null>("맛·향");

  return (
    <div className="space-y-2">
      {Object.entries(PRESET_TAGS).map(([section, tags]) => (
        <div key={section} className="bg-gray-50 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === section ? null : section)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm font-bold text-gray-700">{section}</span>
            <div className="flex items-center gap-2">
              {selected.filter((t) => tags.includes(t)).length > 0 && (
                <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                  {selected.filter((t) => tags.includes(t)).length}
                </span>
              )}
              {openSection === section ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>
          <AnimatePresence>
            {openSection === section && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onToggle(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selected.includes(tag)
                          ? "bg-gray-900 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {selected.includes(tag) && <Check className="w-3 h-3 inline mr-1" />}
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Custom tag input */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm font-bold text-gray-700 mb-2">직접 입력</p>
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAddCustom())}
            placeholder="나만의 태그 추가..."
            className="h-10 bg-white border-gray-200 rounded-xl text-sm"
          />
          <button
            type="button"
            onClick={onAddCustom}
            disabled={!customInput.trim()}
            className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full font-semibold"
              >
                #{tag}
                <button type="button" onClick={() => onRemoveCustom(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export function FundingReviewWritePage() {
  const { fundingId } = useParams();
  const navigate = useNavigate();
  const { participatedFundings } = useFunding();

  const projectId = parseInt(fundingId || "1");
  const project = fundingProjects[projectId] || fundingProjects[1];

  // 해당 펀딩에 참여했는지 확인
  const hasParticipated = participatedFundings.some((f) => f.id === projectId);

  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [form, setForm] = useState({
    reviewText: "",
    mood: "",
    pairing: "",
  });

  // 펀딩에 참여하지 않은 경우
  if (!hasParticipated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">리뷰 작성 권한이 없습니다</h2>
            <p className="text-gray-600 mb-8">
              이 펀딩 프로젝트에 참여한 사용자만<br />
              리뷰를 작성할 수 있습니다.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 text-lg rounded-2xl"
            >
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allSelectedTags = [...selectedTags, ...customTags];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = customInput.trim().replace(/^#/, "");
    if (tag && !allSelectedTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag]);
    }
    setCustomInput("");
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && uploadedImages.length < 3) {
      const urls = Array.from(files)
        .slice(0, 3 - uploadedImages.length)
        .map((f) => URL.createObjectURL(f));
      setUploadedImages((prev) => [...prev, ...urls]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("별점을 입력해주세요.");
      return;
    }
    if (!form.reviewText.trim()) {
      toast.error("후기 내용을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      toast.success("후기가 등록되었습니다! 🍶");
      navigate("/archive");
    } catch {
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">펀딩 술 후기 작성</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-5">
        {/* ── Funded Drink Info ── */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded-md">
                펀딩 술
              </span>
              <span className="text-[10px] text-gray-400">{project.category}</span>
            </div>
            <p className="font-bold text-gray-900 text-sm leading-snug">{project.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{project.brewery}</p>
          </div>
        </div>

        {/* ── My Votes Recap ── */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-xs font-bold text-amber-800 mb-3">내가 투표했던 옵션</p>
          <div className="grid grid-cols-3 gap-2">
            {project.myVotes.map((vote) => (
              <div key={vote.label} className="bg-white rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-gray-400 mb-0.5">{vote.label}</p>
                <p className="text-xs font-bold text-gray-900">{vote.choice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Photo Upload ── */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-3">사진 첨부 (최대 3장)</p>
          <input
            id="review-image"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setUploadedImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {uploadedImages.length < 3 && (
              <label
                htmlFor="review-image"
                className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
              >
                <Camera className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-[10px] text-gray-400">추가</span>
              </label>
            )}
          </div>
        </div>

        {/* ── Overall Rating ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-4">이 술이 마음에 드셨나요? *</p>
          <HalfStarRating value={rating} onChange={setRating} />
        </div>

        {/* ── Vote Match Score ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-1.5">
            투표한 맛과 얼마나 일치했나요?
          </p>
          <p className="text-xs text-gray-400 mb-4">
            내가 원했던 맛이 실제 술에 얼마나 반영되었는지 알려주세요
          </p>
          <MatchRating value={matchScore} onChange={setMatchScore} />
        </div>

        {/* ── Review Text ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <Label className="text-sm font-bold text-gray-900 block mb-3">상세 후기 *</Label>
          <Textarea
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            placeholder="맛, 향, 질감, 기대와 비교해서 어떠셨나요? 솔직하게 남겨주세요."
            className="min-h-[120px] bg-gray-50 border-gray-200 rounded-xl resize-none text-sm"
            rows={5}
          />
          <p className="text-right text-xs text-gray-300 mt-1">{form.reviewText.length}자</p>
        </div>

        {/* ── Mood & Pairing ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <p className="text-sm font-bold text-gray-900">그날의 기록 (선택)</p>
          <div>
            <Label className="text-xs text-gray-400 block mb-1.5">어떤 기분이었나요?</Label>
            <Input
              value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
              placeholder="예: 설레고 기대됐어요"
              className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 block mb-1.5">함께한 안주</Label>
            <Input
              value={form.pairing}
              onChange={(e) => setForm({ ...form, pairing: e.target.value })}
              placeholder="예: 파전, 두부김치"
              className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-3">태그</p>
          <TagsSection
            selected={selectedTags}
            onToggle={toggleTag}
            customInput={customInput}
            setCustomInput={setCustomInput}
            onAddCustom={addCustomTag}
            onRemoveCustom={removeCustomTag}
            customTags={customTags}
          />
        </div>

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold h-14 text-base rounded-2xl transition-colors"
        >
          {isLoading ? "등록 중..." : "후기 등록하기"}
        </button>
      </div>
    </div>
  );
}
