
# Front-end (React + Vite)

Aplicacao web do projeto (interface do usuario).

## Requisitos

- Node.js 18 ou 20

## Rodar localmente

```powershell
cd Front-end-tcc
npm install
npm run dev
```

### Configurar URL da API

Crie `Front-end-tcc/.env.local`:

```env
VITE_API_URL=http://localhost:8080
```

## Testes E2E (Playwright)

```powershell
cd Front-end-tcc
npm run test:e2e
```

Obs.: os E2E atuais usam **mock das rotas `"/api/**"`** no browser (nao precisam do back-end rodando).

Se faltar o Chromium do Playwright:

```powershell
cd Front-end-tcc
npx playwright install chromium
```

## Mais detalhes

Veja o README da raiz: `README.md`.
