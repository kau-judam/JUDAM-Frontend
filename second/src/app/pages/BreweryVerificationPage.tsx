import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Building2, MapPin, Phone, Upload, MessageSquare, ArrowLeft, ChevronLeft, X, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { isValidBusinessNumber } from "../utils/validation";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";
import bgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

// 사업자등록번호 자동 포맷
function formatBusinessNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
}

export function BreweryVerificationPage() {
  const navigate = useNavigate();
  const { user, verifyBrewery } = useAuth();
  
  // 이미 인증된 사용자가 수정 모드가 아닌 상태로 접근 시 대시보드로 리다이렉트
  useEffect(() => {
    // URL에서 edit 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get("edit") === "true";
    
    if (user?.isBreweryVerified && !isEditMode) {
      toast.info("이미 인증된 양조장입니다");
      navigate("/brewery/dashboard");
    }
  }, [user, navigate]);

  const isEditMode = user?.isBreweryVerified || false;
  const [formData, setFormData] = useState({
    businessNumber: user?.businessNumber || "",
    breweryName: user?.breweryName || "",
    breweryLocation: user?.breweryLocation || "",
    breweryLocationDetail: user?.breweryLocationDetail || "",
    phone: user?.phone || "",
  });
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(isEditMode);

  // 주소 검색 모달
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");

  // 주소 검색 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (showAddressModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddressModal]);

  // Mock 주소 데이터 (실제로는 Daum 우편번호 API 사용)
  const mockAddresses = [
    {
      zipCode: "12345",
      roadAddress: "경기도 양평군 양평읍 양평대로 123",
      jibunAddress: "경기도 양평군 양평읍 양평리 456-7"
    },
    {
      zipCode: "12346",
      roadAddress: "경기도 양평군 강하면 강하로 456",
      jibunAddress: "경기도 양평군 강하면 강하리 789-1"
    },
    {
      zipCode: "12347",
      roadAddress: "경기도 이천시 부발읍 경충대로 789",
      jibunAddress: "경기도 이천시 부발읍 부발리 123-45"
    },
    {
      zipCode: "17579",
      roadAddress: "경기도 안성시 공도읍 서동대로 234",
      jibunAddress: "경기도 안성시 공도읍 서동리 678-9"
    },
    {
      zipCode: "27407",
      roadAddress: "충청북도 충주시 노은면 괴동로 567",
      jibunAddress: "충청북도 충주시 노은면 괴동리 234-56"
    },
    {
      zipCode: "31073",
      roadAddress: "충청남도 천안시 동남구 병천면 병천로 890",
      jibunAddress: "충청남도 천안시 동남구 병천면 병천리 345-67"
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 사업자등록번호는 자동 포맷
    if (name === "businessNumber") {
      const formatted = formatBusinessNumber(value);
      setFormData({ ...formData, businessNumber: formatted });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 파일 크기 검증 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("파일 크기는 10MB를 초과할 수 없습니다.");
        e.target.value = ""; // 파일 선택 초기화
        return;
      }

      // 파일 형식 검증 (MIME type)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("PDF, JPG, PNG 파일만 업로드 가능합니다.");
        e.target.value = ""; // 파일 선택 초기화
        return;
      }

      setBusinessLicense(file);
      toast.success("파일이 선택되었습니다.");
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

  const handleAddressSearch = () => {
    setShowAddressModal(true);
  };

  const handleAddressSelect = (zipCode: string, roadAddress: string) => {
    setFormData({
      ...formData,
      breweryLocation: `[${zipCode}] ${roadAddress}`,
    });
    setShowAddressModal(false);
    setAddressSearch("");
    toast.success("주소가 입력되었습니다.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.breweryName.trim()) {
      toast.error("양조장 이름을 입력해주세요.");
      return;
    }
    if (!formData.breweryLocation.trim()) {
      toast.error("양조장 주소를 입력해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("연락처를 입력해주세요.");
      return;
    }
    if (!formData.businessNumber.trim()) {
      toast.error("사업자등록번호를 입력해주세요.");
      return;
    }

    // 사업자등록번호 형식 검증
    if (!isValidBusinessNumber(formData.businessNumber)) {
      toast.error("올바른 사업자등록번호 형식이 아닙니다 (000-00-00000)");
      return;
    }

    if (!isEditMode && !businessLicense) {
      toast.error("사업자등록증을 업로드해주세요.");
      return;
    }

    if (!isPhoneVerified) {
      toast.error("연락처 인증을 완료해주세요.");
      return;
    }

    // 중복 제출 방지
    if (isLoading) return;

    setIsLoading(true);

    try {
      await verifyBrewery({
        businessNumber: formData.businessNumber,
        businessLicense: businessLicense || undefined,
        breweryName: formData.breweryName,
        breweryLocation: formData.breweryLocation,
        breweryLocationDetail: formData.breweryLocationDetail,
        phone: formData.phone,
      });

      if (isEditMode) {
        toast.success("양조장 정보가 수정되었습니다!");
        navigate(-1); // 수정 모드면 이전 페이지로
      } else {
        toast.success("양조장 인증이 완료되었습니다!");
        navigate("/brewery/dashboard"); // 인증 완료 후 양조장 대시보드로 이동
      }
    } catch (error) {
      if (error instanceof Error) {
        // 파일 업로드 실패
        if (error.message.includes("file") || error.message.includes("upload")) {
          toast.error("파일 업로드에 실패했습니다. 파일을 다시 선택해주세요");
          setBusinessLicense(null);
        }
        // 네트워크 오류
        else if (error.message.includes("network") || error.message.includes("timeout")) {
          toast.error("네트워크 연결을 확인하고 다시 시도해주세요");
        }
        // 사업자등록번호 오류
        else if (error.message.includes("business") || error.message.includes("invalid")) {
          toast.error("유효하지 않은 사업자등록번호입니다");
        }
        // 기타 오류
        else {
          toast.error(isEditMode ? "정보 수정 중 오류가 발생했습니다" : "인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
        }
      } else {
        toast.error(isEditMode ? "정보 수정에 실패했습니다" : "인증에 실패했습니다. 다시 시도해주세요");
      }
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
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
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
                    readOnly
                  />
                </div>
                <Button
                  type="button"
                  className="h-12 px-4 bg-gray-900 hover:bg-gray-800 text-white whitespace-nowrap"
                  onClick={handleAddressSearch}
                >
                  주소 검색
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="breweryLocationDetail"
                  name="breweryLocationDetail"
                  type="text"
                  placeholder="상세 주소 입력 (예: 2층 201호)"
                  value={formData.breweryLocationDetail}
                  onChange={handleChange}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-gray-900"
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

      {/* 주소 검색 모달 - 전체 화면 */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white w-full h-full"
          >
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 z-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">주소 검색</h2>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setAddressSearch("");
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* 검색창 */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="도로명, 건물명 또는 지번 검색"
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:border-gray-900"
                  autoFocus
                />
              </div>
            </div>

            {/* 검색 결과 */}
            <div className="overflow-y-auto h-[calc(100vh-140px)]">
              {addressSearch === "" ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    도로명, 건물명 또는 지번을 입력해주세요
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    예) 양평대로 123, 양평리 456-7
                  </p>
                </div>
              ) : mockAddresses.filter((address) =>
                  address.roadAddress.toLowerCase().includes(addressSearch.toLowerCase()) ||
                  address.jibunAddress.toLowerCase().includes(addressSearch.toLowerCase())
                ).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    검색 결과가 없습니다
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    다른 검색어로 다시 시도해주세요
                  </p>
                </div>
              ) : (
                <div className="px-4 py-2">
                  {mockAddresses
                    .filter((address) =>
                      address.roadAddress.toLowerCase().includes(addressSearch.toLowerCase()) ||
                      address.jibunAddress.toLowerCase().includes(addressSearch.toLowerCase())
                    )
                    .map((address, idx) => (
                      <motion.div
                        key={address.zipCode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleAddressSelect(address.zipCode, address.roadAddress)}
                        className="border-b border-gray-100 py-4 px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded">
                                우편번호
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                {address.zipCode}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              {address.roadAddress}
                            </p>
                            <p className="text-xs text-gray-500">
                              [지번] {address.jibunAddress}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}