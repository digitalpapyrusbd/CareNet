"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  X,
  User,
  Phone,
  Mail,
  Star,
  Briefcase,
  Heart,
  FileText,
  Activity,
  MessageSquare,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface JobDetailProps {
  jobId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverJobDetailPage({
  jobId,
  onNavigate,
  onBack,
}: JobDetailProps) {
  const [activeTab, setActiveTab] = useState<"details" | "requirements" | "history" | "contact">("details");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const job = {
    id: jobId || "job-1",
    title: "Full-Time Caregiver - Dementia Patient",
    patient: {
      name: "Mrs. Nasrin Begum",
      age: 75,
      gender: "Female",
      location: "Uttara, Dhaka",
      conditions: ["Dementia", "Diabetes", "Hypertension"],
      photo: "/placeholder/patient.jpg",
    },
    requirements: {
      skills: ["Elderly Care", "Dementia Care", "First Aid", "CPR Certified"],
      experience: "Minimum 2 years",
      languages: ["Bengali", "English"],
      availability: "Full-time, Live-in preferred",
      duties: ["Personal care assistance", "Medication management", "Meal preparation", "Mobility support", "Companionship"],
      hours: "8 hours/day, 6 days/week",
    },
    schedule: {
      startDate: "January 2, 2025",
      endDate: "March 28, 2025",
      shiftStart: "9:00 AM",
      shiftEnd: "5:00 PM",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    payment: {
      rate: 450,
      ratePeriod: "daily",
      currency: "৳",
      estimatedMonthly: 60000,
      paymentMethod: "Weekly transfer",
      paymentDay: "Sunday",
    },
    guardian: {
      name: "Mr. Abdul Karim Ahmed",
      phone: "+880 1712-3456789",
      email: "karim.ahmed@email.com",
      rating: 4.8,
      jobsPosted: 15,
    },
    status: {
      current: "confirmed",
      appliedDate: "December 27, 2024",
      interviewDate: "December 28, 2024",
      interviewTime: "10:00 AM",
      history: [
        { date: "Dec 27, 2024", event: "Applied", status: "pending" },
        { date: "Dec 28, 2024", event: "Interview Scheduled", status: "upcoming" },
        { date: "Dec 29, 2024", event: "Job Offer Received", status: "pending" },
      ],
    },
  };

  const handleApplyForJob = () => {
    if (!hasApplied) {
      setHasApplied(true);
      setShowApplyModal(true);
    }
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="hover:bg-white/30"
            style={{ color: "#535353" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 style={{ color: "#535353" }}>
            Job Details
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2">
          <div className="flex gap-2">
            {(["details", "requirements", "history", "contact"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 rounded-xl transition-all ${
                  activeTab === tab ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeTab === tab
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  borderColor: activeTab === tab ? "#FEB4C5" : "transparent",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: activeTab === tab ? "white" : "#535353" }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 flex-1">
        {/* Details Tab */}
        {activeTab === "details" && (
          <>
            {/* Patient Information */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  }}
                >
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-1" style={{ color: "#535353" }}>
                    Patient Information
                  </h2>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm" style={{ color: "#848484" }}>
                      {job.patient.age} years
                    </span>
                    <span style={{ color: "#848484" }}>•</span>
                    <span className="text-sm" style={{ color: "#848484" }}>
                      {job.patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" style={{ color: "#FEB4C5" }} />
                    <span className="text-base font-medium" style={{ color: "#535353" }}>
                      {job.patient.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4" style={{ color: "#FFB54D" }} />
                    <span className="text-sm" style={{ color: "#848484" }}>
                      Guardian Rating: {job.guardian.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    Location
                  </p>
                  <p className="text-lg font-medium" style={{ color: "#535353" }}>
                    {job.patient.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Condition Badges */}
            <div className="finance-card p-6 mb-4">
              <p className="text-sm mb-3" style={{ color: "#848484" }}>
                Medical Conditions
              </p>
              <div className="flex flex-wrap gap-2">
                {job.patient.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(254, 180, 197, 0.15)",
                      color: "#535353",
                    }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Guardian Rating */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6" style={{ color: "#FFB54D" }} />
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: "#848484" }}>
                      Guardian Rating
                    </p>
                    <p className="text-2xl font-bold" style={{ color: "#535353" }}>
                      {job.guardian.rating}/5
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5"
                          style={{
                            fill: star <= job.guardian.rating
                              ? "#FFB54D"
                              : "#D1D5DB",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm" style={{ color: "#848484" }}>
                Based on {job.guardian.jobsPosted} job postings
              </p>
            </div>

            {/* Apply Button */}
            <div className="mb-4">
              <Button
                onClick={handleApplyForJob}
                disabled={hasApplied}
                className="w-full py-6"
                style={{
                  background: hasApplied
                    ? "rgba(132, 132, 132, 0.3)"
                    : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                  color: "white",
                  boxShadow: hasApplied
                    ? "none"
                    : "0px 4px 18px rgba(124, 229, 119, 0.35)",
                  cursor: hasApplied ? "not-allowed" : "pointer",
                }}
              >
                {hasApplied ? "Applied ✓" : "Apply for This Job"}
              </Button>
            </div>
          </>
        )}

        {/* Requirements Tab */}
        {activeTab === "requirements" && (
          <>
            <div className="finance-card p-6 mb-4">
              <h2 className="mb-4" style={{ color: "#535353" }}>
                Job Requirements
              </h2>

              {/* Required Skills */}
              <div className="mb-6">
                <p className="text-sm mb-3" style={{ color: "#848484" }}>
                  Required Skills
                </p>
                <div className="space-y-2">
                  {job.requirements.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(254, 180, 197, 0.05)" }}
                    >
                      <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#7CE577" }} />
                      <span
                        className="text-sm"
                        style={{ color: "#535353" }}
                      >
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Required Experience
                  </p>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                    <p className="text-lg font-medium" style={{ color: "#535353" }}>
                      {job.requirements.experience}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Languages
                  </p>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                    <p className="text-base" style={{ color: "#535353" }}>
                      {job.requirements.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <p className="text-sm mb-3" style={{ color: "#848484" }}>
                  Availability
                </p>
                <div className="p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                    <span className="text-base" style={{ color: "#535353" }}>
                      {job.requirements.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <p className="text-sm mb-3" style={{ color: "#848484" }}>
                  Schedule
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm" style={{ color: "#848484" }}>
                      Hours
                    </p>
                    <p className="text-base font-medium" style={{ color: "#535353" }}>
                      {job.requirements.hours}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm" style={{ color: "#848484" }}>
                      Working Days
                    </p>
                    <p className="text-base font-medium" style={{ color: "#535353" }}>
                      {job.schedule.days.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duties */}
              <div>
                <p className="text-sm mb-3" style={{ color: "#848484" }}>
                  Job Duties
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {job.requirements.duties.map((duty, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background: "rgba(254, 180, 197, 0.05)" }}
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#7CE577" }} />
                      <span
                        className="text-sm"
                        style={{ color: "#535353" }}
                      >
                        {duty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <>
            <div className="finance-card p-6 mb-4">
              <h2 className="mb-4" style={{ color: "#535353" }}>
                Application History
              </h2>

              <div className="space-y-3">
                {job.status.history.map((historyItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background:
                        historyItem.status === "confirmed"
                          ? "rgba(124, 229, 119, 0.1)"
                          : "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: historyItem.status === "confirmed"
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)"
                            : "rgba(132, 132, 132, 0.2)",
                          color: "white",
                        }}
                      >
                        {historyItem.status === "confirmed" && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                        {historyItem.status === "pending" && (
                          <Clock className="w-5 h-5" style={{ color: "#848484" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: "#848484" }}>
                          {historyItem.date}
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: "#535353" }}
                        >
                          {historyItem.event}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background:
                          historyItem.status === "confirmed"
                            ? "rgba(124, 229, 119, 0.1)"
                            : "rgba(255, 179, 193, 0.2)",
                        color: historyItem.status === "confirmed"
                          ? "#2E7D32"
                          : "#848484",
                      }}
                    >
                      {historyItem.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <>
            {/* Guardian Contact */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB54D 0%, #FF9F47 100%)",
                    boxShadow: "0px 4px 18px rgba(255, 181, 77, 0.35)",
                  }}
                >
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-1" style={{ color: "#535353" }}>
                    {job.guardian.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4" style={{ color: "#FFB54D" }} />
                    <span className="text-sm" style={{ color: "#848484" }}>
                      {job.guardian.rating}/5 • {job.guardian.jobsPosted} job postings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="finance-card p-6 mb-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 shrink-0" style={{ color: "#FEB4C5" }} />
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: "#848484" }}>
                      Phone Number
                    </p>
                    <p className="text-base font-medium" style={{ color: "#535353" }}>
                      {job.guardian.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 shrink-0" style={{ color: "#FEB4C5" }} />
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: "#848484" }}>
                      Email Address
                    </p>
                    <p className="text-base font-medium" style={{ color: "#535353" }}>
                      {job.guardian.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Message */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <div className="flex-1">
                  <h2 className="text-lg" style={{ color: "#535353" }}>
                    Send Message to Guardian
                  </h2>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Have questions about this job posting?
                  </p>
                </div>
              </div>

              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none resize-none"
                style={{ color: "#535353" }}
              />

              <Button
                disabled={!applyMessage.trim()}
                className="w-full py-4"
                style={{
                  background: !applyMessage.trim()
                    ? "rgba(132, 132, 132, 0.3)"
                    : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: !applyMessage.trim() ? "#848484" : "white",
                  boxShadow: !applyMessage.trim()
                    ? "none"
                    : "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  cursor: !applyMessage.trim() ? "not-allowed" : "pointer",
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {applyMessage.trim() ? "Send Message" : "Type a message"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowApplyModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                    boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl" style={{ color: "#535353" }}>
                    Application Submitted!
                  </h3>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Your application has been sent to the guardian
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowApplyModal(false)}
                className="hover:bg-white/30"
              >
                <X className="w-5 h-5" style={{ color: "#535353" }} />
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="finance-card p-4" style={{ background: "rgba(124, 229, 119, 0.1)" }}>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 shrink-0" style={{ color: "#7CE577" }} />
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: "#535353" }}>
                      Job Title
                    </p>
                    <p className="text-base" style={{ color: "#535353" }}>
                      {job.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="finance-card p-4" style={{ background: "rgba(124, 229, 119, 0.1)" }}>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 shrink-0" style={{ color: "#7CE577" }} />
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: "#535353" }}>
                      Patient Name
                    </p>
                    <p className="text-base" style={{ color: "#535353" }}>
                      {job.patient.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="finance-card p-4" style={{ background: "rgba(124, 229, 119, 0.1)" }}>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 shrink-0" style={{ color: "#7CE577" }} />
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: "#535353" }}>
                      Start Date
                    </p>
                    <p className="text-base" style={{ color: "#535353" }}>
                      {job.schedule.startDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => {
                  setShowApplyModal(false);
                  onNavigate?.("caregiver/jobs");
                }}
                className="w-full py-4"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                }}
              >
                Continue Browsing Jobs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
