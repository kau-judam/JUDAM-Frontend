import SafeStorage from '@/utils/storage';

export const JUDAM_MYPAGE_API_BASE_URL = 'http://43.202.24.223:3000';

type MyPageApiErrorBody = {
  status?: number;
  message?: string;
};

type MyPageApiEnvelope<T> = MyPageApiErrorBody & {
  data?: T;
};

export type MyPageProfile = {
  userId: string;
  profileImageUrl: string | null;
  nickname: string;
  phoneNumber: string | null;
  email: string;
  loginType: string;
};

export type NicknameCheckResult = {
  nickname: string;
  isAvailable: boolean;
};

const TOKEN_STORAGE_KEYS = ['judam_access_token', 'access_token', 'accessToken', 'token'];

export async function getMyPageAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = await SafeStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

function parseMyPageResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API 응답이 JSON이 아닙니다. ${response.status} ${path} (${contentType})`);
  }
}

async function requestMyPageJson<T>(path: string, options: RequestInit = {}) {
  const { headers, ...requestOptions } = options;
  const token = await getMyPageAccessToken();
  if (!token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  const nextHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${JUDAM_MYPAGE_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: nextHeaders,
  });

  const text = await response.text();
  const data = parseMyPageResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as MyPageApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function unwrapMyPageData<T>(response: T | MyPageApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as MyPageApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
}

export async function getMyPageProfile() {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageProfile>>('/api/mypage/profile');
  return unwrapMyPageData<MyPageProfile>(response);
}

export async function checkMyPageNickname(nickname: string) {
  const query = new URLSearchParams({ nickname });
  const response = await requestMyPageJson<MyPageApiEnvelope<NicknameCheckResult>>(
    `/api/mypage/profile/nickname/check?${query.toString()}`
  );
  return unwrapMyPageData<NicknameCheckResult>(response);
}

export async function updateMyPageNickname(nickname: string) {
  const response = await requestMyPageJson<MyPageApiEnvelope<{ nickname: string }>>('/api/mypage/profile/nickname', {
    method: 'PATCH',
    body: JSON.stringify({ nickname }),
  });
  return unwrapMyPageData<{ nickname: string }>(response);
}

export async function updateMyPagePhone(phoneNumber: string) {
  const response = await requestMyPageJson<MyPageApiEnvelope<{ phoneNumber: string }>>('/api/mypage/profile/phone', {
    method: 'PATCH',
    body: JSON.stringify({ phoneNumber }),
  });
  return unwrapMyPageData<{ phoneNumber: string }>(response);
}

export function getMyPageApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === 'NEEDS_ACCESS_TOKEN') return '로그인이 필요합니다.';
    return error.message || fallback;
  }
  return fallback;
}
