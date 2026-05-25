import type { BtiSurveyTasteVector } from '@/features/bti/data';
import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

export const JUDAM_MYPAGE_API_BASE_URL = 'http://43.202.24.223:3000';

type MyPageApiErrorBody = {
  status?: number;
  message?: string;
};

type MyPageApiEnvelope<T> = MyPageApiErrorBody & {
  data?: T;
};

type MyPagePagedEnvelope<T> = MyPageApiEnvelope<T> & {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
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

export type MyPageImageUploadFile = {
  uri: string;
  name?: string | null;
  type?: string | null;
};

export type MyPageSummary = {
  participatedFundingCount: number;
  archiveCount: number;
  badgeCount: number;
  sulbti: {
    hasResult: boolean;
    type: string | null;
    btiCode?: string | null;
    title: string | null;
    summary: string | null;
    description?: string | null;
    characterName?: string | null;
    alcoholLabel?: string | null;
    tags: string[];
  };
};

export type MyPageSulbtiScores = {
  sweetness: number;
  body: number;
  carbonation: number;
  flavor: number;
  abv: number;
  alcohol?: number;
};

export type MyPageSulbtiResult = {
  hasResult: boolean;
  type: string | null;
  btiCode?: string | null;
  title: string | null;
  description: string | null;
  scores: MyPageSulbtiScores | null;
  tasteVector?: BtiSurveyTasteVector | null;
  characterName?: string | null;
  alcoholLabel?: string | null;
  tags: string[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type SaveMyPageSulbtiPayload = {
  type: string;
  sweetnessScore: number;
  bodyScore: number;
  carbonationScore: number;
  flavorScore: number;
  abvScore: number;
};

export type MyPageArchiveImage = {
  imageId: number;
  imageUrl: string;
  sortOrder: number;
};

export type MyPageArchiveTag = {
  tagId: number;
  category: string;
  name: string;
  categoryName?: string;
};

export type MyPageArchive = {
  archiveId: number;
  archiveType: 'NORMAL' | 'FUNDING';
  alcoholId: number | null;
  fundingId: number | null;
  orderId: number | null;
  reviewId: number | null;
  drinkName: string;
  category: string | null;
  abv: number | null;
  rating: number | null;
  tastingNote: string | null;
  recordDate: string | null;
  mood?: string | null;
  pairing?: string | null;
  createdAt: string;
  updatedAt: string;
  tags: MyPageArchiveTag[];
  images: MyPageArchiveImage[];
};

export type CreateMyPageArchiveWithImagesPayload = {
  archiveType: 'NORMAL' | 'FUNDING';
  customName?: string;
  alcoholId?: number | string;
  fundingId?: number | string;
  orderId?: number | string;
  reviewId?: number | string;
  category?: string;
  abv?: number | string;
  rating?: number | string;
  tastingNote?: string;
  recordDate?: string;
  tagIds?: (number | string)[];
  customTags?: string[];
  images?: MyPageImageUploadFile[];
};

export type MyPageArchiveListType = 'all' | 'normal' | 'funding';

export type MyPageArchiveListResult = {
  content: MyPageArchive[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type UpdateMyPageArchivePayload = {
  recordDate?: string;
  tastingNote?: string;
  tagIds?: (number | string)[];
};

export type UpdateMyPageArchiveWithImagesPayload = {
  archiveType?: 'NORMAL' | 'FUNDING';
  customName?: string;
  alcoholId?: number | string;
  category?: string;
  abv?: number | string;
  rating?: number | string;
  tastingNote?: string;
  recordDate?: string;
  mood?: string;
  pairing?: string;
  tagIds?: (number | string)[];
  customTags?: string[];
  deleteImageIds?: (number | string)[];
  images?: MyPageImageUploadFile[];
};

export type MyPageArchiveTagGroup = {
  category: string;
  categoryName: string;
  tags: {
    tagId: number;
    name: string;
  }[];
};

export async function getMyPageAccessToken() {
  return getAuthAccessToken();
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

  const createHeaders = (accessToken: string): Record<string, string> => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers as Record<string, string> | undefined),
  });

  let response = await fetch(`${JUDAM_MYPAGE_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: createHeaders(token),
  });
  let text = await response.text();
  let data = parseMyPageResponseBody(path, response, text);

  if (response.status === 401) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_MYPAGE_API_BASE_URL}${path}`, {
        ...requestOptions,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseMyPageResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    const message = (data as MyPageApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function requestMyPageForm<T>(path: string, formData: FormData, options: RequestInit = {}) {
  const { headers, ...requestOptions } = options;
  const token = await getMyPageAccessToken();
  if (!token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  const createHeaders = (accessToken: string): Record<string, string> => ({
    Authorization: `Bearer ${accessToken}`,
    ...(headers as Record<string, string> | undefined),
  });

  let response = await fetch(`${JUDAM_MYPAGE_API_BASE_URL}${path}`, {
    ...requestOptions,
    method: requestOptions.method || 'PATCH',
    body: formData,
    headers: createHeaders(token),
  });
  let text = await response.text();
  let data = parseMyPageResponseBody(path, response, text);

  if (response.status === 401) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_MYPAGE_API_BASE_URL}${path}`, {
        ...requestOptions,
        method: requestOptions.method || 'PATCH',
        body: formData,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseMyPageResponseBody(path, response, text);
    }
  }

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

export async function updateMyPageProfileImage(image: MyPageImageUploadFile) {
  if (!image.uri) {
    throw new Error('프로필 이미지 파일을 첨부해주세요.');
  }

  const formData = new FormData();
  const imageName = image.name || image.uri.split('/').pop() || `profile-${Date.now()}.jpg`;
  const imageType = image.type || 'image/jpeg';
  formData.append('image', {
    uri: image.uri,
    name: imageName,
    type: imageType,
  } as unknown as Blob);

  const response = await requestMyPageForm<MyPageApiEnvelope<{ profileImageUrl: string }>>(
    '/api/mypage/profile/image',
    formData,
    { method: 'PATCH' }
  );
  return unwrapMyPageData<{ profileImageUrl: string }>(response);
}

export async function changeMyPagePassword(currentPassword: string, newPassword: string) {
  return requestMyPageJson<MyPageApiEnvelope<null>>('/api/mypage/profile/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getMyPageSummary() {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageSummary>>('/api/mypage/summary');
  return unwrapMyPageData<MyPageSummary>(response);
}

export async function getMyPageSulbti() {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageSulbtiResult>>('/api/mypage/sulbti');
  return unwrapMyPageData<MyPageSulbtiResult>(response);
}

export async function saveMyPageSulbti(payload: SaveMyPageSulbtiPayload) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageSulbtiResult>>('/api/mypage/sulbti', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrapMyPageData<MyPageSulbtiResult>(response);
}

export async function createMyPageArchiveWithImages(payload: CreateMyPageArchiveWithImagesPayload) {
  const formData = new FormData();
  formData.append('archiveType', payload.archiveType);
  if (payload.customName) formData.append('customName', payload.customName);
  if (payload.alcoholId !== undefined) formData.append('alcoholId', String(payload.alcoholId));
  if (payload.fundingId !== undefined) formData.append('fundingId', String(payload.fundingId));
  if (payload.orderId !== undefined) formData.append('orderId', String(payload.orderId));
  if (payload.reviewId !== undefined) formData.append('reviewId', String(payload.reviewId));
  if (payload.category) formData.append('category', payload.category);
  if (payload.abv !== undefined) formData.append('abv', String(payload.abv));
  if (payload.rating !== undefined) formData.append('rating', String(payload.rating));
  if (payload.tastingNote) formData.append('tastingNote', payload.tastingNote);
  if (payload.recordDate) formData.append('recordDate', payload.recordDate);
  formData.append('tagIds', JSON.stringify(payload.tagIds || []));
  formData.append('customTags', JSON.stringify(payload.customTags || []));

  (payload.images || []).slice(0, 3).forEach((image, index) => {
    const imageName = image.name || image.uri.split('/').pop() || `archive-${Date.now()}-${index + 1}.jpg`;
    const imageType = image.type || 'image/jpeg';
    formData.append('images', {
      uri: image.uri,
      name: imageName,
      type: imageType,
    } as unknown as Blob);
  });

  const response = await requestMyPageForm<MyPageApiEnvelope<MyPageArchive>>(
    '/api/mypage/archives/with-images',
    formData,
    { method: 'POST' }
  );
  return unwrapMyPageData<MyPageArchive>(response);
}

export async function getMyPageArchives({
  type = 'all',
  page = 0,
  size = 30,
}: {
  type?: MyPageArchiveListType;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams({
    type,
    page: String(page),
    size: String(size),
  });
  const response = await requestMyPageJson<MyPagePagedEnvelope<MyPageArchive[]>>(
    `/api/mypage/archives?${query.toString()}`
  );
  return {
    content: response.data || [],
    page: response.page || page,
    size: response.size || size,
    totalElements: response.totalElements || 0,
    totalPages: response.totalPages || 0,
  } satisfies MyPageArchiveListResult;
}

export async function getMyPageArchiveDetail(archiveId: string | number) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageArchive>>(`/api/mypage/archives/${archiveId}`);
  return unwrapMyPageData<MyPageArchive>(response);
}

export async function updateMyPageArchive(archiveId: string | number, payload: UpdateMyPageArchivePayload) {
  const response = await requestMyPageJson<MyPageApiEnvelope<Partial<MyPageArchive>>>(`/api/mypage/archives/${archiveId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return unwrapMyPageData<Partial<MyPageArchive>>(response);
}

export async function updateMyPageArchiveWithImages(
  archiveId: string | number,
  payload: UpdateMyPageArchiveWithImagesPayload
) {
  const formData = new FormData();
  if (payload.archiveType) formData.append('archiveType', payload.archiveType);
  if (payload.customName) formData.append('customName', payload.customName);
  if (payload.alcoholId !== undefined) formData.append('alcoholId', String(payload.alcoholId));
  if (payload.category) formData.append('category', payload.category);
  if (payload.abv !== undefined) formData.append('abv', String(payload.abv));
  if (payload.rating !== undefined) formData.append('rating', String(payload.rating));
  if (payload.tastingNote) formData.append('tastingNote', payload.tastingNote);
  if (payload.recordDate) formData.append('recordDate', payload.recordDate);
  if (payload.mood) formData.append('mood', payload.mood);
  if (payload.pairing) formData.append('pairing', payload.pairing);
  if (payload.tagIds) formData.append('tagIds', JSON.stringify(payload.tagIds));
  if (payload.customTags) formData.append('customTags', JSON.stringify(payload.customTags));
  if (payload.deleteImageIds) formData.append('deleteImageIds', JSON.stringify(payload.deleteImageIds));

  (payload.images || []).slice(0, 3).forEach((image, index) => {
    const imageName = image.name || image.uri.split('/').pop() || `archive-update-${archiveId}-${index + 1}.jpg`;
    const imageType = image.type || 'image/jpeg';
    formData.append('images', {
      uri: image.uri,
      name: imageName,
      type: imageType,
    } as unknown as Blob);
  });

  const response = await requestMyPageForm<MyPageApiEnvelope<MyPageArchive>>(
    `/api/mypage/archives/${archiveId}/with-images`,
    formData,
    { method: 'PATCH' }
  );
  return unwrapMyPageData<MyPageArchive>(response);
}

export async function deleteMyPageArchive(archiveId: string | number) {
  return requestMyPageJson<MyPageApiEnvelope<null>>(`/api/mypage/archives/${archiveId}`, {
    method: 'DELETE',
  });
}

export async function getMyPageArchiveTags() {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageArchiveTagGroup[]>>('/api/mypage/archives/tags');
  return unwrapMyPageData<MyPageArchiveTagGroup[]>(response);
}

export async function uploadMyPageArchiveImages(archiveId: string | number, images: MyPageImageUploadFile[]) {
  if (!images.length) {
    throw new Error('아카이브 이미지 파일을 첨부해주세요.');
  }

  const formData = new FormData();
  images.forEach((image, index) => {
    const imageName = image.name || image.uri.split('/').pop() || `archive-${archiveId}-${index + 1}.jpg`;
    const imageType = image.type || 'image/jpeg';
    formData.append('images', {
      uri: image.uri,
      name: imageName,
      type: imageType,
    } as unknown as Blob);
  });

  const response = await requestMyPageForm<MyPageApiEnvelope<MyPageArchiveImage[]>>(
    `/api/mypage/archives/${archiveId}/images`,
    formData,
    { method: 'POST' }
  );
  return unwrapMyPageData<MyPageArchiveImage[]>(response);
}

export async function deleteMyPageArchiveImage(archiveId: string | number, imageId: string | number) {
  return requestMyPageJson<MyPageApiEnvelope<null>>(`/api/mypage/archives/${archiveId}/images/${imageId}`, {
    method: 'DELETE',
  });
}

export function getMyPageApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === 'NEEDS_ACCESS_TOKEN') return '로그인이 필요합니다.';
    return error.message || fallback;
  }
  return fallback;
}
