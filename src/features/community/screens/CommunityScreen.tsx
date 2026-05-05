import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  MessageCircle,
  Heart,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { showLoginRequired } from '@/utils/authPrompt';

const POSTS_PER_PAGE = 6;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { posts, likePost } = useCommunity();
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("전체");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePostLike = (postId: number) => {
    if (!user) {
      showLoginRequired('커뮤니티 좋아요는 로그인 후 이용할 수 있어요.');
      return;
    }
    likePost(postId);
  };

  const handleCreatePost = () => {
    if (!user) {
      showLoginRequired('커뮤니티 글 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    router.push('/community/create' as any);
  };

  const filteredPosts = posts.filter(p => {
    const catMatch = communityFilter === "전체" || p.category === communityFilter;
    const query = searchQuery.toLowerCase();
    const searchMatch = !query || p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query) || p.author.toLowerCase().includes(query);
    return catMatch && searchMatch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === "인기순") return b.likes - a.likes;
    return b.id - a.id;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const pagedPosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <View style={styles.container}>
      <PageHeader title="커뮤니티" />
      
      {/* 1. Filter Section */}
      <View style={styles.filterSection}>
         {/* Search Bar */}
         <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="게시글, 작성자로 검색..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={val => { setSearchQuery(val); setCurrentPage(1); }}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                 <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
         </View>

         <View style={styles.filterControlsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.catScroll}>
              {["전체", "자유게시판", "정보게시판"].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, communityFilter === cat && styles.catChipActive]}
                  onPress={() => { setCommunityFilter(cat); setCurrentPage(1); }}
                >
                   <Text style={[styles.catChipTxt, communityFilter === cat && styles.catChipTxtActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.sortWrap}>
              <TouchableOpacity
                style={styles.sortBtn}
                onPress={() => setShowSortDropdown(!showSortDropdown)}
              >
                 <Text style={styles.sortBtnTxt}>{sortOption}</Text>
                 <ChevronDown size={14} color="#6B7280" />
              </TouchableOpacity>
              {showSortDropdown && (
                <View style={styles.sortDropdown}>
                   <TouchableOpacity style={styles.dropItem} onPress={() => { setSortOption("인기순"); setShowSortDropdown(false); }}>
                      <Text style={styles.dropItemTxt}>인기순</Text>
                      {sortOption === "인기순" && <Check size={14} color="#111" />}
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.dropItem} onPress={() => { setSortOption("최신순"); setShowSortDropdown(false); }}>
                      <Text style={styles.dropItemTxt}>최신순</Text>
                      {sortOption === "최신순" && <Check size={14} color="#111" />}
                   </TouchableOpacity>
                </View>
              )}
            </View>
         </View>
      </View>

      {/* 2. Feed Section */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feedContent}>
         {/* Post Cards */}
         {pagedPosts.length === 0 ? (
           <View style={styles.emptyState}>
              <Text style={styles.emptyTxt}>게시글이 없습니다.</Text>
           </View>
         ) : (
           pagedPosts.map((post, idx) => (
             <AnimatedTouchable
               key={post.id} 
               entering={FadeInUp.delay(idx * 50)} 
               layout={Layout.springify()}
               style={styles.postCard}
               activeOpacity={0.86}
               onPress={() => router.push(`/community/${post.id}` as any)}
             >
                <View style={styles.postHeader}>
                   <Image source={{ uri: post.avatar }} style={styles.avatar} />
                   <View style={{ flex: 1 }}>
                      <View style={styles.authorRow}>
                         <Text style={styles.authorName}>{post.author}</Text>
                         {post.authorType === 'brewery' && <View style={styles.breweryBadge}><Text style={styles.breweryBadgeTxt}>양조장</Text></View>}
                         <View style={styles.postCatBadge}><Text style={styles.postCatTxt}>{post.category}</Text></View>
                      </View>
                      <Text style={styles.timeTxt}>{post.timestamp}</Text>
                   </View>
                </View>

                <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">{post.title}</Text>
                <Text style={styles.postContent} numberOfLines={2} ellipsizeMode="tail">{post.content}</Text>

                <View style={styles.postFooter}>
                   <TouchableOpacity style={styles.statBtn} onPress={() => handlePostLike(post.id)}>
                      <Heart size={16} color={post.liked ? "#111" : "#9CA3AF"} fill={post.liked ? "#111" : "transparent"} />
                      <Text style={[styles.statTxt, post.liked && { color: '#111' }]}>{post.likes}</Text>
                   </TouchableOpacity>
                   <View style={styles.statBtn}>
                      <MessageCircle size={16} color="#9CA3AF" />
                      <Text style={styles.statTxt}>{post.comments}</Text>
                   </View>
                </View>
             </AnimatedTouchable>
           ))
         )}

         {/* Pagination */}
         {totalPages > 1 && (
           <View style={styles.pagination}>
              <TouchableOpacity 
                disabled={currentPage === 1} 
                onPress={() => setCurrentPage(prev => prev - 1)}
                style={styles.pageArrow}
              >
                 <ChevronLeft size={20} color={currentPage === 1 ? "#D1D5DB" : "#111"} />
              </TouchableOpacity>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.pageBtn, currentPage === i + 1 && styles.pageBtnActive]}
                  onPress={() => setCurrentPage(i + 1)}
                >
                   <Text style={[styles.pageBtnTxt, currentPage === i + 1 && styles.pageBtnTxtActive]}>{i + 1}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                disabled={currentPage === totalPages} 
                onPress={() => setCurrentPage(prev => prev + 1)}
                style={styles.pageArrow}
              >
                 <ChevronRight size={20} color={currentPage === totalPages ? "#D1D5DB" : "#111"} />
              </TouchableOpacity>
           </View>
         )}
         
         <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.9}
        onPress={handleCreatePost}
      >
         <Plus size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  filterSection: { paddingHorizontal: 20, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', zIndex: 100 },
  searchBar: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  filterControlsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 16 },
  categoryScroll: { flex: 1 },
  catScroll: { gap: 8 },
  catChip: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  catChipActive: { backgroundColor: '#111' },
  catChipTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  catChipTxtActive: { color: '#FFF' },
  feedContent: { paddingHorizontal: 20, paddingTop: 16 },
  sortWrap: { position: 'relative', zIndex: 200 },
  sortBtn: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 14, borderRadius: 20 },
  sortBtnTxt: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  sortDropdown: { position: 'absolute', top: 46, right: 0, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, minWidth: 110, overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropItemTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  postCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  authorName: { fontSize: 14, fontWeight: '800', color: '#111' },
  breweryBadge: { backgroundColor: '#111', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  breweryBadgeTxt: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  postCatBadge: { marginLeft: 'auto', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  postCatTxt: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  timeTxt: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  postTitle: { fontSize: 15, lineHeight: 21, color: '#111', fontWeight: '900', marginBottom: 8 },
  postContent: { height: 44, fontSize: 14, lineHeight: 22, color: '#374151', fontWeight: '600' },
  postFooter: { flexDirection: 'row', gap: 18, marginTop: 14, paddingTop: 0 },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statTxt: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyTxt: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 },
  pageArrow: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  pageBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  pageBtnActive: { backgroundColor: '#111' },
  pageBtnTxt: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  pageBtnTxtActive: { color: '#FFF' },
  fab: { position: 'absolute', right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});
