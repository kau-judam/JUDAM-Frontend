import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Building2, Mail, Phone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';

type BreweryProfileForm = {
  breweryName: string;
  brandStory: string;
  description: string;
  brandStoryLong: string;
  history: string;
  address: string;
  businessNumber: string;
  representative: string;
  phone: string;
  email: string;
  established: string;
};

const DEFAULT_PROFILE: BreweryProfileForm = {
  breweryName: '솔샘양조장',
  brandStory: '전통주 장인',
  description: '백두대간의 청정수와 우리 쌀로 빚어내는 전통의 맛. 40년간 정성을 다해 전통주를 빚어온 장인의 양조장입니다.',
  brandStoryLong: '40년 전통을 이어온 솔샘양조장은 백두대간의 맑은 물과 우리 땅에서 자란 쌀만을 사용합니다. 3대째 이어져 내려오는 전통 방식으로 정직하게 술을 빚으며, 한 잔 한 잔에 장인의 정성을 담아냅니다.',
  history: '1985년 설립되어 3대째 이어져 내려오는 전통주 양조장입니다. 우리 쌀과 전통 누룩만을 사용하여 정직하게 술을 빚고 있습니다.',
  address: '경기도 양평군 청운면 솔샘로 123',
  businessNumber: '123-45-67890',
  representative: '홍길동',
  phone: '010-1234-5678',
  email: 'solsaem@brewery.com',
  established: '1985',
};

