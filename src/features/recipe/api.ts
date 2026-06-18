import { ImageSourcePropType } from 'react-native';

import type { Recipe } from '@/constants/data';
import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

export const JUDAM_API_BASE_URL = 'https://api.kaujudam.com';

export type RecipeSort = 'newest' | 'popular';

type ApiErrorBody = {
  status?: number;
  message?: unknown;
  error?: unknown;
  errors?: unknown;
  data?: unknown;
};

export type RecipeListItemDto = {
  recipe_id: number;
  recipeId?: number;
  user_id?: number | string;
  userId?: number | string;
  title: string;
  summary: string;
  main_ingredient: string;
  mainIngredient?: string;
  author_type: 'USER' | 'BREWERY' | 'CONSUMER' | string;
  authorType?: 'USER' | 'BREWERY' | 'CONSUMER' | string;
  status: string;
  is_fundable: boolean;
  isFundable?: boolean;
  interest_count: number;
  interestCount?: number;
  image_url: string | null;
  imageUrl?: string | null;
  created_at: string;
  createdAt?: string;
  comment_count?: number;
  commentCount?: number;
  is_interested?: boolean;
  isInterested?: boolean;
  is_liked?: boolean;
  isLiked?: boolean;
  author_nickname?: string;
  authorNickname?: string;
  author_name?: string;
  authorName?: string;
  author_profile_image?: string | null;
  authorProfileImage?: string | null;
  author_profile_image_url?: string | null;
  authorProfileImageUrl?: string | null;
};

export type RecipeDetailDto = RecipeListItemDto & {
  content: string;
  abv_range: string;
  ai_sub_ingredient: string | null;
  target_flavor: string;
  concept: string;
  updated_at: string;
};

export type RecipeCommentDto = {
  comment_id: number;
  user_id: number;
  user_nickname?: string;
  user_user_nickname?: string;
  nickname?: string;
  content: string;
  like_count: number;
  reply_count?: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string | null;
  author_type?: 'USER' | 'BREWERY' | 'CONSUMER' | string;
  profile_image_url?: string | null;
  author_profile_image?: string | null;
  is_mine?: boolean;
};

export type CreateRecipePayload = {
  title: string;
  content: string;
  abv_range: string;
  main_ingredient: string;
  sub_ingredient?: string | null;
  target_flavor: string;
  concept: string;
  summary: string;
  imageUrl?: string | null;
  image?: {
    uri: string;
    name?: string | null;
    type?: string | null;
  } | null;
};

export type CreateRecipeFundingPayload = {
  title: string;
  description: string;
  goal_amount: number;
  start_date: string;
  end_date: string;
};

export type SuggestSubIngredientsPayload = {
  main_ingredient?: string;
  mainIngredient?: string;
  region?: string;
  location?: string;
  area?: string;
};

export type SuggestFlavorTagsPayload = {
  title: string;
  main_ingredient: string;
  sub_ingredients: string[];
  abv_range: string;
};

export type SuggestSummaryPayload = SuggestFlavorTagsPayload & {
  flavor_tags: string[];
  concept: string | null;
};

