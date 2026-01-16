import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const required = process.argv.includes("--required");

const envPath = resolve(process.cwd(), ".env");
const envLocalPath = resolve(process.cwd(), ".env.local");

if (existsSync(envPath)) process.exit(0);

if (existsSync(envLocalPath)) {
  copyFileSync(envLocalPath, envPath);
  process.exit(0);
}

if (required) {
  console.error(
    "Env do Prisma nao encontrado. Crie `apps/web/.env.local` (ou `apps/web/.env`) com `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING`."
  );
  process.exit(1);
}

