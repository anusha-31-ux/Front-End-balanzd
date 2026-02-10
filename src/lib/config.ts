/**
 * Application Configuration
 * Centralized configuration for environment variables
 */

export const config = {
  /**
   * Backend API base URL
   * Configure this in .env file as VITE_API_BASE_URL
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
} as const;

/**
 * Helper function to construct API endpoints
 * @param path - API endpoint path (e.g., '/api/testimonials')
 * @returns Full URL to the API endpoint
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
