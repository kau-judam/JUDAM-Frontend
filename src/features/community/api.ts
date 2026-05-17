import { ImageSourcePropType } from 'react-native';

import SafeStorage from '@/utils/storage';
import type { Post } from '@/contexts/CommunityContext';

export const JUDAM_COMMUNITY_API_BASE_URL = 'http://43.202.24.223:3000';

export type CommunitySort = 'newest' | 'popular';

type ApiErrorBody = {
  status?: number;
  message?: string;
};

export type CommunityPostDto = {
  post_id: number;
  title: string;
  content?: string;
  board_type: 'FREE' | 'TASTING_REVIEW' | 'RECIPE_DISCUSSION' | string;
  user_id: number | string;
  nickname: string;
  author_profile_image_url?: string | null;
  profile_image_url?: string | null;
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
  is_mine?: boolean;
  thumbnail_url?: string | null;
  image_urls?: string[];
  created_at: string;
  updated_at?: string | null;
};

export type CommunityCommentDto = {
  comment_id: number;
  user_id: number | string;
  nickname: string;
  author_profile_image_url?: string | null;
  profile_image_url?: string | null;
  content: string;
  like_count: number;
  is_liked: boolean;
  is_mine?: boolean;
  created_at: string;
  updated_at: string | null;
};

type CommunityPostListResponse = {
  posts: CommunityPostDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

type CommunityPostDetailResponse = {
  post: CommunityPostDto;
};

type CommunityCommentListResponse = {
  comments: CommunityCommentDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

type CommunityLikeResponse = {
  status: number;
  message: string;
  data: {
    post_id?: number;
    comment_id?: number;
    like_count: number;
  };
};

type CreateCommunityCommentResponse = {
  status: number;
  message: string;
  comment: {
    comment_id: number;
    post_id: number;
    user_id: number | string;
    nickname: string;
    content: string;
    like_count: number;
    created_at: string;
  };
};

type UpdateCommunityCommentResponse = {
  status: number;
  message: string;
  comment: {
    comment_id: number;
    content: string;
    updated_at: string;
  };
};

type DeleteCommunityResponse = {
  status: number;
  message: string;
};

const TOKEN_STORAGE_KEYS = ['judam_access_token', 'access_token', 'accessToken', 'token'];

export async function getCommunityAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = await SafeStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

function parseCommunityResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API response is not JSON. ${response.status} ${path} (${contentType})`);
  }
}

async function requestJson<T>(path: string, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const nextHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getCommunityAccessToken();
    if (!token) throw new Error('NEEDS_ACCESS_TOKEN');
    nextHeaders.Authorization = `Bearer ${token}`;
  } else {
    const token = await getCommunityAccessToken();
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${JUDAM_COMMUNITY_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: nextHeaders,
  });

  const text = await response.text();
  const data = parseCommunityResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as ApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function formatCommunityTimestamp(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function getCommunityCategory(boardType?: string) {
  if (boardType === 'FREE') return '자유게시판';
  return '정보게시판';
}

function getCommunityAuthorType(boardType?: string): 'user' | 'brewery' {
  return boardType === 'BREWERY' ? 'brewery' : 'user';
}

export function mapCommunityPost(item: CommunityPostDto, fallbackAvatar?: ImageSourcePropType | string): Post {
  const imageUrls = item.image_urls ?? (item.thumbnail_url ? [item.thumbnail_url] : []);

  return {
    id: item.post_id,
    author: item.nickname || '사용자',
    authorType: getCommunityAuthorType(item.board_type),
    avatar: item.author_profile_image_url || item.profile_image_url || fallbackAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    title: item.title,
    content: item.content || '',
    image: imageUrls[0],
    imageUrls,
    likes: item.like_count,
    comments: item.comment_count,
    timestamp: formatCommunityTimestamp(item.created_at),
    liked: Boolean(item.is_liked),
    category: getCommunityCategory(item.board_type),
    tags: [item.board_type],
    authorId: String(item.user_id),
    isMine: item.is_mine,
  };
}

export function mapCommunityComment(item: CommunityCommentDto, fallbackAvatar?: ImageSourcePropType | string) {
  return {
    id: item.comment_id,
    author: item.nickname || '사용자',
    authorType: 'user' as const,
    avatar: item.author_profile_image_url || item.profile_image_url || fallbackAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    content: item.content,
    timestamp: formatCommunityTimestamp(item.created_at),
    likes: item.like_count,
    liked: item.is_liked,
    userId: String(item.user_id),
    isMine: item.is_mine,
    replies: [],
  };
}

export async function fetchCommunityPosts({ sort, page = 0, size = 20 }: { sort: CommunitySort; page?: number; size?: number }) {
  const params = new URLSearchParams({
    board_type: 'ALL',
    sort,
    page: String(page),
    size: String(size),
  });
  const data = await requestJson<CommunityPostListResponse>(`/api/posts?${params.toString()}`);
  return {
    ...data,
    posts: data.posts.map((post) => mapCommunityPost(post)),
  };
}

export async function fetchCommunityPost(postId: number) {
  const data = await requestJson<CommunityPostDetailResponse>(`/api/posts/${postId}`);
  return {
    ...data,
    post: mapCommunityPost(data.post),
  };
}

export async function deleteCommunityPost(postId: number) {
  return requestJson<DeleteCommunityResponse>(`/api/posts/${postId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function registerCommunityPostLike(postId: number) {
  return requestJson<CommunityLikeResponse>(`/api/posts/${postId}/likes`, {
    method: 'POST',
    auth: true,
  });
}

export async function deleteCommunityPostLike(postId: number) {
  return requestJson<CommunityLikeResponse>(`/api/posts/${postId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchCommunityComments(postId: number, page = 0, size = 20) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const data = await requestJson<CommunityCommentListResponse>(`/api/posts/${postId}/comments?${params.toString()}`);
  return {
    ...data,
    comments: data.comments.map((comment) => mapCommunityComment(comment)),
  };
}

export async function createCommunityComment(postId: number, content: string) {
  return requestJson<CreateCommunityCommentResponse>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    auth: true,
  });
}

export async function updateCommunityComment(postId: number, commentId: number, content: string) {
  return requestJson<UpdateCommunityCommentResponse>(`/api/posts/${postId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
    auth: true,
  });
}

export async function deleteCommunityComment(postId: number, commentId: number) {
  return requestJson<DeleteCommunityResponse>(`/api/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function registerCommunityCommentLike(postId: number, commentId: number) {
  return requestJson<CommunityLikeResponse>(`/api/posts/${postId}/comments/${commentId}/likes`, {
    method: 'POST',
    auth: true,
  });
}

export async function deleteCommunityCommentLike(postId: number, commentId: number) {
  return requestJson<CommunityLikeResponse>(`/api/posts/${postId}/comments/${commentId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
}
