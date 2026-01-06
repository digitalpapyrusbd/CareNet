"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Edit,
  MessageSquare,
  Camera,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface CheckInConfirmationProps {
  jobId?: string;
  jobTitle?: string;
  patientName?: string;
  patientAge?: number;
  patientPhone?: string;
  patientAddress?: string;
  scheduledTime?: string;
  scheduledDate?: string;
  currentLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
  jobLocation?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverCheckInConfirmationPage({
  jobId = "job-1",
  jobTitle = "Full-Time Caregiver - Dementia Patient",
  patientName = "Mrs. Nasrin Begum",
  patientAge = 75,
  patientPhone = "+880 1712-3456789",
  patientAddress = "House 12, Road 4, Dhanmondi, Dhaka-1215",
  scheduledTime = "09:00 AM",
  scheduledDate = "December 28, 2024",
  currentLocation = {
    address: "Near House 15, Road 6, Dhanmondi, Dhaka",
    lat: 23.8103,
    lng: 90.4125,
  },
  jobLocation = "Uttara",
  onNavigate,
  onBack,
}: CheckInConfirmationProps) {
  const [locationStatus, setLocationStatus] = useState<"mismatch" | "verified" | "pending">("pending");
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [notes, setNotes] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const handleVerifyLocation = () => {
    setLocationStatus("verified");
    // Simulate location verification
    setTimeout(() => {
      setLocationStatus("verified");
    }, 1500);
  };

  const handleCapturePhoto = () => {
    setPhotoCaptured(true);
    // Simulate photo capture
    setTimeout(() => {
      setPhotoCaptured(false);
    }, 2000);
  };

  const handleConfirmCheckIn = () => {
    if (locationStatus === "verified" && photoCaptured) {
      console.log("Confirming check-in for job:", jobId);
      onNavigate?.("caregiver/jobs/active");
    }
  };

  const handleReportIssue = () => {
    setShowIssueModal(true);
  };

  const handleIssueSubmit = () => {
    if (issueType && issueDescription.trim()) {
      console.log("Reporting issue:", issueType, issueDescription);
      setShowIssueModal(false);
      setIssueType("");
      setIssueDescription("");
      alert("Issue reported successfully. Support will contact you shortly.");
    }
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

        <h1 style={{ color: "#535353", fontSize: "28px" }}>
          Check-In Confirmation
        </h1>
        <p style={{ color: "#848484", textAlign: "center" }}>
          Confirm your arrival and location
        </p>
      </div>

      {/* Job Details Card */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium mb-1" style={{ color: "#535353" }}>
                  {jobTitle}
                </h2>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Job ID: {jobId}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <span className="text-sm" style={{ color: "#848484" }}>
                Scheduled Date
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: "#535353" }}>
              {scheduledDate}
            </p>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <span className="text-sm" style={{ color: "#848484" }}>
                Scheduled Time
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: "#535353" }}>
              {scheduledTime}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
              }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium" style={{ color: "#535353" }}>
                Patient Information
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                Please verify patient details match the assignment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: "#848484" }}>
                Patient Name
              </label>
              <div className="p-4 rounded-xl bg-white/60 border-white/60">
                <p className="text-lg" style={{ color: "#535353" }}>
                  {patientName}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: "#848484" }}>
                Age
              </label>
              <div className="p-4 rounded-xl bg-white/60 border-white/60">
                <p className="text-lg" style={{ color: "#535353" }}>
                  {patientAge} years
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: "#848484" }}>
                Phone Number
              </label>
              <div className="p-4 rounded-xl bg-white/60 border-white/60 flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <p className="text-lg" style={{ color: "#535353" }}>
                  {patientPhone}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: "#848484" }}>
                Address
              </label>
              <div className="p-4 rounded-xl bg-white/60 border-white/60 flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#FEB4C5" }} />
                <p className="text-base" style={{ color: "#535353" }}>
                  {patientAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Verification Card */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-6 h-6" style={{ color: "#FEB4C5" }} />
              <div>
                <h2 className="text-lg font-medium" style={{ color: "#535353" }}>
                  Location Verification
                </h2>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Verify your current location
                </p>
              </div>
            </div>
            {locationStatus === "verified" && (
              <div
                className="px-4 py-2 rounded-full"
                style={{ background: "rgba(124, 229, 119, 0.15)" }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: "#7CE577" }} />
              </div>
            )}
          </div>

          {/* Current Location */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Current Location (from GPS)
                </p>
                <p className="text-base font-medium" style={{ color: "#535353" }}>
                  {currentLocation.address}
                </p>
                <p className="text-xs mt-1" style={{ color: "#848484" }}>
                  {currentLocation.lat.toFixed(4)}°N, {currentLocation.lng.toFixed(4)}°E
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Job Location
                </p>
                <p className="text-base font-medium" style={{ color: "#535353" }}>
                  {jobLocation}
                </p>
                <p className="text-xs mt-1" style={{ color: "#848484" }}>
                  {currentLocation.address.includes("Dhanmondi") ? "Same as GPS" : "Distance: 1.2 km"}
                </p>
              </div>
            </div>
          </div>

          {/* Location Status */}
          {locationStatus === "verified" && (
            <div
              className="mt-4 p-4 rounded-xl text-center"
              style={{ background: "rgba(124, 229, 119, 0.1)" }}
            >
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: "#7CE577" }} />
              <p className="font-medium" style={{ color: "#7CE577" }}>
                Location Verified
              </p>
              <p className="text-sm" style={{ color: "#535353" }}>
                Your current location matches the job location
              </p>
            </div>
          )}

          {locationStatus === "mismatch" && (
            <div
              className="mt-4 p-4 rounded-xl text-center"
              style={{ background: "rgba(255, 107, 122, 0.1)" }}
            >
              <AlertCircle className="w-6 h-6 mx-auto mb-2" style={{ color: "#FF6B7A" }} />
              <p className="font-medium" style={{ color: "#FF6B7A" }}>
                Location Mismatch
              </p>
              <p className="text-sm" style={{ color: "#535353" }}>
                Your location ({currentLocation.address}) doesn't match the job
                location ({jobLocation})
              </p>
              <Button
                onClick={handleVerifyLocation}
                className="mt-3"
                style={{
                  background: "rgba(254, 180, 197, 0.2)",
                  color: "#535353",
                }}
              >
                Verify Location
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Photo Capture Card */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6" style={{ color: "#FEB4C5" }} />
              <div>
                <h2 className="text-lg font-medium" style={{ color: "#535353" }}>
                  Photo Verification
                </h2>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Capture your photo at the patient's location
                </p>
              </div>
            </div>
            {photoCaptured && (
              <div
                className="px-4 py-2 rounded-full"
                style={{ background: "rgba(124, 229, 119, 0.15)" }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: "#7CE577" }} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              {photoCaptured ? (
                <CheckCircle2 className="w-16 h-16 text-white" />
              ) : (
                <Camera className="w-16 h-16 text-white" />
              )}
            </div>
          </div>

          <p className="text-center text-sm mt-4 mb-2" style={{ color: "#848484" }}>
            {photoCaptured
              ? "Photo captured successfully"
              : "Tap to capture photo at current location"}
          </p>

          {!photoCaptured && (
            <Button
              onClick={handleCapturePhoto}
              className="w-full py-6"
              style={{
                background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Photo
            </Button>
          )}
        </div>
      </div>

      {/* Additional Notes Card */}
      <div className="px-6 mb-4">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6" style={{ color: "#FEB4C5" }} />
            <div>
              <h2 className="text-lg font-medium" style={{ color: "#535353" }}>
                  Additional Notes
                </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                  Any observations or special instructions (optional)
                </p>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes about this check-in..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none resize-none"
            style={{ color: "#535353" }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <Button
            onClick={handleReportIssue}
            variant="outline"
            className="flex-1 py-4"
            style={{
              color: "#535353",
              borderColor: "rgba(132, 132, 132, 0.2)",
            }}
          >
            <AlertCircle className="w-5 h-5 mr-2" style={{ color: "#FF6B7A" }} />
            Report Issue
          </Button>
          <Button
            onClick={handleConfirmCheckIn}
            disabled={locationStatus !== "verified" || !photoCaptured}
            className="flex-1 py-4"
            style={{
              background:
                locationStatus === "verified" && photoCaptured
                  ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)"
                  : "rgba(132, 132, 132, 0.3)",
              color:
                locationStatus === "verified" && photoCaptured
                  ? "white"
                  : "#848484",
              boxShadow:
                locationStatus === "verified" && photoCaptured
                  ? "0px 4px 18px rgba(124, 229, 119, 0.35)"
                  : "none",
              cursor:
                locationStatus === "verified" && photoCaptured
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {locationStatus === "verified" && photoCaptured
              ? "Confirm Check-In"
              : "Complete verification first"}
          </Button>
        </div>
      </div>

      {/* Issue Report Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowIssueModal(false)}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" style={{ color: "#FF6B7A" }} />
                <h2 className="text-xl font-medium" style={{ color: "#535353" }}>
                  Report Issue
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowIssueModal(false)}
                className="hover:bg-white/30"
              >
                <X className="w-5 h-5" style={{ color: "#535353" }} />
              </Button>
            </div>

            <p className="text-sm mb-4" style={{ color: "#848484" }}>
              Please describe any issues with check-in or patient details
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: "#535353" }}>
                  Issue Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60"
                  style={{ color: "#535353" }}
                >
                  <option value="">Select issue type...</option>
                  <option value="patient-mismatch">Patient details don't match</option>
                  <option value="location-error">Location verification failed</option>
                  <option value="gps-issue">GPS accuracy issue</option>
                  <option value="other">Other issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: "#535353" }}>
                  Issue Description *
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none resize-none"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowIssueModal(false);
                  setIssueType("");
                  setIssueDescription("");
                }}
                variant="outline"
                className="flex-1 py-3"
                style={{
                  color: "#535353",
                  borderColor: "rgba(132, 132, 132, 0.2)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIssueSubmit}
                disabled={!issueType || !issueDescription.trim()}
                className="flex-1 py-3"
                style={{
                  background:
                    !issueType || !issueDescription.trim()
                      ? "rgba(132, 132, 132, 0.3)"
                      : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
                  color: !issueType || !issueDescription.trim() ? "#848484" : "white",
                  boxShadow:
                    !issueType || !issueDescription.trim()
                      ? "none"
                      : "0px 4px 18px rgba(255, 107, 122, 0.35)",
                  cursor: !issueType || !issueDescription.trim() ? "not-allowed" : "pointer",
                }}
              >
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="px-6 pb-6">
        <div
          className="finance-card p-5"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6" style={{ color: "#FEB4C5" }} />
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                Check-In Requirements
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#848484" }}>
                <li>• Verify your current location matches the job address</li>
                <li>• Capture a photo at the patient's location</li>
                <li>• Confirm patient details (name, age, phone)</li>
                <li>• Location must be within 500 meters of job address</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
