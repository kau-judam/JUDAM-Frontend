import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import {
  beginKakaoCallbackHandling,
  buildKakaoCallbackUrl,
  clearPendingKakaoAuthRequest,
  finishKakaoCallbackHandling,
  getKakaoCallbackCode,
  getPendingKakaoAuthRequest,
} from '@/features/auth/kakaoAuth';

export default function KakaoCallbackScreen() {
  const params = useLocalSearchParams<{
    code?: string | string[];
    error?: string | string[];
    errorDescription?: string | string[];
    error_description?: string | string[];
  }>();
  const { isAuthReady, loginWithKakaoCode } = useAuth();
  const hasStarted = useRef(false);
  const [message, setMessage] = useState('카카오 로그인을 완료하는 중이에요.');
  const callbackUrl = buildKakaoCallbackUrl(params);

  useEffect(() => {
    if (!isAuthReady || hasStarted.current) return;
    hasStarted.current = true;

    const finishKakaoLogin = async () => {
      if (!beginKakaoCallbackHandling(callbackUrl)) {
        return;
      }

      try {
        const code = getKakaoCallbackCode(callbackUrl);
        const pendingRequest = await getPendingKakaoAuthRequest();
        const kakaoResult = await loginWithKakaoCode(
          code,
          Boolean(pendingRequest?.keepLoggedIn),
          pendingRequest?.redirectUri
        );

        await clearPendingKakaoAuthRequest();
        finishKakaoCallbackHandling(callbackUrl);

        if (kakaoResult.status === 'signupRequired') {
          router.replace({
            pathname: '/(auth)/signup',
            params: {
              kakaoEmail: kakaoResult.email,
              kakaoNickname: kakaoResult.nickname,
              kakaoProfileImage: kakaoResult.profileImage || undefined,
              kakaoId: kakaoResult.kakaoId ? String(kakaoResult.kakaoId) : undefined,
              kakaoSignupToken: kakaoResult.kakaoSignupToken,
            },
          } as any);
          return;
        }

        router.replace('/(tabs)');
      } catch (error) {
        await clearPendingKakaoAuthRequest();
        finishKakaoCallbackHandling(callbackUrl);
        setMessage(error instanceof Error ? error.message : '카카오 로그인에 실패했습니다.');
        setTimeout(() => router.replace('/(auth)/login'), 1600);
      }
    };

    void finishKakaoLogin();
  }, [
    isAuthReady,
    callbackUrl,
    loginWithKakaoCode,
  ]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#111827" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#FFF',
    paddingHorizontal: 28,
  },
  message: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
});
