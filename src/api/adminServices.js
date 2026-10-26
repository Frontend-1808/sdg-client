import { http } from "./http";

export const adminGetServices = (goalId = "") =>
  http(`/admin/services${goalId ? `?goal=${goalId}` : ""}`, { auth: true });
export const adminGetService = (id) =>
  http(`/admin/services/${id}`, { auth: true });
export const createService = (body) =>
  http("/admin/services", { method: "POST", body, auth: true });
export const updateService = (id, body) =>
  http(`/admin/services/${id}`, { method: "PUT", body, auth: true });
export const deleteService = (id) =>
  http(`/admin/services/${id}`, { method: "DELETE", auth: true });
