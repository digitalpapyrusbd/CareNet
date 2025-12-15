import { MapPin, Clock, CheckCircle, Camera, FileText, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface CheckInProps {
  onNavigate: (page: string) => void;
}

export function CheckIn({ onNavigate }: CheckInProps) {
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [notes, setNotes] = useState("");

  const jobDetails = {
    patientName: "Mrs. Rahman",
    packageName: "Post-Surgery Care",
    date: "Today",
    time: "9:00 AM - 5:00 PM",
    location: "House 45, Road 12, Gulshan 2, Dhaka",
    guardianName: "Mr. Kamal Rahman",
    guardianPhone: "+880 1712-345678",
  };

  const handleCheckIn = () => {
    setCheckInComplete(true);
    // In real app, this would send location, timestamp, and notes to backend
  };

  if (checkInComplete) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center px-6">
        <Card className="modern-card p-8 border-0 text-center">
          <div className="w-20 h-20 rounded-full btn-neumorphic-primary mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h2 className="mb-2">Check-In Successful!</h2>
          <p className="text-muted-foreground mb-6">
            You've successfully checked in for today's session
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-in Time:</span>
              <span className="font-medium">9:05 AM</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">Verified ✓</span>
            </div>
          </div>

          <button 
            className="btn-neumorphic-primary w-full py-3"
            onClick={() => onNavigate("caregiver-home")}
          >
            Continue
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">Check-In</h1>
        <p className="text-sm text-muted-foreground">Verify your arrival at the care location</p>
      </div>

      {/* Job Details */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <h3 className="mb-4">Job Details</h3>
          
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Patient</p>
              <p className="font-medium">{jobDetails.patientName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Service</p>
              <p className="font-medium">{jobDetails.packageName}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{jobDetails.time}</span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span>{jobDetails.location}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Guardian Contact</p>
            <p className="font-medium mb-0.5">{jobDetails.guardianName}</p>
            <p className="text-sm text-primary">{jobDetails.guardianPhone}</p>
          </div>
        </Card>
      </div>

      {/* Location Verification */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 btn-neumorphic-primary rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">Location Verification</h4>
              <p className="text-sm text-muted-foreground">
                We'll verify you're at the correct location
              </p>
            </div>
          </div>

          <button className="btn-neumorphic w-full py-3">
            <MapPin className="w-4 h-4 mr-2" />
            Verify Location
          </button>
        </Card>
      </div>

      {/* Optional Photo */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 btn-icon-neumorphic flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">Add Photo (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                Document your arrival
              </p>
            </div>
          </div>

          <button className="btn-neumorphic w-full py-3">
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </button>
        </Card>
      </div>

      {/* Notes */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <h4 className="mb-3">Check-In Notes</h4>
          <textarea
            className="w-full h-24 px-4 py-3 rounded-2xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Add any notes about your arrival..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>
      </div>

      {/* Important Notice */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-4 border-0 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">Important:</span> Your check-in time and location will be recorded and shared with the guardian.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Check-In Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-background via-background to-transparent pt-6">
        <button 
          className="btn-neumorphic-primary w-full py-4"
          onClick={handleCheckIn}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Complete Check-In
        </button>
      </div>
    </div>
  );
}
