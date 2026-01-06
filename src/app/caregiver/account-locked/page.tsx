"use client";

import { useState } from "react";
import {
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowLeft,
  User,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface AccountLockedProps {
  outstandingAmount?: number;
  daysOverdue?: number;
  invoiceId?: string;
  onPayNow?: () => void;
  onContactSupport?: () => void;
}

export default function CaregiverAccountLockedPage({
  outstandingAmount = 45000,
  daysOverdue = 7,
  invoiceId = "INV-2024-001",
  onPayNow,
  onContactSupport,
}: AccountLockedProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    onPayNow?.();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: "#535353" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 style={{ color: "#535353" }}>Account Restricted</h1>
        <p style={{ color: "#848484" }}>
          Your account has been restricted due to pending payment.
        </p>
      </div>

      {/* Lock Icon */}
      <div className="px-6 mb-6 text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
            boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
          }}
        >
          <Lock className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Outstanding Balance */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div
            className="flex items-center justify-between p-4 rounded-lg mb-4"
            style={{ background: "rgba(255, 107, 122, 0.1)" }}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" style={{ color: "#FF6B7A" }} />
              <div>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Invoice #{invoiceId}
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "#FF6B7A" }}
                >
                  ৳{outstandingAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <CreditCard className="w-8 h-8" style={{ color: "#FF6B7A" }} />
          </div>

          <Button
            onClick={handlePayNow}
            disabled={isProcessingPayment}
            className="w-full"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
              color: "white",
              opacity: isProcessingPayment ? 0.6 : 1,
              cursor: isProcessingPayment ? "not-allowed" : "pointer",
            }}
          >
            {isProcessingPayment ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>

      {/* Account Status */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: "#535353" }}>
            Account Status
          </h3>

          <div className="space-y-3">
            {/* Cannot accept new jobs */}
            <div className="flex items-start gap-3">
              <XCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#FF6B7A" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Cannot accept new jobs
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  New job offers are hidden
                </p>
              </div>
            </div>

            {/* Cannot update availability */}
            <div className="flex items-start gap-3">
              <XCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#FF6B7A" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Cannot update availability
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Schedule changes are locked
                </p>
              </div>
            </div>

            {/* Cannot generate invoices */}
            <div className="flex items-start gap-3">
              <XCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#FF6B7A" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Cannot generate invoices
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Invoice generation disabled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Features */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: "#535353" }}>
            What You Can Do
          </h3>

          <div className="space-y-3">
            {/* Can complete existing jobs */}
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Can complete existing jobs
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Active assignments remain accessible
                </p>
              </div>
            </div>

            {/* Can communicate about active jobs */}
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Can communicate about active jobs
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Messaging for current jobs only
                </p>
              </div>
            </div>

            {/* Can make payment */}
            <div className="flex items-start gap-3">
              <CheckCircle
                className="w-5 h-5 mt-0.5"
                style={{ color: "#7CE577" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Can make payment
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Payment portal remains open
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Warning */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-4"
          style={{ background: "rgba(255, 107, 122, 0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255, 107, 122, 0.2)" }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: "#FF6B7A" }} />
            </div>
            <div>
              <p
                className="text-sm"
                style={{ color: "#FF6B7A", fontWeight: "600" }}
              >
                Payment overdue by {daysOverdue} days
              </p>
              <p className="text-xs" style={{ color: "#848484" }}>
                Please pay your outstanding balance to restore full account
                access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="px-6 pb-6">
        <div className="finance-card p-6">
          <div className="flex items-start gap-3 mb-4">
            <HelpCircle
              className="w-5 h-5 mt-0.5"
              style={{ color: "#5B9FFF" }}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "#535353" }}>
                Need Help?
              </p>
              <p className="text-xs" style={{ color: "#848484" }}>
                Contact support if you have questions about your payment or
                account status.
              </p>
            </div>
          </div>
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="w-full"
            style={{
              color: "#535353",
              borderColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
