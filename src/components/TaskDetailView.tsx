import React from 'react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskDetailViewProps {
  task: Task | null;
  onClose: () => void;
  onEdit?: () => void;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onClose, onEdit }) => {
  if (!task) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'To Do': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Review': return 'bg-purple-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-[95vw] sm:max-w-md overflow-hidden shadow-2xl">
        <div className={`${getCategoryColor(task.category)} p-4 sm:p-5`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{task.name}</h2>
          <p className="text-white text-opacity-90 text-sm sm:text-base mt-1">{task.category}</p>
        </div>
        
        <div className="p-4 sm:p-5">
          <div className="mb-5">
            <h3 className="text-sm sm:text-base font-medium text-gray-500 mb-1">Date Range</h3>
            <p className="text-base sm:text-lg font-medium">
              {format(task.startDate, 'MMM d, yyyy')} - {format(task.endDate, 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base font-medium"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 text-sm sm:text-base font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;