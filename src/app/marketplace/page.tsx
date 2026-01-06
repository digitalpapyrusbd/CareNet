"use client";

import { useState } from "react";
import { Search, Filter, Star, Clock, DollarSign, MapPin, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  salary: string;
  experience: string;
  skills: string[];
  agency: {
    name: string;
    rating: number;
    verified: boolean;
  };
  posted: string;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const jobs: Job[] = [
    {
      id: "1",
      title: "Full-Time Senior Caregiver",
      location: "Dhanmondi, Dhaka",
      description: "Looking for experienced caregiver for elderly patient with diabetes and mobility issues. Must have CPR certification and 3+ years experience.",
      salary: "৳35,000 - ৳45,000/month",
      experience: "3+ years",
      skills: ["Diabetes Care", "Mobility Assistance", "Medication Management"],
      agency: {
        name: "Green Care Agency",
        rating: 4.8,
        verified: true,
      },
      posted: "2 days ago",
    },
    {
      id: "2",
      title: "Post-Surgery Care Specialist",
      location: "Gulshan, Dhaka",
      description: "Immediate position for post-surgical patient care. Requires knowledge of wound care and physical therapy assistance.",
      salary: "৳40,000 - ৳50,000/month",
      experience: "5+ years",
      skills: ["Wound Care", "Physical Therapy", "Post-Surgery Care"],
      agency: {
        name: "SafeHands Care Agency",
        rating: 4.9,
        verified: true,
      },
      posted: "1 day ago",
    },
    {
      id: "3",
      title: "Dementia Care Professional",
      location: "Banani, Dhaka",
      description: "Seeking compassionate caregiver for dementia patient. Experience with behavioral management and cognitive activities required.",
      salary: "৳30,000 - ৳40,000/month",
      experience: "2+ years",
      skills: ["Dementia Care", "Behavioral Management", "Cognitive Activities"],
      agency: {
        name: "Heart & Soul Caregivers",
        rating: 4.7,
        verified: false,
      },
      posted: "3 days ago",
    },
    {
      id: "4",
      title: "24/7 Live-in Caregiver",
      location: "Uttara, Dhaka",
      description: "Full-time live-in position for quadriplegic patient. Must be able to assist with all daily activities and medical needs.",
      salary: "৳50,000 - ৳60,000/month",
      experience: "5+ years",
      skills: ["Quadriplegic Care", "Medical Assistance", "Daily Living Support"],
      agency: {
        name: "Premium Care Services",
        rating: 4.9,
        verified: true,
      },
      posted: "5 hours ago",
    },
    {
      id: "5",
      title: "Pediatric Care Specialist",
      location: "Mohammadpur, Dhaka",
      description: "Looking for experienced caregiver for special needs child. Must have patience and experience with developmental disabilities.",
      salary: "৳28,000 - ৳35,000/month",
      experience: "3+ years",
      skills: ["Special Needs Care", "Child Development", "Therapy Support"],
      agency: {
        name: "Family Care Agency",
        rating: 4.6,
        verified: true,
      },
      posted: "1 week ago",
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.agency.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSalary = !salaryFilter || job.salary.toLowerCase().includes(salaryFilter.toLowerCase());
    const matchesExperience = !experienceFilter || job.experience.toLowerCase().includes(experienceFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesSalary && matchesExperience;
  });

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      <UniversalNav userRole="guardian" showBack={false} />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2" style={{ color: "#535353" }}>
                Caregiver Marketplace
              </h1>
              <p style={{ color: "#848484" }}>
                Find the perfect caregiver for your loved ones
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.6)" }}>
              <Search className="w-5 h-5" style={{ color: "#848484" }} />
              <span className="text-sm" style={{ color: "#848484" }}>
                {jobs.length} jobs available
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#848484" }} />
              <Input
                type="text"
                placeholder="Search jobs, skills, or agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-white/60"
                style={{ color: "#535353" }}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              style={{
                color: "#535353",
                borderColor: "rgba(132, 132, 132, 0.2)",
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div>
            <label className="text-sm mb-2 block" style={{ color: "#848484" }}>
              Location
            </label>
            <Input
              type="text"
              placeholder="Dhaka, Chittagong..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-white/60 border-white/60"
              style={{ color: "#535353" }}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block" style={{ color: "#848484" }}>
              Salary Range
            </label>
            <Input
              type="text"
              placeholder="৳30,000 - ৳50,000"
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
              className="bg-white/60 border-white/60"
              style={{ color: "#535353" }}
            />
          </div>
          <div>
            <label className="text-sm mb-2 block" style={{ color: "#848484" }}>
              Experience
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/60 border-white/60"
              style={{ color: "#535353" }}
            >
              <option value="">All Experience Levels</option>
              <option value="1+ years">1+ years</option>
              <option value="2+ years">2+ years</option>
              <option value="3+ years">3+ years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("");
                setSalaryFilter("");
                setExperienceFilter("");
              }}
              variant="outline"
              className="w-full"
              style={{
                color: "#535353",
                borderColor: "rgba(132, 132, 132, 0.2)",
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: "#535353" }}>
            {filteredJobs.length} Jobs Found
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              style={{
                color: "#535353",
                borderColor: "rgba(132, 132, 132, 0.2)",
              }}
            >
              Sort by Date
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{
                color: "#535353",
                borderColor: "rgba(132, 132, 132, 0.2)",
              }}
            >
              Sort by Salary
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="finance-card p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: "#535353" }}>
                      {job.title}
                    </h3>
                    {job.agency.verified && (
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ background: "#7CE577", color: "white" }}
                      >
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: "#848484" }}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  <p className="text-base mb-4" style={{ color: "#535353", lineHeight: "1.6" }}>
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          background: "rgba(254, 180, 197, 0.2)",
                          color: "#FEB4C5",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Agency Info */}
                <div className="w-64 ml-6 p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                      }}
                    >
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "#535353" }}>
                        {job.agency.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ fill: "#FFB54D", color: "#FFB54D" }} />
                        <span style={{ color: "#535353" }}>{job.agency.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm" style={{ color: "#848484" }}>
                    <div className="flex justify-between">
                      <span>Job Posted:</span>
                      <span className="font-medium" style={{ color: "#535353" }}>{job.posted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Required:</span>
                      <span className="font-medium" style={{ color: "#535353" }}>{job.experience}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full"
                      style={{
                        background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                        color: "white",
                        boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      style={{
                        color: "#535353",
                        borderColor: "rgba(132, 132, 132, 0.2)",
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4"
              style={{
                background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            >
              <Search className="w-10 h-10 text-white mt-5" />
            </div>
            <h3 className="mb-2" style={{ color: "#535353" }}>
              No Jobs Found
            </h3>
            <p style={{ color: "#848484" }}>
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("");
                setSalaryFilter("");
                setExperienceFilter("");
              }}
              className="mt-4"
              style={{
                background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
