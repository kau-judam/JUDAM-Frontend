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
  Modal,
  StatusBar as RNStatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Mail, 
  Lock, 
  MessageCircle, 
  ChevronLeft, 
  Eye, 
  EyeOff,
  Check,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/contexts/AuthContext';
import SafeStorage from '@/utils/storage';
import { isValidEmail } from '@/utils/validation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BG_IMAGE = require('../../../../newpicutre/picure3.jpg');

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 120,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [notice, setNotice] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const MIN_HEIGHT = SCREEN_HEIGHT * 0.68;
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
    translateY.value = withSpring(SCREEN_HEIGHT - MIN_HEIGHT, SPRING_CONFIG);
  }, [MIN_HEIGHT, translateY]);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      const savedEmail = await SafeStorage.getItem('judam_remember_email');
      if (!savedEmail) return;
      setEmail(savedEmail);
      setRememberEmail(true);
    };
    loadRememberedEmail();
  }, []);

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

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError('올바른 이메일을 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const accountType = email.toLowerCase().includes('brewery') || email.includes('양조') ? 'brewery' : 'user';
      await login(email, password, accountType);
      if (rememberEmail) {
        await SafeStorage.setItem('judam_remember_email', email);
      } else {
        await SafeStorage.removeItem('judam_remember_email');
      }
      setIsLoading(false);
      RNStatusBar.setHidden(false, 'fade');
      const savedUser = await SafeStorage.getItem('judam_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      if (accountType === 'brewery' && parsedUser?.isBreweryVerified === false) {
        router.replace('/brewery/verification' as any);
        return;
      }
      router.replace(accountType === 'brewery' ? '/brewery/dashboard' as any : '/(tabs)');
    } catch {
      setIsLoading(false);
      setNotice("로그인에 실패했습니다.");
    }
  };

  const handleGuestStart = async () => {
    RNStatusBar.setHidden(false, 'fade');
    await logout();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={BG_IMAGE} style={styles.bgImage} />
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
          <Text style={styles.greeting}>다시 만나서{'\n'}반갑습니다</Text>
          <Text style={styles.subGreeting}>계정에 로그인하여 계속하세요</Text>
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
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>이메일</Text>
                  <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
                    <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="example@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        if (emailError) setEmailError("");
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>비밀번호</Text>
                  <View style={[styles.inputBox, passwordError ? styles.inputBoxError : null]}>
                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        if (passwordError) setPasswordError("");
                      }}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                  {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                </View>

                <View style={styles.optionRow}>
                  <TouchableOpacity style={styles.rememberButton} onPress={() => setRememberEmail((prev) => !prev)}>
                    <View style={[styles.rememberCheck, rememberEmail && styles.rememberCheckActive]}>
                      {rememberEmail && <Check size={12} color="#FFF" />}
                    </View>
                    <Text style={styles.rememberText}>로그인 유지</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/password-reset' as any)}>
                    <Text style={styles.forgotTxt}>비밀번호를 잊으셨나요?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleLogin}
                  disabled={isLoading}
                  style={[styles.loginBtn, isLoading && { opacity: 0.6 }]}
                >
                  <Text style={styles.loginBtnTxt}>{isLoading ? "로그인 중..." : "로그인"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerTxt}>또는</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={() => setNotice("카카오 로그인은 준비 중입니다.")} style={styles.kakaoBtn}>
                <MessageCircle size={20} color="#1a1a1a" fill="#1a1a1a" />
                <Text style={styles.kakaoTxt}>카카오로 로그인</Text>
              </TouchableOpacity>

              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                  <Text style={styles.footerLinkBold}>회원가입</Text>
                </TouchableOpacity>
                <View style={styles.footerBar} />
                <TouchableOpacity onPress={handleGuestStart}>
                  <Text style={styles.footerLinkMuted}>비회원으로 둘러보기</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
      <Modal transparent visible={Boolean(notice)} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>알림</Text>
            <Text style={styles.noticeBody}>{notice}</Text>
            <TouchableOpacity style={styles.noticeButton} onPress={() => setNotice("")}>
              <Text style={styles.noticeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  scrollContent: { paddingHorizontal: 28, paddingBottom: 60 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12.8, fontWeight: '500', color: '#374151', marginLeft: 2 },
  inputBox: { height: 48, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputBoxError: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  errorText: { color: '#DC2626', fontSize: 11.5, fontWeight: '600', marginLeft: 4 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rememberButton: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 4 },
  rememberCheck: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  rememberCheckActive: { backgroundColor: '#111', borderColor: '#111' },
  rememberText: { fontSize: 12.5, color: '#6B7280', fontWeight: '600' },
  forgotBtn: { paddingVertical: 4 },
  forgotTxt: { fontSize: 12.5, color: '#6B7280', fontWeight: '500' },
  loginBtn: { height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  loginBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerTxt: { fontSize: 12.5, color: '#9CA3AF', fontWeight: '600' },
  kakaoBtn: { height: 48, backgroundColor: '#FEE500', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  kakaoTxt: { fontSize: 14.4, fontWeight: '600', color: '#1a1a1a' },
  footerLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24 },
  footerLinkBold: { fontSize: 13, fontWeight: '600', color: '#111' },
  footerBar: { width: 1, height: 14, backgroundColor: '#E5E7EB' },
  footerLinkMuted: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeCard: { width: '100%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 20, padding: 22, alignItems: 'center' },
  noticeTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 8 },
  noticeBody: { fontSize: 14, color: '#4B5563', fontWeight: '700', lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  noticeButton: { height: 48, minWidth: 120, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  noticeButtonText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
});
