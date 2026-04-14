import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/lib/config';

/**
 * Axios client instance configured for the backend API
 */
const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor
 * - Adds auth token to headers
 * - Encrypts request data if enabled
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Add auth token to headers if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Decrypts response data if enabled
 * - Handles 401 errors (unauthorized)
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Don't redirect for login attempts - let the component handle the error
      if (!error.config?.url?.includes('/api/login')) {
        console.warn('Unauthorized access - redirecting to login');
        
        // Clear auth token
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/login/admin-portal';
      }
    }
    
    // Handle other errors
    console.error('Response error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

export default axiosClient;
