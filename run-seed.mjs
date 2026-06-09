// run-seed.mjs  — executes the TypeScript seed script via ts-node
import { execSync } from "child_process";
import { resolve } from "path";

const seedPath = resolve("prisma/seed.ts");

execSync(
  `node --loader ts-node/esm --no-warnings "${seedPath}"`,
  { stdio: "inherit", env: { ...process.env } }
);
