import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PatientTable from '../PatientTable';

type Patient = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

const mockPatients: Patient[] = [
  { id: '1', name: 'John Doe', phone: '1234567890', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', phone: '0987654321', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', phone: undefined, email: undefined },
];

describe('PatientTable Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization & Rendering', () => {
    it('should render table element', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render correct number of header columns', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(4);
    });

    it('should render all patient rows', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render correct number of rows', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
    });

    it('should wrap table in scrollable container', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('overflow-x-auto');
    });
  });

  describe('Patient Data Display', () => {
    it('should display patient names', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display patient phone numbers', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('0987654321')).toBeInTheDocument();
    });

    it('should display patient emails', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should display dash for missing phone', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThanOrEqual(2); // At least 2 dashes for missing phone and email
    });

    it('should display dash for missing email', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThanOrEqual(2);
    });

    it('should use patient id as row key', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);
    });
  });

  describe('Action Buttons', () => {
    it('should render Edit button for each patient', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons).toHaveLength(3);
    });

    it('should render Delete button for each patient', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(3);
    });

    it('should call onEdit with patient when Edit clicked', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[0]);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockPatients[0]);
    });

    it('should call onDelete with patient id when Delete clicked', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(deleteButtons[0]);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('should call onEdit with correct patient for second row', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[1]);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockPatients[1]);
    });

    it('should call onDelete with correct id for third row', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(deleteButtons[2]);
      
      expect(mockOnDelete).toHaveBeenCalledWith('3');
    });

    it('should apply blue color to Edit button', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      editButtons.forEach(button => {
        expect(button).toHaveClass('text-blue-600');
      });
    });

    it('should apply red color to Delete button', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      deleteButtons.forEach(button => {
        expect(button).toHaveClass('text-red-600');
      });
    });

    it('should apply margin to Edit button', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      editButtons.forEach(button => {
        expect(button).toHaveClass('mr-2');
      });
    });
  });

  describe('Styling', () => {
    it('should apply table background class', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const table = container.querySelector('table');
      expect(table).toHaveClass('bg-white');
      expect(table).toHaveClass('min-w-full');
    });

    it('should apply header cell padding and alignment', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const headers = container.querySelectorAll('th');
      
      // First three headers should be left-aligned
      expect(headers[0]).toHaveClass('px-4');
      expect(headers[0]).toHaveClass('py-2');
      expect(headers[0]).toHaveClass('text-left');
    });

    it('should center align Actions header', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const headers = container.querySelectorAll('th');
      const actionsHeader = headers[3];
      
      expect(actionsHeader).toHaveClass('px-4');
      expect(actionsHeader).toHaveClass('py-2');
      expect(actionsHeader).not.toHaveClass('text-left');
    });

    it('should apply data cell padding', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const cells = container.querySelectorAll('tbody td');
      cells.forEach(cell => {
        expect(cell).toHaveClass('px-4');
        expect(cell).toHaveClass('py-2');
      });
    });

    it('should center align action cells', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const actionCell = row.querySelector('td:last-child');
        expect(actionCell).toHaveClass('text-center');
      });
    });

    it('should apply border to data rows', () => {
      const { container } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        expect(row).toHaveClass('border-t');
      });
    });
  });

  describe('Empty State', () => {
    it('should render table with no rows when patients array is empty', () => {
      render(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1); // Only header row
    });

    it('should render headers even with empty patients', () => {
      render(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should not render any Edit buttons when empty', () => {
      render(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('should not render any Delete buttons when empty', () => {
      render(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single patient', () => {
      const singlePatient = [mockPatients[0]];
      render(<PatientTable patients={singlePatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 1 header + 1 data row
    });

    it('should handle patient with only name', () => {
      const minimalPatient: Patient[] = [
        { id: '10', name: 'Minimal User' },
      ];
      render(<PatientTable patients={minimalPatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('Minimal User')).toBeInTheDocument();
      expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(2);
    });

    it('should handle patient with empty string phone', () => {
      const patientWithEmptyPhone: Patient[] = [
        { id: '11', name: 'Test', phone: '', email: 'test@test.com' },
      ];
      render(<PatientTable patients={patientWithEmptyPhone} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should handle patient with empty string email', () => {
      const patientWithEmptyEmail: Patient[] = [
        { id: '12', name: 'Test', phone: '1234567890', email: '' },
      ];
      render(<PatientTable patients={patientWithEmptyEmail} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should handle special characters in patient name', () => {
      const specialPatient: Patient[] = [
        { id: '13', name: "O'Brien <Test>", phone: '1234567890', email: 'test@test.com' },
      ];
      render(<PatientTable patients={specialPatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText("O'Brien <Test>")).toBeInTheDocument();
    });

    it('should handle special characters in email', () => {
      const specialPatient: Patient[] = [
        { id: '14', name: 'Test', phone: '1234567890', email: 'test+special@example.co.uk' },
      ];
      render(<PatientTable patients={specialPatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('test+special@example.co.uk')).toBeInTheDocument();
    });

    it('should handle very long patient name', () => {
      const longName = 'A'.repeat(100);
      const longNamePatient: Patient[] = [
        { id: '15', name: longName, phone: '1234567890', email: 'test@test.com' },
      ];
      render(<PatientTable patients={longNamePatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle very long phone number', () => {
      const longPhone = '1'.repeat(50);
      const longPhonePatient: Patient[] = [
        { id: '16', name: 'Test', phone: longPhone, email: 'test@test.com' },
      ];
      render(<PatientTable patients={longPhonePatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText(longPhone)).toBeInTheDocument();
    });

    it('should handle many patients', () => {
      const manyPatients = Array.from({ length: 100 }, (_, i) => ({
        id: `id-${i}`,
        name: `Patient ${i}`,
        phone: `123456${i}`,
        email: `patient${i}@test.com`,
      }));
      render(<PatientTable patients={manyPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(101); // 1 header + 100 data rows
    });

    it('should handle numeric id', () => {
      const numericIdPatient: Patient[] = [
        { id: '123', name: 'Test', phone: '1234567890', email: 'test@test.com' },
      ];
      render(<PatientTable patients={numericIdPatient} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      expect(mockOnDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('Component Updates', () => {
    it('should update when patients change', () => {
      const { rerender } = render(<PatientTable patients={[mockPatients[0]]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      
      rerender(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should update callbacks when they change', () => {
      const newOnEdit = jest.fn();
      const { rerender } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      
      rerender(<PatientTable patients={mockPatients} onEdit={newOnEdit} onDelete={mockOnDelete} />);
      
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      expect(mockOnEdit).not.toHaveBeenCalled();
      expect(newOnEdit).toHaveBeenCalledWith(mockPatients[0]);
    });

    it('should handle adding patients', () => {
      const { rerender } = render(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      let rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1);
      
      rerender(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
    });

    it('should handle removing patients', () => {
      const { rerender } = render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      let rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
      
      rerender(<PatientTable patients={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1);
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle multiple Edit clicks', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[0]);
      fireEvent.click(editButtons[1]);
      fireEvent.click(editButtons[2]);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple Delete clicks', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(deleteButtons[0]);
      fireEvent.click(deleteButtons[1]);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(2);
      expect(mockOnDelete).toHaveBeenNthCalledWith(1, '1');
      expect(mockOnDelete).toHaveBeenNthCalledWith(2, '2');
    });

    it('should handle Edit and Delete on same patient', () => {
      render(<PatientTable patients={mockPatients} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(editButtons[0]);
      fireEvent.click(deleteButtons[0]);
      
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });
});
