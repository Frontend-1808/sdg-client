import { http } from "./http";

export const adminGetGoals = () => http("/admin/goals", { auth: true });
export const adminGetGoal = (id) => http(`/admin/goals/${id}`, { auth: true });
export const createGoal = (body) =>
  http("/admin/goals", { method: "POST", body, auth: true });
export const updateGoal = (id, body) =>
  http(`/admin/goals/${id}`, { method: "PUT", body, auth: true });
export const deleteGoal = (id) =>
  http(`/admin/goals/${id}`, { method: "DELETE", auth: true });
