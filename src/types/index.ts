export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  category: TaskCategory;
}

export type TaskCategory = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface FilterState {
  categories: TaskCategory[];
  timeRange: '1 week' | '2 weeks' | '3 weeks' | null;
}

export interface DragState {
  isDragging: boolean;
  dragType: 'create' | 'move' | 'resize-start' | 'resize-end' | null;
  startDate: Date | null;
  endDate: Date | null;
  taskId: string | null;
}

// Ensure this file is treated as a module
export {};