type RecipeListResponse = {
  recipes: RecipeListItemDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

type PopularRecipeListResponse =
  | RecipeListItemDto[]
  | RecipeListResponse
  | {
      status?: number;
      message?: string;
      data?: RecipeListItemDto[] | RecipeListResponse;
    };

type RecipeDetailResponse = {
  recipe: RecipeDetailDto;
};

type RecipeCommentListResponse = {
  comments: RecipeCommentDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

type RecipeReplyListResponse = {
  replies: RecipeCommentDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

type RecipeInterestResponse = {
  status: number;
  message: string;
  data: {
    recipe_id: number;
    interest_count: number;
    is_fundable: boolean;
  };
};

type RecipeCommentLikeResponse = {
  status: number;
  message: string;
  data: {
    comment_id: number;
    like_count: number;
  };
};

type CreateRecipeResponse = {
  status: number;
  message: string;
  recipe: RecipeListItemDto;
};

type DeleteRecipeResponse = {
  status: number;
  message: string;
};

type CreateCommentResponse = {
  status: number;
  message: string;
  comment: {
    comment_id: number;
    recipe_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: number;
    created_at: string;
  };
};

type CreateReplyResponse = {
  status: number;
  message: string;
  reply: {
    comment_id: number;
    recipe_id: number;
    parent_comment_id: number;
    user_id: number;
    nickname: string;
    content: string;
    like_count: number;
    created_at: string;
    parent_reply_count?: number;
  };
  parent_reply_count?: number;
};

type UpdateCommentResponse = {
  status: number;
  message: string;
  comment: {
    comment_id: number;
    content: string;
    updated_at: string;
  };
};

type RecipeFundingResponse = {
  status: number;
  message: string;
  funding: {
    funding_id: number;
    recipe_id: number;
    title: string;
    goal_amount: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    funding_status: string;
    recipe_status: string;
  };
};

type SuggestSubIngredientsResponse = {
  status: number;
  message: string;
  data?: {
    sub_ingredients: string[];
  };
  sub_ingredients?: string[];
};

type IngredientRegionsResponse = {
  status?: number;
  message?: string;
  data?: {
    ingredient?: string;
    regions?: string[];
    found?: boolean;
    data_source?: string;
  };
  regions?: string[];
};

type SuggestFlavorTagsResponse = {
  status: number;
  message: string;
  data?: {
    flavor_tags: string[];
  };
  flavor_tags?: string[];
};

type SuggestSummaryResponse = {
  status: number;
  message: string;
  data?: {
    summary: string;
  };
  summary?: string;
};

export async function getRecipeAccessToken() {
  return getAuthAccessToken();
}

export type RecipeJwtPayload = {
  id?: string;
  userId?: string;
  role?: string;
  exp?: number;
};

export function decodeRecipeJwtPayload(token: string): RecipeJwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    if (typeof atob !== 'function') return null;
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded) as RecipeJwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, now = Date.now()) {
  try {
    const parsed = decodeRecipeJwtPayload(token);
    if (!parsed?.exp) return false;
    return parsed.exp * 1000 <= now;
  } catch {
    return false;
  }
}

function parseRecipeResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API 응답이 JSON이 아닙니다. ${response.status} ${path} (${contentType})`);
  }
}

function stringifyRecipeApiError(value: unknown): string | null {
  if (typeof value === 'string') return value === '[object Object]' ? null : value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const messages = value
      .map((item) => stringifyRecipeApiError(item))
      .filter((item): item is string => Boolean(item));
    return messages.length > 0 ? messages.join('\n') : null;
  }
  if (value && typeof value === 'object') {
    const messages = Object.entries(value)
      .map(([key, item]) => {
        const message = stringifyRecipeApiError(item);
        return message ? `${key}: ${message}` : null;
      })
      .filter((item): item is string => Boolean(item));
    return messages.length > 0 ? messages.join('\n') : JSON.stringify(value);
  }
  return null;
}

function getRecipeApiErrorMessage(data: unknown, fallback: string) {
  if (!data || typeof data !== 'object') return fallback;
  const body = data as ApiErrorBody;
  const message =
    stringifyRecipeApiError(body.message) ||
    stringifyRecipeApiError(body.error) ||
    stringifyRecipeApiError(body.errors) ||
    stringifyRecipeApiError(body.data);
  if (message && message !== '[object Object]') return message;
  return stringifyRecipeApiError(data) || fallback;
}
async function requestJson<T>(path: string, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const createHeaders = (token?: string | null): Record<string, string> => {
    const nextHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string> | undefined),
    };
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
    return nextHeaders;
  };

  const token = await getRecipeAccessToken();
  if (auth && !token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  let response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: createHeaders(token),
  });

  let text = await response.text();
  let data = parseRecipeResponseBody(path, response, text);

  if (response.status === 401 && (auth || token)) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
        ...requestOptions,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseRecipeResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    throw new Error(getRecipeApiErrorMessage(data, `HTTP ${response.status}`));
  }

  return data as T;
}

async function requestFormJson<T>(path: string, formData: FormData, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const createHeaders = (token?: string | null): Record<string, string> => {
    const nextHeaders: Record<string, string> = {
      ...(headers as Record<string, string> | undefined),
    };
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
    return nextHeaders;
  };

  const token = await getRecipeAccessToken();
  if (auth && !token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  let response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
    ...requestOptions,
    method: requestOptions.method || 'POST',
    body: formData,
    headers: createHeaders(token),
  });

  let text = await response.text();
  let data = parseRecipeResponseBody(path, response, text);

  if (response.status === 401 && (auth || token)) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
        ...requestOptions,
        method: requestOptions.method || 'POST',
        body: formData,
        headers: createHeaders(refreshedToken),
      });
      text = await response.text();
      data = parseRecipeResponseBody(path, response, text);
    }
  }

  if (!response.ok) {
    console.warn('Recipe API error response', {
      path,
      status: response.status,
      data,
      raw: text,
    });
    throw new Error(getRecipeApiErrorMessage(data, `HTTP ${response.status}`));
  }

  return data as T;
}

export function splitRecipeField(value?: string | null) {
  if (!value) return [];
  return value
    .split(/[,#]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatRecipeTimestamp(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function isBrokenAuthorName(value?: string | null) {
  if (!value) return true;
  return /^[?\s]+$/.test(value.trim());
}

export function getRecipeAuthorLabel(item: { author_nickname?: string; author_name?: string; author_type?: string }) {
  if (item.author_type === 'BREWERY' && isBrokenAuthorName(item.author_nickname || item.author_name)) {
    return '양조장 테스트';
  }
  if (!isBrokenAuthorName(item.author_nickname)) return item.author_nickname as string;
  if (!isBrokenAuthorName(item.author_name)) return item.author_name as string;
  if (item.author_type === 'BREWERY') return '양조장 테스트';
  return '사용자';
}

export function mapRecipeListItem(item: RecipeListItemDto): Recipe {
  const recipeId = item.recipe_id ?? item.recipeId ?? 0;
  const mainIngredient = item.main_ingredient ?? item.mainIngredient ?? '';
  const authorType = item.author_type ?? item.authorType ?? '';
  const imageUrl = item.image_url ?? item.imageUrl ?? null;
  const createdAt = item.created_at ?? item.createdAt ?? '';
  return {
    id: recipeId,
    title: item.title,
    author: getRecipeAuthorLabel(item),
    description: item.summary,
    ingredients: splitRecipeField(mainIngredient),
    likes: item.interest_count ?? item.interestCount ?? 0,
    comments: item.comment_count ?? item.commentCount ?? 0,
    timestamp: formatRecipeTimestamp(createdAt),
    liked: Boolean(item.is_interested ?? item.isInterested ?? item.is_liked ?? item.isLiked),
    image: imageUrl || undefined,
    status: item.status,
    isFundable: item.is_fundable ?? item.isFundable,
    authorType,
    authorId: item.user_id || item.userId ? String(item.user_id ?? item.userId) : undefined,
    createdAt,
  };
}

export function mapRecipeDetail(item: RecipeDetailDto): Recipe {
  return {
    ...mapRecipeListItem(item),
    description: item.content || item.summary,
    ingredients: splitRecipeField(item.main_ingredient),
    subIngredients: splitRecipeField(item.ai_sub_ingredient),
    flavorTags: splitRecipeField(item.target_flavor),
    alcoholRange: item.abv_range,
    concept: item.concept,
    summary: item.summary,
    authorAvatar: item.author_profile_image || item.author_profile_image_url || undefined,
  };
}

export function mapRecipeComment(item: RecipeCommentDto, fallbackAvatar?: ImageSourcePropType | string) {
  return {
    id: item.comment_id,
    author: item.user_nickname || item.user_user_nickname || item.nickname || '사용자',
    avatar: item.author_profile_image || item.profile_image_url || fallbackAvatar,
    content: item.content,
    timestamp: formatRecipeTimestamp(item.created_at),
    likes: item.like_count,
    replyCount: item.reply_count ?? 0,
    liked: item.is_liked,
    authorType: item.author_type === 'BREWERY' ? 'brewery' : 'user',
    userId: item.user_id,
    isMine: item.is_mine,
    replies: [],
  };
}

export async function fetchRecipes({ sort, page = 0, size = 20 }: { sort: RecipeSort; page?: number; size?: number }) {
  const params = new URLSearchParams({
    sort,
    status: 'ALL',
    page: String(page),
    size: String(size),
  });
  const data = await requestJson<RecipeListResponse>(`/api/recipes?${params.toString()}`);
  return {
    ...data,
    recipes: data.recipes.map(mapRecipeListItem),
  };
}

function getPopularRecipeItems(data: PopularRecipeListResponse) {
  if (Array.isArray(data)) return data;
  const nestedData = 'data' in data ? data.data : undefined;
  if (Array.isArray(nestedData)) return nestedData;
  if (nestedData && 'recipes' in nestedData) return nestedData.recipes;
  if ('recipes' in data) return data.recipes;
  return [];
}

export async function fetchPopularRecipes(limit = 3) {
  const data = await requestJson<PopularRecipeListResponse>('/api/recipes/popular');
  return getPopularRecipeItems(data).map(mapRecipeListItem).slice(0, limit);
}

export async function fetchBreweryConsumerRecipes({
  status = 'ALL',
  page = 0,
  size = 20,
}: {
  status?: 'ALL' | 'PUBLISHED' | 'FUNDING_READY';
  page?: number;
  size?: number;
}) {
  const params = new URLSearchParams({
    status,
    page: String(page),
    size: String(size),
  });
  const data = await requestJson<RecipeListResponse>(`/api/recipes/brewery?${params.toString()}`, { auth: true });
  return {
    ...data,
    recipes: data.recipes.map(mapRecipeListItem),
  };
}

export async function fetchRecipeDetail(recipeId: number) {
  const data = await requestJson<RecipeDetailResponse>(`/api/recipes/${recipeId}`);
  return mapRecipeDetail(data.recipe);
}

export async function createRecipe(payload: CreateRecipePayload) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('content', payload.content);
  formData.append('abv_range', payload.abv_range);
  formData.append('main_ingredient', payload.main_ingredient);
  if (payload.sub_ingredient?.trim()) {
    formData.append('sub_ingredient', payload.sub_ingredient.trim());
  }
  formData.append('target_flavor', payload.target_flavor);
  formData.append('concept', payload.concept);
  formData.append('summary', payload.summary);
  const remoteImageUrl = payload.imageUrl?.trim();
  if (remoteImageUrl && /^https?:\/\//i.test(remoteImageUrl)) {
    formData.append('image_url', remoteImageUrl);
    formData.append('imageUrl', remoteImageUrl);
    formData.append('thumbnail_url', remoteImageUrl);
    formData.append('thumbnailUrl', remoteImageUrl);
  }
  if (payload.image?.uri && !payload.image.uri.startsWith('http')) {
    const imageName = payload.image.name || payload.image.uri.split('/').pop() || `recipe-${Date.now()}.jpg`;
    const imageType = payload.image.type || 'image/jpeg';
    formData.append('image', {
      uri: payload.image.uri,
      name: imageName,
      type: imageType,
    } as unknown as Blob);
  }
  const data = await requestFormJson<CreateRecipeResponse>('/api/recipes', formData, { auth: true });
  return mapRecipeListItem(data.recipe);
}

export async function suggestRecipeSubIngredients(payload: SuggestSubIngredientsPayload) {
  const data = await requestJson<SuggestSubIngredientsResponse>('/api/recipe/suggest-sub-ingredients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data?.sub_ingredients ?? data.sub_ingredients ?? [];
}

export async function fetchIngredientRegions(mainIngredient: string) {
  const params = new URLSearchParams({ ingredient: mainIngredient });
  const data = await requestJson<IngredientRegionsResponse | string[]>(`/api/recipe/ingredient-region?${params.toString()}`, {
    method: 'GET',
  });
  if (Array.isArray(data)) return data;
  return data.data?.regions ?? data.regions ?? [];
}

export async function suggestRecipeFlavorTags(payload: SuggestFlavorTagsPayload) {
  const data = await requestJson<SuggestFlavorTagsResponse>('/api/recipe/suggest-flavor-tags', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data?.flavor_tags ?? data.flavor_tags ?? [];
}

export async function suggestRecipeSummary(payload: SuggestSummaryPayload) {
  const data = await requestJson<SuggestSummaryResponse>('/api/recipe/suggest-summary', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.data?.summary ?? data.summary ?? '';
}

export async function deleteRecipe(recipeId: number) {
  return requestJson<DeleteRecipeResponse>(`/api/recipes/${recipeId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function registerRecipeInterest(recipeId: number) {
  return requestJson<RecipeInterestResponse>(`/api/recipes/${recipeId}/interests`, {
    method: 'POST',
    auth: true,
  });
}

export async function deleteRecipeInterest(recipeId: number) {
  return requestJson<RecipeInterestResponse>(`/api/recipes/${recipeId}/interests`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchRecipeComments(recipeId: number, page = 0, size = 20) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return requestJson<RecipeCommentListResponse>(`/api/recipes/${recipeId}/comments?${params.toString()}`);
}

export async function fetchRecipeCommentReplies(recipeId: number, commentId: number, page = 0, size = 20) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return requestJson<RecipeReplyListResponse>(`/api/recipes/${recipeId}/comments/${commentId}/replies?${params.toString()}`);
}

export async function createRecipeComment(recipeId: number, content: string) {
  return requestJson<CreateCommentResponse>(`/api/recipes/${recipeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    auth: true,
  });
}

export async function createRecipeCommentReply(recipeId: number, commentId: number, content: string) {
  return requestJson<CreateReplyResponse>(`/api/recipes/${recipeId}/comments/${commentId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    auth: true,
  });
}

export async function updateRecipeComment(recipeId: number, commentId: number, content: string) {
  return requestJson<UpdateCommentResponse>(`/api/recipes/${recipeId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
    auth: true,
  });
}

export async function deleteRecipeComment(recipeId: number, commentId: number) {
  return requestJson<{ status: number; message: string }>(`/api/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function registerRecipeCommentLike(recipeId: number, commentId: number) {
  return requestJson<RecipeCommentLikeResponse>(`/api/recipes/${recipeId}/comments/${commentId}/likes`, {
    method: 'POST',
    auth: true,
  });
}

export async function deleteRecipeCommentLike(recipeId: number, commentId: number) {
  return requestJson<RecipeCommentLikeResponse>(`/api/recipes/${recipeId}/comments/${commentId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function createRecipeFunding(recipeId: number, payload: CreateRecipeFundingPayload) {
  return requestJson<RecipeFundingResponse>(`/api/recipes/${recipeId}/funding`, {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: true,
  });
}
