'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

interface InputFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  as?: 'input';
}

interface TextareaFieldProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  as: 'textarea';
  rows?: number;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(function FormField(props, ref) {
  const { label, error, required, helpText, as = 'input', ...rest } = props;
  const id = rest.id || rest.name;

  const inputClasses = `
    w-full px-4 py-3 rounded-xl border transition-colors
    ${error
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100'
    }
  `;

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-forest-900"
      >
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          className={`${inputClasses} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${id}-help`} className="text-xs text-forest-800/50">
          {helpText}
        </p>
      )}
    </div>
  );
});

/**
 * Select field component with consistent styling
 */
interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  error,
  required,
  helpText,
  options,
  placeholder,
  ...rest
}: SelectFieldProps) {
  const id = rest.id || rest.name;

  const selectClasses = `
    w-full px-4 py-3 rounded-xl border transition-colors cursor-pointer
    ${error
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-cream-300 focus:border-sage-400 focus:ring-2 focus:ring-sage-100'
    }
  `;

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-forest-900"
      >
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      <select
        id={id}
        className={selectClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${id}-help`} className="text-xs text-forest-800/50">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default FormField;
