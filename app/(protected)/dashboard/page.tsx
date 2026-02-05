"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
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
import { LogOut, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskActions } from "@/components/dashboard/task-actions";

// --- 1. CONFIGURAÇÃO DE CORES (VISUAL) ---
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

// --- 2. CONFIGURAÇÃO DE ORDENAÇÃO (LÓGICA) ---
// Quanto maior o número, mais no topo aparece
const PRIORITY_WEIGHTS: Record<string, number> = {
  URGENTE: 5,
  ALTA: 4,
  MEDIA: 3,
  BAIXA: 2,
  LONGO_PRAZO: 1,
};

export default function DashboardPage() {
  const { logout } = useAuth();
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
          // Ordem decrescente (Maior peso primeiro)
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Todo App</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={fetchDashboard}>
            Atualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* KANBAN */}
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Minhas Tarefas
          </h2>
          <div className="flex gap-2">
            <CreateCategoryDialog onSuccess={fetchDashboard} />
            <CreateTaskDialog onSuccess={fetchDashboard} />
          </div>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-md">
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
                            {/* SUBTAREFAS */}
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

                            {/* RODAPÉ DO CARD */}
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
