import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const passHash = await bcrypt.hash("123456", 10);
  
  // Ensure department exists
  let dept = await prisma.department.findFirst();
  if (!dept) {
    dept = await prisma.department.create({
      data: { name: "ประปา" }
    });
  }
  const departmentId = dept.id;


  await prisma.user.create({
    data: {
      empno: "10002",
      email: "admin@techjob.com",
      password: passHash,
      role: "ADMIN",
      departmentId: departmentId,
      profile: {
        create: {
          firstname: "สมหญิง",
          lastname: "ใจสด",
          phone: "0999999999",
          gender: "FEMALE",
          birthday: new Date("2000-01-01"),
          address:
            "122/176 หมู่ 2 ถนนสมเด็จ แขวงวังใหม่ เขตวังใหม่ กรุงเทพมหานคร 10120",
        },
      },
    },
  });


  await prisma.user.create({
    data: {
      empno: "10003",
      email: "supervisor@techjob.com",
      password: passHash,
      role: "SUPERVISOR",
      departmentId: departmentId,
      profile: {
        create: {
          firstname: "สมชาย",
          lastname: "ควบคุมงาน",
          phone: "0888888888",
          gender: "MALE",
          birthday: new Date("1995-05-10"),
          address:
            "88/9 ถนนพระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพมหานคร 10150",
        },
      },
    },
  });

  // TECHNICIAN 1
  await prisma.user.create({
    data: {
      empno: "10004",
      email: "tech1@techjob.com",
      password: passHash,
      role: "TECHNICIAN",
      departmentId: departmentId,
      profile: {
        create: {
          firstname: "วิชัย",
          lastname: "ซ่อมไว",
          phone: "0877777777",
          gender: "MALE",
          birthday: new Date("1998-03-15"),
          address:
            "45/12 ถนนสุขุมวิท แขวงบางนา เขตบางนา กรุงเทพมหานคร 10260",
        },
      },
    },
  });

  // TECHNICIAN 2
  await prisma.user.create({
    data: {
      empno: "10005",
      email: "tech2@techjob.com",
      password: passHash,
      role: "TECHNICIAN",
      departmentId: departmentId,
      profile: {
        create: {
          firstname: "อนงค์",
          lastname: "ช่างดี",
          phone: "0866666666",
          gender: "FEMALE",
          birthday: new Date("1999-07-20"),
          address:
            "99/1 ถนนลาดพร้าว แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900",
        },
      },
    },
  });
  await prisma.user.create({
    data: {
      empno: "10006",
      email: "tech3@techjob.com",
      password: passHash,
      role: "TECHNICIAN",
      departmentId: departmentId,
      profile: {
        create: {
          firstname: "อนงค์",
          lastname: "ช่างดี",
          phone: "0866666666",
          gender: "FEMALE",
          birthday: new Date("1999-07-20"),
          address:
            "99/1 ถนนลาดพร้าว แขวงจันทรเกษม เขตจตุจักร กรุงเทพมหานคร 10900",
        },
      },
    },
  });

  console.log("Seed users created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });