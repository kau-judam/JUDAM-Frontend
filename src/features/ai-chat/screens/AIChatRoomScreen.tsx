import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical, Send, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import SafeStorage from '@/utils/storage';

const CHAT_ROOMS_STORAGE_KEY = 'judam.aiChat.rooms';

export default function AIChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { category, roomId } = useLocalSearchParams();
  const chatCategory = Array.isArray(category) ? category[0] : category;
  const chatRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
  const [input, setInput] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '어떤 전통주 이야기를 나눠볼까요?' },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: input.trim() },
      { role: 'assistant', text: '현재는 화면 연결용 응답입니다. 추천 로직은 이후 AI 서버와 연동됩니다.' },
    ]);
    setInput('');
  };

  const deleteRoom = async () => {
    if (chatRoomId) {
      const savedRooms = await SafeStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
      if (savedRooms) {
        try {
          const parsedRooms = JSON.parse(savedRooms) as { id: string }[];
          const nextRooms = parsedRooms.filter((room) => room.id !== chatRoomId);
          await SafeStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(nextRooms));
        } catch {
          await SafeStorage.removeItem(CHAT_ROOMS_STORAGE_KEY);
        }
      }
    }

    setMenuVisible(false);
    router.replace('/ai-chat' as any);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI 챗봇</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedTitle}>로그인이 필요합니다</Text>
          <Text style={styles.lockedDesc}>AI 챗봇 대화는 로그인한 사용자만 이용할 수 있어요.</Text>
          <TouchableOpacity style={styles.lockedButton} onPress={() => router.push('/login' as any)}>
            <Text style={styles.lockedButtonText}>로그인하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗봇</Text>
        <View style={styles.menuWrap}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible((prev) => !prev)} activeOpacity={0.85}>
            <MoreVertical size={22} color="#111" />
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.menuBox}>
              <TouchableOpacity style={styles.menuItem} onPress={deleteRoom}>
                <Trash2 size={15} color="#EF4444" />
                <Text style={styles.deleteMenuText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} onScrollBeginDrag={() => setMenuVisible(false)}>
        <Text style={styles.category}>{chatCategory || 'general'}</Text>
        {messages.map((message, index) => (
          <View key={index} style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={[styles.bubbleTxt, message.role === 'user' && styles.userTxt]}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
          <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="메시지 입력" placeholderTextColor="#9CA3AF" />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Send size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  menuWrap: { position: 'relative' },
  menuBox: {
    position: 'absolute',
    top: 42,
    right: 4,
    minWidth: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    zIndex: 30,
  },
  menuItem: { minHeight: 46, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteMenuText: { fontSize: 14, fontWeight: '800', color: '#EF4444' },
  content: { padding: 20, gap: 12 },
  category: { alignSelf: 'center', fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginBottom: 8 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#111' },
  bubbleTxt: { fontSize: 14, fontWeight: '600', color: '#111', lineHeight: 20 },
  userTxt: { color: '#FFF' },
  inputBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
  input: { flex: 1, height: 46, borderRadius: 23, backgroundColor: '#F3F4F6', paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: '#111' },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 8 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  lockedButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
