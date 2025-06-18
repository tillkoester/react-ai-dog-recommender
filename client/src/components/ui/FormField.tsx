import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FormOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  options?: FormOption[];
  register: UseFormRegister<any>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  className?: string;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  options = [],
  register,
  error,
  required = false,
  placeholder,
  helpText,
  className,
  rows = 3
}) => {
  const baseClasses = error 
    ? 'form-input form-error' 
    : 'form-input';

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name)}
            rows={rows}
            placeholder={placeholder}
            className={cn('form-textarea', error && 'form-error')}
          />
        );

      case 'select':
        return (
          <select
            {...register(name)}
            className={cn('form-select', error && 'form-error')}
          >
            <option value="">
              {placeholder || `Select ${label.toLowerCase()}...`}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...register(name)}
              type="checkbox"
              className="form-checkbox"
            />
            <label className="ml-2 text-sm text-gray-900">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            className={baseClasses}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={cn('space-y-1', className)}>
        {renderField()}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helpText && (
          <p className="text-xs text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {helpText && (
          <span className="ml-1 inline-flex items-center group relative">
            <HelpCircle className="w-3 h-3 text-gray-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {helpText}
            </span>
          </span>
        )}
      </label>
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helpText && type !== 'checkbox' && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};