import express from "express";
import { verifyToken, authCheck, allowRoles } from "../lib/middleware.js";
import { createUser, deleteUser, getTechnicianLocations, getUserById, getUsers, updateUser } from "../controller/user.controller 2.js";

const userRouter = express.Router();

userRouter.get(
  "/locations",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR"),
  getTechnicianLocations
);

userRouter.get(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR"),
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