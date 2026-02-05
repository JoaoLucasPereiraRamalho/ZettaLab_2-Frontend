export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Subtask {
  id: number;
  description: string;
  status: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  taskId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE" | "LONGO_PRAZO";
  dueDate?: string;
  createdAt: string;
  category: Category;
  subtasks: Subtask[];
}

export interface LoginResponse {
  token: string;
}

export interface DashboardData {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  tasks: Task[];
}
