import React from 'react';
import { Task } from '../types';
// import { getDaysBetween } from '../utils/dateUtils';

// Ensure this file is treated as a module
export {};

interface TaskBarProps {
  task: Task;
  startDate: Date;
  onDragStart: (e: React.MouseEvent, task: Task, dragType: 'move' | 'resize-start' | 'resize-end') => void;
  style?: React.CSSProperties;
}

const TaskBar: React.FC<TaskBarProps> = ({ task, startDate, onDragStart, style }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'To Do': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Review': return 'bg-purple-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

//   const duration = getDaysBetween(task.startDate, task.endDate);

  return (
    <div
      className={`absolute h-6 ${getCategoryColor(task.category)} text-white text-xs rounded px-2 flex items-center cursor-move select-none z-10`}
      style={style}
      onMouseDown={(e) => onDragStart(e, task, 'move')}
      title={`${task.name} (${task.category})`}
    >
      {/* Resize handle - left */}
      <div
        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize hover:bg-black hover:bg-opacity-20"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDragStart(e, task, 'resize-start');
        }}
      />
      
      <span className="truncate flex-1 pointer-events-none">
        {task.name}
      </span>
      
      {/* Resize handle - right */}
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize hover:bg-black hover:bg-opacity-20"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDragStart(e, task, 'resize-end');
        }}
      />
    </div>
  );
};

export default TaskBar;
