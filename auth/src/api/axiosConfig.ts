// axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken?: () => Promise<string | null>;
      };
    };
  }
}

// Request interceptor - attach Clerk token if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await window?.Clerk?.session?.getToken?.();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (err) {
    console.warn('Token fetch failed:', err);
  }
  return config;
});

// Response interceptor - handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data || error.message;

    console.error(`API error [${status}]:`, message);

    // Optional: Redirect to login if unauthorized
    if (status === 401) {
      window.location.href = '/sign-in';
    }

    return Promise.reject(error);
  }
);

export default api;
