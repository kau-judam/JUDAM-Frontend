import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

export const JUDAM_BREWERY_API_BASE_URL = 'http://43.202.24.223:3000';

type BreweryApiEnvelope<T> = {
  data?: T;
  message?: string;
  status?: number;
};

export type BreweryProfile = {
  profileImageUrl: string | null;
  breweryName: string;
  oneLineIntroduction: string | null;
  shortIntroduction: string | null;
  brandStory: string | null;
  history: string | null;
  establishedYear: number | string | null;
  representativeName: string | null;
  address: string;
  businessRegistrationNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
  isVerified: boolean;
};

export type UpdateBreweryProfilePayload = Partial<
  Pick<
    BreweryProfile,
    | 'profileImageUrl'
    | 'breweryName'
    | 'oneLineIntroduction'
    | 'shortIntroduction'
    | 'brandStory'
    | 'history'
    | 'establishedYear'
    | 'representativeName'
    | 'address'
    | 'email'
  >
>;

export type BreweryProfileImageFile = {
  uri: string;
  name?: string | null;
  type?: string | null;
};

export type BreweryProfileImageUploadResponse = {
  profileImageUrl: string;
  profile?: BreweryProfile;
};

export type BreweryDashboardBasicInfo = {
  breweryName: string;
  profileImageUrl: string | null;
  address: string;
  addressDetail?: string | null;
};

export type BreweryFundingSummary = {
  activeFundingCount: number;
  totalFundingCount: number;
  totalParticipantCount: number;
};

export type BreweryDashboardFundingStatus = 'active' | 'completed';

export type BreweryDashboardFundingItem = {
  fundingId: number;
  title: string;
  breweryName: string;
  thumbnailUrl: string | null;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  status: string;
  statusLabel?: string;
  remainingDays: number;
  endDate: string;
};

