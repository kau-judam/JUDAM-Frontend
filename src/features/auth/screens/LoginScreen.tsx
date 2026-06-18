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

import { type KakaoLoginResult, useAuth } from '@/contexts/AuthContext';
import { AuthApiError, getKakaoLoginUrl } from '@/features/auth/api';
import {
  createKakaoAppRedirectUrl,
  getKakaoAuthUrl,
  getKakaoCallbackRouteParams,
  getKakaoRedirectUri,
  openKakaoAuthSession,
  savePendingKakaoAuthRequest,
  tryLoginWithKakaoTalk,
} from '@/features/auth/kakaoAuth';
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

function getLoginErrorMessage(error: unknown) {
  const rawMessage = error instanceof Error ? error.message.trim() : '';
  const message = rawMessage.replace(/^HTTP\s+\d+\s*:?\s*/i, '').trim();
  const status = error instanceof AuthApiError ? error.status : undefined;

  if (!message) return '이메일 또는 비밀번호를 다시 확인해주세요.';
  if (status === 401 || status === 403) {
    return '이메일 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요.';
  }
  if (status === 404) {
    return '가입된 계정을 찾을 수 없습니다. 이메일을 다시 확인해주세요.';
  }
  if (status && status >= 500) {
    return '서버에서 로그인 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  }
  if (isLikelyGarbledMessage(message)) {
    return '로그인 처리 중 문제가 발생했습니다. 이메일과 비밀번호를 다시 확인해주세요.';
  }
  if (/network request failed|failed to fetch|networkerror/i.test(message)) {
    return '서버에 연결할 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.';
  }
  if (/timeout|timed out/i.test(message)) {
    return '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  }
  if (/unauthorized|invalid token|expired token|token/i.test(message)) {
    return '로그인 정보가 유효하지 않습니다. 이메일과 비밀번호를 다시 확인해주세요.';
  }
  if (/not found|존재하지|찾을 수 없|없습니다/i.test(message)) {
    return '가입된 계정을 찾을 수 없습니다. 이메일을 다시 확인해주세요.';
  }
  if (/password|비밀번호|비밀 번호|불일치|incorrect|wrong/i.test(message)) {
    return '비밀번호가 일치하지 않습니다. 다시 입력해주세요.';
  }
  if (/kakao|provider|소셜|카카오/i.test(message)) {
    return '카카오로 가입한 계정입니다. 카카오 로그인으로 다시 시도해주세요.';
  }
  if (/인증|verify|verification/i.test(message)) {
    return '계정 인증 상태를 확인할 수 없습니다. 인증을 완료한 뒤 다시 시도해주세요.';
  }
  if (/^\d{3}$/.test(message)) {
    return '로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  return message;
}

function isLikelyGarbledMessage(message: string) {
  const questionMarkCount = (message.match(/\?/g) || []).length;
  const hasNonAscii = /[^\x00-\x7F]/.test(message);
  return message.includes('�') || /[ìíîïðñòóôõö÷øùúûüýþÿ留吏理]/.test(message) || (questionMarkCount >= 2 && hasNonAscii);
}

function routeAfterKakaoLoginResult(kakaoResult: KakaoLoginResult) {
  RNStatusBar.setHidden(false, 'fade');

  if (kakaoResult.status === 'signupRequired') {
    router.replace({
      pathname: '/(auth)/signup',
      params: {
        kakaoEmail: kakaoResult.email,
        kakaoNickname: kakaoResult.nickname,
        kakaoProfileImage: kakaoResult.profileImage || undefined,
        kakaoId: kakaoResult.kakaoId ? String(kakaoResult.kakaoId) : undefined,
        kakaoSignupToken: kakaoResult.kakaoSignupToken,
        kakaoNeedsProfileCompletion: kakaoResult.kakaoSignupToken ? undefined : 'true',
      },
    } as any);
    return;
  }

  router.replace('/(tabs)');
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginWithKakaoAccessToken, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
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
      await login(email, password, accountType, keepLoggedIn);
      setIsLoading(false);
      RNStatusBar.setHidden(false, 'fade');
      router.replace('/(tabs)');
    } catch (error) {
      setIsLoading(false);
      setNotice(getLoginErrorMessage(error));
    }
  };

  const handleGuestStart = async () => {
    RNStatusBar.setHidden(false, 'fade');
    try {
      await logout();
    } catch (error) {
      console.warn('Failed to clear auth before guest start.', error);
    }
    router.replace('/(tabs)');
  };

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      const nativeLogin = await tryLoginWithKakaoTalk();
      if (nativeLogin?.accessToken) {
        try {
          const kakaoResult = await loginWithKakaoAccessToken(nativeLogin.accessToken, keepLoggedIn);
          routeAfterKakaoLoginResult(kakaoResult);
          return;
        } catch (nativeBackendError) {
          console.warn('[KakaoNativeLogin] Backend accessToken login failed. Falling back to web OAuth.', nativeBackendError);
        }
      }

      const appRedirectUri = createKakaoAppRedirectUrl();
      const kakao = await getKakaoLoginUrl(appRedirectUri);
      const kakaoUrl = getKakaoAuthUrl(kakao);
      if (!kakaoUrl) {
        setNotice('카카오 로그인 URL을 받지 못했습니다.');
        return;
      }
      const redirectUri = getKakaoRedirectUri(kakaoUrl);
      await savePendingKakaoAuthRequest({ keepLoggedIn, redirectUri });
      const result = await openKakaoAuthSession(kakaoUrl, appRedirectUri);
      if (result.type !== 'success' || !result.url) {
        setNotice('카카오 로그인 창을 열었습니다. 로그인이 완료되지 않았다면 다시 시도해주세요.');
        return;
      }
      RNStatusBar.setHidden(false, 'fade');
      router.replace({
        pathname: '/kakao/callback',
        params: getKakaoCallbackRouteParams(result.url),
      } as any);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '카카오 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
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
                  <TouchableOpacity style={styles.rememberButton} onPress={() => setKeepLoggedIn((prev) => !prev)}>
                    <View style={[styles.rememberCheck, keepLoggedIn && styles.rememberCheckActive]}>
                      {keepLoggedIn && <Check size={12} color="#FFF" />}
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

              <TouchableOpacity activeOpacity={0.8} onPress={handleKakaoLogin} style={styles.kakaoBtn} disabled={isLoading}>
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
