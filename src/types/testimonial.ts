export interface Testimonial {
  _id: string;
  weight_change: string;   // e.g. "Lost 8kg", "Gained 5kg"
  period_start?: string;   // ISO date string (optional)
  period_end?: string;     // ISO date string (optional)
  description?: string;    // optional story
  photoUrl: string;
  photoKey: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialInput {
  weight_change: string;
  period_start?: string;
  period_end?: string;
  description?: string;
  photo: File;
}

export interface UpdateTestimonialInput {
  weight_change?: string;
  period_start?: string;
  period_end?: string;
  description?: string;
  photo?: File;
}
