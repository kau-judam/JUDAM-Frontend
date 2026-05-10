import SafeStorage from '@/utils/storage';

export const JUDAM_FUNDING_API_BASE_URL = 'http://43.202.24.223:3000';

type FundingApiErrorBody = {
  status?: number;
  message?: string;
};

type FundingAgreementPayload = {
  breweryId: number;
  isAdultConfirmed: boolean;
  isContactInfoAgreed: boolean;
  isSettlementInfoAgreed: boolean;
  isFeePolicyAgreed: boolean;
  isResponsibilityAgreed: boolean;
};

type FundingAgreementResponse = {
  agreementId: number;
  breweryId: number;
  message: string;
};

type FundingDraftPayload = {
  breweryId: number;
  title?: string;
  shortTitle?: string;
  category?: string;
  mainIngredient?: string;
  subIngredient?: string;
  alcoholPercentage?: number;
  summary?: string;
};

type FundingDraftResponse = {
  draftId: number;
  breweryId: number;
  status: 'DRAFT' | string;
  progressRate: number;
  message: string;
};

type FundingDraftUpdatePayload = {
  title?: string;
  shortTitle?: string;
  summary?: string;
  alcoholPercentage?: number;
};

type FundingSectionResponse = {
  draftId: number;
  section?: string;
  progressRate: number;
  message: string;
  updatedAt?: string;
  status?: string;
  targetAmount?: number;
  platformFeeRate?: number;
  platformFeeAmount?: number;
};

type FundingBasicInfoPayload = {
  title?: string;
  shortTitle?: string;
  category?: string;
  mainIngredient?: string;
  subIngredients?: string[];
  alcoholPercentage?: number;
  summary?: string;
  thumbnailUrl?: string;
};

type FundingSchedulePayload = {
  pricePerBottle: number;
  totalQuantity: number;
  fundingStartDate: string;
  fundingPeriodDays: number;
  fundingEndDate: string;
  expectedDeliveryDate: string;
};

type FundingLegalInfoPayload = {
  productType: string;
  volume: number;
  alcoholPercentage: number;
  rawMaterials: { name: string; origin: string }[];
};

type FundingTasteProfilePayload = {
  sweetness: number;
  acidity: number;
  body: number;
  carbonation: number;
  alcoholIntensity: number;
  flavorNotes?: string[];
};

type FundingPlanPayload = {
  introduction: string;
  budgetPlan: { category: string; amount: number }[];
  schedulePlan: { step: string; description: string; date: string }[];
};

