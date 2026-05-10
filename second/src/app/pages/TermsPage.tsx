import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface TermsSection {
  id: number;
  title: string;
  items: {
    subtitle: string;
    points: string[];
  }[];
}

const termsSections: TermsSection[] = [
  {
    id: 1,
    title: "1. 서비스 이용약관 (통합)",
    items: [
      {
        subtitle: "제1조 (목적 및 지위)",
        points: [
          "본 약관은 '주담(酒談)' 플랫폼(이하 '플랫폼')이 제공하는 서비스의 이용 조건 및 절차를 규정합니다.",
          "플랫폼의 지위: 주담은 '통신판매중개업자'로서 주류 제조자(양조장)와 소비자 간의 거래를 중계하는 시스템을 제공할 뿐, 주류를 직접 매입하거나 판매하는 당사자가 아닙니다.",
        ],
      },
      {
        subtitle: "제2조 (회원 자격 및 연령 제한)",
        points: [
          "성인 인증: 주류를 취급하는 서비스 특성상, 본 서비스는 만 19세 이상의 성인만 이용할 수 있습니다. 회원은 가입 시 및 주류 결제 시 반드시 성인 인증을 완료해야 합니다.",
          "미성년자의 서비�� 이용이 확인될 경우, 사전 예고 없이 계정이 정지될 수 있습니다.",
        ],
      },
      {
        subtitle: "제3조 (레시피 제안 및 권리 관계)",
        points: [
          "아이디어의 성격: 사용자가 제출한 전통주 레시피(재료, 배합비 등)는 저작권법상 보호 대상이 아닌 '아이디어'로 간주됩니다.",
          "사용 권한 부여: 사용자는 레시피를 제안함과 동시에 플랫폼 및 협업 양조장에 대해 해당 레시피를 제품화, 홍보, 변형하여 사용할 수 있는 비독점적 사용 라이선스를 부여하는 것에 동의합니다.",
          "보증: 제안자는 해당 레시피가 타인의 특허나 영업비밀을 침해하지 않음을 보증해야 합니다.",
        ],
      },
      {
        subtitle: "제4조 (펀딩 시스템 및 환불)",
        points: [
          "리워드형 펀딩: 주담의 펀딩은 지분이나 이자를 제공하지 않고 완성된 제품을 보상으로 제공하는 '리워드형 크라우드펀딩'입니다.",
          "펀딩 성공 및 결제: 목표 금액 달성 시에만 결제가 진행되며, 목표 미달 시 펀딩은 취소되고 참여 금액은 전액 환불됩니다.",
          "배송 및 책임: 제품의 제조 및 배송 책임은 입점한 양조장에 있으며, 플랫폼은 중개 당사자로서 분쟁 해결을 위한 중재 및 정보 제공의 의무를 가집니다.",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "2. 개인정보 처리방침 (요약)",
    items: [
      {
        subtitle: "수집 항목",
        points: [
          "필수 항목: 이름, 휴대전화 번호, 생년월일(성인 인증용), 배송지 주소, 결제 정보.",
          "선택 항목: 술BTI 데이터, 개인 취향 정보, 시음 기록.",
        ],
      },
      {
        subtitle: "이용 목적",
        points: [
          "성인 인증 및 본인 확인.",
          "펀딩 리워드 배송 및 결제 처리.",
          "사용자 맞춤형 전통주 추천(술BTI 기반).",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "3. 전통주 통신판매 준수사항",
    items: [
      {
        subtitle: "판매 및 배송 원칙",
        points: [
          "모든 주류는 국세청 고시(제2024-41호)에 의거하여 관할 세무서의 승인을 받은 양조장에 의해서만 판매 및 직배송됩니다.",
          "사용자는 타인의 명의를 도용하여 주류를 구매할 수 없으며, 위반 시 법적 처벌을 받을 수 있습니다.",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "4. 커스텀 전통주 인정 및 품질 보증",
    items: [
      {
        subtitle: "품질 및 인증",
        points: [
          "커스텀 레시피 제품은 농업경영체가 지역 농산물을 주원료로 제조한 경우에 한해 '지역특산주'로 인정받아 유통됩니다.",
          "양조장은 플랫폼을 통해 출시되는 모든 제품의 품질 및 식품 위생법 준수 책임을 집니다.",
        ],
      },
    ],
  },
];

export function TermsPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">약관 및 정책</h1>
        </div>
      </div>

      <div className="pt-[72px] px-5 py-6 space-y-3">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-2xl p-5 flex items-center gap-4 mb-2"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base">주담 서비스 이용 약관 및 정책</h2>
            <p className="text-xs text-white/60 mt-0.5">최종 업데이트: 2026년 4월 7일</p>
          </div>
        </motion.div>

        {/* Accordion Sections */}
        {termsSections.map((section, sIdx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.07 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Section Header (accordion toggle) */}
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )
              }
              className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-bold text-gray-900 text-left">
                {section.title}
              </span>
              {expandedSection === section.id ? (
                <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-4">
                    {section.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className={iIdx > 0 ? "border-t border-gray-50 pt-4" : ""}
                      >
                        <h4 className="text-sm font-bold text-gray-900 mb-2">
                          {item.subtitle}
                        </h4>
                        <ul className="space-y-1.5">
                          {item.points.map((point, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs text-gray-600 leading-relaxed flex gap-2"
                            >
                              <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        <p className="text-center text-xs text-gray-400 pb-4 pt-2">
          © 2026 주담(JuDam). All rights reserved.
        </p>
      </div>
    </div>
  );
}
