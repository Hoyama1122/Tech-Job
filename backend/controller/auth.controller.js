import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "ไม่พบผู้ใช้" });
    }
    const PasswordMatch = await bcrypt.compare(password, user.password);
    if (!PasswordMatch) {
      return res
        .status(400)
        .json({ message: "รหัสผิดพลาด โปรดลองใหม่อีกครั้ง" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("role", user.role, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "เข้าสู่ระบบ",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("role");
    res.json({ message: "ออกจากระบบ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// me
export const me = async (req, res) => {
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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
