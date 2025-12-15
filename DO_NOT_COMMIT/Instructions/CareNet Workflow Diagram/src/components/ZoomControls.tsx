import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.3));
  };

  const handleReset = () => {
    onZoomChange(0.8);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
      <button
        onClick={handleZoomOut}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        aria-label="Zoom out"
        disabled={zoom <= 0.3}
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>

      <div className="px-3 text-sm text-gray-700 min-w-[60px] text-center">
        {Math.round(zoom * 100)}%
      </div>

      <button
        onClick={handleZoomIn}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        aria-label="Zoom in"
        disabled={zoom >= 2}
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={handleReset}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        aria-label="Reset zoom"
        title="Reset to 80%"
      >
        <Maximize2 className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
