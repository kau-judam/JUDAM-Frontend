import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  ImageOff,
  MessageCircle,
  Sparkles,
  Rocket,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Send,
  ThumbsUp,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { getImageSource, recipesData } from '@/constants/data';
import {
  createRecipeComment,
  deleteRecipe,
  deleteRecipeComment,
  deleteRecipeCommentLike,
  deleteRecipeInterest,
  fetchRecipeComments,
  fetchRecipeCommentReplies,
  fetchRecipeDetail,
  getRecipeAccessToken,
  mapRecipeComment,
  createRecipeCommentReply,
  registerRecipeCommentLike,
  registerRecipeInterest,
  updateRecipeComment,
} from '@/features/recipe/api';
import {
  appendRecipeReplyState,
  getRecipeCommentCountState,
  getRecipeInterestState,
  getRecipeReplyCountState,
  getRecipeReplyState,
  isCurrentUserRecipe,
  markRecipeDeleted,
  setRecipeCommentCountState,
  setRecipeInterestState,
  setRecipeReplyCountState,
  setRecipeReplyState,
} from '@/features/recipe/interestState';
import { showLoginRequired } from '@/utils/authPrompt';

const INITIAL_COMMENT_COUNT = 3;
const personImages = [
  require('../../../../newpicutre/person1.png'),
  require('../../../../newpicutre/person2.png'),
  require('../../../../newpicutre/person3.png'),
  require('../../../../newpicutre/person4.png'),
  require('../../../../newpicutre/person5.png'),
  require('../../../../newpicutre/person6.png'),
];

type AvatarValue = ImageSourcePropType | string | null | undefined;
const getOptionalAvatarSource = (avatar?: AvatarValue) => {
  if (typeof avatar === 'string') {
    const trimmed = avatar.trim();
    return trimmed ? { uri: trimmed } : null;
  }
  return avatar || null;
};
const getCurrentUserAvatar = (profileImage?: string | null): AvatarValue => profileImage?.trim() || null;
const getAvatarInitial = (name?: string) => (name?.trim()?.[0] || 'U').toUpperCase();

interface RecipeCommentReply {
  id: number;
  author: string;
  avatar?: AvatarValue;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  authorType: 'user' | 'brewery';
  userId?: number;
  isMine?: boolean;
}

interface RecipeComment {
  id: number;
  author: string;
  avatar?: AvatarValue;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  authorType: 'user' | 'brewery';
  userId?: number;
  isMine?: boolean;
  replyCount?: number;
  replies?: RecipeCommentReply[];
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const rawRecipeId = Array.isArray(id) ? id[0] : id;
  const recipeId = Number(rawRecipeId);
  const fallbackRecipe = recipesData.find((item) => item.id === recipeId) || recipesData[0];

  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [recipeMenuVisible, setRecipeMenuVisible] = useState(false);
  const [commentMenuTarget, setCommentMenuTarget] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [loadedReplyCommentIds, setLoadedReplyCommentIds] = useState<Set<number>>(new Set());
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [recipe, setRecipe] = useState({
    id: fallbackRecipe.id,
    title: fallbackRecipe.title,
    author: fallbackRecipe.author,
    authorAvatar: personImages[(fallbackRecipe.id - 1) % personImages.length],
    alcoholRange: '6%~8%',
    description: fallbackRecipe.description,
    concept: fallbackRecipe.concept,
    mainIngredients: fallbackRecipe.ingredients?.slice(0, 3) || ['쌀', '누룩', '물'],
    subIngredients: ['생수', '꿀'],
    flavorTags: ['달콤한', '부드러운', '은은한 산미'],
    commentsCount: fallbackRecipe.comments,
    timestamp: fallbackRecipe.timestamp,
    image: fallbackRecipe.image,
    isFundable: fallbackRecipe.isFundable,
    authorId: fallbackRecipe.authorId,
  });
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [showVerificationPendingModal, setShowVerificationPendingModal] = useState(false);

