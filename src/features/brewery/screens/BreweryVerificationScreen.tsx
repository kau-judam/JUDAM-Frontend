import React, { useMemo, useState } from 'react';
import {
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
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { 
  ArrowLeft, 
  FileText, 
  Building2, 
  MapPin, 
  Phone, 
  Upload, 
  MessageSquare,
  Search,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { formatBusinessNumber, formatPhoneNumber, isValidBusinessNumber, isValidPhone } from '@/utils/validation';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BG_IMAGE = require('../../../../newpicutre/ok.jpg');
const MAX_LICENSE_FILE_SIZE = 10 * 1024 * 1024;

type BusinessLicenseFile = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
  source: 'photo' | 'file';
};

const MOCK_ADDRESSES = [
  {
    zipCode: '12545',
    roadAddress: '경기도 양평군 용문면 용문로 123',
    jibunAddress: '경기도 양평군 용문면 다문리 456-7',
  },
  {
    zipCode: '03048',
    roadAddress: '서울특별시 종로구 북촌로 77',
    jibunAddress: '서울특별시 종로구 가회동 31-2',
  },
  {
    zipCode: '38187',
    roadAddress: '경상북도 경주시 첨성로 150',
    jibunAddress: '경상북도 경주시 황남동 221-4',
  },
  {
    zipCode: '58217',
    roadAddress: '전라남도 나주시 금성관길 8',
    jibunAddress: '전라남도 나주시 과원동 109-5',
  },
];

export default function BreweryVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { user, verifyBrewery } = useAuth();
  const isEditMode = user?.isBreweryVerified || false;
  
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
  const [isPhoneVerified, setIsPhoneVerified] = useState(isEditMode);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');

  const addressResults = useMemo(() => {
    const keyword = addressSearch.trim().toLowerCase();
    if (!keyword) return MOCK_ADDRESSES;
    return MOCK_ADDRESSES.filter((address) => (
      address.zipCode.includes(keyword)
      || address.roadAddress.toLowerCase().includes(keyword)
      || address.jibunAddress.toLowerCase().includes(keyword)
    ));
  }, [addressSearch]);

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

  const handleSendVerification = () => {
    if (!isValidPhone(formData.phone)) {
      Alert.alert('알림', '연락처를 정확히 입력해주세요.');
      return;
    }
    const wasAlreadySent = isVerificationSent;
    setVerificationCode('');
    setIsVerificationSent(true);
    Alert.alert('알림', wasAlreadySent ? '인증번호가 재전송되었습니다.' : '인증번호가 전송되었습니다.');
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }
    if (verificationCode === '1234') {
      Alert.alert('알림', '인증이 완료되었습니다.');
      setIsPhoneVerified(true);
    } else {
      Alert.alert('오류', '인증번호가 일치하지 않습니다.');
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

    setIsLoading(true);

    try {
      await verifyBrewery({
        businessNumber: formData.businessNumber,
        breweryName: formData.breweryName,
        breweryLocation: formData.breweryLocation,
        breweryLocationDetail: formData.breweryLocationDetail,
        phone: formData.phone,
      });

      Alert.alert('알림', isEditMode ? "양조장 정보가 수정되었습니다!" : "양조장 인증이 완료되었습니다!", [
        { text: '확인', onPress: () => router.replace('/(tabs)' as any) }
      ]);
    } catch {
      Alert.alert('오류', isEditMode ? "정보 수정에 실패했습니다." : "인증에 실패했습니다. 다시 시도해주세요.");
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
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('알림', '사업자등록증 사진을 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const file: BusinessLicenseFile = {
        name: asset.fileName || `business_license_${Date.now()}.jpg`,
        uri: asset.uri,
        mimeType: asset.mimeType || 'image/jpeg',
        size: asset.fileSize,
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
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType,
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

  const handleAddressSelect = (address: typeof MOCK_ADDRESSES[number]) => {
    setFormData({
      ...formData,
      breweryLocation: `[${address.zipCode}] ${address.roadAddress}`,
    });
    setShowAddressModal(false);
    setAddressSearch('');
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
            onPress={() => router.back()}
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
                      {isPhoneVerified ? "완료" : (isVerificationSent ? "인증번호 재전송" : "인증")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isVerificationSent && !isPhoneVerified && (
                  <Animated.View entering={FadeIn.duration(300)} style={[styles.row, { marginTop: 12 }]}>
                    <View style={[styles.inputBox, { flex: 1 }]}>
                      <MessageSquare size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput 
                        style={styles.input}
                        placeholder="인증번호 입력"
                        placeholderTextColor="#9CA3AF"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.smallBtn}
                      onPress={handleVerifyCode}
                    >
                      <Text style={styles.smallBtnTxt}>확인</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                {isVerificationSent && !isPhoneVerified && (
                  <Text style={styles.testHint}>* 테스트용 인증번호: 1234</Text>
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
                  <Text style={styles.infoTxt}>• 인증은 영업일 기준 1~2일 내에 완료됩니다.</Text>
                  <Text style={styles.infoTxt}>• 인증 완료 후 프로젝트 생성이 가능합니다.</Text>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => router.back()}
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
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AddressSearchModal
        visible={showAddressModal}
        search={addressSearch}
        results={addressResults}
        onChangeSearch={setAddressSearch}
        onClose={() => setShowAddressModal(false)}
        onSelect={handleAddressSelect}
      />
    </View>
  );
}

function AddressSearchModal({
  visible,
  search,
  results,
  onChangeSearch,
  onClose,
  onSelect,
}: {
  visible: boolean;
  search: string;
  results: typeof MOCK_ADDRESSES;
  onChangeSearch: (value: string) => void;
  onClose: () => void;
  onSelect: (address: typeof MOCK_ADDRESSES[number]) => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.addressModalBackdrop}>
        <View style={styles.addressModal}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>주소 검색</Text>
            <TouchableOpacity style={styles.addressCloseBtn} onPress={onClose}>
              <X size={18} color="#111" />
            </TouchableOpacity>
          </View>
          <View style={styles.addressSearchBox}>
            <Search size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.addressSearchInput}
              placeholder="도로명, 지번, 우편번호 검색"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={onChangeSearch}
              autoFocus
            />
          </View>
          <ScrollView
            style={styles.addressResultList}
            contentContainerStyle={styles.addressResultContent}
            keyboardShouldPersistTaps="handled"
          >
            {results.length > 0 ? results.map((address) => (
              <TouchableOpacity
                key={`${address.zipCode}-${address.roadAddress}`}
                style={styles.addressResultItem}
                onPress={() => onSelect(address)}
                activeOpacity={0.75}
              >
                <Text style={styles.addressZip}>[{address.zipCode}]</Text>
                <Text style={styles.addressRoad}>{address.roadAddress}</Text>
                <Text style={styles.addressJibun}>{address.jibunAddress}</Text>
              </TouchableOpacity>
            )) : (
              <View style={styles.addressEmpty}>
                <Text style={styles.addressEmptyText}>검색 결과가 없습니다.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
  testHint: { color: '#9CA3AF', fontSize: 12, marginLeft: 4 },
  uploadBox: { height: 120, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', gap: 4 },
  uploadMainTxt: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  uploadSubTxt: { fontSize: 12, color: '#9CA3AF' },
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
