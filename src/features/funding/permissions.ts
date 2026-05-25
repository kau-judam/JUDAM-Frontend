import { isCompletedFundingStatus } from '@/constants/data';
import type { FundingProject } from '@/constants/data';

export function canAccessFundingReviews(project: FundingProject | null | undefined) {
  return Boolean(project && isCompletedFundingStatus(project.status) && project.status !== '펀딩 실패');
}
