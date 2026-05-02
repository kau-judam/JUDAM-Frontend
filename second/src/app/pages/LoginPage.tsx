import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, MessageCircle, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { isValidEmail } from "../utils/validation";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1528615141309-53f2564d3be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("judam_remember_email") !== null;
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("judam_remember_email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("이메일을 입력해주세요");
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // 이미 로딩 중이면 중복 제출 방지
    if (isLoading) return;

    setIsLoading(true);
    try {
      // 실제 구현에서는 서버에서 사용자 타입을 조회해야 함
      // Mock: 이메일에 "brewery"가 포함되면 양조장 계정으로 간주
      const userType = email.includes("brewery") ? "brewery" : "user";

      await login(email, password, userType);

      // Remember me 처리
      if (rememberMe) {
        localStorage.setItem("judam_remember_email", email);
      } else {
        localStorage.removeItem("judam_remember_email");
      }

      toast.success("로그인 되었습니다");

      // 양조장 계정 처리
      if (userType === "brewery") {
        // 실제 구현에서는 서버 응답으로 인증 여부를 확인
        // Mock: login 함수가 isBreweryVerified를 false로 설정했는지 확인
        // 타이밍 이슈 방지를 위해 약간의 delay
        setTimeout(() => {
          const savedUser = localStorage.getItem("judam_user");
          const parsedUser = savedUser ? JSON.parse(savedUser) : null;

          // 인증되지 않은 양조장은 인증 페이지로
          if (parsedUser && !parsedUser.isBreweryVerified) {
            navigate("/brewery/verify");
          } else {
            navigate("/brewery/dashboard");
          }
        }, 100);
      } else {
        navigate("/home");
      }
    } catch (error) {
      // 에러 타입별 처리
      if (error instanceof Error) {
        // 네트워크 오류
        if (error.message.includes("network") || error.message.includes("timeout")) {
          toast.error("네트워크 연결을 확인해주세요");
        }
        // 인증 실패
        else if (error.message.includes("auth") || error.message.includes("credentials")) {
          toast.error("이메일 또는 비밀번호가 일치하지 않습니다");
        }
        // 기타 오류
        else {
          toast.error("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
        }
      } else {
        toast.error("이메일 또는 비밀번호가 일치하지 않습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = () => {
    toast.info("카카오 로그인은 준비 중입니다.");
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

      {/* Dark gradient: strong at top & bottom, lighter in mid */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />

      {/* ── Top brand area ── */}
      <div className="relative z-10 pt-14 px-7 flex-none">
        {/* Back to onboarding */}
        <button
          onClick={() => navigate("/onboarding")}
          className="flex items-center gap-1 text-white/70 mb-8"
          style={{ fontSize: "0.85rem" }}
        >
          <ChevronLeft className="w-4 h-4" />
          처음으로
        </button>

        {/* Logo + greeting */}
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
            다시 만나서<br />반갑습니다
          </div>
          <p className="text-white/60" style={{ fontSize: "0.85rem" }}>
            계정에 로그인하여 계속하세요
          </p>
        </motion.div>
      </div>

      {/* ── Spacer (pushes sheet down) ── */}
      <div className="flex-1" />

      {/* ── Bottom sheet ── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 bg-white rounded-t-[28px] px-7 pt-5 pb-10 flex-none shadow-2xl"
        style={{ maxHeight: "68vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-gray-700 mb-1.5"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
                required
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-gray-700 mb-1.5"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
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
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-500" style={{ fontSize: "0.78rem" }}>
              로그인 유지
            </label>
          </div>

          {/* Forgot */}
          <div className="flex justify-end">
            <Link
              to="/password-reset"
              className="text-gray-500 hover:text-gray-800 transition-colors"
              style={{ fontSize: "0.78rem" }}
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="w-full h-13 bg-gray-900 text-white rounded-2xl disabled:opacity-60 mt-1"
            style={{ height: 52, fontWeight: 600, fontSize: "1rem" }}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>
            또는
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Kakao */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSocialLogin}
          className="w-full h-12 rounded-2xl bg-[#FEE500] flex items-center justify-center gap-2.5"
          style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a1a" }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: "#1a1a1a" }} />
          카카오로 로그인
        </motion.button>

        {/* Bottom links */}
        <div className="mt-6 flex items-center justify-center gap-5" style={{ fontSize: "0.82rem" }}>
          <Link
            to="/signup"
            className="text-gray-900 hover:underline"
            style={{ fontWeight: 600 }}
          >
            회원가입
          </Link>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigate("/home")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            비회원으로 둘러보기
          </button>
        </div>
      </motion.div>
    </div>
  );
}