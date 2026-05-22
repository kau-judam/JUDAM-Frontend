import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical, Send, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { sendAIChatMessage, type AIChatHistoryItem } from '@/features/ai-chat/api';
import SafeStorage from '@/utils/storage';

type ChatCategory = 'recommend' | 'pairing' | 'general';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

type ChatRoom = {
  id: string;
  category: ChatCategory;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
};

const CHAT_ROOMS_STORAGE_KEY = 'judam.aiChat.rooms';
const INITIAL_ASSISTANT_MESSAGE = '안녕하세요!';

const CATEGORY_LABELS: Record<string, string> = {
  recommend: '술 추천',
  pairing: '안주 추천',
  general: '통합 AI',
};

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  text: INITIAL_ASSISTANT_MESSAGE,
};

function normalizeMessages(messages: ChatMessage[]) {
  if (messages.length === 0) return [INITIAL_MESSAGE];
  const [firstMessage, ...restMessages] = messages;
  if (firstMessage.role !== 'assistant') return [INITIAL_MESSAGE, ...messages];
  return [{ ...firstMessage, text: INITIAL_ASSISTANT_MESSAGE }, ...restMessages];
}

function toHistory(messages: ChatMessage[]): AIChatHistoryItem[] {
  return messages
    .filter((message) => message.text.trim())
    .map((message) => ({ role: message.role, content: message.text }));
}

function makeRoomTitle(message: string) {
  const trimmed = message.trim();
  if (trimmed.length <= 22) return trimmed;
  return `${trimmed.slice(0, 22)}...`;
}

export default function AIChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const { category, roomId } = useLocalSearchParams();
  const chatCategory = Array.isArray(category) ? category[0] : category;
  const chatRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
  const [input, setInput] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const categoryLabel = useMemo(() => CATEGORY_LABELS[chatCategory || ''] || 'AI 챗봇', [chatCategory]);

  const persistMessages = useCallback(async (nextMessages: ChatMessage[]) => {
    if (!chatRoomId) return;
    const savedRooms = await SafeStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
    if (!savedRooms) return;

    try {
      const parsedRooms = JSON.parse(savedRooms) as ChatRoom[];
      const now = new Date().toISOString();
      const nextRooms = parsedRooms.map((room) => {
        if (room.id !== chatRoomId) return room;
        const firstUserMessage = nextMessages.find((message) => message.role === 'user')?.text;
        const lastMessage = nextMessages[nextMessages.length - 1]?.text || INITIAL_ASSISTANT_MESSAGE;
        return {
          ...room,
          title: firstUserMessage ? makeRoomTitle(firstUserMessage) : room.title,
          lastMessage,
          timestamp: now,
          messages: nextMessages,
        };
      });
      await SafeStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(nextRooms));
    } catch {
      await SafeStorage.removeItem(CHAT_ROOMS_STORAGE_KEY);
    }
  }, [chatRoomId]);

  useEffect(() => {
    let mounted = true;

    const loadRoom = async () => {
      if (!chatRoomId) return;
      const savedRooms = await SafeStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
      if (!savedRooms || !mounted) return;

      try {
        const parsedRooms = JSON.parse(savedRooms) as ChatRoom[];
        const currentRoom = parsedRooms.find((room) => room.id === chatRoomId);
        if (currentRoom) {
          const nextMessages = normalizeMessages(currentRoom.messages || []);
          setMessages(nextMessages);
          if (JSON.stringify(nextMessages) !== JSON.stringify(currentRoom.messages || [])) {
            await persistMessages(nextMessages);
          }
        }
      } catch {
        await SafeStorage.removeItem(CHAT_ROOMS_STORAGE_KEY);
      }
    };

    loadRoom();
    return () => {
      mounted = false;
    };
  }, [chatRoomId, persistMessages]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length, isSending, suggestedQuestions.length]);

  const send = async (overrideMessage?: string) => {
    const nextInput = (overrideMessage || input).trim();
    if (!nextInput || isSending) return;

    const previousMessages = messages;
    const userMessage: ChatMessage = { role: 'user', text: nextInput };
    const pendingMessages = [...previousMessages, userMessage];
    setMessages(pendingMessages);
    setInput('');
    setSuggestedQuestions([]);
    setIsSending(true);

    try {
      const data = await sendAIChatMessage({
        message: nextInput,
        userId: user?.id,
        history: toHistory(previousMessages),
      });
      const nextMessages = [...pendingMessages, { role: 'assistant' as const, text: data.response }];
      setMessages(nextMessages);
      setSuggestedQuestions(data.suggested_questions || []);
      await persistMessages(nextMessages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI 챗봇 요청 중 오류가 발생했습니다.';
      const nextMessages = [...pendingMessages, { role: 'assistant' as const, text: errorMessage }];
      setMessages(nextMessages);
      await persistMessages(nextMessages);
    } finally {
      setIsSending(false);
    }
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => setMenuVisible(false)}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.category}>{categoryLabel}</Text>
        {messages.map((message, index) => (
          <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={[styles.bubbleTxt, message.role === 'user' && styles.userTxt]}>{message.text}</Text>
          </View>
        ))}
        {isSending && (
          <View style={[styles.bubble, styles.assistantBubble]}>
            <Text style={styles.bubbleTxt}>답변을 준비하고 있어요...</Text>
          </View>
        )}
        {suggestedQuestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestedQuestions.map((question) => (
              <TouchableOpacity key={question} style={styles.suggestionChip} onPress={() => send(question)} disabled={isSending}>
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지 입력"
          placeholderTextColor="#9CA3AF"
          editable={!isSending}
          onSubmitEditing={() => send()}
          returnKeyType="send"
        />
        <TouchableOpacity style={[styles.sendBtn, isSending && styles.sendBtnDisabled]} onPress={() => send()} disabled={isSending}>
          <Send size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', minHeight: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
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
  scroll: { flex: 1 },
  content: { flexGrow: 1, padding: 20, gap: 12 },
  category: { alignSelf: 'center', fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginBottom: 8 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#111' },
  bubbleTxt: { fontSize: 14, fontWeight: '600', color: '#111', lineHeight: 20 },
  userTxt: { color: '#FFF' },
  suggestions: { gap: 8, marginTop: 4 },
  suggestionChip: { alignSelf: 'flex-start', borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#FFF' },
  suggestionText: { fontSize: 13, fontWeight: '700', color: '#111' },
  inputBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFF' },
  input: { flex: 1, height: 46, borderRadius: 23, backgroundColor: '#F3F4F6', paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: '#111' },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  lockedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  lockedTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 8 },
  lockedDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  lockedButton: { width: '100%', height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  lockedButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
