import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Heart, Sparkles, Wine } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Progress } from '@/components/ui/progress';
import {
  FundingProject,
  getFundingProjectImageSource,
  getFundingStatusLabel,
  isCompletedFundingStatus,
} from '@/constants/data';
import { useFunding } from '@/contexts/FundingContext';
import { getFundingMainIngredientLabel } from '@/features/funding/projectLabels';

type Step = 'select-type' | 'select-funding';

const ARCHIVE_REVIEW_PROJECT_ID = 5;

export default function AddArchiveFlowScreen() {
  const insets = useSafeAreaInsets();
  const { projects } = useFunding();
  const [step, setStep] = useState<Step>('select-type');

  const completedFundingProjects = useMemo(() => {
    return projects.filter((project) => project.id === ARCHIVE_REVIEW_PROJECT_ID && isCompletedFundingStatus(project.status));
  }, [projects]);

  const fallbackProject = useMemo(
    () => projects.find((project) => project.id === ARCHIVE_REVIEW_PROJECT_ID) || null,
    [projects]
  );
  const fundingOptions = completedFundingProjects.length > 0 ? completedFundingProjects : fallbackProject ? [fallbackProject] : [];

  const currentStep = step === 'select-type' ? 1 : 2;
  const totalSteps = step === 'select-type' ? 2 : 3;
  const headerTitle = step === 'select-type' ? '새로운 술 기록' : '펀딩 프로젝트 선택';

  const handleBack = () => {
    if (step === 'select-funding') {
      setStep('select-type');
      return;
    }
    router.back();
  };

  const goNormalReview = () => {
    router.push(`/archive/review/${ARCHIVE_REVIEW_PROJECT_ID}?archiveMode=normal` as any);
  };

  const goFundingReview = (projectId: number) => {
    router.push(`/archive/review/${projectId}?archiveMode=funding` as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={handleBack}>
            <ArrowLeft size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.stepText}>{currentStep} / {totalSteps}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 92 }]}
      >
        {step === 'select-type' ? (
          <View style={styles.typeContent}>
            <View style={styles.introBlock}>
              <Text style={styles.questionTitle}>어떤 술을 기록할까요?</Text>
              <Text style={styles.questionDesc}>기록 유형에 따라 입력 항목이 달라져요</Text>
            </View>

            <TouchableOpacity style={styles.fundingTypeCard} activeOpacity={0.88} onPress={() => setStep('select-funding')}>
              <View style={styles.typeTextArea}>
                <View style={styles.typeEyebrowRow}>
                  <Sparkles size={16} color="#FACC15" />
                  <Text style={styles.fundingEyebrow}>펀딩 참여 술</Text>
                </View>
                <Text style={styles.fundingTypeTitle}>주담에서 펀딩한 술</Text>
                <Text style={styles.fundingTypeDesc}>내가 후원한 펀딩 술을 기록해요.{'\n'}배송 내역과 함께 시음 노트를 작성하세요!</Text>
              </View>
              <ChevronRight size={22} color="#8C92A0" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.normalTypeCard} activeOpacity={0.88} onPress={goNormalReview}>
              <View style={styles.typeTextArea}>
                <View style={styles.typeEyebrowRow}>
                  <Wine size={16} color="#6B7280" />
                  <Text style={styles.normalEyebrow}>일반 술</Text>
                </View>
                <Text style={styles.normalTypeTitle}>그 외 전통주</Text>
                <Text style={styles.normalTypeDesc}>구매하거나 선물받은 술,{'\n'}식당에서 마신 술 등을 기록해요.</Text>
              </View>
              <ChevronRight size={22} color="#A0A7B3" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.fundingContent}>
            <View style={styles.introBlock}>
              <Text style={styles.questionTitle}>어떤 펀딩 술인가요?</Text>
              <Text style={styles.questionDesc}>주담에서 진행된 펀딩을 선택해주세요</Text>
            </View>

            <View style={styles.projectList}>
              {fundingOptions.map((project) => (
                <FundingOptionCard key={project.id} project={project} onPress={() => goFundingReview(project.id)} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FundingOptionCard({ project, onPress }: { project: FundingProject; onPress: () => void }) {
  const progress = Math.min(Math.round((project.currentAmount / project.goalAmount) * 100), 100);
  const completed = isCompletedFundingStatus(project.status);

  return (
    <TouchableOpacity style={styles.projectCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.projectImageWrap}>
        <Image source={getFundingProjectImageSource(project)} style={styles.projectImage} />
        <View style={styles.heartBubble}>
          <Heart size={14} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.projectInfo}>
        <View style={styles.projectMetaRow}>
          <Text style={styles.breweryText} numberOfLines={1}>{project.brewery}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>{getFundingMainIngredientLabel(project)}</Text>
          </View>
          <View style={[styles.statusBadge, completed ? styles.statusDone : styles.statusActive]}>
            <Text style={[styles.statusText, completed ? styles.statusDoneText : styles.statusActiveText]}>
              {getFundingStatusLabel(project.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
        <View style={styles.projectProgressRow}>
          <Text style={styles.projectProgressText}>{progress}%</Text>
          <Text style={styles.projectDaysText}>{completed ? '펀딩 종료' : `${project.daysLeft}일 남음`}</Text>
        </View>
        <Progress value={progress} style={styles.projectProgressBar} indicatorStyle={styles.projectProgressFill} />
      </View>

      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F5' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF0F2', paddingHorizontal: 16, paddingBottom: 10 },
  headerRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center' },
  headerButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: '#111827', marginLeft: 4 },
  stepText: { fontSize: 14, fontWeight: '800', color: '#9CA3AF' },
  progressTrack: { height: 4, borderRadius: 999, backgroundColor: '#EEF0F2', overflow: 'hidden', marginHorizontal: 8 },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#111827' },
  content: { paddingHorizontal: 24, paddingTop: 34 },
  typeContent: { gap: 20 },
  fundingContent: { gap: 22 },
  introBlock: { gap: 8 },
  questionTitle: { fontSize: 24, lineHeight: 31, fontWeight: '900', color: '#111827' },
  questionDesc: { fontSize: 15, lineHeight: 22, fontWeight: '700', color: '#6B7280' },
  fundingTypeCard: { minHeight: 164, borderRadius: 18, backgroundColor: '#111422', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  normalTypeCard: { minHeight: 150, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E5E7EB', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeTextArea: { flex: 1, minWidth: 0 },
  typeEyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  fundingEyebrow: { fontSize: 13, fontWeight: '900', color: '#FACC15' },
  normalEyebrow: { fontSize: 13, fontWeight: '900', color: '#6B7280' },
  fundingTypeTitle: { fontSize: 20, lineHeight: 27, fontWeight: '900', color: '#FFFFFF', marginBottom: 8 },
  normalTypeTitle: { fontSize: 20, lineHeight: 27, fontWeight: '900', color: '#111827', marginBottom: 8 },
  fundingTypeDesc: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#C7CEDB' },
  normalTypeDesc: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280' },
  projectList: { gap: 14 },
  projectCard: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E5E7EB', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  projectImageWrap: { width: 82, height: 82, borderRadius: 14, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  projectImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartBubble: { position: 'absolute', left: 7, bottom: 7, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  projectInfo: { flex: 1, minWidth: 0 },
  projectMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  breweryText: { maxWidth: 80, fontSize: 12, fontWeight: '900', color: '#4B5563' },
  categoryBadge: { maxWidth: 92, borderRadius: 999, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4 },
  categoryText: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  statusBadge: { marginLeft: 'auto', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusDone: { backgroundColor: '#EFF6FF' },
  statusText: { fontSize: 11, fontWeight: '900' },
  statusActiveText: { color: '#059669' },
  statusDoneText: { color: '#2563EB' },
  projectTitle: { fontSize: 16, lineHeight: 22, fontWeight: '900', color: '#111827', marginBottom: 8 },
  projectProgressRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 5 },
  projectProgressText: { fontSize: 24, lineHeight: 29, fontWeight: '900', color: '#111827' },
  projectDaysText: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  projectProgressBar: { height: 5, borderRadius: 999, backgroundColor: '#E5E7EB' },
  projectProgressFill: { backgroundColor: '#111827' },
});
