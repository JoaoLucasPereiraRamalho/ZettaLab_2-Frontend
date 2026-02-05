"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  CheckCircle2,
  LayoutDashboard,
  KanbanSquare,
} from "lucide-react";

export function Header() {
  const { logout } = useAuth();
  const pathname = usePathname(); // Pega a rota atual (ex: /dashboard)

  // Função auxiliar para estilo do link ativo
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-slate-500"
    }`;
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-50">
      {/* LADO ESQUERDO: Logo e Navegação */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-800">Todo App</span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex items-center gap-6 border-l pl-6 h-6">
          <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
            <LayoutDashboard className="h-4 w-4" />
            Minhas Tarefas
          </Link>

          <Link href="/kanban" className={getLinkStyle("/kanban")}>
            <KanbanSquare className="h-4 w-4" />
            Quadro Kanban
          </Link>
        </nav>
      </div>

      {/* LADO DIREITO: Ações de Usuário */}
      <div className="flex items-center gap-4">
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
  );
}
