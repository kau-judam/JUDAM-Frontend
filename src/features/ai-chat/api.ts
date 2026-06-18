import { getAuthAccessToken, refreshAuthAccessToken } from '@/features/auth/api';

export const JUDAM_AI_CHAT_API_BASE_URL = 'https://api.kaujudam.com';

export type AIChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIChatResponseData = {
  response: string;
  context: string;
  suggested_questions: string[];
};

type AIChatApiResponse = {
  status: number;
  message: string;
  data?: AIChatResponseData;
};

type ApiErrorBody = {
  status?: number;
  message?: string;
};

async function getStoredAccessToken() {
  return getAuthAccessToken();
}

async function parseApiError(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.message || `AI 챗봇 요청에 실패했습니다. (${response.status})`;
  } catch {
    return `AI 챗봇 요청에 실패했습니다. (${response.status})`;
  }
}

export async function sendAIChatMessage(payload: {
  message: string;
  userId?: string;
  history?: AIChatHistoryItem[];
}) {
  const token = await getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${JUDAM_AI_CHAT_API_BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: payload.message,
      user_id: payload.userId,
      history: payload.history || [],
    }),
  });

  if (response.status === 401 && token) {
    const refreshedToken = await refreshAuthAccessToken();
    if (refreshedToken) {
      response = await fetch(`${JUDAM_AI_CHAT_API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          ...headers,
          Authorization: `Bearer ${refreshedToken}`,
        },
        body: JSON.stringify({
          message: payload.message,
          user_id: payload.userId,
          history: payload.history || [],
        }),
      });
    }
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const body = (await response.json()) as AIChatApiResponse;
  if (!body.data?.response) {
    throw new Error(body.message || 'AI 챗봇 응답을 확인할 수 없습니다.');
  }

  return body.data;
}
