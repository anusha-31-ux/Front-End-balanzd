/**
 * Pricing Service
 * Manages all pricing plan operations (Create, Read, Update, Delete)
 * Integrates with backend API using the centralized API handler with encryption
 */

import { api, endpoints } from "@/lib/apiHandler";
import { PricingPlan, CreatePricingPlanInput, UpdatePricingPlanInput, ApiResponse } from "@/types/pricing";

/**
 * Pricing Service Object
 * Contains all CRUD operations for pricing plans
 */
export const pricingService = {
  /**
   * Get all active plans sorted by display order (PUBLIC)
   * @returns Array of active pricing plans
   */
  async getPlans(): Promise<PricingPlan[]> {
    try {
      const response = await api.get<ApiResponse<PricingPlan[]>>(endpoints.public.pricing.plans);
      
      if (response.success && response.data) {
        // Filter active plans and sort by display order
        return response.data
          .filter((plan) => plan.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw new Error("Failed to fetch pricing plans");
    }
  },

  /**
   * Get all plans including inactive ones (ADMIN)
   * @returns Array of all pricing plans
   */
  async getAllPlans(): Promise<PricingPlan[]> {
    try {
      const response = await api.get<ApiResponse<PricingPlan[]>>(`${endpoints.admin.pricing.plans}?includeInactive=true`);
      
      if (response.success && response.data) {
        // Sort by display order
        return response.data.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching all plans:", error);
      throw new Error("Failed to fetch all pricing plans");
    }
  },

  /**
   * Get a single plan by ID (PUBLIC)
   * @param id - Plan ID
   * @returns Single pricing plan or null if not found
   */
  async getPlan(id: string): Promise<PricingPlan | null> {
    try {
      const response = await api.get<ApiResponse<PricingPlan>>(endpoints.public.pricing.byId(id));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching plan ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new pricing plan (ADMIN)
   * @param data - Plan details
   * @returns Created plan with generated ID
   */
  async createPlan(data: CreatePricingPlanInput): Promise<PricingPlan> {
    try {
      const response = await api.post<ApiResponse<PricingPlan>>(endpoints.admin.pricing.plans, data as Record<string, unknown>);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to create plan");
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  },

  /**
   * Update an existing pricing plan (ADMIN)
   * @param data - Updated plan data (must include id)
   * @returns Updated plan
   */
  async updatePlan(data: UpdatePricingPlanInput): Promise<PricingPlan> {
    try {
      const { id, ...updateData } = data;
      
      const response = await api.put<ApiResponse<PricingPlan>>(endpoints.admin.pricing.byId(id), updateData as Record<string, unknown>);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to update plan");
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  },

  /**
   * Delete a pricing plan (ADMIN)
   * @param id - Plan ID to delete
   */
  async deletePlan(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(endpoints.admin.pricing.byId(id));

      if (!response.success) {
        throw new Error(response.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  },

  /**
   * Toggle active status of a pricing plan (ADMIN)
   * @param id - Plan ID
   * @returns Updated plan with new status
   */
  async togglePlanStatus(id: string): Promise<{ id: string; isActive: boolean }> {
    try {
      const response = await api.patch<ApiResponse<{ id: string; isActive: boolean }>>(endpoints.admin.pricing.toggleStatus(id));

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to toggle plan status");
    } catch (error) {
      console.error("Error toggling plan status:", error);
      throw error;
    }
  },
};
