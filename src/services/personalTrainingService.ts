/**
 * Personal Training Service
 * Manages all personal training service operations (Create, Read, Update, Delete)
 * Integrates with backend API using the centralized API handler with encryption
 */

import { api, endpoints } from "@/lib/apiHandler";
import { PersonalTraining, CreatePersonalTrainingInput, UpdatePersonalTrainingInput, ApiResponse } from "@/types/personalTraining";

/**
 * Personal Training Service Object
 * Contains all CRUD operations for personal training services
 */
export const personalTrainingService = {
  /**
   * Get all active services sorted by display order (PUBLIC)
   * @returns Array of active personal training services
   */
  async getServices(): Promise<PersonalTraining[]> {
    const response = await api.get<ApiResponse<PersonalTraining[]>>(endpoints.public.personalTraining.services);

    if (response.success && response.data) {
      // Filter active services and sort by display order
      return response.data
        .filter((service) => service.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return [];
  },

  /**
   * Get all services including inactive ones (ADMIN)
   * @returns Array of all personal training services
   */
  async getAllServices(): Promise<PersonalTraining[]> {
    const response = await api.get<ApiResponse<PersonalTraining[]>>(`${endpoints.admin.personalTraining.services}?includeInactive=true`);

    if (response.success && response.data) {
      // Sort by display order
      return response.data.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return [];
  },

  /**
   * Get a specific service by ID (PUBLIC)
   * @param id - Service ID
   * @returns Personal training service details
   */
  async getServiceById(id: string): Promise<PersonalTraining> {
    try {
      const response = await api.get<ApiResponse<PersonalTraining>>(endpoints.public.personalTraining.byId(id));

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Service not found");
    } catch (error) {
      console.error("Error fetching personal training service:", error);
      throw new Error("Failed to fetch personal training service");
    }
  },

  /**
   * Create a new personal training service (ADMIN)
   * @param data - Service creation data
   * @returns Created service
   */
  async createService(data: CreatePersonalTrainingInput): Promise<PersonalTraining> {
    try {
      const response = await api.post<ApiResponse<PersonalTraining>>(endpoints.admin.personalTraining.services, data as Record<string, unknown>);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to create service");
    } catch (error) {
      console.error("Error creating personal training service:", error);
      throw new Error("Failed to create personal training service");
    }
  },

  /**
   * Update an existing personal training service (ADMIN)
   * @param id - Service ID
   * @param updateData - Partial update data
   * @returns Updated service
   */
  async updateService(id: string, updateData: UpdatePersonalTrainingInput): Promise<PersonalTraining> {
    try {
      const response = await api.put<ApiResponse<PersonalTraining>>(endpoints.admin.personalTraining.byId(id), updateData as Record<string, unknown>);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to update service");
    } catch (error) {
      console.error("Error updating personal training service:", error);
      throw new Error("Failed to update personal training service");
    }
  },

  /**
   * Delete a personal training service (ADMIN)
   * @param id - Service ID
   */
  async deleteService(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(endpoints.admin.personalTraining.byId(id));

      if (!response.success) {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting personal training service:", error);
      throw new Error("Failed to delete personal training service");
    }
  },

  /**
   * Toggle active status of a personal training service (ADMIN)
   * @param id - Service ID
   * @returns Updated service status
   */
  async toggleServiceStatus(id: string): Promise<{ id: string; isActive: boolean }> {
    try {
      const response = await api.patch<ApiResponse<{ id: string; isActive: boolean }>>(endpoints.admin.personalTraining.toggleStatus(id));

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Failed to toggle service status");
    } catch (error) {
      console.error("Error toggling personal training service status:", error);
      throw new Error("Failed to toggle personal training service status");
    }
  },
};