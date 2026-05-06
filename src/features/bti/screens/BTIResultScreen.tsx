import React from 'react';
import {
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
import { getBtiResult } from '@/features/bti/data';

export default function BTIResultScreen() {
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: string }>();
  const { user } = useAuth();
  const result = getBtiResult(type);

  const handleShare = async () => {
    await Share.share({
      title: '나의 술BTI 결과',
      message: `나의 술BTI는 ${result.type} - ${result.name}입니다. 주담에서 나에게 맞는 막걸리 펀딩을 찾아보세요.`,
    });
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
          <Text style={styles.heroType}>{result.type}</Text>
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
                <Text style={styles.recommendText}>{drink}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>맛 프로필</Text>
          <View style={styles.profileList}>
            {result.tasteProfile.map((item) => (
              <View key={item.label} style={styles.profileRow}>
                <View style={styles.profileMeta}>
                  <Text style={styles.profileLabel}>{item.label}</Text>
                  <Text style={styles.profileValue}>{item.value}/5</Text>
                </View>
                <View style={styles.profileTrack}>
                  <View style={[styles.profileFill, { width: `${(item.value / 5) * 100}%` }]} />
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
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={() => router.replace('/bti-test' as any)}>
            <RotateCcw size={17} color="#374151" />
            <Text style={styles.secondaryButtonText}>다시하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.86} onPress={() => router.replace('/' as any)}>
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
  resultHero: { borderRadius: 28, paddingHorizontal: 28, paddingVertical: 34, alignItems: 'center' },
  heroLabel: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  heroType: { fontSize: 52, lineHeight: 60, fontWeight: '900', color: '#FFF', letterSpacing: 0 },
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
  recommendGrid: { flexDirection: 'row', gap: 8 },
  recommendItem: { flex: 1, minHeight: 58, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  recommendText: { fontSize: 13, lineHeight: 18, fontWeight: '800', color: '#374151', textAlign: 'center' },
  profileCard: { borderRadius: 22, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', padding: 18, gap: 16 },
  profileList: { gap: 14 },
  profileRow: { gap: 7 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileLabel: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  profileValue: { fontSize: 13, fontWeight: '900', color: '#111' },
  profileTrack: { height: 8, borderRadius: 999, backgroundColor: '#F3F4F6', overflow: 'hidden' },
  profileFill: { height: '100%', borderRadius: 999, backgroundColor: '#111' },
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
