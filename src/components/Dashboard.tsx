import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Search, User } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import { Task, TaskFilterType } from '../types/Task';
import { loadTasks, saveTasks } from '../utils/localStorage';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks when component mounts or username changes
  useEffect(() => {
    console.log(`Dashboard effect triggered for username: ${username}`);
    
    // Load tasks for the current user
    const userTasks = loadTasks(username);
    setTasks(userTasks);
    setIsLoaded(true);
    
    // Reset UI state when switching users
    setFilter('all');
    setSearchQuery('');
    setShowTaskForm(false);
    setEditingTask(null);
    
    console.log(`Loaded ${userTasks.length} tasks for user: ${username}`);
  }, [username]); // Only depend on username

  // Save tasks whenever tasks change (but only after initial load)
  useEffect(() => {
    if (isLoaded && username) {
      console.log(`Saving ${tasks.length} tasks for user: ${username}`);
      saveTasks(tasks, username);
    }
  }, [tasks, username, isLoaded]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'pending' && !task.completed);
    
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
                <p className="text-sm text-gray-600">Welcome back, {username}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Filter Tabs */}
        <TaskFilter 
          currentFilter={filter} 
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onToggle={toggleTask}
        />

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSave={editingTask ? (updates) => updateTask(editingTask.id, updates) : addTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;