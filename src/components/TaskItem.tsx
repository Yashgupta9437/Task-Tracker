import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Flag, Clock, CheckCircle, Circle } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggle }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const priorityColors = {
    high: 'bg-red-100 border-red-300 text-red-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    low: 'bg-green-100 border-green-300 text-green-800',
  };

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 transition-colors ${task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
        >
          {task.completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
              <Flag className="w-3 h-3 mr-1" />
              {priorityLabels[task.priority]}
            </div>

            {task.dueDate && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isOverdue(task.dueDate) 
                  ? 'bg-red-100 border-red-300 text-red-800' 
                  : 'bg-blue-100 border-blue-300 text-blue-800'
              }`}>
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && ' (Overdue)'}
              </div>
            )}

            <div className="inline-flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Created {formatDate(task.createdAt)} at {formatTime(task.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Task</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;