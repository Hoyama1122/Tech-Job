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
      sameSite: "lax",
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
