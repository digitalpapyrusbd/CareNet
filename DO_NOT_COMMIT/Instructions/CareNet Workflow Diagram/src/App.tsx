import React, { useState } from 'react';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { WorkflowListView } from './components/WorkflowListView';
import { Legend } from './components/Legend';
import { WorkflowSelector } from './components/WorkflowSelector';
import { ZoomControls } from './components/ZoomControls';
import { Search, Menu, X, List, Network } from 'lucide-react';
import { workflows, swimlanes } from './data/workflowData';

export default function App() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');
  const [zoom, setZoom] = useState(0.8);
  const [showLegend, setShowLegend] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'diagram'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">CareNet Platform Workflow Diagram</h1>
              <p className="text-gray-600 mt-1">Comprehensive system architecture and user flows</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm">List</span>
                </button>
                <button
                  onClick={() => setViewMode('diagram')}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === 'diagram'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <span className="text-sm">Diagram</span>
                </button>
              </div>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {showLegend ? 'Hide' : 'Show'} Legend
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search workflows, entities, or processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-89px)] overflow-y-auto sticky top-[89px]">
          <WorkflowSelector
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={setSelectedWorkflow}
            searchQuery={searchQuery}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative">
          {showLegend && viewMode === 'diagram' && (
            <div className="absolute top-6 left-6 z-40">
              <Legend />
            </div>
          )}

          {viewMode === 'diagram' && (
            <ZoomControls zoom={zoom} onZoomChange={setZoom} />
          )}

          <div className="p-6">
            {viewMode === 'list' ? (
              <WorkflowListView
                selectedWorkflow={selectedWorkflow}
                zoom={zoom}
                searchQuery={searchQuery}
              />
            ) : (
              <WorkflowDiagram
                selectedWorkflow={selectedWorkflow}
                zoom={zoom}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>

      {/* Version Badge */}
      <div className="fixed bottom-6 right-6 px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
        v1.3 - Multi-Entity Workflows
      </div>
    </div>
  );
}