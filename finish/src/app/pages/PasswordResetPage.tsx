import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ArrowLeft, MessageSquare } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";
import bgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

type Step = "email" | "verify" | "newPassword";

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("인증번호가 발송되었습니다.");
      setStep("verify");
    } catch (error) {
      toast.error("인증번호 발송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // 테스트용: 1234로 인증
      if (verificationCode === "1234") {
        toast.success("인증이 완료되었습니다.");
        setStep("newPassword");
      } else {
        toast.error("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      toast.error("인증에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("비밀번호가 재설정되었습니다.");
      navigate("/login");
    } catch (error) {
      toast.error("비밀번호 재설정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "verify") {
      setStep("email");
    } else if (step === "newPassword") {
      setStep("verify");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="전통 수묵화 배경"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fixed Top Header with Back Button */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <div className="flex items-center px-4 pt-14 pb-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">뒤로</span>
          </button>
        </div>
      </div>

      {/* Form Container - Right Bottom */}
      <div className="relative w-full h-full flex items-end justify-end p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={onboardingLogo} alt="주담" className="w-16 h-16 mx-auto mb-3 opacity-80" />
            <h1
              className="text-3xl text-gray-800 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              비밀번호 재설정
            </h1>
            <p className="text-gray-600 text-sm">
              {step === "email" && "가입한 이메일 주소를 입력해주세요"}
              {step === "verify" && "이메일로 전송된 인증번호를 입력해주세요"}
              {step === "newPassword" && "새로운 비밀번호를 설정해주세요"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendCode}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-700 mb-2 block">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "발송 중..." : "인증번호 받기"}
                </Button>
              </motion.form>
            )}

            {/* Step 2: Verification Code */}
            {step === "verify" && (
              <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">{email}</span>로 인증번호를 발송했습니다.
                  </p>
                </div>

                <div>
                  <Label htmlFor="code" className="text-sm text-gray-700 mb-2 block">인증번호</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="6자리 인증번호"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * 테스트용 인증번호: 1234
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "확인 중..." : "인증 확인"}
                </Button>

                <button
                  type="button"
                  onClick={handleSendCode}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  인증번호 재전송
                </button>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {step === "newPassword" && (
              <motion.form
                key="newPassword"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="newPassword" className="text-sm text-gray-700 mb-2 block">새 비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="최소 8자 이상"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm text-gray-700 mb-2 block">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호 재입력"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-600 font-semibold mb-1">비밀번호 요구사항</p>
                  <ul className="text-xs text-gray-500 space-y-0.5">
                    <li>• 최소 8자 이상</li>
                    <li>• 영문, 숫자 조합 권장</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "처리 중..." : "비밀번호 재설정"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Step Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${step === "email" ? "bg-gray-900" : "bg-gray-300"}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${step === "verify" ? "bg-gray-900" : "bg-gray-300"}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${step === "newPassword" ? "bg-gray-900" : "bg-gray-300"}`} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}