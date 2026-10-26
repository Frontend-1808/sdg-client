const BASE = import.meta.env.VITE_API_URL || "/api";

export async function http(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  const isForm = body instanceof FormData;

  if (body && !isForm) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("token");
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data;
}
