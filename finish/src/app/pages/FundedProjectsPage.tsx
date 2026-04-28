import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Users, Clock, Heart } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { useFunding } from "../contexts/FundingContext";
import { FundingProject } from "../data/fundingData";

type MyFunding = FundingProject & { myAmount: number; myDate: string };

const PAGE_SIZE = 3;

export function FundedProjectsPage() {
  const navigate = useNavigate();
  const { projects, participatedFundings } = useFunding();
  const [page, setPage] = useState(1);
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const myFundings: MyFunding[] = participatedFundings
    .map((p) => {
      const project = projects.find((proj) => proj.id === p.fundingId);
      return project ? { ...project, myAmount: p.amount, myDate: p.date } : null;
    })
    .filter((x): x is MyFunding => x !== null);

  const totalAmount = myFundings.reduce((sum, f) => sum + f.myAmount, 0);
  const totalPages = Math.max(1, Math.ceil(myFundings.length / PAGE_SIZE));
  const paginated = myFundings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 페이지 변경 시 상단으로 스크롤
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <h1 className="text-lg font-bold text-gray-900">참여 펀딩</h1>
        </div>
      </div>

      <div className="pt-[72px] px-5 py-5 space-y-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/70">나의 펀딩 현황</p>
              <p className="font-bold text-white">총 {myFundings.length}개 프로젝트 참여</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-0">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-[11px] text-white/60 font-medium">총 참여금액</p>
                <p className="font-bold text-base text-white leading-tight">
                  {(totalAmount / 10000).toFixed(0)}<span className="text-xs font-semibold text-white/80">만원</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-x border-white/20">
                <p className="text-[11px] text-white/60 font-medium">진행 중</p>
                <p className="font-bold text-base text-white leading-tight">
                  {myFundings.filter((f) => f.status === "진행 중").length}<span className="text-xs font-semibold text-white/80">개</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-[11px] text-white/60 font-medium">완료</p>
                <p className="font-bold text-base text-white leading-tight">
                  {myFundings.filter((f) => f.status !== "진행 중").length}<span className="text-xs font-semibold text-white/80">개</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project List — paginated */}
        <div className="space-y-3">
          {paginated.map((project, idx) => {
            const progress = Math.min(
              Math.round((project.currentAmount / project.goalAmount) * 100),
              100
            );
            return (
              <motion.div
                key={`${project.id}-${page}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 cursor-pointer active:scale-[0.98]"
                  onClick={() => navigate(`/funding/${project.id}`)}
                >
                  <div className="flex gap-4">
                    {/* 썸네일 */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleLike(e, project.id)}
                        className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            likedProjects.has(project.id)
                              ? "text-pink-400 fill-pink-400"
                              : "text-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-600">{project.brewery}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold">
                          {project.category}
                        </span>
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-md font-bold ${
                            project.status === "진행 중"
                              ? "bg-green-50 text-green-700"
                              : project.status === "성공"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-black mb-3 line-clamp-2 leading-tight">
                        {project.title}
                      </h3>

                      <div className="flex items-end justify-between mb-2">
                        <span className="text-2xl font-bold text-black">{progress}%</span>
                        <div className="text-xs font-bold text-black">
                          {project.status === "성공" || project.status === "실패"
                            ? "펀딩 종료"
                            : `${project.daysLeft}일 남음`}
                        </div>
                      </div>

                      <Progress
                        value={progress}
                        className="h-1.5 bg-gray-100"
                        indicatorClassName="bg-gradient-to-r from-gray-800 to-black"
                      />

                      {/* 내 참여 정보 */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          {project.backers}명 참여
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.myDate}
                          </span>
                          <span className="font-bold text-gray-900">
                            {project.myAmount.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {myFundings.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">아직 참여한 펀딩이 없습니다</p>
              <button
                onClick={() => navigate("/funding")}
                className="mt-3 text-xs text-gray-600 underline"
              >
                펀딩 둘러보기
              </button>
            </div>
          )}
        </div>

        {/* 페이지네이션 — 펀딩 페이지와 동일한 스타일 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50"
              }`}
            >
              이전
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  page === pageNum
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-black hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {myFundings.length > 0 && (
          <p className="text-center text-xs text-gray-400 pt-1">
            총 {myFundings.length}개 펀딩 · {page} / {totalPages} 페이지
          </p>
        )}
      </div>
    </div>
  );
}