"use client";

import { useState } from "react";
import { ArrowLeft, Check, Crown, Zap, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular: boolean;
}

interface SubscriptionPlansProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "৳500",
    period: "/month",
    icon: <Zap className="w-6 h-6" />,
    color: "#9B9CF8",
    features: [
      "Access to job listings",
      "Basic profile visibility",
      "Up to 5 job applications/month",
      "Standard support",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "৳1,200",
    period: "/month",
    icon: <Crown className="w-6 h-6" />,
    color: "#FEB4C5",
    features: [
      "Unlimited job applications",
      "Priority profile visibility",
      "Featured caregiver badge",
      "Direct agency contact",
      "Priority support",
      "Training resources",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "৳2,000",
    period: "/month",
    icon: <Star className="w-6 h-6" />,
    color: "#FFD54F",
    features: [
      "All Professional features",
      "Exclusive job opportunities",
      "Personal career coach",
      "Advanced analytics",
      "24/7 premium support",
      "Insurance coverage",
    ],
    popular: false,
  },
];

export default function CaregiverSubscriptionPage({
  onNavigate,
  onBack,
}: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    // Simulate subscription process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onNavigate?.("caregiver-home");
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-white/30"
          style={{ color: "#535353" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Choose Your Plan
          </h1>
          <p style={{ color: "#848484" }}>
            Select a subscription plan to start accepting job offers
          </p>
        </div>

        {/* Plan Features Info */}
        <div
          className="finance-card p-5"
          style={{
            background: "rgba(254, 180, 197, 0.05)",
          }}
        >
          <div className="flex items-start gap-3">
            <Info
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#FEB4C5" }}
            />
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                All plans include
              </p>
              <div className="space-y-1 text-sm" style={{ color: "#848484" }}>
                <p>• Unlimited access to job listings</p>
                <p>• Secure messaging with guardians</p>
                <p>• Payment processing via CareNet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="px-6 space-y-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`finance-card p-6 transition-all cursor-pointer hover:shadow-lg ${
                isSelected ? "ring-2" : ""
              }`}
              style={{
                borderColor: isSelected ? plan.color : "transparent",
              }}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="flex justify-end mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(254, 180, 197, 0.2)",
                      color: "#FEB4C5",
                    }}
                  >
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: `${plan.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: plan.color,
                      boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {plan.icon}
                  </div>
                </div>
              </div>

              {/* Plan Name */}
              <h2
                className="text-2xl font-semibold mb-2 text-center"
                style={{ color: "#535353" }}
              >
                {plan.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span
                  className="text-3xl font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </span>
                <span className="text-xl" style={{ color: "#848484" }}>
                  {plan.period}
                </span>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px mb-4"
                style={{
                  backgroundColor: "rgba(132, 132, 132, 0.1)",
                }}
              />

              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: `${plan.color}20`,
                      }}
                    >
                      <Check
                        className="w-3 h-3"
                        style={{ color: plan.color }}
                      />
                    </div>
                    <span
                      className="text-sm flex-1"
                      style={{ color: "#535353" }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Select Button */}
              <Button
                onClick={() => handleSubscribe()}
                disabled={!isSelected || isProcessing}
                className="w-full"
                style={{
                  background:
                    isSelected && !isProcessing
                      ? `radial-gradient(143.86% 887.35% at -10.97% -22.81%, ${plan.color} 0%, ${plan.color}CC 100%)`
                      : isSelected && isProcessing
                        ? `${plan.color}20`
                        : !isSelected
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(255, 255, 255, 0.3)",
                  color: isSelected ? "white" : plan.color,
                  boxShadow:
                    isSelected && !isProcessing
                      ? `0px 4px 18px ${plan.color}40`
                      : "none",
                  cursor: !isSelected ? "pointer" : "not-allowed",
                }}
              >
                {isProcessing && isSelected
                  ? "Processing..."
                  : isSelected
                    ? `Subscribe to ${plan.name}`
                    : "Select Plan"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="px-6">
        <div
          className="finance-card p-5"
          style={{
            background: "rgba(254, 180, 197, 0.05)",
            border: "1px solid rgba(132, 132, 132, 0.1)",
          }}
        >
          <div className="flex items-start gap-3">
            <Info
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#5B9FFF" }}
            />
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                Need Help Choosing?
              </p>
              <p className="text-sm" style={{ color: "#848484" }}>
                Compare plans based on your job seeking needs. You can upgrade
                or downgrade your plan anytime from your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
