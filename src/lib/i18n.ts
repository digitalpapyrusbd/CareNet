export type Locale = 'en' | 'bn';

// Default locale
export const defaultLocale: Locale = 'en';

// Supported locales
export const locales: Locale[] = ['en', 'bn'];

// Locale names for display
export const localeNames: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা (Bengali)',
};

// Cache for loaded translations
const translationCache: Record<Locale, any> = {};

// Get current locale from localStorage
export function getLocale(): Locale {
  // Try to get from localStorage (client-side)
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && locales.includes(storedLocale)) {
      return storedLocale;
    }
  }
  
  return defaultLocale;
}

// Get locale-specific messages
export async function getMessages(locale: Locale = defaultLocale) {
  // Return cached messages if available
  if (translationCache[locale]) {
    return translationCache[locale];
  }
  
  try {
    switch (locale) {
      case 'bn':
        translationCache[locale] = (await import('./locales/bn.json')).default;
        break;
      case 'en':
      default:
        translationCache[locale] = (await import('./locales/en.json')).default;
        break;
    }
    return translationCache[locale];
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to default locale
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    return {};
  }
}

// Get nested property from object using dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Translation function with support for nested keys and parameters
export async function t(locale: Locale, key: string, params?: Record<string, string | number>): Promise<string> {
  const messages = await getMessages(locale);
  let translation = getNestedValue(messages, key) || key;
  
  // Replace parameters in translation string
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
    });
  }
  
  return translation;
}

// Synchronous translation function (for client-side use)
export function tSync(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const messages = translationCache[locale] || {};
  let translation = getNestedValue(messages, key) || key;
  
  // Replace parameters in translation string
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
    });
  }
  
  return translation;
}

// Format date according to locale
export function formatDate(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    // Fallback to simple date formatting
    return date.toLocaleDateString();
  }
}

// Format currency according to locale
export function formatCurrency(amount: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BDT', // Bangladeshi Taka
    }).format(amount);
  } catch (error) {
    // Fallback to simple formatting
    return `৳${amount.toLocaleString()}`;
  }
}

// Format number according to locale
export function formatNumber(number: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    // Fallback to simple formatting
    return number.toLocaleString();
  }
}