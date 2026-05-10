import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ChevronLeft,
  Calendar,
  Target,
  MessageCircle,
  Star,
  ThumbsUp,
  Send,
  ChevronDown,
  ChevronUp,
  Bell,
  LayoutDashboard,
  Share2,
  AlertTriangle,
  X,
  Check,
  Plus,
  Minus,
  Package,
  FileEdit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useFavorites } from "../contexts/FavoritesContext";
import { useFunding } from "../contexts/FundingContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { JournalStageSection } from "../components/JournalStageSection";
import { BREWING_STAGES } from "../data/fundingData";

// 댓글 타입 정의
interface Comment {
  id: number;
  userName: string;
  content: string;
  date: string;
  likes: number;
  isBrewery: boolean;
  replies: Reply[];
}

interface Reply {
  id: number;
  userName: string;
  content: string;
  date: string;
  likes: number;
  isBrewery: boolean;
}

// 초기 댓글 데이터

// 초기 댓글 데이터
const initialComments: Comment[] = [
  {
    id: 1,
    userName: "김주담",
    content: "정말 기대되는 프로젝트예요! 언제쯤 배송이 가능할까요?",
    date: "2026. 03. 25",
    likes: 12,
    isBrewery: false,
    replies: [
      {
        id: 1,
        userName: "꽃샘양조장",
        content:
          "안녕하세요! 펀딩 마감 후 약 45일 이내에 배송 예정입니다. 감사합니다!",
        date: "2026. 03. 25",
        likes: 8,
        isBrewery: true,
      },
    ],
  },
  {
    id: 2,
    userName: "이술사",
    content: "알코올 도수가 궁금합니다. 혹시 알려주실 수 있나요?",
    date: "2026. 03. 24",
    likes: 5,
    isBrewery: false,
    replies: [],
  },
];

// 후기 데이터 (추후 백엔드 연동)
const reviewsData: Array<{
  id: number;
  projectId: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}> = [];

