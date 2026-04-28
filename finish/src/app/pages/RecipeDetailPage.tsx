import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Heart, User, Sparkles, Rocket, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  authorType: "user" | "brewery";
}

const INITIAL_COMMENT_COUNT = 3;

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAllComments, setShowAllComments] = useState(false);

  const [recipe, setRecipe] = useState({
    id: Number(id),
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    author: "전통주러버",
    alcoholRange: "6%~8%",
    description: "전통 누룩과 국내산 쌀을 사용한 현대적인 막걸리 레시피입니다. 부드러운 단맛과 은은한 탄산이 특징이에요. 초보자도 쉽게 따라할 수 있도록 구성했습니다.",
    mainIngredients: ["국내산 찹쌀", "전통 누룩", "천연 효모"],
    subIngredients: ["생수", "황설탕"],
    flavorTags: ["달콤함", "부드러움", "탄산감"],
    likes: 89,
    comments: 6,
    timestamp: "2시간 전",
    liked: false,
    image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "막걸리마스터",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      content: "이 레시피 너무 좋아요! 저도 한번 도전해볼게요 🍶",
      timestamp: "1시간 전",
      likes: 5,
      liked: false,
      authorType: "user",
    },
    {
      id: 2,
      author: "술샘양조장",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      content: "좋은 레시피네요. 전통 누룩 선택이 특히 마음에 듭니다. 저희 양조장에서도 검토해보겠습니다!",
      timestamp: "30분 전",
      likes: 12,
      liked: true,
      authorType: "brewery",
    },
    {
      id: 3,
      author: "전통주초보",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: "처음 도전해보려는데, 누룩은 어디서 구하면 좋을까요?",
      timestamp: "20분 전",
      likes: 2,
      liked: false,
      authorType: "user",
    },
    {
      id: 4,
      author: "발효연구가",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "탄산감을 높이려면 발효 온도를 조금 낮게 유지해보세요. 18도 정도가 적당합니다!",
      timestamp: "15분 전",
      likes: 7,
      liked: false,
      authorType: "user",
    },
    {
      id: 5,
      author: "청주러버",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "황설탕 대신 꿀을 써보셨나요? 향이 더 좋아진다는 이야기를 들었는데요.",
      timestamp: "10분 전",
      likes: 3,
      liked: false,
      authorType: "user",
    },
    {
      id: 6,
      author: "한산양조장",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "훌륭한 레시피입니다. 감귤을 추가하면 더욱 상큼한 맛이 날 것 같네요! 저희도 비슷한 시도를 해본 적 있어요.",
      timestamp: "5분 전",
      likes: 9,
      liked: false,
      authorType: "brewery",
    },
  ]);

  const [commentInput, setCommentInput] = useState("");

  const handleLike = () => {
    setRecipe({
      ...recipe,
      liked: !recipe.liked,
      likes: recipe.liked ? recipe.likes - 1 : recipe.likes + 1,
    });
  };

  const handleCommentLike = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: comments.length + 1,
      author: user?.name || "익명",
      avatar: user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      content: commentInput,
      timestamp: "방금 전",
      likes: 0,
      liked: false,
      authorType: "user",
    };
    setComments([...comments, newComment]);
    setCommentInput("");
    setRecipe({ ...recipe, comments: recipe.comments + 1 });
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENT_COUNT;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">레시피 상세</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-14">
        {/* Recipe Image */}
        {recipe.image && (
          <div className="w-full aspect-[4/3] bg-gray-100">
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Recipe Info */}
        <div className="px-4 py-5">

          {/* Author + 좋아요 버튼 (오른쪽으로 이동) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-900">{recipe.author}</span>
                <p className="text-xs text-gray-500">{recipe.timestamp}</p>
              </div>
            </div>
            {/* 좋아요 버튼 - 작성자 프로필 오른쪽 */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                recipe.liked
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-700 hover:text-gray-900"
              }`}
            >
              <Heart className={`w-4 h-4 ${recipe.liked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{recipe.likes}</span>
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
            {recipe.title}
          </h2>

          {/* 지향하는 맛 태그 - 기존 카테고리 위치 */}
          {recipe.flavorTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.flavorTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {recipe.alcoholRange && (
                <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                  {recipe.alcoholRange}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">프로젝트 요약</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>

          {/* Main Ingredients */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-500" />
              메인 재료
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.mainIngredients.map((ingredient, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Sub Ingredients */}
          {recipe.subIngredients.length > 0 && recipe.subIngredients[0] !== "" && (
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">서브 재료</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.subIngredients.map((ingredient, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 펀딩 제안하기 버튼 */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <button
              onClick={() => navigate("/brewery/project/terms")}
              className="w-full h-14 bg-black hover:bg-gray-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 mr-2" />
              이 레시피로 펀딩 제안하기
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              이 레시피를 기반으로 크라우드펀딩 프로젝트를 시작할 수 있습니다
            </p>
          </motion.div>
        </div>

        {/* Comments Section */}
        <div className="border-t-8 border-gray-100">
          <div className="px-4 py-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              댓글 {comments.length}
            </h3>

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
                        <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                        {comment.authorType === "brewery" && (
                          <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">
                            양조장
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{comment.content}</p>
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
