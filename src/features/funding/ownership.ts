import type { User } from '@/contexts/AuthContext';
import type { FundingProject } from '@/constants/data';

const DEMO_BREWERY_PROJECT_IDS = new Set([1]);

export function isFundingProjectOwnedByBrewery(user: User | null | undefined, project: FundingProject | null | undefined) {
  if (!user || !project || user.type !== 'brewery') return false;
  const breweryName = user.breweryName || user.name;
  const matchesName = Boolean(breweryName) && breweryName?.trim() === project.brewery.trim();
  return matchesName || DEMO_BREWERY_PROJECT_IDS.has(project.id);
}
