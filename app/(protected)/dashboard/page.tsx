"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Dashboard! 🎉</h1>
      <p className="mb-4">
        Se você está vendo isso, o Login funcionou e o Token foi salvo.
      </p>

      <Button variant="destructive" onClick={logout}>
        Sair (Logout)
      </Button>
    </div>
  );
}
