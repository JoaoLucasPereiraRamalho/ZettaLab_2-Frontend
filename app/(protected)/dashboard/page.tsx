"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import { DashboardData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LogOut, Plus, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskActions } from "@/components/dashboard/task-actions";

export default function DashboardPage() {
  const { logout, token } = useAuth();
  const [data, setData] = useState<DashboardData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/tasks/dashboard");
      setData(response.data);
    } catch (error) {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* --- HEADER --- */}
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
                    column.tasks.map((task) => (
                      <Card
                        key={task.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
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
                              taskId={task.id}
                              currentStatus={task.status}
                              onSuccess={fetchDashboard}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1 py-0 h-5 border-0 text-white ${
                                task.status === "COMPLETED"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : task.status === "IN_PROGRESS"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-slate-500 hover:bg-slate-600"
                              }`}
                            >
                              {task.status === "IN_PROGRESS"
                                ? "FAZENDO"
                                : task.status === "COMPLETED"
                                  ? "CONCLUÍDO"
                                  : "PENDENTE"}
                            </Badge>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
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
                    ))
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
