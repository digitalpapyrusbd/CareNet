"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface VerificationPhysicalProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverVerificationPhysicalPage({
  onNavigate,
  onBack,
}: VerificationPhysicalProps) {
  const [medicalCert, setMedicalCert] = useState<File | null>(null);
  const [status, setStatus] = useState<"pending" | "submitted" | "verified">("pending");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setMedicalCert(file);

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

  const handleRemoveDocument = () => {
    setMedicalCert(null);
  };

  const handleSubmit = () => {
    onNavigate?.("caregiver-pending-verification");
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
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Physical Health Verification
          </h1>
          <p style={{ color: "#848484" }}>Medical Fitness Certificate</p>
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
                className="w-8 h-8"
                style={{ color: "#7CE577" }}
              />
            ) : status === "submitted" ? (
              <div className="relative">
                <FileText
                  className="w-8 h-8"
                  style={{ color: "#FEB4C5" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: "rgba(254, 180, 197, 0.2)" }}
                  />
                </div>
              </div>
            ) : (
              <AlertCircle
                className="w-8 h-8"
                style={{ color: "#848484" }}
              />
            )}

            <div className="flex-1">
              <h2
                className="text-xl mb-2"
                style={{ color: "#535353" }}
              >
                {status === "verified" && "Verification Complete"}
                {status === "submitted" && "Under Review"}
                {status === "pending" && "Upload Medical Certificate"}
              </h2>
              <p
                className="text-sm"
                style={{ color: "#848484" }}
              >
                {status === "verified" &&
                  "Your physical health fitness has been verified successfully. Good job!"}
                {status === "submitted" &&
                  "Your document is being reviewed by our verification team. This typically takes 3-5 business days."}
                {status === "pending" &&
                  "Please upload your medical certificate to continue verification."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {status === "pending" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-8"
            style={{
              background: "rgba(254, 180, 197, 0.05)",
              border: "2px dashed",
              borderColor: "rgba(254, 180, 197, 0.2)",
            }}
          >
            <Upload
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#FEB4C5" }}
            />
            <p
              className="text-center mb-4"
              style={{ color: "#535353" }}
            >
              Tap or drag to upload
            </p>
            <p
              className="text-center text-sm"
              style={{ color: "#848484" }}
            >
              PDF or Image (Max 5MB)
            </p>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocumentUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {uploadProgress > 0 && (
              <div className="w-full h-2 rounded-full bg-white/50 mt-4">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document Preview */}
      {medicalCert && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <FileText
                className="w-12 h-12 mt-1"
                style={{ color: "#FEB4C5" }}
              />
              <div className="flex-1">
                <p
                  className="font-medium text-lg"
                  style={{ color: "#535353" }}
                >
                  {medicalCert.name}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  {(medicalCert.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button
              onClick={handleRemoveDocument}
              variant="ghost"
              size="sm"
              className="hover:bg-red-50"
              style={{ color: "#FF6B7A" }}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Requirements Card */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-6"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle
              className="w-6 h-6 mt-0.5"
              style={{ color: "#FEB4C5" }}
            />
            <div>
              <p
                className="font-medium mb-2"
                style={{ color: "#535353" }}
              >
                Requirements:
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#7CE577" }}
              />
              <p
                className="text-sm"
                style={{ color: "#535353" }}
              >
                Certificate must be from BMDC registered doctor
              </p>
            </div>

            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#7CE577" }}
              />
              <p
                className="text-sm"
                style={{ color: "#535353" }}
              >
                Issued within last 3 months
              </p>
            </div>

            <div className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#7CE577" }}
              />
              <p
                className="text-sm"
                style={{ color: "#535353" }}
              >
                Must include fitness for caregiving work
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {status !== "verified" && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleSubmit}
            disabled={status === "pending" && !medicalCert}
            className="w-full py-6"
            style={{
              background:
                status === "pending" && !medicalCert
                  ? "rgba(132, 132, 132, 0.3)"
                  : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              color: status === "pending" && !medicalCert ? "#535353" : "white",
              boxShadow:
                status === "pending" && !medicalCert
                  ? "none"
                  : "0px 4px 18px rgba(240, 161, 180, 0.4)",
              cursor: status === "pending" && !medicalCert ? "not-allowed" : "pointer",
            }}
          >
            {status === "verified" && "Continue"}
            {status === "submitted" && "Submitted"}
            {status === "pending" && !medicalCert && "Upload Document First"}
          </Button>
        </div>
      )}

      {/* Completion Info */}
      {status === "verified" && (
        <div className="px-6">
          <div
            className="finance-card p-5"
            style={{ background: "rgba(168, 224, 99, 0.05)" }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle
                className="w-6 h-6"
                style={{ color: "#7CE577" }}
              />
              <div>
                <p
                  className="font-medium"
                  style={{ color: "#535353" }}
                >
                  All Set!
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#848484" }}
                >
                  Your physical health fitness has been verified successfully. You can now
                  proceed to the next verification step.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
