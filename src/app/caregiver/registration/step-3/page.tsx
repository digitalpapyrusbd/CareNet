"use client";

import { useState } from "react";
import { ArrowLeft, User, Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverRegistrationStepThreePage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isOver18 = dob ? calculateAge(dob) >= 18 : true;

  const handleContinue = () => {
    window.location.href = "/caregiver/registration/step-4";
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div
        className="min-h-screen flex flex-col p-6"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
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
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.4)",
              }}
            >
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: "#535353" }}>
              Personal Information
            </h1>
            <p style={{ color: "#848484" }}>Step 3 of 6: Basic Details</p>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: "50%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4">
          {/* Profile Photo */}
          <div className="text-center mb-6">
            <label className="block mb-3 text-sm" style={{ color: "#535353" }}>
              Profile Photo *
            </label>
            <div className="relative inline-block">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto finance-card overflow-hidden"
                style={{
                  background: photo
                    ? "transparent"
                    : "rgba(254, 180, 197, 0.1)",
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-10 h-10" style={{ color: "#FEB4C5" }} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "#848484" }}>
              Upload a clear photo of yourself
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full finance-card px-4 py-3"
              style={{ color: "#535353", outline: "none" }}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Date of Birth * (Must be 18+)
            </label>
            <div className="relative">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18),
                  )
                    .toISOString()
                    .split("T")[0]
                }
                className="w-full finance-card px-4 py-3 pr-12"
                style={{ color: "#535353", outline: "none" }}
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "#848484" }}
              />
            </div>
            {dob && !isOver18 && (
              <p className="text-xs mt-1" style={{ color: "#FF6B6B" }}>
                You must be at least 18 years old to register
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Gender *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Male", "Female", "Other"].map((option) => (
                <button
                  key={option}
                  onClick={() => setGender(option)}
                  className={`finance-card px-4 py-3 transition-all ${
                    gender === option ? "ring-2" : ""
                  }`}
                  style={{
                    color: gender === option ? "#FEB4C5" : "#535353",
                    borderColor: gender === option ? "#FEB4C5" : "transparent",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Current Address */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Current Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              rows={3}
              className="w-full finance-card px-4 py-3 resize-none"
              style={{ color: "#535353", outline: "none" }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={
            !fullName || !dob || !gender || !address || !photo || !isOver18
          }
          className="w-full py-6 mt-6"
          style={{
            background:
              !fullName || !dob || !gender || !address || !photo || !isOver18
                ? "rgba(132, 132, 132, 0.3)"
                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow:
              !fullName || !dob || !gender || !address || !photo || !isOver18
                ? "none"
                : "0px 4px 18px rgba(240, 161, 180, 0.4)",
            cursor:
              !fullName || !dob || !gender || !address || !photo || !isOver18
                ? "not-allowed"
                : "pointer",
          }}
        >
          Continue to NID Verification
        </Button>
      </div>
    </>
  );
}
