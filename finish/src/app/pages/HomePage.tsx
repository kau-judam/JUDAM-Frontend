import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, TrendingUp, Users, Clock, Target, ArrowRight, Heart, MessageCircle, Wine, Lightbulb, Factory, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { PageHeader } from "../components/PageHeader";
import logoImage from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";
import guideBtnBg from "figma:asset/46448a89e475a2c961c67320b11b630caa3b2423.png";
import { useState, useEffect } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getPopularRecipes } from "../data/recipes";
import { RecipeCard } from "../components/RecipeCard";

const bannerSlides = [
  {
    id: 1,
    title: "MEET YOUR TASTE",
    subtitle: "전통을 잇는 새로운 맛",
    description: "매일 마주하는 일상을\n특별하게 만들어 줄 우리 술 이야기",
    image: "https://images.unsplash.com/photo-1697862469018-0fa7c93a8d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMG1ha2dlb2xsaSUyMHJpY2UlMjB3aW5lJTIwcG91cmluZ3xlbnwxfHx8fDE3NzQ5MDU2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    title: "CRAFT YOUR DREAM",
    subtitle: "당신만의 술을 만드세요",
    description: "펀딩으로 함께 완성하는\n세상에 하나뿐인 전통주",
    image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBicmV3aW5nJTIwZmVybWVudGF0aW9ufGVufDF8fHx8MTc3NDkwNTY5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    title: "DISCOVER TRADITION",
    subtitle: "전통의 재발견",
    description: "오랜 시간이 만든 깊은 맛\n우리 술의 새로운 가능성",
    image: "https://images.unsplash.com/photo-1694763891594-3b19ad17dec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBzb2p1JTIwYm90dGxlJTIwdHJhZGl0aW9uYWwlMjBzZXR0aW5nfGVufDF8fHx8MTc3NDkwNTY4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const fundingProjects = [
  {
    id: 1,
    title: "봄을 담은 벚꽃 막걸리 프로젝트",
    brewery: "꽃샘양조장",
    location: "경기 양평",
    category: "과일",
    image: "https://images.unsplash.com/photo-1697862469018-0fa7c93a8d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMG1ha2dlb2xsaSUyMHJpY2UlMjB3aW5lJTIwcG91cmluZ3xlbnwxfHx8fDE3NzQ5MDU2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 4350000,
    backers: 156,
    daysLeft: 12,
    status: "진행 중",
  },
  {
    id: 2,
    title: "전통 누룩의 재발견 - 현대적 막걸리",
    brewery: "술샘양조장",
    location: "경기 양평",
    category: "곡물",
    image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGxpcXVvciUyMGJvdHRsZSUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NTk1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 5000000,
    currentAmount: 4600000,
    backers: 203,
    daysLeft: 5,
    status: "진행 중",
  },
  {
    id: 3,
    title: "꽃향기 가득한 약주 프로젝트",
    brewery: "꽃담양조",
    location: "전북 전주",
    category: "과일",
    image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFsY29ob2wlMjBicmV3aW5nJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NzQ1OTU2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    goalAmount: 8000000,
    currentAmount: 5120000,
    backers: 98,
    daysLeft: 8,
    status: "진행 중",
  },
];


const completedFundings = [
  {
    id: 1,
    title: "산사 막걸리",
    brewery: "산사양조",
    backers: 178,
    amount: "4,500,000",
    image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    date: "2026.03",
  },
  {
    id: 2,
    title: "한라봉 소주 특별판",
    brewery: "제주양조",
    backers: 234,
    amount: "8,200,000",
    image: "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    date: "2026.02",
  },
];

const processSteps = [
  {
    number: "01",
    title: "레시피\n제안",
    description: "당신이 원하는 맛을 제안하세요",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "양조장\n선택",
    description: "양조장이 레시피를 선택합니다",
    icon: Factory,
  },
  {
    number: "03",
    title: "펀딩\n시작",
    description: "함께 만들 사람들을 모집합니다",
    icon: Users,
  },
  {
    number: "04",
    title: "양조\n과정",
    description: "실시간으로 제작 과정을 확인하세요",
    icon: Wine,
  },
];

const contentArticles = [
  {
    id: 1,
    category: "트렌드",
    title: "MZ세대가 주목하는 전통주 열풍",
    description: "젊은 세대 사이에서 전통주가 새로운 문화로 자리잡고 있습니다.",
    image: "https://images.unsplash.com/photo-1528615141309-53f2564d3be8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    date: "2026.04.05",
    readTime: "5분",
  },
  {
    id: 2,
    category: "양조장",
    title: "성공적인 크라우드펀딩을 위한 5가지 팁",
    description: "양조장을 위한 실전 펀딩 전략을 공개합니다.",
    image: "https://images.unsplash.com/photo-1774900131812-e1676edbeca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    date: "2026.04.03",
    readTime: "7분",
  },
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toggleFavoriteFunding, isFavoriteFunding } = useFavorites();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Header */}
      <PageHeader title="홈" showNotification={false} />

      {/* Scrollable Content */}
      <div className="pt-14">
        {/* Main Banner Carousel - 화면 절반 크기 */}
        <section className="relative h-[50vh] overflow-hidden">
          {bannerSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              
              <div className="relative h-full flex flex-col justify-center px-6 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xs tracking-[0.2em] mb-2 text-white/80 font-medium">
                    EVERYDAY ESSENTIAL
                  </p>
                  <h2 
                    className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {slide.title}
                  </h2>
                  <h3 className="text-xl sm:text-2xl mb-4 font-medium">
                    {slide.subtitle}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                    {slide.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium z-10">
            {currentSlide + 1} / {bannerSlides.length}
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-6 flex gap-2 z-10">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-6"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </section>

        {/* 주담이 만들어지는 과정 */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">
                주담이 만들어지는 과정
              </h2>
              <p className="text-gray-400">
                여러분의 아이디어가 술이 되기까지
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-500 text-sm font-bold mb-1.5">
                    {step.number}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug whitespace-pre-line">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/recipe">
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 rounded-full font-bold text-base">
                  레시피 제안하러 가기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* 현재 인기 펀딩 */}
        <section className="bg-white py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#2B1810] mb-2">
                  현재 인기 펀딩
                </h2>
                <p className="text-gray-600 text-sm">
                  지금 가장 뜨거운 프로젝트
                </p>
              </div>
              <Link to="/funding" className="text-[#8B5A3C] font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                전체보기
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {fundingProjects.map((project, index) => {
                const progressPercentage = Math.min(
                  (project.currentAmount / project.goalAmount) * 100,
                  100
                );

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
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
            </div>
          </motion.div>
        </section>

        {/* 현재 인기 레시피 */}
        <section className="bg-[#F5F1ED] py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#2B1810] mb-2">
                  인기 레시피 제안
                </h2>
                <p className="text-gray-600 text-sm">
                  커뮤니티에서 가장 인기있는 레시피
                </p>
              </div>
              <Link to="/recipe" className="text-gray-900 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                더보기
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {getPopularRecipes(3).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} index={index} showLikeButton={false} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 주담과 함께한 순간들 */}
        <section className="bg-white py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="text-center mb-12">
              <Trophy className="w-12 h-12 text-[#8B5A3C] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#2B1810] mb-3">
                주담과 함께한 순간들
              </h2>
              <p className="text-gray-600">
                함께 만들어가는 전통주 문화
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2B1810] to-[#3d2416] rounded-xl flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">2,847</p>
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">가입 회원</p>
                  <p className="text-xs text-gray-500">함께한 사람들</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B5A3C] to-[#A0522D] rounded-xl flex items-center justify-center mb-2">
                    <Factory className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">42</p>
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">참여 양조장</p>
                  <p className="text-xs text-gray-500">전국의 양조장</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6B4423] to-[#8B5A3C] rounded-xl flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">156</p>
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">진행중인 펀딩</p>
                  <p className="text-xs text-gray-500">지금 참여 가능</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">89</p>
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">성공한 펀딩</p>
                  <p className="text-xs text-gray-500">여러분의 선택</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}