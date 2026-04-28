import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams();
  const chatCategory = Array.isArray(category) ? category[0] : category;
  const [input, setInput] = useState('');
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

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 챗봇</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
});
