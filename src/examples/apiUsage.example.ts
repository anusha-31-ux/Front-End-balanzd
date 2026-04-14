/**
 * CENTRALIZED API SYSTEM - USAGE GUIDE
 * 
 * This file demonstrates how to use the centralized API system.
 * The system has 3 layers:
 * 
 * 1. API Handler (src/lib/apiHandler.ts) - Low-level HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * 2. Services (src/services/api.ts) - Business logic and endpoint definitions
 * 3. Components/Pages - Use service functions directly
 */

import { 
  adminAuthService, 
  testimonialsService, 
  pricingService,
  type LoginResponse,
  type Testimonial,
  type PricingPlan 
} from '@/services/api';

// ===========================
// AUTHENTICATION EXAMPLES
// ===========================

export async function loginExample() {
  try {
    const response: LoginResponse = await adminAuthService.login('admin', 'password123');
    
    // Store token
    localStorage.setItem('authToken', response.token);
    
    console.log('Logged in:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

export function logoutExample() {
  adminAuthService.logout();
}

export function checkAuthExample() {
  const isLoggedIn = adminAuthService.isAuthenticated();
  console.log('Is authenticated:', isLoggedIn);
}

// ===========================
// TESTIMONIALS EXAMPLES
// ===========================

export async function getAllTestimonialsExample() {
  try {
    const testimonials: Testimonial[] = await testimonialsService.getAll();
    console.log('All testimonials:', testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
  }
}

export async function getTestimonialByIdExample(id: string) {
  try {
    const testimonial: Testimonial = await testimonialsService.getById(id);
    console.log('Testimonial:', testimonial);
  } catch (error) {
    console.error('Failed to fetch testimonial:', error);
  }
}

export async function createTestimonialExample() {
  try {
    const newTestimonial: Testimonial = await testimonialsService.create({
      name: 'John Doe',
      role: 'Client',
      message: 'Amazing service! Highly recommended.',
      rating: 5,
    });
    console.log('Created testimonial:', newTestimonial);
  } catch (error) {
    console.error('Failed to create testimonial:', error);
  }
}

export async function updateTestimonialExample(id: string) {
  try {
    const updated: Testimonial = await testimonialsService.update(id, {
      message: 'Updated message here',
      rating: 4,
    });
    console.log('Updated testimonial:', updated);
  } catch (error) {
    console.error('Failed to update testimonial:', error);
  }
}

export async function deleteTestimonialExample(id: string) {
  try {
    const result = await testimonialsService.delete(id);
    console.log('Deleted:', result);
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
  }
}

// ===========================
// PRICING EXAMPLES
// ===========================

export async function getAllPricingPlansExample() {
  try {
    const plans: PricingPlan[] = await pricingService.getAll();
    console.log('All pricing plans:', plans);
  } catch (error) {
    console.error('Failed to fetch pricing plans:', error);
  }
}

export async function createPricingPlanExample() {
  try {
    const newPlan: PricingPlan = await pricingService.create({
      name: 'Premium Plan',
      price: 99,
      duration: 'monthly',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      popular: true,
    });
    console.log('Created plan:', newPlan);
  } catch (error) {
    console.error('Failed to create pricing plan:', error);
  }
}

export async function updatePricingPlanExample(id: string) {
  try {
    const updated: PricingPlan = await pricingService.update(id, {
      price: 79,
      popular: false,
    });
    console.log('Updated plan:', updated);
  } catch (error) {
    console.error('Failed to update pricing plan:', error);
  }
}

// ===========================
// REACT COMPONENT EXAMPLE
// ===========================

/**
 * Example React Component using the API system
 */
export function TestimonialsComponent() {
  // This is just pseudo-code showing the pattern
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);
    try {
      const data = await testimonialsService.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await testimonialsService.delete(id);
      // Reload testimonials
      await loadTestimonials();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  // Render component...
}

// ===========================
// ADDING NEW ENDPOINTS
// ===========================

/**
 * To add a new API endpoint:
 * 
 * 1. Add endpoint to src/lib/apiHandler.ts in the 'endpoints' object:
 * 
 *    contacts: {
 *      base: '/api/contacts',
 *      byId: (id: string) => `/api/contacts/${id}`,
 *    },
 * 
 * 2. Create service in src/services/api.ts:
 * 
 *    export const contactsService = {
 *      getAll: async () => {
 *        return api.get(endpoints.contacts.base);
 *      },
 *      create: async (data: any) => {
 *        return api.post(endpoints.contacts.base, data);
 *      },
 *      // ... other methods
 *    };
 * 
 * 3. Use in your components:
 * 
 *    import { contactsService } from '@/services/api';
 *    const contacts = await contactsService.getAll();
 */
