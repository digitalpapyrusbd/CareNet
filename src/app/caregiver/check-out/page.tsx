"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  FileText,
  Check,
  Send,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverCheckOutPage() {
  const [step, setStep] = useState<"summary" | "location" | "confirmation">("summary");
  const [notes, setNotes] = useState("");
  const [locationVerified, setLocationVerified] = useState(false);
  
  const jobDetails = {
    patient: "Mrs. Nasrin Begum",
    jobType: "Full-Time Care",
    checkInTime: "09:00 AM",
    patientCondition: "Good spirits",
    location: "Uttara, Dhaka",
    jobDuration: "8 hours",
  };

  const handleVerifyLocation = () => {
    setLocationVerified(true);
  };

  const handleConfirmCheckOut = () => {
    console.log("Confirming check-out", { step, notes, locationVerified });
    window.location.href = "/caregiver/dashboard";
  };

  const handleBack = () => {
    window.history.back();
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
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Check-Out
          </h1>
          <p style={{ color: "#848484" }}>
            Confirm your departure and log care activities
          </p>
        </div>
      </div>

      {/* Shift Summary */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(254, 180, 197, 0.2)" }}
            >
              <Clock className="w-6 h-6" style={{ color: "#FEB4C5" }} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg" style={{ color: "#535353" }}>
                Shift Summary
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                {jobDetails.patient} - {jobDetails.jobType}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                <p className="text-sm" style={{ color: "#848484" }}>Check-In Time</p>
                <p className="font-medium" style={{ color: "#535353" }}>{jobDetails.checkInTime}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                <p className="text-sm" style={{ color: "#848484" }}>Job Duration</p>
                <p className="font-medium" style={{ color: "#535353" }}>{jobDetails.jobDuration}</p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                <p className="text-sm" style={{ color: "#848484" }}>Patient Condition</p>
                <p className="font-medium" style={{ color: "#535353" }}>{jobDetails.patientCondition}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                <p className="text-sm" style={{ color: "#848484" }}>Location</p>
                <p className="font-medium" style={{ color: "#535353" }}>{jobDetails.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Care Activities Log */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(254, 180, 197, 0.2)" }}
            >
              <FileText className="w-6 h-6" style={{ color: "#FEB4C5" }} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg" style={{ color: "#535353" }}>
                Care Activities Log
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                Log care activities performed during your shift
              </p>
            </div>
          </div>

          <div className="mt-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter care activities summary..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none resize-none"
              style={{ color: "#535353" }}
            />
          </div>
        </div>
      </div>

      {/* Location Verification */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(254, 180, 197, 0.2)" }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#7CE577" }}>
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg" style={{ color: "#535353" }}>
                Verify Current Location
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                Confirm your current location matches job site
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <span className="text-sm" style={{ color: "#535353" }}>
                Your current location:
              </span>
              <p className="font-medium" style={{ color: "#535353" }}>
                {jobDetails.location}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <span className="text-sm" style={{ color: "#535353" }}>
                Check-Out Time:
              </span>
              <p className="font-medium" style={{ color: "#535353" }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl text-center" style={{ background: "rgba(124, 229, 119, 0.1)" }}>
            {locationVerified ? (
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5" style={{ color: "#7CE577" }} />
                <span className="font-medium" style={{ color: "#7CE577" }}>
                  Location verified
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <Button
                  onClick={handleVerifyLocation}
                  className="px-4 py-2"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    color: "white",
                  }}
                >
                  Verify Location
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1"
            style={{
              color: "#535353",
              borderColor: "rgba(132, 132, 132, 0.2)",
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleConfirmCheckOut}
            className="flex-1 py-4"
            style={{
              background: !locationVerified
                ? "rgba(132, 132, 132, 0.3)"
                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              color: !locationVerified ? "#848484" : "white",
              boxShadow: !locationVerified ? "none" : "0px 4px 18px rgba(124, 229, 119, 0.35)",
              cursor: !locationVerified ? "not-allowed" : "pointer",
            }}
          >
            <Check className="w-5 h-5 mr-2" />
            Complete Check-Out
          </Button>
        </div>

        <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            <p className="text-sm" style={{ color: "#535353" }}>
              Complete all steps and verify your location before checking out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
