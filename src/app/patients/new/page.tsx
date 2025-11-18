/**
 * New Patient Registration Page
 * Allows guardians to register new patients
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks/useApi';

interface PatientFormData {
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
}

export default function NewPatientPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { request } = useApi();
  
  const [loading, setLoading] = useState(false);
  const [medicalCondition, setMedicalCondition] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medication, setMedication] = useState('');

  const handleSubmit = async (formData: PatientFormData) => {
    try {
      setLoading(true);
      
      const response = await request('/patients', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        router.push(`/patients/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedicalCondition = (field: any, value: string) => {
    if (value.trim()) {
      const currentConditions = field.value || [];
      field.onChange([...currentConditions, value.trim()]);
      setMedicalCondition('');
    }
  };

  const removeMedicalCondition = (field: any, index: number) => {
    const currentConditions = field.value || [];
    field.onChange(currentConditions.filter((_: any, i: number) => i !== index));
  };

  const addAllergy = (field: any, value: string) => {
    if (value.trim()) {
      const currentAllergies = field.value || [];
      field.onChange([...currentAllergies, value.trim()]);
      setAllergy('');
    }
  };

  const removeAllergy = (field: any, index: number) => {
    const currentAllergies = field.value || [];
    field.onChange(currentAllergies.filter((_: any, i: number) => i !== index));
  };

  const addMedication = (field: any, value: string) => {
    if (value.trim()) {
      const currentMedications = field.value || [];
      field.onChange([...currentMedications, value.trim()]);
      setMedication('');
    }
  };

  const removeMedication = (field: any, index: number) => {
    const currentMedications = field.value || [];
    field.onChange(currentMedications.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('patient.registerNewPatient')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('patient.registerNewPatientDescription')}
        </p>
      </div>

      {/* Form */}
      <Card>
        <Card.Header>
          <Card.Title>{t('patient.patientInformation')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form
            onSubmit={handleSubmit}
            fields={[
              {
                name: 'firstName',
                label: t('patient.firstName'),
                type: 'text',
                required: true,
                placeholder: t('patient.firstNamePlaceholder'),
              },
              {
                name: 'lastName',
                label: t('patient.lastName'),
                type: 'text',
                required: true,
                placeholder: t('patient.lastNamePlaceholder'),
              },
              {
                name: 'dateOfBirth',
                label: t('patient.dateOfBirth'),
                type: 'date',
                required: true,
                validation: {
                  max: new Date().toISOString().split('T')[0],
                },
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
                  { value: '', label: t('common.selectOption') },
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
                placeholder: '+8801XXXXXXXXX',
                validation: {
                  pattern: '^\\+8801[3-9]\\d{8}$',
                },
              },
              {
                name: 'email',
                label: t('patient.email'),
                type: 'email',
                placeholder: t('patient.emailPlaceholder'),
              },
              {
                name: 'address',
                label: t('patient.address'),
                type: 'textarea',
                required: true,
                placeholder: t('patient.addressPlaceholder'),
                rows: 3,
              },
            ]}
            customFields={[
              // Emergency Contact Section
              <div key="emergency-contact" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('patient.emergencyContact')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Field
                    name="emergencyContact.name"
                    label={t('patient.contactName')}
                    type="text"
                    required
                    placeholder={t('patient.contactNamePlaceholder')}
                  />
                  <Form.Field
                    name="emergencyContact.relationship"
                    label={t('patient.relationship')}
                    type="text"
                    required
                    placeholder={t('patient.relationshipPlaceholder')}
                  />
                  <Form.Field
                    name="emergencyContact.phoneNumber"
                    label={t('patient.contactPhone')}
                    type="tel"
                    required
                    placeholder="+8801XXXXXXXXX"
                    validation={{
                      pattern: '^\\+8801[3-9]\\d{8}$',
                    }}
                  />
                </div>
              </div>,

              // Medical Conditions Section
              <div key="medical-conditions" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('patient.medicalConditions')}
                </h3>
                <Form.Field
                  name="medicalConditions"
                  label={t('patient.conditionsList')}
                  type="custom"
                  render={({ field, error }) => (
                    <div>
                      <div className="flex space-x-2">
                        <Input
                          value={medicalCondition}
                          onChange={(e) => setMedicalCondition(e.target.value)}
                          placeholder={t('patient.addCondition')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addMedicalCondition(field, medicalCondition);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addMedicalCondition(field, medicalCondition)}
                          disabled={!medicalCondition.trim()}
                        >
                          {t('common.add')}
                        </Button>
                      </div>
                      
                      {field.value && field.value.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((condition: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {condition}
                              <button
                                type="button"
                                onClick={() => removeMedicalCondition(field, index)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  )}
                />
              </div>,

              // Allergies Section
              <div key="allergies" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('patient.allergies')}
                </h3>
                <Form.Field
                  name="allergies"
                  label={t('patient.allergiesList')}
                  type="custom"
                  render={({ field, error }) => (
                    <div>
                      <div className="flex space-x-2">
                        <Input
                          value={allergy}
                          onChange={(e) => setAllergy(e.target.value)}
                          placeholder={t('patient.addAllergy')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addAllergy(field, allergy);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addAllergy(field, allergy)}
                          disabled={!allergy.trim()}
                        >
                          {t('common.add')}
                        </Button>
                      </div>
                      
                      {field.value && field.value.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((allergy: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                            >
                              {allergy}
                              <button
                                type="button"
                                onClick={() => removeAllergy(field, index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  )}
                />
              </div>,

              // Medications Section
              <div key="medications" className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('patient.medications')}
                </h3>
                <Form.Field
                  name="medications"
                  label={t('patient.medicationsList')}
                  type="custom"
                  render={({ field, error }) => (
                    <div>
                      <div className="flex space-x-2">
                        <Input
                          value={medication}
                          onChange={(e) => setMedication(e.target.value)}
                          placeholder={t('patient.addMedication')}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addMedication(field, medication);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addMedication(field, medication)}
                          disabled={!medication.trim()}
                        >
                          {t('common.add')}
                        </Button>
                      </div>
                      
                      {field.value && field.value.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((medication: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                              {medication}
                              <button
                                type="button"
                                onClick={() => removeMedication(field, index)}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  )}
                />
              </div>,
            ]}
          />
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? t('patient.registering') : t('patient.registerPatient')}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}