import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Share as NativeShare,
} from 'react-native';
import type { ImageSourcePropType, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
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
  Image as ImageIcon,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth, type User } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import FundingProjectCard from '@/features/funding/components/FundingProjectCard';
import FundingStarRating from '@/features/funding/components/FundingStarRating';
import {
  createFundingReport,
  createBreweryLogComment,
  createBreweryLogCommentReply,
  createFundingQuestion,
  createFundingReply,
  getBreweryLogComments,
  getFundingApiErrorMessage,
  getFundingBreweryLogs,
  getFundingDetail,
  getFundingIntro,
  getFundingQuestions,
  getFundingReviews,
  getFundingShareLink,
  getFundingSupportOptions,
  isFundingApiMissingEndpointError,
  isFundingReviewNotFoundError,
  likeBreweryLog,
  likeBreweryLogComment,
  likeBreweryLogReply,
  likeFundingQuestion,
  likeFundingQuestionReply,
  unlikeBreweryLog,
  unlikeBreweryLogComment,
  unlikeBreweryLogReply,
  unlikeFundingQuestion,
  unlikeFundingQuestionReply,
  type FundingBreweryLogCommentItem,
  type FundingDetailResponse,
  type FundingReportReason,
  type FundingSupportOption,
} from '@/features/funding/api';
import {
  mapBreweryLogs,
  mapFundingReview,
  mergeFundingDetail,
  mergeFundingIntro,
  mergeSupportOption,
  normalizeSupportOptionId,
} from '@/features/funding/apiMappers';
import {
  BREWING_STAGES,
  getImageSource,
  getFundingProjectImageSource,
  getFundingProjectStatusLabel,
  getFundingProjectSupportUnavailableMessage,
  isFundingEndDateExpired,
  isFundingProjectManageable,
  isFundingProjectSupportable,
} from '@/constants/data';
import type { BrewingStage, FundingProject, JournalComment, JournalEntry, JournalReply } from '@/constants/data';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import {
  getTasteProfileFromSulbti,
  sortFundingProjectsForDisplay,
} from '@/features/funding/recommendation';
import {
  getProjectAlcoholContent,
  getProjectBottleSize,
  getProjectEstimatedDelivery,
  getProjectShippingFee,
  getProjectUnitPrice,
} from '@/features/funding/supportConfig';
import {
  isFundingReviewOwnedByUser,
  shouldShowFundingBreweryBadge,
  type FundingReview,
} from '@/features/funding/reviews';
import { normalizeFundingImageUrl, normalizeFundingImageUrls } from '@/features/funding/imageUrls';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';
import { canAccessFundingReviews } from '@/features/funding/permissions';

const HERO_IMAGE_HEIGHT = 256;
type FundingQuestionComment = {
  id: number;
  serverQuestionId?: number;
  userName: string;
  content: string;
  date: string;
  likes: number;
  liked?: boolean;
  isBrewery: boolean;
  replies: {
    id: number;
    userName: string;
    content: string;
    date: string;
    likes: number;
    liked?: boolean;
    isBrewery: boolean;
  }[];
};

const JOURNALS_PER_STAGE = 1;
const DEFAULT_PROJECT_BUDGET: NonNullable<FundingProject['budget']> = [];
const DEFAULT_PROJECT_SCHEDULE: NonNullable<FundingProject['schedule']> = [];
const DEFAULT_PROJECT_POLICY_TEXT = '';
const DEFAULT_EXPECTED_DIFFICULTIES_TEXT = '';
const QNA_LOCAL_ID_OFFSET = 1_000_000_000;
const JOURNAL_LOCAL_COMMENT_ID_OFFSET = 2_000_000_000;
const JOURNAL_LOCAL_REPLY_ID_OFFSET = 3_000_000_000;

function getSupportOptionLimit(option: FundingSupportOption | null | undefined) {
  const limits = [option?.maxPerUser, option?.remainingStock, option?.stock]
    .filter((value): value is number => typeof value === 'number' && value > 0);
  return limits.length > 0 ? Math.min(...limits) : null;
}

function getSupportOptionStockLabel(option: FundingSupportOption) {
  if (typeof option.remainingStock === 'number') return `${option.remainingStock.toLocaleString()}개 남음`;
  if (typeof option.stock === 'number') return `총 ${option.stock.toLocaleString()}개`;
  return '';
}

function isGarbledKoreanMessage(message: string) {
  return /�|[瑜吏紐삵뻽덈땲媛]|[?][가-힣]|[가-힣][?]/.test(message);
}

function getReportSubmitErrorMessage(error: unknown) {
  const fallback = '신고 등록 중 문제가 발생했습니다. 다시 시도해주세요.';
  const message = getFundingApiErrorMessage(error, fallback);
  return isGarbledKoreanMessage(message) ? fallback : message;
}

function createFundingProjectFromDetail(detail: FundingDetailResponse): FundingProject {
  return mergeFundingDetail(
    {
      id: detail.fundingId,
      title: detail.title || '',
      brewery: detail.breweryName || '',
      location: '',
      category: '막걸리',
      image: '',
      goalAmount: detail.targetAmount || 1,
      currentAmount: detail.currentAmount || 0,
      backers: detail.supporterCount || 0,
      daysLeft: 0,
      status: '진행 중',
      endDate: detail.endDate,
      journals: [],
    },
    detail
  );
}

