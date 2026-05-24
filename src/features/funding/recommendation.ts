import {
  isCompletedFundingStatus,
  isSupportableFundingStatus,
} from '@/constants/data';
import type { FundingProject, ProjectStatus, TasteProfile } from '@/constants/data';

export type FundingStatusFilter = "전체 프로젝트" | "진행중인 프로젝트" | "성사된 프로젝트";
export type FundingSortOption = "추천순" | "인기순" | "마감임박" | "최신순";

export const statusOptions: FundingStatusFilter[] = ["전체 프로젝트", "진행중인 프로젝트", "성사된 프로젝트"];
export const sortOptions: FundingSortOption[] = ["추천순", "인기순", "마감임박", "최신순"];

const btiTasteProfiles: Record<string, TasteProfile> = {
  SHFC: { sweetness: 100, aroma: 85, acidity: 45, body: 95, carbonation: 90 },
  SHFU: { sweetness: 95, aroma: 90, acidity: 70, body: 90, carbonation: 85 },
  SHMC: { sweetness: 95, aroma: 80, acidity: 35, body: 95, carbonation: 10 },
  SHMU: { sweetness: 85, aroma: 95, acidity: 65, body: 90, carbonation: 10 },
  SLFC: { sweetness: 80, aroma: 65, acidity: 45, body: 35, carbonation: 90 },
  SLFU: { sweetness: 75, aroma: 95, acidity: 80, body: 35, carbonation: 95 },
  SLMC: { sweetness: 70, aroma: 65, acidity: 35, body: 30, carbonation: 10 },
  SLMU: { sweetness: 70, aroma: 95, acidity: 75, body: 30, carbonation: 10 },
  DHFC: { sweetness: 20, aroma: 70, acidity: 45, body: 95, carbonation: 90 },
  DHFU: { sweetness: 20, aroma: 95, acidity: 90, body: 95, carbonation: 90 },
  DHMC: { sweetness: 15, aroma: 80, acidity: 35, body: 95, carbonation: 10 },
  DHMU: { sweetness: 15, aroma: 95, acidity: 85, body: 95, carbonation: 10 },
  DLFC: { sweetness: 20, aroma: 70, acidity: 40, body: 30, carbonation: 90 },
  DLFU: { sweetness: 20, aroma: 95, acidity: 85, body: 30, carbonation: 90 },
  DLMC: { sweetness: 15, aroma: 65, acidity: 35, body: 30, carbonation: 10 },
  DLMU: { sweetness: 15, aroma: 95, acidity: 80, body: 30, carbonation: 10 },
};

export function getTasteProfileFromSulbti(sulbti?: string): TasteProfile | null {
  if (!sulbti) return null;
  const code = sulbti.trim().toUpperCase().replace(/^JD-/, "").split("-")[0];
  return btiTasteProfiles[code] || null;
}

export function getTasteMatchScore(project: FundingProject, userTasteProfile: TasteProfile | null) {
  const serverMatchScore =
    project.sulbtiMatchScore ??
    project.matchScore ??
    project.tasteMatchScore ??
    project.matchRate;
  if (typeof serverMatchScore === 'number' && Number.isFinite(serverMatchScore)) {
    return Math.max(0, Math.min(100, Math.round(serverMatchScore)));
  }
  if (!userTasteProfile || !project.tasteProfile) return null;
  const diff =
    Math.abs(project.tasteProfile.sweetness - userTasteProfile.sweetness) +
    Math.abs(project.tasteProfile.aroma - userTasteProfile.aroma) +
    Math.abs(project.tasteProfile.acidity - userTasteProfile.acidity) +
    Math.abs(project.tasteProfile.body - userTasteProfile.body) +
    Math.abs(project.tasteProfile.carbonation - userTasteProfile.carbonation);
  return Math.max(0, Math.round(100 - diff / 5));
}

export function getRecommendationStatusPriority(status: ProjectStatus) {
  if (isSupportableFundingStatus(status)) return 0;
  if (status === "펀딩 예정") return 1;
  if (isCompletedFundingStatus(status)) return 2;
  return 3;
}

export function matchesFundingStatusFilter(project: FundingProject, filter: FundingStatusFilter) {
  if (filter === "진행중인 프로젝트") return isSupportableFundingStatus(project.status);
  if (filter === "성사된 프로젝트") return isCompletedFundingStatus(project.status);
  return true;
}

export function matchesFundingSearch(project: FundingProject, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return (
    project.title.toLowerCase().includes(normalizedSearch) ||
    project.brewery.toLowerCase().includes(normalizedSearch) ||
    project.category.toLowerCase().includes(normalizedSearch) ||
    project.location.toLowerCase().includes(normalizedSearch) ||
    (project.mainIngredients || '').toLowerCase().includes(normalizedSearch) ||
    (project.subIngredients || '').toLowerCase().includes(normalizedSearch) ||
    (project.tags || []).some((tag) => tag.toLowerCase().includes(normalizedSearch))
  );
}

export function getProjectFavoriteCount(project: FundingProject, favoriteFundings: number[] = []) {
  return (project.favoriteCount || 0) + (favoriteFundings.includes(project.id) ? 1 : 0);
}

export function getProjectCreatedTime(project: FundingProject) {
  const date = project.createdAt || project.updatedAt;
  const time = date ? new Date(date).getTime() : NaN;
  return Number.isFinite(time) ? time : project.id;
}

export function sortFundingProjectsForDisplay(
  projects: FundingProject[],
  sort: FundingSortOption,
  userTasteProfile: TasteProfile | null,
  favoriteFundings: number[] = []
) {
  if (sort === "추천순" && userTasteProfile) {
    return [...projects].sort((a, b) => {
      const statusDiff = getRecommendationStatusPriority(a.status) - getRecommendationStatusPriority(b.status);
      if (statusDiff !== 0) return statusDiff;
      const matchDiff = (getTasteMatchScore(b, userTasteProfile) ?? -1) - (getTasteMatchScore(a, userTasteProfile) ?? -1);
      if (matchDiff !== 0) return matchDiff;
      return getProjectFavoriteCount(b, favoriteFundings) - getProjectFavoriteCount(a, favoriteFundings);
    });
  }
  if (sort === "마감임박") {
    return [...projects].sort((a, b) => {
      const statusDiff = getRecommendationStatusPriority(a.status) - getRecommendationStatusPriority(b.status);
      if (statusDiff !== 0) return statusDiff;
      return a.daysLeft - b.daysLeft;
    });
  }
  if (sort === "최신순") {
    return [...projects].sort((a, b) => getProjectCreatedTime(b) - getProjectCreatedTime(a));
  }
  return [...projects].sort((a, b) => {
    const favoriteDiff = getProjectFavoriteCount(b, favoriteFundings) - getProjectFavoriteCount(a, favoriteFundings);
    if (favoriteDiff !== 0) return favoriteDiff;
    return b.backers - a.backers;
  });
}

export function getFundingListStats(projects: FundingProject[]) {
  return {
    supportableCount: projects.filter((project) => isSupportableFundingStatus(project.status)).length,
    totalBackers: projects.reduce((sum, project) => sum + project.backers, 0),
    completedCount: projects.filter((project) => isCompletedFundingStatus(project.status)).length,
    totalRaised: projects.reduce((sum, project) => sum + project.currentAmount, 0),
  };
}
