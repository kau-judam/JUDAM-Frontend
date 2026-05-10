import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, MessageSquare, Heart, PenSquare } from "lucide-react";
import { useCommunity } from "../contexts/CommunityContext";

export function MyPostsPage() {
  const navigate = useNavigate();
  const { posts } = useCommunity();

  // 실제 커뮤니티 게시글에서 최근 3개 표시
  const myPosts = posts.slice(0, 3);

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
          <h1 className="text-lg font-bold text-gray-900">작성 게시글</h1>
        </div>
      </div>

      <div className="pt-[72px] px-5 py-5 space-y-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-2xl p-5 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <PenSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-white/70">주담 커뮤니티 활동</p>
            <p className="font-bold">최근 작성된 게시글 {myPosts.length}개</p>
          </div>
        </motion.div>

        {/* Post List */}
        <div className="space-y-3">
          {myPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/community/post/${post.id}`)}
            >
              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{post.author}</p>
                  <p className="text-[10px] text-gray-500">{post.timestamp}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-800 leading-relaxed mb-3 line-clamp-3 whitespace-pre-line">
                {post.content}
              </p>

              {/* Image preview */}
              {post.image && (
                <div className="mb-3 rounded-xl overflow-hidden h-32">
                  <img
                    src={post.image}
                    alt="게시글 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  {post.comments}
                </span>
              </div>
            </motion.div>
          ))}

          {myPosts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <PenSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">아직 게시글이 없습니다</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 pt-2">
          주담 탭의 최근 게시글 3개를 표시합니다
        </p>
      </div>
    </div>
  );
}
