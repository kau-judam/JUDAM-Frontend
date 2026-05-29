import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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
  BookOpen,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { initialNotifications, type AppNotification } from '@/features/notifications/data';
import {
  getBreweryDashboardNotifications,
  markAllBreweryNotificationsRead,
  markBreweryNotificationRead,
  type BreweryDashboardNotification,
} from '@/features/brewery/api';

type Notification = AppNotification;

const mapDashboardNotificationType = (type: string): AppNotification['type'] => {
  switch (type) {
    case 'FUNDING_SUCCESS':
      return 'funding_success';
    case 'FUNDING_ENDED':
      return 'funding_end';
    case 'FUNDING_CREATED':
      return 'funding_new';
    case 'FUNDING_PROGRESS':
      return 'funding_progress';
    case 'RECIPE_POPULAR':
      return 'recipe_popular';
    default:
      return 'funding_progress';
  }
};

const mapDashboardNotification = (notification: BreweryDashboardNotification): Notification => ({
  id: notification.notificationId,
  type: mapDashboardNotificationType(notification.type),
  title: notification.title,
  content: notification.content,
  timestamp: notification.createdAt,
  read: notification.isRead,
  link: notification.linkUrl || undefined,
  image: notification.imageUrl ? { uri: notification.imageUrl } : undefined,
});

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  useEffect(() => {
    let mounted = true;
    getBreweryDashboardNotifications()
      .then((response) => {
        if (!mounted) return;
        const nextNotifications = response.notifications || response.content || [];
        setNotifications(nextNotifications.map(mapDashboardNotification));
      })
      .catch((error) => {
        console.warn(error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "funding_success": return <PartyPopper size={20} color="#059669" />;
      case "funding_end": return <AlertCircle size={20} color="#6B7280" />;
      case "funding_new": return <Wine size={20} color="#4B5563" />;
      case "funding_progress": return <TrendingUp size={20} color="#2563EB" />;
      case "recipe_popular": return <BookOpen size={20} color="#9333EA" />;
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    markBreweryNotificationRead(id).catch(() => undefined);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    markAllBreweryNotificationsRead().catch(() => undefined);
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
              <CheckCheck size={14} color="#4B5563" />
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
                        <Image source={n.image} style={styles.notifImg} />
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
  unreadBadge: { backgroundColor: '#4B5563', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllTxt: { color: '#4B5563', fontSize: 13, fontWeight: '600' },
  filterArea: { paddingHorizontal: 16, paddingBottom: 12, marginBottom: 12 },
  filterBg: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 9999, padding: 4 },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: 9999, alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  filterTxt: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTxtActive: { color: '#111827' },
  scrollContent: { padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTxt: { fontSize: 15, color: '#9CA3AF', marginTop: 16 },
  list: { gap: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },  cardUnread: { borderColor: '#D1D5DB', borderWidth: 2 },
  rowAlignTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  notifImg: { width: 48, height: 48, borderRadius: 12 },
  notifIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  notifDot: { width: 6, height: 6, backgroundColor: '#6B7280', borderRadius: 3 },
  notifContent: { fontSize: 13, color: '#4B5563', lineHeight: 18, marginBottom: 8 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
});
