import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor to inject JWT token into all protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear session if token is invalid, expired, or user not authorized
      localStorage.removeItem('nexus_jwt_token');
      localStorage.removeItem('nexus_auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
