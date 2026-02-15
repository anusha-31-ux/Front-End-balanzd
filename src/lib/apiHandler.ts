import axiosClient from '@/services/axiosClient';
import { AxiosRequestConfig } from 'axios';

/**
 * API Response Type
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

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
    return response.data;
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
    const response = await axiosClient.post<T>(endpoint, data, config);
    return response.data;
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
    const response = await axiosClient.put<T>(endpoint, data, config);
    return response.data;
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
    const response = await axiosClient.patch<T>(endpoint, data, config);
    return response.data;
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
    return response.data;
  },
};

/**
 * API Endpoints - Centralized endpoint definitions
 */
export const endpoints = {
  auth: {
    login: '/api/admin/login',
    logout: '/api/admin/logout',
    refresh: '/api/admin/refresh',
  },
  testimonials: {
    base: '/api/testimonials',
    byId: (id: string) => `/api/testimonials/${id}`,
  },
  pricing: {
    base: '/api/pricing',
    plans: '/api/pricing/plans',
    byId: (id: string) => `/api/pricing/plans/${id}`,
    toggleStatus: (id: string) => `/api/pricing/plans/${id}/toggle-status`,
  },
  razorpay: {
    config: '/api/razorpay/config',
    createOrder: '/api/razorpay/create-order',
    verifyPayment: '/api/razorpay/verify',
  },
  adminRazorpay: {
    transactions: '/api/razorpay/transaction-list',
  },
} as const;
