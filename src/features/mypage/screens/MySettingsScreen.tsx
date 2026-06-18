import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { AlertTriangle, ArrowLeft, ChevronRight, LockKeyhole, RefreshCw, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { getMyPageApiErrorMessage, withdrawMyPageAccount } from '@/features/mypage/api';

type SettingsNotice = {
  title: string;
  body: string;
} | null;

export default function MySettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [confirmWithdrawVisible, setConfirmWithdrawVisible] = useState(false);
  const [withdrawNickname, setWithdrawNickname] = useState('');
  const [withdrawNicknameError, setWithdrawNicknameError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [notice, setNotice] = useState<SettingsNotice>(null);

  const openOnboarding = () => {
    router.replace({
      pathname: '/onboarding',
      params: {
        mode: 'review',
        returnTo: '/(tabs)/mypage',
      },
    } as any);
  };

  const withdraw = () => {
    setWithdrawNickname('');
    setWithdrawNicknameError('');
    setPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    if (isVerifyingPassword) return;
    setPasswordModalVisible(false);
    setWithdrawNickname('');
    setWithdrawNicknameError('');
  };

  const verifyWithdrawalPassword = async () => {
    const expectedNickname = (user?.name || '').trim();
    const inputNickname = withdrawNickname.trim();

    if (!expectedNickname) {
      setWithdrawNicknameError('현재 계정 닉네임을 확인할 수 없습니다. 다시 로그인해주세요.');
      return;
    }
    if (!inputNickname) {
      setWithdrawNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (inputNickname !== expectedNickname) {
      setWithdrawNicknameError('닉네임이 일치하지 않습니다. 다시 입력해주세요.');
      return;
    }

    setIsVerifyingPassword(true);
    setWithdrawNicknameError('');
    setPasswordModalVisible(false);
    setConfirmWithdrawVisible(true);
    setIsVerifyingPassword(false);
  };

  const closeConfirmWithdrawModal = () => {
    if (isWithdrawing) return;
    setConfirmWithdrawVisible(false);
  };

  const confirmWithdrawal = async () => {
    const nickname = withdrawNickname.trim();
    if (!nickname) {
      setConfirmWithdrawVisible(false);
      setPasswordModalVisible(true);
      setWithdrawNicknameError('닉네임을 입력해주세요.');
      return;
    }

    setIsWithdrawing(true);
    try {
      await withdrawMyPageAccount(nickname);
      setConfirmWithdrawVisible(false);
      await logout();
      router.replace('/login' as any);
    } catch (error) {
      setNotice({
        title: '회원 탈퇴 실패',
        body: getMyPageApiErrorMessage(error, '회원 탈퇴에 실패했습니다.'),
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ArrowLeft size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
      >
        <Text style={styles.sectionTitle}>앱 설정</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={<RefreshCw size={18} color="#6B7280" />}
            title="온보딩 다시 보기"
            onPress={openOnboarding}
          />
        </View>

        <Text style={styles.sectionTitle}>계정 관리</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={<AlertTriangle size={18} color="#EF4444" />}
            title="회원 탈퇴"
            danger
            onPress={withdraw}
          />
        </View>
      </ScrollView>

      <PasswordConfirmModal
        visible={passwordModalVisible}
        password={withdrawNickname}
        error={withdrawNicknameError}
        loading={isVerifyingPassword}
        onChangePassword={(value) => {
          setWithdrawNickname(value);
          if (withdrawNicknameError) setWithdrawNicknameError('');
        }}
        onCancel={closePasswordModal}
        onSubmit={verifyWithdrawalPassword}
      />
      <WithdrawConfirmModal
        visible={confirmWithdrawVisible}
        loading={isWithdrawing}
        onCancel={closeConfirmWithdrawModal}
        onConfirm={confirmWithdrawal}
      />
      <NoticeModal notice={notice} onClose={() => setNotice(null)} />
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  danger,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
      </View>
      <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

function PasswordConfirmModal({
  visible,
  password,
  error,
  loading,
  onChangePassword,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  password: string;
  error: string;
  loading: boolean;
  onChangePassword: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIconDanger}>
              <LockKeyhole size={24} color="#EF4444" />
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} disabled={loading} onPress={onCancel}>
              <X size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>닉네임 확인</Text>
          <Text style={styles.modalDesc}>회원 탈퇴를 진행하려면 현재 계정의 닉네임을 정확히 입력해주세요.</Text>
          <TextInput
            value={password}
            onChangeText={onChangePassword}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            editable={!loading}
            style={[styles.passwordInput, error ? styles.passwordInputError : null]}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.secondaryButton} disabled={loading} onPress={onCancel}>
              <Text style={styles.secondaryButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryDangerButton, loading && styles.disabledButton]}
              disabled={loading}
              onPress={onSubmit}
            >
              {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.primaryDangerButtonText}>확인</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function WithdrawConfirmModal({
  visible,
  loading,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconDangerLarge}>
            <AlertTriangle size={30} color="#EF4444" />
          </View>
          <Text style={styles.modalTitle}>정말로 탈퇴하겠습니까?</Text>
          <Text style={styles.modalDesc}>
            탈퇴가 완료되면 계정 정보와 서비스 이용 내역을 되돌릴 수 없습니다.
          </Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.secondaryButton} disabled={loading} onPress={onCancel}>
              <Text style={styles.secondaryButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryDangerButton, loading && styles.disabledButton]} disabled={loading} onPress={onConfirm}>
              {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.primaryDangerButtonText}>탈퇴하기</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function NoticeModal({ notice, onClose }: { notice: SettingsNotice; onClose: () => void }) {
  return (
    <Modal visible={Boolean(notice)} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{notice?.title}</Text>
          <Text style={styles.modalDesc}>{notice?.body}</Text>
          <TouchableOpacity style={styles.fullPrimaryButton} onPress={onClose}>
            <Text style={styles.primaryDangerButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    height: 86,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '900', color: '#111827' },
  headerSpacer: { width: 44 },
  content: { paddingHorizontal: 24, paddingTop: 28 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginLeft: 4, marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    gap: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827' },
  dangerText: { color: '#EF4444' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.52)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalIconDanger: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconDangerLarge: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#111827', lineHeight: 30, marginBottom: 10 },
  modalDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', lineHeight: 22, marginBottom: 18 },
  passwordInput: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  passwordInputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { marginTop: 8, fontSize: 12, fontWeight: '800', color: '#EF4444', lineHeight: 18 },
  modalButtonRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '900', color: '#4B5563' },
  primaryDangerButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDangerButtonText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  fullPrimaryButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.6 },
});
