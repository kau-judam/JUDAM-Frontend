import React, { useCallback, useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, ChevronDown, ChevronUp, Heart, HelpCircle, MessageCircle, PenSquare, type LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecipeCard } from '@/components/recipe-card';
import type { FundingProject } from '@/constants/data';
import FundingProjectCard from '@/features/funding/components/FundingProjectCard';
import {
  getMyPageApiErrorMessage,
  getMyPageActivityInterests,
  getMyPageActivityQna,
  getMyPageFundingJournalComments,
  getMyPageInterestedRecipes,
  getMyPageLikedPosts,
  getMyPageMyPosts,
  getMyPageMyRecipes,
  getMyPagePostComments,
  getMyPageRecipeComments,
  type MyPageActivityInterestsResult,
  type MyPageActivityQnaResult,
  type MyPageFundingJournalCommentsResult,
  type MyPageCommunityPostActivityDto,
  type MyPagePostCommentActivityDto,
  type MyPageRecipeActivityDto,
  type MyPageRecipeCommentActivityDto,
} from '@/features/mypage/api';

type ActivityTab = {
  id: string;
  label: string;
  Icon: LucideIcon;
  emptyTitle: string;
  items?: ActivityItem[];
  loading?: boolean;
  error?: string | null;
};

type ActivityCategoryProps = {
  title: string;
  tabs: ActivityTab[];
  description: string;
};

type ActivityItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  statLabel: string;
  statValue: string;
  kind?: 'default' | 'recipe' | 'funding' | 'comment' | 'community';
  route?: string;
  recipe?: {
    id: number;
    title: string;
    author: string;
    description: string;
    likes: number;
    comments: number;
    timestamp: string;
    liked?: boolean;
    image?: string | ImageSourcePropType;
  };
  community?: {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    timestamp: string;
    likes: number;
    comments: number;
    liked?: boolean;
    avatar?: ImageSourcePropType;
  };
  funding?: FundingProject;
  comment?: string;
  answer?: string;
};

type LoadState<T> = {
  loading: boolean;
  error: string | null;
  data: T;
};

