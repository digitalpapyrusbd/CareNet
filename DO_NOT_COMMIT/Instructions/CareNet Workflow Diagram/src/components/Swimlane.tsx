import React from 'react';
import { WorkflowNode } from './WorkflowNode';
import { FlowConnector } from './FlowConnector';
import { workflows } from '../data/workflowData';

interface SwimlaneData {
  id: string;
  label: string;
  color: string;
  emoji?: string;
}

interface WorkflowStep {
  id: string;
  label: string;
  type: 'start' | 'end' | 'action' | 'process' | 'decision' | 'external' | 'ai' | 'data' | 'notification' | 'error' | 'log';
  description?: string;
  swimlaneId: string;
  position: { x: number; y: number };
  connections?: Array<{
    to: string;
    label?: string;
    type?: 'normal' | 'conditional' | 'data' | 'error' | 'cross-swimlane' | 'logging';
  }>;
}

interface SwimlaneProps {
  swimlane: SwimlaneData;
  allSteps: string[];
  highlightedNodes: Set<string>;
  zoom: number;
}

export function Swimlane({ swimlane, allSteps, highlightedNodes, zoom }: SwimlaneProps) {
  // Get all steps from all workflows that belong to this swimlane
  const steps = Object.values(workflows)
    .flatMap(workflow => workflow.steps || [])
    .filter(step => step.swimlaneId === swimlane.id);

  return (
    <div
      className="border-b-2 border-gray-300"
      style={{
        backgroundColor: swimlane.color,
        minHeight: '300px',
        position: 'relative'
      }}
    >
      {/* Swimlane Header */}
      <div className="sticky left-0 z-10 px-6 py-4 bg-opacity-90 backdrop-blur-sm inline-block" style={{ backgroundColor: swimlane.color }}>
        <h3 className="text-gray-900 flex items-center gap-2">
          {swimlane.emoji && <span>{swimlane.emoji}</span>}
          {swimlane.label}
        </h3>
      </div>

      {/* Workflow Steps */}
      <div className="px-6 pb-8 relative" style={{ minHeight: '250px' }}>
        {steps.length > 0 ? (
          <>
            {/* Render connections first (below nodes) */}
            {steps.map(step =>
              step.connections?.map((conn, idx) => {
                const targetStep = allSteps.find(s => s.id === conn.to);
                if (!targetStep) return null;
                
                return (
                  <FlowConnector
                    key={`${step.id}-${conn.to}-${idx}`}
                    from={step.position}
                    to={targetStep.position}
                    type={conn.type || 'normal'}
                    label={conn.label}
                    zoom={zoom}
                  />
                );
              })
            )}

            {/* Render nodes */}
            {steps.map(step => (
              <WorkflowNode
                key={step.id}
                step={step}
                isHighlighted={highlightedNodes.has(step.id)}
              />
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <p>No steps in this swimlane</p>
          </div>
        )}
      </div>
    </div>
  );
}