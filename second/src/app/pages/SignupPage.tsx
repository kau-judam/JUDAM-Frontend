import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, UserIcon, Phone, MessageCircle,
  ChevronLeft, Eye, EyeOff, CheckCircle2,
  ShieldCheck, X, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { isValidEmail, isValidPhone, formatPhoneNumber } from "../utils/validation";
import { serviceTermsSections, privacyTermsSections } from "../data/terms";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1655376407073-d03c3ae3584d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// 비밀번호 강도 계산
function calculatePasswordStrength(password: string): { score: number; text: string; color: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, text: "약함", color: "bg-red-500" };
  if (score <= 4) return { score: 2, text: "보통", color: "bg-yellow-500" };
  return { score: 3, text: "강함", color: "bg-green-500" };
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 비밀번호 강도
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });

  // 약관 동의 상태
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  // 약관 모달 상태
  const [termsModalOpen, setTermsModalOpen] = useState<"service" | "privacy" | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  // 비밀번호 변경 시 강도 계산
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength({ score: 0, text: "", color: "" });
    }
  }, [formData.password]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (termsModalOpen) {
      document.body.style.overflow = "hidden";
      setExpandedSection(termsModalOpen === "service" ? 1 : 2);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [termsModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 연락처는 자동 포맷
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData({ ...formData, phone: formatted });
      return;
    }

    setFormData({ ...formData, [name]: value });

    // 이메일 변경 시 중복 확인 리셋
    if (name === "email") {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    }

    // 닉네임 변경 시 중복 확인 리셋
    if (name === "name") {
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      // 타임아웃 설정 (5초)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000)
      );
      const checkPromise = new Promise((resolve) => setTimeout(resolve, 500));

      await Promise.race([checkPromise, timeoutPromise]);

      if (formData.email === "test@test.com") {
        toast.error("이미 사용 중인 이메일입니다.");
        setIsEmailChecked(true);
        setIsEmailAvailable(false);
      } else {
        toast.success("사용 가능한 이메일입니다.");
        setIsEmailChecked(true);
        setIsEmailAvailable(true);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "timeout") {
        toast.error("요청 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        toast.error("이메일 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    }
  };

  const handleCheckNickname = async () => {
    if (!formData.name) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    if (formData.name.length < 2 || formData.name.length > 12) {
      toast.error("닉네임은 2~12자 이내로 입력해주세요.");
      return;
    }

    try {
      // 타임아웃 설정 (5초)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000)
      );
      const checkPromise = new Promise((resolve) => setTimeout(resolve, 500));

      await Promise.race([checkPromise, timeoutPromise]);

      // 테스트: "admin"은 중복으로 처리
      if (formData.name === "admin") {
        toast.error("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(true);
        setIsNicknameAvailable(false);
      } else {
        toast.success("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "timeout") {
        toast.error("요청 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        toast.error("닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
    }
  };

  const handleTermsChange = (key: keyof typeof terms) => {
    if (key === "all") {
      const newValue = !terms.all;
      setTerms({
        all: newValue,
        service: newValue,
        privacy: newValue,
        marketing: newValue,
      });
    } else {
      const newTerms = { ...terms, [key]: !terms[key] };
      newTerms.all = newTerms.service && newTerms.privacy && newTerms.marketing;
      setTerms(newTerms);
    }
  };

  // PASS 본인인증 실행
  const handlePassVerification = () => {
    if (!formData.phone) {
      toast.error("연락처를 입력해주세요.");
      return;
    }
    // 연락처 형식 검증
    if (!isValidPhone(formData.phone)) {
      toast.error("올바른 연락처 형식이 아닙니다 (010-XXXX-XXXX).");
      return;
    }

    // 실제로는 PASS 본인인증 SDK 또는 창 호출
    // 예: window.open() 또는 PASS SDK 초기화
    toast.info("PASS 본인인증 창이 열립니다.");
    
    // Mock: 2초 후 인증 완료 처리
    setTimeout(() => {
      setIsPhoneVerified(true);
      toast.success("본인인증이 완료되었습니다.");
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("휴대폰 번호를 입력해주세요.");
      return;
    }

    // 닉네임 중복 확인
    if (!isNicknameChecked || !isNicknameAvailable) {
      toast.error("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    // 이메일 중복 확인
    if (!isEmailChecked || !isEmailAvailable) {
      toast.error("이메일 중복 확인을 완료해주세요.");
      return;
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      toast.error("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (!/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password)) {
      toast.error("비밀번호는 영문 대소문자를 포함해야 합니다.");
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      toast.error("비밀번호는 숫자를 포함해야 합니다.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 본인 인증 (PASS)
    if (!isPhoneVerified) {
      toast.error("본인인증을 완료해주세요.");
      return;
    }

    // 약관 동의
    if (!terms.service || !terms.privacy) {
      toast.error("필수 약관에 동의해주세요.");
      return;
    }

    // 중복 제출 방지
    if (isLoading) return;

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        type: "user",
      });
      toast.success("회원가입이 완료되었습니다!");
      // 사용자 유형 선택 페이지로 이동
      navigate("/user-type-selection");
    } catch (error) {
      if (error instanceof Error) {
        // 네트워크 오류
        if (error.message.includes("network") || error.message.includes("timeout")) {
          toast.error("네트워크 연결을 확인해주세요");
        }
        // 이메일 중복 (서버에서 재검증)
        else if (error.message.includes("email") || error.message.includes("duplicate")) {
          toast.error("이미 사용 중인 이메일입니다");
        }
        // 기타 오류
        else {
          toast.error("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
        }
      } else {
        toast.error("회원가입에 실패했습니다. 다시 시도해주세요");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = () => {
    toast.info("카카오 회원가입은 준비 중입니다.");
  };

  return (
    <div className="h-screen relative overflow-hidden bg-black flex flex-col">
      {/* ── Background image ── */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />

      {/* ── Top brand area ── */}
      <div className="relative z-10 pt-14 px-7 flex-none">
        <button
          onClick={() => navigate("/onboarding")}
          className="flex items-center gap-1 text-white/70 mb-8"
          style={{ fontSize: "0.85rem" }}
        >
          <ChevronLeft className="w-4 h-4" />
          처음으로
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="flex items-center gap-3 mb-3"
        >
          <img src={onboardingLogo} alt="주담" className="w-10 h-10 opacity-90" />
          <span
            className="text-white"
            style={{
              fontFamily: "'Noto Serif KR', 'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            주담
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <div
            className="text-white mb-1"
            style={{
              fontFamily: "'Noto Serif KR', 'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            전통주의 세계로<br />첫 발걸음을
          </div>
          <p className="text-white/60" style={{ fontSize: "0.85rem" }}>
            주담과 함께 새로운 전통주 여정을 시작하세요
          </p>
        </motion.div>
      </div>

      <div className="flex-1" />

      {/* ── Bottom sheet ── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 bg-white rounded-t-[28px] px-7 pt-5 pb-10 shadow-2xl"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Kakao - top for signup (easier UX) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSocialSignup}
          className="w-full h-12 rounded-2xl bg-[#FEE500] flex items-center justify-center gap-2.5 mb-4"
          style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a1a" }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: "#1a1a1a" }} />
          카카오로 빠르게 가입
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>이메일로 가입</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Nickname with duplicate check */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              닉네임
              {isNicknameChecked && isNicknameAvailable && (
                <span className="ml-2 text-green-600 inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 사용 가능
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <Input
                  name="name"
                  type="text"
                  placeholder="술담이"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                  required
                  disabled={isNicknameChecked && isNicknameAvailable}
                />
              </div>
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={isNicknameChecked && isNicknameAvailable}
                className={`h-12 px-4 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  isNicknameChecked && isNicknameAvailable
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                style={{ fontWeight: 600, minWidth: 80 }}
              >
                {isNicknameChecked && isNicknameAvailable ? "확인완료" : "중복확인"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">2~12자 이내, 특수문자 불가</p>
          </div>

          {/* Email with duplicate check */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              이메일
              {isEmailChecked && isEmailAvailable && (
                <span className="ml-2 text-green-600 inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 사용 가능
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                  required
                  disabled={isEmailChecked && isEmailAvailable}
                />
              </div>
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={isEmailChecked && isEmailAvailable}
                className={`h-12 px-4 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  isEmailChecked && isEmailAvailable
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                style={{ fontWeight: 600, minWidth: 80 }}
              >
                {isEmailChecked && isEmailAvailable ? "확인완료" : "중복확인"}
              </button>
            </div>
          </div>

          {/* Password with strength indicator */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        level <= passwordStrength.score ? passwordStrength.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  비밀번호 강도: <span className={`font-semibold ${passwordStrength.score >= 2 ? "text-green-600" : "text-red-500"}`}>{passwordStrength.text}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">8자 이상, 영문 대소문자, 숫자 포함</p>
              </div>
            )}
          </div>

          {/* Confirm Password with real-time check */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                name="confirmPassword"
                type={showConfirmPw ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${formData.confirmPassword === formData.password ? "text-green-600" : "text-red-500"}`}>
                {formData.confirmPassword === formData.password ? "✓ 비밀번호가 일치합니다" : "✗ 비밀번호가 일치하지 않습니다"}
              </p>
            )}
          </div>

          {/* PASS 본인인증 */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              본인인증 (PASS)
              {isPhoneVerified && (
                <span className="ml-2 text-green-600 inline-flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 인증 완료
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                  required
                  disabled={isPhoneVerified}
                  maxLength={13}
                />
              </div>
              <button
                type="button"
                onClick={handlePassVerification}
                disabled={isPhoneVerified}
                className={`h-12 px-4 rounded-xl text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isPhoneVerified
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                }`}
                style={{ fontWeight: 600, minWidth: 90 }}
              >
                <ShieldCheck className="w-4 h-4" />
                {isPhoneVerified ? "완료" : "PASS인증"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              * 만 19세 이상 본인인증을 진행합니다
            </p>
          </div>

          {/* Terms - 약관 동의 */}
          <div className="pt-2 space-y-3">
            {/* 전체 동의 */}
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={terms.all}
                  onChange={() => handleTermsChange("all")}
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    terms.all ? "bg-gray-900 border-gray-900" : "border-gray-400 bg-white"
                  }`}
                >
                  {terms.all && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-900 font-semibold" style={{ fontSize: "0.9rem" }}>
                전체 동의
              </span>
            </label>

            {/* 개별 약관 */}
            <div className="pl-2 space-y-2.5">
              {/* 이용약관 (필수) */}
              <div className="flex items-start gap-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={terms.service}
                      onChange={() => handleTermsChange("service")}
                    />
                    <div
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors ${
                        terms.service ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"
                      }`}
                    >
                      {terms.service && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-700" style={{ fontSize: "0.80rem", lineHeight: 1.5 }}>
                      <span className="text-red-600 font-semibold">[필수]</span>{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTermsModalOpen("service");
                        }}
                        className="text-gray-900 underline hover:text-gray-700"
                      >
                        이용약관
                      </button>에 동의합니다.
                    </span>
                  </div>
                </label>
              </div>

              {/* 개인정보처리방침 (필수) */}
              <div className="flex items-start gap-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={terms.privacy}
                      onChange={() => handleTermsChange("privacy")}
                    />
                    <div
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors ${
                        terms.privacy ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"
                      }`}
                    >
                      {terms.privacy && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-700" style={{ fontSize: "0.80rem", lineHeight: 1.5 }}>
                      <span className="text-red-600 font-semibold">[필수]</span>{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTermsModalOpen("privacy");
                        }}
                        className="text-gray-900 underline hover:text-gray-700"
                      >
                        개인정보처리방침
                      </button>에 동의합니다.
                    </span>
                  </div>
                </label>
              </div>

              {/* 마케팅 수신 동의 (선택) */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={terms.marketing}
                    onChange={() => handleTermsChange("marketing")}
                  />
                  <div
                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors ${
                      terms.marketing ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"
                    }`}
                  >
                    {terms.marketing && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-gray-600" style={{ fontSize: "0.80rem", lineHeight: 1.5 }}>
                    <span className="text-gray-500">[선택]</span>{" "}
                    마케팅 정보 수신에 동의합니다.
                  </span>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.7rem" }}>
                    이벤트, 할인 혜택 등의 정보를 이메일/SMS로 받아보실 수 있습니다.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="w-full bg-gray-900 text-white rounded-2xl disabled:opacity-60 mt-1"
            style={{ height: 52, fontWeight: 600, fontSize: "1rem" }}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </motion.button>
        </form>

        {/* Login link */}
        <div className="mt-5 text-center" style={{ fontSize: "0.80rem" }}>
          <span className="text-gray-500">이미 계정이 있으신가요? </span>
          <Link to="/login" className="text-gray-900 hover:underline" style={{ fontWeight: 600 }}>
            로그인
          </Link>
        </div>
      </motion.div>

      {/* 약관 모달 */}
      <AnimatePresence>
        {termsModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTermsModalOpen(null)}
              className="fixed inset-0 z-[100]"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                left: "50%",
                transform: "translateX(-50%)",
                maxWidth: "430px",
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-[28px] shadow-2xl z-[101]"
              style={{ maxHeight: "85vh" }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-[28px] border-b border-gray-100 px-5 pt-5 pb-4 z-10">
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-gray-900">
                        {termsModalOpen === "service" ? "이용약관" : "개인정보처리방침"}
                      </h2>
                      <p className="text-xs text-gray-400">최종 업데이트: 2026년 4월 7일</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTermsModalOpen(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-5 py-4 space-y-3" style={{ maxHeight: "calc(85vh - 120px)" }}>
                {(termsModalOpen === "service" ? serviceTermsSections : privacyTermsSections).map((section, sIdx) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === section.id ? null : section.id
                        )
                      }
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-bold text-gray-900 text-left">
                        {section.title}
                      </span>
                      {expandedSection === section.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-4 space-y-4">
                            {section.items.map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className={iIdx > 0 ? "border-t border-gray-50 pt-4" : ""}
                              >
                                <h4 className="text-sm font-bold text-gray-900 mb-2">
                                  {item.subtitle}
                                </h4>
                                <ul className="space-y-1.5">
                                  {item.points.map((point, pIdx) => (
                                    <li
                                      key={pIdx}
                                      className="text-xs text-gray-600 leading-relaxed flex gap-2"
                                    >
                                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <p className="text-center text-xs text-gray-400 py-4">
                  © 2026 주담(JuDam). All rights reserved.
                </p>
              </div>

              {/* 확인 버튼 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTermsModalOpen(null)}
                  className="w-full bg-gray-900 text-white rounded-2xl h-12 font-semibold"
                >
                  확인
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
