/**
 * Application Configuration
 * Centralized configuration for environment variables
 */

export const config = {
  /**
   * Backend API base URL
   * Configure this in .env file as VITE_API_BASE_URL
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
} as const;

// Debug: Log environment info
console.log('🔧 Environment Debug:');
console.log('Mode:', import.meta.env.MODE);
console.log('Dev:', import.meta.env.DEV);
console.log('Prod:', import.meta.env.PROD);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Final API URL:', config.apiBaseUrl);

/**
 * Helper function to construct API endpoints
 * @param path - API endpoint path (e.g., '/admin/testimonials' or '/api/pricing')
 * @returns Full URL to the API endpoint
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
