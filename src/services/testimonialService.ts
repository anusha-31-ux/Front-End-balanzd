import axiosClient from "@/services/axiosClient";
import { Testimonial, CreateTestimonialInput, UpdateTestimonialInput } from "@/types/testimonial";

const ADMIN = "/api/testimonials/admin";
const PUBLIC = "/api/testimonials";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const testimonialService = {
  async getAllAdmin(): Promise<Testimonial[]> {
    const response = await axiosClient.get<ApiResponse<Testimonial[]>>(ADMIN);
    return response.data.data;
  },

  async getAllPublic(): Promise<Testimonial[]> {
    const response = await axiosClient.get<ApiResponse<Testimonial[]>>(PUBLIC);
    return response.data.data;
  },

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    const formData = new FormData();
    formData.append("weight_change", input.weight_change);
    if (input.period_start) formData.append("period_start", input.period_start);
    if (input.period_end)   formData.append("period_end", input.period_end);
    if (input.description)  formData.append("description", input.description);
    formData.append("photo", input.photo);

    const response = await axiosClient.post<ApiResponse<Testimonial>>(ADMIN, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data.success) throw new Error(response.data.message || "Failed to create testimonial");
    return response.data.data;
  },

  async update(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    const formData = new FormData();
    if (input.weight_change) formData.append("weight_change", input.weight_change);
    if (input.period_start)  formData.append("period_start", input.period_start);
    if (input.period_end)    formData.append("period_end", input.period_end);
    if (input.description !== undefined) formData.append("description", input.description);
    if (input.photo)         formData.append("photo", input.photo);

    const response = await axiosClient.put<ApiResponse<Testimonial>>(`${ADMIN}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data.success) throw new Error(response.data.message || "Failed to update testimonial");
    return response.data.data;
  },

  async toggleVisibility(id: string): Promise<Testimonial> {
    const response = await axiosClient.patch<ApiResponse<Testimonial>>(
      `${ADMIN}/${id}/toggle-visibility`
    );
    if (!response.data.success) throw new Error(response.data.message || "Failed to toggle visibility");
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    const response = await axiosClient.delete<ApiResponse<void>>(`${ADMIN}/${id}`);
    if (!response.data.success) throw new Error(response.data.message || "Failed to delete testimonial");
  },
};
