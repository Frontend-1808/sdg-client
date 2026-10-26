import { http } from "./http";

export const adminGetSettings = () => http("/admin/settings", { auth: true });
export const updateSettings = (body) =>
  http("/admin/settings", { method: "PUT", body, auth: true });
