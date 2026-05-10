import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  HelpCircle,
  Wine,
  ArrowRight,
  TrendingUp,
  Megaphone,
  Scroll,
  Mail,
  Phone,
  Hash,
  X,
  MessageCircle,
  BookOpen,
  PenSquare,
  ThumbsUp,
  Utensils,
  ChevronDown,
  ChevronUp,
  Factory,
  LayoutDashboard,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// BTI 타입 이름 매핑
const btiNames: Record<string, { name: string; emoji: string; description: string }> = {
  HCSA: { name: "냉철한 도시의 사냥꾼", emoji: "🏹", description: "도수 높고 산미 있는 깔끔한 증류주 선호" },
  HCSP: { name: "새벽 안개의 수도승", emoji: "🌄", description: "고도수의 달콤하고 맑은 명품 청주 선호" },
  HTSA: { name: "타오르는 불꽃 기사", emoji: "🔥", description: "묵직하고 산미 강한 개성파 탁주 선호" },
  HTSP: { name: "둔의 양조 명인", emoji: "🍯", description: "묵직하고 달콤한 고도수 원액 선호" },
  LCSA: { name: "청량한 탄산 요정", emoji: "✨", description: "저도수의 산미 있고 톡 쏘는 스파클링 선호" },
  LCSP: { name: "달빛 아래 시인", emoji: "🌙", description: "저도수의 달콤하고 맑은 이지드링킹 약주 선호" },
  LTSA: { name: "푸른 들판의 농부", emoji: "🌾", description: "저도수의 산미 있고 걸쭉한 새콤 막걸리 선호" },
  LTSP: { name: "몽글몽글 구름 방랑자", emoji: "☁️", description: "저도수의 달콤하고 부드러운 크리미 막걸리 선호" },
  HSSA: { name: "화려한 축제의 주인공", emoji: "🎊", description: "고도수의 탄산감과 화려한 향의 혼성주 선호" },
  HSSP: { name: "심야 식당의 주인", emoji: "🌃", description: "고도수의 달콤하고 진한 과일 증류주 선호" },
  LSSA: { name: "상큼한 과수원 소년", emoji: "🍊", description: "저도수의 탄산 있고 달콤한 과일 막걸리 선호" },
  LSSP: { name: "달콤한 꿈의 여행자", emoji: "🌈", description: "저도수의 아주 달콤하고 부드러운 디저트주 선호" },
  HCAP: { name: "대숲의 검객", emoji: "⚔️", description: "도수 높고 산미만 강조된 극강의 드라이주 선호" },
  HTAP: { name: "거친 파도의 선원", emoji: "🌊", description: "묵직하고 시큼한 전통 방식의 막걸리 선호" },
  LCAP: { name: "봄날의 산들바람", emoji: "🌸", description: "가볍고 산뜻한 데일리 식전주 선호" },
  LTAP: { name: "정겨운 시골 할머니", emoji: "🏡", description: "묵직하고 시큼한 전통 방식의 탁주 선호" },
};

type ActivityType = "post" | "comment" | "like" | "recipe";

interface ActivityItem {
  id: number;
  type: ActivityType;
  actionLabel: string;
  content: string | null;
  targetTitle: string | null;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  postId?: number;
  recipeId?: number;
}

const MY_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    type: "post",
    actionLabel: "게시글 작성",
    content:
      "오늘 드디어 벚꽃 막걸리 도착했어요! 첫 모금부터 꽃향기가 확 퍼지는 게 정말 감동이에요. 주담 펀딩 참여하기 잘했다 싶었습니다 🌸",
    targetTitle: null,
    category: "자유게시판",
    likes: 42,
    comments: 8,
    timestamp: "2시간 전",
    postId: 1,
  },
  {
    id: 2,
    type: "recipe",
    actionLabel: "레시피 작성",
    content:
      "장미꽃 막걸리 홈브루 레시피를 올렸어요. 국내산 쌀 2kg에 장미꽃잎 50g을 넣고 3일 발효하면 은은한 꽃향기가 정말 예쁘게 나와요 🌹",
    targetTitle: null,
    category: "레시피",
    likes: 28,
    comments: 6,
    timestamp: "어제",
    recipeId: 1,
  },
  {
    id: 3,
    type: "comment",
    actionLabel: "댓글 작성",
    content: "저도 동의해요! 전통 누룩 향이 진짜 독특하더라고요 🍶",
    targetTitle: "전통 누룩 막걸리와 삼겹살 페어링 후기",
    category: "정보게시판",
    likes: 5,
    comments: 0,
    timestamp: "2일 전",
    postId: 3,
  },
  {
    id: 4,
    type: "like",
    actionLabel: "좋아요",
    content: null,
    targetTitle: "꽃향기 가득한 약주 홈파티 기록 🌸",
    category: "자유게시판",
    likes: 0,
    comments: 0,
    timestamp: "3일 전",
    postId: 2,
  },
];

