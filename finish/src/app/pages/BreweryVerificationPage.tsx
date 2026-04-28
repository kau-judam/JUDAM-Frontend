import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Building2, MapPin, Phone, Upload, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";
import bgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

export function BreweryVerificationPage() {
  const navigate = useNavigate();
  const { user, verifyBrewery } = useAuth();
  const isEditMode = user?.isBreweryVerified || false;
  const [formData, setFormData] = useState({
    businessNumber: user?.businessNumber || "",
    breweryName: user?.breweryName || "",
    breweryLocation: user?.breweryLocation || "",
    phone: user?.phone || "",
  });
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(isEditMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBusinessLicense(e.target.files[0]);
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
    // 실제로는 백엔드에서 인증번호 확인
    if (verificationCode === "1234") {
      toast.success("인증이 완료되었습니다.");
      setIsPhoneVerified(true);
    } else {
      toast.error("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditMode && !businessLicense) {
      toast.error("사업자등록증을 업로드해주세요.");
      return;
    }

    if (!isPhoneVerified) {
      toast.error("연락처 인증을 완료해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await verifyBrewery({
        businessNumber: formData.businessNumber,
        businessLicense: businessLicense || undefined,
        breweryName: formData.breweryName,
        breweryLocation: formData.breweryLocation,
        phone: formData.phone,
      });

      toast.success(isEditMode ? "양조장 정보가 수정되었습니다!" : "양조장 인증이 완료되었습니다!");
      navigate("/home"); // 인증 완료 후 홈으로 이동
    } catch (error) {
      toast.error(isEditMode ? "정보 수정에 실패했습니다." : "인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden pb-8">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="전통 수묵화 배경"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 뒤로가기 버튼 — 좌상단 고정 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-800" />
      </button>

      {/* Form Container - Right Bottom */}
      <div className="relative w-full h-full flex items-end justify-end p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={onboardingLogo} alt="주담" className="w-16 h-16 mx-auto mb-3 opacity-80" />
            <h1
              className="text-3xl text-gray-800 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isEditMode ? "양조장 정보 수정" : "양조장 인증"}
            </h1>
            <p className="text-gray-600 text-sm">
              {isEditMode ? "양조장 정보를 수정할 수 있습니다" : "사업자 정보를 입력하고 인증을 완료해주세요"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Number */}
            <div>
              <Label htmlFor="businessNumber" className="text-sm text-gray-700 mb-2 block">사업자등록번호</Label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="businessNumber"
                  name="businessNumber"
                  type="text"
                  placeholder="000-00-00000"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                  required
                />
              </div>
            </div>

            {/* Brewery Name */}
            <div>
              <Label htmlFor="breweryName" className="text-sm text-gray-700 mb-2 block">양조장 이름</Label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="breweryName"
                  name="breweryName"
                  type="text"
                  placeholder="술샘양조장"
                  value={formData.breweryName}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="breweryLocation" className="text-sm text-gray-700 mb-2 block">양조장 위치</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="breweryLocation"
                  name="breweryLocation"
                  type="text"
                  placeholder="경기 양평"
                  value={formData.breweryLocation}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm text-gray-700 mb-2 block">연락처 인증</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                    required
                    disabled={isPhoneVerified}
                  />
                </div>
                <Button
                  type="button"
                  className={`h-12 px-4 whitespace-nowrap ${
                    isPhoneVerified
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  } text-white`}
                  onClick={handleSendVerification}
                  disabled={isPhoneVerified}
                >
                  {isPhoneVerified ? "완료" : "인증"}
                </Button>
              </div>

              {/* 인증번호 입력창 */}
              <AnimatePresence>
                {isVerificationSent && !isPhoneVerified && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 mt-3">
                      <div className="relative flex-1">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="인증번호 입력"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
                        />
                      </div>
                      <Button
                        type="button"
                        className="h-12 px-4 bg-gray-900 hover:bg-gray-800 text-white whitespace-nowrap"
                        onClick={handleVerifyCode}
                      >
                        확인
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * 테스트용 인증번호: 1234
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Business License Upload */}
            <div>
              <Label htmlFor="businessLicense" className="text-sm text-gray-700 mb-2 block">
                사업자등록증 {isEditMode && <span className="text-gray-500 text-xs">(선택사항)</span>}
              </Label>
              <label
                htmlFor="businessLicense"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  {businessLicense ? (
                    <p className="text-sm text-gray-600 font-medium">{businessLicense.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">
                        {isEditMode ? "클릭하여 새 파일 업로드 (선택)" : "클릭하여 파일 업로드"}
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (최대 10MB)</p>
                    </>
                  )}
                </div>
                <Input
                  id="businessLicense"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info Box */}
            {!isEditMode && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">인증 안내</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 사업자등록증은 영업 중인 양조장임을 확인하는 용도로만 사용됩니다.</li>
                  <li>• 인증은 영업일 기준 2~3일 내에 완료됩니다.</li>
                  <li>• 인증 완료 후 프로젝트 생성이 가능합니다.</li>
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                onClick={() => navigate(-1)}
              >
                {isEditMode ? "취소" : "나중에 하기"}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 text-base"
                disabled={isLoading}
              >
                {isLoading
                  ? isEditMode ? "수정 중..." : "인증 중..."
                  : isEditMode ? "정보 수정" : "인증 신청"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}