import { JUDAM_FUNDING_API_BASE_URL } from '@/features/funding/api';

export type HomeStatsSummary = {
  memberCount: number;
  totalFundingAmount: number;
  activeFundingCount: number;
  successfulFundingCount: number;
};

export type FundingStatsSummary = {
  supportableFundingCount: number;
  totalBackerCount: number;
  successfulProjectCount: number;
  totalRaisedAmount: number;
};

export type StatsSummaryResponse = {
  home: HomeStatsSummary;
  funding: FundingStatsSummary;
};

const EMPTY_HOME_STATS: HomeStatsSummary = {
  memberCount: 0,
  totalFundingAmount: 0,
  activeFundingCount: 0,
  successfulFundingCount: 0,
};

const EMPTY_FUNDING_STATS: FundingStatsSummary = {
  supportableFundingCount: 0,
  totalBackerCount: 0,
  successfulProjectCount: 0,
  totalRaisedAmount: 0,
};

function readStatsObject(source: unknown, key: string) {
  if (!source || typeof source !== 'object') return {};
  const record = source as Record<string, unknown>;
  const value = record[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function readStatsNumber(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value.replace(/,/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function normalizeStatsSummary(response: unknown): StatsSummaryResponse {
  const root = response && typeof response === 'object' ? response as Record<string, unknown> : {};
  const data = readStatsObject(root, 'data');
  const home = readStatsObject(data, 'home');
  const funding = readStatsObject(data, 'funding');

  return {
    home: {
      memberCount: readStatsNumber(home, ['memberCount', 'member_count']),
      totalFundingAmount: readStatsNumber(home, ['totalFundingAmount', 'total_funding_amount']),
      activeFundingCount: readStatsNumber(home, ['activeFundingCount', 'active_funding_count']),
      successfulFundingCount: readStatsNumber(home, ['successfulFundingCount', 'successful_funding_count']),
    },
    funding: {
      supportableFundingCount: readStatsNumber(funding, ['supportableFundingCount', 'supportable_funding_count']),
      totalBackerCount: readStatsNumber(funding, ['totalBackerCount', 'total_backer_count']),
      successfulProjectCount: readStatsNumber(funding, ['successfulProjectCount', 'successful_project_count']),
      totalRaisedAmount: readStatsNumber(funding, ['totalRaisedAmount', 'total_raised_amount']),
    },
  };
}

export function getEmptyStatsSummary(): StatsSummaryResponse {
  return {
    home: { ...EMPTY_HOME_STATS },
    funding: { ...EMPTY_FUNDING_STATS },
  };
}

export async function getStatsSummary() {
  const response = await fetch(`${JUDAM_FUNDING_API_BASE_URL}/api/stats/summary`);
  const text = await response.text();
  const data = text.trim() ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data
      ? String((data as { message?: unknown }).message || `HTTP ${response.status}`)
      : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return normalizeStatsSummary(data);
}
