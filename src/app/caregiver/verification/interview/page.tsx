"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Video,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  Phone,
  X,
  Camera,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface InterviewSlot {
  id: string;
  date: string;
  label: string;
  time: string;
}

interface VerificationInterviewProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const SCHEDULED_SLOTS: InterviewSlot[] = [
  {
    id: "dec27",
    date: "2024-12-27",
    label: "December 27",
    time: "10:00 AM",
    slots: ["10:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: "dec28",
    date: "2024-12-28",
    label: "Dec 28",
    time: "09:00 AM",
    slots: ["09:00 AM", "11:00 AM", "3:00 PM"],
  },
  {
    id: "dec29",
    date: "2024-12-29",
    label: "Dec 29",
    time: "10:00 AM",
    slots: ["10:00 AM", "1:00 PM", "5:00 PM"],
  },
];

export default function CaregiverVerificationInterviewPage({
  onNavigate,
  onBack,
}: VerificationInterviewProps) {
  const [status, setStatus] = useState<"schedule" | "scheduled" | "completed">(
    "schedule",
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleScheduleInterview = () => {
    if (selectedDate && selectedTime) {
      setStatus("scheduled");
      setIsRescheduling(false);
    }
  };

  const handleReschedule = () => {
    setIsRescheduling(true);
    setStatus("schedule");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleJoinInterview = () => {
    // Open Google Meet link (in real app, this would be a valid Meet URL)
    window.open("https://meet.google.com", "_blank");
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: "#F5F7FA" }}
    >
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
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            {status === "completed"
              ? "Interview Completed!"
              : "Virtual Interview"}
          </h1>
          <p style={{ color: "#848484" }}>
            {status === "completed"
              ? "Your interview was successful"
              : "Schedule Your Interview"}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-5"
          style={{ background: "rgba(254, 180, 197, 0.05)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "#848484" }}>
              {status === "completed"
                ? "Step 3 of 3"
                : status === "scheduled"
                  ? "Step 2 of 3"
                  : "Step 1 of 3"}
            </span>
            <span
              className="text-2xl font-medium"
              style={{ color: "#FEB4C5" }}
            >
              {status === "completed"
                ? "100%"
                : status === "scheduled"
                  ? "66.67%"
                  : "33.33%"}
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width:
                  status === "completed"
                    ? "100%"
                    : status === "scheduled"
                      ? "66.67%"
                      : "33.33%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Completed Status */}
      {status === "completed" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6"
            style={{
              background: "rgba(124, 229, 119, 0.05)",
              border: "1px solid rgba(168, 224, 99, 0.2)",
            }}
          >
            <div className="flex items-start gap-4">
              <CheckCircle
                className="w-8 h-8"
                style={{ color: "#7CE577" }}
              />
              <div className="flex-1">
                <h2 className="mb-2" style={{ color: "#535353" }}>
                  Interview Completed Successfully!
                </h2>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Thank you for completing the interview. Your assessment
                  results will be available within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Status */}
      {status === "scheduled" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6"
            style={{
              background: "rgba(254, 180, 197, 0.05)",
              border: "1px solid rgba(254, 180, 197, 0.2)",
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(254, 180, 197, 0.2)" }}
              >
                <Calendar className="w-6 h-6" style={{ color: "#FEB4C5" }} />
              </div>
              <div className="flex-1">
                <h2
                  className="text-xl mb-1"
                  style={{ color: "#535353" }}
                >
                  Your Interview is Scheduled
                </h2>
                <p className="text-sm" style={{ color: "#848484" }}>
                  {selectedDate} at {selectedTime}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: "#848484" }}
                >
                  Duration: 30 minutes
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(91, 159, 255, 0.05)" }}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5" style={{ color: "#5B9FFF" }} />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: "#535353" }}>
                    Google Meet Link
                  </p>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    A Google Meet link will be sent via SMS and email 30 minutes
                    before your interview.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Section */}
      {status === "schedule" && !isRescheduling && (
        <div className="px-6 flex-1">
          <div className="finance-card p-6">
            <h2 className="mb-4" style={{ color: "#535353" }}>
              About Interview
            </h2>
            <p className="text-sm mb-6" style={{ color: "#848484" }}>
              A 30-minute video interview with our verification team to assess
              your caregiving experience and communication skills.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "#7CE577" }}
                />
                <p className="text-sm" style={{ color: "#535353" }}>
                  Basic caregiving questions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "#7CE577" }}
                />
                <p className="text-sm" style={{ color: "#535353" }}>
                  Scenario-based assessments
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "#7CE577" }}
                />
                <p className="text-sm" style={{ color: "#535353" }}>
                  Language proficiency check
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date & Time Selection */}
      {status === "schedule" && (
        <div className="px-6 flex-1 mb-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            Select Date & Time
          </h2>
          <div className="space-y-3">
            {SCHEDULED_SLOTS.map((dateOption) => (
              <div key={dateOption.id} className="finance-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: "#FEB4C5" }}
                  />
                  <h3 className="text-lg" style={{ color: "#535353" }}>
                    {dateOption.label}
                  </h3>
                  {dateOption.id === selectedDate && (
                    <span
                      className="ml-2 text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(254, 180, 197, 0.2)",
                        color: "#FEB4C5",
                      }}
                    >
                      Selected
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                {dateOption.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setSelectedDate(dateOption.date);
                      setSelectedTime(slot);
                    }}
                    className="px-3 py-3 rounded-xl text-sm transition-all"
                    style={{
                      background:
                        selectedDate === dateOption.date &&
                        selectedTime === slot
                          ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                          : "rgba(254, 254, 255, 0.5)",
                      color:
                        selectedDate === dateOption.date &&
                        selectedTime === slot
                          ? "white"
                          : "#535353",
                      borderColor:
                        selectedDate === dateOption.date &&
                        selectedTime === slot
                          ? "#FEB4C5"
                          : "transparent",
                      boxShadow:
                        selectedDate === dateOption.date &&
                        selectedTime === slot
                          ? "0px 4px 18px rgba(240, 161, 180, 0.4)"
                          : "none",
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Preparation Tips */}
      {status === "schedule" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle
                className="w-6 h-6 shrink-0"
                style={{ color: "#FEB4C5" }}
              />
              <div>
                <p className="font-medium mb-2" style={{ color: "#535353" }}>
                  Interview Tips
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(254, 180, 197, 0.2)" }}
                >
                  <span className="text-sm">1</span>
                </div>
                <p className="text-sm" style={{ color: "#535353" }}>
                  Find a quiet, well-lit location
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(254, 180, 197, 0.2)" }}
                >
                  <span className="text-sm">2</span>
                </div>
                <p className="text-sm" style={{ color: "#535353" }}>
                  Test your camera and microphone beforehand
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(254, 180, 197, 0.2)" }}
                >
                  <span className="text-sm">3</span>
                </div>
                <p className="text-sm" style={{ color: "#535353" }}>
                  Dress professionally
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(254, 180, 197, 0.2)" }}
                >
                  <span className="text-sm">4</span>
                </div>
                <p className="text-sm" style={{ color: "#535353" }}>
                  Have your documents ready for review
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 pb-6">
        {status === "schedule" && !isRescheduling && (
          <Button
            onClick={handleScheduleInterview}
            disabled={!selectedDate || !selectedTime}
            className="w-full py-6"
            style={{
              background:
                !selectedDate || !selectedTime
                  ? "rgba(132, 132, 132, 0.3)"
                  : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              color: "white",
              boxShadow:
                !selectedDate || !selectedTime
                  ? "none"
                  : "0px 4px 18px rgba(240, 161, 180, 0.35)",
              cursor: !selectedDate || !selectedTime ? "not-allowed" : "pointer",
            }}
          >
            Schedule Interview
          </Button>
        )}

        {status === "scheduled" && (
          <div className="flex gap-3">
            <Button
              onClick={handleReschedule}
              variant="outline"
              className="flex-1 py-6"
              style={{
                color: "#535353",
                borderColor: "rgba(132, 132, 132, 0.2)",
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
            <Button
              onClick={handleJoinInterview}
              className="flex-1 py-6"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              <Video className="w-5 h-5 mr-2" />
              Join Interview
            </Button>
          </div>
        )}

        {status === "completed" && (
          <Button
            onClick={() => onNavigate?.("caregiver/pending-verification")}
            className="w-full py-6"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            Continue to Verification Status
          </Button>
        )}

        {status === "schedule" && isRescheduling && (
          <Button
            onClick={() => setStatus("schedule")}
            variant="outline"
            className="w-full py-6"
            style={{
              color: "#535353",
              borderColor: "rgba(132, 132, 132, 0.2)",
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Reschedule
          </Button>
        )}
      </div>
    </div>
  );
}
