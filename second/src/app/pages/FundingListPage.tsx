import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, Plus, TrendingUp, Users, ChevronDown } from "lucide-react";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useFunding } from "../contexts/FundingContext";
import { PageHeader } from "../components/PageHeader";
import { Heart } from "lucide-react";

export function FundingListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleFavoriteFunding, isFavoriteFunding } = useFavorites();
  const { projects: fundingProjects } = useFunding();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체 프로젝트");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ["전체 프로젝트", "진행중인 프로젝트", "성사된 프로젝트"];

  // 검색어, 상태에 맞춰 프로젝트 필터링
  const filteredProjects = fundingProjects.filter((project) => {
    const matchesSearch =
      project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.brewery
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // 상태 필터링
    let matchesStatus = true;
    if (selectedStatus === "진행중인 프로젝트") {
      matchesStatus = project.status === "펀딩 예정" || project.status === "진행 중" || project.status === "목표 달성";
    } else if (selectedStatus === "성사된 프로젝트") {
      matchesStatus = project.status === "펀딩 성공" || project.status === "펀딩 실패" || project.status === "제작 중" || project.status === "배송 중" || project.status === "완료";
    }

    return matchesSearch && matchesStatus;
  });

  // 양조장 권한 체크 함수 - 간소화
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <PageHeader title="펀딩" />
      
      {/* 1. Hero Section (이미지 배경) */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden mt-[52px]">
        <img
          src="https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlcyUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzQ1OTU2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="펀딩 프로젝트 배경"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-white mb-4 sm:mb-5 tracking-tight text-[48px]"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              당신의 선택으로
              <br />
              완성되는 전통주
            </h1>
            
            {/* 양조장 계정: 프로젝트 등록 버튼만 표시 */}
            {isBrewery ? (
              <div className="mt-8">
                <Button
                  onClick={() => navigate("/brewery/project/terms")}
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-black font-bold px-8 py-6 text-base sm:text-lg rounded-2xl shadow-2xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  프로젝트 등록
                </Button>
              </div>
            ) : (
              /* 일반 사용자 또는 미로그인: 기존 설명 텍스트 표시 */
              <p className="text-white/90 text-sm sm:text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                지금 참여 가능한 프로젝트를 탐색하고,
                <br />
                당신만의 전통주를 함께 만들어보세요
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. Floating Search & Filter Section (공중 부양 카드) */}
      <section className="w-full px-4 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 border border-gray-200"
        >
          {/* 검색창과 상태 필터 */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="프로젝트 또는 양조장 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-gray-50 border-gray-200 focus:border-black rounded-2xl text-black text-base"
              />
            </div>
            
            {/* 상태 필터 드롭다운 */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 h-14 px-4 bg-gray-50 border-2 border-gray-200 hover:border-gray-900 rounded-2xl font-semibold transition-all whitespace-nowrap text-sm text-black"
              >
                <span className="hidden sm:inline">
                  {selectedStatus === "전체 프로젝트" ? "전체" : 
                   selectedStatus === "진행중인 프로젝트" ? "진행중" :
                   selectedStatus === "성사된 프로젝트" ? "성사됨" :
                   "공개예정"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowStatusDropdown(false);
                      }}
                      className={`block w-full px-5 py-3 text-sm text-left hover:bg-gray-100 transition-colors ${
                        selectedStatus === status ? "bg-gray-100 text-black font-bold" : "text-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Funding Project Feed (카드 리스트) */}
      <section className="w-full px-4 py-12">
        <div className="space-y-4">
          {filteredProjects
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((project, index) => {
            const progressPercentage = Math.min(
              (project.currentAmount / project.goalAmount) *
                100,
              100,
            );

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4">
                  <div className="flex gap-4">
                    {/* 이미지 영역 - 왼쪽 작은 썸네일 */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <Link to={`/funding/${project.id}`}>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      {/* 하트 아이콘 - 왼쪽 하단 */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!user) {
                            navigate("/login");
                            return;
                          }
                          toggleFavoriteFunding(project.id);
                        }}
                        className="absolute bottom-1 left-1 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            isFavoriteFunding(project.id)
                              ? "fill-white text-white"
                              : "text-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* 콘텐츠 영역 - 오른쪽 */}
                    <Link to={`/funding/${project.id}`} className="flex-1 min-w-0">
                      <div>
                        {/* 상단: 양조장 이름과 카테고리 */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-600">
                            {project.brewery}
                          </span>
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

                        {/* 프로젝트 제목 */}
                        <h3 className="text-base font-bold text-black mb-3 line-clamp-2 leading-tight">
                          {project.title}
                        </h3>

                        {/* 진행률과 금액 정보 */}
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <span className="text-2xl font-bold text-black">
                              {progressPercentage.toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {(project.currentAmount / 10000).toLocaleString()}만원
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-black">
                              {project.status === "성공" || project.status === "실패"
                                ? "펀딩 종료"
                                : `${project.daysLeft}일 남음`}
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
              </motion.div>
            );
          })}

          {/* 검색 결과가 없을 때 */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                해당하는 펀딩 프로젝트가 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {filteredProjects.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {/* 이전 버튼 */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50"
              }`}
            >
              이전
            </button>

            {/* 페이지 번호들 */}
            {Array.from(
              { length: Math.ceil(filteredProjects.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-black hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredProjects.length}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage * itemsPerPage >= filteredProjects.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50"
              }`}
            >
              다음
            </button>
          </div>
        )}
      </section>

      {/* 4. Stats Section (통계) - 현대적인 디자인 */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="w-full px-4">
          {/* 제목 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              주담과 함께한 순간들
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              함께 만들어가는 전통주의 미래
            </p>
          </motion.div>

          {/* 통계 카드들 - 현대적인 디자인 */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-black mb-2">
                  {fundingProjects.filter(p => p.status === "진행 중").length}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  진행중인 펀딩
                </p>
                <p className="text-xs text-gray-500">
                  지금 참여 가능
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-black mb-2">
                  {fundingProjects.reduce(
                    (sum, p) => sum + p.backers,
                    0,
                  ).toLocaleString()}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  총 참여자
                </p>
                <p className="text-xs text-gray-500">
                  함께한 사람들
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 text-2xl">
                  ✓
                </div>
                <p className="text-4xl font-bold text-black mb-2">
                  {
                    fundingProjects.filter(
                      (p) => p.status === "성공",
                    ).length
                  }
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  성공한 프로젝트
                </p>
                <p className="text-xs text-gray-500">
                  여러분의 선택
                </p>
              </div>
            </motion.div>
          </div>

          {/* 하단 추가 정보 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <div className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full">
              <p className="text-sm font-medium">
                총 <span className="font-bold text-lg mx-1">{(fundingProjects.reduce((sum, p) => sum + p.currentAmount, 0) / 100000000).toFixed(1)}억원</span> 이상 모금 달성
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}