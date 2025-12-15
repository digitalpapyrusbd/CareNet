/* eslint-env jest */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render table element', () => {
    render(
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
          </tr>
        </tbody>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should apply custom className to the table container', () => {
    const { container } = render(<Table className="custom-table" />);
    expect(container.querySelector('.custom-table')).toBeInTheDocument();
  });
});
