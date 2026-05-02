import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Video } from "lucide-react";
import { useFunding } from "../contexts/FundingContext";
import { useAuth } from "../contexts/AuthContext";
import { JournalEntry, BREWING_STAGES, BrewingStage } from "../data/fundingData";
import { toast } from "sonner";

export function BreweryJournalManagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProjectJournals } = useFunding();
  const { user } = useAuth();

  const project = projects.find((p) => p.id === Number(id));

  const [selectedStage, setSelectedStage] = useState<BrewingStage | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [] as string[],
    videoUrl: "",
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[52px] pb-20">
        <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  if (user?.type !== "brewery") {
    return (
      <div className="min-h-screen bg-gray-50 pt-[52px] pb-20">
        <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">양조장 계정만 접근할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  const journals = project.journals || [];

  const handleOpenEditor = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        title: entry.title,
        content: entry.content,
        images: entry.images || [],
        videoUrl: entry.videoUrl || "",
      });
    } else {
      setEditingEntry(null);
      setFormData({
        title: "",
        content: "",
        images: [],
        videoUrl: "",
      });
    }
    setShowEditor(true);
  };

  const handleSave = () => {
    if (!selectedStage) {
      toast.error("단계를 선택해주세요");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, "0")}. ${String(today.getDate()).padStart(2, "0")}`;

    const newEntry: JournalEntry = {
      id: editingEntry ? editingEntry.id : Math.max(0, ...journals.map((j) => j.id)) + 1,
      stage: selectedStage,
      date: editingEntry ? editingEntry.date : dateStr,
      title: formData.title,
      content: formData.content,
      images: formData.images.length > 0 ? formData.images : undefined,
      videoUrl: formData.videoUrl || undefined,
      likes: editingEntry ? editingEntry.likes : 0,
      comments: editingEntry ? editingEntry.comments : [],
    };

    const updatedJournals = editingEntry
      ? journals.map((j) => (j.id === editingEntry.id ? newEntry : j))
      : [...journals, newEntry];

    console.log("Saving journal:", newEntry);
    console.log("Updated journals:", updatedJournals);

    updateProjectJournals(Number(id), updatedJournals);

    toast.success(editingEntry ? "양조일지가 수정되었습니다" : "양조일지가 작성되었습니다");
    setShowEditor(false);
    setFormData({
      title: "",
      content: "",
      images: [],
      videoUrl: "",
    });
  };

  const handleDelete = (entryId: number) => {
    if (window.confirm("이 양조일지를 삭제하시겠습니까?")) {
      const updatedJournals = journals.filter((j) => j.id !== entryId);
      updateProjectJournals(Number(id), updatedJournals);
    }
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, dataUrl],
          }));
        };
        reader.readAsDataURL(file);
      });
    };

    input.click();
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const stageJournals = selectedStage ? journals.filter(j => j.stage === selectedStage) : [];
  const selectedStageName = selectedStage ? BREWING_STAGES.find(s => s.id === selectedStage)?.name : "";

  return (
    <div className="min-h-screen bg-gray-50 pt-[52px] pb-20">
      <div className="max-w-[430px] mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-[52px] z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedStage ? setSelectedStage(null) : navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-black">
                {selectedStage ? `${selectedStage}단계 일지` : "양조일지 관리"}
              </h1>
              <p className="text-xs text-gray-500">
                {selectedStage ? selectedStageName : project.title}
              </p>
            </div>
            {selectedStage && (
              <button
                onClick={() => handleOpenEditor()}
                className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>작성</span>
              </button>
            )}
          </div>
        </div>

        {/* Stage Selection or Journal List */}
        <div className="p-4 space-y-3">
          {!selectedStage ? (
            // Stage Selection
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">일지를 작성할 단계를 선택하세요</p>
              {BREWING_STAGES.map((stage) => {
                const stageJournalCount = journals.filter(j => j.stage === stage.id).length;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className="w-full bg-white rounded-2xl p-4 border border-gray-200 hover:border-black transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        stageJournalCount > 0 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {stage.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm mb-1">{stage.name}</h3>
                        <p className="text-xs text-gray-500">
                          {stageJournalCount > 0 ? `${stageJournalCount}개의 일지` : "작성된 일지 없음"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            // Journal List for Selected Stage
            <>
              {stageJournals.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">이 단계에 작성된 일지가 없습니다.</p>
                  <p className="text-gray-400 text-xs">
                    우측 상단 작성 버튼을 눌러 일지를 추가하세요!
                  </p>
                </div>
              ) : (
                stageJournals
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-black text-sm mb-1">{entry.title}</h3>
                          <p className="text-xs text-gray-500">{entry.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditor(entry)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      {(entry.images && entry.images.length > 0) || entry.videoUrl ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {entry.images && entry.images.length > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {entry.images.length}
                            </span>
                          )}
                          {entry.videoUrl && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              동영상
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))
              )}
            </>
          )}
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-[390px] w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-black text-lg">
                    {editingEntry ? "양조일지 수정" : "양조일지 작성"}
                  </h2>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedStage}단계: {selectedStageName}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="예: 원료 준비 완료"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm bg-white"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="프로젝트 진행 상황을 상세히 작성해주세요"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm resize-none bg-white"
                  />
                </div>

                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-black">이미지</label>
                    <button
                      onClick={handleAddImage}
                      className="flex items-center gap-1 text-xs text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>파일 선택</span>
                    </button>
                  </div>
                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group"
                        >
                          <img
                            src={img}
                            alt={`이미지 ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">추가된 이미지가 없습니다</p>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    동영상 URL (선택)
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="YouTube, Vimeo 등의 embed URL"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm bg-white"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-3xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!formData.title || !formData.content}
                    className="flex-1 py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
