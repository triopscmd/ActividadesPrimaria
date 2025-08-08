export const handleError = (error: unknown): string => {
  console.error('Error handled:', error);
  return 'An unexpected error occurred. Please try again later.';
};