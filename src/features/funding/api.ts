import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

export const JUDAM_FUNDING_API_BASE_URL = 'http://43.202.24.223:3000';

type FundingApiErrorBody = {
  status?: number;
  message?: string;
};

type FundingApiEnvelope<T> = FundingApiErrorBody & {
  data?: T;
};

type FundingRawMaterialResponse = {
  name?: string;
  ingredient?: string;
  mainIngredient?: string;
  main_ingredient?: string;
  rawMaterial?: string;
  raw_material?: string;
  materialName?: string;
  material_name?: string;
  origin?: string;
  originName?: string;
  origin_name?: string;
  countryOfOrigin?: string;
  country_of_origin?: string;
  productionArea?: string;
  production_area?: string;
};

type FundingRawMaterialPayload = FundingRawMaterialResponse & {
  name: string;
  origin: string;
};

type FundingAgreementPayload = {
  breweryId: number;
  isAdultConfirmed: boolean;
  isContactInfoAgreed: boolean;
  isSettlementInfoAgreed: boolean;
  isFeePolicyAgreed: boolean;
  isResponsibilityAgreed: boolean;
  isLicenseAgreed?: boolean;
  isIpPolicyAgreed?: boolean;
  isRecipeLicenseAgreed?: boolean;
  allRequiredTermsAgreed?: boolean;
};

type FundingAgreementResponse = {
  draftId?: number;
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
  fundingId?: number;
  recipeId?: number;
  status: 'SUBMITTED' | string;
  fundingStatus?: string;
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

export type AdminFundingDraft = {
  draftId: number;
  fundingId?: number;
  breweryId?: number;
  title: string;
  breweryName: string;
  status: string;
  progressRate?: number;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  summary?: string;
  category?: string;
  mainIngredient?: string;
  targetAmount?: number;
  pricePerBottle?: number;
  totalQuantity?: number;
  thumbnailUrl?: string | null;
  imageUrls?: string[];
  raw?: Record<string, unknown>;
};

type FundingDraftListResponse = {
  drafts: FundingDraftListItem[];
  message: string;
};

export type FundingDraftPreviewResponse = {
  draftId: number;
  fundingId?: number;
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
    imageUrls?: string[];
    allImageUrls?: string[];
    images?: string[];
    tags?: string[];
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
    mainIngredient?: string;
    primaryIngredient?: string;
    subIngredient?: string;
    subIngredients?: string[];
    ingredients?: unknown[];
    rawMaterials?: { name: string; origin: string }[];
  };
  tasteProfile?: {
    sweetness?: number;
    acidity?: number;
    body?: number;
    carbonation?: number;
    alcohol?: number;
    alcoholIntensity?: number;
    aromaIntensity?: number;
    finish?: number;
    aftertaste?: number;
    flavor?: string[];
    flavorNotes?: string[];
  };
  plan?: {
    introduction?: string;
    videoUrl?: string;
    budgetPlan?: { category: string; amount: number }[] | string;
    schedulePlan?: { step: string; description: string; date: string }[] | string;
    budgetPlanGuide?: string;
    schedulePlanGuide?: string;
    policy?: string;
  };
  breweryInfo?: {
    breweryName?: string;
    creatorName?: string;
    profileImageUrl?: string;
    creatorIntroduction?: string;
    representativeName?: string;
  businessRegistrationNumber?: string;
  businessAddress?: string;
  breweryAddress?: string;
  breweryLocation?: string;
  businessAddressDetail?: string;
  contactEmail?: string;
  contactPhone?: string;
  bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
    businessType?: string;
    businessName?: string;
    businessCategory?: string;
    businessItem?: string;
    taxEmail?: string;
    phoneVerified?: boolean;
  accountVerified?: boolean;
  identityDocumentUrl?: string;
  businessRegistrationFileUrl?: string;
  businessLicense?: string;
  businessLicenseUrl?: string;
  missingFields?: string[];
  };
  notices?: {
    policy?: string;
    refundPolicy?: string;
    exchangePolicy?: string;
    adultVerificationNotice?: string;
    riskNotice?: string;
  };
  documents?: {
    documentId: number;
    draftId: number;
    documentType: string;
    fileName: string;
    fileUrl: string;
    createdAt: string;
  }[];
  images?: string[];
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
  imageUrls?: string[];
  tags?: string[];
};

export type FundingDraftAiImagePayload = {
  name?: string;
  description?: string;
  flavorTags?: string[];
  region?: string;
};

export type FundingDraftAiImageResponse = {
  imageUrl: string;
  thumbnailUrl: string;
  images: string[];
  promptUsed: string;
  modelUsed: string;
  status: string;
  message: string;
};

type FundingSchedulePayload = {
  pricePerBottle: number;
  totalQuantity: number;
  fundingStartDate: string;
  fundingPeriodDays: number;
  fundingEndDate?: string;
  expectedDeliveryDate: string;
};

type FundingLegalInfoPayload = {
  productType: string;
  volume: number;
  alcoholPercentage: number;
  rawMaterials: FundingRawMaterialPayload[];
};

type FundingTasteProfilePayload = {
  sweetness: number;
  acidity: number;
  body: number;
  carbonation: number;
  alcoholIntensity: number;
  aromaIntensity?: number;
  finish?: number;
  aftertaste?: number;
  alcohol?: number;
};

type FundingPlanPayload = {
  introduction: string;
  videoUrl?: string;
  budgetPlan?: { category: string; amount: number }[] | string | null;
  schedulePlan?: { step: string; description: string; date: string }[] | string | null;
  policy?: string;
};

type FundingBreweryInfoPayload = {
  breweryName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  businessAddress: string;
  businessAddressDetail?: string;
  contactEmail: string;
  contactPhone: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  businessType?: string;
  businessName?: string;
  businessCategory?: string;
  businessItem?: string;
  creatorIntroduction?: string;
  phoneVerified?: boolean;
  accountVerified?: boolean;
};

type VerifyBreweryAccountPayload = {
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
};

type VerifyBreweryAccountResponse = {
  verified: boolean;
  bankName?: string;
  accountNumber: string;
  accountHolder?: string;
  message?: string;
};

type FundingNoticesPayload = {
  policy?: string;
  refundPolicy: string;
  exchangePolicy: string;
  adultVerificationNotice: string;
  riskNotice: string;
};

