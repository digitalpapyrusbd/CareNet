"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalNav } from "@/components/layout/UniversalNav";

export default function RateGuardianPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // TODO: Implement rating submission API call
    // Example: await apiCall('/api/ratings/guardian', { method: 'POST', body: { rating, feedback } });
    router.back();
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div
        className="min-h-screen pb-24 p-6"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="finance-card p-6">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#535353" }}
            >
              Rate Guardian
            </h1>
            <p className="mb-6" style={{ color: "#848484" }}>
              Share your experience working with this guardian
            </p>

            <div className="mb-6">
              <label
                className="block mb-3 font-medium"
                style={{ color: "#535353" }}
              >
                Overall Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className="w-10 h-10"
                      fill={
                        (hoveredRating || rating) >= star ? "#FFB54D" : "none"
                      }
                      stroke={
                        (hoveredRating || rating) >= star
                          ? "#FFB54D"
                          : "#848484"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block mb-3 font-medium"
                style={{ color: "#535353" }}
              >
                Additional Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about working with this guardian..."
                className="w-full p-4 rounded-lg border"
                style={{
                  borderColor: "rgba(132, 132, 132, 0.2)",
                  minHeight: "150px",
                  color: "#535353",
                }}
                rows={5}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
                style={{
                  color: "#535353",
                  borderColor: "rgba(132, 132, 132, 0.2)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex-1"
                style={{
                  background:
                    rating > 0
                      ? "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)"
                      : "rgba(132, 132, 132, 0.3)",
                  color: "white",
                  boxShadow:
                    rating > 0
                      ? "0px 4px 18px rgba(168, 224, 99, 0.35)"
                      : "none",
                }}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
