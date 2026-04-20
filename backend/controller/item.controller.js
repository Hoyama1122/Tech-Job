import { prisma } from "../lib/prisma.js";

export const createItem = async (req, res) => {
  try {
    const itemsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdBy = req.user.id;

    if (itemsData.length === 0) {
      return res.status(400).json({ message: "กรุณาระบุข้อมูลอุปกรณ์" });
    }

   
    for (const data of itemsData) {
      if (!data.code || !data.name) {
        return res.status(400).json({ message: "กรุณาระบุรหัสและชื่ออุปกรณ์ให้ครบทุกรายการ" });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdItems = [];
      
      for (const data of itemsData) {
        const { code, name, model, brand, type, quantity, unit, note } = data;

        const existingItem = await tx.item.findUnique({
          where: { code },
        });

        if (existingItem) {
          throw new Error(`รหัสอุปกรณ์ "${code}" มีอยู่ในระบบแล้ว`);
        }

        const newItem = await tx.item.create({
          data: {
            code,
            name,
            model,
            brand,
            type,
            quantity: Number(quantity) || 0,
            unit,
            note,
            createdBy,
          },
        });
        createdItems.push(newItem);
      }
      return createdItems;
    });

    res.status(201).json({ 
      message: itemsData.length > 1 ? `เพิ่มอุปกรณ์ ${itemsData.length} รายการสำเร็จ` : "เพิ่มอุปกรณ์สำเร็จ", 
      items: result 
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(400).json({ error: error.message || "Internal server error" });
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
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: "รหัส ID อุปกรณ์ไม่ถูกต้อง" });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
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
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: "รหัส ID อุปกรณ์ไม่ถูกต้อง" });
    }

    const { code, name, model, brand, type, quantity, unit, note } = req.body;

    // Check if code exists on other items
    if (code) {
      const existing = await prisma.item.findFirst({
        where: {
          code,
          id: { not: itemId }
        }
      });
      if (existing) {
        return res.status(400).json({ message: "รหัสอุปกรณ์นี้ใช้โดยรายการอื่นแล้ว" });
      }
    }

    const item = await prisma.item.update({
      where: { id: itemId },
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
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: "รหัส ID อุปกรณ์ไม่ถูกต้อง" });
    }

    await prisma.item.delete({
      where: { id: itemId },
    });
    res.json({ message: "ลบอุปกรณ์สำเร็จ" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
