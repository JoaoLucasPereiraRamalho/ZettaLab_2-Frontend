"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Task } from "@/types"; // Importe o tipo Task
import { EditTaskDialog } from "./edit-task-dialog"; // Importe o modal novo
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Trash2,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  Pencil, // Ícone de editar
} from "lucide-react";
import { toast } from "sonner";

interface TaskActionsProps {
  task: Task; // Agora recebemos a tarefa completa
  onSuccess: () => void;
}

export function TaskActions({ task, onSuccess }: TaskActionsProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [openEdit, setOpenEdit] = useState(false); // Controle do modal de edição

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success("Tarefa removida!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao deletar tarefa");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/tasks/${task.id}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Status atualizado!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao atualizar status");
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
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          {/* Item de Editar */}
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Lógica de Status */}
          {task.status === "PENDING" && (
            <>
              <DropdownMenuItem
                onClick={() => handleStatusChange("IN_PROGRESS")}
              >
                <PlayCircle className="mr-2 h-4 w-4 text-blue-600" />
                Começar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Concluir
              </DropdownMenuItem>
            </>
          )}

          {task.status === "IN_PROGRESS" && (
            <>
              <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                <RotateCcw className="mr-2 h-4 w-4 text-orange-500" />
                Voltar p/ Pendente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Concluir
              </DropdownMenuItem>
            </>
          )}

          {task.status === "COMPLETED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
              <RotateCcw className="mr-2 h-4 w-4 text-orange-500" />
              Reabrir Tarefa
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setOpenAlert(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modais Controlados pelo Menu */}
      <EditTaskDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        task={task}
        onSuccess={onSuccess}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação excluirá a tarefa permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
