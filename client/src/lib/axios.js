import axios from 'axios';

// In dev, Vite proxies relative /api requests to the backend (see
// vite.config.js), so VITE_API_URL is left as /api. In production the
// frontend and backend are separate Render services on different domains,
// so this must be an absolute URL to the deployed API.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});
