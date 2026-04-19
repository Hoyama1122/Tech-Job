import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

const mapUserRow = (user) => {
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
// SELECT: ดึงข้อมูลผู้ใช้งานทั้งหมด
// =====================================
export const getUsers = async (req, res) => {
  try {
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
      ORDER BY u.id DESC
    `;

    return res.json({
      message: "ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ",
      data: users.map(mapUserRow),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน",
      error: error.message,
    });
  }
};

// =====================================
// SELECT: ดึงข้อมูลผู้ใช้งานตาม id
// =====================================
export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

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
      WHERE u.id = ${id}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    return res.json({
      message: "ดึงข้อมูลผู้ใช้งานสำเร็จ",
      data: mapUserRow(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน",
      error: error.message,
    });
  }
};

// =====================================
// INSERT: สร้างผู้ใช้งาน
// SUPERADMIN เท่านั้น
// ต้องกรอกครบตาม requirement
// =====================================
export const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      empno,
      address,
      birthday,
      firstname,
      lastname,
      gender,
      departmentId,
      role,
      phone,
      avatar,
    } = req.body;

    if (
      !empno ||
      !email ||
      !password ||
      !role ||
      !firstname ||
      !lastname ||
      !phone ||
      !departmentId ||
      !gender ||
      !birthday ||
      !address
    ) {
      return res.status(400).json({
        message:
          "กรุณากรอกข้อมูลให้ครบ: รหัสพนักงาน, อีเมล, รหัสผ่าน, สิทธิ์ผู้ใช้งาน, ชื่อ, นามสกุล, เบอร์โทร, แผนก, เพศ, วันเกิด, ที่อยู่",
      });
    }

    const existingEmail = await prisma.$queryRaw`
      SELECT id, email
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existingEmail.length > 0) {
      return res.status(400).json({
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    const existingEmpno = await prisma.$queryRaw`
      SELECT id, empno
      FROM "User"
      WHERE empno = ${empno}
      LIMIT 1
    `;

    if (existingEmpno.length > 0) {
      return res.status(400).json({
        message: "รหัสพนักงานนี้ถูกใช้งานแล้ว",
      });
    }

    const departmentExists = await prisma.$queryRaw`
      SELECT id
      FROM "Department"
      WHERE id = ${Number(departmentId)}
      LIMIT 1
    `;

    if (departmentExists.length === 0) {
      return res.status(400).json({
        message: "ไม่พบแผนกที่เลือก",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "User" (
          email,
          password,
          empno,
          role,
          "departmentId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${email},
          ${hashedPassword},
          ${empno},
          ${role},
          ${Number(departmentId)},
          NOW(),
          NOW()
        )
      `;

      const insertedUsers = await tx.$queryRaw`
        SELECT id
        FROM "User"
        WHERE email = ${email}
        ORDER BY id DESC
        LIMIT 1
      `;

      const userId = insertedUsers[0]?.id;

      await tx.$executeRaw`
        INSERT INTO "Profile" (
          "userId",
          firstname,
          lastname,
          phone,
          address,
          avatar,
          gender,
          birthday
        )
        VALUES (
          ${userId},
          ${firstname},
          ${lastname},
          ${phone},
          ${address},
          ${avatar ?? ""},
          ${gender},
          ${new Date(birthday)}
        )
      `;

      const createdUser = await tx.$queryRaw`
        SELECT 
          u.id,
          u.email,
          u.empno,
          u.role,
          u."departmentId",
          u."createdAt",
          u."updatedAt",

          p.id AS profile_id,
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

      return createdUser[0];
    });

    return res.status(201).json({
      message: "สร้างผู้ใช้งานสำเร็จ",
      data: mapUserRow(result),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE: แก้ไขผู้ใช้งาน
// SUPERADMIN เท่านั้น
// =====================================
export const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const {
      email,
      password,
      empno,
      address,
      birthday,
      firstname,
      lastname,
      gender,
      departmentId,
      role,
      phone,
      avatar,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "กรุณาระบุ id ของผู้ใช้งาน",
      });
    }

    const existingUser = await prisma.$queryRaw`
      SELECT 
        u.id,
        p.id AS profile_id
      FROM "User" u
      LEFT JOIN "Profile" p ON p."userId" = u.id
      WHERE u.id = ${userId}
      LIMIT 1
    `;

    if (existingUser.length === 0) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    if (email) {
      const sameEmailUser = await prisma.$queryRaw`
        SELECT id
        FROM "User"
        WHERE email = ${email}
          AND id <> ${userId}
        LIMIT 1
      `;

      if (sameEmailUser.length > 0) {
        return res.status(400).json({
          message: "อีเมลนี้ถูกใช้งานแล้ว",
        });
      }
    }

    if (empno) {
      const sameEmpnoUser = await prisma.$queryRaw`
        SELECT id
        FROM "User"
        WHERE empno = ${empno}
          AND id <> ${userId}
        LIMIT 1
      `;

      if (sameEmpnoUser.length > 0) {
        return res.status(400).json({
          message: "รหัสพนักงานนี้ถูกใช้งานแล้ว",
        });
      }
    }

    if (departmentId !== undefined && departmentId !== null) {
      const departmentExists = await prisma.$queryRaw`
        SELECT id
        FROM "Department"
        WHERE id = ${Number(departmentId)}
        LIMIT 1
      `;

      if (departmentExists.length === 0) {
        return res.status(400).json({
          message: "ไม่พบแผนกที่เลือก",
        });
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        UPDATE "User"
        SET
          email = COALESCE(${email ?? null}, email),
          empno = COALESCE(${empno ?? null}, empno),
          role = COALESCE(${role ?? null}, role),
          "departmentId" = COALESCE(
            ${departmentId !== undefined && departmentId !== null ? Number(departmentId) : null},
            "departmentId"
          ),
          password = COALESCE(${hashedPassword ?? null}, password),
          "updatedAt" = NOW()
        WHERE id = ${userId}
      `;

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
            firstname = COALESCE(${firstname ?? null}, firstname),
            lastname = COALESCE(${lastname ?? null}, lastname),
            phone = COALESCE(${phone ?? null}, phone),
            address = COALESCE(${address ?? null}, address),
            avatar = COALESCE(${avatar ?? null}, avatar),
            gender = COALESCE(${gender ?? null}, gender),
            birthday = COALESCE(${birthday ? new Date(birthday) : null}, birthday)
          WHERE "userId" = ${userId}
        `;
      } else {
        await tx.$executeRaw`
          INSERT INTO "Profile" (
            "userId",
            firstname,
            lastname,
            phone,
            address,
            avatar,
            gender,
            birthday
          )
          VALUES (
            ${userId},
            ${firstname ?? ""},
            ${lastname ?? ""},
            ${phone ?? ""},
            ${address ?? ""},
            ${avatar ?? ""},
            ${gender ?? null},
            ${birthday ? new Date(birthday) : null}
          )
        `;
      }

      const updatedUser = await tx.$queryRaw`
        SELECT 
          u.id,
          u.email,
          u.empno,
          u.role,
          u."departmentId",
          u."createdAt",
          u."updatedAt",

          p.id AS profile_id,
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

      return updatedUser[0];
    });

    return res.json({
      message: "แก้ไขข้อมูลผู้ใช้งานสำเร็จ",
      data: mapUserRow(result),
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน",
      error: error.message,
    });
  }
};

// =====================================
// DELETE: ลบผู้ใช้งาน
// SUPERADMIN เท่านั้น
// =====================================
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingUser = await prisma.$queryRaw`
      SELECT 
        u.id,
        p.id AS profile_id
      FROM "User" u
      LEFT JOIN "Profile" p ON p."userId" = u.id
      WHERE u.id = ${id}
      LIMIT 1
    `;

    if (existingUser.length === 0) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        DELETE FROM "Profile"
        WHERE "userId" = ${id}
      `;

      await tx.$executeRaw`
        DELETE FROM "User"
        WHERE id = ${id}
      `;
    });

    return res.json({
      message: "ลบผู้ใช้งานสำเร็จ",
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน",
      error: error.message,
    });
  }
};

// =====================================
// SELECT ดึงตำแหน่งช่างล่าสุด
// =====================================
export const getTechnicianLocations = async (req, res) => {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
      },
      include: {
        profile: {
          select: {
            firstname: true,
            lastname: true,
            phone: true,
            avatar: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        location: true,
      },
    });

    const formattedData = technicians.map((tech) => ({
      userId: tech.id,
      empno: tech.empno,
      email: tech.email,
      name:
        `${tech.profile?.firstname || ""} ${tech.profile?.lastname || ""}`.trim() ||
        tech.email,
      phone: tech.profile?.phone || "",
      avatar: tech.profile?.avatar || "",
      latitude: tech.location?.latitude || null,
      longitude: tech.location?.longitude || null,
      accuracy: tech.location?.accuracy || null,
      updatedAt: tech.location?.updatedAt || tech.updatedAt,
      role: tech.role,
      departmentId: tech.departmentId,
      departmentName: tech.department?.name || "ไม่ระบุ",
      hasLocation: !!tech.location,
    }));

    return res.json({
      message: "ดึงรายชื่อช่างและตำแหน่งสำเร็จ",
      data: formattedData,
    });
  } catch (error) {
    console.error("getTechnicianLocations error:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลช่าง",
      error: error.message,
    });
  }
};