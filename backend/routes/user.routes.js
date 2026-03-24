import express from "express";
import { verifyToken, authCheck, allowRoles } from "../lib/middleware.js";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  getUsers
);

userRouter.get(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  getUserById
);

userRouter.post(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  createUser
);

userRouter.put(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  updateUser
);

userRouter.delete(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  deleteUser
);

export default userRouter;