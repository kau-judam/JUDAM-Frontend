import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronLeft, ChevronUp, Heart, MessageCircle, MoreVertical, Send, ThumbsUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import {
  createCommunityComment,
  createCommunityCommentReply,
  deleteCommunityComment,
  deleteCommunityCommentLike,
  deleteCommunityPost,
  deleteCommunityPostLike,
  fetchCommunityCommentReplies,
  fetchCommunityComments,
  fetchCommunityPost,
  registerCommunityCommentLike,
  registerCommunityPostLike,
  updateCommunityComment,
} from '@/features/community/api';
import { showLoginRequired } from '@/utils/authPrompt';

const INITIAL_COMMENT_COUNT = 3;
const person1 = require('../../../../newpicutre/person1.png');
const person2 = require('../../../../newpicutre/person2.png');
const person3 = require('../../../../newpicutre/person3.png');
const person4 = require('../../../../newpicutre/person4.png');
const person5 = require('../../../../newpicutre/person5.png');
const person6 = require('../../../../newpicutre/person6.png');
const getAvatarSource = (avatar: ImageSourcePropType | string) =>
  typeof avatar === 'string' ? { uri: avatar } : avatar;

interface CommunityPostDetail {
  id: number;
  author: string;
  authorType: 'user' | 'brewery';
  avatar: ImageSourcePropType | string;
  title: string;
  content: string;
  image?: string;
  imageUrls?: string[];
  likes: number;
  liked?: boolean;
  comments: number;
  timestamp: string;
  category: string;
  authorId?: string;
  isMine?: boolean;
}

interface CommentReply {
  id: number;
  author: string;
  authorType: 'user' | 'brewery';
  avatar: ImageSourcePropType | string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  userId?: string;
  isMine?: boolean;
}

interface Comment {
  id: number;
  author: string;
  authorType: 'user' | 'brewery';
  avatar: ImageSourcePropType | string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  userId?: string;
  isMine?: boolean;
  replyCount?: number;
  replies?: CommentReply[];
}

const mockPosts: Record<number, CommunityPostDetail> = {
  1: {
    id: 1,
    author: '김주담',
    authorType: 'user',
    avatar: person1,
    title: '처음 만든 막걸리, 생각보다 쉬웠어요',
    content:
      '처음으로 막걸리 담그기에 도전해봤는데요! 생각보다 어렵지 않았어요.\n\n국내산 쌀과 전통 누룩을 사용했고, 발효 과정에서 은은한 쌀 향이 정말 좋았습니다. 10일 정도 발효시킨 후 처음 맛봤을 때의 그 감동이란... 직접 만든 술이라 더 맛있게 느껴지는 것 같아요!\n\n다음에는 감귤을 넣어서 만들어볼 생각입니다. 혹시 과일 막걸리 만들어보신 분 계신가요?',
    image: 'https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop',
    imageUrls: ['https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop'],
    likes: 47,
    comments: 3,
    timestamp: '2시간 전',
    category: '자유게시판',
  },
  2: {
    id: 2,
    author: '술샘양조장',
    authorType: 'brewery',
    avatar: person2,
    title: '이번 주말 전통 누룩 양조장 투어 안내',
    content: '이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!',
    likes: 127,
    comments: 23,
    timestamp: '5시간 전',
    category: '정보게시판',
  },
  3: {
    id: 3,
    author: '막걸리마스터',
    authorType: 'user',
    avatar: person3,
    title: '딸기 막걸리 레시피 공유',
    content:
      '딸기 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 레시피 공유할게요.\n\n1. 국내산 쌀 2kg\n2. 전통 누룩 200g\n3. 딸기청 100g\n\n발효는 3일 정도 걸렸어요.',
    likes: 89,
    comments: 15,
    timestamp: '어제',
    category: '정보게시판',
  },
  4: {
    id: 4,
    author: '청주러버',
    authorType: 'user',
    avatar: person4,
    title: '청주 빚을 때 온도 관리 팁',
    content: '청주 빚을 때 온도 관리가 제일 중요한 것 같아요. 18~20도를 유지하니 훨씬 깔끔한 맛이 나더라고요.',
    likes: 56,
    comments: 12,
    timestamp: '2일 전',
    category: '정보게시판',
  },
  5: {
    id: 5,
    author: '소주마니아',
    authorType: 'user',
    avatar: person5,
    title: '집에서 증류식 소주 만드는 법 정리 예정',
    content: '집에서 증류식 소주 만드는 법 궁금하신 분 계신가요? 초보자도 따라할 수 있는 간단한 방법을 정리해보려고 합니다.',
    likes: 73,
    comments: 19,
    timestamp: '3일 전',
    category: '정보게시판',
  },
  6: {
    id: 6,
    author: '제산양조장',
    authorType: 'brewery',
    avatar: person6,
    title: '제산 약주 체험 프로그램 오픈',
    content: '제산 약주 체험 프로그램을 시작합니다. 전통주 빚기부터 시음까지 꽉 찬 3시간 코스예요. 많은 관심 부탁드립니다.',
    likes: 145,
    comments: 31,
    timestamp: '4일 전',
    category: '정보게시판',
  },
};

