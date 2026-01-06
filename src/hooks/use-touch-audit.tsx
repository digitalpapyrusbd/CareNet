'use client';

import { useEffect, useState } from 'react';

interface TouchTarget {
  element: Element;
  width: number;
  height: number;
  isValid: boolean;
  path: string;
}

export function useTouchTargetAudit() {
  const [results, setResults] = useState<TouchTarget[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const MIN_TOUCH_TARGET = 48; // 48x48px minimum per WCAG guidelines

  const auditTouchTargets = () => {
    setIsAuditing(true);

    // Elements that should be interactive
    const selectors = [
      'button',
      'a',
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      '[role="button"]',
      '[onclick]',
      '.clickable',
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    const touchTargets: TouchTarget[] = [];

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      // Get actual clickable area including padding
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);

      const effectiveWidth = rect.width;
      const effectiveHeight = rect.height;

      const isValid = effectiveWidth >= MIN_TOUCH_TARGET && effectiveHeight >= MIN_TOUCH_TARGET;

      // Generate element path for debugging
      const path = getElementPath(element);

      touchTargets.push({
        element,
        width: Math.round(effectiveWidth),
        height: Math.round(effectiveHeight),
        isValid,
        path,
      });
    });

    setResults(touchTargets);
    setIsAuditing(false);
  };

  const getElementPath = (element: Element): string => {
    const parts: string[] = [];
    let current: Element | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        const classes = current.className.toString().split(' ').filter(Boolean).slice(0, 2);
        if (classes.length) {
          selector += `.${classes.join('.')}`;
        }
      }

      parts.unshift(selector);
      current = current.parentElement;
    }

    return parts.join(' > ');
  };

  const highlightInvalidTargets = () => {
    results.forEach(({ element, isValid }) => {
      if (!isValid && element instanceof HTMLElement) {
        element.style.outline = '2px solid red';
        element.style.outlineOffset = '2px';

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Touch target too small';
        tooltip.style.cssText = `
          position: absolute;
          background: red;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 4px;
          z-index: 10000;
          pointer-events: none;
        `;
        element.appendChild(tooltip);
      }
    });
  };

  const clearHighlights = () => {
    results.forEach(({ element }) => {
      if (element instanceof HTMLElement) {
        element.style.outline = '';
        element.style.outlineOffset = '';

        // Remove tooltips
        const tooltips = element.querySelectorAll('div');
        tooltips.forEach((tooltip) => {
          if (tooltip.textContent === 'Touch target too small') {
            tooltip.remove();
          }
        });
      }
    });
  };

  return {
    results,
    isAuditing,
    auditTouchTargets,
    highlightInvalidTargets,
    clearHighlights,
    invalidCount: results.filter((r) => !r.isValid).length,
    totalCount: results.length,
  };
}

// Touch Target Audit Panel Component
export function TouchTargetAuditPanel() {
  const {
    results,
    isAuditing,
    auditTouchTargets,
    highlightInvalidTargets,
    clearHighlights,
    invalidCount,
    totalCount,
  } = useTouchTargetAudit();

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true);

    // Auto-audit on mount in development
    if (process.env.NODE_ENV === 'development') {
      auditTouchTargets();
    }
  }, []);

  const copyAuditResults = async () => {
    const pageUrl = window.location.href;
    const timestamp = new Date().toLocaleString();
    const invalidResults = results.filter((r) => !r.isValid);

    let report = `🔍 TOUCH TARGET AUDIT REPORT\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `📍 Page: ${pageUrl}\n`;
    report += `📅 Date: ${timestamp}\n\n`;
    report += `📊 SUMMARY\n`;
    report += `${'-'.repeat(30)}\n`;
    report += `Total Elements: ${totalCount}\n`;
    report += `✅ Valid (≥48×48px): ${totalCount - invalidCount}\n`;
    report += `❌ Invalid (<48×48px): ${invalidCount}\n\n`;

    if (invalidResults.length > 0) {
      report += `⚠️ INVALID ELEMENTS\n`;
      report += `${'-'.repeat(30)}\n`;
      invalidResults.forEach((result, index) => {
        report += `\n${index + 1}. Size: ${result.width}×${result.height}px\n`;
        report += `   Path: ${result.path}\n`;
      });
    } else {
      report += `✅ All touch targets meet WCAG 2.5.5 requirements!\n`;
    }

    report += `\n${'='.repeat(50)}\n`;
    report += `Minimum required: 48×48px (WCAG 2.5.5)\n`;

    try {
      await navigator.clipboard.writeText(report);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  // Don't render on server or in production
  if (!isMounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
        title="Touch Target Audit"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </button>

      {/* Audit Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999] w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Touch Target Audit</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 w-12 h-12 flex items-center justify-center -mr-2"
                aria-label="Close audit panel"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-purple-100">
              Minimum: 48x48px (WCAG 2.5.5)
            </p>
          </div>

          {/* Stats */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {totalCount - invalidCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Valid</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {invalidCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Invalid</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={auditTouchTargets}
              disabled={isAuditing}
              className="w-full bg-blue-600 text-white h-12 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-bold uppercase tracking-wide"
            >
              {isAuditing ? 'Auditing...' : '🔍 Run Audit'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={highlightInvalidTargets}
                className="flex-1 bg-red-600 text-white h-12 px-4 rounded hover:bg-red-700 text-sm font-bold"
              >
                Highlight
              </button>
              <button
                onClick={clearHighlights}
                className="flex-1 bg-gray-600 text-white h-12 px-4 rounded hover:bg-gray-700 text-sm font-bold"
              >
                Clear
              </button>
            </div>
            <button
              onClick={copyAuditResults}
              disabled={results.length === 0}
              className={`w-full h-12 px-4 rounded text-sm font-bold uppercase tracking-wide transition-colors ${copyStatus === 'copied'
                  ? 'bg-green-600 text-white'
                  : copyStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                }`}
            >
              {copyStatus === 'copied'
                ? '✅ Copied!'
                : copyStatus === 'error'
                  ? '❌ Failed'
                  : '📋 Copy Results'}
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Run audit to see results
              </p>
            ) : (
              <div className="space-y-2">
                {results
                  .filter((r) => !r.isValid)
                  .map((result, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-900 dark:text-red-100">
                          {result.width}×{result.height}px
                        </span>
                        <span className="text-xs text-red-700 dark:text-red-300">
                          Too small
                        </span>
                      </div>
                      <code className="text-xs text-gray-600 dark:text-gray-400 block truncate">
                        {result.path}
                      </code>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
