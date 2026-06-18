import type { ReactNode } from 'react';
import { Smartphone } from 'lucide-react-native';

import type { FundingProject } from '@/constants/data';

export type PaymentMethod = 'toss';
export type InfoModalType = 'terms' | 'privacy' | null;
export type ShippingInfo = {
  recipientName: string;
  address: string;
  detailAddress: string;
  phone: string;
};
export type SupportAddress = {
  zipCode: string;
  address: string;
};

export const messageOptions = [
  '이 프로젝트의 성공을 응원합니다!',
  '우리 술의 미래를 함께 만들어요!',
  '전통주의 새로운 도전을 지지합니다.',
  '맛있는 술 기대하겠습니다. 화이팅!',
];

export const paymentMethods: {
  id: PaymentMethod;
  title: string;
  desc: string;
  icon: ReactNode;
}[] = [
  { id: 'toss', title: '토스페이', desc: '간편결제', icon: <Smartphone size={20} color="#111" /> },
];

export const addressSuggestions: SupportAddress[] = [];

export const MAX_ADDITIONAL_SUPPORT = 10000000;
export const FIXED_PROJECT_SHIPPING_FEE = 3000;

export function digitsOnly(value: string) {
  return value.replace(/[^0-9]/g, '');
}

export function getRecentShippingKey(userId?: string) {
  return `judam_recent_shipping_info:${userId || 'default'}`;
}

export function getInitialQuantity(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return Math.max(1, Number(raw) || 1);
}

export function getFundingId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return Number(raw);
}

export function getProjectUnitPrice(project: FundingProject) {
  if (typeof project.pricePerBottle === 'number') return project.pricePerBottle;
  const quantity = project.targetQuantity || project.totalQuantity || 0;
  if (project.goalAmount > 0 && quantity > 0) return Math.round(project.goalAmount / quantity);
  return 0;
}

export function getProjectShippingFee(_project: FundingProject) {
  return FIXED_PROJECT_SHIPPING_FEE;
}

export function getProjectBottleSize(project: FundingProject) {
  return project.bottleSize || project.volume || '-';
}

export function getProjectAlcoholContent(project: FundingProject) {
  return project.alcoholContent || '-';
}

export function getProjectEstimatedDelivery(project: FundingProject) {
  return project.estimatedDelivery || '-';
}

export function getPrimaryRewardItem(project: FundingProject) {
  const rewardItem = project.rewardItems?.[0]
    ?.replace(/\s*\uAE30\uBCF8\s*\uD6C4\uC6D0(?:\uC784)?\s*$/i, '')
    .trim();
  if (rewardItem && !/\uC544\uC9C1\s*\uC11C\uBE0C\uC7AC\uB8CC\s*api\s*\uC5F0\uACB0\s*\uC548\uD568/i.test(rewardItem)) {
    return rewardItem;
  }
  return project.title;
}

export function getPaymentSummary(method: PaymentMethod | null) {
  if (method === 'toss') return '토스페이 간편결제';
  return '결제수단 미선택';
}
