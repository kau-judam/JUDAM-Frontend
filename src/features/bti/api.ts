import type { BtiSurveyPayload, BtiSurveyTasteVector } from '@/features/bti/data';
import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

const JUDAM_API_BASE_URL = 'https://api.kaujudam.com';

type SurveyConvertEnvelope = {
  status?: number;
  message?: string;
  data?: SurveyConvertApiResponse;
};

export type SurveyConvertData = {
  status: string;
  taste_vector: BtiSurveyTasteVector;
  bti_code?: string;
  character_name?: string;
  alcohol_label?: string;
  experience_level?: string;
  preferred_abv?: string;
  preferred_body?: string;
  preferred_fruit?: string;
  preferred_food_pairing?: string[];
  preferred_aroma?: string[];
  taste_profile_summary?: string;
  food_pairing?: string[];
};

type SurveyConvertApiResponse = Partial<SurveyConvertData> & {
  tasteVector?: BtiSurveyTasteVector;
  btiCode?: string;
  characterName?: string;
  alcoholLabel?: string;
  foodPairing?: string[];
  preferredFoodPairing?: string[];
  scores?: Partial<Record<'sweetness' | 'body' | 'carbonation' | 'flavor' | 'abv' | 'alcohol', number>>;
  result?: SurveyConvertApiResponse;
  surveyResult?: SurveyConvertApiResponse;
  profile?: SurveyConvertApiResponse;
  sulbti?: SurveyConvertApiResponse;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeNumber(value: unknown) {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function normalizeTasteVectorCandidate(value: unknown): BtiSurveyTasteVector | null {
  if (!isRecord(value)) return null;

  const sweetness = normalizeNumber(value.sweetness);
  const body = normalizeNumber(value.body);
  const carbonation = normalizeNumber(value.carbonation);
  const flavor = normalizeNumber(value.flavor ?? value.acidity);
  const alcohol = normalizeNumber(value.alcohol ?? value.abv ?? value.alcoholIntensity);

  if (
    sweetness === undefined ||
    body === undefined ||
    carbonation === undefined ||
    flavor === undefined ||
    alcohol === undefined
  ) {
    return null;
  }

  return {
    sweetness,
    body,
    carbonation,
    flavor,
    alcohol,
    acidity: normalizeNumber(value.acidity),
    aroma_intensity: normalizeNumber(value.aroma_intensity ?? value.aromaIntensity),
    finish: normalizeNumber(value.finish),
  };
}

function findTasteVector(value: unknown, visited = new Set<unknown>()): BtiSurveyTasteVector | null {
  if (!isRecord(value) || visited.has(value)) return null;
  visited.add(value);

  const direct =
    normalizeTasteVectorCandidate(value.taste_vector) ||
    normalizeTasteVectorCandidate(value.tasteVector) ||
    normalizeTasteVectorCandidate(value.scores) ||
    normalizeTasteVectorCandidate(value);
  if (direct) return direct;

  for (const key of ['data', 'result', 'surveyResult', 'profile', 'sulbti', 'userProfile', 'conversion']) {
    const nested = findTasteVector(value[key], visited);
    if (nested) return nested;
  }

  return null;
}

function findFirstString(value: unknown, keys: string[], visited = new Set<unknown>()): string | undefined {
  if (!isRecord(value) || visited.has(value)) return undefined;
  visited.add(value);

  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }

  for (const key of ['data', 'result', 'surveyResult', 'profile', 'sulbti', 'userProfile', 'conversion']) {
    const nested = findFirstString(value[key], keys, visited);
    if (nested) return nested;
  }

  return undefined;
}

function findFirstStringArray(value: unknown, keys: string[], visited = new Set<unknown>()): string[] | undefined {
  if (!isRecord(value) || visited.has(value)) return undefined;
  visited.add(value);

  for (const key of keys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) {
      const strings = candidate.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
      if (strings.length > 0) return strings;
    }
  }

  for (const key of ['data', 'result', 'surveyResult', 'profile', 'sulbti', 'userProfile', 'conversion']) {
    const nested = findFirstStringArray(value[key], keys, visited);
    if (nested) return nested;
  }

  return undefined;
}

function getSurveyConvertData(response: SurveyConvertEnvelope | SurveyConvertApiResponse): SurveyConvertApiResponse {
  if ('data' in response && response.data) return response.data;
  return response as SurveyConvertApiResponse;
}

function normalizeSurveyConvertData(response: SurveyConvertEnvelope | SurveyConvertApiResponse): SurveyConvertData {
  const data = getSurveyConvertData(response);
  const tasteVector = findTasteVector(data) || findTasteVector(response);

  if (!tasteVector) {
    throw new Error('술BTI 설문 변환 결과에 맛 지표가 없습니다.');
  }

  const btiCode = findFirstString(data, ['bti_code', 'btiCode', 'type']) || findFirstString(response, ['bti_code', 'btiCode', 'type']);
  const characterName =
    findFirstString(data, ['character_name', 'characterName', 'title']) ||
    findFirstString(response, ['character_name', 'characterName', 'title']);
  const alcoholLabel =
    findFirstString(data, ['alcohol_label', 'alcoholLabel', 'description']) ||
    findFirstString(response, ['alcohol_label', 'alcoholLabel', 'description']);
  const foodPairing =
    findFirstStringArray(data, ['food_pairing', 'foodPairing', 'preferred_food_pairing', 'preferredFoodPairing']) ||
    findFirstStringArray(response, ['food_pairing', 'foodPairing', 'preferred_food_pairing', 'preferredFoodPairing']);

  return {
    ...data,
    status: data.status || 'success',
    taste_vector: tasteVector,
    bti_code: btiCode || data.bti_code,
    character_name: characterName || data.character_name,
    alcohol_label: alcoholLabel || data.alcohol_label,
    food_pairing: foodPairing || data.food_pairing,
    preferred_food_pairing: data.preferred_food_pairing || foodPairing,
  };
}

export async function convertBtiSurvey(payload: BtiSurveyPayload, userId?: string | number) {
  const query = userId ? `?user_id=${encodeURIComponent(String(userId))}` : '';
  const accessToken = await getAuthAccessToken();
  if (userId && !accessToken) {
    throw new Error('로그인 정보가 필요합니다. 다시 로그인해주세요.');
  }

  const requestSurveyConvert = (token?: string | null) => fetch(`${JUDAM_API_BASE_URL}/api/survey/convert${query}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  let response = await requestSurveyConvert(accessToken);
  let json = await response.json().catch(() => null) as SurveyConvertEnvelope | null;

  if (response.status === 401 && userId) {
    const refreshedAccessToken = await refreshAuthAccessToken();
    if (refreshedAccessToken) {
      response = await requestSurveyConvert(refreshedAccessToken);
      json = await response.json().catch(() => null) as SurveyConvertEnvelope | null;
    }
  }

  if (!response.ok) {
    throw new Error(json?.message || `술BTI 설문 변환에 실패했습니다. (${response.status})`);
  }

  if (!json) {
    throw new Error('술BTI 설문 변환 응답이 비어 있습니다.');
  }

  return normalizeSurveyConvertData(json);
}
