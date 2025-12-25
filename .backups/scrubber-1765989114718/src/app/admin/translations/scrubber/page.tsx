'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RefreshCw, CheckCircle, XCircle, AlertCircle, FileText, 
  Play, Square, CheckSquare, Download, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/lib/api-client';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface TextReplacement {
  id: string;
  component: string;
  filePath: string;
  line: number;
  originalText: string;
  replacement: string;
  key: string;
  type: 'jsx' | 'attribute' | 'other';
  context: string;
  selected: boolean;
}

export default function TextScrubberPage() {
  const router = useRouter();
  const { t } = useTranslationContext();
  const [scanning, setScanning] = useState(false);
  const [applying, setApplying] = useState(false);
  const [replacements, setReplacements] = useState<TextReplacement[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backupPath, setBackupPath] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleScan = async () => {
    try {
      setScanning(true);
      setError('');
      setSuccess('');
      setReplacements([]);

      const response = await apiCall('/admin/translations/scrub', {
        method: 'POST',
        body: JSON.stringify({ action: 'scan' }),
      });

      if (response.replacements) {
        setReplacements(response.replacements);
        setSelectedCount(response.replacements.filter((r: TextReplacement) => r.selected).length);
        setSuccess(`Found ${response.totalFound} hardcoded strings in ${response.componentsAffected} components`);
      } else {
        setError('Failed to scan components');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to scan components');
    } finally {
      setScanning(false);
    }
  };

  const handleToggleSelection = (id: string) => {
    // #region agent log
    console.log('[DEBUG] Toggle selection called', { id });
    // #endregion
    setReplacements(prev => {
      const updated = prev.map(r => 
        r.id === id ? { ...r, selected: !r.selected } : r
      );
      const newSelectedCount = updated.filter(r => r.selected).length;
      // #region agent log
      console.log('[DEBUG] Selection toggled', { id, newSelectedCount, wasSelected: prev.find(r => r.id === id)?.selected, nowSelected: updated.find(r => r.id === id)?.selected });
      // #endregion
      setSelectedCount(newSelectedCount);
      return updated;
    });
  };

  const handleSelectAll = () => {
    setReplacements(prev => {
      const allSelected = prev.every(r => r.selected);
      const updated = prev.map(r => ({ ...r, selected: !allSelected }));
      setSelectedCount(updated.filter(r => r.selected).length);
      return updated;
    });
  };

  const handleApply = async () => {
    // #region agent log
    console.log('[DEBUG] handleApply called', { selectedCount, replacementsCount: replacements.length });
    // #endregion

    if (selectedCount === 0) {
      // #region agent log
      console.log('[DEBUG] No items selected, showing error');
      // #endregion
      setError('Please select at least one replacement to apply');
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmAndApply = async () => {
    setShowConfirmDialog(false);
    
    // #region agent log
    console.log('[DEBUG] User confirmed, proceeding with apply');
    // #endregion

    try {
      setApplying(true);
      setError('');
      setSuccess('');

      const selectedIds = replacements.filter(r => r.selected).map(r => r.id);

      // #region agent log
      console.log('[DEBUG] Starting apply', { selectedIdsCount: selectedIds.length, selectedIds: selectedIds.slice(0, 5), totalReplacements: replacements.length });
      // #endregion

      const response = await apiCall('/admin/translations/scrub', {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'apply',
          selectedIds,
          createBackup: true,
          replacements: replacements // Pass full replacement data so scrubber can use it
        }),
      });
      
      // #region agent log
      console.log('[DEBUG] API response received', { success: response.success, hasBackupPath: !!response.backupPath, errorsCount: response.errors?.length, responseKeys: Object.keys(response) });
      // #endregion

      if (response.success) {
        const successMessage = `Successfully applied ${selectedIds.length} replacement${selectedIds.length !== 1 ? 's' : ''}!`;
        // #region agent log
        console.log('[DEBUG] Apply successful, setting success message:', successMessage);
        // #endregion
        setSuccess(successMessage);
        if (response.backupPath) {
          setBackupPath(response.backupPath);
        }
        if (response.errors && response.errors.length > 0) {
          setError(`Some errors occurred: ${response.errors.join(', ')}`);
        }
        // Clear replacements list to force fresh scan
        setReplacements([]);
        setSelectedCount(0);
        // Reload to show updated state after a short delay
        setTimeout(() => {
          handleScan();
        }, 1500);
      } else {
        const errorMsg = response.errors && response.errors.length > 0 
          ? `Failed to apply replacements: ${response.errors.join(', ')}`
          : 'Failed to apply replacements';
        // #region agent log
        console.log('[DEBUG] Apply failed, setting error:', errorMsg);
        // #endregion
        setError(errorMsg);
      }
    } catch (err: any) {
      // #region agent log
      console.error('[DEBUG] Apply error caught:', err);
      // #endregion
      console.error('Apply error:', err);
      setError(err.message || 'Failed to apply replacements');
    } finally {
      setApplying(false);
      // #region agent log
      console.log('[DEBUG] Apply finished, setApplying(false)');
      // #endregion
    }
  };

  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalReplacements: replacements.length,
      selectedReplacements: selectedCount,
      replacements: replacements.map(r => ({
        component: r.component,
        file: r.filePath,
        line: r.line,
        originalText: r.originalText,
        newKey: r.key,
        replacement: r.replacement,
        selected: r.selected,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrubber-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const groupedReplacements = replacements.reduce((acc, r) => {
    if (!acc[r.component]) {
      acc[r.component] = [];
    }
    acc[r.component].push(r);
    return acc;
  }, {} as Record<string, TextReplacement[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Text Scrubber Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automatically find and replace hardcoded text with translation keys
          </p>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Apply Replacements
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to apply <strong>{selectedCount}</strong> replacement{selectedCount !== 1 ? 's' : ''}? 
                A backup will be created automatically.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    // #region agent log
                    console.log('[DEBUG] User cancelled confirmation dialog');
                    // #endregion
                    setShowConfirmDialog(false);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAndApply}
                  disabled={applying}
                >
                  {applying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply {selectedCount} Replacement{selectedCount !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-600 dark:text-red-400">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              {backupPath && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Backup created at: {backupPath}
                </p>
              )}
            </div>
            <button onClick={() => setSuccess('')} className="text-green-600 dark:text-green-400">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Scan & Replace
              </h2>
              {replacements.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {replacements.length} hardcoded strings • {selectedCount} selected
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleScan}
                disabled={scanning}
                variant="outline"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Scan All Components
                  </>
                )}
              </Button>
              {replacements.length > 0 && (
                <>
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                  >
                    {replacements.every(r => r.selected) ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Select All
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      // #region agent log
                      console.log('[DEBUG] Apply Selected button clicked', { 
                        applying, 
                        selectedCount, 
                        disabled: applying || selectedCount === 0,
                        replacementsLength: replacements.length,
                        selectedReplacements: replacements.filter(r => r.selected).length
                      });
                      // #endregion
                      handleApply();
                    }}
                    disabled={applying || selectedCount === 0}
                    type="button"
                  >
                    {applying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Apply Selected ({selectedCount})
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleExportReport}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Replacements List */}
        {replacements.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedReplacements).map(([component, compReplacements]) => (
              <div
                key={component}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {component}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {compReplacements.length} replacements
                  </span>
                </div>

                <div className="space-y-4">
                  {compReplacements.map((replacement) => (
                    <div
                      key={replacement.id}
                      className={`p-4 border rounded-lg ${
                        replacement.selected
                          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggleSelection(replacement.id)}
                          className="mt-1"
                        >
                          {replacement.selected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                              Line {replacement.line}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {replacement.type}
                            </span>
                            <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                              {replacement.key}
                            </span>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <strong>Original:</strong>
                            </p>
                            <code className="block p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm">
                              {replacement.context}
                            </code>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <strong>Will replace with:</strong>
                            </p>
                            <code className="block p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-800 dark:text-green-300">
                              {replacement.context.replace(replacement.originalText, replacement.replacement)}
                            </code>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            File: {replacement.filePath}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {replacements.length === 0 && !scanning && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No scan performed yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click "Scan All Components" to find hardcoded text that needs translation keys
            </p>
            <Button onClick={handleScan} disabled={scanning}>
              <FileText className="w-4 h-4 mr-2" />
              Start Scan
            </Button>
          </div>
        )}
      </div>

      <UniversalNav showBack={true} />
    </div>
  );
}

