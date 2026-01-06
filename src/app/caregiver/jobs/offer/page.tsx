"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  X,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface JobOfferProps {
  jobId?: string;
  jobDetails?: {
    title: string;
    patient: {
      name: string;
      age: number;
      location: string;
      condition: string;
    };
    requirements: {
      skills: string[];
      experience: string;
      languages: string[];
      availability: string;
      hours: string;
      days: string[];
    };
    schedule: {
      startDate: string;
      endDate: string;
      shiftStart: string;
      shiftEnd: string;
    };
    payment: {
      hourlyRate: number;
      period: "daily" | "weekly" | "monthly";
      currency: string;
      estimatedMonthly: number;
      paymentMethod: string;
      paymentDay: string;
    };
  };
  onNavigate?: (page: string) => void;
  onAccept?: (jobId: string) => void;
  onReject?: (jobId: string, reason: string) => void;
  onBack?: () => void;
}

export default function CaregiverJobOfferPage({
  jobId,
  jobDetails,
  onNavigate,
  onAccept,
  onReject,
  onBack,
}: JobOfferProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAccept = () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions first");
      return;
    }

    setIsAccepting(true);
    // Simulate acceptance process
    setTimeout(() => {
      setIsAccepting(false);
      onAccept?.(jobId || "job-1");
    }, 2000);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    setIsRejecting(true);
    // Simulate rejection process
    setTimeout(() => {
      setIsRejecting(false);
      setShowRejectModal(false);
      setRejectReason("");
      onReject?.(jobId || "job-1", rejectReason);
      onBack?.() || window.history.back();
    }, 2000);
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  // Default job data if not provided
  const job = jobDetails || {
    title: "Full-Time Caregiver - Dementia Care",
    patient: {
      name: "Mrs. Nasrin Begum",
      age: 75,
      location: "Uttara, Dhaka",
      condition: "Dementia, Post-Surgery Recovery",
    },
    requirements: {
      skills: [
        "Elderly Care",
        "Dementia Care",
        "First Aid Certified",
        "CPR Certified",
      ],
      experience: "Minimum 2 years",
      languages: ["Bengali", "English", "Hindi"],
      availability: "Full-time, Live-in preferred",
      hours: "8 hours/day",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    schedule: {
      startDate: "January 2, 2025",
      endDate: "June 30, 2025",
      shiftStart: "9:00 AM",
      shiftEnd: "5:00 PM",
    },
    payment: {
      hourlyRate: 250,
      period: "monthly",
      currency: "৳",
      estimatedMonthly: 60000,
      paymentMethod: "Bank Transfer",
      paymentDay: "Sunday",
    },
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
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
            }}
          >
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Job Offer
          </h1>
          <p style={{ color: "#848484" }}>
            Review the job details and terms before accepting
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            Job Details
          </h2>

          {/* Job Title */}
          <div className="finance-card p-6 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Position
                </p>
                <h3 className="text-lg" style={{ color: "#535353" }}>
                  {job.title}
                </h3>
              </div>
            </div>
            <CheckCircle className="w-6 h-6" style={{ color: "#7CE577" }} />
          </div>

          {/* Patient Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Patient Name
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.patient.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Age
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.patient.age} years old
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Location
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.patient.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Condition
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.patient.condition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Start Date
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#535353" }}
                  >
                    {job.schedule.startDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    End Date
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#535353" }}
                  >
                    {job.schedule.endDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Shift Start
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#535353" }}
                  >
                    {job.schedule.shiftStart}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Shift End
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#535353" }}
                  >
                    {job.schedule.shiftEnd}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            Salary Information
          </h2>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "rgba(254, 180, 197, 0.05)" }}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6" style={{ color: "#FEB4C5" }} />
                <div>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Hourly Rate
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {job.payment.currency}
                    {job.payment.hourlyRate}
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: "#848484" }}>
                per hour
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Payment Period
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.payment.period}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Estimated Monthly
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: "#535353" }}
                >
                  {job.payment.currency}
                  {job.payment.estimatedMonthly.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="finance-card p-4 mt-4"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Payment processed weekly on {job.payment.paymentDay}s via{" "}
                  {job.payment.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            Terms and Conditions
          </h2>

          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
              style={{ background: "rgba(254, 180, 197, 0.2)" }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-pink-600"
                style={{ accentColor: "#FEB4C5" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium" style={{ color: "#535353" }}>
                I accept the terms and conditions
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#535353" }}>
                  Fixed monthly rate for 6-month contract
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#535353" }}>
                  One week notice required for termination
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#535353" }}>
                  Paid leave: 10 days per year
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#535353" }}>
                  Full compliance with CareNet platform policies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-4">
          <Button
            onClick={handleReject}
            variant="outline"
            className="flex-1"
            disabled={isRejecting}
            style={{
              color: "#535353",
              borderColor: "rgba(254, 180, 197, 0.3)",
            }}
          >
            {isRejecting ? "Rejecting..." : "Reject Offer"}
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1"
            disabled={isAccepting || !termsAccepted}
            style={{
              background:
                isAccepting || !termsAccepted
                  ? "rgba(132, 132, 132, 0.3)"
                  : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              color: "white",
              boxShadow:
                isAccepting || !termsAccepted
                  ? "none"
                  : "0px 4px 18px rgba(124, 229, 119, 0.35)",
              cursor: isAccepting || !termsAccepted ? "not-allowed" : "pointer",
            }}
          >
            {isAccepting ? "Accepting..." : "Accept Job Offer"}
          </Button>
        </div>

        {!termsAccepted && (
          <div
            className="finance-card p-4 mt-4"
            style={{ background: "rgba(254, 180, 197, 0.1)" }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <p className="text-sm" style={{ color: "#535353" }}>
                Please accept the terms and conditions to continue
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl" style={{ color: "#535353" }}>
                Reject Job Offer
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowRejectModal(false)}
                className="hover:bg-white/30"
              >
                <X className="w-5 h-5" style={{ color: "#535353" }} />
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6" style={{ color: "#FEB4C5" }} />
              <p className="text-sm" style={{ color: "#535353" }}>
                Please provide a reason for rejecting this job offer
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter your reason for rejecting..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl resize-none"
              style={{
                background: "rgba(254, 180, 197, 0.05)",
                border: "1px solid rgba(254, 180, 197, 0.2)",
                color: "#535353",
                outline: "none",
              }}
            />

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => {
                  setRejectReason("");
                  setShowRejectModal(false);
                }}
                variant="outline"
                className="flex-1"
                style={{
                  color: "#535353",
                  borderColor: "rgba(132, 132, 132, 0.2)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
                className="flex-1"
                style={{
                  background: !rejectReason.trim()
                    ? "rgba(254, 180, 197, 0.2)"
                    : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: !rejectReason.trim() ? "#848484" : "white",
                  boxShadow: !rejectReason.trim()
                    ? "none"
                    : "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  cursor: !rejectReason.trim() ? "not-allowed" : "pointer",
                }}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
