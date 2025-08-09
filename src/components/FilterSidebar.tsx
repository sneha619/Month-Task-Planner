import React from 'react';
import { TaskCategory, FilterState } from '../types';

// Ensure this file is treated as a module
export {};

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange }) => {
  const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];
  const timeRanges = ['1 week', '2 weeks', '3 weeks'] as const;

  const handleCategoryChange = (category: TaskCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleTimeRangeChange = (timeRange: typeof timeRanges[number] | null) => {
    onFiltersChange({ ...filters, timeRange });
  };

  return (
    <div className="sm:w-64 bg-gray-50 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-gray-200 overflow-auto flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Time Range</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="timeRange"
              checked={filters.timeRange === null}
              onChange={() => handleTimeRangeChange(null)}
              className="mr-2"
            />
            <span className="text-sm">All tasks</span>
          </label>
          {timeRanges.map(range => (
            <label key={range} className="flex items-center">
              <input
                type="radio"
                name="timeRange"
                checked={filters.timeRange === range}
                onChange={() => handleTimeRangeChange(range)}
                className="mr-2"
              />
              <span className="text-sm">Tasks within {range}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;