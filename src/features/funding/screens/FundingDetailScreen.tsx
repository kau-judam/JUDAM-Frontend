import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Share as NativeShare,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Heart,
  ChevronLeft,
  Calendar,
  Target,
  MessageCircle,
  Star,
  ThumbsUp,
  Send,
  ChevronDown,
  ChevronUp,
  Bell,
  LayoutDashboard,
  Plus,
  Minus,
  Package,
  Share2,
  AlertTriangle,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BREWING_STAGES,
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
  isSupportableFundingStatus,
  sortFundingProjectsByPopularity,
} from '@/constants/data';
import type { BrewingStage, JournalComment, JournalReply } from '@/constants/data';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import { showLoginRequired } from '@/utils/authPrompt';

const initialComments = [
  {
    id: 1,
    userName: "김주담",
    content: "정말 기대되는 프로젝트예요! 언제쯤 배송이 가능할까요?",
    date: "2026. 03. 25",
    likes: 12,
    isBrewery: false,
    replies: [
      { id: 101, userName: "꽃샘양조장", content: "안녕하세요! 펀딩 마감 후 약 45일 이내에 배송 예정입니다. 감사합니다!", date: "2026. 03. 25", likes: 8, isBrewery: true },
    ],
  },
  { id: 2, userName: "이술사", content: "알코올 도수가 궁금합니다. 혹시 알려주실 수 있나요?", date: "2026. 03. 24", likes: 5, isBrewery: false, replies: [] },
];

const JOURNALS_PER_STAGE = 1;

function todayText() {
  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
}

function getInitialTab(tab?: string | string[]) {
  const targetTab = Array.isArray(tab) ? tab[0] : tab;
  if (targetTab === "journal") return "양조일지";
  if (targetTab === "qna") return "Q&A";
  if (targetTab === "review") return "후기";
  return "소개";
}

function getTabParam(tab: "소개" | "양조일지" | "Q&A" | "후기") {
  if (tab === "양조일지") return "journal";
  if (tab === "Q&A") return "qna";
  if (tab === "후기") return "review";
  return "intro";
}

