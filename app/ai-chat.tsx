import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  ChevronLeft, 
  Wine, 
  UtensilsCrossed, 
  Factory, 
  Sparkles, 
  Plus, 
  MessageCircle 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ChatCategory = "recommend" | "pairing" | "brewery" | "general";

interface ChatRoom {
  id: string;
  category: ChatCategory;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: any[];
}

const categories = [
  { id: "recommend" as ChatCategory, title: "술 추천", icon: Wine },
  { id: "pairing" as ChatCategory, title: "안주 추천", icon: UtensilsCrossed },
  { id: "brewery" as ChatCategory, title: "양조장 요청", icon: Factory },
  { id: "general" as ChatCategory, title: "통합 AI", icon: Sparkles },
];

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>("recommend");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "sample-1",
      category: "recommend",
      title: "달콤한 막걸리 추천해줘",
      lastMessage: "말씀하신 취향에 따르면 '벚꽃 막걸리'를 추천드려요. 은은한 꽃향과 부드러운 단맛이 특징이에요.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      messages: [],
    },
    {
      id: "sample-3",
      category: "pairing",
      title: "막걸리랑 어울리는 안주 추천",
      lastMessage: "막걸리와는 파전이나 김치전이 정말 잘 어울려요. 특히 비오는 날에는 환상의 조합이죠!",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      messages: [],
    }
  ]);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const filteredChatRooms = chatRooms
    .filter((room) => room.category === selectedCategory)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "어제";
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 챗봇</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Category Toggle */}
        <View style={styles.categoryArea}>
          <View style={styles.categoryBg}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[styles.categoryBtn, selectedCategory === category.id && styles.categoryBtnActive]}
              >
                <category.icon size={14} color={selectedCategory === category.id ? "#FFF" : "#8B5A3C"} />
                <Text style={[styles.categoryTxt, selectedCategory === category.id && styles.categoryTxtActive]}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Chat List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredChatRooms.length === 0 ? (
          <View style={styles.empty}>
            <MessageCircle size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>아직 대화가 없습니다.</Text>
            <Text style={styles.emptySub}>새로운 질문을 시작해보세요.</Text>
            <TouchableOpacity style={styles.newChatBtn} onPress={() => setIsFloatingMenuOpen(true)}>
               <Text style={styles.newChatBtnTxt}>새 대화 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.chatList}>
            {filteredChatRooms.map((room) => (
              <TouchableOpacity 
                key={room.id} 
                style={styles.chatItem}
                onPress={() => router.push(`/ai-chat/${room.category}/${room.id}` as any)}
              >
                 <View style={styles.chatRow}>
                    <View style={{ flex: 1 }}>
                       <View style={styles.rowBetween}>
                          <Text style={styles.chatTitle}>{room.title}</Text>
                          <Text style={styles.chatTime}>{formatTimestamp(room.timestamp)}</Text>
                       </View>
                       <Text style={styles.lastMsg} numberOfLines={1}>{room.lastMessage}</Text>
                    </View>
                 </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <View style={[styles.fabArea, { bottom: insets.bottom + 20 }]}>
         {isFloatingMenuOpen && (
           <Animated.View entering={FadeInUp} exiting={FadeOut} style={styles.floatingMenu}>
              {categories.map((c, i) => (
                <TouchableOpacity 
                  key={c.id} 
                  style={styles.menuItem} 
                  onPress={() => {
                    setSelectedCategory(c.id);
                    setIsFloatingMenuOpen(false);
                  }}
                >
                   <c.icon size={18} color="#8B5A3C" />
                   <Text style={styles.menuTxt}>{c.title}</Text>
                </TouchableOpacity>
              ))}
           </Animated.View>
         )}
         <TouchableOpacity 
           style={styles.fab} 
           activeOpacity={0.8}
           onPress={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
         >
            <Animated.View style={{ transform: [{ rotate: isFloatingMenuOpen ? '45deg' : '0deg' }] }}>
               <Plus size={28} color="#FFF" />
            </Animated.View>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTop: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, marginLeft: -10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  categoryArea: { paddingHorizontal: 16, paddingBottom: 12, marginBottom: 12 },
  categoryBg: { flexDirection: 'row', backgroundColor: '#F5F1ED', borderRadius: 9999, padding: 4, gap: 4 },
  categoryBtn: { flex: 1, height: 36, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  categoryBtnActive: { backgroundColor: '#2B1810', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  categoryTxt: { fontSize: 11, fontWeight: '600', color: '#8B5A3C' },
  categoryTxtActive: { color: '#FFF' },
  listContent: { flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, paddingTop: 100 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#9CA3AF', marginTop: 4, marginBottom: 24 },
  newChatBtn: { backgroundColor: '#000', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 9999 },
  newChatBtnTxt: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  chatList: { borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  chatItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  chatRow: { flexDirection: 'row', gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  chatTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  chatTime: { fontSize: 12, color: '#9CA3AF' },
  lastMsg: { fontSize: 14, color: '#6B7280' },
  fabArea: { position: 'absolute', right: 20, alignItems: 'flex-end' },
  floatingMenu: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, marginBottom: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, gap: 4, borderWidth: 1, borderColor: '#F3F4F6' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  menuTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
});
