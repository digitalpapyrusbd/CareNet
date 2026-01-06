"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Activity,
  CheckCircle2,
  AlertCircle,
  Star,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Job {
  id: string;
  patient: string;
  age: number;
  time: string;
  date: string;
  location: string;
  conditions: string[];
  status: "ongoing" | "confirmed" | "completed" | "cancelled";
  duration?: string;
  rating?: number;
}

interface CaregiverJobsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const MOCK_JOBS = {
  today: [
    {
      id: "1",
      patient: "Mrs. Fatima Rahman",
      age: 72,
      time: "9:00 AM - 5:00 PM",
      date: "Today",
      location: "Dhanmondi, Dhaka",
      conditions: ["Diabetes", "Hypertension"],
      status: "ongoing",
    },
    {
      id: "2",
      patient: "Mr. Karim Ahmed",
      age: 68,
      time: "8:00 AM - 4:00 PM",
      date: "Today",
      location: "Gulshan-2, Dhaka",
      conditions: ["Post-Surgery"],
      status: "ongoing",
    },
  ],
  upcoming: [
    {
      id: "3",
      patient: "Mr. Karim Ahmed",
      age: 68,
      date: "Tomorrow",
      time: "10:00 AM - 6:00 PM",
      location: "Gulshan-2, Dhaka",
      conditions: ["Post-Surgery"],
      status: "confirmed",
    },
    {
      id: "4",
      patient: "Mrs. Nasrin Begum",
      age: 75,
      date: "Dec 28",
      time: "9:00 AM - 5:00 PM",
      location: "Uttara",
      conditions: ["Dementia"],
      status: "confirmed",
    },
    {
      id: "5",
      patient: "Mr. Abdul Hamid",
      age: 74,
      date: "Dec 29",
      time: "2:00 PM - 10:00 PM",
      location: "Mirpur",
      conditions: ["Mobility Issues"],
      status: "pending",
    },
  ],
  completed: [
    {
      id: "5",
      patient: "Mr. Abdul Hamid",
      age: 74,
      duration: "Nov 1-30, 2024",
      time: "8 hours total",
      location: "Mirpur",
      conditions: ["Mobility Issues"],
      status: "completed",
      rating: 5,
    },
    {
      id: "6",
      patient: "Mrs. Salam Mia",
      age: 70,
      duration: "Oct 15-31, 2024",
      time: "6 hours total",
      location: "Mohakhali",
      conditions: ["Heart Disease"],
      status: "completed",
      rating: 4,
    },
  ],
};

export default function CaregiverJobsPage({ onNavigate, onBack }: CaregiverJobsProps) {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "completed">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const getJobsByTab = (tab: string) => {
    switch (tab) {
      case "today":
        return MOCK_JOBS.today;
      case "upcoming":
        return MOCK_JOBS.upcoming;
      case "completed":
        return MOCK_JOBS.completed;
      default:
        return [];
    }
  };

  const currentJobs = getJobsByTab(activeTab);

  const handleTabChange = (tab: "today" | "upcoming" | "completed") => {
    setActiveTab(tab);
  };

  const handleJobClick = (jobId: string) => {
    onNavigate?.(`caregiver/jobs/${jobId}`);
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "#FEB4C5";
      case "confirmed":
        return "#7CE577";
      case "completed":
        return "#5B9FFF";
      case "cancelled":
        return "#FF6B6B";
      default:
        return "#848484";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Activity className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="hover:bg-white/30"
            style={{ color: "#535353" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 style={{ color: "#535353" }}>My Jobs</h1>
        </div>

        <p style={{ color: "#848484" }}>
          Manage your care assignments and track your shifts
        </p>
      </div>

      {/* Search & Filter */}
      <div className="px-6 mb-4">
        <div className="finance-card p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#848484" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                style={{ color: "#535353" }}
              />
            </div>
            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-3 rounded-xl"
              style={{ background: "rgba(254, 180, 197, 0.1)", borderColor: "rgba(254, 180, 197, 0.2)" }}
            >
              <Filter className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2">
          <div className="flex gap-2">
            {(["today", "upcoming", "completed"] as const).map((tab) => {
              const jobs = getJobsByTab(tab);
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 py-4 rounded-xl transition-all ${activeTab === tab ? "ring-2" : ""
                    }`}
                  style={{
                    background:
                      activeTab === tab
                        ? "white"
                        : "rgba(255, 255, 255, 0.5)",
                    borderColor: activeTab === tab ? "#FEB4C5" : "transparent",
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-medium" style={{ color: activeTab === tab ? "#FEB4C5" : "#535353" }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "#848484" }}
                    >
                      ({jobs.length})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-6 flex-1 space-y-4">
        {currentJobs.map((job) => (
          <div
            key={job.id}
            className="finance-card p-6 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleJobClick(job.id)}
            style={{
              background:
                job.status === "ongoing"
                  ? "rgba(254, 180, 197, 0.05)"
                  : "white",
            }}
          >
            {/* Patient Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-1" style={{ color: "#535353" }}>
                    {job.patient}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: "#848484" }}>
                      {job.age} years old
                    </span>
                    <span className="px-2" style={{ color: "#848484" }}>
                      •
                    </span>
                    <span className="text-sm" style={{ color: "#848484" }}>
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: getStatusColor(job.status), color: "white" }}
              >
                {getStatusIcon(job.status)}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-start gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: getStatusColor(job.status),
                  color: "white",
                }}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <span className="text-sm" style={{ color: "#848484" }}>
                {activeTab === "today" && job.time}
                {activeTab === "upcoming" && job.date}
                {activeTab === "completed" && `${job.duration} total`}
              </span>
            </div>

            {/* Conditions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.conditions.map((condition) => (
                <span
                  key={condition}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: "rgba(254, 180, 197, 0.1)",
                    color: "#535353",
                    border: "1px solid rgba(254, 180, 197, 0.2)",
                  }}
                >
                  {condition}
                </span>
              ))}
            </div>

            {/* Action Button */}
            {activeTab === "today" && job.status === "ongoing" && (
              <Button
                onClick={() => handleJobClick(job.id)}
                className="w-full py-3"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <Activity className="w-4 h-4 mr-2" />
                Start Shift
              </Button>
            )}

            {activeTab === "completed" && job.rating && (
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= job.rating ? "fill-current" : "text-gray-300"
                      }`}
                    style={{ color: star <= job.rating ? "#FFB54D" : "#D1D5DB" }}
                  />
                ))}
                <span className="text-sm" style={{ color: "#848484" }}>
                  {job.rating}/5 rating
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentJobs.length === 0 && (
        <div className="px-6 pb-6">
          <div
            className="finance-card p-8 text-center"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{
                background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
              }}
            >
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h2 className="mb-2" style={{ color: "#535353" }}>
              No jobs found
            </h2>
            <p style={{ color: "#848484" }}>
              You have no {activeTab} jobs. New assignments will appear here
              when guardians post care requests.
            </p>
          </div>
        </div>
      )}

      {/* Add Job Button - Only for demo */}
      {activeTab !== "completed" && (
        <div className="px-6 pb-6">
          <Button
            onClick={() => window.location.href = "/caregiver/jobs/new"}
            className="w-full py-6"
            style={{
              background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Job Entry
          </Button>
        </div>
      )}
    </div>
  );
}
