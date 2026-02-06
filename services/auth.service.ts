import api from "@/lib/api";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    await api.post("/users", { name, email, password });
  },
};
