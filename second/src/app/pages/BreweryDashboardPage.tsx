import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  TrendingUp,
  Users,
  Bell,
  AlertCircle,
  Clock,
  CheckCircle,
  ChevronRight,
  Heart,
  MessageCircle,
  Wine,
  Package,
  Droplets,
  Factory,
  FileCheck,
  Target,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { useMemo, useState, useRef, useEffect } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { toast } from "sonner";
import { useFunding } from "../contexts/FundingContext";
import { ProjectStatus } from "../data/fundingData";

// Mock Data
const summaryStats = {
  activeFundings: 3,
  pendingRecipes: 8,
  newNotifications: 5,
  totalBackers: 847,
};

const trendingRecipes = [
  {
    id: 1,
    title: "여름밤의 복숭아 막걸리",
    author: "술마시는개발자",
    likes: 234,
    comments: 45,
    tags: ["막걸리", "과일주"],
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "신규",
  },
  {
    id: 2,
    title: "제주 한라봉 소주",
    author: "전통주러버",
    likes: 189,
    comments: 32,
    tags: ["소주", "제주"],
    image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "신규",
  },
  {
    id: 3,
    title: "전통 누룩 막걸리",
    author: "주담마스터",
    likes: 156,
    comments: 28,
    tags: ["막걸리", "전통"],
    image: "https://images.unsplash.com/photo-1697862469018-0fa7c93a8d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    status: "인기",
  },
];

