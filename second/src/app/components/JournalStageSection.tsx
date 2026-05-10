import { useState } from "react";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { JournalEntry, BrewingStage } from "../data/fundingData";

interface JournalStageSectionProps {
  stageId: BrewingStage;
  stageName: string;
  journals: JournalEntry[];
  onLikeJournal: (journalId: number) => void;
  onAddComment: (journalId: number, content: string) => void;
  onLikeComment: (journalId: number, commentId: number) => void;
  onAddReply: (journalId: number, commentId: number, content: string) => void;
  isJournalLiked: (journalId: number) => boolean;
  isCommentLiked: (commentId: number) => boolean;
}

export function JournalStageSection({
  stageId,
  stageName,
  journals,
  onLikeJournal,
  onAddComment,
  onLikeComment,
  onAddReply,
  isJournalLiked,
  isCommentLiked,
}: JournalStageSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedJournals, setExpandedJournals] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const sortedJournals = journals
    .filter((j) => j.stage === stageId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedJournals = showAll ? sortedJournals : sortedJournals.slice(0, 3);
  const hasMore = sortedJournals.length > 3;

  const toggleComments = (journalId: number) => {
    setExpandedJournals((prev) => {
      const next = new Set(prev);
      if (next.has(journalId)) {
        next.delete(journalId);
      } else {
        next.add(journalId);
      }
      return next;
    });
  };

  const handleAddComment = (journalId: number) => {
    const content = commentInputs[journalId]?.trim();
    if (content) {
      onAddComment(journalId, content);
      setCommentInputs({ ...commentInputs, [journalId]: "" });
    }
  };

  const handleAddReply = (journalId: number, commentId: number) => {
    const content = replyInputs[commentId]?.trim();
    if (content) {
      onAddReply(journalId, commentId, content);
      setReplyInputs({ ...replyInputs, [commentId]: "" });
      setReplyingTo(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
            sortedJournals.length > 0 ? "bg-black text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {stageId}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-black text-[16px] mb-3">{stageName}</h3>
          {sortedJournals.length > 0 ? (
            <div className="space-y-4">
              {displayedJournals.map((journal) => (
                <div key={journal.id} className="border-l-2 border-black pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-black">{journal.title}</p>
                    <span className="text-xs text-gray-500">{journal.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                    {journal.content}
                  </p>

                  {journal.images && journal.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {journal.images.map((img, idx) => (
                        <div key={idx} className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden">
                          <img src={img} alt={`${journal.title} ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {journal.videoUrl && (
                    <div className="mb-3 w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <iframe src={journal.videoUrl} title={journal.title} className="w-full h-full" allowFullScreen />
                    </div>
                  )}

                  {/* 좋아요 & 댓글 버튼 */}
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      onClick={() => onLikeJournal(journal.id)}
                      className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          isJournalLiked(journal.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                      <span className={`text-xs ${isJournalLiked(journal.id) ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                        {journal.likes || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleComments(journal.id)}
                      className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{journal.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* 댓글 섹션 */}
                  {expandedJournals.has(journal.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {/* 댓글 입력 */}
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          value={commentInputs[journal.id] || ""}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [journal.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleAddComment(journal.id);
                          }}
                          placeholder="댓글을 입력하세요..."
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors bg-white"
                        />
                        <button
                          onClick={() => handleAddComment(journal.id)}
                          className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>

                      {/* 댓글 목록 */}
                      <div className="space-y-2">
                        {journal.comments?.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-black">{comment.userName}</span>
                              <span className="text-xs text-gray-400">{comment.date}</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed mb-2">{comment.content}</p>

                            {/* 댓글 좋아요 & 답글 버튼 */}
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                onClick={() => onLikeComment(journal.id, comment.id)}
                                className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                              >
                                <Heart
                                  className={`w-3 h-3 transition-all ${
                                    isCommentLiked(comment.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                                  }`}
                                />
                                <span className={`text-xs ${isCommentLiked(comment.id) ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                                  {comment.likes || 0}
                                </span>
                              </button>
                              <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                              >
                                <MessageCircle className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">답글 {comment.replies?.length || 0}</span>
                              </button>
                            </div>

                            {/* 대댓글 목록 */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-300 pl-3">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="bg-white rounded-lg p-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-semibold text-black">{reply.userName}</span>
                                      <span className="text-xs text-gray-400">{reply.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-700 leading-relaxed mb-1">{reply.content}</p>
                                    <div className="flex items-center gap-1">
                                      <Heart className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">{reply.likes || 0}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 대댓글 입력 */}
                            {replyingTo === comment.id && (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={replyInputs[comment.id] || ""}
                                  onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") handleAddReply(journal.id, comment.id);
                                  }}
                                  placeholder="답글을 입력하세요..."
                                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors bg-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleAddReply(journal.id, comment.id)}
                                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {showAll ? (
                    <>
                      <span>접기</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>더보기 ({sortedJournals.length - 3}개 더)</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">아직 작성된 일지가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
