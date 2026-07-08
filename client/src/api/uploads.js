import { http } from "../lib/http.js";

export const uploadsApi = {
  // Accepts a File, returns { url, filename, size }
  file: (file) => {
    const form = new FormData();
    form.append("file", file);
    return http.post("/uploads", form);
  },
};
