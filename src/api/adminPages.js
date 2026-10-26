import { http } from "./http";

export const adminGetPages = () => http("/admin/pages", { auth: true });
export const adminGetPage = (id) => http(`/admin/pages/${id}`, { auth: true });
export const createPage = (body) =>
  http("/admin/pages", { method: "POST", body, auth: true });
export const updatePage = (id, body) =>
  http(`/admin/pages/${id}`, { method: "PUT", body, auth: true });
export const deletePage = (id) =>
  http(`/admin/pages/${id}`, { method: "DELETE", auth: true });
