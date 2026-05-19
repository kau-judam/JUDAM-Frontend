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
  category?: string;
  mainIngredient?: string;
  subIngredients?: string[];
  summary?: string;
  alcoholPercentage?: number;
  thumbnailUrl?: string;
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

type FundingDraftSubmitResponse = {
  draftId: number;
  status: 'SUBMITTED' | string;
  progressRate: number;
  submittedAt?: string;
  updatedAt?: string;
  message: string;
};

export type FundingDraftListItem = {
  draftId: number;
  breweryId: number;
  title: string;
  shortTitle: string;
  category: string;
  status: string;
  progressRate: number;
  createdAt: string;
  updatedAt: string;
};

type FundingDraftListResponse = {
  drafts: FundingDraftListItem[];
  message: string;
};

export type FundingDraftPreviewResponse = {
  draftId: number;
  status: string;
  progressRate: number;
  basicInfo?: {
    title?: string;
    shortTitle?: string;
    category?: string;
    mainIngredient?: string;
    subIngredients?: string[];
    alcoholPercentage?: number;
    summary?: string;
    thumbnailUrl?: string;
  };
  schedule?: {
    pricePerBottle?: number;
    totalQuantity?: number;
    targetAmount?: number;
    fundingStartDate?: string;
    fundingPeriodDays?: number;
    fundingEndDate?: string;
    expectedDeliveryDate?: string;
  };
  legalInfo?: {
    productType?: string;
    volume?: number;
    alcoholPercentage?: number;
    rawMaterials?: { name: string; origin: string }[];
  };
  tasteProfile?: {
    sweetness?: number;
    acidity?: number;
    body?: number;
    carbonation?: number;
    alcoholIntensity?: number;
    flavorNotes?: string[];
  };
  plan?: {
    introduction?: string;
    budgetPlan?: { category: string; amount: number }[];
    schedulePlan?: { step: string; description: string; date: string }[];
  };
  breweryInfo?: {
    breweryName?: string;
    representativeName?: string;
    businessRegistrationNumber?: string;
    businessAddress?: string;
    contactEmail?: string;
    contactPhone?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  };
  notices?: {
    refundPolicy?: string;
    exchangePolicy?: string;
    adultVerificationNotice?: string;
    riskNotice?: string;
  };
  documents?: {
    documentId: number;
    documentType: string;
    fileName: string;
    fileUrl: string;
    createdAt: string;
  }[];
  message: string;
};

