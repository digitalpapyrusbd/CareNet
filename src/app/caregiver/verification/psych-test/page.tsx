"use client";

import { useState } from "react";
import { ArrowLeft, Brain, Clock, CheckCircle, AlertCircle, Info, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface PsychTestProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function CaregiverVerificationPsychTestPage({
  onNavigate,
  onBack,
}: PsychTestProps) {
  const [status, setStatus] = useState<"ready" | "in-progress" | "completed">("ready");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const questions = [
    "How do you handle patient aggression?",
    "What would you do if a patient refuses care?",
    "Describe a time you had to make a quick decision under pressure",
    "How do you ensure patient comfort during difficult procedures?",
    "How do you handle family members who are anxious about care?",
  ];

  const handleStartAssessment = () => {
    setStatus("in-progress");

    // Simulate assessment progress
    let questionIndex = 0;
    const interval = setInterval(() => {
      if (questionIndex < questions.length) {
        setCurrentQuestion(questionIndex);
        questionIndex++;
      } else {
        setStatus("completed");
        clearInterval(interval);
      }
    }, 3000);

    // Clean up after completion
    setTimeout(() => {
      setStatus("completed");
      clearInterval(interval);
      setCurrentQuestion(0);
    }, (questions.length + 1) * 3000 + 1000);
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  const handleComplete = () => {
    onNavigate?.("caregiver/pending-verification");
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

        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: "#535353" }}>
            Psychological Assessment
          </h1>
          <p style={{ color: "#848484" }}>
            {status === "completed"
              ? "Assessment Complete!"
              : "Evaluate Your Suitability"}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {status === "in-progress" && (
        <div className="px-6 mb-6">
          <div className="finance-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: "#848484" }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium" style={{ color: "#FEB4C5" }}>
                {Math.round(((currentQuestion) / questions.length) * 100)}%
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full"
              style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
            >
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                }}
              />
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: "#848484" }}>
              Please answer each question honestly
            </p>
          </div>
        </div>
      )}

      {/* About Assessment */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-start gap-3 mb-4">
            <FileCheck
              className="w-6 h-6 mt-0.5"
              style={{ color: "#FEB4C5" }}
            />
            <div>
              <h2 className="mb-2" style={{ color: "#535353" }}>
                About This Assessment
              </h2>
              <p className="text-sm" style={{ color: "#848484" }}>
                This online psychological assessment evaluates your emotional intelligence,
                stress management, and suitability for caregiving roles.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: "#FEB4C5" }} />
              <span className="text-sm" style={{ color: "#848484" }}>
                Duration: 15-20 minutes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: "#7CE577" }} />
              <span className="text-sm" style={{ color: "#848484" }}>
                25 scenario-based questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What We Assess */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <h2 className="mb-4" style={{ color: "#535353" }}>
            What We Assess
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(254, 180, 197, 0.2)",
                }}
              >
                <span className="text-lg">🎭</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Emotional Stability
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Ability to remain calm under pressure
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(254, 180, 197, 0.2)",
                }}
              >
                <span className="text-lg">❤️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Empathy & Compassion
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Understanding patient needs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(254, 180, 197, 0.2)",
                }}
              >
                <span className="text-lg">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Problem Solving
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Quick thinking in emergencies
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(254, 180, 197, 0.2)",
                }}
              >
                <span className="text-lg">🗣️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Communication Skills
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  Clear and effective interaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before You Start */}
      {status === "ready" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6"
            style={{ background: "rgba(254, 180, 197, 0.05)" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle
                className="w-6 h-6 mt-0.5"
                style={{ color: "#FEB4C5" }}
              />
              <div>
                <p className="font-medium mb-1" style={{ color: "#535353" }}>
                  Before You Start
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "#7CE577" }}
                />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Find a quiet, well-lit place
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "#7CE577" }}
                />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Answer honestly - there are no wrong answers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "#7CE577" }}
                />
                <span className="text-sm" style={{ color: "#535353" }}>
                  You cannot pause once started
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "#7CE577" }}
                />
                <span className="text-sm" style={{ color: "#535353" }}>
                  Results will be reviewed by a psychologist
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Complete Message */}
      {status === "completed" && (
        <div className="px-6 mb-6">
          <div
            className="finance-card p-6 text-center"
            style={{
              background: "rgba(168, 224, 99, 0.05)",
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle
                className="w-10 h-10"
                style={{ color: "#7CE577" }}
              />
            </div>
            <p className="text-lg font-medium mb-2" style={{ color: "#535353" }}>
              Assessment Complete!
            </p>
            <p className="text-sm mb-4" style={{ color: "#848484" }}>
              Your responses have been recorded. A psychologist will review
              your assessment and results will be available within 24-48 hours.
            </p>
            <div
              className="finance-card p-4 inline-block"
              style={{ background: "rgba(254, 180, 197, 0.05)" }}
            >
              <p className="text-sm" style={{ color: "#848484" }}>
                While you wait, you can continue with other verification steps
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      {status === "ready" && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleStartAssessment}
            className="w-full py-6"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            Start Assessment
          </Button>
        </div>
      )}

      {/* Complete Button */}
      {status === "completed" && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleComplete}
            className="w-full py-6"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
            }}
          >
            Continue to Verification
          </Button>
        </div>
      )}
    </div>
  );
}
