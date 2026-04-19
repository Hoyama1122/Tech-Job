import express from "express";
import {
  verifyToken,
  authCheck,
  allowRoles,
} from "../lib/middleware.js";

import {
  createUser,
  deleteUser,
  getTechnicianLocations,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user.controller 2.js";

const userRouter = express.Router();

/**
 * ดูตำแหน่งช่างล่าสุด
 * SUPERADMIN / ADMIN / SUPERVISOR
 */
userRouter.get(
  "/locations",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR", "EXECUTIVE"),
  getTechnicianLocations
);

/**
 * ดูผู้ใช้ทั้งหมด
 * SUPERADMIN / ADMIN / SUPERVISOR / EXECUTIVE
 */
userRouter.get(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR", "EXECUTIVE"),
  getUsers
);

/**
 * ดูผู้ใช้ตาม id
 * SUPERADMIN / ADMIN / EXECUTIVE
 */
userRouter.get(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "EXECUTIVE"),
  getUserById
);

/**
 * สร้างผู้ใช้ใหม่
 * SUPERADMIN เท่านั้น
 */
userRouter.post(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  createUser
);

/**
 * แก้ไขผู้ใช้ตาม id
 * SUPERADMIN เท่านั้น
 */
userRouter.put(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  updateUser
);

/**
 * ลบผู้ใช้ตาม id
 * SUPERADMIN เท่านั้น
 */
userRouter.delete(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  deleteUser
);

export default userRouter;