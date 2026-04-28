import { useState } from "react";
import { useNavigate } from "react-router";
import { UserIcon, Building2, Wine, TrendingUp, Archive, FileCheck, FolderKanban, LayoutDashboard, ShieldCheck, FileText, Building } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { MobileStatusBar } from "../components/MobileStatusBar";
import onboardingLogo from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";

export function UserTypeSelectionPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"user" | "brewery" | null>(null);

  const handleUserSelection = () => {
    // 일반 사용자로 시작
    navigate("/");
  };

  const handleBrewerySelection = () => {
    // 양조장 인증 페이지로 이동 (나중에 구현)
    navigate("/brewery/verify");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <img src={onboardingLogo} alt="주담" className="w-20 h-20 mx-auto mb-4" />
          <h1
            className="text-2xl text-black mb-2 font-bold"
          >
            사용자 유형을 선택해주세요
          </h1>
        </motion.div>

        {/* Selection Cards */}
        <div className="w-full max-w-md space-y-4 mb-8">
          {/* 일반 사용자 카드 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setSelectedType("user")}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all ${
              selectedType === "user"
                ? "ring-4 ring-black ring-opacity-50"
                : "hover:shadow-xl"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-black">일반 사용자</h3>
                  <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full">
                    기본
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Wine className="w-4 h-4 text-gray-800" />
                    <span>레시피 제안</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-gray-800" />
                    <span>펀딩 참여</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Archive className="w-4 h-4 text-gray-800" />
                    <span>아카이브</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 양조장 카드 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setSelectedType("brewery")}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all ${
              selectedType === "brewery"
                ? "ring-4 ring-black ring-opacity-50"
                : "hover:shadow-xl"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-black">양조장</h3>
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                    인증 필요
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FileCheck className="w-4 h-4 text-gray-800" />
                    <span>레시피 검토</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FolderKanban className="w-4 h-4 text-gray-800" />
                    <span>펀딩 프로젝트 개설</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <LayoutDashboard className="w-4 h-4 text-gray-800" />
                    <span>양조장 대시보드 이용</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md space-y-3"
        >
          {selectedType === "user" && (
            <Button
              onClick={handleUserSelection}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-bold h-14 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              일반 사용자로 시작
            </Button>
          )}

          {selectedType === "brewery" && (
            <Button
              onClick={handleBrewerySelection}
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-bold h-14 text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              양조장 인증하러 가기
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}