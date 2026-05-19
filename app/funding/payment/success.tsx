import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFunding } from '@/contexts/FundingContext';
import { confirmTossPayment, getFundingApiErrorMessage, getFundingOrderDetail } from '@/features/funding/api';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function TossPaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ paymentKey?: string; orderId?: string; amount?: string }>();
  const { participatedFundings, addParticipation, updateProjectFunding } = useFunding();
  const hasConfirmedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('토스 결제를 승인하고 있습니다.');

  const paymentInfo = useMemo(() => {
    const paymentKey = getParam(params.paymentKey);
    const orderId = getParam(params.orderId);
    const amount = Number(getParam(params.amount));
    return { paymentKey, orderId, amount };
  }, [params.amount, params.orderId, params.paymentKey]);

  useEffect(() => {
    let mounted = true;

    const confirmPayment = async () => {
      if (hasConfirmedRef.current) return;
      hasConfirmedRef.current = true;
      if (!paymentInfo.paymentKey || !paymentInfo.orderId || !Number.isFinite(paymentInfo.amount)) {
        setStatus('error');
        setMessage('토스 결제 승인 정보가 올바르지 않습니다.');
        return;
      }

      try {
        const confirmed = await confirmTossPayment({
          paymentKey: paymentInfo.paymentKey,
          orderId: paymentInfo.orderId,
          amount: paymentInfo.amount,
        });
        const detail = await getFundingOrderDetail(Number(paymentInfo.orderId));
        const paidAmount = confirmed.paidAmount || detail.totalAmount || paymentInfo.amount;
        if (!participatedFundings.some((item) => item.fundingId === detail.fundingId)) {
          addParticipation(detail.fundingId, paidAmount);
          updateProjectFunding(detail.fundingId, paidAmount);
        }
        if (!mounted) return;
        setStatus('success');
        setMessage('결제 승인 및 후원 처리가 완료되었습니다.');
      } catch (error) {
        const errorMessage = getFundingApiErrorMessage(error, '토스 결제 승인 중 문제가 발생했습니다.');
        if (errorMessage.includes('이미 결제 완료')) {
          if (mounted) {
            setStatus('success');
            setMessage('이미 결제가 완료된 후원입니다.');
          }
          return;
        }
        if (!mounted) return;
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    void confirmPayment();

    return () => {
      mounted = false;
    };
  }, [addParticipation, participatedFundings, paymentInfo, updateProjectFunding]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.iconBox, isSuccess && styles.iconBoxSuccess]}>
        {isLoading ? <ActivityIndicator color="#111827" /> : <CheckCircle2 size={36} color={isSuccess ? '#FFFFFF' : '#991B1B'} />}
      </View>
      <Text style={styles.title}>{isLoading ? '결제 승인 중' : isSuccess ? '후원이 완료되었습니다' : '결제 승인 실패'}</Text>
      <Text style={styles.body}>{message}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/mypage/funded' as any)} disabled={isLoading}>
          <Text style={styles.primaryButtonText}>후원 내역 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/funding' as any)} disabled={isLoading}>
          <Text style={styles.secondaryButtonText}>펀딩으로 이동</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  iconBox: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconBoxSuccess: { backgroundColor: '#111827' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 28 },
  buttonGroup: { width: '100%', gap: 10 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  secondaryButton: { height: 54, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '900', color: '#374151' },
});
