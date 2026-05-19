import { isCompletedFundingStatus } from '@/constants/data';
import type { FundingProject } from '@/constants/data';

export function isTemporarySansaReviewTestProject(project: FundingProject | null | undefined) {
  const title = `${project?.title || ''} ${project?.shortTitle || ''}`.replace(/\s/g, '');
  // TODO: 산사 막걸리 후기 DB 확인이 끝나면 이 임시 예외는 제거해야 합니다.
  return title.includes('산사막걸리프로젝트') || title.includes('산사막걸리');
}

export function canAccessFundingReviews(project: FundingProject | null | undefined) {
  return Boolean(project && isCompletedFundingStatus(project.status) && project.status !== '펀딩 실패');
}
