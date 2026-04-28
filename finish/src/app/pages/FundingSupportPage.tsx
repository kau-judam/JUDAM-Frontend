import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "../components/ui/button";

// 더미 데이터 (프로젝트별 리워드 정보)
const rewardData: Record<
  number,
  {
    id: number;
    title: string;
    brewery: string;
    category: string;
    image: string;
    achievementRate: number;
    daysLeft: number;
    rewardItems: string[];
    deliveryDate: string;
    rewardPrice: number;
  }
> = {
  1: {
    id: 1,
    title: "제주 감귤로 빚은 탄산 막걸리 '썸머시트러스'",
    brewery: "제주탐라양조장",
    category: "탄산막걸리",
    image: "https://images.unsplash.com/photo-1774676998521-f314e05d2701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBib3R0bGV8ZW58MXx8fHwxNzc1ODQwMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    achievementRate: 1847,
    daysLeft: 12,
    rewardItems: [
      "제주 감귤 탄산 막걸리 - 썸머시트러스 (750ml) x1",
    ],
    deliveryDate: "2026.08.15",
    rewardPrice: 28000,
  },
  2: {
    id: 2,
    title: "강릉 바다와 산의 만남, 솔향 증류주 '바람꽃'",
    brewery: "강릉산해양조",
    category: "증류주",
    image: "https://images.unsplash.com/photo-1774676998521-f314e05d2701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBib3R0bGV8ZW58MXx8fHwxNzc1ODQwMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    achievementRate: 234,
    daysLeft: 8,
    rewardItems: [
      "솔향 증류주 '바람꽃' (500ml) x1",
      "전통 도자기 잔 세트 (2개)",
      "양조 과정 사진집",
    ],
    deliveryDate: "2026.09.20",
    rewardPrice: 45000,
  },
  3: {
    id: 3,
    title: "100년 전통 누룩으로 빚는 약주 '달빛담금'",
    brewery: "서울한강양조",
    category: "약주",
    image: "https://images.unsplash.com/photo-1774676998521-f314e05d2701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBib3R0bGV8ZW58MXx8fHwxNzc1ODQwMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    achievementRate: 892,
    daysLeft: 15,
    rewardItems: [
      "전통 약주 '달빛담금' (750ml) x1",
      "100년 전통 누룩 샘플 키트",
      "양조장 투어 초대권",
    ],
    deliveryDate: "2026.07.30",
    rewardPrice: 35000,
  },
};

export function FundingSupportPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [additionalSupport, setAdditionalSupport] = useState("0");
  const [supportMessage, setSupportMessage] = useState("");
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 후원자 정보
  const [supporterInfo, setSupporterInfo] = useState({
    phone: "",
    email: "",
  });

  // 배송지 정보
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: "",
    address: "",
    detailAddress: "",
    phone: "",
  });

  const project = rewardData[Number(projectId) || 1];

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

  const totalAmount =
    project.rewardPrice + (parseInt(additionalSupport) || 0);

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

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("결제수단을 선택해주세요.");
      return;
    }
    if (!agreeTerms || !agreeRefund) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }
    if (!supporterInfo.phone || !supporterInfo.email) {
      alert("후원자 정보를 입력해주세요.");
      return;
    }
    if (
      !shippingInfo.recipientName ||
      !shippingInfo.address ||
      !shippingInfo.phone
    ) {
      alert("배송지 정보를 입력해주세요.");
      return;
    }

    // 결제 처리 시뮬레이션 (실제로는 PG사 SDK 연동)
    try {
      // 결제 정보 로깅
      console.log("결제 정보:", {
        projectId,
        amount: totalAmount,
        paymentMethod: selectedPaymentMethod,
        supporterInfo,
        shippingInfo,
        supportMessage,
      });

      // 결제 처리 대기 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 성공
      setShowSuccessModal(true);
    } catch (error) {
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
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
                  감귤 막걸리
                </span>
              </div>
              <h2 className="text-sm font-bold text-black mb-2 line-clamp-2">
                {project.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-black">
                  {project.rewardPrice.toLocaleString()}원
                </span>
                <span className="text-xs text-red-500 font-bold">
                  80%
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
          <h3 className="text-base font-bold text-black mb-4">가격 안내</h3>
          <div className="space-y-2 mb-4">
            {project.rewardItems.map((item, index) => (
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
                  {project.deliveryDate}
                </span>
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-black">리워드 금액</span>
              <span className="text-lg font-bold text-black">
                {project.rewardPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 추가 후원금 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-2">
            추가 후원금 <span className="text-gray-500 font-normal">(선택)</span>
          </h3>
          <div className="flex items-center gap-2 mt-4">
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
                onChange={(e) =>
                  setSupporterInfo({ ...supporterInfo, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                이메일
              </label>
              <input
                type="email"
                value={supporterInfo.email}
                onChange={(e) =>
                  setSupporterInfo({ ...supporterInfo, email: e.target.value })
                }
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
              />
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
            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded">
              성인인증 필수
            </span>
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
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-black"
              />
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
          <div className="relative">
            <button
              onClick={() => setShowMessageOptions(!showMessageOptions)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              {supportMessage || "응원 메시지를 선택하세요"}
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
                    onClick={() => handleSupportMessageSelect(option)}
                    className="w-full py-3 px-4 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 결제수단 */}
        <div className="bg-white p-6 border-b-8 border-gray-100">
          <h3 className="text-base font-bold text-black mb-4">결제수단</h3>
          <div className="space-y-3">
            <button
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
            <button
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
            <button
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
          </div>
        </div>

        {/* 최종 후원 금액 및 약관 */}
        <div className="bg-white p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-red-500">
                최종 후원 금액
              </span>
              <span className="text-2xl font-bold text-black">
                {totalAmount.toLocaleString()} 원
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              프로젝트 성공 시, 결제는{" "}
              <span className="font-bold text-black">
                {project.deliveryDate}
              </span>{" "}
              에 진행됩니다. 프로젝트가 무산되거나 중단된 경우, 예약된 결제는
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
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {project.brewery}의 프로젝트를 후원해주셔서 감사합니다.
              </p>
              <Button
                onClick={() => navigate(`/archive/order/${projectId}`)}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-base"
              >
                주문 상세 보기
              </Button>
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

              {/* 안내 문구 */}
              <div className="px-4 pb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    💡 <strong>안내</strong>
                    <br />
                    실제 서비스에서는 Daum 우편번호 API를 통해
                    <br />
                    전국의 모든 주소를 검색할 수 있습니다.
                  </p>
                </div>
              </div>
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