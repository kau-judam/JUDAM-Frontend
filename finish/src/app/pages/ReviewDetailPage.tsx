import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Heart, MessageCircle, Star, Package } from "lucide-react";
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

export function ReviewDetailPage() {
  const navigate = useNavigate();
  const { projectId, reviewId } = useParams();
  const { user } = useAuth();
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(23);

  // Mock review data
  const review = {
    id: Number(reviewId) || 1,
    projectId: Number(projectId) || 1,
    projectTitle: "청사초롱, 청량한 봄의 전통주",
    author: "전통주러버",
    authorType: "user" as const,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    rating: 5,
    rewardName: "얼리버드 2병 세트",
    content: "정말 기대 이상의 전통주였어요! 🍶\n\n청사초롱이라는 이름처럼 정말 청량하고 깔끔한 맛이었습니다. 특히 첫 모금에서 느껴지는 은은한 과일 향이 인상적이었고, 목넘김도 부드러워서 술을 잘 못 마시는 저도 편하게 즐길 수 있었어요.\n\n펀딩에 참여하면서 투표로 맛을 결정하는 과정도 너무 재미있었고, 완성된 술을 받아보니 더욱 애착이 가네요. 양조장님께서 중간중간 양조 과정도 공유해주셔서 기다리는 시간도 즐거웠습니다.\n\n다음 프로젝트도 기대하고 있어요! 강력 추천합니다 👍",
    images: [
      "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop"
    ],
    likes: 23,
    timestamp: "3일 전",
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "청사초롱 양조장",
      authorType: "brewery",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "소중한 후기 남겨주셔서 정말 감사드립니다! 😊 앞으로도 더 좋은 술로 보답하겠습니다.",
      timestamp: "2일 전",
      likes: 5,
      liked: false,
    },
    {
      id: 2,
      author: "막걸리마스터",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: "저도 참여했는데 너무 만족스러웠어요! 다음 프로젝트도 꼭 참여할 예정입니다~",
      timestamp: "2일 전",
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
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/funding/${projectId}`)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">후기</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Review Content */}
      <div className="max-w-2xl mx-auto">
        {/* Project Info Banner */}
        <div className="mx-4 mt-4 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span className="font-medium text-gray-900">{review.projectTitle}</span>
          </div>
        </div>

        {/* Review Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <img
              src={review.avatar}
              alt={review.author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{review.author}</span>
                {review.authorType === "brewery" && (
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                    양조장
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{review.timestamp}</span>
              </div>
            </div>
          </div>
          
          {/* Rating and Reward - Below author info */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
              <Package className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs text-gray-700 font-medium">{review.rewardName}</span>
            </div>
          </div>
        </div>

        {/* Review Body */}
        <div className="px-4 py-4">
          <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap mb-4">
            {review.content}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className={`grid gap-2 mb-4 ${review.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t-8 border-gray-100">
          <div className="px-4 py-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              댓글 {comments.length}
            </h3>

            {/* Comments List */}
            <div className="space-y-4 mb-20">
              {comments.map((comment) => (
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
                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.author}
                        </span>
                        {comment.authorType === "brewery" && (
                          <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded-full">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  className="w-full h-12 bg-white border border-gray-300 rounded-full text-gray-900 placeholder:text-gray-400 text-sm px-5 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
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
                className="h-12 px-6 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                전송
              </button>
            </>
          ) : (
            <div className="flex-1 bg-gray-100 rounded-full h-12 px-5 flex items-center justify-center">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-900 text-sm font-medium"
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