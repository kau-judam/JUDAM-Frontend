import SafeStorage from '@/utils/storage';

export const JUDAM_AUTH_API_BASE_URL = 'http://43.202.24.223:3000';

type AuthApiEnvelope<T> = {
  status?: number;
  message?: string;
  data?: T;
};

export type AuthRole = 'USER' | 'BREWERY_PENDING' | 'BREWERY' | string;

export type AuthApiUser = {
  userId: string | number;
  email: string;
  nickname: string;
  phoneNumber?: string | null;
  provider?: string;
  role: AuthRole;
  profileImage?: string | null;
};

export type AuthSession = {
  accessToken?: string;
  refreshToken?: string;
  user: AuthApiUser;
};

export type KakaoLoginResponse = Partial<AuthSession> & {
  isNewUser?: boolean;
  signupRequired?: boolean;
  requiresSignup?: boolean;
  email?: string;
  kakaoEmail?: string;
  nickname?: string;
  kakaoNickname?: string;
  profileImage?: string | null;
  kakaoId?: string | number;
};

export type AuthAvailabilityResponse = {
  email?: string;
  nickname?: string;
  isAvailable: boolean;
};

export type PasswordResetRequestResponse = {
  email: string;
  verificationCode?: string;
  expiresInMinutes?: number;
};

export type PasswordResetVerifyResponse = {
  email: string;
  verified: boolean;
};

export type PhoneVerificationRequestResponse = {
  phoneNumber: string;
  verificationCode?: string;
  sendTo?: string;
  guideMessage?: string;
};

export type PhoneVerificationConfirmResponse = {
  phoneNumber: string;
  phoneVerificationToken?: string;
  verified?: boolean;
};

export type KakaoLoginUrlResponse = {
  url?: string;
  loginUrl?: string;
  authUrl?: string;
};

function parseAuthResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API 응답이 JSON이 아닙니다. ${response.status} ${path} (${contentType})`);
  }
}

function unwrapAuthData<T>(response: T | AuthApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as AuthApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
}

async function requestAuthJson<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const text = await response.text();
  const data = parseAuthResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as AuthApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function saveAuthTokens(accessToken?: string, refreshToken?: string) {
  if (accessToken) {
    await SafeStorage.setItem('judam_access_token', accessToken);
    await SafeStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    await SafeStorage.setItem('judam_refresh_token', refreshToken);
    await SafeStorage.setItem('refreshToken', refreshToken);
  }
}

export async function clearAuthTokens() {
  await Promise.all([
    SafeStorage.removeItem('judam_access_token'),
    SafeStorage.removeItem('accessToken'),
    SafeStorage.removeItem('access_token'),
    SafeStorage.removeItem('token'),
    SafeStorage.removeItem('judam_refresh_token'),
    SafeStorage.removeItem('refreshToken'),
    SafeStorage.removeItem('refresh_token'),
  ]);
}

export async function loginWithEmail(email: string, password: string) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthSession>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return unwrapAuthData<AuthSession>(response);
}

export async function signupWithEmail(payload: {
  email: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  role: 'USER' | 'BREWERY_PENDING';
  phoneVerificationToken?: string;
}) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthSession>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrapAuthData<AuthSession>(response);
}

export async function checkEmailAvailability(email: string) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthAvailabilityResponse>>(
    `/api/auth/email/check?email=${encodeURIComponent(email)}`
  );
  return unwrapAuthData<AuthAvailabilityResponse>(response);
}

export async function checkNicknameAvailability(nickname: string) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthAvailabilityResponse>>(
    `/api/auth/nickname/check?nickname=${encodeURIComponent(nickname)}`
  );
  return unwrapAuthData<AuthAvailabilityResponse>(response);
}

export async function requestPasswordReset(email: string) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetRequestResponse>>('/api/auth/password/reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return unwrapAuthData<PasswordResetRequestResponse>(response);
}

export async function verifyPasswordResetCode(email: string, verificationCode: string) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetVerifyResponse>>('/api/auth/password/reset/verify', {
    method: 'POST',
    body: JSON.stringify({ email, verificationCode }),
  });
  return unwrapAuthData<PasswordResetVerifyResponse>(response);
}

export async function resetPassword(payload: {
  email: string;
  verificationCode: string;
  newPassword: string;
}) {
  return requestAuthJson<AuthApiEnvelope<null>>('/api/auth/password/reset', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function requestPhoneVerification(phoneNumber: string) {
  const response = await requestAuthJson<AuthApiEnvelope<PhoneVerificationRequestResponse>>('/api/auth/phone/verification', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
  return unwrapAuthData<PhoneVerificationRequestResponse>(response);
}

export async function confirmPhoneVerification(phoneNumber: string, verificationCode: string) {
  const response = await requestAuthJson<AuthApiEnvelope<PhoneVerificationConfirmResponse>>(
    '/api/auth/phone/verification/confirm',
    {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, verificationCode }),
    }
  );
  return unwrapAuthData<PhoneVerificationConfirmResponse>(response);
}

export async function getKakaoLoginUrl() {
  const response = await requestAuthJson<AuthApiEnvelope<KakaoLoginUrlResponse>>('/api/auth/kakao/url');
  return unwrapAuthData<KakaoLoginUrlResponse>(response);
}

export async function loginWithKakaoCode(code: string) {
  const response = await requestAuthJson<AuthApiEnvelope<KakaoLoginResponse>>('/api/auth/kakao/login', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return unwrapAuthData<KakaoLoginResponse>(response);
}
