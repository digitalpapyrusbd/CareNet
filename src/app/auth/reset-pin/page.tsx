"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Heart, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCallNoAuth } from "@/lib/api-client";

function ResetPinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage("Invalid reset link. Please request a new reset link.");
      setMessageType("error");
    }
  }, [searchParams]);

  const validatePin = (pin: string): string => {
    if (!pin) return "PIN is required";
    if (!/^\d{6}$/.test(pin)) return "PIN must be exactly 6 digits";
    return "";
  };

  const handlePinChange = (value: string) => {
    setNewPin(value);
    setMessage("");
    setMessageType(null);
  };

  const handleConfirmPinChange = (value: string) => {
    setConfirmPin(value);
    setMessage("");
    setMessageType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pinError = validatePin(newPin);
    if (pinError) {
      setMessage(pinError);
      setMessageType("error");
      return;
    }

    if (newPin !== confirmPin) {
      setMessage("PINs do not match");
      setMessageType("error");
      return;
    }

    if (!token) {
      setMessage("Invalid or expired reset link");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      await apiCallNoAuth("/auth/reset-pin", {
        method: "POST",
        body: { token, newPin },
      });

      setMessage("PIN reset successful! Redirecting to login...");
      setMessageType("success");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: unknown) {
      let errorMessage = "Failed to reset PIN. Please try again.";

      // Type guard for error with status property
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number"
      ) {
        if (error.status === 0) {
          errorMessage =
            "Cannot connect to server. Please ensure the backend is running.";
        } else if (error.status === 400) {
          const data =
            "data" in error && error.data && typeof error.data === "object"
              ? error.data
              : null;
          const errorText =
            data && "error" in data && typeof data.error === "string"
              ? data.error
              : null;
          errorMessage = errorText || "Invalid or expired reset link";
        } else if (error.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo Section */}
      <div className="w-full max-w-md mb-8 text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
            boxShadow: "0px 4px 18px rgba(255, 143, 163, 0.35)",
          }}
        >
          <Heart className="w-10 h-10 text-white fill-current" />
        </div>
        <h1 className="mb-2" style={{ color: "#535353" }}>
          CareNet
        </h1>
        <p style={{ color: "#535353" }}>Quality care, connected</p>
      </div>

      {/* Reset PIN Form Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-6 text-center" style={{ color: "#535353" }}>
          Reset Your PIN
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              messageType === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PIN Input */}
          <div className="space-y-2">
            <Label htmlFor="newPin" style={{ color: "#535353" }}>
              New 6-digit PIN
            </Label>
            <div className="relative">
              <Input
                id="newPin"
                type={showPin ? "text" : "password"}
                placeholder="000000"
                value={newPin}
                onChange={(e) => handlePinChange(e.target.value)}
                className={`bg-white/50 border-white/50 placeholder:text-gray-400 pr-10`}
                style={{ color: "#535353" }}
                disabled={isLoading}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#848484" }}
              >
                {showPin ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs" style={{ color: "#848484" }}>
              Your PIN must be exactly 6 digits
            </p>
          </div>

          {/* Confirm PIN Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPin" style={{ color: "#535353" }}>
              Confirm PIN
            </Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showPin ? "text" : "password"}
                placeholder="000000"
                value={confirmPin}
                onChange={(e) => handleConfirmPinChange(e.target.value)}
                className={`bg-white/50 border-white/50 placeholder:text-gray-400 pr-10`}
                style={{ color: "#535353" }}
                disabled={isLoading}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs" style={{ color: "#848484" }}>
              Re-enter your PIN to confirm
            </p>
          </div>

          {/* Reset Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              isLoading ||
              !newPin ||
              !confirmPin ||
              newPin !== confirmPin ||
              !token
            }
            style={{
              background:
                isLoading ||
                !newPin ||
                !confirmPin ||
                newPin !== confirmPin ||
                !token
                  ? "rgba(132, 132, 132, 0.3)"
                  : "radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)",
              boxShadow: "-4px 30px 30px rgba(219, 134, 154, 0.25)",
              color: "white",
              border: "none",
            }}
          >
            {isLoading ? "Resetting..." : "Reset PIN"}
          </Button>

          {/* Validation Feedback */}
          {newPin && !/^\d{6}$/.test(newPin) && (
            <div className="p-2 rounded bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">
                PIN must be exactly 6 digits
              </p>
            </div>
          )}
          {newPin && confirmPin && newPin !== confirmPin && (
            <div className="p-2 rounded bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">PINs do not match</p>
            </div>
          )}
          {newPin &&
            confirmPin &&
            newPin === confirmPin &&
            /^\d{6}$/.test(newPin) && (
              <div className="p-2 rounded bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">
                  PINs match and are valid
                </p>
              </div>
            )}
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/auth/login")}
            className="text-sm hover:underline"
            style={{ color: "#DB869A" }}
          >
            Back to Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm" style={{ color: "#848484" }}>
        <p>CareNet Platform v2.0</p>
        <p className="mt-2">Progressive Web App</p>
      </div>
    </div>
  );
}

export default function ResetPinPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#F5F7FA" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPinContent />
    </Suspense>
  );
}
