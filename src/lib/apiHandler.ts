import axiosClient from '@/services/axiosClient';
import { AxiosRequestConfig } from 'axios';
import { encryptData, decryptData } from '@/utils/encryption';

/**
 * API Response Type
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

/**
 * Check if encryption should be used for the given endpoint
 * @param endpoint - API endpoint path
 * @returns boolean indicating if encryption should be used
 */
const shouldEncrypt = (endpoint: string): boolean => {
  // Check if encryption is enabled globally
  if (import.meta.env.VITE_ENCRYPT_API !== 'true') {
    return false;
  }

  // In production, encrypt all except specific endpoints
  const noEncryptEndpoints = [
    // Public endpoints
    '/api/razorpay/config',
    '/api/razorpay/create-order',
    '/api/razorpay/verify',
    // Auth endpoints
    '/api/login',
    // Admin endpoints that don't support encryption yet
    '/api/pricing/admin/plans/',
  ];

  // Check if this is a no-encrypt endpoint first
  if (noEncryptEndpoints.some(noEncrypt => endpoint.startsWith(noEncrypt))) {
    return false; // Don't encrypt these specific endpoints
  }

  // Encrypt all admin operations (anything containing /admin)
  if (endpoint.includes('/admin')) {
    return true; // Encrypt all admin operations
  }

  // Encrypt admin pricing operations (anything with IDs or query params)
  if (endpoint.startsWith('/api/pricing/plans/') || endpoint.includes('/api/pricing/plans?')) {
    return true; // Force encrypt admin pricing operations with IDs or query params
  }

  // Default: don't encrypt for other endpoints
  return false;
};

/**
 * API Handler - Centralized API request handler with preset structures
 */
export const api = {
  /**
   * GET request
   * @param endpoint - API endpoint path
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  get: async <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosClient.get<T>(endpoint, config);
    let data = response.data;
    if (typeof data === 'object' && data !== null && 'encrypted' in data) {
      const encrypted = (data as { encrypted: string }).encrypted;
      console.log('Received encrypted data for endpoint:', endpoint, 'encrypted length:', encrypted.length);
      try {
        const decrypted = decryptData<T>(encrypted);
        console.log('Successfully decrypted data:', decrypted);
        return decrypted;
      } catch (error) {
        console.warn('Decryption failed for endpoint:', endpoint, 'error:', error);
        // Try parsing as plain JSON
        const parsed = JSON.parse(encrypted) as T;
        console.log('Parsed as plain JSON:', parsed);
        return parsed;
      }
    } else {
      if (shouldEncrypt(endpoint) && typeof data === 'string') {
        const decrypted = decryptData<T>(data);
        console.log('Decrypted direct data:', decrypted);
        return decrypted;
      } else {
        console.log('Returning data as is for endpoint:', endpoint, data);
        return data;
      }
    }
  },

  /**
   * POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  post: async <T = unknown>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const payload = shouldEncrypt(endpoint) && data ? { encrypted: encryptData(data) } : data;
    const response = await axiosClient.post<T>(endpoint, payload, config);
    const responseData = response.data;
    if (typeof responseData === 'object' && responseData !== null && 'encrypted' in responseData) {
      const encrypted = (responseData as { encrypted: string }).encrypted;
      try {
        return decryptData<T>(encrypted);
      } catch (error) {
        console.warn('Decryption failed for endpoint:', endpoint, 'error:', error);
        return JSON.parse(encrypted) as T;
      }
    } else {
      if (shouldEncrypt(endpoint) && typeof responseData === 'string') {
        return decryptData<T>(responseData);
      } else {
        return responseData;
      }
    }
  },

  /**
   * PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  put: async <T = unknown>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const encryptedData = shouldEncrypt(endpoint) && data ? { encrypted: encryptData(data) } : data;
    const response = await axiosClient.put<T>(endpoint, encryptedData, config);
    const responseData = response.data;
    if (typeof responseData === 'object' && responseData !== null && 'encrypted' in responseData) {
      const encrypted = (responseData as { encrypted: string }).encrypted;
      try {
        return decryptData<T>(encrypted);
      } catch (error) {
        console.warn('Decryption failed for endpoint:', endpoint, 'error:', error);
        return JSON.parse(encrypted) as T;
      }
    } else {
      if (shouldEncrypt(endpoint) && typeof responseData === 'string') {
        return decryptData<T>(responseData);
      } else {
        return responseData;
      }
    }
  },

  /**
   * PATCH request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  patch: async <T = unknown>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const encryptedData = shouldEncrypt(endpoint) && data ? { encrypted: encryptData(data) } : data;
    const response = await axiosClient.patch<T>(endpoint, encryptedData, config);
    const responseData = response.data;
    if (typeof responseData === 'object' && responseData !== null && 'encrypted' in responseData) {
      const encrypted = (responseData as { encrypted: string }).encrypted;
      try {
        return decryptData<T>(encrypted);
      } catch (error) {
        console.warn('Decryption failed for endpoint:', endpoint, 'error:', error);
        return JSON.parse(encrypted) as T;
      }
    } else {
      if (shouldEncrypt(endpoint) && typeof responseData === 'string') {
        return decryptData<T>(responseData);
      } else {
        return responseData;
      }
    }
  },

  /**
   * DELETE request
   * @param endpoint - API endpoint path
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  delete: async <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosClient.delete<T>(endpoint, config);
    let data = response.data;
    if (typeof data === 'object' && data !== null && 'encrypted' in data) {
      const encrypted = (data as { encrypted: string }).encrypted;
      try {
        return decryptData<T>(encrypted);
      } catch (error) {
        console.warn('Decryption failed for endpoint:', endpoint, 'error:', error);
        return JSON.parse(encrypted) as T;
      }
    } else {
      if (shouldEncrypt(endpoint) && typeof data === 'string') {
        return decryptData<T>(data);
      } else {
        return data;
      }
    }
  },
};

/**
 * API Endpoints - Centralized endpoint definitions
 */
export const endpoints = {
  auth: {
    login: '/api/login',
    logout: '/api/logout/admin',
    refresh: '/api/refresh/admin',
  },
  admin: {
    testimonials: {
      base: '/api/testimonials/admin',
      byId: (id: string) => `/api/testimonials/admin/${id}`,
    },
    pricing: {
      base: '/api/pricing/admin',
      plans: '/api/pricing/plans',
      byId: (id: string) => `/api/pricing/admin/plans/${id}`,
      toggleStatus: (id: string) => `/api/pricing/admin/plans/${id}/toggle-status`,
    },
    razorpay: {
      transactions: '/api/razorpay/admin/transaction-list',
      exportTransactions: '/api/razorpay/admin/transactions/download',
    },
  },
  public: {
    pricing: {
      plans: '/api/pricing/plans',
      byId: (id: string) => `/api/pricing/plans/${id}`,
    },
    razorpay: {
      config: '/api/razorpay/config',
      createOrder: '/api/razorpay/create-order',
      verifyPayment: '/api/razorpay/verify',
    },
  },
} as const;
