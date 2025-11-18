import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data: ChartDataPoint[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function Chart({
  title,
  type = 'bar',
  data,
  height = 300,
  className = '',
  showLegend = true,
  showGrid = true,
}: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  const renderBarChart = () => {
    const barWidth = 100 / data.length;
    
    return (
      <div className="relative h-full">
        {data.map((point, index) => (
          <div
            key={index}
            className="absolute bottom-0 flex flex-col items-center"
            style={{
              left: `${index * barWidth}%`,
              width: `${barWidth - 2}%`,
              height: `${(point.value / maxValue) * 100}%`,
            }}
          >
            <div
              className="w-full h-full rounded-t"
              style={{ backgroundColor: point.color || '#3B82F6' }}
            />
            <span className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-left">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    const points = data.map((point, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (point.value / maxValue) * 100,
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {showGrid && (
            <g className="text-gray-200">
              <line x1="0" y1="0" x2="0" y2="100" />
              <line x1="0" y1="100" x2="100" y2="100" />
              {points.map((point, index) => (
                <line
                  key={index}
                  x1={point.x}
                  y1="0"
                  x2={point.x}
                  y2="100"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          {data.map((point, index) => (
            <circle
              key={index}
              cx={points[index].x}
              cy={points[index].y}
              r="3"
              fill="#3B82F6"
            />
          ))}
        </svg>
        {data.map((point, index) => (
          <div
            key={index}
            className="absolute text-xs text-gray-600"
            style={{
              left: `${points[index].x}%`,
              bottom: `${100 - points[index].y + 5}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {point.label}: {point.value}
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    let currentAngle = -90; // Start from top
    
    return (
      <div className="relative h-full flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 100 100">
          {data.map((point, index) => {
            const percentage = (point.value / totalValue) * 100;
            const angle = (percentage / 100) * 360;
            const endAngle = currentAngle + angle;
            
            const slice = (
              <g key={index}>
                <path
                  d={`M 50 50 L ${50 + 50 * Math.cos((currentAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((currentAngle * Math.PI) / 180)} A 50 50 0 ${Math.min(endAngle, currentAngle + 359)} ${50 + 50 * Math.cos((endAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                  fill={point.color || '#3B82F6'}
                />
                {percentage > 5 && (
                  <text
                    x={50 + 25 * Math.cos(((currentAngle + angle / 2) * Math.PI) / 180)}
                    y={50 + 25 * Math.sin(((currentAngle + angle / 2) * Math.PI) / 180)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-white font-medium"
                  >
                    {`${percentage.toFixed(1)}%`}
                  </text>
                )}
              </g>
            );
            
            currentAngle += angle;
            return slice;
          })}
          {/* Inner circle for donut effect */}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div className="ml-8 space-y-2">
            {data.map((point, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: point.color || '#3B82F6' }}
                />
                <span className="text-sm text-gray-700">{point.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAreaChart = () => {
    const points = data.map((point, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (point.value / maxValue) * 100,
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {showGrid && (
            <g className="text-gray-200">
              <line x1="0" y1="0" x2="0" y2="100" />
              <line x1="0" y1="100" x2="100" y2="100" />
              {points.map((point, index) => (
                <line
                  key={index}
                  x1={point.x}
                  y1="0"
                  x2={point.x}
                  y2="100"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}
          <path
            d={`${pathData} L 100,100 L 0,100 Z`}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          {data.map((point, index) => (
            <circle
              key={index}
              cx={points[index].x}
              cy={points[index].y}
              r="3"
              fill="#3B82F6"
            />
          ))}
        </svg>
        {data.map((point, index) => (
          <div
            key={index}
            className="absolute text-xs text-gray-600"
            style={{
              left: `${points[index].x}%`,
              bottom: `${100 - points[index].y + 5}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {point.label}: {point.value}
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'area':
        return renderAreaChart();
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
      {showLegend && type !== 'pie' && (
        <div className="mt-4 flex flex-wrap gap-4">
          {data.map((point, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: point.color || '#3B82F6' }}
              />
              <span className="text-sm text-gray-700">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}