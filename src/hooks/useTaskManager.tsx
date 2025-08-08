import { useState, useCallback, useEffect } from 'react';
import { Task, TaskCategory, FilterState } from '../types';

// Ensure this file is treated as a module
export {};

const STORAGE_KEY = 'task-planner-data';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: ['To Do', 'In Progress', 'Review', 'Completed'],
    timeRange: null
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate)
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((name: string, startDate: Date, endDate: Date, category: TaskCategory) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      startDate,
      endDate,
      category
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const getFilteredTasks = useCallback(() => {
    let filtered = tasks.filter(task => filters.categories.includes(task.category));
    
    if (filters.timeRange) {
      const now = new Date();
      const days = filters.timeRange === '1 week' ? 7 : filters.timeRange === '2 weeks' ? 14 : 21;
      const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(task => task.startDate <= cutoff);
    }
    
    return filtered;
  }, [tasks, filters]);

  return {
    tasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks
  };
};
