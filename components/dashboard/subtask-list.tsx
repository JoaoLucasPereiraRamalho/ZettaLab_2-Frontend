"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Subtask } from "@/types"; // Mantemos seu tipo original
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
  const [newTitle, setNewTitle] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Criar Subtarefa
  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setLoadingAdd(true);

    try {
      // Envia o payload exato que o seu SubtaskCreateDTO espera
      await api.post("/subtasks", {
        title: newTitle,
        taskId: taskId,
        // Se o seu DTO exigir status, descomente abaixo:
        // status: "PENDING"
      });
      setNewTitle("");
      onUpdate(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar subtarefa");
    } finally {
      setLoadingAdd(false);
    }
  };

  // Atualizar Status (toggle)
  const handleToggle = async (sub: any) => {
    // Verifica se está completo (suporta tanto boolean quanto string 'COMPLETED')
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";

    try {
      // Envia para a rota exata do seu controller
      await api.patch(`/subtasks/${sub.id}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  // Deletar
  const handleDelete = async (subTaskId: number) => {
    try {
      await api.delete(`/subtasks/${subTaskId}`);
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
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
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
          // Lógica visual para suportar seu Type atual (seja boolean ou string)
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
                  {sub.title}
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
