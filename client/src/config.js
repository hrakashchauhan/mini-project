const DEV_API_DEFAULT = "http://localhost:5000";

const resolveApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) return envBase;
  if (import.meta.env.DEV) return DEV_API_DEFAULT;
  if (typeof window !== "undefined") return window.location.origin;
  return DEV_API_DEFAULT;
};

export const API_BASE_URL = resolveApiBase();
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
