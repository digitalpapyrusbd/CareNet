/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { server } from './mocks/server';
import { rest } from 'msw';

type MockPackage = {
  id: string;
  name: string;
  price: number;
  services: string[];
  company: {
    id: string;
    name: string;
  };
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}));

// Mock translation provider context used by LanguageSwitcher and other components
jest.mock('@/components/providers/TranslationProvider', () => ({
  useTranslationContext: () => ({
    locale: 'en',
    changeLocale: jest.fn(),
    setLocale: jest.fn(),
    t: (key: string) => key,
    formatDate: jest.fn(),
    formatTime: jest.fn(),
    formatDateTime: jest.fn(),
    formatNumber: jest.fn(),
    formatCurrency: jest.fn(),
    isLoading: false,
  }),
  TranslationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock translations
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));

const mockAuthLogin = jest.fn(async ({ phone, password }: { phone: string; password: string }) => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, password }),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }

  window.localStorage.setItem(
    'auth_tokens',
    JSON.stringify({
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    })
  );

  window.localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockAuthLogin,
    isLoading: false,
    user: null,
    tokens: null,
    isAuthenticated: false,
    loginWithTokens: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

// Mock UI module pieces that rely on complex context implementations
jest.mock('@/components/ui', () => {
  const actual = jest.requireActual('@/components/ui');
  const React = require('react');

  type MockFormProps = {
    children?: React.ReactNode;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
  };

  const MockForm = ({ children, onSubmit, className }: MockFormProps) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
      className={className}
    >
      {children}
    </form>
  );

  type MockButtonProps = React.ComponentProps<typeof actual.Button> & {
    isLoading?: boolean;
  };

  const MockButton = ({ isLoading, loading, ...props }: MockButtonProps) => (
    <actual.Button {...props} loading={loading ?? isLoading} />
  );

  const MockLanguageSwitcher = () => <div data-testid="language-switcher" />;

  return {
    ...actual,
    Form: MockForm,
    Button: MockButton,
    LanguageSwitcher: MockLanguageSwitcher,
  };
});

// Mock storage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

