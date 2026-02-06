"use client";

import { useEffect, useState } from "react";
import { DashboardData, Task, Subtask } from "@/types";
import { tasksService } from "@/services/tasks.service";
import { subtasksService } from "@/services/subtasks.service";
import { PRIORITY_WEIGHTS } from "@/lib/constants";
import { toast } from "sonner";

export function useDashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const rawData = await tasksService.getDashboard();
      const sortedData = rawData.map((column) => ({
        ...column,
        tasks: column.tasks.sort((a, b) => {
          const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
          const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
          return weightB - weightA;
        }),
      }));
      setData(sortedData);
    } catch {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    const oldData = [...data];
    const newData = data.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus as Task["status"] }
          : t
      ),
    }));
    setData(newData);

    try {
      await tasksService.updateStatus(taskId, newStatus);
      toast.success("Status atualizado!");
      fetchDashboard();
    } catch {
      toast.error("Erro ao atualizar status");
      setData(oldData);
    }
  };

  const toggleSubtask = async (sub: { id: number; taskId: number; status: string; completed?: boolean }) => {
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";

    const newData: DashboardData[] = data.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) => {
        if (t.id === sub.taskId) {
          return {
            ...t,
            subtasks: (t.subtasks?.map((s) =>
              s.id === sub.id ? { ...s, status: newStatus as Subtask["status"] } : s
            ) ?? []) as Subtask[],
          };
        }
        return t;
      }),
    }));
    setData(newData);

    try {
      await subtasksService.updateStatus(sub.id, newStatus);
    } catch {
      toast.error("Erro ao atualizar subtarefa");
      fetchDashboard();
    }
  };

  return { data, loading, fetchDashboard, updateTaskStatus, toggleSubtask };
}
