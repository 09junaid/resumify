import { http } from "../lib/http.js";

export const authApi = {
  // { name, email, password } -> { user, token }
  register: (payload) => http.post("/auth/register", payload, { auth: false }),

  // { email, password } -> { user, token }
  login: (payload) => http.post("/auth/login", payload, { auth: false }),

  // -> { user }
  me: () => http.get("/auth/me"),
};
