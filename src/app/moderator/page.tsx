"use client";

import { UniversalNav } from "@/components/layout/UniversalNav";
import { useRouter } from "next/navigation";
import {
  Shield,
  AlertTriangle,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  Plus,
  CheckCircle,
} from "lucide-react";
import { TouchButton } from "@/components/layout/MobileFirstLayout";
import { MobileCard } from "@/components/layout/MobileFirstLayout";

export default function ModeratorPage() {
  const router = useRouter();
  const moderatorName = "Senior Moderator";
  const systemName = "CareNet System";

  const kpis = {
    totalReports: 24,
    pendingReviews: 8,
    resolvedCases: 156,
    complianceScore: 94,
  };

  const quickStats = [
    {
      label: "Reports",
      value: kpis.totalReports,
      icon: AlertTriangle,
      color: "#FF6B7A",
    },
    {
      label: "Pending",
      value: kpis.pendingReviews,
      icon: TrendingUp,
      color: "#FFD180",
    },
    {
      label: "Resolved",
      value: kpis.resolvedCases,
      icon: CheckCircle,
      color: "#7CE577",
    },
    {
      label: "Compliance",
      value: `${kpis.complianceScore}%`,
      icon: Shield,
      color: "#5B9FFF",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      action: "High-priority report reviewed and resolved",
      time: "10 min ago",
    },
    {
      id: "2",
      action: "User suspended for policy violation",
      time: "1 hour ago",
    },
    {
      id: "3",
      action: "Security alert triggered and investigated",
      time: "2 hours ago",
    },
    {
      id: "4",
      action: "Policy compliance audit completed",
      time: "3 hours ago",
    },
  ];

  const navigationItems = [
    {
      title: "Dashboard",
      description: "Overview and metrics",
      icon: BarChart3,
      color: "#7CE577",
      onClick: () => router.push("/moderator/dashboard"),
    },
    {
      title: "Content Moderation",
      description: "Review user reports",
      icon: Shield,
      color: "#5B9FFF",
      onClick: () => router.push("/moderator/content"),
    },
    {
      title: "Compliance Monitoring",
      description: "System compliance",
      icon: TrendingUp,
      color: "#FFD180",
      onClick: () => router.push("/moderator/compliance"),
    },
    {
      title: "User Management",
      description: "Manage user accounts",
      icon: Users,
      color: "#FF6B7A",
      onClick: () => router.push("/moderator/users"),
    },
    {
      title: "Audit Logs",
      description: "System activity logs",
      icon: FileText,
      color: "#8EC5FC",
      onClick: () => router.push("/moderator/audit"),
    },
    {
      title: "Policy Management",
      description: "System policies",
      icon: Settings,
      color: "#FFB74D",
      onClick: () => router.push("/moderator/policies"),
    },
  ];

  return (
    <>
      <UniversalNav userRole="moderator" showBack={true} />
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 style={{ color: "#535353" }} className="text-2xl font-bold">
              Moderator Console
            </h1>
            <p style={{ color: "#848484" }} className="text-sm">
              Welcome back, {moderatorName} • {systemName}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {quickStats.map((stat, index) => (
              <MobileCard key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "#848484" }}>
                      {stat.label}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "#535353" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${stat.color}20` }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {navigationItems.map((item, index) => (
              <TouchButton
                key={index}
                variant="ghost"
                size="md"
                onClick={item.onClick}
                className="h-24 text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${item.color}20` }}
                      >
                        <item.icon
                          className="w-5 h-5"
                          style={{ color: item.color }}
                        />
                      </div>
                      <div>
                        <h3
                          style={{ color: "#535353" }}
                          className="font-medium"
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm" style={{ color: "#848484" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${item.color}20` }}
                    >
                      <Plus className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                  </div>
                </div>
              </TouchButton>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                style={{ color: "#535353" }}
                className="text-lg font-semibold"
              >
                Recent Activity
              </h3>
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => router.push("/moderator/activity")}
              >
                View All
              </TouchButton>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <MobileCard key={activity.id}>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(142, 197, 252, 0.2)",
                        color: "#5B9FFF",
                      }}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p style={{ color: "#535353" }}>{activity.action}</p>
                      <p className="text-xs mt-1" style={{ color: "#848484" }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </MobileCard>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3
              style={{ color: "#535353" }}
              className="text-lg font-semibold mb-4"
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => {
                  // TODO: Implement emergency lockdown functionality
                  alert("Emergency lockdown initiated");
                }}
                className="h-20"
              >
                <AlertTriangle
                  className="w-6 h-6 mr-3"
                  style={{ color: "#FF6B7A" }}
                />
                <div className="text-left">
                  <div style={{ color: "#535353" }}>Emergency Lockdown</div>
                  <div className="text-sm" style={{ color: "#848484" }}>
                    System security
                  </div>
                </div>
              </TouchButton>

              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => {
                  // TODO: Implement bulk review functionality
                  alert("Bulk review started");
                }}
                className="h-20"
              >
                <Shield className="w-6 h-6 mr-3" style={{ color: "#7CE577" }} />
                <div className="text-left">
                  <div style={{ color: "#535353" }}>Bulk Review</div>
                  <div className="text-sm" style={{ color: "#848484" }}>
                    Process reports
                  </div>
                </div>
              </TouchButton>

              <TouchButton
                variant="ghost"
                size="md"
                onClick={() => {
                  // TODO: Implement compliance report generation
                  alert("Generating compliance report");
                }}
                className="h-20"
              >
                <BarChart3
                  className="w-6 h-6 mr-3"
                  style={{ color: "#5B9FFF" }}
                />
                <div className="text-left">
                  <div style={{ color: "#535353" }}>Compliance Report</div>
                  <div className="text-sm" style={{ color: "#848484" }}>
                    System audit
                  </div>
                </div>
              </TouchButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