type FundingDraftUpdatePayload = FundingBasicInfoPayload & {
  basicInfo?: FundingBasicInfoPayload;
  schedule?: Partial<FundingSchedulePayload> & {
    targetAmount?: number;
    goalAmount?: number;
    shippingFee?: number;
  };
  legalInfo?: Partial<FundingLegalInfoPayload> & {
    businessRegistrationNumber?: string;
    businessAddress?: string;
    businessAddressDetail?: string;
  };
  tasteProfile?: Partial<FundingTasteProfilePayload> & {
    flavor?: string[];
    flavorNotes?: string[];
    flavorTags?: string[];
  };
  plan?: Partial<FundingPlanPayload> & {
    projectPolicy?: string;
  };
  breweryInfo?: Partial<FundingBreweryInfoPayload> & {
    creatorName?: string;
    businessAddressDetail?: string;
    businessRegistrationFileUrl?: string;
    businessLicenseUrl?: string;
  };
  notices?: FundingNoticesPayload;
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
  status?: 'READY' | 'REVIEWING' | 'ONGOING' | 'ACTIVE' | 'ENDED' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'CANCELLED' | 'REJECTED' | 'REJECT' | 'DENIED';
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
  | 'idCard'
  | 'businessLicense'
  | 'salesPermit'
  | 'alcoholPermit'
  | 'manufacturingLicense'
  | 'ID_CARD'
  | 'BUSINESS_LICENSE'
  | 'SALES_PERMIT'
  | 'ALCOHOL_PERMIT'
  | 'MANUFACTURING_LICENSE'
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

export type FundingDraftFileType =
  | 'PROJECT_IMAGE'
  | 'FUNDING_IMAGE'
  | 'PROFILE_IMAGE'
  | 'IDENTITY_DOCUMENT'
  | 'BUSINESS_REGISTRATION';

type FundingDocumentUploadResponse = {
  draftId: number;
  documentId: number;
  documentType: FundingDocumentType;
  fileName: string;
  fileUrl: string;
  message: string;
};

type FundingDraftFileUploadResponse = {
  draftId: number;
  fileId?: number;
  fileType: FundingDraftFileType | string;
  fileName: string;
  fileUrl: string;
  message: string;
};

export type FundingBreweryLogStage =
  | 'INGREDIENT'
  | 'PROCESSING'
  | 'FERMENTATION'
  | 'FILTERING'
  | 'AGING'
  | 'BOTTLING'
  | 'SHIPPING';

type FundingBreweryLogMutationPayload = {
  stage?: FundingBreweryLogStage;
  title?: string;
  content?: string;
  videoUrl?: string;
  images?: FundingUploadFile[];
  deleteImageUrls?: string[];
};

type FundingBreweryLogMutationResponse = {
  breweryLogId: number;
  fundingId: number;
  stage: FundingBreweryLogStage | string;
  title: string;
  content?: string;
  videoUrl?: string | null;
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
  | 'ETC'
  | '허위 정보'
  | '부적절한 내용'
  | '저작권 침해'
  | '사기 의심'
  | '기타';

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

const FUNDING_REPORT_REASON_LABELS: Record<string, string> = {
  FALSE_INFORMATION: '허위 정보',
  INAPPROPRIATE_CONTENT: '부적절한 내용',
  COPYRIGHT: '저작권 침해',
  FRAUD: '사기 의심',
  ETC: '기타',
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
  optionId?: number;
  option_id?: number;
  quantity: number;
  supporterPhone?: string;
  supporter_phone?: string;
  supporterEmail?: string;
  supporter_email?: string;
  recipientName: string;
  recipient_name?: string;
  recipientPhone: string;
  recipient_phone?: string;
  shippingAddress: string;
  shipping_address?: string;
  shippingDetailAddress?: string;
  shipping_detail_address?: string;
  postalCode?: string;
  postal_code?: string;
  additionalSupportAmount?: number;
  additional_support_amount?: number;
  message?: string;
  supportMessage?: string;
  support_message?: string;
  adultVerified: boolean;
  adult_verified?: boolean;
  privacyAgreed?: boolean;
  privacy_agreed?: boolean;
  privacyThirdPartyAgreed?: boolean;
  privacy_third_party_agreed?: boolean;
  thirdPartyAgreed?: boolean;
  termsAgreed?: boolean;
  terms_agreed?: boolean;
  noticeAgreed: boolean;
  notice_agreed?: boolean;
  refundPolicyAgreed?: boolean;
  refund_policy_agreed?: boolean;
};

type CreateFundingOrderResponse = {
  orderId: string | number;
  numericOrderId?: number;
  fundingId: number;
  optionId: number;
  quantity: number;
  amount: number;
  totalAmount: number;
  orderName?: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
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
  orderId: string | number;
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
  status?: number;
  orderId: string | number;
  paymentId: number;
  paymentStatus: string;
  paidAmount: number;
  message: string;
};

type FundingPaymentInfoResponse = {
  paymentId: number;
  orderId: string | number;
  paymentMethod: string;
  paymentProvider: string;
  paymentStatus: string;
  amount: number;
  approvedAt?: string;
  createdAt: string;
};

type CompleteFundingPaymentResponse = {
  orderId: string | number;
  paymentId: number;
  paymentStatus: string;
  paidAmount: number;
  message: string;
};

type AdminFundingDraftStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

type AdminFundingDraftListResponse = {
  drafts: AdminFundingDraft[];
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
  content?: string;
  detailReview?: string;
  mood?: string;
  pairing?: string;
  tags?: string[];
  recordVisibility?: boolean;
  imageUrls?: string[];
  images?: FundingUploadFile[];
};

type CreateFundingReviewResponse = {
  reviewId: number;
  fundingId: number;
  rating: number;
  imageUrls: string[];
  message: string;
};

type UpdateFundingReviewPayload = {
  rating: number;
  content?: string;
  detailReview?: string;
  mood?: string;
  pairing?: string;
  tags?: string[];
  recordVisibility?: boolean;
  imageUrls?: string[];
  images?: FundingUploadFile[];
  deleteImageUrls?: string[];
};

export type FundingLikeResponse = {
  fundingId: number;
  liked: boolean;
  likeCount: number;
  message: string;
};

type FundingQuestionLikeResponse = {
  fundingId: number;
  questionId: number;
  liked: boolean;
  likeCount: number;
  message: string;
};

type FundingEntityLikeResponse = {
  fundingId: number;
  breweryLogId?: number;
  questionId?: number;
  reviewId?: number;
  commentId?: number;
  replyId?: number;
  liked: boolean;
  likeCount: number;
  message: string;
};

type DeleteFundingReviewResponse = {
  reviewId: number;
  deleted: boolean;
  message: string;
};

type FundingReviewPermission = {
  canWriteReview: boolean;
  canReview: boolean;
};

export type FundingStatsResponse = {
  participationAvailableFunding: number;
  totalSupporterCount: number;
  successfulProjectCount: number;
  totalRaisedAmount: number;
  totalRaisedHundredMillion: number;
  totalRaisedTenMillion: number;
  totalRaisedTenMillionUnit: string;
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

export type FundingListStatus =
  | 'READY'
  | 'REVIEWING'
  | 'UPCOMING'
  | 'ONGOING'
  | 'ACTIVE'
  | 'ENDED'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'REJECT'
  | 'DENIED';
export type FundingListSort = 'POPULAR' | 'LATEST' | 'DEADLINE' | 'RECOMMENDED';

export type FundingListItem = {
  fundingId: number;
  title: string;
  description?: string;
  recipeTitle?: string;
  thumbnailUrl: string | null;
  imageUrls?: string[];
  allImageUrls?: string[];
  images?: unknown;
  mainIngredient?: string;
  primaryIngredient?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  subIngredient?: string;
  subIngredients?: string[];
  breweryName: string;
  isMine?: boolean;
  is_mine?: boolean;
  breweryUserId?: number | string;
  brewery_user_id?: number | string;
  ownerUserId?: number | string;
  owner_user_id?: number | string;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  supporterCount?: number | null;
  status: FundingListStatus | string;
  startDate?: string;
  endDate: string;
  liked?: boolean;
  likeCount?: number;
  sulbtiMatchScore?: number | null;
  matchScore?: number | null;
  tasteMatchScore?: number | null;
  matchRate?: number | null;
  matchPercent?: number | null;
  recommendationScore?: number | null;
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
  imageUrls?: string[];
  allImageUrls?: string[];
  images?: unknown;
  breweryName: string;
  category?: string;
  shortTitle?: string;
  mainIngredient?: string;
  primaryIngredient?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  subIngredient?: string;
  subIngredients?: string[];
  businessAddress?: string;
  breweryAddress?: string;
  breweryLocation?: string;
  isMine?: boolean;
  is_mine?: boolean;
  breweryUserId?: number | string;
  brewery_user_id?: number | string;
  ownerUserId?: number | string;
  owner_user_id?: number | string;
  status: FundingListStatus | string;
  currentAmount: number;
  targetAmount: number;
  achievementRate: number;
  description?: string;
  supporterCount?: number | null;
  startDate: string;
  endDate: string;
  expectedDeliveryDate?: string;
  pricePerBottle?: number;
  totalQuantity?: number;
  shippingFee?: number;
  bottleSize?: string;
  volume?: number | string;
  alcoholContent?: string;
  alcoholPercentage?: number;
  liked?: boolean;
  likeCount?: number;
  sulbtiMatchScore?: number | null;
  matchScore?: number | null;
  tasteMatchScore?: number | null;
  matchRate?: number | null;
  legalInfo?: FundingDraftPreviewResponse['legalInfo'];
  plan?: FundingDraftPreviewResponse['plan'];
  breweryInfo?: FundingDraftPreviewResponse['breweryInfo'];
  notices?: FundingDraftPreviewResponse['notices'];
  documents?: FundingDraftPreviewResponse['documents'];
  ingredients?: unknown[];
  tasteProfile?: {
    sweetness: number;
    acidity: number;
    body: number;
    carbonation: number;
    alcohol?: number;
    alcoholIntensity: number;
    aromaIntensity?: number;
    finish?: number;
    aftertaste?: number;
    flavor?: string[];
    flavorNotes?: string[];
  };
  supportOptions?: FundingSupportOption[];
};

export type FundingIntroResponse = {
  fundingId: number;
  title: string;
  introduction: string;
  story: string;
  mainIngredient?: string;
  primaryIngredient?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  subIngredient?: string;
  subIngredients?: string[];
  budgetPlan?: string;
  projectBudget?: string;
  schedulePlan?: string;
  projectSchedule?: string;
  policy?: string;
  projectPolicy?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  imageUrls?: string[];
  allImageUrls?: string[];
  images?: unknown;
};

export type FundingBreweryLogItem = {
  logId: number;
  step?: string;
  stage?: FundingBreweryLogStage | string;
  title: string;
  content: string;
  videoUrl?: string;
  imageUrls: string[];
  createdAt: string;
  likeCount?: number;
  liked?: boolean;
};

export type FundingBreweryLogsResponse = {
  fundingId: number;
  logs: FundingBreweryLogItem[];
};

export type FundingBreweryLogReplyItem = {
  replyId: number;
  writerId?: number | string;
  writerNickname?: string;
  writerProfileImage?: string | null;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  createdAt: string;
  likeCount?: number;
  liked?: boolean;
};

export type FundingBreweryLogCommentItem = {
  commentId: number;
  writerId?: number | string;
  writerNickname?: string;
  writerProfileImage?: string | null;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  createdAt: string;
  likeCount?: number;
  liked?: boolean;
  replies?: FundingBreweryLogReplyItem[];
};

type FundingBreweryLogCommentsResponse = {
  content: FundingBreweryLogCommentItem[];
};

export type FundingQuestionItem = {
  questionId: number;
  writerId?: number | string;
  writerNickname: string;
  writerProfileImage?: string | null;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  title: string;
  content: string;
  answered: boolean;
  createdAt: string;
  likeCount?: number;
  liked?: boolean;
  replies?: FundingQuestionReplyItem[];
};

export type FundingQuestionReplyItem = {
  replyId: number;
  writerId?: number | string;
  writerNickname?: string;
  writerProfileImage?: string | null;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  createdAt: string;
  likeCount?: number;
  liked?: boolean;
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
  fundingId?: number;
  writerId?: number | string;
  writerNickname: string;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  rating: number;
  content: string;
  imageUrls: string[];
  createdAt: string;
  mood?: string;
  pairing?: string;
  tags?: string[];
  recordVisibility?: boolean;
  showRecord?: boolean;
  likeCount?: number;
  liked?: boolean;
  canWriteReview?: boolean;
  canReview?: boolean;
};

export type FundingReviewCommentItem = {
  commentId: number;
  fundingId?: number;
  reviewId?: number;
  writerId?: number | string;
  writerNickname: string;
  writerProfileImage?: string | null;
  writerRole?: string;
  isBrewery?: boolean;
  writerIsBrewery?: boolean;
  showBreweryBadge?: boolean | null;
  isProjectOwner?: boolean | null;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

export type FundingReviewsResponse = {
  content: FundingReviewItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  canWriteReview: boolean;
  canReview: boolean;
  message?: string;
};

export type FundingReviewCommentsResponse = {
  content: FundingReviewCommentItem[];
  message?: string;
};

export type FundingSupportOption = {
  optionId: number | string;
  name: string;
  price: number;
  description: string;
  volume?: string | number;
  alcohol?: string | number;
  alcoholPercentage?: string | number;
  expectedDeliveryDate?: string | null;
  mainIngredient?: string;
  primaryIngredient?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  subIngredient?: string;
  subIngredients?: string[];
  ingredients?: unknown[];
  stock?: number;
  remainingStock?: number;
  maxPerUser?: number;
};

export type FundingSupportOptionsResponse = {
  fundingId: number;
  expectedDeliveryDate?: string | null;
  volume?: string | number | null;
  alcoholPercentage?: string | number | null;
  mainIngredient?: string;
  primaryIngredient?: string;
  mainIngredientLabel?: string;
  primaryIngredientLabel?: string;
  subIngredient?: string;
  subIngredients?: string[];
  ingredients?: unknown[];
  supportOptions: FundingSupportOption[];
};

type FundingSupportOptionsApiResponse = FundingSupportOptionsResponse | FundingApiEnvelope<FundingSupportOptionsResponse>;

type FundingDetailApiResponse = FundingDetailResponse | FundingApiEnvelope<FundingDetailResponse>;

export type FundingOrderDetailResponse = {
  orderId: string | number;
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

export type RecentShippingAddressResponse = {
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  shippingDetailAddress?: string;
  postalCode?: string;
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

export async function getFundingAccessToken() {
  return getAuthAccessToken();
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

function getFundingApiRawObject(response: unknown) {
  return response && typeof response === 'object' && !Array.isArray(response)
    ? response as Record<string, unknown>
    : {};
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

function readFundingApiOptionalNumber(source: Record<string, unknown>, keys: string[]) {
  const value = readFundingApiNumber(source, keys, Number.NaN);
  return Number.isFinite(value) ? value : undefined;
}

function readFundingApiString(source: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function readFundingOptionalString(source: Record<string, unknown>, keys: string[]) {
  const value = readFundingApiString(source, keys);
  return value.trim();
}

function normalizeFundingRawMaterials(items: FundingRawMaterialResponse[]) {
  return items
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({
      name: readFundingOptionalString(item as Record<string, unknown>, [
        'name',
        'ingredient',
        'mainIngredient',
        'main_ingredient',
        'rawMaterial',
        'raw_material',
        'materialName',
        'material_name',
      ]),
      origin: readFundingOptionalString(item as Record<string, unknown>, [
        'origin',
        'originName',
        'origin_name',
        'countryOfOrigin',
        'country_of_origin',
        'productionArea',
        'production_area',
      ]),
    }))
    .filter((item) => item.name || item.origin);
}

function readFundingApiBoolean(source: Record<string, unknown>, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value > 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    }
  }
  return fallback;
}

function readFundingReviewPermission(...sources: Record<string, unknown>[]): FundingReviewPermission {
  const source = Object.assign({}, ...sources);
  const canWriteReview = readFundingApiBoolean(source, ['canWriteReview', 'can_write_review']);
  const canReview = readFundingApiBoolean(source, ['canReview', 'can_review'], canWriteReview);
  return {
    canWriteReview,
    canReview,
  };
}

function readFundingWriterBadgeFields(source: Record<string, unknown>) {
  const writerRole = readFundingApiString(source, ['writerRole', 'writer_role', 'userRole', 'user_role', 'role']);
  const writerIsBrewery = readFundingApiBoolean(source, ['writerIsBrewery', 'writer_is_brewery']);
  const isBrewery =
    readFundingApiBoolean(source, ['isBrewery', 'is_brewery']) ||
    writerIsBrewery ||
    writerRole.toUpperCase().includes('BREWERY');
  return {
    writerRole: writerRole || undefined,
    isBrewery,
    writerIsBrewery,
    showBreweryBadge: readFundingApiBoolean(source, ['showBreweryBadge', 'show_brewery_badge']),
    isProjectOwner: readFundingApiBoolean(source, ['isProjectOwner', 'is_project_owner']),
  };
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

function normalizeFundingApiImageUrl(imageUrl?: unknown): string {
  if (Array.isArray(imageUrl)) {
    return normalizeFundingApiImageUrl(imageUrl[0]);
  }
  if (imageUrl && typeof imageUrl === 'object') {
    const image = imageUrl as Record<string, unknown>;
    return normalizeFundingApiImageUrl(
      image.imageUrl ??
      image.image_url ??
      image.url ??
      image.fileUrl ??
      image.file_url ??
      image.thumbnailUrl ??
      image.thumbnail_url
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

function coerceFundingApiImageUrls(imageUrls: unknown): string[] {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) {
    return imageUrls.flatMap(coerceFundingApiImageUrls);
  }
  if (imageUrls && typeof imageUrls === 'object') {
    const image = imageUrls as Record<string, unknown>;
    return coerceFundingApiImageUrls(
      image.imageUrl ??
      image.image_url ??
      image.url ??
      image.fileUrl ??
      image.file_url ??
      image.thumbnailUrl ??
      image.thumbnail_url
    );
  }
  if (typeof imageUrls !== 'string') return [];

  const trimmed = imageUrls.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return coerceFundingApiImageUrls(JSON.parse(trimmed));
    } catch {
      return [trimmed];
    }
  }
  return [trimmed];
}

function normalizeFundingApiImageUrls(imageUrls?: unknown) {
  return Array.from(new Set(coerceFundingApiImageUrls(imageUrls).map(normalizeFundingApiImageUrl).filter(Boolean)));
}

function normalizeAdminFundingDraftItem(value: unknown): AdminFundingDraft | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const basicInfo = getFundingApiNestedObject(source, ['basicInfo', 'basic_info']);
  const schedule = getFundingApiNestedObject(source, ['schedule']);
  const breweryInfo = getFundingApiNestedObject(source, ['breweryInfo', 'brewery_info']);
  const draftId = readFundingApiNumber(source, ['draftId', 'draft_id', 'id'], 0);
  if (!draftId) return null;

  const title =
    readFundingApiString(source, ['title']) ||
    readFundingApiString(basicInfo, ['title', 'projectTitle', 'project_title']);
  const imageUrls = normalizeFundingApiImageUrls(
    readFundingApiArray<string>(source, ['imageUrls', 'image_urls', 'images'])
      .concat(readFundingApiArray<string>(basicInfo, ['imageUrls', 'image_urls', 'images']))
  ).slice(0, 5);

  return {
    draftId,
    fundingId: readFundingApiOptionalNumber(source, ['fundingId', 'funding_id']),
    breweryId: readFundingApiOptionalNumber(source, ['breweryId', 'brewery_id']),
    title: title || `Draft #${draftId}`,
    breweryName:
      readFundingApiString(source, ['breweryName', 'brewery_name']) ||
      readFundingApiString(breweryInfo, ['breweryName', 'brewery_name']) ||
      '양조장 정보 없음',
    status: readFundingApiString(source, ['status', 'draftStatus', 'draft_status'], 'UNKNOWN'),
    progressRate: readFundingApiOptionalNumber(source, ['progressRate', 'progress_rate']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at']),
    updatedAt: readFundingApiString(source, ['updatedAt', 'updated_at']),
    submittedAt: readFundingApiString(source, ['submittedAt', 'submitted_at']),
    summary:
      readFundingApiString(source, ['summary', 'description']) ||
      readFundingApiString(basicInfo, ['summary', 'description']),
    category:
      readFundingApiString(source, ['category']) ||
      readFundingApiString(basicInfo, ['category']),
    mainIngredient:
      readFundingApiString(source, ['mainIngredient', 'primaryIngredient', 'main_ingredient', 'primary_ingredient']) ||
      readFundingApiString(basicInfo, ['mainIngredient', 'primaryIngredient', 'main_ingredient', 'primary_ingredient']),
    targetAmount:
      readFundingApiOptionalNumber(source, ['targetAmount', 'target_amount']) ??
      readFundingApiOptionalNumber(schedule, ['targetAmount', 'target_amount']),
    pricePerBottle:
      readFundingApiOptionalNumber(source, ['pricePerBottle', 'price_per_bottle']) ??
      readFundingApiOptionalNumber(schedule, ['pricePerBottle', 'price_per_bottle']),
    totalQuantity:
      readFundingApiOptionalNumber(source, ['totalQuantity', 'total_quantity']) ??
      readFundingApiOptionalNumber(schedule, ['totalQuantity', 'total_quantity']),
    thumbnailUrl:
      normalizeFundingApiImageUrl(readFundingApiString(source, ['thumbnailUrl', 'thumbnail_url'])) ||
      normalizeFundingApiImageUrl(readFundingApiString(basicInfo, ['thumbnailUrl', 'thumbnail_url'])) ||
      imageUrls[0] ||
      null,
    imageUrls,
    raw: source,
  };
}

function normalizeAdminFundingDraftsResponse(response: unknown) {
  const raw = getFundingApiRawObject(response);
  const data = getFundingResponseData<unknown>(response);
  const dataObject = data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : {};
  const candidates = [
    Array.isArray(data) ? data : null,
    readFundingApiArray<unknown>(dataObject, ['drafts', 'content', 'items', 'fundings']),
    readFundingApiArray<unknown>(raw, ['drafts', 'content', 'items', 'fundings']),
  ];
  const items = candidates.find((candidate): candidate is unknown[] => Array.isArray(candidate) && candidate.length > 0) || [];
  return items
    .map(normalizeAdminFundingDraftItem)
    .filter((item): item is AdminFundingDraft => Boolean(item));
}

function readFundingApiUrlArray(source: Record<string, unknown>, arrayKeys: string[], stringKeys: string[] = []) {
  const urls: string[] = [];
  const collect = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return;
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          collect(JSON.parse(trimmed));
          return;
        } catch {
          // Fall through and treat it as a plain URL-ish string.
        }
      }
      urls.push(trimmed);
      return;
    }
    if (value && typeof value === 'object') {
      const objectValue = value as Record<string, unknown>;
      const url = readFundingApiString(objectValue, ['url', 'imageUrl', 'image_url', 'fileUrl', 'file_url', 'thumbnailUrl', 'thumbnail_url']);
      if (url) urls.push(url);
    }
  };

  arrayKeys.forEach((key) => collect(source[key]));
  stringKeys.forEach((key) => collect(source[key]));
  return Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
}

function readFundingApiArrayOrString<T>(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value as T[];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return '';
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed as T[];
      } catch {
        return value;
      }
      return value;
    }
  }
  return [];
}

