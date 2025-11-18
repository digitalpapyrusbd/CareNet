import { useState, useEffect } from 'react';
import { getLocale, tSync, getMessages, formatDate, formatNumber, formatCurrency, Locale } from '@/lib/i18n';

export type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

export interface UseTranslationReturn {
  t: TranslationFunction;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
}

export function useTranslation(): UseTranslationReturn {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<any>({});
  
  // Initialize locale from browser/localStorage
  useEffect(() => {
    const detectedLocale = getLocale();
    setLocaleState(detectedLocale);
    
    // Store locale preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', detectedLocale);
    }
    
    // Load messages for the detected locale
    getMessages(detectedLocale).then(setMessages);
  }, []);
  
  // Load messages when locale changes
  useEffect(() => {
    getMessages(locale).then(setMessages);
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };
  
  // Get nested property from object using dot notation
  const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };
  
  const translate: TranslationFunction = (key: string, params?: Record<string, string | number>) => {
    let translation = getNestedValue(messages, key) || key;
    
    // Replace parameters in the translation string
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      });
    }
    
    return translation;
  };
  
  const formatDateFn = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj, locale);
  };
  
  const formatTimeFn = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    try {
      return new Intl.DateTimeFormat(locale, options).format(dateObj);
    } catch (error) {
      return dateObj.toLocaleTimeString();
    }
  };
  
  const formatDateTimeFn = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj, locale) + ' ' + formatTimeFn(dateObj);
  };
  
  const formatNumberFn = (num: number): string => {
    return formatNumber(num, locale);
  };
  
  const formatCurrencyFn = (amount: number): string => {
    return formatCurrency(amount, locale);
  };
  
  return {
    t: translate,
    locale,
    setLocale,
    formatDate: formatDateFn,
    formatTime: formatTimeFn,
    formatDateTime: formatDateTimeFn,
    formatNumber: formatNumberFn,
    formatCurrency: formatCurrencyFn
  };
}

export default useTranslation;