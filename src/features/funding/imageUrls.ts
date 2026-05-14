import { JUDAM_FUNDING_API_BASE_URL } from '@/features/funding/api';

export function normalizeFundingImageUrl(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return '';
  if (/^(https?:|file:|content:|data:|asset:)/i.test(trimmed)) return trimmed;
  return `${JUDAM_FUNDING_API_BASE_URL}/${trimmed.replace(/^\/+/, '')}`;
}

export function normalizeFundingImageUrls(imageUrls?: string[] | null) {
  return (imageUrls || []).map(normalizeFundingImageUrl).filter(Boolean);
}
