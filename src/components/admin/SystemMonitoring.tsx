import { Activity, Server, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

interface SystemMonitoringProps {
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: string;
    activeUsers: number;
    apiResponseTime: number;
    databaseStatus: 'connected' | 'slow' | 'disconnected';
    storageUsed: number;
    storageTotal: number;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    lastCheck: string;
  }>;
  recentErrors: Array<{
    id: string;
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  onRefresh: () => void;
}

export function SystemMonitoring({ systemHealth, services, recentErrors, onRefresh }: SystemMonitoringProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy':
      case 'running':
      case 'connected': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'warning':
      case 'slow': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'critical':
      case 'error':
      case 'stopped':
      case 'disconnected': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  const healthStyle = getStatusColor(systemHealth.status);
  const storagePercent = (systemHealth.storageUsed / systemHealth.storageTotal) * 100;

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>System Monitoring</h1>
          <Button onClick={onRefresh} size="sm" variant="outline" className="bg-white/50 border-white/50">
            Refresh
          </Button>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: healthStyle.bg }}>
              {systemHealth.status === 'healthy' ? (
                <CheckCircle className="w-8 h-8" style={{ color: healthStyle.text }} />
              ) : (
                <AlertTriangle className="w-8 h-8" style={{ color: healthStyle.text }} />
              )}
            </div>
            <div>
              <h2 className="capitalize" style={{ color: healthStyle.text }}>
                System {systemHealth.status}
              </h2>
              <p className="text-sm" style={{ color: '#848484' }}>Uptime: {systemHealth.uptime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <p className="text-xs mb-1" style={{ color: '#848484' }}>Active Users</p>
              <p className="text-xl" style={{ color: '#535353' }}>{systemHealth.activeUsers}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <p className="text-xs mb-1" style={{ color: '#848484' }}>API Response</p>
              <p className="text-xl" style={{ color: '#535353' }}>{systemHealth.apiResponseTime}ms</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Storage Usage</h3>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: '#535353' }}>
                {systemHealth.storageUsed}GB / {systemHealth.storageTotal}GB
              </span>
              <span style={{ color: '#535353' }}>{storagePercent.toFixed(1)}%</span>
            </div>
            <div className="h-3 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <div className="h-full rounded-full" style={{
                width: `${storagePercent}%`,
                background: storagePercent > 90 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                  : storagePercent > 75
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)'
                  : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }} />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Services Status</h3>
          <div className="space-y-3">
            {services.map((service) => {
              const serviceStyle = getStatusColor(service.status);
              return (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                    <div>
                      <p style={{ color: '#535353' }}>{service.name}</p>
                      <p className="text-xs" style={{ color: '#848484' }}>Last check: {service.lastCheck}</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full capitalize"
                    style={{ background: serviceStyle.bg, color: serviceStyle.text }}>
                    {service.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {recentErrors.length > 0 && (
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#FF6B7A' }}>Recent Errors</h3>
            <div className="space-y-2">
              {recentErrors.map((error) => (
                <div key={error.id} className="p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(255, 107, 122, 0.1)',
                    borderLeft: `4px solid ${error.severity === 'high' ? '#FF6B7A' : error.severity === 'medium' ? '#FFD180' : '#5B9FFF'}`
                  }}>
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{error.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: '#848484' }}>{error.timestamp}</p>
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ 
                        background: error.severity === 'high' ? 'rgba(255, 107, 122, 0.2)' : error.severity === 'medium' ? 'rgba(255, 209, 128, 0.2)' : 'rgba(142, 197, 252, 0.2)',
                        color: error.severity === 'high' ? '#FF6B7A' : error.severity === 'medium' ? '#FFD180' : '#5B9FFF'
                      }}>
                      {error.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

