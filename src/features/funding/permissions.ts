import { isSuccessfulFundingStatus } from '@/constants/data';
import type { FundingProject } from '@/constants/data';

export function canAccessFundingReviews(project: FundingProject | null | undefined) {
  return Boolean(project && isSuccessfulFundingStatus(project.status));
}
