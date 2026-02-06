# 💻 Zetta Todo — Frontend

Interface moderna para gerenciamento de tarefas com quadro Kanban, categorias e subtarefas. Desenvolvido com Next.js, TypeScript e foco em performance e UX.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|--------|------------|
| **Tarefas** | Criar, editar e excluir tarefas com prazo e prioridade (Baixa, Média, Alta, Urgente, Longo Prazo). |
| **Quadro Kanban** | Visualização por status: Pendente, Fazendo e Concluído. |
| **Subtarefas** | Checklist dentro de cada tarefa com toggle de conclusão. |
| **Categorias** | Organização por categorias com cores personalizadas. |
| **Dashboard** | Visão por categoria com cards e contadores. |
| **Autenticação** | Login e cadastro com JWT (token em `localStorage`). |

---

## 🛠️ Stack

- **Next.js 16** — App Router, React Server Components
- **TypeScript** — Tipagem estática
- **Tailwind CSS** — Estilização utilitária
- **Radix UI** — Componentes acessíveis (Dialog, Select, Dropdown, etc.)
- **Axios** — Cliente HTTP com interceptors para JWT
- **Lucide React** — Ícones
- **Sonner** — Toasts de notificação

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js** 18+
- **Backend** da API rodando (por padrão em `http://localhost:8080`)

### Passo a passo

```bash
# Clonar e entrar no projeto
git clone https://github.com/seu-usuario/todo-front.git
cd todo-front

# Instalar dependências
npm install

# Subir o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

Para produção, a URL da API pode ser alterada em `lib/api.ts` (ou use variável de ambiente e ajuste o código).

---

## 📜 Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (após `build`) |
| `npm run lint` | Executa o ESLint |

---

## 📁 Estrutura do projeto

```
todo-front/
├── app/                    # Rotas (Next.js App Router)
│   ├── (auth)/             # Login e registro (públicas)
│   ├── (protected)/        # Dashboard e Kanban (autenticadas)
│   ├── layout.tsx           # Layout raiz + AuthProvider + Toaster
│   └── page.tsx            # Redireciona para /dashboard ou /login
├── components/
│   ├── dashboard/          # Modais e header do app (tarefas, categorias, etc.)
│   ├── tasks/              # Componentes compartilhados (ex.: SubtaskInline)
│   └── ui/                 # Componentes base (shadcn: Button, Card, Dialog, etc.)
├── context/
│   └── auth-context.tsx    # Estado global de autenticação (token, login, logout)
├── hooks/
│   ├── use-dashboard.ts   # Lógica do dashboard (fetch, status, subtarefas)
│   └── use-kanban-tasks.ts # Lógica do Kanban (fetch, mover, subtarefas)
├── lib/
│   ├── api.ts              # Instância Axios (baseURL + interceptor JWT)
│   ├── constants/          # Prioridades, colunas Kanban, etc.
│   └── utils.ts            # Utilitários (ex.: cn)
├── services/               # Camada de serviços (chamadas à API)
│   ├── tasks.service.ts
│   ├── subtasks.service.ts
│   ├── categories.service.ts
│   └── auth.service.ts
└── types/                  # Interfaces TypeScript (User, Task, Category, etc.)
```

---

## 🔗 Integração com o backend

O frontend espera uma API REST na porta **8080** com endpoints como:

- `POST /auth/login` — Login (retorna `{ token }`)
- `POST /users` — Cadastro
- `GET /tasks`, `GET /tasks/dashboard` — Listar tarefas
- `POST /tasks`, `PUT /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE /tasks/:id`
- `GET /categories`, `POST /categories`
- `POST /subtasks`, `PATCH /subtasks/:id/status`, `DELETE /subtasks/:id`

As requisições autenticadas usam o header `Authorization: Bearer <token>`.

---

## 💡 Dica

Para testar o fluxo completo, inicie o **backend** antes de acessar o frontend e fazer login.
