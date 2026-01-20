import { spawnSync } from "node:child_process";

const hasDbEnv =
  Boolean(process.env.POSTGRES_PRISMA_URL) && Boolean(process.env.POSTGRES_URL_NON_POOLING);

if (!hasDbEnv) {
  console.log("Skipping `prisma db push` (Postgres envs missing).");
  process.exit(0);
}

const prismaBin =
  process.platform === "win32" ? "node_modules\\.bin\\prisma.cmd" : "node_modules/.bin/prisma";

const result = spawnSync(prismaBin, ["db", "push", "--skip-generate"], { stdio: "inherit" });
process.exit(result.status ?? 1);

