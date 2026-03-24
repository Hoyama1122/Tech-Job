// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // เพิ่มบรรทัดนี้เข้าไปให้แล้วครับ
    seed: 'node ./prisma/seed.js' 
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});