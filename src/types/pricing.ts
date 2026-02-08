/**
 * Pricing Plans Type Definitions
 * Defines the structure for pricing plans used throughout the application
 */

export interface PricingPlan {
  id: string; // Unique identifier for each plan
  duration: string; // Display name (e.g., "1 Month", "6 Months")
  durationMonths: number; // Numeric value for sorting/filtering
  badge?: string | null; // Special badge (e.g., "MOST POPULAR", "BEST VALUE")
  showPrize: boolean; // Whether to show prize information
  prizeText?: string; // Prize description (e.g., "Eligible for ₹3,00,000 Cash Prize")
  prizeNote?: string; // Additional prize notes
  actualPrice: number; // Original price (for strikethrough)
  offerPrice: number; // Current discounted price
  offerText?: string; // Offer label (e.g., "January Launch Offer")
  offerValidity?: string; // When offer expires
  features: string[]; // List of features included in the plan
  tagline: string; // Short description of the plan
  displayOrder: number; // Order to display plans (1, 2, 3, 4...)
  isActive: boolean; // Whether the plan is available for purchase
  createdAt?: string; // ISO 8601 date string
  updatedAt?: string; // ISO 8601 date string
}

/**
 * Input type for creating new pricing plans
 * (excludes id since it's generated server-side)
 */
export interface CreatePricingPlanInput {
  duration: string;
  durationMonths: number;
  badge?: string | null;
  showPrize: boolean; // Required by backend
  prizeText?: string;
  prizeNote?: string;
  actualPrice: number;
  offerPrice: number;
  offerText?: string;
  offerValidity?: string;
  features: string[];
  tagline: string;
  displayOrder: number;
  isActive?: boolean;
}

/**
 * Input type for updating existing pricing plans
 * (all fields are optional for partial updates)
 */
export interface UpdatePricingPlanInput extends Partial<CreatePricingPlanInput> {
  id: string; // Required - which plan to update
}

/**
 * API Response wrapper for all endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
