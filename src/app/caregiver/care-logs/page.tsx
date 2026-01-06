"use client";

import { useState } from "react";
import {
  Activity,
  Pill,
  FileText,
  AlertTriangle,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface CareLogsPageProps {
  patientName?: string;
}

type LogType = "vitals" | "medication" | "activity" | "incident" | null;

export default function CareLogsPage({
  patientName = "Mrs. Fatima Rahman",
}: CareLogsPageProps) {
  const [selectedType, setSelectedType] = useState<LogType>(null);

  // Vitals state
  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    bloodGlucose: "",
    oxygen: "",
  });

  // Medication state
  const [medications, setMedications] = useState([
    {
      id: "1",
      name: "Metformin",
      dosage: "500mg",
      time: "2:00 PM",
      status: "pending",
    },
    {
      id: "2",
      name: "Amlodipine",
      dosage: "5mg",
      time: "2:00 PM",
      status: "pending",
    },
  ]);
  const [medStatus, setMedStatus] = useState<{
    [key: string]: "given" | "skipped" | null;
  }>({});
  const [skipReason, setSkipReason] = useState<{ [key: string]: string }>({});

  // Activity state
  const [activityType, setActivityType] = useState("");
  const [activityNotes, setActivityNotes] = useState("");

  // Incident state
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  // Today's logs
  const todayLogs = [
    {
      id: "1",
      type: "vitals",
      time: "10:00 AM",
      note: "BP: 130/85, HR: 78 bpm - Normal",
    },
    {
      id: "2",
      type: "medication",
      time: "9:00 AM",
      note: "Morning medications administered",
    },
    {
      id: "3",
      type: "activity",
      time: "11:00 AM",
      note: "15-minute walking exercise completed",
    },
  ];

  const logTypes = [
    {
      id: "vitals",
      name: "Vitals",
      icon: Activity,
      gradient:
        "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
    },
    {
      id: "medication",
      name: "Medication",
      icon: Pill,
      gradient:
        "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
    },
    {
      id: "activity",
      name: "Activity",
      icon: FileText,
      gradient:
        "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
    },
    {
      id: "incident",
      name: "Incident",
      icon: AlertTriangle,
      gradient:
        "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)",
    },
  ];

  const handleSaveLog = () => {
    const logData = {
      type: selectedType,
      timestamp: new Date().toISOString(),
      data:
        selectedType === "vitals"
          ? vitals
          : selectedType === "medication"
            ? { medications: medStatus, skipReasons: skipReason }
            : selectedType === "activity"
              ? { type: activityType, notes: activityNotes }
              : {
                  type: incidentType,
                  severity,
                  description: incidentDescription,
                  action: actionTaken,
                },
    };
    console.log("Saving log:", logData);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen pb-6" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="px-6 pt-6">
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "#535353" }} />
        </button>
      </div>

      <div className="px-6 pb-6">
        <h1 className="mb-2" style={{ color: "#535353" }}>
          Care Logs
        </h1>
        <p className="mb-6" style={{ color: "#848484" }}>
          {patientName}
        </p>

        {/* Today's Entries */}
        {!selectedType && (
          <>
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Today&apos;s Entries
            </h3>
            <div className="space-y-3 mb-6">
              {todayLogs.map((log) => (
                <div key={log.id} className="finance-card p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          log.type === "vitals"
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)"
                            : log.type === "medication"
                              ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)"
                              : log.type === "activity"
                                ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)"
                                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)",
                      }}
                    >
                      {log.type === "vitals" && (
                        <Activity className="w-5 h-5 text-white" />
                      )}
                      {log.type === "medication" && (
                        <Pill className="w-5 h-5 text-white" />
                      )}
                      {log.type === "activity" && (
                        <FileText className="w-5 h-5 text-white" />
                      )}
                      {log.type === "incident" && (
                        <AlertTriangle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span
                          className="text-sm capitalize"
                          style={{ color: "#535353" }}
                        >
                          {log.type}
                        </span>
                        <span className="text-xs" style={{ color: "#848484" }}>
                          {log.time}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#535353" }}>
                        {log.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Log Type Buttons */}
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Add New Entry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {logTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as LogType)}
                  className="finance-card p-4 hover:shadow-lg transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                    style={{ background: type.gradient }}
                  >
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <p
                    className="text-sm text-center"
                    style={{ color: "#535353" }}
                  >
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Vitals Form */}
        {selectedType === "vitals" && (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Record Vitals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Systolic BP
                </label>
                <Input
                  type="number"
                  value={vitals.systolic}
                  onChange={(e) =>
                    setVitals({ ...vitals, systolic: e.target.value })
                  }
                  placeholder="120"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Diastolic BP
                </label>
                <Input
                  type="number"
                  value={vitals.diastolic}
                  onChange={(e) =>
                    setVitals({ ...vitals, diastolic: e.target.value })
                  }
                  placeholder="80"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Heart Rate (bpm)
                </label>
                <Input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) =>
                    setVitals({ ...vitals, heartRate: e.target.value })
                  }
                  placeholder="72"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Temperature (°F)
                </label>
                <Input
                  type="number"
                  value={vitals.temperature}
                  onChange={(e) =>
                    setVitals({ ...vitals, temperature: e.target.value })
                  }
                  placeholder="98.6"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Blood Glucose
                </label>
                <Input
                  type="number"
                  value={vitals.bloodGlucose}
                  onChange={(e) =>
                    setVitals({ ...vitals, bloodGlucose: e.target.value })
                  }
                  placeholder="100"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Oxygen (%)
                </label>
                <Input
                  type="number"
                  value={vitals.oxygen}
                  onChange={(e) =>
                    setVitals({ ...vitals, oxygen: e.target.value })
                  }
                  placeholder="98"
                  className="bg-white/50 border-white/50"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => setSelectedType(null)}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: "#535353" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
                  color: "white",
                }}
              >
                Save Vitals
              </Button>
            </div>
          </div>
        )}

        {/* Medication Form */}
        {selectedType === "medication" && (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Record Medications
            </h3>
            <div className="space-y-3 mb-6">
              {medications.map((med) => (
                <div key={med.id} className="finance-card p-4">
                  <div className="mb-3">
                    <p className="text-sm" style={{ color: "#535353" }}>
                      {med.name}
                    </p>
                    <p className="text-xs" style={{ color: "#848484" }}>
                      {med.dosage} • {med.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setMedStatus({ ...medStatus, [med.id]: "given" })
                      }
                      className="flex-1 py-2 rounded-lg text-sm"
                      style={{
                        background:
                          medStatus[med.id] === "given"
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)"
                            : "rgba(255, 255, 255, 0.5)",
                        color:
                          medStatus[med.id] === "given" ? "white" : "#535353",
                      }}
                    >
                      Given
                    </button>
                    <button
                      onClick={() =>
                        setMedStatus({ ...medStatus, [med.id]: "skipped" })
                      }
                      className="flex-1 py-2 rounded-lg text-sm"
                      style={{
                        background:
                          medStatus[med.id] === "skipped"
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)"
                            : "rgba(255, 255, 255, 0.5)",
                        color:
                          medStatus[med.id] === "skipped" ? "white" : "#535353",
                      }}
                    >
                      Skipped
                    </button>
                  </div>
                  {medStatus[med.id] === "skipped" && (
                    <Input
                      value={skipReason[med.id] || ""}
                      onChange={(e) =>
                        setSkipReason({
                          ...skipReason,
                          [med.id]: e.target.value,
                        })
                      }
                      placeholder="Reason for skipping"
                      className="mt-2 bg-white/50 border-white/50"
                      style={{ color: "#535353" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedType(null)}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: "#535353" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                  color: "white",
                }}
              >
                Save Medications
              </Button>
            </div>
          </div>
        )}

        {/* Activity Form */}
        {selectedType === "activity" && (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Record Activity
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Activity Type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.5)",
                    color: "#535353",
                  }}
                >
                  <option value="">Select activity</option>
                  <option value="exercise">Exercise</option>
                  <option value="meal">Meal</option>
                  <option value="hygiene">Personal Hygiene</option>
                  <option value="social">Social Activity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Notes
                </label>
                <Textarea
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  placeholder="Describe the activity..."
                  className="bg-white/50 border-white/50 min-h-24"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedType(null)}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: "#535353" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                  color: "white",
                }}
              >
                Save Activity
              </Button>
            </div>
          </div>
        )}

        {/* Incident Form */}
        {selectedType === "incident" && (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Report Incident
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Incident Type
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.5)",
                    color: "#535353",
                  }}
                >
                  <option value="">Select incident type</option>
                  <option value="fall">Fall</option>
                  <option value="emergency">Emergency</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.5)",
                    color: "#535353",
                  }}
                >
                  <option value="">Select severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Description
                </label>
                <Textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Describe what happened..."
                  className="bg-white/50 border-white/50 min-h-24"
                  style={{ color: "#535353" }}
                />
              </div>

              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "#848484" }}
                >
                  Action Taken
                </label>
                <Textarea
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="What action did you take?"
                  className="bg-white/50 border-white/50 min-h-24"
                  style={{ color: "#535353" }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedType(null)}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: "#535353" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)",
                  color: "white",
                }}
              >
                Report Incident
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
