import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuardianDashboard from '../guardian/page.tsx';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard/guardian',
}));

// Mock API calls
global.fetch = jest.fn();

describe('Guardian Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/dashboard/stats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              totalPatients: 3,
              activeJobs: 2,
              completedJobs: 5,
              pendingPayments: 1,
            },
          }),
        });
      }
      
      if (url.includes('/api/patients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: [
              {
                id: '1',
                name: 'Patient One',
                dateOfBirth: '1990-01-01',
                gender: 'MALE',
                mobilityLevel: 'INDEPENDENT',
              },
              {
                id: '2',
                name: 'Patient Two',
                dateOfBirth: '1985-05-15',
                gender: 'FEMALE',
                mobilityLevel: 'ASSISTED',
              },
            ],
          }),
        });
      }
      
      if (url.includes('/api/jobs')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: [
              {
                id: '1',
                status: 'ACTIVE',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                patient: { name: 'Patient One' },
                company: { companyName: 'Care Company' },
                package: { name: 'Basic Care' },
              },
            ],
          }),
        });
      }
      
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
    });
  });

  it('renders dashboard with stats cards', async () => {
    render(<GuardianDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Patients')).toBeInTheDocument();
      expect(screen.getByText('Active Jobs')).toBeInTheDocument();
      expect(screen.getByText('Completed Jobs')).toBeInTheDocument();
      expect(screen.getByText('Pending Payments')).toBeInTheDocument();
    });
  });

  it('displays patient information', async () => {
    render(<GuardianDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Patient One')).toBeInTheDocument();
      expect(screen.getByText('Patient Two')).toBeInTheDocument();
    });
  });

  it('shows active jobs', async () => {
    render(<GuardianDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Jobs')).toBeInTheDocument();
      expect(screen.getByText('Patient One')).toBeInTheDocument();
      expect(screen.getByText('Care Company')).toBeInTheDocument();
    });
  });

  it('has navigation to add new patient', async () => {
    render(<GuardianDashboard />);
    
    await waitFor(() => {
      const addPatientButton = screen.getByText('Add New Patient');
      expect(addPatientButton).toBeInTheDocument();
      expect(addPatientButton.closest('a')).toHaveAttribute('href', '/patients/new');
    });
  });

  it('has navigation to create new job', async () => {
    render(<GuardianDashboard />);
    
    await waitFor(() => {
      const createJobButton = screen.getByText('Create New Job');
      expect(createJobButton).toBeInTheDocument();
      expect(createJobButton.closest('a')).toHaveAttribute('href', '/jobs');
    });
  });

  it('displays error message when API fails', async () => {
    // Mock failed API response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to fetch data' }),
      })
    );

    render(<GuardianDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });
});