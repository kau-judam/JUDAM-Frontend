import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Sparkles, 
  Search, 
  X, 
  ChevronDown, 
  Check, 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { RecipeCard } from '@/components/recipe-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const initialRecipes = [
  { id: 1, title: "전통 누룩의 재발견 - 현대적 막걸리", author: "전통주러버", description: "전통 누룩과 국내산 쌀을 사용한 현대적인 막걸리 레시피입니다. 부드러운 단맛과 은은한 탄산이 특징이에요.", likes: 89, comments: 23, timestamp: "2시간 전", liked: false, image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=800" },
  { id: 2, title: "장미향 가득한 봄날의 약주", author: "꽃술연구가", description: "유기농 장미꽃잎으로 만든 은은한 향의 약주입니다. 여성분들에게 특히 인기가 많아요!", likes: 142, comments: 37, timestamp: "5시간 전", liked: true, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800" },
  { id: 3, title: "제주 감귤 막걸리", author: "감귤러버", description: "제주산 무농약 감귤을 듬뿍 넣은 상큼한 막걸리. 새콤달콤한 맛이 일품입니다.", likes: 67, comments: 18, timestamp: "1일 전", liked: false, image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?w=800" },
  { id: 4, title: "한약재 약주 - 건강한 술", author: "약주마스터", description: "당귀, 황기 등 한약재를 넣어 몸에 좋은 약주를 만들어봤어요. 은은한 한약 향이 매력적입니다.", likes: 54, comments: 12, timestamp: "2일 전", liked: false },
  { id: 5, title: "사과 막걸리 레시피", author: "전통주연구소", description: "청송 사과를 사용한 프리미엄 막걸리. 지역 특산물로 만든 건강한 술입니다.", likes: 156, comments: 42, timestamp: "3시간 전", liked: true, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800" },
  { id: 6, title: "전통 방식 쌀 소주", author: "전통주애호가", description: "전통 증류 방식으로 만든 순한 쌀소주. 깊은 맛과 향이 일품입니다.", likes: 203, comments: 51, timestamp: "5시간 전", liked: false, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800" },
  { id: 7, title: "프리미엄 복분자주", author: "발효연구가", description: "정읍 복분자 100%로 만든 프리미엄 과실주. 진한 복분자 향과 달콤한 맛이 특징입니다.", likes: 187, comments: 39, timestamp: "1일 전", liked: false, image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800" },
];

export default function RecipeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"인기순" | "최신순" | "내 추천순">("인기순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [recipes, setRecipes] = useState(initialRecipes);

  const handleRecipeLike = (recipeId: number) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const filteredRecipes = recipes.filter(r => {
    const query = searchQuery.toLowerCase();
    return !query || r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query) || r.author.toLowerCase().includes(query);
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOption === "인기순") return b.likes - a.likes;
    if (sortOption === "최신순") return b.id - a.id;
    return b.likes - a.likes;
  });

  return (
    <View style={styles.container}>
      <PageHeader title="주담" />
      <View style={styles.searchSection}>
         <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput 
              style={styles.searchInput}
              placeholder="레시피, 재료, 작성자로 검색..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                 <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         <View style={styles.actionRow}>
            {user ? (
              <TouchableOpacity style={styles.proposeBtn} onPress={() => router.push('/recipe/create' as any)}>
                 <Sparkles size={16} color="#FFF" />
                 <Text style={styles.proposeBtnTxt}>레시피 제안하기</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginReqBtn} onPress={() => router.push('/login' as any)}>
                 <Text style={styles.loginReqBtnTxt}>로그인하고 제안하기</Text>
              </TouchableOpacity>
            )}

            <View style={styles.sortContainer}>
               <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortDropdown(!showSortDropdown)}>
                  <Text style={styles.sortBtnTxt}>{sortOption}</Text>
                  <ChevronDown size={14} color="#6B7280" />
               </TouchableOpacity>
               {showSortDropdown && (
                 <View style={styles.sortDropdown}>
                    {(["인기순", "최신순", "내 추천순"] as const).map(opt => (
                      <TouchableOpacity key={opt} style={styles.dropItem} onPress={() => { setSortOption(opt); setShowSortDropdown(false); }}>
                         <Text style={[styles.dropTxt, sortOption === opt && { fontWeight: '800' }]}>{opt}</Text>
                         {sortOption === opt && <Check size={14} color="#111" />}
                      </TouchableOpacity>
                    ))}
                 </View>
               )}
            </View>
         </View>

         <View style={styles.recipeList}>
            {sortedRecipes.map((item, index) => (
              <RecipeCard 
                key={item.id} 
                recipe={item} 
                index={index}
                onLike={handleRecipeLike}
                showLikeButton={true}
              />
            ))}
            {sortedRecipes.length === 0 && (
              <View style={styles.emptyState}>
                 <Text style={styles.emptyTxt}>검색 결과가 없습니다.</Text>
              </View>
            )}
         </View>
         <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  searchSection: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchBar: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#111' },
  scrollContent: { padding: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, zIndex: 100 },
  proposeBtn: { flex: 1, height: 44, backgroundColor: '#111', borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  proposeBtnTxt: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  loginReqBtn: { flex: 1, height: 44, backgroundColor: '#F3F4F6', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  loginReqBtnTxt: { color: '#6B7280', fontSize: 13, fontWeight: '700' },
  sortContainer: { position: 'relative' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  sortBtnTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  sortDropdown: { position: 'absolute', top: 40, right: 0, backgroundColor: '#FFF', borderRadius: 16, width: 140, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  dropTxt: { fontSize: 13, color: '#374151' },
  recipeList: { gap: 16 },
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyTxt: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
});
