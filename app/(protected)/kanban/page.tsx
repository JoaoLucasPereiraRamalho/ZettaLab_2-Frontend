"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Loader2, KanbanSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskActions } from "@/components/dashboard/task-actions";
import { SubtaskInline } from "@/components/tasks/subtask-inline";
import { Task } from "@/types";
import { useKanbanTasks } from "@/hooks/use-kanban-tasks";
import { getPriorityConfig, KANBAN_COLUMNS } from "@/lib/constants";

export default function KanbanPage() {
  const {
    loading,
    fetchTasks,
    updateTaskStatus,
    toggleSubtask,
    getTasksByStatus,
  } = useKanbanTasks();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
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

      <main className="flex-1 overflow-hidden p-8 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div
                key={column.id}
                className="flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 h-full min-h-0"
              >
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

                <div className="flex-1 overflow-y-auto p-3 min-h-0">
                  <div className="flex flex-col gap-3">
                    {columnTasks.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-lg bg-white/50">
                        Vazio
                      </div>
                    ) : (
                      columnTasks.map((task: Task & { category?: { color?: string; name?: string; id?: number } }) => {
                        const priorityConfig = getPriorityConfig(task.priority);
                        const categoryColor = task.category?.color || "#cbd5e1";
                        const categoryName = task.category?.name || "Geral";
                        const taskWithCategory: Task = {
                          ...task,
                          categoryId: task.categoryId ?? task.category?.id,
                        };

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
                                  task={taskWithCategory}
                                  onSuccess={fetchTasks}
                                />
                              </div>
                            </CardHeader>

                            <CardContent className="p-3 pt-2">
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-1 flex flex-col gap-1 border-t pt-2 border-slate-100 mb-3">
                                  {task.subtasks.map((sub) => (
                                    <SubtaskInline
                                      key={sub.id}
                                      id={sub.id}
                                      taskId={sub.taskId}
                                      description={sub.description}
                                      status={sub.status}
                                      completed={sub.completed}
                                      onToggle={toggleSubtask}
                                      variant="kanban"
                                    />
                                  ))}
                                </div>
                              )}

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
