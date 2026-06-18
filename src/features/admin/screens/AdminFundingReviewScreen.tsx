import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  FileText,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  approveAdminFundingDraft,
  getAdminFundingDrafts,
  getFundingApiErrorMessage,
  rejectAdminFundingDraft,
  type AdminFundingDraft,
} from '@/features/funding/api';

type ActionState = {
  type: 'approve' | 'reject';
  draftId: number;
} | null;

function isAdminRole(role?: string) {
  return String(role || '').toUpperCase() === 'ADMIN';
}

function isReviewableDraftStatus(status?: string) {
  const normalized = String(status || '').trim().toUpperCase();
  return normalized === 'SUBMITTED' || normalized === 'REVIEWING';
}

function getAdminDraftStatusLabel(status?: string) {
  const normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'SUBMITTED') return '제출됨';
  if (normalized === 'REVIEWING') return '심사 중';
  return '심사 대상 아님';
}

function formatDateTime(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatCurrency(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return `${value.toLocaleString()}원`;
}

function formatNumber(value?: number, unit = '') {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return `${value.toLocaleString()}${unit}`;
}

function formatText(value?: string | number | boolean | null) {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text || '-';
}

function formatList(values?: string[]) {
  const list = values?.map((item) => item.trim()).filter(Boolean) || [];
  return list.length ? list.join(', ') : '-';
}

function formatPlanValue(value?: string | { category?: string; amount?: number; step?: string; description?: string; date?: string }[]) {
  if (!value) return '-';
  if (typeof value === 'string') return value.trim() || '-';
  if (!Array.isArray(value) || value.length === 0) return '-';
  return value
    .map((item) => item.category
      ? `${item.category}: ${formatCurrency(item.amount)}`
      : [item.step, item.description, item.date].filter(Boolean).join(' / '))
    .filter(Boolean)
    .join('\n');
}

function formatRawMaterials(rawMaterials?: { name: string; origin: string }[]) {
  if (!rawMaterials?.length) return '-';
  return rawMaterials
    .map((item) => [item.name, item.origin].filter(Boolean).join(' / '))
    .filter(Boolean)
    .join(', ');
}

export default function AdminFundingReviewScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthReady } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [drafts, setDrafts] = useState<AdminFundingDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedDraftId, setExpandedDraftId] = useState<number | null>(null);
  const [actionState, setActionState] = useState<ActionState>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminFundingDraft | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processedDraftIds, setProcessedDraftIds] = useState<Set<number>>(new Set());

  const pendingCount = drafts.length;

  const loadDrafts = useCallback(async (refresh = false, hiddenDraftIds = processedDraftIds) => {
    if (!isAdmin) return;
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getAdminFundingDrafts();
      const draftMap = new Map<number, AdminFundingDraft>();
      response.drafts.forEach((draft) => {
        if (!draftMap.has(draft.draftId)) draftMap.set(draft.draftId, draft);
      });
      setDrafts(
        Array.from(draftMap.values()).filter(
          (draft) => isReviewableDraftStatus(draft.status) && !hiddenDraftIds.has(draft.draftId),
        ),
      );
    } catch (error) {
      setErrorMessage(getFundingApiErrorMessage(error, '심사 대기 펀딩을 불러오지 못했습니다.'));
    } finally {
      if (refresh) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }, [isAdmin, processedDraftIds]);

  const hideProcessedDraft = useCallback((draftId: number) => {
    setProcessedDraftIds((prev) => {
      const next = new Set(prev);
      next.add(draftId);
      return next;
    });
    setDrafts((prev) => prev.filter((draft) => draft.draftId !== draftId));
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAdmin) return;
    loadDrafts();
  }, [isAdmin, isAuthReady, loadDrafts]);

  const selectedRejectTitle = useMemo(
    () => rejectTarget ? `${rejectTarget.title} (#${rejectTarget.draftId})` : '',
    [rejectTarget],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/mypage' as any);
  };

  const handleApprove = (draft: AdminFundingDraft) => {
    Alert.alert(
      '펀딩 승인',
      `${draft.title} 프로젝트를 승인할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '승인',
          onPress: async () => {
            setActionState({ type: 'approve', draftId: draft.draftId });
            try {
              await approveAdminFundingDraft(draft.draftId);
              const hiddenDraftIds = new Set(processedDraftIds);
              hiddenDraftIds.add(draft.draftId);
              hideProcessedDraft(draft.draftId);
              Alert.alert('승인 완료', '펀딩 프로젝트가 승인되었습니다.');
              await loadDrafts(true, hiddenDraftIds);
            } catch (error) {
              Alert.alert('승인 실패', getFundingApiErrorMessage(error, '펀딩 승인을 처리하지 못했습니다.'));
            } finally {
              setActionState(null);
            }
          },
        },
      ],
    );
  };

  const openRejectModal = (draft: AdminFundingDraft) => {
    setRejectTarget(draft);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    if (actionState?.type === 'reject') return;
    setRejectTarget(null);
    setRejectReason('');
  };

  const handleRejectSubmit = async () => {
    const target = rejectTarget;
    const reason = rejectReason.trim();
    if (!target) return;
    if (!reason) {
      Alert.alert('반려 사유 입력', '반려 사유를 입력해주세요.');
      return;
    }
    setActionState({ type: 'reject', draftId: target.draftId });
    try {
      await rejectAdminFundingDraft(target.draftId, reason);
      const hiddenDraftIds = new Set(processedDraftIds);
      hiddenDraftIds.add(target.draftId);
      hideProcessedDraft(target.draftId);
      setRejectTarget(null);
      setRejectReason('');
      Alert.alert('반려 완료', '펀딩 프로젝트가 반려되었습니다.');
      await loadDrafts(true, hiddenDraftIds);
    } catch (error) {
      Alert.alert('반려 실패', getFundingApiErrorMessage(error, '펀딩 반려를 처리하지 못했습니다.'));
    } finally {
      setActionState(null);
    }
  };

  if (!isAuthReady) {
    return <CenteredNotice title="권한 확인 중" body="로그인 상태를 확인하고 있습니다." loading />;
  }

  if (!user) {
    return (
      <CenteredNotice
        title="로그인이 필요합니다"
        body="관리자 펀딩 심사는 ADMIN 계정으로 로그인한 뒤 이용할 수 있습니다."
        actionLabel="로그인하기"
        onAction={() => router.replace('/login' as any)}
      />
    );
  }

  if (!isAdmin) {
    return (
      <CenteredNotice
        title="권한이 없습니다"
        body="ADMIN 계정만 펀딩 심사 화면에 접근할 수 있습니다."
        actionLabel="마이페이지로 이동"
        onAction={() => router.replace('/mypage' as any)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack} activeOpacity={0.85}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>펀딩 심사</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => loadDrafts(true)} activeOpacity={0.85}>
          <RefreshCw size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadDrafts(true)} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBand}>
          <View style={styles.summaryIcon}>
            <ShieldCheck size={24} color="#FFFFFF" />
          </View>
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryLabel}>심사 대기</Text>
            <Text style={styles.summaryValue}>{pendingCount.toLocaleString()}건</Text>
          </View>
          <Text style={styles.adminBadge}>ADMIN</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>목록 조회 실패</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadDrafts()} activeOpacity={0.85}>
              <Text style={styles.retryText}>다시 불러오기</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#111827" />
            <Text style={styles.loadingText}>심사 대기 펀딩을 불러오는 중입니다.</Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && drafts.length === 0 ? (
          <View style={styles.emptyBox}>
            <FileText size={28} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>심사 대기 펀딩이 없습니다</Text>
            <Text style={styles.emptyText}>새로 제출된 펀딩 draft가 생기면 이곳에 표시됩니다.</Text>
          </View>
        ) : null}

        <View style={styles.listArea}>
          {drafts.map((draft) => {
            const expanded = expandedDraftId === draft.draftId;
            const approving = actionState?.type === 'approve' && actionState.draftId === draft.draftId;
            const rejecting = actionState?.type === 'reject' && actionState.draftId === draft.draftId;
            const imageUrls = draft.images?.length ? draft.images : draft.imageUrls || [];
            return (
              <View key={draft.draftId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardKicker}>Draft #{draft.draftId}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>{draft.title}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{getAdminDraftStatusLabel(draft.status)}</Text>
                  </View>
                </View>

                <InfoRow icon={<Building2 size={15} color="#6B7280" />} label="양조장" value={draft.breweryName} />
                <InfoRow icon={<Calendar size={15} color="#6B7280" />} label="생성일" value={formatDateTime(draft.createdAt)} />
                <InfoRow icon={<Calendar size={15} color="#6B7280" />} label="제출일" value={formatDateTime(draft.submittedAt || draft.updatedAt)} />

                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedDraftId(expanded ? null : draft.draftId)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.expandText}>{expanded ? '상세 정보 접기' : '상세 정보 펼치기'}</Text>
                  {expanded ? <ChevronUp size={18} color="#4B5563" /> : <ChevronDown size={18} color="#4B5563" />}
                </TouchableOpacity>

                {expanded ? (
                  <View style={styles.detailBox}>
                    <DetailSection title="기본 정보">
                      <DetailLine label="프로젝트명" value={draft.basicInfo?.title || draft.title || '-'} />
                      <DetailLine label="짧은 제목" value={formatText(draft.basicInfo?.shortTitle)} />
                      <DetailLine label="카테고리" value={draft.basicInfo?.category || draft.category || '-'} />
                      <DetailLine label="주 소재" value={draft.basicInfo?.mainIngredient || draft.mainIngredient || '-'} />
                      <DetailLine label="부재료" value={formatList(draft.basicInfo?.subIngredients)} />
                      <DetailLine label="알코올" value={formatNumber(draft.basicInfo?.alcoholPercentage, '%')} />
                      <DetailParagraph value={draft.basicInfo?.summary || draft.summary} />
                    </DetailSection>

                    <DetailSection title="일정/금액">
                      <DetailLine label="목표 금액" value={formatCurrency(draft.schedule?.targetAmount ?? draft.targetAmount)} />
                      <DetailLine label="병당 가격" value={formatCurrency(draft.schedule?.pricePerBottle ?? draft.pricePerBottle)} />
                      <DetailLine label="총 수량" value={formatNumber(draft.schedule?.totalQuantity ?? draft.totalQuantity, '병')} />
                      <DetailLine label="시작일" value={formatText(draft.schedule?.fundingStartDate)} />
                      <DetailLine label="기간" value={formatNumber(draft.schedule?.fundingPeriodDays, '일')} />
                      <DetailLine label="종료일" value={formatText(draft.schedule?.fundingEndDate)} />
                      <DetailLine label="배송 예정" value={formatText(draft.schedule?.expectedDeliveryDate)} />
                    </DetailSection>

                    <DetailSection title="법적 고시">
                      <DetailLine label="제품 유형" value={formatText(draft.legalInfo?.productType)} />
                      <DetailLine label="용량" value={formatNumber(draft.legalInfo?.volume, 'ml')} />
                      <DetailLine label="도수" value={formatNumber(draft.legalInfo?.alcoholPercentage, '%')} />
                      <DetailLine label="주 원료" value={formatText(draft.legalInfo?.mainIngredient || draft.legalInfo?.primaryIngredient)} />
                      <DetailLine
                        label="부원료"
                        value={draft.legalInfo?.subIngredients?.length
                          ? formatList(draft.legalInfo.subIngredients)
                          : formatText(draft.legalInfo?.subIngredient)}
                      />
                      <DetailLine label="원재료/원산지" value={formatRawMaterials(draft.legalInfo?.rawMaterials)} />
                    </DetailSection>

                    <DetailSection title="프로젝트 계획">
                      <DetailParagraph label="소개" value={draft.plan?.introduction} />
                      <DetailParagraph label="예산 계획" value={formatPlanValue(draft.plan?.budgetPlan || draft.plan?.projectBudget)} />
                      <DetailParagraph label="일정 계획" value={formatPlanValue(draft.plan?.schedulePlan || draft.plan?.projectSchedule)} />
                      <DetailParagraph label="정책" value={draft.plan?.policy || draft.notices?.policy} />
                      <DetailParagraph label="위험 고지" value={draft.notices?.riskNotice} />
                    </DetailSection>

                    <DetailSection title="양조장 정보">
                      <DetailLine label="양조장명" value={draft.breweryInfo?.breweryName || draft.breweryName || '-'} />
                      <DetailLine label="창작자" value={formatText(draft.breweryInfo?.creatorName)} />
                      <DetailLine label="대표자" value={formatText(draft.breweryInfo?.representativeName)} />
                      <DetailLine label="사업자번호" value={formatText(draft.breweryInfo?.businessRegistrationNumber)} />
                      <DetailLine label="주소" value={formatText([draft.breweryInfo?.businessAddress, draft.breweryInfo?.businessAddressDetail].filter(Boolean).join(' '))} />
                      <DetailLine label="연락처" value={formatText(draft.breweryInfo?.contactPhone)} />
                      <DetailLine label="이메일" value={formatText(draft.breweryInfo?.contactEmail)} />
                      <DetailLine label="계좌" value={formatText([draft.breweryInfo?.bankName, draft.breweryInfo?.accountNumber, draft.breweryInfo?.accountHolder].filter(Boolean).join(' / '))} />
                      <DetailParagraph label="창작자 소개" value={draft.breweryInfo?.creatorIntroduction} />
                    </DetailSection>

                    <DetailSection title="이미지">
                      <DetailLine label="등록 수" value={`${imageUrls.length}장`} />
                      {imageUrls.length ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
                          {imageUrls.map((url, index) => (
                            <Image key={`${url}-${index}`} source={{ uri: url }} style={styles.previewImage} />
                          ))}
                        </ScrollView>
                      ) : (
                        <Text style={styles.emptyDetailText}>등록된 이미지가 없습니다.</Text>
                      )}
                    </DetailSection>
                  </View>
                ) : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.rejectButton, (approving || rejecting) && styles.disabledButton]}
                    disabled={approving || rejecting}
                    onPress={() => openRejectModal(draft)}
                    activeOpacity={0.85}
                  >
                    {rejecting ? <ActivityIndicator color="#991B1B" /> : <XCircle size={17} color="#991B1B" />}
                    <Text style={styles.rejectText}>반려</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.approveButton, (approving || rejecting) && styles.disabledButton]}
                    disabled={approving || rejecting}
                    onPress={() => handleApprove(draft)}
                    activeOpacity={0.85}
                  >
                    {approving ? <ActivityIndicator color="#FFFFFF" /> : <CheckCircle2 size={17} color="#FFFFFF" />}
                    <Text style={styles.approveText}>승인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={Boolean(rejectTarget)} animationType="fade" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.rejectModal}>
            <View style={styles.rejectModalHeader}>
              <Text style={styles.rejectModalTitle}>펀딩 반려</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeRejectModal}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.rejectModalContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.rejectTargetText}>{selectedRejectTitle}</Text>
              <TextInput
                style={styles.rejectInput}
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="반려 사유를 입력해주세요."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />
              <View style={styles.rejectModalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeRejectModal} activeOpacity={0.85}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rejectSubmitButton, actionState?.type === 'reject' && styles.disabledButton]}
                  disabled={actionState?.type === 'reject'}
                  onPress={handleRejectSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rejectSubmitText}>{actionState?.type === 'reject' ? '처리 중' : '반려하기'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function CenteredNotice({
  title,
  body,
  actionLabel,
  onAction,
  loading = false,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.noticeContainer, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.noticeIcon}>
        {loading ? <ActivityIndicator color="#111827" /> : <ShieldCheck size={28} color="#111827" />}
      </View>
      <Text style={styles.noticeTitle}>{title}</Text>
      <Text style={styles.noticeBody}>{body}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} style={styles.noticeButton} /> : null}
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.detailSection}>
      <Text style={styles.detailSectionTitle}>{title}</Text>
      <View style={styles.detailSectionBody}>{children}</View>
    </View>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function DetailParagraph({ label, value }: { label?: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.detailParagraphBox}>
      {label ? <Text style={styles.detailParagraphLabel}>{label}</Text> : null}
      <Text style={styles.detailParagraph}>{value.trim()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { minHeight: 76, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  content: { padding: 18, gap: 16 },
  summaryBand: { minHeight: 96, borderRadius: 18, padding: 18, backgroundColor: '#111827', flexDirection: 'row', alignItems: 'center', gap: 14 },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  summaryTextBox: { flex: 1 },
  summaryLabel: { fontSize: 13, color: '#D1D5DB', fontWeight: '700' },
  summaryValue: { marginTop: 2, fontSize: 24, color: '#FFFFFF', fontWeight: '900' },
  adminBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#FFFFFF', color: '#111827', fontSize: 11, fontWeight: '900' },
  errorBox: { borderRadius: 16, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', padding: 16 },
  errorTitle: { fontSize: 15, color: '#991B1B', fontWeight: '900' },
  errorText: { marginTop: 6, fontSize: 13, color: '#7F1D1D', lineHeight: 19 },
  retryButton: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9, backgroundColor: '#991B1B' },
  retryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  loadingBox: { minHeight: 140, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { fontSize: 13, color: '#6B7280', fontWeight: '700' },
  emptyBox: { minHeight: 190, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { marginTop: 12, fontSize: 17, fontWeight: '900', color: '#111827' },
  emptyText: { marginTop: 6, fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 19 },
  listArea: { gap: 14 },
  card: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 16 },
  cardHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  cardTitleBox: { flex: 1, minWidth: 0 },
  cardKicker: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  cardTitle: { marginTop: 3, fontSize: 17, color: '#111827', fontWeight: '900', lineHeight: 23 },
  statusPill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, color: '#92400E', fontWeight: '900' },
  infoRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 7 },
  infoLabel: { width: 52, fontSize: 12, color: '#6B7280', fontWeight: '800' },
  infoValue: { flex: 1, fontSize: 13, color: '#111827', fontWeight: '800' },
  expandButton: { marginTop: 12, height: 40, borderRadius: 10, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  expandText: { fontSize: 13, color: '#4B5563', fontWeight: '900' },
  detailBox: { marginTop: 12, borderRadius: 12, backgroundColor: '#F9FAFB', padding: 12, gap: 14 },
  detailSection: { borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', padding: 12 },
  detailSectionTitle: { fontSize: 13, color: '#111827', fontWeight: '900' },
  detailSectionBody: { marginTop: 8, gap: 7 },
  detailLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  detailLabel: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  detailValue: { flex: 1, textAlign: 'right', fontSize: 12, color: '#111827', fontWeight: '800' },
  detailParagraphBox: { gap: 4 },
  detailParagraphLabel: { fontSize: 12, color: '#6B7280', fontWeight: '800' },
  detailParagraph: { fontSize: 12, color: '#374151', lineHeight: 18 },
  emptyDetailText: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  imageRow: { gap: 8, paddingTop: 2 },
  previewImage: { width: 84, height: 84, borderRadius: 10, backgroundColor: '#E5E7EB' },
  summaryBody: { marginTop: 4, fontSize: 13, color: '#4B5563', lineHeight: 19 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  rejectButton: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  approveButton: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#111827', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  rejectText: { fontSize: 14, color: '#991B1B', fontWeight: '900' },
  approveText: { fontSize: 14, color: '#FFFFFF', fontWeight: '900' },
  disabledButton: { opacity: 0.55 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.48)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  rejectModal: { width: '100%', maxHeight: '86%', borderRadius: 20, backgroundColor: '#FFFFFF', padding: 18 },
  rejectModalContent: { paddingBottom: 2 },
  rejectModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rejectModalTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  modalCloseButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rejectTargetText: { marginTop: 8, fontSize: 13, color: '#4B5563', fontWeight: '800' },
  rejectInput: { marginTop: 14, minHeight: 130, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', padding: 14, fontSize: 14, color: '#111827', lineHeight: 20 },
  rejectModalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  rejectSubmitButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#991B1B', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#4B5563', fontSize: 14, fontWeight: '900' },
  rejectSubmitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  noticeContainer: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  noticeIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  noticeTitle: { fontSize: 22, fontWeight: '900', color: '#111827', textAlign: 'center' },
  noticeBody: { marginTop: 10, fontSize: 14, lineHeight: 21, color: '#6B7280', textAlign: 'center' },
  noticeButton: { marginTop: 22, alignSelf: 'stretch' },
});
