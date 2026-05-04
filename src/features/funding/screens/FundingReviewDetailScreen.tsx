import React, { useEffect, useMemo, useState } from 'react';
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
import { Heart, MessageCircle, Package, Send, Star, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { fundingReviewComments, type FundingReviewComment } from '@/features/funding/reviews';
import { showLoginRequired } from '@/utils/authPrompt';

export default function FundingReviewDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, reviewId } = useLocalSearchParams<{ id?: string; reviewId?: string }>();
  const { user } = useAuth();
  const { projects, fundingReviews } = useFunding();
  const projectId = Number(Array.isArray(id) ? id[0] : id);
  const targetReviewId = Number(Array.isArray(reviewId) ? reviewId[0] : reviewId);
  const project = useMemo(() => projects.find((item) => item.id === projectId) || null, [projectId, projects]);
  const review = useMemo(
    () => fundingReviews.find((item) => item.projectId === projectId && item.id === targetReviewId) || null,
    [fundingReviews, projectId, targetReviewId]
  );
  const initialReviewComments = useMemo(
    () => fundingReviewComments.filter((comment) => comment.projectId === projectId && comment.reviewId === targetReviewId),
    [projectId, targetReviewId]
  );
  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review?.likes || 0);
  const [comments, setComments] = useState<FundingReviewComment[]>(initialReviewComments);

  useEffect(() => {
    setComments(initialReviewComments);
    setCommentInput('');
    setLiked(false);
    setLikeCount(review?.likes || 0);
  }, [initialReviewComments, review?.likes]);

  const handleBackToFundingReviews = () => {
    if (!project) {
      router.back();
      return;
    }
    router.replace(`/funding/${project.id}?tab=review&fromReview=1` as any);
  };

  const handleLike = () => {
    if (!user) {
      showLoginRequired('후기 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    setLiked((prev) => !prev);
    setLikeCount((prev) => Math.max(0, prev + (liked ? -1 : 1)));
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    if (!user) {
      showLoginRequired('후기 댓글은 로그인 후 이용할 수 있어요.');
      return;
    }

    const nextComment: FundingReviewComment = {
      id: Math.max(0, ...comments.map((comment) => comment.id)) + 1,
      projectId,
      reviewId: targetReviewId,
      author: user.name || '사용자',
      authorType: user.type === 'brewery' ? 'brewery' : 'user',
      content: commentInput.trim(),
      timestamp: '방금 전',
      likes: 0,
      liked: false,
    };

    setComments((prev) => [...prev, nextComment]);
    setCommentInput('');
  };

  const handleCommentLike = (commentId: number) => {
    if (!user) {
      showLoginRequired('후기 댓글 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: Math.max(0, comment.likes + (comment.liked ? -1 : 1)) }
          : comment
      )
    );
  };

  if (!project || !review) {
    return (
      <View style={[styles.noticeScreen, { paddingTop: insets.top + 32 }]}>
        <Text style={styles.noticeTitle}>후기를 찾을 수 없습니다</Text>
        <Text style={styles.noticeBody}>요청한 펀딩 후기 정보가 없거나 삭제되었을 수 있습니다.</Text>
        <TouchableOpacity style={styles.noticeButton} onPress={() => router.back()}>
          <Text style={styles.noticeButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBackToFundingReviews}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후기</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 108 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.projectBanner}>
          <Package size={17} color="#4B5563" />
          <Text style={styles.projectBannerText} numberOfLines={1}>{project.title}</Text>
        </View>

        <View style={styles.reviewHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{review.userName[0]}</Text>
          </View>
          <View style={styles.reviewHeaderText}>
            <Text style={styles.reviewUser}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{review.timestamp}</Text>
          </View>
        </View>

        <View style={styles.ratingRewardRow}>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={17} color={star <= review.rating ? '#F59E0B' : '#D1D5DB'} fill={star <= review.rating ? '#F59E0B' : 'transparent'} />
            ))}
          </View>
          <View style={styles.rewardBadge}>
            <Package size={14} color="#4B5563" />
            <Text style={styles.rewardText}>{review.rewardName}</Text>
          </View>
        </View>

        <Text style={styles.reviewBody}>{review.comment}</Text>

        {review.tags.length > 0 && (
          <View style={styles.tagWrap}>
            {review.tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {review.showRecordInReview && (review.mood || review.pairing) && (
          <View style={styles.recordBox}>
            <Text style={styles.recordTitle}>그날의 기록</Text>
            {review.mood ? (
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>기분</Text>
                <Text style={styles.recordValue}>{review.mood}</Text>
              </View>
            ) : null}
            {review.pairing ? (
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>함께한 안주</Text>
                <Text style={styles.recordValue}>{review.pairing}</Text>
              </View>
            ) : null}
          </View>
        )}

        {review.images.length > 0 && (
          <View style={review.images.length === 1 ? styles.imageSingleGrid : styles.imageGrid}>
            {review.images.map((image, index) => (
              <View key={`${image}-${index}`} style={review.images.length === 1 ? styles.reviewSingleImageWrap : styles.reviewImageWrap}>
                <Image source={{ uri: image }} style={styles.reviewImage} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Heart size={21} color={liked ? '#EF4444' : '#4B5563'} fill={liked ? '#EF4444' : 'transparent'} />
            <Text style={[styles.actionText, liked && styles.actionTextActive]}>{likeCount}</Text>
          </TouchableOpacity>
          <View style={styles.actionButton}>
            <MessageCircle size={21} color="#4B5563" />
            <Text style={styles.actionText}>{comments.length}</Text>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글 {comments.length}</Text>
          <View style={styles.commentList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{comment.author[0]}</Text>
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentBubble}>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      {comment.authorType === 'brewery' && (
                        <View style={styles.breweryBadge}>
                          <Text style={styles.breweryBadgeText}>양조장</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                  <View style={styles.commentFooter}>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                    <TouchableOpacity onPress={() => handleCommentLike(comment.id)}>
                      <Text style={[styles.commentLikeText, comment.liked && styles.commentLikeTextActive]}>
                        좋아요{comment.likes > 0 ? ` ${comment.likes}` : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomInputWrap, { paddingBottom: insets.bottom + 10 }]}>
        {user ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.commentInput}
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="댓글을 입력하세요..."
              placeholderTextColor="#9CA3AF"
              returnKeyType="send"
              onSubmitEditing={handleCommentSubmit}
            />
            <TouchableOpacity style={[styles.sendButton, !commentInput.trim() && styles.sendButtonDisabled]} onPress={handleCommentSubmit} disabled={!commentInput.trim()}>
              <Send size={17} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.loginCommentButton} onPress={() => showLoginRequired('후기 댓글은 로그인 후 이용할 수 있어요.')}>
            <Text style={styles.loginCommentText}>로그인하고 댓글 작성하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { minHeight: 56, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  headerButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '900', color: '#111' },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  projectBanner: { minHeight: 48, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, marginBottom: 14 },
  projectBannerText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#111' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  reviewHeaderText: { flex: 1 },
  reviewUser: { fontSize: 15, fontWeight: '900', color: '#111' },
  reviewDate: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginTop: 3 },
  ratingRewardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  rewardText: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  reviewBody: { fontSize: 16, lineHeight: 26, fontWeight: '600', color: '#111', marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 22 },
  tagChip: { alignSelf: 'flex-start', justifyContent: 'center', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, lineHeight: 13, fontWeight: '900', color: '#4B5563', includeFontPadding: false },
  recordBox: { backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, gap: 8, marginBottom: 16 },
  recordTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recordLabel: { width: 82, fontSize: 12, fontWeight: '800', color: '#6B7280' },
  recordValue: { flex: 1, fontSize: 13, fontWeight: '800', color: '#111' },
  imageSingleGrid: { marginBottom: 18 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  reviewSingleImageWrap: { width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  reviewImageWrap: { width: '48%', height: 168, borderRadius: 16, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  reviewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 24, paddingTop: 14, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  actionTextActive: { color: '#EF4444' },
  commentsSection: { borderTopWidth: 8, borderTopColor: '#F3F4F6', marginHorizontal: -16, paddingHorizontal: 16, paddingTop: 16 },
  commentsTitle: { fontSize: 17, fontWeight: '900', color: '#111', marginBottom: 16 },
  commentList: { gap: 18 },
  commentRow: { flexDirection: 'row', gap: 10 },
  commentAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  commentAvatarText: { fontSize: 13, fontWeight: '900', color: '#111' },
  commentBody: { flex: 1 },
  commentBubble: { backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 11 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontWeight: '900', color: '#111' },
  breweryBadge: { backgroundColor: '#111', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  breweryBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  commentContent: { fontSize: 13, color: '#111', lineHeight: 20, fontWeight: '600' },
  commentFooter: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 7, paddingLeft: 8 },
  commentTimestamp: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  commentLikeText: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  commentLikeTextActive: { color: '#111' },
  bottomInputWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10, paddingHorizontal: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  commentInput: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 18, color: '#111', fontSize: 14, fontWeight: '700' },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.35 },
  loginCommentButton: { height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  loginCommentText: { fontSize: 14, fontWeight: '900', color: '#111' },
  noticeScreen: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 8 },
  noticeBody: { fontSize: 14, lineHeight: 22, color: '#6B7280', textAlign: 'center', fontWeight: '700', marginBottom: 22 },
  noticeButton: { height: 48, borderRadius: 14, backgroundColor: '#111', paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  noticeButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
});
