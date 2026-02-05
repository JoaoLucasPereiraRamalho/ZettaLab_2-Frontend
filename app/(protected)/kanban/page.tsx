"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Loader2, KanbanSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { TaskActions } from "@/components/dashboard/task-actions";
import { Button } from "@/components/ui/button";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";

// --- CONFIGURAÇÕES VISUAIS E LÓGICAS ---

const PRIORITY_WEIGHTS: Record<string, number> = {
  URGENTE: 5,
  ALTA: 4,
  MEDIA: 3,
  BAIXA: 2,
  LONGO_PRAZO: 1,
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "URGENTE":
      return {
        label: "Urgente",
        color: "bg-red-600 text-white border-transparent",
      };
    case "ALTA":
      return {
        label: "Alta",
        color: "bg-orange-500 text-white border-transparent",
      };
    case "MEDIA":
      return {
        label: "Média",
        color: "bg-yellow-500 text-white border-transparent",
      };
    case "BAIXA":
      return {
        label: "Baixa",
        color: "bg-slate-400 text-white border-transparent",
      };
    case "LONGO_PRAZO":
      return {
        label: "Longo P.",
        color: "bg-indigo-500 text-white border-transparent",
      };
    default:
      return {
        label: priority,
        color: "bg-slate-200 text-slate-600 border-transparent",
      };
  }
};

const KANBAN_COLUMNS = [
  { id: "PENDING", title: "Pendente", color: "bg-slate-500" },
  { id: "IN_PROGRESS", title: "Fazendo", color: "bg-blue-500" },
  { id: "COMPLETED", title: "Concluído", color: "bg-green-500" },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
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
        t.id === taskId ? ({ ...t, status: newStatus } as any) : t,
      ),
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Movido com sucesso!");
    } catch (error) {
      toast.error("Erro ao mover tarefa");
      setTasks(oldTasks);
    }
  };

  const toggleSubtask = async (sub: any) => {
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";

    setTasks(
      tasks.map((t) => {
        if (t.id === sub.taskId) {
          return {
            ...t,
            subtasks: t.subtasks?.map((s: any) =>
              s.id === sub.id ? { ...s, status: newStatus } : s,
            ),
          };
        }
        return t;
      }),
    );

    try {
      await api.patch(`/subtasks/${sub.id}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    // 1. h-screen no container principal garante que a página ocupe 100% da tela do navegador
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* CABEÇALHO (shrink-0 impede que ele encolha) */}
      <div className="flex items-center justify-between p-8 pb-4 shrink-0 bg-slate-50 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-10 w-10 rounded-lg flex items-center justify-center">
            <KanbanSquare className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Quadro Kanban</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchTasks}
            title="Atualizar Lista"
          >
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </Button>
          <CreateCategoryDialog onSuccess={fetchTasks} />
          <CreateTaskDialog onSuccess={fetchTasks} />
        </div>
      </div>

      {/* 2. MAIN com 'flex-1' e 'overflow-hidden'. 
         Isso diz: "Ocupe todo o espaço que sobra, mas se o conteúdo for maior, CORTA e não rola a página inteira" */}
      <main className="flex-1 overflow-hidden p-8 pt-2">
        {/* 3. GRID com 'h-full'. Garante que as colunas ocupem a altura do Main */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              // 4. COLUNA INDIVIDUAL
              // 'h-full': Ocupa altura total da grid
              // 'flex flex-col': Organiza cabeçalho e lista verticalmente
              // 'min-h-0': TRUQUE CRUCIAL do Flexbox para permitir scroll interno
              <div
                key={column.id}
                className="flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 h-full min-h-0"
              >
                {/* Cabeçalho da Coluna (Fixo, não rola) */}
                <div
                  className={`p-3 rounded-t-xl text-white flex justify-between items-center ${column.color} shrink-0`}
                >
                  <h3 className="font-bold">{column.title}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-none"
                  >
                    {columnTasks.length}
                  </Badge>
                </div>

                {/* 5. ÁREA DE SCROLL (Troquei ScrollArea por div nativa)
                   'flex-1': Ocupa todo o espaço restante da coluna
                   'overflow-y-auto': Cria a barra de rolagem AQUI se precisar
                   'min-h-0': Garante que o scroll apareça
                */}
                <div className="flex-1 overflow-y-auto p-3 min-h-0">
                  <div className="flex flex-col gap-3">
                    {columnTasks.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-lg bg-white/50">
                        Vazio
                      </div>
                    ) : (
                      columnTasks.map((task: any) => {
                        const priorityConfig = getPriorityConfig(task.priority);
                        const categoryColor = task.category?.color || "#cbd5e1";
                        const categoryName = task.category?.name || "Geral";

                        return (
                          <Card
                            key={task.id}
                            className="hover:shadow-md transition-all border-l-4 relative group shrink-0"
                            style={{ borderLeftColor: categoryColor }}
                          >
                            <CardHeader className="p-3 pb-1">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex flex-col overflow-hidden w-full">
                                  <span
                                    className="text-[10px] font-bold uppercase tracking-wider truncate mb-1"
                                    style={{ color: categoryColor }}
                                  >
                                    {categoryName}
                                  </span>
                                  <CardTitle
                                    className="text-sm font-semibold truncate leading-tight"
                                    title={task.title}
                                  >
                                    {task.title}
                                  </CardTitle>
                                </div>
                                <TaskActions
                                  task={task}
                                  onSuccess={fetchTasks}
                                />
                              </div>
                            </CardHeader>

                            <CardContent className="p-3 pt-2">
                              {/* Subtarefas */}
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-1 flex flex-col gap-1 border-t pt-2 border-slate-100 mb-3">
                                  {task.subtasks.map((sub: any) => {
                                    const isCompleted =
                                      sub.status === "COMPLETED" ||
                                      sub.completed === true;
                                    return (
                                      <div
                                        key={sub.id}
                                        className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-50 rounded p-0.5"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubtask(sub);
                                        }}
                                      >
                                        <div
                                          className={`h-2.5 w-2.5 rounded-full shrink-0 border transition-all ${isCompleted ? "bg-green-500 border-green-500" : "bg-transparent border-slate-300"}`}
                                        />
                                        <span
                                          className={`truncate max-w-[200px] select-none ${isCompleted ? "line-through text-slate-400" : "text-slate-600"}`}
                                        >
                                          {sub.description}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Rodapé */}
                              <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                                <div className="flex gap-1 items-center">
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1.5 py-0 h-5 border-0 ${priorityConfig.color}`}
                                  >
                                    {priorityConfig.label}
                                  </Badge>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 h-5 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                                      >
                                        Mover
                                      </Badge>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateTaskStatus(task.id, "PENDING")
                                        }
                                      >
                                        Para Pendente
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateTaskStatus(
                                            task.id,
                                            "IN_PROGRESS",
                                          )
                                        }
                                      >
                                        Para Fazendo
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          updateTaskStatus(task.id, "COMPLETED")
                                        }
                                      >
                                        Para Concluído
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {task.dueDate && (
                                  <div
                                    className="flex items-center gap-1 text-[10px] text-slate-500"
                                    title="Prazo"
                                  >
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(task.dueDate)
                                        .toLocaleDateString("pt-BR")
                                        .slice(0, 5)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
