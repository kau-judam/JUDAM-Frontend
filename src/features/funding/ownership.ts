import type { User } from '@/contexts/AuthContext';
import type { FundingProject } from '@/constants/data';

function normalizeOwnerId(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function hasMatchingId(userIds: string[], ownerIds: (string | null)[]) {
  return ownerIds.some((ownerId) => ownerId !== null && userIds.includes(ownerId));
}

export function isFundingProjectOwnedByBrewery(user: User | null | undefined, project: FundingProject | null | undefined) {
  if (!user || !project || user.type !== 'brewery') return false;
  const userIds = [user.id, user.uid].map(normalizeOwnerId).filter((id): id is string => id !== null);
  const backendOwnerIds = [project.breweryUserId, project.ownerUserId].map(normalizeOwnerId);
  const hasBackendOwnerId = backendOwnerIds.some(Boolean);

  if (hasBackendOwnerId) {
    return hasMatchingId(userIds, backendOwnerIds);
  }

  const localOwnerIds = [project.creatorId, project.breweryId].map(normalizeOwnerId);
  const hasLocalOwnerId = localOwnerIds.some(Boolean);

  if (hasLocalOwnerId) {
    return hasMatchingId(userIds, localOwnerIds);
  }

  if (project.isMine === true) return true;
  if (project.isMine === false) return false;
  const breweryName = user.breweryName || user.name;
  const matchesName = Boolean(breweryName) && breweryName?.trim() === project.brewery.trim();
  return matchesName;
}
