import { api, endpoints } from '@/lib/apiHandler';

/**
 * Login Response Type
 */
export interface LoginResponse {
  token: string;
  jwt?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

/**
 * Admin Authentication Service
 * Handles admin login and authentication
 */
export const adminAuthService = {
  /**
   * Login admin user
   * @param username - Admin username
   * @param password - Admin password
   * @returns Promise with login response including JWT token
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>(endpoints.auth.login, {
      username,
      password,
    });
  },

  /**
   * Logout admin user
   * Clears the auth token from localStorage
   */
  logout: () => {
    localStorage.removeItem('authToken');
  },

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user has valid token
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get current auth token
   * @returns Auth token or null
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
};

/**
 * Testimonial Type
 */
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  message: string;
  rating?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Testimonials Service
 * Handles testimonials CRUD operations
 */
export const testimonialsService = {
  /**
   * Get all testimonials
   */
  getAll: async (): Promise<Testimonial[]> => {
    return api.get<Testimonial[]>(endpoints.testimonials.base);
  },

  /**
   * Get a single testimonial by ID
   */
  getById: async (id: string): Promise<Testimonial> => {
    return api.get<Testimonial>(endpoints.testimonials.byId(id));
  },

  /**
   * Create a new testimonial
   */
  create: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    return api.post<Testimonial>(endpoints.testimonials.base, data as Record<string, unknown>);
  },

  /**
   * Update an existing testimonial
   */
  update: async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
    return api.put<Testimonial>(endpoints.testimonials.byId(id), data as Record<string, unknown>);
  },

  /**
   * Delete a testimonial
   */
  delete: async (id: string): Promise<{ success: boolean; message?: string }> => {
    return api.delete(endpoints.testimonials.byId(id));
  },
};

/**
 * Pricing Plan Type
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration?: string;
  features?: string[];
  description?: string;
  popular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
