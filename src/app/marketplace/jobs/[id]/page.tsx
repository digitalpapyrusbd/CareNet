"use client";

import { useState } from "react";
import { ArrowLeft, Star, Clock, DollarSign, MapPin, Users, Building2, Calendar, Shield, Check, MessageSquare, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface JobDetails {
  id: string;
  title: string;
  location: string;
  description: string;
  salary: string;
  experience: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posted: string;
  deadline: string;
  jobType: string;
  shiftHours: string;
  agency: {
    name: string;
    rating: number;
    verified: boolean;
    contact: {
      name: string;
      phone: string;
      email: string;
    };
    address: string;
    description: string;
  };
  applicants: number;
}

export default function JobDetailsPage() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    coverLetter: "",
  });

  const job: JobDetails = {
    id: "1",
    title: "Full-Time Senior Caregiver",
    location: "Dhanmondi, Dhaka",
    description: "Looking for experienced caregiver for elderly patient with diabetes and mobility issues. Must have CPR certification and 3+ years experience. This is a rewarding opportunity to make a real difference in someone's life.",
    salary: "৳35,000 - ৳45,000/month",
    experience: "3+ years",
    skills: ["Diabetes Care", "Mobility Assistance", "Medication Management", "CPR Certified", "First Aid"],
    responsibilities: [
      "Provide daily personal care assistance including bathing, dressing, and grooming",
      "Administer medications as prescribed and monitor patient's response",
      "Assist with mobility and transfers using proper techniques",
      "Monitor vital signs and report any changes to healthcare team",
      "Prepare nutritious meals according to dietary requirements",
      "Provide companionship and emotional support",
      "Maintain a clean and safe living environment",
      "Accompany patient to medical appointments when needed"
    ],
    requirements: [
      "Valid CPR certification required",
      "3+ years of professional caregiving experience",
      "Experience with diabetic patients preferred",
      "Strong communication and interpersonal skills",
      "Ability to lift up to 50 lbs safely",
      "Valid driver's license and reliable transportation",
      "Background check and drug screening required"
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Health insurance coverage",
      "Paid time off and holidays",
      "Professional development opportunities",
      "Flexible scheduling options",
      "Employee assistance program"
    ],
    posted: "2 days ago",
    deadline: "January 15, 2025",
    jobType: "Full-time",
    shiftHours: "9:00 AM - 6:00 PM",
    agency: {
      name: "Green Care Agency",
      rating: 4.8,
      verified: true,
      contact: {
        name: "Sarah Rahman",
        phone: "+880 1712-345678",
        email: "sarah@greencare.com.bd",
      },
      address: "House 45, Road 12, Dhanmondi, Dhaka",
      description: "Green Care Agency has been providing quality home care services for over 10 years. We are committed to delivering compassionate, professional care that enhances the quality of life for our clients and peace of mind for their families."
    },
    applicants: 12,
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", applicationData);
    // In a real implementation, this would send the application to the server
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      <UniversalNav userRole="guardian" showBack={true} />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <div className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold" style={{ color: "#535353" }}>
                      {job.title}
                    </h1>
                    {job.agency.verified && (
                      <span
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ background: "#7CE577", color: "white" }}
                      >
                        <Shield className="w-4 h-4 inline mr-1" />
                        Verified Agency
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
                      <span>{job.jobType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: "#848484" }}>
                    <span>Posted: {job.posted}</span>
                    <span>•</span>
                    <span>Deadline: {job.deadline}</span>
                    <span>•</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>

                {/* Agency Info */}
                <div className="w-64 p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                      }}
                    >
                      <Building2 className="w-6 h-6 text-white" />
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
                  <p className="text-sm mb-3" style={{ color: "#848484", lineHeight: "1.4" }}>
                    {job.agency.description}
                  </p>
                  <div className="space-y-2 text-sm" style={{ color: "#848484" }}>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{job.agency.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{job.agency.contact.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3" style={{ color: "#535353" }}>
                  Job Description
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#535353" }}>
                  {job.description}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "#535353" }}>
                    Shift Hours
                  </h3>
                  <p style={{ color: "#848484" }}>{job.shiftHours}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "#535353" }}>
                    Experience Required
                  </h3>
                  <p style={{ color: "#848484" }}>{job.experience}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: "#535353" }}>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
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

              {/* Responsibilities */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: "#535353" }}>
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5" style={{ color: "#7CE577" }} />
                      <span style={{ color: "#535353" }}>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: "#535353" }}>
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5" style={{ color: "#7CE577" }} />
                      <span style={{ color: "#535353" }}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: "#535353" }}>
                  Benefits & Perks
                </h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5" style={{ color: "#7CE577" }} />
                      <span style={{ color: "#535353" }}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowApplicationForm(true)}
                  className="flex-1"
                  style={{
                    background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  style={{
                    color: "#535353",
                    borderColor: "rgba(132, 132, 132, 0.2)",
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Agency
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Application Form */}
            {showApplicationForm && (
              <div className="finance-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: "#535353" }}>
                    Apply for Position
                  </h3>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-sm"
                    style={{ color: "#848484" }}
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#535353" }}>
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={applicationData.name}
                      onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                      placeholder="Your full name"
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#535353" }}>
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#535353" }}>
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      placeholder="+880 1XXX-XXXXX"
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#535353" }}>
                      Years of Experience
                    </label>
                    <Input
                      type="number"
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                      placeholder="3"
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#535353" }}>
                      Cover Letter
                    </label>
                    <Textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      placeholder="Tell us why you're the perfect candidate for this position..."
                      rows={5}
                      className="bg-white/60 border-white/60"
                      style={{ color: "#535353" }}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                      color: "white",
                      boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                    }}
                  >
                    Submit Application
                  </Button>
                </form>
              </div>
            )}

            {/* Agency Contact */}
            <div className="finance-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#535353" }}>
                Contact Agency
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                    }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#848484" }}>Phone</p>
                    <p style={{ color: "#535353" }}>{job.agency.contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    }}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#848484" }}>Email</p>
                    <p style={{ color: "#535353" }}>{job.agency.contact.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                    }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#848484" }}>Address</p>
                    <p style={{ color: "#535353" }}>{job.agency.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Stats */}
            <div className="finance-card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#535353" }}>
                Job Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: "#848484" }}>Applicants</span>
                  <span className="font-semibold" style={{ color: "#535353" }}>{job.applicants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#848484" }}>Response Rate</span>
                  <span className="font-semibold" style={{ color: "#535353" }}>95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#848484" }}>Average Response Time</span>
                  <span className="font-semibold" style={{ color: "#535353" }}>2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#848484" }}>Job Posted</span>
                  <span className="font-semibold" style={{ color: "#535353" }}>{job.posted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
