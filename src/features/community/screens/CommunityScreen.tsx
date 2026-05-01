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

const POSTS_PER_PAGE = 6;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Post {
  id: number;
  author: string;
  authorType: "user" | "brewery";
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  category: string;
}

const initialPosts: Post[] = [
  { id: 1, author: "전통주러버", authorType: "user", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", content: "오늘 처음으로 막걸리 담가봤어요! 국내산 쌀로 만들었는데 생각보다 쉽더라구요. 다들 한번 도전해보세요! 🍶", likes: 42, comments: 8, timestamp: "2시간 전", liked: false, category: "자유게시판" },
  { id: 2, author: "술샘양조장", authorType: "brewery", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", content: "이번 주말에 양조장 투어 진행합니다! 전통 누룩 만드는 과정을 직접 보실 수 있어요. 댓글로 신청해주세요!", likes: 127, comments: 23, timestamp: "5시간 전", liked: true, category: "정보게시판" },
  { id: 3, author: "막걸리마스터", authorType: "user", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", content: "장미 막걸리 만들기 성공! 꽃향기가 정말 좋네요. 레시피 공유할게요:\n\n1. 국내산 쌀 2kg\n2. 누룩 200g\n3. 장미꽃잎 100g\n\n발효는 3일 정도 걸렸어요 🌹", likes: 89, comments: 15, timestamp: "어제", liked: false, category: "정보게시판" },
  { id: 4, author: "청주러버", authorType: "user", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", content: "청주 빚을 때 온도 관리가 제일 중요한 것 같아요. 18-20도를 유지하니 훨씬 깔끔한 맛이 나더라구요!", likes: 56, comments: 12, timestamp: "2일 전", liked: false, category: "정보게시판" },
  { id: 5, author: "소주마니아", authorType: "user", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", content: "집에서 증류식 소주 만드는 법 궁금하신 분 계신가요? 초보자도 할 수 있는 간단한 방법 알려드려요!", likes: 73, comments: 19, timestamp: "3일 전", liked: false, category: "정보게시판" },
  { id: 6, author: "한산양조장", authorType: "brewery", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", content: "한산소곡주 체험 프로그램 오픈합니다! 전통주 빚기부터 시음까지 알찬 3시간 코스예요. 많은 관심 부탁드립니다 🙏", likes: 145, comments: 31, timestamp: "4일 전", liked: true, category: "정보게시판" },
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [communityFilter, setCommunityFilter] = useState("전체");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handlePostLike = (postId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const filteredPosts = posts.filter(p => {
    const catMatch = communityFilter === "전체" || p.category === communityFilter;
    const query = searchQuery.toLowerCase();
    const searchMatch = !query || p.content.toLowerCase().includes(query) || p.author.toLowerCase().includes(query);
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

         {/* Category Filter */}
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
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
      </View>

      {/* 2. Feed Section */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feedContent}>
         {/* Sort Toggle */}
         <View style={styles.sortRow}>
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
        onPress={() => user ? router.push('/community/create' as any) : router.push('/login' as any)}
      >
         <Plus size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  filterSection: { paddingHorizontal: 20, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchBar: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  catScroll: { gap: 8, paddingBottom: 16 },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F3F4F6' },
  catChipActive: { backgroundColor: '#111' },
  catChipTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  catChipTxtActive: { color: '#FFF' },
  feedContent: { paddingHorizontal: 20, paddingTop: 20 },
  sortRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20, zIndex: 100 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  sortBtnTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  sortDropdown: { position: 'absolute', top: 40, right: 0, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, minWidth: 110, overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropItemTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  postCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2 },
  postHeader: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  authorName: { fontSize: 14, fontWeight: '800', color: '#111' },
  breweryBadge: { backgroundColor: '#111', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  breweryBadgeTxt: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  postCatBadge: { marginLeft: 'auto', backgroundColor: '#F9FAFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  postCatTxt: { fontSize: 10, fontWeight: '700', color: '#9CA3AF' },
  timeTxt: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  postContent: { height: 44, fontSize: 14, lineHeight: 22, color: '#374151', fontWeight: '500' },
  postFooter: { flexDirection: 'row', gap: 20, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statTxt: { fontSize: 13, fontWeight: '700', color: '#9CA3AF' },
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
