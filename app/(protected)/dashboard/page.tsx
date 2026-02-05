"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DashboardData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskActions } from "@/components/dashboard/task-actions";

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
        color: "bg-red-600 hover:bg-red-700 text-white border-transparent",
      };
    case "ALTA":
      return {
        label: "Alta",
        color:
          "bg-orange-500 hover:bg-orange-600 text-white border-transparent",
      };
    case "MEDIA":
      return {
        label: "Média",
        color:
          "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent",
      };
    case "BAIXA":
      return {
        label: "Baixa",
        color: "bg-slate-400 hover:bg-slate-500 text-white border-transparent",
      };
    case "LONGO_PRAZO":
      return {
        label: "Longo P.",
        color:
          "bg-indigo-500 hover:bg-indigo-600 text-white border-transparent",
      };
    default:
      return {
        label: priority,
        color: "bg-slate-200 text-slate-600 border-transparent",
      };
  }
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR E ORDENAR ---
  const fetchDashboard = async () => {
    try {
      const response = await api.get("/tasks/dashboard");
      const rawData: DashboardData[] = response.data;

      // Ordena as tarefas dentro de cada coluna
      const sortedData = rawData.map((column) => ({
        ...column,
        tasks: column.tasks.sort((a, b) => {
          const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
          const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
          return weightB - weightA;
        }),
      }));

      setData(sortedData);
    } catch (error) {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- ATUALIZAR STATUS TAREFA ---
  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    const oldData = [...data];
    const newData = data.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t,
      ),
    }));
    setData(newData);

    try {
      await api.patch(`/tasks/${taskId}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Status atualizado!");
      fetchDashboard();
    } catch (error) {
      toast.error("Erro ao atualizar status");
      setData(oldData);
    }
  };

  // --- ATUALIZAR SUBTAREFA ---
  const toggleSubtask = async (sub: any) => {
    const isCompleted = sub.status === "COMPLETED" || sub.completed === true;
    const newStatus = isCompleted ? "PENDING" : "COMPLETED";

    const newData = data.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) => {
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
    }));
    setData(newData);

    try {
      await api.patch(`/subtasks/${sub.id}/status`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      toast.error("Erro ao atualizar subtarefa");
      fetchDashboard();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <main className="flex-1 overflow-auto p-8">
        {/* Barra de Título e Ações */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-slate-800">
              Minhas Tarefas
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchDashboard}
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          <div className="flex gap-2">
            <CreateCategoryDialog onSuccess={fetchDashboard} />
            <CreateTaskDialog onSuccess={fetchDashboard} />
          </div>
        </div>

        {/* Área de Colunas */}
        <ScrollArea className="w-full whitespace-nowrap rounded-md h-[calc(100%-4rem)]">
          <div className="flex gap-6 pb-4">
            {data.map((column) => (
              <div key={column.categoryId} className="w-80 flex-shrink-0">
                <div
                  className="flex items-center justify-between p-3 rounded-t-lg text-white mb-2 shadow-sm"
                  style={{ backgroundColor: column.categoryColor || "#64748b" }}
                >
                  <h3 className="font-semibold truncate">
                    {column.categoryName}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-none"
                  >
                    {column.tasks.length}
                  </Badge>
                </div>

                <div className="flex flex-col gap-3">
                  {column.tasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-lg">
                      Sem tarefas
                    </div>
                  ) : (
                    column.tasks.map((task) => {
                      const priorityConfig = getPriorityConfig(task.priority);

                      return (
                        <Card
                          key={task.id}
                          className="hover:shadow-md transition-shadow border-l-4 group/card relative"
                          style={{ borderLeftColor: column.categoryColor }}
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start gap-2">
                              <CardTitle
                                className="text-base font-medium truncate leading-tight"
                                title={task.title}
                              >
                                {task.title}
                              </CardTitle>
                              <TaskActions
                                task={{
                                  ...task,
                                  categoryId: column.categoryId,
                                }}
                                onSuccess={fetchDashboard}
                              />
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 pt-2">
                            {/* Subtarefas */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-2 flex flex-col gap-1 border-t pt-2 border-slate-100">
                                {task.subtasks.map((sub: any) => {
                                  const isCompleted =
                                    sub.status === "COMPLETED" ||
                                    sub.completed === true;

                                  return (
                                    <div
                                      key={sub.id}
                                      className="flex items-center gap-2 text-xs group cursor-pointer hover:bg-slate-50 p-0.5 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSubtask(sub);
                                      }}
                                    >
                                      <div
                                        className={`h-3 w-3 rounded-full shrink-0 border transition-all ${
                                          isCompleted
                                            ? "bg-green-500 border-green-500"
                                            : "bg-transparent border-slate-300 group-hover:border-slate-400"
                                        }`}
                                      />
                                      <span
                                        className={`truncate max-w-[220px] select-none ${
                                          isCompleted
                                            ? "line-through text-slate-400"
                                            : "text-slate-600"
                                        }`}
                                        title={sub.description}
                                      >
                                        {sub.description}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Rodapé do Card */}
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                {/* STATUS */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="focus:outline-none">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-2 py-0.5 h-6 border-0 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                                        task.status === "COMPLETED"
                                          ? "bg-green-500"
                                          : task.status === "IN_PROGRESS"
                                            ? "bg-blue-500"
                                            : "bg-slate-500"
                                      }`}
                                    >
                                      {task.status === "IN_PROGRESS"
                                        ? "FAZENDO"
                                        : task.status === "COMPLETED"
                                          ? "CONCLUÍDO"
                                          : "PENDENTE"}
                                    </Badge>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateTaskStatus(task.id, "PENDING")
                                      }
                                    >
                                      Pendente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateTaskStatus(task.id, "IN_PROGRESS")
                                      }
                                    >
                                      Fazendo
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateTaskStatus(task.id, "COMPLETED")
                                      }
                                    >
                                      Concluído
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                {/* PRIORIDADE */}
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 h-6 ${priorityConfig.color}`}
                                >
                                  {priorityConfig.label}
                                </Badge>
                              </div>

                              {/* DATA */}
                              {task.dueDate && (
                                <div
                                  className="flex items-center gap-1"
                                  title="Prazo de entrega"
                                >
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {new Date(task.dueDate).toLocaleDateString(
                                      "pt-BR",
                                    )}
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
            ))}
            <div className="w-4" />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>
    </div>
  );
}
