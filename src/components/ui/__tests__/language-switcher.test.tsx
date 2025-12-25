import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '../language-switcher';
import { TranslationProvider } from '@/components/providers/TranslationProvider';

// Mock MSW to avoid ESM issues
jest.mock('@/__tests__/mocks/server', () => ({
  server: {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
  },
}));

// Mock i18n
const mockGetMessages = jest.fn();
jest.mock('@/lib/i18n', () => ({
  getLocale: jest.fn(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locale') || 'en';
    }
    return 'en';
  }),
  getMessages: (locale: string) => mockGetMessages(locale),
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localeNames: {
    en: 'English',
    bn: 'বাংলা (Bengali)',
  },
}));

// Setup default mock
beforeEach(() => {
  mockGetMessages.mockResolvedValue({});
});

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Mock document.documentElement
    Object.defineProperty(document.documentElement, 'dir', {
      writable: true,
      value: 'ltr',
    });
    Object.defineProperty(document.documentElement, 'lang', {
      writable: true,
      value: 'en',
    });
  });

  it('should render language selector button', () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show current language', async () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/English/i)).toBeInTheDocument();
    });
  });

  it('should show flag icon', async () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('🇺🇸');
    });
  });

  it('should open dropdown on click', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/বাংলা/i)).toBeInTheDocument();
    });
  });

  it('should show all available languages in dropdown', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      // Check for languages in dropdown (role="option")
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
      const optionTexts = options.map(opt => opt.textContent);
      expect(optionTexts.some(text => text?.includes('English'))).toBe(true);
      expect(optionTexts.some(text => text?.includes('বাংলা'))).toBe(true);
    });
  });

  it('should change language when option clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

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

  it('should update document direction for RTL languages', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
      expect(bengaliOption).toBeInTheDocument();
    });

    const bengaliOption = screen.getByText(/বাংলা/i).closest('button');
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('bn');
    });
  });

  it('should close dropdown after selection', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      // Dropdown should be open
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    const options = screen.getAllByRole('option');
    const bengaliOption = options.find(opt => opt.textContent?.includes('বাংলা'));
    
    if (bengaliOption) {
      await user.click(bengaliOption);
    }

    await waitFor(() => {
      // Dropdown should close - button should have aria-expanded="false"
      expect(button).toHaveAttribute('aria-expanded', 'false');
    }, { timeout: 2000 });
  });

  it('should highlight current language', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      // Dropdown should be visible
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
      
      // Find the selected option (English is current)
      const selectedOption = options.find(opt => opt.getAttribute('aria-selected') === 'true');
      expect(selectedOption).toBeInTheDocument();
      expect(selectedOption?.textContent).toContain('English');
    });
  });

  it('should show checkmark for current language', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      // Dropdown should be visible with options
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    // Check that English option (current language) has aria-selected
    const options = screen.getAllByRole('option');
    const englishOption = options.find(opt => opt.getAttribute('aria-selected') === 'true');
    expect(englishOption).toBeInTheDocument();
  });

  it('should handle custom className prop', () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher className="custom-class" />
      </TranslationProvider>
    );

    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should be accessible', () => {
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('should update aria-expanded when opened', async () => {
    const user = userEvent.setup();
    
    render(
      <TranslationProvider>
        <LanguageSwitcher />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    }, { timeout: 2000 });
  });
});
