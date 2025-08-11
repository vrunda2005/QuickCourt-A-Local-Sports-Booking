import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

declare global {
  interface Window { Clerk?: any }
}

api.interceptors.request.use(async (config) => {
  try {
    const token = await window?.Clerk?.session?.getToken?.();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  } catch {
    // no-op
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // eslint-disable-next-line no-console
    console.error('API error:', err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;

