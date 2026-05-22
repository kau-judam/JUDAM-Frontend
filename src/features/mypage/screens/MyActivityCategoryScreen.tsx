import React, { useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, Heart, HelpCircle, MessageCircle, PenSquare, type LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecipeCard } from '@/components/recipe-card';
import type { FundingProject } from '@/constants/data';
import FundingProjectCard from '@/features/funding/components/FundingProjectCard';

type ActivityTab = {
  id: string;
  label: string;
  Icon: LucideIcon;
  emptyTitle: string;
  items?: ActivityItem[];
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
    image?: string;
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
        {items.length > 0 ? (
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
                    favorite={true}
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
                          <Text style={styles.answerToggleText}>답변보기</Text>
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
      <Text style={styles.communityContent} numberOfLines={2}>{item.content}</Text>
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

export function RecipeActivityScreen() {
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
          items: [
            {
              id: 'dummy-recipe-written-1',
              eyebrow: '작성한 레시피',
              title: '막걸리 크림 파스타',
              description: '은은한 산미의 막걸리를 소스에 더해 부드럽게 완성한 주담 테스트 레시피',
              meta: '2026.05.22',
              statLabel: '좋아요',
              statValue: '24',
              kind: 'recipe',
              recipe: {
                id: 900101,
                title: '막걸리 크림 파스타',
                author: '나',
                description: '은은한 산미의 막걸리를 소스에 더해 부드럽게 완성한 레시피',
                likes: 24,
                comments: 7,
                timestamp: '2026.05.22',
              },
            },
          ],
        },
        {
          id: 'liked',
          label: '관심',
          Icon: Heart,
          emptyTitle: '관심 표시한 레시피가 없습니다',
          items: [
            {
              id: 'dummy-recipe-liked-1',
              eyebrow: '관심 레시피',
              title: '약주 봉골레',
              description: '약주의 향을 조개 육수에 더한 깔끔한 주담 테스트 레시피',
              meta: '2026.05.20',
              statLabel: '좋아요',
              statValue: '38',
              kind: 'recipe',
              recipe: {
                id: 900102,
                title: '약주 봉골레',
                author: '주담키친',
                description: '약주의 향을 조개 육수에 더해 깔끔하게 마무리한 파스타',
                likes: 38,
                comments: 12,
                timestamp: '2026.05.20',
                liked: true,
              },
            },
          ],
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 레시피가 없습니다',
          items: [
            {
              id: 'dummy-recipe-comment-1',
              eyebrow: '댓글 단 레시피',
              title: '청주 토마토 절임',
              description: '',
              meta: '2026.05.19',
              statLabel: '',
              statValue: '',
              kind: 'comment',
              comment: '토마토 단맛이 청주 향이랑 잘 맞을 것 같아요. 주말에 한번 따라 해볼게요.',
              route: '/recipe/900103',
            },
          ],
        },
      ]}
    />
  );
}

