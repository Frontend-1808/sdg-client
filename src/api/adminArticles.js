import { http } from "./http";

export const adminGetArticles = (goalId = "") =>
  http(`/admin/articles${goalId ? `?goal=${goalId}` : ""}`, { auth: true });
export const adminGetArticle = (id) =>
  http(`/admin/articles/${id}`, { auth: true });
export const createArticle = (body) =>
  http("/admin/articles", { method: "POST", body, auth: true });
export const updateArticle = (id, body) =>
  http(`/admin/articles/${id}`, { method: "PUT", body, auth: true });
export const deleteArticle = (id) =>
  http(`/admin/articles/${id}`, { method: "DELETE", auth: true });
