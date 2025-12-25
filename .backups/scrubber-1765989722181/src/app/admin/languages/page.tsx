'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Download, CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiCall } from '@/lib/api-client';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { locales, localeNames } from '@/lib/i18n';

interface LanguageFile {
  code: string;
  name: string;
  lastUpdated?: string;
  status: 'active' | 'pending' | 'error';
}

export default function LanguagesPage() {
  const router = useRouter();
  const { t } = useTranslationContext();
  const [languages, setLanguages] = useState<LanguageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [languageCode, setLanguageCode] = useState('');
  const [preview, setPreview] = useState<any>(null);
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
        setLanguages(response.languages);
      }
    } catch (err: any) {
      console.error('Failed to load languages:', err);
      setError('Failed to load languages');
    } finally {
      setLoading(false);
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

    // Extract language code from filename (e.g., "fr.json" -> "fr")
    const code = file.name.replace('.json', '').toLowerCase();
    setLanguageCode(code);

    // Preview the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setPreview(content);
        setError('');
      } catch (err) {
        setError('Invalid JSON file. Please check the file format.');
        setPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const validateTranslationStructure = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (typeof data !== 'object' || data === null) {
      errors.push('Translation file must be a JSON object');
      return { valid: false, errors };
    }

    // Check for required top-level keys (optional - adjust based on your structure)
    const requiredKeys = ['common'];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    
    if (missingKeys.length > 0) {
      errors.push(`Missing required keys: ${missingKeys.join(', ')}`);
    }

    // Validate nested structure
    const validateNested = (obj: any, path: string = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          validateNested(value, currentPath);
        } else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
          errors.push(`Invalid value type at ${currentPath}: must be string, number, or boolean`);
        }
      }
    };

    validateNested(data);

    return { valid: errors.length === 0, errors };
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

    const validation = validateTranslationStructure(preview);
    if (!validation.valid) {
      setError(`Validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    try {
      setUploading(true);
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
        // Reset file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        loadLanguages();
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload language file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (code: string) => {
    try {
      const response = await apiCall(`/admin/languages/${code}/download`, {
        method: 'GET',
      });
      
      if (response.url) {
        window.open(response.url, '_blank');
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setError('Failed to download language file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Language Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage translation files for the platform
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Language
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
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
              <button
                onClick={() => setSuccess('')}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="languageCode">{t('page.text.languagecode')}</Label>
              <Input
                id="languageCode"
                type="text"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value.toLowerCase())}
                placeholder={t('page.placeholder.egfresar')}
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
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Preview (First 5 keys):
                </h3>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                  {JSON.stringify(Object.keys(preview).slice(0, 5).reduce((acc, key) => {
                    acc[key] = preview[key];
                    return acc;
                  }, {} as any), null, 2)}
                </pre>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !languageCode || uploading || !preview}
              className="w-full sm:w-auto"
            >
              {uploading ? 'Uploading...' : 'Upload Language'}
            </Button>
          </div>
        </div>

        {/* Languages List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Available Languages
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading languages...
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...locales].map((code) => {
                const lang = languages.find(l => l.code === code) || {
                  code,
                  name: localeNames[code as keyof typeof localeNames] || code,
                  status: 'active' as const
                };
                
                return (
                  <div
                    key={code}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {lang.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Code: {lang.code.toUpperCase()}
                          {lang.lastUpdated && ` • Updated: ${new Date(lang.lastUpdated).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          lang.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : lang.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {lang.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(code)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <UniversalNav showBack={true} />
    </div>
  );
}
