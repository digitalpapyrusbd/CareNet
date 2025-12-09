import { ArrowLeft, MapPin, Star, Check, X, Heart, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface PackageDetailProps {
  packageId: string;
  onBack: () => void;
  onBookNow: () => void;
  onRequestQuote: () => void;
  onContactAgency: () => void;
}

export function PackageDetail({ packageId, onBack, onBookNow, onRequestQuote, onContactAgency }: PackageDetailProps) {
  const packageData = {
    name: "24/7 Senior Care - Basic",
    agency: "Green Care Agency",
    rating: 4.8,
    reviews: 124,
    location: "Dhanmondi, Dhaka",
    price: 35000,
    duration: "30 days",
    category: "Full-time Care",
    description: "Comprehensive 24/7 care package designed for seniors requiring continuous monitoring and support. Our experienced caregivers provide personalized attention while maintaining the dignity and comfort of your loved ones.",
    inclusions: [
      "24/7 Caregiver Presence",
      "Daily Vital Signs Monitoring",
      "Medication Management",
      "Meal Preparation & Assistance",
      "Mobility Support & Exercises",
      "Personal Hygiene Assistance",
      "Light Housekeeping",
      "Emergency Response"
    ],
    exclusions: [
      "Medical Procedures",
      "Advanced Nursing Care",
      "Transportation Costs",
      "Specialized Medical Equipment"
    ],
    pricingBreakdown: [
      { item: "Caregiver Service (30 days)", price: 30000 },
      { item: "Platform Fee", price: 3000 },
      { item: "Service Charge", price: 2000 }
    ],
    total: 35000
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Package Header */}
        <div className="finance-card p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1" style={{ color: '#535353' }}>{packageData.name}</h2>
              <p className="text-sm" style={{ color: '#848484' }}>{packageData.agency}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" style={{ color: '#FFD54F' }} />
                <span style={{ color: '#535353' }}>{packageData.rating}</span>
                <span className="text-sm" style={{ color: '#848484' }}>({packageData.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#848484' }}>
                <MapPin className="w-4 h-4" />
                <span>{packageData.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="finance-card p-6 mb-4">
          <h3 className="mb-3" style={{ color: '#535353' }}>Description</h3>
          <p style={{ color: '#535353' }}>{packageData.description}</p>
          <div className="flex gap-2 mt-4">
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(142, 197, 252, 0.3)', color: '#535353' }}
            >
              {packageData.category}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(168, 224, 99, 0.3)', color: '#535353' }}
            >
              {packageData.duration}
            </span>
          </div>
        </div>

        {/* Inclusions */}
        <div className="finance-card p-6 mb-4">
          <h3 className="mb-3" style={{ color: '#535353' }}>What's Included</h3>
          <div className="space-y-2">
            {packageData.inclusions.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#7CE577' }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span style={{ color: '#535353' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div className="finance-card p-6 mb-4">
          <h3 className="mb-3" style={{ color: '#535353' }}>Not Included</h3>
          <div className="space-y-2">
            {packageData.exclusions.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#FF6B7A' }}
                >
                  <X className="w-3 h-3 text-white" />
                </div>
                <span style={{ color: '#535353' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="finance-card p-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Pricing Breakdown</h3>
          <div className="space-y-3">
            {packageData.pricingBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span style={{ color: '#535353' }}>{item.item}</span>
                <span style={{ color: '#535353' }}>৳{item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span className="font-semibold" style={{ color: '#535353' }}>Total</span>
              <span className="font-semibold text-lg" style={{ color: '#535353' }}>৳{packageData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Agency Info */}
        <div className="finance-card p-6 mt-4">
          <h3 className="mb-3" style={{ color: '#535353' }}>About the Agency</h3>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <span className="text-white">{packageData.agency.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p style={{ color: '#535353' }}>{packageData.agency}</p>
              <p className="text-sm" style={{ color: '#848484' }}>Verified Agency • 5+ years</p>
            </div>
            <Button
              onClick={onContactAgency}
              variant="outline"
              size="sm"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Button
            onClick={onRequestQuote}
            variant="outline"
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            Request Custom Quote
          </Button>
          <Button
            onClick={onBookNow}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
