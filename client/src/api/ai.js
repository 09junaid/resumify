import { http } from "../lib/http.js";

export const aiApi = {
  // { task, field, content, context } -> { text }
  generate: (payload) => http.post("/ai/generate", payload),
};
