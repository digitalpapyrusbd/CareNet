import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';

// Mock the useAuth hook
const mockLogout = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Navigation and Sidebar components
jest.mock('../Navigation', () => {
  const MockNavigation = () => <nav data-testid="navigation">Navigation</nav>;
  MockNavigation.displayName = 'Navigation';
  return MockNavigation;
});

jest.mock('../Sidebar', () => {
  const MockSidebar = ({ children }: { children: React.ReactNode }) => (
    <aside data-testid="sidebar">{children}</aside>
  );
  MockSidebar.displayName = 'Sidebar';
  return MockSidebar;
});

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language</div>,
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme</div>,
}));

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  describe('Rendering - Unauthenticated User', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should render layout with header', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Caregiver Solution')).toBeInTheDocument();
      expect(screen.getByText('Bangladesh')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render navigation', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    it('should not render logout button when not authenticated', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('should not show user welcome message when not authenticated', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    });
  });

  describe('Rendering - Authenticated User', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        logout: mockLogout,
      });
    });

    it('should display welcome message with user name', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    });

    it('should render logout button when authenticated', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should call logout handler when logout button is clicked', async () => {
      mockLogout.mockResolvedValue(undefined);

      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should redirect to login page after successful logout', async () => {
      mockLogout.mockResolvedValue(undefined);

      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      fireEvent.click(screen.getByText('Logout'));

      // Wait for async logout to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(window.location.href).toBe('/auth/login');
    });
  });

  describe('Sidebar Functionality', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should not render sidebar by default', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('should render sidebar when showSidebar is true', () => {
      render(
        <Layout showSidebar={true}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should render custom sidebar content', () => {
      render(
        <Layout showSidebar={true} sidebarContent={<div>Custom Sidebar</div>}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Custom Sidebar')).toBeInTheDocument();
    });
  });

  describe('Header Content', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should render custom header content when provided', () => {
      render(
        <Layout headerContent={<div>Custom Header</div>}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
    });

    it('should display brand logo with initials', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const logo = screen.getByText('CP');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('text-white', 'font-bold');
    });
  });

  describe('Styling and Classes', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should apply default className', () => {
      const { container } = render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const layoutDiv = container.firstChild as HTMLElement;
      expect(layoutDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Layout className="custom-class">
          <div>Content</div>
        </Layout>
      );

      const layoutDiv = container.firstChild as HTMLElement;
      expect(layoutDiv).toHaveClass('custom-class');
    });

    it('should have sticky header', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should have shadow on header', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('shadow-sm', 'border-b');
    });
  });

  describe('Navigation Links', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should render navigation component in header', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const nav = screen.getByTestId('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should hide navigation on mobile screens', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const navContainer = screen.getByTestId('navigation').parentElement;
      expect(navContainer).toHaveClass('hidden', 'md:block');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        logout: mockLogout,
      });
    });

    it('should handle logout errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLogout.mockRejectedValue(new Error('Logout failed'));

      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      fireEvent.click(screen.getByText('Logout'));

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should have responsive container padding', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const container = screen.getByText('Caregiver Solution').closest('.max-w-7xl');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });

    it('should have responsive header height', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const headerContent = screen.getByText('Caregiver Solution').closest('.h-16');
      expect(headerContent).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        isAuthenticated: true,
        logout: mockLogout,
      });
    });

    it('should have proper header role', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have accessible logout button', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it('should render multiple children components', () => {
      render(
        <Layout>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </Layout>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      render(
        <Layout>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </Layout>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});
