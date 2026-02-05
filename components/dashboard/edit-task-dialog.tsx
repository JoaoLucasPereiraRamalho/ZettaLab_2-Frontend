"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Task } from "@/types";
import { SubtaskList } from "./subtask-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onSuccess: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSuccess,
}: EditTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
  );

  // @ts-ignore - Ignora erro de tipo se subtasks não existir na interface Task
  const [subtasks, setSubtasks] = useState<any[]>(task.subtasks || []);

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
      }
    } catch (error) {
      console.error("Erro ao carregar subtarefas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/tasks/${task.id}`, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        // @ts-ignore
        categoryId: task.categoryId,
      });

      toast.success("Tarefa atualizada!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar tarefa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                onValueChange={(v) => setPriority(v as any)}
                value={priority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="URGENTE">Urgente</SelectItem>
                  <SelectItem value="LONGO_PRAZO">Longo Prazo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prazo</Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label className="text-base font-semibold">Checklist</Label>
            <SubtaskList
              taskId={task.id}
              subtasks={subtasks}
              onUpdate={refreshSubtasks}
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
