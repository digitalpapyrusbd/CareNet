/* eslint-env jest */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import 'jest-axe/extend-expect';
import { JobDetailPanel } from '../JobDetailPanel';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe('JobDetailPanel', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = window.localStorage;
  let fetchMock: jest.Mock;
  let routerMock: ReturnType<typeof useRouter>;

  const createResponse = (payload: unknown, ok = true) => ({
    ok,
    json: async () => payload,
  }) as Response;

  const mockJobDetail = (overrides: Record<string, unknown> = {}) => ({
    data: {
      id: 'job-123',
      status: 'ACTIVE',
      patient: { name: 'Naila Islam', diagnosis: 'Hypertension' },
      guardian: { name: 'Selim Ahmed' },
      company: { companyName: 'CareCo' },
      package: { name: 'Daily Support', hoursPerDay: 8, price: 15000 },
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-01-07T00:00:00Z',
      totalPrice: 15000,
      paymentStatus: 'PAID',
      caregiverAssignments: [
        {
          id: 'assignment-1',
          role: 'PRIMARY',
          status: 'CONFIRMED',
          caregiver: {
            name: 'Karim Khan',
            profile: { firstName: 'Karim', lastName: 'Khan' },
          },
        },
      ],
      payments: [
        {
          id: 'payment-1',
          amount: 15000,
          status: 'PAID',
          paidAt: '2025-01-02T00:00:00Z',
        },
      ],
      careLogs: [
        {
          id: 'log-1',
          logType: 'VITALS',
          timestamp: '2025-01-02T08:00:00Z',
          notes: 'Vitals normal',
          caregiver: { name: 'Karim Khan' },
        },
      ],
      specialInstructions: 'Keep hydrated',
      ...overrides,
    },
  });

  const waitForPanelContent = async () => {
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /naila islam/i })).toBeInTheDocument();
    });
  };

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'access-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      configurable: true,
      writable: true,
    });

    routerMock = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as unknown as ReturnType<typeof useRouter>;

    (useRouter as jest.Mock).mockReturnValue(routerMock);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: true,
    });
    jest.clearAllMocks();
  });

  it('loads job data and renders primary fields', async () => {
    fetchMock.mockResolvedValueOnce(createResponse(mockJobDetail()));

    const { container } = render(<JobDetailPanel jobId="job-123" />);

    expect(screen.getByText(/Loading job details/i)).toBeInTheDocument();

    await waitForPanelContent();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('navigates to assign caregiver flow when the action button is clicked', async () => {
    fetchMock.mockResolvedValueOnce(createResponse(mockJobDetail()));

    const user = userEvent.setup();
    render(<JobDetailPanel jobId="job-123" />);

    await waitForPanelContent();

    await user.click(screen.getByRole('button', { name: /Assign caregiver/i }));

    expect(routerMock.push).toHaveBeenCalledWith('/jobs/job-123/assign');
  });

  it('confirms cancellation, hits the cancel endpoint, and refetches details', async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(mockJobDetail()))
      .mockResolvedValueOnce(createResponse({ success: true }))
      .mockResolvedValueOnce(createResponse(mockJobDetail({ status: 'CANCELLED' })));

    const user = userEvent.setup();
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<JobDetailPanel jobId="job-123" />);

    await waitForPanelContent();

    await user.click(screen.getByRole('button', { name: /Cancel job/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/jobs/job-123/cancel', expect.objectContaining({ method: 'POST' }));
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    confirmSpy.mockRestore();
  });

  it('renders error state when detail fetch fails', async () => {
    fetchMock.mockResolvedValueOnce(createResponse({}, false));

    render(<JobDetailPanel jobId="job-123" />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load job details/i)).toBeInTheDocument();
    });
  });

  it('invokes onClose callback when Close button is clicked', async () => {
    fetchMock.mockResolvedValueOnce(createResponse(mockJobDetail()));
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(<JobDetailPanel jobId="job-123" onClose={onClose} />);

    await waitForPanelContent();

    await user.click(screen.getByRole('button', { name: /Close/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
