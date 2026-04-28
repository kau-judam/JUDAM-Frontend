import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Package,
  CreditCard,
  User,
  BookOpen,
  MessageCircle,
  Wine,
} from "lucide-react";
import { Input } from "../components/ui/input";

const FAQ_CATEGORIES = [
  { id: "funding", label: "펀딩 참여", icon: Package, color: "bg-blue-50 text-blue-600" },
  { id: "payment", label: "결제/환불", icon: CreditCard, color: "bg-green-50 text-green-600" },
  { id: "account", label: "계정/인증", icon: User, color: "bg-purple-50 text-purple-600" },
  { id: "archive", label: "아카이브", icon: BookOpen, color: "bg-amber-50 text-amber-600" },
  { id: "community", label: "커뮤니티", icon: MessageCircle, color: "bg-rose-50 text-rose-600" },
  { id: "bti", label: "술BTI", icon: Wine, color: "bg-gray-100 text-gray-600" },
];

const FAQ_ITEMS = [
  // 펀딩 참여
  {
    id: 1,
    category: "funding",
    q: "펀딩은 어떻게 참여하나요?",
    a: "펀딩 페이지에서 마음에 드는 프로젝트를 선택 후 '후원하기' 버튼을 누르면 됩니다. 로그인 후 결제 수단을 선택해 후원 금액을 입력하면 참여가 완료됩니다. 펀딩 목표 금액이 달성되면 제조가 시작되며, 달성하지 못할 경우 전액 환불됩니다.",
  },
  {
    id: 2,
    category: "funding",
    q: "펀딩 목표가 달성되지 않으면 어떻게 되나요?",
    a: "펀딩 마감일까지 목표 금액이 달성되지 않으면, 후원하신 모든 금액은 전액 자동 환불됩니다. 환불은 영업일 기준 3~5일 이내에 처리됩니다.",
  },
  {
    id: 3,
    category: "funding",
    q: "배송 조회는 어디서 하나요?",
    a: "마이페이지 > 참여 펀딩 > 해당 프로젝트를 클릭하면 배송 상태를 확인할 수 있습니다. 배송 시작 시 문자와 앱 알림으로도 안내해 드립니다.",
  },
  {
    id: 4,
    category: "funding",
    q: "펀딩 수령 후 술이 마음에 들지 않으면 어떻게 하나요?",
    a: "배송된 술의 품질 문제(파손, 오배송 등)는 수령 후 7일 이내에 고객센터로 연락해 주세요. 단, 단순 변심에 의한 반품은 어려울 수 있으니 양해 부탁드립니다. 수령 후 리뷰를 남기면 다음 펀딩에 포인트를 제공합니다.",
  },
  // 결제/환불
  {
    id: 5,
    category: "payment",
    q: "펀딩 취소·환불은 어떻게 하나요?",
    a: "펀딩 취소는 마감일 전까지 마이페이지 > 참여 펀딩에서 직접 취소하실 수 있습니다. 환불은 취소 후 영업일 기준 3~5일 이내에 처리됩니다. 단, 제조가 시작된 경우 취소가 불가할 수 있습니다.",
  },
  {
    id: 6,
    category: "payment",
    q: "결제 수단에는 무엇이 있나요?",
    a: "신용카드/체크카드, 카카오페이, 네이버페이, 토스페이, 계좌이체를 지원합니다. 일부 프로모션의 경우 특정 결제 수단만 이용 가능할 수 있습니다.",
  },
  {
    id: 7,
    category: "payment",
    q: "영수증/세금계산서를 받을 수 있나요?",
    a: "결제 완료 후 이메일로 영수증이 자동 발송됩니다. 세금계산서는 결제 후 마이페이지 > 결제 내역에서 신청 가능하며, 사업자용 영수증이 필요하신 경우 고객센터로 문의해 주세요.",
  },
  // 계정/인증
  {
    id: 8,
    category: "account",
    q: "양조장으로 등록하려면 어떻게 해야 하나요?",
    a: "마이페이지 > 양조장 계정으로 전환하기를 선택하거나, 회원가입 시 '양조장 계정'을 선택하세요. 사업자등록증과 주류 제조면허 사본이 필요하며, 인증 심사는 영업일 기준 2~3일 이내 완료됩니다.",
  },
  {
    id: 9,
    category: "account",
    q: "비밀번호를 잊어버렸어요",
    a: "로그인 화면 하단의 '비밀번호 찾기'를 클릭하세요. 가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다. 이메일을 받지 못한 경우 스팸 폴더를 확인하거나 고객센터로 연락해 주세요.",
  },
  {
    id: 10,
    category: "account",
    q: "회원 탈퇴는 어떻게 하나요?",
    a: "마이페이지 > 설정 > 회원 탈퇴에서 탈퇴하실 수 있습니다. 탈퇴 시 모든 아카이브, 게시글, 펀딩 내역이 삭제되며 복구할 수 없습니다. 진행 중인 펀딩이 있을 경우 탈퇴가 제한될 수 있으니, 먼저 취소 후 탈퇴해 주세요.",
  },
  {
    id: 11,
    category: "account",
    q: "개인정보는 어떻게 관리되나요?",
    a: "주담은 개인정보보호법에 따라 이용자의 개인정보를 안전하게 관리합니다. 수집한 개인정보는 서비스 제공 목적 외에 사용하지 않으며, 관련 내용은 개인정보처리방침에서 확인하실 수 있습니다.",
  },
  // 아카이브
  {
    id: 12,
    category: "archive",
    q: "아카이브에 기록할 수 있는 술의 종류는?",
    a: "주담 펀딩에서 받은 술뿐만 아니라, 개인적으로 구매하거나 경험한 모든 전통주를 기록할 수 있습니다. 막걸리, 약주, 소주, 청주, 과실주 등 다양한 종류를 지원합니다.",
  },
  {
    id: 13,
    category: "archive",
    q: "아카이브 기록을 수정하거나 삭제할 수 있나요?",
    a: "술 아카이브 > 전체 경험한 술 탭에서 기록을 선택하면 수정 및 삭제가 가능합니다. 수정은 작성 후 30일 이내에만 가능하며, 삭제는 언제든지 가능합니다.",
  },
  // 커뮤니티
  {
    id: 14,
    category: "community",
    q: "게시글 작성 시 주의사항이 있나요?",
    a: "욕설, 비방, 상업적 광고, 저작권 침해 게시물은 삭제될 수 있습니다. 전통주에 관한 건강한 정보 공유와 소통을 위한 공간이므로, 다른 이용자를 배려하는 게시 문화를 지켜주세요. 신고를 받은 게시글은 검토 후 조치됩니다.",
  },
  {
    id: 15,
    category: "community",
    q: "레시피를 공유하고 싶은데 저작권 문제가 없나요?",
    a: "직접 개발하거나 변형한 레시피는 자유롭게 공유하실 수 있습니다. 타인의 레시피를 공유할 경우 출처를 명확히 밝혀 주세요. 저작권 침해가 확인된 경우 해당 게시글은 삭제 조치될 수 있습니다.",
  },
  // 술BTI
  {
    id: 16,
    category: "bti",
    q: "술BTI 결과가 저장이 안 돼요",
    a: "술BTI 결과는 로그인 상태에서만 저장됩니다. 비로그인 상태에서는 브라우저 세션 종료 시 결과가 사라질 수 있으니, 로그인 후 테스트를 진행해 주세요.",
  },
  {
    id: 17,
    category: "bti",
    q: "술BTI 결과가 실제 내 취향과 다른 것 같아요",
    a: "술BTI는 여러 질문을 통해 취향을 분석하는 참고 지표입니다. 결과가 마음에 들지 않으시면 다시 테스트해 보세요. 보다 정확한 결과를 위해 솔직하게 답변해 주시면 좋습니다.",
  },
];

