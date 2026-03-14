import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      message: "เข้าสู่ระบบ",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
