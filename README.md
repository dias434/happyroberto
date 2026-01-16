# Happy Roberto (RSVP)

Site de confirmacao de presenca (RSVP) para o aniversario do Roberto, feito com Next.js + Tailwind e API no proprio Next (route handlers) usando Prisma + Postgres.

## Requisitos

- Node.js 18+
- Postgres (Vercel Postgres/Neon, ou local via Docker)

## Configuracao

1) Crie o env do app web:

cp apps/web/.env.local.example apps/web/.env.local
Obs: o Prisma CLI carrega automaticamente variaveis de `apps/web/.env` (nao de `.env.local`). Se voce estiver usando `.env.local`, duplique para `.env` antes de rodar comandos do Prisma:

cp apps/web/.env.local apps/web/.env

2) Banco de dados (escolha uma opcao):

- Vercel Postgres (Neon): crie/conecte um banco Postgres no projeto Vercel. Em producao, a integracao cria as envs automaticamente.
  - Para puxar as envs para rodar local:
    - (1x) `npx vercel link`
    - `npx vercel env pull apps/web/.env.local`
  - Alternativa: copie do painel do Postgres as envs `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` para `apps/web/.env.local`.
- Local (opcional, via Docker):

docker compose up -d

3) Instale dependencias:

npm run install:all

4) Prisma (gerar client e migrar):

npm run db:generate
npm run db:migrate

Para aplicar migracoes em producao (ex: Vercel), use:

npm run db:deploy

## Rodar

- Web + API (Next): npm run dev:web

## Foto

Coloque Roberto.jpeg em apps/web/public/Roberto.jpeg (ou defina NEXT_PUBLIC_PHOTO_URL em apps/web/.env.local).
