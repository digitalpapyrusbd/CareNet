import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface Notification {
  id: number;
  type: "success" | "info" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

export function Notifications({ onNavigate }: NotificationsProps) {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "success",
      title: "Job Completed",
      message: "You've successfully completed the care session for Mrs. Rahman",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Job Assignment",
      message: "You have been assigned to care for Mr. Hossain starting tomorrow",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Payment Pending",
      message: "Payment of ৳1,200 is pending verification",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 4,
      type: "info",
      title: "Schedule Update",
      message: "Your schedule for Dec 5 has been updated",
      time: "Yesterday",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: "Payment Received",
      message: "৳1,500 has been added to your wallet",
      time: "2 days ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "alert":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-primary";
      case "warning":
        return "text-yellow-500";
      case "alert":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="mb-1">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
          </div>
          <button className="btn-neumorphic text-sm px-4 py-2">
            Mark all read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          <button className="btn-neumorphic-primary text-sm px-4 py-2 flex-1">
            All ({notifications.length})
          </button>
          <button className="btn-neumorphic text-sm px-4 py-2 flex-1">
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 space-y-2">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const iconColor = getIconColor(notification.type);

          return (
            <Card
              key={notification.id}
              className={`modern-card p-4 border-0 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all ${
                !notification.read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full btn-icon-neumorphic flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="mb-0">{notification.title}</h4>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  className="btn-icon-neumorphic w-8 h-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Clear All */}
      <div className="px-6 mt-6">
        <button className="btn-neumorphic text-sm py-3 w-full text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Notifications
        </button>
      </div>
    </div>
  );
}
