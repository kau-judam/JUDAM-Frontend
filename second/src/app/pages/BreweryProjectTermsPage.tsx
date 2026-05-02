import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle } from "lucide-react";

interface TermItem {
  id: string;
  title: string;
  detail: string;
}

const termsData: TermItem[] = [
  {
    id: "age",
    title: "대표 제조자는 만 19세 이상의 성인이어야 합니다.",
    detail:
      "주류 제조 및 통신판매를 진행하는 법적 주체로서, 프로젝트를 개설하는 대표 제조자는 「민법」 제4조 및 「청소년 보호법」 제2조에 따른 만 19세 이상의 성인이어야 합니다. 미성년자 명의 도용 또는 타인 명의의 부당 사용이 확인될 경우, 「주민등록법」 제37조(벌칙)에 따라 고발 조치될 수 있으며, 플랫폼 이용약관에 의거하여 즉각적인 펀딩 취소 및 영구적인 계정 정지 조치가 취해집니다.",
  },
  {
    id: "contact",
    title:
      "주담에서 필요시 연락드릴 수 있도록 본인 명의의 휴대폰 번호와 이메일 주소가 필요합니다.",
    detail:
      "「전자상거래 등에서의 소비자보호에 관한 법률」 제20조 제2항에 따라 통신판매중개업자인 주담은 소비자(후원자)에게 통신판매의뢰자(양조장)의 신원 정보를 제공할 의무가 있습니다. 이를 위해 프로젝트 심사, 정산, 그리고 분쟁 발생 시 즉각적인 연락이 가능한 본인 또는 법인 명의의 유효한 연락처를 수집합니다. 수집된 정보는 「개인정보 보호법」 제15조에 따라 목적 달성 및 법정 보유 기간 경과 후 안전하게 파기됩니다.",
  },
  {
    id: "settlement",
    title:
      "프로젝트 성공 후 정산을 위해 신분증 또는 사업자 등록증, 국내 은행 계좌가 필요합니다.",
    detail:
      "펀딩 성공에 따른 정산금 지급 및 세무 신고를 위해 「금융실명거래 및 비밀보장에 관한 법률」 제3조에 근거하여 실명 확인이 가능한 신분증 사본 또는 사업자등록증명원, 그리고 동일 명의의 국내 은행 계좌가 필요합니다. 제공된 정보는 「소득세법」 및 「부가가치세법」에 따른 세금계산서 발행 등의 증빙 자료로 활용되며, 명의 불일치 시 자금세탁방지(AML) 규정에 따라 정산이 보류될 수 있습니다.",
  },
  {
    id: "fee",
    title: "펀딩 성공 시 수수료 정책에 동의합니다. (수수료 7%)",
    detail:
      "주담은 All-or-Nothing(목표 금액 달성 시 결제) 방식의 리워드형 크라우드펀딩 플랫폼입니다. 펀딩 최종 성공 시, 총 모금액에서 결제망 이용 및 플랫폼 서비스 제공에 대한 대가로 수수료 7%(부가가치세 별도)가 공제된 후 지정 계좌로 정산됩니다. 이는 「약관의 규제에 관한 법률」에 위배되지 않는 정당한 서비스 이용 대가이며, 목표액 미달 시에는 소비자 결제 승인이 자동 취소되므로 양조장에 어떠한 비용도 청구되지 않습니다.",
  },
  {
    id: "responsibility",
    title:
      "펀딩 프로젝트 진행 및 리워드 제공에 대한 책임은 양조장에 있음을 이해합니다.",
    detail:
      "주담은 「전자상거래 등에서의 소비자보호에 관한 법률」상 '통신판매중개업자'로서 거래의 직접 당사자가 아닙니다. 동법 제20조 제1항에 따라, 펀딩 완료 후 약속된 리워드(전통주)의 제조, 「식품위생법」에 따른 품질 및 위생 보증, 기한 내 배송(수취인 대면 성인 인증 포함), 하자로 인한 교환·환불 등 계약 이행에 관한 모든 1차적 법적 책임은 통신판매의뢰자인 '양조장(메이커)'에게 귀속됩니다. 플랫폼은 분쟁 해결을 위한 중재적 노력만 수행합니다.",
  },
  {
    id: "license",
    title:
      "전통주(지역특산주 등) 제조 면허 및 통신판매 승인을 보유하고 있음을 보증합니다.",
    detail:
      "플랫폼에서 펀딩되는 주류는 「전통주 등의 산업진흥에 관한 법률」 제2조에 따른 '민속주' 또는 '지역특산주' 요건을 충족해야 합니다. 또한, 양조장은 「주세법」 제53조 및 「주류의 통신판매에 관한 명령위임 고시」(국세청고시 제2024-41호)에 의거하여, 펀딩 개시 전 반드시 관할 세무서장으로부터 '주류 통신판매 승인'을 완료해야 합니다. 미승인 주류 판매나 일반 주류의 위장 판매 등 관계 법령 위반 시 발생되는 행정처분 및 민형사상 책임은 전적으로 양조장에 있습니다.",
  },
  {
    id: "ip",
    title:
      "제안된 커스텀 레시피의 비독점적 사용 라이선스 및 지식재산권 정책에 동의합니다.",
    detail:
      "대법원 판례에 따라 주류 제조 레시피(재료, 배합 비율, 양조 순서 등) 자체는 「저작권법」 제2조 제1호의 보호 대상인 '표현'이 아닌 '아이디어'의 영역에 해당하여 저작권이 인정되지 않습니다. 이에 따라 양조장은 플랫폼을 통해 제안된 커스텀 레시피를 적법하게 제품화할 수 있는 비독점적 권리를 보장받습니다. 단, 타 양조장의 등록 특허(「특허법」) 또는 보호되는 영업비밀(「부정경쟁방지 및 영업비밀보호에 관한 법률」)을 고의로 침해하여 발생하는 분쟁에 대해서는 프로젝트를 진행한 양조장이 전적으로 책임 및 면책 의무를 집니다.",
  },
];

