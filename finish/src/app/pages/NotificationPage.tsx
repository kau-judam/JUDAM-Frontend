import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, CheckCheck, Bell, TrendingUp, PartyPopper, AlertCircle, Wine, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router";

interface Notification {
  id: number;
  type: "funding_new" | "funding_success" | "funding_fail" | "funding_update" | "brewing_update" | "system";
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string;
  image?: string;
}

export function NotificationPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "funding_success",
      title: "펀딩 성공! 🎉",
      content: "'제주 한라봉 막걸리' 프로젝트가 목표 금액을 달성했습니다! 곧 제품을 받아보실 수 있어요.",
      timestamp: "방금 전",
      read: false,
      link: "/funding/1",
      image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      type: "funding_new",
      title: "새로운 막걸리 펀딩",
      content: "관심 카테고리에 새로운 펀딩이 등록되었어요. '벚꽃 생막걸리' 프로젝트를 확인해보세요!",
      timestamp: "1시간 전",
      read: false,
      link: "/funding/2",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      type: "brewing_update",
      title: "양조 일지 업데이트",
      content: "'전통 누룩 약주' 프로젝트의 양조 과정이 업데이트되었습니다. 발효 3일차 상태를 확인해보세요!",
      timestamp: "3시간 전",
      read: false,
      link: "/funding/1?tab=journal",
      image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      type: "funding_update",
      title: "펀딩 진행 상황",
      content: "'경주 법주' 프로젝트가 70% 달성했어요! 마감까지 3일 남았습니다.",
      timestamp: "5시간 전",
      read: true,
      link: "/funding/3",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      type: "funding_fail",
      title: "펀딩 종료 안내",
      content: "'강원도 토속주' 프로젝트가 목표 금액에 미달하여 종료되었습니다. 결제는 진행되지 않습니다.",
      timestamp: "1일 전",
      read: true,
      link: "/funding/4",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      type: "funding_new",
      title: "새로운 청주 펀딩",
      content: "관심 카테고리에 '전통 송화백일주' 프로젝트가 등록되었습니다.",
      timestamp: "2일 전",
      read: true,
      link: "/funding/5",
      image: "https://images.unsplash.com/photo-1509669803555-fd5ddcc8ae87?w=100&h=100&fit=crop",
    },
    {
      id: 7,
      type: "system",
      title: "주담 업데이트",
      content: "AI 챗봇 기능이 새롭게 추가되었습니다. 술 추천부터 안주 매칭까지 도움을 받아보세요!",
      timestamp: "3일 전",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "funding_success":
        return <PartyPopper className="w-5 h-5 text-green-600" />;
      case "funding_fail":
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      case "funding_new":
        return <Wine className="w-5 h-5 text-[#8B5A3C]" />;
      case "funding_update":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case "brewing_update":
        return <Clock className="w-5 h-5 text-purple-600" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-lg font-bold text-black">알림</h1>
            {unreadCount > 0 && (
              <span className="bg-[#8B5A3C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#8B5A3C] font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              전체 읽음
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-white text-[#2B1810] shadow-sm"
                  : "text-gray-600"
              }`}
            >
              전체 ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 py-2 px-4 rounded-full font-semibold text-sm transition-all ${
                filter === "unread"
                  ? "bg-white text-[#2B1810] shadow-sm"
                  : "text-gray-600"
              }`}
            >
              읽지 않음 ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content - 헤더 아래부터 시작 */}
      <div className="pt-[128px] pb-24 px-4">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">
              {filter === "unread" ? "읽지 않은 알림이 없습니다" : "알림이 없습니다"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {notification.link ? (
                  <Link
                    to={notification.link}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="block"
                  >
                    <NotificationCard notification={notification} getIcon={getIcon} />
                  </Link>
                ) : (
                  <div onClick={() => handleMarkAsRead(notification.id)}>
                    <NotificationCard notification={notification} getIcon={getIcon} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  getIcon: (type: Notification["type"]) => JSX.Element;
}

function NotificationCard({ notification, getIcon }: NotificationCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 transition-all hover:shadow-md ${
        !notification.read ? "border-2 border-[#8B5A3C]/20" : "border border-gray-200"
      }`}
    >
      <div className="flex gap-3">
        {/* Icon or Image */}
        {notification.image ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={notification.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            {getIcon(notification.type)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[#2B1810] text-sm">
              {notification.title}
            </h3>
            {!notification.read && (
              <div className="w-2 h-2 bg-[#8B5A3C] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.content}
          </p>
          <p className="text-xs text-gray-400">{notification.timestamp}</p>
        </div>
      </div>
    </div>
  );
}