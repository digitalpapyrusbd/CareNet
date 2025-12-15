import React from 'react';
import { workflows } from '../data/workflowData';
import { ChevronRight } from 'lucide-react';

interface WorkflowSelectorProps {
  selectedWorkflow: string;
  onSelectWorkflow: (id: string) => void;
  searchQuery: string;
}

export function WorkflowSelector({ selectedWorkflow, onSelectWorkflow, searchQuery }: WorkflowSelectorProps) {
  const workflowList = Object.entries(workflows);

  const filteredWorkflows = searchQuery
    ? workflowList.filter(([_, workflow]) =>
        workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : workflowList;

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-4">Workflows</h3>
      
      <div className="space-y-2">
        {/* All Workflows Option */}
        <button
          onClick={() => onSelectWorkflow('all')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            selectedWorkflow === 'all'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">All Workflows</div>
              <div className="text-xs text-gray-500 mt-0.5">View complete system</div>
            </div>
            {selectedWorkflow === 'all' && <ChevronRight className="w-5 h-5" />}
          </div>
        </button>

        {/* Individual Workflows */}
        <div className="pt-4 border-t border-gray-200">
          {filteredWorkflows.map(([id, workflow]) => (
            <button
              key={id}
              onClick={() => onSelectWorkflow(id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors mb-2 ${
                selectedWorkflow === id
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm flex items-center gap-2">
                    {workflow.emoji && <span>{workflow.emoji}</span>}
                    {workflow.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {workflow.description}
                  </div>
                </div>
                {selectedWorkflow === id && <ChevronRight className="w-5 h-5 flex-shrink-0 ml-2" />}
              </div>
            </button>
          ))}
        </div>

        {filteredWorkflows.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No workflows found</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm text-gray-700 mb-3">System Overview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Total Entities:</span>
            <span>9</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Workflows:</span>
            <span>{workflowList.length}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Integrations:</span>
            <span>AI, Payment, GPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
