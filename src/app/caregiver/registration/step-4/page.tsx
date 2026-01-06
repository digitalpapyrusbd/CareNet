"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverRegistrationStepFourPage() {
  const [nidNumber, setNidNumber] = useState("");
  const [nidFront, setNidFront] = useState<string | null>(null);
  const [nidBack, setNidBack] = useState<string | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === "front") {
          setNidFront(reader.result as string);
        } else {
          setNidBack(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    window.location.href = "/caregiver/registration/step-5";
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div
        className="min-h-screen flex flex-col p-6"
        style={{ backgroundColor: "#F5F7FA" }}
      >
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
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: "#535353" }}>
              NID Verification
            </h1>
            <p style={{ color: "#848484" }}>Step 4 of 6: Identity Document</p>
          </div>

          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: "66.67%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* NID Number */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              NID Number *
            </label>
            <input
              type="text"
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              placeholder="Enter your 10 or 13 digit NID number"
              maxLength={13}
              className="w-full finance-card px-4 py-3"
              style={{ color: "#535353", outline: "none" }}
            />
          </div>

          {/* NID Front */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              NID Front Photo *
            </label>
            <div className="relative">
              <div
                className="w-full h-48 rounded-xl flex items-center justify-center finance-card overflow-hidden cursor-pointer"
                style={{
                  background: nidFront
                    ? "transparent"
                    : "rgba(254, 180, 197, 0.1)",
                }}
              >
                {nidFront ? (
                  <img
                    src={nidFront}
                    alt="NID Front"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Upload
                      className="w-10 h-10 mx-auto mb-2"
                      style={{ color: "#FEB4C5" }}
                    />
                    <p className="text-sm" style={{ color: "#848484" }}>
                      Upload NID Front
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* NID Back */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              NID Back Photo *
            </label>
            <div className="relative">
              <div
                className="w-full h-48 rounded-xl flex items-center justify-center finance-card overflow-hidden cursor-pointer"
                style={{
                  background: nidBack
                    ? "transparent"
                    : "rgba(254, 180, 197, 0.1)",
                }}
              >
                {nidBack ? (
                  <img
                    src={nidBack}
                    alt="NID Back"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Upload
                      className="w-10 h-10 mx-auto mb-2"
                      style={{ color: "#FEB4C5" }}
                    />
                    <p className="text-sm" style={{ color: "#848484" }}>
                      Upload NID Back
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div
            className="finance-card p-4"
            style={{ background: "rgba(254, 180, 197, 0.1)" }}
          >
            <p className="text-sm" style={{ color: "#848484" }}>
              🔒 Your NID information is encrypted and used only for
              verification purposes
            </p>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!nidNumber || !nidFront || !nidBack}
          className="w-full py-6 mt-6"
          style={{
            background:
              !nidNumber || !nidFront || !nidBack
                ? "rgba(132, 132, 132, 0.3)"
                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow:
              !nidNumber || !nidFront || !nidBack
                ? "none"
                : "0px 4px 18px rgba(240, 161, 180, 0.4)",
            cursor:
              !nidNumber || !nidFront || !nidBack ? "not-allowed" : "pointer",
          }}
        >
          Continue to Skills & Experience
        </Button>
      </div>
    </>
  );
}
