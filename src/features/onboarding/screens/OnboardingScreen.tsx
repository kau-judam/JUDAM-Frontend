import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowRight,
  ChefHat,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AnimatedRe, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SafeStorage from '@/utils/storage';

const SLIDES = [
  {
    id: 0,
    image: require('../../../../newpicutre/picure3.jpg'),
    resizeMode: 'contain',
    badge: null,
    BadgeIcon: null,
    isBrandSlide: true,
    title: "전통주의\n새로운 이야기",
    subtitle: "소중한 전통을 함께 이어가는\n크라우드펀딩 플랫폼",
  },
  {
    id: 1,
    image: require('../../../../newpicutre/desk.jpg'),
    resizeMode: 'contain',
    badge: "술 BTI 테스트",
    BadgeIcon: Sparkles,
    isBrandSlide: false,
    title: "나만의 술 취향을\n발견하세요",
    subtitle: "간단한 질문으로 당신에게 딱 맞는\n전통주 유형을 찾아드려요",
  },
  {
    id: 2,
    image: require('../../../../newpicutre/picture2.jpg'),
    resizeMode: 'contain',
    badge: "크라우드펀딩",
    BadgeIcon: TrendingUp,
    isBrandSlide: false,
    title: "전통 양조장을\n함께 응원해요",
    subtitle: "소규모 양조장의 꿈을 펀딩하고\n완성된 술을 가장 먼저 받아보세요",
  },
  {
    id: 3,
    image: require('../../../../newpicutre/picture1.jpg'),
    resizeMode: 'contain',
    badge: "오픈 키친",
    BadgeIcon: ChefHat,
    isBrandSlide: false,
    title: "양조장 현장을\n실시간으로",
    subtitle: "발효부터 병입까지, 내가 펀딩한\n술의 탄생 과정을 함께해요",
  },
];