function readFundingApiNullableString(source: Record<string, unknown>, keys: string[]) {
  const value = readFundingApiString(source, keys);
  return value || null;
}

function getFundingNestedObject(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function getFundingPreviewNestedObject(primary: Record<string, unknown>, fallback: Record<string, unknown>, keys: string[]) {
  for (const source of [primary, fallback]) {
    for (const key of keys) {
      const value = source[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
    }
  }
  return {};
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

function normalizeFundingAgreementResponse(response: unknown): FundingAgreementResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']) || undefined,
    agreementId: readFundingApiNumber(data, ['agreementId', 'agreement_id']),
    breweryId: readFundingApiNumber(data, ['breweryId', 'brewery_id']),
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

function normalizeFundingDraftAiImageResponse(response: unknown): FundingDraftAiImageResponse {
  const raw = getFundingApiRawObject(response);
  const data = getFundingApiObject(response);
  const imageUrls = readFundingApiUrlArray(data, ['images', 'imageUrls', 'image_urls'])
    .filter((url) => /^https?:\/\//i.test(url));
  const fallbackImageUrls = imageUrls.length
    ? imageUrls
    : readFundingApiUrlArray(raw, ['images', 'imageUrls', 'image_urls'])
        .filter((url) => /^https?:\/\//i.test(url));
  const imageUrl = readFundingApiString(data, ['imageUrl', 'image_url'])
    || readFundingApiString(raw, ['imageUrl', 'image_url'])
    || fallbackImageUrls[0]
    || '';
  const thumbnailUrl = readFundingApiString(data, ['thumbnailUrl', 'thumbnail_url'])
    || readFundingApiString(raw, ['thumbnailUrl', 'thumbnail_url'])
    || imageUrl;

  return {
    imageUrl: /^https?:\/\//i.test(imageUrl) ? imageUrl : '',
    thumbnailUrl: /^https?:\/\//i.test(thumbnailUrl) ? thumbnailUrl : '',
    images: fallbackImageUrls.slice(0, 5),
    promptUsed: readFundingApiString(data, ['promptUsed', 'prompt_used']) || readFundingApiString(raw, ['promptUsed', 'prompt_used']),
    modelUsed: readFundingApiString(data, ['modelUsed', 'model_used']) || readFundingApiString(raw, ['modelUsed', 'model_used']),
    status: readFundingApiString(data, ['status']) || readFundingApiString(raw, ['status']),
    message: readFundingApiString(data, ['message']) || readFundingApiString(raw, ['message']),
  };
}

function normalizeFundingDraftPreviewResponse(response: unknown): FundingDraftPreviewResponse {
  const responseData = response && typeof response === 'object' ? response as Record<string, unknown> : {};
  const data = getFundingApiObject(response);
  const basicInfo = getFundingPreviewNestedObject(data, responseData, ['basicInfo', 'basic_info']);
  const schedule = getFundingPreviewNestedObject(data, responseData, ['schedule']);
  const legalInfo = getFundingPreviewNestedObject(data, responseData, ['legalInfo', 'legal_info']);
  const tasteProfile = getFundingPreviewNestedObject(data, responseData, ['tasteProfile', 'taste_profile']);
  const plan = getFundingPreviewNestedObject(data, responseData, ['plan']);
  const breweryInfo = getFundingPreviewNestedObject(data, responseData, ['breweryInfo', 'brewery_info']);
  const notices = getFundingPreviewNestedObject(data, responseData, ['notices']);
  const dataPreviewImages = readFundingApiUrlArray(
    data,
    ['images', 'imageUrls', 'image_urls', 'allImageUrls', 'all_image_urls'],
    ['thumbnailUrl', 'thumbnail_url']
  );
  const topLevelPreviewImages = readFundingApiUrlArray(
    responseData,
    ['images', 'imageUrls', 'image_urls', 'allImageUrls', 'all_image_urls'],
    ['thumbnailUrl', 'thumbnail_url']
  );
  const previewImages = dataPreviewImages.length ? dataPreviewImages : topLevelPreviewImages;
  const basicImageUrls = readFundingApiUrlArray(basicInfo, ['imageUrls', 'image_urls', 'images'], ['thumbnailUrl', 'thumbnail_url']);
  const allBasicImageUrls = readFundingApiUrlArray(
    basicInfo,
    ['allImageUrls', 'all_image_urls', 'imageUrls', 'image_urls', 'images'],
    ['thumbnailUrl', 'thumbnail_url']
  );
  const draftId = readFundingApiNumber(data, ['draftId', 'draft_id'])
    || readFundingApiNumber(responseData, ['draftId', 'draft_id']);
  const fundingId = readFundingApiNumber(data, ['fundingId', 'funding_id'])
    || readFundingApiNumber(responseData, ['fundingId', 'funding_id']);
  const status = readFundingApiString(data, ['status'])
    || readFundingApiString(responseData, ['draftStatus', 'draft_status', 'status']);
  const progressRate = readFundingApiNumber(data, ['progressRate', 'progress_rate'])
    || readFundingApiNumber(responseData, ['progressRate', 'progress_rate']);
  const message = readFundingApiString(data, ['message']) || readFundingApiString(responseData, ['message']);

  return {
    draftId,
    fundingId: fundingId || undefined,
    status,
    progressRate,
    basicInfo: {
      title: readFundingApiString(basicInfo, ['title']),
      shortTitle: readFundingApiString(basicInfo, ['shortTitle', 'short_title']),
      category: readFundingApiString(basicInfo, ['category']),
      mainIngredient: readFundingApiString(basicInfo, ['mainIngredient', 'main_ingredient']),
      subIngredients: readFundingApiArray<string>(basicInfo, ['subIngredients', 'sub_ingredients']),
      alcoholPercentage: readFundingApiNumber(basicInfo, ['alcoholPercentage', 'alcohol_percentage']) || undefined,
      summary: readFundingApiString(basicInfo, ['summary']),
      thumbnailUrl: readFundingApiString(basicInfo, ['thumbnailUrl', 'thumbnail_url']),
      imageUrls: basicImageUrls.length ? basicImageUrls : previewImages,
      allImageUrls: allBasicImageUrls.length ? allBasicImageUrls : previewImages,
      images: previewImages,
      tags: readFundingApiArray<string>(basicInfo, ['tags']),
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
      mainIngredient: readFundingApiString(legalInfo, ['mainIngredient', 'main_ingredient']),
      primaryIngredient: readFundingApiString(legalInfo, ['primaryIngredient', 'primary_ingredient']),
      subIngredient: readFundingApiString(legalInfo, ['subIngredient', 'sub_ingredient']),
      subIngredients: readFundingApiStringArray(legalInfo, ['subIngredients', 'sub_ingredients'], ['subIngredient', 'sub_ingredient']),
      rawMaterials: normalizeFundingRawMaterials(readFundingApiArray<FundingRawMaterialResponse>(legalInfo, ['rawMaterials', 'raw_materials'])),
    },
    tasteProfile: {
      sweetness: readFundingApiOptionalNumber(tasteProfile, ['sweetness']),
      acidity: readFundingApiOptionalNumber(tasteProfile, ['acidity']),
      body: readFundingApiOptionalNumber(tasteProfile, ['body']),
      carbonation: readFundingApiOptionalNumber(tasteProfile, ['carbonation']),
      alcohol: readFundingApiOptionalNumber(tasteProfile, ['alcohol']),
      alcoholIntensity: readFundingApiOptionalNumber(tasteProfile, ['alcoholIntensity', 'alcohol_intensity']),
      aromaIntensity: readFundingApiOptionalNumber(tasteProfile, ['aromaIntensity', 'aroma_intensity']),
      finish: readFundingApiOptionalNumber(tasteProfile, ['finish']),
      aftertaste: readFundingApiOptionalNumber(tasteProfile, ['aftertaste', 'after_taste']),
      flavor: readFundingApiStringArray(tasteProfile, ['flavor'], ['flavor']),
      flavorNotes: readFundingApiStringArray(tasteProfile, ['flavorNotes', 'flavor_notes'], ['flavor']),
    },
    plan: {
      introduction: readFundingApiString(plan, ['introduction']),
      videoUrl: readFundingApiString(plan, ['videoUrl', 'video_url']),
      budgetPlan: readFundingApiArrayOrString<{ category: string; amount: number }>(plan, ['budgetPlanRaw', 'budget_plan_raw', 'budgetPlanInput', 'budget_plan_input', 'budgetPlanText', 'budget_plan_text', 'budgetPlan', 'budget_plan']),
      schedulePlan: readFundingApiArrayOrString<{ step: string; description: string; date: string }>(plan, ['schedulePlanRaw', 'schedule_plan_raw', 'schedulePlanInput', 'schedule_plan_input', 'schedulePlanText', 'schedule_plan_text', 'schedulePlan', 'schedule_plan']),
      budgetPlanGuide: readFundingApiString(plan, ['budgetPlanGuide', 'budget_plan_guide']),
      schedulePlanGuide: readFundingApiString(plan, ['schedulePlanGuide', 'schedule_plan_guide']),
      policy: readFundingApiString(plan, ['policyRaw', 'policy_raw', 'policyText', 'policy_text', 'policy', 'projectPolicy', 'project_policy']),
    },
    breweryInfo: {
      breweryName: readFundingApiString(breweryInfo, ['breweryName', 'brewery_name']),
      creatorName: readFundingApiString(breweryInfo, ['creatorName', 'creator_name']),
      profileImageUrl: readFundingApiString(breweryInfo, ['profileImageUrl', 'profile_image_url', 'profileImage', 'profile_image']),
      creatorIntroduction: readFundingApiString(breweryInfo, ['creatorIntroduction', 'creator_introduction', 'creatorBio', 'creator_bio', 'breweryBio', 'brewery_bio', 'introduction', 'bio', 'description']),
      representativeName: readFundingApiString(breweryInfo, ['representativeName', 'representative_name']),
      businessRegistrationNumber: readFundingApiString(breweryInfo, ['businessRegistrationNumber', 'business_registration_number']),
      businessAddress: readFundingApiString(breweryInfo, ['businessAddress', 'business_address']),
      breweryAddress: readFundingApiString(breweryInfo, ['breweryAddress', 'brewery_address']),
      breweryLocation: readFundingApiString(breweryInfo, ['breweryLocation', 'brewery_location']),
      businessAddressDetail: readFundingApiString(breweryInfo, ['businessAddressDetail', 'business_address_detail']),
      contactEmail: readFundingApiString(breweryInfo, ['contactEmail', 'contact_email']),
      contactPhone: readFundingApiString(breweryInfo, ['contactPhone', 'contact_phone']),
      bankName: readFundingApiString(breweryInfo, ['bankName', 'bank_name']),
      accountNumber: readFundingApiString(breweryInfo, ['accountNumber', 'account_number']),
      accountHolder: readFundingApiString(breweryInfo, ['accountHolder', 'account_holder']),
      businessType: readFundingApiString(breweryInfo, ['businessType', 'business_type']),
      businessName: readFundingApiString(breweryInfo, ['businessName', 'business_name']),
      businessCategory: readFundingApiString(breweryInfo, ['businessCategory', 'business_category']),
      businessItem: readFundingApiString(breweryInfo, ['businessItem', 'business_item']),
      taxEmail: readFundingApiString(breweryInfo, ['taxEmail', 'tax_email']),
      phoneVerified: readFundingApiBoolean(breweryInfo, ['phoneVerified', 'phone_verified']),
      accountVerified: readFundingApiBoolean(breweryInfo, ['accountVerified', 'account_verified']),
      identityDocumentUrl: readFundingApiString(breweryInfo, ['identityDocumentUrl', 'identity_document_url', 'idCardUrl', 'id_card_url']),
      businessRegistrationFileUrl: readFundingApiString(breweryInfo, ['businessRegistrationFileUrl', 'business_registration_file_url', 'businessLicenseUrl', 'business_license_url', 'businessLicense', 'business_license', 'documentUrl', 'document_url']),
      businessLicense: readFundingApiString(breweryInfo, ['businessLicense', 'business_license', 'businessLicenseUrl', 'business_license_url']),
      businessLicenseUrl: readFundingApiString(breweryInfo, ['businessLicenseUrl', 'business_license_url']),
      missingFields: readFundingApiArray<string>(breweryInfo, ['missingFields', 'missing_fields']),
    },
    notices: {
      policy: readFundingApiString(notices, ['policy', 'projectPolicy', 'project_policy']),
      refundPolicy: readFundingApiString(notices, ['refundPolicy', 'refund_policy']),
      exchangePolicy: readFundingApiString(notices, ['exchangePolicy', 'exchange_policy']),
      adultVerificationNotice: readFundingApiString(notices, ['adultVerificationNotice', 'adult_verification_notice']),
      riskNotice: readFundingApiString(notices, ['riskNotice', 'risk_notice']),
    },
    documents: (
      readFundingApiArray<Record<string, unknown>>(data, ['documents']).length
        ? readFundingApiArray<Record<string, unknown>>(data, ['documents'])
        : readFundingApiArray<Record<string, unknown>>(responseData, ['documents'])
    ).map((document) => ({
      documentId: readFundingApiNumber(document, ['documentId', 'document_id']),
      draftId: readFundingApiNumber(document, ['draftId', 'draft_id']),
      documentType: readFundingApiString(document, ['documentType', 'document_type']),
      fileName: readFundingApiString(document, ['fileName', 'file_name', 'originalName', 'original_name']),
      fileUrl: readFundingApiString(document, ['fileUrl', 'file_url', 'url']),
      createdAt: readFundingApiString(document, ['createdAt', 'created_at']),
    })),
    images: previewImages,
    message,
  };
}

function normalizeBreweryLogItem(source: Record<string, unknown>): FundingBreweryLogItem {
  return {
    logId: readFundingApiNumber(source, ['logId', 'log_id', 'breweryLogId', 'brewery_log_id', 'id']),
    step: readFundingApiString(source, ['step']),
    stage: readFundingApiString(source, ['stage']) as FundingBreweryLogStage | string,
    title: readFundingApiString(source, ['title']),
    content: readFundingApiString(source, ['content', 'body', 'description']),
    videoUrl: readFundingApiString(source, ['videoUrl', 'video_url', 'url']),
    imageUrls: readFundingApiUrlArray(source, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(source, ['liked']),
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

function normalizeFundingShareLinkResponse(response: unknown): FundingShareLinkResponse {
  const responseData = response && typeof response === 'object' ? response as Record<string, unknown> : {};
  const data = getFundingApiObject(response);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id'])
      || readFundingApiNumber(responseData, ['fundingId', 'funding_id']),
    shareUrl: readFundingApiString(data, ['shareUrl', 'share_url'])
      || readFundingApiString(responseData, ['shareUrl', 'share_url']),
    title: readFundingApiString(data, ['title']) || readFundingApiString(responseData, ['title']) || undefined,
    summary: readFundingApiString(data, ['summary', 'description']) || readFundingApiString(responseData, ['summary', 'description']) || undefined,
    thumbnailImageUrl: readFundingApiString(data, ['thumbnailImageUrl', 'thumbnail_image_url', 'thumbnailUrl', 'thumbnail_url'])
      || readFundingApiString(responseData, ['thumbnailImageUrl', 'thumbnail_image_url', 'thumbnailUrl', 'thumbnail_url'])
      || undefined,
    shareCount: readFundingApiOptionalNumber(data, ['shareCount', 'share_count'])
      ?? readFundingApiOptionalNumber(responseData, ['shareCount', 'share_count']),
    message: readFundingApiString(data, ['message']) || readFundingApiString(responseData, ['message']),
  };
}

function normalizeBreweryLogCommentItem(source: Record<string, unknown>): FundingBreweryLogCommentItem {
  return {
    commentId: readFundingApiNumber(source, ['commentId', 'comment_id', 'id']),
    writerId: readFundingApiString(source, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(source, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
    writerNickname: readFundingApiString(source, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']) || undefined,
    writerProfileImage: readFundingApiNullableString(source, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
    ...readFundingWriterBadgeFields(source),
    content: readFundingApiString(source, ['content', 'body']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(source, ['liked']),
    replies: readFundingApiArray<Record<string, unknown>>(source, ['replies', 'answers']).map((reply) => ({
      replyId: readFundingApiNumber(reply, ['replyId', 'reply_id', 'id']),
      writerId: readFundingApiString(reply, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(reply, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
      writerNickname: readFundingApiString(reply, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']) || undefined,
      writerProfileImage: readFundingApiNullableString(reply, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
      ...readFundingWriterBadgeFields(reply),
      content: readFundingApiString(reply, ['content', 'body']),
      createdAt: readFundingApiString(reply, ['createdAt', 'created_at', 'date']),
      likeCount: readFundingApiNumber(reply, ['likeCount', 'like_count', 'likes']),
      liked: readFundingApiBoolean(reply, ['liked']),
    })),
  };
}

function normalizeBreweryLogCommentsResponse(response: unknown): FundingBreweryLogCommentsResponse {
  const content = getFundingApiArray<Record<string, unknown>>(response, ['content', 'comments', 'data']);
  return { content: content.map(normalizeBreweryLogCommentItem) };
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
    videoUrl: readFundingApiString(data, ['videoUrl', 'video_url', 'url']),
    imageUrls: readFundingApiUrlArray(data, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    message: readFundingApiString(responseData, ['message']) || readFundingApiString(data, ['message']),
  };
}

function normalizeFundingReviewItem(source: Record<string, unknown>): FundingReviewItem {
  return {
    reviewId: readFundingApiNumber(source, ['reviewId', 'review_id', 'id']),
    fundingId: readFundingApiNumber(source, ['fundingId', 'funding_id']) || undefined,
    writerId: readFundingApiString(source, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(source, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
    writerNickname: readFundingApiString(source, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']),
    ...readFundingWriterBadgeFields(source),
    rating: readFundingApiNumber(source, ['rating']),
    content: readFundingApiString(source, ['content', 'detailReview', 'detail_review', 'comment', 'reviewContent', 'review_content', 'body']),
    imageUrls: readFundingApiStringArray(source, ['imageUrls', 'image_urls', 'images'], ['imageUrl', 'image_url', 'thumbnailUrl', 'thumbnail_url']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    mood: readFundingApiString(source, ['mood']) || undefined,
    pairing: readFundingApiString(source, ['pairing']) || undefined,
    tags: readFundingApiStringArray(source, ['tags']),
    recordVisibility: readFundingApiBoolean(source, ['recordVisibility', 'record_visibility', 'showRecord', 'show_record']),
    showRecord: readFundingApiBoolean(source, ['showRecord', 'show_record', 'recordVisibility', 'record_visibility']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(source, ['liked', 'isLiked', 'is_liked']),
    canWriteReview: readFundingApiBoolean(source, ['canWriteReview', 'can_write_review']),
    canReview: readFundingApiBoolean(source, ['canReview', 'can_review']),
  };
}

function normalizeFundingReviewsResponse(response: unknown): FundingReviewsResponse {
  const raw = getFundingApiRawObject(response);
  const data = getFundingApiObject(response);
  const content = getFundingApiArray<Record<string, unknown>>(response, ['content', 'reviews', 'data']);
  const permission = readFundingReviewPermission(raw, data);
  return {
    content: content.map(normalizeFundingReviewItem),
    page: readFundingApiNumber(data, ['page']),
    size: readFundingApiNumber(data, ['size'], content.length),
    totalElements: readFundingApiNumber(data, ['totalElements', 'total_elements'], content.length),
    totalPages: readFundingApiNumber(data, ['totalPages', 'total_pages'], content.length > 0 ? 1 : 0),
    canWriteReview: permission.canWriteReview,
    canReview: permission.canReview,
    message: readFundingApiString(data, ['message']) || readFundingApiString(raw, ['message']) || undefined,
  };
}

function normalizeFundingReviewCommentItem(source: Record<string, unknown>): FundingReviewCommentItem {
  return {
    commentId: readFundingApiNumber(source, ['commentId', 'comment_id', 'id']),
    fundingId: readFundingApiNumber(source, ['fundingId', 'funding_id']) || undefined,
    reviewId: readFundingApiNumber(source, ['reviewId', 'review_id']) || undefined,
    writerId: readFundingApiString(source, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(source, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
    writerNickname: readFundingApiString(source, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']),
    writerProfileImage: readFundingApiNullableString(source, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
    ...readFundingWriterBadgeFields(source),
    content: readFundingApiString(source, ['content', 'body', 'comment']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(source, ['liked']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    updatedAt: readFundingApiString(source, ['updatedAt', 'updated_at']) || null,
  };
}

function normalizeFundingReviewCommentsResponse(response: unknown): FundingReviewCommentsResponse {
  const data = getFundingApiObject(response);
  const content = getFundingApiArray<Record<string, unknown>>(response, ['content', 'comments', 'data']);
  return {
    content: content.map(normalizeFundingReviewCommentItem),
    message: readFundingApiString(data, ['message']),
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

function normalizeDeleteFundingReviewResponse(response: unknown): DeleteFundingReviewResponse {
  const data = getFundingApiObject(response);
  return {
    reviewId: readFundingApiNumber(data, ['reviewId', 'review_id', 'id']),
    deleted: readFundingApiBoolean(data, ['deleted']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingStatsUnit(value: string) {
  const unit = value.trim();
  if (!unit || /[\uFFFD\uF900-\uFAFF]/.test(unit)) return '천만원';
  return unit;
}

function normalizeFundingStatsResponse(response: unknown): FundingStatsResponse {
  const data = getFundingApiObject(response);
  const totalRaisedAmount = readFundingApiNumber(data, ['totalRaisedAmount', 'total_raised_amount']);
  const totalRaisedTenMillion = readFundingApiNumber(
    data,
    ['totalRaisedTenMillion', 'total_raised_ten_million'],
    totalRaisedAmount / 10000000
  );
  return {
    participationAvailableFunding: readFundingApiNumber(data, ['participationAvailableFunding', 'participation_available_funding']),
    totalSupporterCount: readFundingApiNumber(data, ['totalSupporterCount', 'total_supporter_count']),
    successfulProjectCount: readFundingApiNumber(data, ['successfulProjectCount', 'successful_project_count']),
    totalRaisedAmount,
    totalRaisedHundredMillion: readFundingApiNumber(
      data,
      ['totalRaisedHundredMillion', 'total_raised_hundred_million'],
      totalRaisedAmount / 100000000
    ),
    totalRaisedTenMillion,
    totalRaisedTenMillionUnit: normalizeFundingStatsUnit(
      readFundingApiString(data, ['totalRaisedTenMillionUnit', 'total_raised_ten_million_unit'], '천만원')
    ),
    message: readFundingApiString(data, ['message']),
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

function normalizeVerifyBreweryAccountResponse(response: unknown, fallbackAccountNumber: string): VerifyBreweryAccountResponse {
  const raw = getFundingApiRawObject(response);
  const data = getFundingApiObject(response);
  const account = getFundingApiNestedObject(data, ['account', 'bankAccount', 'bank_account']);
  const source = { ...raw, ...data, ...account };
  return {
    verified: readFundingApiBoolean(source, ['verified', 'isVerified', 'is_verified']),
    bankName: readFundingApiString(source, ['bankName', 'bank_name', 'bank']) || undefined,
    accountNumber: readFundingApiString(source, [
      'accountNumber',
      'account_number',
      'numericAccountNumber',
      'numeric_account_number',
      'verifiedAccountNumber',
      'verified_account_number',
    ]) || fallbackAccountNumber,
    accountHolder: readFundingApiString(source, ['accountHolder', 'account_holder', 'holderName', 'holder_name']) || undefined,
    message: readFundingApiString(source, ['message']) || readFundingApiString(raw, ['message']) || undefined,
  };
}

function normalizeFundingDraftSubmitResponse(response: unknown): FundingDraftSubmitResponse {
  const data = getFundingApiObject(response);
  return {
    draftId: readFundingApiNumber(data, ['draftId', 'draft_id']),
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']) || undefined,
    recipeId: readFundingApiNumber(data, ['recipeId', 'recipe_id']) || undefined,
    status: readFundingApiString(data, ['status'], 'SUBMITTED'),
    fundingStatus: readFundingApiString(data, ['fundingStatus', 'funding_status']) || undefined,
    progressRate: readFundingApiNumber(data, ['progressRate', 'progress_rate']),
    submittedAt: readFundingApiString(data, ['submittedAt', 'submitted_at']) || undefined,
    updatedAt: readFundingApiString(data, ['updatedAt', 'updated_at']) || undefined,
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingOrderResponse(response: unknown): CreateFundingOrderResponse {
  const data = getFundingApiObject(response);
  const orderId = readFundingApiString(data, ['orderId', 'order_id']);
  const numericOrderId = readFundingApiOptionalNumber(data, ['numericOrderId', 'numeric_order_id']);
  const amount = readFundingApiNumber(data, ['amount', 'totalAmount', 'total_amount']);
  return {
    orderId: orderId || numericOrderId || 0,
    numericOrderId,
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    optionId: readFundingApiNumber(data, ['optionId', 'option_id']),
    quantity: readFundingApiNumber(data, ['quantity']),
    amount,
    totalAmount: amount,
    orderName: readFundingApiString(data, ['orderName', 'order_name']) || undefined,
    customerName: readFundingApiString(data, ['customerName', 'customer_name']) || undefined,
    customerEmail: readFundingApiString(data, ['customerEmail', 'customer_email']) || undefined,
    customerMobilePhone: readFundingApiString(data, ['customerMobilePhone', 'customer_mobile_phone']) || undefined,
    orderStatus: readFundingApiString(data, ['orderStatus', 'order_status']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingPaymentResponse(response: unknown): RequestPaymentResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiString(data, ['orderId', 'order_id']),
    paymentId: readFundingApiNumber(data, ['paymentId', 'payment_id']),
    paymentStatus: readFundingApiString(data, ['paymentStatus', 'payment_status']),
    paymentUrl: readFundingApiString(data, ['paymentUrl', 'payment_url', 'checkoutUrl', 'checkout_url', 'redirectUrl', 'redirect_url']) || undefined,
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeConfirmTossPaymentResponse(response: unknown): ConfirmTossPaymentResponse {
  const raw = getFundingApiRawObject(response);
  const data = getFundingApiObject(response);
  const payment = getFundingNestedObject(data, 'payment');
  const nestedPayment = getFundingNestedObject(payment, 'payment');
  const tossPayment = getFundingNestedObject(payment, 'tossPayment');
  const rawPayment = getFundingNestedObject(raw, 'payment');
  const orderId =
    readFundingApiString(data, ['orderId', 'order_id']) ||
    readFundingApiString(raw, ['orderId', 'order_id']) ||
    readFundingApiString(nestedPayment, ['orderId', 'order_id']) ||
    readFundingApiString(tossPayment, ['orderId', 'order_id']) ||
    readFundingApiString(rawPayment, ['orderId', 'order_id']);
  return {
    status: readFundingApiOptionalNumber(raw, ['status']) ?? readFundingApiOptionalNumber(data, ['status']),
    orderId,
    paymentId:
      readFundingApiNumber(data, ['paymentId', 'payment_id']) ||
      readFundingApiNumber(raw, ['paymentId', 'payment_id']) ||
      readFundingApiNumber(nestedPayment, ['paymentId', 'payment_id']) ||
      readFundingApiNumber(rawPayment, ['paymentId', 'payment_id']),
    paymentStatus:
      readFundingApiString(data, ['paymentStatus', 'payment_status']) ||
      readFundingApiString(raw, ['paymentStatus', 'payment_status']) ||
      readFundingApiString(nestedPayment, ['paymentStatus', 'payment_status']) ||
      readFundingApiString(tossPayment, ['status']) ||
      readFundingApiString(rawPayment, ['paymentStatus', 'payment_status', 'status']),
    paidAmount:
      readFundingApiNumber(data, ['paidAmount', 'paid_amount', 'amount']) ||
      readFundingApiNumber(raw, ['paidAmount', 'paid_amount', 'amount']) ||
      readFundingApiNumber(nestedPayment, ['paidAmount', 'paid_amount', 'amount']) ||
      readFundingApiNumber(tossPayment, ['totalAmount', 'total_amount', 'amount']) ||
      readFundingApiNumber(rawPayment, ['paidAmount', 'paid_amount', 'amount']),
    message:
      readFundingApiString(data, ['message']) ||
      readFundingApiString(raw, ['message']) ||
      readFundingApiString(payment, ['message']) ||
      readFundingApiString(rawPayment, ['message']),
  };
}

function normalizeFundingPaymentInfoResponse(response: unknown): FundingPaymentInfoResponse {
  const data = getFundingApiObject(response);
  return {
    paymentId: readFundingApiNumber(data, ['paymentId', 'payment_id']),
    orderId: readFundingApiString(data, ['orderId', 'order_id']),
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
    orderId: readFundingApiString(data, ['orderId', 'order_id']),
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
    liked: readFundingApiBoolean(data, ['liked']),
    likeCount: readFundingApiNumber(data, ['likeCount', 'like_count']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingQuestionLikeResponse(response: unknown): FundingQuestionLikeResponse {
  const data = getFundingApiObject(response);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    questionId: readFundingApiNumber(data, ['questionId', 'question_id']),
    liked: readFundingApiBoolean(data, ['liked']),
    likeCount: readFundingApiNumber(data, ['likeCount', 'like_count']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingEntityLikeResponse(response: unknown): FundingEntityLikeResponse {
  const data = getFundingApiObject(response);
  return {
    fundingId: readFundingApiNumber(data, ['fundingId', 'funding_id']),
    breweryLogId: readFundingApiNumber(data, ['breweryLogId', 'brewery_log_id', 'logId', 'log_id']) || undefined,
    questionId: readFundingApiNumber(data, ['questionId', 'question_id']) || undefined,
    reviewId: readFundingApiNumber(data, ['reviewId', 'review_id']) || undefined,
    commentId: readFundingApiNumber(data, ['commentId', 'comment_id']) || undefined,
    replyId: readFundingApiNumber(data, ['replyId', 'reply_id']) || undefined,
    liked: readFundingApiBoolean(data, ['liked']),
    likeCount: readFundingApiNumber(data, ['likeCount', 'like_count']),
    message: readFundingApiString(data, ['message']),
  };
}

function normalizeFundingQuestionItem(source: Record<string, unknown>): FundingQuestionItem {
  return {
    questionId: readFundingApiNumber(source, ['questionId', 'question_id', 'id']),
    writerId: readFundingApiString(source, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(source, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
    writerNickname: readFundingApiString(source, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname'], '사용자'),
    writerProfileImage: readFundingApiNullableString(source, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
    ...readFundingWriterBadgeFields(source),
    title: readFundingApiString(source, ['title']),
    content: readFundingApiString(source, ['content', 'body']),
    answered: readFundingApiBoolean(source, ['answered']),
    createdAt: readFundingApiString(source, ['createdAt', 'created_at', 'date']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(source, ['liked']),
    replies: readFundingApiArray<Record<string, unknown>>(source, ['replies', 'answers']).map((reply) => ({
      replyId: readFundingApiNumber(reply, ['replyId', 'reply_id', 'id']),
      writerId: readFundingApiString(reply, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(reply, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
      writerNickname: readFundingApiString(reply, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']) || undefined,
      writerProfileImage: readFundingApiNullableString(reply, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
      ...readFundingWriterBadgeFields(reply),
      content: readFundingApiString(reply, ['content', 'body']),
      createdAt: readFundingApiString(reply, ['createdAt', 'created_at', 'date']),
      likeCount: readFundingApiNumber(reply, ['likeCount', 'like_count', 'likes']),
      liked: readFundingApiBoolean(reply, ['liked']),
    })),
  };
}

function normalizeFundingQuestionsResponse(response: unknown): FundingQuestionsResponse {
  const data = getFundingApiObject(response);
  const content = getFundingApiArray<Record<string, unknown>>(response, ['content', 'questions', 'data']);
  return {
    content: content.map(normalizeFundingQuestionItem),
    page: readFundingApiNumber(data, ['page']),
    size: readFundingApiNumber(data, ['size'], content.length),
    totalElements: readFundingApiNumber(data, ['totalElements', 'total_elements'], content.length),
    totalPages: readFundingApiNumber(data, ['totalPages', 'total_pages'], content.length > 0 ? 1 : 0),
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
    liked: readFundingApiBoolean(source, ['liked']),
    likeCount: readFundingApiNumber(source, ['likeCount', 'like_count']),
  };
}

function normalizeFundingOrderDetailResponse(response: unknown): FundingOrderDetailResponse {
  const data = getFundingApiObject(response);
  return {
    orderId: readFundingApiString(data, ['orderId', 'order_id']),
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
  if (!Number.isFinite(breweryId) || breweryId <= 0) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }
  return breweryId;
}

function shouldLogFundingCreateApi(path: string) {
  return path.startsWith('/api/fundings/drafts');
}

function getFundingCreateLogScope(path: string, method?: string) {
  const normalizedMethod = (method || 'GET').toUpperCase();
  if (path.includes('/images/ai-generate')) return 'AI_IMAGE';
  if (path.endsWith('/submit')) return 'SUBMIT';
  if (path.includes('/files') || path.includes('/documents')) return 'UPLOAD';
  if (normalizedMethod === 'PATCH' || normalizedMethod === 'POST' || normalizedMethod === 'DELETE') return 'SAVE';
  return 'DRAFT';
}

function sanitizeFundingCreateDebugValue(value: unknown): unknown {
  if (typeof value === 'string') {
    if (/^(data:|base64:)/i.test(value) || value.length > 500) {
      return `${value.slice(0, 80)}...(${value.length} chars)`;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(sanitizeFundingCreateDebugValue);
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    if ('uri' in objectValue || 'name' in objectValue || 'type' in objectValue || 'mimeType' in objectValue) {
      return Object.fromEntries(
        Object.entries(objectValue).map(([key, entry]) => [key, sanitizeFundingCreateDebugValue(entry)])
      );
    }
    return Object.fromEntries(
      Object.entries(objectValue).map(([key, entry]) => [key, sanitizeFundingCreateDebugValue(entry)])
    );
  }
  return value;
}

function getFundingCreateDebugBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      return sanitizeFundingCreateDebugValue(JSON.parse(body));
    } catch {
      return sanitizeFundingCreateDebugValue(body);
    }
  }
  return sanitizeFundingCreateDebugValue(body);
}

function getFundingCreateFormDebugBody(formData: FormData) {
  const parts = (formData as unknown as { _parts?: unknown[] })._parts;
  if (!Array.isArray(parts)) return '[FormData]';
  return parts.map((part) => {
    if (!Array.isArray(part)) return sanitizeFundingCreateDebugValue(part);
    const [key, value] = part;
    return {
      key,
      value: sanitizeFundingCreateDebugValue(value),
    };
  });
}

async function requestFundingJson<T>(path: string, options: RequestInit & { auth?: boolean; skipAuth?: boolean } = {}) {
  const { auth, skipAuth, headers, ...requestOptions } = options;
  const createHeaders = (token?: string | null): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const token = skipAuth ? null : await getFundingAccessToken();
  if (auth && !token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  const url = `${JUDAM_FUNDING_API_BASE_URL}${path}`;
  const method = requestOptions.method || 'GET';
  const debugScope = getFundingCreateLogScope(path, method);
  const shouldDebug = shouldLogFundingCreateApi(path);
  const debugRequest = {
    url,
    path,
    method,
    hasToken: Boolean(token),
    body: getFundingCreateDebugBody(requestOptions.body),
  };
  if (shouldDebug) {
    console.log(`[FundingCreate][${debugScope}] request`, debugRequest);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...requestOptions,
      headers: createHeaders(token),
    });
  } catch (error) {
    if (shouldDebug) {
      console.log('[FundingCreate][ERROR]', { scope: debugScope, ...debugRequest, error });
    }
    throw error;
  }
  let text = await response.text();
  let data = parseFundingResponseBody(path, response, text);

  if (shouldDebug) {
    console.log(`[FundingCreate][${debugScope}] response`, {
      url,
      path,
      method,
      status: response.status,
      body: sanitizeFundingCreateDebugValue(text),
    });
  }

  if (response.status === 401 && !skipAuth && (auth || token)) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      if (shouldDebug) {
        console.log(`[FundingCreate][${debugScope}] retry request`, {
          ...debugRequest,
          hasToken: true,
          refreshed: true,
        });
      }
      try {
        response = await fetch(url, {
          ...requestOptions,
          headers: createHeaders(refreshedToken),
        });
      } catch (error) {
        if (shouldDebug) {
          console.log('[FundingCreate][ERROR]', { scope: debugScope, ...debugRequest, refreshed: true, error });
        }
        throw error;
      }
      text = await response.text();
      data = parseFundingResponseBody(path, response, text);
      if (shouldDebug) {
        console.log(`[FundingCreate][${debugScope}] retry response`, {
          url,
          path,
          method,
          status: response.status,
          body: sanitizeFundingCreateDebugValue(text),
        });
      }
    }
  }

  if (!response.ok) {
    const message = (data as FundingApiErrorBody | null)?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function requestFundingForm<T>(path: string, formData: FormData, options: RequestInit & { auth?: boolean } = {}) {
  const { auth, headers, ...requestOptions } = options;
  const createHeaders = (token?: string | null): Record<string, string> => ({
    ...(headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const token = await getFundingAccessToken();
  if (auth && !token) {
    throw new Error('NEEDS_ACCESS_TOKEN');
  }

  const url = `${JUDAM_FUNDING_API_BASE_URL}${path}`;
  const method = requestOptions.method || 'GET';
  const debugScope = getFundingCreateLogScope(path, method);
  const shouldDebug = shouldLogFundingCreateApi(path);
  const debugRequest = {
    url,
    path,
    method,
    hasToken: Boolean(token),
    body: getFundingCreateFormDebugBody(formData),
  };
  if (shouldDebug) {
    console.log(`[FundingCreate][${debugScope}] request`, debugRequest);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...requestOptions,
      headers: createHeaders(token),
      body: formData,
    });
  } catch (error) {
    if (shouldDebug) {
      console.log('[FundingCreate][ERROR]', { scope: debugScope, ...debugRequest, error });
    }
    throw error;
  }
  let text = await response.text();
  let data = parseFundingResponseBody(path, response, text);

  if (shouldDebug) {
    console.log(`[FundingCreate][${debugScope}] response`, {
      url,
      path,
      method,
      status: response.status,
      body: sanitizeFundingCreateDebugValue(text),
    });
  }

  if (response.status === 401 && (auth || token)) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      if (shouldDebug) {
        console.log(`[FundingCreate][${debugScope}] retry request`, {
          ...debugRequest,
          hasToken: true,
          refreshed: true,
        });
      }
      try {
        response = await fetch(url, {
          ...requestOptions,
          headers: createHeaders(refreshedToken),
          body: formData,
        });
      } catch (error) {
        if (shouldDebug) {
          console.log('[FundingCreate][ERROR]', { scope: debugScope, ...debugRequest, refreshed: true, error });
        }
        throw error;
      }
      text = await response.text();
      data = parseFundingResponseBody(path, response, text);
      if (shouldDebug) {
        console.log(`[FundingCreate][${debugScope}] retry response`, {
          url,
          path,
          method,
          status: response.status,
          body: sanitizeFundingCreateDebugValue(text),
        });
      }
    }
  }

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

export function isFundingReviewNotFoundError(error: unknown) {
  return getFundingApiErrorMessage(error, '').includes('후기를 찾을 수 없습니다');
}

export function isFundingApiMissingEndpointError(error: unknown) {
  const message = getFundingApiErrorMessage(error, '');
  return message.includes('API 응답이 JSON이 아닙니다.') && message.includes('404');
}

export async function saveFundingAgreement(payload: FundingAgreementPayload) {
  const breweryId = normalizeBreweryId(payload.breweryId);
  const baseBody = {
    breweryId,
    isAdultConfirmed: payload.isAdultConfirmed,
    isContactInfoAgreed: payload.isContactInfoAgreed,
    isSettlementInfoAgreed: payload.isSettlementInfoAgreed,
    isFeePolicyAgreed: payload.isFeePolicyAgreed,
    isResponsibilityAgreed: payload.isResponsibilityAgreed,
  };
  const fullBody = {
    ...baseBody,
    isLicenseAgreed: payload.isLicenseAgreed,
    isIpPolicyAgreed: payload.isIpPolicyAgreed,
    isRecipeLicenseAgreed: payload.isRecipeLicenseAgreed,
    allRequiredTermsAgreed: payload.allRequiredTermsAgreed,
  };
  const requestBodies: Record<string, unknown>[] = [
    fullBody,
    {
      breweryId,
      age: payload.isAdultConfirmed,
      contact: payload.isContactInfoAgreed,
      settlement: payload.isSettlementInfoAgreed,
      fee: payload.isFeePolicyAgreed,
      responsibility: payload.isResponsibilityAgreed,
      license: payload.isLicenseAgreed,
      ip: payload.isIpPolicyAgreed,
      allRequiredTermsAgreed: payload.allRequiredTermsAgreed,
    },
    {
      brewery_id: breweryId,
      is_adult_confirmed: payload.isAdultConfirmed,
      is_contact_info_agreed: payload.isContactInfoAgreed,
      is_settlement_info_agreed: payload.isSettlementInfoAgreed,
      is_fee_policy_agreed: payload.isFeePolicyAgreed,
      is_responsibility_agreed: payload.isResponsibilityAgreed,
      is_license_agreed: payload.isLicenseAgreed,
      is_ip_policy_agreed: payload.isIpPolicyAgreed,
      is_recipe_license_agreed: payload.isRecipeLicenseAgreed,
      all_required_terms_agreed: payload.allRequiredTermsAgreed,
    },
    {
      breweryId,
      agreedTerms: {
        age: payload.isAdultConfirmed,
        contact: payload.isContactInfoAgreed,
        settlement: payload.isSettlementInfoAgreed,
        fee: payload.isFeePolicyAgreed,
        responsibility: payload.isResponsibilityAgreed,
        license: payload.isLicenseAgreed,
        ip: payload.isIpPolicyAgreed,
      },
      agreedTermIds: ['age', 'contact', 'settlement', 'fee', 'responsibility', 'license', 'ip'],
      allAgreed: payload.allRequiredTermsAgreed,
    },
    baseBody,
  ];

  let lastError: unknown = null;
  for (const body of requestBodies) {
    try {
      const result = await requestFundingJson<unknown>('/api/fundings/agreements', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(body),
      });
      return normalizeFundingAgreementResponse(result);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
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

export async function getFundingDraftByFundingId(fundingId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/by-funding/${fundingId}`, {
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

export async function generateFundingDraftAiImage(draftId: number, payload: FundingDraftAiImagePayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/images/ai-generate`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingDraftAiImageResponse(result);
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

export async function verifyBreweryAccount(payload: VerifyBreweryAccountPayload) {
  const accountNumber = payload.accountNumber.replace(/\D/g, '') || payload.accountNumber;
  const result = await requestFundingJson<unknown>('/api/breweries/accounts/verify', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      bankName: payload.bankName,
      bank_name: payload.bankName,
      bank: payload.bankName,
      accountNumber,
      account_number: accountNumber,
      accountHolder: payload.accountHolder,
      account_holder: payload.accountHolder,
    }),
  });
  return normalizeVerifyBreweryAccountResponse(result, accountNumber);
}

export async function saveFundingBreweryInfo(draftId: number, payload: FundingBreweryInfoPayload) {
  const digitsOnly = (value: string) => value.replace(/\D/g, '');
  const compactPayload = {
    ...payload,
    contactPhone: digitsOnly(payload.contactPhone) || payload.contactPhone,
    accountNumber: digitsOnly(payload.accountNumber) || payload.accountNumber,
  };
  const requestBodies: Record<string, unknown>[] = [
    payload,
    compactPayload,
    {
      brewery_name: payload.breweryName,
      representative_name: payload.representativeName,
      business_registration_number: payload.businessRegistrationNumber,
      business_address: payload.businessAddress,
      business_address_detail: payload.businessAddressDetail,
      contact_email: payload.contactEmail,
      contact_phone: payload.contactPhone,
      bank_name: payload.bankName,
      account_number: payload.accountNumber,
      account_holder: payload.accountHolder,
      business_type: payload.businessType,
      business_name: payload.businessName,
      business_category: payload.businessCategory,
      business_item: payload.businessItem,
      creator_introduction: payload.creatorIntroduction,
      phone_verified: payload.phoneVerified,
      account_verified: payload.accountVerified,
    },
    {
      breweryName: payload.breweryName,
      creatorName: payload.breweryName,
      representativeName: payload.representativeName,
      ceoName: payload.representativeName,
      businessRegistrationNumber: payload.businessRegistrationNumber,
      businessNumber: payload.businessRegistrationNumber,
      businessAddress: payload.businessAddress,
      businessAddressDetail: payload.businessAddressDetail,
      address: payload.businessAddress,
      contactEmail: payload.contactEmail,
      email: payload.contactEmail,
      contactPhone: payload.contactPhone,
      phone: payload.contactPhone,
      bankName: payload.bankName,
      bank: payload.bankName,
      accountNumber: payload.accountNumber,
      accountHolder: payload.accountHolder,
      businessType: payload.businessType,
      businessName: payload.businessName,
      businessCategory: payload.businessCategory,
      businessItem: payload.businessItem,
      creatorIntroduction: payload.creatorIntroduction,
      breweryBio: payload.creatorIntroduction,
      phoneVerified: payload.phoneVerified,
      accountVerified: payload.accountVerified,
    },
  ];

  let lastError: unknown = null;
  for (const body of requestBodies) {
    try {
      const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/brewery-info`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(body),
      });
      return normalizeFundingSectionResponse(result);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function loadFundingBreweryInfo(draftId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/drafts/${draftId}/brewery-info/load`, {
    auth: true,
  });
  const data = getFundingApiObject(result);
  const breweryInfo = getFundingApiNestedObject(data, ['breweryInfo', 'brewery_info', 'data']);
  return {
    breweryName: readFundingApiString(breweryInfo, ['breweryName', 'brewery_name']),
    creatorName: readFundingApiString(breweryInfo, ['creatorName', 'creator_name']),
    representativeName: readFundingApiString(breweryInfo, ['representativeName', 'representative_name']),
    businessRegistrationNumber: readFundingApiString(breweryInfo, ['businessRegistrationNumber', 'business_registration_number']),
    businessAddress: readFundingApiString(breweryInfo, ['businessAddress', 'business_address']),
    businessAddressDetail: readFundingApiString(breweryInfo, ['businessAddressDetail', 'business_address_detail']),
    contactEmail: readFundingApiString(breweryInfo, ['contactEmail', 'contact_email']),
    contactPhone: readFundingApiString(breweryInfo, ['contactPhone', 'contact_phone']),
    bankName: readFundingApiString(breweryInfo, ['bankName', 'bank_name']),
    accountNumber: readFundingApiString(breweryInfo, ['accountNumber', 'account_number']),
    accountHolder: readFundingApiString(breweryInfo, ['accountHolder', 'account_holder']),
    businessType: readFundingApiString(breweryInfo, ['businessType', 'business_type']),
    businessName: readFundingApiString(breweryInfo, ['businessName', 'business_name']),
    businessCategory: readFundingApiString(breweryInfo, ['businessCategory', 'business_category']),
    businessItem: readFundingApiString(breweryInfo, ['businessItem', 'business_item']),
    creatorIntroduction: readFundingApiString(breweryInfo, ['creatorIntroduction', 'creator_introduction', 'creatorBio', 'creator_bio', 'breweryBio', 'brewery_bio', 'introduction', 'bio', 'description']),
    phoneVerified: readFundingApiBoolean(breweryInfo, ['phoneVerified', 'phone_verified']),
    accountVerified: readFundingApiBoolean(breweryInfo, ['accountVerified', 'account_verified']),
    businessRegistrationFileUrl: readFundingApiString(breweryInfo, ['businessRegistrationFileUrl', 'business_registration_file_url', 'businessLicenseUrl', 'business_license_url', 'businessLicense', 'business_license', 'documentUrl', 'document_url']),
    businessLicense: readFundingApiString(breweryInfo, ['businessLicense', 'business_license', 'businessLicenseUrl', 'business_license_url']),
    missingFields: readFundingApiArray<string>(data, ['missingFields', 'missing_fields']).length
      ? readFundingApiArray<string>(data, ['missingFields', 'missing_fields'])
      : readFundingApiArray<string>(breweryInfo, ['missingFields', 'missing_fields']),
  };
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

export async function uploadFundingDraftFile(draftId: number, fileType: FundingDraftFileType, file: FundingDocumentUploadFile) {
  const formData = new FormData();
  formData.append('fileType', fileType);
  formData.append('file', createFundingFormFile(file));

  return requestFundingForm<FundingDraftFileUploadResponse>(`/api/fundings/drafts/${draftId}/files`, formData, {
    method: 'POST',
    auth: true,
  });
}

export async function createBreweryLog(
  fundingId: number,
  payload: Required<Pick<FundingBreweryLogMutationPayload, 'stage' | 'title' | 'content'>> &
    Pick<FundingBreweryLogMutationPayload, 'images' | 'videoUrl'>
) {
  const formData = new FormData();
  formData.append('stage', payload.stage);
  formData.append('title', payload.title);
  formData.append('content', payload.content);
  if (payload.videoUrl) formData.append('videoUrl', payload.videoUrl);
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
  if (payload.videoUrl !== undefined) formData.append('videoUrl', payload.videoUrl);
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

export async function likeBreweryLog(fundingId: number, breweryLogId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingLikeResponse(result);
}

export async function unlikeBreweryLog(fundingId: number, breweryLogId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingLikeResponse(result);
}

export async function getBreweryLogComments(fundingId: number, breweryLogId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments`);
  return normalizeBreweryLogCommentsResponse(result);
}

export async function createBreweryLogComment(fundingId: number, breweryLogId: number, content: string) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ content }),
  });
  const responseData = getFundingApiObject(result);
  return normalizeBreweryLogCommentItem(getFundingApiNestedObject(responseData, ['comment', 'data']));
}

export async function createBreweryLogCommentReply(fundingId: number, breweryLogId: number, commentId: number, content: string) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments/${commentId}/replies`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ content }),
  });
  const responseData = getFundingApiObject(result);
  const data = getFundingApiNestedObject(responseData, ['reply', 'data']);
  return {
    replyId: readFundingApiNumber(data, ['replyId', 'reply_id', 'id']),
    writerId: readFundingApiString(data, ['writerId', 'writer_id', 'userId', 'user_id']) || readFundingApiNumber(data, ['writerId', 'writer_id', 'userId', 'user_id']) || undefined,
    writerNickname: readFundingApiString(data, ['writerNickname', 'writer_nickname', 'userName', 'user_name', 'nickname']) || undefined,
    writerProfileImage: readFundingApiNullableString(data, ['writerProfileImage', 'writer_profile_image', 'profileImage', 'profile_image', 'profileImageUrl', 'profile_image_url']),
    ...readFundingWriterBadgeFields(data),
    content: readFundingApiString(data, ['content', 'body']),
    createdAt: readFundingApiString(data, ['createdAt', 'created_at', 'date']),
    likeCount: readFundingApiNumber(data, ['likeCount', 'like_count', 'likes']),
    liked: readFundingApiBoolean(data, ['liked']),
  } satisfies FundingBreweryLogReplyItem;
}

export async function likeBreweryLogComment(fundingId: number, breweryLogId: number, commentId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments/${commentId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function unlikeBreweryLogComment(fundingId: number, breweryLogId: number, commentId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments/${commentId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function likeBreweryLogReply(fundingId: number, breweryLogId: number, commentId: number, replyId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments/${commentId}/replies/${replyId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function unlikeBreweryLogReply(fundingId: number, breweryLogId: number, commentId: number, replyId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs/${breweryLogId}/comments/${commentId}/replies/${replyId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function createFundingOrder(fundingId: number, payload: CreateFundingOrderPayload) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/orders`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return normalizeFundingOrderResponse(result);
}

export async function requestFundingPayment(orderId: number | string, payload: RequestPaymentPayload) {
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

export async function getFundingPaymentInfo(orderId: number | string) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}/payment`, {
    auth: true,
  });
  return normalizeFundingPaymentInfoResponse(result);
}

export async function getOrderPayment(orderId: number | string) {
  return getFundingPaymentInfo(orderId);
}

export async function completeFundingPayment(orderId: number | string) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}/payment/complete`, {
    method: 'PATCH',
    auth: true,
  });
  return normalizeCompleteFundingPaymentResponse(result);
}

export async function getFundingList(params: {
  status?: FundingListStatus;
  sort?: FundingListSort;
  mine?: boolean;
  page?: number;
  size?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.sort) query.set('sort', params.sort);
  if (params.mine) query.set('mine', 'true');
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  const suffix = query.toString();
  const shouldRequireAuth = Boolean(params.mine || params.sort === 'RECOMMENDED');
  const result = await requestFundingJson<FundingListApiResponse>(`/api/fundings${suffix ? `?${suffix}` : ''}`, {
    auth: shouldRequireAuth,
    skipAuth: !shouldRequireAuth,
  });
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

export async function getFundingStats() {
  const result = await requestFundingJson<unknown>('/api/fundings/stats');
  return normalizeFundingStatsResponse(result);
}

export async function getFundingDetail(fundingId: number) {
  const result = await requestFundingJson<FundingDetailApiResponse>(`/api/fundings/${fundingId}`);
  return getFundingResponseData<FundingDetailResponse>(result);
}

export async function getFundingIntro(fundingId: number) {
  const result = await requestFundingJson<FundingIntroResponse | FundingApiEnvelope<FundingIntroResponse>>(`/api/fundings/${fundingId}/intro`);
  return getFundingResponseData<FundingIntroResponse>(result);
}

export async function getFundingBreweryLogs(fundingId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/brewery-logs`);
  return normalizeBreweryLogsResponse(result);
}

export async function getFundingShareLink(fundingId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/share-link`);
  return normalizeFundingShareLinkResponse(result);
}

export async function createFundingReport(fundingId: number, payload: CreateFundingReportPayload) {
  return requestFundingJson<CreateFundingReportResponse>(`/api/fundings/${fundingId}/reports`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      ...payload,
      reason: FUNDING_REPORT_REASON_LABELS[payload.reason] || payload.reason,
    }),
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
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/questions?${query.toString()}`);
  return normalizeFundingQuestionsResponse(result);
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

export async function likeFundingQuestion(fundingId: number, questionId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/questions/${questionId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingQuestionLikeResponse(result);
}

export async function unlikeFundingQuestion(fundingId: number, questionId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/questions/${questionId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingQuestionLikeResponse(result);
}

export async function likeFundingQuestionReply(fundingId: number, questionId: number, replyId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/questions/${questionId}/replies/${replyId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function unlikeFundingQuestionReply(fundingId: number, questionId: number, replyId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/questions/${questionId}/replies/${replyId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
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

export async function getFundingReviewDetail(fundingId: number, reviewId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}`);
  const raw = getFundingApiRawObject(result);
  const data = getFundingApiObject(result);
  const reviewData = getFundingApiNestedObject(data, ['review', 'fundingReview', 'funding_review', 'data']);
  const permission = readFundingReviewPermission(raw, data, reviewData);
  return {
    ...normalizeFundingReviewItem(reviewData),
    canWriteReview: permission.canWriteReview,
    canReview: permission.canReview,
  };
}

export async function getFundingReviewComments(fundingId: number, reviewId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/comments`);
  return normalizeFundingReviewCommentsResponse(result);
}

export async function likeFundingReview(fundingId: number, reviewId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/likes`, {
    method: 'POST',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function unlikeFundingReview(fundingId: number, reviewId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeFundingEntityLikeResponse(result);
}

export async function createFundingReviewComment(fundingId: number, reviewId: number, content: string) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/comments`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ content }),
  });
  const data = getFundingApiObject(result);
  return normalizeFundingReviewCommentItem(getFundingApiNestedObject(data, ['comment', 'reviewComment', 'review_comment', 'data']));
}

export async function likeFundingReviewComment(fundingId: number, reviewId: number, commentId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/comments/${commentId}/likes`, {
    method: 'POST',
    auth: true,
  });
  const data = getFundingApiObject(result);
  return normalizeFundingReviewCommentItem(getFundingApiNestedObject(data, ['comment', 'reviewComment', 'review_comment', 'data']));
}

export async function unlikeFundingReviewComment(fundingId: number, reviewId: number, commentId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}/comments/${commentId}/likes`, {
    method: 'DELETE',
    auth: true,
  });
  const data = getFundingApiObject(result);
  return normalizeFundingReviewCommentItem(getFundingApiNestedObject(data, ['comment', 'reviewComment', 'review_comment', 'data']));
}

export async function createFundingReview(fundingId: number, payload: CreateFundingReviewPayload) {
  const shouldUseFormData = Boolean(payload.images?.length);
  const detailReview = payload.detailReview || payload.content || '';

  if (!shouldUseFormData) {
    const { images: _images, imageUrls: _imageUrls, ...jsonPayload } = payload;
    const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        ...jsonPayload,
        content: detailReview,
        detailReview,
        tags: JSON.stringify(payload.tags || []),
        imageUrls: JSON.stringify(payload.imageUrls || []),
        showRecord: payload.recordVisibility,
      }),
    });
    return normalizeCreateFundingReviewResponse(result);
  }

  const formData = new FormData();
  formData.append('rating', String(payload.rating));
  formData.append('content', detailReview);
  formData.append('detailReview', detailReview);
  if (payload.mood) formData.append('mood', payload.mood);
  if (payload.pairing) formData.append('pairing', payload.pairing);
  if (payload.recordVisibility !== undefined) {
    formData.append('recordVisibility', String(payload.recordVisibility));
    formData.append('showRecord', String(payload.recordVisibility));
  }
  if (payload.tags) formData.append('tags', JSON.stringify(payload.tags));
  payload.imageUrls?.forEach((imageUrl) => formData.append('imageUrls', imageUrl));
  appendFundingFormFiles(formData, 'images', payload.images);

  const result = await requestFundingForm<unknown>(`/api/fundings/${fundingId}/reviews`, formData, {
    method: 'POST',
    auth: true,
  });
  return normalizeCreateFundingReviewResponse(result);
}

export async function updateFundingReviewApi(fundingId: number, reviewId: number, payload: UpdateFundingReviewPayload) {
  const shouldUseFormData = Boolean(payload.images?.length);

  if (shouldUseFormData) {
    const formData = new FormData();
    formData.append('rating', String(payload.rating));
    const detailReview = payload.detailReview || payload.content || '';
    formData.append('content', detailReview);
    formData.append('detailReview', detailReview);
    if (payload.mood) formData.append('mood', payload.mood);
    if (payload.pairing) formData.append('pairing', payload.pairing);
    if (payload.recordVisibility !== undefined) {
      formData.append('recordVisibility', String(payload.recordVisibility));
      formData.append('showRecord', String(payload.recordVisibility));
    }
    if (payload.tags) formData.append('tags', JSON.stringify(payload.tags));
    if (payload.imageUrls) formData.append('imageUrls', JSON.stringify(payload.imageUrls));
    if (payload.deleteImageUrls) formData.append('deleteImageUrls', JSON.stringify(payload.deleteImageUrls));
    appendFundingFormFiles(formData, 'images', payload.images);

    const result = await requestFundingForm<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}`, formData, {
      method: 'PATCH',
      auth: true,
    });
    return normalizeCreateFundingReviewResponse(result);
  }

  const {
    images: _images,
    imageUrls,
    deleteImageUrls,
    ...jsonPayload
  } = payload;
  const detailReview = payload.detailReview || payload.content || '';
  const imagePatch =
    deleteImageUrls?.length
      ? {
          imageUrls: imageUrls || [],
          deleteImageUrls,
        }
      : {};
  const requestBody = {
    ...jsonPayload,
    content: detailReview,
    detailReview,
    tags: payload.tags || [],
    ...imagePatch,
    showRecord: payload.recordVisibility,
  };

  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(requestBody),
  });
  return normalizeCreateFundingReviewResponse(result);
}

export async function deleteFundingReviewApi(fundingId: number, reviewId: number) {
  const result = await requestFundingJson<unknown>(`/api/fundings/${fundingId}/reviews/${reviewId}`, {
    method: 'DELETE',
    auth: true,
  });
  return normalizeDeleteFundingReviewResponse(result);
}

export async function getFundingSupportOptions(fundingId: number) {
  const result = await requestFundingJson<FundingSupportOptionsApiResponse>(`/api/fundings/${fundingId}/support-options`);
  const response = getFundingResponseData<FundingSupportOptionsResponse>(result);
  const supportOptions = (response.supportOptions ?? []).map((option) => ({
    ...option,
    volume: option.volume ?? response.volume ?? undefined,
    alcoholPercentage: option.alcoholPercentage ?? response.alcoholPercentage ?? undefined,
    expectedDeliveryDate: option.expectedDeliveryDate ?? response.expectedDeliveryDate ?? undefined,
    mainIngredient: option.mainIngredient || option.primaryIngredient || response.mainIngredient || response.primaryIngredient,
    primaryIngredient: option.primaryIngredient || option.mainIngredient || response.primaryIngredient || response.mainIngredient,
    mainIngredientLabel: option.mainIngredientLabel || option.primaryIngredientLabel || response.mainIngredientLabel || response.primaryIngredientLabel,
    primaryIngredientLabel: option.primaryIngredientLabel || option.mainIngredientLabel || response.primaryIngredientLabel || response.mainIngredientLabel,
    subIngredient: option.subIngredient || response.subIngredient,
    subIngredients: option.subIngredients?.length ? option.subIngredients : response.subIngredients,
    ingredients: option.ingredients?.length ? option.ingredients : response.ingredients,
  }));
  return {
    fundingId: response.fundingId ?? fundingId,
    expectedDeliveryDate: response.expectedDeliveryDate,
    volume: response.volume,
    alcoholPercentage: response.alcoholPercentage,
    mainIngredient: response.mainIngredient || response.primaryIngredient,
    primaryIngredient: response.primaryIngredient || response.mainIngredient,
    mainIngredientLabel: response.mainIngredientLabel || response.primaryIngredientLabel,
    primaryIngredientLabel: response.primaryIngredientLabel || response.mainIngredientLabel,
    subIngredient: response.subIngredient,
    subIngredients: response.subIngredients,
    ingredients: response.ingredients,
    supportOptions,
  };
}

export async function getFundingOrderDetail(orderId: number | string) {
  const result = await requestFundingJson<unknown>(`/api/orders/${orderId}`, {
    auth: true,
  });
  return normalizeFundingOrderDetailResponse(result);
}

export async function getRecentShippingAddress() {
  const result = await requestFundingJson<unknown>('/api/users/me/recent-shipping-address', {
    auth: true,
  });
  const data = getFundingApiObject(result);
  return {
    recipientName: readFundingApiString(data, ['recipientName', 'recipient_name']),
    recipientPhone: readFundingApiString(data, ['recipientPhone', 'recipient_phone']),
    shippingAddress: readFundingApiString(data, ['shippingAddress', 'shipping_address']),
    shippingDetailAddress: readFundingApiString(data, ['shippingDetailAddress', 'shipping_detail_address']),
    postalCode: readFundingApiString(data, ['postalCode', 'postal_code']),
  } satisfies RecentShippingAddressResponse;
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
  const raw = getFundingApiRawObject(result);
  const data = getFundingApiObject(result);
  return {
    drafts: normalizeAdminFundingDraftsResponse(result),
    message: readFundingApiString(data, ['message']) || readFundingApiString(raw, ['message']),
  } satisfies AdminFundingDraftListResponse;
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
