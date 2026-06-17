import SafeStorage from '@/utils/storage';

export const JUDAM_AUTH_API_BASE_URL = 'http://43.202.24.223:3000';

type AuthApiEnvelope<T> = {
  status?: number;
  message?: string;
  data?: T;
};

export class AuthApiError extends Error {
  status: number;
  path: string;
  data: unknown;

  constructor(message: string, status: number, path: string, data: unknown) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.path = path;
    this.data = data;
  }
}

export type AuthRole = 'USER' | 'BREWERY_PENDING' | 'BREWERY' | string;

export type AuthApiUser = {
  userId: string | number;
  email: string;
  nickname: string;
  phoneNumber?: string | null;
  provider?: string;
  role: AuthRole;
  profileImage?: string | null;
  profileImageUrl?: string | null;
  profile_image_url?: string | null;
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

type AuthSessionExpiredListener = () => void | Promise<void>;
const authSessionExpiredListeners = new Set<AuthSessionExpiredListener>();

export function addAuthSessionExpiredListener(listener: AuthSessionExpiredListener) {
  authSessionExpiredListeners.add(listener);
  return () => {
    authSessionExpiredListeners.delete(listener);
  };
}

function notifyAuthSessionExpired() {
  authSessionExpiredListeners.forEach((listener) => {
    void Promise.resolve(listener()).catch((error) => {
      console.warn('Failed to handle expired auth session.', error);
    });
  });
}

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

export type PasswordResetPhoneRequestPayload = {
  email: string;
  phoneNumber: string;
};

export type PasswordResetPhoneRequestResponse = PhoneVerificationRequestResponse & {
  email?: string;
};

export type PasswordResetPhoneConfirmPayload = {
  email: string;
  phoneNumber: string;
  verificationCode: string;
};

export type PasswordResetPhoneConfirmResponse = {
  email?: string;
  phoneNumber?: string;
  verified?: boolean;
  resetToken?: string;
  passwordResetToken?: string;
  token?: string;
  expiresInMinutes?: number;
  message?: string;
};

export type PasswordResetPhoneCompletePayload = {
  resetToken: string;
  newPassword: string;
  newPasswordConfirm: string;
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
  businessLicense?: BreweryApplicationFile;
  documentUrl?: string;
};

export type BreweryApplicationRecord = {
  applicationId?: number;
  userId?: number | string | null;
  applicantName?: string | null;
  email?: string | null;
  status?: string;
  breweryName?: string;
  businessNumber?: string;
  licenseNumber?: string;
  businessAddress?: string;
  businessAddressDetail?: string;
  location?: string;
  representativeName?: string | null;
  phoneNumber?: string;
  documentUrl?: string;
  documentKey?: string;
  businessLicenseUrl?: string | null;
  businessRegistrationFileUrl?: string | null;
  rejectReason?: string | null;
  ocrStatus?: string | null;
  ocrSummary?: string | null;
  ocrError?: string | null;
  ocrCheckedAt?: string | null;
  ocr?: unknown;
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

export type AdminBreweryApplication = BreweryApplicationRecord & {
  applicationId: number;
};

export type AdminBreweryApplicationListResponse = {
  applications: AdminBreweryApplication[];
  message?: string;
};

function isAuthRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readAuthValue(source: Record<string, unknown> | undefined, keys: string[]) {
  if (!source) return undefined;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
}

function readAuthNestedValue(source: Record<string, unknown> | undefined, keys: string[], nestedKey = 'ocr') {
  const direct = readAuthValue(source, keys);
  if (direct !== undefined) return direct;
  const nested = readAuthValue(source, [nestedKey]);
  if (!isAuthRecord(nested)) return undefined;
  return readAuthValue(nested, keys);
}

function readAuthString(source: Record<string, unknown> | undefined, keys: string[]) {
  const value = readAuthValue(source, keys);
  if (value === undefined || value === null) return undefined;
  return String(value);
}

function readAuthNestedString(source: Record<string, unknown> | undefined, keys: string[]) {
  const value = readAuthNestedValue(source, keys);
  if (value === undefined || value === null) return undefined;
  return String(value);
}

function readAuthNumber(source: Record<string, unknown> | undefined, keys: string[]) {
  const value = readAuthValue(source, keys);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function readAuthObjectArray(source: unknown): Record<string, unknown>[] {
  if (!Array.isArray(source)) return [];
  return source.filter(isAuthRecord);
}

function pickAdminBreweryApplicationItems(response: unknown) {
  if (Array.isArray(response)) return readAuthObjectArray(response);
  if (!isAuthRecord(response)) return [];

  const directApplications = readAuthValue(response, ['applications', 'items', 'rows', 'content']);
  if (Array.isArray(directApplications)) return readAuthObjectArray(directApplications);

  const data = readAuthValue(response, ['data']);
  if (Array.isArray(data)) return readAuthObjectArray(data);
  if (isAuthRecord(data)) {
    const nestedApplications = readAuthValue(data, ['applications', 'items', 'rows', 'content']);
    if (Array.isArray(nestedApplications)) return readAuthObjectArray(nestedApplications);
  }

  return [];
}

function normalizeAdminBreweryApplication(source: Record<string, unknown>): AdminBreweryApplication {
  const ocr = readAuthValue(source, ['ocr']);
  const user = readAuthValue(source, ['user']);
  const userRecord = isAuthRecord(user) ? user : undefined;
  const applicationId = readAuthNumber(source, ['applicationId', 'application_id', 'id']) || 0;

  return {
    applicationId,
    userId: readAuthValue(source, ['userId', 'user_id']) as number | string | null | undefined,
    applicantName:
      readAuthString(source, ['applicantName', 'applicant_name', 'nickname', 'userNickname', 'user_nickname']) ||
      readAuthString(userRecord, ['nickname', 'name']),
    email:
      readAuthString(source, ['email', 'userEmail', 'user_email']) ||
      readAuthString(userRecord, ['email']),
    status: readAuthString(source, ['status', 'applicationStatus', 'application_status']),
    breweryName: readAuthString(source, ['breweryName', 'brewery_name', 'name']),
    businessNumber: readAuthString(source, ['businessNumber', 'business_number', 'businessRegistrationNumber', 'business_registration_number', 'licenseNumber', 'license_number']),
    licenseNumber: readAuthString(source, ['licenseNumber', 'license_number', 'businessNumber', 'business_number']),
    businessAddress: readAuthString(source, ['businessAddress', 'business_address', 'address', 'location']),
    businessAddressDetail: readAuthString(source, ['businessAddressDetail', 'business_address_detail', 'addressDetail', 'address_detail']),
    location: readAuthString(source, ['location', 'businessAddress', 'business_address', 'address']),
    representativeName: readAuthString(source, ['representativeName', 'representative_name', 'ownerName', 'owner_name']),
    phoneNumber:
      readAuthString(source, ['phoneNumber', 'phone_number', 'phone']) ||
      readAuthString(userRecord, ['phoneNumber', 'phone_number']),
    documentUrl: readAuthString(source, ['documentUrl', 'document_url', 'businessLicenseUrl', 'business_license_url', 'businessRegistrationFileUrl', 'business_registration_file_url']),
    documentKey: readAuthString(source, ['documentKey', 'document_key']),
    businessLicenseUrl: readAuthString(source, ['businessLicenseUrl', 'business_license_url', 'businessLicense', 'business_license']),
    businessRegistrationFileUrl: readAuthString(source, ['businessRegistrationFileUrl', 'business_registration_file_url']),
    rejectReason: readAuthString(source, ['rejectReason', 'reject_reason', 'rejectionReason', 'rejection_reason']) || null,
    ocrStatus: readAuthNestedString(source, ['ocrStatus', 'ocr_status', 'status']) || null,
    ocrSummary: readAuthNestedString(source, ['ocrSummary', 'ocr_summary', 'summary']) || null,
    ocrError: readAuthNestedString(source, ['ocrError', 'ocr_error', 'error']) || null,
    ocrCheckedAt: readAuthNestedString(source, ['ocrCheckedAt', 'ocr_checked_at', 'checkedAt', 'checked_at']) || null,
    ocr,
    createdAt: readAuthString(source, ['createdAt', 'created_at', 'appliedAt', 'applied_at']),
    updatedAt: readAuthString(source, ['updatedAt', 'updated_at', 'submittedAt', 'submitted_at']),
  };
}

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

function hasAuthAuthorizationHeader(headers?: HeadersInit) {
  if (!headers) return false;
  if (headers instanceof Headers) return Boolean(headers.get('Authorization'));
  if (Array.isArray(headers)) return headers.some(([key]) => key.toLowerCase() === 'authorization');
  return Object.keys(headers).some((key) => key.toLowerCase() === 'authorization');
}

function mergeAuthHeaders(headers: HeadersInit | undefined, nextHeaders: Record<string, string>) {
  if (headers instanceof Headers) {
    const merged: Record<string, string> = {};
    headers.forEach((value, key) => {
      merged[key] = value;
    });
    return { ...merged, ...nextHeaders };
  }
  if (Array.isArray(headers)) {
    return {
      ...Object.fromEntries(headers),
      ...nextHeaders,
    };
  }
  return {
    ...(headers as Record<string, string> | undefined),
    ...nextHeaders,
  };
}

function unwrapAuthData<T>(response: T | AuthApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as AuthApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
}

async function requestAuthJson<T>(path: string, options: RequestInit = {}) {
  const hasAuthorization = hasAuthAuthorizationHeader(options.headers);
  const createHeaders = (token?: string | null) => ({
    'Content-Type': 'application/json',
    ...mergeAuthHeaders(options.headers, token ? { Authorization: `Bearer ${token}` } : {}),
  });

  let response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: createHeaders(),
  });

  let text = await response.text();
  let data = parseAuthResponseBody(path, response, text);

  if (response.status === 401 && hasAuthorization) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
        ...options,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseAuthResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    const message = (data as AuthApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new AuthApiError(message, response.status, path, data);
  }

  return data as T;
}

async function requestAuthForm<T>(path: string, formData: FormData, options: RequestInit = {}) {
  const hasAuthorization = hasAuthAuthorizationHeader(options.headers);
  const createHeaders = (token?: string | null) => mergeAuthHeaders(
    options.headers,
    token ? { Authorization: `Bearer ${token}` } : {}
  );

  let response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
    ...options,
    headers: createHeaders(),
    body: formData,
  });

  let text = await response.text();
  let data = parseAuthResponseBody(path, response, text);

  if (response.status === 401 && hasAuthorization) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_AUTH_API_BASE_URL}${path}`, {
        ...options,
        headers: createHeaders(refreshedToken),
        body: formData,
      });
      text = await response.text();
      data = parseAuthResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    const message = (data as AuthApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new AuthApiError(message, response.status, path, data);
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
      notifyAuthSessionExpired();
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
    SafeStorage.removeItem('jwt'),
    SafeStorage.removeItem('authToken'),
    SafeStorage.removeItem('judam_token'),
    SafeStorage.removeItem('judam_jwt'),
    SafeStorage.removeItem('judam_refresh_token'),
    SafeStorage.removeItem('refreshToken'),
    SafeStorage.removeItem('refresh_token'),
    SafeStorage.removeItem('refresh_token_judam'),
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
        notifyAuthSessionExpired();
        return null;
      }

      await saveAuthTokens(nextAccessToken, nextRefreshToken);
      return nextAccessToken;
    } catch {
      await clearAuthTokens();
      notifyAuthSessionExpired();
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

export async function requestPhonePasswordReset(payload: PasswordResetPhoneRequestPayload) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetPhoneRequestResponse>>(
    '/api/auth/password-reset/phone/request',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return unwrapAuthData<PasswordResetPhoneRequestResponse>(response);
}

export async function confirmPhonePasswordReset(payload: PasswordResetPhoneConfirmPayload) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetPhoneConfirmResponse>>(
    '/api/auth/password-reset/phone/confirm',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return unwrapAuthData<PasswordResetPhoneConfirmResponse>(response);
}

export async function completePhonePasswordReset(payload: PasswordResetPhoneCompletePayload) {
  const response = await requestAuthJson<AuthApiEnvelope<PasswordResetConfirmResponse>>(
    '/api/auth/password-reset/phone/complete',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
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

  if (!payload.businessLicense && !payload.documentUrl) {
    throw new Error('businessLicense or documentUrl is required.');
  }

  if (!payload.businessLicense && payload.documentUrl) {
    const response = await requestAuthJson<AuthApiEnvelope<BreweryApplicationResponse>>('/api/breweries/applications', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        businessNumber: payload.businessNumber,
        breweryName: payload.breweryName,
        businessAddress: payload.businessAddress,
        businessAddressDetail: payload.businessAddressDetail || '',
        phoneNumber: payload.phoneNumber,
        phoneVerificationToken: payload.phoneVerificationToken,
        documentUrl: payload.documentUrl,
      }),
    });
    return unwrapAuthData<BreweryApplicationResponse>(response);
  }

  const selectedBusinessLicense = payload.businessLicense;
  if (!selectedBusinessLicense) {
    throw new Error('businessLicense is required for file upload.');
  }

  const formData = new FormData();
  formData.append('businessNumber', payload.businessNumber);
  formData.append('breweryName', payload.breweryName);
  formData.append('businessAddress', payload.businessAddress);
  formData.append('businessAddressDetail', payload.businessAddressDetail || '');
  formData.append('phoneNumber', payload.phoneNumber);
  formData.append('phoneVerificationToken', payload.phoneVerificationToken);
  if (payload.documentUrl) formData.append('documentUrl', payload.documentUrl);
  formData.append('businessLicense', createAuthFormFile(selectedBusinessLicense));

  const response = await requestAuthForm<AuthApiEnvelope<BreweryApplicationResponse>>('/api/breweries/applications', formData, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return unwrapAuthData<BreweryApplicationResponse>(response);
}

export async function getAdminBreweryApplications(): Promise<AdminBreweryApplicationListResponse> {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<unknown> | unknown>('/api/breweries/applications', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    applications: pickAdminBreweryApplicationItems(response).map(normalizeAdminBreweryApplication),
    message: isAuthRecord(response) ? readAuthString(response, ['message']) : undefined,
  };
}

export async function approveAdminBreweryApplication(applicationId: number) {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<BreweryApplicationResponse>>(
    `/api/breweries/applications/${applicationId}/approve`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return unwrapAuthData<BreweryApplicationResponse>(response);
}

export async function rejectAdminBreweryApplication(applicationId: number, rejectReason: string) {
  const accessToken = await getAuthAccessToken();
  if (!accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const response = await requestAuthJson<AuthApiEnvelope<BreweryApplicationResponse>>(
    `/api/breweries/applications/${applicationId}/reject`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ rejectReason }),
    }
  );
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
