import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import LanguageSwitcher from '@/components/ui/language-switcher';

// Mock MSW to avoid ESM issues
jest.mock('@/__tests__/mocks/server', () => ({
  server: {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
  },
}));

// Mock i18n
const mockMessages = {
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      home: 'Home',
    },
    home: {
      title: 'CareNet',
      tagline: 'Quality care, connected',
    },
  },
  bn: {
    common: {
      welcome: 'স্বাগতম',
      login: 'লগইন',
      home: 'হোম',
    },
    home: {
      title: 'কেয়ারনেট',
      tagline: 'মানসম্মত যত্ন, সংযুক্ত',
    },
  },
};

jest.mock('@/lib/i18n', () => ({
  getLocale: jest.fn(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locale') || 'en';
    }
    return 'en';
  }),
  getMessages: jest.fn((locale: string) => {
    return Promise.resolve(mockMessages[locale as keyof typeof mockMessages] || mockMessages.en);
  }),
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localeNames: {
    en: 'English',
    bn: 'বাংলা (Bengali)',
  },
}));

// Test component that uses translations
function TestComponent() {
  const { t } = require('@/components/providers/TranslationProvider').useTranslationContext();
  
  return (
    <div>
      <h1 data-testid="title">{t('home.title')}</h1>
      <p data-testid="tagline">{t('home.tagline')}</p>
      <button data-testid="login-button">{t('common.login')}</button>
    </div>
  );
}

describe('Language Switching Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display English by default', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('CareNet');
      expect(screen.getByTestId('tagline')).toHaveTextContent('Quality care, connected');
      expect(screen.getByTestId('login-button')).toHaveTextContent('Login');
    });
  });

  it('should switch to Bengali when language changed', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
        <TestComponent />
      </TranslationProvider>
    );

    // Initially in English
    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('CareNet');
    });

    // Click language selector
    const languageButton = screen.getByRole('button');
    await user.click(languageButton);

    // Select Bengali
    await waitFor(() => {
      const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
      expect(bengaliOption).toBeInTheDocument();
    });

    const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    // Wait for translations to update
    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('কেয়ারনেট');
      expect(screen.getByTestId('tagline')).toHaveTextContent('মানসম্মত যত্ন, সংযুক্ত');
      expect(screen.getByTestId('login-button')).toHaveTextContent('লগইন');
    }, { timeout: 3000 });
  });

  it('should persist language preference in localStorage', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    const languageButton = screen.getByRole('button');
    await user.click(languageButton);

    await waitFor(() => {
      const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
      expect(bengaliOption).toBeInTheDocument();
    });

    const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    await waitFor(() => {
      expect(localStorage.getItem('locale')).toBe('bn');
    });
  });

  it('should restore language from localStorage on reload', async () => {
    // Set language in localStorage
    localStorage.setItem('locale', 'bn');

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('কেয়ারনেট');
    });
  });

  it('should switch back to English from Bengali', async () => {
    const user = userEvent.setup();
    
    // Start with Bengali
    localStorage.setItem('locale', 'bn');

    render(
      <TranslationProvider>
        <LanguageSwitcher />
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('কেয়ারনেট');
    });

    // Switch back to English
    const languageButton = screen.getByRole('button');
    await user.click(languageButton);

    await waitFor(() => {
      const englishOption = screen.getByText(/English/i).closest('button');
      expect(englishOption).toBeInTheDocument();
    });

    const englishOption = screen.getByText(/English/i).closest('button');
    if (englishOption) {
      await user.click(englishOption);
    }

    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('CareNet');
    });
  });

  it('should update all text elements when language changes', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
        <TestComponent />
      </TranslationProvider>
    );

    // Verify initial English
    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('CareNet');
      expect(screen.getByTestId('tagline')).toHaveTextContent('Quality care, connected');
      expect(screen.getByTestId('login-button')).toHaveTextContent('Login');
    });

    // Switch to Bengali
    const languageButton = screen.getByRole('button');
    await user.click(languageButton);

    await waitFor(() => {
      const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
      expect(bengaliOption).toBeInTheDocument();
    });

    const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    // All elements should update
    await waitFor(() => {
      expect(screen.getByTestId('title')).toHaveTextContent('কেয়ারনেট');
      expect(screen.getByTestId('tagline')).toHaveTextContent('মানসম্মত যত্ন, সংযুক্ত');
      expect(screen.getByTestId('login-button')).toHaveTextContent('লগইন');
    }, { timeout: 3000 });
  });

  it('should handle missing translations gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock missing translation
    const mockMessagesWithMissing = {
      ...mockMessages,
      bn: {
        ...mockMessages.bn,
        home: {
          title: 'কেয়ারনেট',
          // tagline missing
        },
      },
    };

    jest.spyOn(require('@/lib/i18n'), 'getMessages').mockImplementation((locale: string) => {
      return Promise.resolve(mockMessagesWithMissing[locale as keyof typeof mockMessagesWithMissing] || mockMessagesWithMissing.en);
    });

    render(
      <TranslationProvider>
        <LanguageSwitcher />
        <TestComponent />
      </TranslationProvider>
    );

    // Switch to Bengali
    const languageButton = screen.getByRole('button');
    await user.click(languageButton);

    await waitFor(() => {
      const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
      expect(bengaliOption).toBeInTheDocument();
    });

    const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    await waitFor(() => {
      // Should show key or fallback, not crash
      const tagline = screen.getByTestId('tagline');
      expect(tagline.textContent).toBeTruthy();
    });
  });
});
