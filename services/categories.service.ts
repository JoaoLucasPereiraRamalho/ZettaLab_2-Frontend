import api from "@/lib/api";
import { Category } from "@/types";

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  create: async (payload: { name: string; color: string }) => {
    await api.post("/categories", payload);
  },
};
