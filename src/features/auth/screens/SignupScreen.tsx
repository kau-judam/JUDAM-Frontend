import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  User as UserIcon,
  X,
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import {
  formatPhoneNumber,
  getPasswordStrength,
  isPasswordReady,
  isValidEmail,
  isValidPhone,
} from '@/utils/validation';

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

const TERMS_CONTENT = {
  service: {
    title: '1. 서비스 이용약관',
    sections: [
      {
        title: '제1조 (목적 및 지위)',
        items: [
          '본 약관은 주담이 제공하는 전통주 레시피 제안, 펀딩, 양조 현황 공유 서비스 이용 조건을 정합니다.',
          '주담은 통신판매중개자로서 펀딩 프로젝트의 진행과 리워드 제공 책임은 각 양조장에게 있습니다.',
        ],
      },
      {
        title: '제2조 (회원 자격 및 연령 제한)',
        items: [
          '전통주 리워드 펀딩은 만 19세 이상 성인 회원만 참여할 수 있습니다.',
          '회원은 가입 시 정확한 정보를 제공해야 하며, 타인의 정보를 도용할 수 없습니다.',
        ],
      },
      {
        title: '제3조 (레시피 제안 및 권리 관계)',
        items: [
          '회원이 등록한 레시피 제안은 양조장의 검토 및 상품화 과정에 활용될 수 있습니다.',
          '상품화가 결정된 레시피는 별도 고지된 보상 및 표기 기준을 따릅니다.',
        ],
      },
      {
        title: '제4조 (펀딩 시스템 및 환불)',
        items: [
          '주담의 펀딩은 구매 예약형 리워드 크라우드펀딩이며, 목표 달성 여부에 따라 결제와 배송이 진행됩니다.',
          '프로젝트 일정, 환불, 배송 지연 관련 안내는 각 프로젝트 상세 정보와 공지사항을 우선합니다.',
        ],
      },
    ],
  },
  privacy: {
    title: '2. 개인정보 처리방침',
    sections: [
      {
        title: '수집 항목',
        items: [
          '회원가입 시 닉네임, 이메일, 비밀번호, 연락처를 수집합니다.',
          '양조장 인증 시 사업자등록번호, 양조장명, 주소, 담당자 연락처, 사업자등록증 정보를 수집할 수 있습니다.',
        ],
      },
      {
        title: '이용 목적',
        items: [
          '회원 식별, 본인 확인, 서비스 제공, 펀딩 참여 내역 관리, 리워드 배송 및 고객 문의 대응에 이용합니다.',
          '필수 목적 외 마케팅 정보 수신은 선택 동의한 회원에게만 적용됩니다.',
        ],
      },
      {
        title: '보유 및 이용 기간',
        items: [
          '회원 탈퇴 시 개인정보는 지체 없이 파기합니다.',
          '전자상거래법 등 관계 법령에 따라 보관이 필요한 결제, 환불, 분쟁 처리 기록은 법정 기간 동안 보관할 수 있습니다.',
        ],
      },
    ],
  },
};

