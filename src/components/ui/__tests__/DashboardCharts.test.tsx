import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  StatsCard, 
  ActivityTimeline, 
  ProgressChart, 
  MiniChart,
  StatsCardProps,
  ActivityItem,
  ActivityTimelineProps,
  ProgressChartProps,
  MiniChartProps 
} from '../dashboard-charts';

describe('Dashboard Charts Components', () => {
  describe('StatsCard Component', () => {
    describe('Rendering', () => {
      it('should render with default blue color', () => {
        const { container } = render(<StatsCard title="Test" value={100} />);
        expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
      });

      it('should apply custom icon', () => {
        const icon = <span data-testid="custom-icon">📊</span>;
        render(<StatsCard title="Test" value={100} icon={icon} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      });
    });

    describe('Color Variants', () => {
      it('should render with green color', () => {
        const { container } = render(<StatsCard title="Test" value={100} color="green" />);
        expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
      });

      it('should render with red color', () => {
        const { container } = render(<StatsCard title="Test" value={100} color="red" />);
        expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
      });

      it('should render with yellow color', () => {
        const { container } = render(<StatsCard title="Test" value={100} color="yellow" />);
        expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
      });

      it('should render with purple color', () => {
        const { container } = render(<StatsCard title="Test" value={100} color="purple" />);
        expect(container.querySelector('.bg-purple-500')).toBeInTheDocument();
      });
    });

    describe('Change Indicator', () => {
      it('should show increase indicator', () => {
        const change = { value: 10, type: 'increase' as const };
        render(<StatsCard title="Sales" value={1000} change={change} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('Increased')).toBeInTheDocument();
      });

      it('should show decrease indicator', () => {
        const change = { value: 5, type: 'decrease' as const };
        render(<StatsCard title="Sales" value={900} change={change} />);
        expect(screen.getByText('5%')).toBeInTheDocument();
        expect(screen.getByText('Decreased')).toBeInTheDocument();
      });

      it('should render without change indicator', () => {
        render(<StatsCard title="Sales" value={1000} />);
        expect(screen.queryByText('%')).not.toBeInTheDocument();
      });

      it('should show green color for increase', () => {
        const change = { value: 10, type: 'increase' as const };
        const { container } = render(<StatsCard title="Test" value={100} change={change} />);
        expect(container.querySelector('.text-green-600')).toBeInTheDocument();
      });

      it('should show red color for decrease', () => {
        const change = { value: 5, type: 'decrease' as const };
        const { container } = render(<StatsCard title="Test" value={100} change={change} />);
        expect(container.querySelector('.text-red-600')).toBeInTheDocument();
      });
    });

    describe('Number Formatting', () => {
      it('should format large numbers with commas', () => {
        render(<StatsCard title="Revenue" value={1234567} />);
        expect(screen.getByText('1,234,567')).toBeInTheDocument();
      });

      it('should handle zero value', () => {
        render(<StatsCard title="Count" value={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
      });

      it('should not format string values', () => {
        render(<StatsCard title="Status" value="N/A" />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
      });
    });
  });

  describe('ActivityTimeline Component', () => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'USER_REGISTRATION',
        description: 'New user registered',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        id: '2',
        type: 'JOB_CREATED',
        description: 'New job posted',
        timestamp: new Date('2024-01-01T11:00:00'),
      },
      {
        id: '3',
        type: 'PAYMENT_RECEIVED',
        description: 'Payment processed',
        timestamp: new Date('2024-01-01T12:00:00'),
      },
    ];

    describe('Initialization', () => {
      it('should render with title', () => {
        render(<ActivityTimeline title="Recent Activity" activities={mockActivities} />);
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      });

      it('should render all activities', () => {
        render(<ActivityTimeline title="Activity" activities={mockActivities} />);
        expect(screen.getByText('New user registered')).toBeInTheDocument();
        expect(screen.getByText('New job posted')).toBeInTheDocument();
        expect(screen.getByText('Payment processed')).toBeInTheDocument();
      });

      it('should render empty state when no activities', () => {
        render(<ActivityTimeline title="Activity" activities={[]} />);
        expect(screen.getByText('No recent activity')).toBeInTheDocument();
      });

      it('should limit activities to maxItems', () => {
        render(<ActivityTimeline title="Activity" activities={mockActivities} maxItems={2} />);
        expect(screen.getByText('New user registered')).toBeInTheDocument();
        expect(screen.getByText('New job posted')).toBeInTheDocument();
        expect(screen.queryByText('Payment processed')).not.toBeInTheDocument();
      });

      it('should use default maxItems of 5', () => {
        const manyActivities = Array.from({ length: 10 }, (_, i) => ({
          id: `${i}`,
          type: 'USER_REGISTRATION',
          description: `Activity ${i}`,
          timestamp: new Date(),
        }));
        render(<ActivityTimeline title="Activity" activities={manyActivities} />);
        expect(screen.queryByText('Activity 6')).not.toBeInTheDocument();
      });
    });

    describe('Activity Types', () => {
      it('should render USER_REGISTRATION icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'User registered',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-blue-500.bg-blue-100')).toBeInTheDocument();
      });

      it('should render JOB_CREATED icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'JOB_CREATED',
          description: 'Job created',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-green-500.bg-green-100')).toBeInTheDocument();
      });

      it('should render PAYMENT_RECEIVED icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'PAYMENT_RECEIVED',
          description: 'Payment received',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-yellow-500.bg-yellow-100')).toBeInTheDocument();
      });

      it('should render DISPUTE_RAISED icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'DISPUTE_RAISED',
          description: 'Dispute raised',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-red-500.bg-red-100')).toBeInTheDocument();
      });

      it('should render ASSIGNMENT_RECEIVED icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'ASSIGNMENT_RECEIVED',
          description: 'Assignment received',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-purple-500.bg-purple-100')).toBeInTheDocument();
      });

      it('should render CARE_LOG icon', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'CARE_LOG',
          description: 'Care log added',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-indigo-500.bg-indigo-100')).toBeInTheDocument();
      });

      it('should render default icon for unknown type', () => {
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'UNKNOWN_TYPE',
          description: 'Unknown activity',
          timestamp: new Date(),
        }];
        const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(container.querySelector('.text-gray-500.bg-gray-100')).toBeInTheDocument();
      });

      it('should use custom icon when provided', () => {
        const customIcon = <div data-testid="custom-activity-icon">🔔</div>;
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'CUSTOM',
          description: 'Custom activity',
          timestamp: new Date(),
          icon: customIcon,
        }];
        render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(screen.getByTestId('custom-activity-icon')).toBeInTheDocument();
      });
    });

    describe('Time Formatting', () => {
      it('should show "Just now" for very recent timestamps', () => {
        const now = new Date();
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'Activity',
          timestamp: new Date(now.getTime() - 30000), // 30 seconds ago
        }];
        render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(screen.getByText('Just now')).toBeInTheDocument();
      });

      it('should show minutes for recent timestamps', () => {
        const now = new Date();
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'Activity',
          timestamp: new Date(now.getTime() - 180000), // 3 minutes ago
        }];
        render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(screen.getByText(/minutes ago/)).toBeInTheDocument();
      });

      it('should show hours for older timestamps', () => {
        const now = new Date();
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'Activity',
          timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
        }];
        render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(screen.getByText(/hours ago/)).toBeInTheDocument();
      });

      it('should show days for old timestamps', () => {
        const now = new Date();
        const activity: ActivityItem[] = [{
          id: '1',
          type: 'USER_REGISTRATION',
          description: 'Activity',
          timestamp: new Date(now.getTime() - 172800000), // 2 days ago
        }];
        render(<ActivityTimeline title="Activity" activities={activity} />);
        expect(screen.getByText(/days ago/)).toBeInTheDocument();
      });
    });
  });

  describe('ProgressChart Component', () => {
    const mockData = [
      { label: 'Completed', value: 75, total: 100, color: '#10B981' },
      { label: 'In Progress', value: 15, total: 100, color: '#F59E0B' },
      { label: 'Pending', value: 10, total: 100, color: '#EF4444' },
    ];

    describe('Initialization', () => {
      it('should render with title', () => {
        render(<ProgressChart title="Project Progress" data={mockData} />);
        expect(screen.getByText('Project Progress')).toBeInTheDocument();
      });

      it('should render all progress items', () => {
        render(<ProgressChart title="Progress" data={mockData} />);
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });

      it('should show percentages by default', () => {
        render(<ProgressChart title="Progress" data={mockData} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
        expect(screen.getByText('15%')).toBeInTheDocument();
        expect(screen.getByText('10%')).toBeInTheDocument();
      });

      it('should hide percentages when showPercentage is false', () => {
        render(<ProgressChart title="Progress" data={mockData} showPercentage={false} />);
        expect(screen.queryByText('75%')).not.toBeInTheDocument();
      });

      it('should show value and total counts', () => {
        render(<ProgressChart title="Progress" data={mockData} />);
        expect(screen.getByText('75 of 100')).toBeInTheDocument();
        expect(screen.getByText('15 of 100')).toBeInTheDocument();
        expect(screen.getByText('10 of 100')).toBeInTheDocument();
      });
    });

    describe('Progress Bars', () => {
      it('should render progress bars with correct widths', () => {
        const { container } = render(<ProgressChart title="Progress" data={mockData} />);
        const bars = container.querySelectorAll('.h-full.flex');
        
        expect((bars[0] as HTMLElement).style.width).toBe('75%');
        expect((bars[1] as HTMLElement).style.width).toBe('15%');
        expect((bars[2] as HTMLElement).style.width).toBe('10%');
      });

      it('should apply custom colors', () => {
        const { container } = render(<ProgressChart title="Progress" data={mockData} />);
        const bars = container.querySelectorAll('.h-full.flex');
        
        expect((bars[0] as HTMLElement).style.backgroundColor).toBe('rgb(16, 185, 129)');
        expect((bars[1] as HTMLElement).style.backgroundColor).toBe('rgb(245, 158, 11)');
        expect((bars[2] as HTMLElement).style.backgroundColor).toBe('rgb(239, 68, 68)');
      });

      it('should use default color when not specified', () => {
        const dataWithoutColor = [{ label: 'Test', value: 50, total: 100 }];
        const { container } = render(<ProgressChart title="Progress" data={dataWithoutColor} />);
        const bar = container.querySelector('.h-full.flex') as HTMLElement;
        
        expect(bar.style.backgroundColor).toBe('rgb(59, 130, 246)');
      });

      it('should handle 100% completion', () => {
        const fullData = [{ label: 'Complete', value: 100, total: 100 }];
        const { container } = render(<ProgressChart title="Progress" data={fullData} />);
        const bar = container.querySelector('.h-full.flex') as HTMLElement;
        
        expect(bar.style.width).toBe('100%');
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      it('should handle 0% completion', () => {
        const zeroData = [{ label: 'Not Started', value: 0, total: 100 }];
        const { container } = render(<ProgressChart title="Progress" data={zeroData} />);
        const bar = container.querySelector('.h-full.flex') as HTMLElement;
        
        expect(bar.style.width).toBe('0%');
        expect(screen.getByText('0%')).toBeInTheDocument();
      });
    });
  });

  describe('MiniChart Component', () => {
    const mockData = [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 200 },
      { label: 'Mar', value: 150 },
      { label: 'Apr', value: 300 },
    ];

    describe('Initialization', () => {
      it('should render with title and value', () => {
        render(<MiniChart title="Revenue" value={1000} data={mockData} type="line" />);
        expect(screen.getByText('Revenue')).toBeInTheDocument();
        expect(screen.getByText('1,000')).toBeInTheDocument();
      });

      it('should render with string value', () => {
        render(<MiniChart title="Status" value="Active" data={mockData} type="line" />);
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      it('should apply default height of 60px', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" />);
        const chartDiv = container.querySelector('[style*="height"]');
        expect(chartDiv).toHaveStyle({ height: '60px' });
      });

      it('should apply custom height', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" height={100} />);
        const chartDiv = container.querySelector('[style*="height"]');
        expect(chartDiv).toHaveStyle({ height: '100px' });
      });
    });

    describe('Line Chart', () => {
      it('should render SVG for line type', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });

      it('should render path for line', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" />);
        const path = container.querySelector('path');
        expect(path).toBeInTheDocument();
        expect(path).toHaveAttribute('fill', 'none');
      });

      it('should render circles for data points', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" />);
        const circles = container.querySelectorAll('circle');
        expect(circles).toHaveLength(mockData.length);
      });

      it('should apply custom color to line', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" color="#FF0000" />);
        const path = container.querySelector('path');
        expect(path).toHaveAttribute('stroke', '#FF0000');
      });

      it('should use default blue color', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="line" />);
        const path = container.querySelector('path');
        expect(path).toHaveAttribute('stroke', '#3B82F6');
      });
    });

    describe('Bar Chart', () => {
      it('should render bars for bar type', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="bar" />);
        const bars = container.querySelectorAll('.mx-px');
        expect(bars).toHaveLength(mockData.length);
      });

      it('should apply correct heights to bars proportional to values', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="bar" />);
        const bars = container.querySelectorAll('.mx-px');
        
        // Apr has max value 300, should be 100% height
        expect((bars[3] as HTMLElement).style.height).toBe('100%');
        
        // Jan has value 100 (1/3 of max), should be ~33.33% height
        expect(parseFloat((bars[0] as HTMLElement).style.height)).toBeCloseTo(33.33, 1);
      });

      it('should apply custom color to bars', () => {
        const { container } = render(<MiniChart title="Test" value={100} data={mockData} type="bar" color="#00FF00" />);
        const bars = container.querySelectorAll('.mx-px');
        expect((bars[0] as HTMLElement).style.backgroundColor).toBe('rgb(0, 255, 0)');
      });
    });

    describe('Number Formatting', () => {
      it('should format large number values', () => {
        render(<MiniChart title="Sales" value={1234567} data={mockData} type="line" />);
        expect(screen.getByText('1,234,567')).toBeInTheDocument();
      });

      it('should not format string values', () => {
        render(<MiniChart title="Status" value="N/A" data={mockData} type="line" />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle StatsCard with very long title', () => {
      render(<StatsCard title="This is a very long title that might wrap to multiple lines" value={100} />);
      expect(screen.getByText('This is a very long title that might wrap to multiple lines')).toBeInTheDocument();
    });

    it('should handle ActivityTimeline with empty description', () => {
      const activity: ActivityItem[] = [{
        id: '1',
        type: 'USER_REGISTRATION',
        description: '',
        timestamp: new Date(),
      }];
      const { container } = render(<ActivityTimeline title="Activity" activities={activity} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle ProgressChart with fractional values', () => {
      const data = [{ label: 'Test', value: 33.5, total: 100 }];
      render(<ProgressChart title="Progress" data={data} />);
      expect(screen.getByText('34%')).toBeInTheDocument(); // Rounded
    });

    it('should handle MiniChart with single data point', () => {
      const singleData = [{ label: 'Single', value: 100 }];
      const { container } = render(<MiniChart title="Test" value={100} data={singleData} type="line" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle MiniChart with all zero values', () => {
      const zeroData = [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
      ];
      const { container } = render(<MiniChart title="Test" value={0} data={zeroData} type="bar" />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('TypeScript Types', () => {
    it('should accept StatsCardProps type', () => {
      const props: StatsCardProps = {
        title: 'Test',
        value: 100,
        color: 'blue',
      };
      const { container } = render(<StatsCard {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should accept ActivityTimelineProps type', () => {
      const props: ActivityTimelineProps = {
        title: 'Activity',
        activities: [],
        maxItems: 10,
      };
      const { container } = render(<ActivityTimeline {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should accept ProgressChartProps type', () => {
      const props: ProgressChartProps = {
        title: 'Progress',
        data: [],
        showPercentage: true,
      };
      const { container } = render(<ProgressChart {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('should accept MiniChartProps type', () => {
      const props: MiniChartProps = {
        title: 'Chart',
        value: 100,
        data: [{ label: 'A', value: 100 }],
        type: 'line',
      };
      const { container } = render(<MiniChart {...props} />);
      expect(container).toBeInTheDocument();
    });
  });
});
