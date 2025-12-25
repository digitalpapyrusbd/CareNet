import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsCenter({ notifications, onMarkAsRead, onDelete, onClearAll }: NotificationsCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'success': return '#7CE577';
      case 'warning': return '#FFD180';
      case 'error': return '#FF6B7A';
      default: return '#5B9FFF';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Notifications</h1>
          <Button onClick={onClearAll} size="sm" variant="outline" className="bg-white/50 border-white/50">
            Clear All
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'unread'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {notifications.filter(n => filter === 'all' || !n.read).map((notif) => (
            <div key={notif.id} className="finance-card p-4"
              style={{ borderLeft: `4px solid ${getTypeColor(notif.type)}`, opacity: notif.read ? 0.7 : 1 }}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{notif.title}</h3>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>{notif.message}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{notif.time}</p>
                </div>
                <div className="flex gap-2">
                  {!notif.read && (
                    <button onClick={() => onMarkAsRead(notif.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(124, 229, 119, 0.2)' }}>
                      <Check className="w-4 h-4" style={{ color: '#7CE577' }} />
                    </button>
                  )}
                  <button onClick={() => onDelete(notif.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255, 107, 122, 0.2)' }}>
                    <Trash2 className="w-4 h-4" style={{ color: '#FF6B7A' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

