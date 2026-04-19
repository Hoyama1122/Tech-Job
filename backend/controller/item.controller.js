import { prisma } from "../lib/prisma.js";

export const createItem = async (req, res) => {
  try {
    const { code, name, model, brand, type, quantity, unit, note } = req.body;
    const createdBy = req.user.id;

    const existingItem = await prisma.item.findUnique({
      where: { code },
    });

    if (existingItem) {
      return res.status(400).json({ message: "รหัสอุปกรณ์นี้มีอยู่ในระบบแล้ว" });
    }

    const item = await prisma.item.create({
      data: {
        code,
        name,
        model,
        brand,
        type,
        quantity: Number(quantity),
        unit,
        note,
        createdBy,
      },
    });

    res.status(201).json({ message: "เพิ่มอุปกรณ์สำเร็จ", item });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        creator: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "ไม่พบอุปกรณ์" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, model, brand, type, quantity, unit, note } = req.body;

    // Check if code exists on other items
    if (code) {
      const existing = await prisma.item.findFirst({
        where: { 
          code,
          id: { not: Number(id) }
        }
      });
      if (existing) {
        return res.status(400).json({ message: "รหัสอุปกรณ์นี้ใช้โดยรายการอื่นแล้ว" });
      }
    }

    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        code,
        name,
        model,
        brand,
        type,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        unit,
        note,
      },
    });

    res.json({ message: "แก้ไขอุปกรณ์สำเร็จ", item });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "ลบอุปกรณ์สำเร็จ" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
