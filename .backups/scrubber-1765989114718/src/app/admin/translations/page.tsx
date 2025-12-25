'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, Download, CheckCircle, XCircle, AlertCircle, Globe, 
  FileText, Search, Edit, RefreshCw, FileCheck, BookOpen, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiCall } from '@/lib/api-client';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { locales, localeNames } from '@/lib/i18n';
import { InlineTranslationEditor } from '@/components/admin/InlineTranslationEditor';

interface LanguageStats {
  code: string;
  name: string;
  totalKeys: number;
  translatedKeys: number;
  completion: number;
  lastUpdated?: string;
  status: 'active' | 'pending' | 'error';
}

interface ValidationIssue {
  component: string;
  file: string;
  line: number;
  text: string;
  suggestedKey: string;
  type: 'hardcoded' | 'missing-translation';
}

export default function TranslationsPage() {
  const router = useRouter();
  const { t } = useTranslationContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'export' | 'import' | 'validate' | 'editor' | 'scrubber'>('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState('bn');
  const [languages, setLanguages] = useState<LanguageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [languageCode, setLanguageCode] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/admin/languages', {
        method: 'GET',
      });
      if (response.languages) {
        // Calculate completion for each language
        const languagesWithStats = await Promise.all(
          response.languages.map(async (lang: any) => {
            try {
              const localeResponse = await apiCall(`/api/locales/${lang.code}`, {
                method: 'GET',
              });
              const enResponse = await apiCall('/api/locales/en', {
                method: 'GET',
              });
              
              const totalKeys = countKeys(enResponse);
              const translatedKeys = countKeys(localeResponse);
              const completion = totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;
              
              return {
                ...lang,
                totalKeys,
                translatedKeys,
                completion,
              };
            } catch {
              return {
                ...lang,
                totalKeys: 0,
                translatedKeys: 0,
                completion: 0,
              };
            }
          })
        );
        setLanguages(languagesWithStats);
      }
    } catch (err: any) {
      console.error('Failed to load languages:', err);
      setError('Failed to load languages');
    } finally {
      setLoading(false);
    }
  };

  const countKeys = (obj: any): number => {
    let count = 0;
    const countRecursive = (o: any) => {
      for (const key in o) {
        if (typeof o[key] === 'object' && o[key] !== null) {
          countRecursive(o[key]);
        } else {
          count++;
        }
      }
    };
    countRecursive(obj);
    return count;
  };

  const handleExport = async (type: 'all' | 'menu' | 'content') => {
    try {
      setExporting(true);
      setError('');
      
      const response = await apiCall('/admin/translations/extract', {
        method: 'POST',
        body: JSON.stringify({ type }),
      });

      // Download the file
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(`Exported ${type} translations successfully!`);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export translations');
    } finally {
      setExporting(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      setError('');
      setValidationIssues([]);

      const response = await apiCall('/admin/translations/validate', {
        method: 'POST',
      });

      setValidationIssues(response.issues || []);
      
      if (response.totalIssues === 0) {
        setSuccess('No issues found! All text is properly translated.');
      } else {
        setError(`Found ${response.totalIssues} issues in ${response.componentsWithIssues} components.`);
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      setError(err.message || 'Failed to validate translations');
    } finally {
      setValidating(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    setSelectedFile(file);
    setError('');

    const code = file.name.replace('.json', '').toLowerCase();
    setLanguageCode(code);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setPreview(content);

        // Check for missing keys by comparing with English
        try {
          const enResponse = await apiCall('/api/locales/en', {
            method: 'GET',
          });
          const missing = findMissingKeys(enResponse, content);
          setMissingKeys(missing);
        } catch {
          // If we can't load English, skip missing keys check
        }

        setError('');
      } catch (err) {
        setError('Invalid JSON file. Please check the file format.');
        setPreview(null);
        setMissingKeys([]);
      }
    };
    reader.readAsText(file);
  };

  const findMissingKeys = (source: any, target: any, path: string = ''): string[] => {
    const missing: string[] = [];
    
    for (const key in source) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key]) {
          missing.push(currentPath);
        } else {
          missing.push(...findMissingKeys(source[key], target[key], currentPath));
        }
      } else if (!(key in target)) {
        missing.push(currentPath);
      }
    }
    
    return missing;
  };

  const handleUpload = async () => {
    if (!selectedFile || !languageCode) {
      setError('Please select a file and enter a language code');
      return;
    }

    if (!preview) {
      setError('Please preview the file first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('languageCode', languageCode);

      const response = await apiCall('/admin/languages/upload', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      if (response.success) {
        setSuccess(`Language "${languageCode}" uploaded successfully!`);
        setSelectedFile(null);
        setLanguageCode('');
        setPreview(null);
        setMissingKeys([]);
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        loadLanguages();
        setActiveTab('dashboard');
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload language file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Translation Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Export, import, and manage translations for the platform
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Globe },
              { id: 'export', label: 'Export', icon: Download },
              { id: 'import', label: 'Import', icon: Upload },
              { id: 'validate', label: 'Validate', icon: FileCheck },
              { id: 'scrubber', label: 'Text Scrubber', icon: Sparkles },
              { id: 'editor', label: 'Editor', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'scrubber') {
                      router.push('/admin/translations/scrubber');
                    } else {
                      setActiveTab(tab.id as any);
                    }
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

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
            </div>
            <button onClick={() => setSuccess('')} className="text-green-600 dark:text-green-400">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language Dashboard
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading languages...
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-gray-900 dark:text-white text-lg">
                            {lang.name}
                          </p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({lang.code.toUpperCase()})
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              lang.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {lang.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{lang.translatedKeys} / {lang.totalKeys} keys</span>
                          <span className="font-medium">{lang.completion}% complete</span>
                          {lang.lastUpdated && (
                            <span>Updated: {new Date(lang.lastUpdated).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              lang.completion === 100
                                ? 'bg-green-500'
                                : lang.completion >= 80
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${lang.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await apiCall(`/api/locales/${lang.code}`, {
                              method: 'GET',
                            });
                            const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${lang.code}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          } catch (err) {
                            setError('Failed to download');
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Translations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Export all text from the application for translation. Choose the export type based on your needs.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => handleExport('all')}
                disabled={exporting}
                className="w-full sm:w-auto"
                size="lg"
              >
                {exporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export All Text
                  </>
                )}
              </Button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Exports all text including navigation, content, buttons, labels, and descriptions.
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Split Export (Recommended for Translators)</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleExport('menu')}
                    disabled={exporting}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Menu Text Only
                  </Button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Exports only navigation and menu items (smaller file, easier to translate).
                  </div>

                  <Button
                    onClick={() => handleExport('content')}
                    disabled={exporting}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Page Content
                  </Button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Exports all other text (headings, paragraphs, buttons, forms) excluding navigation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import New Language
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="languageCode">Language Code</Label>
                <Input
                  id="languageCode"
                  type="text"
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value.toLowerCase())}
                  placeholder="e.g., fr, es, ar"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ISO 639-1 language code (2 letters)
                </p>
              </div>

              <div>
                <Label htmlFor="file">Translation File (JSON)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload a JSON file with translation keys matching the structure of en.json
                </p>
              </div>

              {preview && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Preview
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Total keys: {countKeys(preview)}
                    </div>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                      {JSON.stringify(Object.keys(preview).slice(0, 5).reduce((acc, key) => {
                        acc[key] = preview[key];
                        return acc;
                      }, {} as any), null, 2)}
                    </pre>
                  </div>

                  {missingKeys.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                        Missing Keys ({missingKeys.length})
                      </h3>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-2">
                        The following translation keys are missing. The system will fall back to English for these.
                      </p>
                      <div className="max-h-32 overflow-auto">
                        {missingKeys.slice(0, 20).map((key, idx) => (
                          <div key={idx} className="text-xs text-yellow-700 dark:text-yellow-400 font-mono">
                            {key}
                          </div>
                        ))}
                        {missingKeys.length > 20 && (
                          <div className="text-xs text-yellow-700 dark:text-yellow-400">
                            ... and {missingKeys.length - 20} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {missingKeys.length === 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-sm text-green-800 dark:text-green-200">
                        All required translation keys are present!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !languageCode || loading || !preview}
                className="w-full sm:w-auto"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Activate Language
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Validate Tab */}
        {activeTab === 'validate' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Check for Untranslated Text
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Scan all components for hardcoded text that should be using translation keys.
            </p>

            <Button
              onClick={handleValidate}
              disabled={validating}
              className="w-full sm:w-auto mb-6"
              size="lg"
            >
              {validating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Run Validation
                </>
              )}
            </Button>

            {validationIssues.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Found {validationIssues.length} issues:
                </h3>
                <div className="space-y-4 max-h-96 overflow-auto">
                  {validationIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {issue.component}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {issue.file} (Line {issue.line})
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          {issue.type}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          <strong>Text:</strong> "{issue.text}"
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Suggested key:</strong> <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">{issue.suggestedKey}</code>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Inline Translation Editor
              </h2>
              <div className="flex items-center gap-4">
                <div>
                  <Label htmlFor="editorLanguage">Target Language</Label>
                  <select
                    id="editorLanguage"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  >
                    {locales.map(code => (
                      <option key={code} value={code}>
                        {localeNames[code as keyof typeof localeNames] || code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <InlineTranslationEditor
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        )}
      </div>

      <UniversalNav showBack={true} />
    </div>
  );
}
