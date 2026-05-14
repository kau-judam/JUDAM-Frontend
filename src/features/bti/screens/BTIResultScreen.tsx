import React, { useMemo } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Home, Lock, RotateCcw, Share2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { getBtiDisplayType, getBtiResult, normalizeBtiTasteAxisValue, resolveSulbtiCode } from '@/features/bti/data';

const BTI_CHARACTER_IMAGES: Record<string, ImageSourcePropType> = {
  SHFC: require('@/assets/images/BTI/1.png'),
  SHFU: require('@/assets/images/BTI/2.png'),
  SHMC: require('@/assets/images/BTI/3.png'),
  SHMU: require('@/assets/images/BTI/4.png'),
  SLFC: require('@/assets/images/BTI/5.png'),
  SLFU: require('@/assets/images/BTI/6.png'),
  SLMC: require('@/assets/images/BTI/7.png'),
  SLMU: require('@/assets/images/BTI/8.png'),
  DHFC: require('@/assets/images/BTI/9.png'),
  DHFU: require('@/assets/images/BTI/10.png'),
  DHMC: require('@/assets/images/BTI/11.png'),
  DHMU: require('@/assets/images/BTI/12.png'),
  DLFC: require('@/assets/images/BTI/13.png'),
  DLFU: require('@/assets/images/BTI/14.png'),
  DLMC: require('@/assets/images/BTI/15.png'),
  DLMU: require('@/assets/images/BTI/16.png'),
};

const SPECIAL_CHARACTER_LAYOUT_TYPES = new Set(['SHFC', 'SLFC']);

const TASTE_AXIS_CONFIG = [
  { key: 'sweetness', leftLabel: '달콤함', rightLabel: '깔끔함', valueLabel: '단맛', highSide: 'left' },
  { key: 'body', leftLabel: '가벼움', rightLabel: '걸쭉함', valueLabel: '바디', highSide: 'right' },
  { key: 'carbonation', leftLabel: '청량함', rightLabel: '탄산없음', valueLabel: '탄산', highSide: 'left' },
  { key: 'tradition', leftLabel: '구수함', rightLabel: '독특/새콤함', valueLabel: '전통감', highSide: 'left' },
  { key: 'alcohol', leftLabel: '낮은 도수', rightLabel: '높은 도수', valueLabel: '도수', highSide: 'right' },
] as const;

function clampProfileValue(value?: number) {
  if (!Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(5, value || 3));
}

function getAlcoholProfileValue(resultCode: string | null) {
  if (resultCode?.endsWith('-B')) return 5;
  if (resultCode?.endsWith('-M')) return 1;
  return 3;
}

function getAxisPosition(value: number, highSide: 'left' | 'right') {
  const ratio = ((clampProfileValue(value) - 1) / 4) * 100;
  const position = highSide === 'left' ? 100 - ratio : ratio;
  return Math.max(4, Math.min(96, Math.round(position)));
}

