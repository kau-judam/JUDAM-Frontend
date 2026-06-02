import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFunding } from '@/contexts/FundingContext';
import type { FundingProject } from '@/constants/data';
import { confirmTossPayment, getFundingApiErrorMessage, getFundingDetail, getFundingOrderDetail, type FundingDetailResponse } from '@/features/funding/api';
import { mapFundingStatus, mergeFundingDetail } from '@/features/funding/apiMappers';
import { clearPendingExternalPayment } from '@/utils/externalFlow';

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getFiniteAmount(value: string | undefined) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

function withPaymentTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

function isPaidConfirmResponse(response: Awaited<ReturnType<typeof confirmTossPayment>>) {
  const paymentStatus = String(response.paymentStatus || '').trim().toUpperCase();
  const message = String(response.message || '');
  return paymentStatus === 'PAID' || (response.status === 200 && /완료|성공|승인/.test(message));
}

function createFundingProjectFromPaymentDetail(detail: FundingDetailResponse): FundingProject {
  return mergeFundingDetail(
    {
      id: detail.fundingId,
      title: detail.title || '',
      brewery: detail.breweryName || '',
      location: '',
      category: detail.category || '',
      image: '',
      goalAmount: detail.targetAmount || 1,
      currentAmount: detail.currentAmount || 0,
      backers: detail.supporterCount || 0,
      daysLeft: 0,
      status: mapFundingStatus(detail.status, detail.currentAmount, detail.targetAmount),
      endDate: detail.endDate,
      journals: [],
    },
    detail
  );
}

