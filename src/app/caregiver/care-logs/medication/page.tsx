"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function MedicationLogPage() {
  const router = useRouter();
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement medication log submission API call
    // Example: await apiCall('/api/care-logs/medication', { method: 'POST', body: { medicationName, dosage, time, notes } });
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
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                  boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                }}
              >
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#535353" }}>
                  Log Medication
                </h1>
                <p style={{ color: "#848484" }}>
                  Record medication administration
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: "#535353" }}
                >
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Enter medication name"
                  required
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: "#535353" }}
                >
                  Dosage *
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 500mg, 2 tablets"
                  required
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: "#535353" }}
                >
                  Time Administered *
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
                  placeholder="Any observations or side effects..."
                  className="w-full p-3 rounded-lg border"
                  style={{
                    borderColor: "rgba(132, 132, 132, 0.2)",
                    color: "#535353",
                    minHeight: "100px",
                  }}
                  rows={4}
                />
              </div>

              <div
                className="p-4 rounded-lg flex items-start gap-3"
                style={{ background: "rgba(91, 159, 255, 0.1)" }}
              >
                <AlertCircle
                  className="w-5 h-5 mt-0.5"
                  style={{ color: "#5B9FFF" }}
                />
                <p className="text-sm" style={{ color: "#535353" }}>
                  Ensure all medication details are accurate before submitting.
                  This information will be part of the patient's care record.
                </p>
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
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Log Medication
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
