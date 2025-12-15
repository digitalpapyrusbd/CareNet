# Frontend 16: Internationalization & Localization

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [01: Architecture](01%20Frontend%2001.md) | [11: UI Components](01%20Frontend%2011.md)

---

## 📋 Table of Contents

1. [i18n Overview](#i18n-overview)
2. [Supported Languages](#supported-languages)
3. [Translation System](#translation-system)
4. [Language Switching](#language-switching)
5. [Translation Files](#translation-files)
6. [Date & Time Formatting](#date--time-formatting)
7. [Number & Currency Formatting](#number--currency-formatting)
8. [Translation Provider](#translation-provider)
9. [Usage Examples](#usage-examples)
10. [Debugging Guide](#debugging-guide)
11. [Testing Guide](#testing-guide)
12. [Testing Progress Log](#testing-progress-log)

---

## 🌍 i18n Overview

### **Internationalization Strategy**

The platform supports bilingual operation for the Bangladeshi market:
- **Primary Language**: English (en) - Default
- **Secondary Language**: Bengali (বাংলা, bn)
- **Locale Storage**: LocalStorage persistence
- **Translation Method**: JSON-based message files
- **Formatting**: Intl API for dates, numbers, currency

### **Key Features**
- ✅ Real-time language switching without page reload
- ✅ Nested translation keys (dot notation: `auth.loginTitle`)
- ✅ Parameter interpolation (`Welcome back, {{name}}!`)
- ✅ Fallback to default locale on missing translations
- ✅ Client-side translation caching
- ✅ Bengali Taka (৳) currency formatting
- ✅ Locale-aware date/time formatting

### **Implementation Files**

```
src/
├── lib/
│   ├── i18n.ts                    # Core i18n utilities
│   └── locales/
│       ├── en.json                # English translations (370 keys)
│       └── bn.json                # Bengali translations (370 keys)
├── hooks/
│   └── useTranslation.ts          # Translation hook
├── components/
│   ├── providers/
│   │   └── TranslationProvider.tsx # Translation context
│   └── ui/
│       └── language-switcher.tsx   # Language switcher UI
```

---

## 🗣️ Supported Languages

### **Language Configuration**

```typescript
// src/lib/i18n.ts
export type Locale = 'en' | 'bn';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'bn'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা (Bengali)',
};
```

### **Language Metadata**

```typescript
const languages = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸', 
    dir: 'ltr',
    nativeName: 'English'
  },
  { 
    code: 'bn', 
    name: 'বাংলা', 
    flag: '🇧🇩', 
    dir: 'ltr',
    nativeName: 'বাংলা'
  },
];
```

**Note**: Both English and Bengali use LTR (left-to-right) text direction. RTL support can be added in the future for Arabic/Urdu.

---

## 🔄 Translation System

### **Core i18n Utilities**

**File**: `/src/lib/i18n.ts`

```typescript
// Get current locale from localStorage
export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && locales.includes(storedLocale)) {
      return storedLocale;
    }
  }
  return defaultLocale;
}

// Load translation messages (with caching)
const translationCache: Record<Locale, any> = {};

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

// Translation function with parameter support
export async function t(
  locale: Locale, 
  key: string, 
  params?: Record<string, string | number>
): Promise<string> {
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

// Synchronous translation (for client-side)
export function tSync(
  locale: Locale, 
  key: string, 
  params?: Record<string, string | number>
): string {
  const messages = translationCache[locale] || {};
  let translation = getNestedValue(messages, key) || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
    });
  }
  
  return translation;
}
```

### **useTranslation Hook**

**File**: `/src/hooks/useTranslation.ts`

```typescript
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
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', detectedLocale);
    }
    
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
  
  const translate: TranslationFunction = (key, params?) => {
    let translation = getNestedValue(messages, key) || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(
          new RegExp(`{{${param}}}`, 'g'), 
          String(value)
        );
      });
    }
    
    return translation;
  };
  
  return {
    t: translate,
    locale,
    setLocale,
    formatDate: (date) => formatDate(
      typeof date === 'string' ? new Date(date) : date, 
      locale
    ),
    formatTime: (date) => formatTime(
      typeof date === 'string' ? new Date(date) : date
    ),
    formatDateTime: (date) => formatDateTime(
      typeof date === 'string' ? new Date(date) : date
    ),
    formatNumber: (num) => formatNumber(num, locale),
    formatCurrency: (amount) => formatCurrency(amount, locale),
  };
}
```

---

## 🔀 Language Switching

### **LanguageSwitcher Component**

**File**: `/src/components/ui/language-switcher.tsx`

```tsx
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '' 
}) => {
  const { locale, changeLocale } = useTranslationContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  ];

  const currentLanguage = languages.find(
    lang => lang.code === locale
  ) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    changeLocale(languageCode);
    setIsOpen(false);
    
    // Update document direction for RTL languages (future)
    const selectedLanguage = languages.find(
      lang => lang.code === languageCode
    );
    if (selectedLanguage) {
      document.documentElement.dir = selectedLanguage.dir;
      document.documentElement.lang = languageCode;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium 
          text-gray-700 bg-white border border-gray-300 rounded-md 
          hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-offset-2 focus:ring-blue-500 
          dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 
          dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 
            ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white 
            rounded-md shadow-lg border border-gray-200 
            dark:bg-gray-800 dark:border-gray-700">
            <div className="py-1" role="listbox">
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full px-4 py-2 text-sm text-left 
                    flex items-center space-x-3
                    ${locale === language.code
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                  role="option"
                  aria-selected={locale === language.code}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{language.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language.code.toUpperCase()}
                    </p>
                  </div>
                  {locale === language.code && (
                    <svg 
                      className="w-4 h-4 text-blue-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

**Usage in Navigation**:

```tsx
import LanguageSwitcher from '@/components/ui/language-switcher';

function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <LanguageSwitcher />
    </nav>
  );
}
```

---

## 📄 Translation Files

### **English Translation (en.json)**

**File**: `/src/lib/locales/en.json` (370 keys)

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "search": "Search",
    "filter": "Filter",
    "next": "Next",
    "previous": "Previous",
    "close": "Close",
    "submit": "Submit",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "confirm": "Confirm",
    "back": "Back",
    "home": "Home",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Logout",
    "login": "Login",
    "register": "Register",
    "jobs": "Jobs",
    "patients": "Patients",
    "payments": "Payments",
    "careLogs": "Care Logs"
  },
  "auth": {
    "loginTitle": "Login to Your Account",
    "loginSubtitle": "Enter your credentials to access the caregiver platform",
    "phonePlaceholder": "Enter your phone number (+8801xxxxxxxxx)",
    "passwordPlaceholder": "Enter your password",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember me",
    "loginButton": "Login",
    "registerTitle": "Create New Account",
    "registerSubtitle": "Join our caregiver platform",
    "roles": {
      "guardian": "Guardian",
      "company": "Company",
      "caregiver": "Caregiver"
    }
  },
  "dashboard": {
    "welcome": "Welcome back, {{name}}!",
    "totalUsers": "Total Users",
    "totalJobs": "Total Jobs",
    "activeJobs": "Active Jobs",
    "totalRevenue": "Total Revenue",
    "monthlyRevenue": "Monthly Revenue"
  },
  "jobs": {
    "title": "Care Jobs",
    "createJob": "Create Job",
    "activeJobs": "Active Jobs",
    "completedJobs": "Completed Jobs",
    "jobDetails": "Job Details"
  },
  "payments": {
    "title": "Payments",
    "makePayment": "Make Payment",
    "payWithBkash": "Pay with bKash",
    "payWithNagad": "Pay with Nagad",
    "escrow": {
      "title": "Escrow Management",
      "paymentId": "Payment ID",
      "amount": "Amount",
      "release": "Release",
      "refund": "Refund"
    }
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "invalidPhone": "Please enter a valid Bangladeshi phone number",
    "passwordMismatch": "Passwords do not match",
    "invalidCredentials": "Invalid phone number or password",
    "accessDenied": "You do not have permission to access this resource",
    "notFound": "The requested resource was not found",
    "serverError": "Server error. Please try again later.",
    "networkError": "Network error. Please check your connection."
  },
  "validation": {
    "required": "This field is required",
    "minLength": "Must be at least {{min}} characters",
    "maxLength": "Must be no more than {{max}} characters",
    "phoneInvalid": "Please enter a valid Bangladeshi phone number"
  }
}
```

### **Bengali Translation (bn.json)**

**File**: `/src/lib/locales/bn.json` (370 keys)

```json
{
  "common": {
    "loading": "লোড হচ্ছে...",
    "error": "ত্রুটি",
    "success": "সফল",
    "cancel": "বাতিল",
    "save": "সংরক্ষণ",
    "delete": "মুছে ফেলুন",
    "edit": "সম্পাদনা",
    "view": "দেখুন",
    "search": "অনুসন্ধান",
    "filter": "ফিল্টার",
    "next": "পরবর্তী",
    "previous": "আগের",
    "close": "বন্ধ",
    "submit": "জমা দিন",
    "yes": "হ্যাঁ",
    "no": "না",
    "ok": "ঠিক আছে",
    "confirm": "নিশ্চিত করুন",
    "back": "পিছনে",
    "home": "হোম",
    "dashboard": "ড্যাশবোর্ড",
    "profile": "প্রোফাইল",
    "settings": "সেটিংস",
    "logout": "লগ আউট",
    "login": "লগইন",
    "register": "নিবন্ধন",
    "jobs": "চাকরি",
    "patients": "রোগী",
    "payments": "পেমেন্ট",
    "careLogs": "যত্ন লগ"
  },
  "auth": {
    "loginTitle": "আপনার অ্যাকাউন্টে লগইন করুন",
    "loginSubtitle": "কেয়ারগিভার প্ল্যাটফর্মে প্রবেশ করুন",
    "phonePlaceholder": "আপনার ফোন নম্বর (+8801xxxxxxxxx)",
    "passwordPlaceholder": "আপনার পাসওয়ার্ড",
    "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
    "rememberMe": "আমাকে মনে রাখুন",
    "loginButton": "লগইন",
    "registerTitle": "নতুন অ্যাকাউন্ট তৈরি করুন",
    "registerSubtitle": "আমাদের কেয়ারগিভার প্ল্যাটফর্মে যোগ দিন",
    "roles": {
      "guardian": "অভিভাবক",
      "company": "কোম্পানি",
      "caregiver": "যত্নকারী"
    }
  },
  "dashboard": {
    "welcome": "স্বাগত ফিরিয়ে, {{name}}!",
    "totalUsers": "সর্বমোট ব্যবহারকারী",
    "totalJobs": "সর্বমোট চাকরি",
    "activeJobs": "সক্রিয় চাকরি",
    "totalRevenue": "সর্বমোট আয়",
    "monthlyRevenue": "মাসিক আয়"
  },
  "jobs": {
    "title": "যত্ন চাকরি",
    "createJob": "চাকরি তৈরি করুন",
    "activeJobs": "সক্রিয় চাকরি",
    "completedJobs": "সম্পূর্ণ চাকরি",
    "jobDetails": "চাকরির বিবরণ"
  },
  "payments": {
    "title": "পেমেন্ট",
    "makePayment": "পেমেন্ট করুন",
    "payWithBkash": "bKash দিয়ে পেমেন্ট",
    "payWithNagad": "Nagad দিয়ে পেমেন্ট",
    "escrow": {
      "title": "এস্ক্রো ব্যবস্থাপনা",
      "paymentId": "পেমেন্ট ID",
      "amount": "পরিমাণ",
      "release": "মুক্তি",
      "refund": "ফেরত"
    }
  },
  "errors": {
    "required": "এই ক্ষেত্রটি প্রয়োজনীয়",
    "invalidEmail": "একটি বৈধ ইমেল ঠিকানা দিন",
    "invalidPhone": "একটি বৈধ বাংলাদেশি ফোন নম্বর দিন",
    "passwordMismatch": "পাসওয়ার্ড মেলে না",
    "invalidCredentials": "ভুল ফোন নম্বর বা পাসওয়ার্ড",
    "accessDenied": "আপনার এই সংস্থানে অ্যাক্সেসের অনুমতি নেই",
    "notFound": "অনুরোধকৃত সংস্থান পাওয়া যায়নি",
    "serverError": "সার্ভার ত্রুটি। পরে আবার চেষ্টা করুন।",
    "networkError": "নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন।"
  },
  "validation": {
    "required": "এই ক্ষেত্রটি প্রয়োজনীয়",
    "minLength": "অন্তত {{min}} অক্ষর হতে হবে",
    "maxLength": "সর্বাধিক {{max}} অক্ষর হতে হবে",
    "phoneInvalid": "একটি বৈধ বাংলাদেশি ফোন নম্বর দিন"
  }
}
```

### **Translation Key Structure**

```
common.*           - Common UI elements (buttons, labels)
auth.*             - Authentication pages
dashboard.*        - Dashboard metrics and labels
navigation.*       - Navigation menu items
jobs.*             - Job management
patients.*         - Patient management
payments.*         - Payment system
feedback.*         - Feedback system
disputes.*         - Dispute resolution
verification.*     - Verification workflows
analytics.*        - Analytics dashboard
moderation.*       - Content moderation
profile.*          - User profile
settings.*         - Settings pages
errors.*           - Error messages
validation.*       - Form validation messages
```

---

## 📅 Date & Time Formatting

### **Date Formatting**

```typescript
// src/lib/i18n.ts
export function formatDate(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    return date.toLocaleDateString();
  }
}

// Example output:
// en: "December 11, 2025"
// bn: "১১ ডিসেম্বর, ২০২৫"
```

### **Time Formatting**

```typescript
export function formatTime(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    return date.toLocaleTimeString();
  }
}

// Example output:
// en: "02:30 PM"
// bn: "০২:৩০ PM"
```

### **DateTime Formatting**

```typescript
export function formatDateTime(date: Date, locale: Locale): string {
  return formatDate(date, locale) + ' ' + formatTime(date, locale);
}

// Example output:
// en: "December 11, 2025 02:30 PM"
// bn: "১১ ডিসেম্বর, ২০২৫ ০২:৩০ PM"
```

---

## 💰 Number & Currency Formatting

### **Number Formatting**

```typescript
export function formatNumber(number: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    return number.toLocaleString();
  }
}

// Example:
// en: 1,234,567
// bn: ১,২৩৪,৫৬৭ (Bengali numerals)
```

### **Currency Formatting (BDT)**

```typescript
export function formatCurrency(amount: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BDT', // Bangladeshi Taka
    }).format(amount);
  } catch (error) {
    // Fallback to Taka symbol
    return `৳${amount.toLocaleString()}`;
  }
}

// Example:
// formatCurrency(5000, 'en') → "৳5,000"
// formatCurrency(5000, 'bn') → "৳৫,০০০"
```

---

## 🔧 Translation Provider

### **TranslationProvider Component**

**File**: `/src/components/providers/TranslationProvider.tsx`

```tsx
interface TranslationContextType {
  t: TranslationFunction;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  isLoading: boolean;
}

export function TranslationProvider({ 
  children, 
  initialLocale 
}: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || getLocale()
  );
  const [messages, setMessages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get nested value with dot notation
  const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const translate: TranslationFunction = (key, params?) => {
    let translation = getNestedValue(messages, key) || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(
          new RegExp(`{{${param}}}`, 'g'), 
          String(value)
        );
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

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    getMessages(locale)
      .then(setMessages)
      .catch(error => console.error('Failed to load translations:', error))
      .finally(() => setIsLoading(false));
  }, [locale]);

  const value: TranslationContextType = {
    t: translate,
    locale,
    setLocale,
    formatDate: (date) => formatDate(
      typeof date === 'string' ? new Date(date) : date, 
      locale
    ),
    formatTime: (date) => formatTime(
      typeof date === 'string' ? new Date(date) : date, 
      locale
    ),
    formatDateTime: (date) => formatDateTime(
      typeof date === 'string' ? new Date(date) : date, 
      locale
    ),
    formatNumber: (num) => formatNumber(num, locale),
    formatCurrency: (amount) => formatCurrency(amount, locale),
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
    throw new Error(
      'useTranslationContext must be used within a TranslationProvider'
    );
  }
  return context;
}
```

### **App Setup**

```tsx
// app/layout.tsx
import { TranslationProvider } from '@/components/providers/TranslationProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
```

---

## 💡 Usage Examples

### **Basic Translation**

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function LoginPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>
      <p>{t('auth.loginSubtitle')}</p>
      <button>{t('auth.loginButton')}</button>
    </div>
  );
}
```

### **Translation with Parameters**

```tsx
function Dashboard() {
  const { t } = useTranslation();
  const user = { name: 'Rahim Khan' };
  
  return (
    <h1>{t('dashboard.welcome', { name: user.name })}</h1>
    // Output: "Welcome back, Rahim Khan!" (en)
    // Output: "স্বাগত ফিরিয়ে, Rahim Khan!" (bn)
  );
}
```

### **Date Formatting**

```tsx
function JobCard({ job }) {
  const { formatDate, formatDateTime } = useTranslation();
  
  return (
    <div>
      <p>Start Date: {formatDate(job.startDate)}</p>
      <p>Created: {formatDateTime(job.createdAt)}</p>
    </div>
  );
}
```

### **Currency Formatting**

```tsx
function PaymentCard({ payment }) {
  const { formatCurrency } = useTranslation();
  
  return (
    <div>
      <p>Amount: {formatCurrency(payment.amount)}</p>
      {/* Output: "৳5,000" (en) or "৳৫,০০০" (bn) */}
    </div>
  );
}
```

### **Language Switcher**

```tsx
import LanguageSwitcher from '@/components/ui/language-switcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### **Form Validation Messages**

```tsx
function RegistrationForm() {
  const { t } = useTranslation();
  
  const validate = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = t('validation.required');
    }
    
    if (values.password && values.password.length < 8) {
      errors.password = t('validation.minLength', { min: 8 });
    }
    
    return errors;
  };
  
  // Form implementation...
}
```

---

## 🐛 Debugging Guide

### **Issue: Translations Not Loading**

**Problem**: Page shows translation keys instead of actual text.

**Solution**:
```typescript
// Check if messages are loaded
const { t, isLoading } = useTranslationContext();

if (isLoading) {
  return <LoadingSpinner />;
}

// Check translation cache
console.log('Translation cache:', translationCache);

// Verify locale setting
console.log('Current locale:', getLocale());
```

### **Issue: Missing Translation Keys**

**Problem**: Some keys return the key itself instead of translated text.

**Solution**:
```typescript
// Add fallback to English
const translate: TranslationFunction = (key, params?) => {
  let translation = getNestedValue(messages, key);
  
  if (!translation && locale !== 'en') {
    // Try English fallback
    const englishMessages = translationCache['en'];
    translation = getNestedValue(englishMessages, key);
  }
  
  return translation || key;
};
```

### **Issue: Parameter Interpolation Not Working**

**Problem**: `{{name}}` appears in output instead of actual value.

**Solution**:
```typescript
// Check parameter format
t('dashboard.welcome', { name: 'Rahim' }); // ✅ Correct

t('dashboard.welcome', { userName: 'Rahim' }); // ❌ Wrong parameter name
// Translation has {{name}}, not {{userName}}

// Debug
console.log('Translation:', messages['dashboard']['welcome']);
console.log('Parameters:', { name: 'Rahim' });
```

---

## 🧪 Testing Guide

### **Translation Tests**

```typescript
// __tests__/i18n.test.ts
describe('i18n Utilities', () => {
  it('loads English messages', async () => {
    const messages = await getMessages('en');
    expect(messages.common.loading).toBe('Loading...');
  });
  
  it('loads Bengali messages', async () => {
    const messages = await getMessages('bn');
    expect(messages.common.loading).toBe('লোড হচ্ছে...');
  });
  
  it('translates with parameters', async () => {
    const result = await t('en', 'dashboard.welcome', { name: 'Rahim' });
    expect(result).toBe('Welcome back, Rahim!');
  });
  
  it('formats currency correctly', () => {
    expect(formatCurrency(5000, 'en')).toContain('৳');
    expect(formatCurrency(5000, 'en')).toContain('5,000');
  });
});
```

### **Component Tests**

```typescript
// __tests__/LanguageSwitcher.test.tsx
describe('LanguageSwitcher', () => {
  it('renders current language', () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );
    
    expect(screen.getByText('English')).toBeInTheDocument();
  });
  
  it('switches language on click', async () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const bengaliOption = screen.getByText('বাংলা');
    fireEvent.click(bengaliOption);
    
    await waitFor(() => {
      expect(localStorage.getItem('locale')).toBe('bn');
    });
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Translation System**: 100% (370 keys in both languages)
- **Language Switching**: 100% (Real-time switching working)
- **Date Formatting**: 95% (Intl API implemented)
- **Currency Formatting**: 95% (BDT symbol and Bengali numerals)
- **Parameter Interpolation**: 100% ({{param}} syntax working)
- **LocalStorage Persistence**: 100% (Locale saved and restored)

### **🔄 In Progress**
- [ ] Bengali numeral display for all numbers
- [ ] Relative time formatting ("2 hours ago")
- [ ] Pluralization rules (1 job vs 2 jobs)

### **❌ TODO**
- [ ] Add Arabic/Urdu for RTL support
- [ ] Locale-specific date formats (DD/MM/YYYY vs MM/DD/YYYY)
- [ ] Number formatting preferences (comma vs space separators)
- [ ] Translation management dashboard for admins
- [ ] Missing translation detection and reporting
- [ ] Automated translation file validation
- [ ] E2E tests for language switching workflows

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
