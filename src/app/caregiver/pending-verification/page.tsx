"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Phone,
  ArrowLeft,
  Upload,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface VerificationStep {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  time: string;
}

interface PendingVerificationProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: "certificates",
    name: "Certificates Review",
    status: "completed",
    time: "2-3 hours",
  },
  {
    id: "police-clearance",
    name: "Police Clearance",
    status: "in-progress",
    time: "3-5 days",
  },
  {
    id: "interview",
    name: "Interview Schedule",
    status: "pending",
    time: "1-2 days",
  },
  {
    id: "psychological",
    name: "Psychological Assessment",
    status: "pending",
    time: "2-3 days",
  },
  {
    id: "document-verification",
    name: "Document Verification",
    status: "pending",
    time: "1 day",
  },
  {
    id: "final-approval",
    name: "Final Approval",
    status: "pending",
    time: "24 hours",
  },
];

export default function CaregiverPendingVerificationPage({
  onNavigate,
  onBack,
}: PendingVerificationProps) {
  const currentStepIndex = VERIFICATION_STEPS.findIndex(
    (step) => step.status === "in-progress",
  );
  const overallProgress =
    ((currentStepIndex + 1) / VERIFICATION_STEPS.length) * 100;
  const estimatedTime = "7-14 business days";

  const handleUploadPoliceClearance = () => {
    onNavigate?.("caregiver-verification/police");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@carenet.com";
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <Button
          variant="ghost"
          onClick={() => onBack?.() || window.history.back()}
          className="mb-6 hover:bg-white/30"
          style={{ color: "#535353" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.4)",
            }}
          >
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Verification in Progress
          </h1>
          <p style={{ color: "#848484" }}>
            Your application is being reviewed by our verification team
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="px-6 mb-6">
        <div className="finance-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "#848484" }}>
              Overall Progress
            </span>
            <span className="text-2xl" style={{ color: "#FEB4C5" }}>
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${overallProgress}%`,
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "#848484" }}>
            Estimated completion: {estimatedTime}
          </p>
        </div>
      </div>

      {/* Verification Steps */}
      <div className="px-6 space-y-3 mb-6">
        {VERIFICATION_STEPS.map((step, index) => (
          <div
            key={step.id}
            className="finance-card p-5"
            style={{
              background:
                step.status === "completed"
                  ? "rgba(168, 224, 99, 0.1)"
                  : step.status === "in-progress"
                    ? "rgba(254, 180, 197, 0.1)"
                    : "white",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {step.status === "completed" ? (
                  <CheckCircle
                    className="w-8 h-8"
                    style={{ color: "#7CE577" }}
                  />
                ) : step.status === "in-progress" ? (
                  <div className="relative">
                    <Clock className="w-8 h-8" style={{ color: "#FEB4C5" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          background: "white",
                          animation:
                            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Circle className="w-8 h-8" style={{ color: "#848484" }} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg" style={{ color: "#535353" }}>
                    {step.name}
                  </h3>
                  {step.status === "completed" && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: "rgba(124, 229, 119, 0.2)",
                        color: "#7CE577",
                      }}
                    >
                      Completed
                    </span>
                  )}
                  {step.status === "in-progress" && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: "rgba(254, 180, 197, 0.2)",
                        color: "white",
                      }}
                    >
                      In Progress
                    </span>
                  )}
                  {step.status === "pending" && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: "rgba(132, 132, 132, 0.2)",
                        color: "#535353",
                      }}
                    >
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: "#848484" }}>
                  {step.status === "completed" || step.status === "in-progress"
                    ? `Estimated time: ${step.time}`
                    : "Will be reviewed shortly"}
                </p>
              </div>
            </div>

            {step.status === "in-progress" &&
              step.id === "police-clearance" && (
                <div
                  className="mt-3 pt-3 border-t"
                  style={{ borderColor: "rgba(132, 132, 132, 0.1)" }}
                >
                  <Button
                    onClick={handleUploadPoliceClearance}
                    className="w-full py-2"
                    style={{
                      background:
                        "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                      color: "white",
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Police Clearance
                  </Button>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-4"
          style={{
            background: "rgba(254, 180, 197, 0.1)",
            border: "1px solid rgba(132, 132, 132, 0.1)",
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: "#FEB4C5" }}
            />
            <div>
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                What happens next?
              </p>
              <ul className="text-xs space-y-1" style={{ color: "#848484" }}>
                <li>
                  • You'll receive notifications for each verification step
                </li>
                <li>• We may contact you for additional information</li>
                <li>• Once approved, you can start accepting jobs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <div className="px-6 pb-6">
        <Button
          onClick={handleContactSupport}
          variant="outline"
          className="w-full"
          style={{
            color: "#535353",
            borderColor: "rgba(132, 132, 132, 0.2)",
          }}
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
}
