import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PatientForm from '../PatientForm';
import { apiCall } from '@/lib/api-client';

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiCall: jest.fn(),
}));

const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>;

describe('PatientForm', () => {
  const mockOnSaved = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with all input fields', () => {
      render(<PatientForm onSaved={mockOnSaved} />);

      expect(screen.getByText(/name/i)).toBeInTheDocument();
      expect(screen.getByText(/phone/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should render cancel button when onCancel is provided', () => {
      render(<PatientForm onSaved={mockOnSaved} onCancel={mockOnCancel} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel is not provided', () => {
      render(<PatientForm onSaved={mockOnSaved} />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });

    it('should populate form with initial data', () => {
      const initialData = {
        id: '123',
        name: 'John Doe',
        phone: '+8801712345678',
        email: 'john@example.com',
      };

      const { container } = render(<PatientForm initial={initialData} onSaved={mockOnSaved} />);

      const inputs = container.querySelectorAll('input');
      expect(inputs[0]).toHaveValue('John Doe'); // name
      expect(inputs[1]).toHaveValue('+8801712345678'); // phone
      expect(inputs[2]).toHaveValue('john@example.com'); // email
    });
  });

  describe('Form Validation', () => {
    it('should require name field', async () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const nameInput = container.querySelectorAll('input')[0];
      expect(nameInput).toBeRequired();
    });

    it('should require phone field', () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const phoneInput = container.querySelectorAll('input')[1];
      expect(phoneInput).toBeRequired();
    });

    it('should not require email field', () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const emailInput = container.querySelectorAll('input')[2];
      expect(emailInput).not.toBeRequired();
    });
  });

  describe('Form Submission - Create New Patient', () => {
    it('should call API with correct data when creating new patient', async () => {
      const mockResponse = {
        success: true,
        data: { id: '456', name: 'Jane Smith', phone: '+8801798765432', email: 'jane@example.com' },
      };
      mockApiCall.mockResolvedValue(mockResponse);

      const { container } = render(<PatientForm onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      // Fill in the form
      await userEvent.type(inputs[0], 'Jane Smith');
      await userEvent.type(inputs[1], '+8801798765432');
      await userEvent.type(inputs[2], 'jane@example.com');

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/patients', {
          method: 'POST',
          body: {
            name: 'Jane Smith',
            phone: '+8801798765432',
            email: 'jane@example.com',
          },
        });
      });
    });

    it('should call onSaved with response data on successful creation', async () => {
      const mockResponse = {
        success: true,
        data: { id: '456', name: 'Jane Smith', phone: '+8801798765432' },
      };
      mockApiCall.mockResolvedValue(mockResponse);

      const { container } = render(<PatientForm onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      await userEvent.type(inputs[0], 'Jane Smith');
      await userEvent.type(inputs[1], '+8801798765432');
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockOnSaved).toHaveBeenCalledWith(mockResponse.data);
      });
    });

    it('should show "Saving..." text while submitting', async () => {
      mockApiCall.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: {} }), 100))
      );

      const { container } = render(<PatientForm onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      await userEvent.type(inputs[0], 'Test');
      await userEvent.type(inputs[1], '+8801700000000');
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);

      // Button should show "Saving..." immediately
      expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission - Update Existing Patient', () => {
    it('should call API with PUT method when updating existing patient', async () => {
      const initialData = {
        id: '123',
        name: 'John Doe',
        phone: '+8801712345678',
        email: 'john@example.com',
      };
      const mockResponse = { success: true, data: { ...initialData, name: 'John Updated' } };
      mockApiCall.mockResolvedValue(mockResponse);

      const { container } = render(<PatientForm initial={initialData} onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      // Update the name
      await userEvent.clear(inputs[0]);
      await userEvent.type(inputs[0], 'John Updated');

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('/patients/123', {
          method: 'PUT',
          body: {
            name: 'John Updated',
            phone: '+8801712345678',
            email: 'john@example.com',
          },
        });
      });
    });

    it('should update form fields when initial data changes', () => {
      const { rerender, container } = render(
        <PatientForm
          initial={{ id: '1', name: 'First', phone: '+8801700000001', email: 'first@test.com' }}
          onSaved={mockOnSaved}
        />
      );

      const inputs1 = container.querySelectorAll('input');
      expect(inputs1[0]).toHaveValue('First');

      // Update with new initial data
      rerender(
        <PatientForm
          initial={{ id: '2', name: 'Second', phone: '+8801700000002', email: 'second@test.com' }}
          onSaved={mockOnSaved}
        />
      );

      const inputs2 = container.querySelectorAll('input');
      expect(inputs2[0]).toHaveValue('Second');
      expect(inputs2[1]).toHaveValue('+8801700000002');
      expect(inputs2[2]).toHaveValue('second@test.com');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockApiCall.mockRejectedValue(new Error('API Error'));

      const { container } = render(<PatientForm onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      await userEvent.type(inputs[0], 'Jane');
      await userEvent.type(inputs[1], '+8801798765432');
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Form should be enabled again after error
      expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();

      consoleErrorSpy.mockRestore();
    });

    it('should not call onSaved when API returns success: false', async () => {
      mockApiCall.mockResolvedValue({ success: false });

      const { container } = render(<PatientForm onSaved={mockOnSaved} />);
      const inputs = container.querySelectorAll('input');

      await userEvent.type(inputs[0], 'Jane');
      await userEvent.type(inputs[1], '+8801700000000');
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalled();
      });

      expect(mockOnSaved).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(<PatientForm onSaved={mockOnSaved} onCancel={mockOnCancel} />);

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should not submit form when cancel button is clicked', () => {
      render(<PatientForm onSaved={mockOnSaved} onCancel={mockOnCancel} />);

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockApiCall).not.toHaveBeenCalled();
      expect(mockOnSaved).not.toHaveBeenCalled();
    });
  });

  describe('Form Input Changes', () => {
    it('should update name field value on change', async () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const nameInput = container.querySelectorAll('input')[0] as HTMLInputElement;
      await userEvent.type(nameInput, 'New Name');

      expect(nameInput.value).toBe('New Name');
    });

    it('should update phone field value on change', async () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const phoneInput = container.querySelectorAll('input')[1] as HTMLInputElement;
      await userEvent.type(phoneInput, '+8801712345678');

      expect(phoneInput.value).toBe('+8801712345678');
    });

    it('should update email field value on change', async () => {
      const { container } = render(<PatientForm onSaved={mockOnSaved} />);

      const emailInput = container.querySelectorAll('input')[2] as HTMLInputElement;
      await userEvent.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });
  });
});
