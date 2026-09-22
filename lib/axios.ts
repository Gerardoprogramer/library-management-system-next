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
let refreshRequest: Promise<void> | null = null;

const CSRF_MAX_ATTEMPTS = 5;
const CSRF_RETRY_DELAYS_MS = [2_000, 4_000, 8_000, 12_000];

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
    csrfRequest = (async () => {
      for (let attempt = 0; attempt < CSRF_MAX_ATTEMPTS; attempt += 1) {
        try {
          await csrfClient.get("/auth/csrf");
          return;
        } catch (error) {
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;
          const canRetry = status === 503 || !status;
          const delay = CSRF_RETRY_DELAYS_MS[attempt];

          if (!canRetry || attempt === CSRF_MAX_ATTEMPTS - 1 || delay === undefined) {
            throw error;
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    })().finally(() => {
      csrfRequest = null;
    });
  }

  await csrfRequest;
}

async function refreshSession() {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      await ensureCsrfToken();

      const csrfToken = getCookie(CSRF_COOKIE);

      await csrfClient.post(
        "/auth/refresh",
        {},
        {
          headers: csrfToken ? { [CSRF_HEADER]: csrfToken } : {},
        }
      );
    })().finally(() => {
      refreshRequest = null;
    });
  }

  await refreshRequest;
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

    const isAuthRequest = originalRequest?.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        await refreshSession();

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
