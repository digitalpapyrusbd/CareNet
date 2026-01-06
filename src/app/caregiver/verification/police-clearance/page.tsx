"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface PoliceClearanceProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverVerificationPoliceClearancePage({
  onNavigate,
  onBack,
}: PoliceClearanceProps) {
  const [document, setDocument] = useState<File | null>(null);
  const [status, setStatus] = useState<"pending" | "submitted" | "verified">(
    "pending",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setDocument(file);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 90));
      }, 200);

      // Simulate upload completion
      await new Promise((resolve) => setTimeout(resolve, 3000));
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setStatus("submitted");
    }
  };

  const handleSubmit = () => {
    onNavigate?.("caregiver-pending-verification");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@carenet.com";
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

        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.4)",
            }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Police Clearance
          </h1>
          <p style={{ color: "#848484" }}>Background Verification</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-6"
          style={{
            background:
              status === "verified"
                ? "rgba(168, 224, 99, 0.05)"
                : status === "submitted"
                  ? "rgba(254, 180, 197, 0.05)"
                  : "rgba(132, 132, 132, 0.05)",
          }}
        >
          <div className="flex items-start gap-4">
            {status === "verified" ? (
              <CheckCircle
                className="w-8 h-8 mt-1"
                style={{ color: "#7CE577" }}
              />
            ) : status === "submitted" ? (
              <Clock
                className="w-8 h-8 mt-1 animate-pulse"
                style={{ color: "#FEB4C5" }}
              />
            ) : (
              <AlertCircle
                className="w-8 h-8 mt-1"
                style={{ color: "#848484" }}
              />
            )}

            <div className="flex-1">
              <h2 className="mb-2 text-xl" style={{ color: "#535353" }}>
                {status === "verified" && "Verification Complete"}
                {status === "submitted" && "Under Review"}
                {status === "pending" && "Upload Police Clearance"}
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                {status === "verified" &&
                  "Your police clearance has been verified successfully. Good job!"}
                {status === "submitted" &&
                  "Your document is being reviewed. This typically takes 3-5 business days."}
                {status === "pending" &&
                  "Please upload your police clearance certificate to continue verification."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {status === "pending" && (
        <div className="px-6 mb-6">
          <div className="finance-card p-6">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(254, 180, 197, 0.2)" }}
              >
                <Upload className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              </div>
              <div>
                <p className="font-medium mb-2" style={{ color: "#535353" }}>
                  Upload Police Clearance
                </p>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Upload your police clearance certificate (PDF, JPG, PNG, Max
                  5MB)
                </p>
              </div>
            </div>

            <div
              className="relative"
              onClick={() =>
                document.getElementById("police-clearance-upload")?.click()
              }
              className="w-full p-8 rounded-2xl border-2 border-dashed cursor-pointer hover:bg-white/30 transition-all"
              style={{
                borderColor: "rgba(254, 180, 197, 0.3)",
                background: isUploading
                  ? "rgba(254, 180, 197, 0.05)"
                  : "rgba(254, 180, 197, 0.02)",
              }}
            >
              <Upload
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#FEB4C5" }}
              />
              <p className="text-sm text-center" style={{ color: "#848484" }}>
                {isUploading
                  ? "Uploading... "
                  : document
                    ? document.name
                    : "Tap or drag to upload"}
              </p>

              {uploadProgress > 0 && (
                <div className="w-full h-2 rounded-full bg-white/50 mt-4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${uploadProgress}%`,
                      background: "#FEB4C5",
                    }}
                  />
                </div>
              )}

              <input
                id="police-clearance-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {document && (
              <div
                className="mt-4 p-4 rounded-xl"
                style={{ background: "rgba(254, 180, 197, 0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#535353" }}
                    >
                      {document.name}
                    </p>
                    <p className="text-xs" style={{ color: "#848484" }}>
                      {(document.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setDocument(null)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-red-50"
                  style={{ color: "#FF6B7A" }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requirements Card */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-5"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 mt-0.5" style={{ color: "#FEB4C5" }} />
            <div>
              <p className="font-medium mb-2" style={{ color: "#535353" }}>
                Document Requirements
              </p>
              <p className="text-sm" style={{ color: "#848484" }}>
                Your police clearance must meet these requirements:
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0 mt-1"
                style={{ background: "#7CE577" }}
              />
              <p className="text-sm" style={{ color: "#535353" }}>
                Valid within last 6 months
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0 mt-1"
                style={{ background: "#7CE577" }}
              />
              <p className="text-sm" style={{ color: "#535353" }}>
                Issued by official police authority
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0 mt-1"
                style={{ background: "#7CE577" }}
              />
              <p className="text-sm" style={{ color: "#535353" }}>
                Clear and readable (no blur or distortion)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0 mt-1"
                style={{ background: "#7CE577" }}
              />
              <p className="text-sm" style={{ color: "#535353" }}>
                PDF, JPG, or PNG format (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {status !== "verified" && (
        <div className="px-6">
          <Button
            onClick={handleSubmit}
            disabled={status === "pending" && !document}
            className="w-full py-6"
            style={{
              background:
                status === "pending" && document
                  ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                  : status === "submitted"
                    ? "rgba(132, 132, 132, 0.3)"
                    : "rgba(132, 132, 132, 0.3)",
              color: status === "pending" && document ? "white" : "#535353",
              boxShadow:
                status === "pending" && document
                  ? "0px 4px 18px rgba(240, 161, 180, 0.4)"
                  : "none",
              cursor:
                status === "pending" && document ? "pointer" : "not-allowed",
            }}
          >
            {status === "verified" && "Continue"}
            {status === "submitted" && "Submitted"}
            {status === "pending" && !document && "Upload Document First"}
          </Button>
        </div>
      )}

      {/* Contact Support */}
      {status === "submitted" && (
        <div className="px-6">
          <div
            className="finance-card p-5"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#FEB4C5" }}
              />
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#535353" }}>
                  Under Review
                </p>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Your document is currently under review. You will receive a
                  notification once verification is complete (typically 3-5
                  business days).
                </p>
              </div>
            </div>

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
      )}

      {/* Completion Info */}
      {status === "verified" && (
        <div className="px-6 pb-6">
          <div
            className="finance-card p-5"
            style={{ background: "rgba(168, 224, 99, 0.05)" }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-6 h-6 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: "#535353" }}>
                  All Set!
                </p>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Your police clearance has been successfully verified. You can
                  now proceed to the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
