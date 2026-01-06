"use client";

import { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Phone,
  FileText,
  User,
  Phone as PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface EmergencyContact {
  id: string;
  type: string;
  name: string;
  phone: string;
}

interface EmergencyProcedure {
  id: string;
  title: string;
  description: string;
  icon: "phone" | "user" | "file-text";
}

export default function EmergencyPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [callInProgress, setCallInProgress] = useState<string | null>(null);

  const emergencyContacts: EmergencyContact[] = [
    {
      id: "1",
      type: "Guardian",
      name: "Fahima Rahman",
      phone: "+880 1712-3456",
    },
    {
      id: "2",
      type: "Emergency Services",
      name: "Ambulance Service",
      phone: "999",
    },
    {
      id: "3",
      type: "Platform Support",
      name: "CareNet Support",
      phone: "+880 1800-1234",
    },
  ];

  const emergencyProcedures: EmergencyProcedure[] = [
    {
      id: "1",
      title: "1. Medical Emergency",
      description: "Call 999 immediately, then notify guardian",
      icon: "phone",
    },
    {
      id: "2",
      title: "2. Safety Concern",
      description: "Contact guardian and platform support",
      icon: "user",
    },
    {
      id: "3",
      title: "3. Behavioral Crisis",
      description: "Follow de-escalation training, contact guardian",
      icon: "file-text",
    },
    {
      id: "4",
      title: "4. Missing Patient",
      description: "Contact guardian immediately, then emergency services",
      icon: "phone",
    },
  ];

  const handleCall = async (contact: EmergencyContact, type: string) => {
    setIsCalling(true);
    setCallInProgress(type);

    // Simulate call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsCalling(false);
    setCallInProgress(null);

    // In real app, this would trigger actual call
    window.location.href = `tel:${contact.phone}`;
  };

  const handleQuickEmergencyCall = () => {
    window.location.href = "tel:999";
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="hover:bg-white/30"
            style={{ color: "#535353" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
              boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
            }}
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="mb-2 text-center" style={{ color: "#535353" }}>
          Emergency Protocols
        </h1>
        <p className="text-center" style={{ color: "#848484" }}>
          Quick access to emergency contacts and procedures
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-6">
        <div
          className="w-full h-2 rounded-full"
          style={{ backgroundColor: "rgba(132, 132, 132, 0.1)" }}
        >
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: "66.67%",
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
            }}
          />
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6" style={{ color: "#FF6B7A" }} />
            <h3 className="text-xl" style={{ color: "#535353" }}>
              Emergency Contacts
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: "#848484" }}>
            Tap to call immediately in case of emergency
          </p>

          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="finance-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(255, 107, 122, 0.2)",
                      }}
                    >
                      <User className="w-5 h-5" style={{ color: "#FF6B7A" }} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#535353" }}
                      >
                        {contact.name}
                      </p>
                      <p className="text-xs" style={{ color: "#848484" }}>
                        {contact.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCall(contact, contact.type)}
                    disabled={isCalling && callInProgress === contact.type}
                    className="p-2"
                    style={{
                      background:
                        isCalling && callInProgress === contact.type
                          ? "rgba(255, 255, 255, 0.3)"
                          : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
                      color: "white",
                      cursor: "pointer",
                      opacity:
                        isCalling && callInProgress === contact.type ? 0.6 : 1,
                    }}
                  >
                    <PhoneIcon className="w-5 h-5" />
                    {isCalling && callInProgress === contact.type
                      ? "Calling..."
                      : "Call"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Procedures Section */}
      <div className="px-6 mb-6">
        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6" style={{ color: "#FF6B7A" }} />
            <h3 className="text-xl" style={{ color: "#535353" }}>
              Emergency Procedures
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: "#848484" }}>
            Follow these steps for different types of emergencies
          </p>

          <div className="space-y-4">
            {emergencyProcedures.map((procedure) => (
              <div
                key={procedure.id}
                className="finance-card p-4"
                style={{
                  background: "rgba(255, 107, 122, 0.05)",
                  borderLeft: "4px solid rgba(255, 107, 122, 0.2)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(255, 107, 122, 0.2)",
                    }}
                  >
                    {procedure.icon === "phone" && (
                      <PhoneIcon
                        className="w-4 h-4"
                        style={{ color: "#FF6B7A" }}
                      />
                    )}
                    {procedure.icon === "user" && (
                      <User className="w-4 h-4" style={{ color: "#FF6B7A" }} />
                    )}
                    {procedure.icon === "file-text" && (
                      <FileText
                        className="w-4 h-4"
                        style={{ color: "#FF6B7A" }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-lg font-bold mb-1"
                      style={{ color: "#535353" }}
                    >
                      {procedure.title}
                    </p>
                    <p className="text-sm" style={{ color: "#848484" }}>
                      {procedure.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 mb-6">
        <div
          className="finance-card p-4"
          style={{
            background: "rgba(255, 213, 79, 0.1)",
            border: "1px solid rgba(255, 213, 79, 0.2)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255, 213, 79, 0.2)",
              }}
            >
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: "#535353" }}>
                Stay Calm & Act Quickly
              </p>
              <p className="text-sm" style={{ color: "#848484" }}>
                In case of emergency, contact nearest hospital or emergency
                services. Always keep your phone charged and accessible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Emergency Call Button */}
      <div className="px-6">
        <Button
          onClick={handleQuickEmergencyCall}
          className="w-full py-6"
          style={{
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)",
            color: "white",
            boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
          }}
        >
          <PhoneIcon className="w-5 h-5 mr-2" />
          Call Emergency Services (999)
        </Button>
      </div>
    </div>
  );
}
