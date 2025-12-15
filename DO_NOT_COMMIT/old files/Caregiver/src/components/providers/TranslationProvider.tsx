'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, getLocale, getMessages } from '@/lib/i18n';
import { UseTranslationReturn, TranslationFunction } from '@/hooks/useTranslation';

interface TranslationContextType extends UseTranslationReturn {
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function TranslationProvider({ children, initialLocale }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || getLocale());
  const [messages, setMessages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

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

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    try {
      return new Intl.DateTimeFormat(locale, options).format(dateObj);
    } catch (error) {
      return dateObj.toLocaleDateString();
    }
  };

  const formatTime = (date: Date | string): string => {
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

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj) + ' ' + formatTime(dateObj);
  };

  const formatNumber = (num: number): string => {
    try {
      return new Intl.NumberFormat(locale).format(num);
    } catch (error) {
      return num.toLocaleString();
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'BDT', // Bangladeshi Taka
      }).format(amount);
    } catch (error) {
      return `৳${amount.toLocaleString()}`;
    }
  };

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    getMessages(locale)
      .then(setMessages)
      .catch(error => {
        console.error('Failed to load translations:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [locale]);

  const value: TranslationContextType = {
    t: translate,
    locale,
    setLocale,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    isLoading
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}

export default TranslationProvider;