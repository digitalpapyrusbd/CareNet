"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FileCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Home,
  Phone,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface DocumentCheckItem {
  id: string;
  title: string;
  description: string;
  status: "verified" | "in-review" | "pending";
  icon?: React.ReactNode;
}

interface VerificationDocumentCheckProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const documentCheckItems: DocumentCheckItem[] = [
  {
    id: "1",
    title: "Identity Verification",
    description:
      "NID, profile photo, and contact details were cross-checked with national registry",
    status: "verified",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "Address Confirmation",
    description:
      "Utility bill and guardian reference confirmed your primary residence",
    status: "in-review",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "Experience Proof",
    description:
      "Employment history and recommendation letters under manual review",
    status: "pending",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "Medical Fitness",
    description:
      "Medical certificate uploaded. Waiting for doctor confirmation",
    status: "pending",
    icon: <Phone className="w-5 h-5" />,
  },
];

export default function CaregiverVerificationDocumentCheckPage({
  onNavigate,
  onBack,
}: VerificationDocumentCheckProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const verifiedCount = documentCheckItems.filter(
    (item) => item.status === "verified",
  ).length;
  const totalCount = documentCheckItems.length;
  const progress = (verifiedCount / totalCount) * 100;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          badge: "Verified",
          color: "#7CE577",
          bgColor: "rgba(124, 229, 119, 0.15)",
        };
      case "in-review":
        return {
          icon: (
            <div className="relative">
              <Clock className="w-6 h-6" style={{ color: "#FEB4C5" }} />
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "white",
                  }}
                />
              </div>
            </div>
          ),
          badge: "In Review",
          color: "#FEB4C5",
          bgColor: "rgba(254, 180, 197, 0.15)",
        };
      case "pending":
        return {
          icon: <Clock className="w-6 h-6" style={{ color: "#848484" }} />,
          badge: "Pending",
          color: "#848484",
          bgColor: "rgba(132, 132, 132, 0.15)",
        };
      default:
        return {
          icon: <Clock className="w-6 h-6" style={{ color: "#848484" }} />,
          badge: "Pending",
          color: "#848484",
          bgColor: "rgba(132, 132, 132, 0.15)",
        };
    }
  };

  const handleUploadDocument = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 20, 90));
    }, 200);

    // Simulate upload completion
    await new Promise((resolve) => setTimeout(resolve, 4000));
    clearInterval(interval);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleReplaceDocuments = () => {
    onNavigate?.("caregiver/verification/certificates") ||
      (window.location.href = "/caregiver/verification/certificates");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@carenet.com";
  };

  return (
    <div
      className="min-h-screen flex flex-col p-6"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      {/* Header */}
      <div className="mb-8">
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            <FileCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Final Document Check
          </h1>
          <p style={{ color: "#848484" }}>
            Verifying All Documents
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div className="finance-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "#535353" }}>
              Progress
            </span>
            <span className="text-2xl" style={{ color: "#FEB4C5" }}>
              {progress}%
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full mt-3"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Document Check Items */}
      <div className="flex-1 px-6 space-y-4">
        {documentCheckItems.map((item) => {
          const statusConfig = getStatusConfig(item.status);

          return (
            <div
              key={item.id}
              className="finance-card p-5 transition-all hover:shadow-lg"
              style={{
                background:
                  item.status === "verified"
                    ? "rgba(168, 224, 99, 0.05)"
                    : item.status === "in-review"
                      ? "rgba(254, 180, 197, 0.05)"
                      : "white",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: statusConfig.bgColor }}
                  >
                    {statusConfig.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "#535353" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "#848484" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: statusConfig.bgColor,
                    color: statusConfig.color,
                  }}
                >
                  {statusConfig.badge}
                </span>
              </div>

              {item.status === "pending" && (
                <div className="mt-3 pt-3 border-t border-white/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "#848484" }}>
                      Upload Additional Documents
                    </p>
                    <Button
                      onClick={handleUploadDocument}
                      disabled={isUploading}
                      size="sm"
                      variant="outline"
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          isUploading ? "animate-spin" : ""
                        }`}
                        style={{ color: "#FEB4C5" }}
                      />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Card */}
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
            <div className="flex-1">
              <p className="font-medium mb-2" style={{ color: "#535353" }}>
                Need to update a document?
              </p>
              <p className="text-sm" style={{ color: "#848484" }}>
                If you spot an issue or want to upload a newer version of any document, you can
                restart the verification process.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleReplaceDocuments}
              className="flex-1"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
              }}
            >
              Replace Documents
            </Button>
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="flex-1 bg-white/60 border-white/60"
              style={{ color: "#535353" }}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
