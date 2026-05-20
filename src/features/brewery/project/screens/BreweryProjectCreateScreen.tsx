import React, { useEffect, useMemo, useRef, useState } from 'react';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
  type KeyboardTypeOptions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Eye,
  FileCheck,
  Image as ImageIcon,
  MapPin,
  Plus,
  Search,
  Tag,
  Upload,
  User,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { Progress } from '@/components/ui/progress';
import type { FundingProject, BudgetItem, ScheduleItem, ProjectStatus } from '@/constants/data';
import { useAuth, type User as AuthUser } from '@/contexts/AuthContext';
import { useFunding } from '@/contexts/FundingContext';
import FundingAlertModal from '@/features/funding/components/FundingAlertModal';
import {
  createFundingDraft,
  deleteFundingDraft,
  getFundingApiErrorMessage,
  getFundingDraftList,
  getFundingDraftPreview,
  saveFundingBasicInfo,
  saveFundingBreweryInfo,
  saveFundingLegalInfo,
  saveFundingNotices,
  saveFundingPlan,
  saveFundingSchedule,
  saveFundingTasteProfile,
  submitFundingDraft,
  uploadFundingDocument,
  type FundingDocumentType,
  type FundingDraftPreviewResponse,
  updateFundingDraft,
  updateFundingProjectApi,
} from '@/features/funding/api';
import { isFundingProjectOwnedByBrewery } from '@/features/funding/ownership';
import { FIXED_PROJECT_SHIPPING_FEE } from '@/features/funding/supportConfig';
import { createRecipeFunding } from '@/features/recipe/api';
import SafeStorage from '@/utils/storage';

type TabId = 'basic' | 'funding' | 'rewards' | 'taste' | 'plan' | 'creator' | 'trust' | 'verification';
type FileKey = 'profileImage' | 'idCard' | 'businessLicense' | 'salesPermit' | 'alcoholPermit' | 'manufacturingLicense';
type DocumentFileKey = Exclude<FileKey, 'profileImage'>;
type UploadedFileValue = string | {
  name: string;
  uri?: string;
  mimeType?: string;
  size?: number;
};
type DatePickerTarget = 'startDate' | 'expectedDeliveryDate';
type TempSaveMode = 'saved' | 'existing' | 'exitExisting';

interface IngredientRow {
  id: number;
  ingredient: string;
  origin: string;
}

interface AddressItem {
  zipCode: string;
  address: string;
}

const projectTabs: { id: TabId; label: string }[] = [
  { id: 'basic', label: '기본정보' },
  { id: 'funding', label: '목표 금액 및 일정' },
  { id: 'rewards', label: '법적 고시 정보' },
  { id: 'taste', label: '맛 지표' },
  { id: 'plan', label: '프로젝트 계획' },
  { id: 'creator', label: '양조장 정보' },
  { id: 'trust', label: '안내 사항' },
  { id: 'verification', label: '인증 서류' },
];

const addressSuggestions: AddressItem[] = [];

const BANK_OPTIONS = ['KB국민', '신한', '우리', '하나', '농협은행', 'IBK기업', '카카오뱅크', '토스뱅크', '케이뱅크', 'SC제일', '부산', '대구', '광주', '전북', '경남', '수협', '새마을금고', '신협'];
const TEMP_SAVE_KEY = 'judam_project_temp_save';
const DOCUMENT_PICKER_TYPES = ['application/pdf', 'image/*'];
const DOCUMENT_FILE_KEYS: DocumentFileKey[] = ['idCard', 'businessLicense', 'salesPermit', 'alcoholPermit', 'manufacturingLicense'];
const TEMP_CREATED_PROJECT_STATUS: ProjectStatus = '심사 중';
const EMPTY_UPLOADED_FILES: Record<FileKey, UploadedFileValue> = {
  profileImage: '',
  idCard: '',
  businessLicense: '',
  salesPermit: '',
  alcoholPermit: '',
  manufacturingLicense: '',
};
const DOCUMENT_TYPE_BY_FILE_KEY: Record<DocumentFileKey, FundingDocumentType> = {
  idCard: 'ETC',
  businessLicense: 'BUSINESS_REGISTRATION',
  salesPermit: 'MAIL_ORDER_BUSINESS',
  alcoholPermit: 'LIQUOR_LICENSE',
  manufacturingLicense: 'LIQUOR_LICENSE',
};
const SUPPORTED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const SUPPORTED_DOCUMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_DOCUMENT_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_THUMB_SIZE = 128;
const IMAGE_THUMB_GAP = 12;
const IMAGE_REORDER_STEP = IMAGE_THUMB_SIZE + IMAGE_THUMB_GAP;
const DEFAULT_PROJECT_POLICY = '';
const DEFAULT_EXPECTED_DIFFICULTIES = '';

function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, '');
}

function decimalOnly(value: string) {
  const normalized = value.replace(/[^0-9.]/g, '');
  const [first, ...rest] = normalized.split('.');
  return rest.length > 0 ? `${first}.${rest.join('')}` : first;
}

function formatProjectPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatBusinessRegistrationNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length !== 10) return value.trim();
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

function isValidProjectPhone(value: string) {
  return /^01[016789][0-9]{7,8}$/.test(digitsOnly(value));
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function currency(value: string | number) {
  const number = typeof value === 'number' ? value : Number(digitsOnly(value));
  return Number.isFinite(number) ? number.toLocaleString() : '0';
}

function volumeText(value: string) {
  return value ? `${value}ml` : '';
}

function alcoholText(value: string) {
  return value ? `${value}%` : '';
}

function normalizeProjectTags(tags?: string[]) {
  if (!tags?.length) return [];
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 10);
}

function parseTextLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
}

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeUploadedFile(value: unknown): UploadedFileValue {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  const file = value as Partial<{ name: unknown; uri: unknown; mimeType: unknown; size: unknown }>;
  const name = typeof file.name === 'string' ? file.name : '';
  if (!name) return '';
  return {
    name,
    uri: typeof file.uri === 'string' ? file.uri : undefined,
    mimeType: typeof file.mimeType === 'string' ? file.mimeType : undefined,
    size: typeof file.size === 'number' ? file.size : undefined,
  };
}

function normalizeUploadedFiles(files?: Partial<Record<FileKey, unknown>>) {
  return {
    ...EMPTY_UPLOADED_FILES,
    profileImage: normalizeUploadedFile(files?.profileImage),
    idCard: normalizeUploadedFile(files?.idCard),
    businessLicense: normalizeUploadedFile(files?.businessLicense),
    salesPermit: normalizeUploadedFile(files?.salesPermit),
    alcoholPermit: normalizeUploadedFile(files?.alcoholPermit),
    manufacturingLicense: normalizeUploadedFile(files?.manufacturingLicense),
  };
}

function getUploadedFileName(file?: UploadedFileValue) {
  if (!file) return '';
  return typeof file === 'string' ? file : file.name;
}

function getLocalUploadFile(file: UploadedFileValue) {
  if (!file || typeof file === 'string' || !file.uri) return null;
  return {
    uri: file.uri,
    name: file.name,
    mimeType: file.mimeType,
  };
}

function getDocumentFileExtension(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return extension;
}

function getMimeTypeFromFileName(fileName: string) {
  const extension = getDocumentFileExtension(fileName);
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'png') return 'image/png';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

function isSupportedDocumentFile(fileName: string, mimeType?: string) {
  return SUPPORTED_DOCUMENT_EXTENSIONS.includes(getDocumentFileExtension(fileName)) || Boolean(mimeType && SUPPORTED_DOCUMENT_MIME_TYPES.includes(mimeType));
}

function normalizeProjectDate(value?: string) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return value;
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

function getDurationFromProject(project: FundingProject) {
  const start = parseDate(normalizeProjectDate(project.startDate));
  const end = parseDate(normalizeProjectDate(project.endDate));
  if (start && end) {
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) return String(diff);
  }
  return String(Math.max(1, project.daysLeft || 30));
}

function stripVolumeUnit(value?: string) {
  return digitsOnly(value || '');
}

function stripAlcoholUnit(value?: string) {
  return decimalOnly(value || '');
}

function getProjectImageUris(project: FundingProject) {
  const localUri = project.localImage ? Image.resolveAssetSource(project.localImage)?.uri : '';
  const images = project.images?.length ? project.images : [];
  return [localUri, ...images, project.image].filter((image): image is string => Boolean(image));
}

function formatBudgetItems(items?: BudgetItem[]) {
  if (!items?.length) return '';
  return items.map((item) => `- ${item.item}: ${item.amount}만원`).join('\n');
}

function formatScheduleItems(items?: ScheduleItem[]) {
  if (!items?.length) return '';
  return items.map((item) => `- ${item.date}: ${item.description}`).join('\n');
}

function parseBudgetItems(value: string) {
  return parseTextLines(value).map((line) => {
    const match = line.match(/^(.*?)[\s:：-]+([0-9,]+)\s*만원?$/);
    if (!match) return { item: line, amount: 0 };
    return { item: match[1].trim(), amount: Number(match[2].replace(/,/g, '')) || 0 };
  });
}

function parseScheduleItems(value: string) {
  return parseTextLines(value).map((line) => {
    const [date, ...description] = line.split(':');
    return {
      date: date?.trim() || '일정',
      description: description.length > 0 ? description.join(':').trim() : line,
    };
  });
}

function getProjectIngredients(project: FundingProject) {
  if (project.ingredients?.length) {
    return project.ingredients.map((item, index) => ({
      id: index + 1,
      ingredient: item.ingredient,
      origin: item.origin,
    }));
  }
  const ingredients = [
    project.mainIngredients
      ? {
          id: 1,
          ingredient: project.mainIngredients,
          origin: project.location || '',
        }
      : null,
    project.subIngredients
      ? {
          id: 2,
          ingredient: project.subIngredients,
          origin: project.location || '',
        }
      : null,
  ].filter((item): item is { id: number; ingredient: string; origin: string } => Boolean(item));
  return ingredients.length > 0 ? ingredients : [{ id: 1, ingredient: '', origin: '' }];
}

function createProjectEditDraft(project: FundingProject, user: AuthUser | null) {
  const imageUris = getProjectImageUris(project);
  const alcoholContent = stripAlcoholUnit(project.alcoholContent);
  const volume = stripVolumeUnit(project.bottleSize || project.volume);
  const breweryName = project.brewery || user?.breweryName || '';

  return {
    basicInfo: {
      category: project.category || project.productType || '막걸리',
      title: project.title || '',
      shortTitle: project.shortTitle || project.title || '',
      mainIngredient: project.mainIngredients || '',
      subIngredient: project.subIngredients || '',
      alcoholContent,
      summary: project.projectSummary || project.shortDescription || '',
      images: imageUris.slice(0, 5),
      tags: normalizeProjectTags(project.tags),
    },
    fundingInfo: {
      pricePerBottle: project.pricePerBottle ? String(project.pricePerBottle) : '',
      bottleQuantity: project.targetQuantity || project.totalQuantity ? String(project.targetQuantity || project.totalQuantity) : '',
      goalAmount: project.goalAmount ? String(project.goalAmount) : '',
      startDate: normalizeProjectDate(project.startDate),
      duration: getDurationFromProject(project),
      expectedDeliveryDate: normalizeProjectDate(project.estimatedDelivery),
    },
    productInfo: {
      productType: project.productType || project.category || '막걸리',
      volume,
      alcoholContent,
      ingredients: getProjectIngredients(project),
    },
    tasteProfile: project.tasteProfile || {
      sweetness: 50,
      aroma: 50,
      acidity: 50,
      body: 60,
      carbonation: 50,
    },
    projectPlan: {
      introduction: project.introduction || project.story || project.projectSummary || '',
      videoUrl: project.videoUrl || '',
      budget: formatBudgetItems(project.budget),
      schedule: formatScheduleItems(project.schedule),
    },
    trustInfo: {
      projectPolicy: project.projectPolicy || DEFAULT_PROJECT_POLICY,
      expectedDifficulties: project.expectedDifficulties || DEFAULT_EXPECTED_DIFFICULTIES,
    },
    creatorInfo: {
      name: breweryName,
      profileImage: project.breweryProfileImage || imageUris[0] || '',
      bio: project.breweryBio || `${breweryName}의 전통주 프로젝트입니다.`,
      phone: user?.phone || '',
      accountBank: '',
      accountNumber: '',
    },
    taxInfo: {
      businessType: 'corporation',
      businessName: breweryName,
      businessNumber: user?.businessNumber || '',
      ceoName: user?.name && user.name !== breweryName ? user.name : '',
      address: project.location || user?.breweryLocation || '',
      businessCategory: '',
      businessItem: '',
      email: user?.email || '',
    },
    uploadedFiles: {
      profileImage: (project.breweryProfileImage || imageUris[0]) ? '기존 프로필 이미지' : '',
      idCard: '기존 제출 서류',
      businessLicense: '기존 사업자등록증 사본',
      salesPermit: '기존 통신판매신고증',
      alcoholPermit: '기존 주류 통신판매 승인서',
      manufacturingLicense: '기존 전통주 제조면허증',
    },
  };
}

function formatBudgetPlanForDraft(items?: { category: string; amount: number }[]) {
  if (!items?.length) return '';
  return items.map((item) => `- ${item.category}: ${item.amount}만원`).join('\n');
}

function formatSchedulePlanForDraft(items?: { step: string; description: string; date: string }[]) {
  if (!items?.length) return '';
  return items.map((item) => `- ${item.date}: ${item.description}`).join('\n');
}

function tasteScaleToPercent(value?: number) {
  if (typeof value !== 'number') return 50;
  if (value <= 5) return Math.max(0, Math.min(100, value * 20));
  return Math.max(0, Math.min(100, value));
}

function getUploadedFilesFromPreviewDocuments(documents?: FundingDraftPreviewResponse['documents']) {
  const files = { ...EMPTY_UPLOADED_FILES };
  documents?.forEach((document) => {
    const fileName = document.fileName || '기존 제출 서류';
    if (document.documentType === 'BUSINESS_REGISTRATION') files.businessLicense = fileName;
    if (document.documentType === 'MAIL_ORDER_BUSINESS') files.salesPermit = fileName;
    if (document.documentType === 'LIQUOR_LICENSE') {
      files.alcoholPermit = files.alcoholPermit || fileName;
      files.manufacturingLicense = files.manufacturingLicense || fileName;
    }
    if (document.documentType === 'BANK_ACCOUNT_COPY') files.idCard = files.idCard || fileName;
    if (document.documentType === 'ETC') files.idCard = files.idCard || fileName;
  });
  return files;
}

function createProjectDraftFromServerPreview(preview: FundingDraftPreviewResponse, user: AuthUser | null) {
  const basicInfo = preview.basicInfo || {};
  const schedule = preview.schedule || {};
  const legalInfo = preview.legalInfo || {};
  const tasteProfile = preview.tasteProfile || {};
  const plan = preview.plan || {};
  const breweryInfo = preview.breweryInfo || {};
  const notices = preview.notices || {};
  const rawMaterials = legalInfo.rawMaterials?.length
    ? legalInfo.rawMaterials
    : [{ name: basicInfo.mainIngredient || '', origin: '' }];
  const subIngredients = basicInfo.subIngredients || [];
  const thumbnailUrl = basicInfo.thumbnailUrl || '';
  const alcoholContent = String(legalInfo.alcoholPercentage || basicInfo.alcoholPercentage || '');
  const breweryName = breweryInfo.breweryName || user?.breweryName || '';

  return {
    timestamp: preview.documents?.[0]?.createdAt || new Date().toISOString(),
    basicInfo: {
      category: basicInfo.category || '막걸리',
      title: basicInfo.title || '',
      shortTitle: basicInfo.shortTitle || '',
      mainIngredient: basicInfo.mainIngredient || '',
      subIngredient: subIngredients[0] || '',
      alcoholContent,
      summary: basicInfo.summary || '',
      images: thumbnailUrl ? [thumbnailUrl] : [],
      tags: normalizeProjectTags(tasteProfile.flavorNotes),
    },
    fundingInfo: {
      pricePerBottle: schedule.pricePerBottle ? String(schedule.pricePerBottle) : '',
      bottleQuantity: schedule.totalQuantity ? String(schedule.totalQuantity) : '',
      goalAmount: schedule.targetAmount ? String(schedule.targetAmount) : '',
      startDate: normalizeProjectDate(schedule.fundingStartDate),
      duration: schedule.fundingPeriodDays ? String(schedule.fundingPeriodDays) : '30',
      expectedDeliveryDate: normalizeProjectDate(schedule.expectedDeliveryDate),
    },
    productInfo: {
      productType: legalInfo.productType || basicInfo.category || '막걸리',
      volume: legalInfo.volume ? String(legalInfo.volume) : '',
      alcoholContent,
      ingredients: rawMaterials.map((item, index) => ({
        id: index + 1,
        ingredient: item.name || '',
        origin: item.origin || '',
      })),
    },
    tasteProfile: {
      sweetness: tasteScaleToPercent(tasteProfile.sweetness),
      aroma: tasteScaleToPercent(tasteProfile.alcoholIntensity),
      acidity: tasteScaleToPercent(tasteProfile.acidity),
      body: tasteScaleToPercent(tasteProfile.body),
      carbonation: tasteScaleToPercent(tasteProfile.carbonation),
    },
    projectPlan: {
      introduction: plan.introduction || '',
      videoUrl: '',
      budget: formatBudgetPlanForDraft(plan.budgetPlan),
      schedule: formatSchedulePlanForDraft(plan.schedulePlan),
    },
    creatorInfo: {
      name: breweryName,
      profileImage: thumbnailUrl,
      bio: breweryName ? `${breweryName}의 전통주 프로젝트입니다.` : '',
      phone: breweryInfo.contactPhone || user?.phone || '',
      accountBank: breweryInfo.bankName || '',
      accountNumber: breweryInfo.accountNumber || '',
    },
    taxInfo: {
      businessType: 'corporation',
      businessName: breweryName,
      businessNumber: breweryInfo.businessRegistrationNumber || '',
      ceoName: breweryInfo.representativeName || breweryInfo.accountHolder || '',
      address: breweryInfo.businessAddress || '',
      businessCategory: '제조업',
      businessItem: `${basicInfo.category || '전통주'} 제조`,
      email: breweryInfo.contactEmail || user?.email || '',
    },
    trustInfo: {
      projectPolicy: [notices.refundPolicy, notices.exchangePolicy, notices.adultVerificationNotice].filter(Boolean).join('\n\n') || DEFAULT_PROJECT_POLICY,
      expectedDifficulties: notices.riskNotice || DEFAULT_EXPECTED_DIFFICULTIES,
    },
    uploadedFiles: getUploadedFilesFromPreviewDocuments(preview.documents),
    phoneVerified: Boolean(breweryInfo.contactPhone),
    accountVerified: Boolean(breweryInfo.bankName && breweryInfo.accountNumber),
    serverDraft: {
      draftId: preview.draftId,
      status: preview.status,
      progressRate: preview.progressRate,
      message: preview.message,
    },
  };
}