export type BreweryDashboardFundingList = {
  content?: BreweryDashboardFundingItem[];
  data?: BreweryDashboardFundingItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type BreweryDashboardFundingListResponse =
  | BreweryDashboardFundingList
  | BreweryDashboardFundingItem[]
  | BreweryApiEnvelope<BreweryDashboardFundingList | BreweryDashboardFundingItem[]>;

export type BreweryFundingDeliveryInfo = {
  fundingId: number;
  courier: string | null;
  trackingNumber: string | null;
  updatedAt: string | null;
};

export type UpdateBreweryFundingDeliveryPayload = {
  courier: string;
  trackingNumber: string;
};

export type BreweryDashboardNotification = {
  notificationId: number;
  type:
    | 'FUNDING_CREATED'
    | 'FUNDING_PROGRESS'
    | 'FUNDING_ENDED'
    | 'FUNDING_SUCCESS'
    | 'SETTLEMENT_COMPLETED'
    | 'RECIPE_POPULAR'
    | string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  linkUrl?: string | null;
  imageUrl?: string | null;
  fundingId?: number | null;
  recipeId?: number | null;
  progressThreshold?: 30 | 50 | 80 | number | null;
  metadata?: Record<string, unknown> | null;
};

export type BreweryDashboardNotificationsResponse = {
  notifications?: BreweryDashboardNotification[];
  content?: BreweryDashboardNotification[];
  unreadCount: number;
};

function parseBreweryResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API 응답이 JSON이 아닙니다. ${response.status} ${path} (${contentType})`);
  }
}

function unwrapBreweryData<T>(response: T | BreweryApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as BreweryApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
}

async function requestBreweryJson<T>(path: string, options: RequestInit = {}) {
  const { headers, ...requestOptions } = options;
  const token = await getAuthAccessToken();
  if (!token) throw new Error('NEEDS_ACCESS_TOKEN');

  const createHeaders = (accessToken: string): Record<string, string> => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers as Record<string, string> | undefined),
  });

  let response = await fetch(`${JUDAM_BREWERY_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: createHeaders(token),
  });
  let text = await response.text();
  let data = parseBreweryResponseBody(path, response, text);

  if (response.status === 401) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_BREWERY_API_BASE_URL}${path}`, {
        ...requestOptions,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseBreweryResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    const message = (data as BreweryApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function requestBreweryForm<T>(path: string, formData: FormData, options: RequestInit = {}) {
  const { headers, ...requestOptions } = options;
  const token = await getAuthAccessToken();
  if (!token) throw new Error('NEEDS_ACCESS_TOKEN');

  const createHeaders = (accessToken: string): Record<string, string> => ({
    Authorization: `Bearer ${accessToken}`,
    ...(headers as Record<string, string> | undefined),
  });

  let response = await fetch(`${JUDAM_BREWERY_API_BASE_URL}${path}`, {
    ...requestOptions,
    method: requestOptions.method || 'PATCH',
    body: formData,
    headers: createHeaders(token),
  });
  let text = await response.text();
  let data = parseBreweryResponseBody(path, response, text);

  if (response.status === 401) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_BREWERY_API_BASE_URL}${path}`, {
        ...requestOptions,
        method: requestOptions.method || 'PATCH',
        body: formData,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseBreweryResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    const message = (data as BreweryApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getBreweryProfile() {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryProfile> | BreweryProfile>('/api/breweries/me/profile');
  return unwrapBreweryData<BreweryProfile>(response);
}

export async function updateBreweryProfile(payload: UpdateBreweryProfilePayload) {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryProfile> | BreweryProfile>('/api/breweries/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return unwrapBreweryData<BreweryProfile>(response);
}

export async function uploadBreweryProfileImage(image: BreweryProfileImageFile) {
  if (!image.uri) throw new Error('대표 이미지 파일을 첨부해주세요.');
  const formData = new FormData();
  const imageName = image.name || image.uri.split('/').pop() || `brewery-profile-${Date.now()}.jpg`;
  const imageType = image.type || 'image/jpeg';
  formData.append('image', {
    uri: image.uri,
    name: imageName,
    type: imageType,
  } as unknown as Blob);

  const response = await requestBreweryForm<BreweryApiEnvelope<BreweryProfileImageUploadResponse> | BreweryProfileImageUploadResponse>(
    '/api/breweries/me/profile/image',
    formData,
    { method: 'PATCH' },
  );
  return unwrapBreweryData<BreweryProfileImageUploadResponse>(response);
}

export async function getBreweryDashboardBasicInfo() {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryDashboardBasicInfo> | BreweryDashboardBasicInfo>(
    '/api/breweries/me/dashboard/basic-info',
  );
  return unwrapBreweryData<BreweryDashboardBasicInfo>(response);
}

export async function getBreweryFundingSummary() {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryFundingSummary> | BreweryFundingSummary>(
    '/api/breweries/me/dashboard/funding-summary',
  );
  return unwrapBreweryData<BreweryFundingSummary>(response);
}

export async function getBreweryDashboardFundings(params: {
  status: BreweryDashboardFundingStatus;
  page?: number;
  size?: number;
}) {
  const query = new URLSearchParams({
    status: params.status,
    page: String(params.page ?? 0),
    size: String(params.size ?? 3),
  });
  const response = await requestBreweryJson<BreweryDashboardFundingListResponse>(
    `/api/breweries/me/dashboard/fundings?${query.toString()}`,
  );

  if (Array.isArray(response)) {
    return {
      content: response,
      data: response,
      page: params.page ?? 0,
      size: params.size ?? response.length,
      totalElements: response.length,
      totalPages: 1,
    };
  }

  if (response && typeof response === 'object') {
    if ('content' in response || 'totalElements' in response || 'page' in response) {
      return response as BreweryDashboardFundingList;
    }

    const envelopeData = (response as BreweryApiEnvelope<BreweryDashboardFundingList | BreweryDashboardFundingItem[]>).data;
    if (Array.isArray(envelopeData)) {
      return {
        content: envelopeData,
        data: envelopeData,
        page: params.page ?? 0,
        size: params.size ?? envelopeData.length,
        totalElements: envelopeData.length,
        totalPages: 1,
      };
    }
    if (envelopeData && typeof envelopeData === 'object') {
      return envelopeData as BreweryDashboardFundingList;
    }
  }

  return unwrapBreweryData<BreweryDashboardFundingList>(response as BreweryApiEnvelope<BreweryDashboardFundingList> | BreweryDashboardFundingList);
}

export async function getBreweryFundingDelivery(fundingId: number) {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryFundingDeliveryInfo> | BreweryFundingDeliveryInfo>(
    `/api/breweries/me/dashboard/fundings/${fundingId}/delivery`,
  );
  return unwrapBreweryData<BreweryFundingDeliveryInfo>(response);
}

export async function updateBreweryFundingDelivery(fundingId: number, payload: UpdateBreweryFundingDeliveryPayload) {
  const response = await requestBreweryJson<BreweryApiEnvelope<BreweryFundingDeliveryInfo> | BreweryFundingDeliveryInfo>(
    `/api/breweries/me/dashboard/fundings/${fundingId}/delivery`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
  return unwrapBreweryData<BreweryFundingDeliveryInfo>(response);
}

export async function getBreweryDashboardNotifications() {
  const response = await requestBreweryJson<
    BreweryApiEnvelope<BreweryDashboardNotificationsResponse> | BreweryDashboardNotificationsResponse
  >('/api/breweries/me/dashboard/notifications');
  return unwrapBreweryData<BreweryDashboardNotificationsResponse>(response);
}

export async function markBreweryNotificationRead(notificationId: number) {
  return requestBreweryJson<BreweryDashboardNotification>(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export async function markAllBreweryNotificationsRead() {
  return requestBreweryJson<{ updatedCount: number; message: string }>('/api/notifications/read-all', {
    method: 'PATCH',
  });
}

export function getBreweryApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === 'NEEDS_ACCESS_TOKEN') return '로그인이 필요합니다.';
    return error.message || fallback;
  }
  return fallback;
}
