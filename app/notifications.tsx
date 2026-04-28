import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { 
  ChevronLeft, 
  CheckCheck, 
  Bell, 
  TrendingUp, 
  PartyPopper, 
  AlertCircle, 
  Wine, 
  Clock 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Notification {
  id: number;
  type: "funding_new" | "funding_success" | "funding_fail" | "funding_update" | "brewing_update" | "system";
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string;
  image?: string;
}

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "funding_success",
      title: "펀딩 성공! 🎉",
      content: "'제주 한라봉 막걸리' 프로젝트가 목표 금액을 달성했습니다! 곧 제품을 받아보실 수 있어요.",
      timestamp: "방금 전",
      read: false,
      link: "/funding/1",
      image: "https://images.unsplash.com/photo-1615633949535-9dd97e86d795?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      type: "funding_new",
      title: "새로운 막걸리 펀딩",
      content: "관심 카테고리에 새로운 펀딩이 등록되었어요. '벚꽃 생막걸리' 프로젝트를 확인해보세요!",
      timestamp: "1시간 전",
      read: false,
      link: "/funding/2",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      type: "brewing_update",
      title: "양조 일지 업데이트",
      content: "'전통 누룩 약주' 프로젝트의 양조 과정이 업데이트되었습니다. 발효 3일차 상태를 확인해보세요!",
      timestamp: "3시간 전",
      read: false,
      link: "/funding/1",
      image: "https://images.unsplash.com/photo-1567697242574-e0c68f5e9b0e?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      type: "funding_update",
      title: "펀딩 진행 상황",
      content: "'경주 법주' 프로젝트가 70% 달성했어요! 마감까지 3일 남았습니다.",
      timestamp: "5시간 전",
      read: true,
      link: "/funding/3",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      type: "funding_fail",
      title: "펀딩 종료 안내",
      content: "'강원도 토속주' 프로젝트가 목표 금액에 미달하여 종료되었습니다. 결제는 진행되지 않습니다.",
      timestamp: "1일 전",
      read: true,
      link: "/funding/4",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      type: "funding_new",
      title: "새로운 청주 펀딩",
      content: "관심 카테고리에 '전통 송화백일주' 프로젝트가 등록되었습니다.",
      timestamp: "2일 전",
      read: true,
      link: "/funding/5",
      image: "https://images.unsplash.com/photo-1509669803555-fd5ddcc8ae87?w=100&h=100&fit=crop",
    },
    {
      id: 7,
      type: "system",
      title: "주담 업데이트",
      content: "AI 챗봇 기능이 새롭게 추가되었습니다. 술 추천부터 안주 매칭까지 도움을 받아보세요!",
      timestamp: "3일 전",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "funding_success": return <PartyPopper size={20} color="#059669" />;
      case "funding_fail": return <AlertCircle size={20} color="#6B7280" />;
      case "funding_new": return <Wine size={20} color="#8B5A3C" />;
      case "funding_update": return <TrendingUp size={20} color="#2563EB" />;
      case "brewing_update": return <Clock size={20} color="#9333EA" />;
      case "system": return <Bell size={20} color="#6B7280" />;
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>알림</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeTxt}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllBtn}>
              <CheckCheck size={14} color="#8B5A3C" />
              <Text style={styles.markAllTxt}>전체 읽음</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Toggle */}
        <View style={styles.filterArea}>
          <View style={styles.filterBg}>
            <TouchableOpacity 
              style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterTxt, filter === 'all' && styles.filterTxtActive]}>전체 ({notifications.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterBtn, filter === 'unread' && styles.filterBtnActive]}
              onPress={() => setFilter('unread')}
            >
              <Text style={[styles.filterTxt, filter === 'unread' && styles.filterTxtActive]}>읽지 않음 ({unreadCount})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={64} color="#E5E7EB" />
            <Text style={styles.emptyTxt}>
              {filter === "unread" ? "읽지 않은 알림이 없습니다" : "알림이 없습니다"}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredNotifications.map((n, i) => (
              <Animated.View key={n.id} entering={FadeInUp.delay(i * 50)}>
                <TouchableOpacity 
                  style={[styles.card, !n.read && styles.cardUnread]}
                  onPress={() => {
                    handleMarkAsRead(n.id);
                    if (n.link) router.push(n.link as any);
                  }}
                  activeOpacity={0.7}
                >
                   <View style={styles.rowAlignTop}>
                      {n.image ? (
                        <Image source={{ uri: n.image }} style={styles.notifImg} />
                      ) : (
                        <View style={styles.notifIconBg}>{getIcon(n.type)}</View>
                      )}
                      <View style={{ flex: 1 }}>
                         <View style={styles.rowBetween}>
                            <Text style={styles.notifTitle}>{n.title}</Text>
                            {!n.read && <View style={styles.notifDot} />}
                         </View>
                         <Text style={styles.notifContent} numberOfLines={2}>{n.content}</Text>
                         <Text style={styles.notifTime}>{n.timestamp}</Text>
                      </View>
                   </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTop: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, marginLeft: -10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  unreadBadge: { backgroundColor: '#8B5A3C', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllTxt: { color: '#8B5A3C', fontSize: 13, fontWeight: '600' },
  filterArea: { paddingHorizontal: 16, paddingBottom: 12, marginBottom: 12 },
  filterBg: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 9999, padding: 4 },
  filterBtn: { flex: 1, py: 8, borderRadius: 9999, alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  filterTxt: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTxtActive: { color: '#2B1810' },
  scrollContent: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTxt: { fontSize: 15, color: '#9CA3AF', marginTop: 16 },
  list: { gap: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },  cardUnread: { borderColor: 'rgba(139, 90, 60, 0.2)', borderWidth: 2 },
  rowAlignTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  notifImg: { width: 48, height: 48, borderRadius: 12 },
  notifIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#2B1810' },
  notifDot: { width: 6, height: 6, backgroundColor: '#8B5A3C', borderRadius: 3 },
  notifContent: { fontSize: 13, color: '#4B5563', lineHeight: 18, marginBottom: 8 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
});
