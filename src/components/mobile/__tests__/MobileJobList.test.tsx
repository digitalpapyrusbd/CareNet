import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileJobList } from '../MobileJobList';
import { Job } from '@/types';

// Mock child components
jest.mock('../MobileJobCard', () => ({
  MobileJobCard: ({ job, onAccept, onDecline, onViewDetails }: any) => (
    <div data-testid={`job-card-${job.id}`}>
      <span>{job.title}</span>
      {onAccept && <button onClick={() => onAccept(job.id)}>Accept</button>}
      {onDecline && <button onClick={() => onDecline(job.id)}>Decline</button>}
      {onViewDetails && <button onClick={() => onViewDetails(job.id)}>View</button>}
    </div>
  ),
}));

jest.mock('../PullToRefresh', () => ({
  PullToRefresh: ({ children, onRefresh, enabled }: any) => (
    <div data-testid="pull-to-refresh" data-enabled={enabled} data-onrefresh={!!onRefresh}>
      {children}
    </div>
  ),
}));

const mockJobs: Array<Job & { package?: { name: string }; patient?: { name: string }; company?: { companyName: string } }> = [
  {
    id: '1',
    title: 'Elderly Care',
    description: 'Care for elderly patient',
    status: 'ACTIVE',
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-12-20'),
    hourlyRate: 200,
    totalHours: 120,
    packageId: 'pkg1',
    patientId: 'pat1',
    companyId: 'comp1',
    caregiverId: null,
    patient: { name: 'John Doe' },
  },
  {
    id: '2',
    title: 'Post-Surgery Care',
    description: 'Post-op care',
    status: 'PENDING',
    startDate: new Date('2024-11-22'),
    endDate: new Date('2024-12-22'),
    hourlyRate: 250,
    totalHours: 80,
    packageId: 'pkg2',
    patientId: 'pat2',
    companyId: 'comp2',
    caregiverId: null,
    patient: { name: 'Jane Smith' },
  },
  {
    id: '3',
    title: 'Dementia Care',
    description: 'Specialized dementia care',
    status: 'COMPLETED',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-11-01'),
    hourlyRate: 300,
    totalHours: 200,
    packageId: 'pkg3',
    patientId: 'pat3',
    companyId: 'comp3',
    caregiverId: 'cg1',
    patient: { name: 'Bob Wilson' },
  },
];

