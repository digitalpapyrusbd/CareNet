import { UserCog, Edit, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ModeratorProfileProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    joinedDate: string;
    tasksCompleted: number;
    avgResponseTime: string;
    specializations: string[];
    performance: {
      thisMonth: number;
      lastMonth: number;
    };
  };
  onEdit: () => void;
}

export function ModeratorProfile({ profile, onEdit }: ModeratorProfileProps) {
  const performanceChange = profile.performance.thisMonth - profile.performance.lastMonth;

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>My Profile</h1>
          <Button onClick={onEdit} size="sm" style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white'
          }}>
            <Edit className="w-4 h-4 mr-2" />Edit
          </Button>
        </div>

        <div className="finance-card p-6 mb-6 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
            <UserCog className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-2" style={{ color: '#535353' }}>{profile.name}</h2>
          <p className="text-sm mb-4" style={{ color: '#848484' }}>Moderator since {profile.joinedDate}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="finance-card p-3">
              <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.tasksCompleted}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Tasks Completed</p>
            </div>
            <div className="finance-card p-3">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.avgResponseTime}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Avg Response</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Email:</span>
              <span style={{ color: '#535353' }}>{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Phone:</span>
              <span style={{ color: '#535353' }}>{profile.phone}</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Performance</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
              <p className="text-2xl mb-1" style={{ color: '#5B9FFF' }}>{profile.performance.thisMonth}</p>
              <p className="text-xs" style={{ color: '#848484' }}>This Month</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{profile.performance.lastMonth}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Last Month</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: performanceChange >= 0 ? '#7CE577' : '#FF6B7A' }} />
            <span style={{ color: performanceChange >= 0 ? '#7CE577' : '#FF6B7A' }}>
              {performanceChange >= 0 ? '+' : ''}{performanceChange} tasks vs last month
            </span>
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(184, 167, 255, 0.2)', color: '#8B7AE8' }}>
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

