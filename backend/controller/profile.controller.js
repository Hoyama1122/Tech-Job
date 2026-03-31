// คานนท์ทำเพิ่ม

import { prisma } from "../lib/prisma.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        empno: true,
        email: true,
        role: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          select: {
            id: true,
            userId: true,
            firstname: true,
            lastname: true,
            phone: true,
            avatar: true,
            gender: true,
            birthday: true,
            address: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    return res.json({
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, address, avatar, firstname, lastname, gender, birthday } =
      req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        phone: phone ?? undefined,
        address: address ?? undefined,
        avatar: avatar ?? undefined,
        firstname: firstname ?? undefined,
        lastname: lastname ?? undefined,
        gender: gender ?? undefined,
        birthday: birthday ? new Date(birthday) : undefined,
      },
      create: {
        userId,
        phone: phone ?? "",
        address: address ?? "",
        avatar: avatar ?? "",
        firstname: firstname ?? "",
        lastname: lastname ?? "",
        gender: gender ?? null,
        birthday: birthday ? new Date(birthday) : null,
      },
    });

    return res.json({
      message: "แก้ไขโปรไฟล์สำเร็จ",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์",
      error: error.message,
    });
  }
};
