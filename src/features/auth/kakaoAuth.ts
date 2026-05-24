import * as WebBrowser from 'expo-web-browser';

import type { KakaoLoginUrlResponse } from '@/features/auth/api';

export const KAKAO_APP_CALLBACK_URL = 'judamfrontend://kakao/callback';

const KAKAO_AUTH_TIMEOUT_MS = 45000;
const KAKAO_AUTH_TIMEOUT_MESSAGE =
  '카카오 로그인 응답을 받지 못했습니다. Expo Go에서는 앱 딥링크가 닫히지 않을 수 있어 개발 빌드에서 다시 시도해주세요.';

WebBrowser.maybeCompleteAuthSession();

export function getKakaoAuthUrl(response: KakaoLoginUrlResponse) {
  return response.kakaoLoginUrl || response.url || response.loginUrl || response.authUrl || '';
}

export function getKakaoRedirectUri(kakaoUrl: string) {
  try {
    return new URL(kakaoUrl).searchParams.get('redirect_uri') || undefined;
  } catch {
    return undefined;
  }
}

export async function openKakaoAuthSession(kakaoUrl: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(KAKAO_AUTH_TIMEOUT_MESSAGE)), KAKAO_AUTH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      WebBrowser.openAuthSessionAsync(kakaoUrl, KAKAO_APP_CALLBACK_URL),
      timeoutPromise,
    ]);
  } catch (error) {
    try {
      WebBrowser.dismissBrowser();
      (WebBrowser as unknown as { dismissAuthSession?: () => void }).dismissAuthSession?.();
    } catch {
      // Browser dismissal is best effort only.
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function getKakaoCallbackCode(callbackUrl: string) {
  const parsedUrl = new URL(callbackUrl);
  const kakaoError = parsedUrl.searchParams.get('error');

  if (kakaoError) {
    const errorDescription =
      parsedUrl.searchParams.get('errorDescription') || parsedUrl.searchParams.get('error_description');
    throw new Error(errorDescription || `카카오 로그인 오류가 발생했습니다. (${kakaoError})`);
  }

  const code = parsedUrl.searchParams.get('code');
  if (!code) {
    throw new Error('카카오 인가 코드를 받지 못했습니다. 백엔드 콜백 URL 확인이 필요합니다.');
  }

  return code;
}
