import React, { useEffect, useMemo, useState } from 'react';
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
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMyPageApiErrorMessage, getMyPageBadges, type MyPageBadge } from '@/features/mypage/api';

type BadgeViewItem = MyPageBadge & {
  image: ImageSourcePropType;
};

const BADGE_IMAGES: Record<string, ImageSourcePropType> = {
  welcome: require('../../../../assets/images/badges/welcome.png'),
  communicate: require('../../../../assets/images/badges/communicate.png'),
  'funding-beginner': require('../../../../assets/images/badges/funding_beginner.png'),
  'funding-intermediate': require('../../../../assets/images/badges/funding_intermediate.png'),
  'funding-expert': require('../../../../assets/images/badges/funding_expert.png'),
  'co-creator': require('../../../../assets/images/badges/co_creator.png'),
};

const FALLBACK_BADGES: MyPageBadge[] = [
  { badgeId: 'welcome', name: '반가워요!', displayOrder: 1, earned: false, earnedAt: null },
  { badgeId: 'communicate', name: '주담과 소통하기', displayOrder: 2, earned: false, earnedAt: null },
  { badgeId: 'funding-beginner', name: '펀딩 입문자', displayOrder: 3, earned: false, earnedAt: null },
  { badgeId: 'funding-intermediate', name: '펀딩 중급자', displayOrder: 4, earned: false, earnedAt: null },
  { badgeId: 'funding-expert', name: '펀딩 숙련가', displayOrder: 5, earned: false, earnedAt: null },
  { badgeId: 'co-creator', name: '공동 제작자', displayOrder: 6, earned: false, earnedAt: null },
];

export default function BadgeScreen() {
  const insets = useSafeAreaInsets();
  const [badges, setBadges] = useState<MyPageBadge[]>(FALLBACK_BADGES);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getMyPageBadges()
      .then((nextBadges) => {
        if (!mounted) return;
        setBadges(nextBadges);
        setErrorMessage(null);
      })
      .catch((error) => {
        if (!mounted) return;
        setErrorMessage(getMyPageApiErrorMessage(error, '뱃지 목록을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayBadges = useMemo<BadgeViewItem[]>(
    () =>
      [...badges]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .filter((badge) => BADGE_IMAGES[badge.badgeId])
        .map((badge) => ({
          ...badge,
          image: BADGE_IMAGES[badge.badgeId],
        })),
    [badges]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뱃지</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#111827" />
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.grid}>
          {displayBadges.map((badge) => (
            <View key={badge.badgeId} style={styles.badgeCard}>
              <View style={[styles.badgeCircle, badge.earned && styles.badgeCircleEarned]}>
                {badge.earned ? (
                  <Image source={badge.image} style={styles.badgeImage} />
                ) : (
                  <View style={styles.emptyBadgeInner}>
                    <Lock size={22} color="#C4CAD3" />
                  </View>
                )}
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footerText}>계속해서 뱃지가 추가될 예정이에요!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    height: 86,
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
  content: { paddingHorizontal: 24, paddingTop: 24 },
  loadingBox: { alignItems: 'center', paddingVertical: 16 },
  errorText: { marginBottom: 14, fontSize: 13, fontWeight: '800', color: '#EF4444', textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
  },
  badgeCard: {
    width: '47%',
    alignItems: 'center',
  },
  badgeCircle: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: '#EEF1F5',
    borderWidth: 1,
    borderColor: '#E2E7EE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badgeCircleEarned: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  emptyBadgeInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#E4E8EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgeName: { marginTop: 10, fontSize: 13, fontWeight: '900', color: '#374151', textAlign: 'center' },
  footerText: { marginTop: 34, fontSize: 12, fontWeight: '800', color: '#9CA3AF', textAlign: 'center' },
});
