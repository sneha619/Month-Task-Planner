import React, { useState, useEffect } from 'react';
import { TaskCategory } from '../types';

// Ensure this file is treated as a module
export {};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: TaskCategory) => void;
  initialName?: string;
  initialCategory?: TaskCategory;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialCategory = 'To Do'
}) => {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<TaskCategory>(initialCategory);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setCategory(initialCategory);
    }
  }, [isOpen, initialName, initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), category);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 sm:mb-2">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter task name"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 sm:mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1 sm:py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
