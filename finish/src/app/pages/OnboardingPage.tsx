import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  ChefHat,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";

/* ─────────────────────────── Slide data ─────────────────────────── */
const SLIDES = [
  {
    id: 0,
    image:
      "https://images.unsplash.com/photo-1528615141309-53f2564d3be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    badge: null,
    BadgeIcon: null,
    isBrandSlide: true,
    title: "전통주의\n새로운 이야기",
    subtitle: "소중한 전통을 함께 이어가는\n크라우드펀딩 플랫폼",
  },
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1452725210141-07dda20225ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    badge: "술 BTI 테스트",
    BadgeIcon: Sparkles,
    isBrandSlide: false,
    title: "나만의 술 취향을\n발견하세요",
    subtitle: "간단한 질문으로 당신에게 딱 맞는\n전통주 유형을 찾아드려요",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1596090823175-44a907c01fe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    badge: "크라우드펀딩",
    BadgeIcon: TrendingUp,
    isBrandSlide: false,
    title: "전통 양조장을\n함께 응원해요",
    subtitle: "소규모 양조장의 꿈을 펀딩하고\n완성된 술을 가장 먼저 받아보세요",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1655376407073-d03c3ae3584d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    badge: "오픈 키친",
    BadgeIcon: ChefHat,
    isBrandSlide: false,
    title: "양조장 현장을\n실시간으로",
    subtitle: "발효부터 병입까지, 내가 펀딩한\n술의 탄생 과정을 함께해요",
  },
];

const TOTAL = SLIDES.length + 1; // 4 feature slides + 1 CTA

