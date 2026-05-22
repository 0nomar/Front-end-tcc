# TCC Frontend - Interface de Gerenciamento de TCC

Este é o frontend do sistema de gerenciamento de Trabalhos de Conclusão de Curso (TCC), uma aplicação web desenvolvida para facilitar a interação entre alunos, orientadores e projetos acadêmicos.

A interface foi criada para tornar o processo de busca, inscrição, acompanhamento e gerenciamento de projetos mais simples, organizado e acessível. O frontend se comunica com a API do backend, exibindo os dados de forma visual, responsiva e intuitiva para os usuários do sistema.

---

## 🚀 Tecnologias

- React 18
- Vite
- JavaScript / TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Framer Motion / Motion
- React Router
- React Hook Form
- Recharts
- Sonner
- Playwright

---

## 🏗️ Arquitetura

O projeto utiliza uma estrutura baseada em componentes, separando responsabilidades da interface para facilitar manutenção, escalabilidade e organização.

### Estrutura principal

- **src/**: Código-fonte principal da aplicação.
- **public/**: Arquivos públicos e assets estáticos.
- **e2e/**: Testes end-to-end com Playwright.
- **dist/**: Build gerado para produção.
- **index.html**: Arquivo HTML base da aplicação.
- **vite.config.js**: Configuração do Vite.
- **playwright.config.js**: Configuração dos testes E2E.
- **postcss.config.mjs**: Configuração do PostCSS/Tailwind.
- **jsconfig.json**: Configuração de paths e suporte ao editor.

---

## 🎯 Objetivo do Projeto

O objetivo deste frontend é fornecer uma interface moderna para uma plataforma de gerenciamento de TCC, permitindo que alunos e orientadores tenham acesso a funcionalidades importantes do processo acadêmico.

A aplicação busca resolver problemas comuns em processos manuais, como:

- Falta de centralização das informações.
- Dificuldade para encontrar projetos disponíveis.
- Comunicação descentralizada entre alunos e orientadores.
- Pouca organização no acompanhamento de progresso.
- Falta de clareza no envio e gestão de documentos.

---

## 📈 Funcionalidades Principais

- Interface para alunos e orientadores.
- Visualização e gerenciamento de projetos.
- Fluxo de inscrição em projetos acadêmicos.
- Acompanhamento do andamento do TCC.
- Integração com backend via API REST.
- Telas responsivas para uso em diferentes dispositivos.
- Componentes reutilizáveis para manter padronização visual.
- Testes E2E para validar fluxos principais da aplicação.

---

## 🔗 Integração com Backend

Este frontend foi desenvolvido para consumir a API do backend do sistema de TCC.

A URL da API deve ser configurada através do arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8080
