import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies variant className', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.firstChild as HTMLElement;
    // Primary variant uses bg-blue-600 not bg-primary-600
    expect(button).toHaveClass('bg-blue-600');
  });

  it('applies size className', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('min-h-[56px]');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByText('Click');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('vibrates on click if navigator.vibrate exists', () => {
    const vibrate = jest.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrate,
      writable: true,
      configurable: true
    });

    render(<Button>Click</Button>);
    screen.getByText('Click').click();

    expect(vibrate).toHaveBeenCalledWith(10);
  });
});
