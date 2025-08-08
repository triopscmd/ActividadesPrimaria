```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogger } from '../src/server/utils/logger'; // This import will fail initially as the file/export doesn't exist yet

describe('useLogger Hook', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress actual console output during tests and capture calls
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods after each test
    vi.restoreAllMocks();
  });

  it('should log an error message with associated context and a stack trace', () => {
    const testError = new Error('Database connection failed');
    // Mock the stack for consistent testing across environments
    testError.stack = 'Error: Database connection failed\n    at Connection.open (db.ts:10:5)\n    at Object.<anonymous> (server.ts:25:7)';
    const testContext = { transactionId: 'txn_abc123', userId: 'user_456' };

    // Render the hook to get access to its returned functions
    const { result } = renderHook(() => useLogger());

    // Call the logError function returned by the hook
    act(() => {
      result.current.logError(testError, testContext);
    });

    // Assert that console.error was called exactly once
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    // Verify the content of the logged message.
    // The logger is expected to format the error message, context, and stack trace into a single string.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Database connection failed'),
      expect.stringContaining('"transactionId":"txn_abc123"'),
      expect.stringContaining('"userId":"user_456"'),
      expect.stringContaining('Error: Database connection failed\\n    at Connection.open (db.ts:10:5)')
    );
  });

  it('should log an informational message with optional context', () => {
    const testMessage = 'User session created';
    const testContext = { sessionId: 'sess_xyz789', ipAddress: '192.168.1.100' };

    const { result } = renderHook(() => useLogger());

    act(() => {
      result.current.logInfo(testMessage, testContext);
    });

    // Assert that console.info was called exactly once
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);

    // Verify the content of the logged info message
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('User session created'),
      expect.stringContaining('"sessionId":"sess_xyz789"'),
      expect.stringContaining('"ipAddress":"192.168.1.100"')
    );
  });

  it('should log a warning message without context', () => {
    const testMessage = 'Deprecated API endpoint used';

    const { result } = renderHook(() => useLogger());

    act(() => {
      result.current.logWarn(testMessage);
    });

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Deprecated API endpoint used')
    );
  });

  it('should not log any messages if the logger methods are not invoked', () => {
    renderHook(() => useLogger()); // Render the hook but do not call any of its methods

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});