export default function BTIResultScreen() {
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: string }>();
  const { user } = useAuth();
  const savedCode = resolveSulbtiCode(user?.sulbti);
  const routeCode = resolveSulbtiCode(type);
  const resultCode = savedCode || routeCode;
  const displayType = getBtiDisplayType(resultCode);
  const result = resultCode ? getBtiResult(resultCode) : null;
  const characterImage = result ? BTI_CHARACTER_IMAGES[result.type] : null;
  const hasCharacterImage = characterImage !== null && characterImage !== undefined;
  const isSpecialCharacterLayout = result ? SPECIAL_CHARACTER_LAYOUT_TYPES.has(result.type) : false;
  const tasteAxes = useMemo(
    () => TASTE_AXIS_CONFIG.map((axis) => {
      const sourceValue =
        normalizeBtiTasteAxisValue(user?.sulbtiProfile?.[axis.key])
        ?? (axis.key === 'alcohol'
          ? getAlcoholProfileValue(resultCode)
          : result?.tasteProfile.find((item) => item.label === axis.valueLabel)?.value);
      return {
        ...axis,
        position: getAxisPosition(clampProfileValue(sourceValue), axis.highSide),
      };
    }),
    [result, resultCode, user?.sulbtiProfile]
  );

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({
        title: '나의 술BTI 결과',
        message: `나의 술BTI는 ${displayType} - ${result.name}입니다. 주담에서 나에게 맞는 막걸리 펀딩을 찾아보세요.`,
      });
    } catch {
      Alert.alert('공유 실패', '결과를 공유하지 못했습니다. 다시 시도해주세요.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft size={21} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>술BTI 결과</Text>
          <View style={styles.headerSpacer} />
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

  if (!savedCode || !result) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/mypage' as any)}>
            <ArrowLeft size={21} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>술BTI 결과</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.lockContainer}>
          <View style={styles.lockCard}>
            <View style={styles.lockIcon}>
              <RotateCcw size={26} color="#111" />
            </View>
            <Text style={styles.lockTitle}>아직 결과가 없어요</Text>
            <Text style={styles.lockDesc}>술BTI 검사를 끝까지 완료하면 결과가 계정에 저장됩니다.</Text>
            <TouchableOpacity style={styles.lockButton} onPress={() => router.replace('/bti-test' as any)}>
              <Text style={styles.lockButtonText}>검사 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/mypage' as any)}>
          <ArrowLeft size={21} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>술BTI 결과</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
      >
        <LinearGradient colors={['#111111', '#2B2B2B']} style={styles.resultHero}>
          <Text style={styles.heroLabel}>당신의 술BTI는</Text>
          <Text style={styles.heroType}>{displayType}</Text>
          {hasCharacterImage && (
            <Image
              source={characterImage}
              style={[styles.heroCharacter, isSpecialCharacterLayout && styles.heroCharacterSpecial]}
              resizeMode="contain"
            />
          )}
          <Text style={styles.heroName}>{result.name}</Text>
          <Text style={styles.heroEnglish}>{result.analysisTitle}</Text>
        </LinearGradient>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>상세 분석</Text>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주요 특징</Text>
          <View style={styles.traitWrap}>
            {result.traits.map((trait) => (
              <View key={trait} style={styles.traitPill}>
                <Text style={styles.traitText}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 막걸리</Text>
          <View style={styles.recommendGrid}>
            {result.recommendations.map((drink) => (
              <View key={drink} style={styles.recommendItem}>
                <Text style={styles.recommendText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88}>
                  {drink}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>맛 프로필</Text>
          <View style={styles.profileList}>
            {tasteAxes.map((axis) => (
              <View key={axis.key} style={styles.profileRow}>
                <View style={styles.profileMeta}>
                  <Text style={styles.profileLabel}>{axis.leftLabel}</Text>
                  <Text style={styles.profileLabelRight}>{axis.rightLabel}</Text>
                </View>
                <View style={styles.profileAxisTrack}>
                  <View style={styles.profileAxisCenter} />
                  <View style={[styles.profileAxisThumb, { left: `${axis.position}%` as `${number}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.86} onPress={handleShare}>
          <Share2 size={19} color="#FFF" />
          <Text style={styles.primaryButtonText}>결과 공유하기</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={() => router.push('/bti-test' as any)}>
            <RotateCcw size={17} color="#374151" />
            <Text style={styles.secondaryButtonText}>다시하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={() => router.replace('/(tabs)' as any)}>
            <Home size={17} color="#374151" />
            <Text style={styles.secondaryButtonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 18, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  headerSpacer: { width: 38 },
  content: { padding: 20, gap: 18 },
  resultHero: { borderRadius: 28, paddingHorizontal: 28, paddingVertical: 32, alignItems: 'center' },
  heroLabel: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  heroType: { fontSize: 52, lineHeight: 60, fontWeight: '900', color: '#FFF', letterSpacing: 0 },
  heroCharacter: { width: 330, height: 180, marginTop: 10, marginBottom: 6, transform: [{ translateX: -10 }] },
  heroCharacterSpecial: { width: 246, height: 226, marginTop: 8, marginBottom: 4 },
  heroName: { fontSize: 23, fontWeight: '900', color: '#FFF', marginTop: 8, textAlign: 'center' },
  heroEnglish: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.68)', marginTop: 5 },
  summaryCard: { backgroundColor: '#F9FAFB', borderRadius: 22, borderWidth: 1, borderColor: '#E5E7EB', padding: 18 },
  summaryTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 8 },
  summaryText: { fontSize: 15, lineHeight: 23, fontWeight: '700', color: '#374151' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  traitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  traitPill: { borderWidth: 1.5, borderColor: '#111', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: '#FFF' },
  traitText: { fontSize: 13, fontWeight: '900', color: '#111' },
  recommendGrid: { gap: 8 },
  recommendItem: { width: '78%', alignSelf: 'center', minHeight: 48, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  recommendText: { alignSelf: 'stretch', fontSize: 14, lineHeight: 18, fontWeight: '800', color: '#374151', textAlign: 'center' },
  profileCard: { borderRadius: 22, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 18, gap: 16 },
  profileList: { gap: 17 },
  profileRow: { gap: 8 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileLabel: { flex: 1, fontSize: 13, fontWeight: '900', color: '#111' },
  profileLabelRight: { flex: 1, fontSize: 13, fontWeight: '900', color: '#111', textAlign: 'right' },
  profileAxisTrack: { height: 6, borderRadius: 999, backgroundColor: '#111', overflow: 'visible', justifyContent: 'center' },
  profileAxisCenter: { position: 'absolute', left: '50%', width: 1, height: 14, backgroundColor: '#D1D5DB' },
  profileAxisThumb: { position: 'absolute', width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#111', shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  primaryButton: { height: 52, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  primaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  secondaryButtonText: { fontSize: 14, fontWeight: '900', color: '#374151' },
  lockContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  lockCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 28, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  lockIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  lockTitle: { fontSize: 21, fontWeight: '900', color: '#111', marginBottom: 8 },
  lockDesc: { fontSize: 14, lineHeight: 21, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 22 },
  lockButton: { height: 50, borderRadius: 16, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  lockButtonText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