export default function BreweryProjectCreateScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { projects, addProject, updateProject, mergeProjects } = useFunding();
  const editProjectIdParam = getParamValue(params.projectId) || getParamValue(params.editId);
  const sourceRecipeIdParam = getParamValue(params.recipeId);
  const sourceRecipeId = sourceRecipeIdParam ? Number(sourceRecipeIdParam) : null;
  const editProjectId = editProjectIdParam ? Number(editProjectIdParam) : null;
  const editProject = useMemo(
    () => (editProjectId ? projects.find((project) => project.id === editProjectId) || null : null),
    [editProjectId, projects]
  );
  const isEditMode = Boolean(editProjectId);
  const canEditProject = editProject ? isFundingProjectOwnedByBrewery(user, editProject) : false;
  const tempSaveKey = isEditMode && editProjectId ? `${TEMP_SAVE_KEY}:edit:${editProjectId}` : TEMP_SAVE_KEY;
  const appliedEditProjectKeyRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [submitSyncWarning, setSubmitSyncWarning] = useState('');
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);
  const [tempSaveMode, setTempSaveMode] = useState<TempSaveMode>('saved');
  const [tempSaveTimestamp, setTempSaveTimestamp] = useState('');
  const [hasTempSave, setHasTempSave] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showProfileImagePickerModal, setShowProfileImagePickerModal] = useState(false);
  const [showFundingGuideModal, setShowFundingGuideModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  const [addressSearch, setAddressSearch] = useState('');
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [accountVerified, setAccountVerified] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const [isImageReordering, setIsImageReordering] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    category: '막걸리',
    title: '',
    shortTitle: '',
    mainIngredient: '',
    subIngredient: '',
    alcoholContent: '',
    summary: '',
    images: [] as string[],
    tags: [] as string[],
  });
  const [fundingInfo, setFundingInfo] = useState({
    pricePerBottle: '',
    bottleQuantity: '',
    goalAmount: '',
    startDate: '',
    duration: '30',
    expectedDeliveryDate: '',
  });
  const [productInfo, setProductInfo] = useState({
    productType: '막걸리',
    volume: '',
    alcoholContent: '',
    ingredients: [{ id: 1, ingredient: '', origin: '' }] as IngredientRow[],
  });
  const [tasteProfile, setTasteProfile] = useState({
    sweetness: 50,
    aroma: 50,
    acidity: 50,
    body: 60,
    carbonation: 50,
  });
  const [projectPlan, setProjectPlan] = useState({
    introduction: '',
    videoUrl: '',
    budget: '',
    schedule: '',
  });
  const [creatorInfo, setCreatorInfo] = useState({
    name: '',
    profileImage: '',
    bio: '',
    phone: '',
    accountBank: '',
    accountNumber: '',
  });
  const [taxInfo, setTaxInfo] = useState({
    businessType: '',
    businessName: '',
    businessNumber: '',
    ceoName: '',
    address: '',
    businessCategory: '',
    businessItem: '',
    email: '',
  });
  const [trustInfo, setTrustInfo] = useState({
    projectPolicy: DEFAULT_PROJECT_POLICY,
    expectedDifficulties: DEFAULT_EXPECTED_DIFFICULTIES,
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<FileKey, UploadedFileValue>>(EMPTY_UPLOADED_FILES);

  useEffect(() => {
    if (!editProject || !canEditProject) return;
    const editProjectKey = `${editProject.id}:${editProject.updatedAt || editProject.createdAt || ''}`;
    if (appliedEditProjectKeyRef.current === editProjectKey) return;
    const draft = createProjectEditDraft(editProject, user);
    setBasicInfo(draft.basicInfo);
    setTagDraft('');
    setFundingInfo(draft.fundingInfo);
    setProductInfo(draft.productInfo);
    setTasteProfile(draft.tasteProfile);
    setProjectPlan(draft.projectPlan);
    setTrustInfo(draft.trustInfo);
    setCreatorInfo(draft.creatorInfo);
    setTaxInfo(draft.taxInfo);
    setUploadedFiles(normalizeUploadedFiles(draft.uploadedFiles));
    setPhoneVerified(true);
    setPhoneVerificationSent(false);
    setPhoneVerificationCode('');
    setPhoneTimer(0);
    setAccountVerified(true);
    appliedEditProjectKeyRef.current = editProjectKey;
  }, [canEditProject, editProject, user]);

  useEffect(() => {
    if (phoneTimer <= 0) return;
    const id = setInterval(() => setPhoneTimer((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [phoneTimer]);

  useEffect(() => {
    const loadTempSaveMeta = async () => {
      const saved = await SafeStorage.getItem(tempSaveKey);
      if (!saved && !isEditMode) {
        try {
          const breweryId = Number(user?.id);
          const response = await getFundingDraftList(Number.isFinite(breweryId) && breweryId > 0 ? breweryId : 1);
          const draft = response.drafts.find((item) => item.status === 'DRAFT');
          if (!draft) return;
          const timestamp = draft.updatedAt || draft.createdAt || new Date().toISOString();
          await SafeStorage.setItem(tempSaveKey, JSON.stringify({
            timestamp,
            serverDraft: {
              draftId: draft.draftId,
              breweryId: draft.breweryId,
              status: draft.status,
              progressRate: draft.progressRate,
              message: response.message,
            },
          }));
          setTempSaveTimestamp(timestamp);
          setHasTempSave(true);
        } catch (error) {
          console.warn(getFundingApiErrorMessage(error, '서버 임시저장 목록을 불러오지 못했습니다.'));
        }
        return;
      }
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        setTempSaveTimestamp(parsed.timestamp || '');
        setHasTempSave(true);
      } catch {
        await SafeStorage.removeItem(tempSaveKey);
      }
    };
    void loadTempSaveMeta();
  }, [isEditMode, tempSaveKey, user?.id]);

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const startDate = parseDate(fundingInfo.startDate);
  const durationInput = Number(fundingInfo.duration);
  const duration = Math.max(1, Number.isFinite(durationInput) ? durationInput : 1);
  const endDate = startDate ? addDays(startDate, duration) : null;
  const endDateText = endDate ? formatDate(endDate) : '';
  const deliveryDate = parseDate(fundingInfo.expectedDeliveryDate);
  const startDateWarning = startDate && startDate < today ? '펀딩 시작일은 오늘 이후 날짜로 입력해주세요.' : '';
  const durationWarning =
    fundingInfo.duration && (!Number.isInteger(durationInput) || durationInput < 1 || durationInput > 365)
      ? '프로젝트 기간은 1일부터 365일까지 입력해주세요.'
      : '';
  const deliveryDateWarning =
    endDate && deliveryDate && deliveryDate <= endDate
      ? '예상 발송 시작일은 펀딩 종료일 이후여야 합니다.'
      : '';
  const filteredAddresses = useMemo(
    () => addressSuggestions.filter((item) => item.address.includes(addressSearch) || item.zipCode.includes(addressSearch)),
    [addressSearch]
  );

  const progress = useMemo(() => {
    let total = 0;
    let completed = 0;
    const filledIngredientRows = productInfo.ingredients.filter((item) => item.ingredient.trim() || item.origin.trim());
    const ingredientsComplete =
      filledIngredientRows.length > 0 &&
      filledIngredientRows.every((item) => item.ingredient.trim().length > 0 && item.origin.trim().length > 0);
    const add = (value: unknown) => {
      total += 1;
      if (typeof value === 'string' ? value.trim().length > 0 : Boolean(value)) completed += 1;
    };

    [
      '막걸리',
      basicInfo.title,
      basicInfo.mainIngredient,
      basicInfo.alcoholContent,
      basicInfo.summary,
      basicInfo.images.length > 0,
      fundingInfo.pricePerBottle,
      fundingInfo.bottleQuantity,
      fundingInfo.goalAmount,
      fundingInfo.startDate,
      fundingInfo.expectedDeliveryDate,
      '막걸리',
      productInfo.volume,
      productInfo.alcoholContent,
      ingredientsComplete,
    ].forEach(add);
    [
      projectPlan.introduction,
      creatorInfo.name,
      creatorInfo.phone,
      creatorInfo.accountBank,
      creatorInfo.accountNumber,
      phoneVerified,
      accountVerified,
      taxInfo.businessType,
      taxInfo.businessName,
      taxInfo.businessNumber,
      taxInfo.ceoName,
      taxInfo.address,
      taxInfo.businessCategory,
      taxInfo.businessItem,
      taxInfo.email,
      trustInfo.projectPolicy,
      trustInfo.expectedDifficulties,
      uploadedFiles.idCard,
      uploadedFiles.businessLicense,
      uploadedFiles.salesPermit,
      uploadedFiles.alcoholPermit,
      uploadedFiles.manufacturingLicense,
    ].forEach(add);

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [
    accountVerified,
    basicInfo,
    creatorInfo.name,
    creatorInfo.phone,
    creatorInfo.accountBank,
    creatorInfo.accountNumber,
    fundingInfo,
    phoneVerified,
    productInfo,
    projectPlan.introduction,
    taxInfo,
    trustInfo,
    uploadedFiles,
  ]);

  const hasBlockingDateWarning = Boolean((!isEditMode && startDateWarning) || durationWarning || deliveryDateWarning);
  const canSubmit = progress >= 100 && !hasBlockingDateWarning;
  const canSendPhoneVerification = isValidProjectPhone(creatorInfo.phone);
  const exitRoute = isEditMode && editProjectId ? `/funding/${editProjectId}` : '/funding';

  const navigateToExitRoute = () => {
    router.replace(exitRoute as any);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const hasUnsavedChanges = () => {
    return Boolean(
      basicInfo.title ||
        basicInfo.tags.length > 0 ||
        tagDraft.trim() ||
        basicInfo.summary ||
        basicInfo.images.length > 0 ||
        fundingInfo.goalAmount ||
        fundingInfo.startDate ||
        productInfo.volume ||
        productInfo.alcoholContent ||
        productInfo.ingredients.some((item) => item.ingredient || item.origin) ||
        projectPlan.introduction ||
        projectPlan.videoUrl ||
        projectPlan.budget ||
        projectPlan.schedule ||
        creatorInfo.name ||
        creatorInfo.profileImage ||
        creatorInfo.phone ||
        creatorInfo.accountBank ||
        creatorInfo.accountNumber ||
        taxInfo.businessName ||
        taxInfo.address ||
        uploadedFiles.profileImage ||
        uploadedFiles.idCard ||
        uploadedFiles.businessLicense ||
        uploadedFiles.salesPermit ||
        uploadedFiles.alcoholPermit ||
        uploadedFiles.manufacturingLicense
    );
  };

  const getReadyTags = () => normalizeProjectTags([...basicInfo.tags, tagDraft]);

  const createDraftPayload = () => ({
    timestamp: new Date().toISOString(),
    basicInfo: {
      ...basicInfo,
      tags: getReadyTags(),
    },
    fundingInfo,
    productInfo,
    tasteProfile,
    projectPlan,
    creatorInfo,
    taxInfo,
    trustInfo,
    uploadedFiles,
    phoneVerified,
    accountVerified,
  });

  const getBreweryId = () => {
    const breweryId = Number(user?.id);
    return Number.isFinite(breweryId) && breweryId > 0 ? breweryId : 1;
  };

  const createDraftApiPayload = () => {
    const alcoholPercentage = Number(basicInfo.alcoholContent);

    return {
      breweryId: getBreweryId(),
      title: basicInfo.title.trim() || undefined,
      shortTitle: basicInfo.shortTitle.trim() || undefined,
      category: basicInfo.category.trim() || '막걸리',
      mainIngredient: basicInfo.mainIngredient.trim() || undefined,
      subIngredient: basicInfo.subIngredient.trim() || undefined,
      alcoholPercentage: Number.isFinite(alcoholPercentage) && basicInfo.alcoholContent.trim() ? alcoholPercentage : undefined,
      summary: basicInfo.summary.trim() || undefined,
    };
  };

  const createDraftUpdateApiPayload = () => {
    const alcoholPercentage = Number(basicInfo.alcoholContent);

    return {
      title: basicInfo.title.trim() || undefined,
      shortTitle: basicInfo.shortTitle.trim() || undefined,
      category: basicInfo.category.trim() || '막걸리',
      mainIngredient: basicInfo.mainIngredient.trim() || undefined,
      subIngredients: basicInfo.subIngredient.trim() ? [basicInfo.subIngredient.trim()] : undefined,
      summary: basicInfo.summary.trim() || undefined,
      alcoholPercentage: Number.isFinite(alcoholPercentage) && basicInfo.alcoholContent.trim() ? alcoholPercentage : undefined,
      thumbnailUrl: basicInfo.images[0] || undefined,
    };
  };

  const getBudgetPlanForApi = () => {
    const parsed = parseBudgetItems(projectPlan.budget)
      .filter((item) => item.item.trim())
      .map((item) => ({ category: item.item, amount: item.amount || Number(fundingInfo.goalAmount) || 1 }));
    return parsed.length > 0 ? parsed : null;
  };

  const getSchedulePlanForApi = () => {
    const parsed = parseScheduleItems(projectPlan.schedule)
      .filter((item) => item.description.trim())
      .map((item, index) => ({
        step: `STEP ${index + 1}`,
        description: item.description,
        date: normalizeProjectDate(item.date) || fundingInfo.startDate,
      }));
    return parsed.length > 0 ? parsed : null;
  };

  const getBreweryInfoForApi = () => {
    const breweryName = creatorInfo.name.trim() || taxInfo.businessName.trim() || user?.breweryName || '';
    const representativeName = taxInfo.ceoName.trim();
    const businessRegistrationNumber = formatBusinessRegistrationNumber(taxInfo.businessNumber);
    const businessNumberDigits = digitsOnly(businessRegistrationNumber);
    const businessAddress = taxInfo.address.trim();
    const contactEmail = taxInfo.email.trim() || user?.email || '';
    const contactPhone = creatorInfo.phone.trim();
    const bankName = creatorInfo.accountBank.trim();
    const accountNumber = creatorInfo.accountNumber.trim();
    const accountHolder = representativeName || breweryName;
    const missingFields: string[] = [];

    if (!breweryName) missingFields.push('창작자/양조장 이름');
    if (!representativeName) missingFields.push('대표자 성명');
    if (businessNumberDigits.length !== 10) missingFields.push('사업자 등록번호 10자리');
    if (!businessAddress) missingFields.push('사업장 소재지');
    if (!contactEmail) missingFields.push('이메일 주소');
    if (!isValidProjectPhone(contactPhone)) missingFields.push('휴대폰 번호');
    if (!bankName) missingFields.push('은행');
    if (!accountNumber) missingFields.push('계좌번호');
    if (!accountHolder) missingFields.push('예금주');

    if (missingFields.length > 0) {
      throw new Error(`양조장 정보에서 ${missingFields.join(', ')}을(를) 확인해주세요.`);
    }

    return {
      breweryName,
      representativeName,
      businessRegistrationNumber,
      businessAddress,
      contactEmail,
      contactPhone,
      bankName,
      accountNumber,
      accountHolder,
    };
  };

  const getDraftId = (draft: any) => {
    const value = Number(draft?.serverDraft?.draftId || draft?.draftId);
    return Number.isFinite(value) && value > 0 ? value : null;
  };

  const shouldCreateNewServerDraft = (error: unknown) => {
    const message = getFundingApiErrorMessage(error, '');
    return message.includes('찾을 수 없습니다') || message.includes('404');
  };

  const syncServerDraft = async (existingDraftId: number | null) => {
    if (existingDraftId) {
      try {
        return await updateFundingDraft(existingDraftId, createDraftUpdateApiPayload());
      } catch (error) {
        if (!shouldCreateNewServerDraft(error)) throw error;
      }
    }
    return createFundingDraft(createDraftApiPayload());
  };

  const ensureServerDraft = async () => {
    const savedDraft = await getSavedDraft();
    const draftId = getDraftId(savedDraft);
    const serverDraft = await syncServerDraft(draftId);
    const draft = {
      ...createDraftPayload(),
      serverDraft,
    };
    await SafeStorage.setItem(tempSaveKey, JSON.stringify(draft));
    setHasTempSave(true);
    setTempSaveTimestamp(draft.timestamp);
    const nextDraftId = getDraftId(draft);
    if (!nextDraftId) {
      throw new Error('서버 임시저장 ID를 확인하지 못했습니다.');
    }
    return nextDraftId;
  };

  const saveProjectSectionsToApi = async (draftId: number) => {
    await saveFundingBasicInfo(draftId, {
      title: basicInfo.title.trim(),
      shortTitle: basicInfo.shortTitle.trim() || undefined,
      category: basicInfo.category.trim() || '막걸리',
      mainIngredient: basicInfo.mainIngredient.trim(),
      subIngredients: basicInfo.subIngredient.trim() ? [basicInfo.subIngredient.trim()] : [],
      alcoholPercentage: Number(basicInfo.alcoholContent),
      summary: basicInfo.summary.trim(),
      thumbnailUrl: basicInfo.images[0],
    });
    await saveFundingSchedule(draftId, {
      pricePerBottle: Number(fundingInfo.pricePerBottle),
      totalQuantity: Number(fundingInfo.bottleQuantity),
      fundingStartDate: fundingInfo.startDate,
      fundingPeriodDays: Number(fundingInfo.duration),
      expectedDeliveryDate: fundingInfo.expectedDeliveryDate,
    });
    await saveFundingLegalInfo(draftId, {
      productType: 'MAKGEOLLI',
      volume: Number(productInfo.volume),
      alcoholPercentage: Number(productInfo.alcoholContent || basicInfo.alcoholContent),
      rawMaterials: productInfo.ingredients
        .filter((item) => item.ingredient.trim() || item.origin.trim())
        .map((item) => ({
          name: item.ingredient.trim(),
          origin: item.origin.trim(),
        })),
    });
    await saveFundingTasteProfile(draftId, {
      sweetness: tasteProfile.sweetness,
      acidity: tasteProfile.acidity,
      body: tasteProfile.body,
      carbonation: tasteProfile.carbonation,
      alcoholIntensity: tasteProfile.aroma,
      flavorNotes: getReadyTags(),
    });
    await saveFundingPlan(draftId, {
      introduction: projectPlan.introduction.trim(),
      budgetPlan: getBudgetPlanForApi(),
      schedulePlan: getSchedulePlanForApi(),
    });
    await saveFundingBreweryInfo(draftId, getBreweryInfoForApi());
    await saveFundingNotices(draftId, {
      refundPolicy: trustInfo.projectPolicy.trim(),
      exchangePolicy: trustInfo.projectPolicy.trim(),
      adultVerificationNotice: '본 프로젝트는 성인인증을 완료한 후원자만 참여할 수 있습니다.',
      riskNotice: trustInfo.expectedDifficulties.trim(),
    });
  };

  const uploadProjectDocumentsToApi = async (draftId: number) => {
    for (const key of DOCUMENT_FILE_KEYS) {
      if (typeof uploadedFiles[key] === 'string' && uploadedFiles[key]) continue;
      const file = getLocalUploadFile(uploadedFiles[key]);
      if (!file) {
        throw new Error('선택한 서류 파일 정보를 찾을 수 없습니다. 서류를 다시 선택해주세요.');
      }
      await uploadFundingDocument(draftId, DOCUMENT_TYPE_BY_FILE_KEY[key], file);
    }
  };

  const applyDraftPayload = (draft: any) => {
    if (draft.basicInfo) {
      setBasicInfo({
        ...draft.basicInfo,
        category: '막걸리',
        shortTitle: draft.basicInfo.shortTitle || '',
        tags: normalizeProjectTags(draft.basicInfo.tags),
      });
      setTagDraft('');
    }
    if (draft.fundingInfo) setFundingInfo(draft.fundingInfo);
    if (draft.productInfo) setProductInfo({ ...draft.productInfo, productType: '막걸리' });
    if (draft.tasteProfile) setTasteProfile(draft.tasteProfile);
    if (draft.projectPlan) setProjectPlan({ ...draft.projectPlan, videoUrl: draft.projectPlan.videoUrl || '' });
    if (draft.creatorInfo) setCreatorInfo(draft.creatorInfo);
    if (draft.taxInfo) setTaxInfo(draft.taxInfo);
    if (draft.trustInfo) setTrustInfo(draft.trustInfo);
    if (draft.uploadedFiles) setUploadedFiles(normalizeUploadedFiles(draft.uploadedFiles));
    setPhoneVerified(Boolean(draft.phoneVerified));
    setAccountVerified(Boolean(draft.accountVerified));
  };

  const getSavedDraft = async () => {
    const saved = await SafeStorage.getItem(tempSaveKey);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      await SafeStorage.removeItem(tempSaveKey);
      setHasTempSave(false);
      setTempSaveTimestamp('');
      return null;
    }
  };

  const saveDraft = async ({ showSavedModal = true, exitAfter = false }: { showSavedModal?: boolean; exitAfter?: boolean } = {}) => {
    setIsSaving(true);
    try {
      const savedDraft = await getSavedDraft();
      const existingDraftId = getDraftId(savedDraft);
      const draft = {
        ...createDraftPayload(),
        serverDraft: savedDraft?.serverDraft || null,
      };
      await SafeStorage.setItem(tempSaveKey, JSON.stringify(draft));
      setHasTempSave(true);
      setTempSaveTimestamp(draft.timestamp);

      let syncError: unknown = null;
      if (!isEditMode) {
        try {
          const serverDraft = await syncServerDraft(existingDraftId);
          await SafeStorage.setItem(tempSaveKey, JSON.stringify({ ...draft, serverDraft }));
        } catch (error) {
          syncError = error;
        }
      }

      if (exitAfter) {
        navigateToExitRoute();
        return;
      }
      if (syncError) {
        showAlert(`기기에는 임시저장되었습니다. 서버 동기화는 실패했어요. ${getFundingApiErrorMessage(syncError, '')}`);
        return;
      }
      if (showSavedModal) {
        setTempSaveMode('saved');
        setShowTempSaveModal(true);
      }
    } catch (error) {
      showAlert(getFundingApiErrorMessage(error, '임시저장 중 문제가 발생했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedDraft = async () => {
    const draft = await getSavedDraft();
    if (!draft) {
      setShowTempSaveModal(false);
      showAlert('불러올 임시저장 내용이 없습니다.');
      return;
    }
    const draftId = getDraftId(draft);
    try {
      if (draftId) {
        const preview = await getFundingDraftPreview(draftId);
        const serverDraft = createProjectDraftFromServerPreview(preview, user);
        await SafeStorage.setItem(tempSaveKey, JSON.stringify(serverDraft));
        applyDraftPayload(serverDraft);
        setTempSaveTimestamp(serverDraft.timestamp || '');
      } else {
        applyDraftPayload(draft);
        setTempSaveTimestamp(draft.timestamp || '');
      }
      setHasTempSave(true);
      setShowTempSaveModal(false);
      showAlert('임시저장 내용을 불러왔습니다.');
    } catch (error) {
      if (draft.basicInfo) {
        applyDraftPayload(draft);
        setTempSaveTimestamp(draft.timestamp || '');
        setHasTempSave(true);
        setShowTempSaveModal(false);
        showAlert('기기에 저장된 임시저장 내용을 불러왔습니다. 서버 임시저장은 불러오지 못했어요.');
        return;
      }
      showAlert(getFundingApiErrorMessage(error, '임시저장 내용을 불러오지 못했습니다.'));
    }
  };

  const deleteSavedDraft = async () => {
    const draft = await getSavedDraft();
    const draftId = getDraftId(draft);
    if (draftId && !isEditMode) {
      try {
        await deleteFundingDraft(draftId);
      } catch (error) {
        const message = getFundingApiErrorMessage(error, '');
        if (!message.includes('찾을 수 없습니다') && !message.includes('404')) {
          showAlert(message || '서버 임시저장 삭제 중 문제가 발생했습니다.');
          return;
        }
      }
    }
    await SafeStorage.removeItem(tempSaveKey);
    setHasTempSave(false);
    setTempSaveTimestamp('');
    setShowTempSaveModal(false);
    showAlert('임시저장 내용이 삭제되었습니다.');
  };

  const overwriteSavedDraft = async () => {
    setShowTempSaveModal(false);
    await saveDraft({ showSavedModal: true });
  };

  const updateFundingPrice = (key: 'pricePerBottle' | 'bottleQuantity', value: string) => {
    const next = { ...fundingInfo, [key]: digitsOnly(value) };
    const price = Number(next.pricePerBottle) || 0;
    const quantity = Number(next.bottleQuantity) || 0;
    next.goalAmount = price && quantity ? String(price * quantity) : '';
    setFundingInfo(next);
  };

  const handleExit = async () => {
    if (hasUnsavedChanges()) {
      const savedDraft = await getSavedDraft();
      if (savedDraft) {
        setTempSaveTimestamp(savedDraft.timestamp || tempSaveTimestamp);
        setHasTempSave(true);
        setTempSaveMode('exitExisting');
        setShowTempSaveModal(true);
        return;
      }
      setShowExitConfirm(true);
      return;
    }
    navigateToExitRoute();
  };

  const handleSave = async () => {
    const savedDraft = await getSavedDraft();
    if (savedDraft || hasTempSave) {
      setTempSaveTimestamp(savedDraft?.timestamp || tempSaveTimestamp);
      setHasTempSave(true);
      setTempSaveMode('existing');
      setShowTempSaveModal(true);
      return;
    }
    await saveDraft({ showSavedModal: true });
  };

  const handleSaveAndExit = async () => {
    setShowExitConfirm(false);
    await saveDraft({ showSavedModal: false, exitAfter: true });
  };

  const handleExitWithoutSave = () => {
    setShowExitConfirm(false);
    setShowTempSaveModal(false);
    navigateToExitRoute();
  };

  const loadBreweryInfo = () => {
    if (!user || user.type !== 'brewery') return;
    const loadedBreweryName = user.breweryName || '';
    const loadedAddress = [user.breweryLocation, user.breweryLocationDetail].filter(Boolean).join(' ');
    const loadedCeoName = user.name && user.name !== loadedBreweryName ? user.name : '';

    setCreatorInfo((prev) => ({
      ...prev,
      name: loadedBreweryName,
      profileImage: '',
      bio: '',
      phone: '',
      accountBank: '',
      accountNumber: '',
    }));
    setTaxInfo((prev) => ({
      ...prev,
      businessType: 'corporation',
      businessName: loadedBreweryName,
      businessNumber: user.businessNumber || '',
      ceoName: loadedCeoName,
      address: loadedAddress,
      businessCategory: '',
      businessItem: '',
      email: user.email || '',
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      profileImage: '',
      idCard: '',
    }));
    setPhoneVerified(false);
    setPhoneVerificationSent(false);
    setPhoneVerificationCode('');
    setPhoneTimer(0);
    setAccountVerified(false);
    showAlert('양조장 정보를 불러왔습니다. 본인 인증과 입금 계좌는 직접 입력해주세요.');
  };

  const handleImageFileUpload = async () => {
    if (basicInfo.images.length >= 5) {
      showAlert('대표 이미지는 최대 5개까지 등록할 수 있습니다.');
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert('대표 이미지를 등록하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      const remainingCount = 5 - basicInfo.images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: remainingCount,
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) return;

      const selectedImages = result.assets
        .map((asset) => asset.uri)
        .filter(Boolean)
        .slice(0, remainingCount);

      if (!selectedImages.length) return;

      setBasicInfo((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedImages].slice(0, 5),
      }));
    } catch {
      showAlert('이미지를 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleGenerateAiImage = () => {
    showAlert('AI 이미지 생성 API 연결 후 사용할 수 있습니다. 지금은 직접 이미지를 업로드해주세요.');
  };

  const moveProjectImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setBasicInfo((prev) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.images.length ||
        toIndex >= prev.images.length
      ) {
        return prev;
      }
      const images = [...prev.images];
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);
      return { ...prev, images };
    });
  };

  const removeProjectImage = (index: number) => {
    setIsImageReordering(false);
    setBasicInfo((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addTag = (tag: string) => {
    const next = tag.trim();
    if (!next || basicInfo.tags.includes(next) || basicInfo.tags.length >= 10) return;
    setBasicInfo((prev) => ({ ...prev, tags: [...prev.tags, next] }));
  };

  const submitTag = () => {
    const next = tagDraft.trim();
    if (!next) return;
    addTag(next);
    setTagDraft('');
  };

  const addIngredient = () => {
    setProductInfo((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: Date.now(), ingredient: '', origin: '' }],
    }));
  };

  const removeIngredient = (id: number) => {
    if (productInfo.ingredients.length <= 1) return;
    setProductInfo((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((item) => item.id !== id),
    }));
  };

  const updateIngredient = (id: number, key: 'ingredient' | 'origin', value: string) => {
    setProductInfo((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }));
  };

  const handleSendPhoneVerification = () => {
    if (!canSendPhoneVerification) {
      showAlert('휴대폰 번호를 정확히 입력해주세요.');
      return;
    }
    const wasAlreadySent = phoneVerificationSent;
    setPhoneVerificationSent(true);
    setPhoneVerificationCode('');
    setPhoneTimer(180);
    showAlert(wasAlreadySent ? '인증번호가 재전송되었습니다.' : '인증번호가 전송되었습니다.');
  };

  const handleVerifyPhone = () => {
    if (!phoneVerificationCode) {
      showAlert('인증번호를 입력해주세요.');
      return;
    }
    if (phoneVerificationCode === '1234') {
      setPhoneVerified(true);
      setPhoneTimer(0);
      showAlert('인증이 완료되었습니다.');
      return;
    }
    showAlert('인증번호가 일치하지 않습니다.');
  };

  const handleVerifyAccount = () => {
    if (!creatorInfo.accountBank || !creatorInfo.accountNumber) {
      showAlert('은행과 계좌번호를 입력해주세요.');
      return;
    }
    setAccountVerified(true);
    showAlert('인증완료!');
  };

  const handlePickProfileFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showAlert('프로필 이미지를 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const fileName = asset.fileName || `brewery_profile_${Date.now()}.jpg`;
      setCreatorInfo((prev) => ({ ...prev, profileImage: asset.uri }));
      setUploadedFiles((prev) => ({ ...prev, profileImage: { name: fileName, uri: asset.uri, mimeType: asset.mimeType || getMimeTypeFromFileName(fileName) } }));
      showAlert('프로필 이미지가 선택되었습니다.');
    } catch {
      showAlert('이미지를 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleTakeProfilePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showAlert('프로필 사진을 촬영하려면 카메라 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const fileName = asset.fileName || `brewery_profile_camera_${Date.now()}.jpg`;
      setCreatorInfo((prev) => ({ ...prev, profileImage: asset.uri }));
      setUploadedFiles((prev) => ({ ...prev, profileImage: { name: fileName, uri: asset.uri, mimeType: asset.mimeType || getMimeTypeFromFileName(fileName) } }));
      showAlert('프로필 사진이 등록되었습니다.');
    } catch {
      showAlert('카메라를 실행하지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleProfileImageUpload = () => {
    setShowProfileImagePickerModal(true);
  };

  const handleDocumentUpload = async (key: FileKey) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: DOCUMENT_PICKER_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) return;

      const selectedFile = result.assets[0];
      const fileName = selectedFile.name || '선택한 파일';
      if (!isSupportedDocumentFile(fileName, selectedFile.mimeType)) {
        showAlert('PDF, JPG, PNG 파일만 등록할 수 있습니다.');
        return;
      }
      if (selectedFile.size && selectedFile.size > MAX_DOCUMENT_FILE_SIZE) {
        showAlert('5MB 이하 파일만 등록할 수 있습니다.');
        return;
      }
      setUploadedFiles((prev) => ({
        ...prev,
        [key]: {
          name: fileName,
          uri: selectedFile.uri,
          mimeType: selectedFile.mimeType || getMimeTypeFromFileName(fileName),
          size: selectedFile.size,
        },
      }));
    } catch {
      showAlert('파일을 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleSelectAddress = (zipCode: string, address: string) => {
    setTaxInfo((prev) => ({ ...prev, address: `(${zipCode}) ${address}` }));
    setAddressSearch('');
    setShowAddressModal(false);
  };

  const handleUseManualAddress = () => {
    const nextAddress = addressSearch.trim();
    if (!nextAddress) {
      showAlert('주소를 입력해주세요.');
      return;
    }
    setTaxInfo((prev) => ({ ...prev, address: nextAddress }));
    setAddressSearch('');
    setShowAddressModal(false);
  };

  const handleNativeFundingDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setDatePickerTarget(null);
      return;
    }
    if (!datePickerTarget || !selectedDate) return;
    setFundingInfo((prev) => ({ ...prev, [datePickerTarget]: formatDate(selectedDate) }));
    if (Platform.OS !== 'ios') {
      setDatePickerTarget(null);
    }
  };

  const buildProjectPayload = (mode: 'create' | 'edit'): Omit<FundingProject, 'id'> => {
    const budgetItems = parseBudgetItems(projectPlan.budget);
    const scheduleItems = parseScheduleItems(projectPlan.schedule);
    const image = basicInfo.images[0] || editProject?.image || '';
    const quantity = Number(fundingInfo.bottleQuantity) || editProject?.targetQuantity || editProject?.totalQuantity || 0;
    const goalAmount = Number(fundingInfo.goalAmount) || editProject?.goalAmount || 0;
    const projectCategory = '막걸리';
    const projectProductType = '막걸리';

    return {
      title: basicInfo.title,
      shortTitle: basicInfo.shortTitle,
      brewery: creatorInfo.name || user?.breweryName || editProject?.brewery || '',
      breweryLogo: editProject?.breweryLogo || '🍶',
      location: taxInfo.address || editProject?.location || user?.breweryLocation || '',
      category: projectCategory,
      creatorId: editProject?.creatorId || user?.id,
      breweryId: editProject?.breweryId || user?.uid,
      favoriteCount: editProject?.favoriteCount || 0,
      shortDescription: basicInfo.summary,
      image,
      images: basicInfo.images,
      localImage: mode === 'edit' ? undefined : editProject?.localImage,
      popularRank: editProject?.popularRank,
      goalAmount,
      currentAmount: mode === 'edit' ? editProject?.currentAmount || 0 : 0,
      backers: mode === 'edit' ? editProject?.backers || 0 : 0,
      daysLeft: Number(fundingInfo.duration) || editProject?.daysLeft || 0,
      status: mode === 'edit' ? editProject?.status || '심사 중' : TEMP_CREATED_PROJECT_STATUS,
      startDate: fundingInfo.startDate,
      endDate: endDateText,
      pricePerBottle: Number(fundingInfo.pricePerBottle) || 0,
      bottleSize: volumeText(productInfo.volume),
      volume: volumeText(productInfo.volume),
      alcoholContent: alcoholText(productInfo.alcoholContent || basicInfo.alcoholContent),
      totalQuantity: quantity,
      targetQuantity: quantity,
      estimatedDelivery: fundingInfo.expectedDeliveryDate,
      rewardItems: [`${basicInfo.title} ${volumeText(productInfo.volume)} x 1`.trim()],
      shippingFee: FIXED_PROJECT_SHIPPING_FEE,
      mainIngredients: basicInfo.mainIngredient,
      subIngredients: basicInfo.subIngredient,
      tags: getReadyTags(),
      projectSummary: basicInfo.summary,
      introduction: projectPlan.introduction,
      story: projectPlan.introduction,
      videoUrl: projectPlan.videoUrl.trim() || undefined,
      projectPolicy: trustInfo.projectPolicy,
      expectedDifficulties: trustInfo.expectedDifficulties,
      rewardDetails: editProject?.rewardDetails,
      budget: budgetItems,
      schedule: scheduleItems,
      tasteProfile,
      team: editProject?.team,
      breweryBio: creatorInfo.bio,
      breweryProfileImage: creatorInfo.profileImage,
      productType: projectProductType,
      ingredients: productInfo.ingredients,
      journals: mode === 'edit' ? editProject?.journals || [] : [],
      createdAt: mode === 'edit' ? editProject?.createdAt : undefined,
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowSubmitConfirm(true);
  };

  const handleOpenPreview = () => {
    setShowPreview(true);
    if (isEditMode) return;
    void (async () => {
      try {
        const draftId = await ensureServerDraft();
        await getFundingDraftPreview(draftId);
      } catch (error) {
        console.warn(getFundingApiErrorMessage(error, '프로젝트 미리보기를 서버와 동기화하지 못했습니다.'));
      }
    })();
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    setIsSubmitting(true);
    setSubmitSyncWarning('');
    try {
      let convertedFunding: Awaited<ReturnType<typeof createRecipeFunding>>['funding'] | null = null;
      if (!isEditMode) {
        try {
          const draftId = await ensureServerDraft();
          await saveProjectSectionsToApi(draftId);
          await uploadProjectDocumentsToApi(draftId);
          await submitFundingDraft(draftId);
          if (sourceRecipeId && Number.isFinite(sourceRecipeId)) {
            const response = await createRecipeFunding(sourceRecipeId, {
              title: basicInfo.title,
              description: projectPlan.introduction || basicInfo.summary,
              goal_amount: Number(fundingInfo.goalAmount),
              start_date: fundingInfo.startDate,
              end_date: endDateText,
            });
            convertedFunding = response.funding;
          }
        } catch (error) {
          const serverSyncError = getFundingApiErrorMessage(error, '서버 동기화 중 문제가 발생했습니다.')
            .replace(/펀딩 프로젝트 임시저장/g, '펀딩 프로젝트 제출 준비')
            .replace(/임시저장/g, '제출 준비');
          throw new Error(serverSyncError);
        }
      }
      if (isEditMode && editProjectId) {
        await updateFundingProjectApi(editProjectId, {
          title: basicInfo.title.trim(),
          description: projectPlan.introduction.trim() || basicInfo.summary.trim(),
          thumbnailUrl: basicInfo.images[0] || undefined,
          goalAmount: Number(fundingInfo.goalAmount),
          startDate: fundingInfo.startDate,
          endDate: endDateText,
          pricePerBottle: Number(fundingInfo.pricePerBottle),
          shippingFee: FIXED_PROJECT_SHIPPING_FEE,
        });
      }
      const payload = buildProjectPayload(isEditMode ? 'edit' : 'create');
      if (!isEditMode && convertedFunding) {
        const convertedProject: FundingProject = {
          ...payload,
          id: convertedFunding.funding_id,
          goalAmount: convertedFunding.goal_amount,
          currentAmount: convertedFunding.current_amount,
          status: TEMP_CREATED_PROJECT_STATUS,
          startDate: convertedFunding.start_date,
          endDate: convertedFunding.end_date,
        };
        mergeProjects([convertedProject]);
        setCreatedProjectId(convertedProject.id);
        void SafeStorage.removeItem(tempSaveKey);
        setHasTempSave(false);
        setTempSaveTimestamp('');
        setSubmitSyncWarning('');
        setShowSubmitSuccess(true);
        return;
      }
      const submittedProject = isEditMode && editProjectId ? updateProject(editProjectId, payload) : addProject(payload);
      if (!submittedProject) {
        showAlert('수정할 펀딩 게시글을 찾을 수 없습니다.');
        return;
      }
      setCreatedProjectId(submittedProject.id);
      void SafeStorage.removeItem(tempSaveKey);
      setHasTempSave(false);
      setTempSaveTimestamp('');
      setSubmitSyncWarning('');
      setShowSubmitSuccess(true);
    } catch (error) {
      const message = getFundingApiErrorMessage(error, '펀딩 프로젝트 제출 중 문제가 발생했습니다.')
        .replace(/펀딩 프로젝트 임시저장/g, '펀딩 프로젝트 제출 준비')
        .replace(/임시저장/g, '제출 준비');
      showAlert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSuccessClose = () => {
    setShowSubmitSuccess(false);
    if (createdProjectId) {
      router.replace(`/funding/${createdProjectId}?fromProjectForm=1` as any);
      return;
    }
    router.replace('/funding' as any);
  };

  if (!user || user.type !== 'brewery') {
    return (
      <GuardNotice
        insetsTop={insets.top}
        title="양조장 계정이 필요합니다"
        description="펀딩 프로젝트 생성은 양조장 계정으로 로그인한 뒤 이용할 수 있습니다."
        primaryLabel="로그인으로 이동"
        onPrimaryPress={() => router.replace('/(auth)/login' as any)}
      />
    );
  }

  if (!user.isBreweryVerified) {
    return (
      <GuardNotice
        insetsTop={insets.top}
        title="양조장 인증이 필요합니다"
        description="프로젝트를 생성하려면 사업자 정보와 연락처 인증을 먼저 완료해주세요."
        primaryLabel="양조장 인증하기"
        onPrimaryPress={() => router.push('/brewery/verification' as any)}
      />
    );
  }

  if (isEditMode && !editProject) {
    return (
      <GuardNotice
        insetsTop={insets.top}
        title="프로젝트를 찾을 수 없습니다"
        description="수정하려는 펀딩 게시글 정보를 찾을 수 없어요."
        primaryLabel="펀딩으로 이동"
        onPrimaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  if (isEditMode && editProject && !canEditProject) {
    return (
      <GuardNotice
        insetsTop={insets.top}
        title="수정 권한이 없습니다"
        description="본인이 만든 펀딩 프로젝트만 수정할 수 있어요."
        primaryLabel="펀딩으로 이동"
        onPrimaryPress={() => router.replace('/funding' as any)}
      />
    );
  }

  const renderTab = () => {
    if (activeTab === 'basic') {
      return (
        <View style={styles.tabContent}>
          <InfoBox
            tone="blue"
            title="프로젝트 심사 기준 안내"
            lines={[
              '전통주 제조 면허증 및 통신판매 신고증이 있어야 합니다',
              '프로젝트 내용과 리워드가 명확하게 작성되어야 합니다',
              '발송 일정 및 환불 정책이 구체적으로 명시되어야 합니다',
              '현재 테스트 기간에는 제출 즉시 후원 가능한 상태로 표시됩니다',
            ]}
          />
          <InfoBox tone="red" title="전통주 프로젝트 필수 설정" body="19세 이상 성인만 후원 가능합니다." compact />
          <Field
            label="프로젝트 카테고리"
            required
            value={basicInfo.category}
            onChangeText={() => undefined}
            placeholder="막걸리"
            editable={false}
            helper={isEditMode ? '기존 펀딩 게시글의 카테고리는 수정 화면에서 변경하지 않습니다.' : '현재 주담 펀딩은 막걸리 프로젝트만 등록합니다.'}
          />
          <Field
            label="프로젝트 제목"
            required
            value={basicInfo.title}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, title: value }))}
            placeholder="프로젝트명을 입력하세요"
            maxLength={50}
            counter={`${basicInfo.title.length}/50자`}
          />
          <Field
            label="짧은 제목 (선택)"
            helper="목록에서 표시될 짧은 제목입니다."
            value={basicInfo.shortTitle}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, shortTitle: value }))}
            placeholder="벚꽃 막걸리"
            maxLength={20}
          />
          <Field
            label="메인 재료"
            required
            value={basicInfo.mainIngredient}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, mainIngredient: value }))}
            placeholder="예: 국내산 쌀"
          />
          <Field
            label="서브 재료 (선택)"
            value={basicInfo.subIngredient}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, subIngredient: value }))}
            placeholder="예: 복숭아, 누룩"
          />
          <Field
            label="도수"
            required
            value={basicInfo.alcoholContent}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, alcoholContent: decimalOnly(value).slice(0, 5) }))}
            placeholder="6"
            keyboardType="decimal-pad"
            suffix="%"
          />
          <TextArea
            label="프로젝트 요약"
            required
            value={basicInfo.summary}
            onChangeText={(value) => setBasicInfo((prev) => ({ ...prev, summary: value }))}
            placeholder="프로젝트를 한 문장으로 소개해주세요."
            maxLength={150}
            counter={`${basicInfo.summary.length}/150자`}
            minHeight={92}
          />
          <View style={styles.formGroup}>
            <View style={styles.rowBetween}>
              <RequiredLabel label="프로젝트 대표 이미지" required />
              <View style={styles.imageHeaderActions}>
                <TouchableOpacity
                  style={[styles.loadButton, basicInfo.images.length >= 5 && styles.disabledButton]}
                  onPress={handleGenerateAiImage}
                  disabled={basicInfo.images.length >= 5}
                >
                  <Text style={styles.loadButtonText}>AI 생성</Text>
                </TouchableOpacity>
                <Text style={styles.smallMuted}>{basicInfo.images.length}/5</Text>
              </View>
            </View>
            <Text style={styles.helper}>번호 뱃지를 누른 채 좌우로 움직이면 순서를 변경할 수 있습니다. 첫 번째 이미지가 대표 이미지로 표시됩니다.</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={!isImageReordering}
              contentContainerStyle={styles.imageRail}
            >
              {basicInfo.images.length < 5 && (
                <TouchableOpacity style={styles.imagePicker} onPress={handleImageFileUpload}>
                  <Upload size={24} color="#9CA3AF" />
                  <Text style={styles.imagePickerText}>이미지 추가</Text>
                </TouchableOpacity>
              )}
              {basicInfo.images.map((img, index) => (
                <ReorderableProjectImage
                  key={`${img}-${index}`}
                  uri={img}
                  index={index}
                  total={basicInfo.images.length}
                  onMove={moveProjectImage}
                  onRemove={removeProjectImage}
                  onDragStateChange={setIsImageReordering}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>검색 태그 <Text style={styles.optionalText}>(선택)</Text></Text>
            <View style={styles.tagList}>
              {basicInfo.tags.map((tag, index) => (
                <View key={`${tag}-${index}`} style={styles.tagChip}>
                  <Tag size={12} color="#111" />
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => setBasicInfo((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}
                  >
                    <X size={12} color="#111" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TextInput
              style={styles.input}
              value={tagDraft}
              onChangeText={setTagDraft}
              placeholder="태그를 입력하고 Enter"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={submitTag}
              onBlur={submitTag}
            />
          </View>
        </View>
      );
    }

    if (activeTab === 'funding') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.twoCol}>
            <View style={styles.twoColItem}>
              <Field
                label="각 병당 얼마 (원)"
                required
                smallLabel
                value={fundingInfo.pricePerBottle}
                onChangeText={(value) => updateFundingPrice('pricePerBottle', value)}
                placeholder="30000"
                keyboardType="number-pad"
                suffix="원"
              />
            </View>
            <View style={styles.twoColItem}>
              <Field
                label="몇 병"
                required
                smallLabel
                value={fundingInfo.bottleQuantity}
                onChangeText={(value) => updateFundingPrice('bottleQuantity', value)}
                placeholder="500"
                keyboardType="number-pad"
                suffix="병"
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.inlineLabelRow}>
              <RequiredLabel label="목표 금액" required />
              <View style={styles.bluePill}>
                <Text style={styles.bluePillText}>자동 계산됨</Text>
              </View>
            </View>
            <View style={styles.inputWithSuffix}>
              <TextInput
                style={styles.inputFlex}
                value={fundingInfo.goalAmount ? currency(fundingInfo.goalAmount) : ''}
                placeholder="병당 가격 × 수량"
                placeholderTextColor="#9CA3AF"
                editable={false}
              />
              <Text style={styles.suffix}>원</Text>
            </View>
            <View style={styles.blueHint}>
              <Text style={styles.blueHintText}>💡 수수료: 플랫폼 7%가 차감됩니다.</Text>
            </View>
          </View>
          <DateField
            label="펀딩 시작일"
            required
            value={fundingInfo.startDate}
            onChangeText={(value) => setFundingInfo((prev) => ({ ...prev, startDate: value }))}
            onOpenCalendar={() => setDatePickerTarget('startDate')}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            helper={startDateWarning || undefined}
            warning={Boolean(startDateWarning)}
          />
          <Field
            label="프로젝트 기간"
            value={fundingInfo.duration}
            onChangeText={(value) => setFundingInfo((prev) => ({ ...prev, duration: digitsOnly(value) }))}
            placeholder="펀딩 기간을 입력하세요"
            keyboardType="number-pad"
            suffix="일"
            helper={durationWarning || '1일부터 365일까지 입력 가능합니다.'}
            warning={Boolean(durationWarning)}
          />
          <View style={styles.formGroup}>
            <Text style={styles.label}>펀딩 종료일</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText}>{endDateText || '시작일을 선택하면 자동으로 계산됩니다'}</Text>
            </View>
          </View>
          {Boolean(deliveryDateWarning) && (
            <View style={styles.redNotice}>
              <AlertCircle size={16} color="#DC2626" />
              <Text style={styles.redNoticeText}>{deliveryDateWarning}</Text>
            </View>
          )}
          <DateField
            label="예상 발송 시작일"
            required
            value={fundingInfo.expectedDeliveryDate}
            onChangeText={(value) => setFundingInfo((prev) => ({ ...prev, expectedDeliveryDate: value }))}
            onOpenCalendar={() => setDatePickerTarget('expectedDeliveryDate')}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            helper={deliveryDateWarning || '펀딩 종료일 이후 날짜를 입력해주세요.'}
            warning={Boolean(deliveryDateWarning)}
          />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>일정 요약</Text>
            <SummaryRow label="펀딩 시작" value={fundingInfo.startDate || '-'} />
            <SummaryRow label="펀딩 종료" value={endDateText || '-'} />
            <SummaryRow label="배송 시작 예정" value={fundingInfo.expectedDeliveryDate || '-'} />
          </View>
        </View>
      );
    }

    if (activeTab === 'rewards') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.grayGuide}>
            <Text style={styles.grayGuideText}>💡 제품의 법적 고시 정보와 구성 원재료를 입력해주세요. 구성요소는 여러 개 추가할 수 있습니다.</Text>
          </View>
          <View style={styles.borderCard}>
            <Text style={styles.cardTitle}>법적 고시 정보</Text>
            <View style={styles.legalStack}>
              <LegalField label="상품 분류" required value={productInfo.productType} onChangeText={() => undefined} placeholder="막걸리" editable={false} />
              <View style={styles.legalTwoCol}>
                <LegalField
                  label="용량"
                  required
                  value={productInfo.volume}
                  onChangeText={(value) => setProductInfo((prev) => ({ ...prev, volume: digitsOnly(value).slice(0, 5) }))}
                  placeholder="예: 750"
                  keyboardType="number-pad"
                  suffix="ml"
                />
                <LegalField
                  label="도수"
                  required
                  value={productInfo.alcoholContent}
                  onChangeText={(value) => setProductInfo((prev) => ({ ...prev, alcoholContent: decimalOnly(value).slice(0, 5) }))}
                  placeholder="예: 6"
                  keyboardType="decimal-pad"
                  suffix="%"
                />
              </View>
              <View style={styles.legalSectionDivider}>
                <Text style={styles.legalSectionTitle}>구성요소 (원재료) <Text style={styles.required}>*</Text></Text>
                <View style={styles.ingredientList}>
                  {productInfo.ingredients.map((item, index) => (
                    <View key={item.id} style={styles.ingredientCard}>
                      {productInfo.ingredients.length > 1 && (
                        <TouchableOpacity style={styles.ingredientDelete} onPress={() => removeIngredient(item.id)}>
                          <X size={16} color="#6B7280" />
                        </TouchableOpacity>
                      )}
                      <View style={styles.ingredientFields}>
                        <LegalField
                          label="주 소재"
                          required
                          value={item.ingredient}
                          onChangeText={(value) => updateIngredient(item.id, 'ingredient', value)}
                          placeholder="예: 쌀(국산)"
                        />
                        <LegalField
                          label="원산지"
                          required
                          value={item.origin}
                          onChangeText={(value) => updateIngredient(item.id, 'origin', value)}
                          placeholder="예: 경기도 양평"
                        />
                      </View>
                      <Text style={styles.ingredientIndex}>구성요소 {index + 1}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.dashedFullButton} onPress={addIngredient}>
            <Plus size={16} color="#4B5563" />
            <Text style={styles.dashedFullButtonText}>구성요소 추가</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'taste') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.grayGuide}>
            <Text style={styles.grayGuideText}>💡 이 전통주의 맛을 표현해주세요. 각 지표를 조절하면 실시간으로 레이더 차트에 반영됩니다.</Text>
          </View>
          <View style={styles.tasteControlList}>
            {[
              { key: 'sweetness', label: '단맛', desc: '달콤한 정도' },
              { key: 'aroma', label: '잔향', desc: '향이 나는 정도' },
              { key: 'acidity', label: '산미', desc: '산뜻한 정도' },
              { key: 'body', label: '바디감', desc: '묵직함과 풍미' },
              { key: 'carbonation', label: '탄산감', desc: '탄산 느낌' },
            ].map((taste) => (
              <TasteControl
                key={taste.key}
                label={taste.label}
                desc={taste.desc}
                value={tasteProfile[taste.key as keyof typeof tasteProfile]}
                onChange={(next) => setTasteProfile((prev) => ({ ...prev, [taste.key]: next }))}
              />
            ))}
          </View>
          <View style={styles.radarCard}>
            <Text style={styles.radarTitle}>맛 지표 미리보기</Text>
            <RadarChart tasteProfile={tasteProfile} />
          </View>
        </View>
      );
    }

    if (activeTab === 'plan') {
      return (
        <View style={styles.tabContent}>
          <TextArea
            label="프로젝트 소개"
            required
            value={projectPlan.introduction}
            onChangeText={(value) => setProjectPlan((prev) => ({ ...prev, introduction: value }))}
            placeholder="프로젝트에 대해 자세히 설명해주세요..."
            minHeight={190}
            guideLines={[
              '무엇을 만들기 위한 프로젝트인가요?',
              '프로젝트를 간단히 소개한다면?',
              '이 프로젝트가 왜 의미있나요?',
              '이 프로젝트를 시작하게 된 배경은?',
            ]}
          />
          <TextArea
            label="프로젝트 예산 (선택)"
            value={projectPlan.budget}
            onChangeText={(value) => setProjectPlan((prev) => ({ ...prev, budget: value }))}
            placeholder={'예시:\n- 원료비: 200만원\n- 인건비: 150만원\n- 포장비: 100만원'}
            minHeight={150}
            helper="목표 금액을 어디에 사용할지 구체적으로 작성해주세요."
            mono
          />
          <Field
            label="프로젝트 영상 URL (선택)"
            value={projectPlan.videoUrl}
            onChangeText={(value) => setProjectPlan((prev) => ({ ...prev, videoUrl: value }))}
            placeholder="영상 링크를 입력해주세요."
            helper="동영상 플레이어를 넣지 않고 URL만 게시글에 표시합니다."
            keyboardType="url"
          />
          <TextArea
            label="프로젝트 일정 (선택)"
            value={projectPlan.schedule}
            onChangeText={(value) => setProjectPlan((prev) => ({ ...prev, schedule: value }))}
            placeholder={'예시:\n- 4월 1일: 발효 시작\n- 4월 20일: 1차 숙성 완료\n- 5월 10일: 병입 작업\n- 5월 20일: 라벨링 및 포장\n- 6월 1일: 배송 시작'}
            minHeight={190}
            mono
          />
        </View>
      );
    }

    if (activeTab === 'creator') {
      return (
        <View style={styles.tabContent}>
          <View style={styles.formGroup}>
            <View style={styles.rowBetween}>
              <RequiredLabel label="창작자 이름" required />
              <TouchableOpacity style={styles.loadButton} onPress={loadBreweryInfo}>
                <Text style={styles.loadButtonText}>불러오기</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={creatorInfo.name}
              onChangeText={(value) => setCreatorInfo((prev) => ({ ...prev, name: value }))}
              placeholder="꽃샘양조장"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>프로필 이미지 <Text style={styles.optionalText}>(선택)</Text></Text>
            <View style={styles.profileUploadRow}>
              <View style={styles.profileImageBox}>
                {creatorInfo.profileImage ? (
                  <Image source={{ uri: creatorInfo.profileImage }} style={styles.profileImage} />
                ) : (
                  <User size={32} color="#9CA3AF" />
                )}
              </View>
              <TouchableOpacity style={styles.blackSmallButton} onPress={handleProfileImageUpload}>
                <Text style={styles.blackSmallButtonText}>이미지 업로드</Text>
              </TouchableOpacity>
            </View>
            {Boolean(uploadedFiles.profileImage) && <Text style={styles.helper}>선택됨: {getUploadedFileName(uploadedFiles.profileImage)}</Text>}
          </View>
          <TextArea
            label="창작자 소개 (선택)"
            value={creatorInfo.bio}
            onChangeText={(value) => setCreatorInfo((prev) => ({ ...prev, bio: value }))}
            placeholder="양조장을 소개해주세요..."
            minHeight={110}
          />
          <View style={styles.formGroup}>
            <RequiredLabel label="본인 인증" required />
            <Text style={styles.smallSubLabel}>휴대폰 번호</Text>
            <View style={styles.inlineRow}>
              <TextInput
                style={[styles.input, styles.inlineInput]}
                value={creatorInfo.phone}
                onChangeText={(value) => {
                  setCreatorInfo((prev) => ({ ...prev, phone: formatProjectPhone(value) }));
                  setPhoneVerified(false);
                  setPhoneVerificationSent(false);
                  setPhoneVerificationCode('');
                  setPhoneTimer(0);
                }}
                placeholder="010-1234-5678"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                editable={!phoneVerified}
              />
              {!phoneVerified ? (
                <TouchableOpacity
                  style={[styles.inlineBlackButton, !canSendPhoneVerification && styles.disabledButton]}
                  onPress={handleSendPhoneVerification}
                  disabled={!canSendPhoneVerification}
                >
                  <Text style={styles.inlineBlackButtonText}>{phoneVerificationSent ? '인증번호 재전송' : '인증하기'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.doneBadge}>
                  <Text style={styles.doneBadgeText}>인증완료!</Text>
                </View>
              )}
            </View>
            {Boolean(creatorInfo.phone) && !canSendPhoneVerification && !phoneVerified && (
              <Text style={styles.warningText}>올바른 휴대폰 번호를 입력하면 인증하기 버튼이 활성화됩니다.</Text>
            )}
            {phoneVerificationSent && !phoneVerified && (
              <View style={styles.verificationBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.smallSubLabel}>인증번호</Text>
                  {phoneTimer > 0 && (
                    <View style={styles.timerRow}>
                      <Clock size={12} color="#DC2626" />
                      <Text style={styles.timerText}>{Math.floor(phoneTimer / 60)}:{String(phoneTimer % 60).padStart(2, '0')}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.inlineRow}>
                  <TextInput
                    style={[styles.input, styles.inlineInput]}
                    value={phoneVerificationCode}
                    onChangeText={(value) => setPhoneVerificationCode(digitsOnly(value))}
                    placeholder="인증번호 입력"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity style={styles.inlineBlackButton} onPress={handleVerifyPhone}>
                    <Text style={styles.inlineBlackButtonText}>인증하기</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.helper}>* 테스트용 인증번호: 1234</Text>
              </View>
            )}
            <View style={styles.formGroup}>
              <Text style={styles.smallSubLabel}>신분증/사업자등록증 <Text style={styles.required}>*</Text></Text>
              <UploadButton fileName={getUploadedFileName(uploadedFiles.idCard)} onPress={() => { void handleDocumentUpload('idCard'); }} />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.rowBetween}>
              <RequiredLabel label="입금 계좌" required />
              {!accountVerified ? (
                <TouchableOpacity
                  style={[styles.loadButton, (!creatorInfo.accountBank || !creatorInfo.accountNumber) && styles.disabledButton]}
                  onPress={handleVerifyAccount}
                  disabled={!creatorInfo.accountBank || !creatorInfo.accountNumber}
                >
                  <Text style={styles.loadButtonText}>인증하기</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.smallDoneBadge}>
                  <Text style={styles.doneBadgeText}>인증완료!</Text>
                </View>
              )}
            </View>
            <Text style={styles.helper}>후원금을 받을 계좌를 등록해주세요.</Text>
            <View style={styles.accountFields}>
              <BankSelectButton
                value={creatorInfo.accountBank}
                placeholder="은행 선택"
                disabled={accountVerified}
                onPress={() => setShowBankModal(true)}
              />
              <TextInput
                style={[styles.input, styles.accountNumberInput, accountVerified && styles.inputDisabled]}
                value={creatorInfo.accountNumber}
                onChangeText={(value) => {
                  setCreatorInfo((prev) => ({ ...prev, accountNumber: digitsOnly(value).slice(0, 20) }));
                  setAccountVerified(false);
                }}
                placeholder="계좌번호를 입력해주세요"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                editable={!accountVerified}
                maxLength={20}
              />
            </View>
          </View>
          <View style={styles.taxBox}>
            <View>
              <Text style={styles.taxTitle}>세금 계산서 발행 정보</Text>
              <Text style={styles.helper}>정확한 정산 및 세무 처리를 위해 사업자 등록 정보를 정확히 입력해 주세요</Text>
            </View>
            <View style={styles.formGroup}>
              <RequiredLabel label="사업자 구분" required />
              <View style={styles.radioRow}>
                {[
                  { id: 'individual', label: '개인 사업자' },
                  { id: 'corporation', label: '법인 사업자' },
                ].map((item) => (
                  <TouchableOpacity key={item.id} style={styles.radioItem} onPress={() => setTaxInfo((prev) => ({ ...prev, businessType: item.id }))}>
                    <View style={[styles.radio, taxInfo.businessType === item.id && styles.radioActive]} />
                    <Text style={styles.radioText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Field label="상호명(법인명)" required value={taxInfo.businessName} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, businessName: value }))} placeholder="사업자 등록증상 정확한 명칭" />
            <Field label="사업자 등록번호" required value={taxInfo.businessNumber} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, businessNumber: value }))} placeholder="123-45-67890" keyboardType="numbers-and-punctuation" />
            <Field label="대표자 성명" required value={taxInfo.ceoName} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, ceoName: value }))} placeholder="사업자 등록증상의 대표자 이름" />
            <View style={styles.formGroup}>
              <RequiredLabel label="사업장 소재지" required />
              <View style={styles.inlineRow}>
                <TextInput
                  style={[styles.input, styles.inlineInput]}
                  value={taxInfo.address}
                  onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, address: value }))}
                  placeholder="주소를 입력하거나 검색하세요"
                  placeholderTextColor="#9CA3AF"
                  editable={false}
                />
                <TouchableOpacity style={styles.inlineBlackButton} onPress={() => setShowAddressModal(true)}>
                  <Text style={styles.inlineBlackButtonText}>주소 검색</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.twoCol}>
              <View style={styles.twoColItem}>
                <Field label="업태" required value={taxInfo.businessCategory} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, businessCategory: value }))} placeholder="예: 제조업" />
              </View>
              <View style={styles.twoColItem}>
                <Field label="종목" required value={taxInfo.businessItem} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, businessItem: value }))} placeholder="예: 주류제조" />
              </View>
            </View>
            <Field label="이메일 주소" required helper="전자세금계산서를 수령할 담당자 이메일" value={taxInfo.email} onChangeText={(value) => setTaxInfo((prev) => ({ ...prev, email: value }))} placeholder="example@company.com" keyboardType="email-address" />
            <View style={styles.formGroup}>
              <RequiredLabel label="사업자 등록증 사본" required />
              <UploadButton fileName={getUploadedFileName(uploadedFiles.businessLicense)} onPress={() => { void handleDocumentUpload('businessLicense'); }} />
            </View>
          </View>
        </View>
      );
    }

    if (activeTab === 'trust') {
      return (
        <View style={styles.tabContent}>
          <InfoBox tone="blue" title="전통주 펀딩의 특성을 후원자와 함께 나눠주세요" body="발효라는 자연스러운 과정의 매력과 변수를 솔직하게 공유하면, 후원자들은 더 신뢰하며 함께 기다릴 수 있습니다." compact />
          <View style={styles.fundingGuideCard}>
            <Text style={styles.fundingGuideTitle}>📌 주담 크라우드 펀딩 안내</Text>
            <Text style={styles.helper}>아래 내용은 모든 프로젝트에 자동으로 표시되는 안내문입니다.</Text>
            <GuideParagraph title="후원은 '공동 기획'의 시작입니다" body="주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 청약철회(7일 내 환불)가 적용되지 않습니다." />
            <GuideParagraph title="술은 살아있는 생물입니다" body="전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다." />
            <TouchableOpacity onPress={() => setShowFundingGuideModal(true)}>
              <Text style={styles.guideLink}>🍶 주담의 펀딩 알아보기 (안내) →</Text>
            </TouchableOpacity>
          </View>
          <TextArea
            label="프로젝트 정책"
            required
            helper="주류 특성과 후원자 보호를 위한 정책을 작성해주세요."
            guideLines={[
              '주류 배송 특성: 파손 위험이 높은 유리병 제품의 안전 배송 약속 및 파손 시 교환 절차를 작성해주세요.',
              '성인 인증 안내: 전통주 온라인 판매 규정에 따른 성인 인증 및 수령 절차를 명시해주세요.',
              '환불 정책: 재료 수급 및 양조 시작 후의 환불 불가 조건과, 양조장 과실로 인한 생산 무산 시 환불 이행 약속을 적어주세요.',
            ]}
            value={trustInfo.projectPolicy}
            onChangeText={(value) => setTrustInfo((prev) => ({ ...prev, projectPolicy: value }))}
            placeholder=""
            minHeight={260}
          />
          <TextArea
            label="예상되는 어려움"
            required
            helper="전통주 제조 과정에서 발생할 수 있는 자연스러운 변수를 솔직하게 공유해주세요."
            guideLines={[
              '발효의 변수: 기온이나 효모 활동에 따른 미세한 맛의 차이 가능성을 솔직하게 공유해주세요.',
              '일정 지연: 최상의 발효 상태를 위해 출고가 1~2주 지연될 수 있는 상황과 대응 방안을 작성해주세요.',
              '원재료 수급: 지역 농산물 수급 상황에 따른 생산 일정 변동 가능성을 언급해주세요.',
            ]}
            value={trustInfo.expectedDifficulties}
            onChangeText={(value) => setTrustInfo((prev) => ({ ...prev, expectedDifficulties: value }))}
            placeholder=""
            minHeight={260}
          />
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <InfoBox tone="red" title="전통주 필수 서류" body="주류의 통신판매에 관한 명령위임 고시에 의거하여 아래 서류를 반드시 제출해주셔야 합니다." compact />
        <FileCard title="통신판매신고증" desc="사업자의 통신판매신고증" fileName={getUploadedFileName(uploadedFiles.salesPermit)} onPress={() => { void handleDocumentUpload('salesPermit'); }} />
        <FileCard title="주류 통신판매 승인(신청)서" desc="주류 통신판매 승인서" fileName={getUploadedFileName(uploadedFiles.alcoholPermit)} onPress={() => { void handleDocumentUpload('alcoholPermit'); }} />
        <FileCard title="전통주 제조면허증" desc="전통주 제조 면허증" fileName={getUploadedFileName(uploadedFiles.manufacturingLicense)} onPress={() => { void handleDocumentUpload('manufacturingLicense'); }} />
        <View style={styles.blueHint}>
          <Text style={styles.blueHintText}>📌 서류 심사는 3-5일 소요됩니다.</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.headerIcon} onPress={handleExit}>
              <X size={24} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEditMode ? '펀딩 프로젝트 수정' : '펀딩 프로젝트 만들기'}</Text>
            <TouchableOpacity style={styles.headerIcon} onPress={handleOpenPreview}>
              <Eye size={20} color="#111" />
            </TouchableOpacity>
          </View>
          <View style={styles.progressStrip}>
            <Text style={styles.progressStatus}>{isEditMode ? '수정중' : '기획중'} · 필수 항목 기준</Text>
            <Text style={styles.progressText}>{progress}% 완료</Text>
          </View>
          <View style={styles.projectMini}>
            <View style={styles.miniImage}>
              {basicInfo.images[0] ? <Image source={{ uri: basicInfo.images[0] }} style={styles.miniImageFill} /> : <ImageIcon size={20} color="#9CA3AF" />}
            </View>
            <View style={styles.miniTextArea}>
              <Text style={styles.miniCategory} numberOfLines={1}>{basicInfo.mainIngredient || '메인재료'}</Text>
              <Text style={styles.miniTitle} numberOfLines={1}>{basicInfo.title || '프로젝트 제목'}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            {projectTabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <TouchableOpacity key={tab.id} style={styles.tabButton} onPress={() => setActiveTab(tab.id)}>
                  <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab.label}</Text>
                  {selected && <View style={styles.tabUnderline} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.mainContent, { paddingBottom: insets.bottom + 132 }]}>
          {renderTab()}
        </ScrollView>
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? '저장 중...' : '임시저장'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.submitButton, !canSubmit && styles.disabledButton]} onPress={handleSubmit} disabled={!canSubmit || isSubmitting}>
            <Text style={styles.submitButtonText}>{isSubmitting ? (isEditMode ? '수정 중...' : '제출 중...') : (isEditMode ? '수정 제출' : '제출')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <SimpleModal visible={showAlertModal} icon="alert" title="알림" body={alertMessage} primaryLabel="확인" onPrimary={() => setShowAlertModal(false)} />
      <FundingAlertModal
        visible={showProfileImagePickerModal}
        title="프로필 이미지 업로드"
        body="이미지를 등록할 방식을 선택해주세요."
        tone="info"
        buttons={[
          { label: '갤러리에서 선택', onPress: () => { void handlePickProfileFromLibrary(); } },
          { label: '카메라로 촬영', variant: 'secondary', onPress: () => { void handleTakeProfilePhoto(); } },
          { label: '취소', variant: 'secondary' },
        ]}
        onClose={() => setShowProfileImagePickerModal(false)}
      />
      <ConfirmModal visible={showSubmitConfirm} title={isEditMode ? '수정 내용을 반영하시겠습니까?' : '제출 하시겠습니까?'} body={isEditMode ? '수정한 내용이 기존 펀딩 게시글에 바로 반영됩니다.' : '제출하면 펀딩 프로젝트 심사 요청이 접수됩니다.'} onCancel={() => setShowSubmitConfirm(false)} onConfirm={confirmSubmit} />
      <SimpleModal visible={showSubmitSuccess} icon="success" title={isEditMode ? '수정이 완료되었습니다' : '성공적으로 제출되었습니다'} body={submitSyncWarning || (isEditMode ? '수정한 내용이 펀딩 게시글에 반영되었습니다.' : '펀딩 프로젝트 심사 요청이 접수되었습니다.')} primaryLabel="게시글 확인" onPrimary={handleSubmitSuccessClose} />
      <TempSaveModal
        visible={showTempSaveModal}
        mode={tempSaveMode}
        timestamp={tempSaveTimestamp}
        onClose={() => setShowTempSaveModal(false)}
        onLoad={() => { void loadSavedDraft(); }}
        onDelete={() => { void deleteSavedDraft(); }}
        onOverwrite={() => { void overwriteSavedDraft(); }}
        onExitWithoutLoad={handleExitWithoutSave}
      />
      <ExitConfirmModal visible={showExitConfirm} onSave={handleSaveAndExit} onExit={handleExitWithoutSave} onContinue={() => setShowExitConfirm(false)} />
      <FundingGuideModal visible={showFundingGuideModal} onClose={() => setShowFundingGuideModal(false)} />
      <AddressModal visible={showAddressModal} insetsTop={insets.top} search={addressSearch} results={filteredAddresses} onChangeSearch={setAddressSearch} onClose={() => setShowAddressModal(false)} onSelect={handleSelectAddress} onUseManual={handleUseManualAddress} />
      <BankSelectModal
        visible={showBankModal}
        value={creatorInfo.accountBank}
        onClose={() => setShowBankModal(false)}
        onSelect={(value) => {
          setCreatorInfo((prev) => ({ ...prev, accountBank: value }));
          setAccountVerified(false);
          setShowBankModal(false);
        }}
      />
      <NativeDatePicker
        target={datePickerTarget}
        title={datePickerTarget === 'expectedDeliveryDate' ? '예상 발송 시작일' : '펀딩 시작일'}
        value={parseDate(datePickerTarget === 'expectedDeliveryDate' ? fundingInfo.expectedDeliveryDate : fundingInfo.startDate) || new Date()}
        onChange={handleNativeFundingDateChange}
        onClose={() => setDatePickerTarget(null)}
      />
      <PreviewModal
        visible={showPreview}
        insetsTop={insets.top}
        onClose={() => setShowPreview(false)}
        basicInfo={basicInfo}
        fundingInfo={fundingInfo}
        productInfo={productInfo}
        projectPlan={projectPlan}
        creatorInfo={creatorInfo}
        taxInfo={taxInfo}
        trustInfo={trustInfo}
        tasteProfile={tasteProfile}
        goalAmount={fundingInfo.goalAmount}
        onOpenGuide={() => setShowFundingGuideModal(true)}
      />
    </View>
  );
}

