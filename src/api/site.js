import { http } from "./http";

export const getSettings = () => http("/settings");
export const getDocuments = () => http("/documents");
export const getPage = (slug) => http(`/pages/${slug}`);
