export interface Todo {
  id: number;
  text: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  done: boolean;
  created_at: string;
  due_at?: string | null;
} 