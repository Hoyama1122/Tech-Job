import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";
async function main() {
  const passHash = await bcrypt.hash("superadmin", 10);

  await prisma.user.create({
    data: {
      email: "superadmin@techjob.com",
      password: passHash,
      role: "SUPERADMIN",
      empno: "AD001",
    },
  });
  console.log("Superadmin created");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
