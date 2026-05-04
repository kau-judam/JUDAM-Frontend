import type { ReactNode } from 'react';
import { CreditCard, Landmark, Smartphone } from 'lucide-react-native';

import type { FundingProject } from '@/constants/data';

export type PaymentMethod = 'card' | 'npay' | 'account';
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
  { id: 'card', title: '카드 간편결제', desc: '할부 가능', icon: <CreditCard size={20} color="#111" /> },
  { id: 'npay', title: '네이버페이', desc: '간편 결제', icon: <Smartphone size={20} color="#111" /> },
  { id: 'account', title: '계좌이체', desc: '무통장 입금', icon: <Landmark size={20} color="#111" /> },
];

export const mockAddresses: SupportAddress[] = [
  { zipCode: '06234', address: '서울특별시 강남구 테헤란로 123' },
  { zipCode: '06235', address: '서울특별시 강남구 테헤란로 456' },
  { zipCode: '04524', address: '서울특별시 중구 세종대로 110' },
  { zipCode: '03088', address: '서울특별시 종로구 종로 1' },
  { zipCode: '13494', address: '경기도 성남시 분당구 판교역로 235' },
  { zipCode: '63309', address: '제주특별자치도 제주시 첨단로 242' },
];

export const cardCompanies = ['신한카드', 'KB국민카드', '현대카드', '삼성카드'];
export const installmentOptions = ['일시불', '2개월', '3개월', '6개월'];
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

export function getPrimaryRewardItem(project: FundingProject) {
  return project.rewardItems?.[0] || `${project.title} ${project.bottleSize || '375ml'} x 1`;
}

export function getPaymentSummary(
  method: PaymentMethod | null,
  cardCompany: string,
  installment: string,
  accountBank: string,
  depositorName: string
) {
  if (method === 'card') return `${cardCompany} · ${installment}`;
  if (method === 'npay') return '네이버페이 간편결제';
  if (method === 'account') return `${accountBank || '은행 미선택'} · ${depositorName || '입금자명 미입력'}`;
  return '결제수단 미선택';
}
