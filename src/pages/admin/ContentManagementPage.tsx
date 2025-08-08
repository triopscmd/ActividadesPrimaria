```typescript
import React from 'react';

const ContentManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Curriculum Content Management</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add New Content
      </button>
    </div>
  );
};

export default ContentManagementPage;