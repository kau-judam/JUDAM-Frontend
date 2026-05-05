import type { FundingProject } from '@/constants/data';

export function getFundingMainIngredientLabel(project: FundingProject) {
  const label = project.mainIngredients || project.ingredients?.[0]?.ingredient || '';
  return label.trim() || '주재료';
}
