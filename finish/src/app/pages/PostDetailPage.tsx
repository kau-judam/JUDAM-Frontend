import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Heart, MoreVertical, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

// 게시글 ID별 mock 데이터
const mockPosts: Record<number, {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}> = {
  1: {
    id: 1,
    author: "전통주러버",
    authorType: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    content: "처음으로 막걸리 담그기에 도전해봤는데요! 생각보다 어렵지 않았어요 😊\n\n국내산 쌀과 전통 누룩을 사용했고, 발효 과정에서 은은한 쌀 향이 정말 좋았습니다. 10일 정도 발효시킨 후 처음 맛봤을 때의 그 감동이란... 직접 만든 술이라 더 맛있게 느껴지는 것 같아요!\n\n다음에는 감귤을 넣어서 만들어볼 생각입니다. 혹시 과일 막걸리 만들어보신 분 계신가요?",
    image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
    likes: 47,
    comments: 3,
    timestamp: "2시간 전",
    category: "자유게시판",
  },
  2: {
    id: 2,
    author: "술샘양조장",
    authorType: "brewery",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!",
    likes: 127,
    comments: 23,
    timestamp: "5시간 전",
    category: "정보게시판",
  },
};

const INITIAL_COMMENT_COUNT = 3;

export function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(47);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const numericId = Number(postId) || 1;
  const post = mockPosts[numericId] || mockPosts[1];

  // 작성자 여부 판단 (mock: 로그인 사용자 이름과 게시글 작성자 비교)
  const isAuthor = !!user && user.name === post.author;

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    if (!isAuthor) return;
    setShowMenu(false);
    alert("게시글 수정 기능은 준비 중입니다.");
  };

  const handleDelete = () => {
    if (!isAuthor) return;
    setShowMenu(false);
    if (confirm("게시글을 삭제하시겠습니까?")) {
      alert("게시글이 삭제되었습니다.");
      navigate(-1);
    }
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "양조장지기",
      authorType: "brewery",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "첫 도전치고 정말 잘 만드셨네요! 감귤 막걸리는 감귤을 너무 많이 넣으면 쓴맛이 날 수 있으니 조금씩 넣어보시는 걸 추천드려요 👍",
      timestamp: "1시간 전",
      likes: 8,
      liked: false,
    },
    {
      id: 2,
      author: "막걸리마스터",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: "저도 과일 막걸리 여러 번 만들어봤는데 딸기가 제일 맛있더라구요! 다음 시즌에 도전해보세요~",
      timestamp: "45분 전",
      likes: 3,
      liked: false,
    },
    {
      id: 3,
      author: "술BTI초보",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "우와 대단하세요! 저도 도전해보고 싶은데 어디서 누룩을 구매하셨나요?",
      timestamp: "30분 전",
      likes: 1,
      liked: false,
    },
    {
      id: 4,
      author: "전통주팬",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "발효 온도 관리가 핵심이죠! 저는 20도 유지했더니 정말 깔끔하게 나왔어요.",
      timestamp: "20분 전",
      likes: 5,
      liked: false,
    },
    {
      id: 5,
      author: "청주러버",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "감귤 막걸리 만들어봤는데 껍질째 넣으면 향이 훨씬 풍부해요! 한번 시도해보세요 😊",
      timestamp: "10분 전",
      likes: 2,
      liked: false,
    },
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    if (!user) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const newComment: Comment = {
      id: comments.length + 1,
      author: user.name,
      authorType: "user",
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      content: commentInput,
      timestamp: "방금 전",
      likes: 0,
      liked: false,
    };
    setComments([...comments, newComment]);
    setCommentInput("");
  };

  const handleCommentLike = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENT_COUNT;

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Top App Bar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">게시글</h1>

          {/* 3-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[120px]"
              >
                <button
                  onClick={handleEdit}
                  disabled={!isAuthor}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    isAuthor
                      ? "text-gray-900 hover:bg-gray-50"
                      : "text-gray-900 cursor-not-allowed hover:bg-gray-50"
                  }`}
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!isAuthor}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-t border-gray-100 ${
                    isAuthor
                      ? "text-gray-900 hover:bg-gray-50"
                      : "text-gray-900 cursor-not-allowed hover:bg-gray-50"
                  }`}
                >
                  삭제
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Post Content */}
      <div className="pt-14">
        {/* Post Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{post.author}</span>
                {post.authorType === "brewery" && (
                  <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">
                    양조장
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.timestamp}</span>
                <span>•</span>
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  #{post.category}
                </span>
              </div>
            </div>
            {/* 좋아요 버튼 - 작성자 오른쪽 끝 */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                liked
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-700 hover:text-gray-900"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
          </div>
        </div>

        {/* Post Body */}
        <div className="px-4 py-4">
          <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-xl object-cover mb-4"
            />
          )}
          {/* 하단 좋아요·댓글 버튼 제거됨 */}
        </div>

        {/* Comments Section */}
        <div className="border-t-8 border-gray-100">
          <div className="px-4 py-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              댓글 {comments.length}
            </h3>

            {/* Comments List */}
            <div className="space-y-4">
              {visibleComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.author}
                        </span>
                        {comment.authorType === "brewery" && (
                          <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">
                            양조장
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 px-2">
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`text-xs font-medium transition-colors ${
                          comment.liked ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        좋아요 {comment.likes > 0 && comment.likes}
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-900 font-medium">
                        답글
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {hasMoreComments && !showAllComments && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAllComments(true)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              >
                <ChevronDown className="w-4 h-4" />
                댓글 {comments.length - INITIAL_COMMENT_COUNT}개 더보기
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Comment Input (Fixed Bottom) */}
      <div className="fixed bottom-[54px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 px-4 py-3 z-[60]">
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full h-11 bg-white border border-gray-300 rounded-full text-gray-900 placeholder:text-gray-400 text-sm px-5 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleCommentSubmit}
                disabled={!commentInput.trim()}
                className="h-11 px-5 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                등록
              </button>
            </>
          ) : (
            <div className="flex-1 bg-gray-100 rounded-full h-11 px-5 flex items-center justify-center">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 text-sm font-medium"
              >
                로그인하고 댓글 작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}