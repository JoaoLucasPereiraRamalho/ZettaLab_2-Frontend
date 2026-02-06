export interface Subtask {
  id: number;
  description: string;
  status: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  taskId: number;
  completed?: boolean; // Compatibilidade com API
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "BAIXA" | "MEDIA" | "ALTA" | "URGENTE" | "LONGO_PRAZO";
  dueDate?: string;
  createdAt: string;
  categoryId?: number;
  category?: { id?: number; name?: string; color?: string }; // Resposta da API
  subtasks: Subtask[];
}

export interface DashboardData {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  tasks: Task[];
}
