import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Camera,
  Star,
  Plus,
  X,
  ChevronRight,
  Sparkles,
  Wine,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { fundingProjects } from "../data/fundingData";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const CATEGORIES = ["막걸리", "약주", "소주", "청주", "과실주", "기타"];

const PRESET_TAGS = {
  "맛·향": ["달콤한", "깔끔한", "묵직한", "산미있는", "쓴맛", "고소한", "부드러운", "탄산있는", "구수한", "과일향"],
  "상황": ["혼술", "친구모임", "데이트", "특별한날", "식사중", "야외", "집들이", "기념일"],
  "감성": ["행복한", "설레는", "그리운", "편안한", "들뜬", "차분한"],
};

// Aligned with FundingDetailPage project IDs
const MY_FUNDED_PROJECTS = [
  {
    id: 1,
    name: "봄을 담은 벚꽃 막걸리",
    brewery: "꽃샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    participatedAt: "2025.01.10",
    fundingId: 1,
  },
  {
    id: 2,
    name: "전통 누룩의 재발견",
    brewery: "술샘양조장",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    participatedAt: "2024.11.22",
    fundingId: 2,
  },
  {
    id: 5,
    name: "산사 막걸리",
    brewery: "산사양조",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    participatedAt: "2025.03.01",
    fundingId: 5,
  },
  {
    id: 3,
    name: "꽃향기 가득한 약주",
    brewery: "꽃담양조",
    category: "약주",
    image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    participatedAt: "2025.02.15",
    fundingId: 3,
  },
];

