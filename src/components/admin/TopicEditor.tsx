```typescript
import React, { useState, useEffect, FormEvent } from 'react';
import { useTopic } from '../../hooks/useTopic';
import { useSaveTopic } from '../../hooks/useTopicMutations';

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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
    }
  }, [topic]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic) {
      saveTopic({ id: topic.id, name, description });
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
        Topic not found
      </div>
    );
  }

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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="topicDescription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="topicDescription"
          name="topicDescription"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default TopicEditor;