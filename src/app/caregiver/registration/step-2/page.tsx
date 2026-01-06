"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverRegistrationStepTwoPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`,
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace - move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`,
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const canContinue = otp.every((digit) => digit.length === 1);

  const handleResend = () => {
    setTimeLeft(120);
    setOtp(["", "", "", "", "", ""]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: "#535353" }}>
              Verify Your Number
            </h1>
            <p style={{ color: "#848484" }}>Step 2 of 6: OTP Verification</p>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: "33.33%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="finance-card p-6 mb-6">
            <p className="text-center mb-2" style={{ color: "#535353" }}>
              We sent a 6-digit code to
            </p>
            <p className="text-center mb-4" style={{ color: "#848484" }}>
              +880 1712345678
            </p>
            <p className="text-xs text-center" style={{ color: "#848484" }}>
              Enter code below to verify your number
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center finance-card text-xl"
                style={{ color: "#535353", outline: "none" }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {timeLeft > 0 ? (
              <p style={{ color: "#848484" }}>
                Time remaining:{" "}
                <span style={{ color: "#FEB4C5" }}>{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResend}
                style={{ color: "#FEB4C5" }}
              >
                Resend Code
              </Button>
            )}
          </div>

          {/* Security Notice */}
          <div
            className="finance-card p-4"
            style={{ background: "rgba(254, 180, 197, 0.1)" }}
          >
            <p className="text-sm text-center" style={{ color: "#848484" }}>
              🔒 Your phone number will be used for secure login and job
              notifications
            </p>
          </div>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() =>
            (window.location.href = "/caregiver/registration/step-3")
          }
          disabled={!canContinue}
          className="w-full py-6 mt-6"
          style={{
            background: !canContinue
              ? "rgba(132, 132, 132, 0.3)"
              : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow: !canContinue
              ? "none"
              : "0px 4px 18px rgba(240, 161, 180, 0.4)",
            cursor: !canContinue ? "not-allowed" : "pointer",
          }}
        >
          Verify & Continue
        </Button>
      </div>
    </>
  );
}