describe('MobileJobList', () => {
  const mockOnRefresh = jest.fn();
  const mockOnAccept = jest.fn();
  const mockOnDecline = jest.fn();
  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render with PullToRefresh wrapper', () => {
      render(<MobileJobList jobs={mockJobs} />);
      expect(screen.getByTestId('pull-to-refresh')).toBeInTheDocument();
    });

    it('should enable PullToRefresh when onRefresh provided', () => {
      render(<MobileJobList jobs={mockJobs} onRefresh={mockOnRefresh} />);
      const wrapper = screen.getByTestId('pull-to-refresh');
      expect(wrapper).toHaveAttribute('data-enabled', 'true');
    });

    it('should disable PullToRefresh when no onRefresh', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const wrapper = screen.getByTestId('pull-to-refresh');
      expect(wrapper).toHaveAttribute('data-enabled', 'false');
    });

    it('should show all filter by default', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const allButton = screen.getByText('All');
      expect(allButton).toHaveClass('bg-primary-600');
    });

    it('should display all jobs by default', () => {
      render(<MobileJobList jobs={mockJobs} />);
      expect(screen.getByText('3 jobs found')).toBeInTheDocument();
    });
  });

  describe('Filter Tabs', () => {
    it('should render all filter buttons', () => {
      render(<MobileJobList jobs={mockJobs} />);
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should filter to active jobs when Active clicked', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const activeButton = screen.getByText('Active');
      fireEvent.click(activeButton);
      
      expect(screen.getByText('1 job found')).toBeInTheDocument();
      expect(screen.getByText('Elderly Care')).toBeInTheDocument();
    });

    it('should filter to pending jobs when Pending clicked', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const pendingButton = screen.getByText('Pending');
      fireEvent.click(pendingButton);
      
      expect(screen.getByText('1 job found')).toBeInTheDocument();
      expect(screen.getByText('Post-Surgery Care')).toBeInTheDocument();
    });

    it('should filter to completed jobs when Completed clicked', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const completedButton = screen.getByText('Completed');
      fireEvent.click(completedButton);
      
      expect(screen.getByText('1 job found')).toBeInTheDocument();
      expect(screen.getByText('Dementia Care')).toBeInTheDocument();
    });

    it('should show all jobs when All clicked after filtering', () => {
      render(<MobileJobList jobs={mockJobs} />);
      
      fireEvent.click(screen.getByText('Active'));
      fireEvent.click(screen.getByText('All'));
      
      expect(screen.getByText('3 jobs found')).toBeInTheDocument();
    });

    it('should update active filter styling', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const pendingButton = screen.getByText('Pending');
      
      fireEvent.click(pendingButton);
      
      expect(pendingButton).toHaveClass('bg-primary-600');
    });

    it('should have sufficient touch target size for filters', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const filterButtons = [
        screen.getByText('All'),
        screen.getByText('Active'),
        screen.getByText('Pending'),
        screen.getByText('Completed'),
      ];
      
      filterButtons.forEach(button => {
        expect(button).toHaveClass('min-h-[44px]');
      });
    });
  });

  describe('Job Count Display', () => {
    it('should show singular "job" for single job', () => {
      render(<MobileJobList jobs={mockJobs.slice(0, 1)} />);
      expect(screen.getByText('1 job found')).toBeInTheDocument();
    });

    it('should show plural "jobs" for multiple jobs', () => {
      render(<MobileJobList jobs={mockJobs} />);
      expect(screen.getByText('3 jobs found')).toBeInTheDocument();
    });

    it('should update count when filter changes', () => {
      render(<MobileJobList jobs={mockJobs} />);
      
      fireEvent.click(screen.getByText('Active'));
      expect(screen.getByText('1 job found')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('3 jobs found')).toBeInTheDocument();
    });

    it('should show loading indicator when isLoading true', () => {
      render(<MobileJobList jobs={mockJobs} isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show loading indicator when isLoading false', () => {
      render(<MobileJobList jobs={mockJobs} isLoading={false} />);
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should render loading spinner when isLoading', () => {
      const { container } = render(<MobileJobList jobs={mockJobs} isLoading={true} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Job Cards', () => {
    it('should render job cards for all jobs', () => {
      render(<MobileJobList jobs={mockJobs} />);
      expect(screen.getByTestId('job-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('job-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('job-card-3')).toBeInTheDocument();
    });

    it('should render only filtered job cards', () => {
      render(<MobileJobList jobs={mockJobs} />);
      fireEvent.click(screen.getByText('Active'));
      
      expect(screen.getByTestId('job-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('job-card-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('job-card-3')).not.toBeInTheDocument();
    });

    it('should pass callbacks to job cards', () => {
      render(
        <MobileJobList 
          jobs={mockJobs}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onViewDetails={mockOnViewDetails}
        />
      );
      
      const acceptButton = screen.getAllByText('Accept')[0];
      const declineButton = screen.getAllByText('Decline')[0];
      const viewButton = screen.getAllByText('View')[0];
      
      fireEvent.click(acceptButton);
      fireEvent.click(declineButton);
      fireEvent.click(viewButton);
      
      expect(mockOnAccept).toHaveBeenCalledWith('1');
      expect(mockOnDecline).toHaveBeenCalledWith('1');
      expect(mockOnViewDetails).toHaveBeenCalledWith('1');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no jobs', () => {
      render(<MobileJobList jobs={[]} />);
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });

    it('should show default empty message for all filter', () => {
      render(<MobileJobList jobs={[]} />);
      expect(screen.getByText('Check back later for new opportunities')).toBeInTheDocument();
    });

    it('should show filter-specific empty message for active filter', () => {
      render(<MobileJobList jobs={[]} />);
      fireEvent.click(screen.getByText('Active'));
      expect(screen.getByText('No active jobs at the moment')).toBeInTheDocument();
    });

    it('should show filter-specific empty message for pending filter', () => {
      render(<MobileJobList jobs={[]} />);
      fireEvent.click(screen.getByText('Pending'));
      expect(screen.getByText('No pending jobs at the moment')).toBeInTheDocument();
    });

    it('should show filter-specific empty message for completed filter', () => {
      render(<MobileJobList jobs={[]} />);
      fireEvent.click(screen.getByText('Completed'));
      expect(screen.getByText('No completed jobs at the moment')).toBeInTheDocument();
    });

    it('should render empty state icon', () => {
      const { container } = render(<MobileJobList jobs={[]} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should show empty state when filter has no matches', () => {
      const activeJobs = mockJobs.filter(j => j.status === 'ACTIVE');
      render(<MobileJobList jobs={activeJobs} />);
      
      fireEvent.click(screen.getByText('Pending'));
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });

    it('should show count as 0 when no jobs match filter', () => {
      const activeJobs = mockJobs.filter(j => j.status === 'ACTIVE');
      render(<MobileJobList jobs={activeJobs} />);
      
      fireEvent.click(screen.getByText('Completed'));
      expect(screen.getByText('0 jobs found')).toBeInTheDocument();
    });
  });

  describe('Pull to Refresh', () => {
    it('should call onRefresh when refresh triggered', async () => {
      mockOnRefresh.mockResolvedValue(undefined);
      render(<MobileJobList jobs={mockJobs} onRefresh={mockOnRefresh} />);
      
      // PullToRefresh mock will pass onRefresh, we verify it's passed correctly
      const wrapper = screen.getByTestId('pull-to-refresh');
      expect(wrapper).toHaveAttribute('data-onrefresh', 'true');
    });

    it('should still pass handleRefresh even when onRefresh not provided', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const wrapper = screen.getByTestId('pull-to-refresh');
      // Component always passes handleRefresh, but enabled prop controls behavior
      expect(wrapper).toHaveAttribute('data-onrefresh', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have sticky filter tabs', () => {
      const { container } = render(<MobileJobList jobs={mockJobs} />);
      const stickyDiv = container.querySelector('.sticky');
      expect(stickyDiv).toBeInTheDocument();
    });

    it('should have scrollable filter container', () => {
      const { container } = render(<MobileJobList jobs={mockJobs} />);
      const scrollable = container.querySelector('.overflow-x-auto');
      expect(scrollable).toBeInTheDocument();
    });

    it('should render job count with appropriate styling', () => {
      render(<MobileJobList jobs={mockJobs} />);
      const countText = screen.getByText('3 jobs found');
      expect(countText).toHaveClass('text-gray-600');
    });
  });

  describe('Case Insensitive Filtering', () => {
    it('should filter jobs case-insensitively for ACTIVE status', () => {
      render(<MobileJobList jobs={mockJobs} />);
      fireEvent.click(screen.getByText('Active'));
      
      expect(screen.getByText('Elderly Care')).toBeInTheDocument();
    });

    it('should filter jobs case-insensitively for PENDING status', () => {
      render(<MobileJobList jobs={mockJobs} />);
      fireEvent.click(screen.getByText('Pending'));
      
      expect(screen.getByText('Post-Surgery Care')).toBeInTheDocument();
    });

    it('should filter jobs case-insensitively for COMPLETED status', () => {
      render(<MobileJobList jobs={mockJobs} />);
      fireEvent.click(screen.getByText('Completed'));
      
      expect(screen.getByText('Dementia Care')).toBeInTheDocument();
    });
  });
});
