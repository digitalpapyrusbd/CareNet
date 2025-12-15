import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';
import { Input } from '../input';

describe('Form Components (react-hook-form + shadcn/ui)', () => {
  function TestForm() {
    const form = useForm({
      defaultValues: {
        username: '',
        email: '',
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormDescription>Your public display name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
    );
  }

  describe('FormItem', () => {
    it('should render form item', () => {
      const { container } = render(
        <FormItem>
          <div>Content</div>
        </FormItem>
      );
      expect(container.querySelector('[data-slot="form-item"]')).toBeInTheDocument();
    });

    it('should have grid layout', () => {
      const { container } = render(
        <FormItem>
          <div>Content</div>
        </FormItem>
      );
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem).toHaveClass('grid', 'gap-2');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <FormItem className="custom-class">
          <div>Content</div>
        </FormItem>
      );
      const formItem = container.querySelector('[data-slot="form-item"]');
      expect(formItem).toHaveClass('custom-class');
    });
  });

  describe('FormLabel', () => {
    it('should render in complete form', () => {
      render(<TestForm />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<TestForm />);
      const labels = document.querySelectorAll('[data-slot="form-label"]');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('FormDescription', () => {
    it('should render form description', () => {
      render(<TestForm />);
      expect(screen.getByText('Your public display name')).toBeInTheDocument();
    });

    it('should have data-slot attribute', () => {
      render(<TestForm />);
      const description = document.querySelector('[data-slot="form-description"]');
      expect(description).toBeInTheDocument();
    });

    it('should have muted foreground color', () => {
      render(<TestForm />);
      const description = screen.getByText('Your public display name');
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('Form Integration', () => {
    it('should render complete form with all fields', () => {
      render(<TestForm />);
      
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      const { container } = render(<TestForm />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      const formItems = container.querySelectorAll('[data-slot="form-item"]');
      expect(formItems.length).toBe(2);
    });

    it('should render input fields with correct types', () => {
      render(<TestForm />);
      
      const usernameInput = screen.getByPlaceholderText('Enter username');
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput.tagName).toBe('INPUT');
      
      const emailInput = screen.getByPlaceholderText('Enter email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('FormControl', () => {
    it('should render form control wrapper', () => {
      function SimpleForm() {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      const { container } = render(<SimpleForm />);
      const formControl = container.querySelector('[data-slot="form-control"]');
      expect(formControl).toBeInTheDocument();
    });
  });

  describe('Form with default values', () => {
    it('should initialize with default values', () => {
      function FormWithDefaults() {
        const form = useForm({
          defaultValues: {
            name: 'John Doe',
          },
        });

        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        );
      }

      render(<FormWithDefaults />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('John Doe');
    });
  });
});
