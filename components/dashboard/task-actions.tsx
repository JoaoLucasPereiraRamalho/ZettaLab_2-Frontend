"use client";

import { useState } from "react";
import { Task } from "@/types";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTaskDialog } from "./edit-task-dialog";
import { SubtasksDialog } from "./subtasks-dialog"; // <--- Importando o novo modal
import {
  MoreVertical,
  Pencil,
  Trash2,
  ListChecks,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface TaskActionsProps {
  task: Task;
  onSuccess: () => void; // Função para recarregar o Dashboard
}

export function TaskActions({ task, onSuccess }: TaskActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openSubtasks, setOpenSubtasks] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Função para excluir a tarefa
  const handleDelete = async () => {
    // Opcional: Adicionar uma confirmação simples
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    setLoadingDelete(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success("Tarefa excluída com sucesso!");
      onSuccess(); // Atualiza a lista no fundo
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir tarefa");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
          >
            <span className="sr-only">Abrir menu</span>
            {loadingDelete ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Opção: Editar */}
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          {/* Opção: Checklist / Subtarefas */}
          <DropdownMenuItem onClick={() => setOpenSubtasks(true)}>
            <ListChecks className="mr-2 h-4 w-4" />
            Checklist
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Opção: Excluir */}
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={loadingDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- MODAIS --- */}

      {/* Modal de Edição (Dados principais) */}
      <EditTaskDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        task={task}
        onSuccess={onSuccess}
      />

      {/* Modal de Subtarefas (Checklist) */}
      <SubtasksDialog
        open={openSubtasks}
        onOpenChange={setOpenSubtasks}
        task={task}
        onSuccess={onSuccess} // Passamos o refresh para atualizar o card ao mudar status/criar
      />
    </>
  );
}
