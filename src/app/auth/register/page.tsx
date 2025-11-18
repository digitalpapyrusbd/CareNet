'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Input } from '@/components/ui';
import { LanguageSwitcher, ThemeSwitcher } from '@/components/ui';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@/lib/auth';
import { api } from '@/lib/api-client';

// Bangladesh phone number validation
const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;

// Base user schema
const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Role-specific schemas
const guardianSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.GUARDIAN),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
});

const patientSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.PATIENT),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Please enter a valid date of birth'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
});

const caregiverSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.CAREGIVER),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Caregivers must be between 18 and 65 years old'),
  nidNumber: z.string().min(10, 'NID number must be at least 10 characters'),
  experience: z.string().min(1, 'Experience is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  education: z.string().min(1, 'Education is required'),
  availability: z.object({
    fullTime: z.boolean(),
    partTime: z.boolean(),
    liveIn: z.boolean(),
    hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  }),
});

const companySchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.COMPANY),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  tradeLicense: z.string().min(5, 'Trade license number is required'),
  companyAddress: z.string().min(5, 'Company address must be at least 5 characters'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  companyType: z.enum(['hospital', 'agency', 'individual', 'ngo']),
});

const registrationSchema = z.discriminatedUnion('role', [
  guardianSchema,
  patientSchema,
  caregiverSchema,
  companySchema,
]);

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.GUARDIAN);
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: UserRole.GUARDIAN,
      agreeToTerms: false,
    },
  });

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('880')) {
      return `+${digits}`;
    } else if (digits.startsWith('01')) {
      return `+880${digits}`;
    } else if (digits.length === 10 && digits.startsWith('1')) {
      return `+880${digits}`;
    }
    return phone;
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      const result = await api.post('/auth/register', {
        ...data,
        phone: formatPhoneNumber(data.phone),
      });
      
      // Redirect to OTP verification
      setOtpSent(true);
      setCurrentStep(3);
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOTP = async () => {
    try {
      const result = await api.post('/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formatPhoneNumber(watch('phone')),
          otp: verificationCode,
        }),
      });

      if (response.ok) {
        router.push('/auth/login?message=Registration successful. Please login.');
      } else {
        const error = await response.json();
        setError('root', {
          message: error.error || 'OTP verification failed.',
        });
      }
    } catch (error) {
      setError('root', {
        message: 'OTP verification failed. Please try again.',
      });
    }
  };

  const roleOptions = [
    { value: UserRole.GUARDIAN, label: 'Guardian', icon: '👨‍👩‍👧‍👦', description: 'Register as a family member seeking care' },
    { value: UserRole.PATIENT, label: 'Patient', icon: '🧑‍⚕️', description: 'Register as someone needing care' },
    { value: UserRole.CAREGIVER, label: 'Caregiver', icon: '👩‍⚕️', description: 'Register as a professional caregiver' },
    { value: UserRole.COMPANY, label: 'Company', icon: '🏢', description: 'Register as a care service company' },
  ];

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {t('auth.register.selectRole')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roleOptions.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => {
              setSelectedRole(role.value);
              setValue('role', role.value);
              setCurrentStep(2);
            }}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedRole === role.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{role.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {t(`roles.${role.value.toLowerCase()}`)}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case UserRole.GUARDIAN:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.address')}
              </label>
              <Input
                id="address"
                placeholder="Enter your full address"
                {...register('address')}
                error={errors.address?.message}
              />
            </div>
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.emergencyContact')}
              </label>
              <Input
                id="emergencyContact"
                placeholder="Emergency contact phone number"
                {...register('emergencyContact')}
                error={errors.emergencyContact?.message}
              />
            </div>
          </div>
        );

      case UserRole.PATIENT:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.dateOfBirth')}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />
            </div>
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.bloodGroup')}
              </label>
              <select
                id="bloodGroup"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('bloodGroup')}
              >
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.allergies')}
              </label>
              <textarea
                id="allergies"
                rows={3}
                placeholder="List any known allergies"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('allergies')}
              />
            </div>
            <div>
              <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.medicalConditions')}
              </label>
              <textarea
                id="medicalConditions"
                rows={3}
                placeholder="Describe any medical conditions"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('medicalConditions')}
              />
            </div>
          </div>
        );

      case UserRole.CAREGIVER:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.dateOfBirth')}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />
            </div>
            <div>
              <label htmlFor="nidNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.nidNumber')}
              </label>
              <Input
                id="nidNumber"
                placeholder="National ID number"
                {...register('nidNumber')}
                error={errors.nidNumber?.message}
              />
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.experience')}
              </label>
              <textarea
                id="experience"
                rows={3}
                placeholder="Describe your caregiving experience"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('experience')}
                error={errors.experience?.message}
              />
            </div>
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.education')}
              </label>
              <Input
                id="education"
                placeholder="Your educational background"
                {...register('education')}
                error={errors.education?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.skills')}
              </label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {['elderly care', 'child care', 'medical care', 'disability care', 'post-surgery care'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          value={skill}
                          checked={field.value?.includes(skill) || false}
                          onChange={(e) => {
                            const currentSkills = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentSkills, skill]);
                            } else {
                              field.onChange(currentSkills.filter(s => s !== skill));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.register.availability')}
                </label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('availability.fullTime')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Full Time</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('availability.partTime')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Part Time</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('availability.liveIn')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Live-in Available</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.register.hourlyRate')} (BDT)
                </label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="500"
                  {...register('availability.hourlyRate', { valueAsNumber: true })}
                  error={errors.availability?.hourlyRate?.message}
                />
              </div>
            </div>
          </div>
        );

      case UserRole.COMPANY:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.companyName')}
              </label>
              <Input
                id="companyName"
                placeholder="Company name"
                {...register('companyName')}
                error={errors.companyName?.message}
              />
            </div>
            <div>
              <label htmlFor="tradeLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.tradeLicense')}
              </label>
              <Input
                id="tradeLicense"
                placeholder="Trade license number"
                {...register('tradeLicense')}
                error={errors.tradeLicense?.message}
              />
            </div>
            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.companyAddress')}
              </label>
              <Input
                id="companyAddress"
                placeholder="Company address"
                {...register('companyAddress')}
                error={errors.companyAddress?.message}
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.contactPerson')}
              </label>
              <Input
                id="contactPerson"
                placeholder="Contact person name"
                {...register('contactPerson')}
                error={errors.contactPerson?.message}
              />
            </div>
            <div>
              <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.register.companyType')}
              </label>
              <select
                id="companyType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('companyType')}
              >
                <option value="">Select company type</option>
                <option value="hospital">Hospital</option>
                <option value="agency">Caregiver Agency</option>
                <option value="individual">Individual Service</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">বিডি</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.register.subtitle')}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-8 rounded-full ${
                currentStep >= step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Language and Theme Switchers */}
        <div className="flex justify-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
              </div>
            )}

            {currentStep === 1 && renderRoleSelection()}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Common Fields */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.name')}
                  </label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.email')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.phone')}
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX or 01XXXXXXXXX"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('auth.phone.help')}
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.password')}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.confirmPassword')}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                </div>

                {/* Role-specific fields */}
                {renderRoleSpecificFields()}

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('agreeToTerms')}
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    {t('auth.register.agreeToTerms')}{' '}
                    <a
                      href="/terms"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('auth.register.termsAndConditions')}
                    </a>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('common.back')}
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    {t('auth.register.createAccount')}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && otpSent && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('auth.register.verifyPhone')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('auth.register.otpSent', { phone: formatPhoneNumber(watch('phone')) })}
                  </p>
                </div>

                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={verificationCode[index] || ''}
                      onChange={(e) => {
                        const newCode = verificationCode.split('');
                        newCode[index] = e.target.value;
                        setVerificationCode(newCode.join(''));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      id={`otp-${index}`}
                    />
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setCurrentStep(2);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('common.back')}
                  </Button>
                  <Button
                    type="button"
                    onClick={onVerifyOTP}
                    className="flex-1"
                  >
                    {t('auth.register.verify')}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.register.haveAccount')}{' '}
              <a
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('auth.register.signIn')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}