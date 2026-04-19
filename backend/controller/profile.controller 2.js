import { prisma } from "../lib/prisma.js";

// helper: แปลง row จาก raw SQL ให้เป็น object ที่ frontend ใช้ง่าย
const mapProfileRow = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    empno: user.empno,
    role: user.role,
    departmentId: user.departmentId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    department: user.department_id
      ? {
          id: user.department_id,
          name: user.department_name,
        }
      : null,
    profile: user.profile_id
      ? {
          id: user.profile_id,
          userId: user.profile_userId,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          gender: user.gender,
          birthday: user.birthday,
        }
      : null,
  };
};

// =====================================
// SELECT: ดึงข้อมูลโปรไฟล์ของตัวเอง
// =====================================
export const getMyProfile = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const users = await prisma.$queryRaw`
      SELECT
        u.id,
        u.email,
        u.empno,
        u.role,
        u."departmentId",
        u."createdAt",
        u."updatedAt",

        p.id AS profile_id,
        p."userId" AS profile_userId,
        p.firstname,
        p.lastname,
        p.phone,
        p.address,
        p.avatar,
        p.gender,
        p.birthday,

        d.id AS department_id,
        d.name AS department_name
      FROM "User" u
      LEFT JOIN "Profile" p ON p."userId" = u.id
      LEFT JOIN "Department" d ON d.id = u."departmentId"
      WHERE u.id = ${userId}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    return res.json({
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      data: mapProfileRow(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE / UPSERT: แก้ไขโปรไฟล์ตัวเอง
// แก้ได้เฉพาะ phone, address, avatar
// =====================================
export const updateMyProfile = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { phone, address, avatar } = req.body;

    const existingUsers = await prisma.$queryRaw`
      SELECT
        u.id,
        p.id AS profile_id
      FROM "User" u
      LEFT JOIN "Profile" p ON p."userId" = u.id
      WHERE u.id = ${userId}
      LIMIT 1
    `;

    const existingUser = existingUsers[0];

    if (!existingUser) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const profileExists = await tx.$queryRaw`
        SELECT id
        FROM "Profile"
        WHERE "userId" = ${userId}
        LIMIT 1
      `;

      if (profileExists.length > 0) {
        await tx.$executeRaw`
          UPDATE "Profile"
          SET
            phone = COALESCE(${phone ?? null}, phone),
            address = COALESCE(${address ?? null}, address),
            avatar = COALESCE(${avatar ?? null}, avatar)
          WHERE "userId" = ${userId}
        `;
      } else {
        await tx.$executeRaw`
          INSERT INTO "Profile" (
            "userId",
            phone,
            address,
            avatar
          )
          VALUES (
            ${userId},
            ${phone ?? ""},
            ${address ?? ""},
            ${avatar ?? ""}
          )
        `;
      }

      const profiles = await tx.$queryRaw`
        SELECT
          u.id,
          u.email,
          u.empno,
          u.role,
          u."departmentId",
          u."createdAt",
          u."updatedAt",

          p.id AS profile_id,
          p."userId" AS profile_userId,
          p.firstname,
          p.lastname,
          p.phone,
          p.address,
          p.avatar,
          p.gender,
          p.birthday,

          d.id AS department_id,
          d.name AS department_name
        FROM "User" u
        LEFT JOIN "Profile" p ON p."userId" = u.id
        LEFT JOIN "Department" d ON d.id = u."departmentId"
        WHERE u.id = ${userId}
        LIMIT 1
      `;

      return profiles[0];
    });

    return res.json({
      message: "แก้ไขโปรไฟล์สำเร็จ",
      data: mapProfileRow(result),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์",
      error: error.message,
    });
  }
};