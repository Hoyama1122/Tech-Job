import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";
async function main() {
  const passHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      empno: "10002",
      email: "admin@techjob.com",
      password: passHash,
      role: "ADMIN",
      profile: {
        create: {
          firstname: "สมหญิง",
          lastname: "ใจสด",
          phone: "0999999999",
          gender: "FEMALE",
          birthday: new Date("2000-01-01") ,
          address:
            "122/176 หมุ่2 ถนนสมเด็จ แขวงวังใหม่ เขตวังใหม่ กรุงเทพมหานคร 10120",
        },
      },
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
