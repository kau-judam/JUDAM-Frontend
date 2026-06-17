import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, CheckCircle2, ChevronRight, Hash, Lock, Mail, Phone, UserRound, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import {
  checkMyPageNickname,
  getMyPageApiErrorMessage,
  getMyPageProfile,
  updateMyPageNickname,
  updateMyPageProfileImage,
} from '@/features/mypage/api';
import { showLoginRequired } from '@/utils/authPrompt';
import { formatPhoneNumber } from '@/utils/validation';

type EditableField = 'nickname';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  useEffect(() => {
    if (!user) {
      showLoginRequired('프로필은 로그인 후 이용할 수 있어요.');
      router.replace('/login' as any);
      return;
    }

    let mounted = true;
    getMyPageProfile()
      .then((profile) => {
        if (!mounted) return;
        const nextUser = {
          id: profile.userId || user.id,
          uid: profile.userId || user.uid,
          name: profile.nickname || user.name,
          email: profile.email || user.email,
          phone: profile.phoneNumber || undefined,
          profileImage: profile.profileImageUrl || undefined,
          breweryProfileImage: profile.profileImageUrl || user.breweryProfileImage,
        };
        const changed = Object.entries(nextUser).some(([key, value]) => user[key as keyof typeof user] !== value);
        if (changed) updateUser(nextUser);
      })
      .catch((error) => {
        console.warn(getMyPageApiErrorMessage(error, '프로필 정보를 불러오지 못했습니다.'));
      });

    return () => {
      mounted = false;
    };
  }, [updateUser, user]);

  if (!user) return null;

  const displayName = user.type === 'brewery' ? user.breweryName || user.name : user.name;
  const profileImage = user.profileImage;
  const formattedPhone = user.phone ? formatPhoneNumber(user.phone) : '';

  const openEdit = (field: EditableField) => {
    setEditingField(field);
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);
    setDraftValue(displayName);
  };

  const closeEdit = () => {
    setEditingField(null);
    setDraftValue('');
    setSaving(false);
  };

  const handleDraftChange = (value: string) => {
    setDraftValue(value);
    if (editingField === 'nickname') {
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
    }
  };

  const handleCheckNickname = async () => {
    const nickname = draftValue.trim();
    if (nickname.length < 2 || nickname.length > 12) {
      Alert.alert('닉네임 확인', '닉네임은 2자 이상 12자 이하로 입력해주세요.');
      return;
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      Alert.alert('닉네임 확인', '닉네임은 한글, 영문, 숫자만 사용할 수 있어요.');
      return;
    }
    if (nickname === displayName) {
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
      Alert.alert('닉네임 확인', '현재 사용 중인 닉네임입니다.');
      return;
    }

    try {
      setSaving(true);
      const result = await checkMyPageNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(result.isAvailable);
      Alert.alert('닉네임 확인', result.isAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
    } catch (error) {
      Alert.alert('확인 실패', getMyPageApiErrorMessage(error, '닉네임 중복 확인에 실패했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingField || saving) return;
    const value = draftValue.trim();
    if (!value) {
      Alert.alert('입력 확인', '변경할 값을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      if (editingField === 'nickname') {
        if (!isNicknameChecked || !isNicknameAvailable) {
          Alert.alert('닉네임 확인', '닉네임 중복 확인을 완료해주세요.');
          return;
        }
        const result = await updateMyPageNickname(value);
        await updateUser({
          name: result.nickname,
          breweryName: user.type === 'brewery' ? result.nickname : user.breweryName,
        });
      }

      Alert.alert('저장 완료', '프로필 정보가 변경되었습니다.');
      closeEdit();
    } catch (error) {
      Alert.alert('저장 실패', getMyPageApiErrorMessage(error, '프로필 정보를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const pickProfileImage = async () => {
    if (saving) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '프로필 사진을 변경하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    try {
      setSaving(true);
      const response = await updateMyPageProfileImage({
        uri: asset.uri,
        name: asset.fileName || asset.uri.split('/').pop() || `profile-${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      });
      await updateUser({
        profileImage: response.profileImageUrl,
        breweryProfileImage: response.profileImageUrl,
      });
      Alert.alert('저장 완료', '프로필 이미지가 변경되었습니다.');
    } catch (error) {
      Alert.alert('저장 실패', getMyPageApiErrorMessage(error, '프로필 이미지를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}>
        <View style={styles.profileImageCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.largeAvatar}>
              {profileImage ? <Image source={{ uri: profileImage }} style={styles.avatarImage} /> : <UserRound size={42} color="#9CA3AF" />}
            </View>
            <TouchableOpacity
              style={[styles.cameraButton, saving && styles.cameraButtonDisabled]}
              onPress={pickProfileImage}
              activeOpacity={0.85}
              disabled={saving}
            >
              <Camera size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>계정 정보</Text>
        <View style={styles.card}>
          <InfoRow icon={<UserRound size={18} color="#4B5563" />} label="닉네임" value={displayName} onPress={() => openEdit('nickname')} />
          <InfoRow icon={<Phone size={18} color="#4B5563" />} label="전화번호" value={formattedPhone || '전화번호 없음'} />
          <InfoRow icon={<Mail size={18} color="#4B5563" />} label="이메일" value={user.email || '이메일 없음'} last />
        </View>

        <View style={styles.card}>
          <InfoRow icon={<Lock size={18} color="#4B5563" />} label="비밀번호" value="********" onPress={() => router.push('/mypage/profile/password' as any)} />
          <InfoRow icon={<Hash size={18} color="#4B5563" />} label="사용자 고유 ID" value={user.id || user.uid} last />
        </View>
      </ScrollView>

      <Modal visible={!!editingField} animationType="slide" transparent onRequestClose={closeEdit}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDim} activeOpacity={1} onPress={closeEdit} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{getSheetTitle(editingField)}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeEdit}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{getInputLabel(editingField)}</Text>
                {editingField === 'nickname' && isNicknameChecked && isNicknameAvailable ? <VerifiedLabel text="사용 가능" /> : null}
              </View>
              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  {editingField === 'nickname' ? <UserRound size={18} color="#9CA3AF" style={styles.inputIcon} /> : null}
                  <TextInput
                    style={styles.input}
                    value={draftValue}
                    onChangeText={handleDraftChange}
                    placeholder={getPlaceholder(editingField)}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {editingField === 'nickname' ? (
                  <TouchableOpacity
                    style={[styles.smallButton, isNicknameChecked && isNicknameAvailable ? styles.smallButtonDone : null]}
                    onPress={handleCheckNickname}
                    disabled={saving || (isNicknameChecked && isNicknameAvailable)}
                  >
                    <Text style={styles.smallButtonText}>{isNicknameChecked && isNicknameAvailable ? '확인완료' : '중복확인'}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {getHelperText(editingField) ? <Text style={styles.helperText}>{getHelperText(editingField)}</Text> : null}
            </View>

            <TouchableOpacity style={[styles.saveButton, saving && styles.disabledButton]} onPress={saveEdit} activeOpacity={0.85} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? '저장 중...' : '저장'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.infoRow, !last && styles.infoBorder]} onPress={onPress} disabled={!onPress} activeOpacity={0.8}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>{icon}</View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <View style={styles.infoRight}>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
        {onPress ? <ChevronRight size={16} color="#D1D5DB" /> : null}
      </View>
    </TouchableOpacity>
  );
}

function VerifiedLabel({ text }: { text: string }) {
  return (
    <View style={styles.verifiedLabel}>
      <CheckCircle2 size={14} color="#059669" />
      <Text style={styles.verifiedLabelText}>{text}</Text>
    </View>
  );
}

function getSheetTitle(field: EditableField | null) {
  if (field === 'nickname') return '닉네임 변경';
  return '';
}

function getInputLabel(field: EditableField | null) {
  if (field === 'nickname') return '닉네임';
  return '';
}

function getPlaceholder(field: EditableField | null) {
  if (field === 'nickname') return '새 닉네임을 입력하세요';
  return '';
}

function getHelperText(field: EditableField | null) {
  if (field === 'nickname') return '2~12자, 한글/영문/숫자만 사용할 수 있어요.';
  return '';
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '900', color: '#111827' },
  headerSpacer: { width: 44 },
  content: { paddingHorizontal: 24, paddingTop: 22 },
  profileImageCard: {
    minHeight: 172,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  avatarWrap: { width: 96, height: 96 },
  largeAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  cameraButton: {
    position: 'absolute',
    right: -1,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },
  cameraButtonDisabled: { opacity: 0.55 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginLeft: 4, marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: '#EEF0F3' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: '50%' },
  infoValue: { flexShrink: 1, fontSize: 13, fontWeight: '700', color: '#6B7280', textAlign: 'right' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 22 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inputGroup: { gap: 7 },
  labelRow: { minHeight: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '700', color: '#374151' },
  verifiedLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedLabelText: { fontSize: 11, fontWeight: '800', color: '#059669' },
  row: { flexDirection: 'row', gap: 8 },
  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  smallButton: {
    height: 52,
    minWidth: 88,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonDone: { backgroundColor: '#059669' },
  smallButtonText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
  helperText: { fontSize: 11.5, fontWeight: '700', color: '#9CA3AF', marginLeft: 2 },
  saveButton: { height: 54, borderRadius: 14, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
