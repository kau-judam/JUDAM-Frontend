import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { ChevronLeft, MessageCircle, Plus, Sparkles, Trash2, UtensilsCrossed, Wine } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import SafeStorage from '@/utils/storage';

type ChatCategory = 'recommend' | 'pairing' | 'general';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

interface ChatRoom {
  id: string;
  category: ChatCategory;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
}

const categories = [
  { id: 'recommend' as ChatCategory, title: '술 추천', icon: Wine },
  { id: 'pairing' as ChatCategory, title: '안주 추천', icon: UtensilsCrossed },
  { id: 'general' as ChatCategory, title: '통합 AI', icon: Sparkles },
];

const CHAT_ROOMS_STORAGE_KEY = 'judam.aiChat.rooms';
const INITIAL_ASSISTANT_MESSAGE = '안녕하세요!';

const getCategoryTitle = (category: ChatCategory) => {
  return categories.find((item) => item.id === category)?.title || 'AI';
};

const makeNewRoom = (category: ChatCategory): ChatRoom => {
  const now = new Date();
  return {
    id: `${category}-${now.getTime()}`,
    category,
    title: `${getCategoryTitle(category)} 대화`,
    lastMessage: INITIAL_ASSISTANT_MESSAGE,
    timestamp: now.toISOString(),
    messages: [{ role: 'assistant', text: INITIAL_ASSISTANT_MESSAGE }],
  };
};

function isValidRoom(room: ChatRoom) {
  return !room.id.startsWith('sample-') && categories.some((category) => category.id === room.category);
}

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('recommend');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  const persistRooms = async (rooms: ChatRoom[]) => {
    await SafeStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  };

  const loadRooms = useCallback(async () => {
    const savedRooms = await SafeStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
    if (!savedRooms) {
      setChatRooms([]);
      return;
    }

    try {
      const parsedRooms = JSON.parse(savedRooms) as ChatRoom[];
      const availableRooms = parsedRooms.filter(isValidRoom);
      setChatRooms(availableRooms);
      if (availableRooms.length !== parsedRooms.length) {
        await persistRooms(availableRooms);
      }
    } catch {
      setChatRooms([]);
      await SafeStorage.removeItem(CHAT_ROOMS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  const createRoom = (category: ChatCategory) => {
    const nextRoom = makeNewRoom(category);
    const nextRooms = [nextRoom, ...chatRooms];
    setChatRooms(nextRooms);
    persistRooms(nextRooms);
    setSelectedCategory(category);
    setIsFloatingMenuOpen(false);
    router.push(`/ai-chat/${nextRoom.category}/${nextRoom.id}` as any);
  };

  const deleteRoom = (roomId: string) => {
    const nextRooms = chatRooms.filter((room) => room.id !== roomId);
    setChatRooms(nextRooms);
    persistRooms(nextRooms);
  };

  const renderDeleteAction = (roomId: string) => (
    <TouchableOpacity style={styles.deleteAction} activeOpacity={0.9} onPress={() => deleteRoom(roomId)}>
      <Trash2 size={19} color="#FFF" />
      <Text style={styles.deleteActionText}>삭제</Text>
    </TouchableOpacity>
  );

  const filteredChatRooms = chatRooms
    .filter((room) => room.category === selectedCategory)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI 챗봇</Text>
            <View style={{ width: 40 }} />
          </View>
        </View>
        <View style={styles.lockedContainer}>
          <MessageCircle size={64} color="#E5E7EB" />
          <Text style={styles.lockedTitle}>로그인이 필요합니다</Text>
          <Text style={styles.lockedDesc}>AI 챗봇은 로그인한 사용자만 이용할 수 있어요.</Text>
          <TouchableOpacity style={styles.lockedButton} onPress={() => router.push('/login' as any)}>
            <Text style={styles.lockedButtonText}>로그인하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 챗봇</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.categoryArea}>
          <View style={styles.categoryBg}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[styles.categoryBtn, selectedCategory === category.id && styles.categoryBtnActive]}
              >
                <category.icon size={14} color={selectedCategory === category.id ? '#FFF' : '#8B5A3C'} />
                <Text style={[styles.categoryTxt, selectedCategory === category.id && styles.categoryTxtActive]}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredChatRooms.length === 0 ? (
          <View style={styles.empty}>
            <MessageCircle size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>아직 대화가 없습니다.</Text>
            <Text style={styles.emptySub}>새로운 질문을 시작해보세요.</Text>
            <TouchableOpacity style={styles.newChatBtn} onPress={() => createRoom(selectedCategory)}>
              <Text style={styles.newChatBtnTxt}>대화 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.chatList}>
            {filteredChatRooms.map((room) => (
              <Swipeable key={room.id} renderRightActions={() => renderDeleteAction(room.id)} overshootRight={false}>
                <TouchableOpacity
                  style={styles.chatItem}
                  onPress={() => router.push(`/ai-chat/${room.category}/${room.id}` as any)}
                  activeOpacity={0.85}
                >
                  <View style={styles.chatRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.chatTitle}>{room.title}</Text>
                        <Text style={styles.chatTime}>{formatTimestamp(room.timestamp)}</Text>
                      </View>
                      <Text style={styles.lastMsg} numberOfLines={1}>
                        {room.lastMessage}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.fabArea, { bottom: insets.bottom + 20 }]}>
        {isFloatingMenuOpen && (
          <Animated.View entering={FadeInUp} exiting={FadeOut} style={styles.floatingMenu}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.menuItem} onPress={() => createRoom(category.id)}>
                <category.icon size={18} color="#8B5A3C" />
                <Text style={styles.menuTxt}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}>
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
  chatItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', backgroundColor: '#FFF' },
  chatRow: { flexDirection: 'row', gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  chatTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111', marginRight: 10 },
  chatTime: { fontSize: 12, color: '#9CA3AF' },
  lastMsg: { fontSize: 14, color: '#6B7280' },
  deleteAction: { width: 88, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', gap: 4 },
  deleteActionText: { fontSize: 13, fontWeight: '900', color: '#FFF' },
  fabArea: { position: 'absolute', right: 20, alignItems: 'flex-end' },
  floatingMenu: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, marginBottom: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, gap: 4, borderWidth: 1, borderColor: '#F3F4F6' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  menuTxt: { fontSize: 14, fontWeight: '600', color: '#111' },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginTop: 18, marginBottom: 8 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  lockedButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
