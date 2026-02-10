import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { encryptData, decryptData } from '@/utils/encryption';
import { config } from '@/lib/config';

/**
 * Check if API encryption should be enabled
 * In development mode, encryption can be disabled via VITE_ENCRYPT_API=false
 * In production, encryption is always enabled
 */
const shouldEncryptApi = (): boolean => {
  // In production, always encrypt
  if (import.meta.env.PROD) {
    return true;
  }
  
  // In development, check environment variable
  const encryptApi = import.meta.env.VITE_ENCRYPT_API;
  return encryptApi !== 'false'; // Default to true if not set
};

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
 * - Conditionally encrypts request body based on environment
 * - Adds auth token to headers
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Add auth token to headers if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Encrypt request body if present and encryption is enabled
    if (config.data && shouldEncryptApi()) {
      const encryptedData = encryptData(config.data);
      config.data = {
        encrypted: encryptedData,
      };
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
 * - Conditionally decrypts response data based on environment
 * - Handles 401 errors (unauthorized)
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response has encrypted data and encryption is enabled
    if (response.data && response.data.encrypted && shouldEncryptApi()) {
      try {
        // Decrypt the response data
        const decryptedData = decryptData(response.data.encrypted);
        response.data = decryptedData;
      } catch (error) {
        console.error('Failed to decrypt response:', error);
        throw new Error('Failed to decrypt server response');
      }
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Don't redirect for login attempts - let the component handle the error
      if (!error.config?.url?.includes('/api/admin/login')) {
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
