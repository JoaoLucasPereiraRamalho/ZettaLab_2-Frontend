import api from "@/lib/api";
import { Task } from "@/types";
import { DashboardData } from "@/types";

export const tasksService = {
  getDashboard: async (): Promise<DashboardData[]> => {
    const { data } = await api.get<DashboardData[]>("/tasks/dashboard");
    return data;
  },

  getAll: async (): Promise<Task[]> => {
    const { data } = await api.get<Task[]>("/tasks");
    return data;
  },

  getById: async (taskId: number) => {
    const { data } = await api.get(`/tasks/${taskId}`);
    return data;
  },

  create: async (payload: {
    title: string;
    description?: string;
    priority: string;
    categoryId: number;
    dueDate?: string | null;
  }) => {
    await api.post("/tasks", payload);
  },

  update: async (
    taskId: number,
    payload: {
      title: string;
      description?: string;
      priority: string;
      dueDate?: string | null;
      categoryId?: number;
    }
  ) => {
    await api.put(`/tasks/${taskId}`, payload);
  },

  updateStatus: async (taskId: number, newStatus: string) => {
    await api.patch(`/tasks/${taskId}/status`, JSON.stringify(newStatus), {
      headers: { "Content-Type": "application/json" },
    });
  },

  delete: async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
  },
};