function todayText() {
  const today = new Date();
  return `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
}

function formatApiDate(value?: string) {
  if (!value) return todayText();
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
}

function normalizeFundingOwnerId(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function getFundingProjectOwnerIds(project: FundingProject | null | undefined) {
  if (!project) return [];
  return [project.breweryUserId, project.ownerUserId, project.creatorId, project.breweryId]
    .map(normalizeFundingOwnerId)
    .filter((id): id is string => Boolean(id));
}

function isProjectOwnerBreweryWriter(
  writer: Pick<FundingBreweryLogCommentItem, 'writerId' | 'writerNickname' | 'isBrewery' | 'writerIsBrewery' | 'writerRole' | 'showBreweryBadge' | 'isProjectOwner'>,
  project: FundingProject | null | undefined,
  currentUser?: User | null
) {
  if (shouldShowFundingBreweryBadge(writer)) return true;
  if (!project) return false;
  const writerId = normalizeFundingOwnerId(writer.writerId);
  const ownerIds = getFundingProjectOwnerIds(project);
  if (writerId && ownerIds.length > 0) return ownerIds.includes(writerId);

  const currentUserIds = currentUser
    ? [currentUser.id, currentUser.uid].map(normalizeFundingOwnerId).filter((id): id is string => Boolean(id))
    : [];
  if (writerId && currentUserIds.includes(writerId)) return isFundingProjectOwnedByBrewery(currentUser, project);

  if (ownerIds.length === 0 && writer.isBrewery) {
    const writerName = writer.writerNickname?.trim();
    return Boolean(writerName && project.brewery && writerName === project.brewery.trim());
  }

  return false;
}

function resolveBreweryLogWriter(
  writer: Pick<FundingBreweryLogCommentItem, 'writerId' | 'writerNickname' | 'isBrewery' | 'writerIsBrewery' | 'writerRole' | 'showBreweryBadge' | 'isProjectOwner'>,
  currentUser: User | null | undefined,
  project: FundingProject | null | undefined
) {
  const isMine = writer.writerId !== undefined && currentUser?.id !== undefined && String(writer.writerId) === String(currentUser.id);
  return {
    userName: isMine ? currentUser?.name || '사용자' : writer.writerNickname || '사용자',
    isBrewery: isProjectOwnerBreweryWriter(writer, project, currentUser),
  };
}

function mapBreweryLogComments(
  comments: FundingBreweryLogCommentItem[],
  journalId: number,
  currentUser: User | null | undefined,
  project: FundingProject | null | undefined
): JournalComment[] {
  return comments.map((comment) => ({
    id: comment.commentId,
    journalId,
    ...resolveBreweryLogWriter(comment, currentUser, project),
    content: comment.content,
    date: formatApiDate(comment.createdAt),
    likes: Math.max(comment.likeCount || 0, comment.liked ? 1 : 0),
    liked: Boolean(comment.liked),
    replies: (comment.replies || []).map((reply) => ({
      id: reply.replyId,
      commentId: comment.commentId,
      ...resolveBreweryLogWriter(reply, currentUser, project),
      content: reply.content,
      date: formatApiDate(reply.createdAt),
      likes: Math.max(reply.likeCount || 0, reply.liked ? 1 : 0),
      liked: Boolean(reply.liked),
    })),
  }));
}

function createLocalQnaCommentId(baseId: number, index: number) {
  const safeBaseId = Number.isFinite(baseId) ? Math.abs(Math.trunc(baseId)) % 100000 : 0;
  return QNA_LOCAL_ID_OFFSET + safeBaseId * 1000 + index;
}

function getUniqueQnaCommentId(serverQuestionId: number | undefined, usedIds: Set<number>, index: number) {
  const normalizedServerId = Number.isFinite(serverQuestionId) && serverQuestionId && serverQuestionId > 0
    ? Math.trunc(serverQuestionId)
    : undefined;
  if (normalizedServerId && !usedIds.has(normalizedServerId)) return normalizedServerId;
  let nextId = createLocalQnaCommentId(normalizedServerId || Date.now(), index);
  while (usedIds.has(nextId)) {
    nextId += 1;
  }
  return nextId;
}

function getUniqueLocalQnaCommentId(usedIds: Set<number>, index: number) {
  return getUniqueQnaCommentId(undefined, usedIds, index);
}

function getUniqueLocalId(usedIds: Set<number>, offset: number) {
  let nextId = offset + (Date.now() % 1_000_000_000);
  while (usedIds.has(nextId)) {
    nextId += 1;
  }
  return nextId;
}

function withUniqueQnaCommentIds(comments: FundingQuestionComment[]) {
  const usedIds = new Set<number>();
  return comments.map((comment, index) => {
    const serverQuestionId = comment.serverQuestionId || (comment.id < QNA_LOCAL_ID_OFFSET ? comment.id : undefined);
    const canKeepLocalId = comment.id >= QNA_LOCAL_ID_OFFSET && !usedIds.has(comment.id);
    const id = canKeepLocalId ? comment.id : getUniqueQnaCommentId(serverQuestionId, usedIds, index + 1);
    usedIds.add(id);
    return { ...comment, id, serverQuestionId };
  });
}

function getQnaReplyLikeKey(commentId: number, replyId: number) {
  return commentId * 10000 + replyId;
}

function getQnaCommentRenderKey(comment: FundingQuestionComment, index: number) {
  return `${comment.serverQuestionId || 'local'}-${comment.id}-${index}`;
}

function getQnaReplyRenderKey(comment: FundingQuestionComment, replyId: number, index: number) {
  return `${comment.id}-${replyId}-${index}`;
}

function getQnaCommentInputKey(comment: FundingQuestionComment) {
  return `${comment.serverQuestionId || 'local'}:${comment.id}`;
}

function getDisplayFavoriteCount(project: FundingProject, favorite: boolean) {
  return Math.max(0, project.favoriteCount || 0);
}

function formatFavoriteCount(count: number) {
  if (count > 999) return '999+';
  return String(count);
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

function getJournalMergeKey(journal: JournalEntry) {
  return `${journal.id}:${journal.stage}:${journal.title}:${journal.content}`;
}

function getFundingProjectImageSources(project: FundingProject) {
  const sources: ImageSourcePropType[] = [];
  const seenUris = new Set<string>();

  const addUri = (uri?: string) => {
    const normalizedUri = normalizeFundingImageUrl(uri);
    if (!normalizedUri || seenUris.has(normalizedUri)) return;
    if (/\/(?:undefined|null|nan)$/i.test(normalizedUri)) return;
    const source = getImageSource(normalizedUri);
    if (!source) return;
    seenUris.add(normalizedUri);
    sources.push(source);
  };

  if (project.localImage) {
    sources.push(project.localImage);
  }

  if (project.images?.length) {
    project.images.forEach(addUri);
  }

  addUri(project.image);

  return sources;
}

export default function FundingDetailScreen() {
  const { id, tab, fromProjectId } = useLocalSearchParams<{
    id?: string;
    tab?: string;
    fromProjectId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const { user } = useAuth();
  const { isFavoriteFunding, toggleFavoriteFunding } = useFavorites();
  const { projects, updateProjectJournals, fundingReviews, mergeProject, mergeProjects, mergeFundingReviews } = useFunding();
  const projectRef = useRef<(typeof projects)[number] | null>(null);
  const rawProjectId = Array.isArray(id) ? id[0] : id;
  const projectId = Number(rawProjectId);
  const rawFromProjectId = Array.isArray(fromProjectId) ? fromProjectId[0] : fromProjectId;
  const previousProjectId = Number(rawFromProjectId);
  const initialTab = getInitialTab(tab);
  const project = useMemo(() => projects.find((p) => p.id === projectId) || null, [projectId, projects]);
  const handleHeaderBack = useCallback(() => {
    if (Number.isFinite(previousProjectId) && previousProjectId > 0 && previousProjectId !== projectId) {
      router.replace(`/funding/${previousProjectId}` as any);
      return;
    }
    router.replace('/funding' as any);
  }, [previousProjectId, projectId]);
  
  const [activeTab, setActiveTab] = useState<"소개" | "양조일지" | "Q&A" | "후기">(initialTab);
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<{ title: string; body: string } | null>(null);
  const [reviewEditPrompt, setReviewEditPrompt] = useState<FundingReview | null>(null);
  const [showFundingOptionModal, setShowFundingOptionModal] = useState(false);
  const [supportOptions, setSupportOptions] = useState<FundingSupportOption[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [supportOptionId, setSupportOptionId] = useState<number | null>(null);
  const [activeHeroImageIndex, setActiveHeroImageIndex] = useState(0);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [reviewPermission, setReviewPermission] = useState<{ canWriteReview: boolean; canReview: boolean } | null>(null);

  const showLoginRequired = (message: string) => {
    setFeedbackModal({
      title: '로그인이 필요합니다',
      body: message,
    });
  };

  // Q&A State
  const [comments, setComments] = useState<FundingQuestionComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const qnaCommentInputRef = useRef<TextInput | null>(null);
  const qnaReplyInputRefs = useRef<Record<string, TextInput | null>>({});
  const journalReplyInputRefs = useRef<Record<string, TextInput | null>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set([1]));
  const [expandedJournalStages, setExpandedJournalStages] = useState<Set<BrewingStage>>(new Set());
  const [expandedJournalComments, setExpandedJournalComments] = useState<Set<string>>(new Set());
  const [expandedJournalReplies, setExpandedJournalReplies] = useState<Set<string>>(new Set());
  const [replyingToJournalComment, setReplyingToJournalComment] = useState<string | null>(null);
  const [journalCommentDrafts, setJournalCommentDrafts] = useState<Record<string, string>>({});
  const [journalReplyDrafts, setJournalReplyDrafts] = useState<Record<string, string>>({});
  const [likedJournals, setLikedJournals] = useState<Set<string>>(new Set());
  const [likedJournalComments, setLikedJournalComments] = useState<Set<string>>(new Set());
  const [likedJournalReplies, setLikedJournalReplies] = useState<Set<string>>(new Set());

  const loadFundingReviewState = useCallback(() => {
    let mounted = true;
    if (!Number.isFinite(projectId)) return () => {
      mounted = false;
    };

    setReviewPermission(null);
    getFundingReviews(projectId, { page: 0, size: 20, sort: 'LATEST' })
      .then((response) => {
        if (!mounted) return;
        setReviewPermission({
          canWriteReview: response.canWriteReview,
          canReview: response.canReview,
        });
        mergeFundingReviews(projectId, response.content.map((review) => mapFundingReview(projectId, review)));
      })
      .catch((error) => {
        if (!mounted) return;
        setReviewPermission({ canWriteReview: false, canReview: false });
        if (isFundingReviewNotFoundError(error)) return;
        console.warn(getFundingApiErrorMessage(error, '펀딩 후기를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [mergeFundingReviews, projectId]);

  useEffect(() => {
    setActiveTab(getInitialTab(tab));
  }, [tab]);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleHeaderBack();
        return true;
      });

      return () => subscription.remove();
    }, [handleHeaderBack])
  );

  useEffect(() => {
    setComments([]);
    setNewComment("");
    setReplyingTo(null);
    setReplyDrafts({});
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
    setShowFundingOptionModal(false);
    setSupportOptions([]);
    setSelectedQuantity(1);
    setSupportOptionId(1);
    setReviewPermission(null);
  }, [projectId]);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(projectId)) return;

    setIsDetailLoading(true);
    getFundingDetail(projectId)
      .then((detail) => {
        const currentProject = projectRef.current;
        if (!mounted) return;
        if (currentProject) {
          mergeProject(projectId, mergeFundingDetail(currentProject, detail));
        } else {
          mergeProjects([createFundingProjectFromDetail(detail)]);
        }
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '펀딩 상세 정보를 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (mounted) setIsDetailLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [mergeProject, mergeProjects, projectId]);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(projectId) || !projectRef.current || activeTab !== "소개") return;

    getFundingIntro(projectId)
      .then((intro) => {
        const currentProject = projectRef.current;
        if (!mounted || !currentProject) return;
        mergeProject(projectId, mergeFundingIntro(currentProject, intro));
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '프로젝트 소개를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, mergeProject, projectId]);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(projectId) || activeTab !== "양조일지") return;

    getFundingBreweryLogs(projectId)
      .then(async (response) => {
        const currentProject = projectRef.current;
        if (!mounted || !currentProject) return;
        const apiJournals = await Promise.all(
          mapBreweryLogs(response.logs).map(async (journal) => {
            try {
              const comments = await getBreweryLogComments(projectId, journal.id);
              return { ...journal, comments: mapBreweryLogComments(comments.content, journal.id, user, currentProject) };
            } catch {
              return journal;
            }
          })
        );
        const existingJournalsByKey = new Map((currentProject.journals || []).map((journal) => [getJournalMergeKey(journal), journal]));
        const mergedJournals = apiJournals.map((journal) => {
          const existingJournal = existingJournalsByKey.get(getJournalMergeKey(journal));
          const preservedLikes = existingJournal?.likes || journal.likes || 0;
          const serverComments = journal.comments || [];
          return existingJournal
            ? {
                ...journal,
                likes: preservedLikes,
                comments: serverComments.length > 0 ? serverComments : existingJournal.comments,
              }
            : {
                ...journal,
                likes: journal.likes,
              };
        });
        const nextLikedJournals = new Set<string>();
        const nextLikedJournalComments = new Set<string>();
        const nextLikedJournalReplies = new Set<string>();
        mergedJournals.forEach((journal) => {
          const journalKey = getJournalMergeKey(journal);
          if (journal.liked) nextLikedJournals.add(journalKey);
          (journal.comments || []).forEach((comment) => {
            if (comment.liked) nextLikedJournalComments.add(`${journalKey}:${comment.id}`);
            (comment.replies || []).forEach((reply) => {
              if (reply.liked) nextLikedJournalReplies.add(`${journalKey}:${comment.id}:${reply.id}`);
            });
          });
        });
        updateProjectJournals(projectId, mergedJournals);
        setLikedJournals(nextLikedJournals);
        setLikedJournalComments(nextLikedJournalComments);
        setLikedJournalReplies(nextLikedJournalReplies);
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '양조일지를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, projectId, updateProjectJournals, user]);

  useEffect(() => {
    let mounted = true;
    const currentProject = projectRef.current;
    if (!Number.isFinite(projectId) || activeTab !== "Q&A" || !currentProject) return;

    getFundingQuestions(projectId, { page: 0, size: 20 })
      .then((response) => {
        if (!mounted) return;
        const apiComments: FundingQuestionComment[] = response.content.map((item) => {
          const isMine = item.writerId !== undefined && user?.id !== undefined && String(item.writerId) === String(user.id);
          return {
            id: item.questionId,
            serverQuestionId: item.questionId,
            userName: isMine ? user.name : item.writerNickname || '사용자',
            content: item.content || item.title,
            date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
            likes: Math.max(item.likeCount || 0, item.liked ? 1 : 0),
            liked: Boolean(item.liked),
            isBrewery: isProjectOwnerBreweryWriter(item, currentProject, user),
            replies: (item.replies || []).map((reply) => {
              const isMyReply = reply.writerId !== undefined && user?.id !== undefined && String(reply.writerId) === String(user.id);
              return {
                id: reply.replyId,
                userName: isMyReply ? user.name : reply.writerNickname || '사용자',
                content: reply.content,
                date: new Date(reply.createdAt).toLocaleDateString("ko-KR"),
                likes: Math.max(reply.likeCount || 0, reply.liked ? 1 : 0),
                liked: Boolean(reply.liked),
                isBrewery: isProjectOwnerBreweryWriter(reply, currentProject, user),
              };
            }),
          };
        });
        const mergedComments = withUniqueQnaCommentIds(apiComments);
        const nextLikedComments = new Set<number>();
        const nextLikedReplies = new Set<number>();
        mergedComments.forEach((comment) => {
          if (comment.liked) nextLikedComments.add(comment.id);
          comment.replies.forEach((reply) => {
            if (reply.liked) nextLikedReplies.add(getQnaReplyLikeKey(comment.id, reply.id));
          });
        });
        setLikedComments(nextLikedComments);
        setLikedReplies(nextLikedReplies);
        setComments(mergedComments);
      })
      .catch((error) => {
        if (!mounted) return;
        setLikedComments(new Set());
        setLikedReplies(new Set());
        setComments([]);
        console.warn(getFundingApiErrorMessage(error, 'Q&A를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [
    activeTab,
    project?.brewery,
    project?.breweryId,
    project?.breweryUserId,
    project?.creatorId,
    project?.ownerUserId,
    projectId,
    user,
    user?.id,
    user?.isBreweryVerified,
    user?.name,
    user?.type,
    user?.uid,
  ]);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(projectId) || activeTab !== "후기") return;

    setReviewPermission(null);
    getFundingReviews(projectId, { page: 0, size: 20, sort: 'LATEST' })
      .then((response) => {
        if (!mounted) return;
        setReviewPermission({
          canWriteReview: response.canWriteReview,
          canReview: response.canReview,
        });
        mergeFundingReviews(projectId, response.content.map((review) => mapFundingReview(projectId, review)));
      })
      .catch((error) => {
        if (!mounted) return;
        setReviewPermission({ canWriteReview: false, canReview: false });
        if (isFundingReviewNotFoundError(error)) return;
        console.warn(getFundingApiErrorMessage(error, '펀딩 후기를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, mergeFundingReviews, projectId]);

  useFocusEffect(
    useCallback(() => {
      if (getTabParam(activeTab) !== "review") return;
      return loadFundingReviewState();
    }, [activeTab, loadFundingReviewState])
  );

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(projectId) || !showFundingOptionModal) return;

    getFundingSupportOptions(projectId)
      .then((response) => {
        const currentProject = projectRef.current;
        const options = response.supportOptions;
        const option = options.find((item) => normalizeSupportOptionId(item.optionId) === supportOptionId) || options[0];
        if (!mounted || !currentProject || !option) return;
        const optionId = normalizeSupportOptionId(option.optionId);
        setSupportOptions(options);
        setSupportOptionId(optionId);
        const quantityLimit = getSupportOptionLimit(option);
        if (quantityLimit !== null) {
          setSelectedQuantity((prev) => Math.min(Math.max(1, prev), quantityLimit));
        }
        mergeProject(projectId, mergeSupportOption(currentProject, option));
      })
      .catch((error) => {
        console.warn(getFundingApiErrorMessage(error, '후원 옵션을 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [mergeProject, projectId, showFundingOptionModal, supportOptionId]);

  const userTasteProfile = useMemo(() => getTasteProfileFromSulbti(user?.sulbti), [user?.sulbti]);
  const projectBudget = useMemo(() => project?.budget || DEFAULT_PROJECT_BUDGET, [project?.budget]);
  const projectSchedule = useMemo(() => project?.schedule || DEFAULT_PROJECT_SCHEDULE, [project?.schedule]);
  const budgetPlanText = project?.budgetPlanText || '';
  const schedulePlanText = project?.schedulePlanText || '';
  const projectPolicyText = project?.projectPolicy || DEFAULT_PROJECT_POLICY_TEXT;
  const expectedDifficultiesText = project?.expectedDifficulties || DEFAULT_EXPECTED_DIFFICULTIES_TEXT;
  const isProjectFavorite = project ? isFavoriteFunding(project.id) : false;
  const favoriteCountLabel = project ? formatFavoriteCount(getDisplayFavoriteCount(project, isProjectFavorite)) : '0';
  const tasteProfile = useMemo(() => project?.tasteProfile || null, [project?.tasteProfile]);
  const tasteItems = useMemo(() => {
    if (!tasteProfile) return [];
    return [
      { label: "단맛", value: tasteProfile.sweetness },
      { label: "잔향", value: tasteProfile.aroma },
      { label: "산미", value: tasteProfile.acidity },
      { label: "바디감", value: tasteProfile.body },
      { label: "탄산감", value: tasteProfile.carbonation },
    ];
  }, [tasteProfile]);
  const recommendedProjects = useMemo(() => {
    if (!project) return [];
    return sortFundingProjectsForDisplay(
      projects.filter((item) => item.id !== project.id),
      "추천순",
      userTasteProfile
    ).slice(0, 4);
  }, [project, projects, userTasteProfile]);
  const projectReviews = useMemo(
    () => (project ? fundingReviews.filter((review) => review.projectId === project.id) : []),
    [fundingReviews, project]
  );
  const myReview = useMemo(
    () => (user ? projectReviews.find((review) => isFundingReviewOwnedByUser(review, user)) || null : null),
    [projectReviews, user]
  );
  const canShowAndWriteReviews = useMemo(
    () => Boolean(project && (canAccessFundingReviews(project) || projectReviews.length > 0 || reviewPermission !== null)),
    [project, projectReviews.length, reviewPermission]
  );
  const canWriteFundingReview = Boolean(user && (reviewPermission?.canWriteReview || reviewPermission?.canReview));
  const heroImageSources = useMemo(
    () => (project ? getFundingProjectImageSources(project) : []),
    [project]
  );
  const projectImageSource = useMemo(
    () => (project ? getFundingProjectImageSource(project) : undefined),
    [project]
  );
  const handleHeroImageScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (heroImageSources.length <= 1) return;
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / Math.max(1, viewportWidth));
      setActiveHeroImageIndex(Math.min(Math.max(nextIndex, 0), heroImageSources.length - 1));
    },
    [heroImageSources.length, viewportWidth]
  );

  useEffect(() => {
    setActiveHeroImageIndex(0);
  }, [heroImageSources.length, projectId]);

  if (!project) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 16 }}>
          {isDetailLoading ? '프로젝트 정보를 불러오는 중입니다.' : '프로젝트를 찾을 수 없습니다.'}
        </Text>
        {!isDetailLoading && <Button label="목록으로 돌아가기" onPress={() => router.replace('/funding' as any)} />}
      </View>
    );
  }

  const progressPercentage = project.goalAmount > 0 ? (project.currentAmount / project.goalAmount) * 100 : 0;
  const progressBarValue = Math.min(progressPercentage, 100);
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified;
  const isOwnBreweryProject = isFundingProjectOwnedByBrewery(user, project);
  const canManageOwnBreweryProject = Boolean(isBrewery && isOwnBreweryProject && isFundingProjectManageable(project));
  const isProjectSupportable = isFundingProjectSupportable(project);
  const isProjectExpiredByEndDate = isFundingEndDateExpired(project);
  const projectStatusLabel = getFundingProjectStatusLabel(project);
  const isProjectPreparing = projectStatusLabel === "준비 중" || projectStatusLabel === "대기 중" || projectStatusLabel === "펀딩 예정";
  const isProjectRejected = projectStatusLabel === "펀딩 반려";
  const supportUnavailableMessage = getFundingProjectSupportUnavailableMessage(project);
  const unitPrice = getProjectUnitPrice(project);
  const shippingFee = getProjectShippingFee(project);
  const bottleSize = getProjectBottleSize(project);
  const alcoholContent = getProjectAlcoholContent(project);
  const estimatedDelivery = getProjectEstimatedDelivery(project);
  const selectedSupportOption =
    supportOptions.find((option) => normalizeSupportOptionId(option.optionId) === supportOptionId) || null;
  const selectedSupportOptionPrice = selectedSupportOption?.price ?? unitPrice;
  const selectedSupportOptionName = selectedSupportOption?.name || project.rewardItems?.[0] || `${project.title} ${bottleSize} x 1`;
  const selectedSupportOptionLimit = getSupportOptionLimit(selectedSupportOption);
  const optionTotalAmount = selectedSupportOptionPrice * selectedQuantity + shippingFee;
  const totalBudgetAmount = projectBudget.reduce((sum, item) => sum + item.amount, 0);
  const mainIngredientLabel = getFundingMainIngredientLabel(project);
  const hasBreweryPublicProfile = Boolean((project.breweryBio || '').trim());
  const ownerClosedProjectLabel = (() => {
    if (projectStatusLabel === "펀딩 성공") return "성공한 프로젝트";
    if (projectStatusLabel === "펀딩 실패") return "실패한 프로젝트";
    if (projectStatusLabel === "취소된 펀딩") return "취소된 프로젝트";
    if (isProjectRejected) return "펀딩 반려";
    if (isProjectExpiredByEndDate || projectStatusLabel === "펀딩 마감") return "마감된 프로젝트";
    if (projectStatusLabel === "심사 중") return "심사 중인 프로젝트";
    if (isProjectPreparing) return "준비 중인 프로젝트";
    return "프로젝트 상태 확인";
  })();
  const supportButtonLabel =
    isOwnBreweryProject
      ? user?.isBreweryVerified
        ? canManageOwnBreweryProject
          ? "프로젝트 관리하기"
          : ownerClosedProjectLabel
        : "양조장 인증하기"
      : !isProjectSupportable
      ? projectStatusLabel === "심사 중" || isProjectPreparing
        ? "후원 준비중"
        : projectStatusLabel
      : "프로젝트 후원하기";
  const isMainSupportButtonMuted = isOwnBreweryProject
    ? Boolean(user?.isBreweryVerified && !canManageOwnBreweryProject)
    : !isProjectSupportable;
  const getSupportBlockedFeedback = () => {
    if (projectStatusLabel === "펀딩 마감") {
      return {
        title: "펀딩이 마감되었습니다",
        body: "마감일이 지나 더 이상 후원할 수 없습니다. 정산이 완료되면 펀딩 성공 또는 실패 상태로 표시됩니다.",
      };
    }
    if (projectStatusLabel === "펀딩 성공") {
      return {
        title: "펀딩 성공 프로젝트입니다",
        body: "목표 금액을 달성해 후원 접수가 종료된 프로젝트입니다.",
      };
    }
    if (projectStatusLabel === "펀딩 실패") {
      return {
        title: "펀딩 실패 프로젝트입니다",
        body: "목표 금액을 달성하지 못해 후원 접수가 종료된 프로젝트입니다.",
      };
    }
    if (projectStatusLabel === "취소된 펀딩") {
      return {
        title: "취소된 프로젝트입니다",
        body: "운영 또는 진행 사유로 취소되어 후원할 수 없는 프로젝트입니다.",
      };
    }
    if (isProjectRejected) {
      return {
        title: "펀딩 반려된 프로젝트입니다",
        body: "관리자 심사에서 반려되어 후원할 수 없는 프로젝트입니다.",
      };
    }
    if (projectStatusLabel === "심사 중") {
      return {
        title: "심사 중인 프로젝트입니다",
        body: "관리자 심사가 완료된 뒤 후원 가능 상태가 되면 참여할 수 있습니다.",
      };
    }
    if (isProjectPreparing) {
      return {
        title: "후원 준비중입니다",
        body: "아직 후원을 받을 수 없는 프로젝트입니다. 프로젝트 상태가 진행 중으로 바뀐 뒤 참여할 수 있습니다.",
      };
    }
    return {
      title: "후원 진행 안내",
      body: supportUnavailableMessage,
    };
  };
  const getOwnerManageBlockedFeedback = () => {
    if (projectStatusLabel === "펀딩 마감" || isProjectExpiredByEndDate) {
      return {
        title: "마감된 프로젝트입니다",
        body: "마감일이 지나 프로젝트 수정이 제한됩니다. 정산이 완료되면 성공 또는 실패 상태로 확인할 수 있습니다.",
      };
    }
    if (projectStatusLabel === "펀딩 성공") {
      return {
        title: "성공한 프로젝트입니다",
        body: "정산이 완료된 성공 프로젝트는 수정 제출할 수 없습니다. 상세 정보와 후원 현황만 확인할 수 있습니다.",
      };
    }
    if (projectStatusLabel === "펀딩 실패") {
      return {
        title: "실패한 프로젝트입니다",
        body: "정산이 완료된 실패 프로젝트는 수정 제출할 수 없습니다. 상세 정보와 진행 결과만 확인할 수 있습니다.",
      };
    }
    if (projectStatusLabel === "취소된 펀딩") {
      return {
        title: "취소된 프로젝트입니다",
        body: "취소 처리된 프로젝트는 수정하거나 다시 후원을 받을 수 없습니다.",
      };
    }
    if (isProjectRejected) {
      return {
        title: "펀딩 반려된 프로젝트입니다",
        body: "심사에서 반려된 프로젝트입니다. 제출 내용을 보완한 뒤 다시 진행해주세요.",
      };
    }
    if (projectStatusLabel === "심사 중") {
      return {
        title: "심사 중인 프로젝트입니다",
        body: "관리자 심사가 진행 중인 프로젝트입니다. 심사가 완료되기 전에는 수정 관리가 제한됩니다.",
      };
    }
    if (isProjectPreparing) {
      return {
        title: "준비 중인 프로젝트입니다",
        body: "아직 후원 진행 전 단계입니다. 프로젝트 상태가 진행 중으로 변경된 뒤 관리할 수 있습니다.",
      };
    }
    return {
      title: "프로젝트 상태 확인",
      body: "현재 상태에서는 프로젝트 수정이 제한됩니다. 프로젝트 상태를 확인한 뒤 다시 시도해주세요.",
    };
  };

  const journals = project.journals || [];

  const handleBreweryProfilePress = () => {
    if (!hasBreweryPublicProfile) {
      setFeedbackModal({
        title: '양조장 프로필이 없습니다',
        body: '양조장이 아직 프로필을 만들지 않았습니다. 프로필을 작성한 뒤 확인할 수 있어요.',
      });
      return;
    }
    router.push(`/brewery/${project.id}` as any);
  };

  const handleSupportClick = () => {
    if (!isOwnBreweryProject && !isProjectSupportable) {
      setFeedbackModal(getSupportBlockedFeedback());
      return;
    }
    if (!user) {
      showLoginRequired('후원하려면 먼저 로그인해주세요.');
      return;
    }
    if (isOwnBreweryProject) {
      if (!user.isBreweryVerified) {
        router.push('/brewery/verification' as any);
        return;
      }
      if (!canManageOwnBreweryProject) {
        setFeedbackModal(getOwnerManageBlockedFeedback());
        return;
      }
      router.push(user.isBreweryVerified ? `/brewery/project/create?mode=edit&projectId=${project.id}` as any : '/brewery/verification' as any);
      return;
    }
    setShowFundingOptionModal(true);
  };

  const handleConfirmFundingOption = () => {
    setShowFundingOptionModal(false);
    const optionParam = selectedSupportOption && supportOptionId !== null ? `&optionId=${supportOptionId}` : '';
    router.push(`/funding/support?id=${project.id}&quantity=${selectedQuantity}${optionParam}` as any);
  };

  const handleSelectSupportOption = (option: FundingSupportOption) => {
    const optionId = normalizeSupportOptionId(option.optionId);
    setSupportOptionId(optionId);
    const quantityLimit = getSupportOptionLimit(option);
    if (quantityLimit !== null) {
      setSelectedQuantity((prev) => Math.min(Math.max(1, prev), quantityLimit));
    }
    mergeProject(project.id, mergeSupportOption(project, option));
  };

  const handleIncreaseQuantity = () => {
    setSelectedQuantity((prev) => {
      const next = prev + 1;
      return selectedSupportOptionLimit === null ? next : Math.min(next, selectedSupportOptionLimit);
    });
  };

  const handleTabChange = (nextTab: "소개" | "양조일지" | "Q&A" | "후기") => {
    setActiveTab(nextTab);
    router.setParams({ tab: getTabParam(nextTab) } as any);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      showLoginRequired('펀딩 Q&A 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const content = newComment.trim();
    try {
      const response = await createFundingQuestion(project.id, {
        title: content.slice(0, 30) || '펀딩 문의',
        content,
        isPrivate: false,
      });
      const serverQuestionId = response.questionId > 0 ? response.questionId : undefined;
      const usedCommentIds = new Set(comments.map((comment) => comment.id));
      const localCommentId = getUniqueLocalQnaCommentId(usedCommentIds, comments.length + 1);
      const comment: FundingQuestionComment = {
        id: localCommentId,
        serverQuestionId,
        userName: user?.name || "나",
        content,
        date: new Date().toLocaleDateString("ko-KR"),
        likes: 0,
        isBrewery: canManageOwnBreweryProject,
        replies: [],
      };
      setComments((prev) => withUniqueQnaCommentIds([comment, ...prev]));
      setLikedComments((prev) => {
        if (!prev.has(localCommentId)) return prev;
        const next = new Set(prev);
        next.delete(localCommentId);
        return next;
      });
      setNewComment("");
    } catch (error) {
      setFeedbackModal({
        title: 'Q&A 등록 실패',
        body: getFundingApiErrorMessage(error, '질문 등록 중 문제가 발생했습니다.'),
      });
    }
  };

  const handleAddReply = async (targetComment: FundingQuestionComment, commentInputKey: string) => {
    const content = replyDrafts[commentInputKey]?.trim();
    if (!content) return;
    if (!user) {
      showLoginRequired('펀딩 Q&A 답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const commentId = targetComment.id;
    const serverQuestionId = targetComment?.serverQuestionId || targetComment?.id || commentId;
    try {
      const response = await createFundingReply(project.id, serverQuestionId, { content });
      const usedReplyIds = new Set(comments.flatMap((comment) => comment.replies.map((reply) => reply.id)));
      const localReplyId = getUniqueLocalId(usedReplyIds, QNA_LOCAL_ID_OFFSET);
      const newReply = {
        id: response.replyId > 0 && !usedReplyIds.has(response.replyId) ? response.replyId : localReplyId,
        userName: user?.name || "나",
        content,
        date: new Date().toLocaleDateString("ko-KR"),
        likes: 0,
        liked: false,
        isBrewery: canManageOwnBreweryProject,
      };
      setComments((prev) => prev.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c));
      const replyLikeKey = getQnaReplyLikeKey(commentId, newReply.id);
      setLikedReplies((prev) => {
        if (!prev.has(replyLikeKey)) return prev;
        const next = new Set(prev);
        next.delete(replyLikeKey);
        return next;
      });
      setReplyDrafts((prev) => ({ ...prev, [commentInputKey]: "" }));
      setReplyingTo(commentInputKey);
      setExpandedComments((prev) => new Set([...prev, commentId]));
    } catch (error) {
      setFeedbackModal({
        title: '답글 등록 실패',
        body: getFundingApiErrorMessage(error, '답글 등록 중 문제가 발생했습니다.'),
      });
    }
  };


  const toggleCommentLike = async (commentId: number) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const targetComment = comments.find((comment) => comment.id === commentId);
    if (!targetComment) return;
    const isAlreadyLiked = Boolean(targetComment && likedComments.has(commentId) && (targetComment.likes || 0) > 0);
    const newLiked = new Set(likedComments);
    let diff = 0;
    if (isAlreadyLiked) {
      newLiked.delete(commentId);
      diff = -1;
    } else {
      newLiked.add(commentId);
      diff = 1;
    }
    const previousComments = comments;
    const previousLikedComments = likedComments;
    setComments(comments.map(c => c.id === commentId ? { ...c, likes: Math.max(0, (c.likes || 0) + diff), liked: !isAlreadyLiked } : c));
    setLikedComments(newLiked);

    const serverQuestionId = targetComment.serverQuestionId;
    if (!serverQuestionId) return;

    try {
      const response = isAlreadyLiked
        ? await unlikeFundingQuestion(project.id, serverQuestionId)
        : await likeFundingQuestion(project.id, serverQuestionId);
      setComments((prev) => prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: Math.max(response.likeCount, response.liked ? 1 : 0), liked: response.liked }
          : comment
      ));
      setLikedComments((prev) => {
        const next = new Set(prev);
        if (response.liked) next.add(commentId);
        else next.delete(commentId);
        return next;
      });
    } catch (error) {
      setComments(previousComments);
      setLikedComments(previousLikedComments);
      setFeedbackModal({
        title: '좋아요 처리 실패',
        body: getFundingApiErrorMessage(error, 'Q&A 좋아요 처리 중 문제가 발생했습니다.'),
      });
    }
  };

  const toggleReplyLike = async (commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const targetComment = comments.find((comment) => comment.id === commentId);
    const uniqueId = getQnaReplyLikeKey(commentId, replyId);
    const targetReply = targetComment?.replies.find((reply) => reply.id === replyId);
    if (!targetComment || !targetReply) return;
    const isAlreadyLiked = Boolean(targetReply && likedReplies.has(uniqueId) && (targetReply.likes || 0) > 0);
    const newLiked = new Set(likedReplies);
    let diff = 0;
    if (isAlreadyLiked) {
      newLiked.delete(uniqueId);
      diff = -1;
    } else {
      newLiked.add(uniqueId);
      diff = 1;
    }
    setComments(comments.map(c => c.id === commentId ? {
      ...c,
      replies: c.replies.map(r => r.id === replyId ? { ...r, likes: Math.max(0, (r.likes || 0) + diff), liked: !isAlreadyLiked } : r)
    } : c));
    setLikedReplies(newLiked);

    const serverQuestionId = targetComment.serverQuestionId;
    if (!serverQuestionId) return;

    const previousComments = comments;
    const previousLikedReplies = likedReplies;
    try {
      const response = isAlreadyLiked
        ? await unlikeFundingQuestionReply(project.id, serverQuestionId, replyId)
        : await likeFundingQuestionReply(project.id, serverQuestionId, replyId);
      setComments((prev) => prev.map((comment) => comment.id === commentId ? {
        ...comment,
        replies: comment.replies.map((reply) =>
          reply.id === replyId
            ? { ...reply, likes: Math.max(response.likeCount, response.liked ? 1 : 0), liked: response.liked }
            : reply
        ),
      } : comment));
      setLikedReplies((prev) => {
        const next = new Set(prev);
        if (response.liked) next.add(uniqueId);
        else next.delete(uniqueId);
        return next;
      });
    } catch (error) {
      setComments(previousComments);
      setLikedReplies(previousLikedReplies);
      setFeedbackModal({
        title: '좋아요 처리 실패',
        body: getFundingApiErrorMessage(error, 'Q&A 답글 좋아요 처리 중 문제가 발생했습니다.'),
      });
    }
  };

  const toggleExpandComment = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) newExpanded.delete(commentId);
    else newExpanded.add(commentId);
    setExpandedComments(newExpanded);
  };

  const handleFavoritePress = async (targetProjectId: number) => {
    if (!user) {
      showLoginRequired('펀딩 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const response = await toggleFavoriteFunding(targetProjectId);
    if (!response) return;
    mergeProject(response.fundingId || targetProjectId, {
      liked: response.liked,
      favoriteCount: response.likeCount,
    });
  };

  const handleReplyOpen = (comment: FundingQuestionComment, commentInputKey: string) => {
    if (!user) {
      showLoginRequired('펀딩 Q&A 답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const commentId = comment.id;
    qnaCommentInputRef.current?.blur();
    setExpandedComments((prev) => new Set([...prev, commentId]));
    setReplyingTo(commentInputKey);
    setTimeout(() => {
      qnaReplyInputRefs.current[commentInputKey]?.focus();
    }, 80);
  };

  const toggleJournalStage = (stageId: BrewingStage) => {
    setExpandedJournalStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const toggleJournalComments = (journalKey: string) => {
    setExpandedJournalComments((prev) => {
      const next = new Set(prev);
      if (next.has(journalKey)) next.delete(journalKey);
      else next.add(journalKey);
      return next;
    });
  };

  const handleJournalLike = async (journalKey: string) => {
    if (!user) {
      showLoginRequired('양조일지 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const targetJournal = journals.find((entry) => getJournalMergeKey(entry) === journalKey);
    const isLiked = Boolean(targetJournal && likedJournals.has(journalKey) && (targetJournal.likes || 0) > 0);
    if (!targetJournal) return;
    const previousJournals = journals;
    const previousLikedJournals = likedJournals;
    updateProjectJournals(
      project.id,
      journals.map((entry) =>
        getJournalMergeKey(entry) === journalKey
          ? { ...entry, likes: Math.max(0, (entry.likes || 0) + (isLiked ? -1 : 1)) }
          : entry
      )
    );
    setLikedJournals((prev) => {
      const next = new Set(prev);
      if (next.has(journalKey)) next.delete(journalKey);
      else next.add(journalKey);
      return next;
    });
    try {
      const response = isLiked
        ? await unlikeBreweryLog(project.id, targetJournal.id)
        : await likeBreweryLog(project.id, targetJournal.id);
      updateProjectJournals(
        project.id,
        (projectRef.current?.journals || []).map((entry) =>
          getJournalMergeKey(entry) === journalKey ? { ...entry, likes: response.likeCount } : entry
        )
      );
      setLikedJournals((prev) => {
        const next = new Set(prev);
        if (response.liked) next.add(journalKey);
        else next.delete(journalKey);
        return next;
      });
    } catch (error) {
      if (!isFundingApiMissingEndpointError(error)) console.warn(getFundingApiErrorMessage(error, '양조일지 좋아요를 저장하지 못했습니다.'));
      updateProjectJournals(project.id, previousJournals);
      setLikedJournals(previousLikedJournals);
    }
  };

  const handleAddJournalComment = async (targetJournal: JournalEntry, journalKey: string) => {
    const content = journalCommentDrafts[journalKey]?.trim();
    if (!content) return;
    if (!user) {
      showLoginRequired('양조일지 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const commentIds = new Set(journals.flatMap((entry) => (entry.comments || []).map((comment) => comment.id)));
    const commentId = getUniqueLocalId(commentIds, JOURNAL_LOCAL_COMMENT_ID_OFFSET);
    const nextComment: JournalComment = {
      id: commentId,
      journalId: targetJournal.id,
      userName: user.name || "사용자",
      isBrewery: canManageOwnBreweryProject,
      content,
      date: todayText(),
      likes: 0,
      replies: [],
    };
    const previousJournals = journals;
    const previousCommentDrafts = journalCommentDrafts;
    const previousExpandedJournalComments = expandedJournalComments;
    const previousLikedJournalComments = likedJournalComments;

    updateProjectJournals(
      project.id,
      journals.map((entry) =>
        getJournalMergeKey(entry) === journalKey ? { ...entry, comments: [...(entry.comments || []), nextComment] } : entry
      )
    );
    setLikedJournalComments((prev) => {
      const likeKey = `${journalKey}:${commentId}`;
      if (!prev.has(likeKey)) return prev;
      const next = new Set(prev);
      next.delete(likeKey);
      return next;
    });
    setJournalCommentDrafts((prev) => ({ ...prev, [journalKey]: "" }));
    setExpandedJournalComments((prev) => {
      const next = new Set(prev);
      next.add(journalKey);
      return next;
    });
    try {
      const response = await createBreweryLogComment(project.id, targetJournal.id, content);
      const responseWriter = resolveBreweryLogWriter(response, user, project);
      updateProjectJournals(
        project.id,
        (projectRef.current?.journals || []).map((entry) => {
          if (getJournalMergeKey(entry) !== journalKey) return entry;
          return {
            ...entry,
            comments: (entry.comments || []).map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    id: response.commentId || comment.id,
                    userName: responseWriter.userName || comment.userName,
                    isBrewery: responseWriter.isBrewery,
                    date: formatApiDate(response.createdAt),
                  }
                : comment
            ),
          };
        })
      );
    } catch (error) {
      updateProjectJournals(project.id, previousJournals);
      setJournalCommentDrafts(previousCommentDrafts);
      setExpandedJournalComments(previousExpandedJournalComments);
      setLikedJournalComments(previousLikedJournalComments);
      setFeedbackModal({
        title: '댓글 저장 실패',
        body: getFundingApiErrorMessage(error, '양조일지 댓글을 저장하지 못했습니다.'),
      });
    }
  };

  const handleJournalCommentLike = async (journalKey: string, commentId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const likeKey = `${journalKey}:${commentId}`;
    const targetJournal = journals.find((entry) => getJournalMergeKey(entry) === journalKey);
    const targetComment = targetJournal
      ?.comments.find((comment) => comment.id === commentId);
    if (!targetJournal || !targetComment) return;
    const isLiked = Boolean(targetComment && likedJournalComments.has(likeKey) && (targetComment.likes || 0) > 0);
    const previousJournals = journals;
    const previousLikedJournalComments = likedJournalComments;
    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (getJournalMergeKey(entry) !== journalKey) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: Math.max(0, (comment.likes || 0) + (isLiked ? -1 : 1)), liked: !isLiked }
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

    try {
      const response = isLiked
        ? await unlikeBreweryLogComment(project.id, targetJournal.id, commentId)
        : await likeBreweryLogComment(project.id, targetJournal.id, commentId);
      updateProjectJournals(
        project.id,
        (projectRef.current?.journals || []).map((entry) => {
          if (getJournalMergeKey(entry) !== journalKey) return entry;
          return {
            ...entry,
            comments: (entry.comments || []).map((comment) =>
              comment.id === commentId
                ? { ...comment, likes: Math.max(response.likeCount, response.liked ? 1 : 0), liked: response.liked }
                : comment
            ),
          };
        })
      );
      setLikedJournalComments((prev) => {
        const next = new Set(prev);
        if (response.liked) next.add(likeKey);
        else next.delete(likeKey);
        return next;
      });
    } catch (error) {
      updateProjectJournals(project.id, previousJournals);
      setLikedJournalComments(previousLikedJournalComments);
      setFeedbackModal({
        title: '좋아요 처리 실패',
        body: getFundingApiErrorMessage(error, '양조일지 댓글 좋아요 처리 중 문제가 발생했습니다.'),
      });
    }
  };

  const handleJournalReplyOpen = (journalKey: string, commentId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 답글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const replyKey = `${journalKey}:${commentId}`;
    setExpandedJournalReplies((prev) => new Set([...prev, replyKey]));
    setReplyingToJournalComment(replyKey);
    setTimeout(() => {
      journalReplyInputRefs.current[replyKey]?.focus();
    }, 80);
  };

  const handleAddJournalReply = async (journalKey: string, commentId: number) => {
    const replyKey = `${journalKey}:${commentId}`;
    const content = journalReplyDrafts[replyKey]?.trim();
    if (!content) return;
    if (!user) {
      showLoginRequired('양조일지 댓글 답글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const replyIds = new Set(journals.flatMap((entry) =>
      (entry.comments || []).flatMap((comment) => (comment.replies || []).map((reply) => reply.id))
    ));
    const replyId = getUniqueLocalId(replyIds, JOURNAL_LOCAL_REPLY_ID_OFFSET);
    const nextReply: JournalReply = {
      id: replyId,
      commentId,
      userName: user.name || "사용자",
      isBrewery: canManageOwnBreweryProject,
      content,
      date: todayText(),
      likes: 0,
    };
    const targetJournal = journals.find((entry) => getJournalMergeKey(entry) === journalKey);
    if (!targetJournal) return;
    const previousJournals = journals;
    const previousReplyDrafts = journalReplyDrafts;
    const previousReplyingToJournalComment = replyingToJournalComment;
    const previousExpandedJournalReplies = expandedJournalReplies;
    const previousLikedJournalReplies = likedJournalReplies;

    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (getJournalMergeKey(entry) !== journalKey) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) =>
            comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), nextReply] } : comment
          ),
        };
      })
    );
    setLikedJournalReplies((prev) => {
      const likeKey = `${journalKey}:${commentId}:${replyId}`;
      if (!prev.has(likeKey)) return prev;
      const next = new Set(prev);
      next.delete(likeKey);
      return next;
    });
    setJournalReplyDrafts((prev) => ({ ...prev, [replyKey]: "" }));
    setReplyingToJournalComment(replyKey);
    setExpandedJournalReplies((prev) => new Set([...prev, replyKey]));
    try {
      const response = await createBreweryLogCommentReply(project.id, targetJournal.id, commentId, content);
      const responseWriter = resolveBreweryLogWriter(response, user, project);
      updateProjectJournals(
        project.id,
        (projectRef.current?.journals || []).map((entry) => {
          if (getJournalMergeKey(entry) !== journalKey) return entry;
          return {
            ...entry,
            comments: (entry.comments || []).map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: (comment.replies || []).map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        id: response.replyId || reply.id,
                        userName: responseWriter.userName || reply.userName,
                        isBrewery: responseWriter.isBrewery,
                        date: formatApiDate(response.createdAt),
                      }
                    : reply
                ),
              };
            }),
          };
        })
      );
    } catch (error) {
      updateProjectJournals(project.id, previousJournals);
      setJournalReplyDrafts(previousReplyDrafts);
      setReplyingToJournalComment(previousReplyingToJournalComment);
      setExpandedJournalReplies(previousExpandedJournalReplies);
      setLikedJournalReplies(previousLikedJournalReplies);
      setFeedbackModal({
        title: '답글 저장 실패',
        body: getFundingApiErrorMessage(error, '양조일지 답글을 저장하지 못했습니다.'),
      });
    }
  };

  const handleJournalReplyLike = async (journalKey: string, commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('양조일지 댓글 답글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }

    const likeKey = `${journalKey}:${commentId}:${replyId}`;
    const targetJournal = journals.find((entry) => getJournalMergeKey(entry) === journalKey);
    const targetReply = targetJournal
      ?.comments.find((comment) => comment.id === commentId)
      ?.replies.find((reply) => reply.id === replyId);
    if (!targetJournal || !targetReply) return;
    const isLiked = Boolean(targetReply && likedJournalReplies.has(likeKey) && (targetReply.likes || 0) > 0);
    const previousJournals = journals;
    const previousLikedJournalReplies = likedJournalReplies;
    updateProjectJournals(
      project.id,
      journals.map((entry) => {
        if (getJournalMergeKey(entry) !== journalKey) return entry;
        return {
          ...entry,
          comments: (entry.comments || []).map((comment) => {
            if (comment.id !== commentId) return comment;
            return {
              ...comment,
              replies: (comment.replies || []).map((reply) =>
                reply.id === replyId
                  ? { ...reply, likes: Math.max(0, (reply.likes || 0) + (isLiked ? -1 : 1)), liked: !isLiked }
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

    try {
      const response = isLiked
        ? await unlikeBreweryLogReply(project.id, targetJournal.id, commentId, replyId)
        : await likeBreweryLogReply(project.id, targetJournal.id, commentId, replyId);
      updateProjectJournals(
        project.id,
        (projectRef.current?.journals || []).map((entry) => {
          if (getJournalMergeKey(entry) !== journalKey) return entry;
          return {
            ...entry,
            comments: (entry.comments || []).map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: (comment.replies || []).map((reply) =>
                  reply.id === replyId
                    ? { ...reply, likes: Math.max(response.likeCount, response.liked ? 1 : 0), liked: response.liked }
                    : reply
                ),
              };
            }),
          };
        })
      );
      setLikedJournalReplies((prev) => {
        const next = new Set(prev);
        if (response.liked) next.add(likeKey);
        else next.delete(likeKey);
        return next;
      });
    } catch (error) {
      updateProjectJournals(project.id, previousJournals);
      setLikedJournalReplies(previousLikedJournalReplies);
      setFeedbackModal({
        title: '좋아요 처리 실패',
        body: getFundingApiErrorMessage(error, '양조일지 답글 좋아요 처리 중 문제가 발생했습니다.'),
      });
    }
  };

  const handleReviewWrite = () => {
    if (!user) {
      showLoginRequired('후기 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    if (!canShowAndWriteReviews) {
      setFeedbackModal({
        title: '후기 작성 불가',
        body: '후기는 성사된 펀딩에서만 작성할 수 있습니다.',
      });
      return;
    }
    const canStartReview = canWriteFundingReview || Boolean(myReview);
    if (!canStartReview) {
      setFeedbackModal({
        title: '후기 작성 불가',
        body: '해당 펀딩에 참여하지 않았습니다.',
      });
      return;
    }
    if (myReview) {
      setReviewEditPrompt(myReview);
      return;
    }
    router.push(`/archive/review/${project.id}` as any);
  };

  const handleReviewPress = (reviewId: number) => {
    router.push(`/funding/${project.id}/review/${reviewId}` as any);
  };

  const handleShareProject = async () => {
    const shareProject = async (shareUrl: string, title = project.title, summary = project.shortDescription || project.projectSummary || '') => {
      await NativeShare.share({
        title,
        message: `${title}\n${summary}\n${shareUrl}\n주담 펀딩 프로젝트를 확인해보세요.`,
        url: shareUrl,
      });
      setShowShareModal(false);
    };

    try {
      const share = await getFundingShareLink(project.id);
      if (!share.shareUrl) throw new Error('공유 링크가 비어 있습니다.');
      await shareProject(share.shareUrl, share.title || project.title, share.summary || project.shortDescription || project.projectSummary || '');
    } catch {
      setFeedbackModal({
        title: '공유하기',
        body: '공유를 완료하지 못했습니다. 다시 시도해주세요.',
      });
    }
  };

  const handleSubmitReport = async () => {
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
    try {
      await createFundingReport(project.id, {
        reason: reportReason as FundingReportReason,
        content: reportDetail.trim() || undefined,
      });
      setShowReportModal(false);
      setReportReason("");
      setReportDetail("");
      setFeedbackModal({
        title: '신고가 접수되었습니다',
        body: '검토 후 필요한 조치를 진행하겠습니다.',
      });
    } catch (error) {
      setFeedbackModal({
        title: '신고 등록 실패',
        body: getReportSubmitErrorMessage(error),
      });
    }
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
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[canManageOwnBreweryProject ? 5 : 4]}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 1. Hero Visual */}
        <View style={styles.visualContainer}>
          {heroImageSources.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={styles.heroCarousel}
                onMomentumScrollEnd={handleHeroImageScroll}
              >
                {heroImageSources.map((source, index) => (
                  <Image
                    key={`hero-image-${index}`}
                    source={source}
                    style={[styles.mainImg, { width: viewportWidth }]}
                  />
                ))}
              </ScrollView>
              {heroImageSources.length > 1 && (
                <>
                  <View style={styles.heroImageCounter}>
                    <Text style={styles.heroImageCounterText}>
                      {activeHeroImageIndex + 1}/{heroImageSources.length}
                    </Text>
                  </View>
                  <View style={styles.heroImageDots}>
                    {heroImageSources.map((_, index) => (
                      <View
                        key={`hero-dot-${index}`}
                        style={[styles.heroImageDot, activeHeroImageIndex === index && styles.heroImageDotActive]}
                      />
                    ))}
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={[styles.mainImg, styles.emptyMainImage]}>
              <ImageIcon size={40} color="#9CA3AF" />
              <Text style={styles.emptyMainImageText}>등록된 대표 이미지가 없습니다</Text>
            </View>
          )}
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
          <Progress value={progressBarValue} style={styles.progressBar} indicatorStyle={{ backgroundColor: '#111' }} />
          <View style={styles.dateInfo}>
             <View style={styles.dateRow}>
                <Calendar size={16} color="#4B5563" />
                <Text style={styles.dateTxt}>{isProjectSupportable ? `${project.daysLeft}일 남음` : projectStatusLabel}</Text>
             </View>
             <Text style={styles.periodTxt}>{project.startDate} ~ {project.endDate}</Text>
          </View>
          {!isOwnBreweryProject && !isProjectSupportable ? (
            <View style={styles.supportStatusNotice}>
              <Text style={styles.supportStatusNoticeText}>{supportUnavailableMessage}</Text>
            </View>
          ) : null}
        </Animated.View>

        {/* 4. Brewery Info */}
        <Animated.View entering={FadeInUp.delay(200)} style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity style={styles.breweryCard} activeOpacity={0.8} onPress={handleBreweryProfilePress}>
             <View style={styles.breweryLogo}>
               {project.breweryProfileImage ? (
                 <Image source={{ uri: project.breweryProfileImage }} style={styles.breweryLogoImage} />
               ) : (
                 <Text style={{ fontSize: 24 }}>{project.breweryLogo}</Text>
               )}
             </View>
             <View style={{ flex: 1 }}>
                <Text style={styles.breweryName}>{project.brewery}</Text>
                <Text style={styles.breweryLoc}>{project.location}</Text>
             </View>
             <View style={styles.catBadge}><Text style={styles.catTxt} numberOfLines={1}>{getFundingMainIngredientLabel(project)}</Text></View>
          </TouchableOpacity>
        </Animated.View>

        {canManageOwnBreweryProject && (
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
                               <Text style={styles.ingLab}>{mainIngredientLabel}</Text>
                               <Text style={styles.ingVal}>{project.mainIngredients || '-'}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>서브재료</Text>
                               <Text style={styles.ingVal}>{project.subIngredients || '-'}</Text>
                            </View>
                         </View>
                      </View>
                      <View style={styles.ingCardMini}>
                         <View style={styles.ingRow}>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>도수</Text>
                               <Text style={styles.ingVal}>{alcoholContent}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                               <Text style={styles.ingLab}>예상 배송일</Text>
                               <Text style={styles.ingVal}>{estimatedDelivery}</Text>
                            </View>
                         </View>
                      </View>
                   </View>

                   <View style={styles.summaryBox}>
                      <Text style={styles.summaryTitle}>📝 프로젝트 요약</Text>
                      <Text style={styles.summaryTxt}>{project.projectSummary || project.shortDescription || '등록된 프로젝트 요약이 없습니다.'}</Text>
                   </View>

                   {project.story ? <Text style={styles.bodyTxt}>{project.story}</Text> : null}
                   {project.videoUrl ? (
                     <View style={styles.journalUrlBox}>
                       <Text style={styles.journalUrlLabel}>프로젝트 영상 URL</Text>
                       <Text style={styles.journalUrlText} numberOfLines={2}>{project.videoUrl}</Text>
                     </View>
                   ) : null}
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
                         <Text style={styles.priceSub}>{bottleSize}</Text>
                      </View>
                   </View>

                   <View style={[styles.priceCard, { marginTop: 12 }]}>
                      <View style={[styles.priceStrip, { backgroundColor: '#D1D5DB' }]} />
                      <View style={styles.priceContent}>
                         <View>
                            <Text style={styles.priceLab}>총 판매 수량</Text>
                            <Text style={styles.priceVal}>{project.totalQuantity ? project.totalQuantity.toLocaleString() : '-'}<Text style={{ fontSize: 20, fontWeight: 'normal' }}>{project.totalQuantity ? '병' : ''}</Text></Text>
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
                   {projectBudget.length > 0 ? (
                     <>
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
                     </>
                   ) : budgetPlanText ? (
                     <Text style={styles.guideBoxTxt}>{budgetPlanText}</Text>
                   ) : (
                     <Text style={styles.emptySectionText}>등록된 예산 정보가 없습니다.</Text>
                   )}
                </View>

                {/* Schedule Section */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>프로젝트 일정</Text>
                   {projectSchedule.length > 0 ? (
                     <>
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
                     </>
                   ) : schedulePlanText ? (
                     <Text style={styles.guideBoxTxt}>{schedulePlanText}</Text>
                   ) : (
                     <Text style={styles.emptySectionText}>등록된 일정 정보가 없습니다.</Text>
                   )}
                </View>

                {/* Taste Profile (SVG Radar Chart) */}
                <View style={styles.sectionCard}>
                   <Text style={styles.sectionHeaderTitle}>맛 지표</Text>
                   <Text style={styles.sectionSub}>양조장이 예상하는 이 전통주의 맛 프로필입니다.</Text>
                   {tasteProfile ? (
                     <>
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
                     </>
                   ) : (
                     <Text style={styles.emptySectionText}>등록된 맛 지표가 없습니다.</Text>
                   )}
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
                        <Text style={projectPolicyText ? styles.guideBoxTxt : styles.emptySectionText}>
                          {projectPolicyText || '등록된 프로젝트 정책이 없습니다.'}
                        </Text>
                     </View>
                   </View>

                   <View style={{ paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                     <Text style={styles.guideHeading}>⚠️ 예상되는 어려움</Text>
                     <View style={styles.guideBoxPlain}>
                        <Text style={expectedDifficultiesText ? styles.guideBoxTxt : styles.emptySectionText}>
                          {expectedDifficultiesText || '등록된 리스크 안내가 없습니다.'}
                        </Text>
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
                                    {visibleEntries.map((entry, entryIndex) => {
                                      const journalKey = getJournalMergeKey(entry);
                                      const entryComments = entry.comments || [];
                                      const commentsOpen = expandedJournalComments.has(journalKey);
                                      const isJournalLiked = likedJournals.has(journalKey) && (entry.likes || 0) > 0;
                                      return (
                                        <View key={`${stage.id}-${entry.id}-${entryIndex}`} style={styles.journalEntryCard}>
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

                                          {entry.videoUrl ? (
                                            <View style={styles.journalUrlBox}>
                                              <Text style={styles.journalUrlLabel}>영상 URL</Text>
                                              <Text style={styles.journalUrlText} numberOfLines={2}>{entry.videoUrl}</Text>
                                            </View>
                                          ) : null}

                                          <View style={styles.journalActionRow}>
                                            <TouchableOpacity style={styles.journalActionButton} onPress={() => handleJournalLike(journalKey)}>
                                              <Heart size={16} color={isJournalLiked ? "#EF4444" : "#9CA3AF"} fill={isJournalLiked ? "#EF4444" : "transparent"} />
                                              <Text style={[styles.journalActionText, isJournalLiked && styles.journalActionTextActive]}>{entry.likes || 0}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.journalActionButton} onPress={() => toggleJournalComments(journalKey)}>
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
                                                    key={`journal-comment-input-${journalKey}`}
                                                    style={styles.journalCommentInput}
                                                    value={journalCommentDrafts[journalKey] || ""}
                                                    onChangeText={(text) => setJournalCommentDrafts((prev) => ({ ...prev, [journalKey]: text }))}
                                                    placeholder="댓글을 입력하세요..."
                                                    placeholderTextColor="#9CA3AF"
                                                    returnKeyType="send"
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => handleAddJournalComment(entry, journalKey)}
                                                  />
                                                  <TouchableOpacity style={styles.journalCommentSend} onPress={() => handleAddJournalComment(entry, journalKey)}>
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
                                                    const commentLikeKey = `${journalKey}:${comment.id}`;
                                                    const replyKey = `${journalKey}:${comment.id}`;
                                                    const isCommentLiked = likedJournalComments.has(commentLikeKey) && (comment.likes || 0) > 0;
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
                                                          <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalCommentLike(journalKey, comment.id)}>
                                                            <Heart size={13} color={isCommentLiked ? "#EF4444" : "#9CA3AF"} fill={isCommentLiked ? "#EF4444" : "transparent"} />
                                                            <Text style={[styles.journalCommentLikeText, isCommentLiked && styles.journalActionTextActive]}>{comment.likes || 0}</Text>
                                                          </TouchableOpacity>
                                                          <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalReplyOpen(journalKey, comment.id)}>
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
                                                              const replyLikeKey = `${journalKey}:${comment.id}:${reply.id}`;
                                                              const isReplyLiked = likedJournalReplies.has(replyLikeKey) && (reply.likes || 0) > 0;
                                                              return (
                                                                <View key={reply.id} style={styles.journalReplyCard}>
                                                                  <View style={styles.journalCommentMeta}>
                                                                    <Text style={styles.commentUser}>{reply.userName}</Text>
                                                                    {reply.isBrewery && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                                                    <Text style={styles.commentDate}>{reply.date}</Text>
                                                                  </View>
                                                                  <Text style={styles.journalCommentText}>{reply.content}</Text>
                                                                  <TouchableOpacity style={styles.journalCommentAction} onPress={() => handleJournalReplyLike(journalKey, comment.id, reply.id)}>
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
                                                              key={`journal-reply-input-${replyKey}`}
                                                              ref={(input) => {
                                                                journalReplyInputRefs.current[replyKey] = input;
                                                              }}
                                                              style={styles.journalReplyInput}
                                                              value={journalReplyDrafts[replyKey] || ""}
                                                              onChangeText={(text) => setJournalReplyDrafts((prev) => ({ ...prev, [replyKey]: text }))}
                                                              placeholder="답글을 입력하세요..."
                                                              placeholderTextColor="#9CA3AF"
                                                              returnKeyType="send"
                                                              blurOnSubmit={false}
                                                              onSubmitEditing={() => handleAddJournalReply(journalKey, comment.id)}
                                                              autoFocus
                                                            />
                                                            <TouchableOpacity style={styles.journalReplySend} onPress={() => handleAddJournalReply(journalKey, comment.id)}>
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
	                          ref={qnaCommentInputRef}
	                          style={styles.qaInput}
	                          placeholder="댓글을 입력하세요..."
                          placeholderTextColor="#9CA3AF"
                          value={newComment}
                          onChangeText={setNewComment}
                          returnKeyType="send"
                          blurOnSubmit={false}
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
                      {comments.map((c, index) => {
                        const commentInputKey = getQnaCommentInputKey(c);
                        return (
                        <View key={getQnaCommentRenderKey(c, index)} style={[styles.commentCard, index === comments.length - 1 && { borderBottomWidth: 0 }]}>
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
                                 <ThumbsUp size={16} color={likedComments.has(c.id) && (c.likes || 0) > 0 ? "#111" : "#9CA3AF"} fill={likedComments.has(c.id) && (c.likes || 0) > 0 ? "#111" : "transparent"} />
                                 <Text style={[styles.actionTxt, likedComments.has(c.id) && (c.likes || 0) > 0 && { color: "#111" }]}>{c.likes || 0}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.commentAction} onPress={() => handleReplyOpen(c, commentInputKey)}>
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
                               {c.replies.map((r, replyIndex) => (
                                 <View key={getQnaReplyRenderKey(c, r.id, replyIndex)} style={styles.replyCard}>
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
                                          <ThumbsUp size={12} color={likedReplies.has(getQnaReplyLikeKey(c.id, r.id)) && (r.likes || 0) > 0 ? "#111" : "#9CA3AF"} fill={likedReplies.has(getQnaReplyLikeKey(c.id, r.id)) && (r.likes || 0) > 0 ? "#111" : "transparent"} />
                                          <Text style={[styles.replyLikeTxt, likedReplies.has(getQnaReplyLikeKey(c.id, r.id)) && (r.likes || 0) > 0 && { color: "#111" }]}>{r.likes || 0}</Text>
                                       </TouchableOpacity>
                                    </View>
                                 </View>
                               ))}
                             </View>
                           )}

                           {replyingTo === commentInputKey && (
                             <View style={styles.replyInputRow}>
	                                <TextInput
                                    key={`qna-reply-input-${commentInputKey}`}
	                                  ref={(input) => {
	                                    qnaReplyInputRefs.current[commentInputKey] = input;
	                                  }}
	                                  style={styles.replyInput}
                                  placeholder="답글을 입력하세요..."
                                  placeholderTextColor="#9CA3AF"
                                  value={replyDrafts[commentInputKey] || ""}
                                  onChangeText={(text) => setReplyDrafts((prev) => ({ ...prev, [commentInputKey]: text }))}
                                  returnKeyType="send"
                                  blurOnSubmit={false}
                                  onSubmitEditing={() => handleAddReply(c, commentInputKey)}
                                  autoFocus
                                />
                                <TouchableOpacity style={styles.replySend} onPress={() => handleAddReply(c, commentInputKey)}>
                                   <Send size={16} color="#FFF" />
                                </TouchableOpacity>
                             </View>
                           )}
                        </View>
                      );
                      })}

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
                      {canShowAndWriteReviews && <Text style={styles.countTxt}>{projectReviews.length}개</Text>}
                   </View>
                   
                   {!canShowAndWriteReviews ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircle}>
                           <Target size={32} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>후기 준비중입니다!</Text>
                        <Text style={styles.emptySub}>펀딩이 성사되면 후기를 확인할 수 있어요</Text>
                     </View>
                   ) : projectReviews.length === 0 ? (
                     <View style={styles.emptyReviews}>
                        <View style={styles.emptyIconCircleDashed}>
                           <Star size={36} color="#D1D5DB" />
                        </View>
                        <Text style={styles.emptyTitle}>아직 후기가 없어요</Text>
                        <Text style={styles.emptySubMulti}>이 술을 마셔본 첫 번째 후기를{'\n'}남겨주세요! 다른 분들에게 큰 도움이 돼요 🍶</Text>
                         {canWriteFundingReview && (
                         <TouchableOpacity style={styles.writeReviewBtn} onPress={handleReviewWrite}>
                           <Star size={16} color="#FFF" />
                           <Text style={styles.writeReviewTxt}>첫 번째 후기 작성하기</Text>
                         </TouchableOpacity>
                         )}
                     </View>
                   ) : (
                     <View style={styles.reviewList}>
                        {projectReviews.map((r) => {
                          const reviewImageUrls = normalizeFundingImageUrls([r.imageUrls, r.images]);
                          return (
                          <TouchableOpacity key={r.id} style={styles.reviewCard} activeOpacity={0.85} onPress={() => handleReviewPress(r.id)}>
                             <View style={styles.rowBetween}>
                                <View>
                                   <View style={styles.reviewUserRow}>
                                      <Text style={styles.reviewUser}>{r.userName}</Text>
                                      {shouldShowFundingBreweryBadge(r) && <View style={styles.brewBadge}><Text style={styles.brewBadgeTxt}>양조장</Text></View>}
                                   </View>
                                   <View style={styles.starRow}>
                                      <FundingStarRating rating={r.rating} size={14} gap={2} />
                                   </View>
                                   <Text style={styles.reviewReward} numberOfLines={1}>{r.rewardName}</Text>
                                </View>
                                <Text style={styles.reviewDate}>{r.date}</Text>
                             </View>
                             {reviewImageUrls.length > 0 && (
                               <View style={styles.reviewImagePreviewRow}>
                                 {reviewImageUrls.slice(0, 3).map((image, imageIndex) => (
                                   <View key={`${image}-${imageIndex}`} style={styles.reviewImagePreviewWrap}>
                                     <Image
                                       source={{ uri: image }}
                                       style={styles.reviewImagePreview}
                                     />
                                     {imageIndex === 2 && reviewImageUrls.length > 3 && (
                                       <View style={styles.reviewImageMoreOverlay}>
                                         <Text style={styles.reviewImageMoreText}>+{reviewImageUrls.length - 3}</Text>
                                       </View>
                                     )}
                                   </View>
                                 ))}
                               </View>
                             )}
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
                          );
                        })}
                         {canWriteFundingReview && (
                         <TouchableOpacity style={styles.writeReviewOutline} onPress={handleReviewWrite}>
                           <Text style={styles.writeReviewOutlineTxt}>✏️ 나도 후기 작성하기</Text>
                         </TouchableOpacity>
                         )}
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
              <TouchableOpacity onPress={() => router.push('/funding?sort=recommend&scrollToTop=1' as any)}>
                 <Text style={styles.guideLink}>더보기</Text>
              </TouchableOpacity>
           </View>
           <View style={styles.recGrid}>
             {recommendedProjects.map(p => (
               <FundingProjectCard
                 key={p.id}
                 project={p}
                 favorite={isFavoriteFunding(p.id)}
                 onPress={() => router.push(`/funding/${p.id}?fromProjectId=${project.id}` as any)}
                 onFavoritePress={handleFavoritePress}
               />
             ))}
           </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
         <TouchableOpacity style={styles.heartBtn} onPress={() => handleFavoritePress(project.id)}>
            <Heart size={34} color={isProjectFavorite ? "#EF4444" : "#111"} fill={isProjectFavorite ? "#EF4444" : "transparent"} />
            <Text style={[styles.heartCountText, isProjectFavorite && styles.heartCountTextActive]}>{favoriteCountLabel}</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.mainSupportBtn, isMainSupportButtonMuted && { backgroundColor: '#374151' }]}
           onPress={handleSupportClick}
         >
            <Text style={styles.mainSupportTxt}>{supportButtonLabel}</Text>
         </TouchableOpacity>
      </View>

      <Modal visible={showFundingOptionModal} animationType="fade" transparent>
        <View style={styles.optionOverlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, styles.modalBackdrop]} onPress={() => setShowFundingOptionModal(false)} activeOpacity={1} />
          <Animated.View entering={SlideInDown} style={styles.optionModal}>
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>후원 옵션 선택</Text>
              <TouchableOpacity style={styles.optionClose} onPress={() => setShowFundingOptionModal(false)}>
                <Text style={styles.optionCloseTxt}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionBodyScroll} contentContainerStyle={styles.optionBody} showsVerticalScrollIndicator={false}>
              <View style={styles.optionProjectBox}>
                {projectImageSource ? (
                  <Image source={projectImageSource} style={styles.optionProjectImg} />
                ) : (
                  <View style={[styles.optionProjectImg, styles.emptyOptionImage]}>
                    <ImageIcon size={22} color="#9CA3AF" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionBrewery}>{project.brewery}</Text>
                  <Text style={styles.optionProjectTitle} numberOfLines={2}>{project.title}</Text>
                </View>
              </View>

              {supportOptions.length > 0 && (
                <View style={styles.supportOptionList}>
                  <Text style={styles.supportOptionSectionTitle}>후원 옵션</Text>
                  {supportOptions.map((option) => {
                    const optionId = normalizeSupportOptionId(option.optionId);
                    const selected = optionId === supportOptionId;
                    const stockLabel = getSupportOptionStockLabel(option);
                    return (
                      <TouchableOpacity
                        key={`${option.optionId}-${option.name}`}
                        style={[styles.supportOptionCard, selected && styles.supportOptionCardSelected]}
                        onPress={() => handleSelectSupportOption(option)}
                        activeOpacity={0.84}
                      >
                        <View style={styles.supportOptionTop}>
                          <Text style={[styles.supportOptionName, selected && styles.supportOptionNameSelected]} numberOfLines={2}>
                            {option.name}
                          </Text>
                          <Text style={styles.supportOptionPrice}>{option.price.toLocaleString()}원</Text>
                        </View>
                        {option.description ? (
                          <Text style={styles.supportOptionDesc} numberOfLines={2}>{option.description}</Text>
                        ) : null}
                        {(stockLabel || option.maxPerUser) ? (
                          <Text style={styles.supportOptionMeta}>
                            {[stockLabel, option.maxPerUser ? `1인 최대 ${option.maxPerUser}개` : ''].filter(Boolean).join(' · ')}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={styles.optionSpecGrid}>
                <View style={styles.optionSpecCard}>
                  <Text style={styles.optionSpecLabel}>용량</Text>
                  <Text style={styles.optionSpecValue}>{bottleSize}</Text>
                </View>
                <View style={styles.optionSpecCard}>
                  <Text style={styles.optionSpecLabel}>도수</Text>
                  <Text style={styles.optionSpecValue}>{alcoholContent}</Text>
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
                <TouchableOpacity
                  style={[
                    styles.quantityControl,
                    selectedSupportOptionLimit !== null && selectedQuantity >= selectedSupportOptionLimit && styles.quantityControlDisabled,
                  ]}
                  onPress={handleIncreaseQuantity}
                  disabled={selectedSupportOptionLimit !== null && selectedQuantity >= selectedSupportOptionLimit}
                >
                  <Plus size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionPriceBox}>
                <View style={styles.optionPriceRow}>
                  <Text style={styles.optionPriceLabel}>선택 옵션</Text>
                  <Text style={styles.optionPriceValue} numberOfLines={1}>{selectedSupportOptionName}</Text>
                </View>
                <View style={styles.optionPriceRow}>
                  <Text style={styles.optionPriceLabel}>상품 금액</Text>
                  <Text style={styles.optionPriceValue}>{(selectedSupportOptionPrice * selectedQuantity).toLocaleString()}원</Text>
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
                  <Text style={styles.deliveryNoticeTxt}>{estimatedDelivery}</Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.optionFooter}>
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
                ['FALSE_INFORMATION', '허위 정보'],
                ['INAPPROPRIATE_CONTENT', '부적절한 내용'],
                ['COPYRIGHT', '저작권 침해'],
                ['FRAUD', '사기 의심'],
                ['ETC', '기타'],
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

      <Modal visible={Boolean(reviewEditPrompt)} animationType="fade" transparent>
        <View style={styles.actionModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setReviewEditPrompt(null)} />
          <Animated.View entering={SlideInDown} style={styles.actionModal}>
            <Text style={styles.actionModalTitle}>이미 작성한 후기입니다</Text>
            <Text style={styles.actionModalBody}>이 펀딩에는 후기를 한 번만 작성할 수 있어요. 기존 후기를 수정하시겠습니까?</Text>
            <View style={styles.reportFooter}>
              <TouchableOpacity style={styles.reportCancelButton} onPress={() => setReviewEditPrompt(null)}>
                <Text style={styles.reportCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.reportSubmitButton, { backgroundColor: '#111' }]}
                onPress={() => {
                  const targetReview = reviewEditPrompt;
                  setReviewEditPrompt(null);
                  if (targetReview) {
                    router.push(`/archive/review/${project.id}?reviewId=${targetReview.id}` as any);
                  }
                }}
              >
                <Text style={styles.reportSubmitText}>수정하기</Text>
              </TouchableOpacity>
            </View>
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
  visualContainer: { width: '100%', height: HERO_IMAGE_HEIGHT, backgroundColor: '#E5E7EB', zIndex: 1 },
  heroCarousel: { width: '100%', height: HERO_IMAGE_HEIGHT },
  mainImg: { width: '100%', height: HERO_IMAGE_HEIGHT, resizeMode: 'cover' },
  emptyMainImage: { alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#F3F4F6' },
  emptyMainImageText: { fontSize: 13, fontWeight: '900', color: '#9CA3AF' },
  heroImageCounter: { position: 'absolute', top: 14, right: 14, minWidth: 44, height: 26, borderRadius: 13, backgroundColor: 'rgba(17,17,17,0.72)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  heroImageCounterText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  heroImageDots: { position: 'absolute', left: 0, right: 0, bottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  heroImageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' },
  heroImageDotActive: { width: 18, backgroundColor: '#FFF' },
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
  supportStatusNotice: { marginTop: 14, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  supportStatusNoticeText: { fontSize: 13, fontWeight: '700', color: '#4B5563', lineHeight: 19 },
  breweryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  breweryLogo: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  breweryLogoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  breweryName: { fontSize: 16, fontWeight: '700', color: '#111' },
  breweryLoc: { fontSize: 12, color: '#6B7280' },
  catBadge: { maxWidth: 112, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 16, marginLeft: 'auto' },
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
  emptySectionText: { fontSize: 13, color: '#9CA3AF', lineHeight: 20, fontWeight: '700' },
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
  journalUrlBox: { marginTop: 12, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, gap: 4 },
  journalUrlLabel: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  journalUrlText: { fontSize: 12, fontWeight: '800', color: '#111', lineHeight: 18 },
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
  reviewUserRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  reviewUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  reviewDate: { fontSize: 12, color: '#6B7280' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 4, marginBottom: 8 },
  reviewReward: { fontSize: 11, fontWeight: '800', color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', maxWidth: 180 },
  reviewImagePreviewRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 12 },
  reviewImagePreviewWrap: { width: 74, height: 74, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  reviewImagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  reviewImageMoreOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.58)', alignItems: 'center', justifyContent: 'center' },
  reviewImageMoreText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
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
  recGrid: { gap: 16 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12, zIndex: 40 },
  heartBtn: { width: 56, height: 56, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  heartCountText: { position: 'absolute', top: 23, left: 0, right: 0, textAlign: 'center', fontSize: 9, lineHeight: 10, fontWeight: '900', color: '#111', includeFontPadding: false },
  heartCountTextActive: { color: '#FFF' },
  mainSupportBtn: { flex: 1, height: 56, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  mainSupportTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  optionOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  modalBackdrop: { zIndex: 0 },
  optionModal: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', height: '80%', maxHeight: '88%', zIndex: 1, elevation: 24 },
  optionHeader: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  optionClose: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  optionCloseTxt: { fontSize: 24, color: '#6B7280', marginTop: -2 },
  optionBodyScroll: { flex: 1 },
  optionBody: { padding: 20, gap: 16, paddingBottom: 20 },
  optionFooter: { padding: 20, paddingTop: 12, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
  optionProjectBox: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionProjectImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E7EB' },
  emptyOptionImage: { alignItems: 'center', justifyContent: 'center' },
  optionBrewery: { fontSize: 12, color: '#6B7280', fontWeight: '700', marginBottom: 4 },
  optionProjectTitle: { fontSize: 14, color: '#111', fontWeight: '900', lineHeight: 20 },
  supportOptionList: { gap: 8 },
  supportOptionSectionTitle: { fontSize: 13, color: '#111', fontWeight: '900' },
  supportOptionCard: { borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFF', borderRadius: 14, padding: 13, gap: 6 },
  supportOptionCardSelected: { borderColor: '#111', backgroundColor: '#F9FAFB' },
  supportOptionTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  supportOptionName: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '900', lineHeight: 20 },
  supportOptionNameSelected: { color: '#111' },
  supportOptionPrice: { fontSize: 14, color: '#111', fontWeight: '900' },
  supportOptionDesc: { fontSize: 12, color: '#6B7280', fontWeight: '700', lineHeight: 18 },
  supportOptionMeta: { fontSize: 11, color: '#9CA3AF', fontWeight: '800' },
  optionSpecGrid: { flexDirection: 'row', gap: 8 },
  optionSpecCard: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 12 },
  optionSpecLabel: { fontSize: 12, color: '#6B7280', fontWeight: '700', marginBottom: 4 },
  optionSpecValue: { fontSize: 14, color: '#111', fontWeight: '900' },
  quantityBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  quantityControl: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  quantityControlDisabled: { opacity: 0.35 },
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