const activeFundings = [
  {
    id: 1,
    title: "벚꽃 막걸리",
    description: "봄을 담은 벚꽃향이 가득한 프리미엄 막걸리",
    progress: 87,
    supporters: 156,
    dday: 12,
    goalAmount: "5,000,000",
    currentAmount: "4,350,000",
    image: "https://images.unsplash.com/photo-1697862469018-0fa7c93a8d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 2,
    title: "전통 누룩 막걸리",
    description: "100% 전통 누룩으로 빚은 깊은 맛의 막걸리",
    progress: 64,
    supporters: 98,
    dday: 8,
    goalAmount: "3,000,000",
    currentAmount: "1,920,000",
    image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 3,
    title: "제주 한라봉 소주",
    description: "제주 한라봉의 상큼함이 살아있는 증류식 소주",
    progress: 45,
    supporters: 67,
    dday: 15,
    goalAmount: "7,000,000",
    currentAmount: "3,150,000",
    image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 4,
    title: "산사 막걸리",
    description: "산사나무 열매로 빚은 건강한 막걸리",
    progress: 112,
    supporters: 178,
    dday: 0,
    goalAmount: "4,000,000",
    currentAmount: "4,500,000",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 5,
    title: "한라봉 소주 특별판",
    description: "제주 한라봉으로 만든 프리미엄 소주",
    progress: 117,
    supporters: 234,
    dday: 0,
    goalAmount: "7,000,000",
    currentAmount: "8,200,000",
    image: "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

const productionStages = [
  {
    id: 1,
    project: "벚꽃 막걸리",
    stage: "발효",
    progress: 60,
    status: "진행중",
    nextUpdate: "2일 후",
    daysElapsed: 12,
    totalDays: 20,
  },
  {
    id: 2,
    project: "한라봉 소주",
    stage: "증류",
    progress: 80,
    status: "진행중",
    nextUpdate: "내일",
    daysElapsed: 16,
    totalDays: 20,
  },
  {
    id: 3,
    project: "전통 누룩 막걸리",
    stage: "숙성",
    progress: 30,
    status: "진행중",
    nextUpdate: "5일 후",
    daysElapsed: 6,
    totalDays: 20,
  },
];

const recentNotifications = [
  {
    id: 1,
    type: "recipe",
    message: "새로운 레시피 제안이 도착했습니다",
    time: "10분 전",
    unread: true,
  },
  {
    id: 2,
    type: "funding",
    message: "벚꽃 막걸리 펀딩이 85%를 달성했습니다",
    time: "1시간 전",
    unread: true,
  },
  {
    id: 3,
    type: "comment",
    message: "누군가 프로젝트에 댓글을 남겼습니다",
    time: "2시간 전",
    unread: false,
  },
  {
    id: 4,
    type: "system",
    message: "제조 진행 현황이 업데이트되었습니다",
    time: "5시간 전",
    unread: false,
  },
];

const stages = ["원료 투입", "발효", "증류", "숙성", "병입", "출고 준비"];

export function BreweryDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, updateProjectStatus } = useFunding();
  const { toggleFavoriteFunding, isFavoriteFunding } = useFavorites();
  const [fundingFilter, setFundingFilter] = useState<"active" | "completed">("active");
  const [selectedProject, setSelectedProject] = useState<typeof productionStages[0] | null>(null);
  const [selectedStatusProject, setSelectedStatusProject] = useState<number | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const stageScrollRef = useRef<HTMLDivElement>(null);

  // 내 양조장 프로젝트 필터링
  const myProjects = useMemo(() => {
    return projects.filter(p => p.brewery === user?.breweryName);
  }, [projects, user?.breweryName]);

  // 알림 조건 체크
  const hasNotifications = useMemo(() => {
    // 1. 관심 레시피가 200개 이상 좋아요
    const popularRecipes = trendingRecipes.filter(recipe => recipe.likes >= 200);

    // 2. 펀딩이 80% 이상 도달
    const highProgressProjects = myProjects.filter(p => {
      const progress = (p.currentAmount / p.goalAmount) * 100;
      return progress >= 80;
    });

    // 3. QnA 등록 (recentNotifications에서 확인)
    const hasQnA = recentNotifications.some(notif =>
      notif.type === "comment" || notif.type === "recipe"
    );

    return popularRecipes.length > 0 || highProgressProjects.length > 0 || hasQnA || summaryStats.newNotifications > 0;
  }, [myProjects]);

  // 상태 목록
  const statusOptions: ProjectStatus[] = [
    "작성 중",
    "심사 중",
    "심사 반려",
    "펀딩 예정",
    "진행 중",
    "목표 달성",
    "펀딩 성공",
    "펀딩 실패",
    "제작 중",
    "배송 중",
    "완료",
  ];

  // 펀딩 필터링
  const filteredFundings = useMemo(() => {
    const activeStatuses: ProjectStatus[] = ["작성 중", "심사 중", "심사 반려", "펀딩 예정", "진행 중", "목표 달성"];
    const completedStatuses: ProjectStatus[] = ["펀딩 성공", "펀딩 실패", "제작 중", "배송 중", "완료"];

    return fundingFilter === "active"
      ? myProjects.filter(p => activeStatuses.includes(p.status))
      : myProjects.filter(p => completedStatuses.includes(p.status));
  }, [myProjects, fundingFilter]);

  // 단계 변경 핸들러
  const handleStageChange = (newStage: string) => {
    if (!selectedProject) return;
    toast.success(`${selectedProject.project}의 단계가 '${newStage}'로 변경되었습니다.`);
    setSelectedProject(null);
  };

  // 프로젝트 상태 변경 핸들러
  const handleStatusChange = (projectId: number, newStatus: ProjectStatus) => {
    updateProjectStatus(projectId, newStatus);
    toast.success(`프로젝트 상태가 '${newStatus}'로 변경되었습니다.`);
    setSelectedStatusProject(null);
  };

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const scrollContainer = stageScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const cardWidth = scrollContainer.offsetWidth - 32; // padding 제외
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentStageIndex(index);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // ProtectedRoute가 이미 권한 체크를 수행하므로 여기서는 user가 null이 아님을 확신할 수 있음
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-lg font-bold text-black">양조장 대시보드</h1>
          <div className="flex items-center gap-3">
            <Link to="/notifications">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-black" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {/* Section 0: 양조장 기본 정보 */}
        <section className="px-5 py-5 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                양조장 기본 정보
              </h2>
              <p className="text-xs text-gray-500">양조장 정보를 관리하세요</p>
            </div>
          </div>

          <Link to="/brewery/verify">
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Factory className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {user?.breweryName || "양조장 이름"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {user?.breweryLocation || "양조장 위치"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>
        </section>

        {/* Section 1: 내 펀딩 현황 */}
        <section className="px-5 py-5 bg-white">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-0.5">
              내 펀딩 현황
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">진행 중인 프로젝트를 관리하세요</p>
              {/* 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFundingFilter("active")}
                  className={`w-16 h-12 rounded-lg text-xs font-semibold transition-all leading-tight flex items-center justify-center ${
                    fundingFilter === "active"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  진행중인<br />펀딩
                </button>
                <button
                  onClick={() => setFundingFilter("completed")}
                  className={`w-16 h-12 rounded-lg text-xs font-semibold transition-all leading-tight flex items-center justify-center ${
                    fundingFilter === "completed"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  종료된<br />펀딩
                </button>
                <Link to="/brewery/project/terms">
                  <button className="w-16 h-12 bg-gray-900 text-white rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-0.5 hover:bg-black transition-all">
                    <Plus className="w-3 h-3" />
                    새펀딩
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-0.5">
                {filteredFundings.filter(p => ["진행 중", "목표 달성"].includes(p.status)).length}
              </p>
              <p className="text-xs text-gray-500">진행 중</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-0.5">
                {myProjects.reduce((sum, p) => sum + p.backers, 0)}
              </p>
              <p className="text-xs text-gray-500">총 참여자</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <Target className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-0.5">
                {myProjects.length > 0
                  ? Math.round(
                      myProjects.reduce((sum, p) => sum + (p.currentAmount / p.goalAmount) * 100, 0) /
                        myProjects.length
                    )
                  : 0}%
              </p>
              <p className="text-xs text-gray-500">평균 달성률</p>
            </motion.div>
          </div>

          {/* Funding List */}
          <div className="space-y-4">
            {filteredFundings.map((funding, index) => {
              const progressPercentage = Math.min((funding.currentAmount / funding.goalAmount) * 100, 100);
              const formattedCurrentAmount = funding.currentAmount.toLocaleString();

              return (
                <motion.div
                  key={funding.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4">
                    <div className="flex gap-4">
                      {/* 이미지 영역 - 왼쪽 작은 썸네일 */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                        <Link to={`/funding/${funding.id}`}>
                          <img
                            src={funding.image}
                            alt={funding.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        {/* 하트 아이콘 - 왼쪽 하단 */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavoriteFunding(funding.id);
                          }}
                          className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
                        >
                          <Heart
                            className={`w-4 h-4 transition-all ${
                              isFavoriteFunding(funding.id)
                                ? "fill-white text-white"
                                : "text-white"
                            }`}
                          />
                        </button>
                      </div>

                      {/* 콘텐츠 영역 - 오른쪽 */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/funding/${funding.id}`}>
                          <div>
                            {/* 상단: 양조장 이름 & 상태 */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-gray-600">
                                {user?.breweryName || "양조장"}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedStatusProject(funding.id);
                                }}
                                className="ml-auto text-xs px-2 py-0.5 rounded-md font-bold bg-gray-900 text-white hover:bg-black transition-colors"
                              >
                                {funding.status}
                              </button>
                            </div>

                            {/* 프로젝트 제목 */}
                            <h3 className="text-base font-bold text-black mb-3 line-clamp-2 leading-tight">
                              {funding.title}
                            </h3>

                            {/* 진행률과 금액 정보 */}
                            <div className="flex items-end justify-between mb-2">
                              <div>
                                <span className="text-2xl font-bold text-black">
                                  {progressPercentage.toFixed(0)}%
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formattedCurrentAmount}원
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-bold text-black">
                                  D-{funding.daysLeft}
                                </div>
                              </div>
                            </div>

                            {/* 진행률 바 */}
                            <Progress
                              value={progressPercentage}
                              className="h-1.5 bg-gray-100"
                              indicatorClassName="bg-gradient-to-r from-gray-800 to-black"
                            />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Section 2: 내 제조 진행 현황 관리 */}
        <section className="py-6 bg-gray-50">
          <div className="px-5 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                제조 진행 현황
              </h2>
              <p className="text-xs text-gray-500">실시간으로 제조 과정을 관리하세요</p>
            </div>
          </div>

          {/* 가로 스크롤 카드 */}
          <div className="relative mb-8">
            <div
              ref={stageScrollRef}
              className="flex gap-0 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide"
            >
              {productionStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-full snap-center px-2"
                >
                  <div className="bg-gradient-to-br from-[#2B1810] to-[#3d2416] rounded-2xl p-5 text-white h-full flex flex-col">
                    {/* 헤더 */}
                    <div className="mb-4">
                      <h3 className="font-bold text-base mb-1">{stage.project}</h3>
                      <p className="text-xs text-white/60">
                        {stage.daysElapsed}일 / {stage.totalDays}일
                      </p>
                    </div>

                    {/* 현재 단계 */}
                    <div className="flex items-center gap-2 mb-4">
                      <Wine className="w-5 h-5" />
                      <span className="text-sm font-medium">{stage.stage}</span>
                    </div>

                    {/* 진행률 */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-white/70">진행률</span>
                        <span className="font-bold text-base">{stage.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* 업데이트 버튼 */}
                    <button
                      onClick={() => setSelectedProject(stage)}
                      className="mt-auto w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      진행 상황 업데이트
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 페이지 인디케이터 */}
            <div className="flex justify-center gap-2 mt-4">
              {productionStages.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all ${
                    index === currentStageIndex
                      ? "w-6 h-2 bg-gray-900"
                      : "w-2 h-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: 알림 / 보조 정보 */}
        <section className="px-5 py-5 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">
                알림 및 정보
              </h2>
              <p className="text-xs text-gray-500">최근 활동과 중요한 알림</p>
            </div>
            <Link
              to="/notifications"
              className="text-[#8B5A3C] text-sm font-medium flex items-center gap-1"
            >
              전체보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
            {recentNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start gap-3 ${
                  index !== recentNotifications.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } ${notification.unread ? "bg-blue-50" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === "recipe"
                      ? "bg-blue-100"
                      : notification.type === "funding"
                      ? "bg-green-100"
                      : notification.type === "comment"
                      ? "bg-purple-100"
                      : "bg-gray-100"
                  }`}
                >
                  {notification.type === "recipe" ? (
                    <FileCheck className="w-4 h-4 text-blue-600" />
                  ) : notification.type === "funding" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : notification.type === "comment" ? (
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Bell className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-500">새 댓글</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-500">새 좋아요</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Sheet 모달 - 단계 변경 */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/10 z-50"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '430px',
                width: '100%'
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white rounded-t-3xl shadow-2xl"
            >
              {/* 핸들 바 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedProject.project}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      현재: {selectedProject.stage}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* 단계 리스트 */}
              <div className="px-5 py-5 max-h-[50vh] overflow-y-auto">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  제조 단계 선택
                </p>
                <div className="space-y-3">
                  {stages.map((stageName, index) => {
                    const isCurrent = stageName === selectedProject.stage;
                    const currentIndex = stages.indexOf(selectedProject.stage);
                    const isPassed = index < currentIndex;

                    return (
                      <button
                        key={stageName}
                        onClick={() => handleStageChange(stageName)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          isCurrent
                            ? "bg-gray-900 text-white"
                            : isPassed
                            ? "bg-gray-100 text-gray-600"
                            : "bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCurrent
                                  ? "bg-white/20 text-white"
                                  : isPassed
                                  ? "bg-gray-300 text-gray-600"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="font-semibold">{stageName}</span>
                          </div>
                          {isCurrent && (
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              현재
                            </span>
                          )}
                          {isPassed && (
                            <CheckCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 하단 여백 (Safe Area) */}
              <div className="h-10" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Sheet 모달 - 프로젝트 상태 변경 */}
      <AnimatePresence>
        {selectedStatusProject !== null && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStatusProject(null)}
              className="fixed inset-0 bg-black/10 z-50"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '430px',
                width: '100%'
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white rounded-t-3xl shadow-2xl"
            >
              {/* 핸들 바 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* 헤더 */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      프로젝트 상태 변경
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      현재: {projects.find(p => p.id === selectedStatusProject)?.status}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStatusProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* 상태 리스트 */}
              <div className="px-5 py-5 max-h-[60vh] overflow-y-auto">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  상태 선택
                </p>
                <div className="space-y-2">
                  {statusOptions.map((status) => {
                    const currentStatus = projects.find(p => p.id === selectedStatusProject)?.status;
                    const isCurrent = status === currentStatus;

                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedStatusProject, status)}
                        className={`w-full p-3 rounded-lg text-left transition-all text-sm ${
                          isCurrent
                            ? "bg-gray-900 text-white font-semibold"
                            : "bg-white border border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{status}</span>
                          {isCurrent && (
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                              현재
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 하단 여백 (Safe Area) */}
              <div className="h-10" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}