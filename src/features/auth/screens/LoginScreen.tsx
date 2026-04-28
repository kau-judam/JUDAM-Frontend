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
  Alert,
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
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await login(email, password, "user");
      setIsLoading(false);
      RNStatusBar.setHidden(false, 'fade');
      router.replace('/(tabs)');
    } catch {
      setIsLoading(false);
      Alert.alert("알림", "로그인에 실패했습니다.");
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
                  <View style={styles.inputBox}>
                    <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="example@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
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
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.forgotBtn} onPress={() => Alert.alert("알림", "비밀번호 재설정 기능은 준비 중입니다.")}>
                  <Text style={styles.forgotTxt}>비밀번호를 잊으셨나요?</Text>
                </TouchableOpacity>

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

              <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert("알림", "카카오 로그인은 준비 중입니다.")} style={styles.kakaoBtn}>
                <MessageCircle size={20} color="#1a1a1a" fill="#1a1a1a" />
                <Text style={styles.kakaoTxt}>카카오로 로그인</Text>
              </TouchableOpacity>

              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                  <Text style={styles.footerLinkBold}>회원가입</Text>
                </TouchableOpacity>
                <View style={styles.footerBar} />
                <TouchableOpacity onPress={() => {
                  RNStatusBar.setHidden(false, 'fade');
                  router.replace('/(tabs)');
                }}>
                  <Text style={styles.footerLinkMuted}>비회원으로 둘러보기</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
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
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: 4 },
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
});
