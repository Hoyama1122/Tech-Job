import Router from "express";
import { login, logout, me } from "../controller/auth.controller.js";
import { authCheck, verifyToken } from "../lib/middleware.js";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints จ้าาาาาาาาาาาาาาาาาา
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: เข้าสู่ระบบ
 *                 role:
 *                   type: string
 *                   example: ADMIN
 *       400:
 *         description: ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
 *       500:
 *         description: Server error
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: ออกจากระบบ
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: ออกจากระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ออกจากระบบ
 *       500:
 *         description: Server error
 */
authRouter.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลผู้ใช้สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: ไม่พบผู้ใช้
 *       500:
 *         description: Server error
 */
authRouter.get("/me", verifyToken,authCheck, me);

export default authRouter;