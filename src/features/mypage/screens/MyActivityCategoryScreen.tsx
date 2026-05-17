import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart, HelpCircle, MessageCircle, PenSquare, type LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActivityTab = {
  id: string;
  label: string;
  Icon: LucideIcon;
  emptyTitle: string;
};

type ActivityCategoryProps = {
  title: string;
  tabs: ActivityTab[];
  description: string;
};

export function MyActivityCategoryScreen({ title, tabs, description }: ActivityCategoryProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

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
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>{active.emptyTitle}</Text>
          <Text style={styles.emptyDescription}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export function RecipeActivityScreen() {
  return (
    <MyActivityCategoryScreen
      title="레시피"
      description="레시피를 작성하거나 다른 사람의 레시피에 관심을 표시해보세요"
      tabs={[
        { id: 'written', label: '작성', Icon: PenSquare, emptyTitle: '작성한 레시피가 없습니다' },
        { id: 'liked', label: '관심', Icon: Heart, emptyTitle: '관심 표시한 레시피가 없습니다' },
        { id: 'commented', label: '댓글', Icon: MessageCircle, emptyTitle: '댓글을 남긴 레시피가 없습니다' },
      ]}
    />
  );
}

export function FundingActivityScreen() {
  return (
    <MyActivityCategoryScreen
      title="펀딩"
      description="펀딩 프로젝트에 관심을 표시하거나 댓글을 남겨보세요"
      tabs={[
        { id: 'liked', label: '관심', Icon: Heart, emptyTitle: '관심 표시한 펀딩이 없습니다' },
        { id: 'commented', label: '댓글', Icon: MessageCircle, emptyTitle: '댓글을 남긴 펀딩이 없습니다' },
        { id: 'qna', label: 'Q&A', Icon: HelpCircle, emptyTitle: '작성한 Q&A가 없습니다' },
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
        { id: 'written', label: '작성', Icon: PenSquare, emptyTitle: '작성한 게시글이 없습니다' },
        { id: 'liked', label: '관심', Icon: Heart, emptyTitle: '관심 표시한 게시글이 없습니다' },
        { id: 'commented', label: '댓글', Icon: MessageCircle, emptyTitle: '댓글을 남긴 게시글이 없습니다' },
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
  content: { flexGrow: 1, paddingHorizontal: 20 },
  emptyBox: { flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#9CA3AF', marginBottom: 12 },
  emptyDescription: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', textAlign: 'center', lineHeight: 21 },
});
