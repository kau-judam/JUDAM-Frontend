import { Platform, Linking } from 'react-native';

export const KAKAO_NATIVE_APP_KEY = 'f3b606d0a36f4db4e35d523e00648e8a';
export const KAKAO_REDIRECT_SCHEME = `kakao${KAKAO_NATIVE_APP_KEY}`;

export async function logKakaoDebugInfo(context = 'Kakao') {
  if (!__DEV__ || Platform.OS !== 'android') {
    return;
  }

  try {
    const kakaoCore = await import('@react-native-kakao/core').catch((error) => {
      console.warn(`[${context}] Failed to load Kakao core module for debug info`, error);
      return null;
    });
    const getKeyHashAndroid = kakaoCore?.getKeyHashAndroid || kakaoCore?.default?.getKeyHashAndroid;
    const [keyHash, canOpenKakaoTalk, canOpenKakaoScheme] = await Promise.all([
      typeof getKeyHashAndroid === 'function'
        ? getKeyHashAndroid().catch((error: unknown) => {
            console.warn(`[${context}] Failed to read Kakao key hash`, error);
            return 'unavailable';
          })
        : Promise.resolve('unavailable'),
      Linking.canOpenURL('kakaotalk://').catch(() => false),
      Linking.canOpenURL(`${KAKAO_REDIRECT_SCHEME}://oauth`).catch(() => false),
    ]);

    console.info(`[${context}] Kakao Android key hash`, keyHash);
    console.info(`[${context}] KakaoTalk available`, canOpenKakaoTalk);
    console.info(`[${context}] Kakao redirect scheme available`, canOpenKakaoScheme);
  } catch (error) {
    console.warn(`[${context}] Failed to read Kakao debug info`, error);
  }
}
