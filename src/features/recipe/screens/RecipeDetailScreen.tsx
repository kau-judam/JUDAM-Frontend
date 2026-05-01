import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ChevronLeft, 
  Heart, 
  User, 
  Sparkles, 
  Rocket, 
  ChevronDown, 
  Send,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { getImageSource, recipesData } from '@/constants/data';

const INITIAL_COMMENT_COUNT = 3;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const rawRecipeId = Array.isArray(id) ? id[0] : id;
  const recipeId = Number(rawRecipeId);
  const selectedRecipe = recipesData.find((item) => item.id === recipeId) || recipesData[0];
  
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(Boolean(selectedRecipe.liked));
  const [likesCount, setLikesCount] = useState(selectedRecipe.likes);

  const [recipe] = useState({
    id: selectedRecipe.id,
    title: selectedRecipe.title,
    author: selectedRecipe.author,
    alcoholRange: "6%~8%",
    description: selectedRecipe.description,
    mainIngredients: selectedRecipe.ingredients?.slice(0, 3) || ["국내산 찹쌀", "전통 누룩", "천연 효모"],
    subIngredients: ["생수", "황설탕"],
    flavorTags: ["달콤함", "부드러움", "탄산감"],
    commentsCount: selectedRecipe.comments,
    timestamp: selectedRecipe.timestamp,
    image: selectedRecipe.image,
  });

  const [comments, setComments] = useState([
    { id: 1, author: "막걸리마스터", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", content: "이 레시피 너무 좋아요! 저도 한번 도전해볼게요 🍶", timestamp: "1시간 전", likes: 5, liked: false, authorType: "user" },
    { id: 2, author: "술샘양조장", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", content: "좋은 레시피네요. 전통 누룩 선택이 특히 마음에 듭니다. 저희 양조장에서도 검토해보겠습니다!", timestamp: "30분 전", likes: 12, liked: true, authorType: "brewery" },
    { id: 3, author: "전통주초보", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", content: "처음 도전해보려는데, 누룩은 어디서 구하면 좋을까요?", timestamp: "20분 전", likes: 2, liked: false, authorType: "user" },
    { id: 4, author: "발효연구가", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", content: "탄산감을 높이려면 발효 온도를 조금 낮게 유지해보세요. 18도 정도가 적당합니다!", timestamp: "15분 전", likes: 7, liked: false, authorType: "user" },
    { id: 5, author: "청주러버", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", content: "황설탕 대신 꿀을 써보셨나요? 향이 더 좋아진다는 이야기를 들었는데요.", timestamp: "10분 전", likes: 3, liked: false, authorType: "user" },
    { id: 6, author: "한산양조장", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", content: "훌륭한 레시피입니다. 감귤을 추가하면 더욱 상큼한 맛이 날 것 같네요! 저희도 비슷한 시도를 해본 적 있어요.", timestamp: "5분 전", likes: 9, liked: false, authorType: "brewery" },
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleCommentLike = (cid: number) => {
    setComments(comments.map(c => c.id === cid ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c));
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: comments.length + 1,
      author: user?.name || "익명",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      content: commentInput,
      timestamp: "방금 전",
      likes: 0,
      liked: false,
      authorType: user?.type || "user" as any,
    };
    setComments([...comments, newComment]);
    setCommentInput("");
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#111" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>레시피 상세</Text>
         <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Banner Image */}
        <View style={styles.imageBox}>
          <Image source={getImageSource(recipe.image)!} style={styles.mainImg} />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
           {/* Author & Like */}
           <View style={styles.authorRow}>
              <View style={styles.authorInfo}>
                 <View style={styles.avatar}><User size={20} color="#9CA3AF" /></View>
                 <View>
                    <Text style={styles.authorName}>{recipe.author}</Text>
                    <Text style={styles.timeTxt}>{recipe.timestamp}</Text>
                 </View>
              </View>
              <TouchableOpacity style={[styles.likeBtn, liked && styles.likeBtnActive]} onPress={handleLike}>
                 <Heart size={16} color={liked ? "#FFF" : "#4B5563"} fill={liked ? "#FFF" : "transparent"} />
                 <Text style={[styles.likeTxt, liked && { color: '#FFF' }]}>{likesCount}</Text>
              </TouchableOpacity>
           </View>

           {/* Title & Tags */}
           <Text style={styles.title}>{recipe.title}</Text>
           <View style={styles.tagWrap}>
              {recipe.flavorTags.map((tag, i) => (
                <View key={i} style={styles.tag}><Text style={styles.tagTxt}>#{tag}</Text></View>
              ))}
              <View style={styles.alcoholTag}><Text style={styles.alcoholTxt}>{recipe.alcoholRange}</Text></View>
           </View>

           {/* Description */}
           <View style={styles.section}>
              <Text style={styles.sectionTitle}>프로젝트 요약</Text>
              <Text style={styles.bodyText}>{recipe.description}</Text>
           </View>

           {/* Ingredients */}
           <View style={styles.section}>
              <View style={styles.row}>
                 <Sparkles size={16} color="#9CA3AF" />
                 <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>메인 재료</Text>
              </View>
              <View style={styles.ingredientWrap}>
                 {recipe.mainIngredients.map((ing, i) => (
                   <View key={i} style={styles.ingBadge}><Text style={styles.ingTxt}>{ing}</Text></View>
                 ))}
              </View>
           </View>

           {recipe.subIngredients.length > 0 && (
             <View style={styles.section}>
                <Text style={styles.sectionTitle}>서브 재료</Text>
                <View style={styles.ingredientWrap}>
                   {recipe.subIngredients.map((ing, i) => (
                     <View key={i} style={[styles.ingBadge, styles.subIngBadge]}><Text style={styles.subIngTxt}>{ing}</Text></View>
                   ))}
                </View>
             </View>
           )}

           {/* Propose Action */}
           <TouchableOpacity style={styles.proposeBtn} onPress={() => router.push('/brewery/project/create' as any)}>
              <LinearGradient colors={['#111', '#333']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.proposeInner}>
                 <Rocket size={20} color="#FFF" />
                 <Text style={styles.proposeTxt}>이 레시피로 펀딩 제안하기</Text>
              </LinearGradient>
           </TouchableOpacity>
           <Text style={styles.proposeDesc}>이 레시피를 기반으로 크라우드펀딩 프로젝트를 시작할 수 있습니다</Text>
        </View>

        {/* Comments Section */}
        <View style={styles.commentSection}>
           <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
           {visibleComments.map((c, idx) => (
             <Animated.View key={c.id} entering={FadeInUp.delay(idx * 50)} style={styles.commentItem}>
                <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                   <View style={styles.commentBubble}>
                      <View style={styles.commentUserRow}>
                         <Text style={styles.commentAuthor}>{c.author}</Text>
                         {c.authorType === 'brewery' && <View style={styles.breweryBadge}><Text style={styles.breweryBadgeTxt}>양조장</Text></View>}
                      </View>
                      <Text style={styles.commentContent}>{c.content}</Text>
                   </View>
                   <View style={styles.commentFooter}>
                      <Text style={styles.commentTime}>{c.timestamp}</Text>
                      <TouchableOpacity onPress={() => handleCommentLike(c.id)}>
                         <Text style={[styles.actionTxt, c.liked && { color: '#111', fontWeight: '800' }]}>좋아요 {c.likes > 0 && c.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity><Text style={styles.actionTxt}>답글</Text></TouchableOpacity>
                   </View>
                </View>
             </Animated.View>
           ))}
           
           {!showAllComments && comments.length > INITIAL_COMMENT_COUNT && (
             <TouchableOpacity style={styles.moreBtn} onPress={() => setShowAllComments(true)}>
                <ChevronDown size={16} color="#6B7280" />
                <Text style={styles.moreBtnTxt}>댓글 {comments.length - INITIAL_COMMENT_COUNT}개 더보기</Text>
             </TouchableOpacity>
           )}
        </View>
      </ScrollView>

      {/* Footer Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.footer}>
         <View style={[styles.footerInner, { paddingBottom: insets.bottom + 10 }]}>
            {user ? (
               <View style={styles.inputBox}>
                  <TextInput 
                    style={styles.input}
                    placeholder="댓글을 입력하세요..."
                    placeholderTextColor="#9CA3AF"
                    value={commentInput}
                    onChangeText={setCommentInput}
                  />
                  <TouchableOpacity style={[styles.sendBtn, !commentInput.trim() && { opacity: 0.3 }]} onPress={handleCommentSubmit}>
                     <Send size={18} color="#FFF" />
                  </TouchableOpacity>
               </View>
            ) : (
               <TouchableOpacity style={styles.loginReqBtn} onPress={() => router.push('/login' as any)}>
                  <Text style={styles.loginReqTxt}>로그인하고 댓글 작성하기</Text>
               </TouchableOpacity>
            )}
         </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  imageBox: { width: '100%', height: 300, backgroundColor: '#F9FAFB' },
  mainImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { padding: 24 },
  authorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  authorName: { fontSize: 14, fontWeight: '800', color: '#111' },
  timeTxt: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  likeBtnActive: { backgroundColor: '#111', borderColor: '#111' },
  likeTxt: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  title: { fontSize: 24, fontWeight: '900', color: '#111', lineHeight: 32, marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 20 },
  tagTxt: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  alcoholTag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111', borderRadius: 20 },
  alcoholTxt: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 12 },
  bodyText: { fontSize: 15, lineHeight: 24, color: '#4B5563', fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  ingredientWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ingBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  ingTxt: { fontSize: 13, fontWeight: '700', color: '#111' },
  subIngBadge: { backgroundColor: '#FFF' },
  subIngTxt: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  proposeBtn: { height: 60, borderRadius: 16, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  proposeInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  proposeTxt: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  proposeDesc: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 12, fontWeight: '500' },
  commentSection: { borderTopWidth: 8, borderTopColor: '#F9FAFB', padding: 24 },
  commentHeader: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 24 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentBubble: { flex: 1, backgroundColor: '#F9FAFB', padding: 16, borderRadius: 20, borderTopLeftRadius: 4 },
  commentUserRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#111' },
  breweryBadge: { backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  breweryBadgeTxt: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  commentContent: { fontSize: 14, color: '#374151', lineHeight: 20, fontWeight: '500' },
  commentFooter: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8, paddingHorizontal: 4 },
  commentTime: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  actionTxt: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  moreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#F9FAFB', borderRadius: 16, marginTop: 10 },
  moreBtnTxt: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerInner: { paddingHorizontal: 20, paddingTop: 12 },
  inputBox: { height: 52, backgroundColor: '#F9FAFB', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1, borderColor: '#F3F4F6' },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  loginReqBtn: { height: 52, backgroundColor: '#F3F4F6', borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  loginReqTxt: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
});
