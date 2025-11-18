"use client";
import React from 'react';

type Option = { value: string; label: string };
type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options?: Option[]; error?: string };

export default function Select({ label, options, className = '', error, children, ...props }: Props) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>}
      <select 
        {...props} 
        className={`block w-full min-h-[48px] rounded-md border px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      >
        {options ? options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        )) : children}
      </select>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
