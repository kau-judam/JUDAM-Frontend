import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function BreweryProjectCreateScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [unitPrice, setUnitPrice] = useState('35000');
  const [quantity, setQuantity] = useState('100');
  const [description, setDescription] = useState('');

  const total = useMemo(() => (Number(unitPrice) || 0) * (Number(quantity) || 0), [unitPrice, quantity]);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('알림', '프로젝트 정보를 입력해주세요.');
      return;
    }
    Alert.alert('완료', '펀딩 프로젝트가 등록되었습니다.', [
      { text: '확인', onPress: () => router.replace('/brewery/dashboard' as any) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로젝트 등록</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.breweryBox}>
          <Text style={styles.breweryLabel}>양조장 정보</Text>
          <Text style={styles.breweryName}>{user?.breweryName || '양조장 이름'}</Text>
          <Text style={styles.breweryLoc}>{user?.breweryLocation || '양조장 위치'}</Text>
        </View>

        <Field label="프로젝트명" value={title} onChangeText={setTitle} placeholder="봄을 담은 막걸리" />
        <Field label="병당 단가" value={unitPrice} onChangeText={setUnitPrice} placeholder="35000" keyboardType="number-pad" />
        <Field label="제조 수량" value={quantity} onChangeText={setQuantity} placeholder="100" keyboardType="number-pad" />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>목표 금액</Text>
          <Text style={styles.totalValue}>{total.toLocaleString()}원</Text>
          <Text style={styles.feeTxt}>플랫폼 수수료 7% 별도 안내</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>프로젝트 소개</Text>
          <TextInput style={[styles.input, styles.multi]} value={description} onChangeText={setDescription} placeholder="후원자에게 소개할 내용을 입력해주세요." placeholderTextColor="#9CA3AF" multiline />
        </View>

        <Button label="프로젝트 등록하기" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
}

function Field({ label, ...props }: any) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { padding: 20, paddingBottom: 60, gap: 18 },
  breweryBox: { backgroundColor: '#111', borderRadius: 20, padding: 20, gap: 6 },
  breweryLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '800' },
  breweryName: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  breweryLoc: { color: '#D1D5DB', fontSize: 13, fontWeight: '700' },
  group: { gap: 8 },
  label: { fontSize: 13, fontWeight: '800', color: '#111' },
  input: { minHeight: 52, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, fontSize: 14, fontWeight: '700', color: '#111' },
  multi: { minHeight: 140, paddingTop: 16, textAlignVertical: 'top' },
  totalBox: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', gap: 6 },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#111' },
  feeTxt: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
});
