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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const userRouter = express.Router();

/**
 * @swagger
 * /api/users/locations:
 *   get:
 *     summary: Get latest technician locations
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations
 */
userRouter.get(
  "/locations",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR", "EXECUTIVE"),
  getTechnicianLocations
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR", "EXECUTIVE"),
  getUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
userRouter.get(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "EXECUTIVE"),
  getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.post(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.put(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.delete(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN"),
  deleteUser
);

export default userRouter;