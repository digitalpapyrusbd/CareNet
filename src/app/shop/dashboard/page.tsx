"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  ShoppingCart,
  Package,
  Heart,
  TrendingUp,
  Clock,
  Filter,
  Star,
  ChevronRight,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

interface Product {
  id: string;
  name: string;
  category: "mobility" | "medical" | "nutrition" | "hygiene" | "monitoring";
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
}

interface ShopDashboardProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function ShopDashboardPage({
  onNavigate,
  onBack,
}: ShopDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartCount, setCartCount] = useState(3);
  const [activeTab, setActiveTab] = useState<"shop" | "cart" | "orders">("shop");
  const [showQuickActions, setShowQuickActions] = useState(false);

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "mobility", name: "Mobility Aids", icon: Package },
    { id: "medical", name: "Medical Supplies", icon: Heart },
    { id: "nutrition", name: "Nutrition & Supplements", icon: TrendingUp },
    { id: "hygiene", name: "Personal Care Items", icon: Filter },
    { id: "monitoring", name: "Health Monitoring", icon: Clock },
  ];

  const products: Product[] = [
    {
      id: "1",
      name: "Wheelchair Premium",
      category: "mobility",
      price: 45000,
      image: "",
      rating: 4.8,
      reviews: 234,
      inStock: true,
      description: "Heavy-duty electric wheelchair with ergonomic design",
    },
    {
      id: "2",
      name: "Blood Pressure Monitor",
      category: "medical",
      price: 12000,
      image: "",
      rating: 4.9,
      reviews: 156,
      inStock: true,
      description: "Digital BP monitor with large display and memory",
    },
    {
      id: "3",
      name: "Protein Powder (1kg)",
      category: "nutrition",
      price: 8500,
      image: "",
      rating: 4.7,
      reviews: 89,
      inStock: true,
      description: "High-quality whey protein for muscle building",
    },
    {
      id: "4",
      name: "Adult Diapers (Pack of 20)",
      category: "hygiene",
      price: 2800,
      image: "",
      rating: 4.6,
      reviews: 456,
      inStock: true,
      description: "Premium absorbent adult diapers for overnight protection",
    },
    {
      id: "5",
      name: "Oxygen Concentrator (5L)",
      category: "monitoring",
      price: 35000,
      image: "",
      rating: 4.8,
      reviews: 67,
      inStock: true,
      description: "Portable oxygen concentrator with adjustable flow",
    },
    {
      id: "6",
      name: "Disposable Gloves (Box of 100)",
      category: "medical",
      price: 1500,
      image: "",
      rating: 4.5,
      reviews: 345,
      inStock: true,
      description: "Medical-grade disposable nitrile gloves",
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (productId: string) => {
    console.log("Adding to cart:", productId);
    setCartCount((prev) => prev + 1);
    // Show brief animation or feedback
  };

  const handleViewCart = () => {
    setActiveTab("cart");
  };

  const handleViewOrders = () => {
    setActiveTab("orders");
  };

  const handleQuickBuy = (productId: string) => {
    console.log("Quick buy:", productId);
    setCartCount((prev) => prev + 1);
  };

  const handleBack = () => {
    onBack?.() || window.history.back();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={false} />
      <div className="min-h-screen pb-24" style={{ backgroundColor: "#F5F7FA" }}>
        {/* Header */}
        <div className="finance-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 style={{ color: "#535353" }}>
                Medical Shop
              </h1>
              <p style={{ color: "#848484" }}>
                Browse and purchase medical supplies
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.6)" }}>
                <Search className="w-5 h-5" style={{ color: "#848484" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="flex-1 outline-none bg-transparent"
                  style={{ color: "#535353", fontSize: "14px" }}
                />
              </div>

              {/* Cart Button */}
              <Button
                onClick={handleViewCart}
                className="relative"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#FF6B6B", color: "white" }}>
                    {cartCount}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", WebkitScrollbarWidth: "none" }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl flex-shrink-0 transition-all ${
                  selectedCategory === category.id ? "ring-2" : ""
                }`}
                style={{
                  background: selectedCategory === category.id
                    ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)"
                    : "rgba(255, 255, 255, 0.5)",
                  borderColor: selectedCategory === category.id ? "#FEB4C5" : "transparent",
                }}
              >
                <category.icon style={{ color: selectedCategory === category.id ? "white" : "#535353" }} />
                <span className="text-sm" style={{ color: selectedCategory === category.id ? "white" : "#535353" }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: "#848484" }}>
              Showing {filteredProducts.length} products
            </p>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              style={{ color: "#5B9FFF" }}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="finance-card p-5 transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => console.log("View product:", product.id)}
                >
                  {/* Product Image */}
                  <div
                    className="w-full h-48 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(254, 180, 197, 0.1)",
                      border: "1px dashed rgba(254, 180, 197, 0.2)",
                    }}
                  >
                    <ShoppingBag className="w-12 h-12" style={{ color: "#FEB4C5" }} />
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1" style={{ color: "#535353" }}>
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" style={{ fill: "#FFB54D", color: "#FFB54D" }} />
                        <span className="text-sm ml-1" style={{ color: "#FFB54D" }}>
                          {product.rating}
                        </span>
                        <span className="text-xs ml-1" style={{ color: "#848484" }}>
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleQuickBuy(product.id)}
                      className="px-3 py-1.5 rounded-lg"
                      style={{
                        background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)",
                        color: "white",
                        boxShadow: "0px 4px 18px rgba(124, 229, 119, 0.35)",
                      }}
                    >
                      Quick Buy
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold" style={{ color: "#FEB4C5" }}>
                      ৳{product.price.toLocaleString()}
                    </p>
                    {product.inStock ? (
                      <span className="px-2 py-1 rounded-full text-xs" style={{ background: "rgba(124, 229, 119, 0.2)", color: "#7CE577" }}>
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs" style={{ background: "rgba(255, 179, 193, 0.2)", color: "#FF6B6B" }}>
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-3" style={{ color: "#848484", lineHeight: "1.4" }}>
                    {product.description}
                  </p>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full"
                    style={{
                      background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                      color: "white",
                      boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      style={{
                        color: "#535353",
                        borderColor: "rgba(132, 132, 132, 0.2)",
                      }}
                    >
                      Save for Later
                    </Button>
                    <Button
                      className="flex-1"
                      style={{
                        background: "rgba(254, 180, 197, 0.1)",
                        color: "#535353",
                      }}
                    >
                      <Heart className="w-4 h-4 mr-2" style={{ color: "#FF6B6B" }} />
                      Wishlist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  boxShadow: "0px 4px 18px rgba(240, 161, 180, 0.35)",
                }}
              >
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="mb-2" style={{ color: "#535353" }}>
                No products found
              </h3>
              <p style={{ color: "#848484" }}>
                Try adjusting your search or category filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-6"
                style={{
                  background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)",
                  color: "white",
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: "#535353" }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleViewCart}
                className="p-4 finance-card hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)" }}>
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  View Cart ({cartCount} items)
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  ৳{(cartCount * 5000).toLocaleString()} estimated
                </p>
              </Button>

              <Button
                onClick={handleViewOrders}
                className="p-4 finance-card hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto" style={{ background: "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)" }}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Track Orders
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  View order history
                </p>
              </Button>

              <Button
                onClick={() => onNavigate?.("caregiver/account")}
                className="p-4 finance-card hover:shadow-lg transition-all"
              >
                <AlertTriangle className="w-6 h-6" style={{ color: "#FF6B6B" }} />
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Low Stock Alert
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  View items running low
                </p>
              </Button>

              <Button
                onClick={() => onNavigate?.("caregiver/emergency")}
                className="p-4 finance-card hover:shadow-lg transition-all"
              >
                <Heart className="w-6 h-6" style={{ color: "#FF6B6B" }} />
                <p className="text-sm font-medium" style={{ color: "#535353" }}>
                  Favorites
                </p>
                <p className="text-xs" style={{ color: "#848484" }}>
                  View saved items
                </p>
              </Button>
            </div>
          </div>
        </div>

        {/* Shop Info Banner */}
        <div className="px-6 pb-6">
          <div className="finance-card p-5" style={{ background: "rgba(254, 180, 197, 0.05)" }}>
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-6 h-6 shrink-0" style={{ color: "#FEB4C5" }} />
              <div className="flex-1">
                <h4 className="font-medium mb-1" style={{ color: "#535353" }}>
                  Medical Shop Information
                </h4>
                <p className="text-sm" style={{ color: "#848484" }}>
                  Browse a wide range of medical supplies, mobility aids, nutrition products, and personal care items. All products are vetted for quality and safety.
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#7CE577" }} />
                    <span className="text-sm" style={{ color: "#535353" }}>
                      Fast Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#7CE577" }} />
                    <span className="text-sm" style={{ color: "#535353" }}>
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: "#7CE577" }} />
                    <span className="text-sm" style={{ color: "#535353" }}>
                      Quality Assured
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
