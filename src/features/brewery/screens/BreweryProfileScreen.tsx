import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Building2, Camera, Mail, Phone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import {
  getBreweryApiErrorMessage,
  getBreweryProfile,
  getPublicBreweryProfile,
  updateBreweryProfile,
  uploadBreweryProfileImage,
  type BreweryProfile,
} from '@/features/brewery/api';
import { pickSingleImage } from '@/utils/imagePicker';

type BreweryProfileForm = {
  profileImage?: string;
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
  breweryName: '',
  brandStory: '',
  description: '',
  brandStoryLong: '',
  history: '',
  address: '',
  businessNumber: '',
  representative: '',
  phone: '',
  email: '',
  established: '',
};

const PROFILE_PLACEHOLDERS: BreweryProfileForm = {
  breweryName: '양조장 이름',
  brandStory: '한 줄 소개',
  description: '양조장을 간단히 소개해주세요.',
  brandStoryLong: '양조장의 철학과 이야기를 작성해주세요.',
  history: '양조장의 연혁과 술 빚는 방식을 작성해주세요.',
  address: '양조장 소재지',
  businessNumber: '사업자등록번호',
  representative: '대표자명',
  phone: '전화번호',
  email: '이메일',
  established: '설립연도',
};

export default function BreweryProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id, edit, fundingId } = useLocalSearchParams();
  const { user, updateUser } = useAuth();
  const updateUserRef = useRef(updateUser);
  const { projects } = useFunding();
  const breweryId = Array.isArray(id) ? id[0] : id;
  const editParam = Array.isArray(edit) ? edit[0] : edit;
  const fundingIdParam = Array.isArray(fundingId) ? fundingId[0] : fundingId;
  const isOwnProfile = breweryId === 'profile';
  const projectId = Number(fundingIdParam || breweryId);
  const project = useMemo(
    () => {
      if (!Number.isNaN(projectId)) {
        const foundByFundingId = projects.find((item) => item.id === projectId);
        if (foundByFundingId) return foundByFundingId;
      }
      if (breweryId && breweryId !== 'profile') {
        return projects.find((item) => String(item.breweryUserId || item.breweryInfo?.breweryUserId || '') === String(breweryId)) || null;
      }
      return null;
    },
    [breweryId, projectId, projects],
  );
  const isOwnProjectProfile = useMemo(
    () => Boolean(!isOwnProfile && project && isFundingProjectOwnedByBrewery(user, project)),
    [isOwnProfile, project, user],
  );
  const usesDashboardProfile = isOwnProfile || isOwnProjectProfile;
  const [serverProfile, setServerProfile] = useState<BreweryProfile | null>(null);
  const [publicProfile, setPublicProfile] = useState<BreweryProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPublicProfileLoading, setIsPublicProfileLoading] = useState(false);
  const publicBreweryUserId = !usesDashboardProfile
    ? project?.breweryInfo?.breweryUserId || project?.breweryUserId || breweryId || ''
    : '';
  const projectBreweryInfo = project?.breweryInfo;
  const projectBreweryAddress = [
    projectBreweryInfo?.address || projectBreweryInfo?.businessAddress || project?.location,
    projectBreweryInfo?.businessAddressDetail,
  ].filter(Boolean).join(' ');
  const profileValues = useMemo<BreweryProfileForm>(() => {
    if (usesDashboardProfile) {
      return {
        ...DEFAULT_PROFILE,
        profileImage: serverProfile?.profileImageUrl || '',
        breweryName: serverProfile?.breweryName || '',
        brandStory: serverProfile?.oneLineIntroduction || '',
        description: serverProfile?.shortIntroduction || '',
        brandStoryLong: serverProfile?.brandStory || '',
        history: serverProfile?.history || '',
        address: serverProfile?.address || '',
        businessNumber: serverProfile?.businessRegistrationNumber || '',
        representative: serverProfile?.representativeName || '',
        phone: serverProfile?.phoneNumber || '',
        email: serverProfile?.email || '',
        established: String(serverProfile?.establishedYear || ''),
      };
    }

    return {
      ...DEFAULT_PROFILE,
      profileImage: publicProfile?.profileImageUrl || projectBreweryInfo?.profileImageUrl || project?.breweryProfileImage || '',
      breweryName: publicProfile?.breweryName || projectBreweryInfo?.mainName || projectBreweryInfo?.breweryName || project?.brewery || '',
      brandStory: publicProfile?.oneLineIntroduction || projectBreweryInfo?.oneLineIntroduction || projectBreweryInfo?.shortIntroduction || '',
      description: publicProfile?.shortIntroduction || projectBreweryInfo?.shortIntroduction || project?.breweryBio || '',
      brandStoryLong: publicProfile?.brandStory || projectBreweryInfo?.brandStory || '',
      history: publicProfile?.history || projectBreweryInfo?.history || project?.breweryBio || '',
      address: publicProfile?.address || projectBreweryAddress || '',
      businessNumber: publicProfile?.businessRegistrationNumber || projectBreweryInfo?.businessRegistrationNumber || '',
      representative: publicProfile?.representativeName || projectBreweryInfo?.representativeName || '',
      phone: '',
      email: '',
      established: String(publicProfile?.establishedYear || projectBreweryInfo?.establishedYear || ''),
    };
  }, [project?.brewery, project?.breweryBio, project?.breweryProfileImage, projectBreweryAddress, projectBreweryInfo, publicProfile, serverProfile, usesDashboardProfile]);
  const [isEditing, setIsEditing] = useState(isOwnProfile && editParam === '1');
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<BreweryProfileForm>(profileValues);

  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);

  useEffect(() => {
    if (!usesDashboardProfile) {
      setServerProfile(null);
      setIsProfileLoading(false);
      return;
    }

    let mounted = true;
    setIsProfileLoading(true);
    getBreweryProfile()
      .then((profile) => {
        if (!mounted) return;
        setServerProfile(profile);
        void updateUserRef.current({
          breweryName: profile.breweryName || undefined,
          breweryLocation: profile.address || undefined,
          breweryBrandStory: profile.oneLineIntroduction || undefined,
          breweryDescription: profile.shortIntroduction || undefined,
          breweryBrandStoryLong: profile.brandStory || undefined,
          breweryHistory: profile.history || undefined,
          breweryEstablished: profile.establishedYear ? String(profile.establishedYear) : undefined,
          breweryProfileImage: profile.profileImageUrl || undefined,
          businessNumber: profile.businessRegistrationNumber || undefined,
          phone: profile.phoneNumber || undefined,
          breweryContactEmail: profile.email || undefined,
        });
      })
      .catch((error) => {
        console.warn(getBreweryApiErrorMessage(error, '양조장 프로필을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (mounted) setIsProfileLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [
    usesDashboardProfile,
  ]);

  useEffect(() => {
    if (isOwnProfile || !publicBreweryUserId) {
      setPublicProfile(null);
      setIsPublicProfileLoading(false);
      return;
    }

    let mounted = true;
    setIsPublicProfileLoading(true);
    getPublicBreweryProfile(publicBreweryUserId)
      .then((profile) => {
        if (!mounted) return;
        setPublicProfile(profile);
      })
      .catch((error) => {
        if (!mounted) return;
        setPublicProfile(null);
        console.warn(getBreweryApiErrorMessage(error, '양조장 공개 프로필을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (mounted) setIsPublicProfileLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOwnProfile, publicBreweryUserId]);

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

  const isPublicProfileIncomplete =
    !isOwnProfile &&
    !isProfileLoading &&
    !isPublicProfileLoading &&
    ![
    profileValues.breweryName,
    profileValues.profileImage,
    profileValues.brandStory,
    profileValues.description,
    profileValues.brandStoryLong,
    profileValues.history,
    profileValues.established,
  ].some((value) => String(value || '').trim());

  if (isPublicProfileIncomplete) {
    return (
      <View style={[styles.guardContainer, { paddingTop: insets.top }]}>
        <Text style={styles.guardTitle}>아직 준비 중인 양조장입니다</Text>
        <Text style={styles.guardDesc}>양조장이 프로필 소개를 작성하면 확인할 수 있습니다.</Text>
        <TouchableOpacity style={styles.guardButton} onPress={() => router.back()}>
          <Text style={styles.guardButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const updateField = (key: keyof BreweryProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickProfileImage = async () => {
    if (!canEditInline || isSaving) return;

    const result = await pickSingleImage('brewery-profile', 0.85, {
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled && result.denied) {
      Alert.alert('권한 필요', '대표 이미지를 변경하려면 갤러리 접근 권한이 필요합니다.');
      return;
    }
    if (result.canceled) return;

    updateField('profileImage', result.file.uri);

    try {
      setIsSaving(true);
      const response = await uploadBreweryProfileImage(result.file);
      const nextProfileImage = response.profile?.profileImageUrl || response.profileImageUrl;
      updateField('profileImage', nextProfileImage);
      if (response.profile) setServerProfile(response.profile);
      await updateUser({ breweryProfileImage: nextProfileImage });
    } catch (error) {
      Alert.alert('오류', getBreweryApiErrorMessage(error, '대표 이미지를 업로드하지 못했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  const openVerificationEdit = () => {
    router.push('/brewery/verification' as any);
  };

  const handleSave = async () => {
    if (!form.breweryName.trim() || !form.address.trim()) {
      Alert.alert('알림', '양조장명과 소재지를 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      if (isOwnProfile && user?.isBreweryVerified) {
        const profile = await updateBreweryProfile({
          profileImageUrl: form.profileImage?.trim() || null,
          breweryName: form.breweryName.trim(),
          oneLineIntroduction: form.brandStory.trim() || null,
          shortIntroduction: form.description.trim() || null,
          brandStory: form.brandStoryLong.trim() || null,
          history: form.history.trim() || null,
          establishedYear: form.established.trim() ? Number(form.established.trim()) || form.established.trim() : null,
          representativeName: form.representative.trim() || null,
          address: form.address.trim(),
          email: form.email.trim() || null,
        });
        setServerProfile(profile);
      }
      await updateUser({
        breweryName: form.breweryName.trim(),
        breweryLocation: form.address.trim(),
        breweryBrandStory: form.brandStory.trim(),
        breweryDescription: form.description.trim(),
        breweryBrandStoryLong: form.brandStoryLong.trim(),
        breweryHistory: form.history.trim(),
        breweryEstablished: form.established.trim(),
        breweryProfileImage: form.profileImage?.trim() || undefined,
        breweryContactEmail: form.email.trim() || undefined,
      });
      setIsEditing(false);
      Alert.alert('완료', '양조장 프로필이 수정되었습니다.');
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '양조장 프로필을 수정하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profileValues);
    setIsEditing(false);
  };

  const handleBack = () => {
    if (isEditing) {
      handleCancel();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isOwnProfile ? '/brewery/dashboard' : '/(tabs)/funding' as any);
  };

  const handleCall = () => {
    if (isEditing) {
      openVerificationEdit();
      return;
    }
    if (!form.phone.trim()) return;
    Linking.openURL(`tel:${form.phone}`);
  };

  const handleEmail = () => {
    if (isEditing) return;
    if (!form.email.trim()) return;
    Linking.openURL(`mailto:${form.email}`);
  };

  const canEditInline = isOwnProfile && isEditing;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} pointerEvents="none">양조장 프로필</Text>
        {isOwnProfile ? (
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={styles.editButton}
            accessibilityRole="button"
            disabled={isSaving}
          >
            <Text style={styles.editButtonText}>{isSaving ? '저장중' : isEditing ? '저장' : '수정'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {form.profileImage ? (
            <Image source={{ uri: form.profileImage }} style={styles.heroImage} />
          ) : (
            <Building2 size={88} color="rgba(255,255,255,0.2)" />
          )}
          <View style={styles.heroOverlay}>
            {canEditInline && (
              <TouchableOpacity
                style={styles.heroImageButton}
                activeOpacity={0.85}
                onPress={pickProfileImage}
                disabled={isSaving}
              >
                <Camera size={16} color="#FFF" />
                <Text style={styles.heroImageButtonText}>대표 이미지 수정</Text>
              </TouchableOpacity>
            )}
            <EditableText
              value={form.breweryName}
              placeholder={PROFILE_PLACEHOLDERS.breweryName}
              editable={canEditInline}
              onChangeText={(value) => updateField('breweryName', value)}
              textStyle={styles.heroTitle}
              inputStyle={[styles.editInput, styles.heroTitleInput]}
            />
            <View style={styles.storyBadge}>
              <EditableText
                value={form.brandStory}
                placeholder={PROFILE_PLACEHOLDERS.brandStory}
                editable={canEditInline}
                onChangeText={(value) => updateField('brandStory', value)}
                textStyle={styles.storyBadgeText}
                inputStyle={[styles.editInput, styles.storyBadgeInput]}
              />
            </View>
            <EditableText
              value={form.description}
              placeholder={PROFILE_PLACEHOLDERS.description}
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
              placeholder={PROFILE_PLACEHOLDERS.brandStoryLong}
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
              placeholder={PROFILE_PLACEHOLDERS.history}
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
            <ProfileInfoItem label="설립연도" value={form.established} suffix="년" placeholder={PROFILE_PLACEHOLDERS.established} editable={canEditInline} onChangeText={(value) => updateField('established', value)} />
            <ProfileInfoItem label="대표자명" value={form.representative} placeholder={PROFILE_PLACEHOLDERS.representative} editable={canEditInline} onChangeText={(value) => updateField('representative', value)} />
            <ProfileInfoItem label="소재지" value={form.address} placeholder={PROFILE_PLACEHOLDERS.address} editable={canEditInline} onChangeText={(value) => updateField('address', value)} />
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
            <Text style={form.businessNumber ? styles.businessValue : styles.placeholderText}>{form.businessNumber || PROFILE_PLACEHOLDERS.businessNumber}</Text>
            {isEditing && <Text style={styles.lockedEditHint}>정보 수정 페이지에서 변경</Text>}
          </TouchableOpacity>
        </View>

        {(isOwnProfile || form.phone || form.email) && (
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>문의하기</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={[styles.contactCard, isEditing && styles.lockedEditCard]} onPress={handleCall} activeOpacity={0.85}>
              <View style={styles.contactIcon}>
                <Phone size={20} color="#FFF" />
              </View>
              <Text style={styles.contactLabel}>전화</Text>
              <Text style={form.phone ? styles.contactValue : styles.placeholderText} numberOfLines={1}>{form.phone || PROFILE_PLACEHOLDERS.phone}</Text>
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
                  placeholder={PROFILE_PLACEHOLDERS.email}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={form.email ? styles.contactValue : styles.placeholderText} numberOfLines={1}>{form.email || PROFILE_PLACEHOLDERS.email}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        )}
      </ScrollView>
    </View>
  );
}

function EditableText({
  value,
  placeholder,
  editable,
  onChangeText,
  textStyle,
  inputStyle,
  multiline,
}: {
  value: string;
  placeholder?: string;
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
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    );
  }

  return <Text style={value ? textStyle : [textStyle, styles.placeholderText]}>{value || placeholder}</Text>;
}

function ProfileInfoItem({
  label,
  value,
  placeholder,
  suffix,
  editable,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder?: string;
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
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
            />
            {suffix && <Text style={styles.infoSuffix}>{suffix}</Text>}
          </View>
        ) : (
          <Text style={value ? styles.infoValue : styles.placeholderText}>{value ? (suffix ? `${value}${suffix}` : value) : placeholder}</Text>
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
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  headerTitle: { position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#111827' },
  editButton: { minWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  editButtonText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  content: { paddingBottom: 36 },
  hero: {
    height: 320,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 70,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  heroImageButton: {
    position: 'absolute',
    top: 22,
    right: 20,
    minHeight: 38,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: 'rgba(17,24,39,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroImageButtonText: { fontSize: 12, fontWeight: '900', color: '#FFF' },
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
  placeholderText: { color: '#9CA3AF' },
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
