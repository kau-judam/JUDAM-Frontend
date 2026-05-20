import { ImageSourcePropType } from 'react-native';

import type { Post } from '@/contexts/CommunityContext';
import SafeStorage from '@/utils/storage';

export const JUDAM_COMMUNITY_API_BASE_URL = 'http://43.202.24.223:3000';

export type CommunityBoardType = 'FREE' | 'INFO';
export type CommunitySort = 'newest' | 'popular';

type ApiErrorBody = {
  status?: number;
  message?: string;
};

export type CommunityImageFile = {
  uri: string;
  name?: string;
  type?: string;
};

export type CommunityPostDto = {
  post_id: number;
  title: string;
  content?: string;
  board_type: CommunityBoardType | string;
  user_id: number | string;
  nickname: string;
  author_profile_image?: string | null;
  author_profile_image_url?: string | null;
  profile_image_url?: string | null;
  like_count: number;
  comment_count: number;
  thumbnail_url?: string | null;
  image_urls?: string[];
  images?: { sequence: number; image_url: string }[];
  is_liked?: boolean;
  is_mine?: boolean;
  created_at: string;
  updated_at?: string | null;
};

export type CommunityCommentDto = {
  comment_id: number;
  user_id: number | string;
  nickname: string;
  author_profile_image?: string | null;
  author_profile_image_url?: string | null;
  profile_image_url?: string | null;
  content: string;
  like_count: number;
  reply_count?: number;
  is_liked?: boolean;
  is_mine?: boolean;
  created_at: string;
  updated_at: string | null;
};

export type CommunityReplyDto = CommunityCommentDto;

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

type CommunityReplyListResponse = {
  replies: CommunityReplyDto[];
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

type CreateCommunityPostResponse = {
  status: number;
  message: string;
  post: CommunityPostDto;
};

type UpdateCommunityPostResponse = {
  status: number;
  message: string;
  post: {
    post_id: number;
    title: string;
    content: string;
    image_urls: string[];
    updated_at: string;
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

type CreateCommunityReplyResponse = {
  status: number;
  message: string;
  reply: CommunityReplyDto & {
    post_id: number;
    parent_comment_id: number;
    parent_reply_count?: number;
  };
  parent_reply_count?: number;
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
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';

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
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
  const nextHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
  return boardType === 'FREE' ? '자유게시판' : '정보게시판';
}

function getCommunityAuthorType(boardType?: string): 'user' | 'brewery' {
  return boardType === 'BREWERY' ? 'brewery' : 'user';
}

function getAuthorProfileImage(item: {
  author_profile_image?: string | null;
  author_profile_image_url?: string | null;
  profile_image_url?: string | null;
}) {
  return item.author_profile_image || item.author_profile_image_url || item.profile_image_url || null;
}

function getCommunityPostImageUrls(item: CommunityPostDto) {
  const detailImages = item.images
    ?.slice()
    .sort((a, b) => a.sequence - b.sequence)
    .map((image) => image.image_url)
    .filter(Boolean);

  if (detailImages?.length) return detailImages;
  if (item.image_urls?.length) return item.image_urls;
  return item.thumbnail_url ? [item.thumbnail_url] : [];
}

export function mapCommunityPost(item: CommunityPostDto, fallbackAvatar?: ImageSourcePropType | string): Post {
  const imageUrls = getCommunityPostImageUrls(item);

  return {
    id: item.post_id,
    author: item.nickname || '사용자',
    authorType: getCommunityAuthorType(item.board_type),
    avatar: getAuthorProfileImage(item) || fallbackAvatar || DEFAULT_AVATAR,
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
    avatar: getAuthorProfileImage(item) || fallbackAvatar || DEFAULT_AVATAR,
    content: item.content,
    timestamp: formatCommunityTimestamp(item.created_at),
    likes: item.like_count,
    liked: Boolean(item.is_liked),
    userId: String(item.user_id),
    isMine: item.is_mine,
    replyCount: item.reply_count ?? 0,
    replies: [],
  };
}

export function mapCommunityReply(item: CommunityReplyDto, fallbackAvatar?: ImageSourcePropType | string) {
  return {
    id: item.comment_id,
    author: item.nickname || '사용자',
    authorType: 'user' as const,
    avatar: getAuthorProfileImage(item) || fallbackAvatar || DEFAULT_AVATAR,
    content: item.content,
    timestamp: formatCommunityTimestamp(item.created_at),
    likes: item.like_count ?? 0,
    liked: Boolean(item.is_liked),
    userId: String(item.user_id),
    isMine: item.is_mine,
  };
}

function getImageName(uri: string, index: number) {
  const cleanUri = uri.split('?')[0];
  const name = cleanUri.split('/').pop();
  return name && name.includes('.') ? name : `community-image-${index + 1}.jpg`;
}

function getImageType(uri: string) {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  return 'image/jpeg';
}

function normalizeCommunityImageFile(image: string | CommunityImageFile, index: number): CommunityImageFile {
  if (typeof image !== 'string') {
    return {
      uri: image.uri,
      name: image.name || getImageName(image.uri, index),
      type: image.type || getImageType(image.uri),
    };
  }

  return {
    uri: image,
    name: getImageName(image, index),
    type: getImageType(image),
  };
}

function appendCommunityImages(formData: FormData, images: (string | CommunityImageFile)[] = []) {
  images.slice(0, 5).forEach((image, index) => {
    const file = normalizeCommunityImageFile(image, index);
    formData.append('images', file as unknown as Blob);
  });
}

function buildCommunityPostFormData(payload: {
  title: string;
  content: string;
  boardType?: CommunityBoardType;
  images?: (string | CommunityImageFile)[];
}) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('content', payload.content);
  if (payload.boardType) formData.append('board_type', payload.boardType);
  appendCommunityImages(formData, payload.images);
  return formData;
}

export async function createCommunityPost(payload: {
  title: string;
  content: string;
  boardType: CommunityBoardType;
  images?: (string | CommunityImageFile)[];
}) {
  return requestJson<CreateCommunityPostResponse>('/api/posts', {
    method: 'POST',
    body: buildCommunityPostFormData(payload),
    auth: true,
  });
}

export async function updateCommunityPost(postId: number, payload: {
  title: string;
  content: string;
  images?: (string | CommunityImageFile)[];
}) {
  return requestJson<UpdateCommunityPostResponse>(`/api/posts/${postId}`, {
    method: 'PUT',
    body: buildCommunityPostFormData(payload),
    auth: true,
  });
}

export async function fetchCommunityPosts({
  sort,
  page = 0,
  size = 20,
}: {
  sort: CommunitySort;
  page?: number;
  size?: number;
}) {
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

export async function fetchCommunityCommentReplies(postId: number, commentId: number, page = 0, size = 20) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const data = await requestJson<CommunityReplyListResponse>(`/api/posts/${postId}/comments/${commentId}/replies?${params.toString()}`);
  return {
    ...data,
    replies: data.replies.map((reply) => mapCommunityReply(reply)),
  };
}

export async function createCommunityCommentReply(postId: number, commentId: number, content: string) {
  return requestJson<CreateCommunityReplyResponse>(`/api/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    auth: true,
  });
}
