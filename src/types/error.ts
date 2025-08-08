```typescript
import { createContext, useContext, ReactNode, useCallback } from 'react';

// Define the interface for additional error details
interface AppErrorDetails extends Record<string, unknown> {
  component?: string;
  action?: string;
  level?: 'critical' | 'error' | 'warning' | 'info' | 'debug';
}

// Define the AppError interface which extends the built-in Error interface
export interface AppError extends Error {
  name: string;
  message: string;
  isOperational: boolean;
  code: string;
  details?: AppErrorDetails;
}

// Implement AppError as a class that extends Error.
// This ensures that instances of AppError are also instances of Error,
// satisfying `expect(reportedError).toBeInstanceOf(Error)` in tests.
export class AppError extends Error implements AppError {
  public isOperational: boolean;
  public code: string;
  public details?: AppErrorDetails;

  constructor(
    name: string,
    message: string,
    isOperational: boolean,
    code: string,
    details?: AppErrorDetails,
  ) {
    // Call the parent Error constructor with the message
    super(message);

    // Set the name of the error for better identification
    this.name = name;
    this.message = message; // Explicitly set message, although super(message) already does this

    // Custom properties specific to AppError
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    // Restore prototype chain for proper `instanceof` checks in TypeScript/ES6
    // This is crucial when extending built-in classes like Error.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Define the shape of the context value
interface ErrorContextType {
  reportError: (error: AppError) => void;
}

// Create the Error Context with an initial undefined value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Define props for the ErrorProvider component
interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * ErrorProvider is a React Context Provider that makes a `reportError` function
 * available to all its children. This function is used to centrally log and
 * handle application-specific errors (`AppError`).
 */
export function ErrorProvider({ children }: ErrorProviderProps) {
  // useCallback memoizes the reportError function to prevent unnecessary re-renders
  // of consumers when the provider itself re-renders.
  const reportError = useCallback((error: AppError) => {
    // Log the error to the console.error.
    // In a real production application, this would typically integrate with
    // a centralized logging service (e.g., Sentry, Bugsnag, or a custom backend endpoint).
    console.error(error);
  }, []); // No dependencies, so this function is stable across renders.

  // The value provided to the context consumers.
  const contextValue = { reportError };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * useError is a custom React Hook that allows components to access the
 * `reportError` function from the ErrorContext.
 * It ensures that the hook is used within an `ErrorProvider`.
 */
export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    // Throw an error if useError is called outside of an ErrorProvider,
    // which helps in identifying common integration mistakes.
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}