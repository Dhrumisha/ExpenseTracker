import axios from "axios";

const axiosInstance = axios.create({
  // Relative, same-origin path. next.config.ts rewrites this to the real
  // backend server-side, so the browser only ever talks to this app's own
  // origin — which is what lets the httpOnly auth cookies (set on whatever
  // origin answers the request) actually reach our middleware. Calling the
  // backend's own domain directly here would set the cookie on that other
  // domain instead, invisible to this app.
  baseURL: "/api/v1",
  // The access/refresh tokens are httpOnly cookies, so the browser sends
  // them automatically — no Authorization header needs to be attached here.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
