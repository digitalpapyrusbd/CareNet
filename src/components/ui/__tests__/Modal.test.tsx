import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  describe('Initialization', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Test Content</div>
          <p>Paragraph content</p>
        </Modal>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    });

    it('should prevent body scroll when open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const heading = screen.queryByRole('heading', { level: 3 });
      expect(heading).not.toBeInTheDocument();
    });

    it('should render title with correct styling', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Styled Title">
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByText('Styled Title');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });
  });

  describe('Close Button', () => {
    it('should show close button by default', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render close icon SVG', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should call onClose when Escape key pressed', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose for other keys', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'a' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not listen for Escape when closed', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Overlay Interactions', () => {
    it('should close when overlay clicked by default', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const overlay = container.querySelector('.bg-opacity-50');
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should not close when closeOnOverlayClick is false', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <div>Content</div>
        </Modal>
      );

      const overlay = container.querySelector('.bg-opacity-50');
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).not.toHaveBeenCalled();
      }
    });

    it('should not close when clicking modal content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const content = screen.getByText('Content');
      fireEvent.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    it('should apply md size by default', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.max-w-lg');
      expect(modal).toBeInTheDocument();
    });

    it('should apply sm size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="sm">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.max-w-md');
      expect(modal).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="lg">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.max-w-2xl');
      expect(modal).toBeInTheDocument();
    });

    it('should apply xl size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="xl">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.max-w-4xl');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} className="custom-modal">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.custom-modal');
      expect(modal).toBeInTheDocument();
    });

    it('should render overlay with black background', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const overlay = container.querySelector('.bg-black.bg-opacity-50');
      expect(overlay).toBeInTheDocument();
    });

    it('should render modal with white background', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.bg-white');
      expect(modal).toBeInTheDocument();
    });

    it('should apply shadow and rounded corners', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.shadow-xl.rounded-lg');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have sr-only text for close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const srText = screen.getByText('Close');
      expect(srText).toHaveClass('sr-only');
    });

    it('should have focus ring on close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('should be positioned with z-50 for proper stacking', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const wrapper = container.querySelector('.z-50');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should render fixed fullscreen overlay', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('should center modal content', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const flexContainer = container.querySelector('.items-center.justify-center');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have padding on modal content', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('.p-6');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Header Layout', () => {
    it('should render header when title provided', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Header">
          <div>Content</div>
        </Modal>
      );

      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('should render header when close button shown', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} showCloseButton={true}>
          <div>Content</div>
        </Modal>
      );

      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('should not render header when no title and close button hidden', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <div>Content</div>
        </Modal>
      );

      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).not.toBeInTheDocument();
    });

    it('should add margin below header', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Title">
          <div>Content</div>
        </Modal>
      );

      const header = container.querySelector('.mb-4');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Multiple Modals', () => {
    it('should handle opening and closing multiple times', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
