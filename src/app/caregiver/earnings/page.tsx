'use client';

import { useState } from "react";
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

const EARNINGS_DATA = {
  weekly: "৳8,500",
  monthly: "৳32,400",
  total: "৳98,750",
  pending: "৳4,200",
};

const EARNINGS_HISTORY = [
  { id: 1, month: "December 2024", jobs: 12, hours: 96, amount: "৳32,400", status: "paid" },
  { id: 2, month: "November 2024", jobs: 15, hours: 120, amount: "৳38,600", status: "paid" },
  { id: 3, month: "October 2024", jobs: 10, hours: 80, amount: "৳27,750", status: "pending" },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "total">("month");

  const getDisplayData = () => {
    switch (period) {
      case "week":
        return { amount: EARNINGS_DATA.weekly, label: "This Week", jobs: 12, hours: 96 };
      case "month":
        return { amount: EARNINGS_DATA.monthly, label: "This Month", jobs: 15, hours: 120 };
      case "total":
        return { amount: EARNINGS_DATA.total, label: "Total Earnings", jobs: 37, hours: 296 };
    }
  };

  const data = getDisplayData();

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
        <h1 style={{ color: "#535353" }}>Earnings Summary</h1>
        <p style={{ color: "#848484" }}>Track your income and payments</p>
      </div>

      {/* Period Selector */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2 flex gap-2">
          {(["week", "month", "total"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                period === p ? "finance-card" : ""
              }`}
              style={{
                color: period === p ? "#FEB4C5" : "#848484",
                background: period === p ? "white" : "transparent",
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="finance-card p-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            </div>
            <p className="text-sm mb-1" style={{ color: "#848484" }}>{data.label}</p>
            <p className="text-2xl" style={{ color: "#535353" }}>{data.amount}</p>
          </div>

          <div className="finance-card p-5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: "rgba(255, 213, 79, 0.2)" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#FFD54F" }} />
            </div>
            <p className="text-sm mb-1" style={{ color: "#848484" }}>Pending</p>
            <p className="text-2xl" style={{ color: "#535353" }}>{EARNINGS_DATA.pending}</p>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="px-6">
        <h2 className="mb-3" style={{ color: "#535353" }}>Earnings History</h2>
        <div className="space-y-3">
          {EARNINGS_HISTORY.map((item) => (
            <div key={item.id} className="finance-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                  <div>
                    <h3 style={{ color: "#535353" }}>{item.month}</h3>
                    <p className="text-sm" style={{ color: "#848484" }}>
                      {item.jobs} jobs • {item.hours} hours
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold" style={{ color: "#535353" }}>{item.amount}</p>
                  <span
                    className="text-xs px-2 py-1 rounded-full ml-2"
                    style={{
                      background: "rgba(124, 229, 119, 0.2)",
                      color: "white",
                    }}
                  >
                    Paid
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="px-6">
        <Button
          onClick={() => (window.location.href = "/caregiver/earnings/withdraw")}
          className="w-full py-4"
          style={{
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
            color: "white",
          }}
        >
          <Download className="w-5 h-5 mr-2" />
          Withdraw Earnings
        </Button>
      </div>
    </div>
  );
}
