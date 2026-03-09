import axios from "axios";

const orgId: string = import.meta.env.VITE_ORG_ID;
const userId: string = import.meta.env.VITE_USER_ID;

if (!orgId || !userId) {
  throw new Error(
    "Missing VITE_ORG_ID or VITE_USER_ID.\n" +
      "Copy frontend/.env.example to frontend/.env and fill in valid UUIDs.",
  );
}

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Org-Id": orgId,
    "X-User-Id": userId,
  },
});

export default apiClient;
