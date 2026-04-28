import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';

export default function CommunityCreateScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addPost } = useCommunity();
  const [category, setCategory] = useState<'자유게시판' | '정보게시판'>('자유게시판');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }
    addPost({
      id: Date.now(),
      author: user?.name || '익명',
      authorType: user?.type || 'user',
      avatar: '👤',
      content: content.trim(),
      likes: 0,
      comments: 0,
      timestamp: '방금 전',
      liked: false,
      tags: [category],
    });
    Alert.alert('완료', '게시글이 등록되었습니다.', [
      { text: '확인', onPress: () => router.replace('/community' as any) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 작성</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segment}>
          {(['자유게시판', '정보게시판'] as const).map((item) => (
            <TouchableOpacity key={item} style={[styles.segmentBtn, category === item && styles.segmentBtnActive]} onPress={() => setCategory(item)}>
              <Text style={[styles.segmentTxt, category === item && styles.segmentTxtActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.textarea}
          value={content}
          onChangeText={setContent}
          placeholder="전통주 이야기나 정보를 공유해주세요."
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <Button label="등록하기" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { padding: 20, gap: 20 },
  segment: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 18, padding: 4 },
  segmentBtn: { flex: 1, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  segmentBtnActive: { backgroundColor: '#111' },
  segmentTxt: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  segmentTxtActive: { color: '#FFF' },
  textarea: { minHeight: 260, borderRadius: 20, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 18, fontSize: 15, fontWeight: '600', color: '#111', textAlignVertical: 'top' },
});
