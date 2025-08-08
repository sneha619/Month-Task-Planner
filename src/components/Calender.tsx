import React, { useState, useRef, useCallback } from 'react';
import { format, isSameDay, isToday, startOfDay } from 'date-fns';
import { Task, DragState, TaskCategory } from '../types';
import { getCalendarDays, getDaysBetween } from '../utils/dateUtils';
import TaskBar from './TaskBar';
import TaskModal from './TaskModal';

interface CalendarProps {
  currentDate: Date;
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskAdd: (name: string, startDate: Date, endDate: Date, category: TaskCategory) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, tasks, onTaskUpdate, onTaskAdd }) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startDate: null,
    endDate: null,
    taskId: null
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    startDate: null as Date | null,
    endDate: null as Date | null
  });

  const calendarRef = useRef<HTMLDivElement>(null);
  const days = getCalendarDays(currentDate);

  const getDayFromMouseEvent = useCallback((e: MouseEvent): Date | null => {
    if (!calendarRef.current) return null;
    
    const rect = calendarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dayWidth = rect.width / 7;
    const dayHeight = (rect.height - 40) / Math.ceil(days.length / 7); // Subtract header height
    
    const col = Math.floor(x / dayWidth);
    const row = Math.floor((y - 40) / dayHeight); // Subtract header height
    
    const dayIndex = row * 7 + col;
    
    if (dayIndex >= 0 && dayIndex < days.length) {
      return days[dayIndex];
    }
    
    return null;
  }, [days]);

  const handleMouseDown = useCallback((e: React.MouseEvent, day: Date) => {
    if (e.button !== 0) return; // Only handle left click
    
    setDragState({
      isDragging: true,
      dragType: 'create',
      startDate: day,
      endDate: day,
      taskId: null
    });
  }, []);

  const handleTaskDragStart = useCallback((e: React.MouseEvent, task: Task, dragType: 'move' | 'resize-start' | 'resize-end') => {
    e.stopPropagation();
    
    setDragState({
      isDragging: true,
      dragType,
      startDate: task.startDate,
      endDate: task.endDate,
      taskId: task.id
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return;
    
    const day = getDayFromMouseEvent(e);
    if (!day) return;

    if (dragState.dragType === 'create') {
      const startDate = dragState.startDate!;
      const endDate = day < startDate ? day : day;
      const actualStartDate = day < startDate ? day : startDate;
      const actualEndDate = day < startDate ? startDate : day;
      
      setDragState(prev => ({
        ...prev,
        startDate: actualStartDate,
        endDate: actualEndDate
      }));
    } else if (dragState.dragType === 'move' && dragState.taskId) {
      const task = tasks.find(t => t.id === dragState.taskId);
      if (task) {
        const duration = getDaysBetween(task.startDate, task.endDate) - 1;
        const newEndDate = new Date(day.getTime() + duration * 24 * 60 * 60 * 1000);
        
        setDragState(prev => ({
          ...prev,
          startDate: day,
          endDate: newEndDate
        }));
      }
    } else if (dragState.dragType === 'resize-start' && dragState.taskId) {
      const task = tasks.find(t => t.id === dragState.taskId);
      if (task && day <= task.endDate) {
        setDragState(prev => ({
          ...prev,
          startDate: day
        }));
      }
    } else if (dragState.dragType === 'resize-end' && dragState.taskId) {
      const task = tasks.find(t => t.id === dragState.taskId);
      if (task && day >= task.startDate) {
        setDragState(prev => ({
          ...prev,
          endDate: day
        }));
      }
    }
  }, [dragState, getDayFromMouseEvent, tasks]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;

    if (dragState.dragType === 'create' && dragState.startDate && dragState.endDate) {
      setModalState({
        isOpen: true,
        startDate: dragState.startDate,
        endDate: dragState.endDate
      });
    } else if (dragState.taskId && dragState.startDate && dragState.endDate) {
      onTaskUpdate(dragState.taskId, {
        startDate: dragState.startDate,
        endDate: dragState.endDate
      });
    }

    setDragState({
      isDragging: false,
      dragType: null,
      startDate: null,
      endDate: null,
      taskId: null
    });
  }, [dragState, onTaskUpdate]);

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const handleModalSave = (name: string, category: TaskCategory) => {
    if (modalState.startDate && modalState.endDate) {
      onTaskAdd(name, modalState.startDate, modalState.endDate, category);
    }
    setModalState({ isOpen: false, startDate: null, endDate: null });
  };

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      day >= startOfDay(task.startDate) && day <= startOfDay(task.endDate)
    );
  };

  const renderDragPreview = () => {
    if (!dragState.isDragging || !dragState.startDate || !dragState.endDate) return null;

    const startIndex = days.findIndex((day: Date) => isSameDay(day, dragState.startDate!));
    const endIndex = days.findIndex((day: Date) => isSameDay(day, dragState.endDate!));
    
    if (startIndex === -1 || endIndex === -1) return null;

    // Ensure start is before end
    const [actualStartIndex, actualEndIndex] = startIndex <= endIndex 
      ? [startIndex, endIndex] 
      : [endIndex, startIndex];

    const startRow = Math.floor(actualStartIndex / 7);
    const startCol = actualStartIndex % 7;
    const endRow = Math.floor(actualEndIndex / 7);
    const endCol = actualEndIndex % 7;

    const previews = [];
    
    // Calculate row height based on calendar height
    const rowHeight = calendarRef.current 
      ? (calendarRef.current.clientHeight - 40) / Math.ceil(days.length / 7)
      : 100;
    
    for (let row = startRow; row <= endRow; row++) {
      const colStart = row === startRow ? startCol : 0;
      const colEnd = row === endRow ? endCol : 6;
      
      const left = (colStart / 7) * 100;
      const width = ((colEnd - colStart + 1) / 7) * 100;
      const top = 40 + row * rowHeight + 30; // Header + row offset + task offset
      
      previews.push(
        <div
          key={`preview-${row}`}
          className="absolute h-6 bg-blue-400 opacity-50 rounded"
          style={{
            left: `${left}%`,
            width: `${width}%`,
            top: `${top}px`,
            zIndex: 5
          }}
        />
      );
    }
    
    return previews;
  };

  return (
    <>
      <div ref={calendarRef} className="flex-1 bg-white relative select-none">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1" style={{ minHeight: '600px' }}>
          {days.map((day: Date, index: number) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isDragStart = dragState.startDate && isSameDay(day, dragState.startDate);
            const isDragEnd = dragState.endDate && isSameDay(day, dragState.endDate);
            const isDragBetween = dragState.startDate && dragState.endDate && 
              day >= new Date(Math.min(dragState.startDate.getTime(), dragState.endDate.getTime())) && 
              day <= new Date(Math.max(dragState.startDate.getTime(), dragState.endDate.getTime()));
            
            return (
              <div
                key={day.toISOString()}
                className={`border-r border-b border-gray-200 p-1 relative cursor-pointer ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''} ${
                  isDragStart || isDragEnd ? 'bg-blue-100' : ''
                } ${isDragBetween && !isDragStart && !isDragEnd ? 'bg-blue-50' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, day)}
                style={{ minHeight: '100px' }}
              >
                <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                {/* Render tasks */}
                {dayTasks.map((task, taskIndex) => {
                  const taskStartIndex = days.findIndex((d: Date) => isSameDay(d, task.startDate));
                  const taskEndIndex = days.findIndex((d: Date) => isSameDay(d, task.endDate));
                  
                  // Only render task bar on the first day of the task
                  if (index !== taskStartIndex) return null;
                  
                  const startRow = Math.floor(taskStartIndex / 7);
                  const startCol = taskStartIndex % 7;
                  const endRow = Math.floor(taskEndIndex / 7);
                  const endCol = taskEndIndex % 7;
                  
                  // For multi-row tasks, render separate bars for each row
                  const taskBars = [];
                  
                  for (let row = startRow; row <= endRow; row++) {
                    const colStart = row === startRow ? startCol : 0;
                    const colEnd = row === endRow ? endCol : 6;
                    
                    // Calculate width based on the number of days in this row
                    const width = ((colEnd - colStart + 1) / 7) * 100;
                    
                    taskBars.push(
                      <TaskBar
                        key={`${task.id}-${row}`}
                        task={task}
                        startDate={day}
                        onDragStart={handleTaskDragStart}
                        style={{
                          position: 'absolute',
                          left: '2px',
                          width: `calc(${width}% - 4px)`,
                          top: `${20 + taskIndex * 28}px`,
                        }}
                      />
                    );
                  }
                  
                  return taskBars;
                })}
              </div>
            );
          })}
        </div>

        {/* Drag preview */}
        {renderDragPreview()}
      </div>

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, startDate: null, endDate: null })}
        onSave={handleModalSave}
      />
    </>
  );
};

export default Calendar;
