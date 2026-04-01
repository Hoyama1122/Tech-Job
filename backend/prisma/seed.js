import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role, JobStatus, AssignmentRole } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // ลบข้อมูลเก่าตามลำดับ relation
  await prisma.reportImage.deleteMany();
  await prisma.jobReport.deleteMany();
  await prisma.jobImage.deleteMany();
  await prisma.jobAssignment.deleteMany();
  await prisma.job.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log("🧹 Clean old data complete");

  // departments
  const deptIT = await prisma.department.create({
    data: { name: "IT Support" },
  });

  const deptMaint = await prisma.department.create({
    data: { name: "Maintenance" },
  });

  // password hash
  const passHashAdmin = await bcrypt.hash("admin123", 10);
  const passHashSuperAdmin = await bcrypt.hash("superadmin123", 10);
  const passHashSupervisor = await bcrypt.hash("supervisor123", 10);
  const passHashTech1 = await bcrypt.hash("tech123", 10);
  const passHashTech2 = await bcrypt.hash("tech123", 10);

  // users
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@example.com",
      password: passHashSuperAdmin,
      empno: "EMP0001",
      role: Role.SUPERADMIN,
      profile: {
        create: {
          firstname: "Super",
          lastname: "Admin",
          phone: "0800000001",
          gender: "ชาย",
          address: "Bangkok",
        },
      },
    },
    include: { profile: true },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: passHashAdmin,
      empno: "EMP0002",
      role: Role.ADMIN,
      departmentId: deptIT.id,
      profile: {
        create: {
          firstname: "System",
          lastname: "Admin",
          phone: "0800000002",
          gender: "หญิง",
          address: "Samut Prakan",
        },
      },
    },
    include: { profile: true },
  });

  const supervisor = await prisma.user.create({
    data: {
      email: "supervisor@example.com",
      password: passHashSupervisor,
      empno: "EMP0003",
      role: Role.SUPERVISOR,
      departmentId: deptIT.id,
      profile: {
        create: {
          firstname: "Somchai",
          lastname: "Manager",
          phone: "0800000003",
          gender: "ชาย",
          address: "Bangkok",
        },
      },
    },
    include: { profile: true },
  });

  const tech1 = await prisma.user.create({
    data: {
      email: "tech1@example.com",
      password: passHashTech1,
      empno: "EMP0004",
      role: Role.TECHNICIAN,
      departmentId: deptIT.id,
      profile: {
        create: {
          firstname: "Napat",
          lastname: "TechOne",
          phone: "0800000004",
          gender: "ชาย",
          address: "Phra Samut Chedi",
        },
      },
    },
    include: { profile: true },
  });

  const tech2 = await prisma.user.create({
    data: {
      email: "tech2@example.com",
      password: passHashTech2,
      empno: "EMP0005",
      role: Role.TECHNICIAN,
      departmentId: deptMaint.id,
      profile: {
        create: {
          firstname: "Suda",
          lastname: "TechTwo",
          phone: "0800000005",
          gender: "หญิง",
          address: "Samut Prakan",
        },
      },
    },
    include: { profile: true },
  });

  console.log("👤 Users created");

  // jobs
  const job1 = await prisma.job.create({
    data: {
      title: "ซ่อมคอมพิวเตอร์แผนกบัญชี",
      description: "เครื่องเปิดไม่ติด",
      departmentId: deptIT.id,
      createdById: admin.id,
      status: JobStatus.PENDING,
      start_available_at: new Date("2026-04-02T09:00:00.000Z"),
      end_available_at: new Date("2026-04-02T12:00:00.000Z"),
      latitude: 13.5967,
      longitude: 100.5946,
      location_name: "อาคาร A ชั้น 2",
      images: {
        create: [
          {
            url: "https://dummyimage.com/600x400/cccccc/000000&text=job1-image1",
            publicId: "techjob/job1-image1",
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "ตรวจสอบระบบแอร์สำนักงาน",
      description: "แอร์ไม่เย็น",
      departmentId: deptMaint.id,
      createdById: admin.id,
      status: JobStatus.IN_PROGRESS,
      start_available_at: new Date("2026-04-03T01:00:00.000Z"),
      end_available_at: new Date("2026-04-03T05:00:00.000Z"),
      latitude: 13.6012,
      longitude: 100.6015,
      location_name: "อาคาร B ชั้น 1",
      images: {
        create: [
          {
            url: "https://dummyimage.com/600x400/bbbbbb/000000&text=job2-image1",
            publicId: "techjob/job2-image1",
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "ตรวจเช็กเครื่องพิมพ์",
      description: "กระดาษติดบ่อย",
      departmentId: deptIT.id,
      createdById: admin.id,
      status: JobStatus.COMPLETED,
      location_name: "อาคาร C ชั้น 3",
    },
  });

  console.log("🧾 Jobs created");

  // assignments
  await prisma.jobAssignment.createMany({
    data: [
      {
        jobId: job1.id,
        userId: supervisor.id,
        role: AssignmentRole.SUPERVISOR,
      },
      {
        jobId: job1.id,
        userId: tech1.id,
        role: AssignmentRole.TECHNICIAN,
      },
      {
        jobId: job1.id,
        userId: tech2.id,
        role: AssignmentRole.TECHNICIAN,
      },
      {
        jobId: job2.id,
        userId: supervisor.id,
        role: AssignmentRole.SUPERVISOR,
      },
      {
        jobId: job2.id,
        userId: tech2.id,
        role: AssignmentRole.TECHNICIAN,
      },
      {
        jobId: job3.id,
        userId: supervisor.id,
        role: AssignmentRole.SUPERVISOR,
      },
      {
        jobId: job3.id,
        userId: tech1.id,
        role: AssignmentRole.TECHNICIAN,
      },
    ],
  });

  console.log("🧩 Assignments created");

  // reports
  const report1 = await prisma.jobReport.create({
    data: {
      jobId: job3.id,
      status: JobStatus.COMPLETED,
      start_time: new Date("2026-04-01T02:00:00.000Z"),
      end_time: new Date("2026-04-01T03:30:00.000Z"),
      detail: "ตรวจสอบลูกกลิ้งและชุดดึงกระดาษ",
      repair_operations: "ทำความสะอาดภายในและเปลี่ยนลูกยาง",
      inspection_results: "ทดสอบพิมพ์ 20 แผ่น ปกติ",
      summary: "ใช้งานได้ปกติแล้ว",
      cus_sign: "customer-signature.png",
    },
  });

  const report2 = await prisma.jobReport.create({
    data: {
      jobId: job2.id,
      status: JobStatus.REJECTED,
      start_time: new Date("2026-04-02T03:00:00.000Z"),
      end_time: new Date("2026-04-02T04:00:00.000Z"),
      detail: "ตรวจสอบเบื้องต้นแล้วพบว่าต้องเปลี่ยนอะไหล่",
      repair_operations: "ยังไม่สามารถซ่อมได้ในรอบนี้",
      inspection_results: "ต้องรอสั่งอะไหล่",
      summary: "เลื่อนงานเพื่อรออะไหล่",
      rejectReason: "อะไหล่ไม่พร้อม",
    },
  });

  console.log("📝 Reports created");

  // report images
  await prisma.reportImage.createMany({
    data: [
      {
        reportId: report1.id,
        url: "https://dummyimage.com/600x400/aaaaaa/000000&text=report1-image1",
      },
      {
        reportId: report1.id,
        url: "https://dummyimage.com/600x400/999999/000000&text=report1-image2",
      },
      {
        reportId: report2.id,
        url: "https://dummyimage.com/600x400/888888/000000&text=report2-image1",
      },
    ],
  });

  console.log("✅ Seed complete");
  console.log({
    superAdmin: superAdmin.email,
    admin: admin.email,
    supervisor: supervisor.email,
    technician1: tech1.email,
    technician2: tech2.email,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });