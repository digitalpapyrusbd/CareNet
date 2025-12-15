import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card component', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should have rounded corners', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('rounded-xl');
    });

    it('should have border', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('border');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    });

    it('should render header content', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should have padding', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.querySelector('[data-slot="card-header"]');
      expect(header).toHaveClass('px-6', 'pt-6');
    });
  });

  describe('CardTitle', () => {
    it('should render card title', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
    });

    it('should render title as h4 element', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByText('Card Title');
      expect(title.tagName).toBe('H4');
    });

    it('should have leading-none class', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('leading-none');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      const { container } = render(<CardDescription>Description</CardDescription>);
      expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
    });

    it('should render description as paragraph', () => {
      render(<CardDescription>Card description</CardDescription>);
      const description = screen.getByText('Card description');
      expect(description.tagName).toBe('P');
    });

    it('should have muted foreground color', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    });

    it('should render content text', () => {
      render(<CardContent>Main content</CardContent>);
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('should have horizontal padding', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.querySelector('[data-slot="card-content"]');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
    });

    it('should render footer content', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should have flex display', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.querySelector('[data-slot="card-footer"]');
      expect(footer).toHaveClass('flex', 'items-center');
    });

    it('should have padding', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.querySelector('[data-slot="card-footer"]');
      expect(footer).toHaveClass('px-6', 'pb-6');
    });
  });

  describe('Complete Card Example', () => {
    it('should render complete card with all parts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });

    it('should apply custom classNames to all parts', () => {
      const { container } = render(
        <Card className="card-custom">
          <CardHeader className="header-custom">
            <CardTitle className="title-custom">Title</CardTitle>
          </CardHeader>
          <CardContent className="content-custom">Content</CardContent>
          <CardFooter className="footer-custom">Footer</CardFooter>
        </Card>
      );

      expect(container.querySelector('.card-custom')).toBeInTheDocument();
      expect(container.querySelector('.header-custom')).toBeInTheDocument();
      expect(container.querySelector('.title-custom')).toBeInTheDocument();
      expect(container.querySelector('.content-custom')).toBeInTheDocument();
      expect(container.querySelector('.footer-custom')).toBeInTheDocument();
    });
  });
});
