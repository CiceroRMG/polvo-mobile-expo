import axios from 'axios';

import { tokenManager } from './auth/tokenManager';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    'API_URL is not defined. Please set it in your environment variables.',
  );
}

const api = axios.create({
  baseURL: API_URL,
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
