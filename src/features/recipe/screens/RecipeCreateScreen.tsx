import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ImagePlus, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';

export default function RecipeCreateScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const canSubmit = title.trim() && ingredients.trim() && description.trim();

  const generatedSummary = useMemo(() => {
    if (!ingredients.trim()) return '';
    return `${ingredients.split(',')[0].trim()}의 개성을 살린 전통주 레시피입니다.`;
  }, [ingredients]);

  const handleGenerate = () => {
    if (!ingredients.trim()) {
      Alert.alert('알림', '재료를 먼저 입력해주세요.');
      return;
    }
    setDescription((prev) => prev || generatedSummary);
    setTags(['달콤함', '산미', '부드러움']);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('알림', '필수 항목을 입력해주세요.');
      return;
    }
    Alert.alert('완료', '레시피 제안이 등록되었습니다.', [
      { text: '확인', onPress: () => router.replace('/recipe' as any) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>레시피 제안</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageBox}>
          <ImagePlus size={32} color="#9CA3AF" />
          <Text style={styles.imageTxt}>이미지 업로드 또는 AI 컨셉 이미지</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>레시피 이름</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="예: 장미향 막걸리" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>재료</Text>
          <TextInput style={[styles.input, styles.multi]} value={ingredients} onChangeText={setIngredients} placeholder="쌀, 누룩, 장미꽃잎" placeholderTextColor="#9CA3AF" multiline />
        </View>

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Sparkles size={16} color="#FFF" />
          <Text style={styles.generateTxt}>AI 가이드 생성</Text>
        </TouchableOpacity>

        <View style={styles.group}>
          <Text style={styles.label}>요약</Text>
          <TextInput style={[styles.input, styles.multi]} value={description} onChangeText={setDescription} placeholder="레시피의 특징을 적어주세요." placeholderTextColor="#9CA3AF" multiline />
        </View>

        {tags.length > 0 && (
          <View style={styles.tagWrap}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagTxt}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Button label="제안 등록하기" onPress={handleSubmit} style={styles.submitBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { padding: 20, paddingBottom: 60, gap: 18 },
  imageBox: { height: 180, borderRadius: 20, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', gap: 10 },
  imageTxt: { fontSize: 13, fontWeight: '700', color: '#9CA3AF' },
  group: { gap: 8 },
  label: { fontSize: 13, fontWeight: '800', color: '#111' },
  input: { minHeight: 52, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: '#111' },
  multi: { minHeight: 110, paddingTop: 16, textAlignVertical: 'top' },
  generateBtn: { height: 48, borderRadius: 16, backgroundColor: '#111', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  generateTxt: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: '#F3F4F6' },
  tagTxt: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  submitBtn: { marginTop: 8 },
});
