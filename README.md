💻 Zetta Todo - Frontend
Interface moderna e intuitiva para gerenciamento de tarefas, utilizando o conceito de quadros Kanban e organização por categorias. O projeto foi desenvolvido com foco em performance e experiência do usuário (UX).

✨ Funcionalidades Principais
Gestão de Tarefas: Criação, edição e exclusão de tarefas com prazos e níveis de prioridade.

Quadro Kanban: Visualização clara do fluxo de trabalho (Pendente, Em Andamento, Concluído).

Subtarefas: Controle detalhado de itens dentro de uma tarefa principal.

Categorias Personalizadas: Organização visual por cores para diferenciar projetos ou áreas da vida.

Dashboard: Resumo das atividades e tarefas filtradas por categoria.

Autenticação: Fluxo de login e cadastro integrado com segurança via JWT.

🛠️ Tecnologias Utilizadas
Next.js 14/15: Framework React para renderização rápida e rotas otimizadas.

TypeScript: Garantia de tipagem e segurança no desenvolvimento.

Tailwind CSS: Estilização utilitária para um design responsivo e moderno.

Shadcn/UI: Biblioteca de componentes de alta qualidade e acessibilidade.

Axios: Cliente HTTP para comunicação com a API REST.

Lucide React: Conjunto de ícones leves e elegantes.

🚀 Como Executar o Projeto
Pré-requisitos
Node.js instalado (versão 18 ou superior).

Backend da API em execução (por padrão na porta 8080).

Passo a Passo
Clonar o repositório:

Bash
git clone https://github.com/seu-usuario/seu-repositorio-frontend.git
cd seu-repositorio-frontend
Instalar as dependências:

Bash
npm install

# ou

yarn install
Configurar variáveis de ambiente: Crie um arquivo .env.local na raiz do projeto e adicione a URL do seu backend:

Snippet de código
NEXT_PUBLIC_API_URL=http://localhost:8080
Iniciar o servidor de desenvolvimento:

Bash
npm run dev
O frontend estará disponível em http://localhost:3000.

📁 Estrutura de Pastas
/src/components: Componentes reutilizáveis (botões, cards, inputs).

/src/app: Páginas e rotas da aplicação (Next.js App Router).

/src/services: Configurações do Axios e chamadas para a API.

/src/hooks: Hooks personalizados para gerenciamento de estado e lógica.

/src/types: Definições de interfaces TypeScript para DTOs e Modelos.

Dica: Para uma melhor experiência de teste, certifique-se de que o backend esteja rodando antes de realizar o login.
