import { ImageSourcePropType } from 'react-native';

import type { Recipe } from '@/constants/data';
import SafeStorage from '@/utils/storage';

export const JUDAM_API_BASE_URL = 'http://43.202.24.223:3000';

export type RecipeSort = 'newest' | 'popular';

type ApiErrorBody = {
  status?: number;
  message?: string;
};

export type RecipeListItemDto = {
  recipe_id: number;
  title: string;
  summary: string;
  main_ingredient: string;
  author_type: 'USER' | 'BREWERY' | 'CONSUMER' | string;
  status: string;
  is_fundable: boolean;
  interest_count: number;
  image_url: string | null;
  created_at: string;
  comment_count?: number;
  is_interested?: boolean;
  is_liked?: boolean;
  author_nickname?: string;
  author_name?: string;
  author_profile_image?: string | null;
  author_profile_image_url?: string | null;
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
  target_flavor: string;
  concept: string;
  summary: string;
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

type RecipeListResponse = {
  recipes: RecipeListItemDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
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
  };
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

const TOKEN_STORAGE_KEYS = ['judam_access_token', 'access_token', 'accessToken', 'token'];

export async function getRecipeAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = await SafeStorage.getItem(key);
    if (value) return value;
  }
  return null;
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

async function requestJson<T>(path: string, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const nextHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getRecipeAccessToken();
    if (!token) {
      throw new Error('NEEDS_ACCESS_TOKEN');
    }
    nextHeaders.Authorization = `Bearer ${token}`;
  } else {
    const token = await getRecipeAccessToken();
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: nextHeaders,
  });

  const text = await response.text();
  const data = parseRecipeResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as ApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function requestFormJson<T>(path: string, formData: FormData, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const nextHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getRecipeAccessToken();
    if (!token) {
      throw new Error('NEEDS_ACCESS_TOKEN');
    }
    nextHeaders.Authorization = `Bearer ${token}`;
  } else {
    const token = await getRecipeAccessToken();
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${JUDAM_API_BASE_URL}${path}`, {
    ...requestOptions,
    method: requestOptions.method || 'POST',
    body: formData,
    headers: nextHeaders,
  });

  const text = await response.text();
  const data = parseRecipeResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as ApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
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

export function getRecipeAuthorLabel(item: { author_nickname?: string; author_name?: string; author_type?: string }) {
  if (item.author_nickname) return item.author_nickname;
  if (item.author_name) return item.author_name;
  if (item.author_type === 'BREWERY') return '양조장';
  return '사용자';
}

export function mapRecipeListItem(item: RecipeListItemDto): Recipe {
  return {
    id: item.recipe_id,
    title: item.title,
    author: getRecipeAuthorLabel(item),
    description: item.summary,
    ingredients: splitRecipeField(item.main_ingredient),
    likes: item.interest_count,
    comments: item.comment_count ?? 0,
    timestamp: formatRecipeTimestamp(item.created_at),
    liked: Boolean(item.is_interested ?? item.is_liked),
    image: item.image_url || undefined,
    status: item.status,
    isFundable: item.is_fundable,
    authorType: item.author_type,
    createdAt: item.created_at,
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
  formData.append('target_flavor', payload.target_flavor);
  formData.append('concept', payload.concept);
  formData.append('summary', payload.summary);
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
