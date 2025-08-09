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
      className={`h-6 ${getCategoryColor(task.category)} text-white text-xs rounded px-2 flex items-center cursor-move select-none shadow-sm hover:brightness-110 transition-all relative group`}
      style={style}
      onMouseDown={(e) => {
        // Only trigger move if not clicking on resize handles
        if (!(e.target as HTMLElement).classList.contains('resize-handle')) {
          onDragStart(e, task, 'move');
        }
      }}
      onClick={(e) => {
        // Prevent click when clicking on resize handles
        if (!(e.target as HTMLElement).classList.contains('resize-handle')) {
          onClick && onClick(e, task);
        }
      }}
      title={`${task.name} (${task.category})`}
    >
      {/* Left resize handle */}
      <div
        className="resize-handle absolute left-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-30 rounded-l transition-opacity"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDragStart(e, task, 'resize-start');
        }}
        title="Resize start date"
      />
      
      <span className="truncate font-medium text-xs w-full text-center">
        {task.name}
      </span>
      
      {/* Right resize handle */}
      <div
        className="resize-handle absolute right-0 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 bg-white bg-opacity-30 rounded-r transition-opacity"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDragStart(e, task, 'resize-end');
        }}
        title="Resize end date"
      />
    </div>
  );
};

export default TaskBar;
