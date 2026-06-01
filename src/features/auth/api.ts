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
  marketingAgreed?: boolean;
};

export type AuthSession = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  refreshToken?: string;
  refresh_token?: string;
  user: AuthApiUser;
};

export type SelectableAuthRole = 'USER' | 'BREWERY_PENDING';

export type AuthRoleUpdateResponse = {
  user: AuthApiUser;
};

export type KakaoProfilePayload = {
  email?: string;
  nickname?: string;
  profileImage?: string | null;
  profileImageUrl?: string | null;
  profile_image_url?: string | null;
  thumbnail_image_url?: string | null;
  properties?: {
    nickname?: string;
    profile_image?: string | null;
    thumbnail_image?: string | null;
  };
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string | null;
      thumbnail_image_url?: string | null;
    };
  };
  kakaoAccount?: {
    email?: string;
    profile?: {
      nickname?: string;
      profileImageUrl?: string | null;
      thumbnailImageUrl?: string | null;
    };
  };
};

export type KakaoLoginResponse = Partial<AuthSession> & {
  isNewUser?: boolean;
  signupRequired?: boolean;
  requiresSignup?: boolean;
  reason?: 'INCOMPLETE_PROFILE' | string;
  email?: string;
  kakaoEmail?: string;
  nickname?: string;
  kakaoNickname?: string;
  profileImage?: string | null;
  kakaoId?: string | number;
  kakaoSignupToken?: string;
  kakaoProfile?: KakaoProfilePayload;
  existingUserId?: string | number;
};

type AuthTokenSource = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  refreshToken?: string;
  refresh_token?: string;
} | null | undefined;

type AuthRefreshResponse = Partial<NonNullable<AuthTokenSource>>;

export type AuthAvailabilityResponse = {
  email?: string;
  nickname?: string;
  isAvailable: boolean;
};

export type PasswordResetRequestResponse = {
  email?: string;
  expiresInMinutes?: number;
  message?: string;
};

export type PasswordResetVerifyResponse = {
  email?: string;
  verified?: boolean;
  passwordResetToken: string;
  expiresInMinutes?: number;
  message?: string;
};

export type PasswordResetConfirmPayload = {
  passwordResetToken: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type PasswordResetConfirmResponse = {
  message?: string;
  success?: boolean;
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
  kakaoLoginUrl?: string;
  url?: string;
  loginUrl?: string;
  authUrl?: string;
  redirectUri?: string;
};

export type BreweryApplicationFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

export type BreweryApplicationPayload = {
  businessNumber: string;
  breweryName: string;
  businessAddress: string;
  businessAddressDetail?: string;
  phoneNumber: string;
  phoneVerificationToken: string;
  businessLicense: BreweryApplicationFile;
};

export type BreweryApplicationRecord = {
  applicationId?: number;
  status?: string;
  breweryName?: string;
  businessNumber?: string;
  licenseNumber?: string;
  businessAddress?: string;
  businessAddressDetail?: string;
  location?: string;
  phoneNumber?: string;
  documentUrl?: string;
  documentKey?: string;
  rejectReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BreweryApplicationUpdatePayload = {
  breweryName?: string;
  licenseNumber?: string;
  location?: string;
  documentUrl?: string;
  documentKey?: string;
};

export type BreweryApplicationResponse = BreweryApplicationRecord & {
  application?: BreweryApplicationRecord & {
    user?: AuthApiUser;
  };
  user?: AuthApiUser;
  message?: string;
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

async function requestAuthForm<T>(path: string, formData: FormData, options: RequestInit = {}) {
  const response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string> | undefined),
    },
    body: formData,
  });

  const text = await response.text();
  const data = parseAuthResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as AuthApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function sanitizeAuthToken(token?: string | null) {
  if (!token) return undefined;
  return token.replace(/^Bearer\s+/i, '').trim() || undefined;
}

export function getAuthSessionAccessToken(session: AuthTokenSource) {
  return sanitizeAuthToken(session?.accessToken || session?.access_token || session?.token || session?.jwt);
}

export function getAuthSessionRefreshToken(session: AuthTokenSource) {
  return sanitizeAuthToken(session?.refreshToken || session?.refresh_token);
}

type AuthJwtPayload = {
  exp?: number;
};

function decodeAuthJwtPayload(token: string): AuthJwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload || typeof atob !== 'function') return null;
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );
    return JSON.parse(atob(paddedPayload)) as AuthJwtPayload;
  } catch {
    return null;
  }
}

export function isAuthJwtExpired(token: string, now = Date.now()) {
  const payload = decodeAuthJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= now;
}

export async function saveAuthTokens(accessToken?: string, refreshToken?: string) {
  await clearAuthTokens();
  const cleanAccessToken = sanitizeAuthToken(accessToken);
  const cleanRefreshToken = sanitizeAuthToken(refreshToken);
  if (cleanAccessToken) {
    await SafeStorage.setItem('judam_access_token', cleanAccessToken);
    await SafeStorage.setItem('accessToken', cleanAccessToken);
    await SafeStorage.setItem('access_token', cleanAccessToken);
  }
  if (cleanRefreshToken) {
    await SafeStorage.setItem('judam_refresh_token', cleanRefreshToken);
    await SafeStorage.setItem('refreshToken', cleanRefreshToken);
    await SafeStorage.setItem('refresh_token', cleanRefreshToken);
  }
}

