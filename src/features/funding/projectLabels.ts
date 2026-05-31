import type { FundingProject } from '@/constants/data';

function isBrokenKoreanText(value: string) {
  return /[\uFFFD\uF900-\uFAFF]/.test(value);
}

export function getFundingMainIngredientLabel(project: FundingProject) {
  const label = project.mainIngredientLabel || project.primaryIngredientLabel || '';
  const normalized = label.trim();
  return normalized && !isBrokenKoreanText(normalized) ? normalized : '메인 재료';
}