function ReorderableProjectImage({
  uri,
  index,
  total,
  onMove,
  onRemove,
  onDragStateChange,
}: {
  uri: string;
  index: number;
  total: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (index: number) => void;
  onDragStateChange: (isDragging: boolean) => void;
}) {
  const dragX = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => total > 1,
        onMoveShouldSetPanResponder: (_, gestureState) => total > 1 && Math.abs(gestureState.dx) > 4,
        onPanResponderGrant: () => {
          dragX.setValue(0);
          setIsDragging(true);
          onDragStateChange(true);
        },
        onPanResponderMove: (_, gestureState) => {
          dragX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const targetIndex = Math.max(0, Math.min(total - 1, Math.round(index + gestureState.dx / IMAGE_REORDER_STEP)));
          setIsDragging(false);
          onDragStateChange(false);
          dragX.setValue(0);
          if (targetIndex !== index) {
            onMove(index, targetIndex);
          }
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          onDragStateChange(false);
          Animated.spring(dragX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [dragX, index, onDragStateChange, onMove, total]
  );

  return (
    <Animated.View
      style={[
        styles.uploadedImageWrap,
        isDragging && styles.uploadedImageWrapDragging,
        { transform: [{ translateX: dragX }] },
      ]}
    >
      <Image source={{ uri }} style={styles.uploadedImage} />
      <View style={styles.imageNumberHandle} {...panResponder.panHandlers}>
        <View style={[styles.imageNumber, isDragging && styles.imageNumberActive]}>
          <Text style={styles.imageNumberText}>{index + 1}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.imageRemove} onPress={() => onRemove(index)}>
        <X size={12} color="#FFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

function RequiredLabel({ label, required, small }: { label: string; required?: boolean; small?: boolean }) {
  return (
    <Text style={small ? styles.smallLabel : styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  keyboardType,
  suffix,
  helper,
  warning,
  maxLength,
  counter,
  editable = true,
  smallLabel,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  suffix?: string;
  helper?: string;
  warning?: boolean;
  maxLength?: number;
  counter?: string;
  editable?: boolean;
  smallLabel?: boolean;
}) {
  return (
    <View style={styles.formGroup}>
      <RequiredLabel label={label} required={required} small={smallLabel} />
      {helper && !warning && <Text style={styles.helper}>{helper}</Text>}
      <View style={[styles.inputWithSuffix, !editable && styles.inputDisabled]}>
        <TextInput
          style={styles.inputFlex}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {counter && <Text style={styles.counter}>{counter}</Text>}
      {helper && warning && <Text style={styles.warningText}>{helper}</Text>}
    </View>
  );
}

function DateField({
  label,
  value,
  onChangeText,
  onOpenCalendar,
  placeholder,
  required,
  keyboardType,
  helper,
  warning,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onOpenCalendar: () => void;
  placeholder: string;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  helper?: string;
  warning?: boolean;
}) {
  return (
    <View style={styles.formGroup}>
      <RequiredLabel label={label} required={required} />
      {helper && !warning && <Text style={styles.helper}>{helper}</Text>}
      <View style={styles.inputWithSuffix}>
        <TextInput
          style={styles.inputFlex}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          maxLength={10}
        />
        <TouchableOpacity style={styles.calendarIconButton} onPress={onOpenCalendar}>
          <Calendar size={18} color="#4B5563" />
        </TouchableOpacity>
      </View>
      {helper && warning && <Text style={styles.warningText}>{helper}</Text>}
    </View>
  );
}

function LegalField({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  editable = true,
  keyboardType,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  required?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  suffix?: string;
}) {
  return (
    <View style={styles.legalField}>
      <Text style={styles.legalLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={[styles.legalInputBox, !editable && styles.legalInputDisabled]}>
        <TextInput
          style={styles.legalInputText}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          keyboardType={keyboardType}
        />
        {suffix && <Text style={styles.legalSuffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  helper,
  guideLines,
  minHeight = 140,
  maxLength,
  counter,
  mono,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  required?: boolean;
  helper?: string;
  guideLines?: string[];
  minHeight?: number;
  maxLength?: number;
  counter?: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.formGroup}>
      <RequiredLabel label={label} required={required} />
      {helper && <Text style={styles.helper}>{helper}</Text>}
      {guideLines && (
        <View style={styles.textGuideBox}>
          {guideLines.map((line) => (
            <Text key={line} style={styles.textGuideLine}>• {line}</Text>
          ))}
        </View>
      )}
      <TextInput
        style={[styles.input, styles.textArea, { minHeight }, mono && styles.monoText]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
      />
      {counter && <Text style={styles.counter}>{counter}</Text>}
    </View>
  );
}

function InfoBox({ tone, title, body, lines, compact }: { tone: 'blue' | 'red'; title: string; body?: string; lines?: string[]; compact?: boolean }) {
  const blue = tone === 'blue';
  return (
    <View style={[styles.infoBox, blue ? styles.blueInfoBox : styles.redInfoBox, compact && styles.compactInfoBox]}>
      <AlertCircle size={compact ? 16 : 20} color={blue ? '#2563EB' : '#DC2626'} />
      <View style={styles.infoBody}>
        <Text style={[styles.infoTitle, blue ? styles.blueInfoTitle : styles.redInfoTitle]}>{title}</Text>
        {body && <Text style={[styles.infoText, blue ? styles.blueInfoText : styles.redInfoText]}>{body}</Text>}
        {lines?.map((line) => (
          <Text key={line} style={[styles.infoText, blue ? styles.blueInfoText : styles.redInfoText]}>• {line}</Text>
        ))}
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function UploadButton({ fileName, onPress }: { fileName: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Upload size={16} color="#4B5563" />
      <Text style={styles.uploadButtonText}>{fileName || '파일 선택'}</Text>
    </TouchableOpacity>
  );
}

function FileCard({ title, desc, fileName, onPress }: { title: string; desc: string; fileName: string; onPress: () => void }) {
  return (
    <View style={styles.fileCard}>
      <View style={styles.fileCardHeader}>
        <View>
          <Text style={styles.fileTitle}>{title} <Text style={styles.required}>*</Text></Text>
          <Text style={styles.helper}>{desc}</Text>
        </View>
        <FileCheck size={16} color="#9CA3AF" />
      </View>
      <UploadButton fileName={fileName} onPress={onPress} />
    </View>
  );
}

function BankSelectButton({ value, placeholder, onPress, disabled }: { value: string; placeholder: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.selectLike, disabled && styles.inputDisabled]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>{value || placeholder}</Text>
    </TouchableOpacity>
  );
}

function BankSelectModal({ visible, value, onClose, onSelect }: { visible: boolean; value: string; onClose: () => void; onSelect: (value: string) => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.bankModal}>
          <View style={styles.bankModalHeader}>
            <Text style={styles.modalTitle}>은행 선택</Text>
            <TouchableOpacity style={styles.bankModalClose} onPress={onClose}>
              <X size={18} color="#111" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.bankList}>
            {BANK_OPTIONS.map((bank) => (
              <TouchableOpacity key={bank} style={[styles.bankItem, value === bank && styles.bankItemActive]} onPress={() => onSelect(bank)}>
                <Text style={[styles.bankItemText, value === bank && styles.bankItemTextActive]}>{bank}</Text>
                {value === bank && <Check size={18} color="#111" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function TasteControl({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: (value: number) => void }) {
  const trackRef = useRef<View>(null);
  const trackLeftRef = useRef(0);
  const trackWidthRef = useRef(0);

  const updateValueFromPageX = (pageX: number) => {
    const trackWidth = trackWidthRef.current;
    if (!trackWidth) return;
    const localX = Math.max(0, Math.min(trackWidth, pageX - trackLeftRef.current));
    const next = Math.round((localX / trackWidth) * 100);
    onChange(next);
  };

  const measureTrack = (afterMeasure?: () => void) => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      trackLeftRef.current = x;
      trackWidthRef.current = width || trackWidthRef.current;
      afterMeasure?.();
    });
  };

  const updateValueFromTouch = (event: GestureResponderEvent) => {
    updateValueFromPageX(event.nativeEvent.pageX);
  };

  return (
    <View style={styles.tasteBlock}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.helper}>{desc}</Text>
        </View>
        <Text style={styles.tastePercent}>{value}%</Text>
      </View>
      <View
        ref={trackRef}
        style={styles.tasteSliderTouchArea}
        onLayout={(event) => {
          trackWidthRef.current = event.nativeEvent.layout.width;
          measureTrack();
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          const pageX = event.nativeEvent.pageX;
          measureTrack(() => updateValueFromPageX(pageX));
        }}
        onResponderMove={updateValueFromTouch}
        onResponderTerminationRequest={() => false}
      >
        <View style={styles.tasteTrack}>
          <View style={[styles.tasteFill, { width: `${value}%` }]} />
          <View style={[styles.tasteThumb, { left: `${Math.max(0, Math.min(100, value))}%` }]} />
        </View>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.tasteEndText}>약함</Text>
        <Text style={styles.tasteEndText}>강함</Text>
      </View>
    </View>
  );
}

function RadarChart({ tasteProfile }: { tasteProfile: { sweetness: number; aroma: number; acidity: number; body: number; carbonation: number } }) {
  const points = {
    sweetness: [200, 200 - (tasteProfile.sweetness / 100) * 150],
    aroma: [200 + (tasteProfile.aroma / 100) * 142.5, 200 - (tasteProfile.aroma / 100) * 46.35],
    acidity: [200 + (tasteProfile.acidity / 100) * 88.1, 200 + (tasteProfile.acidity / 100) * 121.35],
    body: [200 - (tasteProfile.body / 100) * 88.1, 200 + (tasteProfile.body / 100) * 121.35],
    carbonation: [200 - (tasteProfile.carbonation / 100) * 142.5, 200 - (tasteProfile.carbonation / 100) * 46.35],
  };
  const polygon = Object.values(points).map((item) => item.join(',')).join(' ');

  return (
    <Svg width="100%" height={310} viewBox="0 0 400 400">
      {[1, 0.75, 0.5, 0.25].map((scale) => (
        <Polygon
          key={scale}
          points={[
            [200, 200 - 150 * scale],
            [200 + 142.5 * scale, 200 - 46.35 * scale],
            [200 + 88.1 * scale, 200 + 121.35 * scale],
            [200 - 88.1 * scale, 200 + 121.35 * scale],
            [200 - 142.5 * scale, 200 - 46.35 * scale],
          ].map((item) => item.join(',')).join(' ')}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
      ))}
      {[[200, 50], [342.5, 153.65], [288.1, 321.35], [111.9, 321.35], [57.5, 153.65]].map((point, index) => (
        <Line key={index} x1="200" y1="200" x2={point[0]} y2={point[1]} stroke="#E5E7EB" strokeWidth="1" />
      ))}
      <Polygon points={polygon} fill="rgba(0,0,0,0.2)" stroke="rgba(0,0,0,0.8)" strokeWidth="2" />
      {Object.values(points).map((point, index) => (
        <Circle key={index} cx={point[0]} cy={point[1]} r="4" fill="#000" />
      ))}
      <SvgText x="200" y="35" textAnchor="middle" fontSize="12" fontWeight="700" fill="#374151">단맛</SvgText>
      <SvgText x="360" y="158" textAnchor="start" fontSize="12" fontWeight="700" fill="#374151">잔향</SvgText>
      <SvgText x="295" y="345" textAnchor="start" fontSize="12" fontWeight="700" fill="#374151">산미</SvgText>
      <SvgText x="105" y="345" textAnchor="end" fontSize="12" fontWeight="700" fill="#374151">바디감</SvgText>
      <SvgText x="40" y="158" textAnchor="end" fontSize="12" fontWeight="700" fill="#374151">탄산감</SvgText>
    </Svg>
  );
}

function GuideParagraph({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.guideParagraph}>
      <Text style={styles.guideParagraphTitle}>{title}</Text>
      <Text style={styles.guideParagraphBody}>{body}</Text>
    </View>
  );
}

function GuardNotice({ insetsTop, title, description, primaryLabel, onPrimaryPress }: { insetsTop: number; title: string; description: string; primaryLabel: string; onPrimaryPress: () => void }) {
  return (
    <View style={[styles.guard, { paddingTop: insetsTop + 32 }]}>
      <View style={styles.guardCard}>
        <AlertCircle size={44} color="#111" />
        <Text style={styles.guardTitle}>{title}</Text>
        <Text style={styles.guardDesc}>{description}</Text>
        <TouchableOpacity style={styles.guardButton} onPress={onPrimaryPress}>
          <Text style={styles.guardButtonText}>{primaryLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SimpleModal({ visible, icon, title, body, primaryLabel, onPrimary }: { visible: boolean; icon: 'alert' | 'success'; title: string; body: string; primaryLabel: string; onPrimary: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.centerModal}>
          <View style={[styles.modalIconCircle, icon === 'success' ? styles.successCircle : styles.alertCircle]}>
            {icon === 'success' ? <Check size={32} color="#16A34A" /> : <AlertCircle size={32} color="#DC2626" />}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalBody}>{body}</Text>
          <TouchableOpacity style={styles.modalPrimary} onPress={onPrimary}>
            <Text style={styles.modalPrimaryText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ConfirmModal({ visible, title, body, onCancel, onConfirm }: { visible: boolean; title: string; body: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.centerModal}>
          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.modalBody}>{body}</Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.modalSecondary} onPress={onCancel}>
              <Text style={styles.modalSecondaryText}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalPrimaryFlex} onPress={onConfirm}>
              <Text style={styles.modalPrimaryText}>예</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TempSaveModal({
  visible,
  mode,
  timestamp,
  onClose,
  onLoad,
  onDelete,
  onOverwrite,
  onExitWithoutLoad,
}: {
  visible: boolean;
  mode: TempSaveMode;
  timestamp: string;
  onClose: () => void;
  onLoad: () => void;
  onDelete: () => void;
  onOverwrite: () => void;
  onExitWithoutLoad: () => void;
}) {
  const label = timestamp ? new Date(timestamp).toLocaleString('ko-KR') : '';
  const isSaved = mode === 'saved';
  const isExit = mode === 'exitExisting';
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.centerModal}>
          <View style={[styles.modalIconCircle, styles.blueCircle]}>
            <FileCheck size={32} color="#2563EB" />
          </View>
          <Text style={styles.modalTitle}>{isSaved ? '임시저장 되었습니다.' : '임시 저장된 작성 내용'}</Text>
          <Text style={styles.modalBody}>{label ? `${label}에 저장됨` : '저장된 시간이 없습니다.'}</Text>
          {isSaved ? (
            <TouchableOpacity style={styles.modalPrimary} onPress={onClose}>
              <Text style={styles.modalPrimaryText}>확인</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.modalPrimary} onPress={onLoad}>
                <Text style={styles.modalPrimaryText}>불러오기</Text>
              </TouchableOpacity>
              {isExit ? (
                <TouchableOpacity style={styles.modalSecondaryWide} onPress={onExitWithoutLoad}>
                  <Text style={styles.modalSecondaryText}>불러오지 않고 나가기</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.modalSecondaryWide} onPress={onOverwrite}>
                  <Text style={styles.modalSecondaryText}>현재 내용으로 새로 저장</Text>
                </TouchableOpacity>
              )}
              {!isExit && (
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalPlain} onPress={onClose}>
                <Text style={styles.modalPlainText}>{isExit ? '계속 작성하기' : '닫기'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function NativeDatePicker({
  target,
  title,
  value,
  onChange,
  onClose,
}: {
  target: DatePickerTarget | null;
  title: string;
  value: Date;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onClose: () => void;
}) {
  if (!target) return null;

  if (Platform.OS === 'ios') {
    return (
      <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalBackdrop}>
          <View style={styles.nativeDatePickerModal}>
            <View style={styles.nativeDatePickerHeader}>
              <View style={styles.grayIconCircle}>
                <Calendar size={22} color="#111" />
              </View>
              <Text style={styles.nativeDatePickerTitle}>{title}</Text>
              <Text style={styles.nativeDatePickerBody}>기기 캘린더에서 날짜를 선택해주세요.</Text>
            </View>
            <DateTimePicker value={value} mode="date" display="inline" locale="ko-KR" onChange={onChange} />
            <View style={styles.nativeDatePickerFooter}>
              <TouchableOpacity style={styles.modalPrimary} onPress={onClose}>
                <Text style={styles.modalPrimaryText}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  if (Platform.OS === 'android') {
    return <DateTimePicker value={value} mode="date" display="calendar" onChange={onChange} />;
  }

  return null;
}

function ExitConfirmModal({ visible, onSave, onExit, onContinue }: { visible: boolean; onSave: () => void; onExit: () => void; onContinue: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.centerModal}>
          <View style={styles.grayIconCircle}>
            <AlertCircle size={24} color="#374151" />
          </View>
          <Text style={styles.confirmTitle}>임시 저장을 하지 않으셨습니다</Text>
          <Text style={styles.modalBody}>작성 중인 내용을 임시 저장하시겠습니까?</Text>
          <TouchableOpacity style={styles.modalPrimary} onPress={onSave}>
            <Text style={styles.modalPrimaryText}>네, 저장하고 나가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalSecondaryWide} onPress={onExit}>
            <Text style={styles.modalSecondaryText}>아니오, 저장 안함</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalPlain} onPress={onContinue}>
            <Text style={styles.modalPlainText}>계속 작성하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function AddressModal({ visible, insetsTop, search, results, onChangeSearch, onClose, onSelect, onUseManual }: { visible: boolean; insetsTop: number; search: string; results: AddressItem[]; onChangeSearch: (value: string) => void; onClose: () => void; onSelect: (zipCode: string, address: string) => void; onUseManual: () => void }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.addressModal}>
        <View style={[styles.addressHeader, { paddingTop: insetsTop }]}>
          <View style={styles.addressTitleRow}>
            <TouchableOpacity style={styles.headerIcon} onPress={onClose}>
              <ChevronLeft size={24} color="#111" />
            </TouchableOpacity>
            <Text style={styles.addressTitle}>주소 검색</Text>
            <View style={styles.headerIcon} />
          </View>
          <View style={styles.addressSearchBox}>
            <Search size={18} color="#9CA3AF" />
            <TextInput style={styles.addressInput} value={search} onChangeText={onChangeSearch} placeholder="도로명, 건물명, 지역명 입력" placeholderTextColor="#9CA3AF" autoFocus />
            {Boolean(search) && (
              <TouchableOpacity onPress={() => onChangeSearch('')}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.addressContent}>
          {!search ? (
            <View style={styles.addressEmpty}>
              <MapPin size={34} color="#D1D5DB" />
              <Text style={styles.addressEmptyTitle}>주소를 검색해주세요</Text>
              <Text style={styles.addressEmptyText}>도로명, 건물명 또는 지역명으로 검색할 수 있습니다.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultCount}>검색 결과 {results.length}건</Text>
              <TouchableOpacity style={styles.manualAddressCard} onPress={onUseManual}>
                <Text style={styles.manualAddressLabel}>입력한 주소 사용</Text>
                <Text style={styles.manualAddressText}>{search}</Text>
              </TouchableOpacity>
              {results.map((item) => (
                <TouchableOpacity key={`${item.zipCode}-${item.address}`} style={styles.addressResultCard} onPress={() => onSelect(item.zipCode, item.address)}>
                  <Text style={styles.zipCode}>우편번호 {item.zipCode}</Text>
                  <Text style={styles.addressResultText}>{item.address}</Text>
                </TouchableOpacity>
              ))}
              {results.length === 0 && (
                <View style={styles.noResult}>
                  <Text style={styles.noResultTitle}>검색 결과가 없습니다</Text>
                  <Text style={styles.noResultText}>다른 검색어로 시도해보세요.</Text>
                </View>
              )}
            </>
          )}
          <View style={styles.addressGuideBox}>
            <Text style={styles.addressGuideText}>주소 검색 API 연결 전까지 입력한 주소를 그대로 사용할 수 있습니다.</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function FundingGuideModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.guideModal}>
          <View style={styles.guideModalHeader}>
            <Text style={styles.guideModalTitle}>🍶 주담 펀딩 안내</Text>
            <TouchableOpacity style={styles.guideClose} onPress={onClose}>
              <Text style={styles.guideCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.guideModalContent}>
            <GuideSection title="주담 펀딩이란 무엇이죠?" body="주담 펀딩은 혁신적인 전통주 레시피 아이디어를 가진 개인(기획자)과 이를 실제 술로 빚어낼 수 있는 전문 양조장이 만나, 다수의 후원자와 함께 새로운 우리 술을 탄생시키는 과정입니다." />
            <GuideSection title="주담 펀딩은 어떤 방식으로 진행되나요?" body="주담 펀딩은 기획자와 양조장, 그리고 후원자가 함께 '세상에 없던 나만의 술'을 완성해 나가는 협업 프로젝트입니다." />
            <GuideParagraph title="기획자 및 양조장:" body="AI 검토를 거친 레시피를 바탕으로 프로젝트를 개설하여 제조에 필요한 예산을 모금합니다. 펀딩에 성공하면 약속한 전통주를 정성껏 빚어 후원자에게 전달합니다." />
            <GuideParagraph title="후원자:" body="자신의 취향에 맞는 레시피 프로젝트에 후원하며 공동 기획자로 참여합니다. 펀딩 성공 시, 숙성 기간을 거쳐 완성된 나만의 전통주를 리워드로 받아보실 수 있습니다." />
            <GuideParagraph title="소통의 의무:" body="전통주는 발효 식품 특성상 기상 조건이나 효모의 활동에 따라 일정이 지연되거나 풍미가 미세하게 변할 수 있습니다. 양조장은 이러한 변동 사항을 후원자에게 즉시 알리고 성실히 설명할 의무가 있습니다." />
            <View style={styles.blueGuideParagraph}>
              <Text style={styles.blueGuideTitle}>결제 안내:</Text>
              <Text style={styles.blueGuideBody}>펀딩은 목표 금액에 도달했을 때만 성사되며, 목표 미달 시 프로젝트는 무산되고 결제는 진행되지 않습니다.</Text>
            </View>
            <GuideSection title="후원이란 무엇인가요?" body="주담에서의 후원은 단순히 만들어진 술을 구매하는 '전자상거래'가 아닙니다." />
            <GuideParagraph title="가치의 지지:" body="아직 세상에 나오지 않은 전통주 레시피가 실현될 수 있도록 자금을 지원하고 응원하는 일입니다. 그 보답으로 양조 전문가가 완성한 고품질의 전통주를 리워드로 제공받습니다." />
            <GuideParagraph title="변수의 수용:" body="발효와 숙성이라는 자연의 공정을 거치므로, 안내된 일정보다 조금 늦어지거나 맛의 밸런스가 전문가의 보정 과정에서 일부 조정될 수 있음을 이해해 주셔야 합니다." />
            <GuideSection title="주담은 이 과정에서 무엇을 하나요?" body="주담은 사용자의 아이디어가 안전하게 제품화될 수 있도록 신뢰의 연결고리 역할을 합니다." />
            <GuideParagraph title="AI 레시피 검토:" body="실현 불가능하거나 주세법에 어긋나는 레시피를 AI가 1차적으로 필터링하여 안전한 프로젝트만 소개합니다." />
            <GuideParagraph title="투명한 공정 공유:" body="양조 일지를 통해 원료 입고부터 포장까지의 전 과정을 시각화하여 정보의 격차를 해소합니다." />
            <View style={styles.redGuideParagraph}>
              <Text style={styles.redGuideTitle}>커뮤니티 관리:</Text>
              <Text style={styles.redGuideBody}>이용약관과 전통주 판매 규정을 준수하지 않거나, 후원자와의 소통을 소홀히 하여 피해를 주는 이용자 및 양조장에게는 주의·경고 및 서비스 이용 제한 등의 엄격한 조치를 취하고 있습니다.</Text>
            </View>
          </ScrollView>
          <View style={styles.guideBottom}>
            <TouchableOpacity style={styles.modalPrimary} onPress={onClose}>
              <Text style={styles.modalPrimaryText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GuideSection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.guideSection}>
      <Text style={styles.guideSectionTitle}>{title}</Text>
      <Text style={styles.guideSectionBody}>{body}</Text>
    </View>
  );
}

function PreviewModal({
  visible,
  insetsTop,
  onClose,
  basicInfo,
  fundingInfo,
  productInfo,
  projectPlan,
  creatorInfo,
  taxInfo,
  trustInfo,
  tasteProfile,
  goalAmount,
  onOpenGuide,
}: {
  visible: boolean;
  insetsTop: number;
  onClose: () => void;
  basicInfo: { category: string; title: string; summary: string; mainIngredient: string; subIngredient: string; alcoholContent: string; images: string[] };
  fundingInfo: { duration: string; startDate: string; pricePerBottle: string; bottleQuantity: string; goalAmount: string };
  productInfo: { volume: string; alcoholContent: string };
  projectPlan: { introduction: string; videoUrl: string; budget: string; schedule: string };
  creatorInfo: { name: string; profileImage: string };
  taxInfo: { address: string };
  trustInfo: { projectPolicy: string; expectedDifficulties: string };
  tasteProfile: { sweetness: number; aroma: number; acidity: number; body: number; carbonation: number };
  goalAmount: string;
  onOpenGuide: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.previewScreen}>
        <View style={[styles.previewHeader, { paddingTop: insetsTop }]}>
          <TouchableOpacity style={styles.headerIcon} onPress={onClose}>
            <ChevronLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.previewHeaderTitle}>게시글 미리보기</Text>
          <View style={styles.headerIcon} />
        </View>
        <ScrollView contentContainerStyle={styles.previewContent}>
          <View style={styles.previewHeroImage}>
            {basicInfo.images[0] ? <Image source={{ uri: basicInfo.images[0] }} style={styles.previewImageFill} /> : <ImageIcon size={48} color="#9CA3AF" />}
          </View>
          <View style={styles.previewInner}>
            <Text style={styles.previewTitle}>{basicInfo.title || '프로젝트 제목을 입력해주세요'}</Text>
            <Text style={styles.previewSummary}>{basicInfo.summary || '프로젝트 요약을 입력해주세요'}</Text>
            <View style={styles.previewStatsCard}>
              <View style={styles.previewStatGrid}>
                <View style={styles.previewStat}>
                  <Text style={styles.previewStatNumber}>0%</Text>
                  <Text style={styles.previewStatLabel}>달성률</Text>
                </View>
                <View style={[styles.previewStat, styles.previewStatMiddle]}>
                  <Text style={styles.previewStatNumber}>0<Text style={styles.previewStatUnit}>만원</Text></Text>
                  <Text style={styles.previewStatLabel}>모인금액</Text>
                </View>
                <View style={styles.previewStat}>
                  <Text style={styles.previewStatNumber}>0</Text>
                  <Text style={styles.previewStatLabel}>후원자</Text>
                </View>
              </View>
              <Progress value={0} style={styles.previewProgress} />
              <View style={styles.previewCalendarRow}>
                <Calendar size={16} color="#4B5563" />
                <Text style={styles.previewCalendarText}>{fundingInfo.duration}일 진행 예정</Text>
              </View>
              <Text style={styles.previewStartDate}>{fundingInfo.startDate || '시작일 미정'}</Text>
            </View>
            <View style={styles.creatorPreviewCard}>
              <View style={styles.creatorPreviewImage}>
                {creatorInfo.profileImage ? <Image source={{ uri: creatorInfo.profileImage }} style={styles.creatorPreviewImageFill} /> : <User size={24} color="#9CA3AF" />}
              </View>
              <View style={styles.creatorPreviewText}>
                <Text style={styles.creatorPreviewName}>{creatorInfo.name || '양조장 이름'}</Text>
                <Text style={styles.creatorPreviewCategory}>{taxInfo.address || '위치 미정'}</Text>
              </View>
              <View style={styles.creatorBadge}>
                <Text style={styles.creatorBadgeText} numberOfLines={1}>{basicInfo.mainIngredient || '메인재료'}</Text>
              </View>
            </View>
            <PreviewSection title="프로젝트 소개">
              {(basicInfo.mainIngredient || basicInfo.subIngredient || productInfo.alcoholContent || basicInfo.alcoholContent) && (
                <View style={styles.previewInfoGrid}>
                  {basicInfo.mainIngredient && <PreviewMiniInfo label="메인재료" value={basicInfo.mainIngredient} />}
                  {basicInfo.subIngredient && <PreviewMiniInfo label="서브재료" value={basicInfo.subIngredient} />}
                  {(productInfo.alcoholContent || basicInfo.alcoholContent) && <PreviewMiniInfo label="도수" value={alcoholText(productInfo.alcoholContent || basicInfo.alcoholContent)} />}
                </View>
              )}
              {basicInfo.summary && (
                <View style={styles.previewBlueNote}>
                  <Text style={styles.previewBlueNoteTitle}>📝 프로젝트 요약</Text>
                  <Text style={styles.previewBlueNoteText}>{basicInfo.summary}</Text>
                </View>
              )}
              {projectPlan.introduction && <Text style={styles.previewParagraph}>{projectPlan.introduction}</Text>}
              {projectPlan.videoUrl && (
                <View style={styles.previewUrlBox}>
                  <Text style={styles.previewUrlLabel}>프로젝트 영상 URL</Text>
                  <Text style={styles.previewUrlText} numberOfLines={2}>{projectPlan.videoUrl}</Text>
                </View>
              )}
            </PreviewSection>
            {(fundingInfo.pricePerBottle || fundingInfo.bottleQuantity || fundingInfo.goalAmount) && (
              <PreviewSection title="가격 안내">
                {fundingInfo.pricePerBottle && <PreviewPriceBlock label="병당 단가" value={`${currency(fundingInfo.pricePerBottle)}원`} sub={volumeText(productInfo.volume)} dark />}
                {fundingInfo.bottleQuantity && <PreviewPriceBlock label="총 판매 수량" value={`${currency(fundingInfo.bottleQuantity)}병`} sub="목표 수량" />}
                {fundingInfo.goalAmount && (
                  <View style={styles.previewGoalBox}>
                    <Text style={styles.previewGoalLabel}>펀딩 목표 금액</Text>
                    <Text style={styles.previewGoalValue}>{currency(fundingInfo.goalAmount)}원</Text>
                  </View>
                )}
              </PreviewSection>
            )}
            {projectPlan.budget && <PreviewSection title="프로젝트 예산"><Text style={styles.previewParagraph}>{projectPlan.budget}</Text></PreviewSection>}
            {projectPlan.schedule && <PreviewSection title="프로젝트 일정"><Text style={styles.previewParagraph}>{projectPlan.schedule}</Text></PreviewSection>}
            <PreviewSection title="맛 지표">
              <Text style={styles.previewSummary}>양조장이 예상하는 이 전통주의 맛 프로필입니다.</Text>
              <RadarChart tasteProfile={tasteProfile} />
              {[
                { label: '단맛', value: tasteProfile.sweetness },
                { label: '잔향', value: tasteProfile.aroma },
                { label: '산미', value: tasteProfile.acidity },
                { label: '바디감', value: tasteProfile.body },
                { label: '탄산감', value: tasteProfile.carbonation },
              ].map((item) => (
                <View key={item.label} style={styles.previewTasteRow}>
                  <Text style={styles.previewTasteLabel}>{item.label}</Text>
                  <View style={styles.previewTasteTrack}>
                    <View style={[styles.previewTasteFill, { width: `${item.value}%` }]} />
                  </View>
                  <Text style={styles.previewTasteValue}>{item.value}%</Text>
                </View>
              ))}
            </PreviewSection>
            <PreviewSection title="안내사항">
              <Text style={styles.previewGuideTitle}>📌 주담 크라우드 펀딩 안내</Text>
              <GuideParagraph title="후원은 '공동 기획'의 시작입니다" body="주담의 후원은 이미 완성된 술을 사는 쇼핑이 아니라, 여러분의 레시피 제안이 실제 제품으로 탄생하도록 양조장을 지원하는 협업입니다. 따라서 전자상거래법상 단순 변심에 의한 청약철회(7일 내 환불)가 적용되지 않습니다." />
              <GuideParagraph title="술은 살아있는 생물입니다" body="전통주는 발효 과정에서 자연적인 변수가 발생할 수 있습니다. 기획 의도를 최우선으로 하되, 발효가 주는 미세한 맛의 차이는 전통주 펀딩만의 독특한 매력으로 이해해 주시길 부탁드립니다." />
              <TouchableOpacity onPress={onOpenGuide}>
                <Text style={styles.guideLink}>🍶 주담의 펀딩 알아보기 (안내) →</Text>
              </TouchableOpacity>
              <View style={styles.previewDivider} />
              <Text style={styles.previewGuideTitle}>📄 프로젝트 정책</Text>
              <Text style={styles.previewGrayParagraph}>{trustInfo.projectPolicy}</Text>
              <View style={styles.previewDivider} />
              <Text style={styles.previewGuideTitle}>⚠️ 예상되는 어려움</Text>
              <Text style={styles.previewGrayParagraph}>{trustInfo.expectedDifficulties}</Text>
            </PreviewSection>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.previewSection}>
      <Text style={styles.previewSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PreviewMiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.previewMiniInfo}>
      <Text style={styles.previewMiniLabel}>{label}</Text>
      <Text style={styles.previewMiniValue}>{value}</Text>
    </View>
  );
}

function PreviewPriceBlock({ label, value, sub, dark }: { label: string; value: string; sub?: string; dark?: boolean }) {
  return (
    <View style={styles.previewPriceBlock}>
      <View style={[styles.previewPriceAccent, dark ? styles.previewPriceAccentDark : styles.previewPriceAccentGray]} />
      <View style={styles.previewPriceBody}>
        <View>
          <Text style={styles.previewMiniLabel}>{label}</Text>
          <Text style={styles.previewPriceValue}>{value}</Text>
        </View>
        {sub && <Text style={styles.previewPriceSub}>{sub}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTop: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  headerIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  progressStrip: { height: 36, backgroundColor: '#F9FAFB', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 16 },
  progressStatus: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  progressText: { fontSize: 12, fontWeight: '900', color: '#111' },
  projectMini: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  miniImageFill: { width: '100%', height: '100%' },
  miniTextArea: { flex: 1, minWidth: 0 },
  miniCategory: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  miniTitle: { fontSize: 14, fontWeight: '900', color: '#111', marginTop: 3 },
  tabBar: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabButton: { height: 44, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabLabelActive: { color: '#111' },
  tabUnderline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: '#111' },
  mainContent: { paddingHorizontal: 16, paddingTop: 24 },
  tabContent: { gap: 24 },
  formGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '900', color: '#111' },
  smallLabel: { fontSize: 12, fontWeight: '900', color: '#111' },
  required: { color: '#EF4444' },
  optionalText: { color: '#9CA3AF', fontWeight: '800' },
  helper: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#6B7280' },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontWeight: '700', color: '#111', backgroundColor: '#FFF' },
  inputWithSuffix: { minHeight: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF' },
  inputFlex: { flex: 1, minHeight: 46, fontSize: 14, fontWeight: '700', color: '#111' },
  inputDisabled: { backgroundColor: '#F3F4F6' },
  suffix: { fontSize: 14, fontWeight: '800', color: '#4B5563', marginLeft: 8 },
  calendarIconButton: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: -6 },
  textArea: { paddingTop: 14, paddingBottom: 14, lineHeight: 20 },
  monoText: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) },
  counter: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  warningText: { fontSize: 12, lineHeight: 18, fontWeight: '800', color: '#DC2626' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  inlineLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallMuted: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  infoBox: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  compactInfoBox: { padding: 14 },
  blueInfoBox: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  redInfoBox: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  infoBody: { flex: 1, gap: 5 },
  infoTitle: { fontSize: 14, fontWeight: '900' },
  blueInfoTitle: { color: '#1E3A8A' },
  redInfoTitle: { color: '#7F1D1D' },
  infoText: { fontSize: 12, lineHeight: 18, fontWeight: '700' },
  blueInfoText: { color: '#1E40AF' },
  redInfoText: { color: '#B91C1C' },
  imageRail: { gap: 12, paddingRight: 16 },
  imageHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  imagePicker: { width: IMAGE_THUMB_SIZE, height: IMAGE_THUMB_SIZE, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFF' },
  imagePickerText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  uploadedImageWrap: { width: IMAGE_THUMB_SIZE, height: IMAGE_THUMB_SIZE, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  uploadedImageWrapDragging: { borderWidth: 2, borderColor: '#111', zIndex: 10, elevation: 6 },
  uploadedImage: { width: '100%', height: '100%' },
  imageNumberHandle: { position: 'absolute', top: 0, left: 0, zIndex: 3, minWidth: 40, minHeight: 40, padding: 4, alignItems: 'flex-start', justifyContent: 'flex-start' },
  imageNumber: { minWidth: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  imageNumberActive: { backgroundColor: '#111', borderWidth: 1, borderColor: '#FFF' },
  imageNumberText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  imageRemove: { position: 'absolute', top: 4, right: 4, zIndex: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  tagText: { fontSize: 12, fontWeight: '800', color: '#111' },
  twoCol: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  twoColItem: { flex: 1, minWidth: 0 },
  bluePill: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  bluePillText: { fontSize: 11, fontWeight: '800', color: '#1D4ED8' },
  blueHint: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12 },
  blueHintText: { fontSize: 12, fontWeight: '700', color: '#1E3A8A' },
  readOnlyBox: { minHeight: 46, borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: '#F9FAFB' },
  readOnlyText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  redNotice: { borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'center' },
  redNoticeText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '800', color: '#DC2626' },
  summaryBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, gap: 8 },
  summaryTitle: { fontSize: 14, fontWeight: '900', color: '#111', marginBottom: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  summaryValue: { flex: 1, textAlign: 'right', fontSize: 12, fontWeight: '800', color: '#111' },
  grayGuide: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14 },
  grayGuideText: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#374151' },
  borderCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, gap: 16 },
  cardTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  divider: { height: 1, backgroundColor: '#E5E7EB' },
  legalStack: { gap: 12 },
  legalTwoCol: { flexDirection: 'row', gap: 12 },
  legalField: { flex: 1, gap: 6 },
  legalLabel: { fontSize: 12, lineHeight: 18, fontWeight: '900', color: '#374151' },
  legalInputBox: { minHeight: 42, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF' },
  legalInputText: { flex: 1, minHeight: 40, fontSize: 14, fontWeight: '700', color: '#111' },
  legalSuffix: { marginLeft: 6, fontSize: 13, fontWeight: '900', color: '#4B5563' },
  legalInputDisabled: { backgroundColor: '#F3F4F6' },
  legalSectionDivider: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, gap: 12 },
  legalSectionTitle: { fontSize: 12, lineHeight: 18, fontWeight: '900', color: '#111' },
  ingredientList: { gap: 12 },
  ingredientCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#FFF', padding: 12, gap: 12 },
  ingredientDelete: { position: 'absolute', right: 8, top: 8, zIndex: 2 },
  ingredientFields: { gap: 12, paddingRight: 24 },
  ingredientIndex: { fontSize: 11, fontWeight: '800', color: '#9CA3AF' },
  dashedFullButton: { height: 48, borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  dashedFullButtonText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  tasteControlList: { gap: 20 },
  tasteBlock: { gap: 8 },
  tastePercent: { fontSize: 18, fontWeight: '900', color: '#111' },
  tasteSliderTouchArea: { minHeight: 28, justifyContent: 'center' },
  tasteTrack: { width: '100%', height: 8, borderRadius: 999, backgroundColor: '#E5E7EB', position: 'relative' },
  tasteFill: { height: '100%', borderRadius: 999, backgroundColor: '#111' },
  tasteThumb: { position: 'absolute', top: -6, width: 20, height: 20, borderRadius: 10, marginLeft: -10, backgroundColor: '#111' },
  tasteEndText: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  radarCard: { borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, padding: 18, alignItems: 'center' },
  radarTitle: { fontSize: 14, fontWeight: '900', color: '#111', marginBottom: 12 },
  textGuideBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, gap: 4 },
  textGuideLine: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#374151' },
  loadButton: { backgroundColor: '#111', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  loadButtonText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  profileUploadRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileImageBox: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  blackSmallButton: { backgroundColor: '#111', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  blackSmallButtonText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  inlineRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inlineInput: { flex: 1 },
  inlineBlackButton: { minHeight: 48, backgroundColor: '#111', borderRadius: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  inlineBlackButtonText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  disabledButton: { opacity: 0.5 },
  doneBadge: { minHeight: 48, borderRadius: 12, backgroundColor: '#ECFDF5', paddingHorizontal: 14, justifyContent: 'center' },
  smallDoneBadge: { borderRadius: 8, backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 7 },
  doneBadgeText: { color: '#047857', fontSize: 12, fontWeight: '900' },
  verificationBlock: { gap: 8 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerText: { fontSize: 12, fontWeight: '800', color: '#DC2626' },
  smallSubLabel: { fontSize: 12, fontWeight: '700', color: '#374151' },
  uploadButton: { minHeight: 48, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  uploadButtonText: { flexShrink: 1, fontSize: 13, fontWeight: '800', color: '#4B5563' },
  accountFields: { gap: 10 },
  accountNumberInput: { width: '100%', fontSize: 13.5, letterSpacing: 0 },
  selectLike: { minHeight: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#FFF' },
  selectText: { fontSize: 14, fontWeight: '800', color: '#111' },
  selectPlaceholder: { color: '#9CA3AF' },
  taxBox: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, gap: 18 },
  taxTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  radioRow: { flexDirection: 'row', gap: 16 },
  radioItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#111' },
  radioActive: { backgroundColor: '#111' },
  radioText: { fontSize: 14, fontWeight: '700', color: '#111' },
  fundingGuideCard: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, gap: 14 },
  fundingGuideTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  guideParagraph: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, gap: 7 },
  guideParagraphTitle: { fontSize: 13, fontWeight: '900', color: '#111' },
  guideParagraphBody: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#4B5563' },
  guideLink: { fontSize: 14, fontWeight: '800', color: '#374151' },
  fileCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, gap: 12 },
  fileCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  fileTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', gap: 12, paddingTop: 12, paddingHorizontal: 16 },
  saveButton: { flex: 1, height: 56, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '900', color: '#374151' },
  submitButton: { flex: 1, height: 56, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  submitButtonText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  centerModal: { width: '100%', maxWidth: 390, backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', gap: 14 },
  bankModal: { width: '100%', maxWidth: 390, maxHeight: '72%', backgroundColor: '#FFF', borderRadius: 20, padding: 18 },
  bankModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  bankModalClose: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  bankList: { gap: 8, paddingBottom: 4 },
  bankItem: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bankItemActive: { borderColor: '#111', backgroundColor: '#F9FAFB' },
  bankItemText: { fontSize: 14, fontWeight: '800', color: '#374151' },
  bankItemTextActive: { color: '#111' },
  modalIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  alertCircle: { backgroundColor: '#FEE2E2' },
  successCircle: { backgroundColor: '#DCFCE7' },
  blueCircle: { backgroundColor: '#DBEAFE' },
  grayIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#111', textAlign: 'center' },
  confirmTitle: { fontSize: 18, fontWeight: '900', color: '#111', textAlign: 'center' },
  modalBody: { fontSize: 14, lineHeight: 21, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  modalPrimary: { width: '100%', height: 48, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  modalPrimaryFlex: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  modalButtonRow: { flexDirection: 'row', gap: 12, width: '100%' },
  modalSecondary: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryWide: { width: '100%', height: 48, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { fontSize: 14, fontWeight: '900', color: '#374151' },
  modalPlain: { width: '100%', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalPlainText: { fontSize: 14, fontWeight: '900', color: '#6B7280' },
  deleteButton: { width: '100%', height: 48, borderRadius: 12, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  deleteButtonText: { fontSize: 14, fontWeight: '900', color: '#DC2626' },
  nativeDatePickerModal: { width: '100%', maxWidth: 390, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  nativeDatePickerHeader: { padding: 20, alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  nativeDatePickerTitle: { fontSize: 18, fontWeight: '900', color: '#111', textAlign: 'center' },
  nativeDatePickerBody: { fontSize: 13, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  nativeDatePickerFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  guideModal: { width: '100%', maxWidth: 430, maxHeight: '82%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  guideModalHeader: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  guideModalTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  guideClose: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  guideCloseText: { fontSize: 28, color: '#6B7280' },
  guideModalContent: { padding: 20, gap: 16 },
  guideBottom: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  guideSection: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16, gap: 8 },
  guideSectionTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  guideSectionBody: { fontSize: 14, lineHeight: 21, fontWeight: '700', color: '#374151' },
  blueGuideParagraph: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 14, gap: 7 },
  blueGuideTitle: { fontSize: 14, fontWeight: '900', color: '#1E3A8A' },
  blueGuideBody: { fontSize: 13, lineHeight: 19, fontWeight: '700', color: '#1E40AF' },
  redGuideParagraph: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 14, gap: 7 },
  redGuideTitle: { fontSize: 14, fontWeight: '900', color: '#7F1D1D' },
  redGuideBody: { fontSize: 13, lineHeight: 19, fontWeight: '700', color: '#991B1B' },
  addressModal: { flex: 1, backgroundColor: '#FFF' },
  addressHeader: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 16, paddingBottom: 14, gap: 12 },
  addressTitleRow: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addressTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  addressSearchBox: { height: 48, borderRadius: 14, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressInput: { flex: 1, fontSize: 14, color: '#111', fontWeight: '700' },
  addressContent: { padding: 18, gap: 12 },
  addressEmpty: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: 8 },
  addressEmptyTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  addressEmptyText: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textAlign: 'center' },
  resultCount: { fontSize: 13, fontWeight: '900', color: '#6B7280' },
  addressResultCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  manualAddressCard: { backgroundColor: '#111827', borderRadius: 16, padding: 16, gap: 5 },
  manualAddressLabel: { fontSize: 12, fontWeight: '900', color: '#D1D5DB' },
  manualAddressText: { fontSize: 14, lineHeight: 20, fontWeight: '900', color: '#FFF' },
  zipCode: { fontSize: 12, fontWeight: '900', color: '#6B7280' },
  addressResultText: { fontSize: 14, lineHeight: 20, fontWeight: '900', color: '#111' },
  noResult: { paddingVertical: 48, alignItems: 'center', gap: 6 },
  noResultTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  noResultText: { fontSize: 13, fontWeight: '700', color: '#9CA3AF' },
  addressGuideBox: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 14, marginTop: 8 },
  addressGuideText: { fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#1D4ED8' },
  guard: { flex: 1, backgroundColor: '#F6F7F9', padding: 20, justifyContent: 'center' },
  guardCard: { backgroundColor: '#FFF', borderRadius: 22, padding: 24, gap: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  guardTitle: { fontSize: 20, fontWeight: '900', color: '#111', textAlign: 'center' },
  guardDesc: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  guardButton: { width: '100%', height: 52, borderRadius: 14, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  guardButtonText: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  previewScreen: { flex: 1, backgroundColor: '#F9FAFB' },
  previewHeader: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', height: 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 0 },
  previewHeaderTitle: { flex: 1, textAlign: 'center', paddingBottom: 12, fontSize: 16, fontWeight: '900', color: '#111' },
  previewContent: { paddingBottom: 60 },
  previewHeroImage: { height: 256, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  previewImageFill: { width: '100%', height: '100%' },
  previewInner: { padding: 16, gap: 24 },
  previewTitle: { fontSize: 26, lineHeight: 34, fontWeight: '900', color: '#111' },
  previewSummary: { fontSize: 15, lineHeight: 22, fontWeight: '700', color: '#6B7280' },
  previewStatsCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 20, gap: 16 },
  previewStatGrid: { flexDirection: 'row' },
  previewStat: { flex: 1, alignItems: 'center' },
  previewStatMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E5E7EB' },
  previewStatNumber: { fontSize: 24, fontWeight: '900', color: '#111' },
  previewStatUnit: { fontSize: 16 },
  previewStatLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginTop: 4 },
  previewProgress: { height: 8, backgroundColor: '#F3F4F6' },
  previewCalendarRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewCalendarText: { fontSize: 14, fontWeight: '800', color: '#4B5563' },
  previewStartDate: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', paddingLeft: 22 },
  creatorPreviewCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  creatorPreviewImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  creatorPreviewImageFill: { width: '100%', height: '100%' },
  creatorPreviewText: { flex: 1 },
  creatorPreviewName: { fontSize: 14, fontWeight: '900', color: '#111' },
  creatorPreviewCategory: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginTop: 2 },
  creatorBadge: { backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  creatorBadgeText: { fontSize: 12, fontWeight: '900', color: '#374151' },
  previewSection: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 20, gap: 16 },
  previewSectionTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  previewInfoGrid: { gap: 10 },
  previewMiniInfo: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14 },
  previewMiniLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  previewMiniValue: { fontSize: 14, fontWeight: '900', color: '#111' },
  previewBlueNote: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE', borderRadius: 12, padding: 14, gap: 6 },
  previewBlueNoteTitle: { fontSize: 14, fontWeight: '900', color: '#1E3A8A' },
  previewBlueNoteText: { fontSize: 14, lineHeight: 21, fontWeight: '700', color: '#1E3A8A' },
  previewParagraph: { fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#374151' },
  previewUrlBox: { borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', padding: 12, gap: 4 },
  previewUrlLabel: { fontSize: 12, fontWeight: '900', color: '#6B7280' },
  previewUrlText: { fontSize: 13, lineHeight: 19, fontWeight: '800', color: '#111' },
  previewPriceBlock: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, overflow: 'hidden', flexDirection: 'row' },
  previewPriceAccent: { width: 4 },
  previewPriceAccentDark: { backgroundColor: '#111' },
  previewPriceAccentGray: { backgroundColor: '#D1D5DB' },
  previewPriceBody: { flex: 1, padding: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  previewPriceValue: { fontSize: 26, fontWeight: '900', color: '#111' },
  previewPriceSub: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  previewGoalBox: { backgroundColor: '#111827', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  previewGoalLabel: { fontSize: 13, fontWeight: '800', color: '#D1D5DB' },
  previewGoalValue: { flex: 1, textAlign: 'right', fontSize: 16, fontWeight: '900', color: '#FFF' },
  previewTasteRow: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewTasteLabel: { width: 52, fontSize: 13, fontWeight: '900', color: '#374151' },
  previewTasteTrack: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden' },
  previewTasteFill: { height: '100%', backgroundColor: '#111' },
  previewTasteValue: { width: 42, textAlign: 'right', fontSize: 13, fontWeight: '900', color: '#111' },
  previewGuideTitle: { fontSize: 17, fontWeight: '900', color: '#111' },
  previewDivider: { height: 1, backgroundColor: '#E5E7EB' },
  previewGrayParagraph: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 22, fontWeight: '700', color: '#374151' },
});
