import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import Calendar from './components/Calender';
import FilterSidebar from './components/FilterSidebar';
import { useTaskManager } from './hooks/useTaskManager';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { filters, setFilters, addTask, updateTask, getFilteredTasks } = useTaskManager();
  
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="h-screen flex bg-gray-100">
      <FilterSidebar filters={filters} onFiltersChange={setFilters} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                &larr; Prev
              </button>
              <button 
                onClick={goToCurrentMonth}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Today
              </button>
              <button 
                onClick={goToNextMonth}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            Drag across days to create tasks • Drag tasks to move • Drag edges to resize
          </p>
        </div>

        {/* Calendar */}
        <Calendar
          currentDate={currentDate}
          tasks={filteredTasks}
          onTaskUpdate={updateTask}
          onTaskAdd={addTask}
        />
      </div>
    </div>
  );
};

export default App;
