import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { AlertTriangle, ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import SafeStorage from '@/utils/storage';

export default function MySettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const openOnboarding = async () => {
    await SafeStorage.removeItem('judam_onboarded');
    router.replace('/onboarding' as any);
  };

  const withdraw = () => {
    Alert.alert('회원 탈퇴', '회원 탈퇴를 진행하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/onboarding' as any);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ArrowLeft size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
      >
        <Text style={styles.sectionTitle}>앱 설정</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={<RefreshCw size={18} color="#6B7280" />}
            title="온보딩 다시 보기"
            onPress={openOnboarding}
          />
        </View>

        <Text style={styles.sectionTitle}>계정 관리</Text>
        <View style={styles.card}>
          <SettingsRow
            icon={<AlertTriangle size={18} color="#EF4444" />}
            title="회원 탈퇴"
            danger
            onPress={withdraw}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  danger,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
      </View>
      <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '900', color: '#111827' },
  headerSpacer: { width: 44 },
  content: { paddingHorizontal: 24, paddingTop: 28 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginLeft: 4, marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    gap: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827' },
  dangerText: { color: '#EF4444' },
});
