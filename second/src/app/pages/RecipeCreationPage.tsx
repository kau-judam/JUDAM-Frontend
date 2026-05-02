import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, X, Sparkles, Upload, Image as ImageIcon, Wand2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const FLAVOR_TAG_POOL = [
  "달콤함", "상큼함", "깔끔함", "고소함", "스파이시",
  "가벼움", "부드러움", "탄산감", "묵직함", "청량감",
  "씁쓸함", "시원함", "진한향", "꽃향기", "과일향", "구수함",
];

const ALCOHOL_RANGES = ["3%~5%", "6%~8%", "9%~12%", "13%~15%", "15% 이상"];

const DUMMY_IMAGE = "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop";

const AI_SUB_INGREDIENTS = ["딸기", "바나나", "복숭아", "사과"];

export function RecipeCreationPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mainIngredients, setMainIngredients] = useState([""]);
  const [generatedSubIngredients, setGeneratedSubIngredients] = useState<string[]>([]);
  const [selectedSubIngredients, setSelectedSubIngredients] = useState<string[]>([]);
  const [alcoholRange, setAlcoholRange] = useState("");
  const [generatedFlavorTags, setGeneratedFlavorTags] = useState<string[]>([]);
  const [selectedFlavorTags, setSelectedFlavorTags] = useState<string[]>([]);
  const [customFlavorInput, setCustomFlavorInput] = useState("");
  const [customFlavorTags, setCustomFlavorTags] = useState<string[]>([]);
  const [concept, setConcept] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 메인 재료
  const handleMainIngredientChange = (index: number, value: string) => {
    const updated = [...mainIngredients];
    updated[index] = value;
    setMainIngredients(updated);
  };
  const handleRemoveMainIngredient = (index: number) => {
    setMainIngredients(mainIngredients.filter((_, i) => i !== index));
  };

  // 서브 재료 AI 생성
  const handleGenerateSubIngredients = () => {
    const hasMain = mainIngredients.some((ing) => ing.trim() !== "");
    if (!hasMain) {
      toast.error("메인 재료를 입력해야합니다");
      return;
    }
    setGeneratedSubIngredients(AI_SUB_INGREDIENTS);
    setSelectedSubIngredients([]);
  };

  const toggleSubIngredient = (ingredient: string) => {
    setSelectedSubIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  // 지향하는 맛 AI 생성
  const handleGenerateFlavorTags = () => {
    const shuffled = [...FLAVOR_TAG_POOL].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 4);
    setGeneratedFlavorTags(picked);
    setSelectedFlavorTags([]);
  };
  const toggleFlavorTag = (tag: string) => {
    setSelectedFlavorTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 직접 입력 태그 추가
  const handleAddCustomFlavorTag = () => {
    const trimmed = customFlavorInput.trim();
    if (!trimmed) return;
    if (customFlavorTags.includes(trimmed)) {
      setCustomFlavorInput("");
      return;
    }
    setCustomFlavorTags((prev) => [...prev, trimmed]);
    setCustomFlavorInput("");
  };
  const handleRemoveCustomFlavorTag = (tag: string) => {
    setCustomFlavorTags((prev) => prev.filter((t) => t !== tag));
  };

  // 프로젝트 요약 AI 생성
  const handleGenerateSummary = () => {
    setDescription("무난한 메인 재료와 독특한 서브 재료를 가진 유니크한 술 입니다.");
  };

  // 이미지 AI 생성
  const handleGenerateImage = () => {
    setImagePreview(DUMMY_IMAGE);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("레시피 제목을 입력해주세요.");
      return;
    }
    toast.success("레시피가 제안되었습니다! 많은 분들이 좋아하시면 양조장에서 연락을 드릴 거예요.");
    navigate("/recipe");
  };

  const sectionClass = "bg-white rounded-xl p-5 border border-gray-200";
  const labelClass = "text-gray-900 font-semibold mb-3 block text-sm";
  const inputClass = "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400";
  const chipBase = "px-4 py-2 rounded-full font-medium transition-all text-sm";

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">레시피 제안하기</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Form */}
      <section className="px-4 pt-20 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 1. 레시피 제목 */}
            <div className={sectionClass}>
              <Label className={labelClass}>레시피 제목 *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 전통 누룩의 재발견 - 현대적 막걸리"
                className={inputClass}
                required
              />
            </div>

            {/* 2. 재료 (메인 / 서브) */}
            <div className={sectionClass}>
              {/* 메인 재료 - 추가 버튼 없음 */}
              <div className="mb-5">
                <Label className={labelClass}>메인 재료 *</Label>
                <div className="space-y-2">
                  {mainIngredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleMainIngredientChange(index, e.target.value)}
                        placeholder="예: 국내산 찹쌀"
                        className={inputClass}
                      />
                      {mainIngredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMainIngredient(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 서브 재료 - AI 생성 버튼 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className={labelClass.replace("mb-3", "")}>서브 재료</Label>
                  <button
                    type="button"
                    onClick={handleGenerateSubIngredients}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Wand2 className="w-3 h-3" />
                    AI 생성
                  </button>
                </div>

                <AnimatePresence>
                  {generatedSubIngredients.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-2"
                    >
                      {generatedSubIngredients.map((ingredient) => (
                        <button
                          key={ingredient}
                          type="button"
                          onClick={() => toggleSubIngredient(ingredient)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                            selectedSubIngredients.includes(ingredient)
                              ? "bg-black text-white border-black"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {ingredient}
                          {selectedSubIngredients.includes(ingredient) && (
                            <span className="ml-2 text-xs opacity-70">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {generatedSubIngredients.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    메인 재료를 입력한 후 AI 생성 버튼을 눌러보세요.
                  </p>
                )}
              </div>
            </div>

            {/* 3. 도수 범위 */}
            <div className={sectionClass}>
              <Label className={labelClass}>도수 범위</Label>
              <div className="flex flex-wrap gap-2">
                {ALCOHOL_RANGES.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setAlcoholRange(range)}
                    className={`${chipBase} ${
                      alcoholRange === range
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 지향하는 맛 */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-gray-900 font-semibold text-sm">
                  지향하는 맛 (다중 선택 가능)
                </Label>
                <button
                  type="button"
                  onClick={handleGenerateFlavorTags}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  AI 생성
                </button>
              </div>

              <AnimatePresence>
                {generatedFlavorTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {generatedFlavorTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFlavorTag(tag)}
                        className={`${chipBase} ${
                          selectedFlavorTags.includes(tag)
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {generatedFlavorTags.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  메인·서브 재료를 입력한 후 AI 생성 버튼을 눌러보세요.
                </p>
              )}

              {/* 직접 입력 태그 */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-2">직접 입력</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={customFlavorInput}
                    onChange={(e) => setCustomFlavorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomFlavorTag();
                      }
                    }}
                    placeholder="예: 허브향, 은은함..."
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFlavorTag}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    추가
                  </button>
                </div>
                {customFlavorTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customFlavorTags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomFlavorTag(tag)}
                          className="ml-0.5 hover:text-gray-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 5. 프로젝트 컨셉 */}
            <div className={sectionClass}>
              <Label className={labelClass}>프로젝트 컨셉</Label>
              <Textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="이 술이 담고자 하는 컨셉이나 스토리를 입력해주세요."
                className={`${inputClass} min-h-[100px] resize-none`}
              />
            </div>

            {/* 6. 프로젝트 요약 */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-gray-900 font-semibold text-sm">프로젝트 요약</Label>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  AI 생성
                </button>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="레시피 및 관련 정보를 간략하게 요약해주세요."
                className={`${inputClass} min-h-[120px] resize-none`}
              />
            </div>

            {/* 7. 이미지 업로드 */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-gray-900 font-semibold text-sm">이미지 업로드</Label>
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  AI 생성
                </button>
              </div>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm font-medium">이미지 선택</span>
                    <span className="text-xs text-gray-400">또는 AI 생성 버튼을 눌러보세요</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-xl transition-colors"
              >
                레시피 제안하기
              </Button>
            </div>

            {/* 가이드라인 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                주담은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 지향합니다. 타인을 비방하거나 모욕하는 글, 무분별한 홍보 게시물은 무통보 삭제될 수 있습니다.
              </p>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}