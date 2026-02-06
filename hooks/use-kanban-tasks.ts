"use client";

import { useEffect, useState } from "react";
import { Task, Subtask } from "@/types";
import { tasksService } from "@/services/tasks.service";
import { subtasksService } from "@/services/subtasks.service";
import { PRIORITY_WEIGHTS } from "@/lib/constants";
import { toast } from "sonner";

export function useKanbanTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await tasksService.getAll();
      setTasks(response);
    } catch {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    const oldTasks = [...tasks];
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? ({ ...t, status: newStatus as Task["status"] })
          : t
      )
    );

    try {
      await tasksService.updateStatus(taskId, newStatus);
      toast.success("Movido com sucesso!");
      fetchTasks();
    } catch {
      toast.error("Erro ao mover tarefa");
      setTasks(oldTasks);
    }
  };

  const toggleSubtask = async (sub: { id: number; taskId: number; status: string; completed?: boolean }) => {
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";

    setTasks(
      tasks.map((t) => {
        if (t.id === sub.taskId) {
          return {
            ...t,
            subtasks: (t.subtasks?.map((s) =>
              s.id === sub.id ? { ...s, status: newStatus as Subtask["status"] } : s
            ) ?? []) as Subtask[],
          };
        }
        return t;
      })
    );

    try {
      await subtasksService.updateStatus(sub.id, newStatus);
    } catch {
      toast.error("Erro ao atualizar subtarefa");
      fetchTasks();
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
        return weightB - weightA;
      });
  };

  return {
    tasks,
    loading,
    fetchTasks,
    updateTaskStatus,
    toggleSubtask,
    getTasksByStatus,
  };
}
