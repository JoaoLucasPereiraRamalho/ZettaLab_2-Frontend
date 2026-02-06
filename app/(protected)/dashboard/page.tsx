"use client";

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
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskActions } from "@/components/dashboard/task-actions";
import { SubtaskInline } from "@/components/tasks/subtask-inline";
import { useDashboard } from "@/hooks/use-dashboard";
import { getPriorityConfig } from "@/lib/constants";

export default function DashboardPage() {
  const {
    data,
    loading,
    fetchDashboard,
    updateTaskStatus,
    toggleSubtask,
  } = useDashboard();

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
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-2 flex flex-col gap-1 border-t pt-2 border-slate-100">
                                {task.subtasks.map((sub: { id: number; taskId: number; description: string; status: string; completed?: boolean }) => (
                                  <SubtaskInline
                                    key={sub.id}
                                    id={sub.id}
                                    taskId={sub.taskId}
                                    description={sub.description}
                                    status={sub.status}
                                    completed={sub.completed}
                                    onToggle={toggleSubtask}
                                    variant="dashboard"
                                  />
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-slate-500 mt-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
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

                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 h-6 ${priorityConfig.color}`}
                                >
                                  {priorityConfig.label}
                                </Badge>
                              </div>

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
