```typescript
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import ContentManagementPage from '../ContentManagementPage';

describe('ContentManagementPage', () => {
  it('should display the main heading and an "Add New Content" button for curriculum management', () => {
    render(<ContentManagementPage />);

    expect(screen.getByRole('heading', { name: /curriculum content management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new content/i })).toBeInTheDocument();
  });
});