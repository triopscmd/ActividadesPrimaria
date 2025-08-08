import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import ErrorBoundary from './ErrorBoundary';

const ThrowingComponent: React.FC = () => {
  throw new Error('Test error from ThrowingComponent');
};

describe('ErrorBoundary', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('should render a fallback UI when a child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong./i)).toBeInTheDocument();
  });

  it('should render children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Child Content')).toBeInTheDocument();
    expect(screen.queryByText(/Oops! Something went wrong./i)).not.toBeInTheDocument();
  });
});