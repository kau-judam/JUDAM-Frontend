import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ChefHat,
  ChevronDown,
  Heart,
  MessageCircle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCommunity } from '@/contexts/CommunityContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useFunding } from '@/contexts/FundingContext';
import { getImageSource, recipesData } from '@/constants/data';

type ActivitySection = 'recipe' | 'community' | 'funding';

type SubSection = {
  id: string;
  shortLabel: string;
  title: string;
  count: number;
};

type SectionConfig = {
  id: ActivitySection;
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  subSections: SubSection[];
};

function getPostImageSource(image?: string | ImageSourcePropType) {
  if (!image) return undefined;
  return typeof image === 'string' ? { uri: image } : image;
}

export default function MyActivityScreen() {
  const insets = useSafeAreaInsets();
  const { posts } = useCommunity();
  const { projects, fundingReviews } = useFunding();
  const { favoriteFundings } = useFavorites();
  const [expandedSection, setExpandedSection] = useState<ActivitySection | null>('recipe');
  const [activeSubSection, setActiveSubSection] = useState<Record<ActivitySection, string>>({
    recipe: 'my',
    community: 'my',
    funding: 'liked',
  });

  const likedRecipes = useMemo(() => recipesData.filter((recipe) => recipe.liked), []);
  const likedPosts = useMemo(() => posts.filter((post) => post.liked), [posts]);
  const likedFundingProjects = useMemo(
    () => projects.filter((project) => favoriteFundings.includes(project.id)),
    [favoriteFundings, projects]
  );

  const sections: SectionConfig[] = [
    {
      id: 'recipe',
      title: '레시피',
      icon: ChefHat,
      subSections: [
        { id: 'my', shortLabel: '작성', title: '내가 작성한 레시피', count: recipesData.length },
        { id: 'liked', shortLabel: '관심 레시피', title: '관심 레시피', count: likedRecipes.length },
        { id: 'comments', shortLabel: '작성 댓글', title: '작성 댓글', count: 0 },
      ],
    },
    {
      id: 'community',
      title: '커뮤니티',
      icon: MessageSquare,
      subSections: [
        { id: 'my', shortLabel: '작성', title: '내가 작성한 게시글', count: posts.length },
        { id: 'liked', shortLabel: '관심 게시글', title: '관심 게시글', count: likedPosts.length },
        { id: 'comments', shortLabel: '작성 댓글', title: '작성 댓글', count: 0 },
      ],
    },
    {
      id: 'funding',
      title: '펀딩',
      icon: TrendingUp,
      subSections: [
        { id: 'liked', shortLabel: '관심', title: '관심있는 펀딩', count: likedFundingProjects.length },
        { id: 'comments', shortLabel: '작성 댓글', title: '작성 댓글', count: fundingReviews.length },
        { id: 'qna', shortLabel: '작성 Q&A', title: '작성 Q&A', count: 0 },
      ],
    },
  ];

  const toggleSection = (section: ActivitySection) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  const renderContent = (section: SectionConfig) => {
    const activeId = activeSubSection[section.id];

    if (section.id === 'community' && activeId === 'my') {
      return (
        <View style={styles.previewList}>
          {posts.slice(0, 3).map((post) => {
            const imageSource = getPostImageSource(post.image);
            return (
              <TouchableOpacity
                key={post.id}
                style={styles.previewItem}
                activeOpacity={0.82}
                onPress={() => router.push(`/community/${post.id}` as any)}
              >
                <View style={styles.previewThumb}>
                  {imageSource ? <Image source={imageSource} style={styles.previewImage} /> : null}
                </View>
                <View style={styles.previewBody}>
                  <Text style={styles.previewTitle} numberOfLines={2}>{post.title}</Text>
                  <View style={styles.previewMetaRow}>
                    <View style={styles.previewMeta}>
                      <Heart size={13} color="#9CA3AF" />
                      <Text style={styles.previewMetaText}>{post.likes}</Text>
                    </View>
                    <View style={styles.previewMeta}>
                      <MessageCircle size={13} color="#9CA3AF" />
                      <Text style={styles.previewMetaText}>{post.comments}</Text>
                    </View>
                    <Text style={styles.previewTime}>{post.timestamp}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (section.id === 'community' && activeId === 'liked' && likedPosts.length > 0) {
      return (
        <View style={styles.previewList}>
          {likedPosts.slice(0, 3).map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.simpleItem}
              activeOpacity={0.82}
              onPress={() => router.push(`/community/${post.id}` as any)}
            >
              <Text style={styles.simpleTitle} numberOfLines={1}>{post.title}</Text>
              <ChevronDown size={16} color="#D1D5DB" style={styles.simpleArrow} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (section.id === 'recipe' && activeId === 'liked' && likedRecipes.length > 0) {
      return (
        <View style={styles.previewList}>
          {likedRecipes.slice(0, 3).map((recipe) => {
            const imageSource = getImageSource(recipe.image);
            return (
              <TouchableOpacity
                key={recipe.id}
                style={styles.previewItem}
                activeOpacity={0.82}
                onPress={() => router.push(`/recipe/${recipe.id}` as any)}
              >
                <View style={styles.previewThumb}>
                  {imageSource ? <Image source={imageSource} style={styles.previewImage} /> : null}
                </View>
                <View style={styles.previewBody}>
                  <Text style={styles.previewTitle} numberOfLines={2}>{recipe.title}</Text>
                  <View style={styles.previewMetaRow}>
                    <View style={styles.previewMeta}>
                      <Heart size={13} color="#9CA3AF" />
                      <Text style={styles.previewMetaText}>{recipe.likes}</Text>
                    </View>
                    <View style={styles.previewMeta}>
                      <MessageCircle size={13} color="#9CA3AF" />
                      <Text style={styles.previewMetaText}>{recipe.comments}</Text>
                    </View>
                    <Text style={styles.previewTime}>{recipe.timestamp}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (section.id === 'funding' && activeId === 'liked' && likedFundingProjects.length > 0) {
      return (
        <View style={styles.previewList}>
          {likedFundingProjects.slice(0, 3).map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.simpleItem}
              activeOpacity={0.82}
              onPress={() => router.push(`/funding/${project.id}` as any)}
            >
              <Text style={styles.simpleTitle} numberOfLines={1}>{project.title}</Text>
              <ChevronDown size={16} color="#D1D5DB" style={styles.simpleArrow} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>아직 내역이 없습니다</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.75} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 활동</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
      >
        {sections.map((section) => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSection === section.id;
          const totalCount = section.subSections.reduce((sum, item) => sum + item.count, 0);
          const active = section.subSections.find((item) => item.id === activeSubSection[section.id]) || section.subSections[0];

          return (
            <View key={section.id} style={[styles.sectionCard, isExpanded && styles.sectionCardExpanded]}>
              <TouchableOpacity
                style={styles.sectionHeader}
                activeOpacity={0.86}
                onPress={() => toggleSection(section.id)}
              >
                <View style={styles.sectionTitleRow}>
                  <View style={styles.iconCircle}>
                    <SectionIcon size={22} color="#FFFFFF" />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <View style={styles.sectionCountRow}>
                  <Text style={styles.sectionCount}>{totalCount}개</Text>
                  <ChevronDown
                    size={20}
                    color="#9CA3AF"
                    style={[styles.chevron, isExpanded && styles.chevronOpen]}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.segmented}>
                    {section.subSections.map((sub) => {
                      const isActive = activeSubSection[section.id] === sub.id;
                      return (
                        <TouchableOpacity
                          key={sub.id}
                          style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
                          activeOpacity={0.86}
                          onPress={() => setActiveSubSection((prev) => ({ ...prev, [section.id]: sub.id }))}
                        >
                          <Text style={[styles.segmentText, isActive && styles.segmentTextActive]} numberOfLines={1}>
                            {sub.shortLabel}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.contentHeader}>
                    <Text style={styles.contentTitle}>{active.title}</Text>
                    <Text style={styles.contentCount}>{active.count}개</Text>
                  </View>
                  {renderContent(section)}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    minHeight: 64,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  content: { paddingHorizontal: 24, paddingTop: 18, gap: 16 },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sectionCardExpanded: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionHeader: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  sectionCountRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionCount: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  chevron: { transform: [{ rotate: '0deg' }] },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  expandedContent: { borderTopWidth: 1, borderTopColor: '#EEF0F2', padding: 20, paddingTop: 18 },
  segmented: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F1F4',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segmentButton: { flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentButtonActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: { fontSize: 13, fontWeight: '900', color: '#4B5563' },
  segmentTextActive: { color: '#111827' },
  contentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  contentTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  contentCount: { fontSize: 14, fontWeight: '800', color: '#6B7280' },
  emptyBox: { minHeight: 82, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  previewList: { gap: 10 },
  previewItem: {
    minHeight: 74,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },
  previewThumb: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  previewBody: { flex: 1, minWidth: 0 },
  previewTitle: { fontSize: 13, lineHeight: 19, fontWeight: '800', color: '#4B5563' },
  previewMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  previewMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewMetaText: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  previewTime: { marginLeft: 'auto', fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  simpleItem: {
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  simpleTitle: { flex: 1, fontSize: 13, fontWeight: '800', color: '#4B5563' },
  simpleArrow: { transform: [{ rotate: '-90deg' }] },
});
