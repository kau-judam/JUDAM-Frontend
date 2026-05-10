import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronDown, ChevronUp, X, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useFunding } from "../contexts/FundingContext";
import { isValidEmail, isValidPhone } from "../utils/validation";

export function FundingSupportPage() {
  const { id } = useParams();
  const projectId = id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addParticipation, projects, updateProjectFunding } = useFunding();
  const [quantity, setQuantity] = useState(1);
  const [additionalSupport, setAdditionalSupport] = useState("0");
  const [supportMessage, setSupportMessage] = useState("");
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [installment, setInstallment] = useState("일시불");
  const [depositorName, setDepositorName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showRecentAddressModal, setShowRecentAddressModal] = useState(false);
  const [showRewardDetails, setShowRewardDetails] = useState(true);

  // 검증 에러 상태
  const [validationErrors, setValidationErrors] = useState({
    supporterPhone: "",
    supporterEmail: "",
    shippingPhone: "",
  });

  // 후원자 정보 (로그인한 사용자 정보로 자동 입력)
  const [supporterInfo, setSupporterInfo] = useState({
    phone: user?.phone || "",
    email: user?.email || "",
  });

  // 배송지 정보 (로그인한 사용자 정보로 자동 입력)
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: user?.name || "",
    address: "",
    detailAddress: "",
    phone: user?.phone || "",
  });

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            프로젝트를 찾을 수 없습니다.
          </p>
          <Button onClick={() => navigate(-1)}>돌아가기</Button>
        </div>
      </div>
    );
  }

  // 양조장 계정이 본인 프로젝트에 펀딩하는 것 방지
  if (user?.type === "brewery" && user?.breweryName === project.brewery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">본인 프로젝트입니다</h2>
            <p className="text-gray-600 mb-8">
              양조장은 본인이 개설한 펀딩 프로젝트에<br />
              참여할 수 없습니다.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 text-lg rounded-2xl"
            >
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 펀딩 마감된 프로젝트 참여 방지
  if (project.daysLeft <= 0 && project.status !== "진행 중" && project.status !== "목표 달성") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">펀딩이 종료되었습니다</h2>
            <p className="text-gray-600 mb-8">
              이 프로젝트는 이미 펀딩이 마감되어<br />
              참여할 수 없습니다.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 text-lg rounded-2xl"
            >
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 펀딩 종료일부터 배송일까지의 일수 계산
  const calculateDeliveryDays = () => {
    if (!project.estimatedDelivery) return 60; // 기본값

    const today = new Date();
    const fundingEndDate = new Date(today);
    fundingEndDate.setDate(fundingEndDate.getDate() + project.daysLeft);

    const [year, month, day] = project.estimatedDelivery.split('.').map(str => parseInt(str.trim()));
    const deliveryDate = new Date(year, month - 1, day);

    const diffTime = deliveryDate.getTime() - fundingEndDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const deliveryDays = calculateDeliveryDays();
  const rewardPrice = project.pricePerBottle || 20000;
  const totalAmount =
    rewardPrice * quantity + (parseInt(additionalSupport) || 0);

  // 달성률 계산
  const achievementRate = Math.round((project.currentAmount / project.goalAmount) * 100);

  // 리워드 아이템 구성
  const rewardItems = [
    `${project.title} (${project.bottleSize || project.volume || "375ml"}) x1`
  ];

  const messageOptions = [
    "이 프로젝트의 성공을 응원합니다! 🍶",
    "우리 술의 미래를 함께 만들어요!",
    "전통주의 새로운 도전을 지지합니다.",
    "맛있는 술 기대하겠습니다! 화이팅!",
    "정성스럽게 빚어주세요 💙",
  ];

  const handleSupportMessageSelect = (message: string) => {
    setSupportMessage(message);
    setShowMessageOptions(false);
  };

  // 이메일 형식 검증
  const validateEmail = (email: string): string => {
    if (!email) return "";
    if (!isValidEmail(email)) {
      return "올바른 이메일 형식이 아닙니다.";
    }
    return "";
  };

  // 전화번호 형식 검증
  const validatePhone = (phone: string): string => {
    if (!phone) return "";
    if (!isValidPhone(phone)) {
      return "올바른 전화번호 형식이 아닙니다. (010-1234-5678)";
    }
    return "";
  };

  // 후원자 이메일 변경
  const handleSupporterEmailChange = (email: string) => {
    setSupporterInfo({ ...supporterInfo, email });
    const error = validateEmail(email);
    setValidationErrors({ ...validationErrors, supporterEmail: error });
  };

  // 후원자 전화번호 변경
  const handleSupporterPhoneChange = (phone: string) => {
    setSupporterInfo({ ...supporterInfo, phone });
    const error = validatePhone(phone);
    setValidationErrors({ ...validationErrors, supporterPhone: error });
  };

  // 배송지 전화번호 변경
  const handleShippingPhoneChange = (phone: string) => {
    setShippingInfo({ ...shippingInfo, phone });
    const error = validatePhone(phone);
    setValidationErrors({ ...validationErrors, shippingPhone: error });
  };

  // 간단한 주소 목록 (실제로는 Daum 우편번호 API 사용)
  const mockAddresses = [
    { zipCode: "06234", address: "서울특별시 강남구 테헤란로 123" },
    { zipCode: "06235", address: "서울특별시 강남구 테헤란로 456" },
    { zipCode: "04524", address: "서울특별시 중구 세종대로 110" },
    { zipCode: "03088", address: "서울특별시 종로구 종로 1" },
    { zipCode: "13494", address: "경기도 성남시 분당구 판교역로 235" },
    { zipCode: "63309", address: "제주특별자치도 제주시 첨단로 242" },
  ];

  const handleAddressSearch = () => {
    setShowAddressModal(true);
  };

  const handleAddressSelect = (zipCode: string, address: string) => {
    setShippingInfo({
      ...shippingInfo,
      address: `[${zipCode}] ${address}`,
    });
    setShowAddressModal(false);
    setAddressSearch("");
  };

  // 최근 배송지 불러오기
  const loadRecentAddress = () => {
    const recentAddress = localStorage.getItem("judam_recent_address");
    if (recentAddress) {
      const parsedAddress = JSON.parse(recentAddress);
      setShippingInfo(parsedAddress);
      setShowRecentAddressModal(false);
      toast.success("최근 배송지를 불러왔습니다");
    } else {
      toast.info("저장된 배송지가 없습니다");
    }
  };

  // 배송지 저장 (결제 성공 시 호출)
  const saveRecentAddress = () => {
    localStorage.setItem("judam_recent_address", JSON.stringify(shippingInfo));
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error("결제수단을 선택해주세요.");
      return;
    }
    if (!agreeTerms || !agreeRefund) {
      toast.error("필수 약관에 모두 동의해주세요.");
      return;
    }
    if (!supporterInfo.phone || !supporterInfo.email) {
      toast.error("후원자 정보를 입력해주세요.");
      return;
    }
    // 검증 에러 체크
    if (validationErrors.supporterPhone || validationErrors.supporterEmail || validationErrors.shippingPhone) {
      toast.error("입력 정보를 다시 확인해주세요.");
      return;
    }
    if (
      !shippingInfo.recipientName ||
      !shippingInfo.address ||
      !shippingInfo.phone
    ) {
      toast.error("배송지 정보를 입력해주세요.");
      return;
    }
    // 계좌이체 선택 시 입금자명 필수
    if (selectedPaymentMethod === "account" && !depositorName.trim()) {
      toast.error("입금자명을 입력해주세요.");
      return;
    }

    // 결제 처리 시뮬레이션 (실제로는 PG사 SDK 연동)
    try {
      // 결제 처리 대기 시뮬레이션 - 타임아웃 포함
      const paymentPromise = new Promise((resolve) => setTimeout(resolve, 1500));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 30000)
      );

      await Promise.race([paymentPromise, timeoutPromise]);

      // 주문 ID 생성 (타임스탬프 + 랜덤)
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 주문 데이터 생성
      const orderData = {
        orderId,
        projectId,
        projectTitle: project.title,
        projectImage: project.image,
        brewery: project.brewery,
        orderDate: new Date().toISOString(),
        quantity,
        rewardPrice: rewardPrice,
        additionalSupport: parseInt(additionalSupport) || 0,
        totalAmount,
        deliveryDate: project.deliveryDate,
        paymentMethod: selectedPaymentMethod,
        installment: selectedPaymentMethod === "card" ? installment : null,
        depositorName: selectedPaymentMethod === "account" ? depositorName : null,
        supporterInfo,
        shippingInfo,
        supportMessage,
        status: "pending", // pending, confirmed, shipped, delivered
        rewardItems: rewardItems,
      };

      // localStorage에 주문 목록 저장
      const existingOrders = localStorage.getItem("judam_orders");
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      localStorage.setItem("judam_orders", JSON.stringify(orders));

      // 배송지 저장
      saveRecentAddress();

      // 후원 내역에 추가 (FundingContext에 기록)
      if (projectId) {
        addParticipation(parseInt(projectId), totalAmount);
        // 프로젝트 후원 금액 및 참여자 수 업데이트
        updateProjectFunding(parseInt(projectId), totalAmount);
      }

      // 성공
      setShowSuccessModal(true);
    } catch (error) {
      if (error instanceof Error) {
        // 타임아웃
        if (error.message === "timeout") {
          toast.error("결제 처리 시간이 초과되었습니다. 다시 시도해주세요", {
            duration: 5000,
          });
        }
        // 네트워크 오류
        else if (error.message.includes("network")) {
          toast.error("네트워크 연결을 확인하고 다시 시도해주세요");
        }
        // 결제 거부
        else if (error.message.includes("declined") || error.message.includes("rejected")) {
          toast.error("결제가 거부되었습니다. 결제 정보를 확인해주세요");
        }
        // 기타 오류
        else {
          toast.error("결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
        }
      } else {
        toast.error("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-lg font-bold text-black">후원하기</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto pt-[60px]">
        {/* 프로젝트 정보 */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600">
                  {project.brewery}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold">
                  {project.category}
                </span>
              </div>
              <h2 className="text-sm font-bold text-black mb-2 line-clamp-2">
                {project.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-black">
                  {rewardPrice.toLocaleString()}원
                </span>
                <span className="text-xs text-gray-500">
                  · 펀딩 {project.daysLeft}일 남음
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 선물 정보 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black">가격 안내</h3>
            <button
              type="button"
              onClick={() => setShowRewardDetails(!showRewardDetails)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
            >
              {showRewardDetails ? (
                <>
                  <span>접기</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>펼치기</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {showRewardDetails && (
            <div className="space-y-2 mb-4">
              {rewardItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-sm text-gray-700 leading-relaxed">
                    • {item}
                  </span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  예상 전달일{" "}
                  <span className="text-red-500 font-bold">
                    프로젝트 성공 후 약 {deliveryDays}일 소요
                  </span>
                  <span className="text-gray-500 text-xs ml-1">
                    ({project.deliveryDate} 예정)
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* 수량 선택 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-black">수량</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg text-gray-700">-</span>
                </button>
                <span className="text-base font-bold text-black w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg text-gray-700">+</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">최대 10개까지 선택 가능합니다.</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-black">리워드 금액</span>
              <span className="text-lg font-bold text-black">
                {(rewardPrice * quantity).toLocaleString()}원
                {quantity > 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({rewardPrice.toLocaleString()}원 × {quantity})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 추가 후원금 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-2">
            추가 후원금 <span className="text-gray-500 font-normal">(선택)</span>
          </h3>

          {/* 빠른 선택 버튼 */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1000, 5000, 10000, 50000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setAdditionalSupport(String(amount))}
                className={`px-3 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all ${
                  parseInt(additionalSupport) === amount
                    ? 'border-black bg-gray-50 text-black'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                +{(amount / 1000).toFixed(0)}K
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="number"
              value={additionalSupport}
              onChange={(e) => setAdditionalSupport(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-right text-base text-black"
              placeholder="0"
            />
            <span className="text-base text-gray-700">원</span>
          </div>
          <p className="text-xs text-pink-600 mt-3 flex items-start gap-1">
            💗 추가 후원으로 프로젝트를 더 응원할 수 있어요!
          </p>
        </div>

        {/* 후원자 정보 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-4">후원자 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                연락처
              </label>
              <input
                type="tel"
                value={supporterInfo.phone}
                onChange={(e) => handleSupporterPhoneChange(e.target.value)}
                placeholder="010-0000-0000"
                className={`w-full px-4 py-3 border rounded-xl text-base text-black ${
                  validationErrors.supporterPhone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.supporterPhone && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.supporterPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                이메일
              </label>
              <input
                type="email"
                value={supporterInfo.email}
                onChange={(e) => handleSupporterEmailChange(e.target.value)}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-xl text-base text-black ${
                  validationErrors.supporterEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.supporterEmail && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.supporterEmail}</p>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-gray-600 flex items-start gap-1">
              • 위 연락처와 이메일로 후원 관련 소식이 전달됩니다.
            </p>
            <p className="text-xs text-gray-600 flex items-start gap-1">
              • 연락처 및 이메일 변경은 설정 {">"} 계정 설정서 가능합니다.
            </p>
          </div>
        </div>

        {/* 배송지 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black">배송지</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadRecentAddress}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                최근 배송지
              </button>
              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded">
                성인인증 필수
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                받는 분
              </label>
              <input
                type="text"
                value={shippingInfo.recipientName}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    recipientName: e.target.value,
                  })
                }
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                주소
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="기본 주소"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="px-4 py-3 bg-gray-100 text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    변경
                  </button>
                </div>
                <input
                  type="text"
                  value={shippingInfo.detailAddress}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      detailAddress: e.target.value,
                    })
                  }
                  placeholder="상세 주소"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                연락처
              </label>
              <input
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => handleShippingPhoneChange(e.target.value)}
                placeholder="010-0000-0000"
                className={`w-full px-4 py-3 border rounded-xl text-base text-black ${
                  validationErrors.shippingPhone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.shippingPhone && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.shippingPhone}</p>
              )}
            </div>
          </div>
          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xs text-red-800 leading-relaxed font-semibold mb-2">
              ⚠️ 주류 배송 안내
            </p>
            <p className="text-xs text-red-700 leading-relaxed">
              전통주는 주세법에 따라 성인만 구매 및 수령 가능합니다. 배송 시
              성인인증이 진행되며, 본인 확인이 불가할 경우 수령이 제한될 수
              있습니다.
            </p>
          </div>
        </div>

        {/* 응원 메시지 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-2">
            양조장에게 한마디{" "}
            <span className="text-gray-500 font-normal">(선택)</span>
          </h3>
          <div className="space-y-3">
            {/* 빠른 선택 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMessageOptions(!showMessageOptions)}
                className="w-full py-3 px-4 border border-gray-300 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                {supportMessage && !showMessageOptions ? supportMessage.substring(0, 30) + (supportMessage.length > 30 ? '...' : '') : "응원 메시지를 선택하세요"}
                {showMessageOptions ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {showMessageOptions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden">
                  {messageOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSupportMessageSelect(option)}
                      className="w-full py-3 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      {option}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSupportMessage("");
                      setShowMessageOptions(false);
                    }}
                    className="w-full py-3 px-4 text-left text-sm text-blue-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ✏️ 직접 입력하기
                  </button>
                </div>
              )}
            </div>

            {/* 직접 입력 */}
            <div>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="양조장에게 전할 응원 메시지를 자유롭게 작성해주세요."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 resize-none focus:outline-none focus:border-gray-900 transition-colors"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {supportMessage.length}/200자
              </p>
            </div>
          </div>
        </div>

        {/* 결제수단 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-4">결제수단</h3>
          <div className="space-y-3">
            {/* 카드 결제 */}
            <div>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("card")}
                className={`w-full py-4 px-5 border-2 rounded-xl text-left transition-all ${
                  selectedPaymentMethod === "card"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-black">
                    카드 간편결제
                  </span>
                  <span className="text-xs text-gray-500">할부 가능</span>
                </div>
              </button>
              {selectedPaymentMethod === "card" && (
                <div className="mt-3 pl-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    할부 개월 수
                  </label>
                  <select
                    value={installment}
                    onChange={(e) => setInstallment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="일시불">일시불</option>
                    <option value="2개월">2개월</option>
                    <option value="3개월">3개월</option>
                    <option value="6개월">6개월</option>
                    <option value="12개월">12개월</option>
                  </select>
                </div>
              )}
            </div>

            {/* 네이버페이 */}
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("npay")}
              className={`w-full py-4 px-5 border-2 rounded-xl text-left transition-all ${
                selectedPaymentMethod === "npay"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-sm font-semibold text-black">
                네이버페이(Npay)
              </span>
            </button>

            {/* 계좌이체 */}
            <div>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("account")}
                className={`w-full py-4 px-5 border-2 rounded-xl text-left transition-all ${
                  selectedPaymentMethod === "account"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-sm font-semibold text-black">
                  계좌이체
                </span>
              </button>
              {selectedPaymentMethod === "account" && (
                <div className="mt-3 pl-5">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    입금자명
                  </label>
                  <input
                    type="text"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="입금자 이름을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 최종 후원 금액 및 약관 */}
        <div className="bg-white p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-black mb-4">결제 금액</h3>

            {/* 항목별 금액 */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">리워드 금액</span>
                <span className="text-black">
                  {(rewardPrice * quantity).toLocaleString()}원
                  {quantity > 1 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({rewardPrice.toLocaleString()}원 × {quantity})
                    </span>
                  )}
                </span>
              </div>
              {parseInt(additionalSupport) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">추가 후원</span>
                  <span className="text-black">
                    +{parseInt(additionalSupport).toLocaleString()}원
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">배송비</span>
                <span className="text-green-600 font-semibold">무료</span>
              </div>
            </div>

            {/* 최종 금액 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-red-500">
                최종 후원 금액
              </span>
              <span className="text-2xl font-bold text-black">
                {totalAmount.toLocaleString()}원
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              프로젝트 성공 시 약{" "}
              <span className="font-bold text-black">
                {deliveryDays}일 후
              </span>
              {" "}배송 예정입니다 ({project.deliveryDate}). 프로젝트가 무산되거나 중단된 경우, 예약된 결제는
              자동으로 취소됩니다.
            </p>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    개인정보 제 3자 제공 동의
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    내용보기
                  </button>
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeRefund}
                onChange={(e) => setAgreeRefund(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    후원 유의사항 확인
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowRefundPolicy(!showRefundPolicy);
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {showRefundPolicy ? "접기" : "펼치기"}
                  </button>
                </div>
              </div>
            </label>

            {showRefundPolicy && (
              <div className="pl-7 space-y-2 text-xs text-gray-700 leading-relaxed">
                <p className="font-semibold text-black">
                  • 후원은 구매가 아닌 창의적인 계획을 지원하는 일입니다.
                </p>
                <p>
                  전통주에서의 후원은 아직 실현되지 않은 프로젝트가 실현될 수
                  있도록 제작비를 후원하는 과정으로, 기존의 상품 등을 거래의
                  대상으로 하는 매매와는 차이가 있습니다. 따라서
                  전자상거래법에서의 청약철회 등 규정이 적용되지 않습니다.
                </p>
                <p className="font-semibold text-black mt-3">
                  • 프로젝트는 계획과 달리 진행될 수 있습니다.
                </p>
                <p>
                  예상을 뛰어넘는 멋진 결과가 나올 수 있지만 진행 과정에서 계획이
                  지연, 변경되거나 무산될 수도 있습니다. 본 프로젝트를 완수할
                  책임과 권리는 창작자에게 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4 z-40">
        <Button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || !agreeTerms || !agreeRefund}
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          후원하기
        </Button>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <button
            onClick={() => setShowTermsModal(true)}
            className="hover:text-black transition-colors"
          >
            이용약관
          </button>
          <span>·</span>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-black transition-colors"
          >
            개인정보 처리방침
          </button>
          <span>·</span>
          <button
            onClick={() => navigate("/faq")}
            className="hover:text-black transition-colors"
          >
            헬프센터
          </button>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-[430px] h-full bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-black">
                  후원 성공했어요!
                </h3>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/funding");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -mt-1 -mr-1"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">후원 금액</span>
                  <span className="font-bold text-black">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">예상 배송일</span>
                  <span className="font-medium text-gray-900">{project.estimatedDelivery}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {project.brewery}의 프로젝트를 후원해주셔서 감사합니다.
                펀딩이 완료되면 제작에 들어갑니다.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate(`/funding/${projectId}`)}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-base"
                >
                  프로젝트 확인하기
                </Button>
                <Button
                  onClick={() => navigate("/mypage/funded")}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-900 bg-white text-gray-900 rounded-xl font-semibold text-base"
                >
                  나의 후원 내역
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 주소 검색 모달 - 전체 화면 흰색 */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="w-full max-w-[430px] h-full mx-auto flex flex-col">
            {/* 헤더 */}
            <div className="flex-none border-b border-gray-200 bg-white">
              <div className="flex items-center px-4 py-3">
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setAddressSearch("");
                  }}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h3 className="flex-1 text-center text-lg font-bold text-black pr-10">
                  주소 검색
                </h3>
              </div>

              {/* 검색 입력 */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="도로명, 건물명, 지역명 입력"
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-colors"
                    autoFocus
                  />
                  {addressSearch && (
                    <button
                      onClick={() => setAddressSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 검색 결과 */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {!addressSearch ? (
                <div className="px-4 py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">주소를 검색해주세요</p>
                  <p className="text-xs text-gray-400">
                    도로명, 건물명 또는 지역명으로 검색할 수 있습니다
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-3">
                    검색 결과 {mockAddresses.filter(
                      (addr) =>
                        addr.address.includes(addressSearch) ||
                        addr.zipCode.includes(addressSearch)
                    ).length}건
                  </p>
                  <div className="space-y-2">
                    {mockAddresses
                      .filter(
                        (addr) =>
                          addr.address.includes(addressSearch) ||
                          addr.zipCode.includes(addressSearch)
                      )
                      .map((addr, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddressSelect(addr.zipCode, addr.address)}
                          className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded">
                              우편번호 {addr.zipCode}
                            </p>
                          </div>
                          <p className="text-sm text-black font-medium leading-relaxed">
                            {addr.address}
                          </p>
                        </button>
                      ))}
                    {mockAddresses.filter(
                      (addr) =>
                        addr.address.includes(addressSearch) ||
                        addr.zipCode.includes(addressSearch)
                    ).length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-sm text-gray-500 mb-1">검색 결과가 없습니다</p>
                        <p className="text-xs text-gray-400">
                          다른 검색어로 시도해보세요
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 이용약관 모달 */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowTermsModal(false)}
          />
          <div className="relative w-full max-w-[430px] bg-white rounded-2xl p-6 m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">이용약관</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold">제1조 (목적)</p>
              <p>
                본 약관은 주담(이하 "회사")이 제공하는 전통주 크라우드펀딩 플랫폼 서비스의
                이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을
                목적으로 합니다.
              </p>

              <p className="font-semibold">제2조 (정의)</p>
              <p>
                1. "서비스"란 회사가 제공하는 전통주 크라우드펀딩 플랫폼을 의미합니다.
                <br />
                2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를
                의미합니다.
                <br />
                3. "펀딩"이란 이용자가 양조장의 프로젝트를 후원하는 행위를 의미합니다.
              </p>

              <p className="font-semibold">제3조 (약관의 효력 및 변경)</p>
              <p>
                본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.
                회사는 필요시 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일 이후부터
                효력이 발생합니다.
              </p>
            </div>
            <Button
              onClick={() => setShowTermsModal(false)}
              className="w-full mt-6 bg-black text-white h-12"
            >
              확인
            </Button>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowPrivacyModal(false)}
          />
          <div className="relative w-full max-w-[430px] bg-white rounded-2xl p-6 m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">개인정보처리방침</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold">1. 개인정보의 수집 및 이용 목적</p>
              <p>
                회사는 다음의 목적을 위해 개인정보를 수집하고 이용합니다:
                <br />
                - 회원 가입 및 관리
                <br />
                - 펀딩 서비스 제공
                <br />
                - 결제 및 배송
                <br />- 고객 문의 응대
              </p>

              <p className="font-semibold">2. 수집하는 개인정보 항목</p>
              <p>
                - 필수항목: 이름, 이메일, 연락처, 배송지 주소
                <br />- 선택항목: 마케팅 정보 수신 동의
              </p>

              <p className="font-semibold">3. 개인정보의 보유 및 이용기간</p>
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를
                수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>

              <p className="font-semibold">4. 개인정보의 제3자 제공</p>
              <p>
                회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만,
                다음의 경우에는 예외로 합니다:
                <br />
                - 이용자가 사전에 동의한 경우
                <br />- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에
                따라 수사기관의 요구가 있는 경우
              </p>
            </div>
            <Button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full mt-6 bg-black text-white h-12"
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}