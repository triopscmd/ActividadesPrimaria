```typescript
import React from 'react';
import { useCourses } from '../../hooks/useCourses';

interface Course {
  id: string;
  title: string;
  description: string;
}

const CourseEditor: React.FC = () => {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useCourses<Course[]>();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading courses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error?.message || 'An unknown error occurred while fetching courses.'}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        No courses found
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Curriculum Courses</h2>
      {courses.map((course) => (
        <div key={course.id} className="border border-gray-200 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseEditor;