import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Mail, MessageCircleQuestion } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import {
  createSupportInquiry,
  getSupportApiErrorMessage,
  type SupportInquiryCategory,
} from '@/features/support/api';
import { isValidEmail } from '@/utils/validation';

type InquiryCategoryOption = {
  label: string;
  value: SupportInquiryCategory;
};

const CATEGORY_OPTIONS: InquiryCategoryOption[] = [
  { label: '계정', value: 'ACCOUNT' },
  { label: '펀딩', value: 'FUNDING' },
  { label: '결제', value: 'PAYMENT' },
  { label: '배송', value: 'DELIVERY' },
  { label: '양조장', value: 'BREWERY' },
  { label: '기타', value: 'ETC' },
];

export default function SupportInquiryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const defaultEmail = useMemo(() => user?.email?.trim() || '', [user?.email]);
  const [replyEmail, setReplyEmail] = useState(defaultEmail);
  const [category, setCategory] = useState<SupportInquiryCategory>('ETC');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setReplyEmail(defaultEmail);
    setCategory('ETC');
    setSubject('');
    setContent('');
  };

  const validateForm = () => {
    const email = replyEmail.trim();
    const trimmedSubject = subject.trim();
    const trimmedContent = content.trim();

    if (!email) {
      Alert.alert('입력 확인', '답신 이메일을 입력해주세요.');
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert('입력 확인', '올바른 이메일 형식으로 입력해주세요.');
      return false;
    }
    if (!trimmedSubject) {
      Alert.alert('입력 확인', '문의 제목을 입력해주세요.');
      return false;
    }
    if (trimmedSubject.length < 2) {
      Alert.alert('입력 확인', '문의 제목을 2자 이상 입력해주세요.');
      return false;
    }
    if (!trimmedContent) {
      Alert.alert('입력 확인', '문의 내용을 입력해주세요.');
      return false;
    }
    if (trimmedContent.length < 10) {
      Alert.alert('입력 확인', '문의 내용을 10자 이상 자세히 입력해주세요.');
      return false;
    }
    return true;
  };

  const submitInquiry = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await createSupportInquiry({
        replyEmail: replyEmail.trim(),
        category,
        subject: subject.trim(),
        content: content.trim(),
      });
      Alert.alert('문의가 접수되었습니다.', '확인 후 입력하신 이메일로 답변드릴게요.', [
        {
          text: '확인',
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('문의 접수 실패', getSupportApiErrorMessage(error, '문의 접수 중 오류가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>고객센터 문의</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        >
          <View style={styles.guideCard}>
            <View style={styles.guideIcon}>
              <MessageCircleQuestion size={22} color="#111827" />
            </View>
            <View style={styles.guideTextBox}>
              <Text style={styles.guideTitle}>주담 고객센터</Text>
              <Text style={styles.guideDesc}>문의가 접수되면 운영팀이 확인 후 답신 이메일로 안내드립니다.</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <FieldLabel label="답신 이메일" required />
            <View style={styles.inputWithIcon}>
              <Mail size={18} color="#9CA3AF" />
              <TextInput
                value={replyEmail}
                onChangeText={setReplyEmail}
                placeholder="user@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                style={styles.iconInput}
              />
            </View>
            <Text style={styles.helperText}>카카오 로그인처럼 이메일이 없는 계정은 직접 입력해주세요.</Text>

            <FieldLabel label="문의 유형" required style={styles.fieldGap} />
            <View style={styles.categoryGrid}>
              {CATEGORY_OPTIONS.map((option) => {
                const selected = category === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.categoryButton, selected && styles.categoryButtonSelected]}
                    activeOpacity={0.82}
                    disabled={isSubmitting}
                    onPress={() => setCategory(option.value)}
                  >
                    {selected ? <CheckCircle2 size={15} color="#FFFFFF" /> : null}
                    <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <FieldLabel label="제목" required style={styles.fieldGap} />
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="문의 제목을 입력해주세요"
              placeholderTextColor="#9CA3AF"
              editable={!isSubmitting}
              style={styles.input}
              maxLength={80}
            />

            <FieldLabel label="문의 내용" required style={styles.fieldGap} />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="문의 내용을 자세히 작성해주세요"
              placeholderTextColor="#9CA3AF"
              multiline
              editable={!isSubmitting}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              maxLength={2000}
            />
            <Text style={styles.countText}>{content.length.toLocaleString()} / 2,000</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={submitInquiry}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>문의 접수하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function FieldLabel({ label, required, style }: { label: string; required?: boolean; style?: object }) {
  return (
    <Text style={[styles.fieldLabel, style]}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    minHeight: 74,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '900', color: '#111827' },
  headerSpacer: { width: 44 },
  keyboardAvoiding: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  guideCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    marginBottom: 16,
  },
  guideIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTextBox: { flex: 1 },
  guideTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  guideDesc: { fontSize: 13, fontWeight: '600', color: '#6B7280', lineHeight: 19 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  fieldLabel: { fontSize: 14, fontWeight: '900', color: '#111827', marginBottom: 8 },
  required: { color: '#EF4444' },
  fieldGap: { marginTop: 20 },
  inputWithIcon: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconInput: { flex: 1, minHeight: 50, fontSize: 15, fontWeight: '700', color: '#111827' },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  textArea: {
    minHeight: 160,
    paddingTop: 14,
    paddingBottom: 14,
    lineHeight: 21,
  },
  helperText: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#9CA3AF', lineHeight: 17 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryButtonSelected: { backgroundColor: '#111827', borderColor: '#111827' },
  categoryText: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  categoryTextSelected: { color: '#FFFFFF' },
  countText: { marginTop: 8, textAlign: 'right', fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: { opacity: 0.65 },
  submitText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
});
