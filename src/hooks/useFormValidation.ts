import { useState, useCallback } from 'react';
import { z, ZodError, ZodSchema } from 'zod';
import { logValidationError } from '@/lib/errorLogger';

export interface ValidationErrors {
  [key: string]: string;
}

export interface UseFormValidationReturn<T> {
  errors: ValidationErrors;
  validate: (data: unknown) => T | null;
  validateField: (field: keyof T, value: unknown) => string | null;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
  setFieldError: (field: keyof T, message: string) => void;
  hasErrors: boolean;
}

/**
 * Hook for form validation using Zod schemas
 *
 * @example
 * const { errors, validate, validateField, clearErrors } = useFormValidation(loginSchema);
 *
 * const handleSubmit = (formData) => {
 *   const validated = validate(formData);
 *   if (validated) {
 *     // Submit the form
 *   }
 * };
 *
 * const handleBlur = (field, value) => {
 *   validateField(field, value);
 * };
 */
export function useFormValidation<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  formName?: string
): UseFormValidationReturn<z.infer<T>> {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Validate the entire form data
   */
  const validate = useCallback(
    (data: unknown): z.infer<T> | null => {
      try {
        const validated = schema.parse(data);
        setErrors({});
        return validated;
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (!newErrors[path]) {
              newErrors[path] = err.message;
            }
          });
          setErrors(newErrors);

          // Log validation errors for analytics
          if (formName) {
            logValidationError(formName, newErrors);
          }
        }
        return null;
      }
    },
    [schema, formName]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: keyof z.infer<T>, value: unknown): string | null => {
      const fieldSchema = schema.shape[field as string] as ZodSchema | undefined;
      if (!fieldSchema) return null;

      try {
        fieldSchema.parse(value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
        return null;
      } catch (error) {
        if (error instanceof ZodError) {
          const message = error.errors[0]?.message || 'Invalid value';
          setErrors((prev) => ({
            ...prev,
            [field as string]: message,
          }));
          return message;
        }
        return null;
      }
    },
    [schema]
  );

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((field: keyof z.infer<T>) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  /**
   * Manually set an error for a field
   */
  const setFieldError = useCallback((field: keyof z.infer<T>, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: message,
    }));
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}

/**
 * Get nested error from validation errors object
 *
 * @example
 * getNestedError(errors, 'recipient.firstName') // Returns error message or undefined
 */
export function getNestedError(
  errors: ValidationErrors,
  path: string
): string | undefined {
  return errors[path];
}

export default useFormValidation;
