import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";
async function main() {
  const passHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      firstname: "สมหญิง",
      lastname: "รวยมาก",
      email: "admin@techjob.com",
      password: passHash,
      role: "ADMIN",
    },
  });
  console.log("ADMIN created");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });