"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Heart,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function CaregiverLandingPage() {
  const stats = [
    { value: "10,000+", label: "Verified Caregivers", icon: Shield },
    { value: "24/7", label: "Support Available", icon: Clock },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
    { value: "5000+", label: "Happy Families", icon: Users },
  ];

  const features = [
    {
      emoji: "🛡️",
      icon: Shield,
      title: "Verified Caregivers",
      description:
        "Background-checked, certified, and trusted professionals—screened through police verification, health checks, and psychological evaluation.",
    },
    {
      emoji: "🎧",
      icon: Clock,
      title: "24/7 Operational Support",
      description:
        "Always-on assistance to ensure uninterrupted care, fast issue resolution, and complete peace of mind.",
    },
    {
      emoji: "❤️",
      icon: Heart,
      title: "Quality Care Standards",
      description:
        "Compassionate, trained caregivers equipped to handle diverse care needs with consistency and dignity.",
    },
    {
      emoji: "🏢",
      icon: Users,
      title: "Vetted Agency Network",
      description:
        "Licensed, high-performing agencies with proven reliability and compliance standards.",
    },
    {
      emoji: "📍",
      icon: Clock,
      title: "Real-Time Care Tracking",
      description:
        "Full visibility into caregiver schedules and service delivery—bringing transparency and accountability.",
    },
    {
      emoji: "🧩",
      icon: Shield,
      title: "Single Integrated Platform",
      description:
        "Discover, book, manage, communicate, pay, and track—everything from one powerful dashboard.",
    },
  ];

  const handleRegister = () => {
    window.location.href = "/caregiver/registration";
  };

  const handleLogin = () => {
    window.location.href = "/auth/role-selection";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "#FFF5F7" }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(254, 180, 197, 0.05) 0%, rgba(254, 180, 197, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(254, 180, 197, 0.05) 0%, rgba(254, 180, 197, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(254, 180, 197, 0.05) 0%, rgba(254, 180, 197, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(254, 180, 197, 0.05) 0%, rgba(254, 180, 197, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(254, 180, 197, 0.05) 0%, rgba(254, 180, 197, 0.05) 0%, transparent 50%)`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <img
                  src="/logo-text.png"
                  alt="CareNet Logo"
                  className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[90vw] object-contain"
                />
              </div>
              <h1
                className="mb-4"
                style={{
                  color: "#535353",
                  fontSize: "48px",
                  fontWeight: "700",
                }}
              >
                CareNet
              </h1>
              <p
                className="mb-8"
                style={{ color: "#848484", fontSize: "20px" }}
              >
                Quality care, connected
              </p>
              <p
                className="mb-6"
                style={{ color: "#535353", fontSize: "16px" }}
              >
                Bangladesh's trusted platform for connecting families with
                verified caregivers and professional agencies
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRegister}
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
                  Register
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="px-8 h-12"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                    fontWeight: "500",
                    border: "none",
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="finance-card p-6 text-center transition-all hover:shadow-lg"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${index * 0.1}s`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: `radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)`,
                      boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                    }}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features-section"
        className="px-6 py-12"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="mb-8 md:mb-12 text-center text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: "#535353" }}
          >
            Why CareNet?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="finance-card p-6 md:p-8 transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{
                    animation: `fade-in-up 0.5s ease-out ${index * 0.15}s`,
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{
                        background: `radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)`,
                        boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                      }}
                    >
                      {feature.emoji}
                    </div>
                    <h3
                      className="text-lg md:text-xl font-semibold pt-2"
                      style={{ color: "#535353" }}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ color: "#848484" }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-12 pb-8" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="finance-card p-4 sm:p-6 md:p-8"
            style={{ background: "rgba(254, 180, 197, 0.02)" }}
          >
            <h2 className="mb-6 text-center" style={{ color: "#535353" }}>
              Need Help?
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Phone
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: "#FEB4C5" }}
                />
                <div className="flex-1 w-full sm:w-auto">
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    Hotline
                  </p>
                  <p
                    className="text-base sm:text-lg font-semibold break-words"
                    style={{ color: "#535353" }}
                  >
                    +880 1712-3456789
                  </p>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Available 24/7
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-12 px-4 sm:px-6"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                    fontWeight: "500",
                  }}
                >
                  <a
                    href="tel:+88017123456789"
                    className="flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Mail
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: "#FEB4C5" }}
                />
                <div className="flex-1 w-full sm:w-auto">
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    Email
                  </p>
                  <p
                    className="text-base sm:text-lg font-semibold break-words"
                    style={{ color: "#535353" }}
                  >
                    support@carenet.bd
                  </p>
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Response within 24 hours
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-12 px-4 sm:px-6"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                    fontWeight: "500",
                  }}
                >
                  <a
                    href="mailto:support@carenet.bd"
                    className="flex items-center justify-center"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-12 md:py-16"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            <Link href="/features">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                Features
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                Pricing
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                Contact
              </Button>
            </Link>
            <Link href="/privacy">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                Privacy
              </Button>
            </Link>
            <Link href="/terms">
              <Button
                variant="outline"
                className="w-full min-h-[48px] py-3 px-4 text-sm font-medium transition-all"
                style={{
                  color: "#535353",
                  borderColor: "rgba(254, 180, 197, 0.3)",
                  backgroundColor: "transparent",
                }}
                data-footer-button
              >
                Terms
              </Button>
            </Link>
          </div>

          {/* Copyright */}
          <div
            className="border-t pt-6"
            style={{ borderColor: "rgba(0, 0, 0, 0.08)" }}
          >
            <p
              className="text-center text-sm leading-relaxed"
              style={{ color: "#848484" }}
            >
              © 2024 CareNet Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0,
            transform: "translateY(20px)",
          }
          to {
            opacity: 1,
            transform: "translateY(0)",
          }
        }

        .finance-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .finance-card:hover:active {
          transform: translateY(0);
        }

        /* Footer button hover effects */
        [data-footer-button]:hover {
          border-color: #FEB4C5 !important;
          color: #FEB4C5 !important;
          background-color: rgba(254, 180, 197, 0.05) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
