export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Error en la petición";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
};