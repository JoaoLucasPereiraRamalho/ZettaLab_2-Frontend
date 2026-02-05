"use client";

import { useState } from "react";
import api from "@/lib/api";
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
import { MoreVertical, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface TaskActionsProps {
  taskId: number;
  currentStatus: string;
  onSuccess: () => void;
}

export function TaskActions({
  taskId,
  currentStatus,
  onSuccess,
}: TaskActionsProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Tarefa removida!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao deletar tarefa");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      // O backend espera a string exata entre aspas, ex: "COMPLETED"
      await api.patch(`/tasks/${taskId}/status`, JSON.stringify(newStatus), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Status atualizado!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    } finally {
      setLoading(false);
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
          <DropdownMenuSeparator />

          {currentStatus !== "COMPLETED" ? (
            <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Concluir
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
              <RotateCcw className="mr-2 h-4 w-4 text-orange-500" />
              Reabrir
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

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              tarefa.
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
