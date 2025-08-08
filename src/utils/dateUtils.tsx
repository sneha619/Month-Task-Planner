import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, isToday } from 'date-fns';

// Ensure this file is treated as a module
export {};

export const getCalendarDays = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const isSameDayUtil = isSameDay;
export const isTodayUtil = isToday;

export const getDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
