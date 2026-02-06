import api from "@/lib/api";

export const subtasksService = {
  create: async (payload: { description: string; taskId: number }) => {
    await api.post("/subtasks", payload);
  },

  updateStatus: async (subtaskId: number, newStatus: string) => {
    await api.patch(`/subtasks/${subtaskId}/status`, JSON.stringify(newStatus), {
      headers: { "Content-Type": "application/json" },
    });
  },

  delete: async (subtaskId: number) => {
    await api.delete(`/subtasks/${subtaskId}`);
  },
};
