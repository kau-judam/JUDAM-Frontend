import { Link } from "react-router";
import { MessageCircle, Bell, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface PageHeaderProps {
  title: string;
  showNotification?: boolean;
}

export function PageHeader({ title, showNotification = true }: PageHeaderProps) {
  const { user } = useAuth();
  
  // 양조장 인증 완료 여부 확인
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified === true;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Page Title */}
        <h1 className="text-lg font-bold text-black">{title}</h1>
        
        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {isBrewery && (
            <Link to="/brewery/dashboard">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <LayoutDashboard className="w-5 h-5 text-black" />
              </button>
            </Link>
          )}
          {showNotification && isBrewery && (
            <Link to="/notifications">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-black" />
              </button>
            </Link>
          )}
          <Link to="/ai-chat">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="w-5 h-5 text-black" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}