  const loadRecipeFromApi = useCallback(async () => {
    if (!Number.isFinite(recipeId)) return;
    setIsDetailLoading(true);
    setComments([]);
    setShowAllComments(false);
    setExpandedComments(new Set());
    setLoadedReplyCommentIds(new Set());
    setCommentMenuTarget(null);
    setEditingCommentId(null);
    setCommentInput('');
    try {
      const nextRecipe = await fetchRecipeDetail(recipeId);
      setRecipe({
        id: nextRecipe.id,
        title: nextRecipe.title,
        author: nextRecipe.author,
        authorAvatar: nextRecipe.authorAvatar || (nextRecipe.authorId === user?.id ? user?.profileImage || null : null),
        alcoholRange: nextRecipe.alcoholRange || '6%~8%',
        description: nextRecipe.description,
        concept: nextRecipe.concept,
        mainIngredients: nextRecipe.ingredients?.length ? nextRecipe.ingredients : ['쌀', '누룩', '물'],
        subIngredients: nextRecipe.subIngredients || [],
        flavorTags: nextRecipe.flavorTags || [],
        commentsCount: nextRecipe.comments,
        timestamp: nextRecipe.timestamp,
        image: nextRecipe.image,
        isFundable: nextRecipe.isFundable,
        authorId: nextRecipe.authorId,
      });
      const interestState = getRecipeInterestState(nextRecipe.id);
      const commentCountState = getRecipeCommentCountState(nextRecipe.id);
      setLiked(interestState?.liked ?? Boolean(nextRecipe.liked));
      setLikesCount(interestState?.likes ?? nextRecipe.likes);
      setRecipe((prev) => ({ ...prev, commentsCount: commentCountState ?? prev.commentsCount }));
    } catch (error) {
      console.warn('Failed to load recipe detail from API', error);
      setRecipe({
        id: fallbackRecipe.id,
        title: fallbackRecipe.title,
        author: fallbackRecipe.author,
        authorAvatar: personImages[(fallbackRecipe.id - 1) % personImages.length],
        alcoholRange: fallbackRecipe.alcoholRange || '6%~8%',
        description: fallbackRecipe.description,
        concept: fallbackRecipe.concept,
        mainIngredients: fallbackRecipe.ingredients?.slice(0, 3) || ['쌀', '누룩', '물'],
        subIngredients: fallbackRecipe.subIngredients || ['생수', '꿀'],
        flavorTags: fallbackRecipe.flavorTags || ['달콤한', '부드러운', '은은한 산미'],
        commentsCount: fallbackRecipe.comments,
        timestamp: fallbackRecipe.timestamp,
        image: fallbackRecipe.image,
        isFundable: fallbackRecipe.isFundable,
        authorId: fallbackRecipe.authorId,
      });
      setLiked(Boolean(fallbackRecipe.liked));
      setLikesCount(fallbackRecipe.likes);
    } finally {
      setIsDetailLoading(false);
    }
  }, [fallbackRecipe, recipeId, user?.id, user?.profileImage]);

  const loadCommentsFromApi = useCallback(async () => {
    if (!Number.isFinite(recipeId)) return;
    try {
      const response = await fetchRecipeComments(recipeId);
      setComments(
        response.comments.map((comment) => {
          const mapped = mapRecipeComment(comment) as RecipeComment;
          const rememberedReplies = getRecipeReplyState(recipeId, mapped.id);
          const rememberedReplyCount = getRecipeReplyCountState(recipeId, mapped.id);
          return rememberedReplies.length
            ? { ...mapped, replyCount: rememberedReplyCount ?? mapped.replyCount ?? rememberedReplies.length, replies: rememberedReplies }
            : { ...mapped, replyCount: rememberedReplyCount ?? mapped.replyCount ?? 0 };
        })
      );
      setRecipeCommentCountState(recipeId, response.totalElements);
      setRecipe((prev) => ({ ...prev, commentsCount: response.totalElements }));
    } catch (error) {
      console.warn('Failed to load recipe comments from API', error);
      setComments([]);
    }
  }, [recipeId]);

