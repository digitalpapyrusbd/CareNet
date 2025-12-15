import React from 'react';

interface FlowConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type: 'normal' | 'conditional' | 'data' | 'error' | 'cross-swimlane' | 'logging';
  label?: string;
  zoom: number;
}

export function FlowConnector({ from, to, type, label, zoom }: FlowConnectorProps) {
  const getLineStyle = () => {
    switch (type) {
      case 'conditional':
        return {
          stroke: '#E67E22',
          strokeDasharray: '5,5',
          strokeWidth: 2,
        };
      case 'data':
        return {
          stroke: '#3498DB',
          strokeDasharray: '2,2',
          strokeWidth: 2,
        };
      case 'error':
        return {
          stroke: '#E74C3C',
          strokeDasharray: '5,5',
          strokeWidth: 2,
        };
      case 'cross-swimlane':
        return {
          stroke: '#9B59B6',
          strokeWidth: 2,
        };
      case 'logging':
        return {
          stroke: '#6C757D',
          strokeDasharray: '2,2',
          strokeWidth: 1,
        };
      default:
        return {
          stroke: '#2C3E50',
          strokeWidth: 2,
        };
    }
  };

  const lineStyle = getLineStyle();

  // Calculate path - simple straight line for now
  // In production, you'd want curved paths or smart routing
  const startX = from.x + 90; // Approximate center of node
  const startY = from.y + 40;
  const endX = to.x + 90;
  const endY = to.y + 40;

  // Calculate midpoint for label
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Arrow marker
  const markerId = `arrow-${type}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          {/* Open arrow for cross-swimlane and data, filled for others */}
          {type === 'cross-swimlane' || type === 'data' ? (
            <path d="M0,0 L9,3 L0,6" fill="none" stroke={lineStyle.stroke} strokeWidth="1.5" />
          ) : (
            <path d="M0,0 L0,6 L9,3 z" fill={lineStyle.stroke} />
          )}
        </marker>
      </defs>

      {/* Line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        {...lineStyle}
        markerEnd={`url(#${markerId})`}
      />

      {/* Label */}
      {(label || type === 'logging') && (
        <g>
          <rect
            x={midX - 30}
            y={midY - 12}
            width="60"
            height="24"
            fill={type === 'logging' ? '#F8F9FA' : 'white'}
            stroke={type === 'logging' ? '#ADB5BD' : '#E5E7EB'}
            strokeWidth="1"
            rx="4"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize={type === 'logging' ? '10' : '11'}
            fill={type === 'logging' ? '#6C757D' : '#374151'}
            fontWeight={type === 'logging' ? 'bold' : 'normal'}
          >
            {type === 'logging' ? (label ? `LOG: ${label}` : 'LOG') : label}
          </text>
        </g>
      )}
    </svg>
  );
}
