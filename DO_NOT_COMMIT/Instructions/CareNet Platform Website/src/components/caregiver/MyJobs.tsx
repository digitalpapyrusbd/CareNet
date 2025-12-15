import { Briefcase, Calendar, Clock, MapPin, User, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface Job {
  id: number;
  patientName: string;
  guardianName: string;
  packageName: string;
  date: string;
  time: string;
  location: string;
  status: "active" | "upcoming" | "completed";
  checkInTime?: string;
  checkOutTime?: string;
  earnings: number;
}

interface MyJobsProps {
  onNavigate: (page: string) => void;
}

export function MyJobs({ onNavigate }: MyJobsProps) {
  const jobs: Job[] = [
    {
      id: 1,
      patientName: "Mrs. Rahman",
      guardianName: "Mr. Kamal",
      packageName: "Post-Surgery Care",
      date: "Today",
      time: "9:00 AM - 5:00 PM",
      location: "Gulshan 2, Dhaka",
      status: "active",
      checkInTime: "9:05 AM",
      earnings: 1500,
    },
    {
      id: 2,
      patientName: "Mr. Hossain",
      guardianName: "Mrs. Sultana",
      packageName: "Diabetes Management",
      date: "Tomorrow",
      time: "10:00 AM - 4:00 PM",
      location: "Banani, Dhaka",
      status: "upcoming",
      earnings: 1200,
    },
    {
      id: 3,
      patientName: "Mrs. Khan",
      guardianName: "Dr. Ahmed",
      packageName: "Elderly Care",
      date: "Dec 2",
      time: "8:00 AM - 6:00 PM",
      location: "Dhanmondi, Dhaka",
      status: "completed",
      checkInTime: "8:00 AM",
      checkOutTime: "6:00 PM",
      earnings: 2000,
    },
  ];

  const activeJobs = jobs.filter(j => j.status === "active");
  const upcomingJobs = jobs.filter(j => j.status === "upcoming");
  const completedJobs = jobs.filter(j => j.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">My Jobs</h1>
        <p className="text-sm text-muted-foreground">Manage your caregiving assignments</p>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display text-primary mb-1">{activeJobs.length}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </Card>
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display mb-1">{upcomingJobs.length}</div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </Card>
          <Card className="modern-card p-4 border-0">
            <div className="text-center">
              <div className="text-2xl number-display mb-1">{completedJobs.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="mb-3">Active Now</h3>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <Card key={job.id} className="modern-card p-5 border-0">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="btn-neumorphic-primary text-xs px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">{job.date}</span>
                </div>

                <h4 className="mb-1">{job.patientName}</h4>
                <p className="text-sm text-muted-foreground mb-3">{job.packageName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {job.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </div>
                  {job.checkInTime && (
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <CheckCircle className="w-3 h-3" />
                      Checked in at {job.checkInTime}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="btn-neumorphic-primary text-sm py-2">
                    Check Out
                  </button>
                  <button className="btn-neumorphic text-sm py-2">
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Jobs */}
      {upcomingJobs.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <Card key={job.id} className="modern-card p-5 border-0">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="btn-neumorphic text-xs px-3 py-1">
                    {job.date}
                  </Badge>
                  <span className="text-sm number-display">৳{job.earnings}</span>
                </div>

                <h4 className="mb-1">{job.patientName}</h4>
                <p className="text-sm text-muted-foreground mb-3">{job.packageName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {job.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </div>
                </div>

                <button className="btn-neumorphic text-sm py-2 w-full">
                  View Details
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="mb-3">Completed</h3>
          <div className="space-y-3">
            {completedJobs.map((job) => (
              <Card key={job.id} className="modern-card p-4 border-0 opacity-75">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="mb-0">{job.patientName}</h4>
                  <span className="text-sm number-display text-primary">৳{job.earnings}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.packageName}</p>
                <p className="text-xs text-muted-foreground">{job.date} • {job.checkInTime} - {job.checkOutTime}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