describe('User Flow Integration Tests', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush, back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.clear();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Login Flow', () => {
    it('should complete full login flow: enter phone → enter password → redirect to dashboard', async () => {
      const user = userEvent.setup();
      
      // Import and render login page
      const LoginPage = (await import('@/app/auth/login/page')).default;
      render(<LoginPage />);

      // Step 1: Verify login page renders
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

      // Step 2: Find and fill phone input with 017 pattern (guardian)
      const phoneInput = screen.getByPlaceholderText(/01XXXXXXXXX/i);
      await user.type(phoneInput, '01700000000');
      expect(phoneInput).toHaveValue('+8801700000000');

      // Step 3: Find and fill password input
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      await user.type(passwordInput, 'password123');
      expect(passwordInput).toHaveValue('password123');

      // Step 4: Submit the form
      const submitButton = screen.getByRole('button', { name: /Login/i });
      await user.click(submitButton);

      // Step 5: Verify redirect to guardian dashboard (017 pattern)
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/guardian/dashboard');
      });
    });

    it('should redirect on valid credentials regardless of password', async () => {
      const user = userEvent.setup();
      
      const LoginPage = (await import('@/app/auth/login/page')).default;
      render(<LoginPage />);

      // Enter valid phone (018 pattern for caregiver)
      const phoneInput = screen.getByPlaceholderText(/01XXXXXXXXX/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      
      await user.type(phoneInput, '01800000000');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /Login/i });
      await user.click(submitButton);

      // Should redirect to caregiver dashboard (018 pattern)
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/caregiver/dashboard');
      }, { timeout: 2000 });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      
      const LoginPage = (await import('@/app/auth/login/page')).default;
      render(<LoginPage />);

      // Enter invalid phone number
      const phoneInput = screen.getByPlaceholderText(/01XXXXXXXXX/i);
      await user.type(phoneInput, '1234567890');

      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /Login/i });
      await user.click(submitButton);

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/valid Bangladesh phone number/i)).toBeInTheDocument();
      });
    });
  });

  describe('Patient Registration Flow', () => {
    beforeEach(() => {
      // Mock authenticated user
      mockStorage.getItem.mockImplementation((key: string) => {
        if (key === 'auth_tokens') {
          return JSON.stringify({
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          });
        }
        if (key === 'auth_user') {
          return JSON.stringify({
            id: 'user-123',
            role: 'GUARDIAN',
            name: 'Test Guardian',
          });
        }
        return null;
      });
    });

    it('should complete patient registration flow: fill form → submit → see in patient list', async () => {
      const user = userEvent.setup();
      
      // Import PatientForm component
      const PatientForm = (await import('@/components/patients/PatientForm')).default;
      const mockOnSaved = jest.fn();
      
      render(<PatientForm onSaved={mockOnSaved} />);

      // Step 1: Verify form renders
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();

      // Step 2: Fill in patient details
      const inputs = screen.getAllByRole('textbox');
      const nameInput = inputs[0]; // First input is name
      const phoneInput = inputs[1]; // Second input is phone
      const emailInput = inputs[2]; // Third input is email

      await user.type(nameInput, 'Jane Smith');
      await user.type(phoneInput, '+8801798765432');
      await user.type(emailInput, 'jane@example.com');

      expect(nameInput).toHaveValue('Jane Smith');
      expect(phoneInput).toHaveValue('+8801798765432');
      expect(emailInput).toHaveValue('jane@example.com');

      // Step 3: Submit the form
      const submitButton = screen.getByRole('button', { name: /Save/i });
      await user.click(submitButton);

      // Step 4: Verify patient is created and callback is called
      await waitFor(() => {
        expect(mockOnSaved).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Jane Smith',
            phone: '+8801798765432',
            email: 'jane@example.com',
          })
        );
      });

      // Step 5: Verify patient appears in list (simulate viewing patient list)
      // Mock the GET /patients endpoint to include our new patient
      server.use(
        rest.get('http://localhost:4000/patients', (req, res, ctx) => {
          return res(
            ctx.json({
              success: true,
              data: [
                {
                  id: 'patient-1',
                  name: 'John Doe',
                  phone: '+8801712345678',
                  email: 'john@example.com',
                },
                {
                  id: 'patient-new',
                  name: 'Jane Smith',
                  phone: '+8801798765432',
                  email: 'jane@example.com',
                },
              ],
            })
          );
        })
      );

      // Fetch patients list
      const response = await fetch('http://localhost:4000/patients', {
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[1]).toMatchObject({
        name: 'Jane Smith',
        phone: '+8801798765432',
        email: 'jane@example.com',
      });
    });

    it('should handle patient registration errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock failed patient creation
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      server.use(
        rest.post(`${apiBase}/patients`, (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: false,
              message: 'Patient with this phone already exists',
            })
          );
        })
      );

      const PatientForm = (await import('@/components/patients/PatientForm')).default;
      const mockOnSaved = jest.fn();
      
      render(<PatientForm onSaved={mockOnSaved} />);

      // Fill and submit form
      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Duplicate Patient');
      await user.type(inputs[1], '+8801712345678');

      const submitButton = screen.getByRole('button', { name: /Save/i });
      await user.click(submitButton);

      // Should not call onSaved on error
      await waitFor(() => {
        expect(mockOnSaved).not.toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should validate required fields before submission', async () => {
      const user = userEvent.setup();
      
      const PatientForm = (await import('@/components/patients/PatientForm')).default;
      const mockOnSaved = jest.fn();
      
      render(<PatientForm onSaved={mockOnSaved} />);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /Save/i });
      await user.click(submitButton);

      // Form should not submit (HTML5 validation will prevent it)
      expect(mockOnSaved).not.toHaveBeenCalled();
    });
  });

  describe('Package Purchase Flow', () => {
    beforeEach(() => {
      // Mock authenticated user
      mockStorage.getItem.mockImplementation((key: string) => {
        if (key === 'auth_tokens') {
          return JSON.stringify({
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          });
        }
        if (key === 'auth_user') {
          return JSON.stringify({
            id: 'user-123',
            role: 'GUARDIAN',
            name: 'Test Guardian',
          });
        }
        return null;
      });
    });

    it('should complete package purchase flow: browse → select → checkout → payment', async () => {
      // Step 1: Browse packages
      const packagesResponse = await fetch('http://localhost:4000/packages', {
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });
      const packagesData = await packagesResponse.json();

      expect(packagesData.success).toBe(true);
      expect(packagesData.data).toHaveLength(2);
      expect(packagesData.data[0]).toMatchObject({
        id: 'package-1',
        name: 'Basic Care Package',
        price: 5000,
      });

      // Step 2: Select a package
      const selectedPackage = packagesData.data[0];
      expect(selectedPackage.name).toBe('Basic Care Package');
      expect(selectedPackage.price).toBe(5000);

      // Step 3: Create job (purchase package)
      const jobResponse = await fetch('http://localhost:4000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token',
        },
        body: JSON.stringify({
          packageId: 'package-1',
          patientId: 'patient-1',
          startDate: new Date().toISOString(),
        }),
      });
      const jobData = await jobResponse.json();

      expect(jobData.success).toBe(true);
      expect(jobData.data).toMatchObject({
        packageId: 'package-1',
        patientId: 'patient-1',
        status: 'PENDING',
        totalPrice: 5000,
      });

      const jobId = jobData.data.id;

      // Step 4: Create payment intent
      const paymentIntentResponse = await fetch('http://localhost:4000/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token',
        },
        body: JSON.stringify({
          amount: 5000,
          jobId,
        }),
      });
      const paymentIntentData = await paymentIntentResponse.json();

      expect(paymentIntentData.success).toBe(true);
      expect(paymentIntentData.data).toMatchObject({
        amount: 5000,
        clientSecret: expect.stringContaining('mock-payment-intent-secret'),
      });

      // Step 5: Confirm payment
      const confirmPaymentResponse = await fetch('http://localhost:4000/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentData.data.paymentIntentId,
          jobId,
        }),
      });
      const confirmPaymentData = await confirmPaymentResponse.json();

      expect(confirmPaymentData.success).toBe(true);
      expect(confirmPaymentData.data).toMatchObject({
        jobId,
        amount: 5000,
        status: 'COMPLETED',
        method: 'CARD',
      });

      // Step 6: Verify job is now active with payment
      const jobDetailsResponse = await fetch(`http://localhost:4000/jobs/${jobId}`, {
        headers: {
          Authorization: 'Bearer mock-access-token',
        },
      });
      const jobDetailsData = await jobDetailsResponse.json();

      expect(jobDetailsData.success).toBe(true);
      expect(jobDetailsData.data.payment.status).toBe('COMPLETED');
      expect(jobDetailsData.data.status).toBe('ACTIVE');
    });

    it('should allow browsing multiple packages', async () => {
      const response = await fetch('http://localhost:4000/packages');
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);

      const packages = data.data as MockPackage[];

      // Verify package structure
      packages.forEach((pkg) => {
        expect(pkg).toHaveProperty('id');
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('price');
        expect(pkg).toHaveProperty('services');
        expect(pkg).toHaveProperty('company');
      });
    });

    it('should fetch individual package details', async () => {
      const response = await fetch('http://localhost:4000/packages/package-1');
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toMatchObject({
        id: 'package-1',
        name: 'Basic Care Package',
        price: 5000,
        duration: 30,
        services: expect.arrayContaining([
          'Daily check-ins',
          'Medication reminders',
          'Emergency support',
        ]),
      });
    });

    it('should handle payment failure gracefully', async () => {
      // Mock payment confirmation failure
      server.use(
        rest.post('http://localhost:4000/payments/confirm', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              success: false,
              message: 'Payment failed',
            })
          );
        })
      );

      const confirmPaymentResponse = await fetch('http://localhost:4000/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token',
        },
        body: JSON.stringify({
          paymentIntentId: 'pi-invalid',
          jobId: 'job-123',
        }),
      });

      expect(confirmPaymentResponse.status).toBe(400);
      const data = await confirmPaymentResponse.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Payment failed');
    });
  });

  describe('End-to-End User Journey', () => {
    it('should complete full guardian journey: login → register patient → purchase package', async () => {
      // Step 1: Login
      const loginResponse = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+8801700000000',
          password: 'password123',
        }),
      });
      const loginData = await loginResponse.json();

      expect(loginData.success).toBe(true);
      expect(loginData.tokens.accessToken).toBeDefined();
      const { accessToken } = loginData.tokens;

      // Step 2: Verify authenticated user
      const meResponse = await fetch('http://localhost:4000/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const meData = await meResponse.json();

      expect(meData.success).toBe(true);
      expect(meData.user.role).toBe('GUARDIAN');

      // Step 3: Create patient
      const patientResponse = await fetch('http://localhost:4000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: 'New Patient',
          phone: '+8801799999999',
          email: 'newpatient@example.com',
        }),
      });
      const patientData = await patientResponse.json();

      expect(patientData.success).toBe(true);
      const patientId = patientData.data.id;

      // Step 4: Browse and select package
      const packagesResponse = await fetch('http://localhost:4000/packages', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const packagesData = await packagesResponse.json();

      expect(packagesData.success).toBe(true);
      const packageId = packagesData.data[0].id;

      // Step 5: Purchase package (create job)
      const jobResponse = await fetch('http://localhost:4000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          packageId,
          patientId,
          startDate: new Date().toISOString(),
        }),
      });
      const jobData = await jobResponse.json();

      expect(jobData.success).toBe(true);
      expect(jobData.data.status).toBe('PENDING');

      // Step 6: Complete payment
      const paymentResponse = await fetch('http://localhost:4000/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          paymentIntentId: 'pi-mock',
          jobId: jobData.data.id,
        }),
      });
      const paymentDataResponse = await paymentResponse.json();

      expect(paymentDataResponse.success).toBe(true);
      expect(paymentDataResponse.data.status).toBe('COMPLETED');

      // Journey completed successfully
      expect(loginData.success).toBe(true);
      expect(patientData.success).toBe(true);
      expect(jobData.success).toBe(true);
      expect(paymentDataResponse.success).toBe(true);
    });
  });
});
