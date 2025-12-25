/**
 * Test Fixtures for Translation Files
 * Matches the structure expected by the translation system
 */

export const validEnglishTranslations = {
  metadata: {
    languageCode: 'en',
    languageName: 'English',
    version: '1.0',
    lastUpdated: '2024-01-01',
  },
  translations: {
    common: {
      login: 'Login',
      register: 'Register',
      home: 'Home',
      welcome: 'Welcome',
    },
    home: {
      title: 'CareNet',
      tagline: 'Quality care, connected',
      description: 'Bangladesh\'s trusted platform for connecting families with verified caregivers',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
    },
  },
};

export const validBengaliTranslations = {
  metadata: {
    languageCode: 'bn',
    languageName: 'বাংলা (Bengali)',
    version: '1.0',
    lastUpdated: '2024-01-01',
  },
  translations: {
    common: {
      login: 'লগইন',
      register: 'নিবন্ধন',
      home: 'হোম',
      welcome: 'স্বাগতম',
    },
    home: {
      title: 'কেয়ারনেট',
      tagline: 'মানসম্মত যত্ন, সংযুক্ত',
      description: 'যাচাইকৃত যত্নশীল এবং পেশাদার সংস্থাগুলির সাথে পরিবারগুলিকে সংযুক্ত করার জন্য বাংলাদেশের বিশ্বস্ত প্ল্যাটফর্ম',
    },
    auth: {
      email: 'ইমেইল',
      password: 'পাসওয়ার্ড',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    },
  },
};

export const invalidTranslations = {
  // Missing metadata
  translations: {
    common: {
      login: 'Login',
    },
  },
};

export const incompleteTranslations = {
  metadata: {
    languageCode: 'hi',
    languageName: 'Hindi',
    version: '1.0',
  },
  translations: {
    // Missing common.login, common.register, etc.
    home: {
      title: 'CareNet',
    },
  },
};

export const extraKeysTranslations = {
  metadata: {
    languageCode: 'hi',
    languageName: 'Hindi',
    version: '1.0',
  },
  translations: {
    common: {
      login: 'लॉगिन',
      register: 'पंजीकरण',
      // Extra key not in master
      extraKey: 'Extra Value',
    },
    home: {
      title: 'CareNet',
    },
  },
};
