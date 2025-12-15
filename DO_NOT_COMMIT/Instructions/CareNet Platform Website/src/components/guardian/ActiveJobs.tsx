import { Briefcase, Calendar, Clock, MapPin, User, DollarSign, Phone, MessageSquare } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface Job {
  id: number;
  patientName: string;
  caregiverName: string;
  packageName: string;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  status: "ongoing" | "upcoming" | "completed";
  totalCost: number;
  paid: number;
}

interface ActiveJobsProps {
  onNavigate: (page: string) => void;
}

export function ActiveJobs({ onNavigate }: ActiveJobsProps) {
  const jobs: Job[] = [
    {
      id: 1,
      patientName: "Mrs. Fatima Rahman",
      caregiverName: "Nurse Amina",
      packageName: "Post-Surgery Care (30 days)",
      startDate: "Nov 15, 2024",
      endDate: "Dec 15, 2024",
      schedule: "9:00 AM - 5:00 PM",
      location: "Gulshan 2, Dhaka",
      status: "ongoing",
      totalCost: 45000,
      paid: 45000,
    },
    {
      id: 2,
      patientName: "Mr. Abdul Karim",
      caregiverName: "Nurse Sultana",
      packageName: "Diabetes Management (60 days)",
      startDate: "Dec 1, 2024",
      endDate: "Jan 30, 2025",
      schedule: "10:00 AM - 4:00 PM",
      location: "Banani, Dhaka",
      status: "upcoming",
      totalCost: 60000,
      paid: 30000,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">Active Jobs</h1>
        <p className="text-sm text-muted-foreground">Track ongoing caregiving services</p>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display text-primary mb-1">1</div>
              <p className="text-xs text-muted-foreground">Ongoing</p>
            </div>
          </Card>
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display mb-1">1</div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-6 space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="modern-card p-5 border-0"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge className={job.status === "ongoing" ? "btn-neumorphic-primary text-xs px-3 py-1" : "btn-neumorphic text-xs px-3 py-1"}>
                {job.status}
              </Badge>
              <span className="text-sm text-muted-foreground">Job #{job.id}</span>
            </div>

            {/* Patient Info */}
            <div className="mb-4">
              <h3 className="mb-1">{job.patientName}</h3>
              <p className="text-sm text-muted-foreground">{job.packageName}</p>
            </div>

            {/* Caregiver */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-muted/30">
              <div className="w-10 h-10 rounded-full btn-neumorphic-primary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{job.caregiverName}</p>
                <p className="text-xs text-muted-foreground">Assigned Caregiver</p>
              </div>
              <button className="btn-icon-neumorphic w-9 h-9">
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium ml-auto">{job.startDate} - {job.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Schedule:</span>
                <span className="font-medium ml-auto">{job.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium ml-auto">{job.location}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-4 border-t border-border/50 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Cost:</span>
                <span className="number-display">৳{job.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Paid:</span>
                <span className="number-display text-primary">৳{job.paid.toLocaleString()}</span>
              </div>
              {job.totalCost > job.paid && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="number-display text-destructive">৳{(job.totalCost - job.paid).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-neumorphic text-sm py-2">
                View Details
              </button>
              <button className="btn-neumorphic text-sm py-2">
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
