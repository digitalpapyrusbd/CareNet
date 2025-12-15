import { render, screen } from '@testing-library/react';
import { BottomNav } from '../BottomNav';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('BottomNav Component', () => {
  it('renders all navigation items', () => {
    render(<BottomNav />);
    
    // Check for navigation items by label
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('Earnings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<BottomNav />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<BottomNav />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const jobsLink = screen.getByRole('link', { name: /jobs/i });
    
    expect(homeLink).toHaveAttribute('href', '/dashboard');
    expect(jobsLink).toHaveAttribute('href', '/jobs');
  });
});
