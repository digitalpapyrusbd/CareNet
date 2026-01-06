"use client";

import { XCircle, AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface VerificationFailedProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverVerificationFailedPage({
  onNavigate,
  onBack,
}: VerificationFailedProps) {
  const rejectionReasons = [
    {
      reason: "Police clearance document could not be verified",
      details: "Document was expired, had inconsistencies, or couldn't be authenticated",
    },
    {
      reason: "Incomplete medical fitness certificate",
      details: "Certificate missing physician signature or was issued more than 3 months ago",
    },
    {
      reason: "Discrepancies found in submitted NID information",
      details: "Personal details didn't match national database records",
    },
  ];

  const handleReapply = () => {
    onNavigate?.("landing") || (window.location.href = "/caregiver/registration/step-1");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@carenet.com";
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  return (
    <div
      className="min-h-screen pb-24 flex flex-col"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 hover:bg-white/30"
          style={{ color: "#535353" }}
        >
          <span className="flex items-center gap-2">
            <span>←</span>
            <span>Back</span>
          </span>
        </Button>

        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
              boxShadow: "0px 8px 32px rgba(255, 107, 122, 0.2)",
            }}
          >
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h1
            className="mb-2"
            style={{ color: "#535353", fontSize: "28px", fontWeight: "600" }}
          >
            Verification Not Approved
          </h1>
          <p
            className="text-sm"
            style={{ color: "#848484", maxWidth: "400px", margin: "0 auto" }}
          >
            Unfortunately, we couldn't complete your verification at this time.
            <br />
            Please review the reasons below and address them before reapplying.
          </p>
        </div>
      </div>

      {/* Reasons Card */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-6"
          style={{
            background: "rgba(255, 107, 122, 0.05)",
            border: "1px solid rgba(255, 107, 122, 0.1)",
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255, 107, 122, 0.1)",
              }}
            >
              <AlertCircle
                className="w-6 h-6"
                style={{ color: "#FF6B7A" }}
              />
            </div>
            <div className="flex-1">
              <h2
                className="mb-2"
                style={{ color: "#535353", fontSize: "20px" }}
              >
                Reasons for Rejection
              </h2>
              <p
                className="text-sm"
                style={{ color: "#848484" }}
              >
                Your verification was rejected for the following reasons:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {rejectionReasons.map((item, index) => (
              <div
                key={index}
                className="finance-card p-5"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  borderLeft: "4px solid #FF6B7A",
                }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(255, 107, 122, 0.1)",
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#FF6B7A" }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium mb-1"
                      style={{ color: "#535353" }}
                    >
                      {item.reason}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "#848484" }}
                    >
                      {item.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reapplication Timeline */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-6"
          style={{ background: "rgba(168, 224, 99, 0.05)" }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(168, 224, 99, 0.1)",
              }}
            >
              <MessageCircle
                className="w-6 h-6"
                style={{ color: "#7CE577" }}
              />
            </div>
            <div className="flex-1">
              <h2
                className="mb-2"
                style={{ color: "#535353", fontSize: "20px" }}
              >
                You Can Reapply
              </h2>
              <p
                className="text-sm"
                style={{ color: "#848484" }}
              >
                Follow these steps to submit a new verification application:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(168, 224, 99, 0.1)",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#7CE577" }}
                >
                  1
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="font-medium mb-1"
                  style={{ color: "#535353" }}
                >
                  Wait 30 days from today
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  Your verification was rejected on{" "}
                  {new Date().toLocaleDateString()}
                  {" You can reapply after this waiting period."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(168, 224, 99, 0.1)",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#7CE577" }}
                >
                  2
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="font-medium mb-1"
                  style={{ color: "#535353" }}
                >
                  Address all rejection reasons
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  Review the rejection reasons above and ensure all issues are resolved
                  before submitting a new application.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(168, 224, 99, 0.1)",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#7CE577" }}
                >
                  3
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="font-medium mb-1"
                  style={{ color: "#535353" }}
                >
                  Submit corrected documents
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  Prepare new versions of any rejected documents. Ensure they meet all
                  requirements stated in the verification guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(168, 224, 99, 0.1)",
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: "#7CE577" }}
                >
                  4
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="font-medium mb-1"
                  style={{ color: "#535353" }}
                >
                  Complete new assessments if required
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  If your rejection was due to failed assessments, you may need to
                  retake specific tests (medical, psychological, or interview).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleContactSupport}
            variant="outline"
            className="flex-1"
            style={{
              color: "#535353",
              borderColor: "rgba(132, 132, 132, 0.2)",
            }}
          >
            Contact Support
          </Button>

          <Button
            onClick={handleReapply}
            disabled={true}
            className="flex-1"
            style={{
              background: "rgba(132, 132, 132, 0.3)",
              color: "#848484",
              cursor: "not-allowed",
            }}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reapply After 30 Days
          </Button>
        </div>

        <div
          className="finance-card p-5"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-6 h-6 mt-0.5"
              style={{ color: "#FEB4C5" }}
            />
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                Need Help?
              </p>
              <p
                className="text-sm"
                style={{ color: "#848484" }}
              >
                Our support team is available to help you understand the rejection
                reasons and guide you through the reapplication process.
                <br />
                <br />
                <span style={{ color: "#535353", fontWeight: "600" }}>
                  Support Hours: 9:00 AM - 6:00 PM (Mon-Sat)
                </span>
                <br />
                <span style={{ color: "#535353", fontWeight: "600" }}>
                  Email: support@carenet.com
                </span>
                <br />
                <span style={{ color: "#535353", fontWeight: "600" }}>
                  Hotline: +880 1XXX-XXXXXX
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