// FAQ 데이터
const FAQ_ITEMS = [
  {
    id: 1,
    q: "펀딩 취소·환불은 어떻게 하나요?",
    a: "펀딩 취소는 마감일 전까지 마이페이지 > 참여 펀딩에서 직접 취소하실 수 있습니다. 환불은 취소 후 영업일 기준 3~5일 이내에 처리됩니다. 단, 제조가 시작된 경우 취소가 불가할 수 있습니다.",
  },
  {
    id: 2,
    q: "배송 조회는 어디서 하나요?",
    a: "마이페이지 > 참여 펀딩 > 해당 프로젝트를 클릭하면 배송 상태를 확인할 수 있습니다. 배송 시작 시 문자와 앱 알림으로도 안내해 드립니다.",
  },
  {
    id: 3,
    q: "술BTI 결과가 저장이 안 돼요",
    a: "술BTI 결과는 로그인 상태에서만 저장됩니다. 비로그인 상태에서는 브라우저 세션 종료 시 결과가 사라질 수 있으니, 로그인 후 테스트를 진행해 주세요.",
  },
  {
    id: 4,
    q: "양조장으로 등록하려면 어떻게 해야 하나요?",
    a: "회원가입 시 '양조장 계정'을 선택하거나, 마이페이지에서 양조장 인증을 신청할 수 있습니다. 사업자등록증과 주류 제조면허 사본이 필요합니다.",
  },
  {
    id: 5,
    q: "아카이브에 기록할 수 있는 술의 종류는?",
    a: "주담 펀딩에서 받은 술뿐만 아니라, 개인적으로 구매하거나 경험한 모든 전통주를 기록할 수 있습니다. 막걸리, 약주, 소주, 청주, 과실주 등 다양한 종류를 지원합니다.",
  },
];

