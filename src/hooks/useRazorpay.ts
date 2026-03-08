import { useState } from "react";
import { api, endpoints } from "@/lib/apiHandler";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentParams {
  amount: number;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  instagramId: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  healthConcerns: string;
  injuries: string;
  foodAllergies: string;
  dietExperience: string;
  fitnessGoals: string;
  selectedTrainer: string;
  health: string;
  goal: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async ({
    amount,
    planName,
    customerName,
    customerEmail,
    customerPhone,
    instagramId,
    age,
    gender,
    weight,
    height,
    healthConcerns,
    injuries,
    foodAllergies,
    dietExperience,
    fitnessGoals,
    selectedTrainer,
    health,
    goal
  }: PaymentParams) => {
    try {
      setIsLoading(true);

      // ✅ Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // ✅ Create order
      const response: RazorpayOrderResponse = await api.post(endpoints.public.razorpay.createOrder, {
        amount,
        planName,
        customerName,
        customerEmail,
        customerPhone,
        instagramId,
        age,
        gender,
        weight,
        height,
        healthConcerns,
        injuries,
        foodAllergies,
        dietExperience,
        fitnessGoals,
        selectedTrainer,
        health,
        goal
      });

      // Extract order data from response
      const data = response.data;

      // ✅ Open Razorpay Checkout
      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Balanzed Fitness",
        description: planName,
        order_id: data.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#E53935",
        },
        handler: function (response: any) {
          console.log("Payment Success:", response);
          toast.success("Payment successful 🎉");
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      });

      razorpay.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading };
};
