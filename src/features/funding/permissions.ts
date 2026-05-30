import { isCompletedFundingStatus, isFailedFundingStatus } from '@/constants/data';
import type { FundingProject } from '@/constants/data';

export function canAccessFundingReviews(project: FundingProject | null | undefined) {
  return Boolean(project && isCompletedFundingStatus(project.status) && !isFailedFundingStatus(project.status));
}
