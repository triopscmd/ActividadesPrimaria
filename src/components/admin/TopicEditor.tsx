```typescript
import React, { useEffect, useState } from 'react';
import { useTopic } from '../../hooks/useTopic';
import { useSaveTopic } from '../../hooks/useTopicMutations';

// Define the Topic type based on the test's MockTopic structure
interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TopicEditorProps {
  topicId: string;
}

const TopicEditor: React.FC<TopicEditorProps> = ({ topicId }) => {
  const { data: topic, isLoading, isError, error } = useTopic(topicId);
  const { mutate: saveTopic, isPending: isSaving } = useSaveTopic();

  // Local state for form fields, initialized from fetched topic data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Use useEffect to update form state when topic data changes
  // This is crucial for pre-filling the form after data loads
  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
    }
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic) {
      saveTopic({
        id: topic.id,
        name,
        description,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading topic...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error?.message || 'Failed to load topic.'}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-4 text-center text-gray-600">
        Topic not found.
      </div>
    );
  }

  // Render the form only when topic data is available
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg bg-white shadow-md">
      <div>
        <label htmlFor="topicName" className="block text-sm font-medium text-gray-700">
          Topic Name
        </label>
        <input
          type="text"
          id="topicName"
          name="topicName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          placeholder="e.g., Introduction to React Testing"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          placeholder="A comprehensive guide to testing React components..."
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default TopicEditor;