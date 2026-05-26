import type { User } from '@/contexts/AuthContext';
import type { FundingProject } from '@/constants/data';

export function isFundingProjectOwnedByBrewery(user: User | null | undefined, project: FundingProject | null | undefined) {
  if (!user || !project || user.type !== 'brewery') return false;
  const userIds = [user.id, user.uid].filter(Boolean);
  if (project.creatorId && userIds.includes(project.creatorId)) return true;
  if (project.breweryId && userIds.includes(project.breweryId)) return true;
  const breweryName = user.breweryName || user.name;
  const matchesName = Boolean(breweryName) && breweryName?.trim() === project.brewery.trim();
  return matchesName;
}
