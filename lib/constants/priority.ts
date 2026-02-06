export const PRIORITY_WEIGHTS: Record<string, number> = {
  URGENTE: 5,
  ALTA: 4,
  MEDIA: 3,
  BAIXA: 2,
  LONGO_PRAZO: 1,
};

export type PriorityConfig = {
  label: string;
  color: string;
};

export function getPriorityConfig(priority: string): PriorityConfig {
  switch (priority) {
    case "URGENTE":
      return {
        label: "Urgente",
        color: "bg-red-600 hover:bg-red-700 text-white border-transparent",
      };
    case "ALTA":
      return {
        label: "Alta",
        color: "bg-orange-500 hover:bg-orange-600 text-white border-transparent",
      };
    case "MEDIA":
      return {
        label: "Média",
        color: "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent",
      };
    case "BAIXA":
      return {
        label: "Baixa",
        color: "bg-slate-400 hover:bg-slate-500 text-white border-transparent",
      };
    case "LONGO_PRAZO":
      return {
        label: "Longo P.",
        color: "bg-indigo-500 hover:bg-indigo-600 text-white border-transparent",
      };
    default:
      return {
        label: priority,
        color: "bg-slate-200 text-slate-600 border-transparent",
      };
  }
}
