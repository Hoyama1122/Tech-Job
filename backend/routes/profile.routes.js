import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controller/profile.controller.js";
import { authCheck, verifyToken } from "../lib/middleware.js";

const routerProfile = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: User profile endpoints
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลโปรไฟล์สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ดึงข้อมูลโปรไฟล์สำเร็จ
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
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: TECHNICIAN
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
 *                           example: Maintenance
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
 *                         address:
 *                           type: string
 *                           example: Bangkok
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Server error
 */
routerProfile.get("/", verifyToken, authCheck, getMyProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: แก้ไขโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                 example: 2000-01-01T00:00:00.000Z
 *     responses:
 *       200:
 *         description: แก้ไขโปรไฟล์สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: แก้ไขโปรไฟล์สำเร็จ
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     firstname:
 *                       type: string
 *                       example: สมชาย
 *                     lastname:
 *                       type: string
 *                       example: ใจดี
 *                     phone:
 *                       type: string
 *                       example: 0812345678
 *                     address:
 *                       type: string
 *                       example: Bangkok
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     gender:
 *                       type: string
 *                       nullable: true
 *                       example: male
 *                     birthday:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: 2000-01-01T00:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 *       500:
 *         description: Server error
 */
routerProfile.put("/", verifyToken, authCheck, updateMyProfile);

export default routerProfile;