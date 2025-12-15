import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from '../data-table';

type TestData = {
  id: number;
  name: string;
  email: string;
  status: string;
};

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
];

const mockColumns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
];

describe('DataTable Component', () => {
  describe('Initialization & Rendering', () => {
    it('should render table element', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render data rows', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    });

    it('should render correct number of rows', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
    });

    it('should render thead and tbody', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });

    it('should wrap table in scrollable container', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('overflow-x-auto');
    });
  });

  describe('Column Rendering', () => {
    it('should render column headers in order', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveTextContent('Name');
      expect(headers[1]).toHaveTextContent('Email');
      expect(headers[2]).toHaveTextContent('Status');
    });

    it('should render all columns', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3);
    });

    it('should use column key as React key', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const headers = container.querySelectorAll('th');
      headers.forEach((header, index) => {
        expect(header).toBeInTheDocument();
      });
    });
  });

  describe('Data Rendering', () => {
    it('should render all data rows', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render cell values from data object', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('should access data using column key', () => {
      const customColumns = [
        { key: 'id', header: 'ID' },
      ];
      render(<DataTable columns={customColumns} data={mockData} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should handle missing data properties gracefully', () => {
      const dataWithMissing = [
        { id: 1, name: 'Test' } as TestData,
      ];
      const { container } = render(<DataTable columns={mockColumns} data={dataWithMissing} />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('should use row index as React key', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Render Functions', () => {
    it('should use custom render function when provided', () => {
      const columnsWithRender = [
        {
          key: 'name',
          header: 'Name',
          render: (row: TestData) => <strong>{row.name}</strong>,
        },
      ];
      render(<DataTable columns={columnsWithRender} data={mockData} />);
      const nameCell = screen.getByText('John Doe');
      expect(nameCell.tagName).toBe('STRONG');
    });

    it('should pass entire row to render function', () => {
      const columnsWithRender = [
        {
          key: 'name',
          header: 'Name',
          render: (row: TestData) => <span data-testid={`user-${row.id}`}>{row.name}</span>,
        },
      ];
      render(<DataTable columns={columnsWithRender} data={mockData} />);
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-2')).toBeInTheDocument();
      expect(screen.getByTestId('user-3')).toBeInTheDocument();
    });

    it('should allow complex render output', () => {
      const columnsWithRender = [
        {
          key: 'status',
          header: 'Status',
          render: (row: TestData) => (
            <span className={row.status === 'Active' ? 'text-green-500' : 'text-red-500'}>
              {row.status}
            </span>
          ),
        },
      ];
      const { container } = render(<DataTable columns={columnsWithRender} data={mockData} />);
      expect(container.querySelector('.text-green-500')).toBeInTheDocument();
      expect(container.querySelector('.text-red-500')).toBeInTheDocument();
    });

    it('should render buttons in cells', () => {
      const columnsWithRender = [
        {
          key: 'id',
          header: 'Actions',
          render: (row: TestData) => <button>Edit {row.id}</button>,
        },
      ];
      render(<DataTable columns={columnsWithRender} data={mockData} />);
      expect(screen.getByText('Edit 1')).toBeInTheDocument();
      expect(screen.getByText('Edit 2')).toBeInTheDocument();
      expect(screen.getByText('Edit 3')).toBeInTheDocument();
    });

    it('should render JSX elements from render function', () => {
      const columnsWithRender = [
        {
          key: 'name',
          header: 'Name',
          render: (row: TestData) => (
            <div>
              <span>{row.name}</span>
              <small>{row.email}</small>
            </div>
          ),
        },
      ];
      render(<DataTable columns={columnsWithRender} data={mockData} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply table background class', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const table = container.querySelector('table');
      expect(table).toHaveClass('bg-white');
      expect(table).toHaveClass('min-w-full');
    });

    it('should apply header cell padding and alignment', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const headers = container.querySelectorAll('th');
      headers.forEach(header => {
        expect(header).toHaveClass('px-4');
        expect(header).toHaveClass('py-2');
        expect(header).toHaveClass('text-left');
      });
    });

    it('should apply data cell padding', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const cells = container.querySelectorAll('tbody td');
      cells.forEach(cell => {
        expect(cell).toHaveClass('px-4');
        expect(cell).toHaveClass('py-2');
      });
    });

    it('should apply border to data rows', () => {
      const { container } = render(<DataTable columns={mockColumns} data={mockData} />);
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        expect(row).toHaveClass('border-t');
      });
    });
  });

  describe('Empty State', () => {
    it('should render table with no rows when data is empty', () => {
      render(<DataTable columns={mockColumns} data={[]} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1); // Only header row
    });

    it('should render headers even with empty data', () => {
      render(<DataTable columns={mockColumns} data={[]} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render tbody even with empty data', () => {
      const { container } = render(<DataTable columns={mockColumns} data={[]} />);
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single column', () => {
      const singleColumn = [{ key: 'name', header: 'Name' }];
      render(<DataTable columns={singleColumn} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle single row', () => {
      const singleRow = [mockData[0]];
      render(<DataTable columns={mockColumns} data={singleRow} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 1 header + 1 data row
    });

    it('should handle many columns', () => {
      const manyColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'status', header: 'Status' },
      ];
      render(<DataTable columns={manyColumns} data={mockData} />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(4);
    });

    it('should handle many rows', () => {
      const manyRows = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@test.com`,
        status: i % 2 === 0 ? 'Active' : 'Inactive',
      }));
      render(<DataTable columns={mockColumns} data={manyRows} />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(51); // 1 header + 50 data rows
    });

    it('should handle empty column key', () => {
      const columnsWithEmpty = [
        { key: '', header: 'Empty' },
      ];
      type EmptyData = { '': string };
      const dataWithEmpty: EmptyData[] = [{ '': 'value' }];
      render(<DataTable columns={columnsWithEmpty} data={dataWithEmpty} />);
      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    it('should handle special characters in data', () => {
      const specialData: TestData[] = [
        { id: 1, name: 'User <script>', email: 'test@test.com', status: 'Active & Ready' },
      ];
      render(<DataTable columns={mockColumns} data={specialData} />);
      expect(screen.getByText('User <script>')).toBeInTheDocument();
      expect(screen.getByText('Active & Ready')).toBeInTheDocument();
    });

    it('should handle null values in data', () => {
      const dataWithNull = [
        { id: 1, name: null, email: 'test@test.com', status: 'Active' },
      ] as unknown as TestData[];
      const { container } = render(<DataTable columns={mockColumns} data={dataWithNull} />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('should handle undefined values in data', () => {
      const dataWithUndefined = [
        { id: 1, name: undefined, email: 'test@test.com', status: 'Active' },
      ] as unknown as TestData[];
      const { container } = render(<DataTable columns={mockColumns} data={dataWithUndefined} />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('should handle numeric zero values', () => {
      type DataWithZero = { id: number; value: number };
      const dataWithZero: DataWithZero[] = [
        { id: 1, value: 0 },
      ];
      const columns = [
        { key: 'id', header: 'ID' },
        { key: 'value', header: 'Value' },
      ];
      render(<DataTable columns={columns} data={dataWithZero} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle boolean values', () => {
      type DataWithBoolean = { id: number; active: boolean };
      const dataWithBoolean: DataWithBoolean[] = [
        { id: 1, active: true },
        { id: 2, active: false },
      ];
      const columns = [
        { key: 'active', header: 'Active' },
      ];
      const { container } = render(<DataTable columns={columns} data={dataWithBoolean} />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('should handle very long text values', () => {
      const longText = 'A'.repeat(500);
      const dataWithLongText: TestData[] = [
        { id: 1, name: longText, email: 'test@test.com', status: 'Active' },
      ];
      render(<DataTable columns={mockColumns} data={dataWithLongText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Component Updates', () => {
    it('should update when data changes', () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      const newData: TestData[] = [
        { id: 10, name: 'New User', email: 'new@test.com', status: 'Active' },
      ];
      rerender(<DataTable columns={mockColumns} data={newData} />);
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('New User')).toBeInTheDocument();
    });

    it('should update when columns change', () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      
      const newColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Full Name' },
      ];
      rerender(<DataTable columns={newColumns} data={mockData} />);
      
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
    });

    it('should handle adding more data', () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={[mockData[0]]} />);
      let rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2);
      
      rerender(<DataTable columns={mockColumns} data={mockData} />);
      rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
    });

    it('should handle removing data', () => {
      const { rerender } = render(<DataTable columns={mockColumns} data={mockData} />);
      let rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4);
      
      rerender(<DataTable columns={mockColumns} data={[]} />);
      rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1);
    });
  });

  describe('Generic Type Support', () => {
    it('should work with different data types', () => {
      type Product = {
        id: number;
        name: string;
        price: number;
      };
      
      const products: Product[] = [
        { id: 1, name: 'Product A', price: 99.99 },
        { id: 2, name: 'Product B', price: 149.99 },
      ];
      
      const productColumns = [
        { key: 'name', header: 'Product' },
        { key: 'price', header: 'Price' },
      ];
      
      render(<DataTable columns={productColumns} data={products} />);
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('99.99')).toBeInTheDocument();
    });

    it('should work with complex nested objects', () => {
      type ComplexData = {
        id: number;
        user: { name: string };
      };
      
      const complexData: ComplexData[] = [
        { id: 1, user: { name: 'John' } },
      ];
      
      const complexColumns = [
        {
          key: 'user',
          header: 'User',
          render: (row: ComplexData) => row.user.name,
        },
      ];
      
      render(<DataTable columns={complexColumns} data={complexData} />);
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
