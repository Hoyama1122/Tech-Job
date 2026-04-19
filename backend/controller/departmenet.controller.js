import { prisma } from "../lib/prisma.js";

export const getDepartments = async (req, res) => {
  try {
    const departments =
      await prisma.$queryRaw`
        SELECT d.*, (SELECT COUNT(*)::int FROM "User" u WHERE u."departmentId" = d.id) as "totalUsers"
        FROM "Department" d 
        ORDER BY d.id ASC
      `;
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const departments =
      await prisma.$queryRaw`
        SELECT d.*, (SELECT COUNT(*)::int FROM "User" u WHERE u."departmentId" = d.id) as "totalUsers"
        FROM "Department" d 
        WHERE d.id = ${Number(id)} 
        LIMIT 1
      `;
    const department = departments[0];

    if (!department) {
      return res.status(404).json({ message: "ไม่พบแผนก" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: "กรุณากรอกชื่อแผนก" });
    }

    const existingDepartments =
      await prisma.$queryRaw`SELECT * FROM "Department" WHERE name = ${trimmedName} LIMIT 1`;
    if (existingDepartments.length > 0) {
      return res.status(400).json({ message: "มีแผนกนี้แล้ว" });
    }

    const createdDepartments =
      await prisma.$queryRaw`INSERT INTO "Department" (name) VALUES (${trimmedName}) RETURNING *`;
    const department = createdDepartments[0];

    res.json({ message: "แผนกถูกสร้างเรียบร้อย", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const trimmedName = name?.trim();
    const deptId = Number(id);

    if (!trimmedName) {
      return res.status(400).json({ message: "กรุณากรอกชื่อแผนก" });
    }

    const departments =
      await prisma.$queryRaw`SELECT * FROM "Department" WHERE id = ${deptId} LIMIT 1`;
    if (departments.length === 0) {
      return res.status(404).json({ message: "ไม่พบแผนก" });
    }

    const conflictDepartments =
      await prisma.$queryRaw`SELECT * FROM "Department" WHERE name = ${trimmedName} AND id != ${deptId} LIMIT 1`;
    if (conflictDepartments.length > 0) {
      return res.status(400).json({ message: "ชื่อแผนกนี้ถูกใช้แล้ว" });
    }

    const updatedDepartments =
      await prisma.$queryRaw`UPDATE "Department" SET name = ${trimmedName} WHERE id = ${deptId} RETURNING *`;
    const updatedDepartment = updatedDepartments[0];

    res.json({
      message: "อัปเดตแผนกเรียบร้อย",
      department: updatedDepartment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deptId = Number(id);

    const departments =
      await prisma.$queryRaw`SELECT * FROM "Department" WHERE id = ${deptId} LIMIT 1`;
    if (departments.length === 0) {
      return res.status(404).json({ message: "ไม่พบแผนก" });
    }

    // Check if department has users
    const userCounts =
      await prisma.$queryRaw`SELECT count(*) as count FROM "User" WHERE "departmentId" = ${deptId}`;
    const userCount = Number(userCounts[0].count);

    if (userCount > 0) {
      return res.status(400).json({
        message: "ไม่สามารถลบแผนกได้ เพราะยังมีผู้ใช้งานอยู่ในแผนกนี้",
      });
    }

    await prisma.$executeRaw`DELETE FROM "Department" WHERE id = ${deptId}`;

    res.json({ message: "ลบแผนกเรียบร้อย" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
