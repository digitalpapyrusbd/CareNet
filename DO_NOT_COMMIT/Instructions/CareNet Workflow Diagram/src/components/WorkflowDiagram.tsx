import React, { useRef, useEffect, useState } from 'react';
import { Swimlane } from './Swimlane';
import { WorkflowList } from './WorkflowList';
import { swimlanes, workflows } from '../data/workflowData';
import { LayoutGrid, List } from 'lucide-react';

interface WorkflowDiagramProps {
  selectedWorkflow: string;
  zoom: number;
  searchQuery: string;
}

export function WorkflowDiagram({ selectedWorkflow, zoom, searchQuery }: WorkflowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'diagram' | 'list'>('list');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Get all steps for the selected workflow(s)
  const allSteps = selectedWorkflow === 'all'
    ? Object.values(workflows).flatMap(w => w.steps || [])
    : workflows[selectedWorkflow]?.steps || [];

  // Filter swimlanes based on selection
  const filteredSwimlanes = selectedWorkflow === 'all'
    ? swimlanes
    : swimlanes.filter(lane => 
        workflows[selectedWorkflow]?.swimlanes?.includes(lane.id)
      );

  const highlightedNodes = searchQuery
    ? new Set(
        allSteps
          .filter(step =>
            step.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            step.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(step => step.id)
      )
    : new Set();

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto"
      style={{
        minHeight: '800px',
      }}
    >
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          {selectedWorkflow !== 'all' && (
            <>
              <h2 className="text-gray-900">{workflows[selectedWorkflow]?.title}</h2>
              <p className="text-sm text-gray-600 mt-0.5">{workflows[selectedWorkflow]?.description}</p>
            </>
          )}
          {selectedWorkflow === 'all' && (
            <h2 className="text-gray-900">All Workflows Overview</h2>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm">List View</span>
          </button>
          <button
            onClick={() => setViewMode('diagram')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
              viewMode === 'diagram'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm">Diagram View</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        // List View - Easy to read and verify
        <div className="p-6 max-w-5xl">
          {filteredSwimlanes.map((lane) => {
            const laneSteps = allSteps.filter(step => step.swimlaneId === lane.id);
            if (laneSteps.length === 0 && selectedWorkflow !== 'all') return null;
            
            return (
              <WorkflowList
                key={lane.id}
                steps={laneSteps}
                swimlaneName={lane.label}
                swimlaneColor={lane.color}
              />
            );
          })}

          {allSteps.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No workflow steps defined yet</p>
              <p className="text-sm mt-2">Select a workflow from the sidebar to view its steps</p>
            </div>
          )}
        </div>
      ) : (
        // Diagram View - Visual flowchart
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
              transformOrigin: 'top left',
              transition: isPanning ? 'none' : 'transform 0.2s ease-out',
              minWidth: '2000px'
            }}
          >
            <div className="p-8">
              {/* Swimlanes */}
              <div className="space-y-0">
                {filteredSwimlanes.map((lane) => (
                  <Swimlane
                    key={lane.id}
                    swimlane={lane}
                    allSteps={allSteps}
                    highlightedNodes={highlightedNodes}
                    zoom={zoom}
                  />
                ))}
              </div>

              {/* Hint Text */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>💡 Hold Shift + Drag to pan • Use zoom controls to adjust view</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}