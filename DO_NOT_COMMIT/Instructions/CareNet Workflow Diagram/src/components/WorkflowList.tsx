import React from 'react';
import { ChevronDown, ChevronRight, Circle, Diamond, Hexagon, Square } from 'lucide-react';

interface WorkflowStep {
  id: string;
  label: string;
  type: 'start' | 'end' | 'action' | 'process' | 'decision' | 'external' | 'ai' | 'data';
  description?: string;
  swimlaneId: string;
  position: { x: number; y: number };
  connections?: Array<{
    to: string;
    label?: string;
    type?: 'normal' | 'conditional' | 'data' | 'error';
  }>;
}

interface WorkflowListProps {
  steps: WorkflowStep[];
  swimlaneName: string;
  swimlaneColor: string;
}

export function WorkflowList({ steps, swimlaneName, swimlaneColor }: WorkflowListProps) {
  const [expanded, setExpanded] = React.useState(true);

  const getIcon = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return <Circle className="w-4 h-4 fill-gray-400 text-gray-400" />;
      case 'decision':
        return <Diamond className="w-4 h-4 fill-yellow-400 text-orange-500" />;
      case 'ai':
        return <Hexagon className="w-4 h-4 fill-teal-200 text-teal-600" />;
      case 'external':
        return <Square className="w-4 h-4 fill-purple-200 text-purple-600" />;
      case 'action':
        return <Square className="w-4 h-4 fill-blue-200 text-blue-600" />;
      case 'process':
        return <Square className="w-4 h-4 fill-green-200 text-green-600" />;
      case 'data':
        return <Circle className="w-4 h-4 fill-gray-200 text-gray-600" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  if (steps.length === 0) return null;

  return (
    <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
      {/* Swimlane Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity"
        style={{ backgroundColor: swimlaneColor }}
      >
        <h3 className="text-gray-900">{swimlaneName}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{steps.length} steps</span>
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {/* Steps List */}
      {expanded && (
        <div className="bg-white">
          {steps.map((step, index) => (
            <div key={step.id} className="border-t border-gray-200">
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(step.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-gray-900">{step.label}</h4>
                        {step.description && (
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 px-2 py-1 bg-gray-100 rounded">
                        {step.type}
                      </span>
                    </div>

                    {/* Connections */}
                    {step.connections && step.connections.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {step.connections.map((conn, idx) => (
                          <div
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                              conn.type === 'error'
                                ? 'bg-red-100 text-red-700'
                                : conn.type === 'conditional'
                                ? 'bg-orange-100 text-orange-700'
                                : conn.type === 'data'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span>→</span>
                            {conn.label && <span>{conn.label}:</span>}
                            <span className="truncate max-w-[150px]">{conn.to}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
