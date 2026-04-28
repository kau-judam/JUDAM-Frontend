import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  User as UserIcon, 
  Building2, 
  Wine, 
  TrendingUp, 
  Archive, 
  FileCheck, 
  FolderKanban, 
  LayoutDashboard,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function UserTypeSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { updateUser } = useAuth();
  const [selectedType, setSelectedType] = useState<'user' | 'brewery' | null>(null);

  const handleUserSelection = async () => {
    await updateUser({ type: 'user' });
    router.replace('/(tabs)');
  };

  const handleBrewerySelection = async () => {
    await updateUser({ type: 'brewery' });
    router.push('/brewery/verification' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoSection, { paddingTop: insets.top + 60 }]}>
           <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: 'center' }}>
              <View style={styles.mainLogo}>
                 <Image source={require('@/assets/images/logo.png')} style={styles.logoImg} />
              </View>
              <Text style={styles.mainTitle}>사용자 유형을 선택해주세요</Text>
           </Animated.View>
        </View>

        <View style={styles.cardArea}>
           <Animated.View entering={FadeIn.delay(200)}>
              <TouchableOpacity 
                style={[styles.card, selectedType === 'user' && styles.cardActive]} 
                onPress={() => setSelectedType('user')}
                activeOpacity={0.9}
              >
                 <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: '#1E293B' }]}>
                       <UserIcon size={28} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                       <View style={styles.row}>
                          <Text style={styles.cardTitle}>일반 사용자</Text>
                          <View style={styles.badge}><Text style={styles.badgeTxt}>기본</Text></View>
                       </View>
                       <View style={styles.featureList}>
                          <View style={styles.featureItem}>
                             <Wine size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>레시피 제안</Text>
                          </View>
                          <View style={styles.featureItem}>
                             <TrendingUp size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>펀딩 참여</Text>
                          </View>
                          <View style={styles.featureItem}>
                             <Archive size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>아카이브</Text>
                          </View>
                       </View>
                    </View>
                 </View>
              </TouchableOpacity>
           </Animated.View>

           <Animated.View entering={FadeIn.delay(300)}>
              <TouchableOpacity 
                style={[styles.card, selectedType === 'brewery' && styles.cardActive]} 
                onPress={() => setSelectedType('brewery')}
                activeOpacity={0.9}
              >
                 <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: '#334155' }]}>
                       <Building2 size={28} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                       <View style={styles.row}>
                          <Text style={styles.cardTitle}>양조장</Text>
                          <View style={[styles.badge, { backgroundColor: '#0f172a' }]}><Text style={styles.badgeTxt}>인증 필요</Text></View>
                       </View>
                       <View style={styles.featureList}>
                          <View style={styles.featureItem}>
                             <FileCheck size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>레시피 검토</Text>
                          </View>
                          <View style={styles.featureItem}>
                             <FolderKanban size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>펀딩 프로젝트 개설</Text>
                          </View>
                          <View style={styles.featureItem}>
                             <LayoutDashboard size={16} color="#1F2937" />
                             <Text style={styles.featureLabel}>양조장 대시보드 이용</Text>
                          </View>
                       </View>
                    </View>
                 </View>
              </TouchableOpacity>
           </Animated.View>
        </View>

        <View style={styles.btnArea}>
           {selectedType === 'user' && (
             <Animated.View entering={FadeIn.duration(200)} style={styles.fullWidth}>
                <TouchableOpacity 
                  style={styles.confirmBtn} 
                  onPress={handleUserSelection}
                  activeOpacity={0.8}
                >
                  <View style={styles.navyBtn}>
                    <Text style={styles.confirmBtnTxt}>일반 사용자로 시작</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.disclaimer}>마이페이지에서 양조장 인증 시 양조장 계정으로 전환가능합니다.</Text>
             </Animated.View>
           )}

           {selectedType === 'brewery' && (
             <Animated.View entering={FadeIn.duration(200)} style={styles.fullWidth}>
                <TouchableOpacity 
                  style={styles.confirmBtn} 
                  onPress={handleBrewerySelection}
                  activeOpacity={0.8}
                >
                  <View style={styles.navyBtn}>
                    <Text style={styles.confirmBtnTxt}>양조장 인증하러 가기</Text>
                  </View>
                </TouchableOpacity>
             </Animated.View>
           )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  logoSection: { alignItems: 'center', paddingHorizontal: 24, marginBottom: 48 },
  mainLogo: { width: 80, height: 80, backgroundColor: '#FFF', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoImg: { width: 80, height: 80 },
  mainTitle: { fontSize: 24, fontWeight: '700', color: '#000', textAlign: 'center' },
  cardArea: { paddingHorizontal: 20, gap: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, borderWidth: 2, borderColor: '#F3F4F6', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 4 } },
  cardActive: { borderColor: 'rgba(30, 41, 59, 0.5)', borderWidth: 4 },
  cardHeader: { flexDirection: 'row', gap: 16 },
  iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  badge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  badgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  featureList: { gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureLabel: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  btnArea: { paddingHorizontal: 20, marginTop: 32, alignItems: 'center', minHeight: 100 },
  fullWidth: { width: '100%', alignItems: 'center' },
  confirmBtn: { width: '100%', height: 56, borderRadius: 14, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, marginBottom: 16 },
  navyBtn: { flex: 1, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  confirmBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  disclaimer: { fontSize: 11, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', paddingHorizontal: 20 },
});
