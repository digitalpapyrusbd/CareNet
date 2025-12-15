/**
 * Patient Details Page
 * Displays comprehensive patient information and management options
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks/useApi';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  phoneNumber: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  guardianId: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthRecord {
  id: string;
  patientId: string;
  recordType: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  doctorName?: string;
  hospitalName?: string;
  recordDate: string;
  attachments: string[];
  createdAt: string;
}

interface CareLog {
  id: string;
  patientId: string;
  caregiverId: string;
  jobId: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime?: string;
  vitals: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
  medications: {
    name: string;
    dosage: string;
    time: string;
    given: boolean;
  }[];
  notes: string;
  caregiverName: string;
  createdAt: string;
}

export default function PatientDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { request } = useApi();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'care'>('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddHealthRecordModal, setShowAddHealthRecordModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPatientData();
    }
  }, [params.id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch patient details
      const patientResponse = await request(`/patients/${params.id}`);
      setPatient(patientResponse.data);
      
      // Fetch health records
      const healthResponse = await request(`/health-records?patientId=${params.id}`);
      setHealthRecords(healthResponse.data);
      
      // Fetch care logs
      const careResponse = await request(`/care-logs?patientId=${params.id}`);
      setCareLogs(careResponse.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePatient = async (formData: any) => {
    try {
      await request(`/patients/${params.id}`, {
        method: 'PUT',
        body: formData,
      });
      
      setShowEditModal(false);
      fetchPatientData();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleAddHealthRecord = async (formData: any) => {
    try {
      await request('/health-records', {
        method: 'POST',
        body: {
          ...formData,
          patientId: params.id,
        },
      });
      
      setShowAddHealthRecordModal(false);
      fetchPatientData();
    } catch (error) {
      console.error('Error adding health record:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('patient.notFound')}
          </h1>
          <Button onClick={() => router.back()}>
            {t('common.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('patient.patientDetails')}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
          >
            {t('common.edit')}
          </Button>
          <Button
            onClick={() => router.push(`/patients/${params.id}/care-logs/new`)}
          >
            {t('care.addCareLog')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('patient.overview')}
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'health'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('patient.healthRecords')}
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'care'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('patient.careLogs')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <Card.Header>
              <Card.Title>{t('patient.personalInformation')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.fullName')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.dateOfBirth')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.gender')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {t(`patient.gender.${patient.gender.toLowerCase()}`)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.bloodGroup')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.bloodGroup || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.phoneNumber')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.phoneNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.email')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.email || 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.address')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.address}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <Card.Header>
              <Card.Title>{t('patient.emergencyContact')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.contactName')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.relationship')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.emergencyContact.relationship}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patient.contactPhone')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.emergencyContact.phoneNumber}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Medical Information */}
          <Card className="lg:col-span-3">
            <Card.Header>
              <Card.Title>{t('patient.medicalInformation')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('patient.medicalConditions')}
                  </label>
                  <ul className="list-disc list-inside space-y-1">
                    {patient.medicalConditions.length > 0 ? (
                      patient.medicalConditions.map((condition, index) => (
                        <li key={index} className="text-sm text-gray-900">
                          {condition}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">
                        {t('patient.noConditions')}
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('patient.allergies')}
                  </label>
                  <ul className="list-disc list-inside space-y-1">
                    {patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, index) => (
                        <li key={index} className="text-sm text-gray-900">
                          {allergy}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">
                        {t('patient.noAllergies')}
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('patient.medications')}
                  </label>
                  <ul className="list-disc list-inside space-y-1">
                    {patient.medications.length > 0 ? (
                      patient.medications.map((medication, index) => (
                        <li key={index} className="text-sm text-gray-900">
                          {medication}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">
                        {t('patient.noMedications')}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === 'health' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('patient.healthRecords')}
            </h2>
            <Button
              onClick={() => setShowAddHealthRecordModal(true)}
            >
              {t('patient.addHealthRecord')}
            </Button>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('health.recordType')}</Table.Head>
                <Table.Head>{t('health.description')}</Table.Head>
                <Table.Head>{t('health.doctor')}</Table.Head>
                <Table.Head>{t('health.hospital')}</Table.Head>
                <Table.Head>{t('health.recordDate')}</Table.Head>
                <Table.Head>{t('common.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {healthRecords.map((record) => (
                <Table.Row key={record.id}>
                  <Table.Cell>{record.recordType}</Table.Cell>
                  <Table.Cell>{record.description}</Table.Cell>
                  <Table.Cell>{record.doctorName || 'N/A'}</Table.Cell>
                  <Table.Cell>{record.hospitalName || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    {new Date(record.recordDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/health-records/${record.id}`)}
                    >
                      {t('common.view')}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {healthRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('patient.noHealthRecords')}
              </p>
              <Button
                className="mt-4"
                onClick={() => setShowAddHealthRecordModal(true)}
              >
                {t('patient.addFirstHealthRecord')}
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'care' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('patient.careLogs')}
            </h2>
            <Button
              onClick={() => router.push(`/patients/${params.id}/care-logs/new`)}
            >
              {t('care.addCareLog')}
            </Button>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('care.visitDate')}</Table.Head>
                <Table.Head>{t('care.caregiver')}</Table.Head>
                <Table.Head>{t('care.checkIn')}</Table.Head>
                <Table.Head>{t('care.checkOut')}</Table.Head>
                <Table.Head>{t('care.vitals')}</Table.Head>
                <Table.Head>{t('care.notes')}</Table.Head>
                <Table.Head>{t('common.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {careLogs.map((log) => (
                <Table.Row key={log.id}>
                  <Table.Cell>
                    {new Date(log.visitDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{log.caregiverName}</Table.Cell>
                  <Table.Cell>
                    {new Date(log.checkInTime).toLocaleTimeString()}
                  </Table.Cell>
                  <Table.Cell>
                    {log.checkOutTime
                      ? new Date(log.checkOutTime).toLocaleTimeString()
                      : 'N/A'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm">
                      {log.vitals.bloodPressure && (
                        <div>BP: {log.vitals.bloodPressure}</div>
                      )}
                      {log.vitals.heartRate && (
                        <div>HR: {log.vitals.heartRate} bpm</div>
                      )}
                      {log.vitals.temperature && (
                        <div>Temp: {log.vitals.temperature}°C</div>
                      )}
                      {log.vitals.oxygenSaturation && (
                        <div>SpO2: {log.vitals.oxygenSaturation}%</div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-w-xs truncate">
                    {log.notes}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/care-logs/${log.id}`)}
                    >
                      {t('common.view')}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {careLogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('patient.noCareLogs')}
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/patients/${params.id}/care-logs/new`)}
              >
                {t('care.addFirstCareLog')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t('patient.editPatient')}
      >
        <Form
          onSubmit={handleUpdatePatient}
          initialValues={patient}
          fields={[
            {
              name: 'firstName',
              label: t('patient.firstName'),
              type: 'text',
              required: true,
            },
            {
              name: 'lastName',
              label: t('patient.lastName'),
              type: 'text',
              required: true,
            },
            {
              name: 'dateOfBirth',
              label: t('patient.dateOfBirth'),
              type: 'date',
              required: true,
            },
            {
              name: 'gender',
              label: t('patient.gender'),
              type: 'select',
              options: [
                { value: 'MALE', label: t('patient.gender.male') },
                { value: 'FEMALE', label: t('patient.gender.female') },
                { value: 'OTHER', label: t('patient.gender.other') },
              ],
              required: true,
            },
            {
              name: 'bloodGroup',
              label: t('patient.bloodGroup'),
              type: 'select',
              options: [
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
              ],
            },
            {
              name: 'phoneNumber',
              label: t('patient.phoneNumber'),
              type: 'tel',
              required: true,
            },
            {
              name: 'email',
              label: t('patient.email'),
              type: 'email',
            },
            {
              name: 'address',
              label: t('patient.address'),
              type: 'textarea',
              required: true,
            },
          ]}
        />
      </Modal>

      {/* Add Health Record Modal */}
      <Modal
        isOpen={showAddHealthRecordModal}
        onClose={() => setShowAddHealthRecordModal(false)}
        title={t('patient.addHealthRecord')}
      >
        <Form
          onSubmit={handleAddHealthRecord}
          fields={[
            {
              name: 'recordType',
              label: t('health.recordType'),
              type: 'select',
              options: [
                { value: 'CHECKUP', label: t('health.type.checkup') },
                { value: 'EMERGENCY', label: t('health.type.emergency') },
                { value: 'SPECIALIST', label: t('health.type.specialist') },
                { value: 'LAB_RESULT', label: t('health.type.labResult') },
                { value: 'PRESCRIPTION', label: t('health.type.prescription') },
              ],
              required: true,
            },
            {
              name: 'description',
              label: t('health.description'),
              type: 'textarea',
              required: true,
            },
            {
              name: 'diagnosis',
              label: t('health.diagnosis'),
              type: 'textarea',
            },
            {
              name: 'treatment',
              label: t('health.treatment'),
              type: 'textarea',
            },
            {
              name: 'doctorName',
              label: t('health.doctor'),
              type: 'text',
            },
            {
              name: 'hospitalName',
              label: t('health.hospital'),
              type: 'text',
            },
            {
              name: 'recordDate',
              label: t('health.recordDate'),
              type: 'date',
              required: true,
            },
          ]}
        />
      </Modal>
    </div>
  );
}