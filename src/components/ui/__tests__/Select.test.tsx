import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

describe('Select Components', () => {
  describe('Select', () => {
    it('should render select trigger', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );
      expect(container.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument();
    });

    it('should display placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
        </Select>
      );
      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('should have chevron icon', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('should have default height', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('should accept small size', () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('should apply custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should have border', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border');
    });

    it('should have rounded corners', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('rounded-md');
    });
  });

  describe('SelectValue', () => {
    it('should render with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Test placeholder" />
          </SelectTrigger>
        </Select>
      );
      expect(screen.getByText('Test placeholder')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      );
      expect(container.querySelector('[data-slot="select-value"]')).toBeInTheDocument();
    });
  });

  describe('Complete Select Example', () => {
    it('should render complete select with all parts', () => {
      const { container } = render(
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText('Select fruit')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });
  });
});
