import { prisma } from "../lib/prisma.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: {
        id: Number(id),
      },
    });

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

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "กรุณากรอกชื่อแผนก" });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: {
        name: name.trim(),
      },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "มีแผนกนี้แล้ว" });
    }

    const department = await prisma.department.create({
      data: {
        name: name.trim(),
      },
    });

    res.json({ message: "แผนกถูกสร้างเรียบร้อย", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "กรุณากรอกชื่อแผนก" });
    }

    const department = await prisma.department.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!department) {
      return res.status(404).json({ message: "ไม่พบแผนก" });
    }

    const existingDepartment = await prisma.department.findFirst({
      where: {
        name: name.trim(),
        NOT: {
          id: Number(id),
        },
      },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "ชื่อแผนกนี้ถูกใช้แล้ว" });
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name.trim(),
      },
    });

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

    const department = await prisma.department.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
      },
    });

    if (!department) {
      return res.status(404).json({ message: "ไม่พบแผนก" });
    }

    if (department.users.length > 0) {
      return res.status(400).json({
        message: "ไม่สามารถลบแผนกได้ เพราะยังมีผู้ใช้งานอยู่ในแผนกนี้",
      });
    }

    await prisma.department.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "ลบแผนกเรียบร้อย" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentSQL = async (req, res) => {
  const department = await prisma.$queryRaw`SELECT * FROM "Department"`;
  return res.json({ message: "แผนกถูกดึงเรียบร้อย", department });
};
export const createDepartmentSQL = async (req, res) => {
  try {
    const { name } = req.body;
    const department =
      await prisma.$queryRaw`INSERT INTO "Department" (name) VALUES (${name})`;
    res.json({ message: "แผนกถูกสร้างเรียบร้อย", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
