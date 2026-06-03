import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFundingApiSafeMessage } from '@/features/funding/api';
import { clearPendingExternalPayment } from '@/utils/externalFlow';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function TossPaymentFailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ code?: string; message?: string; orderId?: string; fundingId?: string; orderName?: string }>();
  const message = getFundingApiSafeMessage(getParam(params.message), '토스 결제가 완료되지 않았습니다.');
  const code = getParam(params.code);
  const orderId = getParam(params.orderId);
  const fundingId = getParam(params.fundingId);
  const orderName = getParam(params.orderName);

  useEffect(() => {
    void clearPendingExternalPayment();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.iconBox}>
        <AlertCircle size={38} color="#991B1B" />
      </View>
      <Text style={styles.title}>결제가 취소되었습니다</Text>
      <Text style={styles.body}>{message}</Text>
      {(orderName || orderId || code) && (
        <View style={styles.infoBox}>
          {orderName ? <Text style={styles.infoText}>{orderName}</Text> : null}
          {orderId ? <Text style={styles.infoText}>주문번호 {orderId}</Text> : null}
          {code ? <Text style={styles.infoText}>오류코드 {code}</Text> : null}
        </View>
      )}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fundingId) {
              router.replace(`/funding/support?id=${fundingId}` as any);
              return;
            }
            router.back();
          }}
        >
          <Text style={styles.primaryButtonText}>다시 결제하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace(fundingId ? `/funding/${fundingId}` as any : '/funding' as any)}
        >
          <Text style={styles.secondaryButtonText}>펀딩 상세로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  iconBox: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  infoBox: { width: '100%', borderRadius: 14, backgroundColor: '#F9FAFB', padding: 14, gap: 4, marginBottom: 24 },
  infoText: { fontSize: 12, fontWeight: '800', color: '#6B7280', textAlign: 'center' },
  buttonGroup: { width: '100%', gap: 10 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  secondaryButton: { height: 54, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '900', color: '#374151' },
});
