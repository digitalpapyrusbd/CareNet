/**
 * Patients List Page
 * Displays all patients for the logged-in guardian
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks/useApi';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  address: string;
  guardianId: string;
  createdAt: string;
  updatedAt: string;
}

export default function PatientsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { request } = useApi();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      });
      
      const response = await request(`/patients?${params}`);
      setPatients(response.data.patients || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPatients();
  };

  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatGender = (gender: string) => {
    return t(`patient.gender.${gender.toLowerCase()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('patient.myPatients')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('patient.myPatientsDescription')}
          </p>
        </div>
        <Button
          onClick={() => router.push('/patients/new')}
        >
          {t('patient.addNewPatient')}
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <Card.Content>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <Input
              type="text"
              placeholder={t('patient.searchPatients')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {t('common.search')}
            </Button>
          </form>
        </Card.Content>
      </Card>

      {/* Patients List */}
      <Card>
        <Card.Header>
          <Card.Title>
            {t('patient.patientsList')} ({patients.length})
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : patients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>{t('patient.name')}</Table.Head>
                    <Table.Head>{t('patient.age')}</Table.Head>
                    <Table.Head>{t('patient.gender')}</Table.Head>
                    <Table.Head>{t('patient.phoneNumber')}</Table.Head>
                    <Table.Head>{t('patient.address')}</Table.Head>
                    <Table.Head>{t('patient.registeredOn')}</Table.Head>
                    <Table.Head>{t('common.actions')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {patients.map((patient) => (
                    <Table.Row key={patient.id}>
                      <Table.Cell className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </Table.Cell>
                      <Table.Cell>{getAge(patient.dateOfBirth)} years</Table.Cell>
                      <Table.Cell>{formatGender(patient.gender)}</Table.Cell>
                      <Table.Cell>{patient.phoneNumber}</Table.Cell>
                      <Table.Cell className="max-w-xs truncate">
                        {patient.address}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/patients/${patient.id}`)}
                          >
                            {t('common.view')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/patients/${patient.id}/care-logs/new`)}
                          >
                            {t('care.addCareLog')}
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? t('patient.noPatientsFound') : t('patient.noPatientsYet')}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? t('patient.tryDifferentSearch')
                  : t('patient.addFirstPatient')}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/patients/new')}>
                  {t('patient.addNewPatient')}
                </Button>
              )}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t('common.previous')}
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}