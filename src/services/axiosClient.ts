import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { encryptData, decryptData } from '@/utils/encryption';
import { config } from '@/lib/config';

/**
 * Check if API encryption should be enabled
 * - Development: Never encrypt
 * - Production: Only encrypt admin APIs that require authentication
 */
const shouldEncryptApi = (url?: string): boolean => {
  // In development, never encrypt
  if (import.meta.env.DEV) {
    return false;
  }
  
  // In production, only encrypt admin endpoints that require authentication
  if (import.meta.env.PROD && url) {
    // Admin endpoints that require login (encrypt these)
    const adminEndpoints = [
      '/api/admin/logout',
      '/api/admin/refresh',
      '/api/testimonials',
      '/api/pricing', // Encrypt pricing admin operations, but not the public plans endpoint
      '/api/razorpay/transaction-list'
    ];
    
    // Check if the URL starts with any admin endpoint
    // But exclude the public plans endpoint
    const isAdminEndpoint = adminEndpoints.some(endpoint => url.startsWith(endpoint));
    const isPublicPlansEndpoint = url === '/api/pricing/plans';
    
    return isAdminEndpoint && !isPublicPlansEndpoint;
  }
  
  // Default: don't encrypt
  return false;
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
    // Skip encryption for create-order API
    if (config.data && shouldEncryptApi(config.url) && !config.url?.includes('/api/razorpay/create-order')) {
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
    // Skip decryption for create-order API
    if (response.data && response.data.encrypted && shouldEncryptApi(response.config.url) && !response.config.url?.includes('/api/razorpay/create-order')) {
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
