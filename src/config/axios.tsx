// src/api/axios.ts
import axiosInstance from "axios";
import Cookies from "js-cookie";
import { isTokenExpired } from "../utils/app/time";

const axios = axiosInstance.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // withCredentials: true, // For cross-origin cookies
});

// Request interceptor
axios.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(Cookies.get("user") || "null");
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (accessToken) {
      if (isTokenExpired(accessToken) && refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post("/auth/token/refresh/", {
            refresh: refreshToken,
          });

          // Update tokens in cookies
          Cookies.set("access_token", response.data.access, {
            secure: true,
            sameSite: "Lax",
          });
          Cookies.set("user", response.data.user, {
            secure: true,
            sameSite: "Lax",
          });

          // Attach new access token to the request
          config.headers.Authorization = `Bearer ${response.data.access}`;
        } catch (error) {
          // Refresh failed - force logout
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          Cookies.remove("user");
          window.location.href =user?.is_admin ? "/admin/login" :"/auth/sign-in";
          return Promise.reject(error);
        }
      } else {
        // Valid access token
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const user = JSON.parse(Cookies.get("user") || "null");
    if (error.response?.status === 401) {
      // Invalid token - logout user
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");
      window.location.href = user?.is_admin ? "/admin/login" : "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axios;