// ─────────────────────────────────────────────
// Half Star Rating
// ──────────────────────────────────────────────
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
    <div onMouseLeave={() => setHover(null)}>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const full = display >= star;
          const half = !full && display >= star - 0.5;
          return (
            <div key={star} className="relative w-10 h-10 select-none">
              {/* empty */}
              <Star className="absolute inset-0 w-10 h-10 fill-gray-100 text-gray-200" />
              {/* full */}
              {full && (
                <Star className="absolute inset-0 w-10 h-10 fill-amber-400 text-amber-400" />
              )}
              {/* half */}
              {half && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-10 h-10 fill-amber-400 text-amber-400" />
                </div>
              )}
              {/* left half click */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onMouseEnter={() => setHover(star - 0.5)}
                onClick={() => onChange(star - 0.5)}
              />
              {/* right half click */}
              <div
                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                onMouseEnter={() => setHover(star)}
                onClick={() => onChange(star)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline gap-1.5 h-8">
        {value > 0 ? (
          <>
            <span className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</span>
            <span className="text-sm text-gray-400">/ 5.0</span>
            <button
              type="button"
              onClick={() => onChange(0)}
              className="ml-1 text-xs text-gray-300 hover:text-gray-500 underline transition-colors"
            >
              초기화
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400">왼쪽 반 = 0.5 단위, 오른쪽 = 1 단위</span>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Tags Section
// ──────────────────────────────────────────────
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
      {Object.entries(PRESET_TAGS).map(([section, tags]) => {
        const sectionSelected = selected.filter((t) => tags.includes(t)).length;
        return (
          <div key={section} className="rounded-2xl border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => (prev === section ? null : section))
              }
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700">{section}</span>
              <div className="flex items-center gap-2">
                {sectionSelected > 0 && (
                  <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {sectionSelected}
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
                  className="overflow-hidden bg-white"
                >
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const active = selected.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onToggle(tag)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            active
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {active && <Check className="w-2.5 h-2.5" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Custom tag */}
      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">직접 입력</p>
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddCustom();
              }
            }}
            placeholder="나만의 태그..."
            className="h-10 bg-white border-gray-200 rounded-xl text-sm flex-1"
          />
          <button
            type="button"
            onClick={onAddCustom}
            disabled={!customInput.trim()}
            className="w-10 h-10 bg-gray-900 rounded-xl text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {customTags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 text-xs bg-gray-800 text-white px-2.5 py-1 rounded-full font-semibold"
              >
                #{t}
                <button type="button" onClick={() => onRemoveCustom(t)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* All selected preview */}
      {(selected.length > 0 || customTags.length > 0) && (
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] text-gray-400 mb-1.5">선택된 태그</p>
          <div className="flex flex-wrap gap-1.5">
            {[...selected, ...customTags].map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Tasting Slider
// ──────────────────────────────────────────────
function TastingSlider({
  label,
  name,
  value,
  onChange,
  leftLabel,
  rightLabel,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-amber-500 w-6 text-right">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(name, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
          <span>{leftLabel || "1"}</span>
          <span>{rightLabel || "5"}</span>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
type Step = "select-type" | "select-funding" | "form";
type DrinkType = "funding" | "normal";

export function AddArchivePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode: archive/:id/edit

  const isEditMode = !!id;

  // Step state
  const [step, setStep] = useState<Step>(isEditMode ? "form" : "select-type");
  const [drinkType, setDrinkType] = useState<DrinkType | null>(null);
  const [selectedProject, setSelectedProject] = useState<
    (typeof MY_FUNDED_PROJECTS)[0] | null
  >(null);

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    brewery: "",
    category: "막걸리",
    alcohol: "",
    volume: "",
    temperature: "",
    shelfLife: "",
    sweetness: 3,
    sourness: 3,
    body: 3,
    aroma: 3,
    reviewText: "",
    mood: "",
    pairing: "",
  });

  const allTags = [...selectedTags, ...customTags];

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSlider = (name: string, value: number) =>
    setForm({ ...form, [name]: value });

  const toggleTag = (t: string) =>
    setSelectedTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const addCustomTag = () => {
    const t = customInput.trim().replace(/^#/, "");
    if (t && !allTags.includes(t)) setCustomTags((p) => [...p, t]);
    setCustomInput("");
  };
  const removeCustomTag = (t: string) =>
    setCustomTags((p) => p.filter((x) => x !== t));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && uploadedImages.length < 3) {
      const urls = Array.from(files)
        .slice(0, 3 - uploadedImages.length)
        .map((f) => URL.createObjectURL(f));
      setUploadedImages((p) => [...p, ...urls]);
    }
  };

  const handleSubmit = async () => {
    if (drinkType !== "funding" && !form.name.trim()) {
      toast.error("술 이름을 입력해주세요.");
      return;
    }
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      toast.success(isEditMode ? "기록이 수정되었습니다!" : "술 기록이 저장되었습니다! 🍶");
      navigate("/archive");
    } catch {
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "form" && drinkType === "funding") {
      setStep("select-funding");
    } else if (step === "form") {
      setStep("select-type");
    } else if (step === "select-funding") {
      setStep("select-type");
    } else {
      navigate(-1);
    }
  };

  // Steps progress
  const steps =
    drinkType === "funding"
      ? ["select-type", "select-funding", "form"]
      : ["select-type", "form"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900 flex-1">
            {isEditMode
              ? "기록 수정"
              : step === "select-type"
              ? "새로운 술 기록"
              : step === "select-funding"
              ? "펀딩 프로젝트 선택"
              : drinkType === "funding"
              ? "펀딩 술 기록"
              : "술 기록 작성"}
          </h1>
          {!isEditMode && (
            <span className="text-xs text-gray-400 flex-shrink-0">
              {currentStepIndex + 1} / {steps.length}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {!isEditMode && (
          <div className="max-w-md mx-auto px-4 pb-2">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gray-900 rounded-full"
                animate={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </header>

      <div className="max-w-md mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: TYPE SELECTION ─── */}
          {step === "select-type" && (
            <motion.div
              key="select-type"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="pt-8 space-y-4"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                  어떤 술을 기록할까요?
                </h2>
                <p className="text-sm text-gray-500">
                  기록 유형에 따라 입력 항목이 달라져요
                </p>
              </div>

              {/* Funding option */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setDrinkType("funding");
                  setStep("select-funding");
                }}
                className="w-full bg-gray-900 rounded-2xl p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">펀딩 참여 술</span>
                    </div>
                    <p className="font-bold text-white text-base mb-1">
                      주담에서 펀딩한 술
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      내가 후원한 펀딩 술을 기록해요.
                      <br />
                      배송 내역과 함께 시음 노트를 작성하세요!
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </div>
              </motion.button>

              {/* Normal option */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setDrinkType("normal");
                  setStep("form");
                }}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wine className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-bold text-gray-500">일반 술</span>
                    </div>
                    <p className="font-bold text-gray-900 text-base mb-1">
                      그 외 전통주
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      구매하거나 선물받은 술,
                      <br />
                      식당에서 마신 술 등을 기록해요.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* ─── STEP 2: SELECT FUNDING PROJECT ─── */}
          {step === "select-funding" && (
            <motion.div
              key="select-funding"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="pt-6 space-y-3 -mx-4 px-4 min-h-[60vh] bg-gray-50 rounded-t-3xl mt-4 pb-6"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                  어떤 펀딩 술인가요?
                </h2>
                <p className="text-sm text-gray-500">주담에서 진행된 펀딩을 선택해주세요</p>
              </div>

              {fundingProjects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const progress = Math.min(
                  Math.round((project.currentAmount / project.goalAmount) * 100),
                  100
                );
                return (
                  <motion.button
                    key={project.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedProject({
                        id: project.id,
                        name: project.title,
                        brewery: project.brewery,
                        category: project.category,
                        image: project.image,
                        participatedAt: "2025.01.10",
                        fundingId: project.id,
                      });
                      setForm((p) => ({
                        ...p,
                        name: project.title,
                        category: project.category,
                        brewery: project.brewery,
                      }));
                      setStep("form");
                    }}
                    className={`w-full rounded-2xl p-4 border-2 transition-all text-left ${
                      isSelected
                        ? "bg-gray-100 border-gray-400"
                        : "bg-white border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* 썸네일 */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute bottom-1 left-1 p-1 bg-black/50 rounded-full cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      {/* 콘텐츠 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xs font-bold text-gray-600">{project.brewery}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {project.category}
                          </span>
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                              project.status === "진행 중"
                                ? "bg-green-50 text-green-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                          {project.title}
                        </p>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-lg font-bold text-gray-900">{progress}%</span>
                          <span className="text-[10px] text-gray-500">
                            {project.daysLeft > 0 ? `${project.daysLeft}일 남음` : "펀딩 종료"}
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-1 bg-gray-200"
                          indicatorClassName="bg-gradient-to-r from-gray-600 to-gray-900"
                        />
                      </div>

                      {isSelected ? (
                        <Check className="w-5 h-5 text-gray-900 flex-shrink-0 self-center" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 self-center" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* ─── STEP 3: FORM ─── */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="pt-5 space-y-4 pb-4"
            >
              {/* Funding project info pill */}
              {drinkType === "funding" && selectedProject && (
                <div className="bg-white rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded-md mr-1.5">
                      펀딩 술
                    </span>
                    <span className="text-[10px] text-gray-400">{selectedProject.category}</span>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-1">
                      {selectedProject.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("select-funding")}
                    className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0 underline"
                  >
                    변경
                  </button>
                </div>
              )}

              {/* ── Photo Upload ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 pt-4 pb-3">
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    사진 <span className="text-gray-400 font-normal text-xs">(선택 · 최대 3장)</span>
                  </p>
                  <div className="flex gap-2">
                    {uploadedImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setUploadedImages((p) => p.filter((_, j) => j !== i))
                          }
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 3 && (
                      <>
                        <input
                          id="img-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="img-upload"
                          className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
                        >
                          <Camera className="w-5 h-5 text-gray-300 mb-1" />
                          <span className="text-[10px] text-gray-400">추가</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Basic Info (name / brewery / category — not needed for funding) ── */}
              {drinkType !== "funding" && (
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                  <p className="text-sm font-bold text-gray-900">기본 정보</p>
                  <div>
                    <Label className="text-xs text-gray-500 block mb-1.5">술 이름 *</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      placeholder="예: 벚꽃 막걸리"
                      className="h-11 bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 block mb-1.5">양조장</Label>
                    <Input
                      name="brewery"
                      value={form.brewery}
                      onChange={handleInput}
                      placeholder="예: 술샘양조장"
                      className="h-11 bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 block mb-2">종류 *</Label>
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                            form.category === cat
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Specs ── */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-3">
                  상세 스펙{" "}
                  <span className="text-gray-400 font-normal text-xs">(선택)</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "alcohol", label: "도수", placeholder: "예: 6%" },
                    { name: "volume", label: "용량", placeholder: "예: 375ml" },
                    { name: "temperature", label: "권장 온도", placeholder: "예: 7-10°C" },
                    { name: "shelfLife", label: "유통기한", placeholder: "예: 30일" },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <Label className="text-[10px] text-gray-400 block mb-1">
                        {label}
                      </Label>
                      <Input
                        name={name}
                        value={form[name as keyof typeof form] as string}
                        onChange={handleInput}
                        placeholder={placeholder}
                        className="h-10 bg-gray-50 border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Rating ── */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-4">
                  나의 별점 *
                  <span className="text-gray-400 font-normal text-xs ml-2">
                    0.5 단위로 선택
                  </span>
                </p>
                <HalfStarRating value={rating} onChange={setRating} />
              </div>

              {/* ── Tasting Notes ── */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-4">
                  테이스팅 노트{" "}
                  <span className="text-gray-400 font-normal text-xs">(1 낮음 → 5 높음)</span>
                </p>
                <div className="space-y-5">
                  <TastingSlider
                    label="단맛"
                    name="sweetness"
                    value={form.sweetness}
                    onChange={handleSlider}
                    leftLabel="안 달아요"
                    rightLabel="매우 달아요"
                  />
                  <TastingSlider
                    label="신맛"
                    name="sourness"
                    value={form.sourness}
                    onChange={handleSlider}
                    leftLabel="안 셔요"
                    rightLabel="매우 셔요"
                  />
                  <TastingSlider
                    label="바디감"
                    name="body"
                    value={form.body}
                    onChange={handleSlider}
                    leftLabel="가벼워요"
                    rightLabel="묵직해요"
                  />
                  <TastingSlider
                    label="향"
                    name="aroma"
                    value={form.aroma}
                    onChange={handleSlider}
                    leftLabel="약해요"
                    rightLabel="강해요"
                  />
                </div>
              </div>

              {/* ── Tags ── */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-sm font-bold text-gray-900 mb-3">
                  태그{" "}
                  <span className="text-gray-400 font-normal text-xs">(선택)</span>
                </p>
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

              {/* ── Diary ── */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                <p className="text-sm font-bold text-gray-900">
                  주류 일기{" "}
                  <span className="text-gray-400 font-normal text-xs">(선택)</span>
                </p>
                <div>
                  <Label className="text-xs text-gray-400 block mb-1.5">그날의 기분</Label>
                  <Input
                    name="mood"
                    value={form.mood}
                    onChange={handleInput}
                    placeholder="예: 기대가 잔뜩, 설레는 마음으로..."
                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 block mb-1.5">함께한 안주</Label>
                  <Input
                    name="pairing"
                    value={form.pairing}
                    onChange={handleInput}
                    placeholder="예: 파전, 두부김치, 치즈..."
                    className="h-11 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 block mb-1.5">상세 기록</Label>
                  <Textarea
                    name="reviewText"
                    value={form.reviewText}
                    onChange={handleInput}
                    placeholder="맛, 향, 질감, 기억에 남는 순간 등 자유롭게 기록해보세요..."
                    className="min-h-[100px] bg-gray-50 border-gray-200 rounded-xl resize-none text-sm"
                    rows={4}
                  />
                  <p className="text-right text-[10px] text-gray-300 mt-1">
                    {form.reviewText.length}자
                  </p>
                </div>
              </div>

              {/* ── Submit ── */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-bold h-14 text-base rounded-2xl transition-colors"
              >
                {isLoading
                  ? "저장 중..."
                  : isEditMode
                  ? "수정 완료"
                  : "기록 저장하기"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}