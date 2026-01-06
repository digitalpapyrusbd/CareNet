"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function ShopManagerAnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  // Render low stock alert conditionally
  const renderLowStockAlert = () => {
    if (stats.lowStockItems > 0) {
      return (
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6" style={{ color: "#FF6B6B" }} />
            <h3 style={{ color: "#535353" }}>
              Low Stock Alert ({stats.lowStockItems} items)
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: "#848484" }}>
            Consider restocking these items to avoid missing sales
          </p>
          <Button
            onClick={() => {
              // TODO: Navigate to inventory management
              alert("Opening inventory management...");
            }}
            className="w-full"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(255, 107, 122, 0.35)",
            }}
          >
            Manage Inventory
          </Button>
        </div>
      );
    }
    return null;
  };

  const stats = {
    totalSales: 284000,
    salesGrowth: 22.5,
    totalOrders: 142,
    ordersGrowth: 15.8,
    totalProducts: 56,
    lowStockItems: 8,
    totalCustomers: 89,
    avgOrderValue: 2000,
    topSellingCategory: "Medical Devices",
    revenueByCategory: [
      { name: "Medical Devices", value: 142000, percentage: 50 },
      { name: "Mobility Aids", value: 85200, percentage: 30 },
      { name: "Personal Care", value: 42600, percentage: 15 },
      { name: "Nutrition", value: 14200, percentage: 5 },
    ],
    monthlySales: [
      { month: "Oct", sales: 220000, orders: 110 },
      { month: "Nov", sales: 250000, orders: 125 },
      { month: "Dec", sales: 284000, orders: 142 },
    ],
    topProducts: [
      {
        name: "Blood Pressure Monitor",
        sales: 61600,
        units: 28,
        category: "Medical Devices",
      },
      {
        name: "Wheelchair - Standard",
        sales: 127500,
        units: 15,
        category: "Mobility Aids",
      },
      {
        name: "Oxygen Concentrator",
        sales: 60000,
        units: 12,
        category: "Medical Devices",
      },
      {
        name: "Adult Diapers (Pack)",
        sales: 25200,
        units: 90,
        category: "Personal Care",
      },
    ],
    customerInsights: {
      returningCustomers: 65,
      newCustomers: 24,
      avgCustomerValue: 3191,
      mostPopularTime: "10:00 AM - 2:00 PM",
    },
  };

  const handleExportReport = () => {
    // TODO: Implement analytics report export functionality
    // Example: Generate PDF/Excel report and trigger download
    alert("Exporting report...");
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2" style={{ color: "#535353" }}>
                Shop Analytics
              </h1>
              <p style={{ color: "#848484" }}>
                Track performance and optimize your shop operations
              </p>
            </div>
            <Button
              onClick={handleExportReport}
              className="flex items-center gap-2"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                color: "white",
                boxShadow: "0px 4px 18px rgba(168, 224, 99, 0.35)",
              }}
            >
              <TrendingUp className="w-4 h-4" />
              Export Report
            </Button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as "week" | "month" | "year")}
                className="px-4 py-2 rounded-lg capitalize text-sm"
                style={{
                  background:
                    period === p
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  color: period === p ? "white" : "#535353",
                  borderColor: period === p ? "#5B9FFF" : "transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="finance-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                  boxShadow: "0px 4px 18px rgba(168, 224, 99, 0.35)",
                }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Total Sales
                </p>
                <p className="text-2xl font-bold" style={{ color: "#535353" }}>
                  ৳{stats.totalSales.toLocaleString()}
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: stats.salesGrowth >= 0 ? "#7CE577" : "#FF6B6B",
                  }}
                >
                  {stats.salesGrowth >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stats.salesGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                  boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                }}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Total Orders
                </p>
                <p className="text-2xl font-bold" style={{ color: "#535353" }}>
                  {stats.totalOrders}
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: stats.ordersGrowth >= 0 ? "#7CE577" : "#FF6B6B",
                  }}
                >
                  {stats.ordersGrowth >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(stats.ordersGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Active Products
                </p>
                <p className="text-2xl font-bold" style={{ color: "#535353" }}>
                  {stats.totalProducts}
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: stats.lowStockItems > 5 ? "#FF6B6B" : "#7CE577",
                  }}
                >
                  {stats.lowStockItems} low stock
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)",
                  boxShadow: "0px 4px 18px rgba(184, 167, 255, 0.35)",
                }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Customers
                </p>
                <p className="text-2xl font-bold" style={{ color: "#535353" }}>
                  {stats.totalCustomers}
                </p>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Avg: ৳{stats.avgOrderValue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Performance */}
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Sales Performance
            </h3>
            <div className="space-y-4">
              {stats.monthlySales.map((month, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div>
                    <p className="font-medium" style={{ color: "#535353" }}>
                      {month.month}
                    </p>
                    <p className="text-sm" style={{ color: "#848484" }}>
                      {month.orders} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: "#535353" }}>
                      ৳{month.sales.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Revenue by Category
            </h3>
            <div className="space-y-4">
              {stats.revenueByCategory.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#535353" }}
                    >
                      {category.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#535353" }}
                    >
                      ৳{category.value.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="w-full h-3 rounded-full"
                    style={{ background: "rgba(255, 255, 255, 0.3)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        background:
                          index === 0
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)"
                            : index === 1
                              ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)"
                              : index === 2
                                ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#848484" }}>
                    {category.percentage}% of total revenue
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products and Customer Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Products */}
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background:
                          index === 0
                            ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)"
                            : index === 1
                              ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)"
                              : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                        color: "white",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium" style={{ color: "#535353" }}>
                        {product.name}
                      </p>
                      <p className="text-sm" style={{ color: "#848484" }}>
                        {product.category} • {product.units} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: "#535353" }}>
                      ৳{product.sales.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Customer Insights
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-lg"
                  style={{ background: "rgba(168, 224, 99, 0.1)" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    Returning Customers
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#535353" }}>
                    {stats.customerInsights.returningCustomers}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ background: "rgba(91, 159, 255, 0.1)" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#848484" }}>
                    New Customers
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#535353" }}>
                    {stats.customerInsights.newCustomers}
                  </p>
                </div>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ background: "rgba(254, 180, 197, 0.1)" }}
              >
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Average Customer Value
                </p>
                <p className="text-xl font-bold" style={{ color: "#535353" }}>
                  ৳{stats.customerInsights.avgCustomerValue.toLocaleString()}
                </p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ background: "rgba(184, 167, 255, 0.1)" }}
              >
                <p className="text-sm mb-1" style={{ color: "#848484" }}>
                  Peak Shopping Time
                </p>
                <p className="text-lg" style={{ color: "#535353" }}>
                  {stats.customerInsights.mostPopularTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderLowStockAlert()}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => {
              // TODO: Navigate to detailed sales reports
              alert("Opening detailed sales reports...");
            }}
            className="p-4 finance-card hover:shadow-lg transition-all"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)",
                boxShadow: "0px 4px 18px rgba(168, 224, 99, 0.35)",
              }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#535353" }}>
              Sales Reports
            </p>
          </Button>

          <Button
            onClick={() => {
              // TODO: Navigate to customer analytics
              alert("Opening customer analytics...");
            }}
            className="p-4 finance-card hover:shadow-lg transition-all"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)",
                boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
              }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#535353" }}>
              Customer Analytics
            </p>
          </Button>

          <Button
            onClick={() => {
              // TODO: Navigate to product performance
              alert("Opening product performance...");
            }}
            className="p-4 finance-card hover:shadow-lg transition-all"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
              }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#535353" }}>
              Product Performance
            </p>
          </Button>

          <Button
            onClick={() => {
              // TODO: Open sales targets configuration
              alert("Opening sales targets...");
            }}
            className="p-4 finance-card hover:shadow-lg transition-all"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background:
                  "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)",
                boxShadow: "0px 4px 18px rgba(184, 167, 255, 0.35)",
              }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium" style={{ color: "#535353" }}>
              Set Targets
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
