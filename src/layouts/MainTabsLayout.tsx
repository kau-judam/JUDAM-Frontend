import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { 
  Home, 
  Wine, 
  TrendingUp, 
  MessageSquare, 
  User 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    // 앱 메인 진입 시 상단바 다시 표시
    RNStatusBar.setHidden(false, 'fade');
  }, []);

  return (
    <>
      <StatusBar style="auto" hidden={false} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? 30 : 12,
            paddingTop: 12,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="recipe"
          options={{
            title: '주담',
            tabBarIcon: ({ color, size }) => <Wine size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="funding"
          options={{
            title: '펀딩',
            tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: '커뮤니티',
            tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            title: '마이',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