type FundingBreweryInfoPayload = {
  breweryName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

type FundingNoticesPayload = {
  refundPolicy: string;
  exchangePolicy: string;
  adultVerificationNotice: string;
  riskNotice: string;
};

type CreateFundingOrderPayload = {
  optionId: number;
  quantity: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingDetailAddress?: string;
  adultVerified: boolean;
  noticeAgreed: boolean;
};

type CreateFundingOrderResponse = {
  orderId: number;
  fundingId: number;
  optionId: number;
  quantity: number;
  totalAmount: number;
  orderStatus: string;
  message: string;
};

type RequestPaymentPayload = {
  paymentMethod: string;
  paymentProvider: string;
  amount: number;
};

type RequestPaymentResponse = {
  orderId: number;
  paymentId: number;
  paymentStatus: string;
  paymentUrl: string;
  message: string;
};

export type FundingListStatus = 'UPCOMING' | 'ONGOING' | 'ENDED';
export type FundingListSort = 'POPULAR' | 'LATEST' | 'DEADLINE';

export type FundingListItem = {
  fundingId: number;
  title: string;
  thumbnailUrl: string | null;
  breweryName: string;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  status: FundingListStatus | string;
  endDate: string;
};

export type FundingListResponse = {
  content: FundingListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type FundingDetailResponse = {
  fundingId: number;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  breweryName: string;
  status: FundingListStatus | string;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  supporterCount: number;
  startDate: string;
  endDate: string;
  expectedDeliveryDate: string;
  tasteProfile?: {
    sweetness: number;
    acidity: number;
    body: number;
    carbonation: number;
    alcoholIntensity: number;
    flavorNotes?: string[];
  };
  supportOptions?: FundingSupportOption[];
};

export type FundingIntroResponse = {
  fundingId: number;
  title: string;
  introduction: string;
  story: string;
  images: string[];
};

export type FundingBreweryLogItem = {
  logId: number;
  step: string;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
};

export type FundingBreweryLogsResponse = {
  fundingId: number;
  logs: FundingBreweryLogItem[];
};

export type FundingQuestionItem = {
  questionId: number;
  writerNickname: string;
  title: string;
  content: string;
  answered: boolean;
  createdAt: string;
};

export type FundingQuestionsResponse = {
  content: FundingQuestionItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type CreateFundingQuestionPayload = {
  title: string;
  content: string;
  isPrivate?: boolean;
};

type CreateFundingQuestionResponse = {
  fundingId: number;
  questionId: number;
  message: string;
};

type CreateFundingReplyPayload = {
  content: string;
};

type CreateFundingReplyResponse = {
  fundingId: number;
  questionId: number;
  replyId: number;
  message: string;
};

export type FundingReviewItem = {
  reviewId: number;
  writerNickname: string;
  rating: number;
  content: string;
  imageUrls: string[];
  createdAt: string;
};

export type FundingReviewsResponse = {
  content: FundingReviewItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type FundingSupportOption = {
  optionId: number;
  name: string;
  price: number;
  description: string;
  stock?: number;
  remainingStock?: number;
  maxPerUser?: number;
};

export type FundingSupportOptionsResponse = {
  fundingId: number;
  supportOptions: FundingSupportOption[];
};

export type FundingOrderDetailResponse = {
  orderId: number;
  fundingId: number;
  fundingTitle: string;
  optionName: string;
  quantity: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingDetailAddress: string;
  createdAt: string;
};

type CreateFundingInquiryPayload = {
  title: string;
  content: string;
};

type CreateFundingInquiryResponse = {
  fundingId: number;
  inquiryId: number;
  message: string;
};

const TOKEN_STORAGE_KEYS = ['judam_access_token', 'access_token', 'accessToken', 'token'];

export async function getFundingAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = await SafeStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

async function requestFundingJson<T>(path: string, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const nextHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getFundingAccessToken();
    if (!token) {
      throw new Error('NEEDS_ACCESS_TOKEN');
    }
    nextHeaders.Authorization = `Bearer ${token}`;
  } else {
    const token = await getFundingAccessToken();
    if (token) nextHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${JUDAM_FUNDING_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: nextHeaders,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = (data as FundingApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function getFundingApiErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다.') {
  if (error instanceof Error) {
    if (error.message === 'NEEDS_ACCESS_TOKEN') return '로그인 정보가 필요합니다. 다시 로그인해주세요.';
    return error.message || fallback;
  }
  return fallback;
}

export async function saveFundingAgreement(payload: FundingAgreementPayload) {
  return requestFundingJson<FundingAgreementResponse>('/api/fundings/agreements', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function createFundingDraft(payload: FundingDraftPayload) {
  return requestFundingJson<FundingDraftResponse>('/api/fundings/drafts', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateFundingDraft(draftId: number, payload: FundingDraftUpdatePayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingBasicInfo(draftId: number, payload: FundingBasicInfoPayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/basic-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingSchedule(draftId: number, payload: FundingSchedulePayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/schedule`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingLegalInfo(draftId: number, payload: FundingLegalInfoPayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/legal-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingTasteProfile(draftId: number, payload: FundingTasteProfilePayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/taste-profile`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingPlan(draftId: number, payload: FundingPlanPayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/plan`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingBreweryInfo(draftId: number, payload: FundingBreweryInfoPayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/brewery-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveFundingNotices(draftId: number, payload: FundingNoticesPayload) {
  return requestFundingJson<FundingSectionResponse>(`/api/fundings/drafts/${draftId}/notices`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function createFundingOrder(fundingId: number, payload: CreateFundingOrderPayload) {
  return requestFundingJson<CreateFundingOrderResponse>(`/api/fundings/${fundingId}/orders`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function requestFundingPayment(orderId: number, payload: RequestPaymentPayload) {
  return requestFundingJson<RequestPaymentResponse>(`/api/orders/${orderId}/payment`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function getFundingList(params: {
  status?: FundingListStatus;
  sort?: FundingListSort;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.sort) query.set('sort', params.sort);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  const suffix = query.toString();
  return requestFundingJson<FundingListResponse>(`/api/fundings${suffix ? `?${suffix}` : ''}`);
}

export async function getFundingDetail(fundingId: number) {
  return requestFundingJson<FundingDetailResponse>(`/api/fundings/${fundingId}`);
}

export async function getFundingIntro(fundingId: number) {
  return requestFundingJson<FundingIntroResponse>(`/api/fundings/${fundingId}/intro`);
}

export async function getFundingBreweryLogs(fundingId: number) {
  return requestFundingJson<FundingBreweryLogsResponse>(`/api/fundings/${fundingId}/brewery-logs`);
}

export async function getFundingQuestions(fundingId: number, params: {
  page?: number;
  size?: number;
  answered?: boolean;
} = {}) {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  if (params.answered !== undefined) query.set('answered', String(params.answered));
  return requestFundingJson<FundingQuestionsResponse>(`/api/fundings/${fundingId}/questions?${query.toString()}`);
}

export async function createFundingQuestion(fundingId: number, payload: CreateFundingQuestionPayload) {
  return requestFundingJson<CreateFundingQuestionResponse>(`/api/fundings/${fundingId}/questions`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function createFundingReply(fundingId: number, questionId: number, payload: CreateFundingReplyPayload) {
  return requestFundingJson<CreateFundingReplyResponse>(`/api/fundings/${fundingId}/questions/${questionId}/replies`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function getFundingReviews(fundingId: number, params: {
  page?: number;
  size?: number;
  sort?: 'LATEST' | 'RATING';
} = {}) {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  query.set('sort', params.sort ?? 'LATEST');
  return requestFundingJson<FundingReviewsResponse>(`/api/fundings/${fundingId}/reviews?${query.toString()}`);
}

export async function getFundingSupportOptions(fundingId: number) {
  return requestFundingJson<FundingSupportOptionsResponse>(`/api/fundings/${fundingId}/support-options`);
}

export async function getFundingOrderDetail(orderId: number) {
  return requestFundingJson<FundingOrderDetailResponse>(`/api/orders/${orderId}`, {
    auth: true,
  });
}

export async function createFundingInquiry(fundingId: number, payload: CreateFundingInquiryPayload) {
  return requestFundingJson<CreateFundingInquiryResponse>(`/api/fundings/${fundingId}/inquiries`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}
