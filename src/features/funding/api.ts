import SafeStorage from '@/utils/storage';

export const JUDAM_FUNDING_API_BASE_URL = 'http://43.202.24.223:3000';

type FundingApiErrorBody = {
  status?: number;
  message?: string;
};

type FundingApiEnvelope<T> = FundingApiErrorBody & {
  data?: T;
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

export type FundingDocumentType =
  | 'BUSINESS_REGISTRATION'
  | 'MAIL_ORDER_BUSINESS'
  | 'LIQUOR_LICENSE'
  | 'BANK_ACCOUNT_COPY'
  | 'ETC';

type FundingDocumentUploadFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

export type FundingUploadFile = FundingDocumentUploadFile;

type FundingDocumentUploadResponse = {
  draftId: number;
  documentId: number;
  documentType: FundingDocumentType;
  fileName: string;
  fileUrl: string;
  message: string;
};

export type FundingBreweryLogStage =
  | 'INGREDIENT'
  | 'FERMENTATION'
  | 'AGING'
  | 'BOTTLING'
  | 'SHIPPING';

type FundingBreweryLogMutationPayload = {
  stage?: FundingBreweryLogStage;
  title?: string;
  content?: string;
  images?: FundingUploadFile[];
  deleteImageUrls?: string[];
};

type FundingBreweryLogMutationResponse = {
  breweryLogId: number;
  fundingId: number;
  stage: FundingBreweryLogStage | string;
  title: string;
  imageUrls: string[];
  message: string;
};

type FundingBreweryLogDeleteResponse = {
  breweryLogId: number;
  fundingId: number;
  message: string;
};

export type FundingShareLinkResponse = {
  fundingId: number;
  shareUrl: string;
  message: string;
  title?: string;
  summary?: string;
  thumbnailImageUrl?: string;
  shareCount?: number;
};

export type FundingReportReason =
  | 'FALSE_INFORMATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'COPYRIGHT'
  | 'FRAUD'
  | 'ETC';

type CreateFundingReportPayload = {
  reason: FundingReportReason;
  content?: string;
};

type CreateFundingReportResponse = {
  reportId: number;
  fundingId: number;
  reason: FundingReportReason | string;
  message: string;
};

export type FundingReportStatus = 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'REJECTED';

export type FundingReportItem = {
  reportId: number;
  fundingId: number;
  fundingTitle: string;
  reporterId: number;
  reporterNickname: string;
  reason: FundingReportReason | string;
  content?: string;
  status: FundingReportStatus | string;
  createdAt: string;
};

type FundingReportsResponse = {
  content: FundingReportItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type CreateFundingOrderPayload = {
  optionId: number;
  quantity: number;
  supporterPhone?: string;
  supporterEmail?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingDetailAddress?: string;
  additionalSupportAmount?: number;
  message?: string;
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

type FundingPaymentInfoResponse = {
  paymentId: number;
  orderId: number;
  paymentMethod: string;
  paymentProvider: string;
  paymentStatus: string;
  amount: number;
  approvedAt?: string;
  createdAt: string;
};

type CreateFundingReviewPayload = {
  rating: number;
  content: string;
  images?: FundingUploadFile[];
};

type CreateFundingReviewResponse = {
  reviewId: number;
  fundingId: number;
  rating: number;
  imageUrls: string[];
  message: string;
};

type FundingLikeResponse = {
  fundingId: number;
  liked: boolean;
  likeCount: number;
  message: string;
};

export type FundingListStatus = 'UPCOMING' | 'ONGOING' | 'ENDED';
export type FundingListSort = 'POPULAR' | 'LATEST' | 'DEADLINE';

export type FundingListItem = {
  fundingId: number;
  title: string;
  description?: string;
  recipeTitle?: string;
  thumbnailUrl: string | null;
  breweryName: string;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  status: FundingListStatus | string;
  startDate?: string;
  endDate: string;
};

export type FundingListResponse = {
  data: FundingListItem[];
  content?: FundingListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type FundingListApiResponse = FundingApiEnvelope<FundingListItem[]> & {
  content?: FundingListItem[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
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
  description?: string;
  supporterCount?: number;
  startDate: string;
  endDate: string;
  expectedDeliveryDate?: string;
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
  step?: string;
  stage?: FundingBreweryLogStage | string;
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
  optionId: number | string;
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

type FundingSupportOptionsApiResponse = FundingSupportOptionsResponse | FundingApiEnvelope<FundingSupportOptionsResponse>;

type FundingDetailApiResponse = FundingDetailResponse | FundingApiEnvelope<FundingDetailResponse>;

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

export type MyFundingOrderItem = {
  orderId: number;
  fundingId: number;
  fundingTitle: string;
  thumbnailUrl: string | null;
  optionName: string;
  quantity: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  expectedDeliveryDate: string;
  orderedAt: string;
  reviewWritten?: boolean;
};

type MyFundingOrdersResponse = {
  content: MyFundingOrderItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

const TOKEN_STORAGE_KEYS = ['judam_access_token', 'access_token', 'accessToken', 'token'];

export async function getFundingAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = await SafeStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

function parseFundingResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new Error(`API 응답이 JSON이 아닙니다. ${response.status} ${path} (${contentType})`);
  }
}

function getFundingResponseData<T>(response: T | FundingApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as FundingApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
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
  const data = parseFundingResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as FundingApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function requestFundingForm<T>(path: string, formData: FormData, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const nextHeaders: Record<string, string> = {
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
    body: formData,
  });

  const text = await response.text();
  const data = parseFundingResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as FundingApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function createFundingFormFile(file: FundingUploadFile) {
  return {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  } as unknown as Blob;
}

function appendFundingFormFiles(formData: FormData, fieldName: string, files?: FundingUploadFile[]) {
  files?.forEach((file) => {
    formData.append(fieldName, createFundingFormFile(file));
  });
}

export function getFundingApiErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다.') {
  if (error instanceof Error) {
    if (error.message === 'NEEDS_ACCESS_TOKEN') return '로그인 정보가 필요합니다. 다시 로그인해주세요.';
    return error.message || fallback;
  }
  return fallback;
}

export function isFundingApiMissingEndpointError(error: unknown) {
  const message = getFundingApiErrorMessage(error, '');
  return message.includes('API 응답이 JSON이 아닙니다.') && message.includes('404');
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

export async function uploadFundingDocument(draftId: number, documentType: FundingDocumentType, file: FundingDocumentUploadFile) {
  const formData = new FormData();
  formData.append('documentType', documentType);
  formData.append('file', createFundingFormFile(file));

  return requestFundingForm<FundingDocumentUploadResponse>(`/api/fundings/drafts/${draftId}/documents`, formData, {
    method: 'POST',
    auth: true,
  });
}

export async function createBreweryLog(fundingId: number, payload: Required<Pick<FundingBreweryLogMutationPayload, 'stage' | 'title' | 'content'>> & Pick<FundingBreweryLogMutationPayload, 'images'>) {
  const formData = new FormData();
  formData.append('stage', payload.stage);
  formData.append('title', payload.title);
  formData.append('content', payload.content);
  appendFundingFormFiles(formData, 'images', payload.images);

  return requestFundingForm<FundingBreweryLogMutationResponse>(`/api/fundings/${fundingId}/brewery-logs`, formData, {
    method: 'POST',
    auth: true,
  });
}

export async function updateBreweryLog(fundingId: number, breweryLogId: number, payload: FundingBreweryLogMutationPayload) {
  const formData = new FormData();
  if (payload.stage) formData.append('stage', payload.stage);
  if (payload.title) formData.append('title', payload.title);
  if (payload.content) formData.append('content', payload.content);
  payload.deleteImageUrls?.forEach((url) => {
    formData.append('deleteImageUrls', url);
  });
  appendFundingFormFiles(formData, 'images', payload.images);

  return requestFundingForm<FundingBreweryLogMutationResponse>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}`, formData, {
    method: 'PATCH',
    auth: true,
  });
}

export async function deleteBreweryLog(fundingId: number, breweryLogId: number) {
  return requestFundingJson<FundingBreweryLogDeleteResponse>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}`, {
    method: 'DELETE',
    auth: true,
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

export async function getFundingPaymentInfo(orderId: number) {
  return requestFundingJson<FundingPaymentInfoResponse>(`/api/orders/${orderId}/payment`, {
    auth: true,
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
  const result = await requestFundingJson<FundingListApiResponse>(`/api/fundings${suffix ? `?${suffix}` : ''}`);
  const data = Array.isArray(result.data) ? result.data : result.content ?? [];
  return {
    ...result,
    data,
    content: result.content ?? data,
    page: result.page ?? params.page ?? 0,
    size: result.size ?? params.size ?? 10,
    totalElements: result.totalElements ?? data.length,
    totalPages: result.totalPages ?? 1,
  };
}

export async function getFundingDetail(fundingId: number) {
  const result = await requestFundingJson<FundingDetailApiResponse>(`/api/fundings/${fundingId}`);
  return getFundingResponseData<FundingDetailResponse>(result);
}

export async function getFundingIntro(fundingId: number) {
  return requestFundingJson<FundingIntroResponse>(`/api/fundings/${fundingId}/intro`);
}

export async function getFundingBreweryLogs(fundingId: number) {
  return requestFundingJson<FundingBreweryLogsResponse>(`/api/fundings/${fundingId}/brewery-logs`);
}

export async function getFundingShareLink(fundingId: number) {
  return requestFundingJson<FundingShareLinkResponse>(`/api/fundings/${fundingId}/share-link`);
}

export async function createFundingReport(fundingId: number, payload: CreateFundingReportPayload) {
  return requestFundingJson<CreateFundingReportResponse>(`/api/fundings/${fundingId}/reports`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function getFundingReports(params: {
  status?: FundingReportStatus;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return requestFundingJson<FundingReportsResponse>(`/api/fundings/reports?${query.toString()}`, {
    auth: true,
  });
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

export async function createFundingReview(fundingId: number, payload: CreateFundingReviewPayload) {
  const formData = new FormData();
  formData.append('rating', String(payload.rating));
  formData.append('content', payload.content);
  appendFundingFormFiles(formData, 'images', payload.images);

  return requestFundingForm<CreateFundingReviewResponse>(`/api/fundings/${fundingId}/reviews`, formData, {
    method: 'POST',
    auth: true,
  });
}

export async function getFundingSupportOptions(fundingId: number) {
  const result = await requestFundingJson<FundingSupportOptionsApiResponse>(`/api/fundings/${fundingId}/support-options`);
  const response = getFundingResponseData<FundingSupportOptionsResponse>(result);
  return {
    fundingId: response.fundingId ?? fundingId,
    supportOptions: response.supportOptions ?? [],
  };
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

export async function likeFundingProject(fundingId: number) {
  return requestFundingJson<FundingLikeResponse>(`/api/fundings/${fundingId}/likes`, {
    method: 'POST',
    auth: true,
  });
}

export async function unlikeFundingProject(fundingId: number) {
  return requestFundingJson<FundingLikeResponse>(`/api/fundings/${fundingId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function getMyFundingOrders(params: {
  status?: string;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return requestFundingJson<MyFundingOrdersResponse>(`/api/users/me/funding-orders?${query.toString()}`, {
    auth: true,
  });
}
