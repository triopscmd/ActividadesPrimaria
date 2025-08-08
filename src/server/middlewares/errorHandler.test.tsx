```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import errorHandler from '../../src/server/middlewares/errorHandler';

describe('errorHandler middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;
  let consoleErrorSpy: vitest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/api/v1/resource',
      headers: {
        'user-agent': 'vitest-test',
      },
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
      locals: {},
    };
    mockNext = vi.fn();

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should send a 500 status and a generic error message for an unexpected internal error and log it', () => {
    const error = new Error('Database connection failed');
    error.stack = 'Mock stack trace\n  at SomeFunction (file.js:1:1)';

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
    expect(mockResponse.send).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error caught by errorHandler:'),
      expect.any(String), // Log message/stack summary
      expect.objectContaining({
        message: error.message,
        stack: expect.any(String),
        request: expect.objectContaining({
          method: mockRequest.method,
          url: mockRequest.url,
          ip: mockRequest.ip,
          userAgent: mockRequest.headers['user-agent'],
        }),
      })
    );
  });

  it('should send an appropriate status and message for an APIError with a custom status code and log it', () => {
    class APIError extends Error {
      statusCode: number;
      isOperational: boolean;
      constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, APIError.prototype);
      }
    }

    const clientError = new APIError('Invalid input data', 400);

    errorHandler(clientError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: clientError.message,
    });
    expect(mockResponse.send).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error caught by errorHandler:'),
      expect.any(String), // Log message/stack summary
      expect.objectContaining({
        message: clientError.message,
        statusCode: clientError.statusCode,
        isOperational: clientError.isOperational,
        request: expect.objectContaining({
          method: mockRequest.method,
          url: mockRequest.url,
          ip: mockRequest.ip,
          userAgent: mockRequest.headers['user-agent'],
        }),
      })
    );
  });

  it('should handle non-Error thrown values by converting them to a generic error and logging', () => {
    const nonErrorValue = 'A plain string was thrown!';

    errorHandler(nonErrorValue, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    });
    expect(mockNext).not.toHaveBeenCalled();

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error caught by errorHandler:'),
      expect.stringContaining('Non-Error value thrown: A plain string was thrown!'),
      expect.objectContaining({
        message: 'Non-Error value thrown: A plain string was thrown!',
        request: expect.objectContaining({
          method: mockRequest.method,
          url: mockRequest.url,
          ip: mockRequest.ip,
          userAgent: mockRequest.headers['user-agent'],
        }),
      })
    );
  });
});