export default function FundingDetailScreen() {
  const { id, tab, fromReview } = useLocalSearchParams<{ id?: string; tab?: string; fromReview?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const { projects, updateProjectJournals, fundingReviews } = useFunding();
  const rawProjectId = Array.isArray(id) ? id[0] : id;
  const projectId = Number(rawProjectId);
  const initialTab = getInitialTab(tab);
  const project = useMemo(() => projects.find((p) => p.id === projectId) || null, [projectId, projects]);
  const cameFromReviewDetail = Array.isArray(fromReview) ? fromReview[0] === "1" : fromReview === "1";
  
  const [activeTab, setActiveTab] = useState<"소개" | "양조일지" | "Q&A" | "후기">(initialTab);
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<{ title: string; body: string } | null>(null);
  const [showFundingOptionModal, setShowFundingOptionModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Q&A State
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set([1]));
  const [expandedJournalStages, setExpandedJournalStages] = useState<Set<BrewingStage>>(new Set());
  const [expandedJournalComments, setExpandedJournalComments] = useState<Set<number>>(new Set());
  const [expandedJournalReplies, setExpandedJournalReplies] = useState<Set<string>>(new Set());
  const [replyingToJournalComment, setReplyingToJournalComment] = useState<string | null>(null);
  const [journalCommentDrafts, setJournalCommentDrafts] = useState<Record<number, string>>({});
  const [journalReplyDrafts, setJournalReplyDrafts] = useState<Record<string, string>>({});
  const [likedJournals, setLikedJournals] = useState<Set<number>>(new Set());
  const [likedJournalComments, setLikedJournalComments] = useState<Set<string>>(new Set());
  const [likedJournalReplies, setLikedJournalReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActiveTab(getInitialTab(tab));
  }, [tab]);

  useEffect(() => {
    setComments(initialComments);
    setNewComment("");
    setReplyingTo(null);
    setReplyContent("");
    setLikedComments(new Set());
    setLikedReplies(new Set());
    setExpandedComments(new Set([1]));
    setExpandedJournalStages(new Set());
    setExpandedJournalComments(new Set());
    setExpandedJournalReplies(new Set());
    setReplyingToJournalComment(null);
    setJournalCommentDrafts({});
    setJournalReplyDrafts({});
    setLikedJournals(new Set());
    setLikedJournalComments(new Set());
    setLikedJournalReplies(new Set());
  }, [projectId]);

  if (!project) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 16 }}>프로젝트를 찾을 수 없습니다.</Text>
        <Button label="목록으로 돌아가기" onPress={() => router.back()} />
      </View>
    );
  }

  const progressPercentage = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified;
  const isOwnBreweryProject = isFundingProjectOwnedByBrewery(user, project);
  const unitPrice = project.pricePerBottle || 20000;
  const shippingFee = project.shippingFee ?? 2000;
  const optionTotalAmount = unitPrice * selectedQuantity + shippingFee;
  const projectBudget = project.budget || [
    { item: "원료비", amount: 180 },
    { item: "양조 인건비", amount: 150 },
    { item: "병입 및 포장 비용", amount: 100 },
    { item: "배송비", amount: 80 },
    { item: "디자인 및 마케팅", amount: 60 },
    { item: "플랫폼 수수료 7%", amount: 40 },
  ];
  const projectSchedule = project.schedule || [
    { date: "3월 20일", description: "펀딩 시작 및 원료 준비 완료" },
    { date: "4월 18일", description: "펀딩 종료 및 최종 레시피 확정" },
    { date: "4월 25일", description: "양조 시작" },
    { date: "5월 25일", description: "발효 완료 및 숙성" },
    { date: "6월 1일", description: "병입 및 라벨링 작업" },
    { date: "6월 15일", description: "배송 시작" },
  ];
  const tasteProfile = project.tasteProfile || {
    sweetness: 70,
    aroma: 55,
    acidity: 80,
    body: 65,
    carbonation: 75,
  };
  const tasteItems = [
    { label: "단맛", value: tasteProfile.sweetness },
    { label: "잔향", value: tasteProfile.aroma },
    { label: "산미", value: tasteProfile.acidity },
    { label: "바디감", value: tasteProfile.body },
    { label: "탄산감", value: tasteProfile.carbonation },
  ];
  const totalBudgetAmount = projectBudget.reduce((sum, item) => sum + item.amount, 0);
  const supportButtonLabel =
    isOwnBreweryProject
      ? "프로젝트 관리하기"
      : !isSupportableFundingStatus(project.status)
      ? project.status === "심사 중" || project.status === "펀딩 예정"
        ? "후원 준비중"
        : "펀딩 종료"
      : "프로젝트 후원하기";

  const recommendedProjects = sortFundingProjectsByPopularity(projects.filter(p => p.id !== project.id)).slice(0, 4);
  const journals = project.journals || [];
  const projectReviews = fundingReviews.filter(r => r.projectId === project.id);

  const handleSupportClick = () => {
    if (!user) {
      showLoginRequired('후원하려면 먼저 로그인해주세요.');
      return;
    }
    if (isOwnBreweryProject) {
      router.push(user.isBreweryVerified ? '/brewery/dashboard' as any : '/brewery/verification' as any);
      return;
    }
    if (!isSupportableFundingStatus(project.status)) return;
    setShowFundingOptionModal(true);
  };

  const handleHeaderBack = () => {
    if (cameFromReviewDetail) {
      router.replace('/funding' as any);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/funding' as any);
  };

  const handleConfirmFundingOption = () => {
    setShowFundingOptionModal(false);
    router.push(`/funding/support?id=${project.id}&quantity=${selectedQuantity}` as any);
  };

  const handleTabChange = (nextTab: "소개" | "양조일지" | "Q&A" | "후기") => {
    setActiveTab(nextTab);
    router.setParams({ tab: getTabParam(nextTab) } as any);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!user) {
      showLoginRequired('펀딩 Q&A 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const comment = {
      id: Date.now(),
      userName: user?.name || "나",
      content: newComment.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
      isBrewery: user?.type === "brewery",
      replies: [],
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;
    if (!user) {
      showLoginRequired('펀딩 Q&A 답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const newReply = {
      id: Date.now(),
      userName: user?.name || "나",
      content: replyContent.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      likes: 0,
      isBrewery: user?.type === "brewery",
    };
    setComments(comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c));
    setReplyContent("");
    setReplyingTo(null);
    setExpandedComments(new Set([...expandedComments, commentId]));
  };

  const toggleCommentLike = (commentId: number) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const newLiked = new Set(likedComments);
    let diff = 0;
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
      diff = -1;
    } else {
      newLiked.add(commentId);
      diff = 1;
    }
    setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + diff } : c));
    setLikedComments(newLiked);
  };

  const toggleReplyLike = (commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const uniqueId = commentId * 10000 + replyId;
    const newLiked = new Set(likedReplies);
    let diff = 0;
    if (newLiked.has(uniqueId)) {
      newLiked.delete(uniqueId);
      diff = -1;
    } else {
      newLiked.add(uniqueId);
      diff = 1;
    }
    setComments(comments.map(c => c.id === commentId ? {
      ...c,
      replies: c.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + diff } : r)
    } : c));
    setLikedReplies(newLiked);
  };

  const toggleExpandComment = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) newExpanded.delete(commentId);
    else newExpanded.add(commentId);
    setExpandedComments(newExpanded);
  };

  const handleFavoritePress = (targetProjectId: number) => {
    if (!user) {
      showLoginRequired('펀딩 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    toggleFavoriteFunding(targetProjectId);
  };

  const handleReplyOpen = (commentId: number) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    setReplyContent("");
    setExpandedComments(new Set([...expandedComments, commentId]));
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const toggleJournalStage = (stageId: BrewingStage) => {
    setExpandedJournalStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const toggleJournalComments = (journalId: number) => {
    setExpandedJournalComments((prev) => {
      const next = new Set(prev);
      if (next.has(journalId)) next.delete(journalId);
      else next.add(journalId);
      return next;
    });
  };

  const handleJournalLike = (journalId: number) => {
    if (!user) {
      showLoginRequired('양조일지 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const isLiked = likedJournals.has(journalId);
    updateProjectJournals(
      project.id,
      journals.map((entry) =>
        entry.id === journalId ? { ...entry, likes: Math.max(0, (entry.likes || 0) + (isLiked ? -1 : 1)) } : entry
      )
    );
    setLikedJournals((prev) => {
      const next = new Set(prev);
      if (next.has(journalId)) next.delete(journalId);
      else next.add(journalId);
      return next;
    });
  };

  const handleAddJournalComment = (journalId: number) => {
    const content = journalCommentDrafts[journalId]?.trim();
    if (!content) return;
    if (!user) {
      showLoginRequired('양조일지 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const commentIds = journals.flatMap((entry) => (entry.comments || []).map((comment) => comment.id));
    const nextComment: JournalComment = {
      id: Math.max(0, ...commentIds) + 1,
      journalId,
      userName: user.name || "사용자",
      isBrewery: user.type === "brewery",
      content,
      date: todayText(),
      likes: 0,
      replies: [],
    };

    updateProjectJournals(
      project.id,
      journals.map((entry) =>
        entry.id === journalId ? { ...entry, comments: [...(entry.comments || []), nextComment] } : entry
      )
    );
    setJournalCommentDrafts((prev) => ({ ...prev, [journalId]: "" }));
    setExpandedJournalComments((prev) => {
      const next = new Set(prev);
      next.add(journalId);
      return next;
    });
  };

  const handleJournalCommentLike = (journalId: number, commentId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const likeKey = `${journalId}:${commentId}`;
    const isLiked = likedJournalComments.has(likeKey);
    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (entry.id !== journalId) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: Math.max(0, (comment.likes || 0) + (isLiked ? -1 : 1)) }
              : comment
          ),
        };
      })
    );
    setLikedJournalComments((prev) => {
      const next = new Set(prev);
      if (next.has(likeKey)) next.delete(likeKey);
      else next.add(likeKey);
      return next;
    });
  };

  const handleJournalReplyOpen = (journalId: number, commentId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 답글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const replyKey = `${journalId}:${commentId}`;
    setExpandedJournalReplies((prev) => new Set([...prev, replyKey]));
    setReplyingToJournalComment(replyingToJournalComment === replyKey ? null : replyKey);
  };

  const handleAddJournalReply = (journalId: number, commentId: number) => {
    const replyKey = `${journalId}:${commentId}`;
    const content = journalReplyDrafts[replyKey]?.trim();
    if (!content) return;
    if (!user) {
      showLoginRequired('양조일지 댓글 답글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const replyIds = journals.flatMap((entry) =>
      (entry.comments || []).flatMap((comment) => (comment.replies || []).map((reply) => reply.id))
    );
    const nextReply: JournalReply = {
      id: Math.max(0, ...replyIds) + 1,
      commentId,
      userName: user.name || "사용자",
      isBrewery: user.type === "brewery",
      content,
      date: todayText(),
      likes: 0,
    };

    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (entry.id !== journalId) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) =>
            comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), nextReply] } : comment
          ),
        };
      })
    );
    setJournalReplyDrafts((prev) => ({ ...prev, [replyKey]: "" }));
    setReplyingToJournalComment(null);
    setExpandedJournalReplies((prev) => new Set([...prev, replyKey]));
  };

  const handleJournalReplyLike = (journalId: number, commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 답글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const likeKey = `${journalId}:${commentId}:${replyId}`;
    const isLiked = likedJournalReplies.has(likeKey);
    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (entry.id !== journalId) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              replies: (comment.replies || []).map((reply) =>
                reply.id === replyId
                  ? { ...reply, likes: Math.max(0, (reply.likes || 0) + (isLiked ? -1 : 1)) }
                  : reply
              ),
            };
          }),
        };
      })
    );
    setLikedJournalReplies((prev) => {
      const next = new Set(prev);
      if (next.has(likeKey)) next.delete(likeKey);
      else next.add(likeKey);
      return next;
    });
  };

  const handleReviewWrite = () => {
    if (!user) {
      showLoginRequired('후기 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    router.push(`/archive/review/${project.id}` as any);
  };

  const handleReviewPress = (reviewId: number) => {
    router.push(`/funding/${project.id}/review/${reviewId}` as any);
  };

  const handleShareProject = async () => {
    try {
      await NativeShare.share({
        title: project.title,
        message: `${project.title}\n${project.shortDescription || project.projectSummary || ''}\n주담 펀딩 프로젝트를 확인해보세요.`,
      });
      setShowShareModal(false);
    } catch {
      setFeedbackModal({
        title: '공유하기',
        body: '공유를 완료하지 못했습니다. 다시 시도해주세요.',
      });
    }
  };

  const handleSubmitReport = () => {
    if (!user) {
      setShowReportModal(false);
      showLoginRequired('프로젝트 신고는 로그인 후 이용할 수 있어요.');
      return;
    }
    if (!reportReason) {
      setFeedbackModal({
        title: '신고 사유 선택',
        body: '신고 사유를 선택해주세요.',
      });
      return;
    }
    setShowReportModal(false);
    setReportReason("");
    setReportDetail("");
    setFeedbackModal({
      title: '신고가 접수되었습니다',
      body: '검토 후 필요한 조치를 진행하겠습니다.',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* ── Fixed White Header ── */}
      <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 52 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleHeaderBack} style={styles.headerIconBtn}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>펀딩</Text>
        </View>
        <View style={styles.headerRight}>
           {isBrewery && (
             <TouchableOpacity onPress={() => router.push('/brewery/dashboard' as any)} style={styles.headerIconBtn}>
               <LayoutDashboard size={20} color="#111" />
             </TouchableOpacity>
           )}
           {isBrewery && (
             <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={styles.headerIconBtn}>
               <Bell size={20} color="#111" />
             </TouchableOpacity>
           )}
           <TouchableOpacity
             onPress={() => {
               if (!user) {
                 showLoginRequired('AI 챗봇은 로그인 후 이용할 수 있어요.');
                 return;
               }
               router.push('/ai-chat' as any);
             }}
             style={styles.headerIconBtn}
           >
             <MessageCircle size={20} color="#111" />
           </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Scroll ── */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[isOwnBreweryProject ? 5 : 4]}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 1. Hero Visual */}
        <View style={styles.visualContainer}>
           <Image source={getFundingProjectImageSource(project)} style={styles.mainImg} />
        </View>

        {/* 2. Title & Desc */}
        <Animated.View entering={FadeInUp} style={styles.titleSection}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <Text style={styles.shortDesc}>{project.shortDescription}</Text>
        </Animated.View>

        {/* 3. Funding Status */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.statusCard}>
          <View style={styles.statusGrid}>
             <View style={styles.statusItem}>
                <Text style={styles.statusVal}>{progressPercentage.toFixed(0)}%</Text>
                <Text style={styles.statusLab}>달성률</Text>
             </View>
             <View style={[styles.statusItem, styles.statusBorder]}>
                <Text style={styles.statusVal}>{(project.currentAmount / 10000).toLocaleString()}<Text style={{fontSize: 16, fontWeight: 'normal'}}>만원</Text></Text>
                <Text style={styles.statusLab}>모인금액</Text>
             </View>
             <View style={styles.statusItem}>
                <Text style={styles.statusVal}>{project.backers}</Text>
                <Text style={styles.statusLab}>후원자</Text>
             </View>
          </View>
          <Progress value={progressPercentage} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
          <View style={styles.dateInfo}>
             <View style={styles.dateRow}>
                <Calendar size={16} color="#4B5563" />
                <Text style={styles.dateTxt}>{isSupportableFundingStatus(project.status) ? `${project.daysLeft}일 남음` : getFundingStatusLabel(project.status)}</Text>
             </View>
             <Text style={styles.periodTxt}>{project.startDate} ~ {project.endDate}</Text>
          </View>
        </Animated.View>

        {/* 4. Brewery Info */}
        <Animated.View entering={FadeInUp.delay(200)} style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity style={styles.breweryCard} activeOpacity={0.8} onPress={() => router.push(`/brewery/${project.id}` as any)}>
             <View style={styles.breweryLogo}><Text style={{ fontSize: 24 }}>{project.breweryLogo}</Text></View>
             <View style={{ flex: 1 }}>
                <Text style={styles.breweryName}>{project.brewery}</Text>
                <Text style={styles.breweryLoc}>{project.location}</Text>
             </View>
             <View style={styles.catBadge}><Text style={styles.catTxt}>{project.category}</Text></View>
          </TouchableOpacity>
        </Animated.View>

        {isOwnBreweryProject && (
          <Animated.View entering={FadeInUp.delay(250)} style={styles.ownerJournalActionWrap}>
            <TouchableOpacity style={styles.ownerJournalAction} onPress={() => router.push(`/brewery/project/${project.id}/journal` as any)}>
              <Plus size={16} color="#FFF" />
              <Text style={styles.ownerJournalActionText}>양조일지 관리</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 5. Sticky Tabs */}
        <View style={styles.stickyTabWrapper}>
          <View style={styles.tabContainer}>
             {(["소개", "양조일지", "Q&A", "후기"] as const).map(tab => (
               <TouchableOpacity 
                 key={tab} 
                 style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} 
                 onPress={() => handleTabChange(tab)}
               >
                  <Text style={[styles.tabBtnTxt, activeTab === tab && styles.tabBtnTxtActive]}>{tab}</Text>
               </TouchableOpacity>
             ))}
          </View>
        </View>

        {/* 6. Tab Content */}
        <View style={styles.contentArea}>
           {activeTab === "소개" && (
             <Animated.View entering={FadeIn.duration(300)}>
                {/* Introduction Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 소개</Text>
                   
                   <View style={styles.recipeSummaryGrid}>
                      <View style={styles.ingCard}>
                         <View style={styles.ingRow}>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>메인재료</Text>
                               <Text style={styles.ingVal}>{project.mainIngredients || "국내산 쌀, 전통 누룩"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>서브재료</Text>
                               <Text style={styles.ingVal}>{project.subIngredients || "식용 벚꽃잎"}</Text>
                            </View>
                         </View>
                      </View>
                      <View style={styles.ingCardMini}>
                         <View style={styles.ingRow}>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>도수</Text>
                               <Text style={styles.ingVal}>{project.alcoholContent || "6%"}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>예상 배송일</Text>
                               <Text style={styles.ingVal}>{project.estimatedDelivery || "펀딩 종료 후 순차 배송"}</Text>
                            </View>
                         </View>
                      </View>
                   </View>

                   <View style={styles.summaryBox}>
                      <Text style={styles.summaryTitle}>📝 프로젝트 요약</Text>
                      <Text style={styles.summaryTxt}>{project.projectSummary || project.shortDescription}</Text>
                   </View>

                   <Text style={styles.bodyTxt}>
                     {project.story || `${project.title}는 전통 방식을 고수하면서도 현대적인 감각을 더한 특별한 프로젝트입니다.`}
                   </Text>
                </View>

                {/* Price Info Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>가격 안내</Text>
                   
                   <View style={styles.priceCard}>
                      <View style={[styles.priceStrip, { backgroundColor: '#111' }]} />
                      <View style={styles.priceContent}>
                         <View>
                            <Text style={styles.priceLab}>병당 단가</Text>
                            <Text style={styles.priceVal}>{unitPrice.toLocaleString()}<Text style={{ fontSize: 20, fontWeight: 'normal' }}>원</Text></Text>
                         </View>
                         <Text style={styles.priceSub}>{project.bottleSize || "375ml"}</Text>
                      </View>
                   </View>

                   <View style={[styles.priceCard, { marginTop: 12 }]}>
                      <View style={[styles.priceStrip, { backgroundColor: '#D1D5DB' }]} />
                      <View style={styles.priceContent}>
                         <View>
                            <Text style={styles.priceLab}>총 판매 수량</Text>
                            <Text style={styles.priceVal}>{(project.totalQuantity || 500).toLocaleString()}<Text style={{ fontSize: 20, fontWeight: 'normal' }}>병</Text></Text>
                         </View>
                         <Text style={styles.priceSub}>목표 수량</Text>
                      </View>
                   </View>

                   <View style={styles.totalGoalBox}>
                      <Text style={styles.totalGoalLab}>펀딩 목표 금액</Text>
                      <Text style={styles.totalGoalVal}>{project.goalAmount.toLocaleString()}원</Text>
                   </View>
                </View>

                {/* Budget Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 예산</Text>
                   {projectBudget.map((item) => (
                     <View key={item.item} style={styles.budgetRow}>
                       <Text style={styles.budgetLab}>{item.item}</Text>
                       <Text style={styles.budgetVal}>{item.amount.toLocaleString()}만원</Text>
                     </View>
                   ))}
                   <View style={[styles.budgetRow, styles.budgetTotal]}>
                     <Text style={styles.budgetTotalLab}>총 목표 금액</Text>
                     <Text style={styles.budgetTotalVal}>{totalBudgetAmount.toLocaleString()}만원</Text>
                   </View>
                   <Text style={styles.budgetGuide}>목표 금액을 초과 달성하는 경우, 추가 금액은 리워드 품질 향상과 더 많은 후원자 분들께 제품을 전달하는 데 사용됩니다.</Text>
                </View>

                {/* Schedule Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 일정</Text>
                   <View style={{ gap: 16 }}>
                     {projectSchedule.map((item, index) => (
                       <View key={`${item.date}-${item.description}`} style={styles.schRow}>
                         <Text style={styles.schDate}>{item.date}</Text>
                         <Text style={[styles.schDesc, index === projectSchedule.length - 1 && { fontWeight: '700', color: '#111' }]}>{item.description}</Text>
                       </View>
                     ))}
                   </View>
                   <View style={styles.schAlert}>
                      <Text style={styles.schAlertTxt}>💡 발효는 자연 과정이므로 기후 조건에 따라 일정이 1-2주 지연될 수 있습니다. 지연 시 양조 일지와 커뮤니티를 통해 실시간으로 소통하겠습니다.</Text>
                   </View>
                </View>

                {/* Taste Profile (SVG Radar Chart) */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>맛 지표</Text>
                   <Text style={styles.sectionSub}>양조장이 예상하는 이 전통주의 맛 프로필입니다.</Text>
                   
                   <View style={styles.radarContainer}>
                      <Svg viewBox="0 0 400 400" width="100%" height="250">
                        {[1, 0.75, 0.5, 0.25].map((scale) => (
                          <Polygon
                            key={scale}
                            points={[
                              [200, 200 - 150 * scale],
                              [200 + 142.5 * scale, 200 - 46.35 * scale],
                              [200 + 88.1 * scale, 200 + 121.35 * scale],
                              [200 - 88.1 * scale, 200 + 121.35 * scale],
                              [200 - 142.5 * scale, 200 - 46.35 * scale],
                            ].map(p => p.join(',')).join(' ')}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="1"
                          />
                        ))}
                        {[
                          [200, 50],
                          [342.5, 153.65],
                          [288.1, 321.35],
                          [111.9, 321.35],
                          [57.5, 153.65],
                        ].map((point, i) => (
                          <Line
                            key={`line-${i}`}
                            x1="200" y1="200" x2={point[0]} y2={point[1]}
                            stroke="#E5E7EB" strokeWidth="1"
                          />
                        ))}
                        <Polygon
                          points={[
                            [200, 200 - (tasteProfile.sweetness / 100) * 150],
                            [200 + (tasteProfile.aroma / 100) * 142.5, 200 - (tasteProfile.aroma / 100) * 46.35],
                            [200 + (tasteProfile.acidity / 100) * 88.1, 200 + (tasteProfile.acidity / 100) * 121.35],
                            [200 - (tasteProfile.body / 100) * 88.1, 200 + (tasteProfile.body / 100) * 121.35],
                            [200 - (tasteProfile.carbonation / 100) * 142.5, 200 - (tasteProfile.carbonation / 100) * 46.35],
                          ].map(p => p.join(',')).join(' ')}
                          fill="rgba(0, 0, 0, 0.2)"
                          stroke="rgba(0, 0, 0, 0.8)"
                          strokeWidth="2"
                        />
                        {[
                          { x: 200, y: 200 - (tasteProfile.sweetness / 100) * 150 },
                          { x: 200 + (tasteProfile.aroma / 100) * 142.5, y: 200 - (tasteProfile.aroma / 100) * 46.35 },
                          { x: 200 + (tasteProfile.acidity / 100) * 88.1, y: 200 + (tasteProfile.acidity / 100) * 121.35 },
                          { x: 200 - (tasteProfile.body / 100) * 88.1, y: 200 + (tasteProfile.body / 100) * 121.35 },
                          { x: 200 - (tasteProfile.carbonation / 100) * 142.5, y: 200 - (tasteProfile.carbonation / 100) * 46.35 },
                        ].map((point, i) => (
                          <Circle key={`circle-${i}`} cx={point.x} cy={point.y} r="4" fill="black" />
                        ))}
                        <SvgText x="200" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">단맛</SvgText>
                        <SvgText x="360" y="158" textAnchor="start" fontSize="14" fontWeight="bold" fill="#374151">잔향</SvgText>
                        <SvgText x="295" y="345" textAnchor="start" fontSize="14" fontWeight="bold" fill="#374151">산미</SvgText>
                        <SvgText x="105" y="345" textAnchor="end" fontSize="14" fontWeight="bold" fill="#374151">바디감</SvgText>
                        <SvgText x="40" y="158" textAnchor="end" fontSize="14" fontWeight="bold" fill="#374151">탄산감</SvgText>
                      </Svg>
                   </View>
                   <View style={styles.tasteGrid}>
                      {tasteItems.map(t => (
                        <View key={t.label} style={styles.tasteItemBox}>
                           <Text style={styles.tasteLab}>{t.label}</Text>
                           <View style={styles.tasteRowWrap}>
                              <View style={styles.tasteBarBg}>
                                 <View style={[styles.tasteBarFill, { width: `${t.value}%` }]} />
                              </View>
                              <Text style={styles.tasteVal}>{t.value}%</Text>
                           </View>
                        </View>
                      ))}
                   </View>
                </View>

                {/* Guide Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>안내사항</Text>
                   
                   <View style={{ marginBottom: 32 }}>
                     <Text style={styles.guideHeading}>📌 주담 크라우드 펀딩 안내</Text>
                     <View style={styles.guideBox}>
                        <Text style={styles.guideBoxTitle}>후원은 공동 기획의 시작입니다</Text>
                        <Text style={styles.guideBoxTxt}>주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 청약철회(7일 내 환불)가 적용되지 않습니다.</Text>
                     </View>
                     <View style={[styles.guideBox, { marginTop: 12 }]}>
                        <Text style={styles.guideBoxTitle}>술은 살아있는 생물입니다</Text>
                        <Text style={styles.guideBoxTxt}>전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다.</Text>
                     </View>
                     <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowFundingGuideModal(true)}>
                        <Text style={styles.guideLink}>🍶 주담의 펀딩 알아보기 (안내) →</Text>
                     </TouchableOpacity>
                   </View>

                   <View style={{ marginBottom: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                     <Text style={styles.guideHeading}>📄 프로젝트 정책</Text>
                     <View style={styles.guideBoxPlain}>
                        <Text style={styles.guideBoxTxt}><Text style={{fontWeight: '700', color: '#111'}}>환불:</Text> 프로젝트 마감 후 즉시 양조 공정이 시작되므로 단순 변심 환불은 불가합니다. 단, 양조장의 사정으로 생산이 불가능해질 경우 100% 환불을 보장합니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>교환/AS:</Text> 주류 배송 특성상 파손된 상태로 수령 시, 사진과 함께 접수해주시면 즉시 새 제품으로 교환해 드립니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>성인인증:</Text> 본 프로젝트는 성인인증을 완료한 후원자만 참여 가능하며, 배송 시 대리 수령이 제한될 수 있습니다.</Text>
                     </View>
                   </View>

                   <View style={{ paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                     <Text style={styles.guideHeading}>⚠️ 예상되는 어려움</Text>
                     <View style={styles.guideBoxPlain}>
                        <Text style={styles.guideBoxTxt}><Text style={{fontWeight: '700', color: '#111'}}>품질 변동:</Text> AI 검토와 전문가의 관리를 거치나, 기온 변화에 따라 도수나 당도가 기획안과 ±1~2% 정도 차이가 날 수 있습니다.</Text>
                        <Text style={[styles.guideBoxTxt, { marginTop: 12 }]}><Text style={{fontWeight: '700', color: '#111'}}>일정 지연:</Text> 술이 충분히 익지 않았을 경우, 최상의 맛을 위해 출고가 최대 10일 정도 지연될 수 있으며 이 경우 커뮤니티를 통해 즉시 공지하겠습니다.</Text>
                     </View>
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === "양조일지" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.journalList}>
                   {BREWING_STAGES.map((stage) => {
                     const stageEntries = journals.filter((entry) => entry.stage === stage.id).sort((a, b) => b.id - a.id);
                     const hasStageEntries = stageEntries.length > 0;
                     const isStageExpanded = expandedJournalStages.has(stage.id);
                     const visibleEntries = isStageExpanded ? stageEntries : stageEntries.slice(0, JOURNALS_PER_STAGE);
                     return (
                       <View key={stage.id} style={styles.sectionCard}>
                          <View style={styles.journalItem}>
                             <View style={hasStageEntries ? styles.journalStep : styles.journalStepUpcoming}>
                               <Text style={hasStageEntries ? styles.journalStepTxt : styles.journalStepTxtUpcoming}>{stage.id}</Text>
                             </View>
                             <View style={styles.journalStageContent}>
                                <View style={styles.journalStageHeader}>
                                   <Text style={hasStageEntries ? styles.journalTitle : styles.journalTitleUpcoming}>{stage.name}</Text>
                                   <Text style={styles.journalStageCount}>{hasStageEntries ? `${stageEntries.length}개 일지` : "작성된 일지 없음"}</Text>
                                </View>
                                {hasStageEntries ? (
                                  <View style={styles.journalEntries}>
                                    {visibleEntries.map((entry) => {
                                      const entryComments = entry.comments || [];
                                      const commentsOpen = expandedJournalComments.has(entry.id);
                                      const isJournalLiked = likedJournals.has(entry.id);
                                      return (
                                        <View key={entry.id} style={styles.journalEntryCard}>
                                          <View style={styles.journalEntryHeader}>
                                            <Text style={styles.journalEntryTitle} numberOfLines={2}>{entry.title}</Text>
                                            <Text style={styles.journalDate}>{entry.date}</Text>
                                          </View>
                                          <Text style={styles.journalBody}>{entry.content}</Text>

                                          {entry.images && entry.images.length > 0 && (
                                            <View style={styles.journalImageGrid}>
                                              {entry.images.map((image, imageIndex) => (
                                                <View key={`${entry.id}-${image}-${imageIndex}`} style={styles.journalImageCell}>
                                                  <Image source={{ uri: image }} style={styles.journalImage} />
                                                </View>
                                              ))}
                                            </View>
                                          )}

                                          <View style={styles.journalActionRow}>
                                            <TouchableOpacity style={styles.journalActionButton} onPress={() => handleJournalLike(entry.id)}>
                                              <Heart size={16} color={isJournalLiked ? "#EF4444" : "#9CA3AF"} fill={isJournalLiked ? "#EF4444" : "transparent"} />
                                              <Text style={[styles.journalActionText, isJournalLiked && styles.journalActionTextActive]}>{entry.likes || 0}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.journalActionButton} onPress={() => toggleJournalComments(entry.id)}>
                                              <MessageCircle size={16} color="#9CA3AF" />
                                              <Text style={styles.journalActionText}>{entryComments.length}</Text>
                                              {commentsOpen ? <ChevronUp size={14} color="#9CA3AF" /> : <ChevronDown size={14} color="#9CA3AF" />}
                                            </TouchableOpacity>
                                          </View>

                                          {commentsOpen && (
                                            <View style={styles.journalCommentsPanel}>
                                              {user ? (
                                                <View style={styles.journalCommentInputRow}>
                                                  <TextInput
                                                    style={styles.journalCommentInput}
                                                    value={journalCommentDrafts[entry.id] || ""}
                                                    onChangeText={(text) => setJournalCommentDrafts((prev) => ({ ...prev, [entry.id]: text }))}
                                                    placeholder="댓글을 입력하세요..."
                                                    placeholderTextColor="#9CA3AF"
                                                    returnKeyType="send"
                                                    onSubmitEditing={() => handleAddJournalComment(entry.id)}
                                                  />
                                                  <TouchableOpacity style={styles.journalCommentSend} onPress={() => handleAddJournalComment(entry.id)}>
                                                    <Send size={15} color="#FFF" />
                                                  </TouchableOpacity>
                                                </View>
                                              ) : (
                                                <TouchableOpacity style={styles.journalGuestButton} onPress={() => showLoginRequired('양조일지 댓글은 로그인 후 이용할 수 있어요.')}>
                                                  <Text style={styles.guestActionText}>로그인하고 댓글 작성하기</Text>
                                                </TouchableOpacity>
                                              )}

                                              {entryComments.length > 0 ? (
                                                <View style={styles.journalCommentList}>
                                                  {entryComments.map((comment) => {
                                                    const commentLikeKey = `${entry.id}:${comment.id}`;
                                                    const replyKey = `${entry.id}:${comment.id}`;
                                                    const isCommentLiked = likedJournalComments.has(commentLikeKey);
                                                    const commentReplies = comment.replies || [];
                                                    const repliesOpen = expandedJournalReplies.has(replyKey);
                                                    return (
                                                      <View key={comment.id} style={styles.journalCommentCard}>
                                                        <View style={styles.journalCommentMeta}>
                                                          <Text style={styles.commentUser}>{comment.userName}</Text>
                                                          {comment.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                                          <Text style={styles.commentDate}>{comment.date}</Text>
                                                        </View>
                                                        <Text style={styles.journalCommentText}>{comment.content}</Text>
                                                        <View style={styles.journalCommentActions}>
                                                          <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalCommentLike(entry.id, comment.id)}>
                                                            <Heart size={13} color={isCommentLiked ? "#EF4444" : "#9CA3AF"} fill={isCommentLiked ? "#EF4444" : "transparent"} />
                                                            <Text style={[styles.journalCommentLikeText, isCommentLiked && styles.journalActionTextActive]}>{comment.likes || 0}</Text>
                                                          </TouchableOpacity>
                                                          <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalReplyOpen(entry.id, comment.id)}>
                                                            <MessageCircle size={13} color="#9CA3AF" />
                                                            <Text style={styles.journalCommentLikeText}>답글</Text>
                                                          </TouchableOpacity>
                                                          {commentReplies.length > 0 && (
                                                            <TouchableOpacity
                                                              style={styles.journalCommentAction}
                                                              onPress={() =>
                                                                setExpandedJournalReplies((prev) => {
                                                                  const next = new Set(prev);
                                                                  if (next.has(replyKey)) next.delete(replyKey);
                                                                  else next.add(replyKey);
                                                                  return next;
                                                                })
                                                              }
                                                            >
                                                              {repliesOpen ? <ChevronUp size={13} color="#9CA3AF" /> : <ChevronDown size={13} color="#9CA3AF" />}
                                                              <Text style={styles.journalCommentLikeText}>{commentReplies.length}개 답글</Text>
                                                            </TouchableOpacity>
                                                          )}
                                                        </View>

                                                        {repliesOpen && commentReplies.length > 0 && (
                                                          <View style={styles.journalReplyList}>
                                                            {commentReplies.map((reply) => {
                                                              const replyLikeKey = `${entry.id}:${comment.id}:${reply.id}`;
                                                              const isReplyLiked = likedJournalReplies.has(replyLikeKey);
                                                              return (
                                                                <View key={reply.id} style={styles.journalReplyCard}>
                                                                  <View style={styles.journalCommentMeta}>
                                                                    <Text style={styles.commentUser}>{reply.userName}</Text>
                                                                    {reply.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                                                    <Text style={styles.commentDate}>{reply.date}</Text>
                                                                  </View>
                                                                  <Text style={styles.journalCommentText}>{reply.content}</Text>
                                                                  <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalReplyLike(entry.id, comment.id, reply.id)}>
                                                                    <Heart size={12} color={isReplyLiked ? "#EF4444" : "#9CA3AF"} fill={isReplyLiked ? "#EF4444" : "transparent"} />
                                                                    <Text style={[styles.journalCommentLikeText, isReplyLiked && styles.journalActionTextActive]}>{reply.likes || 0}</Text>
                                                                  </TouchableOpacity>
                                                                </View>
                                                              );
                                                            })}
                                                          </View>
                                                        )}

                                                        {replyingToJournalComment === replyKey && (
                                                          <View style={styles.journalReplyInputRow}>
                                                            <TextInput
                                                              style={styles.journalReplyInput}
                                                              value={journalReplyDrafts[replyKey] || ""}
                                                              onChangeText={(text) => setJournalReplyDrafts((prev) => ({ ...prev, [replyKey]: text }))}
                                                              placeholder="답글을 입력하세요..."
                                                              placeholderTextColor="#9CA3AF"
                                                              returnKeyType="send"
                                                              onSubmitEditing={() => handleAddJournalReply(entry.id, comment.id)}
                                                              autoFocus
                                                            />
                                                            <TouchableOpacity style={styles.journalReplySend} onPress={() => handleAddJournalReply(entry.id, comment.id)}>
                                                              <Send size={14} color="#FFF" />
                                                            </TouchableOpacity>
                                                          </View>
                                                        )}
                                                      </View>
                                                    );
                                                  })}
                                                </View>
                                              ) : (
                                                <Text style={styles.journalEmptyCommentText}>첫 번째 댓글을 남겨보세요.</Text>
                                              )}
                                            </View>
                                          )}
                                        </View>
                                      );
                                    })}

                                    {stageEntries.length > JOURNALS_PER_STAGE && (
                                      <TouchableOpacity style={styles.journalMoreButton} onPress={() => toggleJournalStage(stage.id)}>
                                        <Text style={styles.journalMoreText}>
                                          {isStageExpanded ? "접기" : `더보기 (${stageEntries.length - JOURNALS_PER_STAGE}개 더)`}
                                        </Text>
                                        {isStageExpanded ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                ) : (
                                  <Text style={styles.journalBodyUpcoming}>{stage.name} 단계는 아직 작성된 일지가 없습니다.</Text>
                                )}
                             </View>
                          </View>
                       </View>
                     );
                   })}
                </View>
             </Animated.View>
           )}

           {activeTab === "Q&A" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>Q&A</Text>
                   {user ? (
                     <View style={styles.qaInputRow}>
                        <TextInput
                          style={styles.qaInput}
                          placeholder="댓글을 입력하세요..."
                          placeholderTextColor="#9CA3AF"
                          value={newComment}
                          onChangeText={setNewComment}
                          returnKeyType="send"
                          onSubmitEditing={handleAddComment}
                        />
                        <TouchableOpacity style={styles.qaSend} onPress={handleAddComment}>
                           <Send size={20} color="#FFF" />
                        </TouchableOpacity>
                     </View>
                   ) : (
                     <TouchableOpacity style={styles.guestActionButton} onPress={() => showLoginRequired('펀딩 Q&A 댓글은 로그인 후 이용할 수 있어요.')}>
                       <Text style={styles.guestActionText}>로그인하고 댓글 작성하기</Text>
                     </TouchableOpacity>
                   )}

                   <View style={styles.commentList}>
                      {comments.map((c, index) => (
                        <View key={c.id} style={[styles.commentCard, index === comments.length - 1 && { borderBottomWidth: 0 }]}>
                           <View style={styles.commentTop}>
                              <LinearGradient colors={['#E5E7EB', '#D1D5DB']} style={styles.commentAvatar}>
                                 <Text style={styles.avatarTxt}>{c.userName[0]}</Text>
                              </LinearGradient>
                              <View style={{ flex: 1 }}>
                                 <View style={styles.commentMeta}>
                                    <Text style={styles.commentUser}>{c.userName}</Text>
                                    {c.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                    <Text style={styles.commentDate}>{c.date}</Text>
                                 </View>
                                 <Text style={styles.commentTxt}>{c.content}</Text>
                              </View>
                           </View>

                           <View style={styles.commentActions}>
                              <TouchableOpacity style={styles.commentAction} onPress={() => toggleCommentLike(c.id)}>
                                 <ThumbsUp size={16} color={likedComments.has(c.id) ? "#111" : "#9CA3AF"} fill={likedComments.has(c.id) ? "#111" : "transparent"} />
                                 <Text style={[styles.actionTxt, likedComments.has(c.id) && { color: "#111" }]}>{c.likes}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.commentAction} onPress={() => handleReplyOpen(c.id)}>
                                 <MessageCircle size={16} color="#9CA3AF" />
                                 <Text style={styles.actionTxt}>답글</Text>
                              </TouchableOpacity>
                              {c.replies.length > 0 && (
                                <TouchableOpacity style={styles.commentAction} onPress={() => toggleExpandComment(c.id)}>
                                   {expandedComments.has(c.id) ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
                                   <Text style={styles.actionTxt}>{c.replies.length}개 답글</Text>
                                </TouchableOpacity>
                              )}
                           </View>

                           {expandedComments.has(c.id) && c.replies.length > 0 && (
                             <View style={styles.repliesWrapper}>
                               {c.replies.map(r => (
                                 <View key={r.id} style={styles.replyCard}>
                                    <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.replyAvatar}>
                                       <Text style={styles.replyAvatarTxt}>{r.userName[0]}</Text>
                                    </LinearGradient>
                                    <View style={{ flex: 1 }}>
                                       <View style={styles.commentMeta}>
                                          <Text style={styles.commentUser}>{r.userName}</Text>
                                          {r.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                          <Text style={styles.commentDate}>{r.date}</Text>
                                       </View>
                                       <Text style={styles.commentTxt}>{r.content}</Text>
                                       <TouchableOpacity style={styles.replyLikeBtn} onPress={() => toggleReplyLike(c.id, r.id)}>
                                          <ThumbsUp size={12} color={likedReplies.has(c.id * 10000 + r.id) ? "#111" : "#9CA3AF"} fill={likedReplies.has(c.id * 10000 + r.id) ? "#111" : "transparent"} />
                                          <Text style={[styles.replyLikeTxt, likedReplies.has(c.id * 10000 + r.id) && { color: "#111" }]}>{r.likes}</Text>
                                       </TouchableOpacity>
                                    </View>
                                 </View>
                               ))}
                             </View>
                           )}

                           {replyingTo === c.id && (
                             <View style={styles.replyInputRow}>
                                <TextInput 
                                  style={styles.replyInput} 
                                  placeholder="답글을 입력하세요..." 
                                  placeholderTextColor="#9CA3AF"
                                  value={replyContent} 
                                  onChangeText={setReplyContent} 
                                  returnKeyType="send"
                                  onSubmitEditing={() => handleAddReply(c.id)}
                                  autoFocus
                                />
                                <TouchableOpacity style={styles.replySend} onPress={() => handleAddReply(c.id)}>
                                   <Send size={16} color="#FFF" />
                                </TouchableOpacity>
                             </View>
                           )}
                        </View>
                      ))}

                      {comments.length === 0 && (
                        <View style={styles.emptyComments}>
                           <MessageCircle size={48} color="#D1D5DB" />
                           <Text style={styles.emptyCommentsTxt}>첫 번째 댓글을 남겨보세요!</Text>
                        </View>
                      )}
                   </View>
                </View>
             </Animated.View>
           )}

           {activeTab === "후기" && (
             <Animated.View entering={FadeIn}>
                <View style={styles.sectionCard}>
                   <View style={styles.rowBetweenHeader}>
                      <Text style={styles.sectionHeaderTitle}>후원자 후기</Text>
                      {!isSupportableFundingStatus(project.status) && <Text style={styles.countTxt}>{projectReviews.length}개</Text>}
                   </View>
                   
                   {isSupportableFundingStatus(project.status) ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircle}>
                           <Target size={32} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>펀딩이 진행중입니다!</Text>
                        <Text style={styles.emptySub}>펀딩이 완료되면 후기를 확인할 수 있어요</Text>
                     </View>
                   ) : projectReviews.length === 0 ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircleDashed}>
                           <Star size={36} color="#D1D5DB" />
                        </View>
                        <Text style={styles.emptyTitle}>아직 후기가 없어요</Text>
                        <Text style={styles.emptySubMulti}>이 술을 마셔본 첫 번째 후기를{'\n'}남겨주세요! 다른 분들에게 큰 도움이 돼요 🍶</Text>
                        <TouchableOpacity style={styles.writeReviewBtn} onPress={handleReviewWrite}>
                           <Star size={16} color="#FFF" />
                           <Text style={styles.writeReviewTxt}>첫 번째 후기 작성하기</Text>
                        </TouchableOpacity>
                     </View>
                   ) : (
                     <View style={styles.reviewList}>
                        {projectReviews.map((r) => (
                          <TouchableOpacity key={r.id} style={styles.reviewCard} activeOpacity={0.85} onPress={() => handleReviewPress(r.id)}>
                             <View style={styles.rowBetween}>
                                <View>
                                   <Text style={styles.reviewUser}>{r.userName}</Text>
                                   <View style={styles.starRow}>
                                      {[1,2,3,4,5].map(s => <Star key={s} size={14} color={s <= r.rating ? "#F59E0B" : "#E5E7EB"} fill={s <= r.rating ? "#F59E0B" : "transparent"} />)}
                                   </View>
                                   <Text style={styles.reviewReward} numberOfLines={1}>{r.rewardName}</Text>
                                </View>
                                <Text style={styles.reviewDate}>{r.date}</Text>
                             </View>
                             <Text style={styles.reviewTxt} numberOfLines={3}>{r.comment}</Text>
                             {r.tags.length > 0 && (
                               <View style={styles.reviewTagRow}>
                                 {r.tags.slice(0, 3).map((tag) => (
                                   <View key={tag} style={styles.reviewTagChip}>
                                     <Text style={styles.reviewTagText}>#{tag}</Text>
                                   </View>
                                 ))}
                               </View>
                             )}
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.writeReviewOutline} onPress={handleReviewWrite}>
                           <Text style={styles.writeReviewOutlineTxt}>✏️ 나도 후기 작성하기</Text>
                        </TouchableOpacity>
                     </View>
                   )}
                </View>
             </Animated.View>
           )}
        </View>

        <View style={styles.shareReportArea}>
          <TouchableOpacity style={styles.shareReportButton} onPress={() => setShowShareModal(true)} activeOpacity={0.85}>
            <Share2 size={16} color="#4B5563" />
            <Text style={styles.shareReportText}>공유하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareReportButton} onPress={() => setShowReportModal(true)} activeOpacity={0.85}>
            <AlertTriangle size={16} color="#4B5563" />
            <Text style={styles.shareReportText}>신고하기</Text>
          </TouchableOpacity>
        </View>

        {/* 7. Recommendations */}
        <View style={styles.recommendArea}>
           <View style={styles.rowBetweenHeader}>
              <Text style={styles.sectionHeaderTitle}>다른 프로젝트 둘러보기</Text>
              <TouchableOpacity onPress={() => router.push('/funding')}>
                 <Text style={styles.guideLink}>더보기</Text>
              </TouchableOpacity>
           </View>
           <View style={styles.recGrid}>
             {recommendedProjects.map(p => (
               <TouchableOpacity key={p.id} style={styles.recCard} onPress={() => router.push(`/funding/${p.id}`)}>
                  <View style={styles.recThumbBox}>
                     <Image source={getFundingProjectImageSource(p)} style={styles.recImg} />
                     <TouchableOpacity
                       style={styles.recHeart}
                       onPress={(event) => {
                         event.stopPropagation();
                         handleFavoritePress(p.id);
                       }}
                     >
                        <Heart size={16} color={isFavoriteFunding(p.id) ? "#EF4444" : "#FFF"} fill={isFavoriteFunding(p.id) ? "#EF4444" : "transparent"} />
                     </TouchableOpacity>
                  </View>
                  <View style={styles.recContent}>
                     <View style={styles.recTopRow}>
                        <Text style={styles.recBrewery}>{p.brewery}</Text>
                        <View style={styles.catBadge}><Text style={styles.catTxt}>{p.category}</Text></View>
                        {isCompletedFundingStatus(p.status) && (
                          <View style={styles.recSuccessBadge}><Text style={styles.recSuccessTxt}>성사됨</Text></View>
                        )}
                     </View>
                     <Text style={styles.recTitle} numberOfLines={2}>{p.title}</Text>
                     <View style={styles.recFooter}>
                        <View style={styles.recFooterLeft}>
                           <Text style={styles.recPct}>{Math.min((p.currentAmount/p.goalAmount)*100, 100).toFixed(0)}%</Text>
                           <Text style={styles.recAmt}>{(p.currentAmount / 10000).toLocaleString()}만원</Text>
                        </View>
                        <Text style={styles.recDays}>{isCompletedFundingStatus(p.status) ? "종료" : `${p.daysLeft}일 남음`}</Text>
                     </View>
                  </View>
               </TouchableOpacity>
             ))}
           </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
         <TouchableOpacity style={styles.heartBtn} onPress={() => handleFavoritePress(project.id)}>
            <Heart size={24} color={isFavoriteFunding(project.id) ? "#EF4444" : "#111"} fill={isFavoriteFunding(project.id) ? "#EF4444" : "transparent"} />
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.mainSupportBtn, !isOwnBreweryProject && !isSupportableFundingStatus(project.status) && { backgroundColor: '#374151' }]}
           disabled={!isOwnBreweryProject && !isSupportableFundingStatus(project.status)}
           onPress={handleSupportClick}
         >
            <Text style={styles.mainSupportTxt}>{supportButtonLabel}</Text>
         </TouchableOpacity>
      </View>

      <Modal visible={showFundingOptionModal} animationType="fade" transparent>
        <View style={styles.optionOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowFundingOptionModal(false)} />
          <Animated.View entering={SlideInDown} style={styles.optionModal}>
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>후원 옵션 선택</Text>
              <TouchableOpacity style={styles.optionClose} onPress={() => setShowFundingOptionModal(false)}>
                <Text style={styles.optionCloseTxt}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionBody}>
              <View style={styles.optionProjectBox}>
                <Image source={getFundingProjectImageSource(project)} style={styles.optionProjectImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionBrewery}>{project.brewery}</Text>
                  <Text style={styles.optionProjectTitle} numberOfLines={2}>{project.title}</Text>
                </View>
              </View>

              <View style={styles.optionSpecGrid}>
                <View style={styles.optionSpecCard}>
                  <Text style={styles.optionSpecLabel}>용량</Text>
                  <Text style={styles.optionSpecValue}>{project.bottleSize || "375ml"}</Text>
                </View>
                <View style={styles.optionSpecCard}>
                  <Text style={styles.optionSpecLabel}>도수</Text>
                  <Text style={styles.optionSpecValue}>{project.alcoholContent || "6%"}</Text>
                </View>
              </View>

              <View style={styles.quantityBox}>
                <TouchableOpacity style={styles.quantityControl} onPress={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}>
                  <Minus size={20} color="#4B5563" />
                </TouchableOpacity>
                <View style={styles.quantityCenter}>
                  <Text style={styles.quantityValue}>{selectedQuantity}</Text>
                  <Text style={styles.quantityUnit}>병</Text>
                </View>
                <TouchableOpacity style={styles.quantityControl} onPress={() => setSelectedQuantity(selectedQuantity + 1)}>
                  <Plus size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionPriceBox}>
                <View style={styles.optionPriceRow}>
                  <Text style={styles.optionPriceLabel}>상품 금액</Text>
                  <Text style={styles.optionPriceValue}>{(unitPrice * selectedQuantity).toLocaleString()}원</Text>
                </View>
                <View style={styles.optionPriceRow}>
                  <Text style={styles.optionPriceLabel}>배송비</Text>
                  <Text style={styles.optionPriceValue}>{shippingFee.toLocaleString()}원</Text>
                </View>
                <View style={styles.optionPriceDivider} />
                <View style={styles.optionPriceRow}>
                  <Text style={styles.optionTotalLabel}>총 결제 금액</Text>
                  <Text style={styles.optionTotalValue}>{optionTotalAmount.toLocaleString()}원</Text>
                </View>
              </View>

              <View style={styles.deliveryNotice}>
                <Package size={16} color="#1D4ED8" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliveryNoticeTitle}>예상 배송일</Text>
                  <Text style={styles.deliveryNoticeTxt}>{project.estimatedDelivery || "펀딩 종료 후 순차 발송"} 순차 발송 예정</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.optionConfirmBtn} onPress={handleConfirmFundingOption}>
                <Text style={styles.optionConfirmTxt}>후원하기</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showShareModal} animationType="fade" transparent>
        <View style={styles.actionModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowShareModal(false)} />
          <Animated.View entering={SlideInDown} style={styles.actionModal}>
            <View style={styles.actionModalHeader}>
              <Text style={styles.actionModalTitle}>공유하기</Text>
              <TouchableOpacity style={styles.actionModalClose} onPress={() => setShowShareModal(false)}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.actionModalBody}>이 프로젝트를 친구들과 공유해보세요!</Text>
            <TouchableOpacity style={styles.actionPrimaryButton} onPress={handleShareProject}>
              <Share2 size={18} color="#FFF" />
              <Text style={styles.actionPrimaryText}>공유하기</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showReportModal} animationType="fade" transparent>
        <View style={styles.actionModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowReportModal(false)} />
          <Animated.View entering={SlideInDown} style={styles.reportModal}>
            <View style={styles.actionModalHeader}>
              <Text style={styles.actionModalTitle}>프로젝트 신고</Text>
              <TouchableOpacity style={styles.actionModalClose} onPress={() => setShowReportModal(false)}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.reportLabel}>신고 사유 *</Text>
            <View style={styles.reportReasonList}>
              {[
                ['fraud', '사기 / 허위 정보'],
                ['inappropriate', '부적절한 내용'],
                ['copyright', '저작권 침해'],
                ['illegal', '불법 제품'],
                ['other', '기타'],
              ].map(([value, label]) => (
                <TouchableOpacity key={value} style={[styles.reportReasonButton, reportReason === value && styles.reportReasonButtonActive]} onPress={() => setReportReason(value)}>
                  <Text style={[styles.reportReasonText, reportReason === value && styles.reportReasonTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.reportLabel}>상세 내용</Text>
            <TextInput
              style={styles.reportTextArea}
              value={reportDetail}
              onChangeText={setReportDetail}
              placeholder="신고 사유를 자세히 작성해주세요"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.reportWarningBox}>
              <Text style={styles.reportWarningText}>⚠️ 허위 신고 시 서비스 이용이 제한될 수 있습니다.</Text>
            </View>
            <View style={styles.reportFooter}>
              <TouchableOpacity style={styles.reportCancelButton} onPress={() => setShowReportModal(false)}>
                <Text style={styles.reportCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportSubmitButton} onPress={handleSubmitReport}>
                <Text style={styles.reportSubmitText}>신고하기</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={Boolean(feedbackModal)} animationType="fade" transparent>
        <View style={styles.actionModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setFeedbackModal(null)} />
          <Animated.View entering={SlideInDown} style={styles.actionModal}>
            <Text style={styles.actionModalTitle}>{feedbackModal?.title}</Text>
            <Text style={styles.actionModalBody}>{feedbackModal?.body}</Text>
            <TouchableOpacity style={styles.actionPrimaryButton} onPress={() => setFeedbackModal(null)}>
              <Text style={styles.actionPrimaryText}>확인</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* ── Funding Guide Modal ── */}
      <Modal visible={showFundingGuideModal} animationType="fade" transparent>
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowFundingGuideModal(false)} />
            <Animated.View entering={SlideInDown} style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>🍶 주담 펀딩 안내</Text>
                  <TouchableOpacity onPress={() => setShowFundingGuideModal(false)} style={styles.modalCloseIcon}>
                     <Text style={{ fontSize: 24, color: '#6B7280' }}>×</Text>
                  </TouchableOpacity>
               </View>
               <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담 펀딩이란 무엇이죠?</Text>
                     <Text style={styles.modalTxt}>주담 펀딩은 혁신적인 전통주 레시피 아이디어를 가진 <Text style={{fontWeight: '700', color: '#111'}}>개인(기획자)</Text>과 이를 실제 술로 빚어낼 수 있는 전문 양조장이 만나, 다수의 후원자와 함께 새로운 우리 술을 탄생시키는 과정입니다.</Text>
                  </View>
                  
                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담 펀딩은 어떤 방식으로 진행되나요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담 펀딩은 기획자와 양조장, 그리고 후원자가 함께 <Text style={{fontWeight: '700', color: '#111'}}>세상에 없던 나만의 술</Text>을 완성해 나가는 협업 프로젝트입니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>기획자 및 양조장:</Text>
                           <Text style={styles.stepBody}>AI 검토를 거친 레시피를 바탕으로 프로젝트 개설하여 제조에 필요한 예산을 모금합니다. 펀딩에 성공하면 약속한 전통주를 정성껏 빚어 후원자에게 전달합니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>후원자:</Text>
                           <Text style={styles.stepBody}>자신의 취향에 맞는 레시피 프로젝트에 후원하며 공동 기획자로 참여합니다. 펀딩 성공 시, 숙성 기간을 거쳐 완성된 나만의 전통주를 리워드로 받아보실 수 있습니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>소통의 의무:</Text>
                           <Text style={styles.stepBody}>전통주는 발효 식품 특성상 기상 조건이나 효모의 활동에 따라 일정이 지연되거나 풍미가 미세하게 변할 수 있습니다. 양조장은 이러한 변동 사항을 후원자에게 즉시 알리고 성실히 설명할 의무가 있습니다.</Text>
                        </View>
                        <View style={styles.modalStepBlueBox}>
                           <Text style={styles.stepBlueLab}>결제 안내:</Text>
                           <Text style={styles.stepBlueBody}>펀딩은 목표 금액에 도달했을 때만 성사되며, 목표 미달 시 프로젝트는 무산되고 결제는 진행되지 않습니다.</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>후원이란 무엇인가요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담에서의 후원은 단순히 만들어진 술을 구매하는 전자상거래가 아닙니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>가치의 지지:</Text>
                           <Text style={styles.stepBody}>아직 세상에 나오지 않은 전통주 레시피가 실현될 수 있도록 자금을 지원하고 응원하는 일입니다. 그 보답으로 양조 전문가가 완성한 고품질의 전통주를 리워드로 제공받습니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>변수의 수용:</Text>
                           <Text style={styles.stepBody}>발효와 숙성이라는 자연의 공정을 거치므로, 안내된 일정보다 조금 늦어지거나 맛의 밸런스가 전문가의 보정 과정에서 일부 조정될 수 있음을 이해해 주셔야 합니다.</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.modalDivider} />
                  
                  <View style={{ marginBottom: 24 }}>
                     <Text style={styles.modalSecTitle}>주담은 이 과정에서 무엇을 하나요?</Text>
                     <Text style={[styles.modalTxt, { marginBottom: 16 }]}>주담은 사용자의 아이디어가 안전하게 제품화될 수 있도록 신뢰의 연결고리 역할을 합니다.</Text>
                     
                     <View style={{ gap: 16 }}>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>AI 레시피 검토:</Text>
                           <Text style={styles.stepBody}>실현 불가능하거나 주세법에 어긋나는 레시피를 AI가 1차적으로 필터링하여 안전한 프로젝트만 소개합니다.</Text>
                        </View>
                        <View style={styles.modalStepBox}>
                           <Text style={styles.stepLab}>투명한 공정 공유:</Text>
                           <Text style={styles.stepBody}>양조 일지를 통해 원료 입고부터 포장까지의 전 과정을 시각화하여 정보의 격차를 해소합니다.</Text>
                        </View>
                        <View style={styles.modalStepRedBox}>
                           <Text style={styles.stepRedLab}>커뮤니티 관리:</Text>
                           <Text style={styles.stepRedBody}>이용약관과 전통주 판매 규정을 준수하지 않거나, 후원자와 소통을 소홀히 하여 피해를 주는 이용자 및 양조장에게는 주의·경고 및 서비스 이용 제한 등의 엄격한 조치를 취하고 있습니다.</Text>
                        </View>
                     </View>
                  </View>
               </ScrollView>
               <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowFundingGuideModal(false)}>
                     <Text style={styles.modalCloseTxt}>확인</Text>
                  </TouchableOpacity>
               </View>
            </Animated.View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  headerIconBtn: { padding: 6, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: 8 },
  visualContainer: { width: '100%', height: 256, backgroundColor: '#E5E7EB', zIndex: 1 },
  mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  contentWrapper: { paddingHorizontal: 16 },
  titleSection: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 },
  projectTitle: { fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 34, marginBottom: 12 },
  shortDesc: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  statusCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24, marginHorizontal: 16 },
  statusGrid: { flexDirection: 'row', marginBottom: 16 },
  statusItem: { flex: 1, alignItems: 'center' },
  statusBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E5E7EB' },
  statusVal: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 4 },
  statusLab: { fontSize: 12, color: '#6B7280' },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 16 },
  dateInfo: { flexDirection: 'column', gap: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  periodTxt: { fontSize: 12, color: '#9CA3AF', marginLeft: 22 },
  breweryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  breweryLogo: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  breweryName: { fontSize: 16, fontWeight: '700', color: '#111' },
  breweryLoc: { fontSize: 12, color: '#6B7280' },
  catBadge: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 16, marginLeft: 'auto' },
  catTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  ownerJournalActionWrap: { paddingHorizontal: 16, marginBottom: 24 },
  ownerJournalAction: { width: '100%', minHeight: 48, borderRadius: 18, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ownerJournalActionText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  stickyTabWrapper: { backgroundColor: '#F9FAFB', zIndex: 40, paddingBottom: 24, paddingHorizontal: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 14 },
  tabBtnActive: { backgroundColor: '#111', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabBtnTxt: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  tabBtnTxtActive: { color: '#FFF' },
  contentArea: { paddingHorizontal: 16 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeaderTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 16 },
  sectionSub: { fontSize: 14, color: '#4B5563', marginBottom: 24 },
  recipeSummaryGrid: { marginBottom: 24, gap: 12 },
  ingCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  ingRow: { flexDirection: 'row' },
  ingCardMini: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  ingLab: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  ingVal: { fontSize: 14, fontWeight: '700', color: '#111' },
  summaryBox: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DBEAFE', marginBottom: 24 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#1E3A8A', marginBottom: 8 },
  summaryTxt: { fontSize: 14, color: '#1E3A8A', lineHeight: 22 },
  bodyTxt: { fontSize: 15, color: '#4B5563', lineHeight: 26 },
  priceCard: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  priceStrip: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, backgroundColor: '#111' },
  priceContent: { padding: 20, paddingLeft: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLab: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
  priceVal: { fontSize: 30, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  priceSub: { fontSize: 14, color: '#4B5563' },
  totalGoalBox: { marginTop: 16, padding: 16, backgroundColor: '#111', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalGoalLab: { color: '#D1D5DB', fontSize: 14, fontWeight: '600' },
  totalGoalVal: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  budgetLab: { fontSize: 14, color: '#374151' },
  budgetVal: { fontSize: 14, fontWeight: '600', color: '#111' },
  budgetTotal: { borderTopWidth: 2, borderTopColor: '#111', paddingTop: 16, marginTop: 8 },
  budgetTotalLab: { fontSize: 16, fontWeight: '800', color: '#111' },
  budgetTotalVal: { fontSize: 18, fontWeight: '800', color: '#111' },
  budgetGuide: { fontSize: 12, color: '#6B7280', marginTop: 16, lineHeight: 20 },
  schRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  schDate: { width: 70, fontSize: 14, fontWeight: '600', color: '#111' },
  schDesc: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 22 },
  schAlert: { marginTop: 8, padding: 16, backgroundColor: '#EFF6FF', borderRadius: 16 },
  schAlertTxt: { fontSize: 12, color: '#1E3A8A', lineHeight: 20 },
  radarContainer: { alignItems: 'center', marginBottom: 24 },
  tasteGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  tasteItemBox: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12 },
  tasteLab: { fontSize: 13, fontWeight: '600', color: '#374151' },
  tasteRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tasteBarBg: { width: 60, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  tasteBarFill: { height: '100%', backgroundColor: '#111', borderRadius: 3 },
  tasteVal: { fontSize: 13, fontWeight: '800', color: '#111', width: 32, textAlign: 'right' },
  guideHeading: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 },
  guideBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  guideBoxPlain: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  guideBoxTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 4 },
  guideBoxTxt: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  guideLink: { fontSize: 14, color: '#111', fontWeight: '600', textDecorationLine: 'underline' },
  journalList: { gap: 16 },
  journalItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  journalStep: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  journalStepTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  journalStepUpcoming: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  journalStepTxtUpcoming: { color: '#6B7280', fontSize: 16, fontWeight: '800' },
  journalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  journalTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  journalTitleUpcoming: { fontSize: 16, fontWeight: '800', color: '#111' },
  journalStageContent: { flex: 1, minWidth: 0 },
  journalStageHeader: { gap: 4, marginBottom: 12 },
  journalStageCount: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  journalDate: { fontSize: 12, color: '#6B7280' },
  journalBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  journalBodyUpcoming: { fontSize: 14, color: '#6B7280' },
  journalEntries: { gap: 16 },
  journalEntryCard: { borderLeftWidth: 2, borderLeftColor: '#111', paddingLeft: 14, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  journalEntryHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  journalEntryTitle: { flex: 1, minWidth: 0, fontSize: 14, fontWeight: '900', color: '#111', lineHeight: 20 },
  journalImageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  journalImageCell: { width: '48%', height: 128, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  journalImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  journalActionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 },
  journalActionButton: { minHeight: 32, borderRadius: 10, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 5 },
  journalActionText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  journalActionTextActive: { color: '#EF4444' },
  journalCommentsPanel: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  journalCommentInputRow: { flexDirection: 'row', gap: 8 },
  journalCommentInput: { flex: 1, height: 42, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, fontSize: 13, color: '#111' },
  journalCommentSend: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  journalGuestButton: { height: 42, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  journalCommentList: { gap: 8 },
  journalCommentCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
  journalCommentMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 5 },
  journalCommentText: { fontSize: 13, color: '#374151', lineHeight: 20 },
  journalCommentActions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  journalCommentAction: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5 },
  journalCommentLikeText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  journalReplyList: { marginTop: 10, marginLeft: 10, gap: 8, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#E5E7EB' },
  journalReplyCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  journalReplyInputRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  journalReplyInput: { flex: 1, height: 38, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, fontSize: 12, color: '#111' },
  journalReplySend: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  journalEmptyCommentText: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  journalMoreButton: { minHeight: 40, borderRadius: 12, backgroundColor: '#F9FAFB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  journalMoreText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  journalImgBox: { width: '100%', borderRadius: 16, marginTop: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  journalImg: { width: '100%', height: 200, resizeMode: 'cover' },
  qaInputRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  qaInput: { flex: 1, height: 52, backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 16, fontSize: 14, color: '#111', borderWidth: 1, borderColor: '#E5E7EB' },
  qaSend: { width: 52, height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  guestActionButton: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  guestActionText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  commentList: { gap: 24 },
  commentCard: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 24 },
  commentTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '800', color: '#111' },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  commentDate: { fontSize: 12, color: '#9CA3AF' },
  commentTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 52 },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionTxt: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  repliesWrapper: { marginTop: 16, marginLeft: 52 },
  replyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  replyAvatarTxt: { fontSize: 12, fontWeight: '800', color: '#111' },
  replyLikeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  replyLikeTxt: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  replyInputRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginLeft: 52 },
  replyInput: { flex: 1, height: 40, backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, fontSize: 13, color: '#111', borderWidth: 1, borderColor: '#E5E7EB' },
  replySend: { width: 40, height: 40, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  emptyComments: { paddingVertical: 48, alignItems: 'center' },
  emptyCommentsTxt: { fontSize: 14, color: '#9CA3AF', marginTop: 12 },
  brewBadge: { backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 },
  brewBadgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  rowBetweenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  countTxt: { fontSize: 14, color: '#6B7280' },
  emptyReviews: { paddingVertical: 48, alignItems: 'center' },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyIconCircleDashed: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  emptySubMulti: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  writeReviewBtn: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  writeReviewTxt: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  reviewList: { gap: 12 },
  reviewCard: { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', padding: 16 },
  reviewUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 4, marginBottom: 8 },
  reviewReward: { fontSize: 11, fontWeight: '800', color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', maxWidth: 180 },
  reviewTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },
  reviewTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  reviewTagChip: { alignSelf: 'flex-start', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  reviewTagText: { fontSize: 11, lineHeight: 12, fontWeight: '800', color: '#4B5563', includeFontPadding: false },
  writeReviewOutline: { width: '100%', padding: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', borderRadius: 16, alignItems: 'center' },
  writeReviewOutlineTxt: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  recommendArea: { paddingHorizontal: 16, marginBottom: 40 },
  shareReportArea: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 24 },
  shareReportButton: { flex: 1, minHeight: 48, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shareReportText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  recList: { gap: 16 },
  recCard: { flexDirection: 'row', gap: 16, backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  recGrid: { gap: 12 },
  recThumbBox: { width: 96, height: 96, borderRadius: 16, overflow: 'hidden' },
  recImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  recHeart: { position: 'absolute', bottom: 8, left: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  recContent: { flex: 1, paddingVertical: 4 },
  recTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  recBrewery: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  recSuccessBadge: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#EFF6FF', borderRadius: 9999 },
  recSuccessTxt: { fontSize: 10, fontWeight: '700', color: '#2563EB' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 8, lineHeight: 20 },
  recFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  recFooterLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  recPct: { fontSize: 18, fontWeight: '700', color: '#111' },
  recAmt: { fontSize: 12, color: '#6B7280' },
  recDays: { fontSize: 12, fontWeight: '600', color: '#111' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12, zIndex: 40 },
  heartBtn: { width: 56, height: 56, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  mainSupportBtn: { flex: 1, height: 56, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  mainSupportTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  optionOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  optionModal: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden' },
  optionHeader: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  optionClose: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  optionCloseTxt: { fontSize: 24, color: '#6B7280', marginTop: -2 },
  optionBody: { padding: 20, gap: 16 },
  optionProjectBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionProjectImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E7EB' },
  optionBrewery: { fontSize: 12, color: '#6B7280', fontWeight: '700', marginBottom: 4 },
  optionProjectTitle: { fontSize: 14, color: '#111', fontWeight: '900', lineHeight: 20 },
  optionSpecGrid: { flexDirection: 'row', gap: 8 },
  optionSpecCard: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 12 },
  optionSpecLabel: { fontSize: 12, color: '#6B7280', fontWeight: '700', marginBottom: 4 },
  optionSpecValue: { fontSize: 14, color: '#111', fontWeight: '900' },
  quantityBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  quantityControl: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  quantityCenter: { alignItems: 'center' },
  quantityValue: { fontSize: 26, color: '#111', fontWeight: '900' },
  quantityUnit: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  optionPriceBox: { backgroundColor: '#111827', borderRadius: 16, padding: 16, gap: 10 },
  optionPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionPriceLabel: { fontSize: 13, color: '#D1D5DB', fontWeight: '700' },
  optionPriceValue: { fontSize: 14, color: '#FFF', fontWeight: '800' },
  optionPriceDivider: { height: 1, backgroundColor: '#374151' },
  optionTotalLabel: { fontSize: 15, color: '#FFF', fontWeight: '900' },
  optionTotalValue: { fontSize: 21, color: '#FFF', fontWeight: '900' },
  deliveryNotice: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE', borderRadius: 14, padding: 12, flexDirection: 'row', gap: 10 },
  deliveryNoticeTitle: { fontSize: 12, color: '#1E3A8A', fontWeight: '900', marginBottom: 2 },
  deliveryNoticeTxt: { fontSize: 12, color: '#1D4ED8', fontWeight: '700', lineHeight: 18 },
  optionConfirmBtn: { height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  optionConfirmTxt: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  actionModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  actionModal: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, gap: 16 },
  reportModal: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, gap: 14, maxHeight: '86%' },
  actionModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionModalTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  actionModalClose: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  actionModalBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  actionPrimaryButton: { minHeight: 48, borderRadius: 14, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionPrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  reportLabel: { fontSize: 13, fontWeight: '900', color: '#374151' },
  reportReasonList: { gap: 8 },
  reportReasonButton: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', paddingHorizontal: 14, justifyContent: 'center' },
  reportReasonButtonActive: { borderColor: '#111', backgroundColor: '#F9FAFB' },
  reportReasonText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  reportReasonTextActive: { color: '#111', fontWeight: '900' },
  reportTextArea: { minHeight: 96, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 14, fontSize: 14, color: '#111', lineHeight: 20 },
  reportWarningBox: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 14, padding: 12 },
  reportWarningText: { fontSize: 12, lineHeight: 18, color: '#92400E', fontWeight: '700' },
  reportFooter: { flexDirection: 'row', gap: 8 },
  reportCancelButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  reportCancelText: { fontSize: 14, fontWeight: '900', color: '#4B5563' },
  reportSubmitButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  reportSubmitText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, maxHeight: '85%', overflow: 'hidden' },
  modalHeader: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  modalCloseIcon: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  modalBody: { padding: 24 },
  modalSecTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 12 },
  modalTxt: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  modalDivider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 24 },
  modalStepBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16 },
  stepLab: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 8 },
  stepBody: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  modalStepBlueBox: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#DBEAFE' },
  stepBlueLab: { fontSize: 14, fontWeight: '800', color: '#1E3A8A', marginBottom: 8 },
  stepBlueBody: { fontSize: 14, color: '#1E40AF', lineHeight: 22 },
  modalStepRedBox: { backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FECACA' },
  stepRedLab: { fontSize: 14, fontWeight: '800', color: '#7F1D1D', marginBottom: 8 },
  stepRedBody: { fontSize: 14, color: '#991B1B', lineHeight: 22 },
  modalFooter: { borderTopWidth: 1, borderTopColor: '#E5E7EB', padding: 24 },
  modalCloseBtn: { width: '100%', height: 48, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalCloseTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
