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

export const mockAddresses: SupportAddress[] = [
  { zipCode: '06234', address: '서울특별시 강남구 테헤란로 123' },
  { zipCode: '06235', address: '서울특별시 강남구 테헤란로 456' },
  { zipCode: '04524', address: '서울특별시 중구 세종대로 110' },
  { zipCode: '03088', address: '서울특별시 종로구 종로 1' },
  { zipCode: '13494', address: '경기도 성남시 분당구 판교역로 235' },
  { zipCode: '63309', address: '제주특별자치도 제주시 첨단로 242' },
];

export const bankOptions = ['국민은행', '신한은행', '우리은행', '하나은행', '농협은행', '카카오뱅크'];
export const MAX_ADDITIONAL_SUPPORT = 10000000;

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

export function getProjectShippingFee(project: FundingProject) {
  return project.shippingFee ?? 0;
}

export function getProjectBottleSize(project: FundingProject) {
  return project.bottleSize || project.volume || '용량 안내 예정';
}

export function getProjectAlcoholContent(project: FundingProject) {
  return project.alcoholContent || '별도 안내';
}

export function getProjectEstimatedDelivery(project: FundingProject) {
  return project.estimatedDelivery || '펀딩 종료 후 순차 안내';
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
