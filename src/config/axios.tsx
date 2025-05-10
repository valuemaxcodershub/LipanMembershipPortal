import axiosInstance from 'axios'
import Cookies from "js-cookie";
import { isTokenExpired } from "../utils/app/time";
import { UserType } from '../contexts/createContexts/auth';


const axios = axiosInstance.create({
     baseURL: `${import.meta.env.VITE_API_URL}/api`
})

axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(Cookies.get("token") || "null");
    const user: UserType = JSON.parse(Cookies.get("user") || "null");
    if (token && user) {
      if (isTokenExpired(token.access)) {
        Cookies.remove("token");
        Cookies.remove("user");
        window.location.href = user.is_admin ? "/admin/login":"/auth/sign-in";
      } else {
        config.headers.Authorization = `Bearer ${token.access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
          const user: UserType = JSON.parse(Cookies.get("user") || "null");

      Cookies.remove("token");
      Cookies.remove("user");
        window.location.href = user.is_admin ? "/admin/login":"/auth/sign-in";
      // Optionally, redirect to login page or show a message
    }
    return Promise.reject(error);
  }
);


export default axios;