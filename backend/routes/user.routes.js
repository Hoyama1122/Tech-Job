// คานนท์ทำเพิ่ม

import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authCheck, allowRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authCheck, allowRoles("SUPERADMIN", "ADMIN"), getUsers);
router.get("/:id", authCheck, allowRoles("SUPERADMIN", "ADMIN"), getUserById);
router.post("/", authCheck, allowRoles("SUPERADMIN", "ADMIN"), createUser);
router.put("/", authCheck, allowRoles("SUPERADMIN", "ADMIN"), updateUser);
router.delete("/:id", authCheck, allowRoles("SUPERADMIN", "ADMIN"), deleteUser);

export default router;