import React from 'react';
import { Task } from '../types';
// import { getDaysBetween } from '../utils/dateUtils';

// Ensure this file is treated as a module
export {};

interface TaskBarProps {
  task: Task;
  startDate: Date;
  onDragStart: (e: React.MouseEvent, task: Task, dragType: 'move' | 'resize-start' | 'resize-end') => void;
  onClick?: (e: React.MouseEvent, task: Task) => void;
  style?: React.CSSProperties;
}

const TaskBar: React.FC<TaskBarProps> = ({ task, startDate, onDragStart, onClick, style }) => {
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
      className={`h-6 ${getCategoryColor(task.category)} text-white text-xs rounded px-2 flex items-center cursor-move select-none shadow-sm hover:brightness-110 transition-all`}
      style={style}
      onMouseDown={(e) => onDragStart(e, task, 'move')}
      onClick={(e) => onClick && onClick(e, task)}
      title={`${task.name} (${task.category})`}
    >
      <span className="truncate font-medium text-xs w-full text-center">
        {task.name}
      </span>
    </div>
  );
};

export default TaskBar;
