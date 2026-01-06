"use client";

import { useState } from "react";
import { ArrowLeft, Award, Upload, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

const SKILLS = [
  "Elderly Care",
  "Child Care",
  "Post-Surgery Care",
  "Dementia Care",
  "Mobility Assistance",
  "Medication Management",
  "Wound Care",
  "Vital Monitoring",
  "Feeding Assistance",
  "Personal Hygiene",
  "Companionship",
  "Physical Therapy Support",
];

const LANGUAGES = ["Bengali", "English", "Hindi", "Urdu"];

export default function CaregiverRegistrationStepFivePage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newCerts = Array.from(files).map((f) => f.name);
      setCertifications((prev) => [...prev, ...newCerts]);
    }
  };

  const handleContinue = () => {
    window.location.href = "/caregiver/registration/step-6";
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div
        className="min-h-screen flex flex-col p-6 pb-24"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-white/30"
            style={{ color: "#535353" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.4)",
              }}
            >
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: "#535353" }}>
              Skills & Experience
            </h1>
            <p style={{ color: "#848484" }}>
              Step 5 of 6: Professional Qualifications
            </p>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: "83.33%",
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-6">
          {/* Skills */}
          <div>
            <label className="block mb-3 text-sm" style={{ color: "#535353" }}>
              Select Your Skills * (Select at least 1)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`finance-card px-3 py-2 text-sm transition-all ${
                    selectedSkills.includes(skill) ? "ring-2" : ""
                  }`}
                  style={{
                    color: selectedSkills.includes(skill)
                      ? "#FEB4C5"
                      : "#535353",
                    borderColor: selectedSkills.includes(skill)
                      ? "#FEB4C5"
                      : "transparent",
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "#848484" }}>
              Selected: {selectedSkills.length} skills
            </p>
          </div>

          {/* Certifications Upload */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Upload Certifications (Optional)
            </label>
            <div className="relative">
              <div
                className="finance-card p-6 text-center cursor-pointer"
                style={{ background: "rgba(254, 180, 197, 0.1)" }}
              >
                <Upload
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "#FEB4C5" }}
                />
                <p className="text-sm" style={{ color: "#848484" }}>
                  Click to upload certificates (PDF, JPG, PNG)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleCertUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {certifications.length > 0 && (
              <div className="mt-2 space-y-1">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="finance-card px-3 py-2 flex items-center justify-between"
                  >
                    <p className="text-sm" style={{ color: "#535353" }}>
                      {cert}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Years of Experience *
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full finance-card px-4 py-3"
              style={{ color: "#535353", outline: "none" }}
            >
              <option value="">Select experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="block mb-3 text-sm" style={{ color: "#535353" }}>
              Languages Spoken *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`finance-card px-4 py-3 transition-all ${
                    selectedLanguages.includes(lang) ? "ring-2" : ""
                  }`}
                  style={{
                    color: selectedLanguages.includes(lang)
                      ? "#FEB4C5"
                      : "#535353",
                    borderColor: selectedLanguages.includes(lang)
                      ? "#FEB4C5"
                      : "transparent",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block mb-2 text-sm" style={{ color: "#535353" }}>
              Expected Hourly Rate (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Enter amount in BDT"
                className="w-full finance-card px-4 py-3 pl-12"
                style={{ color: "#535353", outline: "none" }}
              />
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "#848484" }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "#848484" }}>
              This helps agencies find suitable matches
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={
            selectedSkills.length === 0 ||
            !experience ||
            selectedLanguages.length === 0
          }
          className="w-full py-6 mt-6"
          style={{
            background:
              selectedSkills.length === 0 ||
              !experience ||
              selectedLanguages.length === 0
                ? "rgba(132, 132, 132, 0.3)"
                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
            color: "white",
            boxShadow:
              selectedSkills.length === 0 ||
              !experience ||
              selectedLanguages.length === 0
                ? "none"
                : "0px 4px 18px rgba(240, 161, 180, 0.4)",
            cursor:
              selectedSkills.length === 0 ||
              !experience ||
              selectedLanguages.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Continue to Availability
        </Button>
      </div>
    </>
  );
}
