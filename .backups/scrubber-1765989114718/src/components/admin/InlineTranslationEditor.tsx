'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiCall } from '@/lib/api-client';
import { locales, localeNames } from '@/lib/i18n';

interface TranslationKey {
  key: string;
  path: string[];
  value: string;
}

interface InlineTranslationEditorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function InlineTranslationEditor({ 
  selectedLanguage, 
  onLanguageChange 
}: InlineTranslationEditorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'missing' | 'menu'>('all');
  const [englishTranslations, setEnglishTranslations] = useState<any>({});
  const [targetTranslations, setTargetTranslations] = useState<any>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTranslations();
  }, [selectedLanguage]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      setError('');

      // Load English (reference) and target language
      const [enResponse, targetResponse] = await Promise.all([
        apiCall('/api/locales/en', { method: 'GET' }),
        apiCall(`/api/locales/${selectedLanguage}`, { method: 'GET' }),
      ]);

      setEnglishTranslations(enResponse);
      setTargetTranslations(targetResponse || {});
    } catch (err: any) {
      console.error('Failed to load translations:', err);
      setError('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  // Flatten nested translation objects
  const flattenTranslations = (obj: any, prefix: string = ''): TranslationKey[] => {
    const keys: TranslationKey[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...flattenTranslations(value, fullKey));
      } else {
        keys.push({
          key: fullKey,
          path: fullKey.split('.'),
          value: String(value),
        });
      }
    }
    
    return keys;
  };

  const englishKeys = useMemo(() => flattenTranslations(englishTranslations), [englishTranslations]);
  const targetKeys = useMemo(() => flattenTranslations(targetTranslations), [targetTranslations]);

  // Get all keys from English, check if they exist in target
  const allKeys = useMemo(() => {
    const targetMap = new Map(targetKeys.map(k => [k.key, k.value]));
    
    return englishKeys.map(engKey => ({
      ...engKey,
      targetValue: targetMap.get(engKey.key) || '',
      isMissing: !targetMap.has(engKey.key),
    }));
  }, [englishKeys, targetKeys]);

  // Filter keys
  const filteredKeys = useMemo(() => {
    let filtered = allKeys;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(k => 
        k.key.toLowerCase().includes(query) ||
        k.value.toLowerCase().includes(query) ||
        (k.targetValue && k.targetValue.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filter === 'missing') {
      filtered = filtered.filter(k => k.isMissing);
    } else if (filter === 'menu') {
      filtered = filtered.filter(k => 
        k.key.startsWith('navigation.') || 
        k.key.startsWith('common.home') ||
        k.key.startsWith('common.profile') ||
        k.key.startsWith('common.settings')
      );
    }

    return filtered;
  }, [allKeys, searchQuery, filter]);

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditingValue(currentValue);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const handleSave = async (key: string) => {
    try {
      setSaving(key);
      setError('');

      await apiCall('/admin/translations/edit', {
        method: 'POST',
        body: JSON.stringify({
          languageCode: selectedLanguage,
          key,
          value: editingValue,
        }),
      });

      // Update local state
      setTargetTranslations((prev: any) => {
        const newTranslations = { ...prev };
        const path = key.split('.');
        let current = newTranslations;
        
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }
        current[path[path.length - 1]] = editingValue;
        
        return newTranslations;
      });

      setEditingKey(null);
      setEditingValue('');
    } catch (err: any) {
      console.error('Failed to save translation:', err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Loading translations...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by key or text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'missing' ? 'default' : 'outline'}
              onClick={() => setFilter('missing')}
              size="sm"
            >
              Missing Only
            </Button>
            <Button
              variant={filter === 'menu' ? 'default' : 'outline'}
              onClick={() => setFilter('menu')}
              size="sm"
            >
              Menu Only
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredKeys.length} of {allKeys.length} translations
            {filter === 'missing' && ` • ${allKeys.filter(k => k.isMissing).length} missing`}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadTranslations}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Translations List */}
      <div className="space-y-3">
        {filteredKeys.map((item) => {
          const isEditing = editingKey === item.key;
          const isSaving = saving === item.key;

          return (
            <div
              key={item.key}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border ${
                item.isMissing
                  ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      {item.key}
                    </code>
                    {item.isMissing && (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Missing
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">English (Reference):</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.value}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {localeNames[selectedLanguage as keyof typeof localeNames] || selectedLanguage}:
                </p>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSave(item.key)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className={`text-sm flex-1 ${
                      item.targetValue
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600 italic'
                    }`}>
                      {item.targetValue || '(Not translated)'}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item.key, item.targetValue)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredKeys.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No translations found matching your search.
        </div>
      )}
    </div>
  );
}

