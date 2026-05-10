import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Megaphone, ChevronRight, Pin } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: "공지" | "업데이트" | "이벤트";
  isPinned?: boolean;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: "[필독] 주담 서비스 이용약관 개정 안내",
    content:
      "2026년 4월 7일부로 서비스 이용약관 및 개인정보 처리방침이 개정됩니다. 주요 변경 사항으로는 전통주 통신판매 준수사항 추가 및 레시피 권리 관계 조항이 명확화되었습니다. 변경된 약관은 마이페이지 > 약관 및 정책에서 확인하실 수 있습니다.",
    date: "2026.04.07",
    category: "공지",
    isPinned: true,
  },
  {
    id: 2,
    title: "술BTI 테스트 업데이트 안내",
    content:
      "더욱 정확한 술BTI 분석을 위해 테스트 문항이 업데이트되었습니다. 기존에 테스트를 완료하신 분들도 재검사를 통해 더 정밀한 결과를 확인해보세요! 기존 결과는 재검사 전까지 유지됩니다.",
    date: "2026.03.28",
    category: "업데이트",
    isPinned: true,
  },
  {
    id: 3,
    title: "봄맞이 전통주 펀딩 이벤트 진행",
    content:
      "4월 한 달간 봄을 테마로 한 전통주 펀딩 프로젝트를 집중 소개합니다. 참여 펀딩 금액에 따라 특별 굿즈가 제공되며, 첫 펀딩 참여 시 10% 할인 쿠폰을 드립니다.",
    date: "2026.03.20",
    category: "이벤트",
  },
  {
    id: 4,
    title: "전통주 도감 신규 콘텐츠 추가 안내",
    content:
      "전통주 도감에 새로운 전통주 카테고리와 지역별 분류가 추가되었습니다. 더욱 풍부한 전통주 정보를 만나보세요. 전국 양조장 정보도 함께 확인하실 수 있습니다.",
    date: "2026.03.15",
    category: "업데이트",
  },
  {
    id: 5,
    title: "오픈 키친 피드 기능 출시",
    content:
      "양조장에서 직접 제조 과정을 공유하는 오픈 키친 피드 기능이 출시되었습니다. 좋아하는 양조장을 팔로우하고, 실시간으로 제조 일지를 확인해보세요.",
    date: "2026.03.01",
    category: "업데이트",
  },
  {
    id: 6,
    title: "주담 서비스 정식 오픈 안내",
    content:
      "전통주 크라우드펀딩 플랫폼 주담(酒談)이 정식 오픈하였습니다. 전통주를 사랑하는 모든 분들과 함께 새로운 전통주 문화를 만들어가겠습니다. 많은 관심과 참여 부탁드립니다.",
    date: "2026.02.14",
    category: "공지",
  },
];

const categoryStyles: Record<Announcement["category"], string> = {
  공지: "bg-gray-900 text-white",
  업데이트: "bg-gray-100 text-gray-700",
  이벤트: "bg-gray-800 text-white",
};

export function AnnouncementPage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"전체" | Announcement["category"]>("전체");

  const filtered =
    filter === "전체"
      ? announcements
      : announcements.filter((a) => a.category === filter);

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
          <h1 className="text-lg font-bold text-gray-900">공지사항</h1>
        </div>
        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          {(["전체", "공지", "업데이트", "이벤트"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-[116px] px-5 py-4 space-y-3">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-2xl p-4 flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">공지사항</p>
            <p className="text-xs text-white/60">운영 팀의 중요한 소식을 확인하세요</p>
          </div>
        </motion.div>

        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full text-left p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {item.isPinned && (
                      <Pin className="w-3 h-3 text-gray-500" />
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryStyles[item.category]}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {item.title}
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${
                    expandedId === item.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>

            {expandedId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 border-t border-gray-50"
              >
                <p className="text-xs text-gray-600 leading-relaxed pt-3">{item.content}</p>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">해당 카테고리의 공지사항이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
