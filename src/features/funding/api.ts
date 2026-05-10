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
