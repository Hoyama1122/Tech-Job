import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  // 1. Clean Up
  await prisma.itemUsage.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.jobAssignment.deleteMany({});
  await prisma.reportImage.deleteMany({});
  await prisma.jobReport.deleteMany({});
  await prisma.jobImage.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  const passHashAdmin = await bcrypt.hash("admin123", 10);
  const passHashSuperAdmin = await bcrypt.hash("superadmin", 10);
  const passHashTech1 = await bcrypt.hash("tech123", 10);
  const passHashTech2 = await bcrypt.hash("tech123", 10);
  const passHashSupervisor = await bcrypt.hash("supervisor", 10);
  // 2. Mock Departments
  const deptIT = await prisma.department.create({
    data: { name: "IT Support" },
  });
  const deptMaint = await prisma.department.create({
    data: { name: "Maintenance" },
  });

  // 3. Mock Users & Profiles

  const superadmin = await prisma.user.create({
    data: {
      email: "superadmin@techjob.com",
      password: passHashSuperAdmin,
      role: "SUPERADMIN",
      empno: "SAM001",
    },
  });

  const admin = await prisma.user.create({
    data: {
      empno: "ADM001",
      email: "admin@techjob.com",
      password: passHashAdmin,
      role: "ADMIN",
      profile: {
        create: {
          firstname: "สมหญิง",
          lastname: "ใจสด",
          phone: "0999999999",
          gender: "FEMALE",
          birthday: new Date("2000-01-01"),
          address:
            "122/176 หมุ่2 ถนนสมเด็จ แขวงวังใหม่ เขตวังใหม่ กรุงเทพมหานคร 10120",
        },
      },
      departmentId: deptIT.id,
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      empno: "SUP001",
      email: "supervisor@techjob.com",
      password: passHashSupervisor,
      role: "SUPERVISOR",
      departmentId: deptMaint.id,
      profile: {
        create: { firstname: "มานะ", lastname: "คุมงาน", phone: "0820002222" },
      },
    },
  });

  const tech1 = await prisma.user.create({
    data: {
      empno: "TCH001",
      email: "tech1@techjob.com",
      password: passHashTech1,
      role: "TECHNICIAN",
      departmentId: deptMaint.id,
      profile: {
        create: { firstname: "วิชัย", lastname: "ช่างไฟ", phone: "0830003333" },
      },
    },
  });

  const tech2 = await prisma.user.create({
    data: {
      empno: "TCH002",
      email: "tech2@techjob.com",
      password: passHashTech2,
      role: "TECHNICIAN",
      departmentId: deptMaint.id,
      profile: {
        create: {
          firstname: "สมศักดิ์",
          lastname: "ช่างท่อ",
          phone: "0840004444",
        },
      },
    },
  });

  // 4. Mock Job
  const job = await prisma.job.create({
    data: {
      title: "ซ่อมระบบไฟฟ้าและประปา ห้องประชุมใหญ่",
      description: "ไฟเพดานดับ 3 ดวง และมีน้ำหยดจากฝ้า",
      status: "PENDING",
      departmentId: deptMaint.id,
      createdById: admin.id,
      images: {
        create: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1/jobs/elec1.jpg",
            publicId: "elec1",
          },
        ],
      },
    },
  });

  // 5. Mock Job Assignment (มอบหมายงานให้ช่าง)
  await prisma.jobAssignment.createMany({
    data: [
      {
        jobId: job.id,
        userId: supervisor.id,
        role: "SUPERVISOR", // คนคุม
      },
      {
        jobId: job.id,
        userId: tech1.id,
        role: "TECHNICIAN", // ช่างคนที่ 1
      },
      {
        jobId: job.id,
        userId: tech2.id,
        role: "TECHNICIAN", // ช่างคนที่ 2
      },
    ],
  });

  // 6. Mock Job Report (รายงานการซ่อม)
  await prisma.jobReport.create({
    data: {
      jobId: job.id,
      createdById: tech1.id,
      status: "APPROVED",
      detail: "เปลี่ยนหลอดไฟ LED ใหม่ และซ่อมรอยรั่วของท่อ PVC เรียบร้อย",
      summary: "งานเสร็จสิ้น ระบบกลับมาใช้งานได้ปกติ",
      images: {
        create: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1/reports/success1.jpg",
          },
        ],
      },
    },
  });

  console.log("Mock data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
