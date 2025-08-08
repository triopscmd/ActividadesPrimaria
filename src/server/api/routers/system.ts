import React, { FC, useEffect } from 'react';

// Defines the structure for system error details,
// based on the `testErrorDetails` object in the test file.
interface SystemErrorDetails {
  message: string;
  stack?: string;
  timestamp?: number;
  level?: 'info' | 'warn' | 'error' | 'debug';
  component?: string;
  context?: Record<string, unknown>;
}

// Defines the props for the SystemErrorLogger component.
interface SystemErrorLoggerProps {
  error: SystemErrorDetails | null;
}

/**
 * SystemErrorLogger is a stateless React component responsible for displaying
 * a provided error message and dispatching the error details to a centralized
 * logging backend.
 *
 * It is designed to be minimal, focusing only on displaying the error message
 * and making the necessary API call as per the test requirements.
 */
const SystemErrorLogger: FC<SystemErrorLoggerProps> = ({ error }) => {
  // useEffect hook to handle the side effect of logging the error to the backend.
  // This effect runs whenever the `error` prop changes.
  useEffect(() => {
    // Only attempt to log if an `error` object is provided.
    if (error) {
      const logErrorToBackend = async () => {
        try {
          const response = await fetch('/api/system/log-error', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(error),
          });

          // Log a warning if the logging endpoint responded with an error,
          // but do not prevent the component from rendering the message.
          if (!response.ok) {
            console.warn(
              'SystemErrorLogger: Failed to submit error to centralized log. Status:',
              response.status,
              response.statusText,
            );
          }
        } catch (err) {
          // Log network errors or other issues that prevent the fetch request
          // from completing successfully. The component should still display
          // the error message.
          console.error(
            'SystemErrorLogger: Network error when attempting to log system error:',
            err,
          );
        }
      };

      // Call the async logging function. Using `void` to explicitly indicate
      // that the Promise's return value is intentionally ignored, satisfying
      // ESLint rules for standalone async functions.
      void logErrorToBackend();
    }
  }, [error]); // Dependency array: re-run effect if `error` object changes.

  // If no error object is provided, render nothing.
  // This satisfies the test case where `error={null}` is passed.
  if (!error) {
    return null;
  }

  // Render the error message if an `error` object is provided.
  // This ensures the message is displayed to the user, even if the
  // backend logging fails.
  return (
    <div className="p-2 text-red-700">
      <p>{error.message}</p>
    </div>
  );
};

export { SystemErrorLogger };