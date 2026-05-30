import type { ImageSourcePropType } from "react-native";

import { fundingProjects, getFundingProjectImageSource, getImageSource, recipesData } from "@/constants/data";

export interface AppNotification {
  id: number;
  type: "funding_new" | "funding_progress" | "funding_end" | "funding_success" | "recipe_popular";
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string;
  image?: ImageSourcePropType;
  fundingId?: number | null;
  recipeId?: number | null;
  progressThreshold?: number | null;
  metadata?: Record<string, unknown> | null;
}

const getFundingNotificationImage = (projectId: number) => {
  const project = fundingProjects.find((item) => item.id === projectId) || fundingProjects[0];
  return project ? getFundingProjectImageSource(project) : undefined;
};

const getRecipeNotificationImage = (recipeId: number) => {
  const recipe = recipesData.find((item) => item.id === recipeId) || recipesData[0];
  return getImageSource(recipe?.image);
};

export const initialNotifications: AppNotification[] = [
  {
    id: 1,
    type: "funding_new",
    title: "펀딩 등록 안내",
    content: "'벚꽃 생막걸리' 펀딩이 새롭게 등록되었습니다.",
    timestamp: "방금 전",
    read: false,
    link: "/funding/2",
    image: getFundingNotificationImage(1),
  },
  {
    id: 2,
    type: "funding_progress",
    title: "펀딩 진행 상황",
    content: "'경주 법주' 펀딩이 목표 금액 30%를 달성했습니다.",
    timestamp: "1시간 전",
    read: false,
    link: "/funding/3",
    image: getFundingNotificationImage(3),
  },
  {
    id: 3,
    type: "recipe_popular",
    title: "새로운 인기 레시피 등장",
    content: "'오미자 허니 막걸리' 레시피가 현재 많은 관심을 받고 있습니다.",
    timestamp: "3시간 전",
    read: false,
    image: getRecipeNotificationImage(1),
  },
  {
    id: 4,
    type: "funding_progress",
    title: "펀딩 진행 상황",
    content: "'제주 하라봉 막걸리' 펀딩이 목표 금액 50%를 달성했습니다.",
    timestamp: "5시간 전",
    read: true,
    link: "/funding/1",
    image: getFundingNotificationImage(1),
  },
  {
    id: 5,
    type: "funding_progress",
    title: "펀딩 진행 상황",
    content: "'전통 복화백일주' 펀딩이 목표 금액 80%를 달성했습니다.",
    timestamp: "1일 전",
    read: true,
    link: "/funding/5",
    image: getFundingNotificationImage(5),
  },
  {
    id: 6,
    type: "funding_end",
    title: "펀딩 종료 안내",
    content: "'강원도 산속주' 펀딩이 종료되었습니다.",
    timestamp: "2일 전",
    read: true,
    link: "/funding/4",
    image: getFundingNotificationImage(5),
  },
  {
    id: 7,
    type: "funding_success",
    title: "펀딩 성공 안내",
    content: "'제주 하라봉 막걸리' 펀딩이 목표 금액을 달성했습니다.",
    timestamp: "3일 전",
    read: true,
    link: "/funding/1",
    image: getFundingNotificationImage(1),
  },
];