type TermsModalType = 'service' | 'privacy' | null;

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPassVerifying, setIsPassVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);
  const [notice, setNotice] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState<TermsModalType>(null);

  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false,
  });

  const MIN_HEIGHT = SCREEN_HEIGHT * 0.70;
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const passwordMatches = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const passwordMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

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

  const showNotice = (message: string) => setNotice(message);

  const handleInputChange = (name: string, value: string) => {
    const nextValue = name === 'phone' ? formatPhoneNumber(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (name === 'email') {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    }
    if (name === 'name') {
      setIsNameChecked(false);
      setIsNameAvailable(false);
    }
    if (name === 'phone') {
      setIsPhoneVerified(false);
    }
  };

  const handleCheckEmail = async () => {
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail) {
      showNotice('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      showNotice('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (normalizedEmail === 'test@test.com') {
      setIsEmailChecked(true);
      setIsEmailAvailable(false);
      showNotice('이미 사용 중인 이메일입니다.');
      return;
    }
    setFormData((prev) => ({ ...prev, email: normalizedEmail }));
    setIsEmailChecked(true);
    setIsEmailAvailable(true);
    showNotice('사용 가능한 이메일입니다.');
  };

  const handleCheckName = async () => {
    const nickname = formData.name.trim();
    if (nickname.length < 2 || nickname.length > 12) {
      showNotice('닉네임은 2자 이상 12자 이하로 입력해주세요.');
      return;
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) {
      showNotice('닉네임에는 특수문자를 사용할 수 없습니다.');
      return;
    }
    if (nickname.toLowerCase() === 'admin') {
      setIsNameChecked(true);
      setIsNameAvailable(false);
      showNotice('이미 사용 중인 닉네임입니다.');
      return;
    }
    setFormData((prev) => ({ ...prev, name: nickname }));
    setIsNameChecked(true);
    setIsNameAvailable(true);
    showNotice('사용 가능한 닉네임입니다.');
  };

  const handleTermsChange = (key: keyof typeof terms) => {
    if (key === 'all') {
      const newVal = !terms.all;
      setTerms({ all: newVal, service: newVal, privacy: newVal, marketing: newVal });
      return;
    }

    const next = { ...terms, [key]: !terms[key] };
    next.all = next.service && next.privacy && next.marketing;
    setTerms(next);
  };

  const handlePassVerification = () => {
    if (!isValidPhone(formData.phone)) {
      showNotice('연락처를 정확히 입력해주세요.');
      return;
    }
    setIsPassVerifying(true);
    showNotice('PASS 본인인증을 진행합니다.');
    setTimeout(() => {
      setIsPassVerifying(false);
      setIsPhoneVerified(true);
      showNotice('본인인증이 완료되었습니다.');
    }, 900);
  };

  const handleSignup = async () => {
    if (!isNameChecked || !isNameAvailable) {
      showNotice('닉네임 중복 확인을 완료해주세요.');
      return;
    }
    if (!isEmailChecked || !isEmailAvailable) {
      showNotice('이메일 중복 확인을 완료해주세요.');
      return;
    }
    if (!isPasswordReady(formData.password)) {
      showNotice('비밀번호는 8자 이상, 영문 대소문자와 숫자를 포함해야 합니다.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showNotice('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isPhoneVerified) {
      showNotice('PASS 본인인증을 완료해주세요.');
      return;
    }
    if (!terms.service || !terms.privacy) {
      showNotice('필수 약관에 동의해주세요.');
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
      showNotice('회원가입에 실패했습니다.');
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
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => showNotice('카카오 회원가입은 준비 중입니다.')}
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
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>닉네임</Text>
                    {isNameChecked && isNameAvailable && (
                      <View style={styles.availableRow}>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.availableTxt}>사용 가능</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.inputBox, { flex: 1 }]}>
                      <UserIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="술담이"
                        placeholderTextColor="#9CA3AF"
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        autoCorrect={false}
                        editable={!(isNameChecked && isNameAvailable)}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.smallBtn, isNameChecked && isNameAvailable ? styles.smallBtnDone : null]}
                      onPress={handleCheckName}
                      disabled={isNameChecked && isNameAvailable}
                    >
                      <Text style={styles.smallBtnTxt}>
                        {isNameChecked && isNameAvailable ? '확인완료' : '중복확인'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helperText}>2~12자 이내, 특수문자 불가</Text>
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
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!(isEmailChecked && isEmailAvailable)}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.smallBtn, isEmailChecked && isEmailAvailable ? styles.smallBtnDone : null]}
                      onPress={handleCheckEmail}
                      disabled={isEmailChecked && isEmailAvailable}
                    >
                      <Text style={styles.smallBtnTxt}>
                        {isEmailChecked && isEmailAvailable ? '확인완료' : '중복확인'}
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
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                  {formData.password.length > 0 && (
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
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPw}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPw(!showConfirmPw)}>
                      {showConfirmPw ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                    </TouchableOpacity>
                  </View>
                  {passwordMatches && <Text style={styles.matchText}>비밀번호가 일치합니다.</Text>}
                  {passwordMismatch && <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>본인인증 (PASS)</Text>
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
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        editable={!isPhoneVerified}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.passBtn, isPhoneVerified ? styles.smallBtnDone : null]}
                      onPress={handlePassVerification}
                      disabled={isPhoneVerified || isPassVerifying}
                    >
                      <ShieldCheck size={15} color="#FFF" />
                      <Text style={styles.smallBtnTxt}>
                        {isPhoneVerified ? '완료' : isPassVerifying ? '확인중' : 'PASS 인증'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.termsArea}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleTermsChange('all')}
                    style={[styles.allTerms, terms.all ? styles.allTermsActive : null]}
                  >
                    <View style={[styles.check, terms.all ? styles.checkActive : null]}>
                      {terms.all && <CheckCircle2 size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.allTermsTxt}>전체 동의</Text>
                  </TouchableOpacity>

                  <View style={styles.termsList}>
                    <TermRow
                      label="[필수] 이용약관 동의"
                      active={terms.service}
                      onToggle={() => handleTermsChange('service')}
                      onPressLink={() => setTermsModalOpen('service')}
                    />
                    <TermRow
                      label="[필수] 개인정보처리방침 동의"
                      active={terms.privacy}
                      onToggle={() => handleTermsChange('privacy')}
                      onPressLink={() => setTermsModalOpen('privacy')}
                    />
                    <TermRow
                      label="[선택] 마케팅 수신 동의"
                      active={terms.marketing}
                      onToggle={() => handleTermsChange('marketing')}
                      sub="이벤트, 할인 혜택 등의 정보를 이메일/SMS로 받아보실 수 있습니다."
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSignup}
                  disabled={isLoading}
                  style={[styles.signupBtn, isLoading ? { opacity: 0.6 } : null]}
                >
                  <Text style={styles.signupBtnTxt}>{isLoading ? '가입 중...' : '회원가입'}</Text>
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

      <TermsModal
        type={termsModalOpen}
        visible={Boolean(termsModalOpen)}
        onClose={() => setTermsModalOpen(null)}
      />

      <Modal transparent visible={Boolean(notice)} animationType="fade" onRequestClose={() => setNotice('')}>
        <View style={styles.modalBackdrop}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>알림</Text>
            <Text style={styles.noticeBody}>{notice}</Text>
            <TouchableOpacity style={styles.noticeButton} onPress={() => setNotice('')}>
              <Text style={styles.noticeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TermRow({ label, active, onToggle, sub, onPressLink }: any) {
  const isRequired = label.includes('[필수]');
  const displayLabel = label.replace('[필수]', '').replace('[선택]', '');

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.termRow}>
      <View style={[styles.smallCheck, active ? styles.checkActive : null]}>
        {active && <CheckCircle2 size={10} color="#FFF" />}
      </View>
      <View style={styles.termContent}>
        <View style={styles.termTopRow}>
          <Text style={styles.termLabel}>
            <Text style={isRequired ? styles.requiredText : styles.optionalText}>
              {isRequired ? '[필수]' : '[선택]'}
            </Text>
            {displayLabel}
          </Text>
          {onPressLink && (
            <TouchableOpacity onPress={onPressLink} style={styles.termLinkBtn}>
              <FileText size={12} color="#9CA3AF" />
              <Text style={styles.termLinkText}>보기</Text>
            </TouchableOpacity>
          )}
        </View>
        {sub && <Text style={styles.termSub}>{sub}</Text>}
      </View>
    </TouchableOpacity>
  );
}

