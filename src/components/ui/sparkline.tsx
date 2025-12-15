"use client";
import React from 'react';

export default function Sparkline({ data = [], width = 120, height = 28 }: { data?: number[]; width?: number; height?: number }) {
  if (!data || data.length === 0) return <svg width={width} height={height} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke="#3b82f6" strokeWidth={1.5} points={points} />
    </svg>
  );
}
