import { useState, useEffect } from "react";
import { ChevronLeft, Wine, UtensilsCrossed, Factory, Sparkles, Plus, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

type ChatCategory = "recommend" | "pairing" | "brewery" | "general";

interface ChatRoom {
  id: string;
  category: ChatCategory;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: any[];
}

const categories = [
  {
    id: "recommend" as ChatCategory,
    title: "술 추천",
    icon: Wine,
  },
  {
    id: "pairing" as ChatCategory,
    title: "안주 추천",
    icon: UtensilsCrossed,
  },
  {
    id: "brewery" as ChatCategory,
    title: "양조장 요청",
    icon: Factory,
  },
  {
    id: "general" as ChatCategory,
    title: "통합 AI",
    icon: Sparkles,
  },
];

export function AIChatPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>("recommend");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  useEffect(() => {
    loadChatRooms();

    // 채팅방 업데이트 이벤트 리스너
    const handleChatRoomsUpdate = () => {
      loadChatRooms();
    };

    window.addEventListener("chatRoomsUpdated", handleChatRoomsUpdate);

    return () => {
      window.removeEventListener("chatRoomsUpdated", handleChatRoomsUpdate);
    };
  }, []);

  const loadChatRooms = () => {
    const chatRoomsData = localStorage.getItem("aiChatRooms");
    if (chatRoomsData) {
      setChatRooms(JSON.parse(chatRoomsData));
    } else {
      // 초기 샘플 데이터 생성
      const sampleRooms: ChatRoom[] = [
        {
          id: "sample-1",
          category: "recommend",
          title: "달콤한 막걸리 추천해줘",
          lastMessage: "말씀하신 취향에 따르면 '벚꽃 막걸리'를 추천드려요. 은은한 꽃향과 부드러운 단맛이 특징이에요.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
          messages: [
            {
              id: "1",
              type: "ai",
              content: "안녕하세요! 어떤 맛의 술을 찾으시나요? 좋아하시는 맛이나 분위기를 말씀해주세요.",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              type: "user",
              content: "달콤한 막걸리 추천해줘",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
            },
            {
              id: "3",
              type: "ai",
              content: "말씀하신 취향에 따르면 '벚꽃 막걸리'를 추천드려요. 은은한 꽃향과 부드러운 단맛이 특징이에요. 현재 펀딩 중이니 한번 살펴보시겠어요?",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120000).toISOString(),
            },
          ],
        },
        {
          id: "sample-2",
          category: "recommend",
          title: "초보자도 마시기 쉬운 전통주는?",
          lastMessage: "초보자분들께는 '이화주'나 '송화백일주'를 추천드려요. 도수가 낮고 부드러워서 처음 접하시기에 좋습니다.",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
          messages: [
            {
              id: "1",
              type: "ai",
              content: "안녕하세요! 어떤 맛의 술을 찾으시나요? 좋아하시는 맛이나 분위기를 말씀해주세요.",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              type: "user",
              content: "초보자도 마시기 쉬운 전통주는?",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
            },
            {
              id: "3",
              type: "ai",
              content: "초보자분들께는 '이화주'나 '송화백일주'를 추천드려요. 도수가 낮고 부드러워서 처음 접하시기에 좋습니다.",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 120000).toISOString(),
            },
          ],
        },
        {
          id: "sample-3",
          category: "pairing",
          title: "막걸리랑 어울리는 안주 추천",
          lastMessage: "막걸리와는 파전이나 김치전이 정말 잘 어울려요. 특히 비오는 날에는 환상의 조합이죠!",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
          messages: [
            {
              id: "1",
              type: "ai",
              content: "안녕하세요! 어떤 술과 함께 드실 안주를 찾으시나요?",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              type: "user",
              content: "막걸리랑 어울리는 안주 추천",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 60000).toISOString(),
            },
            {
              id: "3",
              type: "ai",
              content: "막걸리와는 파전이나 김치전이 정말 잘 어울려요. 특히 비오는 날에는 환상의 조합이죠!",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 120000).toISOString(),
            },
          ],
        },
        {
          id: "sample-4",
          category: "general",
          title: "전통주 도수가 어떻게 되나요?",
          lastMessage: "전통주의 도수는 종류에 따라 다양해요. 막걸리는 6-8%, 청주는 12-16%, 증류식 소주는 25-45% 정도입니다.",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
          messages: [
            {
              id: "1",
              type: "ai",
              content: "안녕하세요! 전통주에 관한 궁금한 점을 물어보세요.",
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              type: "user",
              content: "전통주 도수가 어떻게 되나요?",
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
            },
            {
              id: "3",
              type: "ai",
              content: "전통주의 도수는 종류에 따라 다양해요. 막걸리는 6-8%, 청주는 12-16%, 증류식 소주는 25-45% 정도입니다.",
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 120000).toISOString(),
            },
          ],
        },
      ];

      localStorage.setItem("aiChatRooms", JSON.stringify(sampleRooms));
      setChatRooms(sampleRooms);
    }
  };

  const filteredChatRooms = chatRooms
    .filter((room) => room.category === selectedCategory)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleRoomClick = (room: ChatRoom) => {
    navigate(`/ai-chat/${room.category}/${room.id}`);
  };

  const handleCategorySelect = (category: ChatCategory) => {
    setIsFloatingMenuOpen(false);
    setSelectedCategory(category);
  };

  const handleNewChat = () => {
    navigate(`/ai-chat/${selectedCategory}/new`);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "어제";
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-black pr-10">
            AI 챗봇
          </h1>
        </div>

        {/* Category Toggle */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 bg-[#F5F1ED] rounded-full p-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${
                  selectedCategory === category.id ? "flex-[1.3]" : "flex-1"
                }`}
              >
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full py-2.5 px-2 rounded-full font-semibold text-xs whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    selectedCategory === category.id
                      ? "bg-[#2B1810] text-white shadow-lg"
                      : "bg-transparent text-[#8B5A3C] hover:bg-[#EDE7E0]"
                  }`}
                >
                  <category.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{category.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="pt-[128px]">
        {filteredChatRooms.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center text-gray-400 px-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">아직 대화가 없습니다.</p>
              <p className="text-sm mt-1 mb-6">새로운 질문을 시작해보세요.</p>
              <button
                onClick={handleNewChat}
                className="px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                새 대화 시작하기
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="w-full px-4 py-4 flex gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-black truncate">
                      {room.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTimestamp(room.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] bottom-28 right-6 z-50 pointer-events-none">
        <div className="relative flex flex-col items-end pr-6 pointer-events-auto">
          {/* Category Options - Vertical Layout */}
          <AnimatePresence>
            {isFloatingMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2 mb-2"
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategorySelect(category.id)}
                    className="bg-white shadow-lg rounded-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <category.icon className="w-5 h-5 text-[#8B5A3C]" />
                    <span className="text-sm font-semibold text-black whitespace-nowrap">
                      {category.title}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
            className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isFloatingMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
