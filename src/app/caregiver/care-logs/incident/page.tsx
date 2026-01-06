"use client";

import { useState } from "react";
import { AlertTriangle, Calendar, Clock, MapPin, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

const INCIDENT_TYPES = [
  { id: "accident", icon: "💥", label: "Accident", color: "#FF6B6B", severity: "critical" },
  { id: "fall", icon: "🤕", label: "Fall", color: "#FFB54D", severity: "high" },
  { id: "medication", icon: "💊", label: "Medication Error", color: "#FFD54F", severity: "medium" },
  { id: "behavioral", icon: "🧠", label: "Behavioral Incident", color: "#7CE577", severity: "low" },
  { id: "emergency", icon: "🚨", label: "Emergency Response", color: "#5B9FFF", severity: "critical" },
  { id: "missing", icon: "❓", label: "Missing Person", color: "#FFB74D", severity: "high" },
  { id: "equipment", icon: "⚙️", label: "Equipment Issue", color: "#848484", severity: "low" },
];

const SEVERITY_LEVELS = [
  { id: "critical", label: "Critical", color: "#FF6B6B", description: "Immediate attention required" },
  { id: "high", label: "High", color: "#FFB54D", description: "Address within 24 hours" },
  { id: "medium", label: "Medium", color: "#FFD54F", description: "Address within 72 hours" },
  { id: "low", label: "Low", color: "#7CE577", description: "Address within 1 week" },
];

export default function IncidentReportPage() {
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [involved, setInvolved] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting incident report:", {
      incidentType,
      severity,
      description,
      time,
      location,
      involved,
      actionTaken,
    });
    alert("Incident report submitted successfully!");
    setDescription("");
    setTime("");
    setLocation("");
    setInvolved("");
    setActionTaken("");
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2" style={{ color: "#535353" }}>
              Report Incident
            </h1>
            <p style={{ color: "#848484" }}>
              Document and report any safety or care incidents
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Incident Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INCIDENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIncidentType(type.id)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      incidentType === type.id ? "ring-2" : ""
                    }`}
                    style={{
                      background: incidentType === type.id
                        ? type.color
                        : "rgba(255, 255, 255, 0.6)",
                      borderColor: incidentType === type.id ? type.color : "transparent",
                    }}
                  >
                    <span className="text-2xl mb-1 block">{type.icon}</span>
                    <span className="text-sm" style={{ color: incidentType === type.id ? "white" : "#535353" }}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEVERITY_LEVELS.map((level) => {
                  const isSelected = severity === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSeverity(level.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected ? "ring-2" : ""
                      }`}
                      style={{
                        background: isSelected
                          ? level.color
                          : "rgba(255, 255, 255, 0.6)",
                        borderColor: isSelected ? level.color : "transparent",
                      }}
                    >
                      <p className="font-medium" style={{ color: isSelected ? "white" : "#535353" }}>
                        {level.label}
                      </p>
                      <p className="text-xs" style={{ color: isSelected ? "rgba(255, 255, 255, 0.9)" : "#848484" }}>
                        {level.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident in detail..."
                rows={4}
                className="w-full bg-white/60 border-white/60"
                style={{ color: "#535353" }}
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Time of Incident *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#848484" }} />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 bg-white/60 border-white/60"
                  style={{ color: "#535353" }}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#848484" }} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where did the incident occur?"
                  className="w-full pl-10 bg-white/60 border-white/60"
                  style={{ color: "#535353" }}
                  required
                />
              </div>
            </div>

            {/* People Involved */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                People Involved
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#848484" }} />
                <input
                  type="text"
                  value={involved}
                  onChange={(e) => setInvolved(e.target.value)}
                  placeholder="Names of patient, family members, etc."
                  className="w-full pl-10 bg-white/60 border-white/60"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            {/* Action Taken */}
            <div>
              <label className="block mb-3" style={{ color: "#535353" }}>
                Action Taken
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#848484" }} />
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="What actions did you take?"
                  className="w-full pl-10 bg-white/60 border-white/60"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Submit Incident Report
              </Button>
            </div>

            {/* Emergency SOS */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
              <div className="flex items-center justify-center mb-4">
                <Button
                  type="button"
                  onClick={() => {
                    console.log("Triggering emergency SOS");
                    alert("Emergency SOS triggered! Emergency protocols will be activated.");
                  }}
                  className="flex items-center gap-3"
                  style={{
                    background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
                  }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ background: "rgba(255, 255, 255, 0.3)" }}>
                    🚨
                  </div>
                  <div>
                    <p className="font-bold text-lg">EMERGENCY SOS</p>
                    <p className="text-sm">Trigger emergency response</p>
                  </div>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}