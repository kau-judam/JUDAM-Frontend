import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { 
  ArrowLeft, 
  FileText, 
  Building2, 
  MapPin, 
  Phone, 
  Upload, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { AuthApiError, confirmPhoneVerification, getMyBreweryApplication, requestPhoneVerification, submitBreweryApplication, type BreweryApplicationResponse } from '@/features/auth/api';
import DaumAddressSearchModal, { type DaumAddressResult } from '@/features/funding/components/DaumAddressSearchModal';
import {
  PHONE_VERIFICATION_SMS_AFTER_OPEN_GUIDE,
  buildPhoneVerificationGuideMessage,
  buildPhoneVerificationRequestGuideMessage,
  openPhoneVerificationSmsApp,
} from '@/utils/phoneVerificationSms';
import { pickSingleImage } from '@/utils/imagePicker';
import { formatBusinessNumber, formatPhoneNumber, isValidBusinessNumber, isValidPhone } from '@/utils/validation';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BG_IMAGE = require('../../../../newpicutre/ok.jpg');
const MAX_LICENSE_FILE_SIZE = 10 * 1024 * 1024;

function getBusinessLicenseMimeType(fileName?: string | null, mimeType?: string | null) {
  if (mimeType?.trim()) return mimeType.trim();
  const normalizedName = String(fileName || '').toLowerCase();
  if (normalizedName.endsWith('.pdf')) return 'application/pdf';
  if (normalizedName.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
}

function getBusinessLicenseFileName(fileName?: string | null, mimeType?: string | null) {
  const trimmedName = fileName?.trim();
  if (trimmedName) return trimmedName;
  const normalizedMimeType = getBusinessLicenseMimeType(fileName, mimeType);
  if (normalizedMimeType === 'application/pdf') return 'business-license.pdf';
  if (normalizedMimeType === 'image/png') return 'business-license.png';
  return 'business-license.jpg';
}

type BusinessLicenseFile = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
  source: 'photo' | 'file';
};

type BreweryApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | '';

function getBreweryApplicationStatus(application: BreweryApplicationResponse | null): BreweryApplicationStatus {
  const status = String(application?.status || application?.application?.status || '').toUpperCase();
  if (status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED') return status;
  return '';
}

function getBreweryApplicationRejectReason(application: BreweryApplicationResponse | null) {
  return application?.rejectReason || application?.application?.rejectReason || '';
}

export default function BreweryVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { user, updateUser, verifyBrewery } = useAuth();
  const isEditMode = user?.isBreweryVerified || false;
  const shouldReturnToUserType = from === 'auth';
  
  const [formData, setFormData] = useState({
    businessNumber: user?.businessNumber || '',
    breweryName: user?.breweryName || '',
    breweryLocation: user?.breweryLocation || '',
    breweryLocationDetail: user?.breweryLocationDetail || '',
    phone: user?.phone || '',
  });
  
  const [businessLicense, setBusinessLicense] = useState<BusinessLicenseFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [verificationGuide, setVerificationGuide] = useState('');
  const [isVerificationChecking, setIsVerificationChecking] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(isEditMode);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [application, setApplication] = useState<BreweryApplicationResponse | null>(null);
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleBack = useCallback(() => {
    if (!isEditMode && shouldReturnToUserType) {
      router.replace('/(auth)/user-type' as any);
      return;
    }
    router.back();
  }, [isEditMode, shouldReturnToUserType]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });

      return () => subscription.remove();
    }, [handleBack])
  );

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setApplication(null);
      setIsApplicationLoading(false);
      return () => {
        mounted = false;
      };
    }

    setIsApplicationLoading(true);
    getMyBreweryApplication()
      .then((nextApplication) => {
        if (!mounted) return;
        setApplication(nextApplication);
        setShowApplicationForm(false);
      })
      .catch((error) => {
        if (!mounted) return;
        setApplication(null);
        setShowApplicationForm(false);
        if (!(error instanceof AuthApiError && error.status === 404)) {
          console.warn('[BreweryVerification] Failed to load my brewery application', error);
        }
      })
      .finally(() => {
        if (mounted) setIsApplicationLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const applicationStatus = useMemo(() => getBreweryApplicationStatus(application), [application]);
  const applicationRejectReason = useMemo(() => getBreweryApplicationRejectReason(application), [application]);
  const shouldShowApplicationStatus = isApplicationLoading || applicationStatus === 'PENDING' || applicationStatus === 'APPROVED' || applicationStatus === 'REJECTED';
  const shouldShowForm =
    isEditMode ||
    (!isApplicationLoading && (
      !applicationStatus ||
      (applicationStatus === 'REJECTED' && showApplicationForm)
    ));

  const applicationStatusTitle = isApplicationLoading
    ? '양조장 인증 신청 상태를 확인하고 있습니다.'
    : applicationStatus === 'PENDING'
      ? '양조장 인증 심사 중입니다.'
      : applicationStatus === 'APPROVED'
        ? '양조장 인증이 완료되었습니다.'
        : applicationStatus === 'REJECTED'
          ? '양조장 인증이 반려되었습니다.'
          : '';
  const applicationStatusDescription = applicationStatus === 'PENDING'
    ? '관리자 검토 후 승인 여부가 안내됩니다.'
    : applicationStatus === 'APPROVED'
      ? '이제 양조장 기능을 사용할 수 있습니다.'
      : applicationStatus === 'REJECTED'
        ? '반려 사유를 확인하고 다시 신청해주세요.'
        : '잠시만 기다려주세요.';

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={StyleSheet.absoluteFill}>
          <Image source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.62)' }]} />
        </View>
        <View style={[styles.authGuard, { paddingTop: insets.top + 80 }]}>
          <View style={styles.logoBox}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} />
          </View>
          <Text style={styles.authGuardTitle}>로그인이 필요합니다</Text>
          <Text style={styles.authGuardDesc}>
            양조장 인증은 회원가입 또는 로그인 후 진행할 수 있어요.
          </Text>
          <TouchableOpacity style={styles.authGuardPrimary} onPress={() => router.replace('/login' as any)}>
            <Text style={styles.authGuardPrimaryText}>로그인하러 가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authGuardSecondary} onPress={() => router.replace('/signup' as any)}>
            <Text style={styles.authGuardSecondaryText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSendVerification = async () => {
    if (!isValidPhone(formData.phone)) {
      Alert.alert('알림', '연락처를 정확히 입력해주세요.');
      return;
    }
    try {
      const result = await requestPhoneVerification(formData.phone);
      setVerificationCode(result.verificationCode || '');
      setIsVerificationSent(true);
      const smsOpened = await openPhoneVerificationSmsApp(result);
      setVerificationGuide(
        smsOpened ? buildPhoneVerificationGuideMessage(result) : buildPhoneVerificationRequestGuideMessage(result)
      );
      if (smsOpened) {
        Alert.alert('알림', PHONE_VERIFICATION_SMS_AFTER_OPEN_GUIDE);
      }
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '인증 요청에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('알림', '인증 문자 요청 정보를 확인하지 못했습니다. 인증 문자를 다시 보내주세요.');
      return;
    }
    setIsVerificationChecking(true);
    try {
      const result = await confirmPhoneVerification(formData.phone, verificationCode);
      if (!result.verified || !result.phoneVerificationToken) {
        Alert.alert('알림', '아직 인증 문자가 확인되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      Alert.alert('알림', '인증이 완료되었습니다.');
      setPhoneVerificationToken(result.phoneVerificationToken);
      setIsPhoneVerified(true);
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '아직 인증 문자가 확인되지 않았습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsVerificationChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValidBusinessNumber(formData.businessNumber)) {
      Alert.alert('알림', '사업자등록번호를 정확히 입력해주세요.');
      return;
    }
    if (!formData.breweryName.trim() || !formData.breweryLocation.trim()) {
      Alert.alert('알림', '양조장 이름과 위치를 입력해주세요.');
      return;
    }
    if (!isEditMode && !businessLicense) {
      Alert.alert('알림', '사업자등록증을 업로드해주세요.');
      return;
    }

    if (!isPhoneVerified) {
      Alert.alert('알림', '연락처 인증을 완료해주세요.');
      return;
    }

    if (!isEditMode && !phoneVerificationToken) {
      Alert.alert('알림', '연락처 인증 정보를 확인하지 못했습니다. 인증 완료를 다시 진행해주세요.');
      return;
    }

    const selectedBusinessLicense = businessLicense;
    setIsLoading(true);

    try {
      console.log('[BreweryVerification][SUBMIT] start', {
        mode: isEditMode ? 'edit' : 'create',
        hasBusinessLicense: Boolean(selectedBusinessLicense),
        selectedImageUri: selectedBusinessLicense?.uri,
        fileName: selectedBusinessLicense?.name,
        mimeType: selectedBusinessLicense?.mimeType,
        hasPhoneVerificationToken: Boolean(phoneVerificationToken),
      });

      if (isEditMode) {
        await verifyBrewery({
          businessNumber: formData.businessNumber,
          businessLicense,
          breweryName: formData.breweryName,
          breweryLocation: formData.breweryLocation,
          breweryLocationDetail: formData.breweryLocationDetail,
          phone: formData.phone,
        });
      } else {
        if (!selectedBusinessLicense) {
          Alert.alert('알림', '사업자등록증을 업로드해주세요.');
          return;
        }

        const application = await submitBreweryApplication({
          businessNumber: formData.businessNumber,
          breweryName: formData.breweryName.trim(),
          businessAddress: formData.breweryLocation.trim(),
          businessAddressDetail: formData.breweryLocationDetail.trim(),
          phoneNumber: formData.phone,
          phoneVerificationToken,
          businessLicense: {
            uri: selectedBusinessLicense.uri,
            name: getBusinessLicenseFileName(selectedBusinessLicense.name, selectedBusinessLicense.mimeType),
            mimeType: getBusinessLicenseMimeType(selectedBusinessLicense.name, selectedBusinessLicense.mimeType),
          },
        });
        console.log('[BreweryVerification][SUBMIT] application response', {
          status: application.status || application.application?.status,
          ocrStatus: application.ocrStatus || application.application?.ocrStatus,
          ocrError: application.ocrError || application.application?.ocrError,
        });
        const latestUser = application.user || application.application?.user;

        await updateUser({
          type: 'brewery',
          isBreweryVerified: false,
          role: latestUser?.role || user.role,
          name: latestUser?.nickname || user.name,
          email: latestUser?.email || user.email,
          profileImage: latestUser?.profileImage || user.profileImage,
          businessNumber: formData.businessNumber,
          breweryName: formData.breweryName.trim(),
          breweryLocation: formData.breweryLocation.trim(),
          breweryLocationDetail: formData.breweryLocationDetail.trim(),
          phone: latestUser?.phoneNumber || formData.phone,
        });
      }

      const successMessage = isEditMode
        ? '양조장 정보가 수정되었습니다.'
        : '양조장 인증 신청이 접수되었습니다. 관리자 검토 후 승인되면 양조장 대시보드를 이용할 수 있습니다.';
      Alert.alert('알림', successMessage, [
        { text: '확인', onPress: () => router.replace('/(tabs)' as any) }
      ]);
    } catch (error) {
      Alert.alert(
        '오류',
        error instanceof Error
          ? error.message
          : (isEditMode ? "정보 수정에 실패했습니다." : "인증 신청에 실패했습니다. 다시 시도해주세요.")
      );
      console.log('[BreweryVerification][SUBMIT] failed', {
        stage: isEditMode ? 'verifyBrewery' : 'submitBreweryApplication',
        message: error instanceof Error ? error.message : String(error),
        selectedImageUri: selectedBusinessLicense?.uri,
        fileName: selectedBusinessLicense?.name,
        mimeType: selectedBusinessLicense?.mimeType,
        hasPhoneVerificationToken: Boolean(phoneVerificationToken),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateBusinessLicenseFile = (file: BusinessLicenseFile) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAllowed = ['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '')
      || ['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimeType || '');

    if (!isAllowed) {
      Alert.alert('알림', 'PDF, JPG, PNG 파일만 업로드할 수 있습니다.');
      return false;
    }

    if (file.size && file.size > MAX_LICENSE_FILE_SIZE) {
      Alert.alert('알림', '사업자등록증 파일은 최대 10MB까지 업로드할 수 있습니다.');
      return false;
    }

    return true;
  };

  const pickBusinessLicenseFromPhoto = async () => {
    try {
      const result = await pickSingleImage('business-license', 0.9);
      if (result.canceled && result.denied) {
        Alert.alert('알림', '사업자등록증 사진을 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }
      if (result.canceled) return;

      const file: BusinessLicenseFile = {
        name: getBusinessLicenseFileName(result.file.name, result.file.type),
        uri: result.file.uri,
        mimeType: getBusinessLicenseMimeType(result.file.name, result.file.type),
        size: result.asset.fileSize,
        source: 'photo',
      };

      if (!validateBusinessLicenseFile(file)) return;

      setBusinessLicense(file);
      Alert.alert('알림', '사업자등록증 사진이 선택되었습니다.');
    } catch {
      Alert.alert('오류', '사진을 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  const pickBusinessLicenseFromFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const file: BusinessLicenseFile = {
        name: getBusinessLicenseFileName(asset.name, asset.mimeType),
        uri: asset.uri,
        mimeType: getBusinessLicenseMimeType(asset.name, asset.mimeType),
        size: asset.size,
        source: 'file',
      };

      if (!validateBusinessLicenseFile(file)) return;

      setBusinessLicense(file);
      Alert.alert('알림', '사업자등록증 파일이 선택되었습니다.');
    } catch {
      Alert.alert('오류', '파일을 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  const pickImage = () => {
    Alert.alert('사업자등록증 업로드', '업로드할 방식을 선택해주세요.', [
      { text: '사진에서 업로드', onPress: () => { void pickBusinessLicenseFromPhoto(); } },
      { text: '파일로 업로드', onPress: () => { void pickBusinessLicenseFromFile(); } },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const handleAddressSelect = (address: DaumAddressResult) => {
    setFormData({
      ...formData,
      breweryLocation: address.zonecode ? `[${address.zonecode}] ${address.address}` : address.address,
    });
    setShowAddressModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Image - Fixed position */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={BG_IMAGE}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.45)' }]} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backBtn, { marginTop: insets.top + 20 }]}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>

          <Animated.View 
            entering={FadeInUp.duration(400)}
            style={styles.formContainer}
          >
            {/* Logo */}
            <View style={styles.header}>
              <View style={styles.logoBox}>
                 <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} />
              </View>
              <Text style={styles.title}>{isEditMode ? "양조장 정보 수정" : "양조장 인증"}</Text>
              <Text style={styles.subtitle}>
                {isEditMode ? "양조장 정보를 수정할 수 있습니다" : "사업자 정보를 입력하고 인증을 완료해주세요"}
              </Text>
            </View>

            {shouldShowApplicationStatus && (
              <View style={[
                styles.applicationStatusCard,
                applicationStatus === 'APPROVED' && styles.applicationStatusApproved,
                applicationStatus === 'REJECTED' && styles.applicationStatusRejected,
              ]}>
                <View style={styles.applicationStatusTop}>
                  <View style={[
                    styles.applicationStatusIcon,
                    applicationStatus === 'APPROVED' && styles.applicationStatusIconApproved,
                    applicationStatus === 'REJECTED' && styles.applicationStatusIconRejected,
                  ]}>
                    {isApplicationLoading ? (
                      <ActivityIndicator color="#1E293B" />
                    ) : applicationStatus === 'APPROVED' ? (
                      <CheckCircle2 size={22} color="#059669" />
                    ) : applicationStatus === 'REJECTED' ? (
                      <AlertCircle size={22} color="#DC2626" />
                    ) : (
                      <FileText size={22} color="#1E293B" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicationStatusTitle}>{applicationStatusTitle}</Text>
                    <Text style={styles.applicationStatusDescription}>{applicationStatusDescription}</Text>
                  </View>
                </View>

                {applicationStatus === 'REJECTED' && applicationRejectReason ? (
                  <View style={styles.rejectReasonBox}>
                    <Text style={styles.rejectReasonText}>반려 사유: {applicationRejectReason}</Text>
                  </View>
                ) : null}

                {applicationStatus === 'APPROVED' && (
                  <TouchableOpacity
                    style={styles.applicationStatusPrimaryButton}
                    activeOpacity={0.85}
                    onPress={() => router.push('/brewery/dashboard' as any)}
                  >
                    <Text style={styles.applicationStatusPrimaryButtonText}>양조장 대시보드로 이동</Text>
                  </TouchableOpacity>
                )}

                {applicationStatus === 'REJECTED' && !showApplicationForm && (
                  <TouchableOpacity
                    style={styles.applicationStatusPrimaryButton}
                    activeOpacity={0.85}
                    onPress={() => setShowApplicationForm(true)}
                  >
                    <Text style={styles.applicationStatusPrimaryButtonText}>다시 신청하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {shouldShowForm && (
            <View style={styles.form}>
              {/* Business Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>사업자등록번호</Text>
                <View style={styles.inputBox}>
                  <FileText size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="000-00-00000"
                    placeholderTextColor="#9CA3AF"
                    value={formData.businessNumber}
                    onChangeText={(t) => setFormData({...formData, businessNumber: formatBusinessNumber(t)})}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Brewery Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>양조장 이름</Text>
                <View style={styles.inputBox}>
                  <Building2 size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="술샘양조장"
                    placeholderTextColor="#9CA3AF"
                    value={formData.breweryName}
                    onChangeText={(t) => setFormData({...formData, breweryName: t})}
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>양조장 위치</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.inputBox, styles.addressInputBox]}
                    onPress={() => setShowAddressModal(true)}
                    activeOpacity={0.75}
                  >
                    <MapPin size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Text
                      style={[
                        styles.addressInputText,
                        !formData.breweryLocation ? styles.addressPlaceholder : null,
                      ]}
                      numberOfLines={1}
                    >
                      {formData.breweryLocation || '주소를 검색해주세요'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallBtn}
                    onPress={() => setShowAddressModal(true)}
                  >
                    <Text style={styles.smallBtnTxt}>주소검색</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>상세 주소</Text>
                <View style={styles.inputBox}>
                  <MapPin size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="상세 주소를 입력해주세요"
                    placeholderTextColor="#9CA3AF"
                    value={formData.breweryLocationDetail}
                    onChangeText={(t) => setFormData({...formData, breweryLocationDetail: t})}
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>연락처 인증</Text>
                <View style={styles.row}>
                  <View style={[styles.inputBox, { flex: 1 }]}>
                    <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="010-0000-0000"
                      placeholderTextColor="#9CA3AF"
                      value={formData.phone}
                      onChangeText={(t) => {
                        setFormData({...formData, phone: formatPhoneNumber(t)});
                        setIsPhoneVerified(false);
                        setIsVerificationSent(false);
                        setVerificationCode('');
                        setPhoneVerificationToken('');
                        setVerificationGuide('');
                      }}
                      keyboardType="phone-pad"
                      editable={!isPhoneVerified}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.smallBtn,
                      isVerificationSent && !isPhoneVerified && styles.resendBtn,
                      isPhoneVerified && styles.smallBtnDone,
                    ]}
                    onPress={handleSendVerification}
                    disabled={isPhoneVerified}
                  >
                    <Text style={styles.smallBtnTxt}>
                      {isPhoneVerified ? '완료' : (isVerificationSent ? '인증 문자 다시 보내기' : '인증 문자 보내기')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isVerificationSent && !isPhoneVerified && (
                  <Animated.View entering={FadeIn.duration(300)} style={[styles.verificationGuideBox, { marginTop: 12 }]}>
                    <MessageSquare size={18} color="#1E293B" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.verificationGuideText}>{verificationGuide}</Text>
                      <Text style={styles.verificationGuideSubText}>문자앱에서 전송 버튼을 누른 뒤 앱으로 돌아와 인증 완료를 눌러주세요.</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.smallBtn, isVerificationChecking && styles.verifyBtnDisabled]}
                      onPress={handleVerifyCode}
                      disabled={isVerificationChecking}
                    >
                      <Text style={styles.smallBtnTxt}>{isVerificationChecking ? '확인중' : '인증 완료'}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>

              {/* Business License Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  사업자등록증 {isEditMode && <Text style={{ color: '#9CA3AF', fontSize: 11 }}>(선택사항)</Text>}
                </Text>
                <TouchableOpacity 
                  style={styles.uploadBox} 
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <Upload size={32} color="#9CA3AF" />
                  {businessLicense ? (
                    <>
                      <Text style={styles.uploadMainTxt}>{businessLicense.name}</Text>
                      <Text style={styles.uploadSubTxt}>
                        {businessLicense.source === 'photo' ? '사진에서 업로드됨' : '파일에서 업로드됨'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.uploadMainTxt}>
                        {isEditMode ? "클릭하여 새 파일 업로드 (선택)" : "클릭하여 파일 업로드"}
                      </Text>
                      <Text style={styles.uploadSubTxt}>PDF, JPG, PNG (최대 10MB)</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Info Box */}
              {!isEditMode && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>인증 안내</Text>
                  <Text style={styles.infoTxt}>• 사업자등록증은 영업 중인 양조장임을 확인하는 용도로만 사용됩니다.</Text>
                  <Text style={styles.infoTxt}>• 신청이 접수되면 관리자 검토 후 승인 여부가 안내됩니다.</Text>
                  <Text style={styles.infoTxt}>• 승인 후 양조장 대시보드와 프로젝트 생성 기능을 사용할 수 있습니다.</Text>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={handleBack}
                >
                   <Text style={styles.cancelBtnTxt}>{isEditMode ? "취소" : "나중에 하기"}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitBtn} 
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                   <Text style={styles.submitBtnTxt}>
                      {isLoading ? (isEditMode ? "수정 중..." : "인증 중...") : (isEditMode ? "정보 수정" : "인증 신청")}
                   </Text>
                </TouchableOpacity>
              </View>
            </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <DaumAddressSearchModal
        visible={showAddressModal}
        insetsTop={insets.top}
        title="양조장 주소 검색"
        onClose={() => setShowAddressModal(false)}
        onSelect={handleAddressSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backgroundImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  scrollContent: { paddingHorizontal: 24 },
  formContainer: { width: '100%', maxWidth: 500, alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  logoBox: { width: 64, height: 64, backgroundColor: '#FFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  logoImg: { width: 45, height: 45 },
  title: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#4B5563', textAlign: 'center' },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginLeft: 4 },
  inputBox: { height: 48, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  row: { flexDirection: 'row', gap: 8 },
  addressInputBox: { flex: 1 },
  addressInputText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  addressPlaceholder: { color: '#9CA3AF' },
  smallBtn: { height: 48, paddingHorizontal: 16, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
  resendBtn: { minWidth: 122, paddingHorizontal: 12 },
  smallBtnDone: { backgroundColor: '#059669' },
  smallBtnTxt: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  verificationGuideBox: { backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  verificationGuideText: { fontSize: 12.5, fontWeight: '800', color: '#111827', lineHeight: 18 },
  verificationGuideSubText: { fontSize: 11.5, fontWeight: '600', color: '#64748B', lineHeight: 17, marginTop: 3 },
  verifyBtnDisabled: { opacity: 0.65 },
  testHint: { color: '#9CA3AF', fontSize: 12, marginLeft: 4 },
  uploadBox: { height: 120, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', gap: 4 },
  uploadMainTxt: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  uploadSubTxt: { fontSize: 12, color: '#9CA3AF' },
  applicationStatusCard: { backgroundColor: 'rgba(255, 255, 255, 0.88)', borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', padding: 16, marginBottom: 18, gap: 14 },
  applicationStatusApproved: { borderColor: '#BBF7D0', backgroundColor: 'rgba(240, 253, 244, 0.92)' },
  applicationStatusRejected: { borderColor: '#FECACA', backgroundColor: 'rgba(254, 242, 242, 0.94)' },
  applicationStatusTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  applicationStatusIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  applicationStatusIconApproved: { backgroundColor: '#DCFCE7' },
  applicationStatusIconRejected: { backgroundColor: '#FEE2E2' },
  applicationStatusTitle: { fontSize: 16, fontWeight: '900', color: '#111827', lineHeight: 22 },
  applicationStatusDescription: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#4B5563', lineHeight: 19 },
  rejectReasonBox: { borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FECACA', padding: 12 },
  rejectReasonText: { fontSize: 13, fontWeight: '800', color: '#991B1B', lineHeight: 19 },
  applicationStatusPrimaryButton: { height: 46, borderRadius: 13, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  applicationStatusPrimaryButtonText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  infoBox: { backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 8 },
  infoTxt: { fontSize: 12, color: '#4B5563', lineHeight: 18 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  cancelBtnTxt: { color: '#6B7280', fontSize: 15, fontWeight: '700' },
  submitBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  submitBtnTxt: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  addressModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  addressModal: { maxHeight: SCREEN_HEIGHT * 0.78, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 18, paddingHorizontal: 20, paddingBottom: 22 },
  addressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  addressTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  addressCloseBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  addressSearchBox: { height: 48, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  addressSearchInput: { flex: 1, fontSize: 14, color: '#111', fontWeight: '600' },
  addressResultList: { maxHeight: SCREEN_HEIGHT * 0.52 },
  addressResultContent: { gap: 8, paddingBottom: 8 },
  addressResultItem: { borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 14, gap: 4 },
  addressZip: { fontSize: 12, fontWeight: '800', color: '#1E293B' },
  addressRoad: { fontSize: 14, fontWeight: '800', color: '#111', lineHeight: 20 },
  addressJibun: { fontSize: 12.5, fontWeight: '500', color: '#6B7280', lineHeight: 18 },
  addressEmpty: { minHeight: 120, justifyContent: 'center', alignItems: 'center' },
  addressEmptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '700' },
  authGuard: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  authGuardTitle: { fontSize: 23, fontWeight: '900', color: '#111', textAlign: 'center', marginTop: 18, marginBottom: 8 },
  authGuardDesc: { fontSize: 14, fontWeight: '600', color: '#4B5563', lineHeight: 21, textAlign: 'center', marginBottom: 24 },
  authGuardPrimary: { width: '100%', height: 52, borderRadius: 14, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  authGuardPrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  authGuardSecondary: { height: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  authGuardSecondaryText: { color: '#6B7280', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
