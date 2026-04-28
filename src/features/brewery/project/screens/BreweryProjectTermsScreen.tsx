import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';

export default function BreweryProjectTermsScreen() {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);

  const handleNext = () => {
    if (!checked) {
      Alert.alert('알림', '프로젝트 등록 약관에 동의해주세요.');
      return;
    }
    router.push('/brewery/project/create' as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로젝트 약관</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>펀딩 프로젝트 등록 안내</Text>
          <Text style={styles.body}>등록한 프로젝트는 주담 운영 정책에 따라 검토될 수 있으며, 목표 금액과 리워드 정보는 후원자에게 명확히 고지되어야 합니다.</Text>
          <Text style={styles.body}>플랫폼 수수료는 7%이며, 제조 일정과 배송 일정 변경 시 후원자에게 안내가 필요합니다.</Text>
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => setChecked(!checked)}>
          <View style={[styles.checkBox, checked && styles.checkBoxActive]}>
            {checked && <Check size={16} color="#FFF" />}
          </View>
          <Text style={styles.checkTxt}>프로젝트 등록 약관에 동의합니다.</Text>
        </TouchableOpacity>

        <Button label="프로젝트 정보 입력" onPress={handleNext} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { padding: 20, gap: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', gap: 14 },
  title: { fontSize: 20, fontWeight: '900', color: '#111' },
  body: { fontSize: 14, lineHeight: 22, color: '#4B5563', fontWeight: '600' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  checkBox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkBoxActive: { backgroundColor: '#111', borderColor: '#111' },
  checkTxt: { flex: 1, fontSize: 14, fontWeight: '800', color: '#111' },
});
