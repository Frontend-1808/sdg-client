import { http } from "./http";

export const getGoals = () => http("/goals");
export const getGoal = (slug) => http(`/goals/${slug}`);
export const getServices = (slug) => http(`/goals/${slug}/services`);
export const getArticle = (slug, articleSlug) =>
  http(`/goals/${slug}/articles/${articleSlug}`);
