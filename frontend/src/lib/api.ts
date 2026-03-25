import axios from "axios";
import { tokenStore } from "./tokenStore";

const orgId: string | undefined = import.meta.env.VITE_ORG_ID as
  | string
  | undefined;

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach token + org header ─────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (orgId) {
    config.headers["X-Org-Id"] = orgId;
  }
  return config;
});

// ── Response interceptor: clear token on 401 and redirect to login ─────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStore.clear();
      // Hard redirect — avoids stale React state after session expiry
      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
