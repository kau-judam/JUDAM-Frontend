import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Copy,
  ChevronRight,
  Star,
  Clock,
  CreditCard,
  Receipt,
  MessageSquare,
  Phone,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

// ────────────────────────────────────────────
// Mock order data (keyed by archive item id)
// ────────────────────────────────────────────
const orderData: Record<
  number,
  {
    orderId: string;
    fundingId: number;
    drinkName: string;
    brewery: string;
    breweryPhone: string;
    category: string;
    image: string;
    option: string;
    quantity: number;
    unitPrice: number;
    shippingFee: number;
    participatedAt: string;
    paidAt: string;
    paymentMethod: string;
    deliveryStatus: "예정" | "준비중" | "발송" | "완료";
    estimatedDate: string | null;
    deliveredAt: string | null;
    trackingNumber: string | null;
    courier: string | null;
    recipient: string;
    address: string;
    hasReview: boolean;
    timeline: { date: string; label: string; done: boolean }[];
  }
> = {
  1: {
    orderId: "JD-2025-001247",
    fundingId: 1,
    drinkName: "봄을 담은 벚꽃 막걸리",
    brewery: "꽃샘양조장",
    breweryPhone: "031-123-4567",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    option: "375ml × 2병",
    quantity: 1,
    unitPrice: 26000,
    shippingFee: 2000,
    participatedAt: "2025.01.10",
    paidAt: "2025.01.10 14:32",
    paymentMethod: "카카오페이",
    deliveryStatus: "완료",
    estimatedDate: "2025.03.10",
    deliveredAt: "2025.03.14",
    trackingNumber: "624881234567",
    courier: "CJ대한통운",
    recipient: "김주담",
    address: "서울시 마포구 연남동 123-45, 202호",
    hasReview: false,
    timeline: [
      { date: "2025.01.10", label: "펀딩 참여 완료", done: true },
      { date: "2025.02.20", label: "제조 시작", done: true },
      { date: "2025.03.08", label: "제조 완료 · 배송 준비", done: true },
      { date: "2025.03.11", label: "발송 완료", done: true },
      { date: "2025.03.14", label: "배송 완료 🎉", done: true },
    ],
  },
  2: {
    orderId: "JD-2024-008831",
    fundingId: 2,
    drinkName: "전통 누룩의 재발견",
    brewery: "술샘양조장",
    breweryPhone: "031-456-7890",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    option: "500ml × 1병",
    quantity: 1,
    unitPrice: 33000,
    shippingFee: 2000,
    participatedAt: "2024.11.22",
    paidAt: "2024.11.22 19:05",
    paymentMethod: "신용카드",
    deliveryStatus: "완료",
    estimatedDate: "2025.01.05",
    deliveredAt: "2025.01.08",
    trackingNumber: "571993847562",
    courier: "한진택배",
    recipient: "김주담",
    address: "서울시 마포구 연남동 123-45, 202호",
    hasReview: true,
    timeline: [
      { date: "2024.11.22", label: "펀딩 참여 완료", done: true },
      { date: "2024.12.15", label: "제조 시작", done: true },
      { date: "2025.01.03", label: "제조 완료 · 배송 준비", done: true },
      { date: "2025.01.06", label: "발송 완료", done: true },
      { date: "2025.01.08", label: "배송 완료 🎉", done: true },
    ],
  },
  5: {
    orderId: "JD-2025-006102",
    fundingId: 5,
    drinkName: "산사 막걸리",
    brewery: "산사양조",
    breweryPhone: "033-789-0123",
    category: "막걸리",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    option: "300ml × 2병",
    quantity: 1,
    unitPrice: 40000,
    shippingFee: 2000,
    participatedAt: "2025.03.01",
    paidAt: "2025.03.01 11:18",
    paymentMethod: "토스페이",
    deliveryStatus: "예정",
    estimatedDate: "2025.05.10",
    deliveredAt: null,
    trackingNumber: null,
    courier: null,
    recipient: "김주담",
    address: "서울시 마포구 연남동 123-45, 202호",
    hasReview: false,
    timeline: [
      { date: "2025.03.01", label: "펀딩 참여 완료", done: true },
      { date: "2025.04.01", label: "제조 시작 예정", done: false },
      { date: "2025.04.25", label: "제조 완료 예정", done: false },
      { date: "2025.05.05", label: "발송 예정", done: false },
      { date: "2025.05.10", label: "배송 완료 예정", done: false },
    ],
  },
};

