/**
 * Pricing Service
 * Manages all pricing plan operations (Create, Read, Update, Delete)
 * Currently uses dummy data - will be replaced with API calls in the future
 */

import { PricingPlan, CreatePricingPlanInput, UpdatePricingPlanInput } from "@/types/pricing";

// Dummy data - stored in memory. Later replace with API calls to your backend
const dummyPlans: PricingPlan[] = [
  {
    id: "plan_1",
    duration: "1 Month",
    durationMonths: 1,
    badge: null,
    showPrize: false,
    prizeText: "",
    prizeNote: "",
    actualPrice: 699,
    offerPrice: 589,
    offerText: "January Launch Offer",
    offerValidity: "Offer valid till 31st January",
    features: [
      "Daily LIVE Workout Sessions",
      "10 Flexible Batches Daily",
      "Strength Training & Yoga Sessions",
      "Home-Based Beginner Friendly Workouts",
      "Basic Nutrition Guidance",
      "Community Support",
      "Access to Private Community Page",
    ],
    tagline: "Perfect for beginners to start their fitness journey.",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "plan_2",
    duration: "3 Months",
    durationMonths: 3,
    badge: null,
    showPrize: false,
    prizeText: "",
    prizeNote: "",
    actualPrice: 2097,
    offerPrice: 1533,
    offerText: "January Launch Offer",
    offerValidity: "Offer valid till 31st January",
    features: [
      "Daily LIVE Workout Sessions",
      "10 Flexible Batches Daily",
      "Strength Training & Yoga Sessions",
      "Home-Based, Beginner Friendly Workouts",
      "Balanced Nutrition Guidance",
      "Easy Cooking & Recipe Videos",
      "Educational Health Talks",
      "Community Support",
      "Access to Private Community Page",
    ],
    tagline: "Ideal for building consistency & seeing visible lifestyle improvement.",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "plan_3",
    duration: "6 Months",
    durationMonths: 6,
    badge: "MOST POPULAR",
    showPrize: true,
    prizeText: "Eligible for ₹3,00,000 Cash Prize*",
    prizeNote: "(*Details mentioned in Challenge Policy)",
    actualPrice: 4194,
    offerPrice: 2949,
    offerText: "January Launch Offer",
    offerValidity: "Offer valid till 31st January",
    features: [
      "Daily LIVE Workout Sessions",
      "10 Flexible Batches Daily (Morning & Evening)",
      "Strength Training (Mon, Wed, Fri)",
      "Yoga Sessions (Tue, Thu)",
      "Completely Home-Based Workouts",
      "Beginner Friendly – All Levels Welcome",
      "Balanced Nutrition Guidance",
      "Easy Cooking & Recipe Videos",
      "Educational Health Talks & Workshops",
      "Community Support & Accountability",
      "Access to Private Balanzed Community Page",
      "Habit-Building Focus (not just weight loss)",
      "24/7 Personal Health Coach",
      "Customized Meal Prep Plans",
      "Monthly Physical Assessment",
      "Exclusive Merch Pack",
    ],
    tagline: "Best plan for long-term lifestyle change & consistency.",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "plan_4",
    duration: "Yearly Plan",
    durationMonths: 12,
    badge: "ELITE PRO",
    showPrize: false,
    prizeText: "",
    prizeNote: "",
    actualPrice: 9099,
    offerPrice: 4999,
    offerText: "Special Annual Deal",
    offerValidity: "Limited time offer",
    features: [
      "Everything in 6 Months, plus:",
      "24/7 Personal Health Coach",
      "Customized Meal Prep Plans",
      "Monthly Physical Assessment",
      "Exclusive Merch Pack",
      "Priority Support",
      "One-on-One Coaching Sessions (Weekly)",
      "Exclusive Access to Premium Content",
      "Annual Fitness Retreat Invitation",
    ],
    tagline: "Premium plan for complete transformation & long-term results.",
    displayOrder: 4,
    isActive: true,
  },
];

// Simulate API delay (to mimic real API calls)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pricing Service Object
 * Contains all CRUD operations for pricing plans
 */
export const pricingService = {
  /**
   * Get all active plans sorted by display order
   */
  async getPlans(): Promise<PricingPlan[]> {
    await delay(500);
    return dummyPlans
      .filter((plan) => plan.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get all plans including inactive ones (for admin view)
   */
  async getAllPlans(): Promise<PricingPlan[]> {
    await delay(500);
    return dummyPlans.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get a single plan by ID
   */
  async getPlan(id: string): Promise<PricingPlan | null> {
    await delay(300);
    return dummyPlans.find((plan) => plan.id === id) || null;
  },

  /**
   * Create a new pricing plan
   * @param data - Plan details
   * @returns Created plan with generated ID
   */
  async createPlan(data: CreatePricingPlanInput): Promise<PricingPlan> {
    await delay(500);
    const newPlan: PricingPlan = {
      id: `plan_${Date.now()}`,
      ...data,
    };
    dummyPlans.push(newPlan);
    return newPlan;
  },

  /**
   * Update an existing pricing plan
   * @param data - Updated plan data (must include id)
   * @returns Updated plan
   */
  async updatePlan(data: UpdatePricingPlanInput): Promise<PricingPlan> {
    await delay(500);
    const index = dummyPlans.findIndex((plan) => plan.id === data.id);
    if (index === -1) {
      throw new Error("Plan not found");
    }
    const updatedPlan = { ...dummyPlans[index], ...data };
    dummyPlans[index] = updatedPlan;
    return updatedPlan;
  },

  /**
   * Delete a pricing plan
   * @param id - Plan ID to delete
   */
  async deletePlan(id: string): Promise<void> {
    await delay(500);
    const index = dummyPlans.findIndex((plan) => plan.id === id);
    if (index === -1) {
      throw new Error("Plan not found");
    }
    dummyPlans.splice(index, 1);
  },

  /**
   * Reorder plans for display
   * @param planIds - Array of plan IDs in desired order
   */
  async reorderPlans(planIds: string[]): Promise<PricingPlan[]> {
    await delay(500);
    planIds.forEach((id, index) => {
      const plan = dummyPlans.find((p) => p.id === id);
      if (plan) {
        plan.displayOrder = index + 1;
      }
    });
    return dummyPlans.sort((a, b) => a.displayOrder - b.displayOrder);
  },
};
