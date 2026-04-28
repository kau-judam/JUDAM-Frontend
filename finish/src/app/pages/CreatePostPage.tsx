import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";

export function CreatePostPage() {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState("자유");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const boards = ["자유", "정보"];

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("게시글 내용을 입력해주세요.");
      return;
    }
    console.log({ board: selectedBoard, title, content, imageCount });
    alert("게시글이 등록되었습니다!");
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Top App Bar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">새 게시글 작성</h1>
          {/* 오른쪽 등록 버튼 삭제 */}
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-14 px-4 py-6 space-y-6">
        {/* Category Selection */}
        <div className="pt-3">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            게시판 카테고리 선택
          </label>
          <div className="flex gap-2">
            {boards.map((board) => (
              <button
                key={board}
                onClick={() => setSelectedBoard(board)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedBoard === board
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {board}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input Area */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            className="bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400"
          />
        </div>

        {/* Content Input Area */}
        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="전통주에 대한 자유로운 생각이나 질문을 남겨보세요..."
            className="min-h-[300px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 text-base leading-relaxed resize-none focus:border-gray-400 focus:ring-0"
          />
        </div>

        {/* Image Upload */}
        <div>
          <button
            onClick={() => {
              if (imageCount < 5) {
                setImageCount(imageCount + 1);
              } else {
                alert("최대 5개까지 업로드 가능합니다.");
              }
            }}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 px-6 flex items-center justify-center gap-2 text-gray-600 hover:border-gray-500 hover:text-gray-800 transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">📷 사진 추가 ({imageCount}/5)</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-xl transition-colors"
          >
            게시글 등록하기
          </Button>
        </div>

        {/* Community Guidelines */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            주담은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 지향합니다. 타인을 비방하거나 모욕하는 글, 무분별한 홍보 게시물은 무통보 삭제될 수 있습니다. 깨끗한 전통주 문화를 위해 이용 규칙을 준수해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}