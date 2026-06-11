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

export type MyPageParticipatedFunding = {
  fundingId: number;
  orderId: number;
  projectName: string;
  drinkName: string;
  breweryName: string | null;
  ingredients: string | null;
  abv: number | null;
  thumbnailUrl: string | null;
  fundingStatus: string;
  myAmount?: number;
  participatedAt?: string;
  currentAmount?: number;
  goalAmount?: number;
  progressRate?: number;
  canViewDelivery?: boolean;
  deliveryStatus?: string | null;
  hasTrackingNumber?: boolean;
  hasReview: boolean;
  reviewId: number | null;
};

export type MyPageFundingOrderDeliveryDetail = {
  orderId: number;
  fundingId: number;
  projectName: string;
  breweryName: string | null;
  rewardName: string | null;
  paidAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderedAt: string;
  paymentStatus: string;
  deliveryStatus: string | null;
  courierName: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
  receiverAddress: string | null;
};

export type MyPageFundingArchiveReview = {
  reviewId: number;
  rating: number;
  tastingNote: string;
  mood: string | null;
  pairing: string | null;
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
  mood?: string;
  pairing?: string;
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

export type MyPageActivityTargetType = 'RECIPE' | 'POST' | 'FUNDING';

export type MyPageActivityInterestsResult = {
  interests: {
    targetId: number;
    targetType: MyPageActivityTargetType;
    title: string;
    summary: string | null;
    thumbnailUrl: string | null;
    interestedAt: string;
  }[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
};

export type MyPageActivityCommentsResult = {
  comments: {
    commentId: number;
    targetId: number;
    targetType: Extract<MyPageActivityTargetType, 'RECIPE' | 'POST'>;
    targetTitle: string;
    content: string;
    createdAt: string;
    updatedAt: string | null;
  }[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
};

export type MyPageFundingJournalCommentsResult = {
  comments: {
    commentId: number;
    fundingId: number;
    fundingTitle: string;
    breweryLogId: number;
    breweryLogTitle: string;
    breweryLogCreatedAt: string;
    content: string;
    createdAt: string;
    updatedAt: string | null;
  }[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size?: number;
};

export type MyPageActivityQnaResult = {
  qna: {
    questionId: number;
    targetId: number;
    targetType: 'FUNDING';
    targetTitle: string;
    questionContent: string;
    questionCreatedAt: string;
    hasAnswer: boolean;
    answerContent: string | null;
    answerCreatedAt: string | null;
    answerStatus: 'ANSWERED' | 'WAITING' | string;
  }[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
};

type MyPageActivityQnaRawItem = Record<string, unknown>;

export type MyPageBadge = {
  badgeId: string;
  name: string;
  displayOrder: number;
  earned: boolean;
  earnedAt: string | null;
};

export type MyPageRecipeActivityDto = {
  recipe_id: number;
  title: string;
  summary: string;
  main_ingredient: string;
  author_type?: string;
  status: string;
  is_fundable: boolean;
  interest_count: number;
  image_url: string | null;
  created_at?: string;
  interested_at?: string;
};

export type MyPageCommunityPostActivityDto = {
  post_id: number;
  title: string;
  board_type: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  liked_at?: string;
};

export type MyPageRecipeCommentActivityDto = {
  comment_id: number;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string | null;
  recipe: {
    recipe_id: number;
    title: string;
    status: string;
  };
};

export type MyPagePostCommentActivityDto = {
  comment_id: number;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string | null;
  post: {
    post_id: number;
    title: string;
    board_type: string;
  };
};

export type MyPageRecipeActivityList = {
  recipes: MyPageRecipeActivityDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

export type MyPageCommunityPostActivityList = {
  posts: MyPageCommunityPostActivityDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

export type MyPageRecipeCommentActivityList = {
  comments: MyPageRecipeCommentActivityDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

export type MyPagePostCommentActivityList = {
  comments: MyPagePostCommentActivityDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
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

function readMyPageString(source: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
  }
  return fallback;
}

function readMyPageNullableString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value === null) return null;
  }
  return null;
}

function readMyPageNumber(source: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function readMyPageBoolean(source: Record<string, unknown>, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
  }
  return fallback;
}

function readMyPageObjectArray(source: unknown, keys: string[]) {
  if (Array.isArray(source)) {
    return source.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
  }
  if (!source || typeof source !== 'object') return [];
  const object = source as Record<string, unknown>;
  for (const key of keys) {
    const value = object[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
    }
  }
  return [];
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
  if (payload.mood) formData.append('mood', payload.mood);
  if (payload.pairing) formData.append('pairing', payload.pairing);
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

export async function getMyPageParticipatedFundings(params: { excludeArchived?: boolean } = {}) {
  const query = new URLSearchParams();
  if (params.excludeArchived !== undefined) {
    query.set('excludeArchived', String(params.excludeArchived));
  }
  const suffix = query.toString();
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageParticipatedFunding[]>>(
    `/api/mypage/fundings/participated${suffix ? `?${suffix}` : ''}`
  );
  return unwrapMyPageData<MyPageParticipatedFunding[]>(response);
}

export async function getMyPageFundingArchiveReview(fundingId: string | number) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageFundingArchiveReview | null>>(
    `/api/mypage/fundings/${fundingId}/review`
  );
  return unwrapMyPageData<MyPageFundingArchiveReview | null>(response);
}

export async function getMyPageFundingOrderDeliveryDetail(orderId: string | number) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageFundingOrderDeliveryDetail>>(
    `/api/mypage/fundings/orders/${orderId}`
  );
  return unwrapMyPageData<MyPageFundingOrderDeliveryDetail>(response);
}

export async function getMyPageBadges() {
  const response = await requestMyPageJson<MyPageApiEnvelope<{ badges: MyPageBadge[] }>>('/api/mypage/badges');
  return unwrapMyPageData<{ badges: MyPageBadge[] }>(response).badges;
}

function buildActivityPageQuery(page = 0, size = 20) {
  return new URLSearchParams({
    page: String(page),
    size: String(size),
  }).toString();
}

export async function getMyPageMyRecipes(page = 0, size = 20) {
  return requestMyPageJson<MyPageRecipeActivityList>(`/api/users/me/recipes?${buildActivityPageQuery(page, size)}`);
}

export async function getMyPageInterestedRecipes(page = 0, size = 20) {
  return requestMyPageJson<MyPageRecipeActivityList>(
    `/api/users/me/interests/recipes?${buildActivityPageQuery(page, size)}`
  );
}

export async function getMyPageRecipeComments(page = 0, size = 20) {
  return requestMyPageJson<MyPageRecipeCommentActivityList>(
    `/api/users/me/recipe-comments?${buildActivityPageQuery(page, size)}`
  );
}

export async function getMyPageMyPosts() {
  return requestMyPageJson<MyPageCommunityPostActivityList>('/api/users/me/posts');
}

export async function getMyPageLikedPosts(page = 0, size = 20) {
  return requestMyPageJson<MyPageCommunityPostActivityList>(
    `/api/users/me/likes/posts?${buildActivityPageQuery(page, size)}`
  );
}

export async function getMyPagePostComments(page = 0, size = 20) {
  return requestMyPageJson<MyPagePostCommentActivityList>(
    `/api/users/me/post-comments?${buildActivityPageQuery(page, size)}`
  );
}

function buildUnifiedActivityQuery(params: {
  type?: MyPageActivityTargetType | Extract<MyPageActivityTargetType, 'RECIPE' | 'POST'>;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });
  if (params.type) query.set('type', params.type);
  return query.toString();
}

export async function getMyPageActivityInterests(params: {
  type?: MyPageActivityTargetType;
  page?: number;
  size?: number;
} = {}) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageActivityInterestsResult> | MyPageActivityInterestsResult>(
    `/api/mypage/activity/interests?${buildUnifiedActivityQuery(params)}`
  );
  const data = unwrapMyPageData<MyPageActivityInterestsResult>(response);
  return {
    ...data,
    interests: data.interests ?? [],
  };
}

export async function getMyPageActivityComments(params: {
  type?: Extract<MyPageActivityTargetType, 'RECIPE' | 'POST'>;
  page?: number;
  size?: number;
} = {}) {
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageActivityCommentsResult> | MyPageActivityCommentsResult>(
    `/api/mypage/activity/comments?${buildUnifiedActivityQuery(params)}`
  );
  const data = unwrapMyPageData<MyPageActivityCommentsResult>(response);
  return {
    ...data,
    comments: data.comments ?? [],
  };
}

export async function getMyPageFundingJournalComments(params: {
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });
  const response = await requestMyPageJson<MyPageApiEnvelope<MyPageFundingJournalCommentsResult> | MyPageFundingJournalCommentsResult>(
    `/api/mypage/activity/funding-journal-comments?${query.toString()}`
  );
  const data = unwrapMyPageData<MyPageFundingJournalCommentsResult>(response);
  return {
    ...data,
    comments: data.comments ?? [],
  };
}

function normalizeMyPageActivityQnaItem(item: MyPageActivityQnaRawItem): MyPageActivityQnaResult['qna'][number] {
  const hasAnswer = readMyPageBoolean(item, ['hasAnswer', 'has_answer', 'answered'], Boolean(item.answerContent || item.answer_content || item.answer));
  return {
    questionId: readMyPageNumber(item, ['questionId', 'question_id', 'id']),
    targetId: readMyPageNumber(item, ['targetId', 'target_id', 'fundingId', 'funding_id']),
    targetType: 'FUNDING',
    targetTitle: readMyPageString(item, ['targetTitle', 'target_title', 'fundingTitle', 'funding_title', 'projectName', 'project_name', 'title']),
    questionContent: readMyPageString(item, ['questionContent', 'question_content', 'content', 'body', 'comment']),
    questionCreatedAt: readMyPageString(item, ['questionCreatedAt', 'question_created_at', 'createdAt', 'created_at', 'date']),
    hasAnswer,
    answerContent: readMyPageNullableString(item, ['answerContent', 'answer_content', 'answer']),
    answerCreatedAt: readMyPageNullableString(item, ['answerCreatedAt', 'answer_created_at', 'answeredAt', 'answered_at']),
    answerStatus: readMyPageString(item, ['answerStatus', 'answer_status', 'status'], hasAnswer ? 'ANSWERED' : 'WAITING'),
  };
}

function normalizeMyPageActivityQnaResult(response: MyPageActivityQnaResult | MyPageApiEnvelope<MyPageActivityQnaResult> | unknown): MyPageActivityQnaResult {
  const data = unwrapMyPageData<unknown>(response);
  const container = data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : {};
  const qna = readMyPageObjectArray(data, ['qnas', 'qna', 'questions', 'content', 'items', 'list']).map(normalizeMyPageActivityQnaItem);
  return {
    qna,
    totalElements: readMyPageNumber(container, ['totalElements', 'total_elements', 'total'], qna.length),
    totalPages: readMyPageNumber(container, ['totalPages', 'total_pages'], qna.length > 0 ? 1 : 0),
    currentPage: readMyPageNumber(container, ['currentPage', 'current_page', 'page']),
    size: readMyPageNumber(container, ['size'], qna.length),
  };
}

export async function getMyPageActivityQna(params: {
  page?: number;
  size?: number;
} = {}) {
  const response = await requestMyPageJson<unknown>(
    `/api/mypage/activity/qna?${buildUnifiedActivityQuery(params)}`
  );
  return normalizeMyPageActivityQnaResult(response);
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
