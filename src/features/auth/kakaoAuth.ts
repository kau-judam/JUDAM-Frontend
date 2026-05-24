import * as ExpoLinking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import type { KakaoLoginUrlResponse } from '@/features/auth/api';
import SafeStorage from '@/utils/storage';

export const KAKAO_APP_CALLBACK_URL = 'judamfrontend://kakao/callback';

const KAKAO_AUTH_TIMEOUT_MS = 45000;
const KAKAO_AUTH_REQUEST_KEY = 'judam_kakao_auth_request';
const KAKAO_AUTH_TIMEOUT_MESSAGE =
  '카카오 로그인 응답을 받지 못했습니다. Expo Go에서는 앱 딥링크가 닫히지 않을 수 있어 개발 빌드에서 다시 시도해주세요.';

WebBrowser.maybeCompleteAuthSession();

export type PendingKakaoAuthRequest = {
  keepLoggedIn?: boolean;
  redirectUri?: string;
  createdAt: number;
};

let activeKakaoCallbackKey: string | null = null;
const completedKakaoCallbackKeys = new Set<string>();

export function createKakaoAppRedirectUrl() {
  return ExpoLinking.createURL('/kakao/callback');
}

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

export function getKakaoCallbackRouteParams(callbackUrl: string) {
  const parsedUrl = new URL(callbackUrl);
  const routeParams: Record<string, string> = {};
  const supportedKeys = ['code', 'error', 'errorDescription', 'error_description'];

  supportedKeys.forEach((key) => {
    const value = parsedUrl.searchParams.get(key);
    if (value) routeParams[key] = value;
  });

  return routeParams;
}

export function isKakaoCallbackUrl(url: string) {
  return url.includes('/kakao/callback') || url.includes('kakao/callback');
}

function getKakaoCallbackKey(url: string) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.searchParams.get('code') ||
      parsedUrl.searchParams.get('error') ||
      parsedUrl.searchParams.get('errorDescription') ||
      parsedUrl.searchParams.get('error_description') ||
      url
    );
  } catch {
    return url;
  }
}

export function buildKakaoCallbackUrl(params: {
  code?: string | string[];
  error?: string | string[];
  errorDescription?: string | string[];
  error_description?: string | string[];
}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const paramValue = Array.isArray(value) ? value[0] : value;
    if (paramValue) searchParams.set(key, paramValue);
  });

  const queryString = searchParams.toString();
  return queryString ? `${KAKAO_APP_CALLBACK_URL}?${queryString}` : KAKAO_APP_CALLBACK_URL;
}

export function beginKakaoCallbackHandling(url: string) {
  if (!isKakaoCallbackUrl(url)) return false;

  const callbackKey = getKakaoCallbackKey(url);
  if (activeKakaoCallbackKey === callbackKey || completedKakaoCallbackKeys.has(callbackKey)) {
    return false;
  }

  activeKakaoCallbackKey = callbackKey;
  return true;
}

export function finishKakaoCallbackHandling(url: string) {
  const callbackKey = getKakaoCallbackKey(url);
  completedKakaoCallbackKeys.add(callbackKey);
  if (activeKakaoCallbackKey === callbackKey) {
    activeKakaoCallbackKey = null;
  }
  setTimeout(() => completedKakaoCallbackKeys.delete(callbackKey), 60000);
}

export async function savePendingKakaoAuthRequest(request: Omit<PendingKakaoAuthRequest, 'createdAt'>) {
  await SafeStorage.setItem(
    KAKAO_AUTH_REQUEST_KEY,
    JSON.stringify({
      ...request,
      createdAt: Date.now(),
    })
  );
}

export async function getPendingKakaoAuthRequest() {
  const rawRequest = await SafeStorage.getItem(KAKAO_AUTH_REQUEST_KEY);
  if (!rawRequest) return null;

  try {
    return JSON.parse(rawRequest) as PendingKakaoAuthRequest;
  } catch {
    return null;
  }
}

export async function clearPendingKakaoAuthRequest() {
  await SafeStorage.removeItem(KAKAO_AUTH_REQUEST_KEY);
}

export async function openKakaoAuthSession(kakaoUrl: string, appRedirectUri = KAKAO_APP_CALLBACK_URL) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(KAKAO_AUTH_TIMEOUT_MESSAGE)), KAKAO_AUTH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      WebBrowser.openAuthSessionAsync(kakaoUrl, appRedirectUri),
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
