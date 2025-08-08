import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CourseEditor from '../../src/components/admin/CourseEditor';

describe('CourseEditor', () => {
  it('should display form fields for editing course details and a save button', () => {
    render(<CourseEditor />);

    // Verify the presence of a main heading for the course editor
    expect(screen.getByRole('heading', { name: /Edit Course/i, level: 1 })).toBeInTheDocument();

    // Verify input field for course title
    expect(screen.getByLabelText(/Course Title:/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Course Title:/i })).toBeInTheDocument();

    // Verify textarea for course description
    expect(screen.getByLabelText(/Course Description:/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Course Description:/i })).toBeInTheDocument();

    // Verify a button to save the course
    expect(screen.getByRole('button', { name: /Save Course/i })).toBeInTheDocument();
  });
});