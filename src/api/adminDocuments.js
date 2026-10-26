import { http } from "./http";

export const adminGetDocuments = () => http("/admin/documents", { auth: true });
export const adminGetDocument = (id) =>
  http(`/admin/documents/${id}`, { auth: true });
export const createDocument = (body) =>
  http("/admin/documents", { method: "POST", body, auth: true });
export const updateDocument = (id, body) =>
  http(`/admin/documents/${id}`, { method: "PUT", body, auth: true });
export const deleteDocument = (id) =>
  http(`/admin/documents/${id}`, { method: "DELETE", auth: true });
