import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "ไม่ได้เข้าสู่ระบบ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("verify token error:", error.message);
    return res.status(401).json({ message: "ไม่ได้เข้าสู่ระบบ" });
  }
};

export const authCheck = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "ไม่ได้เข้าสู่ระบบ" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: {
        id: true,
        empno: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
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
      return res.status(401).json({ message: "ไม่พบผู้ใช้" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authCheck error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง" });
    }

    next();
  };
};