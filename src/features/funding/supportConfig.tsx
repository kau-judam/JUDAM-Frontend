import type { ReactNode } from 'react';
import { Landmark, Smartphone } from 'lucide-react-native';

import type { FundingProject } from '@/constants/data';

export type PaymentMethod = 'toss' | 'account';
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
  { id: 'account', title: '계좌이체', desc: '은행 선택 후 입금', icon: <Landmark size={20} color="#111" /> },
];

export const addressSuggestions: SupportAddress[] = [];

export const bankOptions = ['국민은행', '신한은행', '우리은행', '하나은행', '농협은행', '카카오뱅크'];
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
  return project.rewardItems?.[0] || `${project.title} ${getProjectBottleSize(project)} x 1`;
}

export function getPaymentSummary(
  method: PaymentMethod | null,
  accountBank: string,
  depositorName: string
) {
  if (method === 'toss') return '토스페이 간편결제';
  if (method === 'account') return `${accountBank || '은행 미선택'} · ${depositorName || '입금자명 미입력'}`;
  return '결제수단 미선택';
}
