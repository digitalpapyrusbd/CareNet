"use client";

import { useState, Fragment } from "react";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  Clock,
  Search,
  Filter,
  Check,
  Plus,
  FileText,
  Eye,
  MoreHorizontal,
  BarChart,
  DollarSign,
  Download,
  RefreshCw,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function ShopManagerDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "inventory" | "inquiries"
  >("dashboard");
  const [orderFilter, setOrderFilter] = useState<
    "all" | "pending" | "processing" | "completed"
  >("all");

  // Mock data
  const kpis = {
    totalOrders: 142,
    pendingOrders: 8,
    processingOrders: 5,
    completedOrders: 129,
    revenue: 5450000,
    products: 156,
    lowStockItems: 3,
    pendingInquiries: 2,
  };

  const recentOrders = [
    {
      id: "1",
      orderId: "ORD-2024-1215",
      customer: "Guardian - Mrs. Fatima Ahmed",
      items: ["Wheelchair Premium x1", "Blood Pressure Monitor"],
      amount: "৳45000",
      date: "December 28, 2024",
      time: "10:30 AM",
      status: "pending",
    },
    {
      id: "2",
      orderId: "ORD-2024-1214",
      customer: "Agency - SafeHands Care",
      items: ["Oxygen Concentrator (5L) x2", "Disposable Gloves (Box of 500)"],
      amount: "৳70000",
      date: "December 27, 2024",
      time: "2:15 PM",
      status: "processing",
    },
    {
      id: "3",
      orderId: "ORD-2024-1213",
      customer: "Patient - Mr. Abdul Rahman",
      items: ["Protein Powder (1kg)", "Adult Diapers (Pack of 20)"],
      amount: "৳9500",
      date: "December 26, 2024",
      time: "11:45 AM",
      status: "completed",
    },
  ];

  const inventoryItems = [
    {
      id: "1",
      name: "Wheelchair Premium",
      sku: "WH-001",
      stock: 45,
      price: 45000,
      category: "Mobility",
      status: "normal",
    },
    {
      id: "2",
      name: "Blood Pressure Monitor",
      sku: "BP-MON-001",
      stock: 12,
      price: 12000,
      category: "Medical",
      status: "low",
    },
    {
      id: "3",
      name: "Protein Powder (1kg)",
      sku: "PP-1KG-001",
      stock: 8,
      price: 8500,
      category: "Nutrition",
      status: "low",
    },
    {
      id: "4",
      name: "Oxygen Concentrator (5L)",
      sku: "OX-5L-001",
      stock: 3,
      price: 35000,
      category: "Medical",
      status: "critical",
    },
    {
      id: "5",
      name: "Disposable Gloves (Box of 100)",
      sku: "GL-100-001",
      stock: 0,
      category: "Medical",
      status: "out",
    },
    {
      id: "6",
      name: "Adult Diapers (Pack of 20)",
      sku: "AD-20-001",
      stock: 150,
      price: 2800,
      category: "Hygiene",
      status: "normal",
    },
  ];

  const customerInquiries = [
    {
      id: "1",
      customer: "Guardian - Mrs. Fatima Ahmed",
      question: "Do you offer bulk purchase discounts?",
      date: "December 28, 2024",
      status: "unanswered",
    },
    {
      id: "2",
      customer: "Agency - SafeHands Care",
      question: "When will the oxygen concentrator be back in stock?",
      date: "December 27, 2024",
      status: "pending",
    },
  ];

  const handleViewOrderDetails = (orderId: string) => {
    // TODO: Implement order details navigation
    alert(`View order details: ${orderId}`);
  };

  const _handleProcessOrder = (orderId: string) => {
    // TODO: Implement order processing
    alert(`Process order: ${orderId}`);
  };

  const handleAddProduct = () => {
    // TODO: Implement add product navigation
    alert("Add new product");
  };

  const handleViewInventory = () => {
    setActiveTab("inventory");
  };

  const handleViewOrders = () => {
    setActiveTab("orders");
  };

  const handleViewInquiries = () => {
    setActiveTab("inquiries");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const _handleBack = () => {
    // TODO: Implement back navigation
    window.history.back();
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FFB54D";
      case "processing":
        return "#8EC5FC";
      case "completed":
        return "#7CE577";
      case "cancelled":
        return "#FF6B6B";
      default:
        return "#848484";
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "#FF6B6B";
      case "low":
        return "#FFD54F";
      case "normal":
        return "#7CE577";
      case "out":
        return "#848484";
      default:
        return "#D1D5DB";
    }
  };

  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <div
        className="min-h-screen pb-24"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        {/* Header */}
        <div className="finance-card p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ color: "#535353", fontSize: "28px" }}>
                Shop Manager Dashboard
              </h1>
              <p style={{ color: "#848484" }}>
                Manage inventory, orders, and customer inquiries
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="hover:bg-white/30"
              style={{ color: "#535353" }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="finance-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)",
                    boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                  }}
                >
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Total Orders
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {kpis.totalOrders}
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
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Pending
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {kpis.pendingOrders}
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
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Completed
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {kpis.completedOrders}
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
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB54D 0%, #FFD54F 100%)",
                    boxShadow: "0px 4px 18px rgba(255, 181, 77, 0.35)",
                  }}
                >
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Products
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    {kpis.products}
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
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                    boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                  }}
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "#848484" }}>
                    Revenue
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "#535353" }}
                  >
                    ৳{(kpis.revenue / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="finance-card p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "dashboard" ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeTab === "dashboard"
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  borderColor:
                    activeTab === "dashboard" ? "#5B9FFF" : "transparent",
                }}
              >
                <BarChart
                  className="w-5 h-5 mr-2"
                  style={{
                    color: activeTab === "dashboard" ? "white" : "#535353",
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: activeTab === "dashboard" ? "white" : "#535353",
                  }}
                >
                  Dashboard
                </span>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "orders" ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeTab === "orders"
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  borderColor:
                    activeTab === "orders" ? "#5B9FFF" : "transparent",
                }}
              >
                <FileText
                  className="w-5 h-5 mr-2"
                  style={{
                    color: activeTab === "orders" ? "white" : "#535353",
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: activeTab === "orders" ? "white" : "#535353",
                  }}
                >
                  Orders
                </span>
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "inventory" ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeTab === "inventory"
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  borderColor:
                    activeTab === "inventory" ? "#5B9FFF" : "transparent",
                }}
              >
                <Package
                  className="w-5 h-5 mr-2"
                  style={{
                    color: activeTab === "inventory" ? "white" : "#535353",
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: activeTab === "inventory" ? "white" : "#535353",
                  }}
                >
                  Inventory
                </span>
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  activeTab === "inquiries" ? "ring-2" : ""
                }`}
                style={{
                  background:
                    activeTab === "inquiries"
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)"
                      : "rgba(255, 255, 255, 0.5)",
                  borderColor:
                    activeTab === "inquiries" ? "#5B9FFF" : "transparent",
                }}
              >
                <Eye
                  className="w-5 h-5 mr-2"
                  style={{
                    color: activeTab === "inquiries" ? "white" : "#535353",
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: activeTab === "inquiries" ? "white" : "#535353",
                  }}
                >
                  Inquiries
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 flex-1">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Quick Actions */}
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={handleAddProduct}
                    className="finance-card p-5 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                      style={{
                        background:
                          "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)",
                        boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                      }}
                    >
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <p
                      className="text-sm text-center"
                      style={{ color: "#535353" }}
                    >
                      Add Product
                    </p>
                  </button>
                  <button
                    onClick={handleViewOrders}
                    className="finance-card p-5 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                      style={{
                        background:
                          "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                        boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                      }}
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <p
                      className="text-sm text-center"
                      style={{ color: "#535353" }}
                    >
                      View Orders
                    </p>
                  </button>
                  <button
                    onClick={handleViewInventory}
                    className="finance-card p-5 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                      style={{
                        background:
                          "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                        boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                      }}
                    >
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <p
                      className="text-sm text-center"
                      style={{ color: "#535353" }}
                    >
                      Manage Inventory
                    </p>
                  </button>
                  <button
                    onClick={handleViewInquiries}
                    className="finance-card p-5 hover:shadow-lg transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
                      style={{
                        background:
                          "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB54D 0%, #FFD54F 100%)",
                        boxShadow: "0px 4px 18px rgba(255, 181, 77, 0.35)",
                      }}
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <p
                      className="text-sm text-center"
                      style={{ color: "#535353" }}
                    >
                      View Inquiries
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Fragment>
              {/* Search and Filter */}
              <div className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#848484" }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search orders by ID, customer..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border-white/60 outline-none"
                      style={{ color: "#535353" }}
                    />
                  </div>
                  <button
                    className="px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(91, 159, 255, 0.1)",
                      borderColor: "rgba(91, 159, 255, 0.2)",
                    }}
                  >
                    <Filter className="w-5 h-5" style={{ color: "#535353" }} />
                    Filter
                  </button>
                </div>
              </div>

              {/* Order Filter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderFilter === "all" ? "ring-2" : ""
                  }`}
                  style={{
                    background:
                      orderFilter === "all"
                        ? "#5B9FFF"
                        : "rgba(91, 159, 255, 0.1)",
                    borderColor:
                      orderFilter === "all" ? "#5B9FFF" : "transparent",
                    color: orderFilter === "all" ? "white" : "#535353",
                  }}
                >
                  All ({kpis.totalOrders})
                </button>
                <button
                  onClick={() => setOrderFilter("pending")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderFilter === "pending" ? "ring-2" : ""
                  }`}
                  style={{
                    background:
                      orderFilter === "pending"
                        ? "#FFB54D"
                        : "rgba(255, 255, 255, 0.1)",
                    borderColor:
                      orderFilter === "pending" ? "#FFB54D" : "transparent",
                    color: orderFilter === "pending" ? "white" : "#535353",
                  }}
                >
                  Pending ({kpis.pendingOrders})
                </button>
                <button
                  onClick={() => setOrderFilter("processing")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderFilter === "processing" ? "ring-2" : ""
                  }`}
                  style={{
                    background:
                      orderFilter === "processing"
                        ? "#8EC5FC"
                        : "rgba(255, 255, 255, 0.1)",
                    borderColor:
                      orderFilter === "processing" ? "#8EC5FC" : "transparent",
                    color: orderFilter === "processing" ? "white" : "#535353",
                  }}
                >
                  Processing ({kpis.processingOrders})
                </button>
                <button
                  onClick={() => setOrderFilter("completed")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderFilter === "completed" ? "ring-2" : ""
                  }`}
                  style={{
                    background:
                      orderFilter === "completed"
                        ? "#7CE577"
                        : "rgba(255, 255, 255, 0.1)",
                    borderColor:
                      orderFilter === "completed" ? "#7CE577" : "transparent",
                    color: orderFilter === "completed" ? "white" : "#535353",
                  }}
                >
                  Completed ({kpis.completedOrders})
                </button>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="finance-card p-5 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleViewOrderDetails(order.orderId)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background:
                              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                            boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                          }}
                        >
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: "#535353" }}
                          >
                            {order.customer}
                          </p>
                          <p className="text-xs" style={{ color: "#848484" }}>
                            Order #{order.orderId}
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: getOrderStatusColor(order.status),
                          color: "white",
                        }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs"
                            style={{
                              background: "rgba(254, 180, 197, 0.1)",
                              color: "#535353",
                              border: "1px solid rgba(254, 180, 197, 0.2)",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span
                            className="text-xs"
                            style={{ color: "#848484" }}
                          >
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p
                          className="text-xl font-bold"
                          style={{ color: "#FEB4C5" }}
                        >
                          ৳{order.amount}
                        </p>
                        <p className="text-xs" style={{ color: "#848484" }}>
                          {order.date} • {order.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="px-3 py-2"
                        style={{
                          color: "#535353",
                          borderColor: "rgba(254, 180, 197, 0.3)",
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        className="px-3 py-2"
                        style={{
                          background:
                            order.status === "pending"
                              ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)"
                              : order.status === "processing"
                                ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)"
                                : "rgba(132, 132, 132, 0.3)",
                          color: "white",
                          boxShadow:
                            order.status !== "completed"
                              ? "0px 4px 18px rgba(124, 229, 119, 0.35)"
                              : "none",
                        }}
                      >
                        {order.status === "pending" ? "Process" : "Complete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <>
              {/* Inventory Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: "#535353", fontSize: "20px" }}>
                  Inventory Management
                </h2>
                <Button
                  className="flex items-center gap-2"
                  style={{
                    background:
                      "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)",
                    color: "white",
                    boxShadow: "0px 4px 18px rgba(91, 159, 255, 0.35)",
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Low Stock Alert */}
              {kpis.lowStockItems > 0 && (
                <div
                  className="finance-card p-4 mb-4"
                  style={{
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className="w-5 h-5"
                      style={{ color: "#FF6B6B" }}
                    />
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#FF6B6B" }}
                      >
                        {kpis.lowStockItems} items are running low on stock
                      </p>
                      <Button
                        onClick={() => setActiveTab("orders")}
                        className="px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background:
                            "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)",
                          color: "white",
                        }}
                      >
                        View Orders
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inventoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="finance-card p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              background:
                                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #4A8FEF 100%)",
                              boxShadow:
                                "0px 4px 18px rgba(91, 159, 255, 0.35)",
                            }}
                          >
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className="text-base font-semibold mb-1"
                              style={{ color: "#535353" }}
                            >
                              {item.name}
                            </h3>
                            <p className="text-xs" style={{ color: "#848484" }}>
                              SKU: {item.sku}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: getStockStatusColor(item.status),
                        color: "white",
                      }}
                    >
                      {item.status.toUpperCase()}
                    </span>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm" style={{ color: "#848484" }}>
                          Category
                        </p>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            background: "rgba(254, 180, 197, 0.1)",
                            color: "#535353",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#848484" }}>
                        ৳{item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm" style={{ color: "#848484" }}>
                        Stock Level
                      </p>
                      <p
                        className="text-base font-semibold"
                        style={{ color: getStockStatusColor(item.status) }}
                      >
                        {item.stock}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 px-3 py-2 text-sm"
                        style={{
                          color: "#535353",
                          borderColor: "rgba(91, 159, 255, 0.2)",
                        }}
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        className="flex-1 px-3 py-2 text-sm"
                        style={{
                          background:
                            item.status === "critical"
                              ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B6B 0%, #FF4757 100%)"
                              : item.status === "low"
                                ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD54F 0%, #FFB74D 100%)"
                                : "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                          color: "white",
                        }}
                      >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        {item.status === "out" ? "Restock" : "Reorder"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <Fragment>
              {/* Inquiries Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ color: "#535353", fontSize: "20px" }}>
                  Customer Inquiries
                </h2>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: "#7CE577", color: "white" }}
                  >
                    {kpis.pendingInquiries} Pending
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: "#848484", color: "white" }}
                  >
                    {
                      customerInquiries.filter((c) => c.status === "answered")
                        .length
                    }{" "}
                    Answered
                  </span>
                </div>
              </div>

              {/* Inquiries List */}
              {customerInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="finance-card p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                          boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                        }}
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: "#535353" }}
                        >
                          {inquiry.customer}
                        </p>
                        <p className="text-xs" style={{ color: "#848484" }}>
                          {inquiry.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background:
                          inquiry.status === "answered"
                            ? "#7CE577"
                            : inquiry.status === "pending"
                              ? "#FFB54D"
                              : "#848484",
                        color: "white",
                      }}
                    >
                      {inquiry.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: "#535353" }}
                    >
                      Question:
                    </p>
                    <p
                      className="text-base"
                      style={{ color: "#848484", lineHeight: "1.6" }}
                    >
                      {inquiry.question}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // TODO: Implement inquiry reply
                        alert(`Reply to inquiry ${inquiry.id}`);
                      }}
                      className="flex-1 px-4 py-2"
                      style={{
                        background:
                          "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                        color: "white",
                        boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Mark inquiry as resolved
                        alert(`Marked inquiry ${inquiry.id} as resolved`);
                      }}
                      variant="outline"
                      className="flex-1 px-4 py-2"
                      style={{
                        color: "#535353",
                        borderColor: "rgba(132, 132, 132, 0.2)",
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              ))}
            </Fragment>
          )}
        </div>

        {/* Floating Quick Actions */}
        <div className="fixed bottom-24 right-6 z-40">
          <Button
            onClick={() => {
              // TODO: Implement quick buy functionality
              alert("Quick buy");
            }}
            className="rounded-full shadow-lg px-4"
            style={{
              background:
                "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
              color: "white",
              boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
            }}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
