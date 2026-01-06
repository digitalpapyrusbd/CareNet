"use client";

import { useState } from "react";
import { Calendar, MapPin, Clock, Star, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Job {
  id: string;
  patientName: string;
  location: string;
  date: string;
  hours: string;
  earnings: number;
  rating: number;
  status: "completed" | "cancelled";
}

export default function JobHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "cancelled">("all");

  const jobs: Job[] = [
    {
      id: "1",
      patientName: "Mrs. Fatima Rahman",
      location: "House 45, Road 12, Dhanmondi",
      date: "Nov 1-30, 2024",
      hours: "240h",
      earnings: 36000,
      rating: 5,
      status: "completed",
    },
    {
      id: "2",
      patientName: "Mr. Abdul Rahman",
      location: "Gulshan-1",
      date: "Oct 15-31, 2024",
      hours: "136h",
      earnings: 20400,
      rating: 4.8,
      status: "completed",
    },
    {
      id: "3",
      patientName: "Mrs. Amina Khatun",
      location: "Uttara",
      date: "Sep 1-30, 2024",
      hours: "240h",
      earnings: 36000,
      rating: 4.9,
      status: "completed",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === "all") return true;
    return job.status === activeFilter;
  });

  const handleViewDetails = (jobId: string) => {
    window.location.href = `/caregiver/jobs/${jobId}`;
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
        <h1 className="mb-2" style={{ color: "#535353" }}>Job History</h1>
        <p style={{ color: "#848484" }}>Your completed care assignments</p>
      </div>

      {/* Summary Stats */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl" style={{ color: "#7CE577" }}>
                {jobs.length}
              </p>
              <p className="text-xs" style={{ color: "#848484" }}>Completed Jobs</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: "#FFB3C1" }}>
                {jobs.reduce((sum, job) => sum + (parseInt(job.hours.replace(/\D/g, "")) || 0), 0)}
              </p>
              <p className="text-xs" style={{ color: "#848484" }}>Total Hours</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: "#5B9FFF" }}>
                4.9
              </p>
              <p className="text-xs" style={{ color: "#848484" }}>Avg. Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2 flex gap-2">
          {(["all", "completed", "cancelled"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                activeFilter === filter ? "finance-card" : ""
              }`}
              style={{
                color: activeFilter === filter ? "#FEB4C5" : "#848484",
                background: activeFilter === filter ? "white" : "transparent",
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="px-6 space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: "#848484" }} />
            <p style={{ color: "#848484" }}>No jobs found</p>
          </div>
        ) : (
          <>
            {filteredJobs.map((job) => (
              <div key={job.id} className="finance-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      job.status === "completed"
                        ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)"
                        : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
                  }}
                >
                  <Star
                    className="w-6 h-6"
                    style={{
                      color:
                        job.status === "completed" ? "white" : "white",
                      fill:
                        job.status === "completed" ? "white" : "white",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: "#535353" }}>
                    {job.patientName}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "#848484" }}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "#848484" }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>
                        {job.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/50">
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    {job.hours}
                  </p>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Total Hours
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl"
                    style={{ color: "#7CE577" }}
                  >
                    ৳{job.earnings.toLocaleString()}
                  </p>
                  {job.status === "completed" && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        className="w-3 h-3"
                        style={{ color: "#FFD54F", fill: "#FFD54F" }}
                      />
                      <span className="text-xs" style={{ color: "#848484" }}>
                        {job.rating}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleViewDetails(job.id)}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
