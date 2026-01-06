"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DayAvailability {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function CaregiverRegistrationStepSixPage() {
  const [availability, setAvailability] = useState<
    Record<string, DayAvailability>
  >(
    DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { enabled: false, startTime: "09:00", endTime: "17:00" },
      }),
      {},
    ),
  );

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const updateTime = (
    day: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const hasAtLeastOneDay = Object.values(availability).some(
    (day) => day.enabled,
  );

  const handleSubmit = () => {
    window.location.href = "/caregiver/pending-verification";
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
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: "#535353" }}>
              Set Your Availability
            </h1>
            <p style={{ color: "#848484" }}>Step 6 of 6: Weekly Schedule</p>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: "100%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="finance-card p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={availability[day].enabled}
                    onChange={() => toggleDay(day)}
                    className="w-5 h-5 accent-pink-500"
                  />
                  <span style={{ color: "#535353" }}>{day}</span>
                </label>
              </div>

              {availability[day].enabled && (
                <div className="grid grid-cols-2 gap-3 pl-8">
                  <div>
                    <label
                      className="block text-xs mb-1"
                      style={{ color: "#848484" }}
                    >
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={availability[day].startTime}
                        onChange={(e) =>
                          updateTime(day, "startTime", e.target.value)
                        }
                        className="w-full finance-card px-3 py-2 text-sm pr-8"
                        style={{ color: "#535353", outline: "none" }}
                      />
                      <Clock
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "#848484" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs mb-1"
                      style={{ color: "#848484" }}
                    >
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={availability[day].endTime}
                        onChange={(e) =>
                          updateTime(day, "endTime", e.target.value)
                        }
                        className="w-full finance-card px-3 py-2 text-sm pr-8"
                        style={{ color: "#535353", outline: "none" }}
                      />
                      <Clock
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "#848484" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Info Card */}
          <div
            className="finance-card p-4"
            style={{ background: "rgba(254, 180, 197, 0.1)" }}
          >
            <p className="text-sm" style={{ color: "#848484" }}>
              💡 You can update your availability anytime from your dashboard
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!hasAtLeastOneDay}
          className="w-full py-6 mt-6"
          style={{
            background: !hasAtLeastOneDay
              ? "rgba(132, 132, 132, 0.3)"
              : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow: !hasAtLeastOneDay
              ? "none"
              : "0px 4px 18px rgba(240, 161, 180, 0.4)",
            cursor: !hasAtLeastOneDay ? "not-allowed" : "pointer",
          }}
        >
          Submit for Verification
        </Button>
      </div>
    </>
  );
}
