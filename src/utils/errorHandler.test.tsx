import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { handleError } from '../src/utils/errorHandler';

describe('errorHandler', () => {
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should log the error and return a generic user-friendly message for an Error instance', () => {
    const testError = new Error('User authentication failed.');
    const friendlyMessage = handleError(testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error handled:', testError);
    expect(friendlyMessage).toBe('An unexpected error occurred. Please try again later.');
  });

  it('should log a string error and return a generic user-friendly message', () => {
    const testError = 'Network request failed due to timeout.';
    const friendlyMessage = handleError(testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error handled:', testError);
    expect(friendlyMessage).toBe('An unexpected error occurred. Please try again later.');
  });

  it('should log an unknown error type (e.g., an object) and return a generic user-friendly message', () => {
    const testError = { statusCode: 500, detail: 'Internal server error on user lookup.' };
    const friendlyMessage = handleError(testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error handled:', testError);
    expect(friendlyMessage).toBe('An unexpected error occurred. Please try again later.');
  });
});