const TOTAL = SLIDES.length + 1;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
  }, []);

  const isCTA = current === SLIDES.length;

  const go = (index: number) => {
    setDir(index > current ? 1 : -1);
    setCurrent(index);
  };

  const handleNext = () => {
    if (current < SLIDES.length) go(current + 1);
  };

  const handleSkip = () => go(SLIDES.length);

  const finishOnboarding = async (target: string) => {
    await SafeStorage.setItem('judam_onboarded', 'true');
    router.replace(target as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* Slides */}
      <View style={StyleSheet.absoluteFill}>
        {!isCTA ? (
          <AnimatedRe.View
            key={`slide-${current}`}
            entering={dir > 0 ? SlideInRight.duration(380) : SlideInLeft.duration(380)}
            exiting={dir > 0 ? SlideOutLeft.duration(380) : SlideOutRight.duration(380)}
            style={StyleSheet.absoluteFill}
          >
            <FeatureSlide slide={SLIDES[current]} insets={insets} />
          </AnimatedRe.View>
        ) : (
          <AnimatedRe.View
            key="cta"
            entering={SlideInRight.duration(380)}
            exiting={SlideOutLeft.duration(380)}
            style={StyleSheet.absoluteFill}
          >
            <CTASlide
              onLogin={() => finishOnboarding('/login')}
              onSignup={() => finishOnboarding('/signup')}
              onGuest={() => {
                RNStatusBar.setHidden(false, 'fade');
                finishOnboarding('/(tabs)');
              }}
              insets={insets}
            />
          </AnimatedRe.View>
        )}
      </View>

      {/* Bottom nav (feature slides only) */}
      {!isCTA && (
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 40 }]}>
          {/* Progress dots */}
          <View style={styles.pagination}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === current ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {/* Skip / Next */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>건너뛰기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNext}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>
                {current < SLIDES.length - 1 ? "다음" : "시작하기"}
              </Text>
              {current < SLIDES.length - 1 ? (
                <ChevronRight size={16} color="#111" />
              ) : (
                <ArrowRight size={16} color="#111" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function FeatureSlide({ slide, insets }: { slide: any; insets: any }) {
  const { BadgeIcon } = slide;

  return (
    <View style={styles.slide}>
      <View style={styles.bgImageFrame}>
        <Image source={slide.image} style={styles.bgImage} resizeMode={slide.resizeMode} />
      </View>
      {/* Dark gradient overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.9)']}
        locations={[0, 0.45, 1]}
        style={styles.gradient}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent']}
        style={[styles.gradient, { height: 160 }]}
      />

      <View style={[styles.content, { paddingTop: insets.top + 56 }]}>
        {slide.isBrandSlide ? (
          <AnimatedRe.View entering={FadeIn.delay(200)} style={styles.brandRow}>
            <Image source={require('@/assets/images/logo.png')} style={styles.brandLogo} />
            <Text style={styles.brandText}>주담</Text>
          </AnimatedRe.View>
        ) : <View style={{ height: 36 }} />}

        <View style={styles.textContainer}>
          {slide.badge && (
            <AnimatedRe.View entering={FadeIn.delay(300)} style={styles.badge}>
              {BadgeIcon && <BadgeIcon size={12} color="#FFF" />}
              <Text style={styles.badgeText}>{slide.badge.toUpperCase()}</Text>
            </AnimatedRe.View>
          )}
          <AnimatedRe.Text entering={FadeIn.delay(400)} style={styles.title}>{slide.title}</AnimatedRe.Text>
          <AnimatedRe.Text entering={FadeIn.delay(500)} style={styles.subtitle}>{slide.subtitle}</AnimatedRe.Text>
        </View>
      </View>
    </View>
  );
}

function CTASlide({ onLogin, onSignup, onGuest, insets }: any) {
  const features = [
    { emoji: "🍶", label: "술BTI\n테스트" },
    { emoji: "💰", label: "크라우드\n펀딩" },
    { emoji: "🏭", label: "양조\n현황" },
    { emoji: "📝", label: "나만의\n레시피 제안" },
  ];

  return (
    <View style={styles.ctaContainer}>
      <View style={[styles.ctaVisual, { paddingTop: insets.top + 80 }]}>
        {/* Decorative blobs */}
        <View style={[styles.blob, { top: -80, right: -80, width: 220, height: 220, backgroundColor: '#F3F4F6' }]} />
        <View style={[styles.blob, { bottom: -12, left: -12, width: 160, height: 160, backgroundColor: '#F3F4F6' }]} />

        <AnimatedRe.View entering={ZoomIn.springify()} style={styles.ctaLogoSection}>
          <View style={styles.ctaLogoBox}>
            <Text style={{ fontSize: 40 }}>🍶</Text>
          </View>
          <Text style={styles.ctaBrandName}>주담</Text>
          <Text style={styles.ctaTagline}>JuDam · 전통주 크라우드펀딩</Text>
        </AnimatedRe.View>

        <View style={styles.featureGrid}>
          {features.map((f, i) => (
            <AnimatedRe.View 
              key={i} 
              entering={FadeIn.delay(400 + i * 60)}
              style={styles.featureItem}
            >
              <Text style={{ fontSize: 22 }}>{f.emoji}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </AnimatedRe.View>
          ))}
        </View>

        <AnimatedRe.Text entering={FadeIn.delay(700)} style={styles.ctaDesc}>
          전통주의 가치를 함께 만들어가는{'\n'}새로운 방식
        </AnimatedRe.Text>
      </View>

      <View style={[styles.ctaActions, { paddingBottom: insets.bottom + 40, paddingTop: 28 }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onLogin}>
          <Text style={styles.primaryBtnText}>로그인</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryBtn} onPress={onSignup}>
          <Text style={styles.secondaryBtnText}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestBtn} onPress={onGuest}>
          <Text style={styles.guestBtnText}>비회원으로 둘러보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  slide: { flex: 1 },
  bgImageFrame: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  bgImage: { width: '100%', height: '100%', objectFit: 'contain' },
  gradient: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, paddingHorizontal: 32, paddingBottom: 144 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 36, height: 36, opacity: 0.9 },
  brandText: { color: '#FFF', fontSize: 21, fontWeight: '600', letterSpacing: 1.2 },
  textContainer: { marginTop: 'auto' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', marginBottom: 16 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '600', letterSpacing: 1.2 },
  title: { color: '#FFF', fontSize: 34, fontWeight: '700', lineHeight: 44, marginBottom: 16 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 24.5 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 32, zIndex: 20 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 28, backgroundColor: '#FFF' },
  dotInactive: { width: 6, backgroundColor: 'rgba(255,255,255,0.35)' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipBtn: { paddingVertical: 10, paddingHorizontal: 4 },
  skipText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  nextBtn: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  nextBtnText: { color: '#111', fontSize: 14, fontWeight: '600' },
  ctaContainer: { flex: 1, backgroundColor: '#FFF' },
  ctaVisual: { flex: 1, alignItems: 'center', paddingHorizontal: 32, backgroundColor: '#F9FAFB', overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 1000, opacity: 0.6 },
  ctaLogoSection: { alignItems: 'center', marginBottom: 40, zIndex: 10 },
  ctaLogoBox: { width: 88, height: 88, backgroundColor: '#111', borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 15 },
  ctaBrandName: { fontSize: 35, fontWeight: '700', color: '#111' },
  ctaTagline: { fontSize: 12.8, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  featureGrid: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 24, zIndex: 10 },
  featureItem: { flex: 1, backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 4, borderRadius: 18, alignItems: 'center', gap: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  featureLabel: { fontSize: 9.3, textAlign: 'center', color: '#4B5563', fontWeight: '500', lineHeight: 12.6 },
  ctaDesc: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 19.2, fontWeight: '500', zIndex: 10 },
  ctaActions: { paddingHorizontal: 28, gap: 12, backgroundColor: '#FFF' },
  primaryBtn: { height: 56, backgroundColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { height: 56, borderWidth: 2, borderColor: '#111', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#111', fontSize: 16, fontWeight: '600' },
  guestBtn: { paddingVertical: 8, alignItems: 'center' },
  guestBtnText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
});
