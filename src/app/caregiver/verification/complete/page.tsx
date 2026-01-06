"use client";

import { CheckCircle, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface VerificationCompleteProps {
  onNavigate?: (page: string) => void;
}

export default function CaregiverVerificationCompletePage({
  onNavigate,
}: VerificationCompleteProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* Celebration Icon */}
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-6">
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              boxShadow: "0px 8px 32px rgba(124, 229, 119, 0.4)",
            }}
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -bottom-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse delay-100" />
        </div>

        <h1 className="mb-2" style={{ color: "#535353" }}>
          🎉 Verification Complete!
        </h1>
        <p className="text-lg mb-8" style={{ color: "#848484" }}>
          Congratulations! You are now a verified CareNet caregiver.
        </p>

        {/* Success Card */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p style={{ color: "#535353" }}>Verification Badge Unlocked</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: "#7CE577" }} />
              <span className="text-sm" style={{ color: "#535353" }}>
                All documents verified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: "#7CE577" }} />
              <span className="text-sm" style={{ color: "#535353" }}>
                Background check passed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: "#7CE577" }} />
              <span className="text-sm" style={{ color: "#535353" }}>
                Assessments completed
              </span>
            </div>
          </div>
        </div>

        {/* What's Next Card */}
        <div
          className="finance-card p-5 mb-8"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <p className="font-medium mb-4" style={{ color: "#535353" }}>
            What's Next?
          </p>
          <ul className="space-y-2 text-sm" style={{ color: "#535353" }}>
            <li>📧 Subscribe to start receiving job offers</li>
            <li>📅 Complete your availability calendar</li>
            <li>💳 Set up your payment information</li>
          </ul>
        </div>

        {/* View Subscription Plans Button */}
        <Button
          onClick={() => onNavigate?.("caregiver-subscription")}
          className="w-full py-6 mb-4"
          style={{
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.4)",
          }}
        >
          View Subscription Plans
        </Button>

        {/* Go to Dashboard Button */}
        <Button
          onClick={() => onNavigate?.("caregiver-dashboard")}
          variant="ghost"
          className="w-full py-4 mt-3"
          style={{ color: "#848484" }}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
