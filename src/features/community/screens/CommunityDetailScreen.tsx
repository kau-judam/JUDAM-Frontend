import React, { useState } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronLeft, Heart, MoreVertical, Send } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { showLoginRequired } from '@/utils/authPrompt';

const INITIAL_COMMENT_COUNT = 3;

interface CommunityPostDetail {
  id: number;
  author: string;
  authorType: 'user' | 'brewery';
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

interface Comment {
  id: number;
  author: string;
  authorType: 'user' | 'brewery';
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

const mockPosts: Record<number, CommunityPostDetail> = {
  1: {
    id: 1,
    author: '전통주러버',
    authorType: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    content:
      '처음으로 막걸리 담그기에 도전해봤는데요! 생각보다 어렵지 않았어요.\n\n국내산 쌀과 전통 누룩을 사용했고, 발효 과정에서 은은한 쌀 향이 정말 좋았습니다. 10일 정도 발효시킨 후 처음 맛봤을 때의 그 감동이란... 직접 만든 술이라 더 맛있게 느껴지는 것 같아요!\n\n다음에는 감귤을 넣어서 만들어볼 생각입니다. 혹시 과일 막걸리 만들어보신 분 계신가요?',
    image: 'https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800&h=600&fit=crop',
    likes: 47,
    comments: 3,
    timestamp: '2시간 전',
    category: '자유게시판',
  },
  2: {
    id: 2,
    author: '술샘양조장',
    authorType: 'brewery',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
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
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
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
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
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
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: '제산 약주 체험 프로그램을 시작합니다. 전통주 빚기부터 시음까지 꽉 찬 3시간 코스예요. 많은 관심 부탁드립니다.',
    likes: 145,
    comments: 31,
    timestamp: '4일 전',
    category: '정보게시판',
  },
};

const initialComments: Comment[] = [
  {
    id: 1,
    author: '양조장지기',
    authorType: 'brewery',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: '첫 도전치고 정말 잘 만드셨네요! 감귤 막걸리는 감귤을 너무 많이 넣으면 쓴맛이 날 수 있으니 조금씩 넣어보시는 걸 추천드려요.',
    timestamp: '1시간 전',
    likes: 8,
    liked: false,
  },
  {
    id: 2,
    author: '막걸리마스터',
    authorType: 'user',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    content: '저도 과일 막걸리 여러 번 만들어봤는데 딸기가 제일 맛있더라구요! 다음 시즌에 도전해보세요.',
    timestamp: '45분 전',
    likes: 3,
    liked: false,
  },
  {
    id: 3,
    author: '술BTI초보',
    authorType: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: '우와 대단하세요! 저도 도전해보고 싶은데 어디서 누룩을 구매하셨나요?',
    timestamp: '30분 전',
    likes: 1,
    liked: false,
  },
  {
    id: 4,
    author: '전통주팬',
    authorType: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    content: '발효 온도 관리가 핵심이죠! 저는 20도 유지했더니 정말 깔끔하게 나왔어요.',
    timestamp: '20분 전',
    likes: 5,
    liked: false,
  },
  {
    id: 5,
    author: '청주러버',
    authorType: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: '감귤 막걸리 만들어봤는데 껍질째 넣으면 향이 훨씬 풍부해요! 한번 시도해보세요.',
    timestamp: '10분 전',
    likes: 2,
    liked: false,
  },
];

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const numericId = Number(Array.isArray(id) ? id[0] : id) || 1;
  const post = mockPosts[numericId] || mockPosts[1];
  const isAuthor = !!user && user.name === post.author;

  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENT_COUNT;

  const handleLike = () => {
    if (!user) {
      showLoginRequired('커뮤니티 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleCommentLike = (commentId: number) => {
    if (!user) {
      showLoginRequired('댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    if (!user) {
      showLoginRequired('댓글 작성은 로그인 후 이용할 수 있어요.');
      return;
    }

    const newComment: Comment = {
      id: comments.length + 1,
      author: user.name,
      authorType: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      content: commentInput.trim(),
      timestamp: '방금 전',
      likes: 0,
      liked: false,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentInput('');
  };

  const handleMenuAction = () => {
    setShowMenu(false);
  };

  const handleReplyPress = () => {
    if (!user) {
      showLoginRequired('답글은 로그인 후 이용할 수 있어요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: insets.top + 56, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
        <View style={styles.menuWrap}>
          <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)} style={styles.iconBtn}>
            <MoreVertical size={22} color="#111" />
          </TouchableOpacity>
          {showMenu && (
            <View style={styles.menuBox}>
              <TouchableOpacity style={styles.menuItem} onPress={handleMenuAction} disabled={!isAuthor}>
                <Text style={[styles.menuText, !isAuthor && styles.menuTextDisabled]}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={handleMenuAction} disabled={!isAuthor}>
                <Text style={[styles.menuText, !isAuthor && styles.menuTextDisabled]}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        onScrollBeginDrag={() => setShowMenu(false)}
      >
        <View style={styles.postHeader}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
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
          <Text style={styles.postContent}>{post.content}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
          {visibleComments.map((comment, index) => (
            <Animated.View key={comment.id} entering={FadeInUp.delay(index * 45)} style={styles.commentItem}>
              <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContentWrap}>
                <View style={styles.commentBubble}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    {comment.authorType === 'brewery' && (
                      <View style={styles.commentBreweryBadge}>
                        <Text style={styles.commentBreweryBadgeText}>양조장</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
                <View style={styles.commentFooter}>
                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                  <TouchableOpacity onPress={() => handleCommentLike(comment.id)}>
                    <Text style={[styles.commentAction, comment.liked && styles.commentActionActive]}>
                      좋아요 {comment.likes > 0 ? comment.likes : ''}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleReplyPress}>
                    <Text style={styles.commentAction}>답글</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}

          {hasMoreComments && !showAllComments && (
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
  menuTextDisabled: { color: '#9CA3AF' },
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
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#F3F4F6' },
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
  postContent: { fontSize: 16, lineHeight: 26, fontWeight: '500', color: '#111', marginBottom: 16 },
  postImage: { width: '100%', height: 240, borderRadius: 14, resizeMode: 'cover', backgroundColor: '#F3F4F6' },
  commentsSection: { borderTopWidth: 8, borderTopColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 18 },
  commentHeader: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 18 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentContentWrap: { flex: 1 },
  commentBubble: { backgroundColor: '#F3F4F6', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  commentAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 5 },
  commentAuthor: { fontSize: 13, fontWeight: '800', color: '#111' },
  commentBreweryBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: '#111' },
  commentBreweryBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  commentText: { fontSize: 14, lineHeight: 21, fontWeight: '500', color: '#111' },
  commentFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 8, marginTop: 7 },
  commentTime: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  commentAction: { fontSize: 11, fontWeight: '800', color: '#6B7280' },
  commentActionActive: { color: '#111' },
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
