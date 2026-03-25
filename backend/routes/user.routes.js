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

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: ดึงรายการผู้ใช้งานทั้งหมด
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       empno:
 *                         type: string
 *                         example: EMP001
 *                       email:
 *                         type: string
 *                         example: admin@example.com
 *                       role:
 *                         type: string
 *                         example: ADMIN
 *                       departmentId:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       department:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: IT
 *                       profile:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           userId:
 *                             type: integer
 *                             example: 1
 *                           firstname:
 *                             type: string
 *                             example: สมชาย
 *                           lastname:
 *                             type: string
 *                             example: ใจดี
 *                           phone:
 *                             type: string
 *                             example: 0812345678
 *                           address:
 *                             type: string
 *                             example: Bangkok
 *                           avatar:
 *                             type: string
 *                             example: https://example.com/avatar.jpg
 *                           gender:
 *                             type: string
 *                             nullable: true
 *                             example: male
 *                           birthday:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: 2000-01-01T00:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
userRouter.get(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN", "SUPERVISOR"),
  getUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้งานตาม id
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสผู้ใช้งาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงข้อมูลผู้ใช้งานสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ดึงข้อมูลผู้ใช้งานสำเร็จ
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     empno:
 *                       type: string
 *                       example: EMP001
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *                     departmentId:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     department:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: IT
 *                     profile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         firstname:
 *                           type: string
 *                           example: สมชาย
 *                         lastname:
 *                           type: string
 *                           example: ใจดี
 *                         phone:
 *                           type: string
 *                           example: 0812345678
 *                         address:
 *                           type: string
 *                           example: Bangkok
 *                         avatar:
 *                           type: string
 *                           example: https://example.com/avatar.jpg
 *                         gender:
 *                           type: string
 *                           nullable: true
 *                           example: male
 *                         birthday:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: 2000-01-01T00:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Server error
 */
userRouter.get(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: สร้างผู้ใช้งานใหม่
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - empno
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tech01@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               empno:
 *                 type: string
 *                 example: EMP001
 *               firstname:
 *                 type: string
 *                 example: สมชาย
 *               lastname:
 *                 type: string
 *                 example: ใจดี
 *               phone:
 *                 type: string
 *                 example: 0812345678
 *               address:
 *                 type: string
 *                 example: Bangkok
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               gender:
 *                 type: string
 *                 nullable: true
 *                 example: male
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2000-01-01T00:00:00.000Z
 *               departmentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               role:
 *                 type: string
 *                 example: TECHNICIAN
 *     responses:
 *       201:
 *         description: สร้างผู้ใช้งานสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: สร้างผู้ใช้งานสำเร็จ
 *                 data:
 *                   type: object
 *       400:
 *         description: อีเมลนี้ถูกใช้งานแล้ว หรือข้อมูลไม่ถูกต้อง
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
userRouter.post(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  createUser
);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: แก้ไขข้อมูลผู้ใช้งาน
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tech01@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *               empno:
 *                 type: string
 *                 example: EMP001
 *               firstname:
 *                 type: string
 *                 example: สมชาย
 *               lastname:
 *                 type: string
 *                 example: ใจดี
 *               phone:
 *                 type: string
 *                 example: 0812345678
 *               address:
 *                 type: string
 *                 example: Bangkok
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               gender:
 *                 type: string
 *                 nullable: true
 *                 example: male
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2000-01-01T00:00:00.000Z
 *               departmentId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               role:
 *                 type: string
 *                 example: SUPERVISOR
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลผู้ใช้งานสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: แก้ไขข้อมูลผู้ใช้งานสำเร็จ
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Server error
 */
userRouter.put(
  "/",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: ลบผู้ใช้งาน
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสผู้ใช้งาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบผู้ใช้งานสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ลบผู้ใช้งานสำเร็จ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Server error
 */
userRouter.delete(
  "/:id",
  verifyToken,
  authCheck,
  allowRoles("SUPERADMIN", "ADMIN"),
  deleteUser
);

export default userRouter;