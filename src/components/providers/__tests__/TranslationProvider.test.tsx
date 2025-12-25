import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { TranslationProvider, useTranslationContext } from '../TranslationProvider';
import { getLocale, getMessages } from '@/lib/i18n';

// Mock MSW to avoid ESM issues
jest.mock('@/__tests__/mocks/server', () => ({
  server: {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
  },
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  getLocale: jest.fn(),
  getMessages: jest.fn(),
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localeNames: {
    en: 'English',
    bn: 'বাংলা (Bengali)',
  },
}));

const mockGetLocale = getLocale as jest.MockedFunction<typeof getLocale>;
const mockGetMessages = getMessages as jest.MockedFunction<typeof getMessages>;

// Test component that uses the context
function TestComponent() {
  const { t, locale, setLocale, isLoading } = useTranslationContext();
  
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="isLoading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="translation">{t('test.key')}</div>
      <button onClick={() => setLocale('bn')} data-testid="set-bn">
        Set Bengali
      </button>
    </div>
  );
}

describe('TranslationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLocale.mockReturnValue('en');
    mockGetMessages.mockResolvedValue({
      test: {
        key: 'Test Value',
      },
    });
  });

  it('should provide current language', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });

  it('should load messages on mount', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(mockGetMessages).toHaveBeenCalledWith('en');
    });
  });

  it('should show loading state initially', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    expect(screen.getByTestId('isLoading')).toHaveTextContent('loading');
  });

  it('should hide loading state after messages load', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoading')).toHaveTextContent('loaded');
    });
  });

  it('should translate keys correctly', async () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('translation')).toHaveTextContent('Test Value');
    });
  });

  it('should change language when setLocale called', async () => {
    mockGetMessages.mockResolvedValue({
      test: {
        key: 'Test Value BN',
      },
    });

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });

    act(() => {
      screen.getByTestId('set-bn').click();
    });

    await waitFor(() => {
      expect(mockGetMessages).toHaveBeenCalledWith('bn');
      expect(screen.getByTestId('locale')).toHaveTextContent('bn');
    });
  });

  it('should persist language to localStorage', async () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });

    act(() => {
      screen.getByTestId('set-bn').click();
    });

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('locale', 'bn');
    });
  });

  it('should load language from localStorage on mount', async () => {
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('bn'),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    mockGetMessages.mockResolvedValue({ test: { key: 'Test' } });

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('bn');
    });
  });

  it('should fallback to default language if localStorage invalid', async () => {
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('invalid'),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    mockGetMessages.mockResolvedValue({ test: { key: 'Test' } });

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      // Should fallback to default (en) when invalid locale in localStorage
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });

  it('should handle interpolation in translations', async () => {
    mockGetMessages.mockResolvedValue({
      greeting: 'Hello {{name}}',
    });

    function InterpolationTest() {
      const { t } = useTranslationContext();
      return <div data-testid="greeting">{t('greeting', { name: 'John' })}</div>;
    }

    render(
      <TranslationProvider>
        <InterpolationTest />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello John');
    });
  });

  it('should return key if translation missing', async () => {
    mockGetMessages.mockResolvedValue({});

    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('translation')).toHaveTextContent('test.key');
    });
  });

  it('should handle nested keys', async () => {
    mockGetMessages.mockResolvedValue({
      level1: {
        level2: {
          level3: 'Nested Value',
        },
      },
    });

    function NestedTest() {
      const { t } = useTranslationContext();
      return <div data-testid="nested">{t('level1.level2.level3')}</div>;
    }

    render(
      <TranslationProvider>
        <NestedTest />
      </TranslationProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nested')).toHaveTextContent('Nested Value');
    });
  });

  it('should format dates correctly', async () => {
    function DateTest() {
      const { formatDate } = useTranslationContext();
      const date = new Date('2024-01-15');
      return <div data-testid="date">{formatDate(date)}</div>;
    }

    render(
      <TranslationProvider>
        <DateTest />
      </TranslationProvider>
    );

    await waitFor(() => {
      const dateText = screen.getByTestId('date').textContent;
      expect(dateText).toBeTruthy();
      expect(typeof dateText).toBe('string');
    });
  });

  it('should format currency correctly', async () => {
    function CurrencyTest() {
      const { formatCurrency } = useTranslationContext();
      return <div data-testid="currency">{formatCurrency(1000)}</div>;
    }

    render(
      <TranslationProvider>
        <CurrencyTest />
      </TranslationProvider>
    );

    await waitFor(() => {
      const currencyText = screen.getByTestId('currency').textContent;
      expect(currencyText).toBeTruthy();
      expect(typeof currencyText).toBe('string');
    });
  });
});
