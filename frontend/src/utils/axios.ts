import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // ✅ REQUIRED
  headers: {
    "Content-Type": "application/json",
  },
});

/* ✅ Attach token automatically */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // OR cookie

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
