"use client";

import { useState } from "react";
import { categoriesService } from "@/services/categories.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateCategoryDialogProps {
  onSuccess: () => void;
}

export function CreateCategoryDialog({ onSuccess }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await categoriesService.create({ name, color });
      toast.success("Categoria criada com sucesso!");
      setOpen(false); // Fecha o modal
      setName(""); // Limpa o form
      onSuccess(); // Avisa o pai para atualizar
    } catch (error) {
      toast.error("Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Trabalho, Pessoal..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-color">Cor da Etiqueta</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="category-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <span className="text-sm text-slate-500">{color}</span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar Categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
