```typescript
// src/server/api/routers/system.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
// This import assumes that src/server/api/routers/system.ts
// exports a React component named SystemErrorLogger.
// This design choice is made to strictly adhere to the prompt's
// "Component File to Test: src/server/api/routers/system.ts"
// while simultaneously requiring "React Testing Library" usage.
import { SystemErrorLogger } from './system'; 

describe('SystemErrorLogger (from system.ts)', () => {
  const mockFetch = vi.fn();

  beforeAll(() => {
    // Mock the global fetch function to intercept network requests
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockClear();
    // Default successful response for the mock logging endpoint
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it('should display the provided error message and dispatch it to the centralized logging backend', async () => {
    const testErrorMessage = 'Critical system error: Database connection failed.';
    const testErrorDetails = {
      message: testErrorMessage,
      stack: 'Error: Database connection failed at src/utils/db.ts:50:10',
      timestamp: Date.now(),
      level: 'error',
      component: 'SystemRouter',
      context: { userId: 'sys_admin_1', reqId: 'req_xyz123' },
    };

    render(<SystemErrorLogger error={testErrorDetails} />);

    // Verify that the error message is rendered on the screen
    expect(screen.getByText(testErrorMessage)).toBeInTheDocument();

    // Verify that a POST request was made to the logging endpoint
    // with the correct error details for centralized logging
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/system/log-error', // Assuming this is the dedicated endpoint for error logging
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testErrorDetails),
        }),
      );
    });
  });

  it('should not display an error or attempt to log if no error object is passed', () => {
    render(<SystemErrorLogger error={null} />);

    // Ensure no error-related text is present in the document
    expect(screen.queryByText(/system error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/critical error/i)).not.toBeInTheDocument();

    // Verify that no fetch calls were made, as there's no error to log
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle network or server-side logging failures gracefully', async () => {
    // Simulate a failure response from the logging API
    mockFetch.mockRejectedValue(new Error('Network error during log submission'));

    const failureErrorMessage = 'User session expired unexpectedly.';
    const failureErrorDetails = { message: failureErrorMessage, stack: '...' };

    render(<SystemErrorLogger error={failureErrorDetails} />);

    // Verify the error message is still displayed to the user
    expect(screen.getByText(failureErrorMessage)).toBeInTheDocument();

    // Ensure that despite the failure, the attempt to log was made
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // In a real application, you might assert that a fallback log mechanism
    // or an internal error state is triggered, but for a failing test,
    // verifying it doesn't crash is sufficient.
  });
});