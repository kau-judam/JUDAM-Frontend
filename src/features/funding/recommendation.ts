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
  HCSA: { sweetness: 40, aroma: 60, acidity: 80, body: 40, carbonation: 55 },
  HCSP: { sweetness: 80, aroma: 80, acidity: 40, body: 40, carbonation: 35 },
  HTSA: { sweetness: 40, aroma: 60, acidity: 100, body: 100, carbonation: 18 },
  HTSP: { sweetness: 100, aroma: 100, acidity: 40, body: 100, carbonation: 15 },
  LCSA: { sweetness: 40, aroma: 60, acidity: 80, body: 40, carbonation: 90 },
  LCSP: { sweetness: 80, aroma: 80, acidity: 40, body: 40, carbonation: 45 },
  LTSA: { sweetness: 40, aroma: 40, acidity: 80, body: 80, carbonation: 25 },
  LTSP: { sweetness: 100, aroma: 80, acidity: 40, body: 80, carbonation: 25 },
  HSSA: { sweetness: 60, aroma: 100, acidity: 80, body: 60, carbonation: 90 },
  HSSP: { sweetness: 100, aroma: 100, acidity: 40, body: 60, carbonation: 45 },
  LSSA: { sweetness: 80, aroma: 80, acidity: 60, body: 40, carbonation: 90 },
  LSSP: { sweetness: 100, aroma: 100, acidity: 20, body: 40, carbonation: 50 },
  HCAP: { sweetness: 20, aroma: 40, acidity: 100, body: 40, carbonation: 35 },
  HTAP: { sweetness: 20, aroma: 40, acidity: 100, body: 100, carbonation: 15 },
  LCAP: { sweetness: 40, aroma: 40, acidity: 80, body: 40, carbonation: 50 },
  LTAP: { sweetness: 40, aroma: 40, acidity: 60, body: 80, carbonation: 20 },
};

export function getTasteProfileFromSulbti(sulbti?: string): TasteProfile | null {
  if (!sulbti) return null;
  const code = sulbti.trim().toUpperCase().replace(/^JD-/, "");
  return btiTasteProfiles[code] || null;
}

export function getTasteMatchScore(project: FundingProject, userTasteProfile: TasteProfile | null) {
  if (!userTasteProfile || !project.tasteProfile) return 0;
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
      const matchDiff = getTasteMatchScore(b, userTasteProfile) - getTasteMatchScore(a, userTasteProfile);
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
