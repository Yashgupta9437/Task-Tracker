import { Task } from '../types/Task';

const USERNAME_KEY = 'task-manager-username';

// Generate user-specific key for tasks
const getUserTasksKey = (username: string): string => {
  return `task-manager-tasks-${username.toLowerCase().trim()}`;
};

export const saveTasks = (tasks: Task[], username: string): void => {
  try {
    const userTasksKey = getUserTasksKey(username);
    localStorage.setItem(userTasksKey, JSON.stringify(tasks));
    console.log(`Saved ${tasks.length} tasks for user: ${username} with key: ${userTasksKey}`);
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const loadTasks = (username: string): Task[] => {
  try {
    const userTasksKey = getUserTasksKey(username);
    const savedTasks = localStorage.getItem(userTasksKey);
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    console.log(`Loaded ${tasks.length} tasks for user: ${username} with key: ${userTasksKey}`);
    return tasks;
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

export const saveUsername = (username: string): void => {
  try {
    localStorage.setItem(USERNAME_KEY, username);
    console.log(`Saved username: ${username}`);
  } catch (error) {
    console.error('Error saving username to localStorage:', error);
  }
};

export const loadUsername = (): string | null => {
  try {
    const username = localStorage.getItem(USERNAME_KEY);
    console.log(`Loaded username: ${username}`);
    return username;
  } catch (error) {
    console.error('Error loading username from localStorage:', error);
    return null;
  }
};

export const clearUserData = (): void => {
  try {
    // Only clear the username, NOT the tasks
    // This preserves all users' task data when logging out
    localStorage.removeItem(USERNAME_KEY);
    console.log(`Cleared username from localStorage`);
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
};

// Utility function to get all stored usernames (for debugging)
export const getAllStoredUsernames = (): string[] => {
  try {
    const allKeys = Object.keys(localStorage);
    const taskKeys = allKeys.filter(key => key.startsWith('task-manager-tasks-'));
    const usernames = taskKeys.map(key => key.replace('task-manager-tasks-', ''));
    console.log(`Found stored data for users: ${usernames.join(', ')}`);
    return usernames;
  } catch (error) {
    console.error('Error getting stored usernames:', error);
    return [];
  }
};

// Debug function to see all localStorage data
export const debugLocalStorage = (): void => {
  console.log('=== LocalStorage Debug ===');
  const allKeys = Object.keys(localStorage);
  const taskManagerKeys = allKeys.filter(key => key.startsWith('task-manager'));
  
  taskManagerKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (key.includes('tasks-')) {
      const tasks = JSON.parse(value || '[]');
      console.log(`${key}: ${tasks.length} tasks`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  console.log('========================');
};