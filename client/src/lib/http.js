// Thin fetch wrapper: base URL, bearer auth, JSON (de)serialisation,
// and normalised errors. Keeps every api module tiny.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "resumify_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const opts = { method, headers: { ...headers } };

  if (auth) {
    const token = tokenStore.get();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }

  // FormData -> let the browser set the multipart boundary.
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, opts);

  // 204 / empty body
  const text = await res.text();
  const payload = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(
      payload.message || `Request failed (${res.status})`,
      res.status,
      payload.details,
    );
  }

  return payload.data ?? payload;
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export { ApiError };
