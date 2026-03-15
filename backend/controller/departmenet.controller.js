import { prisma } from "../lib/prisma.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const existingDepartment = await prisma.department.findUnique({
      where: {
        name,
      },
    });
    if (existingDepartment) {
      return res.status(400).json({ message: "มีแผนกนี้แล้ว" });
    }
    const department = await prisma.department.create({
      data: {
        name,
      },
    });
    res.json({ message: "แผนกถูกสร้างเรียบร้อย", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
