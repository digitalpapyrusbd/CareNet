import React from 'react';
import { WorkflowList } from './WorkflowList';
import { workflows, swimlanes } from '../data/workflowData';

interface WorkflowListViewProps {
  selectedWorkflow: string;
  searchQuery: string;
  zoom?: number;
}

export function WorkflowListView({ selectedWorkflow, searchQuery }: WorkflowListViewProps) {
  // Get the workflows to display
  const workflowsToShow =
    selectedWorkflow === 'all'
      ? Object.entries(workflows)
      : [[selectedWorkflow, workflows[selectedWorkflow]]];

  return (
    <div className="max-w-6xl mx-auto">
      {workflowsToShow.map(([id, workflow]) => {
        if (!workflow) return null;

        // Get unique swimlanes used in this workflow
        const usedSwimlaneIds = [...new Set(workflow.steps.map((step: any) => step.swimlaneId))];

        return (
          <div key={id} className="mb-12">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {workflow.emoji && <span className="text-2xl">{workflow.emoji}</span>}
                <h2 className="text-gray-900 text-2xl">{workflow.title}</h2>
              </div>
              <p className="text-gray-600">{workflow.description}</p>
            </div>

            {usedSwimlaneIds.map((swimlaneId) => {
              const swimlane = swimlanes.find((s) => s.id === swimlaneId);
              if (!swimlane) return null;

              const stepsInSwimlane = workflow.steps.filter(
                (step: any) => step.swimlaneId === swimlaneId
              );

              // Filter by search query if provided
              const filteredSteps = searchQuery
                ? stepsInSwimlane.filter(
                    (step: any) =>
                      step.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      step.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : stepsInSwimlane;

              if (filteredSteps.length === 0) return null;

              return (
                <WorkflowList
                  key={swimlaneId}
                  steps={filteredSteps}
                  swimlaneName={`${swimlane.emoji} ${swimlane.label}`}
                  swimlaneColor={swimlane.color}
                />
              );
            })}
          </div>
        );
      })}

      {workflowsToShow.every(([_, workflow]) => {
        if (!workflow) return true;
        return workflow.steps.every(
          (step: any) =>
            searchQuery &&
            !step.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !step.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }) && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">No steps found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
