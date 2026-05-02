import { useParams, useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Share2, TrendingUp, Sparkles, ArrowRight, Home, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import logoImage from "figma:asset/077be0a11981ede2d2797e331499ae1f33b4d6da.png";

interface BTIResult {
  code: string;
  name: string;
  subtitle: string;
  description: string;
  traits: string[];
  tasteProfile: {
    sweet: number;
    acidic: number;
    body: number;
    abv: number;
    aroma: number;
  };
  recommendedDrinks: string[];
  matchingProject?: {
    id: number;
    name: string;
  };
}

const btiResults: Record<string, BTIResult> = {
  HCSA: {
    code: "HCSA",
    name: "냉철한 도시의 사냥꾼",
    subtitle: "The Urban Hunter",
    description: "도수 높고 산미 있는 깔끔한 증류주를 선호하는 당신. 강렬하면서도 세련된 맛을 추구하며, 도전을 즐기는 모험가입니다.",
    traits: ["고도수 선호", "산미 강조", "깔끔한 피니시", "대담한 선택"],
    tasteProfile: { sweet: 2, acidic: 4, body: 2, abv: 5, aroma: 3 },
    recommendedDrinks: ["증류식 소주", "진", "보드카"],
    matchingProject: { id: 1, name: "전통 누룩의 재발견" },
  },
  HCSP: {
    code: "HCSP",
    name: "새벽 안개의 수도승",
    subtitle: "The Dawn Monk",
    description: "고도수의 달콤하고 맑은 명품 청주를 즐기는 당신. 깊이 있는 단맛과 높은 도수의 조화를 이해하는 통찰력 있는 감상가입니다.",
    traits: ["프리미엄 청주", "은은한 단맛", "높은 도수", "우아한 향"],
    tasteProfile: { sweet: 4, acidic: 2, body: 2, abv: 5, aroma: 4 },
    recommendedDrinks: ["명품 청주", "순미대음양조", "프리미엄 약주"],
    matchingProject: { id: 2, name: "감귤 막걸리 프로젝트" },
  },
  HTSA: {
    code: "HTSA",
    name: "타오르는 불꽃 기사",
    subtitle: "The Flame Knight",
    description: "묵직하고 산미 강한 개성파 탁주를 사랑하는 당신. 강렬한 맛과 복잡한 향의 조화를 즐기는 진정한 전통주 애호가입니다.",
    traits: ["묵직한 바디", "강한 산미", "개성 있는 맛", "전통 양조법"],
    tasteProfile: { sweet: 2, acidic: 5, body: 5, abv: 4, aroma: 3 },
    recommendedDrinks: ["생막걸리", "탁주", "전통 방식 막걸리"],
  },
  HTSP: {
    code: "HTSP",
    name: "둔의 양조 명인",
    subtitle: "The Master Brewer",
    description: "묵직하고 달콤한 고도수 원액을 선호하는 당신. 깊은 맛의 층위를 이해하는 진정한 마니아입니다.",
    traits: ["원액 선호", "깊은 단맛", "묵직한 질감", "복합적 향"],
    tasteProfile: { sweet: 5, acidic: 2, body: 5, abv: 5, aroma: 5 },
    recommendedDrinks: ["막걸리 원액", "고도수 약주", "숙성 전통주"],
  },
  LCSA: {
    code: "LCSA",
    name: "청량한 탄산 요정",
    subtitle: "The Sparkling Fairy",
    description: "저도수의 산미 있고 톡 쏘는 스파클링을 즐기는 당신. 가볍고 상쾌한 순간을 사랑하는 자유로운 영혼입니다.",
    traits: ["톡 쏘는 탄산", "가벼운 도수", "상큼한 산미", "청량감"],
    tasteProfile: { sweet: 2, acidic: 4, body: 2, abv: 2, aroma: 3 },
    recommendedDrinks: ["스파클링 막걸리", "탄산 막걸리", "청량 약주"],
    matchingProject: { id: 2, name: "감귤 막걸리 프로젝트" },
  },
  LCSP: {
    code: "LCSP",
    name: "달빛 아래 시인",
    subtitle: "The Moonlight Poet",
    description: "저도수의 달콤하고 맑은 이지드링킹 약주를 선호하는 당신. 부담 없이 즐기면서도 깊은 감성을 간직한 낭만주의자입니다.",
    traits: ["이지드링킹", "달콤한 맛", "가벼운 즐거움", "서정적 분위기"],
    tasteProfile: { sweet: 4, acidic: 2, body: 2, abv: 2, aroma: 4 },
    recommendedDrinks: ["약주", "청주", "과일 발효주"],
  },
  LTSA: {
    code: "LTSA",
    name: "푸른 들판의 농부",
    subtitle: "The Green Farmer",
    description: "저도수의 산미 있고 걸쭉한 새콤 막걸리를 사랑하는 당신. 건강하고 자연스러운 맛을 추구하는 순수한 마음의 소유자입니다.",
    traits: ["걸쭉한 질감", "새콤한 맛", "자연스러움", "전통의 맛"],
    tasteProfile: { sweet: 2, acidic: 4, body: 4, abv: 2, aroma: 2 },
    recommendedDrinks: ["생막걸리", "전통 탁주", "쌀막걸리"],
  },
  LTSP: {
    code: "LTSP",
    name: "몽글몽글 구름 방랑자",
    subtitle: "The Cloud Wanderer",
    description: "저도수의 달콤하고 부드러운 크리미 막걸리를 즐기는 당신. 포근한 안락함과 달콤한 여유를 사랑하는 온화한 영혼입니다.",
    traits: ["크리미한 질감", "부드러운 단맛", "편안한 느낌", "일상의 행복"],
    tasteProfile: { sweet: 5, acidic: 2, body: 4, abv: 2, aroma: 4 },
    recommendedDrinks: ["크림 막걸리", "달콤한 막걸리", "디저트 막걸리"],
    matchingProject: { id: 1, name: "전통 누룩의 재발견" },
  },
  HSSA: {
    code: "HSSA",
    name: "화려한 축제의 주인공",
    subtitle: "The Festival Star",
    description: "고도수의 탄산감과 화려한 향의 혼성주를 선호하는 당신. 열정적이고 화려한 순간을 즐기는 파티의 중심입니다.",
    traits: ["화려한 향", "강한 탄산", "높은 도수", "축제 분위기"],
    tasteProfile: { sweet: 3, acidic: 4, body: 3, abv: 5, aroma: 5 },
    recommendedDrinks: ["스파클링 와인", "샴페인", "프로세코"],
  },
  HSSP: {
    code: "HSSP",
    name: "심야 식당의 주인",
    subtitle: "The Midnight Chef",
    description: "고도수의 달콤하고 진한 과일 증류주를 사랑하는 당신. 깊은 밤의 여유와 달콤한 위로를 아는 성숙한 어른입니다.",
    traits: ["진한 과실향", "달콤한 맛", "높은 도수", "깊은 여운"],
    tasteProfile: { sweet: 5, acidic: 2, body: 3, abv: 5, aroma: 5 },
    recommendedDrinks: ["과일 증류주", "리큐르", "매실주"],
  },
  LSSA: {
    code: "LSSA",
    name: "상큼한 과수원 소년",
    subtitle: "The Orchard Boy",
    description: "저도수의 탄산 있고 달콤한 과일 막걸리를 즐기는 당신. 활기차고 생동감 넘치는 청춘의 에너지를 가진 밝은 성격입니다.",
    traits: ["과일 향", "청량한 탄산", "달콤 상큼", "젊은 감성"],
    tasteProfile: { sweet: 4, acidic: 3, body: 2, abv: 2, aroma: 4 },
    recommendedDrinks: ["과일 막걸리", "복숭아 막걸리", "딸기 막걸리"],
    matchingProject: { id: 2, name: "감귤 막걸리 프로젝트" },
  },
  LSSP: {
    code: "LSSP",
    name: "달콤한 꿈의 여행자",
    subtitle: "The Sweet Dreamer",
    description: "저도수의 아주 달콤하고 부드러운 디저트주를 선호하는 당신. 달콤한 환상과 행복한 순간을 즐기는 꿈같은 존재입니다.",
    traits: ["디저트 같은 맛", "부드러운 질감", "달콤함", "행복한 기분"],
    tasteProfile: { sweet: 5, acidic: 1, body: 2, abv: 2, aroma: 5 },
    recommendedDrinks: ["디저트 와인", "달콤한 리큐르", "과일주"],
  },
  HCAP: {
    code: "HCAP",
    name: "대숲의 검객",
    subtitle: "The Bamboo Swordsman",
    description: "도수 높고 산미만 강조된 극강의 드라이주를 선호하는 당신. 절제와 강인함을 아는 카리스마 넘치는 전문가입니다.",
    traits: ["극강의 드라이", "높은 도수", "순수한 산미", "절제미"],
    tasteProfile: { sweet: 1, acidic: 5, body: 2, abv: 5, aroma: 2 },
    recommendedDrinks: ["드라이 사케", "진", "드라이 마티니"],
  },
  HTAP: {
    code: "HTAP",
    name: "거친 파도의 선원",
    subtitle: "The Wave Sailor",
    description: "묵직하고 시큼한 전통 방식의 막걸리를 즐기는 당신. 거친 매력과 강인한 정신을 가진 진정한 뱃사람입니다.",
    traits: ["전통 방식", "강한 산미", "묵직한 맛", "거친 매력"],
    tasteProfile: { sweet: 1, acidic: 5, body: 5, abv: 4, aroma: 2 },
    recommendedDrinks: ["전통 생막걸리", "토속주", "농가 막걸리"],
  },
  LCAP: {
    code: "LCAP",
    name: "봄날의 산들바람",
    subtitle: "The Spring Breeze",
    description: "가볍고 산뜻한 데일리 식전주를 선호하는 당신. 일상의 소소한 즐거움을 아는 여유로운 미식가입니다.",
    traits: ["가벼운 음용", "산뜻한 맛", "식전주", "일상적 즐거움"],
    tasteProfile: { sweet: 2, acidic: 4, body: 2, abv: 2, aroma: 2 },
    recommendedDrinks: ["식전주", "라이트 약주", "청량 막걸리"],
  },
  LTAP: {
    code: "LTAP",
    name: "정겨운 시골 할머니",
    subtitle: "The Village Grandma",
    description: "부드러우면서도 쿰쿰한 매력의 옛날 막걸리를 사랑하는 당신. 전통의 정겨움과 따뜻한 인정을 간직한 포근한 마음입니다.",
    traits: ["옛날 방식", "부드러운 맛", "쿰쿰한 향", "정겨움"],
    tasteProfile: { sweet: 2, acidic: 3, body: 4, abv: 2, aroma: 2 },
    recommendedDrinks: ["옛날 막걸리", "전통 탁주", "농가 생막걸리"],
  },
};

export function BTIResultPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const result = btiResults[type || "LTSP"];

  useEffect(() => {
    if (!result) {
      navigate("/bti-test");
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const radarData = [
    { id: "sweet", taste: "단맛", value: result.tasteProfile.sweet, fullMark: 5 },
    { id: "acidic", taste: "산미", value: result.tasteProfile.acidic, fullMark: 5 },
    { id: "body", taste: "바디", value: result.tasteProfile.body, fullMark: 5 },
    { id: "abv", taste: "도수", value: result.tasteProfile.abv, fullMark: 5 },
    { id: "aroma", taste: "향", value: result.tasteProfile.aroma, fullMark: 5 },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `나의 술BTI: ${result.code}`,
          text: `나는 ${result.name}! ${result.subtitle}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다!");
      } catch (err) {
        alert("링크를 복사할 수 없습니다. URL을 직접 복사해주세요.");
      }
    }
  };

  const handleRetakeTest = () => {
    localStorage.removeItem("btiResult");
    navigate("/bti-test");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          alt="술BTI 결과"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logoImage} alt="주담" className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <Sparkles className="w-10 h-10 text-white mx-auto mb-4" />
            <div className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full mb-6">
              <p 
                className="text-4xl font-bold tracking-wider"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {result.code}
              </p>
            </div>
            <h1 
              className="text-4xl md:text-5xl text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {result.name}
            </h1>
            <p className="text-white/80 text-lg italic">{result.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100"
        >
          <p className="text-gray-800 text-lg leading-relaxed text-center">
            {result.description}
          </p>
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 
            className="text-2xl mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            주요 특징
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {result.traits.map((trait, index) => (
              <Badge
                key={index}
                className="bg-white border-2 border-gray-900 text-gray-900 px-5 py-2 text-sm hover:bg-gray-900 hover:text-white transition-colors"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100"
        >
          <h3 
            className="text-2xl mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            맛 프로필
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={radarData} 
                cx="50%" 
                cy="50%" 
                outerRadius="80%"
              >
                <PolarGrid key="polar-grid" stroke="#e5e7eb" />
                <PolarAngleAxis
                  key="polar-angle-axis"
                  dataKey="taste"
                  tick={{ fill: "#374151", fontSize: 14, fontWeight: 600 }}
                />
                <Radar
                  key="radar-data"
                  name="맛 프로필"
                  dataKey="value"
                  stroke="#111827"
                  fill="#9ca3af"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recommended Drinks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 
            className="text-2xl mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            추천 전통주
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {result.recommendedDrinks.map((drink, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-3"
              >
                <span className="text-gray-900 font-medium">{drink}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Matching Project */}
        {result.matchingProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 rounded-2xl p-8 mb-12 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">당신을 위한 추천 프로젝트</p>
                <p 
                  className="text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {result.matchingProject.name}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-white/70" />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-medium py-6"
          >
            <Share2 className="w-5 h-5 mr-2" />
            내 결과 공유하기
          </Button>
          <Button
            onClick={() => result.matchingProject && navigate(`/funding/${result.matchingProject.id}`)}
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-6"
          >
            추천 프로젝트 보기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4 pt-8 border-t border-gray-100"
        >
          <Link to="/">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Button
            onClick={handleRetakeTest}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 테스트하기
          </Button>
        </motion.div>
      </section>

      {/* Stats Footer */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            현재 <span 
              className="text-gray-900 font-bold text-lg mx-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1,245
            </span>명이 술BTI 테스트를 완료했습니다
          </p>
        </div>
      </section>
    </div>
  );
}