export default function BreweryProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { user, updateUser } = useAuth();
  const { projects } = useFunding();
  const breweryId = Array.isArray(id) ? id[0] : id;
  const isOwnProfile = breweryId === 'profile';
  const projectId = Number(breweryId);
  const project = useMemo(
    () => (!Number.isNaN(projectId) ? projects.find((item) => item.id === projectId) || null : null),
    [projectId, projects],
  );
  const profileValues = useMemo<BreweryProfileForm>(() => ({
    ...DEFAULT_PROFILE,
    breweryName: isOwnProfile ? user?.breweryName || DEFAULT_PROFILE.breweryName : project?.brewery || DEFAULT_PROFILE.breweryName,
    description: project?.breweryBio || DEFAULT_PROFILE.description,
    history: project?.breweryBio || DEFAULT_PROFILE.history,
    address: isOwnProfile ? user?.breweryLocation || DEFAULT_PROFILE.address : project?.location || DEFAULT_PROFILE.address,
    businessNumber: isOwnProfile ? user?.businessNumber || DEFAULT_PROFILE.businessNumber : DEFAULT_PROFILE.businessNumber,
    representative: user?.name || DEFAULT_PROFILE.representative,
    phone: user?.phone || DEFAULT_PROFILE.phone,
    email: user?.email || DEFAULT_PROFILE.email,
  }), [isOwnProfile, project?.brewery, project?.breweryBio, project?.location, user]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<BreweryProfileForm>(profileValues);

  useEffect(() => {
    if (!isEditing) setForm(profileValues);
  }, [isEditing, profileValues]);

  if (isOwnProfile && !user) {
    return (
      <View style={[styles.guardContainer, { paddingTop: insets.top }]}>
        <Text style={styles.guardTitle}>로그인이 필요합니다</Text>
        <Text style={styles.guardDesc}>양조장 프로필은 로그인 후 확인할 수 있습니다.</Text>
        <TouchableOpacity style={styles.guardButton} onPress={() => router.replace('/(auth)/login' as any)}>
          <Text style={styles.guardButtonText}>로그인하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const updateField = (key: keyof BreweryProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openVerificationEdit = () => {
    router.push('/brewery/verification' as any);
  };

  const handleSave = async () => {
    if (!form.breweryName.trim() || !form.address.trim()) {
      Alert.alert('알림', '양조장명과 소재지를 입력해주세요.');
      return;
    }

    await updateUser({
      breweryName: form.breweryName.trim(),
      breweryLocation: form.address.trim(),
      name: form.representative.trim() || user?.name,
      email: form.email.trim() || user?.email,
    });
    setIsEditing(false);
    Alert.alert('완료', '양조장 프로필이 수정되었습니다.');
  };

  const handleCancel = () => {
    setForm(profileValues);
    setIsEditing(false);
  };

  const handleCall = () => {
    if (isEditing) {
      openVerificationEdit();
      return;
    }
    Linking.openURL(`tel:${form.phone}`);
  };

  const handleEmail = () => {
    if (isEditing) return;
    Linking.openURL(`mailto:${form.email}`);
  };

  const canEditInline = isOwnProfile && isEditing;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => (isEditing ? handleCancel() : router.back())}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>양조장 프로필</Text>
        {isOwnProfile ? (
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={styles.editButton}
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>{isEditing ? '저장' : '수정'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Building2 size={88} color="rgba(255,255,255,0.2)" />
          <View style={styles.heroOverlay}>
            <EditableText
              value={form.breweryName}
              editable={canEditInline}
              onChangeText={(value) => updateField('breweryName', value)}
              textStyle={styles.heroTitle}
              inputStyle={[styles.editInput, styles.heroTitleInput]}
            />
            <View style={styles.storyBadge}>
              <EditableText
                value={form.brandStory}
                editable={canEditInline}
                onChangeText={(value) => updateField('brandStory', value)}
                textStyle={styles.storyBadgeText}
                inputStyle={[styles.editInput, styles.storyBadgeInput]}
              />
            </View>
            <EditableText
              value={form.description}
              editable={canEditInline}
              onChangeText={(value) => updateField('description', value)}
              textStyle={styles.heroDesc}
              inputStyle={[styles.editInput, styles.heroDescInput]}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>브랜드 스토리</Text>
          <View style={styles.storyCard}>
            <EditableText
              value={form.brandStoryLong}
              editable={canEditInline}
              onChangeText={(value) => updateField('brandStoryLong', value)}
              textStyle={styles.storyText}
              inputStyle={[styles.editInput, styles.longInput]}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>양조장 소개</Text>
          <View style={styles.whiteCard}>
            <EditableText
              value={form.history}
              editable={canEditInline}
              onChangeText={(value) => updateField('history', value)}
              textStyle={styles.bodyText}
              inputStyle={[styles.editInput, styles.longInput]}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>기본 정보</Text>
          <View style={styles.infoList}>
            <ProfileInfoItem label="설립연도" value={form.established} suffix="년" editable={canEditInline} onChangeText={(value) => updateField('established', value)} />
            <ProfileInfoItem label="대표자명" value={form.representative} editable={canEditInline} onChangeText={(value) => updateField('representative', value)} />
            <ProfileInfoItem label="소재지" value={form.address} editable={canEditInline} onChangeText={(value) => updateField('address', value)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>사업자 정보</Text>
          <TouchableOpacity
            style={[styles.businessCard, isEditing && styles.lockedEditCard]}
            activeOpacity={isEditing ? 0.85 : 1}
            onPress={isEditing ? openVerificationEdit : undefined}
          >
            <Text style={styles.businessLabel}>사업자등록번호</Text>
            <Text style={styles.businessValue}>{form.businessNumber}</Text>
            {isEditing && <Text style={styles.lockedEditHint}>정보 수정 페이지에서 변경</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>문의하기</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={[styles.contactCard, isEditing && styles.lockedEditCard]} onPress={handleCall} activeOpacity={0.85}>
              <View style={styles.contactIcon}>
                <Phone size={20} color="#FFF" />
              </View>
              <Text style={styles.contactLabel}>전화</Text>
              <Text style={styles.contactValue} numberOfLines={1}>{form.phone}</Text>
              {isEditing && <Text style={styles.lockedEditHint}>정보 수정 페이지</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail} activeOpacity={isEditing ? 1 : 0.85}>
              <View style={styles.contactIcon}>
                <Mail size={20} color="#FFF" />
              </View>
              <Text style={styles.contactLabel}>이메일</Text>
              {canEditInline ? (
                <TextInput
                  value={form.email}
                  onChangeText={(value) => updateField('email', value)}
                  style={[styles.editInput, styles.contactInput]}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.contactValue} numberOfLines={1}>{form.email}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function EditableText({
  value,
  editable,
  onChangeText,
  textStyle,
  inputStyle,
  multiline,
}: {
  value: string;
  editable: boolean;
  onChangeText: (value: string) => void;
  textStyle: object;
  inputStyle: object;
  multiline?: boolean;
}) {
  if (editable) {
    return (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
        multiline={multiline}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    );
  }

  return <Text style={textStyle}>{value}</Text>;
}

function ProfileInfoItem({
  label,
  value,
  suffix,
  editable,
  onChangeText,
}: {
  label: string;
  value: string;
  suffix?: string;
  editable: boolean;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoDot} />
      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        {editable ? (
          <View style={styles.infoInputRow}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              style={[styles.editInput, styles.infoInput]}
              placeholderTextColor="#9CA3AF"
            />
            {suffix && <Text style={styles.infoSuffix}>{suffix}</Text>}
          </View>
        ) : (
          <Text style={styles.infoValue}>{suffix ? `${value}${suffix}` : value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  guardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, backgroundColor: '#FFF' },
  guardTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  guardDesc: { fontSize: 14, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  guardButton: { height: 48, paddingHorizontal: 22, borderRadius: 14, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  guardButtonText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  header: {
    minHeight: 60,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#111827' },
  editButton: { minWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  editButtonText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  content: { paddingBottom: 36 },
  hero: {
    height: 320,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 70,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  heroTitle: { fontSize: 34, lineHeight: 40, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12 },
  storyBadge: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 14 },
  storyBadgeText: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  heroDesc: { fontSize: 14, lineHeight: 21, fontWeight: '600', color: 'rgba(255,255,255,0.82)', textAlign: 'center' },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 14 },
  sectionEyebrow: { fontSize: 12, fontWeight: '900', color: '#9CA3AF', marginBottom: 14 },
  storyCard: { borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F3F4F6' },
  storyText: { fontSize: 14, lineHeight: 23, fontWeight: '600', color: '#1F2937' },
  whiteCard: { borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
  bodyText: { fontSize: 14, lineHeight: 22, fontWeight: '600', color: '#4B5563' },
  infoList: { gap: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#9CA3AF', marginTop: 8 },
  infoTextBox: { flex: 1 },
  infoLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  infoValue: { fontSize: 14, lineHeight: 20, fontWeight: '800', color: '#111827' },
  infoInputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoInput: { flex: 1, minHeight: 40, color: '#111827' },
  infoSuffix: { fontSize: 14, fontWeight: '800', color: '#111827' },
  businessCard: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
  businessLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 3 },
  businessValue: { fontSize: 14, fontWeight: '800', color: '#111827' },
  contactGrid: { flexDirection: 'row', gap: 12 },
  contactCard: { flex: 1, minHeight: 132, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 12 },
  contactIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  contactLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  contactValue: { maxWidth: '100%', fontSize: 12, fontWeight: '900', color: '#111827' },
  contactInput: { width: '100%', minHeight: 36, textAlign: 'center', fontSize: 12, fontWeight: '900', color: '#111827' },
  editInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  heroTitleInput: { width: '100%', fontSize: 28, lineHeight: 34, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  storyBadgeInput: { minWidth: 120, fontSize: 13, textAlign: 'center', paddingVertical: 4 },
  heroDescInput: { width: '100%', minHeight: 76, textAlign: 'center', fontSize: 14, lineHeight: 21 },
  longInput: { minHeight: 118, lineHeight: 22 },
  lockedEditCard: { borderColor: '#111827' },
  lockedEditHint: { marginTop: 6, fontSize: 10, fontWeight: '800', color: '#6B7280' },
});