const initialComments: Comment[] = [];

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { posts, deletePost } = useCommunity();
  const numericId = Number(Array.isArray(id) ? id[0] : id) || 1;
  const contextPost = posts.find((item) => item.id === numericId);
  const [apiPost, setApiPost] = useState<CommunityPostDetail | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [apiPostLoadFailed, setApiPostLoadFailed] = useState(false);
  const fallbackPost = contextPost || (numericId <= 6 ? mockPosts[numericId] || mockPosts[1] : null);
  const post = apiPost || fallbackPost;
  const isTemporaryUserPost = numericId === 1 && post?.category === '자유게시판' && user?.type === 'user';
  const isAuthor = !!user && !!post && Boolean((post.isMine ?? (post.authorId && post.authorId === user.id)) || user.name === post.author || isTemporaryUserPost);

  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentMenuTarget, setCommentMenuTarget] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsPostLoading(true);

    fetchCommunityPost(numericId)
      .then((response) => {
        if (cancelled) return;
        setApiPost(response.post);
        setLiked(response.post.liked);
        setLikeCount(response.post.likes);
        setApiPostLoadFailed(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('Failed to load community post detail from API', error);
        setApiPostLoadFailed(true);
        setApiPost(null);
        setLiked(fallbackPost?.liked ?? false);
        setLikeCount(fallbackPost?.likes ?? 0);
      })
      .finally(() => {
        if (cancelled) return;
        setIsPostLoading(false);
      });

    setIsCommentsLoading(true);
    fetchCommunityComments(numericId, 0, 20)
      .then((response) => {
        if (cancelled) return;
        setComments((prev) =>
          response.comments.map((comment) => ({
            ...comment,
            replies: prev.find((item) => item.id === comment.id)?.replies || [],
            replyCount: comment.replyCount,
          }))
        );
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('Failed to load community comments from API', error);
        setComments([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsCommentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackPost?.liked, fallbackPost?.likes, numericId, user]);

  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENT_COUNT;
  const getCommentReplies = (comment: Comment) => comment.replies || [];
  const postImageUrls = post?.imageUrls ?? (post?.image ? [post.image] : []);

  if (!post && isPostLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>게시글</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>게시글을 불러오고 있어요.</Text>
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>게시글</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>게시글을 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  const loadCommentReplies = async (commentId: number) => {
    if (apiPostLoadFailed || post.id > 1000000000000) return;
    try {
      const response = await fetchCommunityCommentReplies(post.id, commentId, 0, 20);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: response.replies, replyCount: response.totalElements }
            : comment
        )
      );
    } catch (error) {
      console.warn('Failed to load community comment replies', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      showLoginRequired('커뮤니티 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    if (apiPostLoadFailed || post.id > 1000000000000) {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      return;
    }

    const previousLiked = liked;
    const previousLikeCount = likeCount;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

    try {
      const response = nextLiked ? await registerCommunityPostLike(post.id) : await deleteCommunityPostLike(post.id);
      setLikeCount(response.data.like_count);
    } catch (error) {
      console.warn('Failed to update community post like from detail', error);
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    if (!user) {
      showLoginRequired('댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    const targetComment = comments.find((comment) => comment.id === commentId);
    if (!targetComment) return;
    const nextLiked = !targetComment.liked;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );

    if (apiPostLoadFailed || post.id > 1000000000000) return;

    try {
      const response = nextLiked
        ? await registerCommunityCommentLike(post.id, commentId)
        : await deleteCommunityCommentLike(post.id, commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, liked: nextLiked, likes: response.data.like_count } : comment
        )
      );
    } catch (error) {
      console.warn('Failed to update community comment like', error);
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? targetComment : comment)));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!user) {
      showLoginRequired('댓글 작성은 로그인 후 이용할 수 있어요.');
      return;
    }

    if (editingCommentId !== null) {
      let nextContent = commentInput.trim();
      if (!apiPostLoadFailed && post.id <= 1000000000000) {
        try {
          const response = await updateCommunityComment(post.id, editingCommentId, nextContent);
          nextContent = response.comment.content;
        } catch (error) {
          console.warn('Failed to update community comment', error);
          return;
        }
      }
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId
            ? { ...comment, content: nextContent, timestamp: '방금 전' }
            : comment
        )
      );
      setEditingCommentId(null);
      setCommentMenuTarget(null);
      setCommentInput('');
      return;
    }

    const newComment: Comment = {
      id: comments.length + 1,
      author: user.name,
      authorType: 'user',
      avatar: person3,
      content: commentInput.trim(),
      timestamp: '방금 전',
      likes: 0,
      liked: false,
    };

    if (!apiPostLoadFailed && post.id <= 1000000000000) {
      try {
        const response = await createCommunityComment(post.id, commentInput.trim());
        setComments((prev) => [
          ...prev,
          {
            ...newComment,
            id: response.comment.comment_id,
            author: response.comment.nickname || user.name,
            content: response.comment.content,
            likes: response.comment.like_count,
            userId: String(response.comment.user_id),
            isMine: true,
          },
        ]);
        setCommentInput('');
        return;
      } catch (error) {
        console.warn('Failed to create community comment', error);
        return;
      }
    }

    setComments((prev) => [...prev, newComment]);
    setCommentInput('');
  };

  const handlePostEdit = () => {
    setShowMenu(false);
    router.replace(`/community/create?editPostId=${post.id}` as any);
  };

  const handlePostDelete = async () => {
    setShowMenu(false);
    if (!apiPostLoadFailed && post.id <= 1000000000000) {
      try {
        await deleteCommunityPost(post.id);
      } catch (error) {
        console.warn('Failed to delete community post', error);
        return;
      }
    }
    deletePost(post.id);
    router.replace('/community' as any);
  };

  const handleCommentEdit = (comment: Comment) => {
    setCommentInput(comment.content);
    setEditingCommentId(comment.id);
    setCommentMenuTarget(null);
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!apiPostLoadFailed && post.id <= 1000000000000) {
      try {
        await deleteCommunityComment(post.id, commentId);
      } catch (error) {
        console.warn('Failed to delete community comment', error);
        return;
      }
    }
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setCommentInput('');
    }
    setCommentMenuTarget(null);
  };

  const handleReplyOpen = async (commentId: number) => {
    if (!user) {
      showLoginRequired('답글 작성은 로그인이 필요합니다.');
      return;
    }
    const targetComment = comments.find((comment) => comment.id === commentId);
    setReplyInput('');
    setExpandedComments((prev) => new Set([...prev, commentId]));
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
    if (!targetComment?.replies?.length && (targetComment?.replyCount ?? 0) > 0) {
      await loadCommentReplies(commentId);
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!replyInput.trim()) return;
    if (!user) {
      showLoginRequired('답글 작성은 로그인이 필요합니다.');
      return;
    }
    const newReply: CommentReply = {
      id: Date.now(),
      author: user.name,
      authorType: user.type || 'user',
      avatar: person3,
      content: replyInput.trim(),
      timestamp: '방금',
      likes: 0,
      liked: false,
      userId: user.id,
      isMine: true,
    };

    if (!apiPostLoadFailed && post.id <= 1000000000000) {
      try {
        const response = await createCommunityCommentReply(post.id, commentId, replyInput.trim());
        newReply.id = response.reply.comment_id;
        newReply.author = response.reply.nickname || user.name;
        newReply.content = response.reply.content;
        newReply.userId = String(response.reply.user_id);
      } catch (error) {
        console.warn('Failed to create community comment reply', error);
        return;
      }
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...getCommentReplies(comment), newReply],
              replyCount: Math.max(comment.replyCount ?? 0, getCommentReplies(comment).length + 1),
            }
          : comment
      )
    );
    setReplyInput('');
    setReplyingTo(null);
    setExpandedComments((prev) => new Set([...prev, commentId]));
  };

  const handleReplyLike = async (commentId: number, replyId: number) => {
    if (!user) {
      showLoginRequired('답글 좋아요는 로그인이 필요합니다.');
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
                  ? { ...reply, liked: nextLiked, likes: Math.max(0, reply.likes + (nextLiked ? 1 : -1)) }
                  : reply
              ),
            }
          : comment
      )
    );

    if (apiPostLoadFailed || post.id > 1000000000000) return;

    try {
      const response = nextLiked
        ? await registerCommunityCommentLike(post.id, replyId)
        : await deleteCommunityCommentLike(post.id, replyId);
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
      console.warn('Failed to update community reply like', error);
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
    const targetComment = comments.find((comment) => comment.id === commentId);
    const willOpen = !expandedComments.has(commentId);
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    if (willOpen && !targetComment?.replies?.length && (targetComment?.replyCount ?? 0) > 0) {
      await loadCommentReplies(commentId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
        {isAuthor ? (
          <View style={styles.menuWrap}>
            <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)} style={styles.iconBtn}>
              <MoreVertical size={22} color="#111" />
            </TouchableOpacity>
            {showMenu && (
              <View style={styles.menuBox}>
                <TouchableOpacity style={styles.menuItem} onPress={handlePostEdit}>
                  <Text style={styles.menuText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={handlePostDelete}>
                  <Text style={styles.menuText}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        onScrollBeginDrag={() => {
          setShowMenu(false);
          setCommentMenuTarget(null);
        }}
      >
        <View style={styles.postHeader}>
          <Image source={getAvatarSource(post.avatar)} style={styles.avatar} />
          <View style={styles.postMeta}>
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{post.author}</Text>
              {post.authorType === 'brewery' && (
                <View style={styles.breweryBadge}>
                  <Text style={styles.breweryBadgeText}>양조장</Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{post.timestamp}</Text>
              <Text style={styles.dot}>•</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>#{post.category}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.likeButton, liked && styles.likeButtonActive]} onPress={handleLike}>
            <Heart size={16} color={liked ? '#FFF' : '#4B5563'} fill={liked ? '#FFF' : 'transparent'} />
            <Text style={[styles.likeText, liked && styles.likeTextActive]}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postBody}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          {postImageUrls.length > 0 && (
            <View style={styles.postImageList}>
              {postImageUrls.slice(0, 5).map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.postImage} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
          {isCommentsLoading ? (
            <View style={styles.commentStateBox}>
              <Text style={styles.commentStateText}>댓글을 불러오고 있어요.</Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.commentStateBox}>
              <Text style={styles.commentStateText}>댓글이 없습니다.</Text>
            </View>
          ) : visibleComments.map((comment, index) => (
            <Animated.View key={comment.id} entering={FadeInUp.delay(index * 45)} style={styles.commentItem}>
              <Image source={getAvatarSource(comment.avatar)} style={styles.commentAvatar} />
              <View style={styles.commentContentWrap}>
                <View style={styles.commentBubble}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    {comment.authorType === 'brewery' && (
                      <View style={styles.commentBreweryBadge}>
                        <Text style={styles.commentBreweryBadgeText}>양조장</Text>
                      </View>
                    )}
                    {user && Boolean((comment.isMine ?? (comment.userId && comment.userId === user.id)) || user.name === comment.author) && (
                      <View style={styles.commentMenuWrap}>
                        <TouchableOpacity
                          onPress={() => setCommentMenuTarget((prev) => (prev === comment.id ? null : comment.id))}
                          style={styles.commentMoreButton}
                          activeOpacity={0.8}
                        >
                          <MoreVertical size={16} color="#6B7280" />
                        </TouchableOpacity>
                        {commentMenuTarget === comment.id && (
                          <View style={[styles.menuBox, styles.commentMenuBox]}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentEdit(comment)}>
                              <Text style={styles.menuText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => handleCommentDelete(comment.id)}>
                              <Text style={styles.menuText}>삭제</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
                <View style={styles.commentFooter}>
                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => handleCommentLike(comment.id)}>
                    <ThumbsUp size={15} color={comment.liked ? '#111' : '#9CA3AF'} fill={comment.liked ? '#111' : 'transparent'} />
                    <Text style={[styles.commentAction, comment.liked && styles.commentActionActive]}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentActionButton} onPress={() => handleReplyOpen(comment.id)}>
                    <MessageCircle size={15} color="#9CA3AF" />
                    <Text style={styles.commentAction}>답글</Text>
                  </TouchableOpacity>
                  {(getCommentReplies(comment).length > 0 || (comment.replyCount ?? 0) > 0) && (
                    <TouchableOpacity style={styles.commentActionButton} onPress={() => toggleExpandComment(comment.id)}>
                      {expandedComments.has(comment.id) ? <ChevronUp size={15} color="#9CA3AF" /> : <ChevronDown size={15} color="#9CA3AF" />}
                      <Text style={styles.commentAction}>{Math.max(getCommentReplies(comment).length, comment.replyCount ?? 0)}개 답글</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {expandedComments.has(comment.id) && getCommentReplies(comment).length > 0 && (
                  <View style={styles.replyList}>
                    {getCommentReplies(comment).map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Image source={getAvatarSource(reply.avatar)} style={styles.replyAvatar} />
                        <View style={styles.replyContentWrap}>
                          <View style={styles.commentAuthorRow}>
                            <Text style={styles.commentAuthor}>{reply.author}</Text>
                            {reply.authorType === 'brewery' && (
                              <View style={styles.commentBreweryBadge}>
                                <Text style={styles.commentBreweryBadgeText}>양조장</Text>
                              </View>
                            )}
                            <Text style={styles.replyTime}>{reply.timestamp}</Text>
                          </View>
                          <Text style={styles.commentText}>{reply.content}</Text>
                          <TouchableOpacity style={styles.replyLikeButton} onPress={() => handleReplyLike(comment.id, reply.id)}>
                            <ThumbsUp size={12} color={reply.liked ? '#111' : '#9CA3AF'} fill={reply.liked ? '#111' : 'transparent'} />
                            <Text style={[styles.replyLikeText, reply.liked && styles.commentActionActive]}>{reply.likes}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {replyingTo === comment.id && (
                  <View style={styles.replyInputRow}>
                    <TextInput
                      style={styles.replyInput}
                      value={replyInput}
                      onChangeText={setReplyInput}
                      placeholder="답글을 입력하세요..."
                      placeholderTextColor="#9CA3AF"
                      onSubmitEditing={() => handleReplySubmit(comment.id)}
                      returnKeyType="send"
                      autoFocus
                    />
                    <TouchableOpacity style={styles.replySubmitButton} onPress={() => handleReplySubmit(comment.id)}>
                      <Send size={15} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}

          {hasMoreComments && !showAllComments && !isCommentsLoading && (
            <TouchableOpacity style={styles.moreButton} onPress={() => setShowAllComments(true)}>
              <ChevronDown size={16} color="#6B7280" />
              <Text style={styles.moreButtonText}>댓글 {comments.length - INITIAL_COMMENT_COUNT}개 더보기</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.footer}>
        <View style={[styles.footerInner, { paddingBottom: insets.bottom + 10 }]}>
          {user ? (
            <>
              <TextInput
                style={styles.commentInput}
                value={commentInput}
                onChangeText={setCommentInput}
                placeholder="댓글을 입력하세요..."
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={handleCommentSubmit}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.submitButton, !commentInput.trim() && styles.submitButtonDisabled]}
                onPress={handleCommentSubmit}
                disabled={!commentInput.trim()}
              >
                <Send size={18} color="#FFF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.loginCommentButton} onPress={() => showLoginRequired('댓글 작성은 로그인 후 이용할 수 있어요.')}>
              <Text style={styles.loginCommentText}>로그인하고 댓글 작성하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { fontSize: 14, color: '#6B7280', fontWeight: '700' },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 20,
  },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  menuWrap: { position: 'relative' },
  menuBox: {
    position: 'absolute',
    top: 42,
    right: 4,
    minWidth: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 13 },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  menuText: { fontSize: 14, fontWeight: '700', color: '#111' },
  commentMenuWrap: { marginLeft: 'auto', position: 'relative' },
  commentMoreButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  commentMenuBox: { top: 28, right: 0, zIndex: 30 },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  postMeta: { flex: 1 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  authorName: { fontSize: 15, fontWeight: '800', color: '#111' },
  breweryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#111' },
  breweryBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metaText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  dot: { fontSize: 13, color: '#9CA3AF' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  likeButtonActive: { backgroundColor: '#111', borderColor: '#111' },
  likeText: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  likeTextActive: { color: '#FFF' },
  postBody: { paddingHorizontal: 16, paddingVertical: 18 },
  postTitle: { fontSize: 22, lineHeight: 30, fontWeight: '900', color: '#111', marginBottom: 12 },
  postContent: { fontSize: 16, lineHeight: 26, fontWeight: '600', color: '#111', marginBottom: 16 },
  postImageList: { gap: 10, marginTop: 2 },
  postImage: { width: '100%', height: 240, borderRadius: 16, resizeMode: 'cover', backgroundColor: '#F3F4F6' },
  commentsSection: { borderTopWidth: 8, borderTopColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 18 },
  commentHeader: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 18 },
  commentStateBox: { paddingVertical: 28, alignItems: 'center' },
  commentStateText: { fontSize: 14, color: '#9CA3AF', fontWeight: '700' },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentContentWrap: { flex: 1 },
  commentBubble: { backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  commentAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 5 },
  commentAuthor: { fontSize: 13, fontWeight: '800', color: '#111' },
  commentBreweryBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: '#111' },
  commentBreweryBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  commentText: { fontSize: 14, lineHeight: 21, fontWeight: '500', color: '#111' },
  commentFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 8, marginTop: 7 },
  commentTime: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  commentActionButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  commentAction: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  commentActionActive: { color: '#111' },
  replyList: { marginTop: 12, marginLeft: 6, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#E5E7EB', gap: 10 },
  replyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16 },
  replyContentWrap: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 10 },
  replyTime: { marginLeft: 'auto', fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  replyLikeButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, marginTop: 8 },
  replyLikeText: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  replyInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 6 },
  replyInput: { flex: 1, height: 40, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingHorizontal: 14, fontSize: 13, fontWeight: '600', color: '#111' },
  replySubmitButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  moreButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  moreButtonText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10 },
  commentInput: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  submitButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: { opacity: 0.35 },
  loginCommentButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginCommentText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
});