type FundingDraftDeleteResponse = {
  draftId: number;
  message: string;
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

type UpdateFundingProjectPayload = {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  goalAmount?: number;
  startDate?: string;
  endDate?: string;
  pricePerBottle?: number;
  shippingFee?: number;
  status?: 'ONGOING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
};

type UpdateFundingProjectResponse = {
  fundingId: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  pricePerBottle: number;
  shippingFee: number;
  status: string;
  message: string;
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
  content?: string;
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
  privacyAgreed?: boolean;
  privacyThirdPartyAgreed?: boolean;
  thirdPartyAgreed?: boolean;
  termsAgreed?: boolean;
  noticeAgreed: boolean;
  refundPolicyAgreed?: boolean;
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
  orderName?: string;
  customerName?: string;
  successUrl?: string;
  failUrl?: string;
};

type RequestPaymentResponse = {
  orderId: number;
  paymentId: number;
  paymentStatus: string;
  paymentUrl?: string;
  message: string;
};

type ConfirmTossPaymentPayload = {
  paymentKey: string;
  orderId: string | number;
  amount: number;
};

type ConfirmTossPaymentResponse = {
  orderId: number;
  paymentId: number;
  paymentStatus: string;
  paidAmount: number;
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

type CompleteFundingPaymentResponse = {
  orderId: number;
  paymentId: number;
  paymentStatus: string;
  paidAmount: number;
  message: string;
};

type AdminFundingDraftStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';

type AdminFundingDraftListResponse = {
  drafts: FundingDraftListItem[];
  message: string;
};

type AdminApproveFundingDraftResponse = {
  draftId: number;
  fundingId: number;
  title: string;
  status: string;
  createdAt: string;
  message: string;
};

type AdminRejectFundingDraftResponse = {
  draftId: number;
  status: string;
  rejectReason: string;
  updatedAt: string;
  message: string;
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

export type MyLikedFundingItem = {
  fundingId: number;
  title: string;
  thumbnailUrl: string | null;
  goalAmount: number;
  currentAmount: number;
  startDate?: string;
  endDate?: string;
  liked: boolean;
  likeCount: number;
};

type MyLikedFundingsResponse = {
  content: MyLikedFundingItem[];
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
  liked?: boolean;
  likeCount?: number;
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
  bottleSize?: string;
  volume?: number | string;
  alcoholContent?: string;
  alcoholPercentage?: number;
  liked?: boolean;
  likeCount?: number;
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
  likeCount?: number;
  liked?: boolean;
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
  optionId?: number;
  optionName: string;
  quantity: number;
  pricePerBottle?: number;
  shippingFee?: number;
  donationAmount?: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string | null;
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

function getFundingApiObject(response: unknown) {
  const data = getFundingResponseData<unknown>(response);
  return data && typeof data === 'object' ? data as Record<string, unknown> : {};
}

function getFundingApiArray<T>(response: unknown, keys: string[], fallback: T[] = []) {
  const data = getFundingResponseData<unknown>(response);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    return readFundingApiArray<T>(data as Record<string, unknown>, keys, fallback);
  }
  return fallback;
}

function getFundingApiNestedObject(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }
  return source;
}

function readFundingApiNumber(source: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function readFundingApiString(source: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readFundingApiArray<T>(source: Record<string, unknown>, keys: string[], fallback: T[] = []) {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed as T[];
      } catch {
        return fallback;
      }
    }
  }
  return fallback;
}

function readFundingApiStringArray(source: Record<string, unknown>, arrayKeys: string[], stringKeys: string[] = []) {
  const array = readFundingApiArray<string>(source, arrayKeys);
  if (array.length > 0) return array;
  const singleValue = readFundingApiString(source, stringKeys);
  return singleValue ? [singleValue] : [];
}

function getFundingNestedObject(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function normalizeFundingDraftListItem(source: Record<string, unknown>): FundingDraftListItem {
  return {
    draftId: readFundingApiNumber(source, ['draftId', 'draft_id']),
    breweryId: readFundingApiNumber(source, ['breweryId', 'brewery_id']),
    title: readFundingApiString(source, ['title']),
    shortTitle: readFundingApiString(source, ['shortTitle', 'short_title']),
    category: readFundingApiString(source, ['category']),
    status: readFundingApiString(source, ['status']),
    progressRate: readFundingApiNumber(source, ['progressRate', 'progress_rate']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at']),
    updatedAt: readFundingApiString(source, ['updatedAt', 'updated_at']),
  };
}

function normalizeFundingDraftResponse(response: unknown): FundingDraftResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    breweryId: readFundingApiNumber(data, ['breweryId', 'brewery_id']),
    status: readFundingApiString(data, ['status'], 'DRAFT'),
    progressRate: readFundingApiNumber(data, ['progressRate', 'progress_rate']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingDraftListResponse(response: unknown): FundingDraftListResponse {
  const data = getFundingApiObject(response);
  return {
    drafts: readFundingApiArray<Record<string, unknown>>(data, ['drafts']).map(normalizeFundingDraftListItem),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingDraftPreviewResponse(response: unknown): FundingDraftPreviewResponse {
  const data = getFundingApiObject(response);
  const basicInfo = getFundingNestedObject(data, 'basicInfo');
  const schedule = getFundingNestedObject(data, 'schedule');
  const legalInfo = getFundingNestedObject(data, 'legalInfo');
  const tasteProfile = getFundingNestedObject(data, 'tasteProfile');
  const plan = getFundingNestedObject(data, 'plan');
  const breweryInfo = getFundingNestedObject(data, 'breweryInfo');
  const notices = getFundingNestedObject(data, 'notices');

  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    status: readFundingApiString(data, ['status']),
    progressRate: readFundingApiNumber(data, ['progressRate', 'progress_rate']),
    basicInfo: {
      title: readFundingApiString(basicInfo, ['title']),
      shortTitle: readFundingApiString(basicInfo, ['shortTitle', 'short_title']),
      category: readFundingApiString(basicInfo, ['category']),
      mainIngredient: readFundingApiString(basicInfo, ['mainIngredient', 'main_ingredient']),
      subIngredients: readFundingApiArray<string>(basicInfo, ['subIngredients', 'sub_ingredients']),
      alcoholPercentage: readFundingApiNumber(basicInfo, ['alcoholPercentage', 'alcohol_percentage']) || undefined,
      summary: readFundingApiString(basicInfo, ['summary']),
      thumbnailUrl: readFundingApiString(basicInfo, ['thumbnailUrl', 'thumbnail_url']),
    },
    schedule: {
      pricePerBottle: readFundingApiNumber(schedule, ['pricePerBottle', 'price_per_bottle']) || undefined,
      totalQuantity: readFundingApiNumber(schedule, ['totalQuantity', 'total_quantity']) || undefined,
      targetAmount: readFundingApiNumber(schedule, ['targetAmount', 'target_amount']) || undefined,
      fundingStartDate: readFundingApiString(schedule, ['fundingStartDate', 'funding_start_date']),
      fundingPeriodDays: readFundingApiNumber(schedule, ['fundingPeriodDays', 'funding_period_days']) || undefined,
      fundingEndDate: readFundingApiString(schedule, ['fundingEndDate', 'funding_end_date']),
      expectedDeliveryDate: readFundingApiString(schedule, ['expectedDeliveryDate', 'expected_delivery_date']),
    },
    legalInfo: {
      productType: readFundingApiString(legalInfo, ['productType', 'product_type']),
      volume: readFundingApiNumber(legalInfo, ['volume']) || undefined,
      alcoholPercentage: readFundingApiNumber(legalInfo, ['alcoholPercentage', 'alcohol_percentage']) || undefined,
      rawMaterials: readFundingApiArray<{ name: string; origin: string }>(legalInfo, ['rawMaterials', 'raw_materials']),
    },
    tasteProfile: {
      sweetness: readFundingApiNumber(tasteProfile, ['sweetness']) || undefined,
      acidity: readFundingApiNumber(tasteProfile, ['acidity']) || undefined,
      body: readFundingApiNumber(tasteProfile, ['body']) || undefined,
      carbonation: readFundingApiNumber(tasteProfile, ['carbonation']) || undefined,
      alcoholIntensity: readFundingApiNumber(tasteProfile, ['alcoholIntensity', 'alcohol_intensity']) || undefined,
      flavorNotes: readFundingApiArray<string>(tasteProfile, ['flavorNotes', 'flavor_notes']),
    },
    plan: {
      introduction: readFundingApiString(plan, ['introduction']),
      budgetPlan: readFundingApiArray<{ category: string; amount: number }>(plan, ['budgetPlan', 'budget_plan']),
      schedulePlan: readFundingApiArray<{ step: string; description: string; date: string }>(plan, ['schedulePlan', 'schedule_plan']),
    },
    breweryInfo: {
      breweryName: readFundingApiString(breweryInfo, ['breweryName', 'brewery_name']),
      representativeName: readFundingApiString(breweryInfo, ['representativeName', 'representative_name']),
      businessRegistrationNumber: readFundingApiString(breweryInfo, ['businessRegistrationNumber', 'business_registration_number']),
      businessAddress: readFundingApiString(breweryInfo, ['businessAddress', 'business_address']),
      contactEmail: readFundingApiString(breweryInfo, ['contactEmail', 'contact_email']),
      contactPhone: readFundingApiString(breweryInfo, ['contactPhone', 'contact_phone']),
      bankName: readFundingApiString(breweryInfo, ['bankName', 'bank_name']),
      accountNumber: readFundingApiString(breweryInfo, ['accountNumber', 'account_number']),
      accountHolder: readFundingApiString(breweryInfo, ['accountHolder', 'account_holder']),
    },
    notices: {
      refundPolicy: readFundingApiString(notices, ['refundPolicy', 'refund_policy']),
      exchangePolicy: readFundingApiString(notices, ['exchangePolicy', 'exchange_policy']),
      adultVerificationNotice: readFundingApiString(notices, ['adultVerificationNotice', 'adult_verification_notice']),
      riskNotice: readFundingApiString(notices, ['riskNotice', 'risk_notice']),
    },
    documents: readFundingApiArray<Record<string, unknown>>(data, ['documents']).map((document) => ({
      documentId: readFundingApiNumber(document, ['documentId', 'document_id']),
      documentType: readFundingApiString(document, ['documentType', 'document_type']),
      fileName: readFundingApiString(document, ['fileName', 'file_name']),
      fileUrl: readFundingApiString(document, ['fileUrl', 'file_url']),
      createdAt: readFundingApiString(document, ['createdAt', 'created_at']),
    })),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeBreweryLogItem(source: Record<string, unknown>): FundingBreweryLogItem {
  return {
    logId: readFundingApiNumber(source, ['logId', 'log_id', 'breweryLogId', 'brewery_log_id', 'id']),
    step: readFundingApiString(source, ['step']),
    stage: readFundingApiString(source, ['stage']) as FundingBreweryLogStage | string,
    title: readFundingApiString(source, ['title']),
    content: readFundingApiString(source, ['content', 'body', 'description']),
    imageUrls: readFundingApiStringArray(source, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: Boolean(source.liked),
  };
}

function normalizeBreweryLogsResponse(response: unknown): FundingBreweryLogsResponse {
  const data = getFundingApiObject(response);
  const logs = getFundingApiArray<Record<string, unknown>>(response, ['logs', 'breweryLogs', 'brewery_logs', 'content', 'data']);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    logs: logs.map(normalizeBreweryLogItem),
  };
}

function normalizeBreweryLogMutationResponse(response: unknown): FundingBreweryLogMutationResponse {
  const responseData = getFundingApiObject(response);
  const data = getFundingApiNestedObject(responseData, ['log', 'breweryLog', 'brewery_log', 'data']);
  return {
    breweryLogId: readFundingApiNumber(data, ['breweryLogId', 'brewery_log_id', 'logId', 'log_id', 'id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    stage: readFundingApiString(data, ['stage']) as FundingBreweryLogStage | string,
    title: readFundingApiString(data, ['title']),
    content: readFundingApiString(data, ['content', 'body', 'description']),
    imageUrls: readFundingApiStringArray(data, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    message: readFundingApiString(responseData, ['message']) || readFundingApiString(data, ['message']),
  };
}

function normalizeFundingReviewItem(source: Record<string, unknown>): FundingReviewItem {
  return {
    reviewId: readFundingApiNumber(source, ['reviewId', 'review_id', 'id']),
    writerNickname: readFundingApiString(source, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']),
    rating: readFundingApiNumber(source, ['rating']),
    content: readFundingApiString(source, ['content', 'comment', 'reviewContent', 'review_content', 'body']),
    imageUrls: readFundingApiStringArray(source, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
  };
}

function normalizeFundingReviewsResponse(response: unknown): FundingReviewsResponse {
  const data = getFundingApiObject(response);
  const content = getFundingApiArray<Record<string, unknown>>(response, ['content', 'reviews', 'data']);
  return {
    content: content.map(normalizeFundingReviewItem),
    page: readFundingApiNumber(data, ['page']),
    size: readFundingApiNumber(data, ['size'], content.length),
    totalElements: readFundingApiNumber(data, ['totalElements', 'total_elements'], content.length),
    totalPages: readFundingApiNumber(data, ['totalPages', 'total_pages'], content.length > 0 ? 1 : 0),
  };
}

function normalizeCreateFundingReviewResponse(response: unknown): CreateFundingReviewResponse {
  const responseData = getFundingApiObject(response);
  const data = getFundingApiNestedObject(responseData, ['review', 'fundingReview', 'funding_review', 'data']);
  return {
    reviewId: readFundingApiNumber(data, ['reviewId', 'review_id', 'id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    rating: readFundingApiNumber(data, ['rating']),
    imageUrls: readFundingApiStringArray(data, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    message: readFundingApiString(responseData, ['message']) || readFundingApiString(data, ['message']),
  };
}

function normalizeFundingSectionResponse(response: unknown): FundingSectionResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    section: readFundingApiString(data, ['section']) || undefined,
    progressRate: readFundingApiNumber(data, ['progressRate', 'progress_rate']),
    message: readFundingApiString(data, ['message']),
    updatedAt: readFundingApiString(data, ['updatedAt', 'updated_at']) || undefined,
    status: readFundingApiString(data, ['status']) || undefined,
    targetAmount: readFundingApiNumber(data, ['targetAmount', 'target_amount']) || undefined,
    platformFeeRate: readFundingApiNumber(data, ['platformFeeRate', 'platform_fee_rate']) || undefined,
    platformFeeAmount: readFundingApiNumber(data, ['platformFeeAmount', 'platform_fee_amount']) || undefined,
  };
}

function normalizeFundingDraftSubmitResponse(response: unknown): FundingDraftSubmitResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    status: readFundingApiString(data, ['status'], 'SUBMITTED'),
    progressRate: readFundingApiNumber(data, ['progressRate', 'progress_rate']),
    submittedAt: readFundingApiString(data, ['submittedAt', 'submitted_at']) || undefined,
    updatedAt: readFundingApiString(data, ['updatedAt', 'updated_at']) || undefined,
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingOrderResponse(response: unknown): CreateFundingOrderResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiNumber(data, ['orderId', 'order_id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    optionId: readFundingApiNumber(data, ['optionId', 'option_id']),
    quantity: readFundingApiNumber(data, ['quantity']),
    totalAmount: readFundingApiNumber(data, ['totalAmount', 'total_amount']),
    orderStatus: readFundingApiString(data, ['orderStatus', 'order_status']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingPaymentResponse(response: unknown): RequestPaymentResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiNumber(data, ['orderId', 'order_id']),
    paymentId: readFundingApiNumber(data, ['paymentId', 'payment_id']),
    paymentStatus: readFundingApiString(data, ['paymentStatus', 'payment_status']),
    paymentUrl: readFundingApiString(data, ['paymentUrl', 'payment_url', 'checkoutUrl', 'checkout_url', 'redirectUrl', 'redirect_url']) || undefined,
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeConfirmTossPaymentResponse(response: unknown): ConfirmTossPaymentResponse {
  const data = getFundingApiObject(response);
  const payment = getFundingNestedObject(data, 'payment');
  const nestedPayment = getFundingNestedObject(payment, 'payment');
  const tossPayment = getFundingNestedObject(payment, 'tossPayment');
  return {
    orderId:
      readFundingApiNumber(data, ['orderId', 'order_id']) ||
      readFundingApiNumber(nestedPayment, ['orderId', 'order_id']) ||
      readFundingApiNumber(tossPayment, ['orderId', 'order_id']),
    paymentId:
      readFundingApiNumber(data, ['paymentId', 'payment_id']) ||
      readFundingApiNumber(nestedPayment, ['paymentId', 'payment_id']),
    paymentStatus:
      readFundingApiString(data, ['paymentStatus', 'payment_status']) ||
      readFundingApiString(nestedPayment, ['paymentStatus', 'payment_status']) ||
      readFundingApiString(tossPayment, ['status']),
    paidAmount:
      readFundingApiNumber(data, ['paidAmount', 'paid_amount', 'amount']) ||
      readFundingApiNumber(nestedPayment, ['paidAmount', 'paid_amount', 'amount']) ||
      readFundingApiNumber(tossPayment, ['totalAmount', 'total_amount', 'amount']),
    message: readFundingApiString(data, ['message']) || readFundingApiString(payment, ['message']),
  };
}

function normalizeFundingPaymentInfoResponse(response: unknown): FundingPaymentInfoResponse {
  const data = getFundingApiObject(response);
  return {
    paymentId: readFundingApiNumber(data, ['paymentId', 'payment_id']),
    orderId: readFundingApiNumber(data, ['orderId', 'order_id']),
    paymentMethod: readFundingApiString(data, ['paymentMethod', 'payment_method']),
    paymentProvider: readFundingApiString(data, ['paymentProvider', 'payment_provider']),
    paymentStatus: readFundingApiString(data, ['paymentStatus', 'payment_status']),
    amount: readFundingApiNumber(data, ['amount', 'totalAmount', 'total_amount']),
    approvedAt: readFundingApiString(data, ['approvedAt', 'approved_at']) || undefined,
    createdAt: readFundingApiString(data, ['createdAt', 'created_at']),
  };
}

function normalizeCompleteFundingPaymentResponse(response: unknown): CompleteFundingPaymentResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiNumber(data, ['orderId', 'order_id']),
    paymentId: readFundingApiNumber(data, ['paymentId', 'payment_id']),
    paymentStatus: readFundingApiString(data, ['paymentStatus', 'payment_status']),
    paidAmount: readFundingApiNumber(data, ['paidAmount', 'paid_amount', 'amount']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingLikeResponse(response: unknown): FundingLikeResponse {
  const data = getFundingApiObject(response);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    liked: Boolean(data.liked),
    likeCount: readFundingApiNumber(data, ['likeCount', 'like_count']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeMyLikedFundingItem(source: Record<string, unknown>): MyLikedFundingItem {
  return {
    fundingId: readFundingApiNumber(source, ['fundingId', 'funding_id']),
    title: readFundingApiString(source, ['title']),
    thumbnailUrl: readFundingApiString(source, ['thumbnailUrl', 'thumbnail_url']) || null,
    goalAmount: readFundingApiNumber(source, ['goalAmount', 'goal_amount']),
    currentAmount: readFundingApiNumber(source, ['currentAmount', 'current_amount']),
    startDate: readFundingApiString(source, ['startDate', 'start_date']) || undefined,
    endDate: readFundingApiString(source, ['endDate', 'end_date']) || undefined,
    liked: Boolean(source.liked),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count']),
  };
}

function normalizeFundingOrderDetailResponse(response: unknown): FundingOrderDetailResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiNumber(data, ['orderId', 'order_id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    fundingTitle: readFundingApiString(data, ['fundingTitle', 'funding_title']),
    optionName: readFundingApiString(data, ['optionName', 'option_name']),
    quantity: readFundingApiNumber(data, ['quantity']),
    totalAmount: readFundingApiNumber(data, ['totalAmount', 'total_amount']),
    orderStatus: readFundingApiString(data, ['orderStatus', 'order_status']),
    paymentStatus: readFundingApiString(data, ['paymentStatus', 'payment_status']),
    recipientName: readFundingApiString(data, ['recipientName', 'recipient_name']),
    recipientPhone: readFundingApiString(data, ['recipientPhone', 'recipient_phone']),
    shippingAddress: readFundingApiString(data, ['shippingAddress', 'shipping_address']),
    shippingDetailAddress: readFundingApiString(data, ['shippingDetailAddress', 'shipping_detail_address']),
    createdAt: readFundingApiString(data, ['createdAt', 'created_at']),
  };
}

function normalizeUpdateFundingProjectResponse(response: unknown): UpdateFundingProjectResponse {
  const data = getFundingApiObject(response);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    title: readFundingApiString(data, ['title']),
    description: readFundingApiString(data, ['description']),
    goalAmount: readFundingApiNumber(data, ['goalAmount', 'goal_amount']),
    currentAmount: readFundingApiNumber(data, ['currentAmount', 'current_amount']),
    startDate: readFundingApiString(data, ['startDate', 'start_date']),
    endDate: readFundingApiString(data, ['endDate', 'end_date']),
    pricePerBottle: readFundingApiNumber(data, ['pricePerBottle', 'price_per_bottle']),
    shippingFee: readFundingApiNumber(data, ['shippingFee', 'shipping_fee']),
    status: readFundingApiString(data, ['status']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeAdminApproveFundingDraftResponse(response: unknown): AdminApproveFundingDraftResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    title: readFundingApiString(data, ['title']),
    status: readFundingApiString(data, ['status']),
    createdAt: readFundingApiString(data, ['createdAt', 'created_at']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeAdminRejectFundingDraftResponse(response: unknown): AdminRejectFundingDraftResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    status: readFundingApiString(data, ['status']),
    rejectReason: readFundingApiString(data, ['rejectReason', 'reject_reason']),
    updatedAt: readFundingApiString(data, ['updatedAt', 'updated_at']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeBreweryId(value: unknown) {
  const breweryId = Number(value);
  return Number.isFinite(breweryId) && breweryId > 0 ? breweryId : 1;
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
    body: JSON.stringify({ ...payload, breweryId: normalizeBreweryId(payload.breweryId) }),
  });
}

export async function createFundingDraft(payload: FundingDraftPayload) {
  const result = await requestFundingJson<unknown>('/api/fundings/drafts', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ ...payload, breweryId: normalizeBreweryId(payload.breweryId) }),
  });
  return normalizeFundingDraftResponse(result);
}

export async function updateFundingDraft(draftId: number, payload: FundingDraftUpdatePayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function getFundingDraft(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}`, {
    auth: true,
  });
  const data = getFundingApiObject(result);
  return {
    draft: getFundingNestedObject(data, 'draft'),
    message: readFundingApiString(data, ['message']),
  };
}

export async function getFundingDraftList(breweryId: number) {
  const query = new URLSearchParams({ breweryId: String(normalizeBreweryId(breweryId)) });
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts?${query.toString()}`, {
    auth: true,
  });
  return normalizeFundingDraftListResponse(result);
}

export async function deleteFundingDraft(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}`, {
    method: 'DELETE',
    auth: true,
  });
  const data = getFundingApiObject(result);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    message: readFundingApiString(data, ['message']),
  } satisfies FundingDraftDeleteResponse;
}

export async function getFundingDraftPreview(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/preview`, {
    auth: true,
  });
  return normalizeFundingDraftPreviewResponse(result);
}

export async function saveFundingBasicInfo(draftId: number, payload: FundingBasicInfoPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/basic-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingSchedule(draftId: number, payload: FundingSchedulePayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/schedule`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingLegalInfo(draftId: number, payload: FundingLegalInfoPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/legal-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingTasteProfile(draftId: number, payload: FundingTasteProfilePayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/taste-profile`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingPlan(draftId: number, payload: FundingPlanPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/plan`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingBreweryInfo(draftId: number, payload: FundingBreweryInfoPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/brewery-info`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function saveFundingNotices(draftId: number, payload: FundingNoticesPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/notices`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingSectionResponse(result);
}

export async function submitFundingDraft(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/submit`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingDraftSubmitResponse(result);
}

export async function updateFundingProjectApi(fundingId: number, payload: UpdateFundingProjectPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeUpdateFundingProjectResponse(result);
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

  const result = await requestFundingForm<unknown>(`/api/fundings/${fundingId}/brewery-logs`, formData, {
    method: 'POST',
    auth: true,
  });
  return normalizeBreweryLogMutationResponse(result);
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

  const result = await requestFundingForm<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}`, formData, {
    method: 'PATCH',
    auth: true,
  });
  return normalizeBreweryLogMutationResponse(result);
}

export async function deleteBreweryLog(fundingId: number, breweryLogId: number) {
  return requestFundingJson<FundingBreweryLogDeleteResponse>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function createFundingOrder(fundingId: number, payload: CreateFundingOrderPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/orders`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingOrderResponse(result);
}

export async function requestFundingPayment(orderId: number, payload: RequestPaymentPayload) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}/payment`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingPaymentResponse(result);
}

export async function confirmTossPayment(payload: ConfirmTossPaymentPayload) {
  const result = await requestFundingJson<unknown>('/api/payments/toss/confirm', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      paymentKey: payload.paymentKey,
      orderId: String(payload.orderId),
      amount: payload.amount,
    }),
  });
  return normalizeConfirmTossPaymentResponse(result);
}

export async function getFundingPaymentInfo(orderId: number) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}/payment`, {
    auth: true,
  });
  return normalizeFundingPaymentInfoResponse(result);
}

export async function completeFundingPayment(orderId: number) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}/payment/complete`, {
    method: 'PATCH',
    auth: true,
  });
  return normalizeCompleteFundingPaymentResponse(result);
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
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs`);
  return normalizeBreweryLogsResponse(result);
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
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews?${query.toString()}`);
  return normalizeFundingReviewsResponse(result);
}

export async function createFundingReview(fundingId: number, payload: CreateFundingReviewPayload) {
  const formData = new FormData();
  formData.append('rating', String(payload.rating));
  formData.append('content', payload.content);
  appendFundingFormFiles(formData, 'images', payload.images);

  const result = await requestFundingForm<unknown>(`/api/fundings/${fundingId}/reviews`, formData, {
    method: 'POST',
    auth: true,
  });
  return normalizeCreateFundingReviewResponse(result);
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
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}`, {
    auth: true,
  });
  return normalizeFundingOrderDetailResponse(result);
}

export async function createFundingInquiry(fundingId: number, payload: CreateFundingInquiryPayload) {
  return requestFundingJson<CreateFundingInquiryResponse>(`/api/fundings/${fundingId}/inquiries`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function likeFundingProject(fundingId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingLikeResponse(result);
}

export async function unlikeFundingProject(fundingId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingLikeResponse(result);
}

export async function getMyLikedFundings() {
  const result = await requestFundingJson<unknown>('/api/users/me/liked-fundings', {
    auth: true,
  });
  const data = getFundingApiObject(result);
  return {
    content: readFundingApiArray<Record<string, unknown>>(data, ['content']).map(normalizeMyLikedFundingItem),
  } satisfies MyLikedFundingsResponse;
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

export async function getAdminFundingDrafts(status: AdminFundingDraftStatus = 'SUBMITTED') {
  const query = new URLSearchParams({ status });
  const result = await requestFundingJson<unknown>(`/api/admin/fundings/drafts?${query.toString()}`, {
    auth: true,
  });
  return normalizeFundingDraftListResponse(result) as AdminFundingDraftListResponse;
}

export async function approveAdminFundingDraft(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/admin/fundings/drafts/${draftId}/approve`, {
    method: 'PATCH',
    auth: true,
  });
  return normalizeAdminApproveFundingDraftResponse(result);
}

export async function rejectAdminFundingDraft(draftId: number, rejectReason: string) {
  const result = await requestFundingJson<unknown>(`/api/admin/fundings/drafts/${draftId}/reject`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ rejectReason }),
  });
  return normalizeAdminRejectFundingDraftResponse(result);
}
