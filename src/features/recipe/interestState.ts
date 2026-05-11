import type { Recipe } from '@/constants/data';
import type { ImageSourcePropType } from 'react-native';

type RecipeInterestState = {
  liked: boolean;
  likes: number;
  isFundable?: boolean;
};

type RecipeEngagementState = {
  comments?: number;
};

export type RecipeReplyState = {
  id: number;
  author: string;
  avatar: ImageSourcePropType | string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  authorType: 'user' | 'brewery';
  userId?: number;
  isMine?: boolean;
};

const recipeInterestState = new Map<number, RecipeInterestState>();
const recipeEngagementState = new Map<number, RecipeEngagementState>();
const recipeReplyState = new Map<string, RecipeReplyState[]>();
const deletedRecipeIds = new Set<number>();

export const getRecipeInterestState = (recipeId: number) => recipeInterestState.get(recipeId);

export const setRecipeInterestState = (recipeId: number, state?: RecipeInterestState) => {
  if (!state) {
    recipeInterestState.delete(recipeId);
    return;
  }
  recipeInterestState.set(recipeId, state);
};

export const getRecipeCommentCountState = (recipeId: number) => recipeEngagementState.get(recipeId)?.comments;

export const setRecipeCommentCountState = (recipeId: number, comments: number) => {
  recipeEngagementState.set(recipeId, { ...recipeEngagementState.get(recipeId), comments });
};

const getReplyKey = (recipeId: number, commentId: number) => `${recipeId}:${commentId}`;

export const getRecipeReplyState = (recipeId: number, commentId: number) =>
  recipeReplyState.get(getReplyKey(recipeId, commentId)) || [];

export const setRecipeReplyState = (recipeId: number, commentId: number, replies: RecipeReplyState[]) => {
  recipeReplyState.set(getReplyKey(recipeId, commentId), replies);
};

export const appendRecipeReplyState = (recipeId: number, commentId: number, reply: RecipeReplyState) => {
  const key = getReplyKey(recipeId, commentId);
  const current = recipeReplyState.get(key) || [];
  recipeReplyState.set(key, [...current.filter((item) => item.id !== reply.id), reply]);
};

export const markRecipeDeleted = (recipeId: number) => {
  deletedRecipeIds.add(recipeId);
};

export const isRecipeDeleted = (recipeId: number) => deletedRecipeIds.has(recipeId);

export const applyRecipeInterestState = <
  T extends Pick<Recipe, 'id' | 'liked' | 'likes' | 'isFundable' | 'comments'>,
>(
  recipes: T[]
) =>
  recipes.filter((recipe) => !deletedRecipeIds.has(recipe.id)).map((recipe) => {
    const interestState = recipeInterestState.get(recipe.id);
    const engagementState = recipeEngagementState.get(recipe.id);
    if (!interestState && !engagementState) return recipe;
    return {
      ...recipe,
      liked: interestState?.liked ?? recipe.liked,
      likes: interestState?.likes ?? recipe.likes,
      isFundable: interestState?.isFundable ?? recipe.isFundable,
      comments: engagementState?.comments ?? recipe.comments,
    };
  });
