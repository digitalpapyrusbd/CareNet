import React from 'react';
import { Chart, ChartDataPoint } from './Chart';

// Stats Card Component
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  color?: string;
}

export function StatsCard({ title, value, change, icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-md ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              {change && (
                <div
                  className={`ml-2 flex items-baseline text-sm font-medium ${
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change.type === 'increase' ? (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="sr-only">{change.type === 'increase' ? 'Increased' : 'Decreased'}</span>
                  {change.value}%
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

// Activity Timeline Component
export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  icon?: React.ReactNode;
}

export interface ActivityTimelineProps {
  title: string;
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityTimeline({ title, activities, maxItems = 5 }: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: string) => {
    const iconClasses = {
      USER_REGISTRATION: 'text-blue-500 bg-blue-100',
      JOB_CREATED: 'text-green-500 bg-green-100',
      PAYMENT_RECEIVED: 'text-yellow-500 bg-yellow-100',
      DISPUTE_RAISED: 'text-red-500 bg-red-100',
      ASSIGNMENT_RECEIVED: 'text-purple-500 bg-purple-100',
      CARE_LOG: 'text-indigo-500 bg-indigo-100',
    };

    return (
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${iconClasses[type as keyof typeof iconClasses] || 'text-gray-500 bg-gray-100'}`}>
        {type === 'USER_REGISTRATION' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'JOB_CREATED' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'PAYMENT_RECEIVED' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582v1.698c-.155-.103-.346-.196-.567-.267-.364-.243-.433-.468-.433-.582 0-.114.07-.34.433-.582z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 00-1.51 1.31c.562.378 1.433.801 2.353 1.238V14a1 1 0 102 0v-2.107c.92-.437 1.791-.86 2.353-1.238a1 1 0 00-1.51-1.31c-.163.187-.452.377-.843.504V7.092c.622-.117 1.195-.342 1.676-.662C13.398 5.765 14 4.99 14 4c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 1.092V5z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'DISPUTE_RAISED' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'ASSIGNMENT_RECEIVED' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a2 2 0 100 4h2a2 2 0 100-4h2a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'CARE_LOG' && (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a2 2 0 100 4h2a2 2 0 100-4h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {displayActivities.map((activity) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    {activity.icon || getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {displayActivities.length === 0 && (
            <li>
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Progress Chart Component
export interface ProgressChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    total: number;
    color?: string;
  }>;
  showPercentage?: boolean;
}

export function ProgressChart({ title, data, showPercentage = true }: ProgressChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.label}</span>
              {showPercentage && (
                <span className="text-gray-500">
                  {Math.round((item.value / item.total) * 100)}%
                </span>
              )}
            </div>
            <div className="mt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{
                    width: `${(item.value / item.total) * 100}%`,
                    backgroundColor: item.color || '#3B82F6',
                  }}
                  className="h-full flex flex-col text-center text-white justify-center"
                />
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {item.value} of {item.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mini Chart Component for Dashboard Cards
export interface MiniChartProps {
  title: string;
  value: string | number;
  data: ChartDataPoint[];
  type: 'line' | 'bar';
  color?: string;
  height?: number;
}

export function MiniChart({ title, value, data, type = 'line', color = '#3B82F6', height = 60 }: MiniChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const renderMiniLineChart = () => {
    const points = data.map((point, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (point.value / maxValue) * 100,
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ');

    return (
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        {data.map((point, index) => (
          <circle
            key={index}
            cx={points[index].x}
            cy={points[index].y}
            r="2"
            fill={color}
          />
        ))}
      </svg>
    );
  };
  
  const renderMiniBarChart = () => {
    const barWidth = 100 / data.length;
    
    return (
      <div className="relative h-full flex items-end">
        {data.map((point, index) => (
          <div
            key={index}
            className="mx-px"
            style={{
              width: `${barWidth - 2}%`,
              height: `${(point.value / maxValue) * 100}%`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-baseline">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="ml-2 text-2xl font-semibold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      <div style={{ height: `${height}px` }}>
        {type === 'line' ? renderMiniLineChart() : renderMiniBarChart()}
      </div>
    </div>
  );
}