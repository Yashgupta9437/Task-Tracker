import React from 'react';
import { TaskFilterType } from '../types/Task';

interface TaskFilterProps {
  currentFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters: { key: TaskFilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            currentFilter === filter.key
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
              : 'bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {filter.label}
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            currentFilter === filter.key
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;