export function MyActivityCategoryScreen({ title, tabs, description }: ActivityCategoryProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [openAnswers, setOpenAnswers] = useState<Set<string>>(new Set());
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const items = active.items || [];

  const toggleAnswer = (itemId: string) => {
    setOpenAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
            <ArrowLeft size={26} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.tabsWrap}>
          {tabs.map((tab) => {
            const selected = tab.id === activeTab;
            const Icon = tab.Icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, selected && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.85}
              >
                <Icon size={18} color={selected ? '#FFFFFF' : '#4B5563'} />
                <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
      >
        {active.loading ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>목록을 불러오고 있어요.</Text>
            <Text style={styles.emptyDescription}>{description}</Text>
          </View>
        ) : active.error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>목록을 불러오지 못했습니다.</Text>
            <Text style={styles.emptyDescription}>{active.error}</Text>
          </View>
        ) : items.length > 0 ? (
          <View style={styles.list}>
            {items.map((item, index) => {
              if (item.kind === 'recipe' && item.recipe) {
                return <RecipeCard key={item.id} recipe={item.recipe} index={index} showLikeButton={false} />;
              }

              if (item.kind === 'community' && item.community) {
                return <CommunityActivityCard key={item.id} item={item.community} />;
              }

              if (item.kind === 'funding' && item.funding) {
                return (
                  <FundingProjectCard
                    key={item.id}
                    project={item.funding}
                    favorite
                    onPress={() => router.push(`/funding/${item.funding?.id}` as any)}
                    onFavoritePress={() => undefined}
                  />
                );
              }

              if (item.kind === 'comment') {
                const answerOpened = openAnswers.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.commentCard}
                    activeOpacity={0.86}
                    onPress={() => item.route && router.push(item.route as any)}
                  >
                    <Text style={styles.commentRecipeTitle}>{item.title}</Text>
                    <View style={styles.myCommentBox}>
                      <Text style={styles.myCommentText}>{item.comment}</Text>
                    </View>
                    {item.answer ? (
                      <>
                        <TouchableOpacity
                          style={styles.answerToggle}
                          activeOpacity={0.82}
                          onPress={(event) => {
                            event.stopPropagation();
                            toggleAnswer(item.id);
                          }}
                        >
                          <Text style={styles.answerToggleText}>답변 보기</Text>
                          {answerOpened ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
                        </TouchableOpacity>
                        {answerOpened && (
                          <View style={styles.answerBox}>
                            <Text style={styles.answerText}>{item.answer}</Text>
                          </View>
                        )}
                      </>
                    ) : null}
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.activityCard}
                  activeOpacity={0.86}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardEyebrow}>{item.eyebrow}</Text>
                    <Text style={styles.cardMeta}>{item.meta}</Text>
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardStatLabel}>{item.statLabel}</Text>
                    <Text style={styles.cardStatValue}>{item.statValue}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{active.emptyTitle}</Text>
            <Text style={styles.emptyDescription}>{description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function CommunityActivityCard({ item }: { item: NonNullable<ActivityItem['community']> }) {
  return (
    <TouchableOpacity style={styles.communityCard} activeOpacity={0.86} onPress={() => router.push(`/community/${item.id}` as any)}>
      <View style={styles.communityHeader}>
        <View style={styles.communityAvatar}>
          {item.avatar ? <Image source={item.avatar} style={styles.communityAvatarImage} /> : <Text style={styles.communityAvatarText}>{item.author.slice(0, 1)}</Text>}
        </View>
        <View style={styles.communityHeaderText}>
          <View style={styles.communityAuthorRow}>
            <Text style={styles.communityAuthor}>{item.author}</Text>
            <View style={styles.communityCategoryBadge}>
              <Text style={styles.communityCategoryText}>{item.category}</Text>
            </View>
          </View>
          <Text style={styles.communityTime}>{item.timestamp}</Text>
        </View>
      </View>
      <Text style={styles.communityTitle} numberOfLines={1}>{item.title}</Text>
      {item.content ? <Text style={styles.communityContent} numberOfLines={2}>{item.content}</Text> : null}
      <View style={styles.communityFooter}>
        <View style={styles.communityStat}>
          <Heart size={16} color={item.liked ? '#111827' : '#9CA3AF'} fill={item.liked ? '#111827' : 'transparent'} />
          <Text style={[styles.communityStatText, item.liked && styles.communityStatTextActive]}>{item.likes}</Text>
        </View>
        <View style={styles.communityStat}>
          <MessageCircle size={16} color="#9CA3AF" />
          <Text style={styles.communityStatText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatActivityDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function getCommunityBoardLabel(boardType?: string) {
  return boardType === 'INFO' ? '정보' : '자유';
}

function mapMyPageRecipe(item: MyPageRecipeActivityDto, liked = false): ActivityItem {
  return {
    id: `recipe-${item.recipe_id}`,
    eyebrow: liked ? '관심 레시피' : '작성 레시피',
    title: item.title,
    description: item.summary,
    meta: formatActivityDate(item.interested_at || item.created_at),
    statLabel: '관심',
    statValue: String(item.interest_count),
    kind: 'recipe',
    recipe: {
      id: item.recipe_id,
      title: item.title,
      author: '나',
      description: item.summary,
      likes: item.interest_count,
      comments: 0,
      timestamp: formatActivityDate(item.interested_at || item.created_at),
      liked,
      image: item.image_url || undefined,
    },
  };
}

function mapMyPageRecipeComment(item: MyPageRecipeCommentActivityDto): ActivityItem {
  return {
    id: `recipe-comment-${item.comment_id}`,
    eyebrow: '댓글 단 레시피',
    title: item.recipe.title,
    description: '',
    meta: formatActivityDate(item.created_at),
    statLabel: '좋아요',
    statValue: String(item.like_count),
    kind: 'comment',
    comment: item.content,
    route: `/recipe/${item.recipe.recipe_id}`,
  };
}

function mapMyPageCommunityPost(item: MyPageCommunityPostActivityDto, liked = false): ActivityItem {
  return {
    id: `community-${item.post_id}`,
    eyebrow: liked ? '좋아요한 글' : '작성한 글',
    title: item.title,
    description: '',
    meta: formatActivityDate(item.liked_at || item.created_at),
    statLabel: '댓글',
    statValue: String(item.comment_count),
    kind: 'community',
    community: {
      id: item.post_id,
      title: item.title,
      content: '',
      author: '나',
      category: getCommunityBoardLabel(item.board_type),
      timestamp: formatActivityDate(item.liked_at || item.created_at),
      likes: item.like_count,
      comments: item.comment_count,
      liked,
    },
  };
}

function mapMyPagePostComment(item: MyPagePostCommentActivityDto): ActivityItem {
  return {
    id: `post-comment-${item.comment_id}`,
    eyebrow: '댓글 단 글',
    title: item.post.title,
    description: '',
    meta: formatActivityDate(item.created_at),
    statLabel: '좋아요',
    statValue: String(item.like_count),
    kind: 'comment',
    comment: item.content,
    route: `/community/${item.post.post_id}`,
  };
}

function mapMyPageFundingInterest(item: MyPageActivityInterestsResult['interests'][number]): ActivityItem {
  const fundingProject: FundingProject = {
    id: item.targetId,
    title: item.title,
    brewery: '',
    location: '',
    category: '전통주',
    image: item.thumbnailUrl || '',
    goalAmount: 0,
    currentAmount: 0,
    backers: 0,
    daysLeft: 0,
    status: 'ACTIVE',
    liked: true,
    favoriteCount: 0,
    mainIngredients: item.summary || undefined,
    projectSummary: item.summary || undefined,
  };

  return {
    id: `funding-interest-${item.targetId}`,
    eyebrow: '관심 펀딩',
    title: item.title,
    description: item.summary || '',
    meta: formatActivityDate(item.interestedAt),
    statLabel: '분류',
    statValue: '펀딩',
    kind: 'funding',
    funding: fundingProject,
    route: `/funding/${item.targetId}`,
  };
}

function mapMyPageFundingQna(item: MyPageActivityQnaResult['qna'][number]): ActivityItem {
  return {
    id: `funding-qna-${item.questionId}`,
    eyebrow: item.hasAnswer ? '답변 완료' : '답변 대기',
    title: item.targetTitle,
    description: item.questionContent,
    meta: formatActivityDate(item.questionCreatedAt),
    statLabel: '상태',
    statValue: item.answerStatus,
    kind: 'comment',
    comment: item.questionContent,
    answer: item.answerContent || undefined,
    route: `/funding/${item.targetId}`,
  };
}

function mapMyPageFundingJournalComment(item: MyPageFundingJournalCommentsResult['comments'][number]): ActivityItem {
  return {
    id: `funding-journal-comment-${item.commentId}`,
    eyebrow: '양조일지 댓글',
    title: item.fundingTitle,
    description: item.breweryLogTitle,
    meta: formatActivityDate(item.createdAt),
    statLabel: '양조일지',
    statValue: formatActivityDate(item.breweryLogCreatedAt),
    kind: 'comment',
    comment: item.content,
    route: `/funding/${item.fundingId}?tab=journal&logId=${item.breweryLogId}`,
  };
}

export function RecipeActivityScreen() {
  const [written, setWritten] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [liked, setLiked] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [commented, setCommented] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setWritten((prev) => ({ ...prev, loading: true, error: null }));
        setLiked((prev) => ({ ...prev, loading: true, error: null }));
        setCommented((prev) => ({ ...prev, loading: true, error: null }));

        const [myRecipesResult, likedRecipesResult, commentsResult] = await Promise.allSettled([
          getMyPageMyRecipes(),
          getMyPageInterestedRecipes(),
          getMyPageRecipeComments(),
        ]);

        if (!active) return;

        if (myRecipesResult.status === 'fulfilled') {
          setWritten({ loading: false, error: null, data: myRecipesResult.value.recipes.map((item) => mapMyPageRecipe(item)) });
        } else {
          setWritten({
            loading: false,
            error: getMyPageApiErrorMessage(myRecipesResult.reason, '작성한 레시피를 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (likedRecipesResult.status === 'fulfilled') {
          setLiked({ loading: false, error: null, data: likedRecipesResult.value.recipes.map((item) => mapMyPageRecipe(item, true)) });
        } else {
          setLiked({
            loading: false,
            error: getMyPageApiErrorMessage(likedRecipesResult.reason, '관심 레시피를 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (commentsResult.status === 'fulfilled') {
          setCommented({ loading: false, error: null, data: commentsResult.value.comments.map(mapMyPageRecipeComment) });
        } else {
          setCommented({
            loading: false,
            error: getMyPageApiErrorMessage(commentsResult.reason, '레시피 댓글을 불러오지 못했습니다.'),
            data: [],
          });
        }
      };

      void load();

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <MyActivityCategoryScreen
      title="레시피"
      description="레시피를 작성하거나 다른 사람의 레시피에 관심을 표시해보세요"
      tabs={[
        {
          id: 'written',
          label: '작성',
          Icon: PenSquare,
          emptyTitle: '작성한 레시피가 없습니다',
          items: written.data,
          loading: written.loading,
          error: written.error,
        },
        {
          id: 'liked',
          label: '관심',
          Icon: Heart,
          emptyTitle: '관심 표시한 레시피가 없습니다',
          items: liked.data,
          loading: liked.loading,
          error: liked.error,
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 레시피가 없습니다',
          items: commented.data,
          loading: commented.loading,
          error: commented.error,
        },
      ]}
    />
  );
}

export function FundingActivityScreen() {
  const [liked, setLiked] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [commented, setCommented] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [qna, setQna] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setLiked((prev) => ({ ...prev, loading: true, error: null }));
        setCommented((prev) => ({ ...prev, loading: true, error: null }));
        setQna((prev) => ({ ...prev, loading: true, error: null }));

        const [interestsResult, commentsResult, qnaResult] = await Promise.allSettled([
          getMyPageActivityInterests({ type: 'FUNDING' }),
          getMyPageFundingJournalComments(),
          getMyPageActivityQna(),
        ]);

        if (!active) return;

        if (interestsResult.status === 'fulfilled') {
          setLiked({ loading: false, error: null, data: (interestsResult.value.interests ?? []).map(mapMyPageFundingInterest) });
        } else {
          setLiked({
            loading: false,
            error: getMyPageApiErrorMessage(interestsResult.reason, '관심 펀딩 목록을 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (commentsResult.status === 'fulfilled') {
          setCommented({ loading: false, error: null, data: (commentsResult.value.comments ?? []).map(mapMyPageFundingJournalComment) });
        } else {
          setCommented({
            loading: false,
            error: getMyPageApiErrorMessage(commentsResult.reason, '양조일지 댓글 목록을 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (qnaResult.status === 'fulfilled') {
          setQna({ loading: false, error: null, data: (qnaResult.value.qna ?? []).map(mapMyPageFundingQna) });
        } else {
          setQna({
            loading: false,
            error: getMyPageApiErrorMessage(qnaResult.reason, 'Q&A 목록을 불러오지 못했습니다.'),
            data: [],
          });
        }
      };

      void load();

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <MyActivityCategoryScreen
      title="펀딩"
      description="펀딩 프로젝트에 관심을 표시하거나 댓글을 남겨보세요"
      tabs={[
        {
          id: 'liked',
          label: '관심',
          Icon: Heart,
          emptyTitle: '관심 표시한 펀딩이 없습니다',
          items: liked.data,
          loading: liked.loading,
          error: liked.error,
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 펀딩이 없습니다',
          items: commented.data,
          loading: commented.loading,
          error: commented.error,
        },
        {
          id: 'qna',
          label: 'Q&A',
          Icon: HelpCircle,
          emptyTitle: '작성한 Q&A가 없습니다',
          items: qna.data,
          loading: qna.loading,
          error: qna.error,
        },
      ]}
    />
  );
}

export function CommunityActivityScreen() {
  const [written, setWritten] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [liked, setLiked] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });
  const [commented, setCommented] = useState<LoadState<ActivityItem[]>>({ loading: true, error: null, data: [] });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setWritten((prev) => ({ ...prev, loading: true, error: null }));
        setLiked((prev) => ({ ...prev, loading: true, error: null }));
        setCommented((prev) => ({ ...prev, loading: true, error: null }));

        const [myPostsResult, likedPostsResult, commentsResult] = await Promise.allSettled([
          getMyPageMyPosts(),
          getMyPageLikedPosts(),
          getMyPagePostComments(),
        ]);

        if (!active) return;

        if (myPostsResult.status === 'fulfilled') {
          setWritten({ loading: false, error: null, data: myPostsResult.value.posts.map((item) => mapMyPageCommunityPost(item)) });
        } else {
          setWritten({
            loading: false,
            error: getMyPageApiErrorMessage(myPostsResult.reason, '작성한 게시글을 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (likedPostsResult.status === 'fulfilled') {
          setLiked({ loading: false, error: null, data: likedPostsResult.value.posts.map((item) => mapMyPageCommunityPost(item, true)) });
        } else {
          setLiked({
            loading: false,
            error: getMyPageApiErrorMessage(likedPostsResult.reason, '좋아요한 게시글을 불러오지 못했습니다.'),
            data: [],
          });
        }

        if (commentsResult.status === 'fulfilled') {
          setCommented({ loading: false, error: null, data: commentsResult.value.comments.map(mapMyPagePostComment) });
        } else {
          setCommented({
            loading: false,
            error: getMyPageApiErrorMessage(commentsResult.reason, '게시글 댓글을 불러오지 못했습니다.'),
            data: [],
          });
        }
      };

      void load();

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <MyActivityCategoryScreen
      title="커뮤니티"
      description="커뮤니티에 게시글을 작성하거나 댓글을 남겨보세요"
      tabs={[
        {
          id: 'written',
          label: '작성',
          Icon: PenSquare,
          emptyTitle: '작성한 게시글이 없습니다',
          items: written.data,
          loading: written.loading,
          error: written.error,
        },
        {
          id: 'liked',
          label: '좋아요',
          Icon: Heart,
          emptyTitle: '좋아요한 게시글이 없습니다',
          items: liked.data,
          loading: liked.loading,
          error: liked.error,
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 게시글이 없습니다',
          items: commented.data,
          loading: commented.loading,
          error: commented.error,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerRow: { height: 78, flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 28, fontWeight: '900', color: '#111827' },
  headerSpacer: { width: 44 },
  tabsWrap: {
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F0F1F4',
    padding: 5,
    flexDirection: 'row',
    gap: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  tabButtonActive: {
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: { fontSize: 16, fontWeight: '900', color: '#4B5563' },
  tabTextActive: { color: '#FFFFFF' },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 18 },
  list: { gap: 12 },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  cardEyebrow: { fontSize: 11, fontWeight: '900', color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  cardMeta: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },
  cardTitle: { fontSize: 16, lineHeight: 22, fontWeight: '900', color: '#111827', marginBottom: 6 },
  cardDescription: { fontSize: 13, lineHeight: 19, fontWeight: '700', color: '#6B7280', marginBottom: 14 },
  cardFooter: { height: 36, borderRadius: 12, backgroundColor: '#F9FAFB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  cardStatLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  cardStatValue: { fontSize: 13, fontWeight: '900', color: '#111827' },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  commentRecipeTitle: { fontSize: 16, lineHeight: 22, fontWeight: '900', color: '#111827', marginBottom: 12 },
  myCommentBox: { borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', padding: 13, marginBottom: 10 },
  myCommentText: { fontSize: 13, lineHeight: 20, fontWeight: '700', color: '#374151' },
  answerToggle: { height: 36, borderRadius: 12, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  answerToggleText: { fontSize: 12, fontWeight: '900', color: '#4B5563' },
  answerBox: { marginTop: 10, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E5E7EB', padding: 13 },
  answerText: { fontSize: 13, lineHeight: 20, fontWeight: '700', color: '#374151' },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  communityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  communityAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  communityAvatarImage: { width: '100%', height: '100%' },
  communityAvatarText: { fontSize: 16, fontWeight: '900', color: '#6B7280' },
  communityHeaderText: { flex: 1, minWidth: 0 },
  communityAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  communityAuthor: { fontSize: 14, fontWeight: '800', color: '#111827' },
  communityCategoryBadge: { marginLeft: 'auto', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  communityCategoryText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  communityTime: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  communityTitle: { fontSize: 15, lineHeight: 21, color: '#111827', fontWeight: '900', marginBottom: 8 },
  communityContent: { fontSize: 14, lineHeight: 22, color: '#374151', fontWeight: '600' },
  communityFooter: { flexDirection: 'row', gap: 18, marginTop: 14 },
  communityStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  communityStatText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  communityStatTextActive: { color: '#111827' },
  emptyBox: { flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#9CA3AF', marginBottom: 12 },
  emptyDescription: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', textAlign: 'center', lineHeight: 21 },
});
