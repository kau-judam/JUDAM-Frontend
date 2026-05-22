import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
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
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Check, ChevronRight, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { convertBtiSurvey } from '@/features/bti/api';
import { saveMyPageSulbti } from '@/features/mypage/api';
import {
  BTI_QUESTIONS,
  BtiAnswers,
  BtiQuestion,
  buildAnswersWithCustomInputs,
  buildBtiSurveyPayload,
  getBtiTasteAxisValuesFromTasteVector,
  getSulbtiCodeFromSurveyResult,
  resolveSulbtiCode,
} from '@/features/bti/data';

const QUESTIONS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(BTI_QUESTIONS.length / QUESTIONS_PER_PAGE);

function clampBtiScore(value?: number) {
  if (!Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(5, Math.round(value || 3)));
}

export default function BTITestScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<BtiAnswers>({});
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const currentQuestions = useMemo(
    () => BTI_QUESTIONS.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE),
    [currentPage]
  );

  const progress = ((currentPage + 1) / TOTAL_PAGES) * 100;

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentPage]);

  const handleBack = useCallback(() => {
    if (isSubmitting) return;
    if (currentPage > 0) {
      setCurrentPage((page) => page - 1);
      return;
    }
    router.back();
  }, [currentPage, isSubmitting]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });

      return () => subscription.remove();
    }, [handleBack])
  );

  const handleSingleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultipleAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((item) => item !== option) };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const isQuestionComplete = useCallback((question: BtiQuestion) => {
    const answer = answers[question.id];
    if (question.type === 'multiple') {
      const selected = Array.isArray(answer) && answer.length > 0;
      const custom = question.allowCustom && customInputs[question.id]?.trim();
      return Boolean(selected || custom);
    }
    return answer !== undefined && answer !== null;
  }, [answers, customInputs]);

  const isPageComplete = useMemo(
    () => currentQuestions.every(isQuestionComplete),
    [currentQuestions, isQuestionComplete]
  );

  const handleNext = async () => {
    if (!isPageComplete || isSubmitting) return;
    const mergedAnswers = buildAnswersWithCustomInputs(answers, customInputs);

    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage((page) => page + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!BTI_QUESTIONS.every(isQuestionComplete)) {
        throw new Error('INCOMPLETE_BTI_ANSWERS');
      }
      if (!user) {
        throw new Error('LOGIN_REQUIRED');
      }
      const surveyPayload = buildBtiSurveyPayload(mergedAnswers);
      const conversion = await convertBtiSurvey(surveyPayload, user.id);
      const resultType = resolveSulbtiCode(getSulbtiCodeFromSurveyResult(conversion.bti_code, conversion.taste_vector));
      if (!resultType) throw new Error('Invalid sulbti result');
      const tasteScores = getBtiTasteAxisValuesFromTasteVector(conversion.taste_vector);
      await saveMyPageSulbti({
        type: resultType.split('-')[0],
        sweetnessScore: clampBtiScore(tasteScores.sweetness),
        bodyScore: clampBtiScore(tasteScores.body),
        carbonationScore: clampBtiScore(tasteScores.carbonation),
        flavorScore: clampBtiScore(6 - (tasteScores.tradition || 3)),
        abvScore: clampBtiScore(tasteScores.alcohol),
      });
      await updateUser({
        sulbti: resultType,
        sulbtiProfile: tasteScores,
        sulbtiFoodPairing: conversion.food_pairing || conversion.preferred_food_pairing,
      });
      router.replace(`/bti-result/${resultType}` as any);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        error instanceof Error && error.message === 'INCOMPLETE_BTI_ANSWERS' ? '답변 확인' : '결과 저장 실패',
        error instanceof Error && error.message === 'INCOMPLETE_BTI_ANSWERS'
          ? '아직 답변하지 않은 문항이 있어요. 처음부터 다시 확인해주세요.'
          : '잠시 후 다시 시도해 주세요.'
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
              <ArrowLeft size={21} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>술BTI 검사</Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>
        <View style={styles.lockContainer}>
          <View style={styles.lockCard}>
            <View style={styles.lockIcon}>
              <Lock size={26} color="#111" />
            </View>
            <Text style={styles.lockTitle}>로그인이 필요해요</Text>
            <Text style={styles.lockDesc}>술BTI 결과는 계정에 저장되어 펀딩 추천에 사용됩니다.</Text>
            <TouchableOpacity style={styles.lockButton} onPress={() => router.push('/login' as any)}>
              <Text style={styles.lockButtonText}>로그인하러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} disabled={isSubmitting} onPress={handleBack}>
            <ArrowLeft size={21} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>술BTI 검사</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>진행률</Text>
            <Text style={styles.progressValue}>{currentPage + 1} / {TOTAL_PAGES}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageIntro}>
          <Text style={styles.pageKicker}>막걸리 취향 질문지</Text>
          <Text style={styles.pageTitle}>당신의 술BTI를 알아보세요!</Text>
          <Text style={styles.pageDesc}>각 질문에 가장 가까운 답을 선택해 주세요.</Text>
        </View>

        {currentQuestions.map((question) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>Q{question.id}</Text>
              </View>
              {isQuestionComplete(question) && (
                <View style={styles.completeBadge}>
                  <Check size={12} color="#FFF" />
                </View>
              )}
            </View>
            <Text style={styles.questionText}>{question.text}</Text>

            {question.type === 'multiple' ? (
              <View style={styles.optionGroup}>
                {question.options.map((option) => {
                  const answer = answers[question.id];
                  const isSelected = Array.isArray(answer) && answer.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                      onPress={() => handleMultipleAnswer(question.id, option)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
                {question.allowCustom && (
                  <TextInput
                    style={styles.customInput}
                    value={customInputs[question.id] || ''}
                    onChangeText={(value) => setCustomInputs((prev) => ({ ...prev, [question.id]: value }))}
                    placeholder="직접 입력"
                    placeholderTextColor="#9CA3AF"
                    returnKeyType="done"
                  />
                )}
              </View>
            ) : (
              <View style={styles.optionGroup}>
                {question.options.map((option, index) => {
                  const value = index + 1;
                  const isSelected = answers[question.id] === value;
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                      onPress={() => handleSingleAnswer(question.id, value)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          activeOpacity={0.86}
          disabled={!isPageComplete || isSubmitting}
          style={[styles.nextButton, (!isPageComplete || isSubmitting) && styles.nextButtonDisabled]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, (!isPageComplete || isSubmitting) && styles.nextButtonTextDisabled]}>
            {currentPage < TOTAL_PAGES - 1 ? '다음' : isSubmitting ? '결과 저장 중' : '결과 보기'}
          </Text>
          {currentPage < TOTAL_PAGES - 1 && <ChevronRight size={19} color={isPageComplete ? '#FFF' : '#9CA3AF'} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 18 },
  headerRow: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  headerSpacer: { width: 38 },
  progressBlock: { paddingBottom: 14, paddingTop: 4 },
  progressMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  progressValue: { fontSize: 12, fontWeight: '900', color: '#111' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#111' },
  content: { padding: 18, gap: 16 },
  pageIntro: { gap: 5, paddingHorizontal: 2, paddingTop: 4 },
  pageKicker: { fontSize: 12, fontWeight: '900', color: '#9CA3AF' },
  pageTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  pageDesc: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  questionCard: { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', padding: 16 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  questionBadge: { backgroundColor: '#111', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  questionBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  completeBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  questionText: { fontSize: 15, lineHeight: 22, fontWeight: '800', color: '#111', marginBottom: 14 },
  optionGroup: { gap: 8 },
  optionButton: { minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 11 },
  optionButtonSelected: { backgroundColor: '#111', borderColor: '#111' },
  optionText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  optionTextSelected: { color: '#FFF' },
  customInput: { minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', paddingHorizontal: 14, fontSize: 14, fontWeight: '700', color: '#111' },
  footer: { backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 18, paddingTop: 12 },
  nextButton: { height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  nextButtonDisabled: { backgroundColor: '#E5E7EB' },
  nextButtonText: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  nextButtonTextDisabled: { color: '#9CA3AF' },
  lockContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  lockCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 28, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  lockIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  lockTitle: { fontSize: 21, fontWeight: '900', color: '#111', marginBottom: 8 },
  lockDesc: { fontSize: 14, lineHeight: 21, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 22 },
  lockButton: { height: 50, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  lockButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
