import { Link, Outlet, useLocation } from "react-router";
import { Wine, Home, MessageSquare, TrendingUp, BookOpen, User, LogOut, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { ScrollToTop } from "./ScrollToTop";
import { MobileStatusBar } from "./MobileStatusBar";
import logoImage from "figma:asset/d754389bb9f5ce60b4245b6766636b08663a6081.png";
import headerBgImage from "figma:asset/5923f7b494ad282b1ed43b17230bf4627841b458.png";

export function RootLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // 네비게이션 바를 숨길 경로들
  const hideNavPaths = ["/brewery/verify", "/login", "/signup", "/user-type-selection", "/password-reset"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  const navItems = [
    { path: "/", label: "홈", icon: Home },
    { path: "/recipe", label: "주담", icon: Wine },
    { path: "/funding", label: "펀딩", icon: TrendingUp },
    { path: "/community", label: "커뮤니티", icon: MessageSquare },
    { path: "/mypage", label: "마이", icon: User },
  ];

  const handleProjectCreate = () => {
    if (!user) {
      return;
    }

    if (user.type !== "brewery") {
      return;
    }

    if (!user.isBreweryVerified) {
      return;
    }

    return;
  };

  const handleLogout = () => {
    logout();
    return;
  };

  return (
    <>
      <ScrollToTop />
      {/* Main Content */}
      <main className={shouldHideNav ? "" : "pb-20"}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!shouldHideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center justify-around px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors flex-1 ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}