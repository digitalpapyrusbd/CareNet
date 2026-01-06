"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Activity, Calendar, Phone, User, MapPin, AlertTriangle, Heart, MessageSquare, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function PatientDashboardPage() {
  const router = useRouter();
  const patientName = "Anwar Hossain";
  const caregiverName = "Shaila Khatun";
  const caregiverRating = "4.9";

  const todayMeds = [
    { id: 1, name: "Metformin", time: "9:00 AM", status: "taken" },
    { id: 2, name: "Losartan", time: "9:00 AM", status: "taken" },
    { id: 3, name: "Vitamin D", time: "8:00 PM", status: "scheduled" },
  ];

  const recentActivity = [
    { type: "vitals", time: "10:00 AM", description: "BP: 130/85, HR: 78 - Normal", icon: Heart },
    { type: "medication", time: "9:00 AM", description: "Morning medications administered", icon: Pill },
    { type: "activity", time: "11:00 AM", description: "15-minute walking exercise completed", icon: Activity },
  ];

  const handleMedication = (id: number) => {
    console.log("Marking medication:", id);
  };

  const handleViewAllMedications = () => {
    router.push("/patient/medications");
  };

  const handleChat = () => {
    router.push("/patient/chat");
  };

  const handleCall = () => {
    window.open("tel:+88017123456789");
  };

  const handleScheduleAppointment = () => {
    router.push("/patient/appointments");
  };

  const handleViewCareLogs = () => {
    router.push("/patient/care-logs");
  };

  const handleViewHealthRecords = () => {
    router.push("/patient/health-records");
  };

  const handleViewMedications = () => {
    router.push("/patient/medications");
  };

  const handleOpenEmergency = () => {
    router.push("/patient/emergency-contacts");
  };

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
        {/* Header */}
        <div className="finance-card p-6 mb-4">
          <p className="text-sm mb-2" style={{ color: "#848484" }}>
            Tuesday, December 10 • {new Date().toLocaleTimeString()}
          </p>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#535353" }}>
                Hello, {patientName}
              </h1>
              <p className="text-base mb-1" style={{ color: "#848484" }}>
                Your caregiver {caregiverName} arrives at 9:00 AM
              </p>
            </div>
          </div>
        </div>

        {/* Today's Caregiver Card */}
        <div className="px-6 mt-6">
          <div className="finance-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #5B9FFF 100%)",
                  boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Today's Caregiver
                </p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold" style={{ color: "#535353" }}>
                    {caregiverName}
                  </h2>
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ background: "#7CE577", color: "white" }}
                  >
                    {caregiverRating}★ Caring & Professional
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={handleChat}
                className="p-4"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                }}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat
              </Button>
              <Button
                onClick={handleCall}
                className="p-4"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Guardian
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              onClick={handleViewAllMedications}
              className="p-4 finance-card hover:shadow-lg transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <Pill className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-center" style={{ color: "#535353" }}>
                Medications
              </p>
            </Button>

            <Button
              onClick={handleViewCareLogs}
              className="p-4 finance-card hover:shadow-lg transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                  boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                }}
              >
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-center" style={{ color: "#535353" }}>
                Care Logs
              </p>
            </Button>

            <Button
              onClick={handleScheduleAppointment}
              className="p-4 finance-card hover:shadow-lg transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD54F 0%, #FFB74D 100%)",
                  boxShadow: "0px 4px 18px rgba(255, 213, 79, 0.35)",
                }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-center" style={{ color: "#535353" }}>
                Appointments
              </p>
            </Button>

            <Button
              onClick={handleViewHealthRecords}
              className="p-4 finance-card hover:shadow-lg transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                  boxShadow: "0px 4px 18px rgba(168, 224, 99, 0.35)",
                }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-center" style={{ color: "#535353" }}>
                Health Records
              </p>
            </Button>
          </div>
        </div>

        {/* Today's Medications */}
        <div className="px-6 mb-6">
          <div className="finance-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Pill className="w-5 h-5" style={{ color: "#FEB4C5" }} />
                <h2 className="text-xl font-bold" style={{ color: "#535353" }}>
                  Today's Medications
                </h2>
              </div>
              <Button
                onClick={handleViewAllMedications}
                className="px-3 py-1.5 rounded-lg"
                style={{ color: "#5B9FFF", borderColor: "rgba(91, 159, 255, 0.2)" }}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {todayMeds.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleMedication(med.id)}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:shadow-md transition-all"
                  style={{
                    background: med.status === "taken"
                      ? "rgba(124, 229, 119, 0.1)"
                      : "rgba(255, 255, 255, 0.6)",
                    border: med.status === "taken"
                      ? "1px solid rgba(124, 229, 119, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <p className="text-base font-medium" style={{ color: "#535353" }}>
                      {med.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: med.status === "taken" ? "#2E7D32" : "#848484",
                      fontSize: "12px",
                      fontWeight: "500",
                      lineHeight: "14px",
                      backgroundColor: med.status === "taken"
                        ? "rgba(124, 229, 119, 0.1)"
                        : "rgba(255, 211, 128, 0.1)",
                        borderRadius: "8px",
                        padding: "4px 12px",
                      }}
                    >
                      {med.time}
                    </p>
                  </div>
                  {med.status === "taken" && (
                    <Check className="w-5 h-5" style={{ color: "#2E7D32" }} />
                  )}
                  {med.status === "scheduled" && (
                    <Clock className="w-5 h-5" style={{ color: "#FFD54F" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <h2 className="text-xl font-bold" style={{ color: "#535353" }}>
                Recent Activity
              </h2>
            </div>
            <Button
              onClick={() => {
                // View all activity
                console.log("View all activity");
              }}
              className="px-3 py-1.5 rounded-lg"
              style={{ color: "#5B9FFF", borderColor: "rgba(91, 159, 255, 0.2)" }}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <div
                  key={index}
                  className="finance-card p-4 flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                      boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                    }}
                  >
                    <ActivityIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: "#848484" }}>
                      {activity.description}
                    </p>
                    <p className="text-xs" style={{ color: "#848484" }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency SOS Section */}
        <div className="px-6 mb-6">
          <div className="finance-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)",
                    boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
                  }}
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: "#535353" }}>
                  Emergency Assistance
                </h2>
              </div>
              <Button
                onClick={handleOpenEmergency}
                className="px-3 py-1.5 rounded-lg"
                style={{ color: "#FF6B7A", borderColor: "rgba(255, 107, 122, 0.2)" }}
              >
                Manage
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm mb-4" style={{ color: "#848484" }}>
                Tap here for one-tap emergency assistance from your emergency contacts
              </p>
              <Button
                onClick={() => {
                  // Trigger emergency call
                  console.log("Triggering emergency call");
                }}
                className="w-full py-4"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                One-Tap Emergency Call
              </Button>
              <p className="text-center text-xs mt-2" style={{ color: "#848484" }}>
                This will call your primary emergency contact immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