export function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSupportPanel, setShowSupportPanel] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const btiCode = localStorage.getItem("btiResult");
  const btiData = btiCode ? btiNames[btiCode] : null;

  const userStats = {
    fundedProjects: 6,
    archiveCount: 12,
    postsCount: 5,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <Wine className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-3xl mb-4 text-gray-900">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-8">
              마이페이지를 이용하시려면
              <br />
              로그인을 해주세요
            </p>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 text-lg rounded-2xl"
            >
              로그인하러 가기
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다");
    navigate("/");
  };

  const handleGoToBTITest = () => {
    localStorage.removeItem("btiResult");
    navigate("/bti-test");
  };

  const handleActivityClick = (item: ActivityItem) => {
    if (item.type === "post" && item.postId) {
      navigate(`/community/post/${item.postId}`);
    } else if (item.type === "comment" && item.postId) {
      navigate(`/community/post/${item.postId}`);
    } else if (item.type === "like" && item.postId) {
      navigate(`/community/post/${item.postId}`);
    } else if (item.type === "recipe" && item.recipeId) {
      navigate(`/recipe/${item.recipeId}`);
    } else {
      navigate("/community");
    }
  };

  const initial = user.name?.[0]?.toUpperCase() || "U";
  const isBrewery = user.type === "brewery";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Profile Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="px-5 pt-6 pb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            {/* 다크 원형 아바타 */}
            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-xl font-bold text-white leading-none">{initial}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {user.name} 님
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full mt-1">
                {isBrewery ? (
                  <Factory className="w-3 h-3 text-gray-500" />
                ) : (
                  <Wine className="w-3 h-3 text-gray-500" />
                )}
                <span className="text-xs font-semibold text-gray-700">
                  {isBrewery ? "양조장 계정" : "일반 유저"}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </motion.div>

          {/* 양조장 대시보드 바로가기 */}
          {isBrewery && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate("/brewery/dashboard")}
              className="mt-4 w-full flex items-center justify-between bg-gray-900 text-white rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/70">양조장 전용</p>
                  <p className="text-sm font-bold text-white">양조장 대시보드</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60" />
            </motion.button>
          )}

          {/* 일반 유저 → 양조장 계정 전환 배너 제거됨 (기타 섹션으로 이동) */}
        </div>
      </section>

      {/* 2. BTI Section */}
      <section className="px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <button
            onClick={() => {
              if (btiData && btiCode) navigate(`/bti-result/${btiCode}`);
            }}
            disabled={!btiData}
            className={`w-full rounded-2xl p-5 border flex items-center justify-between group transition-all duration-200 ${
              btiData
                ? "bg-white hover:bg-gray-50 border-gray-200 shadow-sm cursor-pointer"
                : "bg-gray-50 border-gray-100 cursor-default"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                {btiData ? btiData.emoji : "🍶"}
              </div>
              <div className="text-left">
                {btiData ? (
                  <>
                    <h3 className="font-bold text-base text-gray-900">
                      나의 술BTI: {btiData.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{btiData.description}</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-base text-gray-500">
                      당신의 술BTI를 알아보세요!
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      아직 술BTI 검사를 하지 않으셨어요
                    </p>
                  </>
                )}
              </div>
            </div>
            {btiData && (
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={handleGoToBTITest}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            🍶 술BTI 검사하러 가기
          </button>
        </motion.div>
      </section>

      {/* 3. Quick Stats */}
      <section className="px-5 py-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <button
              onClick={() => navigate("/mypage/funded")}
              className="text-center hover:bg-gray-50 transition-colors py-2 rounded-l-xl"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{userStats.fundedProjects}</p>
              <p className="text-xs text-gray-500 mt-0.5">참여 펀딩</p>
            </button>
            <button
              onClick={() => navigate("/archive")}
              className="text-center hover:bg-gray-50 transition-colors py-2"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{userStats.archiveCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">내 아카이브</p>
            </button>
            <button
              onClick={() => navigate("/mypage/posts")}
              className="text-center hover:bg-gray-50 transition-colors py-2 rounded-r-xl"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <PenSquare className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">{userStats.postsCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">작성 게시글</p>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 4. Menu Sections */}
      <section className="px-5 py-4 space-y-5">
        {/* 계정 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionLabel>계정 정보</SectionLabel>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <InfoRow icon={<Hash className="w-4 h-4 text-gray-400" />} label="사용자 고유 ID">
              <span className="text-sm font-mono font-semibold text-gray-900">{user.uid || "JD-UNKNOWN"}</span>
            </InfoRow>
            <InfoRow icon={<Mail className="w-4 h-4 text-gray-400" />} label="이메일">
              <span className="text-sm text-gray-900 truncate">{user.email || "이메일 없음"}</span>
            </InfoRow>
            <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="전화번호" last>
              <span className="text-sm text-gray-900">{user.phone || "전화번호 없음"}</span>
            </InfoRow>
          </div>
        </motion.div>

        {/* 나의 활동 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionLabel>나의 활동</SectionLabel>
          <div className="space-y-3">
            {MY_ACTIVITIES.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.06 }}
              >
                <div
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]"
                  onClick={() => handleActivityClick(item)}
                >
                  {/* 활동 유형 뱃지 + 시간 */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.type === "post"
                          ? "bg-gray-900 text-white"
                          : item.type === "recipe"
                          ? "bg-gray-800 text-white"
                          : item.type === "comment"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-pink-50 text-pink-600"
                      }`}
                    >
                      {item.type === "post" ? (
                        <PenSquare className="w-3 h-3" />
                      ) : item.type === "recipe" ? (
                        <Utensils className="w-3 h-3" />
                      ) : item.type === "comment" ? (
                        <MessageCircle className="w-3 h-3" />
                      ) : (
                        <ThumbsUp className="w-3 h-3" />
                      )}
                      {item.actionLabel}
                    </span>
                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                  </div>

                  {/* 내 아이덴티티 */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white leading-none">{initial}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* 내용 */}
                  {item.type === "like" ? (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-current flex-shrink-0" />
                      <span className="text-xs text-gray-700 font-medium line-clamp-1">
                        {item.targetTitle}
                      </span>
                    </div>
                  ) : (
                    <>
                      {item.targetTitle && (
                        <p className="text-[10px] text-gray-500 mb-1 line-clamp-1">
                          ↳ {item.targetTitle}
                        </p>
                      )}
                      <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </>
                  )}

                  {/* 통계 (게시글 + 레시피) */}
                  {(item.type === "post" || item.type === "recipe") && (
                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{item.comments}</span>
                      </div>
                      <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">
                        자세히 보기
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}

                  {/* 댓글/좋아요는 게시글 보러가기 안내 */}
                  {(item.type === "comment" || item.type === "like") && (
                    <div className="flex items-center justify-end mt-2">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        게시글 보러가기
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 기타 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SectionLabel>기타</SectionLabel>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {!isBrewery && (
              <MenuItem
                icon={<ShieldCheck className="w-4 h-4 text-gray-500" />}
                title="양조장 인증"
                onClick={() => navigate("/brewery/verify")}
              />
            )}
            <MenuItem
              icon={<Megaphone className="w-4 h-4 text-gray-500" />}
              title="공지사항"
              onClick={() => navigate("/announcements")}
            />
            <MenuItem
              icon={<HelpCircle className="w-4 h-4 text-gray-500" />}
              title="고객센터"
              onClick={() => setShowSupportPanel(true)}
            />
            <MenuItem
              icon={<Scroll className="w-4 h-4 text-gray-500" />}
              title="약관 및 정책"
              onClick={() => navigate("/terms")}
            />
            <MenuItem
              icon={<LogOut className="w-4 h-4 text-gray-400" />}
              title="로그아웃"
              onClick={handleLogout}
              isLast
              danger
            />
          </div>
        </motion.div>
      </section>

      {/* 고객센터 바텀시트 — 오버레이는 430px 컨테이너에만 */}
      <AnimatePresence>
        {showSupportPanel && (
          <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex flex-col justify-end">
            {/* 어두운 배경 — 컨테이너 안에만 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowSupportPanel(false)}
            />
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="relative w-full bg-white rounded-t-3xl z-10 overflow-y-auto max-h-[85vh] pb-[calc(80px+env(safe-area-inset-bottom,0px))]"
            >
              <div className="px-6 pt-4 pb-0">
                {/* 드래그 핸들 */}
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">고객센터</h3>
                  <button
                    onClick={() => setShowSupportPanel(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* 안내 문구 */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  간단한 문의는 아래 입력창을 이용해 주세요.
                  <br />
                  자세한 사항은 아래 이메일로 직접 연락해 주시면 빠르게 답변드립니다.
                </p>

                {/* 이메일 박스 */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">이메일 문의 (권장)</p>
                    <p className="text-sm font-bold text-gray-900">support@juddam.com</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">평일 10:00 – 18:00 순차 응답</p>
                  </div>
                </div>

                {/* FAQ — 클릭 가능한 아코디언 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-800">자주 묻는 질문</p>
                    <button
                      onClick={() => {
                        setShowSupportPanel(false);
                        navigate("/faq");
                      }}
                      className="text-xs text-gray-500 hover:text-gray-900 underline transition-colors"
                    >
                      전체 보기
                    </button>
                  </div>
                  <div className="space-y-2">
                    {FAQ_ITEMS.map((faq) => (
                      <div key={faq.id} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-700 text-xs mt-0.5 flex-shrink-0 font-bold">Q.</span>
                          <p className="text-xs text-gray-900 font-medium flex-1">{faq.q}</p>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                                <div className="flex gap-2">
                                  <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0 font-bold">A.</span>
                                  <p className="text-xs text-gray-800 leading-relaxed">{faq.a}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 간단 문의 입력 */}
                <textarea
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="간단한 문의 내용을 입력해주세요..."
                  className="w-full h-24 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  onClick={() => {
                    if (supportMsg.trim()) {
                      toast.success("문의가 접수되었습니다. support@juddam.com 으로 답변드릴게요!");
                      setSupportMsg("");
                      setShowSupportPanel(false);
                    } else {
                      toast.error("문의 내용을 입력해주세요");
                    }
                  }}
                  className="w-full mt-3 mb-4 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  문의 보내기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SectionLabel
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
      {children}
    </h2>
  );
}

// InfoRow
function InfoRow({
  icon,
  label,
  children,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${!last ? "border-b border-gray-50" : ""}`}
    >
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">{label}</p>
        <div className="truncate">{children}</div>
      </div>
    </div>
  );
}

// MenuItem
function MenuItem({
  icon,
  title,
  onClick,
  isLast,
  danger,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  isLast?: boolean;
  danger?: boolean;
  subtitle?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
        !isLast ? "border-b border-gray-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-sm font-medium ${danger ? "text-red-500" : "text-gray-900"}`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-[10px] text-gray-500 ml-1">{subtitle}</span>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}