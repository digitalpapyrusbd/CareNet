'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { apiCall } from '@/lib/api-client';

// Simple date formatting function to avoid external dependency
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'just now' : 'less than a minute';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return options?.addSuffix ? `${diffInMinutes} minutes ago` : `${diffInMinutes} minutes`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return options?.addSuffix ? `${diffInHours} hours ago` : `${diffInHours} hours`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return options?.addSuffix ? `${diffInDays} days ago` : `${diffInDays} days`;
  }
  
  return date.toLocaleDateString();
};

interface Notification {
  id: string;
  type: string;
  channel: string;
  title?: string;
  body: string;
  data?: any;
  status: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('type', filter);
      }
      
      const data = await apiCall(`/notifications?${params.toString()}`, {
        method: 'GET',
      });
      
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter((n: Notification) => !n.readAt).length);
      } else {
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ read: true }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id
              ? { ...notification, readAt: new Date().toISOString() }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setError(data.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError('An error occurred while marking notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const data = await apiCall('/notifications?markAsRead=true', {
        method: 'GET',
      });
      
      if (data.success) {
        setNotifications(prev =>
          prev.map(notification => ({
            ...notification,
            readAt: notification.readAt || new Date().toISOString()
          }))
        );
        setUnreadCount(0);
      } else {
        setError(data.error || 'Failed to mark all notifications as read');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while marking all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        const deletedNotification = notifications.find(n => n.id === id);
        if (deletedNotification && !deletedNotification.readAt) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        setError(data.error || 'Failed to delete notification');
      }
    } catch (err) {
      setError('An error occurred while deleting notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SMS':
        return '💬';
      case 'EMAIL':
        return '📧';
      case 'PUSH':
        return '🔔';
      case 'IN_APP':
        return '📱';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'EMAIL':
        return 'bg-green-100 text-green-800';
      case 'PUSH':
        return 'bg-purple-100 text-purple-800';
      case 'IN_APP':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'outline'}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter('SMS')}
            variant={filter === 'SMS' ? 'primary' : 'outline'}
          >
            SMS
          </Button>
          <Button
            onClick={() => setFilter('EMAIL')}
            variant={filter === 'EMAIL' ? 'primary' : 'outline'}
          >
            Email
          </Button>
          <Button
            onClick={() => setFilter('PUSH')}
            variant={filter === 'PUSH' ? 'primary' : 'outline'}
          >
            Push
          </Button>
          <Button
            onClick={() => setFilter('IN_APP')}
            variant={filter === 'IN_APP' ? 'primary' : 'outline'}
          >
            In-App
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No notifications found</div>
          <p className="text-gray-400 mt-2">
            {filter !== 'all' ? 'Try changing the filter' : 'You\'re all caught up!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-lg p-4 shadow-sm ${
                !notification.readAt ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title || 'Notification'}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {!notification.readAt && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.body}</p>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.readAt && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      variant="outline"
                      size="sm"
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}