import { JUDAM_FUNDING_API_BASE_URL } from '@/features/funding/api';

export function normalizeFundingImageUrl(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return '';
  if (/^(https?:|file:|content:|data:|asset:)/i.test(trimmed)) return trimmed;
  return `${JUDAM_FUNDING_API_BASE_URL}/${trimmed.replace(/^\/+/, '')}`;
}

function coerceFundingImageUrls(imageUrls: unknown): string[] {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) {
    return imageUrls.flatMap(coerceFundingImageUrls);
  }
  if (typeof imageUrls !== 'string') return [];

  const trimmed = imageUrls.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
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
