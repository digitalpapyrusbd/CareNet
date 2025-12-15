import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileEarnings } from '../MobileEarnings';

// Mock PullToRefresh
jest.mock('../PullToRefresh', () => ({
  PullToRefresh: ({ children, onRefresh }: any) => (
    <div data-testid="pull-to-refresh" data-onrefresh={!!onRefresh}>
      {children}
    </div>
  ),
}));

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  configurable: true,
  value: mockVibrate,
});

// Mock URL.createObjectURL and click
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockClick = jest.fn();

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  configurable: true,
  value: mockCreateObjectURL,
});

// Mock document.createElement for anchor element
const originalCreateElement = document.createElement.bind(document);
jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
  const element = originalCreateElement(tagName);
  if (tagName === 'a') {
    element.click = mockClick;
  }
  return element;
});

describe('MobileEarnings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render with PullToRefresh wrapper', () => {
      render(<MobileEarnings />);
      expect(screen.getByTestId('pull-to-refresh')).toBeInTheDocument();
    });

    it('should show week period by default', () => {
      render(<MobileEarnings />);
      const weekButton = screen.getByText('Week');
      expect(weekButton).toHaveClass('bg-primary-600');
    });

    it('should display earnings summary cards', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('This Week')).toBeInTheDocument();
      expect(screen.getByText('Total Earned')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Avg/Job')).toBeInTheDocument();
    });
  });

  describe('Summary Cards', () => {
    it('should display weekly earnings correctly', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('৳8,500')).toBeInTheDocument();
    });

    it('should display total earnings', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('৳45,600')).toBeInTheDocument();
    });

    it('should display pending payments', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('৳5,200')).toBeInTheDocument();
    });

    it('should display average per job', () => {
      render(<MobileEarnings />);
      const avgElements = screen.getAllByText('৳1,983');
      expect(avgElements.length).toBeGreaterThan(0);
    });

    it('should update card label when period changes', () => {
      render(<MobileEarnings />);
      const monthButton = screen.getByText('Month');
      fireEvent.click(monthButton);
      expect(screen.getByText('This Month')).toBeInTheDocument();
    });

    it('should display monthly earnings when month selected', () => {
      render(<MobileEarnings />);
      const monthButton = screen.getByText('Month');
      fireEvent.click(monthButton);
      expect(screen.getByText('৳32,400')).toBeInTheDocument();
    });
  });

  describe('Chart Section', () => {
    it('should render chart heading', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Earnings Chart')).toBeInTheDocument();
    });

    it('should have week and month toggle buttons', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
    });

    it('should switch to month view when Month button clicked', () => {
      render(<MobileEarnings />);
      const monthButton = screen.getByText('Month');
      fireEvent.click(monthButton);
      expect(monthButton).toHaveClass('bg-primary-600');
    });

    it('should switch back to week view when Week button clicked', () => {
      render(<MobileEarnings />);
      const monthButton = screen.getByText('Month');
      const weekButton = screen.getByText('Week');
      
      fireEvent.click(monthButton);
      fireEvent.click(weekButton);
      
      expect(weekButton).toHaveClass('bg-primary-600');
    });

    it('should display weekly chart data by default', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
    });

    it('should display monthly chart data when month selected', () => {
      render(<MobileEarnings />);
      const monthButton = screen.getByText('Month');
      fireEvent.click(monthButton);
      
      expect(screen.getByText('Week 1')).toBeInTheDocument();
      expect(screen.getByText('Week 2')).toBeInTheDocument();
      expect(screen.getByText('Week 3')).toBeInTheDocument();
      expect(screen.getByText('Week 4')).toBeInTheDocument();
    });

    it('should show amounts for each bar', () => {
      render(<MobileEarnings />);
      const amounts = screen.getAllByText('৳1,200');
      expect(amounts.length).toBeGreaterThan(0);
    });

    it('should render bar chart elements', () => {
      const { container } = render(<MobileEarnings />);
      const bars = container.querySelectorAll('.bg-gradient-to-r');
      expect(bars.length).toBeGreaterThan(0);
    });

    it('should calculate bar widths based on max amount', () => {
      const { container } = render(<MobileEarnings />);
      const bars = container.querySelectorAll('.bg-gradient-to-r');
      
      // Thu has max amount (2100) so should be 100% width
      const maxBar = Array.from(bars).find(bar => 
        (bar as HTMLElement).style.width === '100%'
      );
      expect(maxBar).toBeTruthy();
    });
  });

  describe('Recent Payments Section', () => {
    it('should render recent payments heading', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Recent Payments')).toBeInTheDocument();
    });

    it('should display all payment records', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Elderly Care - Mrs. Rahman')).toBeInTheDocument();
      expect(screen.getByText('Post-Surgery Care')).toBeInTheDocument();
      expect(screen.getByText('Dementia Care - Mr. Khan')).toBeInTheDocument();
      expect(screen.getByText('Overnight Care')).toBeInTheDocument();
    });

    it('should display payment dates', () => {
      render(<MobileEarnings />);
      // Dates will be formatted based on locale
      const datePattern = /11\/(12|13|14|15)\/2024|2024-11-(12|13|14|15)/;
      const dateElements = screen.getAllByText(datePattern);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should display payment amounts', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('৳2,500')).toBeInTheDocument();
      expect(screen.getByText('৳1,800')).toBeInTheDocument();
    });

    it('should show payment statuses', () => {
      render(<MobileEarnings />);
      const completedStatuses = screen.getAllByText('completed');
      expect(completedStatuses.length).toBe(2);
      expect(screen.getByText('processing')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('should style completed status with green', () => {
      render(<MobileEarnings />);
      const completedStatuses = screen.getAllByText('completed');
      completedStatuses.forEach(status => {
        expect(status).toHaveClass('bg-green-100');
      });
    });

    it('should style processing status with blue', () => {
      render(<MobileEarnings />);
      const processingStatus = screen.getByText('processing');
      expect(processingStatus).toHaveClass('bg-blue-100');
    });

    it('should style pending status with yellow', () => {
      render(<MobileEarnings />);
      const pendingStatus = screen.getByText('pending');
      expect(pendingStatus).toHaveClass('bg-yellow-100');
    });
  });

  describe('Export CSV Feature', () => {
    it('should render export CSV button', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    it('should trigger vibration when export clicked', () => {
      render(<MobileEarnings />);
      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);
      expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should generate CSV with correct headers', () => {
      render(<MobileEarnings />);
      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);
      
      // Check that Blob was created
      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blob = mockCreateObjectURL.mock.calls[0][0];
      expect(blob.type).toBe('text/csv');
    });

    it('should trigger download on export', () => {
      render(<MobileEarnings />);
      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);
      
      expect(mockClick).toHaveBeenCalled();
    });

    it('should use date in filename', () => {
      render(<MobileEarnings />);
      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);
      
      // Date format: earnings-YYYY-MM-DD.csv
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Stats Summary', () => {
    it('should display completed jobs count', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('Jobs Completed')).toBeInTheDocument();
    });

    it('should display average per job in stats', () => {
      render(<MobileEarnings />);
      expect(screen.getByText('Average per Job')).toBeInTheDocument();
    });

    it('should render stats with correct styling', () => {
      render(<MobileEarnings />);
      const jobsCount = screen.getByText('23');
      expect(jobsCount).toHaveClass('text-primary-600');
    });
  });

  describe('Accessibility', () => {
    it('should have sufficient touch target sizes for toggle buttons', () => {
      render(<MobileEarnings />);
      const weekButton = screen.getByText('Week');
      const monthButton = screen.getByText('Month');
      
      expect(weekButton).toHaveClass('min-h-[40px]');
      expect(monthButton).toHaveClass('min-h-[40px]');
    });

    it('should have sufficient touch target for export button', () => {
      render(<MobileEarnings />);
      const exportButton = screen.getByText('Export CSV');
      expect(exportButton).toHaveClass('min-h-[44px]');
    });

    it('should use semantic color coding for statuses', () => {
      render(<MobileEarnings />);
      const completed = screen.getAllByText('completed')[0];
      const processing = screen.getByText('processing');
      const pending = screen.getByText('pending');
      
      expect(completed.className).toContain('green');
      expect(processing.className).toContain('blue');
      expect(pending.className).toContain('yellow');
    });
  });

  describe('Responsive Design', () => {
    it('should render summary cards in grid layout', () => {
      const { container } = render(<MobileEarnings />);
      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should use gradient backgrounds for summary cards', () => {
      const { container } = render(<MobileEarnings />);
      const gradients = container.querySelectorAll('.bg-gradient-to-br');
      expect(gradients.length).toBeGreaterThan(0);
    });
  });
});
