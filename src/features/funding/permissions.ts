import { isCompletedFundingStatus } from '@/constants/data';
import type { FundingProject } from '@/constants/data';

export function canAccessFundingReviews(project: FundingProject | null | undefined) {
  return Boolean(project && isCompletedFundingStatus(project.status) && project.status !== '펀딩 실패');
}

export function canBypassFundingReviewParticipation(project: FundingProject | null | undefined) {
  if (!project) return false;

  // TODO: 산사 막걸리 후기 DB 확인용 임시 예외입니다. 테스트가 끝나면 제거하세요.
  const normalizedTitle = `${project.title || ''} ${project.shortTitle || ''} ${project.shortDescription || ''}`.replace(/\s/g, '');
  return normalizedTitle.includes('산사막걸리');
}
