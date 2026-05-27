import type { FundingProject } from '@/constants/data';

export function getFundingMainIngredientLabel(project: FundingProject) {
  const label = project.mainIngredientLabel || project.primaryIngredientLabel || '';
  return label.trim() || '메인 재료';
}
