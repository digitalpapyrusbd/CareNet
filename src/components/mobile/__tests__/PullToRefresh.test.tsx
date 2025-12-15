import React from 'react';
import { render, screen } from '@testing-library/react';
import { PullToRefresh } from '../PullToRefresh';

// Mock the usePullToRefresh hook
jest.mock('@/hooks/use-pull-to-refresh', () => ({
  usePullToRefresh: jest.fn(),
}));

import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';

const mockUsePullToRefresh = usePullToRefresh as jest.MockedFunction<typeof usePullToRefresh>;

describe('PullToRefresh', () => {
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render children', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Test Content</div>
        </PullToRefresh>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should call usePullToRefresh with correct default props', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(mockUsePullToRefresh).toHaveBeenCalledWith({
        onRefresh: mockOnRefresh,
        threshold: 80,
        enabled: true,
      });
    });

    it('should call usePullToRefresh with custom threshold', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh} threshold={100}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(mockUsePullToRefresh).toHaveBeenCalledWith({
        onRefresh: mockOnRefresh,
        threshold: 100,
        enabled: true,
      });
    });

    it('should call usePullToRefresh with enabled=false when disabled', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh} enabled={false}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(mockUsePullToRefresh).toHaveBeenCalledWith({
        onRefresh: mockOnRefresh,
        threshold: 80,
        enabled: false,
      });
    });
  });

  describe('Pull Indicator - Hidden State', () => {
    it('should not show indicator when not pulling or refreshing', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicator = container.querySelector('.fixed.top-0');
      expect(indicator).toHaveStyle({ height: '0px', opacity: 0 });
    });
  });

  describe('Pull Indicator - Pulling State', () => {
    it('should show "Pull to refresh" when pulling but not ready', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(screen.getByText('Pull to refresh')).toBeInTheDocument();
    });

    it('should show indicator with correct height when pulling', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicator = container.querySelector('.fixed.top-0');
      expect(indicator).toHaveStyle({ height: '60px', opacity: 1 });
    });

    it('should render progress bar when pulling', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const progressBar = container.querySelector('.bg-primary-600');
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('should show "Release to refresh" when ready', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 80,
        progress: 100,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(screen.getByText('Release to refresh')).toBeInTheDocument();
    });

    it('should rotate arrow icon when ready', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 80,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const arrowIcon = container.querySelector('.rotate-180');
      expect(arrowIcon).toBeInTheDocument();
    });

    it('should apply green color to icon when ready', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 80,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const arrowIcon = container.querySelector('.text-green-600');
      expect(arrowIcon).toBeInTheDocument();
    });

    it('should apply gray color to icon when not ready', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const arrowIcon = container.querySelector('.text-gray-500');
      expect(arrowIcon).toBeInTheDocument();
    });

    it('should limit pull distance transform to 60px', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 150,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicator = container.querySelector('.fixed.top-0');
      expect(indicator).toHaveStyle({ transform: 'translateY(60px)' });
    });
  });

  describe('Pull Indicator - Refreshing State', () => {
    it('should show "Refreshing..." when refreshing', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: true,
        pullDistance: 0,
        progress: 100,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      expect(screen.getByText('Refreshing...')).toBeInTheDocument();
    });

    it('should show spinner icon when refreshing', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: true,
        pullDistance: 0,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should show indicator when refreshing', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: true,
        pullDistance: 0,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicator = container.querySelector('.fixed.top-0');
      expect(indicator).toHaveStyle({ height: '60px', opacity: 1 });
    });
  });

  describe('Content Transform', () => {
    it('should render content wrapper when not pulling', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const contentDiv = container.querySelector('.transition-transform');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should render content wrapper when pulling', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 60,
        progress: 75,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const contentDiv = container.querySelector('.transition-transform');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should render content wrapper with transition class', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 100,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const contentDiv = container.querySelector('.transition-transform');
      expect(contentDiv).toHaveClass('transition-transform');
    });

    it('should render content wrapper when refreshing', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: true,
        pullDistance: 0,
        progress: 100,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const contentDiv = container.querySelector('.transition-transform');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should render indicator with white background in light mode', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicatorContent = container.querySelector('.bg-white');
      expect(indicatorContent).toBeInTheDocument();
    });

    it('should apply shadow and border to indicator', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicatorContent = container.querySelector('.shadow-lg.border');
      expect(indicatorContent).toBeInTheDocument();
    });

    it('should render indicator content as rounded pill', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: true,
        isRefreshing: false,
        pullDistance: 40,
        progress: 50,
      });

      const { container } = render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>Content</div>
        </PullToRefresh>
      );

      const indicatorContent = container.querySelector('.rounded-full');
      expect(indicatorContent).toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    it('should render multiple children', () => {
      mockUsePullToRefresh.mockReturnValue({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        progress: 0,
      });

      render(
        <PullToRefresh onRefresh={mockOnRefresh}>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </PullToRefresh>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });
  });
});
