"use client";

interface SubtaskInlineProps {
  id: number;
  taskId: number;
  description: string;
  status: string;
  completed?: boolean;
  onToggle: (sub: { id: number; taskId: number; status: string; completed?: boolean }) => void;
  variant?: "dashboard" | "kanban";
}

export function SubtaskInline({
  id,
  taskId,
  description,
  status,
  completed,
  onToggle,
  variant = "dashboard",
}: SubtaskInlineProps) {
  const isCompleted = status === "COMPLETED" || completed === true;
  const sub = { id, taskId, status, completed };

  const sizeClasses = variant === "kanban" ? "h-2.5 w-2.5" : "h-3 w-3";
  const textClasses = variant === "kanban" ? "max-w-[200px]" : "max-w-[220px]";

  return (
    <div
      className="flex items-center gap-2 text-xs group cursor-pointer hover:bg-slate-50 p-0.5 rounded"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(sub);
      }}
    >
      <div
        className={`${sizeClasses} rounded-full shrink-0 border transition-all ${
          isCompleted
            ? "bg-green-500 border-green-500"
            : "bg-transparent border-slate-300 group-hover:border-slate-400"
        }`}
      />
      <span
        className={`truncate select-none ${textClasses} ${
          isCompleted ? "line-through text-slate-400" : "text-slate-600"
        }`}
        title={description}
      >
        {description}
      </span>
    </div>
  );
}
