import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft,
  MapPin,
  MessageCircle,
  Star,
  Heart,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Beaker,
  Calendar,
} from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";

// 양조장 더미 데이터 (펀딩 프로젝트와 연계)
const breweryData: Record<number, {
  id: number;
  name: string;
  logo: string;
  location: string;
  category: string;
  coverImage: string;
  foundedYear: number;
  description: string;
  philosophy: string;
  totalProjects: number;
  totalBackers: number;
  successRate: number;
  representative: string;
  tags: string[];
  sns: { type: string; handle: string }[];
}> = {
  1: {
    id: 1,
    name: "꽃샘양조장",
    logo: "🌸",
    location: "경기도 양평군",
    category: "막걸리",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 1987,
    description: "3대째 이어온 전통 누룩 제조 기술을 바탕으로 계절의 아름다움을 술에 담는 양조장입니다. 봄의 벚꽃, 여름의 연꽃, 가을의 국화, 겨울의 매화 — 사계절을 한 잔에 담습니다.",
    philosophy: "자연에서 온 재료, 시간이 빚은 맛",
    totalProjects: 8,
    totalBackers: 1240,
    successRate: 95,
    representative: "김춘배 대표",
    tags: ["막걸리", "전통누룩", "자연발효", "무첨가"],
    sns: [{ type: "인스타그램", handle: "@ggotsaem_brewing" }],
  },
  2: {
    id: 2,
    name: "술샘양조장",
    logo: "🍶",
    location: "경기도 양평군",
    category: "막걸리",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 2005,
    description: "전통 누룩의 진정한 가치를 현대적 감각으로 재해석하는 양조장입니다. 수십 년간 연구해온 누룩 배양 기술로 깊고 풍부한 향미의 막걸리를 만들어냅니다.",
    philosophy: "전통의 지혜, 현대의 감각",
    totalProjects: 5,
    totalBackers: 860,
    successRate: 100,
    representative: "이샘물 대표",
    tags: ["막걸리", "누룩연구", "현대전통주"],
    sns: [{ type: "인스타그램", handle: "@soolsaem_brew" }],
  },
  3: {
    id: 3,
    name: "꽃담양조",
    logo: "🌺",
    location: "전라북도 전주시",
    category: "약주",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 2012,
    description: "전주의 꽃과 약재를 활용한 프리미엄 약주를 전문으로 하는 양조장입니다. 한방 약재와 전통 발효법이 만나 세상에 하나뿐인 맛을 만들어냅니다.",
    philosophy: "꽃과 약재가 어우러진 건강한 술",
    totalProjects: 6,
    totalBackers: 1580,
    successRate: 90,
    representative: "박꽃담 대표",
    tags: ["약주", "꽃술", "한방발효", "프리미엄"],
    sns: [{ type: "인스타그램", handle: "@kkotdam_brew" }],
  },
  4: {
    id: 4,
    name: "안동양조",
    logo: "🥃",
    location: "경상북도 안동시",
    category: "소주",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 1968,
    description: "안동 소주의 전통을 500년 넘게 이어온 명문 양조장입니다. 경상북도 무형문화재로 지정된 전통 증류 기법으로 깨끗하고 깊은 풍미의 소주를 만들고 있습니다.",
    philosophy: "오백 년의 전통, 한 방울의 정성",
    totalProjects: 12,
    totalBackers: 3200,
    successRate: 100,
    representative: "안창호 대표",
    tags: ["증류소주", "안동소주", "전통문화재", "숙성"],
    sns: [{ type: "인스타그램", handle: "@andong_soju" }],
  },
  5: {
    id: 5,
    name: "산사양조",
    logo: "🏔️",
    location: "강원도 평창군",
    category: "막걸리",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 2018,
    description: "해발 700m 평창의 청정 자연환경에서 태어난 막걸리 전문 양조장입니다. 산사의 약수와 고랭지에서 자란 쌀로 빚은 술은 깨끗하고 맑은 풍미가 특징입니다.",
    philosophy: "산의 청정함을 한 잔에",
    totalProjects: 3,
    totalBackers: 520,
    successRate: 100,
    representative: "장산하 대표",
    tags: ["막걸리", "청정원료", "강원쌀", "무농약"],
    sns: [{ type: "인스타그램", handle: "@sansa_brew" }],
  },
  6: {
    id: 6,
    name: "제주양조",
    logo: "🍊",
    location: "제주특별자치도",
    category: "소주",
    coverImage: "https://images.unsplash.com/photo-1726826278347-afef4461b63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMEtvcmVhbiUyMGJyZXdlcnklMjBmZXJtZW50YXRpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NTUzMzgyNXww&ixlib=rb-4.1.0&q=80&w=1080",
    foundedYear: 2015,
    description: "제주의 청정 화산암반수와 현무암 토양에서 자란 과일로 빚는 제주 특산 양조장입니다. 한라봉, 감귤, 천혜향 등 제주 특산 과일의 신선한 향을 담아냅니다.",
    philosophy: "제주 자연이 빚어낸 청명한 술",
    totalProjects: 4,
    totalBackers: 980,
    successRate: 100,
    representative: "고도영 대표",
    tags: ["소주", "제주한라봉", "과일소주", "청정화산수"],
    sns: [{ type: "인스타그램", handle: "@jeju_brewing" }],
  },
};