  useEffect(() => {
    loadRecipeFromApi();
    loadCommentsFromApi();
  }, [loadRecipeFromApi, loadCommentsFromApi]);

  const isBreweryUser = user?.type === 'brewery';
  const isRecipeAuthor = Boolean(
    user &&
      (user.name === recipe.author ||
        recipe.authorId === user.id ||
        isCurrentUserRecipe(recipe.id))
  );
  const selectedComment = comments.find((comment) => comment.id === commentMenuTarget);
  const canManageSelectedComment = Boolean(user && (selectedComment?.author === user.name || selectedComment?.isMine));
  const getCommentReplies = (comment: RecipeComment) => comment.replies || [];
  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);
  const renderProfileAvatar = (avatar: AvatarValue, name: string, isReply = false) => {
    const source = getOptionalAvatarSource(avatar);
    return (
      <View style={isReply ? styles.replyAvatar : styles.commentAvatar}>
        {source ? (
          <Image source={source} style={isReply ? styles.replyAvatarImage : styles.commentAvatarImage} />
        ) : (
          <Text style={isReply ? styles.replyAvatarInitial : styles.commentAvatarInitial}>
            {getAvatarInitial(name)}
          </Text>
        )}
      </View>
    );
  };

  const loadRepliesFromApi = useCallback(async (commentId: number) => {
    if (!Number.isFinite(recipeId) || loadedReplyCommentIds.has(commentId)) return;
    try {
      const response = await fetchRecipeCommentReplies(recipeId, commentId);
      const mappedReplies: RecipeCommentReply[] = response.replies.map((reply) => {
        const mapped = mapRecipeComment(reply);
        return {
          id: mapped.id,
          author: mapped.author,
          avatar: mapped.avatar || null,
          content: mapped.content,
          timestamp: mapped.timestamp,
          likes: mapped.likes,
          liked: mapped.liked,
          authorType: mapped.authorType === 'brewery' ? 'brewery' : 'user',
          userId: mapped.userId,
          isMine: mapped.isMine,
        };
      });
      const rememberedReplies = getRecipeReplyState(recipeId, commentId);
      const nextReplies = [
        ...mappedReplies,
        ...rememberedReplies.filter((reply) => !mappedReplies.some((mappedReply) => mappedReply.id === reply.id)),
      ];
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: nextReplies,
              }
            : comment
        )
      );
      setRecipeReplyState(recipeId, commentId, nextReplies);
      setRecipeReplyCountState(recipeId, commentId, nextReplies.length);
      setLoadedReplyCommentIds((prev) => new Set([...prev, commentId]));
    } catch (error) {
      console.warn('Failed to load recipe comment replies from API', error);
    }
  }, [loadedReplyCommentIds, recipeId]);

  const handleLike = async () => {
    if (!user) {
      showLoginRequired('레시피 관심은 로그인 후 이용할 수 있어요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    const previousLiked = liked;
    const previousLikesCount = likesCount;
    const previousInterestState = getRecipeInterestState(recipe.id);
    const nextLiked = !liked;
    const optimisticLikesCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setRecipeInterestState(recipe.id, {
      liked: nextLiked,
      likes: optimisticLikesCount,
      isFundable: recipe.isFundable,
    });
    setLiked(nextLiked);
    setLikesCount(optimisticLikesCount);
    try {
      const response = nextLiked
        ? await registerRecipeInterest(recipe.id)
        : await deleteRecipeInterest(recipe.id);
      setRecipeInterestState(recipe.id, {
        liked: nextLiked,
        likes: response.data.interest_count,
        isFundable: response.data.is_fundable,
      });
      setLikesCount(response.data.interest_count);
      setRecipe((prev) => ({ ...prev, isFundable: response.data.is_fundable }));
    } catch (error) {
      console.warn('Failed to update recipe interest', error);
      setRecipeInterestState(recipe.id, previousInterestState);
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const handleCommentLike = async (cid: number) => {
    if (!user) {
      showLoginRequired('댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    const target = comments.find((comment) => comment.id === cid);
    if (!target) return;
    const nextLiked = !target.liked;
    setComments((prev) => prev.map((c) => c.id === cid ? { ...c, liked: nextLiked, likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1) } : c));
    try {
      const response = nextLiked
        ? await registerRecipeCommentLike(recipe.id, cid)
        : await deleteRecipeCommentLike(recipe.id, cid);
      setComments((prev) => prev.map((comment) => comment.id === cid ? { ...comment, liked: nextLiked, likes: response.data.like_count } : comment));
    } catch (error) {
      console.warn('Failed to update recipe comment like', error);
      setComments((prev) => prev.map((comment) => comment.id === cid ? target : comment));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!user) {
      showLoginRequired('댓글 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    try {
      if (editingCommentId !== null) {
        await updateRecipeComment(recipe.id, editingCommentId, commentInput.trim());
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingCommentId ? { ...comment, content: commentInput.trim(), timestamp: '방금 전' } : comment
          )
        );
        setEditingCommentId(null);
        setCommentInput('');
        return;
      }
      const response = await createRecipeComment(recipe.id, commentInput.trim());
      const nextCommentsCount = recipe.commentsCount + 1;
      setComments((prev) => [
        ...prev,
        {
          id: response.comment.comment_id,
          author: user.name,
          avatar: getCurrentUserAvatar(user.profileImage),
          content: response.comment.content,
          timestamp: '방금 전',
          likes: 0,
          liked: false,
          authorType: user.type === 'brewery' ? 'brewery' : 'user',
        },
      ]);
      setRecipe((prev) => ({ ...prev, commentsCount: nextCommentsCount }));
      setRecipeCommentCountState(recipe.id, nextCommentsCount);
      setCommentInput('');
    } catch (error) {
      console.warn('Failed to submit recipe comment', error);
      Alert.alert('요청 실패', '댓글 요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleReplyOpen = async (commentId: number) => {
    if (!user) {
      showLoginRequired('답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    await loadRepliesFromApi(commentId);
    setReplyInput('');
    setExpandedComments((prev) => new Set([...prev, commentId]));
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!replyInput.trim()) return;
    if (!user) {
      showLoginRequired('답글은 로그인 후 이용할 수 있어요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    try {
      const response = await createRecipeCommentReply(recipe.id, commentId, replyInput.trim());
      const newReply: RecipeCommentReply = {
        id: response.reply.comment_id,
        author: response.reply.nickname || user.name,
        avatar: getCurrentUserAvatar(user.profileImage),
        content: response.reply.content,
        timestamp: '방금 전',
        likes: response.reply.like_count,
        liked: false,
        authorType: user.type === 'brewery' ? 'brewery' : 'user',
        userId: response.reply.user_id,
        isMine: true,
      };
      const nextReplyCount = response.parent_reply_count ?? response.reply.parent_reply_count;
      appendRecipeReplyState(recipe.id, commentId, newReply);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replyCount: nextReplyCount ?? Math.max(comment.replyCount ?? 0, getCommentReplies(comment).length + 1),
                replies: [...getCommentReplies(comment), newReply],
              }
            : comment
        )
      );
      setRecipeReplyCountState(
        recipe.id,
        commentId,
        nextReplyCount ?? Math.max(comments.find((comment) => comment.id === commentId)?.replyCount ?? 0, getRecipeReplyState(recipe.id, commentId).length + 1)
      );
      setLoadedReplyCommentIds((prev) => new Set([...prev, commentId]));
      setReplyInput('');
      setReplyingTo(null);
      setExpandedComments((prev) => new Set([...prev, commentId]));
    } catch (error) {
      console.warn('Failed to submit recipe comment reply', error);
      Alert.alert('요청 실패', '답글 요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleReplyLike = async (commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('답글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    const targetComment = comments.find((comment) => comment.id === commentId);
    const targetReply = targetComment?.replies?.find((reply) => reply.id === replyId);
    if (!targetReply) return;
    const nextLiked = !targetReply.liked;
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: getCommentReplies(comment).map((reply) =>
                reply.id === replyId
                  ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                  : reply
              ),
            }
          : comment
      )
    );
    try {
      const response = nextLiked
        ? await registerRecipeCommentLike(recipe.id, replyId)
        : await deleteRecipeCommentLike(recipe.id, replyId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: getCommentReplies(comment).map((reply) =>
                  reply.id === replyId ? { ...reply, liked: nextLiked, likes: response.data.like_count } : reply
                ),
              }
            : comment
        )
      );
    } catch (error) {
      console.warn('Failed to update recipe comment reply like', error);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: getCommentReplies(comment).map((reply) => (reply.id === replyId ? targetReply : reply)),
              }
            : comment
        )
      );
    }
  };

  const toggleExpandComment = async (commentId: number) => {
    await loadRepliesFromApi(commentId);
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleRecipeDelete = async () => {
    setRecipeMenuVisible(false);
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    try {
      await deleteRecipe(recipe.id);
      markRecipeDeleted(recipe.id);
      router.replace('/recipe' as any);
    } catch (error) {
      console.warn('Failed to delete recipe', error);
      Alert.alert(
        '요청 실패',
        error instanceof Error ? error.message : '레시피 삭제를 처리하지 못했어요. 잠시 후 다시 시도해주세요.'
      );
    }
  };

  const handleCommentEdit = () => {
    if (!selectedComment) return;
    setCommentInput(selectedComment.content);
    setEditingCommentId(selectedComment.id);
    setCommentMenuTarget(null);
  };

  const handleCommentDelete = async () => {
    if (commentMenuTarget === null) return;
    const token = await getRecipeAccessToken();
    if (!token) {
      showLoginRequired('실제 로그인 API 연결 후 이용할 수 있어요.');
      return;
    }
    try {
      await deleteRecipeComment(recipe.id, commentMenuTarget);
      const nextCommentsCount = Math.max(0, recipe.commentsCount - 1);
      setComments((prev) => prev.filter((comment) => comment.id !== commentMenuTarget));
      setRecipeCommentCountState(recipe.id, nextCommentsCount);
      setRecipe((prev) => ({ ...prev, commentsCount: nextCommentsCount }));
      if (editingCommentId === commentMenuTarget) {
        setEditingCommentId(null);
        setCommentInput('');
      }
      setCommentMenuTarget(null);
    } catch (error) {
      console.warn('Failed to delete recipe comment', error);
      Alert.alert('요청 실패', '댓글 삭제를 처리하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleFundingProposal = () => {
    if (!user || user.type !== 'brewery') {
      showLoginRequired('펀딩 제안은 양조장 로그인 후 이용할 수 있어요.');
      return;
    }
    if (!user.isBreweryVerified) {
      setShowVerificationPendingModal(true);
      return;
    }
    router.push(`/brewery/project/terms?recipeId=${recipe.id}` as any);
  };

  if (isDetailLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.headerMenuBtn} />
        </View>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>레시피를 불러오고 있어요.</Text>
        </View>
      </View>
    );
  }

  const recipeImageSource = getImageSource(recipe.image);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        {isRecipeAuthor ? (
          <View style={styles.menuWrap}>
            <TouchableOpacity style={styles.headerMenuBtn} onPress={() => setRecipeMenuVisible((prev) => !prev)}>
              <MoreVertical size={24} color="#111" />
            </TouchableOpacity>
            {recipeMenuVisible && (
              <View style={styles.menuBox}>
                <TouchableOpacity style={styles.menuItem} onPress={handleRecipeDelete}>
                  <Text style={styles.menuText}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.headerMenuBtn} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScrollBeginDrag={() => {
          setRecipeMenuVisible(false);
          setCommentMenuTarget(null);
        }}
      >
        <View style={styles.imageBox}>
          {recipeImageSource ? (
            <Image source={recipeImageSource} style={styles.mainImg} />
          ) : (
            <View style={styles.noImageBox}>
              <ImageOff size={42} color="#9CA3AF" />
              <Text style={styles.noImageText}>이미지 없음</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.authorRow}>
            <View style={styles.authorInfo}>
              {renderProfileAvatar(recipe.authorAvatar, recipe.author)}
              <View>
                <Text style={styles.authorName}>{recipe.author}</Text>
                <Text style={styles.timeTxt}>{recipe.timestamp}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.likeBtn, liked && styles.likeBtnActive]} onPress={handleLike}>
              <Heart size={16} color={liked ? '#FFF' : '#4B5563'} fill={liked ? '#FFF' : 'transparent'} />
              <Text style={[styles.likeTxt, liked && { color: '#FFF' }]}>{likesCount}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.tagWrap}>
            {recipe.flavorTags.map((tag, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagTxt}>#{tag}</Text></View>
            ))}
            <View style={styles.alcoholTag}><Text style={styles.alcoholTxt}>{recipe.alcoholRange}</Text></View>
          </View>

          {recipe.concept ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>프로젝트 컨셉</Text>
              <Text style={styles.bodyText}>{recipe.concept}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>레시피 요약</Text>
            <Text style={styles.bodyText}>{recipe.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <Sparkles size={16} color="#9CA3AF" />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>메인 재료</Text>
            </View>
            <View style={styles.ingredientWrap}>
              {recipe.mainIngredients.map((ing, i) => (
                <View key={i} style={styles.ingBadge}><Text style={styles.ingTxt}>{ing}</Text></View>
              ))}
            </View>
          </View>

          {recipe.subIngredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>서브 재료</Text>
              <View style={styles.ingredientWrap}>
                {recipe.subIngredients.map((ing, i) => (
                  <View key={i} style={[styles.ingBadge, styles.subIngBadge]}><Text style={styles.subIngTxt}>{ing}</Text></View>
                ))}
              </View>
            </View>
          )}

          {isBreweryUser && (
            <>
              <TouchableOpacity style={styles.proposeBtn} onPress={handleFundingProposal}>
                <LinearGradient colors={['#111', '#333']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.proposeInner}>
                  <Rocket size={20} color="#FFF" />
                  <Text style={styles.proposeTxt}>이 레시피로 펀딩 제안하기</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.proposeDesc}>이 레시피를 기반으로 크라우드펀딩 프로젝트를 시작할 수 있습니다</Text>
            </>
          )}
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글 {recipe.commentsCount}</Text>
          {visibleComments.map((c, idx) => (
            <Animated.View key={c.id} entering={FadeInUp.delay(idx * 50)} style={styles.commentItem}>
              {renderProfileAvatar(c.avatar, c.author)}
              <View style={{ flex: 1 }}>
                <View style={styles.commentBubble}>
                  <View style={styles.commentUserRow}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    {c.authorType === 'brewery' && <View style={styles.breweryBadge}><Text style={styles.breweryBadgeTxt}>양조장</Text></View>}
                    {(user?.name === c.author || c.isMine) && (
                      <View style={styles.commentMenuWrap}>
                        <TouchableOpacity style={styles.commentMoreBtn} onPress={() => setCommentMenuTarget((prev) => (prev === c.id ? null : c.id))} activeOpacity={0.8}>
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                        {commentMenuTarget === c.id && canManageSelectedComment && (
                          <View style={[styles.menuBox, styles.commentMenuBox]}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleCommentEdit}>
                              <Text style={styles.menuText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={handleCommentDelete}>
                              <Text style={styles.menuText}>삭제</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentContent}>{c.content}</Text>
                </View>
                <View style={styles.commentFooter}>
                  <Text style={styles.commentTime}>{c.timestamp}</Text>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => handleCommentLike(c.id)}>
                    <ThumbsUp size={15} color={c.liked ? '#111' : '#9CA3AF'} fill={c.liked ? '#111' : 'transparent'} />
                    <Text style={[styles.actionTxt, c.liked && styles.actionTxtActive]}>{c.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => handleReplyOpen(c.id)}>
                    <MessageCircle size={15} color="#9CA3AF" />
                    <Text style={styles.actionTxt}>답글</Text>
                  </TouchableOpacity>
                  {(c.replyCount ?? getCommentReplies(c).length) > 0 && (
                    <TouchableOpacity style={styles.commentActionButton} onPress={() => toggleExpandComment(c.id)}>
                      {expandedComments.has(c.id) ? <ChevronUp size={15} color="#9CA3AF" /> : <ChevronDown size={15} color="#9CA3AF" />}
                      <Text style={styles.actionTxt}>{c.replyCount ?? getCommentReplies(c).length}개 답글</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {expandedComments.has(c.id) && getCommentReplies(c).length > 0 && (
                  <View style={styles.replyList}>
                    {getCommentReplies(c).map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        {renderProfileAvatar(reply.avatar, reply.author, true)}
                        <View style={styles.replyContentWrap}>
                          <View style={styles.commentUserRow}>
                            <Text style={styles.commentAuthor}>{reply.author}</Text>
                            {reply.authorType === 'brewery' && <View style={styles.breweryBadge}><Text style={styles.breweryBadgeTxt}>양조장</Text></View>}
                            <Text style={styles.replyTime}>{reply.timestamp}</Text>
                          </View>
                          <Text style={styles.commentContent}>{reply.content}</Text>
                          <TouchableOpacity style={styles.replyLikeBtn} onPress={() => handleReplyLike(c.id, reply.id)}>
                            <ThumbsUp size={12} color={reply.liked ? '#111' : '#9CA3AF'} fill={reply.liked ? '#111' : 'transparent'} />
                            <Text style={[styles.replyLikeTxt, reply.liked && styles.actionTxtActive]}>{reply.likes}</Text>
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
                      value={replyInput}
                      onChangeText={setReplyInput}
                      returnKeyType="send"
                      onSubmitEditing={() => handleReplySubmit(c.id)}
                      autoFocus
                    />
                    <TouchableOpacity style={styles.replySendBtn} onPress={() => handleReplySubmit(c.id)}>
                      <Send size={15} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}

          {!showAllComments && comments.length > INITIAL_COMMENT_COUNT && (
            <TouchableOpacity style={styles.moreBtn} onPress={() => setShowAllComments(true)}>
              <ChevronDown size={16} color="#6B7280" />
              <Text style={styles.moreBtnTxt}>댓글 {comments.length - INITIAL_COMMENT_COUNT}개 더보기</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showVerificationPendingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerificationPendingModal(false)}
      >
        <View style={styles.verificationModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowVerificationPendingModal(false)}
          />
          <View style={styles.verificationModalCard}>
            <Text style={styles.verificationModalTitle}>양조장 인증 대기 중</Text>
            <Text style={styles.verificationModalBody}>
              아직 양조장 인증이 승인되지 않았습니다.{'\n'}
              승인이 된 후 이용 가능합니다.
            </Text>
            <TouchableOpacity
              style={styles.verificationModalButton}
              activeOpacity={0.86}
              onPress={() => setShowVerificationPendingModal(false)}
            >
              <Text style={styles.verificationModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.footer}>
        <View style={[styles.footerInner, { paddingBottom: insets.bottom + 10 }]}>
          {user ? (
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="댓글을 입력하세요..."
                placeholderTextColor="#9CA3AF"
                value={commentInput}
                onChangeText={setCommentInput}
              />
              <TouchableOpacity style={[styles.sendBtn, !commentInput.trim() && { opacity: 0.3 }]} onPress={handleCommentSubmit}>
                <Send size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.loginReqBtn} onPress={() => showLoginRequired('댓글 작성은 로그인 후 이용할 수 있어요.')}>
              <Text style={styles.loginReqTxt}>로그인하고 댓글 작성하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', zIndex: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerMenuBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  menuWrap: { position: 'relative' },
  menuBox: { position: 'absolute', top: 42, right: 4, minWidth: 120, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14, zIndex: 30 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 13 },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  menuText: { fontSize: 14, fontWeight: '700', color: '#111' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { fontSize: 14, color: '#6B7280', fontWeight: '700' },
  imageBox: { width: '100%', height: 300, backgroundColor: '#F9FAFB' },
  mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  noImageBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 10 },
  noImageText: { fontSize: 15, lineHeight: 22, fontWeight: '800', color: '#9CA3AF' },
  content: { padding: 24 },
  authorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  authorName: { fontSize: 14, fontWeight: '800', color: '#111' },
  timeTxt: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  likeBtnActive: { backgroundColor: '#111', borderColor: '#111' },
  likeTxt: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  title: { fontSize: 24, fontWeight: '900', color: '#111', lineHeight: 32, marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tagTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  alcoholTag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111', borderRadius: 20 },
  alcoholTxt: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 12 },
  bodyText: { fontSize: 15, lineHeight: 24, color: '#4B5563', fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  ingredientWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ingBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  ingTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  subIngBadge: { backgroundColor: '#FFF' },
  subIngTxt: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  proposeBtn: { height: 60, borderRadius: 16, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  proposeInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  proposeTxt: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  proposeDesc: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12, fontWeight: '500' },
  commentSection: { borderTopWidth: 8, borderTopColor: '#F9FAFB', padding: 24 },
  commentHeader: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 24 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  commentAvatarImage: { width: '100%', height: '100%', borderRadius: 20 },
  commentAvatarInitial: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  commentBubble: { flex: 1, backgroundColor: '#F9FAFB', padding: 16, borderRadius: 20, borderTopLeftRadius: 4 },
  commentUserRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#111' },
  commentMoreBtn: { marginLeft: 'auto', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  commentMenuWrap: { marginLeft: 'auto', position: 'relative' },
  commentMenuBox: { top: 28, right: 0 },
  breweryBadge: { backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  breweryBadgeTxt: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  commentContent: { fontSize: 14, color: '#374151', lineHeight: 20, fontWeight: '500' },
  commentFooter: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8, paddingHorizontal: 4 },
  commentTime: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  actionTxt: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  actionTxtActive: { color: '#111', fontWeight: '800' },
  commentActionButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  replyList: { marginTop: 12, marginLeft: 6, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#E5E7EB', gap: 10 },
  replyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 2 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  replyAvatarImage: { width: '100%', height: '100%', borderRadius: 16 },
  replyAvatarInitial: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  replyContentWrap: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 14, padding: 12 },
  replyTime: { marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  replyLikeBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, marginTop: 8 },
  replyLikeTxt: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  replyInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 6 },
  replyInput: { flex: 1, height: 40, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, fontSize: 13, fontWeight: '600', color: '#111' },
  replySendBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  moreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#F9FAFB', borderRadius: 16, marginTop: 10 },
  moreBtnTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  verificationModalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.58)', justifyContent: 'center', paddingHorizontal: 22 },
  verificationModalCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6', elevation: 18, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
  verificationModalTitle: { fontSize: 18, lineHeight: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 8 },
  verificationModalBody: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  verificationModalButton: { alignSelf: 'stretch', minHeight: 50, borderRadius: 16, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginTop: 20 },
  verificationModalButtonText: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerInner: { paddingHorizontal: 20, paddingTop: 12 },
  inputBox: { height: 52, backgroundColor: '#F9FAFB', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1, borderColor: '#F3F4F6' },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  loginReqBtn: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  loginReqTxt: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
});
