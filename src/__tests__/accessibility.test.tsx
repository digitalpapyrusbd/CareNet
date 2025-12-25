import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '@/components/ui/button';
import PatientForm from '@/components/patients/PatientForm';
import Layout from '@/components/layout/Layout';
import { MobileJobCard } from '@/components/mobile/MobileJobCard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, type TableColumn } from '@/components/ui/table';
import { TouchTargetAuditPanel } from '@/hooks/use-touch-audit';
import { Modal } from '@/components/ui/modal';

jest.mock('@/hooks/useAuth');

const mockLogout = jest.fn();
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('next/link', () => {
  return ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/components/layout/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation</div>;
  };
});

jest.mock('@/components/layout/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('@/components/ui', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language</div>,
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme</div>,
}));

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => null,
  });
});
/**
 * Component-level accessibility tests using jest-axe
 * Tests real rendered components against WCAG 2.1 AA standards
 * 
 * Note: PatientForm and Layout tests are skipped due to source component issues.
 * These should be fixed in the source components first.
 */

describe('Component Accessibility Tests (WCAG 2.1 AA)', () => {
  describe('Button Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with different variants', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('PatientForm Component', () => {
    it('should expose labelled inputs and pass axe audit', async () => {
      const handlers = { onSaved: jest.fn(), onCancel: jest.fn() };

      const { container, getByLabelText, getByRole } = render(
        <PatientForm onSaved={handlers.onSaved} onCancel={handlers.onCancel} />
      );

      expect(getByLabelText(/name/i)).toBeRequired();
      expect(getByLabelText(/phone/i)).toBeRequired();
      expect(getByLabelText(/email/i)).toBeInTheDocument();
      expect(getByRole('button', { name: /save/i })).toBeEnabled();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should render an accessible cancel button when provided', async () => {
      const onCancel = jest.fn();

      const { container, getByRole } = render(
        <PatientForm onSaved={jest.fn()} onCancel={onCancel} />
      );

      expect(getByRole('button', { name: /cancel/i })).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Layout Component', () => {
    beforeEach(() => {
      mockLogout.mockReset();
      mockedUseAuth.mockReturnValue({
        user: { id: 'user_1', name: 'Test User' },
        isAuthenticated: true,
        logout: mockLogout,
      } as any);
    });

    it('should provide banner, navigation, sidebar, and main landmarks', async () => {
      const { container } = render(
        <Layout showSidebar headerContent={<div>Custom Header</div>}>
          <div>Dashboard content</div>
        </Layout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should expose accessible logout and login controls', async () => {
      const { container, getByRole } = render(
        <Layout>
          <div>Child</div>
        </Layout>
      );

      expect(getByRole('button', { name: /logout/i })).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for buttons', () => {
      const handleClick = jest.fn();
      const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = getByText('Click me');
      
      // Should be a button element or have button role
      expect(button.tagName === 'BUTTON' || button.getAttribute('role') === 'button').toBe(true);
      
      // Should have no positive tabindex (allowing natural tab order)
      const tabIndex = button.getAttribute('tabindex');
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('MobileJobCard Component', () => {
    const baseJob = {
      id: 'job_1',
      packageId: 'pkg_1',
      patientId: 'pat_1',
      companyId: 'comp_1',
      guardianId: 'gua_1',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-05'),
      status: 'ACTIVE',
      totalPrice: 12000,
      commissionAmount: 1000,
      payoutAmount: 11000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02'),
      package: { name: 'Home Care', description: 'Daily monitoring' },
      patient: { name: 'Rahim' },
      company: { companyName: 'Dhaka Health' },
    } as any;

    it('should expose an accessible View Details button and status text', async () => {
      const { container, getByRole, getAllByText } = render(
        <MobileJobCard job={baseJob} onViewDetails={jest.fn()} />
      );

      expect(getByRole('button', { name: /view details/i })).toBeInTheDocument();
      expect(getAllByText(/accept/i).length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support optional swipe actions without introducing axe failures', async () => {
      const { container } = render(
        <MobileJobCard
          job={baseJob}
          onAccept={jest.fn()}
          onDecline={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Guardian Dashboard Patterns', () => {
    const statCards = [
      { title: 'Total Patients', value: '6', cta: 'View patients' },
      { title: 'Active Jobs', value: '3', cta: 'Manage jobs' },
      { title: 'Monthly Spending', value: '৳12,000', cta: 'View payments' },
    ];

    interface DisputeRow {
      id: string;
      caseId: string;
      claimant: string;
      amount: number;
      status: 'OPEN' | 'REVIEW' | 'RESOLVED';
    }

    const disputeColumns: TableColumn<DisputeRow>[] = [
      { key: 'caseId', header: 'Case ID', sortable: true },
      { key: 'claimant', header: 'Claimant', sortable: true },
      { key: 'amount', header: 'Amount (BDT)', sortable: true },
      {
        key: 'status',
        header: 'Status',
        render: (value: DisputeRow['status']) => (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100">
            {value}
          </span>
        ),
      },
    ];

    const disputeRows: DisputeRow[] = [
      { id: '1', caseId: 'DSP-1001', claimant: 'Rahim Uddin', amount: 5000, status: 'OPEN' },
      { id: '2', caseId: 'DSP-1002', claimant: 'Akter Hossain', amount: 3200, status: 'REVIEW' },
    ];

    it('should render stat cards with meaningful headings and controls', async () => {
      const { container, getAllByRole } = render(
        <section aria-label="Guardian overview">
          <div className="grid gap-4">
            {statCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold" aria-live="polite">
                    {card.value}
                  </p>
                  <Button variant="outline" className="mt-4">
                    {card.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      );

      expect(getAllByRole('heading', { level: 4 })).toHaveLength(statCards.length);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should render a dispute summary table with sortable headers', async () => {
      const { container, getByRole } = render(
        <section aria-label="Dispute center">
          <h2 className="text-xl font-semibold">Open Disputes</h2>
          <Table
            className="mt-4"
            data={disputeRows}
            columns={disputeColumns}
            emptyMessage="No disputes"
          />
        </section>
      );

      expect(getByRole('table')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Guardian Quick Actions', () => {
    const quickActions = [
      { emoji: '👨‍👩‍👧‍👦', label: 'Add Patient' },
      { emoji: '📋', label: 'Create Job' },
      { emoji: '📦', label: 'Browse Packages' },
    ];

    it('should expose quick action buttons in a responsive grid without axe violations', async () => {
      const { container, getAllByRole } = render(
        <section aria-label="Guardian quick actions" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Button key={action.label} className="w-full min-h-[48px]">
              <span aria-hidden="true" className="mr-2">
                {action.emoji}
              </span>
              {action.label}
            </Button>
          ))}
        </section>
      );

      expect(getAllByRole('button')).toHaveLength(quickActions.length);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should surface modal-based quick action details with focusable controls', async () => {
      const handleClose = jest.fn();
      const { container, getByRole } = render(
        <Modal isOpen title="Add Patient" onClose={handleClose}>
          <form aria-label="Add patient form" className="space-y-3">
            <label className="block text-sm font-medium" htmlFor="patientName">
              Patient Name
            </label>
            <input id="patientName" className="w-full border px-2 py-1" />
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      );

      expect(getByRole('heading', { name: /add patient/i })).toBeInTheDocument();
      expect(getByRole('button', { name: /close/i })).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TouchTargetAuditPanel', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should expose development-only audit controls with accessible actions', async () => {
      process.env.NODE_ENV = 'development';
      const { container, getByRole } = render(<TouchTargetAuditPanel />);

      fireEvent.click(getByRole('button', { name: /touch target audit/i }));

      expect(await screen.findByText('Touch Target Audit')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /run audit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /highlight issues/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG AA contrast requirements', async () => {
      // jest-axe automatically checks color contrast
      const { container } = render(
        <div>
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <p>Regular text content</p>
          <h1>Heading text</h1>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Accessibility', () => {
    it('should keep WCAG label and aria rules enabled for PatientForm', async () => {
      const { container } = render(
        <PatientForm onSaved={jest.fn()} onCancel={jest.fn()} />
      );

      const results = await axe(container, {
        rules: {
          label: { enabled: true },
          'aria-valid-attr-value': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have valid ARIA attributes', async () => {
      const { container } = render(
        <div>
          <Button aria-label="Close dialog">×</Button>
          <div role="alert" aria-live="polite">
            This is an alert message
          </div>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'aria-allowed-attr': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Heading Hierarchy', () => {
    it('should have proper heading hierarchy', async () => {
      const { container } = render(
        <div>
          <h1>Page Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Image Accessibility', () => {
    it('should have alt text for images', async () => {
      const { container } = render(
        <div>
          <img src="/logo.png" alt="Company Logo" />
          <img src="/icon.png" alt="" role="presentation" />
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'image-alt': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });
});
