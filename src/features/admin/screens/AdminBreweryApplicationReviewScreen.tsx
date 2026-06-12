import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
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
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ExternalLink,
  FileText,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  AuthApiError,
  approveAdminBreweryApplication,
  getAdminBreweryApplications,
  rejectAdminBreweryApplication,
  type AdminBreweryApplication,
} from '@/features/auth/api';

type ActionState = {
  type: 'approve' | 'reject';
  applicationId: number;
} | null;

function isAdminRole(role?: string) {
  return String(role || '').toUpperCase() === 'ADMIN';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AuthApiError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatText(value?: string | number | boolean | null) {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text || '-';
}

function getApplicationStatusLabel(status?: string | null) {
  const normalized = String(status || '').trim().toUpperCase();
  switch (normalized) {
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
    case 'REJECT':
    case 'DENIED':
      return '반려';
    case 'PENDING':
    case 'SUBMITTED':
    case 'REVIEWING':
      return '심사 대기';
    default:
      return normalized || '대기';
  }
}

function isPendingApplicationStatus(status?: string | null) {
  return String(status || '').trim().toUpperCase() === 'PENDING';
}

function getOcrStatusLabel(status?: string | null) {
  const normalized = String(status || '').trim().toUpperCase();
  switch (normalized) {
    case 'PASSED':
    case 'SUCCESS':
    case 'COMPLETED':
      return 'OCR 통과';
    case 'FAILED':
    case 'ERROR':
      return 'OCR 실패';
    case 'PENDING':
    case 'PROCESSING':
      return 'OCR 처리 중';
    case 'SKIPPED':
      return 'OCR 미처리';
    default:
      return normalized || 'OCR 정보 없음';
  }
}

function getDocumentUrl(application: AdminBreweryApplication) {
  return (
    application.documentUrl ||
    application.businessLicenseUrl ||
    application.businessRegistrationFileUrl ||
    ''
  ).trim();
}

function buildAddress(application: AdminBreweryApplication) {
  return [application.businessAddress || application.location, application.businessAddressDetail]
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(' ');
}

export default function AdminBreweryApplicationReviewScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthReady } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [applications, setApplications] = useState<AdminBreweryApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedApplicationId, setExpandedApplicationId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminBreweryApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionState, setActionState] = useState<ActionState>(null);
  const [processedApplicationIds, setProcessedApplicationIds] = useState<Set<number>>(new Set());

  const pendingCount = applications.length;

  const loadApplications = useCallback(async (refresh = false, hiddenIds = processedApplicationIds) => {
    if (!isAdmin) return;
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getAdminBreweryApplications();
      const applicationMap = new Map<number, AdminBreweryApplication>();
      response.applications.forEach((application) => {
        if (application.applicationId > 0 && !applicationMap.has(application.applicationId)) {
          applicationMap.set(application.applicationId, application);
        }
      });
      setApplications(
        Array.from(applicationMap.values()).filter(
          (application) => !hiddenIds.has(application.applicationId),
        ),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '양조장 인증 신청 목록을 불러오지 못했습니다.'));
    } finally {
      if (refresh) setIsRefreshing(false);
      else setIsLoading(false);
    }
  }, [isAdmin, processedApplicationIds]);

  const hideProcessedApplication = useCallback((applicationId: number) => {
    setProcessedApplicationIds((prev) => {
      const next = new Set(prev);
      next.add(applicationId);
      return next;
    });
    setApplications((prev) => prev.filter((application) => application.applicationId !== applicationId));
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAdmin) return;
    loadApplications();
  }, [isAdmin, isAuthReady, loadApplications]);

  const selectedRejectTitle = useMemo(
    () => rejectTarget ? `${rejectTarget.breweryName || '양조장'} (#${rejectTarget.applicationId})` : '',
    [rejectTarget],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/mypage' as any);
  };

  const handleOpenDocument = async (url: string) => {
    if (!url) {
      Alert.alert('서류 없음', '열 수 있는 서류 URL이 없습니다.');
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('서류 열기 실패', '서류 링크를 열 수 없습니다.');
    }
  };

  const handleApprove = (application: AdminBreweryApplication) => {
    Alert.alert(
      '승인 확인',
      `${application.breweryName || '선택한 신청'}을 승인할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '승인',
          onPress: () => {
            void (async () => {
              setActionState({ type: 'approve', applicationId: application.applicationId });
              try {
                await approveAdminBreweryApplication(application.applicationId);
                const hiddenIds = new Set(processedApplicationIds);
                hiddenIds.add(application.applicationId);
                hideProcessedApplication(application.applicationId);
                Alert.alert('승인 완료', '양조장 인증 신청이 승인되었습니다.');
                await loadApplications(true, hiddenIds);
              } catch (error) {
                Alert.alert('승인 실패', getErrorMessage(error, '양조장 인증 승인을 처리하지 못했습니다.'));
              } finally {
                setActionState(null);
              }
            })();
          },
        },
      ],
    );
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

    setActionState({ type: 'reject', applicationId: target.applicationId });
    try {
      await rejectAdminBreweryApplication(target.applicationId, reason);
      const hiddenIds = new Set(processedApplicationIds);
      hiddenIds.add(target.applicationId);
      hideProcessedApplication(target.applicationId);
      setRejectTarget(null);
      setRejectReason('');
      Alert.alert('반려 완료', '양조장 인증 신청이 반려되었습니다.');
      await loadApplications(true, hiddenIds);
    } catch (error) {
      Alert.alert('반려 실패', getErrorMessage(error, '양조장 인증 반려를 처리하지 못했습니다.'));
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
        body="관리자 양조장 인증 심사는 ADMIN 계정으로 로그인한 뒤 이용할 수 있습니다."
        actionLabel="로그인하기"
        onAction={() => router.replace('/login' as any)}
      />
    );
  }

  if (!isAdmin) {
    return (
      <CenteredNotice
        title="권한이 없습니다"
        body="ADMIN 계정만 양조장 인증 심사 화면에 접근할 수 있습니다."
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
        <Text style={styles.headerTitle}>양조장 인증 심사</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => loadApplications(true)} activeOpacity={0.85}>
          <RefreshCw size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadApplications(true)} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBand}>
          <View style={styles.summaryIcon}>
            <ShieldCheck size={24} color="#FFFFFF" />
          </View>
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryLabel}>인증 신청</Text>
            <Text style={styles.summaryValue}>{pendingCount.toLocaleString()}건</Text>
          </View>
          <Text style={styles.adminBadge}>ADMIN</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>목록 조회 실패</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadApplications()} activeOpacity={0.85}>
              <Text style={styles.retryText}>다시 불러오기</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#111827" />
            <Text style={styles.loadingText}>양조장 인증 신청을 불러오는 중입니다.</Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && applications.length === 0 ? (
          <View style={styles.emptyBox}>
            <FileText size={28} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>심사할 인증 신청이 없습니다</Text>
            <Text style={styles.emptyText}>새로운 양조장 인증 신청이 등록되면 이곳에 표시됩니다.</Text>
          </View>
        ) : null}

        <View style={styles.listArea}>
          {applications.map((application) => {
            const expanded = expandedApplicationId === application.applicationId;
            const approving = actionState?.type === 'approve' && actionState.applicationId === application.applicationId;
            const rejecting = actionState?.type === 'reject' && actionState.applicationId === application.applicationId;
            const documentUrl = getDocumentUrl(application);
            const address = buildAddress(application);
            const canReview = isPendingApplicationStatus(application.status);

            return (
              <View key={application.applicationId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardKicker}>Application #{application.applicationId}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>{formatText(application.breweryName)}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{getApplicationStatusLabel(application.status)}</Text>
                  </View>
                </View>

                <InfoRow icon={<Building2 size={15} color="#6B7280" />} label="사업자번호" value={formatText(application.businessNumber || application.licenseNumber)} />
                <InfoRow icon={<FileText size={15} color="#6B7280" />} label="OCR" value={getOcrStatusLabel(application.ocrStatus)} />
                <InfoRow icon={<FileText size={15} color="#6B7280" />} label="신청일" value={formatDateTime(application.createdAt)} />

                {application.ocrSummary ? (
                  <View style={styles.ocrBox}>
                    <Text style={styles.ocrLabel}>OCR 요약</Text>
                    <Text style={styles.ocrText}>{application.ocrSummary}</Text>
                  </View>
                ) : null}
                {application.ocrError ? (
                  <View style={[styles.ocrBox, styles.ocrErrorBox]}>
                    <Text style={[styles.ocrLabel, styles.ocrErrorLabel]}>OCR 오류</Text>
                    <Text style={[styles.ocrText, styles.ocrErrorText]}>{application.ocrError}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedApplicationId(expanded ? null : application.applicationId)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.expandText}>{expanded ? '상세 정보 접기' : '상세 정보 펼치기'}</Text>
                  {expanded ? <ChevronUp size={18} color="#4B5563" /> : <ChevronDown size={18} color="#4B5563" />}
                </TouchableOpacity>

                {expanded ? (
                  <View style={styles.detailBox}>
                    <DetailSection title="신청자 정보">
                      <DetailLine label="신청자" value={formatText(application.applicantName)} />
                      <DetailLine label="이메일" value={formatText(application.email)} />
                      <DetailLine label="전화번호" value={formatText(application.phoneNumber)} />
                      <DetailLine label="상태" value={getApplicationStatusLabel(application.status)} />
                    </DetailSection>

                    <DetailSection title="양조장 정보">
                      <DetailLine label="양조장명" value={formatText(application.breweryName)} />
                      <DetailLine label="대표자명" value={formatText(application.representativeName)} />
                      <DetailLine label="사업자번호" value={formatText(application.businessNumber || application.licenseNumber)} />
                      <DetailLine label="주소" value={formatText(address)} />
                    </DetailSection>

                    <DetailSection title="서류 및 OCR">
                      <DetailLine label="OCR 상태" value={getOcrStatusLabel(application.ocrStatus)} />
                      <DetailLine label="OCR 확인일" value={formatDateTime(application.ocrCheckedAt)} />
                      <DetailParagraph label="OCR 요약" value={application.ocrSummary} />
                      <DetailParagraph label="OCR 오류" value={application.ocrError} danger />
                      <TouchableOpacity
                        style={[styles.documentButton, !documentUrl && styles.disabledButton]}
                        disabled={!documentUrl}
                        onPress={() => handleOpenDocument(documentUrl)}
                        activeOpacity={0.85}
                      >
                        <ExternalLink size={16} color={documentUrl ? '#111827' : '#9CA3AF'} />
                        <Text style={[styles.documentText, !documentUrl && styles.disabledDocumentText]}>
                          {documentUrl ? '서류 링크 열기' : '등록된 서류 URL 없음'}
                        </Text>
                      </TouchableOpacity>
                      {documentUrl ? <Text style={styles.documentUrl} numberOfLines={2}>{documentUrl}</Text> : null}
                    </DetailSection>
                  </View>
                ) : null}

                {canReview ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.rejectButton, (approving || rejecting) && styles.disabledButton]}
                      disabled={approving || rejecting}
                      onPress={() => {
                        setRejectTarget(application);
                        setRejectReason('');
                      }}
                      activeOpacity={0.85}
                    >
                      {rejecting ? <ActivityIndicator color="#991B1B" /> : <XCircle size={17} color="#991B1B" />}
                      <Text style={styles.rejectText}>반려</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.approveButton, (approving || rejecting) && styles.disabledButton]}
                      disabled={approving || rejecting}
                      onPress={() => handleApprove(application)}
                      activeOpacity={0.85}
                    >
                      {approving ? <ActivityIndicator color="#FFFFFF" /> : <CheckCircle2 size={17} color="#FFFFFF" />}
                      <Text style={styles.approveText}>승인</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.processedNotice}>
                    <Text style={styles.processedNoticeText}>처리된 신청은 승인/반려할 수 없습니다.</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={Boolean(rejectTarget)} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.rejectModal}>
            <View style={styles.rejectModalHeader}>
              <Text style={styles.rejectModalTitle}>양조장 인증 반려</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeRejectModal}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
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
          </View>
        </View>
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

function DetailParagraph({ label, value, danger = false }: { label: string; value?: string | null; danger?: boolean }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.detailParagraphBox}>
      <Text style={[styles.detailParagraphLabel, danger && styles.dangerText]}>{label}</Text>
      <Text style={[styles.detailParagraph, danger && styles.dangerText]}>{value.trim()}</Text>
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
  statusPill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, backgroundColor: '#EEF2FF' },
  statusText: { fontSize: 11, color: '#3730A3', fontWeight: '900' },
  infoRow: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 7 },
  infoLabel: { width: 82, fontSize: 12, color: '#6B7280', fontWeight: '800' },
  infoValue: { flex: 1, fontSize: 13, color: '#111827', fontWeight: '700' },
  ocrBox: { marginTop: 10, borderRadius: 12, backgroundColor: '#F3F4F6', padding: 12 },
  ocrErrorBox: { backgroundColor: '#FEF2F2' },
  ocrLabel: { fontSize: 12, color: '#4B5563', fontWeight: '900' },
  ocrErrorLabel: { color: '#991B1B' },
  ocrText: { marginTop: 4, fontSize: 13, color: '#374151', lineHeight: 19 },
  ocrErrorText: { color: '#7F1D1D' },
  expandButton: { marginTop: 12, height: 42, borderRadius: 12, backgroundColor: '#F3F4F6', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  expandText: { fontSize: 13, color: '#374151', fontWeight: '900' },
  detailBox: { marginTop: 14, gap: 14 },
  detailSection: { borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  detailSectionTitle: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB', fontSize: 13, color: '#111827', fontWeight: '900' },
  detailSectionBody: { padding: 12, gap: 8 },
  detailLine: { flexDirection: 'row', gap: 10 },
  detailLabel: { width: 92, fontSize: 12, color: '#6B7280', fontWeight: '800' },
  detailValue: { flex: 1, fontSize: 13, color: '#111827', lineHeight: 19, fontWeight: '700' },
  detailParagraphBox: { gap: 4 },
  detailParagraphLabel: { fontSize: 12, color: '#6B7280', fontWeight: '900' },
  detailParagraph: { fontSize: 13, color: '#374151', lineHeight: 20 },
  dangerText: { color: '#991B1B' },
  documentButton: { height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  documentText: { fontSize: 13, color: '#111827', fontWeight: '900' },
  disabledDocumentText: { color: '#9CA3AF' },
  documentUrl: { fontSize: 11, color: '#6B7280', lineHeight: 16 },
  actionRow: { marginTop: 14, flexDirection: 'row', gap: 10 },
  processedNotice: { marginTop: 14, minHeight: 42, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  processedNoticeText: { fontSize: 13, color: '#6B7280', fontWeight: '800', textAlign: 'center' },
  rejectButton: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#FEF2F2', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: '#991B1B', fontSize: 14, fontWeight: '900' },
  approveButton: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#111827', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  disabledButton: { opacity: 0.45 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  rejectModal: { width: '100%', maxWidth: 420, borderRadius: 20, backgroundColor: '#FFFFFF', padding: 18 },
  rejectModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rejectModalTitle: { fontSize: 18, color: '#111827', fontWeight: '900' },
  modalCloseButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rejectTargetText: { marginTop: 8, fontSize: 13, color: '#6B7280', fontWeight: '800' },
  rejectInput: { marginTop: 14, minHeight: 120, borderRadius: 14, borderWidth: 1, borderColor: '#D1D5DB', padding: 12, fontSize: 14, color: '#111827', lineHeight: 20 },
  rejectModalActions: { marginTop: 14, flexDirection: 'row', gap: 10 },
  cancelButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 14, color: '#374151', fontWeight: '900' },
  rejectSubmitButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#B91C1C', alignItems: 'center', justifyContent: 'center' },
  rejectSubmitText: { fontSize: 14, color: '#FFFFFF', fontWeight: '900' },
  noticeContainer: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  noticeIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  noticeTitle: { marginTop: 18, fontSize: 20, color: '#111827', fontWeight: '900', textAlign: 'center' },
  noticeBody: { marginTop: 8, fontSize: 14, color: '#6B7280', lineHeight: 21, textAlign: 'center' },
  noticeButton: { marginTop: 20, minWidth: 180 },
});
