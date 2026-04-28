import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { useFunding } from '@/contexts/FundingContext';

export default function FundingSupportScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { addParticipation } = useFunding();
  const [quantity, setQuantity] = useState('1');
  const unitPrice = 35000;
  const rawFundingId = Array.isArray(id) ? id[0] : id;
  const fundingId = Number(rawFundingId);

  const amount = useMemo(() => {
    const count = Math.max(1, Number(quantity) || 1);
    return unitPrice * count;
  }, [quantity]);

  const handleSupport = () => {
    if (!Number.isFinite(fundingId)) {
      Alert.alert('알림', '프로젝트 정보를 찾을 수 없습니다.');
      return;
    }
    addParticipation(fundingId, amount);
    Alert.alert('완료', '프로젝트 후원이 완료되었습니다.', [
      { text: '확인', onPress: () => router.replace('/funding' as any) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후원하기</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>수량</Text>
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>병당 단가</Text>
            <Text style={styles.rowValue}>{unitPrice.toLocaleString()}원</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>플랫폼 수수료</Text>
            <Text style={styles.rowValue}>7% 포함 안내</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>총 후원 금액</Text>
            <Text style={styles.totalValue}>{amount.toLocaleString()}원</Text>
          </View>
        </View>

        <Button label="후원 확정하기" onPress={handleSupport} />
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
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', gap: 16 },
  label: { fontSize: 13, fontWeight: '800', color: '#111' },
  input: { height: 52, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, fontSize: 16, fontWeight: '800', color: '#111' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { fontSize: 14, color: '#6B7280', fontWeight: '700' },
  rowValue: { fontSize: 14, color: '#111', fontWeight: '800' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 15, color: '#111', fontWeight: '900' },
  totalValue: { fontSize: 22, color: '#111', fontWeight: '900' },
});
