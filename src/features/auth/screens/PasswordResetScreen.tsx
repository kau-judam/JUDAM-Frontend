import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Lock,
  Mail,
  MessageSquare,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getPasswordStrength, isPasswordReady, isValidEmail } from '@/utils/validation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BG_IMAGE = require('../../../../newpicutre/picure3.jpg');

type ResetStep = 'email' | 'verify' | 'newPassword';

const STEP_COPY = {
  email: '가입한 이메일 주소를 입력해주세요',
  verify: '이메일로 전송된 인증번호를 입력해주세요',
  newPassword: '새로운 비밀번호를 설정해주세요',
};

const STEP_ORDER: ResetStep[] = ['email', 'verify', 'newPassword'];

export default function PasswordResetScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const passwordMatches = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
  }, []);

  const showNotice = (message: string) => setNotice(message);

  const handleBack = () => {
    if (step === 'verify') {
      setStep('email');
      return;
    }
    if (step === 'newPassword') {
      setStep('verify');
      return;
    }
    router.replace('/login' as any);
  };

  const handleSendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      showNotice('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      showNotice('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setEmail(normalizedEmail);
    setIsLoading(false);
    showNotice('인증번호가 발송되었습니다.');
    setStep('verify');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showNotice('인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    if (verificationCode.trim() !== '1234') {
      showNotice('인증번호가 일치하지 않습니다.');
      return;
    }

    showNotice('인증이 완료되었습니다.');
    setStep('newPassword');
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showNotice('비밀번호를 입력해주세요.');
      return;
    }
    if (!isPasswordReady(newPassword)) {
      showNotice('비밀번호는 8자 이상, 영문 대소문자와 숫자를 포함해야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotice('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsLoading(false);
    showNotice('비밀번호가 재설정되었습니다.');
  };

  const closeNotice = () => {
    const shouldGoLogin = notice === '비밀번호가 재설정되었습니다.';
    setNotice('');
    if (shouldGoLogin) {
      router.replace('/login' as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image source={BG_IMAGE} style={styles.bgImage} />
      <LinearGradient
        colors={['rgba(255,255,255,0.78)', 'rgba(255,255,255,0.34)', 'rgba(255,255,255,0.90)']}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.screenShell, { paddingTop: insets.top + 18 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={20} color="#4B5563" />
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardArea}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 42 }]}
          >
            <Animated.View entering={FadeIn.duration(450)} style={styles.formArea}>
              <View style={styles.logoWrap}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} />
                <Text style={styles.title}>비밀번호 재설정</Text>
                <Text style={styles.subtitle}>{STEP_COPY[step]}</Text>
              </View>

              <View style={styles.stepBody}>
                {step === 'email' && (
                  <Animated.View key="email" entering={FadeIn.duration(220)} style={styles.formStack}>
                    <Field
                      label="이메일"
                      icon={<Mail size={20} color="#9CA3AF" />}
                      placeholder="example@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.primaryButton, isLoading && styles.disabledButton]}
                      disabled={isLoading}
                      onPress={handleSendCode}
                    >
                      <Text style={styles.primaryButtonText}>{isLoading ? '발송 중...' : '인증번호 받기'}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {step === 'verify' && (
                  <Animated.View key="verify" entering={FadeIn.duration(220)} style={styles.formStack}>
                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        <Text style={styles.infoTextStrong}>{email}</Text>로 인증번호를 발송했습니다.
                      </Text>
                    </View>
                    <Field
                      label="인증번호"
                      icon={<MessageSquare size={20} color="#9CA3AF" />}
                      placeholder="6자리 인증번호"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="number-pad"
                    />
                    <Text style={styles.helperText}>* 테스트용 인증번호: 1234</Text>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.primaryButton, isLoading && styles.disabledButton]}
                      disabled={isLoading}
                      onPress={handleVerifyCode}
                    >
                      <Text style={styles.primaryButtonText}>{isLoading ? '확인 중...' : '인증 확인'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resendButton} onPress={handleSendCode} disabled={isLoading}>
                      <Text style={styles.resendText}>인증번호 재전송</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                {step === 'newPassword' && (
                  <Animated.View key="newPassword" entering={FadeIn.duration(220)} style={styles.formStack}>
                    <Field
                      label="새 비밀번호"
                      icon={<Lock size={20} color="#9CA3AF" />}
                      placeholder="최소 8자 이상"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                    />
                    {newPassword.length > 0 && (
                      <View style={styles.strengthArea}>
                        <View style={styles.strengthBars}>
                          {[1, 2, 3].map((index) => (
                            <View
                              key={index}
                              style={[
                                styles.strengthBar,
                                index <= passwordStrength.score ? { backgroundColor: passwordStrength.color } : null,
                              ]}
                            />
                          ))}
                        </View>
                        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                          비밀번호 강도: {passwordStrength.label}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.helperText}>8자 이상, 영문 대소문자와 숫자 포함</Text>
                    <Field
                      label="비밀번호 확인"
                      icon={<Lock size={20} color="#9CA3AF" />}
                      placeholder="비밀번호 재입력"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                    {passwordMatches && <Text style={styles.matchText}>비밀번호가 일치합니다.</Text>}
                    {passwordMismatch && <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.primaryButton, isLoading && styles.disabledButton]}
                      disabled={isLoading}
                      onPress={handleResetPassword}
                    >
                      <Text style={styles.primaryButtonText}>{isLoading ? '처리 중...' : '비밀번호 재설정'}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>

              <View style={styles.stepDots}>
                {STEP_ORDER.map((item) => (
                  <View key={item} style={[styles.stepDot, step === item && styles.stepDotActive]} />
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal transparent visible={Boolean(notice)} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>알림</Text>
            <Text style={styles.noticeBody}>{notice}</Text>
            <TouchableOpacity style={styles.noticeButton} onPress={closeNotice}>
              <Text style={styles.noticeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  secureTextEntry?: boolean;
};

function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry,
}: FieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  bgImage: { ...StyleSheet.absoluteFillObject, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  screenShell: { flex: 1, width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: 18 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 4 },
  backText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  keyboardArea: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end', paddingTop: 32 },
  formArea: { width: '100%', paddingHorizontal: 14 },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  logoImg: { width: 64, height: 64, opacity: 0.82, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#4B5563', textAlign: 'center' },
  stepBody: { minHeight: 270 },
  formStack: { gap: 14 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginLeft: 2 },
  inputBox: { height: 50, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111' },
  primaryButton: { height: 50, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  disabledButton: { opacity: 0.58 },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  infoBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  infoText: { fontSize: 12.5, lineHeight: 18, fontWeight: '600', color: '#4B5563' },
  infoTextStrong: { fontWeight: '900', color: '#111827' },
  helperText: { color: '#9CA3AF', fontSize: 11.2, marginLeft: 4, marginTop: -4 },
  resendButton: { alignItems: 'center', paddingVertical: 8 },
  resendText: { fontSize: 13, fontWeight: '700', color: '#6B7280', textDecorationLine: 'underline' },
  strengthArea: { gap: 5, marginTop: -4 },
  strengthBars: { flexDirection: 'row', gap: 5 },
  strengthBar: { flex: 1, height: 4, borderRadius: 99, backgroundColor: '#E5E7EB' },
  strengthText: { fontSize: 11.5, fontWeight: '700' },
  matchText: { color: '#059669', fontSize: 11.5, fontWeight: '700', marginLeft: 4, marginTop: -4 },
  errorText: { color: '#DC2626', fontSize: 11.5, fontWeight: '700', marginLeft: 4, marginTop: -4 },
  stepDots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' },
  stepDotActive: { backgroundColor: '#111827' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeCard: { width: '100%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 20, padding: 22, alignItems: 'center' },
  noticeTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 8 },
  noticeBody: { fontSize: 14, color: '#4B5563', fontWeight: '700', lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  noticeButton: { height: 48, minWidth: 120, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  noticeButtonText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
});
