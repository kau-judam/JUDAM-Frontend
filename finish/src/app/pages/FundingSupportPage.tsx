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

  const handlePayment = () => {
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

    // 결제 처리 로직 (실제로는 PG사 연동)
    setShowSuccessModal(true);
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
                  <button className="px-4 py-3 bg-gray-100 text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
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
                    개인정보 제 3자 제공 의
                  </span>
                  <button className="text-xs text-blue-600 hover:underline">
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
          <button className="hover:text-black transition-colors">
            이용약관
          </button>
          <span>·</span>
          <button className="hover:text-black transition-colors">
            개인정보 처리방침
          </button>
          <span>·</span>
          <button className="hover:text-black transition-colors">
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
    </div>
  );
}