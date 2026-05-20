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
import { ArrowLeft, Camera, ChevronRight, Hash, Lock, Mail, Phone, UserRound, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { showLoginRequired } from '@/utils/authPrompt';
import {
  checkMyPageNickname,
  getMyPageApiErrorMessage,
  getMyPageProfile,
  updateMyPageNickname,
  updateMyPagePhone,
} from '@/features/mypage/api';

type EditableField = 'name' | 'phone';

const FIELD_META: Record<EditableField, { title: string; placeholder: string; keyboardType?: 'default' | 'phone-pad' }> = {
  name: { title: '닉네임 변경', placeholder: '새 닉네임을 입력하세요' },
  phone: { title: '전화번호 변경', placeholder: '새 전화번호를 입력하세요', keyboardType: 'phone-pad' },
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [saving, setSaving] = useState(false);

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
        };
        const changed = Object.entries(nextUser).some(([key, value]) => user[key as keyof typeof user] !== value);
        if (changed) {
          updateUser(nextUser);
        }
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

  const openEdit = (field: EditableField) => {
    setEditingField(field);
    setDraftValue(field === 'phone' ? user.phone ?? '' : displayName);
  };

  const closeEdit = () => {
    setEditingField(null);
    setDraftValue('');
  };

  const saveEdit = async () => {
    if (!editingField || saving) return;
    const value = draftValue.trim();
    if (!value) {
      Alert.alert('입력 확인', `${FIELD_META[editingField].title.replace(' 변경', '')}을 입력해주세요.`);
      return;
    }

    try {
      setSaving(true);
      if (editingField === 'name') {
        if (value !== displayName) {
          const check = await checkMyPageNickname(value);
          if (!check.isAvailable) {
            Alert.alert('닉네임 확인', '이미 사용 중인 닉네임입니다.');
            return;
          }
        }
        const result = await updateMyPageNickname(value);
        await updateUser({ name: result.nickname, breweryName: user.type === 'brewery' ? result.nickname : user.breweryName });
      } else {
        const phoneNumber = value.replace(/\D/g, '');
        if (!phoneNumber) {
          Alert.alert('전화번호 확인', '전화번호는 숫자를 포함해야 합니다.');
          return;
        }
        const result = await updateMyPagePhone(phoneNumber);
        await updateUser({ phone: result.phoneNumber });
      }
      Alert.alert('저장 완료', `${FIELD_META[editingField].title.replace(' 변경', '')}이 변경되었습니다.`);
      closeEdit();
    } catch (error) {
      Alert.alert('저장 실패', getMyPageApiErrorMessage(error, '프로필 정보를 저장하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '프로필 사진을 변경하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]?.uri) return;
    await updateUser({ profileImage: result.assets[0].uri });
    Alert.alert('저장 완료', '프로필 사진이 변경되었습니다.');
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
            <TouchableOpacity style={styles.cameraButton} onPress={pickProfileImage} activeOpacity={0.85}>
              <Camera size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>계정 정보</Text>
        <View style={styles.card}>
          <InfoRow icon={<UserRound size={18} color="#4B5563" />} label="닉네임" value={displayName} onPress={() => openEdit('name')} />
          <InfoRow icon={<Phone size={18} color="#4B5563" />} label="전화번호" value={user.phone || '전화번호 없음'} onPress={() => openEdit('phone')} />
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
              <Text style={styles.sheetTitle}>{editingField ? FIELD_META[editingField].title : ''}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeEdit}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={draftValue}
              onChangeText={setDraftValue}
              placeholder={editingField ? FIELD_META[editingField].placeholder : ''}
              placeholderTextColor="#9CA3AF"
              keyboardType={editingField ? FIELD_META[editingField].keyboardType ?? 'default' : 'default'}
              autoCapitalize="none"
            />
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
    minHeight: 154,
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
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  saveButton: { height: 54, borderRadius: 14, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
