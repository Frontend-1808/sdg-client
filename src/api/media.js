import { http } from "./http";

export const getMedia = ({ page = 1, kind = "" } = {}) =>
  http(`/admin/media?page=${page}${kind ? `&kind=${kind}` : ""}`, {
    auth: true,
  });

export const uploadMedia = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return http("/admin/media", { method: "POST", body: form, auth: true });
};

export const deleteMedia = (id) =>
  http(`/admin/media/${id}`, { method: "DELETE", auth: true });
