"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Heart, Thermometer, Droplets, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function VitalsLogPage() {
  const router = useRouter();
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement vitals log submission API call
    // Example: await apiCall('/api/care-logs/vitals', { method: 'POST', body: vitalsData });
    router.back();
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div
        className="min-h-screen pb-24 p-6"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#535353" }}>
                  Log Vital Signs
                </h1>
                <p style={{ color: "#848484" }}>Record patient's vital signs</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blood Pressure */}
              <div>
                <label
                  className="mb-2 font-medium flex items-center gap-2"
                  style={{ color: "#535353" }}
                >
                  <Heart className="w-4 h-4" />
                  Blood Pressure (mmHg)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={bloodPressureSystolic}
                      onChange={(e) => setBloodPressureSystolic(e.target.value)}
                      placeholder="Systolic"
                      className="w-full p-3 rounded-lg border"
                      style={{
                        borderColor: "rgba(132, 132, 132, 0.2)",
                        color: "#535353",
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: "#848484" }}>
                      Systolic (top number)
                    </p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={bloodPressureDiastolic}
                      onChange={(e) =>
                        setBloodPressureDiastolic(e.target.value)
                      }
                      placeholder="Diastolic"
                      className="w-full p-3 rounded-lg border"
                      style={{
                        borderColor: "rgba(132, 132, 132, 0.2)",
                        color: "#535353",
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: "#848484" }}>
                      Diastolic (bottom number)
                    </p>
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div>
                <label
                  className="mb-2 font-medium flex items-center gap-2"
                  style={{ color: "#535353" }}
                >
                  <Activity className="w-4 h-4" />
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="e.g., 72"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              {/* Temperature */}
              <div>
                <label
                  className="mb-2 font-medium flex items-center gap-2"
                  style={{ color: "#535353" }}
                >
                  <Thermometer className="w-4 h-4" />
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g., 98.6"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              {/* Oxygen Saturation */}
              <div>
                <label
                  className="mb-2 font-medium flex items-center gap-2"
                  style={{ color: "#535353" }}
                >
                  <Droplets className="w-4 h-4" />
                  Oxygen Saturation (SpO2 %)
                </label>
                <input
                  type="number"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value)}
                  placeholder="e.g., 98"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              {/* Respiratory Rate */}
              <div>
                <label
                  className="mb-2 font-medium flex items-center gap-2"
                  style={{ color: "#535353" }}
                >
                  <Wind className="w-4 h-4" />
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  placeholder="e.g., 16"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              {/* Time */}
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: "#535353" }}
                >
                  Time Recorded *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: "#535353" }}
                >
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations or concerns..."
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                    minHeight: "100px",
                  }}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1"
                  style={{
                    color: "#535353",
                    borderColor: "rgba(132, 132, 132, 0.2)",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Log Vitals
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
