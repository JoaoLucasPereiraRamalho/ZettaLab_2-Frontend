"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token } = await authService.login(email, password);
      toast.success("Login realizado com sucesso!");
      login(token);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="mt-4 text-center text-sm">
              Não tem conta?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