async function getStoredAuthRefreshToken() {
  const tokenKeys = ['judam_refresh_token', 'refreshToken', 'refresh_token'];
  for (const key of tokenKeys) {
    const token = sanitizeAuthToken(await SafeStorage.getItem(key));
    if (!token) continue;
    if (isAuthJwtExpired(token)) {
      await clearAuthTokens();
      return null;
    }
    return token;
  }
  return null;
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

let refreshAccessTokenPromise: Promise<string | null> | null = null;

export async function refreshAuthAccessToken() {
  if (refreshAccessTokenPromise) return refreshAccessTokenPromise;

  refreshAccessTokenPromise = (async () => {
    const refreshToken = await getStoredAuthRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await requestAuthJson<AuthApiEnvelope<AuthRefreshResponse>>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      const data = unwrapAuthData<AuthRefreshResponse>(response);
      const nextAccessToken = getAuthSessionAccessToken(data);
      const nextRefreshToken = getAuthSessionRefreshToken(data) || refreshToken;

      if (!nextAccessToken) {
        await clearAuthTokens();
        return null;
      }

      await saveAuthTokens(nextAccessToken, nextRefreshToken);
      return nextAccessToken;
    } catch {
      await clearAuthTokens();
      return null;
    }
  })();

  try {
    return await refreshAccessTokenPromise;
  } finally {
    refreshAccessTokenPromise = null;
  }
}

export async function getAuthAccessToken(options: { allowRefresh?: boolean } = {}) {
  const allowRefresh = options.allowRefresh !== false;
  const tokenKeys = ['judam_access_token', 'accessToken', 'access_token', 'token'];
  for (const key of tokenKeys) {
    const token = sanitizeAuthToken(await SafeStorage.getItem(key));
    if (!token) continue;
    if (isAuthJwtExpired(token)) {
      return allowRefresh ? refreshAuthAccessToken() : null;
    }
    return token;
  }
  return allowRefresh ? refreshAuthAccessToken() : null;
}

export async function loginWithEmail(email: string, password: string) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthSession>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return unwrapAuthData<AuthSession>(response);
}

export async function updateMyRole(role: SelectableAuthRole) {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<AuthRoleUpdateResponse>>('/api/auth/me/role', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ role }),
  });
  return unwrapAuthData<AuthRoleUpdateResponse>(response);
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

export async function completeKakaoSignup(payload: {
  kakaoSignupToken: string;
  email?: string;
  password?: string;
  nickname: string;
  phoneNumber: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  role: 'USER' | 'BREWERY_PENDING';
  phoneVerificationToken?: string;
}) {
  const response = await requestAuthJson<AuthApiEnvelope<AuthSession>>('/api/auth/kakao/signup/complete', {
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
  passwordResetToken: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  return confirmPasswordReset(payload);
}

export async function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetConfirmResponse>>('/api/auth/password/reset/confirm', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrapAuthData<PasswordResetConfirmResponse>(response);
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

export async function getKakaoLoginUrl(appRedirectUri?: string) {
  const query = appRedirectUri ? `?appRedirectUri=${encodeURIComponent(appRedirectUri)}` : '';
  const response = await requestAuthJson<AuthApiEnvelope<KakaoLoginUrlResponse>>(`/api/auth/kakao/url${query}`);
  return unwrapAuthData<KakaoLoginUrlResponse>(response);
}

export async function loginWithKakaoCode(code: string, redirectUri?: string) {
  const response = await requestAuthJson<AuthApiEnvelope<KakaoLoginResponse>>('/api/auth/kakao/login', {
    method: 'POST',
    body: JSON.stringify({
      code,
      ...(redirectUri ? { redirectUri } : {}),
    }),
  });
  return unwrapAuthData<KakaoLoginResponse>(response);
}

function createAuthFormFile(file: BreweryApplicationFile) {
  return {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  } as unknown as Blob;
}

export async function submitBreweryApplication(payload: BreweryApplicationPayload) {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const formData = new FormData();
  formData.append('businessNumber', payload.businessNumber);
  formData.append('breweryName', payload.breweryName);
  formData.append('businessAddress', payload.businessAddress);
  formData.append('businessAddressDetail', payload.businessAddressDetail || '');
  formData.append('phoneNumber', payload.phoneNumber);
  formData.append('phoneVerificationToken', payload.phoneVerificationToken);
  formData.append('businessLicense', createAuthFormFile(payload.businessLicense));

  const response = await requestAuthForm<AuthApiEnvelope<BreweryApplicationResponse>>('/api/breweries/applications', formData, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return unwrapAuthData<BreweryApplicationResponse>(response);
}

export async function getMyBreweryApplication() {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<BreweryApplicationResponse>>('/api/breweries/applications/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return unwrapAuthData<BreweryApplicationResponse>(response);
}

export async function updateMyBreweryApplication(payload: BreweryApplicationUpdatePayload) {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<BreweryApplicationResponse>>('/api/breweries/applications/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return unwrapAuthData<BreweryApplicationResponse>(response);
}
