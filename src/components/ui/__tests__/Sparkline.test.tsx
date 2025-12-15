import React from 'react';
import { render } from '@testing-library/react';
import Sparkline from '../sparkline';

describe('Sparkline Component', () => {
  describe('Initialization & Rendering', () => {
    it('should render SVG element', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render with default width and height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '120');
      expect(svg).toHaveAttribute('height', '28');
    });

    it('should render with custom width', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={200} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
    });

    it('should render with custom height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} height={50} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '50');
    });

    it('should render with custom width and height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={300} height={60} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '300');
      expect(svg).toHaveAttribute('height', '60');
    });

    it('should set viewBox attribute', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={150} height={40} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 150 40');
    });
  });

  describe('Data Visualization', () => {
    it('should render polyline element for data', () => {
      const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should apply stroke styling to polyline', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toHaveAttribute('stroke', '#3b82f6');
      expect(polyline).toHaveAttribute('stroke-width', '1.5');
      expect(polyline).toHaveAttribute('fill', 'none');
    });

    it('should generate points for simple ascending data', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={100} height={100} />);
      const polyline = container.querySelector('polyline');
      const points = polyline?.getAttribute('points');
      expect(points).toBeTruthy();
      expect(points).toContain(',');
    });

    it('should generate points for descending data', () => {
      const { container } = render(<Sparkline data={[5, 4, 3, 2, 1]} />);
      const polyline = container.querySelector('polyline');
      const points = polyline?.getAttribute('points');
      expect(points).toBeTruthy();
    });

    it('should generate points for fluctuating data', () => {
      const { container } = render(<Sparkline data={[1, 5, 2, 8, 3]} />);
      const polyline = container.querySelector('polyline');
      const points = polyline?.getAttribute('points');
      expect(points).toBeTruthy();
    });

    it('should handle single data point', () => {
      const { container } = render(<Sparkline data={[5]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle two data points', () => {
      const { container } = render(<Sparkline data={[1, 5]} />);
      const polyline = container.querySelector('polyline');
      const points = polyline?.getAttribute('points');
      expect(points).toBeTruthy();
      const pointPairs = points?.split(' ');
      expect(pointPairs?.length).toBe(2);
    });

    it('should handle many data points', () => {
      const manyPoints = Array.from({ length: 100 }, (_, i) => i);
      const { container } = render(<Sparkline data={manyPoints} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should normalize data to fit in SVG bounds', () => {
      const { container } = render(<Sparkline data={[0, 100]} width={100} height={100} />);
      const polyline = container.querySelector('polyline');
      const points = polyline?.getAttribute('points');
      
      // First point should be at bottom (y=100), last at top (y=0)
      expect(points).toContain('0,100');
      expect(points).toContain('100,0');
    });

    it('should handle negative values', () => {
      const { container } = render(<Sparkline data={[-5, -2, -8]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle mixed positive and negative values', () => {
      const { container } = render(<Sparkline data={[-5, 0, 5]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const { container } = render(<Sparkline data={[1.5, 2.7, 3.2]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      const { container } = render(<Sparkline data={[1000000, 2000000, 3000000]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle very small values', () => {
      const { container } = render(<Sparkline data={[0.001, 0.002, 0.003]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle all same values', () => {
      const { container } = render(<Sparkline data={[5, 5, 5, 5]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('should handle zero values', () => {
      const { container } = render(<Sparkline data={[0, 0, 0]} />);
      const polyline = container.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty SVG when data is empty array', () => {
      const { container } = render(<Sparkline data={[]} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('polyline')).not.toBeInTheDocument();
    });

    it('should render empty SVG when data is undefined', () => {
      const { container } = render(<Sparkline />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('polyline')).not.toBeInTheDocument();
    });

    it('should use default dimensions for empty data', () => {
      const { container } = render(<Sparkline data={[]} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '120');
      expect(svg).toHaveAttribute('height', '28');
    });

    it('should use custom dimensions for empty data', () => {
      const { container } = render(<Sparkline data={[]} width={200} height={50} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '200');
      expect(svg).toHaveAttribute('height', '50');
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with Infinity', () => {
      const { container } = render(<Sparkline data={[1, Infinity, 3]} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle data with -Infinity', () => {
      const { container } = render(<Sparkline data={[1, -Infinity, 3]} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle data with NaN', () => {
      const { container } = render(<Sparkline data={[1, NaN, 3]} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle very small width', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={10} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '10');
    });

    it('should handle very small height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} height={5} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '5');
    });

    it('should handle very large width', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={1000} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '1000');
    });

    it('should handle very large height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} height={500} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '500');
    });

    it('should handle zero width', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={0} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '0');
    });

    it('should handle zero height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} height={0} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '0');
    });

    it('should handle negative width', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} width={-100} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle negative height', () => {
      const { container } = render(<Sparkline data={[1, 2, 3]} height={-50} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Component Updates', () => {
    it('should update when data changes', () => {
      const { container, rerender } = render(<Sparkline data={[1, 2, 3]} />);
      const initialPolyline = container.querySelector('polyline');
      const initialPoints = initialPolyline?.getAttribute('points');
      
      rerender(<Sparkline data={[10, 50, 100]} />);
      
      const updatedPolyline = container.querySelector('polyline');
      const updatedPoints = updatedPolyline?.getAttribute('points');
      
      expect(updatedPoints).not.toBe(initialPoints);
    });

    it('should update when width changes', () => {
      const { container, rerender } = render(<Sparkline data={[1, 2, 3]} width={100} />);
      expect(container.querySelector('svg')).toHaveAttribute('width', '100');
      
      rerender(<Sparkline data={[1, 2, 3]} width={200} />);
      expect(container.querySelector('svg')).toHaveAttribute('width', '200');
    });

    it('should update when height changes', () => {
      const { container, rerender } = render(<Sparkline data={[1, 2, 3]} height={30} />);
      expect(container.querySelector('svg')).toHaveAttribute('height', '30');
      
      rerender(<Sparkline data={[1, 2, 3]} height={60} />);
      expect(container.querySelector('svg')).toHaveAttribute('height', '60');
    });

    it('should handle transition from empty to populated data', () => {
      const { container, rerender } = render(<Sparkline data={[]} />);
      expect(container.querySelector('polyline')).not.toBeInTheDocument();
      
      rerender(<Sparkline data={[1, 2, 3]} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should handle transition from populated to empty data', () => {
      const { container, rerender } = render(<Sparkline data={[1, 2, 3]} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
      
      rerender(<Sparkline data={[]} />);
      expect(container.querySelector('polyline')).not.toBeInTheDocument();
    });
  });

  describe('Real-World Data Patterns', () => {
    it('should render stock price pattern', () => {
      const stockPrices = [100, 102, 99, 103, 105, 104, 108];
      const { container } = render(<Sparkline data={stockPrices} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should render temperature pattern', () => {
      const temperatures = [20, 22, 24, 23, 21, 19, 18];
      const { container } = render(<Sparkline data={temperatures} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should render user activity pattern', () => {
      const activity = [10, 25, 50, 75, 100, 85, 60, 40];
      const { container } = render(<Sparkline data={activity} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should render sales trend', () => {
      const sales = [1000, 1200, 1100, 1500, 1800, 2000, 1900];
      const { container } = render(<Sparkline data={sales} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });

    it('should render heartbeat-like pattern', () => {
      const heartbeat = [60, 62, 120, 65, 60, 63, 125, 64, 61];
      const { container } = render(<Sparkline data={heartbeat} />);
      expect(container.querySelector('polyline')).toBeInTheDocument();
    });
  });
});
