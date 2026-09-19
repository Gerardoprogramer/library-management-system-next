import axios from "axios";
import { showToast } from "@/lib/toast-utils";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

const csrfClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  xsrfCookieName: CSRF_COOKIE,
  xsrfHeaderName: CSRF_HEADER,
});

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  xsrfCookieName: CSRF_COOKIE,
  xsrfHeaderName: CSRF_HEADER,
});

let csrfRequest: Promise<void> | null = null;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;

  const cookie = document.cookie.split("; ").find((item) => item.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.substring(prefix.length));
}

function requiresCsrf(method?: string): boolean {
  const normalizedMethod = method?.toUpperCase() ?? "GET";

  return ["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod);
}

async function ensureCsrfToken() {
  if (typeof document === "undefined") {
    return;
  }

  if (getCookie(CSRF_COOKIE)) {
    return;
  }

  if (!csrfRequest) {
    csrfRequest = csrfClient
      .get("/auth/csrf")
      .then(() => undefined)
      .finally(() => {
        csrfRequest = null;
      });
  }

  await csrfRequest;
}

api.interceptors.request.use(async (config) => {
  if (requiresCsrf(config.method)) {
    await ensureCsrfToken();

    const token = getCookie(CSRF_COOKIE);

    if (token) {
      config.headers.set(CSRF_HEADER, token);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await ensureCsrfToken();

        const csrfToken = getCookie(CSRF_COOKIE);

        await csrfClient.post(
          "/auth/refresh",
          {},
          {
            headers: csrfToken
              ? {
                  [CSRF_HEADER]: csrfToken,
                }
              : {},
          }
        );

        return api(originalRequest);
      } catch (refreshError) {
        showToast.error("Sesión expirada", "Por seguridad, ingresa tus credenciales de nuevo.");

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
