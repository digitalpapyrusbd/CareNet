import { Plus, Package, Bell, User, MessageSquare, Heart, Calendar, FileText } from "lucide-react";
import { Button } from "../ui/button";

interface GuardianDashboardProps {
  userName: string;
  onAddPatient: () => void;
  onBrowsePackages: () => void;
  onNavigateToPatient: (patientId: string) => void;
  onNavigateToMessages: () => void;
  onNavigateToProfile: () => void;
}

export function GuardianDashboard({
  userName,
  onAddPatient,
  onBrowsePackages,
  onNavigateToPatient,
  onNavigateToMessages,
  onNavigateToProfile
}: GuardianDashboardProps) {
  const patients = [
    { id: "1", name: "Mrs. Fatima Ahmed", age: 72, condition: "Diabetes, Hypertension", careStatus: "Active", caregiver: "Rashida Begum", nextVisit: "Today, 2:00 PM" },
    { id: "2", name: "Mr. Abdul Rahman", age: 68, condition: "Post-stroke care", careStatus: "Active", caregiver: "Nasrin Akter", nextVisit: "Tomorrow, 10:00 AM" },
  ];

  const recentActivity = [
    { type: "vitals", patient: "Mrs. Fatima Ahmed", message: "Vitals logged - BP: 130/85, normal range", time: "2 hours ago", icon: Heart },
    { type: "medication", patient: "Mr. Abdul Rahman", message: "Morning medications administered", time: "3 hours ago", icon: FileText },
    { type: "appointment", patient: "Mrs. Fatima Ahmed", message: "Doctor appointment scheduled for Dec 10", time: "Yesterday", icon: Calendar },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Hello, {userName}</h1>
            <p style={{ color: '#848484' }}>Welcome back to CareNet</p>
          </div>
          <button
            onClick={onNavigateToMessages}
            className="relative"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ background: '#FF6B7A' }}>
              3
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={onAddPatient}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm" style={{ color: '#535353' }}>Add Patient</p>
          </button>

          <button
            onClick={onBrowsePackages}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm" style={{ color: '#535353' }}>Browse Packages</p>
          </button>
        </div>
      </div>

      {/* Patients List */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#535353' }}>My Patients</h2>
          <button className="text-sm" style={{ color: '#5B9FFF' }}>
            View All
          </button>
        </div>

        <div className="space-y-3">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onNavigateToPatient(patient.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{patient.name}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#7CE577', color: 'white' }}
                    >
                      {patient.careStatus}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>
                    Age {patient.age} • {patient.condition}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: '#535353' }}>
                      Caregiver: {patient.caregiver}
                    </span>
                    <span style={{ color: '#848484' }}>
                      {patient.nextVisit}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6">
        <h2 className="mb-4" style={{ color: '#535353' }}>Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="finance-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: activity.type === 'vitals' 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                      : activity.type === 'medication'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>
                    <strong>{activity.patient}</strong>
                  </p>
                  <p className="text-sm mb-2" style={{ color: '#535353' }}>
                    {activity.message}
                  </p>
                  <p className="text-xs" style={{ color: '#848484' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="flex items-center justify-around p-4">
          <button className="flex flex-col items-center gap-1">
            <Heart className="w-6 h-6" style={{ color: '#FFB3C1' }} />
            <span className="text-xs" style={{ color: '#FFB3C1' }}>Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Package className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Services</span>
          </button>
          <button className="flex flex-col items-center gap-1" onClick={onNavigateToMessages}>
            <MessageSquare className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1" onClick={onNavigateToProfile}>
            <User className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
