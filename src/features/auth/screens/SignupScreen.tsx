import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar as RNStatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MessageCircle, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  CheckCircle2,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BG_IMAGE = "https://images.unsplash.com/photo-1655376407073-d03c3ae3584d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 120,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
};

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  const MIN_HEIGHT = SCREEN_HEIGHT * 0.70;
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
    translateY.value = withSpring(SCREEN_HEIGHT - MIN_HEIGHT, SPRING_CONFIG);
  }, [MIN_HEIGHT, translateY]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      if (translateY.value < 0) translateY.value = 0;
    })
    .onEnd(() => {
      const topDistance = 0;
      const collapsedDistance = SCREEN_HEIGHT - MIN_HEIGHT;
      if (translateY.value < (topDistance + collapsedDistance) / 2) {
        translateY.value = withSpring(topDistance, SPRING_CONFIG);
      } else {
        translateY.value = withSpring(collapsedDistance, SPRING_CONFIG);
      }
    });

  const rSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const rScrollStyle = useAnimatedStyle(() => ({
    height: SCREEN_HEIGHT - translateY.value - 40,
  }));

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("알림", "올바른 이메일 형식이 아닙니다.");
      return;
    }
    setIsEmailChecked(true);
    setIsEmailAvailable(true);
    Alert.alert("알림", "사용 가능한 이메일입니다.");
  };

  const handleTermsChange = (key: keyof typeof terms) => {
    if (key === 'all') {
      const newVal = !terms.all;
      setTerms({ all: newVal, service: newVal, privacy: newVal, marketing: newVal });
    } else {
      const next = { ...terms, [key]: !terms[key] };
      next.all = next.service && next.privacy && next.marketing;
      setTerms(next);
    }
  };

  const handleSendVerification = () => {
    if (!formData.phone) {
      Alert.alert("알림", "연락처를 입력해주세요.");
      return;
    }
    setIsVerificationSent(true);
    Alert.alert("알림", "인증번호가 전송되었습니다.");
  };

  const handleVerifyCode = () => {
    if (verificationCode === "1234") {
      setIsPhoneVerified(true);
      Alert.alert("알림", "인증이 완료되었습니다.");
    } else {
      Alert.alert("알림", "인증번호가 일치하지 않습니다.");
    }
  };

  const handleSignup = async () => {
    if (!isEmailChecked || !isEmailAvailable) {
      Alert.alert("알림", "이메일 중복 확인을 완료해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isPhoneVerified) {
      Alert.alert("알림", "연락처 인증을 완료해주세요.");
      return;
    }
    if (!terms.service || !terms.privacy) {
      Alert.alert("알림", "필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        type: 'user',
      });
      setIsLoading(false);
      RNStatusBar.setHidden(false, 'fade');
      router.push('/(auth)/user-type');
    } catch {
      setIsLoading(false);
      Alert.alert("알림", "회원가입에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={{ uri: BG_IMAGE }} style={styles.bgImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.20)', 'rgba(0,0,0,0.80)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.topSection, { paddingTop: insets.top + 56 }]}>
        <TouchableOpacity onPress={() => router.replace('/onboarding')} style={styles.backBtn}>
          <ChevronLeft size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.backTxt}>처음으로</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeIn.delay(50)} style={styles.logoRow}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} />
          <Text style={styles.brandName}>주담</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(150)}>
          <Text style={styles.greeting}>전통주의 세계로{'\n'}첫 발걸음을</Text>
          <Text style={styles.subGreeting}>주담과 함께 새로운 전통주 여정을 시작하세요</Text>
        </Animated.View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.bottomSheet, rSheetStyle, { height: SCREEN_HEIGHT }]}>
          <GestureDetector gesture={panGesture}>
            <View style={styles.dragHandleArea}>
               <View style={styles.dragHandle} />
            </View>
          </GestureDetector>

          <Animated.View style={rScrollStyle}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              bounces={false} 
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => Alert.alert("알림", "카카오 회원가입은 준비 중입니다.")}
                style={styles.kakaoBtn}
              >
                <MessageCircle size={20} color="#1a1a1a" fill="#1a1a1a" />
                <Text style={styles.kakaoTxt}>카카오로 빠르게 가입</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerTxt}>이메일로 가입</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>닉네임</Text>
                  <View style={styles.inputBox}>
                    <UserIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="술담이"
                      placeholderTextColor="#9CA3AF"
                      value={formData.name}
                      onChangeText={v => handleInputChange('name', v)}
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>이메일</Text>
                    {isEmailChecked && isEmailAvailable && (
                      <View style={styles.availableRow}>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.availableTxt}>사용 가능</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.inputBox, { flex: 1 }]}>
                      <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput 
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={formData.email}
                        onChangeText={v => handleInputChange('email', v)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!(isEmailChecked && isEmailAvailable)}
                      />
                    </View>
                    <TouchableOpacity 
                      style={[styles.smallBtn, isEmailChecked && isEmailAvailable && styles.smallBtnDone]}
                      onPress={handleCheckEmail}
                      disabled={isEmailChecked && isEmailAvailable}
                    >
                      <Text style={styles.smallBtnTxt}>
                        {isEmailChecked && isEmailAvailable ? "확인완료" : "중복확인"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>비밀번호</Text>
                  <View style={styles.inputBox}>
                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={formData.password}
                      onChangeText={v => handleInputChange('password', v)}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>비밀번호 확인</Text>
                  <View style={styles.inputBox}>
                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={formData.confirmPassword}
                      onChangeText={v => handleInputChange('confirmPassword', v)}
                      secureTextEntry={!showConfirmPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPw(!showConfirmPw)}>
                      {showConfirmPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>연락처 인증</Text>
                    {isPhoneVerified && (
                      <View style={styles.availableRow}>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.availableTxt}>인증 완료</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.inputBox, { flex: 1 }]}>
                      <Phone size={18} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput 
                        style={styles.input}
                        placeholder="010-0000-0000"
                        placeholderTextColor="#9CA3AF"
                        value={formData.phone}
                        onChangeText={v => handleInputChange('phone', v)}
                        keyboardType="phone-pad"
                        editable={!isPhoneVerified}
                      />
                    </View>
                    <TouchableOpacity 
                      style={[styles.smallBtn, isPhoneVerified && styles.smallBtnDone]}
                      onPress={handleSendVerification}
                      disabled={isPhoneVerified}
                    >
                      <Text style={styles.smallBtnTxt}>
                        {isPhoneVerified ? "완료" : "인증"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isVerificationSent && !isPhoneVerified && (
                    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut} style={[styles.row, { marginTop: 10 }]}>
                      <View style={[styles.inputBox, { flex: 1 }]}>
                        <MessageSquare size={18} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput 
                          style={styles.input}
                          placeholder="인증번호 입력"
                          placeholderTextColor="#9CA3AF"
                          value={verificationCode}
                          onChangeText={setVerificationCode}
                          keyboardType="number-pad"
                        />
                      </View>
                      <TouchableOpacity style={styles.smallBtn} onPress={handleVerifyCode}>
                        <Text style={styles.smallBtnTxt}>확인</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  {isVerificationSent && !isPhoneVerified && (
                    <Text style={styles.testHint}>* 테스트용 인증번호: 1234</Text>
                  )}
                </View>

                <View style={styles.termsArea}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => handleTermsChange('all')}
                    style={[styles.allTerms, terms.all && styles.allTermsActive]}
                  >
                    <View style={[styles.check, terms.all && styles.checkActive]}>
                      {terms.all && <CheckCircle2 size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.allTermsTxt}>전체 동의</Text>
                  </TouchableOpacity>

                  <View style={styles.termsList}>
                    <TermRow label="[필수] 이용약관 동의" active={terms.service} onToggle={() => handleTermsChange('service')} onPressLink={() => router.push('/terms' as any)} />
                    <TermRow label="[필수] 개인정보처리방침 동의" active={terms.privacy} onToggle={() => handleTermsChange('privacy')} onPressLink={() => router.push('/terms' as any)} />
                    <TermRow label="[선택] 마케팅 수신 동의" active={terms.marketing} onToggle={() => handleTermsChange('marketing')} sub="이벤트, 할인 혜택 등의 정보를 이메일/SMS로 받아보실 수 있습니다." />
                  </View>
                </View>

                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleSignup}
                  disabled={isLoading}
                  style={[styles.signupBtn, isLoading && { opacity: 0.6 }]}
                >
                  <Text style={styles.signupBtnTxt}>{isLoading ? "가입 중..." : "회원가입"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerTxt}>이미 계정이 있으신가요? </Text>
                <TouchableOpacity onPress={() => router.replace('/login')}>
                  <Text style={styles.footerLink}>로그인</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TermRow({ label, active, onToggle, sub, onPressLink }: any) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.termRow}>
      <View style={[styles.smallCheck, active && styles.checkActive]}>
        {active && <CheckCircle2 size={10} color="#FFF" />}
      </View>
      <View style={{ flex: 1, marginTop: -2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.termLabel}>
            {label.includes('[필수]') ? (
              <Text><Text style={{ color: '#DC2626', fontWeight: '700' }}>[필수]</Text>{label.replace('[필수]', '')}</Text>
            ) : (
              <Text><Text style={{ color: '#6B7280', fontWeight: '600' }}>[선택]</Text>{label.replace('[선택]', '')}</Text>
            )}
          </Text>
          {onPressLink && (
            <TouchableOpacity onPress={onPressLink}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', textDecorationLine: 'underline' }}>보기</Text>
            </TouchableOpacity>
          )}
        </View>
        {sub && <Text style={styles.termSub}>{sub}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { ...StyleSheet.absoluteFillObject, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  topSection: { paddingHorizontal: 28 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 32 },
  backTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 13.6, fontWeight: '600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoImg: { width: 40, height: 40, opacity: 0.9 },
  brandName: { color: '#FFF', fontSize: 24, fontWeight: '700', letterSpacing: 1 },
  greeting: { color: '#FFF', fontSize: 28, fontWeight: '700', lineHeight: 35, letterSpacing: -0.28, marginBottom: 4 },
  subGreeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13.6, fontWeight: '500' },
  bottomSheet: { position: 'absolute', width: '100%', backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.15, shadowRadius: 20 },
  dragHandleArea: { width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 120, paddingTop: 5 },
  kakaoBtn: { height: 48, backgroundColor: '#FEE500', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 },
  kakaoTxt: { fontSize: 14.4, fontWeight: '600', color: '#1a1a1a' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerTxt: { fontSize: 12.5, color: '#9CA3AF', fontWeight: '600' },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 4 },
  label: { fontSize: 12.8, fontWeight: '500', color: '#374151', marginLeft: 2 },
  availableRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availableTxt: { fontSize: 11, fontWeight: '700', color: '#059669' },
  row: { flexDirection: 'row', gap: 8 },
  inputBox: { height: 48, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  smallBtn: { height: 48, paddingHorizontal: 16, backgroundColor: '#111827', borderRadius: 12, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
  smallBtnDone: { backgroundColor: '#059669' },
  smallBtnTxt: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  testHint: { color: '#9CA3AF', fontSize: 12, marginLeft: 4 },
  termsArea: { gap: 12, marginTop: 8 },
  allTerms: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  allTermsActive: { borderColor: '#111' },
  allTermsTxt: { fontSize: 14.4, fontWeight: '600', color: '#111' },
  check: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  checkActive: { backgroundColor: '#111', borderColor: '#111' },
  termsList: { gap: 10, paddingLeft: 8 },
  termRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  smallCheck: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  termLabel: { fontSize: 13.12, color: '#374151', lineHeight: 20 },
  termSub: { fontSize: 11.2, color: '#9CA3AF', marginTop: 2 },
  signupBtn: { height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  signupBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerTxt: { fontSize: 13.12, color: '#6B7280', fontWeight: '500' },
  footerLink: { fontSize: 13.12, fontWeight: '700', color: '#111', textDecorationLine: 'underline' },
});