/* ─────────────────────── Transition variants ────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "tween" as const, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { type: "tween" as const, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

/* ─────────────────────────── Main page ──────────────────────────── */
export function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const isCTA = current === SLIDES.length;

  const go = (index: number) => {
    setDir(index > current ? 1 : -1);
    setCurrent(index);
  };

  const markOnboarded = () => {
    localStorage.setItem("judam_onboarded", "true");
  };

  const handleNext = () => {
    if (current < SLIDES.length) go(current + 1);
  };

  const handleSkip = () => go(SLIDES.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 48 && Math.abs(dx) > dy) {
      if (dx > 0 && current < SLIDES.length) go(current + 1);
      else if (dx < 0 && current > 0) go(current - 1);
    }
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slides ── */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        {!isCTA ? (
          <motion.div
            key={`slide-${current}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <FeatureSlide slide={SLIDES[current]} />
          </motion.div>
        ) : (
          <motion.div
            key="cta"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <CTASlide
              onLogin={() => { markOnboarded(); navigate("/login"); }}
              onSignup={() => { markOnboarded(); navigate("/signup"); }}
              onGuest={() => { markOnboarded(); navigate("/home"); }}
              onBack={() => go(SLIDES.length - 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom nav (feature slides only) ── */}
      {!isCTA && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-8 pb-10">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-7 h-2"
                    : "bg-white/35 w-2 h-2"
                }`}
              />
            ))}
          </div>

          {/* Skip / Next */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-white/60 text-sm py-2 px-1"
            >
              건너뛰기
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 bg-white text-gray-900 px-7 py-3 rounded-full shadow-lg"
              style={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              {current < SLIDES.length - 1 ? (
                <>
                  다음 <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  시작하기 <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Feature slide ─────────────────────────── */
function FeatureSlide({ slide }: { slide: (typeof SLIDES)[0] }) {
  const { BadgeIcon } = slide;

  return (
    <div className="relative h-full">
      {/* Background */}
      <img
        src={slide.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />

      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between px-8">
        {/* Top: brand or spacer */}
        <div className="pt-14">
          {slide.isBrandSlide ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <img src={onboardingLogo} alt="주담" className="w-9 h-9 opacity-90" />
              <span
                className="text-white/95"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.3rem",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                }}
              >
                주담
              </span>
            </motion.div>
          ) : (
            <div className="h-9" />
          )}
        </div>

        {/* Bottom: text content */}
        <div className="pb-36">
          {/* Badge */}
          {slide.badge && BadgeIcon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm mb-4"
            >
              <BadgeIcon className="w-3 h-3 text-white" />
              <span
                className="text-white"
                style={{ fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 600 }}
              >
                {slide.badge.toUpperCase()}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.div
            key={`t-${slide.id}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-white whitespace-pre-line mb-4"
            style={{
              fontFamily: "'Noto Serif KR', 'Playfair Display', serif",
              fontSize: "2.15rem",
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.01em",
            }}
          >
            {slide.title}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            key={`s-${slide.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="text-white/70 whitespace-pre-line"
            style={{ fontSize: "0.875rem", lineHeight: 1.75 }}
          >
            {slide.subtitle}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── CTA slide ────────────────────────── */
function CTASlide({
  onLogin,
  onSignup,
  onGuest,
  onBack,
}: {
  onLogin: () => void;
  onSignup: () => void;
  onGuest: () => void;
  onBack: () => void;
}) {
  const features = [
    { emoji: "🍶", label: "술BTI\n테스트" },
    { emoji: "💰", label: "크라우드\n펀딩" },
    { emoji: "🏭", label: "양조\n현황" },
    { emoji: "📝", label: "나만의\n레시피 제안" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ── Visual area ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 px-8">
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 rounded-full bg-gray-200/60"
          style={{ width: 220, height: 220 }}
        />
        <div
          className="absolute -bottom-12 -left-12 rounded-full bg-gray-200/40"
          style={{ width: 160, height: 160 }}
        />
        <div
          className="absolute top-1/3 left-8 rounded-full bg-gray-300/20"
          style={{ width: 80, height: 80 }}
        />

        {/* Logo lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.08 }}
          className="relative z-10 flex flex-col items-center mb-10"
        >
          <div className="w-[88px] h-[88px] bg-gray-900 rounded-[26px] flex items-center justify-center shadow-xl mb-4">
            <span style={{ fontSize: "2.5rem" }}>🍶</span>
          </div>
          <div
            className="text-gray-900"
            style={{
              fontFamily: "'Noto Serif KR', 'Playfair Display', serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            주담
          </div>
          <div
            className="text-gray-400 mt-1"
            style={{ fontSize: "0.8rem", letterSpacing: "0.08em" }}
          >
            JuDam · 전통주 크라우드펀딩
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="grid grid-cols-4 gap-2.5 w-full relative z-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.06 }}
              className="flex flex-col items-center gap-1.5 bg-white rounded-[18px] py-3.5 px-1 shadow-sm"
            >
              <span style={{ fontSize: "1.4rem" }}>{f.emoji}</span>
              <span
                className="text-gray-600 text-center whitespace-pre-line"
                style={{ fontSize: "0.58rem", lineHeight: 1.4, fontWeight: 500 }}
              >
                {f.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-gray-400 text-xs text-center mt-6 relative z-10"
          style={{ lineHeight: 1.6 }}
        >
          전통주의 가치를 함께 만들어가는<br />새로운 방식
        </motion.p>
      </div>

      {/* ── Action area ── */}
      <div className="px-7 pb-10 pt-7 bg-white space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
          className="w-full bg-gray-900 text-white rounded-2xl"
          style={{ height: 56, fontWeight: 600, fontSize: "1rem" }}
        >
          로그인
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.41 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSignup}
          className="w-full border-2 border-gray-900 text-gray-900 bg-white rounded-2xl"
          style={{ height: 56, fontWeight: 600, fontSize: "1rem" }}
        >
          회원가입
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onGuest}
          className="w-full text-gray-400 py-2"
          style={{ fontSize: "0.875rem" }}
        >
          비회원으로 둘러보기
        </motion.button>
      </div>
    </div>
  );
}