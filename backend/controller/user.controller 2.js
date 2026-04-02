// คานนท์ทำเพิ่ม

import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        department: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json({
      message: "ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        department: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    return res.json({
      message: "ดึงข้อมูลผู้ใช้งานสำเร็จ",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน",
      error: error.message,
    });
  }
};

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

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        empno,
        role,
        departmentId: departmentId ? Number(departmentId) : null,
        profile: {
          create: {
            firstname,
            lastname,
            phone: phone ?? "",
            address,
            avatar: avatar ?? "",
            gender,
            birthday: birthday ? new Date(birthday) : null,
          },
        },
      },
      include: {
        profile: true,
        department: true,
      },
    });

    return res.status(201).json({
      message: "สร้างผู้ใช้งานสำเร็จ",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      id,
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

    const userId = Number(id);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email ?? undefined,
        empno: empno ?? undefined,
        role: role ?? undefined,
        departmentId:
          departmentId !== undefined && departmentId !== null
            ? Number(departmentId)
            : undefined,
        password: hashedPassword ?? undefined,
        profile: {
          upsert: {
            update: {
              firstname: firstname ?? undefined,
              lastname: lastname ?? undefined,
              phone: phone ?? undefined,
              address: address ?? undefined,
              avatar: avatar ?? undefined,
              gender: gender ?? undefined,
              birthday: birthday ? new Date(birthday) : undefined,
            },
            create: {
              firstname: firstname ?? "",
              lastname: lastname ?? "",
              phone: phone ?? "",
              address: address ?? "",
              avatar: avatar ?? "",
              gender: gender ?? null,
              birthday: birthday ? new Date(birthday) : null,
            },
          },
        },
      },
      include: {
        profile: true,
        department: true,
      },
    });

    return res.json({
      message: "แก้ไขข้อมูลผู้ใช้งานสำเร็จ",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    if (existingUser.profile) {
      await prisma.profile.delete({
        where: { userId: id },
      });
    }

    await prisma.user.delete({
      where: { id },
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