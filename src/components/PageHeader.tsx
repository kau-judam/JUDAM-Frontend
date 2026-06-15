import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useFocusEffect, usePathname } from 'expo-router';
import { Bell, MessageCircle, LayoutDashboard, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { showLoginRequired } from '@/utils/authPrompt';
import { getBreweryDashboardNotifications } from '@/features/brewery/api';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showIcons?: boolean;
}

export function PageHeader({ title, showBack = false, showIcons = true }: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { user } = useAuth();
  const isBrewery = user?.type === "brewery" && user?.isBreweryVerified === true;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!isBrewery) {
        setHasUnreadNotifications(false);
        return () => {
          active = false;
        };
      }

      getBreweryDashboardNotifications()
        .then((response) => {
          if (!active) return;
          const notifications = response.notifications || response.content || [];
          const unreadCount = typeof response.unreadCount === 'number'
            ? response.unreadCount
            : notifications.filter((notification) => !notification.isRead).length;
          setHasUnreadNotifications(unreadCount > 0);
        })
        .catch(() => {
          if (active) setHasUnreadNotifications(false);
        });

      return () => {
        active = false;
      };
    }, [isBrewery]),
  );

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="#111" />
            </TouchableOpacity>
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>

        {showBack && <View style={styles.center}><Text style={styles.centerTitle}>{title}</Text></View>}

        <View style={styles.right}>
          {showIcons && (
            <>
              {isBrewery && (
                <>
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/brewery/dashboard',
                        params: { returnTo: pathname },
                      } as any)
                    }
                  >
                    <LayoutDashboard size={22} color="#111" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() => router.push('/notifications' as any)}
                  >
                    <Bell size={22} color="#111" />
                    {hasUnreadNotifications && <View style={styles.notifBadge} />}
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity 
                style={styles.iconBtn}
                onPress={() => {
                  if (!user) {
                    showLoginRequired('AI 챗봇은 로그인 후 이용할 수 있어요.');
                    return;
                  }
                  router.push('/ai-chat' as any);
                }}
              >
                <MessageCircle size={22} color="#111" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 100,
  },
  inner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -0.5,
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  centerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 44,
    justifyContent: 'flex-end',
  },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
});
