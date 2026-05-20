import type { BtiSurveyPayload, BtiSurveyTasteVector } from '@/features/bti/data';

const JUDAM_API_BASE_URL = 'http://43.202.24.223:3000';

type SurveyConvertEnvelope = {
  status?: number;
  message?: string;
  data?: SurveyConvertData;
};

export type SurveyConvertData = {
  status: string;
  taste_vector: BtiSurveyTasteVector;
  bti_code?: string;
  character_name?: string;
  experience_level?: string;
  preferred_abv?: string;
  preferred_body?: string;
  preferred_fruit?: string;
  preferred_food_pairing?: string[];
  preferred_aroma?: string[];
  taste_profile_summary?: string;
  food_pairing?: string[];
};

function getSurveyConvertData(response: SurveyConvertEnvelope | SurveyConvertData): SurveyConvertData {
  if ('data' in response && response.data) return response.data;
  return response as SurveyConvertData;
}

export async function convertBtiSurvey(payload: BtiSurveyPayload, userId?: string | number) {
  const query = userId ? `?user_id=${encodeURIComponent(String(userId))}` : '';
  const response = await fetch(`${JUDAM_API_BASE_URL}/api/survey/convert${query}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json().catch(() => null) as SurveyConvertEnvelope | null;

  if (!response.ok) {
    throw new Error(json?.message || `술BTI 설문 변환에 실패했습니다. (${response.status})`);
  }

  if (!json) {
    throw new Error('술BTI 설문 변환 응답이 비어 있습니다.');
  }

  const data = getSurveyConvertData(json);
  if (!data?.taste_vector) {
    throw new Error('술BTI 설문 변환 결과에 맛 지표가 없습니다.');
  }

  return data;
}
