import { Header } from "@/components/dashboard/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* O Header fica fixo no topo */}
      <Header />

      {/* O conteúdo das páginas (Dashboard/Kanban) é renderizado aqui */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