export function FundingActivityScreen() {
  const dummyFunding: FundingProject = {
    id: 900301,
    title: '달빛 담은 배 막걸리',
    brewery: '주담 테스트 양조장',
    location: '충북 충주',
    category: '막걸리',
    image: '',
    localImage: require('../../../../newpicutre/funding3.jpg'),
    goalAmount: 3000000,
    currentAmount: 3600000,
    backers: 128,
    daysLeft: 0,
    status: '펀딩 성공' as FundingProject['status'],
    bottleSize: '500ml',
    alcoholContent: '6%',
    rewardItems: ['달빛 담은 배 막걸리 1병'],
    shippingFee: 3000,
    mainIngredients: '쌀, 배',
  };

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
          items: [
            {
              id: 'dummy-funding-1',
              eyebrow: '관심 펀딩',
              title: '달빛 담은 배 막걸리',
              description: '배의 은은한 단맛과 쌀의 고소함을 담은 펀딩 프로젝트 더미 항목',
              meta: '목표 120%',
              statLabel: '참여자',
              statValue: '128명',
              kind: 'funding',
              funding: dummyFunding,
            },
          ],
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 펀딩이 없습니다',
          items: [
            {
              id: 'dummy-funding-comment-1',
              eyebrow: '댓글 단 펀딩',
              title: '달빛 담은 배 막걸리',
              description: '',
              meta: '',
              statLabel: '',
              statValue: '',
              kind: 'comment',
              comment: '배 향이 어느 정도로 올라오는지 궁금했는데 설명을 보니 기대돼요.',
              route: '/funding/900301',
            },
          ],
        },
        {
          id: 'qna',
          label: 'Q&A',
          Icon: HelpCircle,
          emptyTitle: '작성한 Q&A가 없습니다',
          items: [
            {
              id: 'dummy-funding-qna-1',
              eyebrow: '작성한 Q&A',
              title: '달빛 담은 배 막걸리',
              description: '',
              meta: '',
              statLabel: '',
              statValue: '',
              kind: 'comment',
              comment: '배송은 몇 월 초쯤 시작될 예정인가요?',
              answer: '현재 일정 기준으로 6월 첫째 주부터 순차 배송을 준비하고 있습니다. 정확한 출고일은 배송 시작 전 알림으로 안내드릴게요.',
              route: '/funding/900301',
            },
          ],
        },
      ]}
    />
  );
}

export function CommunityActivityScreen() {
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
          items: [
            {
              id: 'dummy-community-1',
              eyebrow: '작성한 글',
              title: '이번 주말에 마신 전통주 추천',
              description: '가볍게 마시기 좋았던 술과 안주 조합을 공유하는 커뮤니티 더미 게시글',
              meta: '방금 전',
              statLabel: '댓글',
              statValue: '7',
              kind: 'community',
              community: {
                id: 900201,
                title: '이번 주말에 마신 전통주 추천',
                content: '가볍게 마시기 좋았던 술과 안주 조합을 공유하는 커뮤니티 더미 게시글',
                author: '나',
                category: '자유',
                timestamp: '방금 전',
                likes: 18,
                comments: 7,
              },
            },
          ],
        },
        {
          id: 'liked',
          label: '관심',
          Icon: Heart,
          emptyTitle: '관심 표시한 게시글이 없습니다',
          items: [
            {
              id: 'dummy-community-liked-1',
              eyebrow: '관심 글',
              title: '비 오는 날 어울리는 전통주',
              description: '비 오는 날 마시기 좋은 술 이야기를 나누는 커뮤니티 더미 게시글',
              meta: '1시간 전',
              statLabel: '댓글',
              statValue: '11',
              kind: 'community',
              community: {
                id: 900202,
                title: '비 오는 날 어울리는 전통주',
                content: '파전과 함께 마셨을 때 좋았던 술을 서로 추천해보면 좋겠어요.',
                author: '술친구',
                category: '추천',
                timestamp: '1시간 전',
                likes: 31,
                comments: 11,
                liked: true,
              },
            },
          ],
        },
        {
          id: 'commented',
          label: '댓글',
          Icon: MessageCircle,
          emptyTitle: '댓글을 남긴 게시글이 없습니다',
          items: [
            {
              id: 'dummy-community-comment-1',
              eyebrow: '댓글 단 글',
              title: '첫 전통주로 뭐가 좋을까요?',
              description: '',
              meta: '',
              statLabel: '',
              statValue: '',
              kind: 'comment',
              comment: '처음이면 향이 너무 강하지 않은 막걸리나 약주부터 시작해보는 것도 좋아요.',
              route: '/community/900203',
            },
          ],
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
  communityContent: { minHeight: 44, fontSize: 14, lineHeight: 22, color: '#374151', fontWeight: '600' },
  communityFooter: { flexDirection: 'row', gap: 18, marginTop: 14 },
  communityStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  communityStatText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  communityStatTextActive: { color: '#111827' },
  emptyBox: { flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#9CA3AF', marginBottom: 12 },
  emptyDescription: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', textAlign: 'center', lineHeight: 21 },
});
