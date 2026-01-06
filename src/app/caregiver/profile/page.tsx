"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Settings,
  Phone,
  Mail,
  MapPin,
  Camera,
  Edit,
  Bell,
  Shield,
  Star,
  Check,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverProfilePage() {
  const [user, setUser] = useState({
    name: "Ayesha Rahman",
    role: "Professional Caregiver",
    phone: "+880 1712-3456789",
    email: "ayesha.rahman@email.com",
    location: "Mirpur, Dhaka",
    experience: "3 years",
    rating: 4.8,
    jobsCompleted: 127,
    bio: "Experienced professional caregiver with expertise in elderly care, dementia care, and post-surgery recovery. Dedicated to providing compassionate, patient-centered care.",
    photo: null,
  });

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  const handleEditSettings = () => {
    console.log("Edit settings");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
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

        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="mb-2" style={{ color: "#535353", fontSize: "28px" }}>
              {user.name}
            </h1>
            <p className="text-lg mb-1" style={{ color: "#FEB4C5" }}>
              {user.role}
            </p>
            <p className="text-sm" style={{ color: "#848484" }}>
              Caregiver since {user.experience}
            </p>
          </div>
          <Button
            onClick={handleEditProfile}
            variant="ghost"
            className="shrink-0 hover:bg-white/30"
            style={{ color: "#848484" }}
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(254, 180, 197, 0.2)",
              }}
            >
              <Star className="w-6 h-6" style={{ color: "#FEB4C5" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: "#848484" }}>
                Rating
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: "#535353" }}
              >
                {user.rating}/5
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6"
                style={{
                  fill: star <= Math.floor(user.rating)
                    ? "#FEB4C5"
                    : "#D1D5DB",
                }}
              />
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: "#848484" }}>
            Based on {user.jobsCompleted} completed jobs
          </p>
        </div>

        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(124, 229, 119, 0.2)",
              }}
            >
              <Bell className="w-6 h-6" style={{ color: "#7CE577" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: "#848484" }}>
                Jobs Completed
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: "#535353" }}
              >
                {user.jobsCompleted}
              </p>
            </div>
          </div>
          <p className="text-sm mt-2" style={{ color: "#848484" }}>
            Active and completed assignments
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            <h2 className="text-lg" style={{ color: "#535353" }}>
              Contact Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <p
                className="text-sm w-20"
                style={{ color: "#848484" }}
              >
                Phone
              </p>
              <div className="flex-1">
                <p className="text-lg" style={{ color: "#535353" }}>
                  {user.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Email
                </p>
                <p className="text-lg" style={{ color: "#535353" }}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#848484" }}>
                  Location
                </p>
                <p className="text-lg" style={{ color: "#535353" }}>
                  {user.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            <h2 className="text-lg" style={{ color: "#535353" }}>
              About Me
            </h2>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "#535353" }}>
            {user.bio}
          </p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <h2 className="text-lg" style={{ color: "#535353" }}>
                Profile Photo
              </h2>
            </div>
            <Button
              onClick={handleEditProfile}
              variant="ghost"
              className="shrink-0 hover:bg-white/30"
              style={{ color: "#848484" }}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              <User className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              onClick={() => {
                // Simulate photo capture
                console.log("Capturing profile photo");
              }}
              className="w-full py-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                color: "white",
                boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture New Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="px-6 pb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5" style={{ color: "#FEB4C5" }} />
            <h2 className="text-lg" style={{ color: "#535353" }}>
              Account Settings
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: "#535353" }} />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Notifications
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="w-5 h-5"
                  style={{ accentColor: "#FEB4C5" }}
                />
                <Check className="w-4 h-4 absolute right-[-16px] top-[4px]" style={{ color: "#7CE577" }} />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: "#535353" }} />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Email Notifications
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="w-5 h-5"
                  style={{ accentColor: "#FEB4C5" }}
                />
                <Check className="w-4 h-4 absolute right-[-16px] top-[4px]" style={{ color: "#7CE577" }} />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: "#535353" }} />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Two-Factor Authentication
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  className="w-5 h-5"
                  style={{ accentColor: "#FEB4C5" }}
                />
                <Check className="w-4 h-4 absolute right-[-16px] top-[4px]" style={{ color: "#7CE577" }} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <Button
            onClick={handleEditSettings}
            variant="outline"
            className="flex-1"
            style={{
              color: "#535353",
              borderColor: "rgba(132, 132, 132, 0.2)",
            }}
          >
            <Settings className="w-5 h-5 mr-2" />
            Edit Settings
          </Button>
          <Button
            className="flex-1"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
