export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskFilterType = 'all' | 'completed' | 'pending';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}