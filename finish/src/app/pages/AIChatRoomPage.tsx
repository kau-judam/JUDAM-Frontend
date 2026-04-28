import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router";

type ChatCategory = "recommend" | "pairing" | "brewery" | "general";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const welcomeMessages: Record<ChatCategory, string> = {
  recommend: "안녕하세요! 어떤 맛의 술을 찾으시나요? 좋아하시는 맛이나 분위기를 말씀해주세요.",
  pairing: "안녕하세요! 어떤 술과 함께 드실 안주를 찾으시나요?",
  brewery: "안녕하세요! 양조장에 전달하고 싶은 요청사항을 알려주세요.",
  general: "안녕하세요! 전통주에 관한 궁금한 점을 물어보세요.",
};

const categoryTitles: Record<ChatCategory, string> = {
  recommend: "술 추천",
  pairing: "안주 추천",
  brewery: "양조장 요청",
  general: "통합 AI",
};

export function AIChatRoomPage() {
  const navigate = useNavigate();
  const { roomId, category } = useParams<{ roomId: string; category: ChatCategory }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 로컬 스토리지에서 채팅방 데이터 불러오기
    const chatRoomsData = localStorage.getItem("aiChatRooms");
    if (chatRoomsData && roomId && category) {
      const chatRooms = JSON.parse(chatRoomsData);
      const room = chatRooms.find(
        (r: any) => r.id === roomId && r.category === category
      );
      if (room) {
        setMessages(
          room.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    } else if (category && !roomId) {
      // 새 채팅방인 경우 환영 메시지
      setMessages([
        {
          id: Date.now().toString(),
          type: "ai",
          content: welcomeMessages[category],
          timestamp: new Date(),
        },
      ]);
    }
  }, [roomId, category]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !category) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const userInput = inputValue;
    setInputValue("");

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(category, userInput),
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      // 로컬 스토리지에 저장
      saveChatRoom(finalMessages);
    }, 1000);
  };

  const saveChatRoom = (updatedMessages: Message[]) => {
    if (!category) return;

    const chatRoomsData = localStorage.getItem("aiChatRooms");
    const chatRooms = chatRoomsData ? JSON.parse(chatRoomsData) : [];

    if (roomId) {
      // 기존 채팅방 업데이트
      const roomIndex = chatRooms.findIndex(
        (r: any) => r.id === roomId && r.category === category
      );
      if (roomIndex !== -1) {
        chatRooms[roomIndex].messages = updatedMessages;
        chatRooms[roomIndex].lastMessage =
          updatedMessages[updatedMessages.length - 1].content.slice(0, 50);
        chatRooms[roomIndex].timestamp = new Date().toISOString();
      }
    } else {
      // 새 채팅방 생성
      const firstUserMessage = updatedMessages.find((m) => m.type === "user");
      const titleMaxLength = 25;
      const newRoom = {
        id: Date.now().toString(),
        category,
        title: firstUserMessage
          ? firstUserMessage.content.slice(0, titleMaxLength) +
            (firstUserMessage.content.length > titleMaxLength ? "..." : "")
          : "새 대화",
        lastMessage: updatedMessages[updatedMessages.length - 1].content.slice(0, 50),
        timestamp: new Date().toISOString(),
        messages: updatedMessages,
      };
      chatRooms.push(newRoom);

      // URL 업데이트 (새 채팅방 ID로)
      navigate(`/ai-chat/${category}/${newRoom.id}`, { replace: true });
    }

    localStorage.setItem("aiChatRooms", JSON.stringify(chatRooms));

    // 채팅방 목록 업데이트 이벤트 발생
    window.dispatchEvent(new Event("chatRoomsUpdated"));
  };

  const getAIResponse = (category: ChatCategory, userInput: string): string => {
    const responses: Record<ChatCategory, string> = {
      recommend:
        "말씀하신 취향에 따르면 '벚꽃 막걸리'를 추천드려요. 은은한 꽃향과 부드러운 단맛이 특징이에요. 현재 펀딩 중이니 한번 살펴보시겠어요?",
      pairing:
        "그 술과는 치즈나 견과류가 잘 어울려요. 특히 까망베르 치즈와 호두를 함께 드시면 풍미가 배가 됩니다.",
      brewery:
        "요청사항을 잘 정리했어요. 양조장 측에 전달하면 검토 후 답변을 드릴 거예요.",
      general:
        "전통주는 쌀, 누룩, 물을 주원료로 하여 발효시킨 우리나라 고유의 술이에요. 막걸리, 청주, 소주 등 다양한 종류가 있답니다.",
    };

    return responses[category] || "알겠습니다. 더 궁금한 점이 있으신가요?";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-white">
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
            {category ? categoryTitles[category] : "AI 챗봇"}
          </h1>
        </div>
      </div>

      {/* Content - 헤더와 입력창 사이 공간 */}
      <div className="fixed top-[57px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bottom-20 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-[#8B5A3C] text-white"
                    : "bg-gray-100 text-[#2B1810]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === "user" ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - 하단 고정 */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#8B5A3C] text-sm text-black"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                inputValue.trim()
                  ? "bg-[#8B5A3C] text-white hover:bg-[#6B4423]"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
