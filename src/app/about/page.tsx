"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Shield,
  Users,
  ArrowRight,
  ChevronRight,
  MapPin,
  ShoppingBag,
  Building2,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const ecosystemCards = [
    {
      emoji: "🧑‍🦽",
      title: "Patients & Families",
      description: "Find, book, track, and manage care in one place.",
    },
    {
      emoji: "👩‍⚕️",
      title: "Caregivers",
      description: "Get verified, receive work opportunities, and grow professionally.",
    },
    {
      emoji: "🏢",
      title: "Agencies",
      description: "Manage caregivers, services, and demand from one dashboard.",
    },
    {
      emoji: "🏪",
      title: "Shops & Service Providers",
      description: "Reach active care needs with trusted visibility.",
    },
  ];

  const trustFeatures = [
    {
      emoji: "🛡️",
      title: "Verified Network",
      description: "Caregivers and partners undergo background checks, health evaluations, and compliance reviews.",
    },
    {
      emoji: "📍",
      title: "Real-Time Tracking",
      description: "Stay informed with live care status and activity updates.",
    },
    {
      emoji: "🧩",
      title: "Single Integrated Platform",
      description: "Search, communicate, pay, and manage—without switching tools.",
    },
  ];

  const userTypes = [
    {
      id: "patients",
      title: "For Patients & Families",
      description: "Care without complexity. Trusted professionals, clear communication, and full visibility.",
    },
    {
      id: "caregivers",
      title: "For Caregivers",
      description: "Fair opportunities, professional recognition, and simple work management.",
    },
    {
      id: "agencies",
      title: "For Agencies",
      description: "Technology to scale operations, manage quality, and access demand.",
    },
    {
      id: "shops",
      title: "For Shops & Providers",
      description: "Direct access to care-related demand at the right moment.",
    },
  ];

  const coreValues = [
    { emoji: "❤️", title: "People First" },
    { emoji: "🛡️", title: "Trust by Design" },
    { emoji: "⭐", title: "Quality Without Compromise" },
    { emoji: "🤝", title: "Ecosystem Thinking" },
    { emoji: "🚀", title: "Care at Scale" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      {/* 1️⃣ Hero Block */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#FFF5F7" }}>
        <div className="relative z-10 px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h1 className="mb-4" style={{ color: "#535353", fontSize: "48px", fontWeight: "700" }}>
              CareNet
            </h1>
            <p className="mb-8" style={{ color: "#848484", fontSize: "20px" }}>
              Quality care, connected.
            </p>
            <p className="mb-8 max-w-2xl mx-auto" style={{ color: "#535353", fontSize: "16px" }}>
              A unified care platform connecting caregivers, agencies, service providers, shops, and patients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = "/features"}
                size="lg"
                className="px-8 h-12 min-h-[48px]"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                  fontWeight: "500",
                }}
              >
                Explore How It Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => window.location.href = "/auth/role-selection"}
                size="lg"
                variant="outline"
                className="px-8 h-12 min-h-[48px]"
                style={{
                  color: "#FEB4C5",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  fontWeight: "500",
                }}
              >
                Join CareNet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ What CareNet Is */}
      <section className="px-6 py-12 md:py-16" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-2xl md:text-3xl font-bold" style={{ color: "#535353" }}>
            One Platform for Every Care Need
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: "#848484" }}>
            CareNet brings together everyone involved in care—caregivers, agencies, service providers, shops, and patients—into one trusted ecosystem.
          </p>
          <p className="text-base md:text-lg font-semibold" style={{ color: "#535353" }}>
            No fragmentation. No guesswork. Just coordinated care.
          </p>
        </div>
      </section>

      {/* 3️⃣ How the CareNet Ecosystem Works */}
      <section className="px-6 py-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold text-center" style={{ color: "#535353" }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemCards.map((card, index) => (
              <div
                key={index}
                className="finance-card p-6"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.1}s`,
                }}
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#535353" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#848484" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm" style={{ color: "#848484" }}>
            ➡️ All connected through CareNet's secure platform.
          </p>
        </div>
      </section>

      {/* 4️⃣ What Makes CareNet Different */}
      <section className="px-6 py-12" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold text-center" style={{ color: "#535353" }}>
            Built on Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map((feature, index) => (
              <div
                key={index}
                className="finance-card p-6 text-center"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.15}s`,
                }}
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#535353" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#848484" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Value for Each User Type (Accordion) */}
      <section className="px-6 py-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold text-center" style={{ color: "#535353" }}>
            Built for Everyone in the Care Journey
          </h2>
          <div className="space-y-3">
            {userTypes.map((type) => (
              <div
                key={type.id}
                className="finance-card overflow-hidden"
                style={{
                  border: expandedSection === type.id ? "2px solid rgba(254, 180, 197, 0.5)" : "1px solid rgba(254, 180, 197, 0.2)",
                }}
              >
                <button
                  onClick={() => toggleSection(type.id)}
                  className="w-full flex items-center justify-between p-6 text-left min-h-[48px]"
                  style={{ color: "#535353" }}
                >
                  <span className="text-lg font-semibold">▶ {type.title}</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${expandedSection === type.id ? "rotate-90" : ""}`}
                    style={{ color: "#FEB4C5" }}
                  />
                </button>
                {expandedSection === type.id && (
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed" style={{ color: "#848484" }}>
                      {type.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ The CareNet Story */}
      <section className="px-6 py-12" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-6 text-2xl md:text-3xl font-bold text-center" style={{ color: "#535353" }}>
            Why CareNet Exists
          </h2>
          <div className="finance-card p-6 md:p-8">
            <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: "#848484" }}>
              CareNet was created to solve a simple problem: care should not be fragmented or hard to trust.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "#848484" }}>
              By unifying people, services, and essentials into one platform, we built a system where care works better—for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* 7️⃣ Impact Snapshot */}
      <section className="px-6 py-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="finance-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#535353" }}>
                10,000+
              </div>
              <div className="text-sm" style={{ color: "#848484" }}>
                Care professionals
              </div>
            </div>
            <div className="finance-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#535353" }}>
                25+
              </div>
              <div className="text-sm" style={{ color: "#848484" }}>
                Verified partners
              </div>
            </div>
            <div className="finance-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#535353" }}>
                98%
              </div>
              <div className="text-sm" style={{ color: "#848484" }}>
                Satisfaction rate
              </div>
            </div>
            <div className="finance-card p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: "#FEB4C5" }} />
              <div className="text-sm font-semibold" style={{ color: "#535353" }}>
                Award-Winning Platform
              </div>
              <div className="text-xs" style={{ color: "#848484" }}>
                2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Core Values */}
      <section className="px-6 py-12" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold text-center" style={{ color: "#535353" }}>
            What Guides Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="finance-card p-6 text-center"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.1}s`,
                }}
              >
                <div className="text-3xl mb-3">{value.emoji}</div>
                <div className="text-sm font-semibold" style={{ color: "#535353" }}>
                  {value.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9️⃣ Final CTA */}
      <section className="px-6 py-12 md:py-16" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-2xl md:text-3xl font-bold" style={{ color: "#535353" }}>
            Ready to Experience Connected Care?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/caregiver/registration"}
              size="lg"
              className="px-8 h-12"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                color: "white",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                fontWeight: "500",
              }}
            >
              Find Care
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => window.location.href = "/auth/role-selection"}
              size="lg"
              variant="outline"
              className="px-8 h-12"
              style={{
                color: "#FEB4C5",
                borderColor: "rgba(254, 180, 197, 0.3)",
                fontWeight: "500",
              }}
            >
              Join as a Partner
            </Button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .finance-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .finance-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
}
