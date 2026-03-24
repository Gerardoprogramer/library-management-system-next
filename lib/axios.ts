import axios from "axios";
import { showToast } from "@/lib/toast-utils";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        showToast.error(
          "Sesión expirada",
          "Por seguridad, ingresa tus credenciales de nuevo."
        );
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);