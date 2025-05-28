import axios from 'axios';

import { tokenManager } from './auth/tokenManager';

export const BASE_API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const API_PREFIX = process.env.EXPO_PUBLIC_API_PREFIX;

if (!BASE_API_URL || !API_PREFIX) {
  throw new Error(
    'BASE_API_URL or API_PREFIX is not defined. Please set it in your environment variables.',
  );
}

const api = axios.create({
  baseURL: BASE_API_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const authToken = tokenManager.getAuthToken();
  const accessKey = tokenManager.getAccessKey();

  if (authToken) config.headers['Authorization'] = `Bearer ${authToken}`;
  if (accessKey) config.headers['X-Access-Key'] = accessKey;

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na resposta da API:', error);
    return Promise.reject(error);
  },
);

export default api;