export function FAQPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">자주 묻는 질문</h1>
        </div>
      </div>

      <div className="pt-[72px] px-4">
        {/* 검색 */}
        <div className="relative mt-4 mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="궁금한 내용을 검색해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !selectedCategory
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            전체
          </button>
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 결과 수 */}
        <p className="text-xs text-gray-400 mb-3">
          총 {filtered.length}개의 질문
        </p>

        {/* FAQ 목록 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <HelpCircle className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {filtered.map((faq, idx) => {
              const cat = FAQ_CATEGORIES.find((c) => c.id === faq.category);
              const isExpanded = expandedId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-900 text-sm font-bold flex-shrink-0 mt-0.5">Q.</span>
                    <div className="flex-1">
                      {cat && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-1 ${cat.color}`}>
                          <cat.icon className="w-2.5 h-2.5" />
                          {cat.label}
                        </span>
                      )}
                      <p className="text-sm font-medium text-gray-900">{faq.q}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
                          <div className="flex gap-3">
                            <span className="text-gray-500 text-sm font-bold flex-shrink-0 mt-0.5">A.</span>
                            <p className="text-sm text-gray-800 leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 하단 문의 안내 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 mt-2">
          <p className="text-sm font-bold text-gray-900 mb-1">원하는 답변을 못 찾으셨나요?</p>
          <p className="text-xs text-gray-500 mb-3">
            아래 이메일로 직접 문의해 주시면 빠르게 답변드립니다.
          </p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">support@juddam.com</p>
              <p className="text-[10px] text-gray-500">평일 10:00 – 18:00 순차 응답</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
