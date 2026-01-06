"use client";

import { UniversalNav } from "@/components/layout/UniversalNav";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCallNoAuth } from "@/lib/api-client";

export default function CaregiverRegistrationStep1Page() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleAssociation, setGoogleAssociation] = useState<{hasGoogleAccount: boolean; googleEmail?: string} | null>(null);
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);

  const canContinue =
    phone && password && confirmPassword && password === confirmPassword;

  // Check Google association when phone changes
  useEffect(() => {
    const checkGoogleAssociation = async () => {
      if (phone && phone.length >= 10) {
        try {
          const response = await apiCallNoAuth('/auth/check-google-association', {
            method: 'POST',
            body: { phone },
          });
          setGoogleAssociation(response);
          setShowGoogleNotice(response.hasGoogleAccount);
        } catch (error) {
          // Silently fail - not critical
          console.log('Could not check Google association:', error);
        }
      } else {
        setGoogleAssociation(null);
        setShowGoogleNotice(false);
      }
    };

    const debounceTimer = setTimeout(checkGoogleAssociation, 500);
    return () => clearTimeout(debounceTimer);
  }, [phone]);

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
        {/* Progress Indicator */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background:
                      1 >= s
                        ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)"
                        : "rgba(255, 255, 255, 0.5)",
                    color: 1 >= s ? "white" : "#848484",
                  }}
                >
                  {1 > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className="flex-1 h-1 mx-2"
                    style={{
                      background:
                        1 > s
                          ? "radial-gradient(to right, #FFB3C1, #FF8FA3)"
                          : "rgba(255, 255, 255, 0.5)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div
            className="flex justify-between text-xs"
            style={{ color: "#848484" }}
          >
            <span>Account</span>
            <span>Verify</span>
            <span>Profile</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md finance-card p-8">
          <h2 className="text-center mb-6" style={{ color: "#535353" }}>
            Create Account
          </h2>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <GoogleSignInButton 
              phone={phone || undefined}
              email={email || undefined}
              variant="register"
              onError={(error) => {
                console.error('Google sign-in error:', error);
              }}
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#E0E0E0' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span style={{ color: '#848484', backgroundColor: '#F5F7FA', padding: '0 1rem' }}>
                OR
              </span>
            </div>
          </div>

          {/* Google Association Notice */}
          {showGoogleNotice && googleAssociation?.hasGoogleAccount && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    This phone number is already linked to Google
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {googleAssociation.googleEmail ? (
                      <>Linked to: <strong>{googleAssociation.googleEmail}</strong>. Please use "Continue with Google" above.</>
                    ) : (
                      <>Please use "Continue with Google" to sign in.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: "#535353" }}>
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: "#535353" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#535353" }}>
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: "#535353" }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#535353" }}>
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 border-white/50 placeholder:text-gray-400 pr-10"
                  style={{ color: "#535353" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#848484" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: "#535353" }}>
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400"
                style={{ color: "#535353" }}
              />
            </div>

            <Button
              onClick={() => router.push("/caregiver/registration/step-2")}
              disabled={!canContinue}
              className="w-full mt-6"
              size="lg"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
                boxShadow: "0px 4px 18px rgba(255, 143, 163, 0.35)",
                color: "white",
                border: "none",
                opacity: canContinue ? 1 : 0.5,
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
