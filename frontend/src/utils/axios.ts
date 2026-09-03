import axios from "axios";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  // Surfaces misconfiguration loudly at build/runtime instead of silently
  // requesting "http://<origin>/undefined/..." for every API call.
  console.error(
    "NEXT_PUBLIC_BASE_URL is not set — API requests will fail. See .env.example."
  );
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // The access/refresh tokens are httpOnly cookies, so the browser sends
  // them automatically — no Authorization header needs to be attached here.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
