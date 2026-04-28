import React, { useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  FileText, 
  Building2, 
  MapPin, 
  Phone, 
  Upload, 
  MessageSquare,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BG_IMAGE = "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function BreweryVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { user, verifyBrewery } = useAuth();
  const isEditMode = user?.isBreweryVerified || false;
  
  const [formData, setFormData] = useState({
    businessNumber: user?.businessNumber || '',
    breweryName: user?.breweryName || '',
    breweryLocation: user?.breweryLocation || '',
    phone: user?.phone || '',
  });
  
  const [businessLicense, setBusinessLicense] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(isEditMode);

  const handleSendVerification = () => {
    if (!formData.phone) {
      Alert.alert('알림', '연락처를 입력해주세요.');
      return;
    }
    Alert.alert('알림', '인증번호가 전송되었습니다.');
    setIsVerificationSent(true);
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
        phone: formData.phone,
      });

      Alert.alert('알림', isEditMode ? "양조장 정보가 수정되었습니다!" : "양조장 인증이 완료되었습니다!", [
        { text: '확인', onPress: () => router.replace(isEditMode ? '/brewery/dashboard' as any : '/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('오류', isEditMode ? "정보 수정에 실패했습니다." : "인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = () => {
    setBusinessLicense('business_license_sample.jpg');
    Alert.alert('알림', '사업자등록증 파일이 선택되었습니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Image - Fixed position */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: BG_IMAGE }}
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
                    onChangeText={(t) => setFormData({...formData, businessNumber: t})}
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
                <View style={styles.inputBox}>
                  <MapPin size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="경기 양평"
                    placeholderTextColor="#9CA3AF"
                    value={formData.breweryLocation}
                    onChangeText={(t) => setFormData({...formData, breweryLocation: t})}
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
                      onChangeText={(t) => setFormData({...formData, phone: t})}
                      keyboardType="phone-pad"
                      editable={!isPhoneVerified}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[styles.smallBtn, isPhoneVerified && styles.smallBtnDone]}
                    onPress={handleSendVerification}
                    disabled={isPhoneVerified}
                  >
                    <Text style={styles.smallBtnTxt}>{isPhoneVerified ? "완료" : "인증"}</Text>
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
                    <Text style={styles.uploadMainTxt}>{businessLicense}</Text>
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
                  <Text style={styles.infoTxt}>• 인증은 영업일 기준 2~3일 내에 완료됩니다.</Text>
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
  smallBtn: { height: 48, paddingHorizontal: 16, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
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
});
