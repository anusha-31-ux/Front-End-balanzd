/**
 * Personal Training Type Definitions
 * Defines the structure for personal training services used throughout the application
 */

export interface PersonalTraining {
  id: string; // Unique identifier for each service
  name: string; // Display name (e.g., "1-on-1 Personal Training", "Group Personal Training")
  duration: string; // Duration of the service (e.g., "1 Month", "3 Months")
  originalPrice: number; // Original price before discount
  offerPrice: number; // Discounted price
  displayOrder: number; // Order to display services (1, 2, 3, 4...)
  description: string; // Detailed description of the service
  hasOffer: boolean; // Whether this service has an active offer
  offerHeading?: string; // Offer heading/title
  offerDetails?: string; // Offer details/description
  isActive: boolean; // Whether the service is available
  createdAt?: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
}

/**
 * Input type for creating new personal training services
 * (excludes id since it's generated server-side)
 */
export interface CreatePersonalTrainingInput {
  name: string;
  duration: string;
  originalPrice: number;
  offerPrice: number;
  displayOrder: number;
  description: string;
  hasOffer: boolean;
  offerHeading?: string;
  offerDetails?: string;
  isActive?: boolean;
}

/**
 * Input type for updating existing personal training services
 * (all fields are optional for partial updates)
 */
export interface UpdatePersonalTrainingInput {
  name?: string;
  duration?: string;
  originalPrice?: number;
  offerPrice?: number;
  displayOrder?: number;
  description?: string;
  hasOffer?: boolean;
  offerHeading?: string;
  offerDetails?: string;
  isActive?: boolean;
}

/**
 * API Response wrapper for all endpoints
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}