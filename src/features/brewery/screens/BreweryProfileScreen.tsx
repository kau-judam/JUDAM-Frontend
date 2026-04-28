import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BreweryProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const breweryId = Array.isArray(id) ? id[0] : id;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>양조장</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900' }} style={styles.hero} />
        <Text style={styles.name}>술샘양조장</Text>
        <View style={styles.locRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locTxt}>경기 양평</Text>
        </View>
        <Text style={styles.body}>전통 누룩과 지역 농산물을 기반으로 현대적인 전통주를 만드는 양조장입니다.</Text>
        <Text style={styles.meta}>프로젝트 ID {breweryId || '정보 없음'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', height: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  content: { padding: 20, gap: 14 },
  hero: { width: '100%', height: 220, borderRadius: 24 },
  name: { fontSize: 26, fontWeight: '900', color: '#111' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locTxt: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  body: { fontSize: 15, lineHeight: 24, fontWeight: '600', color: '#374151' },
  meta: { fontSize: 12, fontWeight: '700', color: '#9CA3AF' },
});
