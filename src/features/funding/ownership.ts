import type { User } from '@/contexts/AuthContext';
import type { FundingProject } from '@/constants/data';

export function isFundingProjectOwnedByBrewery(user: User | null | undefined, project: FundingProject | null | undefined) {
  if (!user || !project || user.type !== 'brewery') return false;
  if (project.isMine === true) return true;
  const userIds = [user.id, user.uid].filter(Boolean).map((id) => String(id));
  if (project.breweryUserId && userIds.includes(String(project.breweryUserId))) return true;
  if (project.ownerUserId && userIds.includes(String(project.ownerUserId))) return true;
  if (project.creatorId && userIds.includes(project.creatorId)) return true;
  if (project.breweryId && userIds.includes(project.breweryId)) return true;
  if (project.isMine === false) return false;
  const breweryName = user.breweryName || user.name;
  const matchesName = Boolean(breweryName) && breweryName?.trim() === project.brewery.trim();
  return matchesName;
}
