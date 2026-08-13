import { existsSync, copyFileSync } from "node:fs";

if (existsSync(".env")) {
  console.log(".env already exists, skipping.");
} else {
  copyFileSync(".env.example", ".env");
  console.log(
    "Created .env from .env.example — remember to fill in real values.",
  );
}
