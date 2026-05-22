import React from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BadgeItem = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  earned: boolean;
};

const BADGES: BadgeItem[] = [
  {
    id: 'welcome',
    name: '반가워요!',
    image: require('../../../../assets/images/badges/welcome.png'),
    earned: true,
  },
  {
    id: 'communicate',
    name: '주담과 소통하기',
    image: require('../../../../assets/images/badges/communicate.png'),
    earned: false,
  },
  {
    id: 'funding-beginner',
    name: '펀딩 입문자',
    image: require('../../../../assets/images/badges/funding_beginner.png'),
    earned: false,
  },
  {
    id: 'funding-intermediate',
    name: '펀딩 중급자',
    image: require('../../../../assets/images/badges/funding_intermediate.png'),
    earned: false,
  },
  {
    id: 'funding-expert',
    name: '펀딩 숙련가',
    image: require('../../../../assets/images/badges/funding_expert.png'),
    earned: false,
  },
  {
    id: 'co-creator',
    name: '공동 제작자',
    image: require('../../../../assets/images/badges/co_creator.png'),
    earned: false,
  },
];

export default function BadgeScreen() {
  const insets = useSafeAreaInsets();

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
        <View style={styles.grid}>
          {BADGES.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
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