export function FundingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleFavoriteFunding, isFavoriteFunding } = useFavorites();
  const { projects, updateProjectJournals } = useFunding();
  const { user } = useAuth();

  // URL 쿼리 파라미터에서 초기 탭 상태 가져오기
  const initialTab = searchParams.get("tab") === "journal" ? "양조일지" : "소개";
  const [activeTab, setActiveTab] = useState<
    "소개" | "양조일지" | "Q&A" | "후기"
  >(initialTab);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: "소개" | "양조일지" | "Q&A" | "후기") => {
    setActiveTab(tab);
    // 탭에 따라 URL 쿼리 파라미터 업데이트
    const tabParam = tab === "양조일지" ? "journal" : tab === "Q&A" ? "qna" : tab === "후기" ? "review" : "intro";
    setSearchParams({ tab: tabParam });
  };

  // 주담 펀딩 안내 모달 상태
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);

  // 공유하기 모달
  const [showShareModal, setShowShareModal] = useState(false);

  // 신고하기 모달
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");

  // 펀딩 옵션 모달
  const [showFundingOptionModal, setShowFundingOptionModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // 로그인 필요 모달
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  // 커뮤니티 상태 관리
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set([1])
  );

  // 양조일지 좋아요 상태
  const [likedJournals, setLikedJournals] = useState<Set<number>>(new Set());
  const [likedJournalComments, setLikedJournalComments] = useState<Set<number>>(new Set());

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            프로젝트를 찾을 수 없습니다
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            요청하신 프로젝트가 존재하지 않거나<br />
            삭제되었을 수 있습니다.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-gray-900"
            >
              다시 시도
            </Button>
            <Button
              onClick={() => navigate("/funding")}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white"
            >
              펀딩 목록으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    (project.currentAmount / project.goalAmount) * 100,
    100
  );

  const isFavorite = isFavoriteFunding(project.id);

  // 추천 프로젝트 (현재 프로젝트 제외)
  const recommendedProjects = projects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  // 양조일지 좋아요 핸들러
  const handleLikeJournal = (journalId: number) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    const updatedJournals = (project.journals || []).map((j) =>
      j.id === journalId
        ? { ...j, likes: likedJournals.has(journalId) ? (j.likes || 0) - 1 : (j.likes || 0) + 1 }
        : j
    );

    updateProjectJournals(project.id, updatedJournals);

    setLikedJournals((prev) => {
      const next = new Set(prev);
      if (next.has(journalId)) {
        next.delete(journalId);
      } else {
        next.add(journalId);
      }
      return next;
    });
  };

  // 양조일지 댓글 추가 핸들러
  const handleAddJournalComment = (journalId: number, content: string) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const updatedJournals = (project.journals || []).map((j) => {
      if (j.id === journalId) {
        const existingComments = j.comments || [];
        const newComment = {
          id: Math.max(0, ...existingComments.map((c) => c.id)) + 1,
          journalId,
          userName: user.name || "사용자",
          content,
          date: dateStr,
          likes: 0,
          replies: [],
        };
        return { ...j, comments: [...existingComments, newComment] };
      }
      return j;
    });

    updateProjectJournals(project.id, updatedJournals);
    toast.success("댓글이 등록되었습니다");
  };

  // 양조일지 댓글 좋아요 핸들러
  const handleLikeJournalComment = (journalId: number, commentId: number) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    const updatedJournals = (project.journals || []).map((j) => {
      if (j.id === journalId) {
        const updatedComments = (j.comments || []).map((c) =>
          c.id === commentId
            ? { ...c, likes: likedJournalComments.has(commentId) ? (c.likes || 0) - 1 : (c.likes || 0) + 1 }
            : c
        );
        return { ...j, comments: updatedComments };
      }
      return j;
    });

    updateProjectJournals(project.id, updatedJournals);

    setLikedJournalComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  // 양조일지 대댓글 추가 핸들러
  const handleAddJournalReply = (journalId: number, commentId: number, content: string) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const updatedJournals = (project.journals || []).map((j) => {
      if (j.id === journalId) {
        const updatedComments = (j.comments || []).map((c) => {
          if (c.id === commentId) {
            const existingReplies = c.replies || [];
            const newReply = {
              id: Math.max(0, ...existingReplies.map((r) => r.id)) + 1,
              commentId,
              userName: user.name || "사용자",
              content,
              date: dateStr,
              likes: 0,
            };
            return { ...c, replies: [...existingReplies, newReply] };
          }
          return c;
        });
        return { ...j, comments: updatedComments };
      }
      return j;
    });

    updateProjectJournals(project.id, updatedJournals);
    toast.success("답글이 등록되었습니다");
  };

  // 댓글 추가 함수
  const handleAddComment = () => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      userName: user.name || "나",
      content: newComment.trim(),
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ". "),
      likes: 0,
      isBrewery: user.type === "brewery",
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  // 대댓글 추가 함수
  const handleAddReply = (commentId: number) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now(),
      userName: user.name || "나",
      content: replyContent.trim(),
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ". "),
      likes: 0,
      isBrewery: user.type === "brewery",
    };

    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );

    setReplyContent("");
    setReplyingTo(null);
    setExpandedComments(new Set([...expandedComments, commentId]));
  };

  // 댓글 좋아요 토글
  const toggleCommentLike = (commentId: number) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }
    const newLikedComments = new Set(likedComments);
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes - 1 } : c
        )
      );
    } else {
      newLikedComments.add(commentId);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    }
    setLikedComments(newLikedComments);
  };

  // 대댓글 좋아요 토글
  const toggleReplyLike = (commentId: number, replyId: number) => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }
    const uniqueId = commentId * 10000 + replyId;
    const newLikedReplies = new Set(likedReplies);

    if (newLikedReplies.has(uniqueId)) {
      newLikedReplies.delete(uniqueId);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === replyId ? { ...r, likes: r.likes - 1 } : r
                ),
              }
            : c
        )
      );
    } else {
      newLikedReplies.add(uniqueId);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === replyId ? { ...r, likes: r.likes + 1 } : r
                ),
              }
            : c
        )
      );
    }
    setLikedReplies(newLikedReplies);
  };

  // 댓글 펼치기/접기
  const toggleExpandComment = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified === true;

  // 공유하기 핸들러
  const handleShare = () => {
    const url = window.location.href;

    // textarea를 이용한 fallback 방식
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success("링크가 복사되었습니다!");
        setShowShareModal(false);
      } else {
        throw new Error('Copy failed');
      }
    } catch (error) {
      // navigator.clipboard API 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => {
            toast.success("링크가 복사되었습니다!");
            setShowShareModal(false);
          })
          .catch(() => {
            toast.error("링크 복사에 실패했습니다.");
          });
      } else {
        toast.error("링크 복사에 실패했습니다.");
      }
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // 신고하기 핸들러
  const handleReport = () => {
    if (!user) {
      setShowReportModal(false);
      setShowLoginRequiredModal(true);
      return;
    }
    if (!reportReason) {
      toast.error("신고 사유를 선택해주세요.");
      return;
    }
    console.log("프로젝트 신고:", {
      projectId: project.id,
      reason: reportReason,
      detail: reportDetail,
    });
    toast.success("신고가 접수되었습니다. 검토 후 조치하겠습니다.");
    setShowReportModal(false);
    setReportReason("");
    setReportDetail("");
  };

  // 후원하기 버튼 핸들러
  const handleSupportClick = () => {
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }
    setShowFundingOptionModal(true);
  };

  // 펀딩 옵션 확인 핸들러
  const handleConfirmFunding = () => {
    setShowFundingOptionModal(false);
    navigate(`/funding/${project.id}/support`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* 헤더 */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: 뒤로가기 + 타이틀 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-lg font-bold text-black">펀딩</h1>
          </div>

          {/* Right: 아이콘들 */}
          <div className="flex items-center gap-4">
            {isBrewery && (
              <Link to="/brewery/dashboard">
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-black" />
                </button>
              </Link>
            )}
            {isBrewery && (
              <Link to="/notifications">
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5 text-black" />
                </button>
              </Link>
            )}
            <Link to="/ai-chat">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5 text-black" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 이미지 - 강조 적게 */}
      <section className="relative w-full h-64 bg-gray-200 mt-[52px]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </section>

      {/* 콘텐츠 영역 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* 제목과 한줄 소개 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 leading-tight">
            {project.title}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {project.shortDescription}
          </p>
        </motion.div>

        {/* 펀딩 진행 현황 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                {progressPercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">달성률</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-2xl font-bold text-black">
                {(project.currentAmount / 10000).toLocaleString()}
                <span className="text-base">만원</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">모인금액</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{project.backers}</p>
              <p className="text-xs text-gray-500 mt-1">후원자</p>
            </div>
          </div>

          <Progress
            value={progressPercentage}
            className="h-2 bg-gray-100 mb-4"
            indicatorClassName="bg-gradient-to-r from-gray-800 to-black"
          />

          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">
                {project.status === "진행 중"
                  ? `${project.daysLeft}일 남음`
                  : "펀딩 종료"}
              </span>
            </div>
            <span className="text-xs text-gray-400 pl-5">
              {project.startDate} ~ {project.endDate}
            </span>
          </div>
        </motion.div>

        {/* 양조장 프로필 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(`/brewery/${project.id}`)}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all w-full"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              {project.breweryLogo}
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-black">{project.brewery}</p>
              <p className="text-xs text-gray-500">{project.location}</p>
            </div>
            <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold">
              {project.category}
            </span>
          </button>
        </motion.div>

        {/* 양조일지 관리 버튼 (프로젝트 소유 양조장만) */}
        {user?.type === "brewery" && user?.breweryName === project.brewery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(`/brewery/project/${project.id}/journal`)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white rounded-2xl font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              <FileEdit className="w-4 h-4" />
              <span>양조일지 관리</span>
            </button>
          </motion.div>
        )}

        {/* 탭 네비게이션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky top-[52px] z-40 bg-gray-50 mb-6"
        >
          <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-gray-200">
            {(["소개", "양조일지", "Q&A", "후기"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm ${
                  activeTab === tab
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 탭 콘텐츠 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          {activeTab === "소개" && (
            <div className="space-y-6">
              {/* 프로젝트 소개 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-black mb-4">
                  프로젝트 소개
                </h2>
                
                {/* 재료 및 도수 정보 */}
                <div className="mb-6 grid grid-cols-1 gap-3">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">메인재료</p>
                        <p className="text-sm font-semibold text-black">{project.mainIngredients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">서브재료</p>
                        <p className="text-sm font-semibold text-black">{project.subIngredients}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">도수</p>
                        <p className="text-sm font-semibold text-black">{project.alcoholContent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">예상 배송일</p>
                        <p className="text-sm font-semibold text-black">{project.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 프로젝트 요약 */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">📝 프로젝트 요약</h3>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    봄철 벚꽃이 만개할 때 수확한 식용 벚꽃잎을 활용하여, 전통 누룩 발효 방식으로 빚어내는 계절 한정 막걸리입니다. 
                    벚꽃의 은은한 향과 자연스러운 색감이 더해져 봄의 낭만을 한 병에 담았습니다.
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                  <p>
                    {project.title}는 전통 방식을 고수하면서도 현대적인 감각을
                    더한 특별한 프로젝트입니다.
                  </p>
                  <p>
                    우리 양조장은 3대째 이어온 전통 누룩 제조 기술을 바탕으로,
                    여러분과 함께 새로운 맛을 창조하고자 합니다. 
                    봄의 청량한 기운과 벚꽃의 은은한 향을 담아, 전통주의 새로운 매력을 선사합니다.
                  </p>
                </div>
              </div>

              {/* 가격 안내 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-black mb-6">
                  가격 안내
                </h2>
                <div className="space-y-3">
                  {/* 병당 단가 */}
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                    <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                    <div className="p-5 pl-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1.5">병당 단가</p>
                          <p className="text-3xl font-bold text-black tracking-tight">{project.pricePerBottle.toLocaleString()}<span className="text-xl ml-0.5">원</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{project.bottleSize}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 총 판매 수량 */}
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                    <div className="p-5 pl-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1.5">총 판매 수량</p>
                          <p className="text-3xl font-bold text-black tracking-tight">{project.targetQuantity}<span className="text-xl ml-0.5">병</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">목표 수량</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 목표 금액 */}
                  <div className="mt-4 p-4 bg-gray-900 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-300">펀딩 목표 금액</p>
                      <p className="text-lg font-bold text-white">{(project.targetQuantity * project.pricePerBottle).toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 프로젝트 예산 */}
              {project.budget && project.budget.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-black mb-4">
                    프로젝트 예산
                  </h2>
                  <div className="space-y-3">
                    {project.budget.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between py-2 ${index < project.budget.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <span className="text-gray-700">{item.item}</span>
                        <span className="font-semibold text-black">{item.amount}만원</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
                      <span className="font-bold text-black">총 목표 금액</span>
                      <span className="text-lg font-bold text-black">
                        {project.budget.reduce((sum, item) => sum + item.amount, 0)}만원
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                    목표 금액을 초과 달성하는 경우, 추가 금액은 리워드 품질 향상과
                    더 많은 후원자 분들께 제품을 전달하는 데 사용됩니다.
                  </p>
                </div>
              )}

              {/* 프로젝트 일정 */}
              {project.schedule && project.schedule.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-black mb-4">
                    프로젝트 일정
                  </h2>
                  <div className="space-y-4">
                    {project.schedule.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 flex-shrink-0 text-sm font-semibold text-gray-900">
                          {item.date}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${index === project.schedule.length - 1 ? 'font-bold text-black' : 'text-gray-700'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-900 leading-relaxed">
                      💡 발효는 자연 과정이므로 기후 조건에 따라 일정이 1-2주 지연될 수 있습니다.
                      지연 시 양조 일지와 커뮤니티를 통해 실시간으로 소통하겠습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 맛 지표 */}
              {project.tasteProfile && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-black mb-4">
                  맛 지표
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  양조장이 예상하는 이 전통주의 맛 프로필입니다.
                </p>
                
                {/* 레이더 차트 */}
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-sm">
                    <svg viewBox="0 0 400 400" className="w-full h-auto">
                      {/* 배경 오각형 그리드 */}
                      {[1, 0.75, 0.5, 0.25].map((scale) => (
                        <polygon
                          key={scale}
                          points={[
                            [200, 200 - 150 * scale],
                            [200 + 142.5 * scale, 200 - 46.35 * scale],
                            [200 + 88.1 * scale, 200 + 121.35 * scale],
                            [200 - 88.1 * scale, 200 + 121.35 * scale],
                            [200 - 142.5 * scale, 200 - 46.35 * scale],
                          ].map(p => p.join(',')).join(' ')}
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* 축선 */}
                      {[
                        [200, 50],
                        [342.5, 153.65],
                        [288.1, 321.35],
                        [111.9, 321.35],
                        [57.5, 153.65],
                      ].map((point, i) => (
                        <line
                          key={i}
                          x1="200"
                          y1="200"
                          x2={point[0]}
                          y2={point[1]}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}

                      {/* 데이터 폴리곤 */}
                      <polygon
                        points={[
                          [200, 200 - (project.tasteProfile.sweetness / 100) * 150],
                          [200 + (project.tasteProfile.aroma / 100) * 142.5, 200 - (project.tasteProfile.aroma / 100) * 46.35],
                          [200 + (project.tasteProfile.acidity / 100) * 88.1, 200 + (project.tasteProfile.acidity / 100) * 121.35],
                          [200 - (project.tasteProfile.body / 100) * 88.1, 200 + (project.tasteProfile.body / 100) * 121.35],
                          [200 - (project.tasteProfile.carbonation / 100) * 142.5, 200 - (project.tasteProfile.carbonation / 100) * 46.35],
                        ].map(p => p.join(',')).join(' ')}
                        fill="rgba(0, 0, 0, 0.2)"
                        stroke="rgba(0, 0, 0, 0.8)"
                        strokeWidth="2"
                      />

                      {/* 데이터 포인트 */}
                      {[
                        { x: 200, y: 200 - (project.tasteProfile.sweetness / 100) * 150 },
                        { x: 200 + (project.tasteProfile.aroma / 100) * 142.5, y: 200 - (project.tasteProfile.aroma / 100) * 46.35 },
                        { x: 200 + (project.tasteProfile.acidity / 100) * 88.1, y: 200 + (project.tasteProfile.acidity / 100) * 121.35 },
                        { x: 200 - (project.tasteProfile.body / 100) * 88.1, y: 200 + (project.tasteProfile.body / 100) * 121.35 },
                        { x: 200 - (project.tasteProfile.carbonation / 100) * 142.5, y: 200 - (project.tasteProfile.carbonation / 100) * 46.35 },
                      ].map((point, i) => (
                        <circle
                          key={i}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill="black"
                        />
                      ))}

                      {/* 레이블 */}
                      <text x="200" y="35" textAnchor="middle" className="text-xs font-bold" fill="#374151">단맛</text>
                      <text x="360" y="158" textAnchor="start" className="text-xs font-bold" fill="#374151">잔향</text>
                      <text x="295" y="345" textAnchor="start" className="text-xs font-bold" fill="#374151">산미</text>
                      <text x="105" y="345" textAnchor="end" className="text-xs font-bold" fill="#374151">바디감</text>
                      <text x="40" y="158" textAnchor="end" className="text-xs font-bold" fill="#374151">탄산감</text>
                    </svg>
                  </div>
                </div>

                {/* 맛 지표 수치 */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "단맛", value: project.tasteProfile.sweetness },
                    { label: "잔향", value: project.tasteProfile.aroma },
                    { label: "산미", value: project.tasteProfile.acidity },
                    { label: "바디감", value: project.tasteProfile.body },
                    { label: "탄산감", value: project.tasteProfile.carbonation },
                  ].map((taste) => (
                    <div key={taste.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">{taste.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 rounded-full"
                            style={{ width: `${taste.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-10 text-right">
                          {taste.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* 안내사항 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-black mb-6">
                  안내사항
                </h2>
                
                {/* 크라우드 펀딩에 대한 안내 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-black mb-4">
                    📌 주담 크라우드 펀딩 안내
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        <span className="font-bold text-black">후원은 '공동 기획'의 시작입니다</span>
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 
                        여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 
                        지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 
                        청약철회(7일 내 환불)가 적용되지 않습니다.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        <span className="font-bold text-black">술은 살아있는 생물입니다</span>
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 
                        기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 
                        전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다.
                      </p>
                    </div>
                  </div>
                  
                  {/* 주담 펀딩 알아보기 링크 */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowFundingGuideModal(true)}
                      className="text-sm text-gray-700 hover:text-black font-medium inline-flex items-center gap-1 hover:underline transition-all"
                    >
                      🍶 주담의 펀딩 알아보기 (안내) →
                    </button>
                  </div>
                </div>

                {/* 프로젝트 정책 */}
                <div className="mb-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-black mb-4">
                    📄 프로젝트 정책
                  </h3>
                  
                  <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="mb-3">
                        <span className="font-semibold text-black">환불:</span> 프로젝트 마감 후 즉시 양조 공정이 시작되므로 단순 변심 환불은 불가합니다. 단, 양조장의 사정으로 생산이 불가능해질 경우 100% 환불을 보장합니다.
                      </p>
                      <p className="mb-3">
                        <span className="font-semibold text-black">교환/AS:</span> 주류 배송 특성상 파손된 상태로 수령 시, 사진과 함께 접수해주시면 즉시 새 제품으로 교환해 드립니다.
                      </p>
                      <p>
                        <span className="font-semibold text-black">성인인증:</span> 본 프로젝트는 성인인증을 완료한 후원자만 참여 가능하며, 배송 시 대리 수령이 제한될 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 예상되는 어려움 */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-black mb-4">
                    ⚠️ 예상되는 어려움
                  </h3>
                  
                  <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="mb-3">
                        <span className="font-semibold text-black">품질 변동:</span> AI 검토와 전문가의 관리를 거치나, 기온 변화에 따라 도수나 당도가 기획안과 ±1~2% 정도 차이가 날 수 있습니다.
                      </p>
                      <p>
                        <span className="font-semibold text-black">일정 지연:</span> 술이 충분히 익지 않았을 경��, 최상의 맛을 위해 출고가 최대 10일 정도 지연될 수 있으며 이 경우 커뮤니티를 통해 즉시 공지하겠습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "양조일지" && (
            <div className="space-y-4">
              {BREWING_STAGES.map((stage) => (
                <JournalStageSection
                  key={stage.id}
                  stageId={stage.id}
                  stageName={stage.name}
                  journals={project.journals || []}
                  onLikeJournal={handleLikeJournal}
                  onAddComment={handleAddJournalComment}
                  onLikeComment={handleLikeJournalComment}
                  onAddReply={handleAddJournalReply}
                  isJournalLiked={(journalId) => likedJournals.has(journalId)}
                  isCommentLiked={(commentId) => likedJournalComments.has(commentId)}
                />
              ))}
            </div>
          )}

          {activeTab === "Q&A" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-6">Q&A</h2>

              {/* 댓글 입력 폼 */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm bg-white"
                  />
                  <button
                    onClick={handleAddComment}
                    className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      {/* 댓글 헤더 */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {comment.userName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-black">
                              {comment.userName}
                            </span>
                            {comment.isBrewery && (
                              <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full">
                                양조장
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {/* 댓글 액션 */}
                      <div className="flex items-center gap-4 ml-13">
                        <button
                          onClick={() => toggleCommentLike(comment.id)}
                          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                        >
                          <ThumbsUp
                            className={`w-4 h-4 transition-all ${
                              likedComments.has(comment.id)
                                ? "fill-blue-500 text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              likedComments.has(comment.id)
                                ? "text-blue-500 font-semibold"
                                : "text-gray-500"
                            }`}
                          >
                            {comment.likes}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id
                            )
                          }
                          className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">답글</span>
                        </button>

                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleExpandComment(comment.id)}
                            className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                          >
                            {expandedComments.has(comment.id) ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs text-gray-500">
                              {comment.replies.length}개 답글
                            </span>
                          </button>
                        )}
                      </div>

                      {/* 대댓글 영역 */}
                      <AnimatePresence>
                        {expandedComments.has(comment.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 ml-13 space-y-3 border-l-2 border-gray-200 pl-4"
                          >
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {reply.userName[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-sm text-black whitespace-nowrap">
                                      {reply.userName}
                                    </span>
                                    {reply.isBrewery && (
                                      <span className="px-2 py-0.5 bg-black text-white text-xs rounded-full whitespace-nowrap flex-shrink-0">
                                        양조장
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                      {reply.date}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                    {reply.content}
                                  </p>

                                  {/* 대댓글 좋아요 */}
                                  <button
                                    onClick={() =>
                                      toggleReplyLike(comment.id, reply.id)
                                    }
                                    className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                                  >
                                    <ThumbsUp
                                      className={`w-3 h-3 transition-all ${
                                        likedReplies.has(
                                          comment.id * 10000 + reply.id
                                        )
                                          ? "fill-blue-500 text-blue-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span
                                      className={`text-xs ${
                                        likedReplies.has(
                                          comment.id * 10000 + reply.id
                                        )
                                          ? "text-blue-500 font-semibold"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {reply.likes}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 대댓글 입력 폼 */}
                      <AnimatePresence>
                        {replyingTo === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 ml-13"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter")
                                    handleAddReply(comment.id);
                                }}
                                placeholder="답글을 입력하세요..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm bg-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {comments.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      첫 번째 댓글을 남겨보세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "후기" && (() => {
            const projectReviews = reviewsData.filter(r => r.projectId === Number(id));
            return (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">
                    후원자 후기
                  </h2>
                  {project.status !== "진행 중" && (
                    <span className="text-sm text-gray-500">
                      {projectReviews.length}개
                    </span>
                  )}
                </div>

                {project.status === "진행 중" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      펀딩이 진행중입니다!
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      펀딩이 완료되면 후기를 확인할 수 있어요
                    </p>
                  </div>
                ) : projectReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-dashed border-gray-200">
                      <Star className="w-9 h-9 text-gray-300" />
                    </div>
                    <p className="text-gray-700 font-bold text-lg mb-2">
                      아직 후기가 없어요
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      이 술을 마셔본 첫 번째 후기를<br />남겨주세요! 다른 분들에게 큰 도움이 돼요 🍶
                    </p>
                    <button
                      onClick={() => navigate(`/archive/review/${id}`)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      첫 번째 후기 작성하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectReviews.map((review) => (
                      <button
                        key={review.id}
                        onClick={() => navigate(`/funding/${id}/review/${review.id}`)}
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-sm text-black">
                              {review.userName}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {review.comment}
                        </p>
                      </button>
                    ))}

                    {/* 후기 작성 유도 */}
                    <button
                      onClick={() => navigate(`/archive/review/${id}`)}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
                    >
                      <p className="text-sm text-gray-500 font-medium">
                        ✏️ 나도 후기 작성하기
                      </p>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>

        {/* 공유하기 / 신고하기 버튼 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-all"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">공유하기</span>
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">신고하기</span>
          </button>
        </div>

        {/* 추천 프로젝트 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">
            다른 프로젝트 둘러보기
          </h2>
          <div className="space-y-4">
            {recommendedProjects.map((recProject) => {
              const recProgressPercentage = Math.min(
                (recProject.currentAmount / recProject.goalAmount) * 100,
                100
              );
              const isRecFavorite = isFavoriteFunding(recProject.id);

              return (
                <div
                  key={recProject.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4"
                >
                  <div className="flex gap-4">
                    {/* 이미지 영역 - 왼쪽 작은 썸네일 */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <Link to={`/funding/${recProject.id}`}>
                        <img
                          src={recProject.image}
                          alt={recProject.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      {/* 하트 아이콘 - 왼쪽 하단 */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!user) {
                            setShowLoginRequiredModal(true);
                            return;
                          }
                          toggleFavoriteFunding(recProject.id);
                        }}
                        className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            isRecFavorite
                              ? "fill-white text-white"
                              : "text-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 콘텐츠 영역 - 오른쪽 */}
                    <Link to={`/funding/${recProject.id}`} className="flex-1 min-w-0">
                      <div>
                        {/* 상단: 양조장 이름과 카테고리 */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-600">
                            {recProject.brewery}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold">
                            {recProject.category}
                          </span>
                          <span
                            className={`ml-auto text-xs px-2 py-0.5 rounded-md font-bold ${
                              recProject.status === "진행 중"
                                ? "bg-green-50 text-green-700"
                                : recProject.status === "성공"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {recProject.status}
                          </span>
                        </div>

                        {/* 프로젝트 제목 */}
                        <h3 className="text-base font-bold text-black mb-3 line-clamp-2 leading-tight">
                          {recProject.title}
                        </h3>

                        {/* 진행률과 금액 정보 */}
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <span className="text-2xl font-bold text-black">
                              {recProgressPercentage.toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {(recProject.currentAmount / 10000).toLocaleString()}만원
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-black">
                              {recProject.status === "성공" || recProject.status === "실패"
                                ? "펀딩 종료"
                                : `${recProject.daysLeft}일 남음`}
                            </div>
                          </div>
                        </div>

                        {/* 진행률 바 */}
                        <Progress
                          value={recProgressPercentage}
                          className="h-1.5 bg-gray-100"
                          indicatorClassName="bg-gradient-to-r from-gray-800 to-black"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (!user) {
                setShowLoginRequiredModal(true);
                return;
              }
              toggleFavoriteFunding(project.id);
            }}
            variant="outline"
            className="w-14 h-14 p-0 border-2 rounded-2xl bg-[#ffffff] hover:bg-gray-100 flex items-center justify-center shrink-0"
          >
            <Heart
              size={24}
              strokeWidth={2}
              className={`w-6 h-6 transition-all ${isFavorite ? "fill-red-500 text-red-500" : "text-black"}`}
            />
          </Button>
          <Button
            onClick={handleSupportClick}
            className="flex-1 h-14 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold text-base"
            disabled={project.status !== "진행 중"}
          >
            {project.status === "진행 중" ? "프로젝트 후원하기" : "펀딩 종료"}
          </Button>
        </div>
      </div>

      {/* 주담 펀딩 알아보기 모달 */}
      <AnimatePresence>
        {showFundingGuideModal && (
          <>
            {/* 오버레이 - 모바일 크기만 어둡게 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFundingGuideModal(false)}
                className="w-full max-w-[430px] h-full bg-black/50"
              />
            </div>
            
            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-md z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-black">
                      🍶 주담 펀딩 안내
                    </h2>
                    <button
                      onClick={() => setShowFundingGuideModal(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-2xl text-gray-500">×</span>
                    </button>
                  </div>
                </div>

                {/* 내용 */}
                <div className="p-6 space-y-6">
                  {/* 주담 펀딩이란 */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담 펀딩이란 무엇이죠?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      주담 펀딩은 혁신적인 전통주 레시피 아이디어를 가진 <span className="font-bold">개인(기획자)</span>과 
                      이를 실제 술로 빚어낼 수 있는 전문 양조장이 만나, 다수의 후원자와 함께 새로운 우리 술을 
                      탄생시키는 과정입니다.
                    </p>
                  </div>

                  {/* 진행 방식 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담 펀딩은 어떤 방식으로 진행되나요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담 펀딩은 기획자와 양조장, 그리고 후원자가 함께 <span className="font-bold">'세상에 없던 나만의 술'</span>을 
                      완성해 나가는 협업 프로젝트입니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          기획자 및 양조장:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          AI 검토를 거친 레시피를 바탕으로 프로젝트를 개설하여 제조에 필요한 예산을 모금합니다. 
                          펀딩에 성공하면 약속한 전통주를 정성껏 빚어 후원자에게 전달합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          후원자:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          자신의 취향에 맞는 레시피 프로젝트에 후원하며 공동 기획자로 참여합니다. 
                          펀딩 성공 시, 숙성 기간을 거쳐 완성된 나만의 전통주를 리워드로 받아보실 수 있습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          소통의 의무:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          전통주는 발효 식품 특성상 기상 조건이나 효모의 활동에 따라 일정이 지연되거나 
                          풍미가 미세하게 변할 수 있습니다. 양조장은 이러한 변동 사항을 후원자에게 즉시 알리고 
                          성실히 설명할 의무가 있습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-bold text-blue-900 mb-2">
                          결제 안내:
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          펀딩은 목표 금액에 도달했을 때만 성사되며, 목표 미달 시 프로젝트는 무산되고 
                          결제는 진행되지 않습니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 후원이란 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      후원이란 무엇인가요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담에서의 후원은 단순히 만들어진 술을 구매하는 '전자상거래'가 아닙니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          가치의 지지:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          아직 세상에 나오지 않은 전통주 레시피가 실현될 수 있도록 자금을 지원하고 응원하는 일입니다. 
                          그 보답으로 양조 전문가가 완성한 고품질의 전통주를 리워드로 제공받습니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          변수의 수용:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          발효와 숙성이라는 자연의 공정을 거치므로, 안내된 일정보다 조금 늦어지거나 
                          맛의 밸런스가 전문가의 보정 과정에서 일부 조정될 수 있음을 이해해 주셔야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 주담의 역할 */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-black mb-3">
                      주담은 이 과정에서 무엇을 하나요?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      주담은 사용자의 아이디어가 안전하게 제품화될 수 있도록 신뢰의 연결고리 역할을 합니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          AI 레시피 검토:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          실현 불가능하거나 주세법에 어긋나는 레시피를 AI가 1차적으로 필터링하여 
                          안전한 프로젝트만 소개합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-bold text-black mb-2">
                          투명한 공정 공유:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          양조 일지를 통해 원료 입고부터 포장까지의 전 과정을 시각화하여 정보의 격차를 해소합니다.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-bold text-red-900 mb-2">
                          커뮤니티 관리:
                        </p>
                        <p className="text-sm text-red-800 leading-relaxed">
                          이용약관과 전통주 판매 규정을 준수하지 않거나, 후원자와의 소통을 소홀히 하여 
                          피해를 주는 이용자 및 양조장에게는 주의·경고 및 서비스 이용 제한 등의 
                          엄격한 조치를 취하고 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                  <Button
                    onClick={() => setShowFundingGuideModal(false)}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-bold"
                  >
                    확인
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 공유하기 모달 */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">공유하기</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                이 프로젝트를 친구들과 공유해보세요!
              </p>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                링크 복사하기
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 신고하기 모달 */}
      <AnimatePresence>
        {showReportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">프로젝트 신고</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    신고 사유 *
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 bg-white"
                  >
                    <option value="">선택해주세요</option>
                    <option value="fraud">사기 / 허위 정보</option>
                    <option value="inappropriate">부적절한 내용</option>
                    <option value="copyright">저작권 침해</option>
                    <option value="illegal">불법 제품</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    상세 내용
                  </label>
                  <textarea
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    placeholder="신고 사유를 자세히 작성해주세요"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 resize-none h-24"
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-900 leading-relaxed">
                    ⚠️ 허위 신고 시 서비스 이용이 제한될 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleReport}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    신고하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 펀딩 옵션 모달 */}
      <AnimatePresence>
        {showFundingOptionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFundingOptionModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">후원 옵션 선택</h3>
                <button
                  onClick={() => setShowFundingOptionModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* 프로젝트 정보 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{project.brewery}</p>
                      <p className="font-bold text-sm text-black line-clamp-2">{project.title}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-gray-500 mb-0.5">용량</p>
                      <p className="font-semibold text-black">{project.bottleSize}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-gray-500 mb-0.5">도수</p>
                      <p className="font-semibold text-black">{project.alcoholContent}</p>
                    </div>
                  </div>
                </div>

                {/* 수량 선택 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    수량 선택
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{selectedQuantity}</p>
                      <p className="text-xs text-gray-500">병</p>
                    </div>
                    <button
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* 가격 계산 */}
                <div className="bg-gray-900 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">상품 금액</span>
                    <span className="text-white font-semibold">
                      {(project.pricePerBottle * selectedQuantity).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">배송비</span>
                    <span className="text-white font-semibold">2,000원</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">총 결제 금액</span>
                      <span className="text-xl font-bold text-white">
                        {(project.pricePerBottle * selectedQuantity + 2000).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                {/* 예상 배송일 */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900 mb-1">예상 배송일</p>
                      <p className="text-xs text-blue-800">{project.estimatedDelivery} 순차 발송 예정</p>
                    </div>
                  </div>
                </div>

                {/* 확인 버튼 */}
                <button
                  onClick={handleConfirmFunding}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-colors"
                >
                  후원하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 로그인 필요 모달 */}
      <AnimatePresence>
        {showLoginRequiredModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginRequiredModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl z-50 p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">로그인이 필요합니다</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  이 기능을 사용하려면 로그인이 필요합니다.<br />
                  로그인 페이지로 이동하시겠습니까?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginRequiredModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowLoginRequiredModal(false);
                    navigate("/login");
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  로그인하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}