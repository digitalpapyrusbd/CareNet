"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ArrowLeft, User, Sparkles, Search, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UniversalNavProps {
  userRole?: string;
  showBack?: boolean;
  hideBottomNav?: boolean; // New prop to selectively hide bottom navigation
}

export function UniversalNav({
  userRole,
  showBack = true,
  hideBottomNav = false,
}: UniversalNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine dashboard path based on role
  const getDashboardPath = () => {
    switch (userRole) {
      case "guardian":
        return "/guardian/dashboard";
      case "caregiver":
        return "/caregiver/dashboard";
      case "agency":
        return "/agency/dashboard";
      case "agency-manager":
        return "/agency-manager/dashboard";
      case "patient":
        return "/patient/dashboard";
      case "shop":
        return "/shop/dashboard";
      case "shop-manager":
        return "/shop-manager/dashboard";
      case "moderator":
        return "/moderator/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Determine settings path based on role
  const getSettingsPath = () => {
    switch (userRole) {
      case "guardian":
        return "/guardian/settings";
      case "caregiver":
        return "/caregiver/settings";
      case "agency":
        return "/agency/settings";
      case "agency-manager":
        return "/agency-manager/settings";
      case "patient":
        return "/patient/settings";
      case "shop":
        return "/shop/settings";
      case "shop-manager":
        return "/shop-manager/settings";
      case "moderator":
        return "/moderator/settings";
      case "admin":
        return "/admin/settings";
      default:
        return "/settings";
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(getDashboardPath());
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const profileMenuItems = [
    { label: "Profile", path: getSettingsPath() },
    { label: "Settings", path: getSettingsPath() },
    { label: "Logout", action: () => router.push("/auth/login") },
  ];

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      action: () => router.push(getDashboardPath()),
    },
    ...(showBack
      ? [
          {
            id: "back",
            icon: ArrowLeft,
            label: "Back",
            action: handleBack,
          },
        ]
      : []),
    {
      id: "profile",
      icon: User,
      label: "Profile",
      action: () => setShowProfileMenu(!showProfileMenu),
    },
    {
      id: "assistant",
      icon: Sparkles,
      label: "Assistant",
      action: () => router.push("/assistant"),
    },
    {
      id: "search",
      icon: Search,
      label: "Search",
      action: () => setShowSearch(!showSearch),
    },
  ];

  return (
    <>
      {/* Header with logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-white/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo_only.png"
              alt="CareNet"
              className="h-8 md:h-9 lg:h-10 w-auto max-w-[80vw] object-contain"
            />
          </Link>
        </div>
      </header>
      {/* Bottom navigation (mobile-first, conditionally rendered based on hideBottomNav prop) */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-white/50 safe-area-inset-bottom">
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === getDashboardPath() && item.id === "home";
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center gap-1 transition-all min-h-[48px]"
                  style={{
                    color: isActive ? "#7CE577" : "#848484",
                  }}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-32 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 finance-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#535353" }}>Search</h3>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                style={{ color: "#848484" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/50 border-white/50 outline-none"
                style={{ color: "#535353" }}
                autoFocus
              />
              <Button
                onClick={handleSearch}
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                  color: "white",
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Menu Modal */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end pt-16 md:pt-20 pr-4 bg-black/20 backdrop-blur-sm">
          <div className="w-64 finance-card p-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#535353" }}>Menu</h3>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                style={{ color: "#848484" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {profileMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.path) {
                      router.push(item.path);
                    }
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 transition-all"
                  style={{ color: "#535353" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Spacer for fixed navigation when visible */}
      <div className="h-16" /> {/* Spacer for bottom nav */}
      <div className="h-16" /> {/* Spacer for header */}
    </>
  );
}
