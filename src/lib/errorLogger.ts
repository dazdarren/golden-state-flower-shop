/**
 * Centralized error logging utility
 * In production, this would integrate with services like Sentry, LogRocket, etc.
 */

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface LoggedError {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: string;
  url: string;
  userAgent: string;
}

/**
 * Log an error with context
 */
export function logError(
  error: Error | string,
  severity: ErrorSeverity = 'medium',
  context: ErrorContext = {}
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const loggedError: LoggedError = {
    message: errorMessage,
    stack: errorStack,
    severity,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  };

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`[${severity.toUpperCase()}] Error logged`);
    console.error('Message:', errorMessage);
    if (errorStack) console.error('Stack:', errorStack);
    console.log('Context:', context);
    console.log('Timestamp:', loggedError.timestamp);
    console.groupEnd();
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example integrations:
    // - Sentry: Sentry.captureException(error, { extra: context });
    // - LogRocket: LogRocket.captureException(error);
    // - Custom API endpoint:
    sendToErrorService(loggedError).catch(console.error);
  }
}

/**
 * Log an API error with response details
 */
export function logApiError(
  endpoint: string,
  status: number,
  errorMessage: string,
  context: ErrorContext = {}
): void {
  const severity: ErrorSeverity = status >= 500 ? 'high' : 'medium';

  logError(
    `API Error: ${endpoint} returned ${status} - ${errorMessage}`,
    severity,
    {
      ...context,
      metadata: {
        ...context.metadata,
        endpoint,
        statusCode: status,
      },
    }
  );
}

/**
 * Log a form validation error
 */
export function logValidationError(
  formName: string,
  errors: Record<string, string>,
  context: ErrorContext = {}
): void {
  logError(
    `Validation failed for ${formName}: ${Object.keys(errors).join(', ')}`,
    'low',
    {
      ...context,
      component: formName,
      metadata: {
        ...context.metadata,
        validationErrors: errors,
      },
    }
  );
}

/**
 * Log a payment error
 */
export function logPaymentError(
  errorMessage: string,
  context: ErrorContext = {}
): void {
  logError(
    `Payment error: ${errorMessage}`,
    'critical',
    {
      ...context,
      action: 'payment',
    }
  );
}

/**
 * Send error to external service (placeholder)
 */
async function sendToErrorService(error: LoggedError): Promise<void> {
  // In a real implementation, this would send to your error tracking service
  // Example: POST to /api/log-error or use Sentry SDK

  // For now, just log that we would send it
  if (process.env.NODE_ENV === 'development') {
    console.log('[ErrorLogger] Would send to error service:', error);
  }

  // Uncomment to send to a custom API endpoint:
  // await fetch('/api/log-error', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(error),
  // });
}

/**
 * Create a wrapped async function with automatic error logging
 */
export function withErrorLogging<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        'medium',
        context
      );
      throw error;
    }
  }) as T;
}