const STATUS_CONFIG = {
  예정: { label: "배송 예정", color: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-400" },
  준비중: { label: "배송 준비중", color: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-400" },
  발송: { label: "배송중", color: "bg-purple-50 text-purple-600 border-purple-100", dot: "bg-purple-400" },
  완료: { label: "배송 완료", color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-400" },
};

export function FundingOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orderData[parseInt(id || "1")] || orderData[1];
  const status = STATUS_CONFIG[order.deliveryStatus];
  const totalAmount = order.unitPrice * order.quantity + order.shippingFee;

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success("운송장 번호가 복사되었습니다.");
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("양조장 문의 전송:", {
        brewery: order.brewery,
        title: inquiryTitle,
        email: inquiryEmail,
        content: inquiryContent,
      });

      toast.success("문의가 접수되었습니다.");
      setShowInquiryModal(false);
      setInquiryTitle("");
      setInquiryEmail("");
      setInquiryContent("");
    } catch (error) {
      toast.error("문의 접수에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">주문 상세</h1>
            <p className="text-[10px] text-gray-400">{order.orderId}</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* ── Delivery Status Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 border ${status.color}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
              <span className="font-bold text-sm">{status.label}</span>
            </div>
            {order.deliveredAt && (
              <span className="text-xs opacity-70">{order.deliveredAt}</span>
            )}
            {!order.deliveredAt && order.estimatedDate && (
              <span className="text-xs opacity-70">예정 {order.estimatedDate}</span>
            )}
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="bg-white/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] opacity-70 mb-0.5">{order.courier}</p>
                <p className="font-bold text-sm tracking-wider">{order.trackingNumber}</p>
              </div>
              <button
                onClick={copyTracking}
                className="flex items-center gap-1 bg-white rounded-lg px-2.5 py-1.5 text-xs font-semibold border border-current/20 hover:bg-white/80 transition-colors"
              >
                <Copy className="w-3 h-3" />
                복사
              </button>
            </div>
          )}
          {!order.trackingNumber && (
            <p className="text-xs opacity-70">
              {order.deliveryStatus === "예정"
                ? "제조가 완료되면 운송장 번호가 등록됩니다."
                : "배송 준비 중입니다."}
            </p>
          )}
        </motion.div>

        {/* ── Delivery Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-4">배송 타임라인</h3>
          <div className="space-y-0">
            {order.timeline.map((step, index) => {
              const isLast = index === order.timeline.length - 1;
              const isCurrentStep =
                index ===
                order.timeline.findLastIndex((s) => s.done);
              return (
                <div key={index} className="flex gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center w-5 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        step.done
                          ? "bg-gray-900 border-gray-900"
                          : isCurrentStep
                          ? "bg-white border-gray-400"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-7 mt-0.5 transition-all ${
                          step.done ? "bg-gray-300" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-${isLast ? "0" : "7"} flex-1`}>
                    <p
                      className={`text-sm font-semibold leading-snug ${
                        step.done
                          ? isCurrentStep
                            ? "text-gray-900"
                            : "text-gray-600"
                          : "text-gray-300"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        step.done ? "text-gray-400" : "text-gray-200"
                      }`}
                    >
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Order Items ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-4 pt-4 pb-3 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">주문 상품</h3>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={order.image} alt={order.drinkName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 mb-0.5">{order.brewery}</p>
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                {order.drinkName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{order.option}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900 text-sm">
                {order.unitPrice.toLocaleString()}원
              </p>
              <p className="text-[10px] text-gray-400">× {order.quantity}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Receipt ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">결제 내역</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "상품 금액", value: `${order.unitPrice.toLocaleString()}원` },
              { label: "배송비", value: `+${order.shippingFee.toLocaleString()}원` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm text-gray-700">{value}</span>
              </div>
            ))}
            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">총 결제 금액</span>
              <span className="text-base font-bold text-gray-900">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
            {[
              { label: "결제 수단", value: order.paymentMethod },
              { label: "결제 일시", value: order.paidAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-gray-300" />
                  <span className="text-xs text-gray-600">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Delivery Address ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">배송지 정보</h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 text-sm">{order.recipient}</p>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">{order.address}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          {/* Review CTA — only if delivered and no review */}
          {order.deliveryStatus === "완료" && !order.hasReview && (
            <Link
              to={`/archive/review/${order.fundingId}`}
              className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">후기를 작성해보세요!</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    나의 경험을 다른 주담과 나눠요
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </Link>
          )}

          {order.deliveryStatus === "완료" && order.hasReview && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">후기 작성 완료</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/funding/${order.fundingId}`}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-all"
            >
              <Package className="w-4 h-4" />
              펀딩 상세
            </Link>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              양조장 문의
            </button>
          </div>

          {/* Brewery contact */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-2">
            <Phone className="w-3 h-3" />
            <span>{order.brewery} · {order.breweryPhone}</span>
          </div>

          {/* Clock */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pb-2">
            <Clock className="w-3 h-3" />
            <span>주문일 {order.participatedAt}</span>
          </div>
        </motion.div>
      </div>

      {/* ── Inquiry Modal ── */}
      <AnimatePresence>
        {showInquiryModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                  <h2 className="font-bold text-gray-900">양조장 문의</h2>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleInquirySubmit} className="p-5 space-y-4">
                {/* Brewery Info */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-0.5">문의 대상</p>
                  <p className="font-bold text-sm text-gray-900">{order.brewery}</p>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="inquiry-title" className="text-sm text-gray-700 mb-2 block">
                    문의 제목 *
                  </Label>
                  <Input
                    id="inquiry-title"
                    type="text"
                    placeholder="문의하실 내용을 간단히 입력해주세요"
                    value={inquiryTitle}
                    onChange={(e) => setInquiryTitle(e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-gray-900"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="inquiry-email" className="text-sm text-gray-700 mb-2 block">
                    답변 받을 이메일 *
                  </Label>
                  <Input
                    id="inquiry-email"
                    type="email"
                    placeholder="example@email.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-gray-900"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="inquiry-content" className="text-sm text-gray-700 mb-2 block">
                    문의 내용 *
                  </Label>
                  <Textarea
                    id="inquiry-content"
                    placeholder="문의하실 내용을 자세히 작성해주세요"
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-gray-900 resize-none"
                    required
                  />
                </div>

                {/* Notice */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    💡 작성하신 이메일로 양조장의 답변이 발송됩니다. 이메일 주소를 정확히 입력해주세요.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-60"
                  >
                    {isSubmitting ? "전송 중..." : "문의하기"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
