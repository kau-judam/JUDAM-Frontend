import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Search, X, ChevronDown, Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";

interface Post {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  category: string;
}

const POSTS_PER_PAGE = 6;

export function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("전체");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "전통주러버",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      content: "오늘 처음으로 막걸리 담가봤어요! 국내산 쌀로 만들었는데 생각보다 쉽더라구요. 다들 한번 도전해보세요! 🍶",
      likes: 42,
      comments: 8,
      timestamp: "2시간 전",
      liked: false,
      category: "자유게시판",
    },
    {
      id: 2,
      author: "술샘양조장",
      authorType: "brewery",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!",
      likes: 127,
      comments: 23,
      timestamp: "5시간 전",
      liked: true,
      category: "정보게시판",
    },
    {
      id: 3,
      author: "막걸리마스터",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      content: "장미 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 레시피 공유할게요:\n\n1. 국내산 쌀 2kg\n2. 누룩 200g\n3. 장미꽃잎 100g\n\n발효는 3일 정도 걸렸어요 🌹",
      likes: 89,
      comments: 15,
      timestamp: "어제",
      liked: false,
      category: "정보게시판",
    },
    {
      id: 4,
      author: "청주러버",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      content: "청주 빚을 때 온도 관리가 제일 중요한 것 같아요. 18-20도를 유지하니 훨씬 깔끔한 맛이 나더라구요!",
      likes: 56,
      comments: 12,
      timestamp: "2일 전",
      liked: false,
      category: "정보게시판",
    },
    {
      id: 5,
      author: "소주마니아",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      content: "집에서 증류식 소주 만드는 법 궁금하신 분 계신가요? 초보자도 할 수 있는 간단한 방법 알려드려요!",
      likes: 73,
      comments: 19,
      timestamp: "3일 전",
      liked: false,
      category: "정보게시판",
    },
    {
      id: 6,
      author: "한산양조장",
      authorType: "brewery",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      content: "한산소곡주 체험 프로그램 오픈합니다! 전통주 빚기부터 시음까지 알찬 3시간 코스예요. 많은 관심 부탁드립니다 🙏",
      likes: 145,
      comments: 31,
      timestamp: "4일 전",
      liked: true,
      category: "정보게시판",
    },
    {
      id: 7,
      author: "전통주초보",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      content: "누룩은 어디서 구매하시나요? 처음 해보는데 추천 부탁드립니다!",
      likes: 28,
      comments: 17,
      timestamp: "5일 전",
      liked: false,
      category: "자유게시판",
    },
    {
      id: 8,
      author: "발효연구가",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
      content: "전통 발효식품과 전통주의 공통점, 알고 계셨나요? 유산균 발효 과정이 비슷해서 서로 맛의 조화가 좋답니다.",
      likes: 61,
      comments: 9,
      timestamp: "6일 전",
      liked: false,
      category: "정보게시판",
    },
    {
      id: 9,
      author: "전통주팬",
      authorType: "user",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      content: "오늘 마신 복분자주가 너무 맛있었어요! 달달하면서도 산미가 있어서 디저트 술로 최고였습니다.",
      likes: 34,
      comments: 5,
      timestamp: "1주일 전",
      liked: false,
      category: "자유게시판",
    },
  ]);

  const handlePostLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // 검색 및 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      communityFilter === "전체" || post.category === communityFilter;
    const query = searchQuery.toLowerCase();
    const searchMatch =
      !query ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  // 정렬
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === "인기순") return b.likes - a.likes;
    return b.id - a.id;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedPosts = sortedPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleFilterChange = (cat: string) => {
    setCommunityFilter(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && safePage < totalPages) goToPage(safePage + 1);
      else if (diff < 0 && safePage > 1) goToPage(safePage - 1);
    }
    setTouchStartX(null);
  };

  const communityCategories = ["전체", "자유게시판", "정보게시판"];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Page Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold text-black">커뮤니티</h1>
          <Link to="/ai-chat">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-5 h-5 text-black" />
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <section className="bg-white border-b border-gray-200 px-4 pt-20 pb-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="게시글, 작성자로 검색..."
            className="pl-12 pr-10 h-12 bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 rounded-full"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {communityCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                communityFilter === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Community Feed */}
      <section
        className="px-4 py-5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sort Toggle */}
        <div className="flex justify-end mb-4">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                showSortDropdown
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span>{sortOption}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden min-w-[120px]">
                <button
                  onClick={() => { setSortOption("인기순"); setShowSortDropdown(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <span>인기순</span>
                  {sortOption === "인기순" && <Check className="w-4 h-4 text-gray-600" />}
                </button>
                <button
                  onClick={() => { setSortOption("최신순"); setShowSortDropdown(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <span>최신순</span>
                  {sortOption === "최신순" && <Check className="w-4 h-4 text-gray-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${communityFilter}-${sortOption}-${safePage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {pagedPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">게시글이 없습니다.</p>
              </div>
            ) : (
              pagedPosts.map((post, index) => (
                <Link key={post.id} to={`/community/post/${post.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer mb-3"
                  >
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">{post.author}</span>
                          {post.authorType === "brewery" && (
                            <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full">
                              양조장
                            </span>
                          )}
                          <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-900 text-sm leading-relaxed mb-3 line-clamp-3 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handlePostLike(post.id);
                        }}
                        className={`flex items-center gap-2 transition-colors ${
                          post.liked ? "text-gray-800" : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  page === safePage
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Floating Write Button - 모바일 컨테이너 내부 고정 */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] pointer-events-none z-30">
        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }
            navigate("/community/post/create");
          }}
          className="absolute right-4 bottom-0 w-14 h-14 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}