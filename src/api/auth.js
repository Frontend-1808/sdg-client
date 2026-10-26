import { http } from "./http";

export const loginRequest = (email, password) =>
  http("/auth/login", { method: "POST", body: { email, password } });

export const getMe = () => http("/auth/me", { auth: true });
