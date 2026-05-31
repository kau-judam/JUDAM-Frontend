import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, Heart, Sparkles, Wine } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Progress } from '@/components/ui/progress';
import {
  getMyPageApiErrorMessage,
  getMyPageParticipatedFundings,
  type MyPageParticipatedFunding,
} from '@/features/mypage/api';

type Step = 'select-type' | 'select-funding';

export default function AddArchiveFlowScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('select-type');
  const [fundingOptions, setFundingOptions] = useState<MyPageParticipatedFunding[]>([]);
  const [isFundingLoading, setIsFundingLoading] = useState(false);
  const [fundingError, setFundingError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setIsFundingLoading(true);
      setFundingError('');

      getMyPageParticipatedFundings()
        .then((items) => {
          if (!active) return;
          setFundingOptions(items);
        })
        .catch((error) => {
          if (!active) return;
          setFundingOptions([]);
          setFundingError(getMyPageApiErrorMessage(error, '참여 펀딩 목록을 불러오지 못했습니다.'));
        })
        .finally(() => {
          if (active) setIsFundingLoading(false);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const currentStep = step === 'select-type' ? 1 : 2;
  const totalSteps = 2;
  const headerTitle = step === 'select-type' ? '새로운 술 기록' : '펀딩 술 선택';

  const handleBack = () => {
    if (step === 'select-funding') {
      setStep('select-type');
      return;
    }
    router.back();
  };

  const goNormalReview = () => {
    router.push('/mypage/archive/write?type=normal' as any);
  };

  const goFundingReview = (funding: MyPageParticipatedFunding) => {
    const query = new URLSearchParams({
      type: 'funding',
      fundingId: String(funding.fundingId),
      orderId: String(funding.orderId),
    });
    if (funding.reviewId) query.set('reviewId', String(funding.reviewId));
    router.push(`/mypage/archive/write?${query.toString()}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.75} onPress={handleBack}>
            <ArrowLeft size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.stepText}>
            {currentStep} / {totalSteps}
          </Text>
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
              <Text style={styles.questionDesc}>기록 유형에 따라 입력 항목이 달라져요.</Text>
            </View>

            <TouchableOpacity style={styles.fundingTypeCard} activeOpacity={0.88} onPress={() => setStep('select-funding')}>
              <View style={styles.typeTextArea}>
                <View style={styles.typeEyebrowRow}>
                  <Sparkles size={16} color="#FACC15" />
                  <Text style={styles.fundingEyebrow}>펀딩 참여 술</Text>
                </View>
                <Text style={styles.fundingTypeTitle}>주담에서 후원한 술</Text>
                <Text style={styles.fundingTypeDesc}>내가 참여한 펀딩 목록에서 술을 골라 기록해요.</Text>
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
                <Text style={styles.normalTypeDesc}>직접 마신 술 이름과 도수를 입력해서 기록해요.</Text>
              </View>
              <ChevronRight size={22} color="#A0A7B3" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.fundingContent}>
            <View style={styles.introBlock}>
              <Text style={styles.questionTitle}>어떤 펀딩 술인가요?</Text>
              <Text style={styles.questionDesc}>결제 완료된 참여 펀딩 목록에서 선택해주세요.</Text>
            </View>

            {isFundingLoading ? (
              <EmptyBox>
                <ActivityIndicator color="#111827" />
                <Text style={styles.emptyText}>참여 펀딩 목록을 불러오는 중입니다.</Text>
              </EmptyBox>
            ) : fundingError ? (
              <EmptyBox>
                <Text style={styles.emptyTitle}>목록을 불러오지 못했어요</Text>
                <Text style={styles.emptyText}>{fundingError}</Text>
              </EmptyBox>
            ) : fundingOptions.length === 0 ? (
              <EmptyBox>
                <Text style={styles.emptyTitle}>참여한 펀딩이 없어요</Text>
                <Text style={styles.emptyText}>결제 완료된 펀딩이 있으면 이곳에서 술 기록을 작성할 수 있어요.</Text>
              </EmptyBox>
            ) : (
              <View style={styles.projectList}>
                {fundingOptions.map((funding) => (
                  <FundingOptionCard
                    key={`${funding.fundingId}-${funding.orderId}`}
                    funding={funding}
                    onPress={() => goFundingReview(funding)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function EmptyBox({ children }: { children: React.ReactNode }) {
  return <View style={styles.emptyBox}>{children}</View>;
}

function getFundingImageSource(funding: MyPageParticipatedFunding): ImageSourcePropType {
  return funding.thumbnailUrl ? { uri: funding.thumbnailUrl } : require('@/assets/images/splash-icon.png');
}

function FundingOptionCard({ funding, onPress }: { funding: MyPageParticipatedFunding; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.projectCard} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.projectImageWrap}>
        <Image source={getFundingImageSource(funding)} style={styles.projectImage} />
        <View style={styles.heartBubble}>
          <Heart size={14} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.projectInfo}>
        <View style={styles.projectMetaRow}>
          <Text style={styles.breweryText} numberOfLines={1}>
            {funding.breweryName || '양조장'}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {funding.ingredients || '재료 정보 없음'}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{funding.fundingStatus}</Text>
          </View>
        </View>

        <Text style={styles.projectTitle} numberOfLines={2}>
          {funding.projectName}
        </Text>
        <View style={styles.projectProgressRow}>
          <Text style={styles.projectProgressText}>{funding.abv ? `${funding.abv}%` : '-'}</Text>
          <Text style={styles.projectDaysText}>{funding.hasReview ? '후기 있음' : '후기 없음'}</Text>
        </View>
        <Progress value={funding.hasReview ? 100 : 0} style={styles.projectProgressBar} indicatorStyle={styles.projectProgressFill} />
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
  breweryText: { maxWidth: 86, fontSize: 12, fontWeight: '900', color: '#4B5563' },
  categoryBadge: { maxWidth: 110, borderRadius: 999, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4 },
  categoryText: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  statusBadge: { marginLeft: 'auto', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EFF6FF' },
  statusText: { fontSize: 11, fontWeight: '900', color: '#2563EB' },
  projectTitle: { fontSize: 16, lineHeight: 22, fontWeight: '900', color: '#111827', marginBottom: 8 },
  projectProgressRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 5 },
  projectProgressText: { fontSize: 24, lineHeight: 29, fontWeight: '900', color: '#111827' },
  projectDaysText: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
  projectProgressBar: { height: 5, borderRadius: 999, backgroundColor: '#E5E7EB' },
  projectProgressFill: { backgroundColor: '#111827' },
  emptyBox: { minHeight: 180, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: '#111827', textAlign: 'center' },
  emptyText: { fontSize: 13, lineHeight: 20, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
});
