import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface WorkflowStep {
  id: string;
  label: string;
  type: 'start' | 'end' | 'action' | 'process' | 'decision' | 'external' | 'ai' | 'data' | 'notification' | 'error' | 'log';
  description?: string;
  position: { x: number; y: number };
}

interface WorkflowNodeProps {
  step: WorkflowStep;
  isHighlighted: boolean;
}

export function WorkflowNode({ step, isHighlighted }: WorkflowNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getNodeStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${step.position.x}px`,
      top: `${step.position.y}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isHighlighted ? '0 0 0 3px #FCD34D' : '0 2px 4px rgba(0,0,0,0.1)',
    };

    switch (step.type) {
      case 'start':
      case 'end':
        return {
          ...baseStyle,
          width: '120px',
          height: '50px',
          backgroundColor: '#95A5A6',
          color: 'white',
          borderRadius: '25px',
        };
      case 'action':
        return {
          ...baseStyle,
          width: '180px',
          minHeight: '80px',
          backgroundColor: '#AED6F1',
          border: '2px solid #3498DB',
          borderRadius: '8px',
          color: '#1F2937',
        };
      case 'process':
        return {
          ...baseStyle,
          width: '180px',
          minHeight: '80px',
          backgroundColor: '#ABEBC6',
          border: '2px solid #27AE60',
          borderRadius: '8px',
          color: '#1F2937',
        };
      case 'decision':
        return {
          ...baseStyle,
          width: '120px',
          height: '120px',
          backgroundColor: '#F9E79F',
          border: '2px solid #F39C12',
          transform: 'rotate(45deg)',
          color: '#1F2937',
        };
      case 'external':
        return {
          ...baseStyle,
          width: '180px',
          minHeight: '80px',
          backgroundColor: '#D7BDE2',
          border: '4px double #8E44AD',
          borderRadius: '8px',
          color: '#1F2937',
        };
      case 'ai':
        return {
          ...baseStyle,
          width: '140px',
          height: '100px',
          backgroundColor: '#D1F2EB',
          border: '2px solid #1ABC9C',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          color: '#1F2937',
        };
      case 'data':
        return {
          ...baseStyle,
          width: '100px',
          height: '120px',
          backgroundColor: '#F4F6F6',
          border: '2px solid #7F8C8D',
          borderRadius: '50px / 20px',
          color: '#1F2937',
        };
      case 'notification':
        return {
          ...baseStyle,
          width: '160px',
          minHeight: '60px',
          backgroundColor: '#FEF9E7',
          border: '2px solid #F1C40F',
          borderRadius: '12px',
          color: '#1F2937',
        };
      case 'error':
        return {
          ...baseStyle,
          width: '160px',
          minHeight: '60px',
          backgroundColor: '#FADBD8',
          border: '2px solid #E74C3C',
          borderRadius: '8px',
          color: '#1F2937',
        };
      case 'log':
        return {
          ...baseStyle,
          width: '80px',
          height: '40px',
          backgroundColor: '#F8F9FA',
          border: '1px solid #ADB5BD',
          borderRadius: '4px',
          color: '#6C757D',
          fontSize: '10px',
        };
      default:
        return baseStyle;
    }
  };

  const nodeStyle = getNodeStyle();

  return (
    <div
      style={nodeStyle}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="group hover:shadow-lg"
    >
      <div style={step.type === 'decision' ? { transform: 'rotate(-45deg)' } : {}}>
        <div className="text-sm">{step.label}</div>
        {step.description && (
          <Info className="w-4 h-4 mt-1 mx-auto text-gray-500" />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && step.description && (
        <div
          className="absolute z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            whiteSpace: 'normal',
          }}
        >
          {step.description}
          <div
            className="absolute"
            style={{
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #111827',
            }}
          />
        </div>
      )}
    </div>
  );
}