function TermsModal({ type, visible, onClose }: { type: TermsModalType; visible: boolean; onClose: () => void }) {
  const content = type ? TERMS_CONTENT[type] : TERMS_CONTENT.service;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.termsModalBackdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.termsModalSheet}>
          <View style={styles.termsModalHeader}>
            <Text style={styles.termsModalTitle}>{content.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.termsCloseBtn}>
              <X size={18} color="#111" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.termsScroll} contentContainerStyle={styles.termsScrollContent}>
            {content.sections.map((section) => (
              <View key={section.title} style={styles.termsSection}>
                <Text style={styles.termsSectionTitle}>{section.title}</Text>
                {section.items.map((item) => (
                  <Text key={item} style={styles.termsItem}>• {item}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.termsConfirmBtn} onPress={onClose}>
            <Text style={styles.termsConfirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  greeting: { color: '#FFF', fontSize: 28, fontWeight: '700', lineHeight: 35, marginBottom: 4 },
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
  passBtn: { height: 48, paddingHorizontal: 13, backgroundColor: '#111827', borderRadius: 12, justifyContent: 'center', alignItems: 'center', minWidth: 96, flexDirection: 'row', gap: 5 },
  smallBtnDone: { backgroundColor: '#059669' },
  smallBtnTxt: { color: '#FFF', fontSize: 12.5, fontWeight: '700' },
  helperText: { color: '#9CA3AF', fontSize: 11.2, marginLeft: 4 },
  strengthArea: { gap: 5, marginTop: 2 },
  strengthBars: { flexDirection: 'row', gap: 5 },
  strengthBar: { flex: 1, height: 4, borderRadius: 99, backgroundColor: '#E5E7EB' },
  strengthText: { fontSize: 11.5, fontWeight: '700' },
  matchText: { color: '#059669', fontSize: 11.5, fontWeight: '700', marginLeft: 4 },
  errorText: { color: '#DC2626', fontSize: 11.5, fontWeight: '700', marginLeft: 4 },
  termsArea: { gap: 12, marginTop: 8 },
  allTerms: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  allTermsActive: { borderColor: '#111' },
  allTermsTxt: { fontSize: 14.4, fontWeight: '600', color: '#111' },
  check: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  checkActive: { backgroundColor: '#111', borderColor: '#111' },
  termsList: { gap: 10, paddingLeft: 8 },
  termRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  smallCheck: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  termContent: { flex: 1, marginTop: -2 },
  termTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  termLabel: { flex: 1, fontSize: 13.12, color: '#374151', lineHeight: 20 },
  requiredText: { color: '#DC2626', fontWeight: '700' },
  optionalText: { color: '#6B7280', fontWeight: '600' },
  termLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2 },
  termLinkText: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'underline' },
  termSub: { fontSize: 11.2, color: '#9CA3AF', marginTop: 2 },
  signupBtn: { height: 52, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  signupBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerTxt: { fontSize: 13.12, color: '#6B7280', fontWeight: '500' },
  footerLink: { fontSize: 13.12, fontWeight: '700', color: '#111', textDecorationLine: 'underline' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeCard: { width: '100%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 20, padding: 22, alignItems: 'center' },
  noticeTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 8 },
  noticeBody: { fontSize: 14, color: '#4B5563', fontWeight: '700', lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  noticeButton: { height: 48, minWidth: 120, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  noticeButtonText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  termsModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  termsModalSheet: { maxHeight: SCREEN_HEIGHT * 0.78, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 18, paddingHorizontal: 22, paddingBottom: 22 },
  termsModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  termsModalTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: '#111' },
  termsCloseBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  termsScroll: { maxHeight: SCREEN_HEIGHT * 0.52 },
  termsScrollContent: { paddingBottom: 8, gap: 16 },
  termsSection: { gap: 8 },
  termsSectionTitle: { fontSize: 14.5, color: '#111', fontWeight: '800' },
  termsItem: { fontSize: 12.6, color: '#4B5563', lineHeight: 20, fontWeight: '500' },
  termsConfirmBtn: { height: 50, borderRadius: 14, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  termsConfirmText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
