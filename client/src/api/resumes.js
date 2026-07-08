import { http } from "../lib/http.js";

export const resumesApi = {
  list: () => http.get("/resumes"), // -> { resumes }
  getOne: (id) => http.get(`/resumes/${id}`), // -> { resume }
  getPublic: (id) => http.get(`/public/resumes/${id}`, { auth: false }), // -> { resume }
  create: (payload) => http.post("/resumes", payload), // -> { resume }
  update: (id, payload) => http.patch(`/resumes/${id}`, payload), // -> { resume }
  remove: (id) => http.delete(`/resumes/${id}`),
};
