import { JUDAM_FUNDING_API_BASE_URL } from '@/features/funding/api';

export function normalizeFundingImageUrl(imageUrl?: unknown) {
  if (Array.isArray(imageUrl)) {
    return normalizeFundingImageUrl(imageUrl[0]);
  }
  if (imageUrl && typeof imageUrl === 'object') {
    const image = imageUrl as {
      imageUrl?: unknown;
      image_url?: unknown;
      url?: unknown;
      fileUrl?: unknown;
      file_url?: unknown;
      thumbnailUrl?: unknown;
      thumbnail_url?: unknown;
    };
    return normalizeFundingImageUrl(
      image.imageUrl ?? image.image_url ?? image.url ?? image.fileUrl ?? image.file_url ?? image.thumbnailUrl ?? image.thumbnail_url
    );
  }
  if (typeof imageUrl !== 'string') return '';

  const trimmed = imageUrl.trim();
  if (!trimmed) return '';
  if (/^(file:|content:|data:|asset:)/i.test(trimmed)) return '';
  const nestedAbsoluteUrl = trimmed.match(/^https?:\/\/[^/]+\/(https?:\/\/.+)$/i);
  if (nestedAbsoluteUrl?.[1]) return nestedAbsoluteUrl[1];
  if (/^https?:/i.test(trimmed)) return trimmed;
  return `${JUDAM_FUNDING_API_BASE_URL}/${trimmed.replace(/^\/+/, '')}`;
}

function coerceFundingImageUrls(imageUrls: unknown): string[] {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) {
    return imageUrls.flatMap(coerceFundingImageUrls);
  }
  if (typeof imageUrls === 'object') {
    const image = imageUrls as {
      imageUrl?: unknown;
      image_url?: unknown;
      url?: unknown;
      fileUrl?: unknown;
      file_url?: unknown;
      thumbnailUrl?: unknown;
      thumbnail_url?: unknown;
    };
    return coerceFundingImageUrls(
      image.imageUrl ?? image.image_url ?? image.url ?? image.fileUrl ?? image.file_url ?? image.thumbnailUrl ?? image.thumbnail_url
    );
  }
  if (typeof imageUrls !== 'string') return [];

  const trimmed = imageUrls.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      return coerceFundingImageUrls(parsed);
    } catch {
      return [trimmed];
    }
  }

  return [trimmed];
}

export function normalizeFundingImageUrls(imageUrls?: unknown) {
  return Array.from(new Set(coerceFundingImageUrls(imageUrls).map(normalizeFundingImageUrl).filter(Boolean)));
}