// 프로젝트별 데이터 (간소화)
const allProjectsData = [
  { id: 1, breweryId: 1, title: "봄을 담은 벚꽃 막걸리 프로젝트", status: "진행 중", backers: 156, image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 2, breweryId: 2, title: "전통 누룩의 재발견 - 현대적 막걸리", status: "진행 중", backers: 127, image: "https://images.unsplash.com/photo-1694763893369-f7affaa9155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 3, breweryId: 3, title: "꽃향기 가득한 약주 프로젝트", status: "진행 중", backers: 203, image: "https://images.unsplash.com/photo-1770734331757-f40d64eafbc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 4, breweryId: 4, title: "증류식 소주의 부활", status: "진행 중", backers: 89, image: "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 5, breweryId: 5, title: "산사 막걸리 프로젝트", status: "성공", backers: 178, image: "https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 6, breweryId: 6, title: "한라봉 소주 특별판", status: "성공", backers: 234, image: "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  // 이전 프로젝트 (과거)
  { id: 11, breweryId: 1, title: "겨울 매화 탁주 한정판", status: "성공", backers: 210, image: "https://images.unsplash.com/photo-1582204964885-7bc2d62b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: 12, breweryId: 4, title: "안동 전통 소주 원액 한정판", status: "성공", backers: 445, image: "https://images.unsplash.com/photo-1766399654235-a6793895422d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

export function BreweryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();

  const breweryId = Number(id);
  const brewery = breweryData[breweryId];

  if (!brewery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-4xl mb-4">🏚️</p>
          <p className="text-gray-700 font-bold text-lg">양조장 정보를 찾을 수 없어요</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-3 bg-black text-white rounded-2xl font-semibold"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const breweryProjects = allProjectsData.filter(p => p.breweryId === breweryId);
  const activeProjects = breweryProjects.filter(p => p.status === "진행 중");
  const pastProjects = breweryProjects.filter(p => p.status !== "진행 중");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 커버 이미지 + 헤더 */}
      <div className="relative h-56">
        <img
          src={brewery.coverImage}
          alt={brewery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* 헤더 버튼들 */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 양조장 로고 + 이름 (커버 하단) */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-3">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white">
              {brewery.logo}
            </div>
            <div className="pb-1">
              <h1 className="text-white font-bold text-xl leading-tight">
                {brewery.name}
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">{brewery.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-4 pb-32">

        {/* 태그 & 창업연도 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-center gap-2 flex-wrap"
        >
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {brewery.foundedYear}년 창업
          </span>
          <span className="text-gray-300">·</span>
          {brewery.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Beaker, label: "총 프로젝트", value: `${brewery.totalProjects}개` },
            { icon: Users, label: "누적 후원자", value: `${brewery.totalBackers.toLocaleString()}명` },
            { icon: Award, label: "성공률", value: `${brewery.successRate}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <Icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-black text-base">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* 양조 철학 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 bg-black rounded-2xl p-5"
        >
          <p className="text-white/60 text-xs mb-2 font-medium">양조 철학</p>
          <p className="text-white font-bold text-base leading-snug">
            "{brewery.philosophy}"
          </p>
        </motion.div>

        {/* 소개 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-4 bg-white rounded-2xl p-5 border border-gray-100"
        >
          <h2 className="font-bold text-black mb-3">양조장 소개</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {brewery.description}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{brewery.representative}</p>
              {brewery.sns.map(s => (
                <p key={s.handle} className="text-xs text-gray-400">{s.handle}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 진행 중인 프로젝트 */}
        {activeProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-black">진행 중인 프로젝트</h2>
              <span className="flex items-center gap-1 text-xs bg-black text-white px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {activeProjects.length}개
              </span>
            </div>
            <div className="space-y-3">
              {activeProjects.map((project) => {
                const isFav = isFavoriteFunding(project.id);
                return (
                  <Link
                    key={project.id}
                    to={`/funding/${project.id}`}
                    className="flex gap-3 bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-black leading-snug line-clamp-2">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">후원자 {project.backers}명</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 완료된 프로젝트 */}
        {pastProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6"
          >
            <h2 className="font-bold text-black mb-3">완료된 프로젝트</h2>
            <div className="space-y-3">
              {pastProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/funding/${project.id}`}
                  className="flex gap-3 bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale-[30%]" />
                    <div className="absolute inset-0 flex items-end p-1.5">
                      <span className="text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded-full">
                        성공
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-700 leading-snug line-clamp-2">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">후원자 {project.backers}명</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 하단 고정 CTA: 채팅 */}
      <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 z-40">
        <Link
          to="/community"
          className="flex items-center justify-center gap-2 w-full h-13 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors py-3.5"
        >
          <MessageCircle className="w-5 h-5" />
          {brewery.name}에 문의하기
        </Link>
      </div>
    </div>
  );
}
