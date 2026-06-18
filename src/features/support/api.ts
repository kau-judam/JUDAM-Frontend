export const JUDAM_SUPPORT_API_BASE_URL = 'https://api.kaujudam.com';

type SupportApiEnvelope<T> = {
  status?: number;
  message?: string;
  data?: T;
};

export type SupportInquiryCategory =
  | 'ACCOUNT'
  | 'FUNDING'
  | 'PAYMENT'
  | 'DELIVERY'
  | 'BREWERY'
  | 'ETC';

export type CreateSupportInquiryPayload = {
  replyEmail: string;
  category: SupportInquiryCategory;
  subject: string;
  content: string;
};

export type CreateSupportInquiryResponse = {
  inquiryId: number;
};

export class SupportApiError extends Error {
  status: number;
  path: string;
  data: unknown;

  constructor(message: string, status: number, path: string, data: unknown) {
    super(message);
    this.name = 'SupportApiError';
    this.status = status;
    this.path = path;
    this.data = data;
  }
}

function parseSupportResponseBody(path: string, response: Response, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    throw new SupportApiError(
      `API 응답을 처리할 수 없습니다. ${response.status} ${path} (${contentType})`,
      response.status,
      path,
      text
    );
  }
}

function unwrapSupportData<T>(response: T | SupportApiEnvelope<T>) {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as SupportApiEnvelope<T>).data;
    if (data !== undefined) return data;
  }
  return response as T;
}

async function requestSupportJson<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${JUDAM_SUPPORT_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  const text = await response.text();
  const data = parseSupportResponseBody(path, response, text);

  if (!response.ok) {
    const message = (data as SupportApiEnvelope<unknown> | null)?.message || `HTTP ${response.status}`;
    throw new SupportApiError(message, response.status, path, data);
  }

  return data as T;
}

export function getSupportApiErrorMessage(error: unknown, fallback = '요청 처리 중 오류가 발생했습니다.') {
  if (error instanceof SupportApiError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

export async function createSupportInquiry(payload: CreateSupportInquiryPayload) {
  const response = await requestSupportJson<SupportApiEnvelope<CreateSupportInquiryResponse>>(
    '/api/support/inquiries',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return unwrapSupportData<CreateSupportInquiryResponse>(response);
}
