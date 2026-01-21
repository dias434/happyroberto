import { spawnSync } from "node:child_process";

const prismaUrl =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  null;

if (!prismaUrl) {
  console.log("Skipping `prisma db push` (Postgres envs missing).");
  process.exit(0);
}

const prismaBin =
  process.platform === "win32" ? "node_modules\\.bin\\prisma.cmd" : "node_modules/.bin/prisma";

const env = {
  ...process.env,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ?? prismaUrl,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ?? prismaUrl
};

const result = spawnSync(prismaBin, ["db", "push", "--skip-generate"], { stdio: "inherit", env });
process.exit(result.status ?? 1);
