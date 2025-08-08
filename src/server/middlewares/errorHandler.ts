```typescript
import { Request, Response, NextFunction } from 'express';

// Define a type for the custom APIError based on the test's structure
interface APIError extends Error {
  statusCode: number;
  isOperational: boolean;
  name: 'APIError';
}

// Type guard to check if an error is an APIError
function isAPIError(error: unknown): error is APIError {
  return (
    error instanceof Error &&
    (error as APIError).name === 'APIError' &&
    typeof (error as APIError).statusCode === 'number' &&
    typeof (error as APIError).isOperational === 'boolean'
  );
}

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction, // next is not called as the response is handled here
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorToLog: {
    message: string;
    stack?: string;
    statusCode?: number;
    isOperational?: boolean;
    request: {
      method: string;
      url: string;
      ip?: string;
      userAgent?: string | string[];
    };
  };

  const requestInfo = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  };

  if (isAPIError(err)) {
    statusCode = err.statusCode;
    message = err.message;
    errorToLog = {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
      request: requestInfo,
    };
  } else if (err instanceof Error) {
    statusCode = 500;
    message = 'Internal Server Error'; // Keep generic for unexpected errors
    errorToLog = {
      message: err.message,
      stack: err.stack,
      request: requestInfo,
    };
  } else {
    // Handle non-Error thrown values
    statusCode = 500;
    message = 'Internal Server Error';
    const nonErrorValueString =
      err === null ? 'null' : typeof err === 'object' ? JSON.stringify(err) : String(err);
    errorToLog = {
      message: `Non-Error value thrown: ${nonErrorValueString}`,
      request: requestInfo,
    };
  }

  // Log the error using console.error as per test requirement
  // In a production environment, this might be routed to a more robust logging service
  console.error(
    'Error caught by errorHandler:',
    errorToLog.message.includes('Non-Error value thrown')
      ? errorToLog.message
      : errorToLog.stack || errorToLog.message, // Log stack for errors, specific message for non-errors
    errorToLog,
  );

  res.status(statusCode).json({ message });
};

export default errorHandler;