"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Task, Subtask } from "@/types";
import { SubtaskList } from "./subtask-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubtasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onSuccess: () => void; // <--- NOVO: Função para atualizar o painel
}

export function SubtasksDialog({
  open,
  onOpenChange,
  task,
  onSuccess,
}: SubtasksDialogProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);

  useEffect(() => {
    if (open) {
      refreshSubtasks();
    }
  }, [open, task]);

  const refreshSubtasks = async () => {
    try {
      const response = await api.get(`/tasks/${task.id}`);
      if (response.data && response.data.subtasks) {
        setSubtasks(response.data.subtasks);
        // Toda vez que a lista mudar, avisamos o Dashboard para atualizar os cards também
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao carregar subtarefas");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checklist</DialogTitle>
          <DialogDescription>
            Gerenciar etapas para:{" "}
            <span className="font-semibold text-foreground">{task.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* O componente de lista já tem a lógica de Delete/Status, só precisa recarregar */}
          <SubtaskList
            taskId={task.id}
            subtasks={subtasks}
            onUpdate={refreshSubtasks}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
