"use client";

import { useState } from "react";
import { Subtask } from "@/types";
import { subtasksService } from "@/services/subtasks.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubtaskListProps {
  taskId: number;
  subtasks: Subtask[];
  onUpdate: () => void;
}

export function SubtaskList({ taskId, subtasks, onUpdate }: SubtaskListProps) {
  const [newText, setNewText] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  // 1. CRIAR (Envia 'description' conforme seu DTO)
  const handleAdd = async () => {
    if (!newText.trim()) return;
    setLoadingAdd(true);

    try {
      await subtasksService.create({
        description: newText,
        taskId: taskId,
      });
      setNewText("");
      onUpdate();
    } catch (error) {
      toast.error("Erro ao criar subtarefa");
    } finally {
      setLoadingAdd(false);
    }
  };

  // 2. ATUALIZAR STATUS
  const handleToggle = async (sub: any) => {
    // Suporta tanto o Enum do Java ("COMPLETED") quanto boolean
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED"; // Envia string para o Java

    try {
      await subtasksService.updateStatus(sub.id, newStatus);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  // 3. DELETAR
  const handleDelete = async (subTaskId: number) => {
    try {
      await subtasksService.delete(subTaskId);
      toast.success("Removido!");
      onUpdate();
    } catch (error) {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Adicionar etapa..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), handleAdd())
          }
          disabled={loadingAdd}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={loadingAdd}
        >
          {loadingAdd ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-2">
        {subtasks.map((sub: any) => {
          // Lógica visual para lidar com 'description' (backend) vs 'title' (frontend type)
          const text = sub.description || sub.title;
          const isCompleted =
            sub.status === "COMPLETED" || sub.completed === true;

          return (
            <div
              key={sub.id}
              className="flex items-center justify-between bg-slate-50 p-2 rounded border"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => handleToggle(sub)}
                />
                <span
                  className={isCompleted ? "line-through text-slate-400" : ""}
                >
                  {text} {/* <--- AJUSTE 2: Exibe o texto correto */}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                onClick={() => handleDelete(sub.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
        {subtasks.length === 0 && (
          <p className="text-xs text-slate-400 text-center">
            Nenhuma subtarefa ainda.
          </p>
        )}
      </div>
    </div>
  );
}
