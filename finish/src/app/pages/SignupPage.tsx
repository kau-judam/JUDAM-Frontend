import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, UserIcon, Phone, MessageCircle,
  ChevronLeft, Eye, EyeOff, MessageSquare, CheckCircle2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1655376407073-d03c3ae3584d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

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
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  // 약관 동의 상태
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 이메일 변경 시 중복 확인 리셋
    if (e.target.name === "email") {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // 테스트: test@test.com은 중복으로 처리
      if (formData.email === "test@test.com") {
        toast.error("이미 사용 중인 이메일입니다.");
        setIsEmailChecked(true);
        setIsEmailAvailable(false);
      } else {
        toast.success("사용 가능한 이메일입니다.");
        setIsEmailChecked(true);
        setIsEmailAvailable(true);
      }
    } catch {
      toast.error("이메일 확인에 실패했습니다.");
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

  const handleSendVerification = () => {
    if (!formData.phone) {
      toast.error("연락처를 입력해주세요.");
      return;
    }
    toast.success("인증번호가 전송되었습니다.");
    setIsVerificationSent(true);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }
    if (verificationCode === "1234") {
      toast.success("인증이 완료되었습니다.");
      setIsPhoneVerified(true);
    } else {
      toast.error("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailChecked || !isEmailAvailable) {
      toast.error("이메일 중복 확인을 완료해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isPhoneVerified) {
      toast.error("연락처 인증을 완료해주세요.");
      return;
    }
    if (!terms.service || !terms.privacy) {
      toast.error("필수 약관에 동의해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        type: "user",
        breweryData: undefined,
      });
      toast.success("회원가입 성공!");
      navigate("/user-type-selection");
    } catch {
      toast.error("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = () => {
    alert("카카오 회원가입은 준비 중입니다.");
  };

  /* ── Field helper ── */
  const Field = ({
    id, label, type = "text", name, placeholder, value, required = true,
    icon: Icon, rightSlot, disabled,
  }: {
    id: string; label: string; type?: string; name: string;
    placeholder: string; value: string; required?: boolean;
    icon: React.ElementType; rightSlot?: React.ReactNode; disabled?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0"
          required={required}
          disabled={disabled}
          style={rightSlot ? { paddingRight: "3rem" } : {}}
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  );

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
          {/* Nickname */}
          <Field
            id="name" label="닉네임" name="name" placeholder="술담이"
            value={formData.name} icon={UserIcon}
          />

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

          {/* Password */}
          <Field
            id="password" label="비밀번호" type={showPw ? "text" : "password"}
            name="password" placeholder="••••••••" value={formData.password} icon={Lock}
            rightSlot={
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400">
                {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            }
          />

          {/* Confirm Password */}
          <Field
            id="confirmPassword" label="비밀번호 확인"
            type={showConfirmPw ? "text" : "password"}
            name="confirmPassword" placeholder="••••••••"
            value={formData.confirmPassword} icon={Lock}
            rightSlot={
              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="text-gray-400">
                {showConfirmPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            }
          />

          {/* Phone verification */}
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              연락처 인증
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
                  name="phone" type="tel" placeholder="010-0000-0000"
                  value={formData.phone} onChange={handleChange}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                  required disabled={isPhoneVerified}
                />
              </div>
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isPhoneVerified}
                className={`h-12 px-4 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  isPhoneVerified
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                style={{ fontWeight: 600, minWidth: 64 }}
              >
                {isPhoneVerified ? "완료" : "인증"}
              </button>
            </div>

            <AnimatePresence>
              {isVerificationSent && !isPhoneVerified && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-2.5">
                    <div className="relative flex-1">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <Input
                        type="text" placeholder="인증번호 입력"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="h-12 px-4 bg-gray-900 text-white rounded-xl text-sm whitespace-nowrap"
                      style={{ fontWeight: 600 }}
                    >
                      확인
                    </button>
                  </div>
                  <p className="text-gray-400 mt-1.5" style={{ fontSize: "0.73rem" }}>
                    * 테스트용 인증번호: 1234
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
              <label className="flex items-start gap-2.5 cursor-pointer">
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
                  <span className="text-gray-700" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                    <span className="text-red-600 font-semibold">[필수]</span>{" "}
                    <a href="/terms" className="text-gray-900 underline">이용약관</a>에 동의합니다.
                  </span>
                </div>
              </label>

              {/* 개인정보처리방침 (필수) */}
              <label className="flex items-start gap-2.5 cursor-pointer">
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
                  <span className="text-gray-700" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                    <span className="text-red-600 font-semibold">[필수]</span>{" "}
                    <a href="/terms" className="text-gray-900 underline">개인정보처리방침</a>에 동의합니다.
                  </span>
                </div>
              </label>

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
                  <span className="text-gray-600" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
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
        <div className="mt-5 text-center" style={{ fontSize: "0.82rem" }}>
          <span className="text-gray-500">이미 계정이 있으신가요? </span>
          <Link to="/login" className="text-gray-900 hover:underline" style={{ fontWeight: 600 }}>
            로그인
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
