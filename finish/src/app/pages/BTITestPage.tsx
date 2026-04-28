import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import logoImage from "figma:asset/077be0a11981ede2d2797e331499ae1f33b4d6da.png";

interface Question {
  id: number;
  text: string;
  category: "alcohol" | "body" | "sweetness" | "aroma";
}

const questions: Question[] = [
  { id: 1, text: "독한 술이 좋다", category: "alcohol" },
  { id: 2, text: "가벼운 술을 선호한다", category: "alcohol" },
  { id: 3, text: "묵직하고 진한 느낌이 좋다", category: "body" },
  { id: 4, text: "깔끔하고 맑은 느낌을 선호한다", category: "body" },
  { id: 5, text: "단맛이 나는 술이 좋다", category: "sweetness" },
  { id: 6, text: "드라이하고 시큼한 맛을 선호한다", category: "sweetness" },
  { id: 7, text: "향이 강한 술이 좋다", category: "aroma" },
  { id: 8, text: "담백한 향을 선호한다", category: "aroma" },
  { id: 9, text: "높은 도수에 도전하고 싶다", category: "alcohol" },
  { id: 10, text: "탄산감이 있는 술이 좋다", category: "body" },
  { id: 11, text: "달콤한 디저트 같은 술을 즐긴다", category: "sweetness" },
  { id: 12, text: "복합적이고 깊은 향이 좋다", category: "aroma" },
];

const likertOptions = [
  { value: 1, label: "매우 아니다", type: "negative" },
  { value: 2, label: "아니다", type: "negative" },
  { value: 3, label: "보통", type: "neutral" },
  { value: 4, label: "그렇다", type: "positive" },
  { value: 5, label: "매우 그렇다", type: "positive" },
];

export function BTITestPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Check if user has existing result
  useEffect(() => {
    const savedResult = localStorage.getItem("btiResult");
    if (savedResult) {
      // Navigate to result page if there's a saved result
      navigate(`/bti-result/${savedResult}`);
    }
  }, [navigate]);

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate result
      const result = calculateResult(newAnswers);
      // Save result to localStorage
      localStorage.setItem("btiResult", result);
      navigate(`/bti-result/${result}`);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || null);
    } else {
      navigate("/");
    }
  };

  const calculateResult = (answers: Record<number, number>): string => {
    // Calculate scores for each dimension
    const alcoholScore = (answers[1] + (6 - answers[2]) + answers[9]) / 3;
    const bodyScore = ((6 - answers[4]) + answers[3] + (6 - answers[10])) / 3;
    const sweetnessScore = (answers[5] + (6 - answers[6]) + answers[11]) / 3;
    const aromaScore = (answers[7] + (6 - answers[8]) + answers[12]) / 3;

    // Convert to binary codes
    const H_L = alcoholScore >= 3 ? "H" : "L"; // High/Low alcohol
    const T_C = bodyScore >= 3 ? "T" : "C"; // Thick/Clear body
    const S_A = sweetnessScore >= 3 ? "S" : "A"; // Sweet/Acidic
    const P_noneP = aromaScore >= 3 ? "P" : "noneP"; // Perfume/no emphasis

    // Handle 'A' (Acidic only, no perfume) case
    if (S_A === "A" && P_noneP === "noneP") {
      return `${H_L}${T_C}AP`;
    }

    return `${H_L}${T_C}${S_A}${P_noneP === "P" ? "P" : ""}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#2B1810] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F9A825] to-[#F57F17] text-white p-6 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="주담" className="w-8 h-8 object-contain" />
              <h1 className="text-xl font-bold">酒談 술BTI</h1>
            </div>
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="text-sm text-white/90 mb-2 text-center font-semibold">
              {currentQuestion + 1} / {questions.length}
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#FBC02D]/20"
            >
              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center leading-relaxed">
                {questions[currentQuestion].text}
              </h2>

              {/* Likert Scale Options */}
              <div className="space-y-3">
                {likertOptions.map((option) => {
                  const isSelected = selectedAnswer === option.value;
                  const isPositive = option.type === "positive";
                  const isNegative = option.type === "negative";
                  const isNeutral = option.type === "neutral";
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] border-3 ${
                        isSelected
                          ? isPositive
                            ? "bg-gradient-to-r from-[#F9A825] to-[#F57F17] text-white shadow-xl scale-[1.02] border-[#F57F17]"
                            : isNegative
                            ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-xl scale-[1.02] border-gray-900"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-xl scale-[1.02] border-gray-500"
                          : isPositive
                          ? "bg-white border-[3px] border-[#FBC02D] text-[#F57F17] hover:bg-[#FFF9E1] shadow-md"
                          : isNegative
                          ? "bg-white border-[3px] border-gray-400 text-gray-700 hover:bg-gray-50 shadow-md"
                          : "bg-white border-[3px] border-gray-300 text-gray-600 hover:bg-gray-50 shadow-md"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedAnswer !== null ? 1 : 0.3 }}
                className="mt-8"
              >
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#F9A825] to-[#F57F17] hover:from-[#F57F17] hover:to-[#E65100] text-white font-bold text-lg py-6 rounded-2xl shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      다음 질문
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    "결과 확인하기"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Decorative Pattern */}
          <div className="mt-8 text-center">
            <svg
              className="w-32 h-8 mx-auto opacity-20"
              viewBox="0 0 100 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 10 Q 10 0, 20 10 T 40 10 T 60 10 T 80 10 T 100 10"
                stroke="#F9A825"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}