export default function TossPaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    paymentKey?: string;
    orderId?: string;
    numericOrderId?: string;
    amount?: string;
    expectedAmount?: string;
    fundingId?: string;
    orderName?: string;
  }>();
  const { projects, participatedFundings, addParticipation, mergeProject, mergeProjects } = useFunding();
  const hasConfirmedRef = useRef(false);
  const projectsRef = useRef(projects);
  const participatedFundingsRef = useRef(participatedFundings);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('토스 결제를 승인하고 있습니다.');
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [confirmedFundingId, setConfirmedFundingId] = useState<number | null>(null);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  useEffect(() => {
    participatedFundingsRef.current = participatedFundings;
  }, [participatedFundings]);

  const paymentInfo = useMemo(() => {
    const paymentKey = getParam(params.paymentKey);
    const orderId = getParam(params.orderId);
    const numericOrderId = getParam(params.numericOrderId);
    const returnedAmount = getFiniteAmount(getParam(params.amount));
    const expectedAmount = getFiniteAmount(getParam(params.expectedAmount));
    const amount = expectedAmount ?? returnedAmount;
    const fundingId = Number(getParam(params.fundingId));
    const orderName = getParam(params.orderName) || '주담 펀딩 후원';
    return {
      paymentKey,
      orderId,
      numericOrderId,
      returnedAmount,
      amount,
      fundingId: Number.isFinite(fundingId) ? fundingId : undefined,
      orderName,
    };
  }, [params]);

  useEffect(() => {
    let mounted = true;

    const confirmPayment = async () => {
      if (hasConfirmedRef.current) return;
      hasConfirmedRef.current = true;

      if (!paymentInfo.paymentKey || !paymentInfo.orderId || !paymentInfo.amount) {
        await clearPendingExternalPayment();
        setStatus('error');
        setMessage('토스 결제 승인 정보가 올바르지 않습니다.');
        return;
      }

      if (paymentInfo.returnedAmount && paymentInfo.returnedAmount !== paymentInfo.amount) {
        await clearPendingExternalPayment();
        setStatus('error');
        setMessage('결제 금액이 주문 금액과 다릅니다. 결제를 다시 시도해주세요.');
        return;
      }

      try {
        console.log('[TossPaymentSuccess] confirm request', {
          orderId: paymentInfo.orderId,
          amount: paymentInfo.amount,
          fundingId: paymentInfo.fundingId,
          numericOrderId: paymentInfo.numericOrderId,
          hasPaymentKey: Boolean(paymentInfo.paymentKey),
        });
        const confirmed = await withPaymentTimeout(
          confirmTossPayment({
            paymentKey: paymentInfo.paymentKey,
            orderId: paymentInfo.orderId,
            amount: paymentInfo.amount,
          }),
          30000,
          '결제 승인 응답이 지연되고 있습니다. 잠시 후 다시 확인해주세요.'
        );
        console.log('[TossPaymentSuccess] confirm response', confirmed);
        if (!isPaidConfirmResponse(confirmed)) {
          throw new Error(confirmed.message || '토스 결제 승인 결과를 확인하지 못했습니다.');
        }

        const initialFundingId = paymentInfo.fundingId || null;
        const initialPaidAmount = confirmed.paidAmount || paymentInfo.amount;
        if (mounted) {
          setConfirmedFundingId(initialFundingId);
          setPaidAmount(initialPaidAmount);
          setStatus('success');
          setMessage('펀딩 참여가 완료되었습니다.');
        }

        const orderLookupId = paymentInfo.numericOrderId || paymentInfo.orderId;
        let detail: Awaited<ReturnType<typeof getFundingOrderDetail>> | null = null;
        if (orderLookupId) {
          try {
            detail = await withPaymentTimeout(
              getFundingOrderDetail(orderLookupId),
              8000,
              '주문 상세 조회가 지연되고 있습니다.'
            );
          } catch (detailError) {
            console.warn(getFundingApiErrorMessage(detailError, '주문 상세를 불러오지 못했습니다.'));
          }
        }
        const fundingId = detail?.fundingId || paymentInfo.fundingId;
        const nextPaidAmount = confirmed.paidAmount || detail?.totalAmount || paymentInfo.amount;

        if (fundingId) {
          if (!participatedFundingsRef.current.some((item) => item.fundingId === fundingId)) {
            addParticipation(fundingId, nextPaidAmount);
          }
          const currentProject = projectsRef.current.find((item) => item.id === fundingId);
          try {
              const latestDetail = await withPaymentTimeout(
                getFundingDetail(fundingId),
                8000,
                '펀딩 상세 재조회가 지연되고 있습니다.'
              );
              if (currentProject) {
                mergeProject(fundingId, mergeFundingDetail(currentProject, latestDetail));
              } else {
                mergeProjects([createFundingProjectFromPaymentDetail(latestDetail)]);
              }
            } catch (detailError) {
              console.warn(getFundingApiErrorMessage(detailError, '펀딩 상세를 다시 불러오지 못했습니다.'));
            }
        }

        if (!mounted) return;
        setConfirmedFundingId(fundingId || null);
        setPaidAmount(nextPaidAmount);
        setStatus('success');
        setMessage('펀딩 참여가 완료되었습니다.');
      } catch (error) {
        const errorMessage = getFundingApiErrorMessage(error, '토스 결제 승인 중 문제가 발생했습니다.');
        console.warn('[TossPaymentSuccess] confirm failed', {
          orderId: paymentInfo.orderId,
          amount: paymentInfo.amount,
          message: errorMessage,
          error,
        });
        if (/이미|already|PAID/i.test(errorMessage)) {
          if (mounted) {
            setConfirmedFundingId(paymentInfo.fundingId || null);
            setPaidAmount(paymentInfo.amount);
            setStatus('success');
            setMessage('이미 결제가 완료된 후원입니다.');
          }
          return;
        }
        if (!mounted) return;
        setStatus('error');
        setMessage(errorMessage);
      } finally {
        await clearPendingExternalPayment();
      }
    };

    void confirmPayment();

    return () => {
      mounted = false;
    };
  }, [
    addParticipation,
    mergeProject,
    mergeProjects,
    paymentInfo.amount,
    paymentInfo.fundingId,
    paymentInfo.numericOrderId,
    paymentInfo.orderId,
    paymentInfo.paymentKey,
    paymentInfo.returnedAmount,
  ]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const detailFundingId = confirmedFundingId || paymentInfo.fundingId;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.iconBox, isSuccess && styles.iconBoxSuccess, status === 'error' && styles.iconBoxError]}>
        {isLoading ? (
          <ActivityIndicator color="#111827" />
        ) : isSuccess ? (
          <CheckCircle2 size={38} color="#FFFFFF" />
        ) : (
          <XCircle size={38} color="#991B1B" />
        )}
      </View>
      <Text style={styles.title}>{isLoading ? '결제 승인 중' : isSuccess ? '펀딩 참여가 완료되었습니다' : '결제 승인 실패'}</Text>
      <Text style={styles.body}>{message}</Text>
      {(paidAmount || paymentInfo.orderName) && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>프로젝트</Text>
          <Text style={styles.infoValue}>{paymentInfo.orderName}</Text>
          {paidAmount ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>결제 금액</Text>
              <Text style={styles.amountValue}>{paidAmount.toLocaleString()}원</Text>
            </>
          ) : null}
        </View>
      )}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={() => {
            if (detailFundingId) {
              router.replace(`/funding/${detailFundingId}?fromPayment=1` as any);
              return;
            }
            router.replace('/funding' as any);
          }}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>펀딩 상세로 돌아가기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, isLoading && styles.buttonDisabled]}
          onPress={() => router.replace(isSuccess ? '/mypage/funded' as any : '/funding' as any)}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>{isSuccess ? '내 후원 내역 보기' : '펀딩 목록으로 이동'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  iconBox: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconBoxSuccess: { backgroundColor: '#111827' },
  iconBoxError: { backgroundColor: '#FEF2F2' },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 22 },
  infoBox: { width: '100%', borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 16, gap: 6, marginBottom: 22 },
  infoLabel: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  infoValue: { fontSize: 15, color: '#111827', fontWeight: '900', lineHeight: 21 },
  amountValue: { fontSize: 22, color: '#111827', fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 6 },
  buttonGroup: { width: '100%', gap: 10 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  secondaryButton: { height: 54, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '900', color: '#374151' },
  buttonDisabled: { opacity: 0.55 },
});
