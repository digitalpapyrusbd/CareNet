import React from 'react';
import { Button } from './Button';
import { Input } from './Input';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | undefined;
  };
  defaultValue?: any;
  className?: string;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitText?: string;
  loading?: boolean;
  error?: string;
  success?: string;
  className?: string;
  fieldClassName?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridCols?: number;
}

export function Form({
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  error,
  success,
  className = '',
  fieldClassName = '',
  layout = 'vertical',
  gridCols = 2,
}: FormProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize form data with default values
  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    setFormData(initialData);
  }, [fields]);

  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, custom } = field.validation;

      if (min !== undefined && value && Number(value) < min) {
        return `${field.label} must be at least ${min}`;
      }

      if (max !== undefined && value && Number(value) > max) {
        return `${field.label} must be no more than ${max}`;
      }

      if (pattern && value && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`;
      }

      if (custom) {
        return custom(value);
      }
    }

    return undefined;
  };

  const handleInputChange = (fieldName: string, value: any) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    // Validate field and update errors
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const fieldError = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldName]: fieldError || '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const fieldError = validateField(field, formData[field.name]);
      if (fieldError) {
        newErrors[field.name] = fieldError;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name];

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className={`mb-4 ${fieldClassName}`}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={field.name}
              value={fieldValue || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                fieldError ? 'border-red-500' : ''
              } ${field.className || ''}`}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className={`mb-4 ${fieldClassName}`}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.name}
              value={fieldValue || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                fieldError ? 'border-red-500' : ''
              } ${field.className || ''}`}
              rows={4}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={`mb-4 ${fieldClassName}`}>
            <div className="flex items-center">
              <input
                id={field.name}
                type="checkbox"
                checked={fieldValue || false}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                  field.className || ''
                }`}
              />
              <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className={`mb-4 ${fieldClassName}`}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="mt-2 space-y-2">
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${field.name}_${option.value}`}
                    type="radio"
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`${field.name}_${option.value}`} className="ml-2 text-sm text-gray-900">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className={`mb-4 ${fieldClassName}`}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={fieldValue || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={`mt-1 ${field.className || ''}`}
              error={fieldError ? 'This field has an error' : ''}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap space-x-4';
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${gridCols} gap-4`;
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <div className={getLayoutClasses()}>
          {fields.map(renderField)}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Processing...' : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
}