export function BreweryProjectTermsPage() {
  const navigate = useNavigate();
  const [agreedTerms, setAgreedTerms] = useState<string[]>([]);
  const [modalTerm, setModalTerm] = useState<TermItem | null>(null);

  const allTermIds = termsData.map((term) => term.id);
  const allAgreed = agreedTerms.length === allTermIds.length;

  const handleNext = () => {
    if (allAgreed) {
      navigate("/brewery/project/details");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-40 max-w-[430px] mx-auto">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/funding")}
            className="p-2 -ml-2"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-base font-bold text-gray-900">
            펀딩 프로젝트 약관
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            펀딩 프로젝트 등록을 위한
            <br />
            약관에 동의해주세요
          </h2>
          <p className="text-sm text-gray-600">
            모든 약관에 동의하셔야 프로젝트를 등록할 수 있습니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* 전체 동의 */}
          <button
            onClick={() => {
              if (allAgreed) {
                setAgreedTerms([]);
              } else {
                setAgreedTerms(allTermIds);
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-bold text-gray-900">
              전체 동의
            </span>
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                allAgreed
                  ? "bg-gray-900 border-gray-900"
                  : "border-gray-300"
              }`}
            >
              {allAgreed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </button>

          {/* 개별 약관 */}
          <div className="space-y-3">
            {termsData.map((term) => (
              <div
                key={term.id}
                className="w-full bg-white border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-all"
              >
                <div className="w-full flex items-start gap-3 p-3">
                  <button
                    onClick={() => {
                      if (agreedTerms.includes(term.id)) {
                        setAgreedTerms(agreedTerms.filter((id) => id !== term.id));
                      } else {
                        setAgreedTerms([...agreedTerms, term.id]);
                      }
                    }}
                    className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all hover:border-gray-400"
                    aria-label={`${term.title} 동의`}
                  >
                    <div
                      className={`w-full h-full rounded flex items-center justify-center transition-all ${
                        agreedTerms.includes(term.id)
                          ? "bg-gray-900 border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {agreedTerms.includes(term.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </button>
                  <div className="flex-1">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {term.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-red-600 font-medium">
                        필수
                      </span>
                      <button
                        onClick={() => setModalTerm(term)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 안내 메시지 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-6"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  프로젝트 등록 후 승인까지 3-5일이 소요됩니다. 승인 완료 후 펀딩을 시작할 수 있습니다.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4 z-40">
        <button
          onClick={handleNext}
          disabled={!allAgreed}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
        >
          다음
        </button>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {modalTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setModalTerm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-[390px] max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* 모달 헤더 */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <h3 className="text-base font-bold text-gray-900 pr-8 leading-relaxed">
                  {modalTerm.title}
                </h3>
                <button
                  onClick={() => setModalTerm(null)}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* 모달 본문 */}
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {modalTerm.detail}
                </p>
              </div>

              {/* 모달 푸터 */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setModalTerm(null)}
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}