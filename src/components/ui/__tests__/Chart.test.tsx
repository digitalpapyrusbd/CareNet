import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig 
} from '../chart';
import { BarChart, Bar } from 'recharts';

describe('Chart Components (shadcn/ui)', () => {
  const mockConfig: ChartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  };

  const mockData = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
  ];

  describe('ChartContainer', () => {
    it('should render chart container with config', () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
          </BarChart>
        </ChartContainer>
      );
      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ChartContainer config={mockConfig} className="custom-class">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
          </BarChart>
        </ChartContainer>
      );
      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass('custom-class');
    });

    it('should have aspect-video class by default', () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
          </BarChart>
        </ChartContainer>
      );
      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass('aspect-video');
    });
  });

  describe('ChartLegend', () => {
    it('should render legend content', () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('ChartTooltip', () => {
    it('should render tooltip', () => {
      const { container } = render(
        <ChartContainer config={mockConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      );
      expect(container).toBeInTheDocument();
    });
  });
});
