import Router from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controller/departmenet.controller.js";

const departmentRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Departments
 *     description: Department management endpoints
 */

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: ดึงรายการแผนกทั้งหมด
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลแผนกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: IT
 *       500:
 *         description: Server error
 */
departmentRoute.get("/", getDepartments);

/**
 * @swagger
 * /api/department/{id}:
 *   get:
 *     summary: ดึงข้อมูลแผนกตาม id
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสแผนก
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงข้อมูลแผนกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: IT
 *       404:
 *         description: ไม่พบแผนก
 *       500:
 *         description: Server error
 */
departmentRoute.get("/:id", getDepartmentById);

/**
 * @swagger
 * /api/department:
 *   post:
 *     summary: สร้างแผนกใหม่
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: IT
 *     responses:
 *       200:
 *         description: สร้างแผนกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: แผนกถูกสร้างเรียบร้อย
 *                 department:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: IT
 *       400:
 *         description: กรอกข้อมูลไม่ครบ หรือมีชื่อแผนกนี้แล้ว
 *       500:
 *         description: Server error
 */
departmentRoute.post("/", createDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   put:
 *     summary: อัปเดตชื่อแผนก
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสแผนก
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maintenance
 *     responses:
 *       200:
 *         description: อัปเดตแผนกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: อัปเดตแผนกเรียบร้อย
 *                 department:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Maintenance
 *       400:
 *         description: กรอกข้อมูลไม่ครบ หรือชื่อแผนกนี้ถูกใช้แล้ว
 *       404:
 *         description: ไม่พบแผนก
 *       500:
 *         description: Server error
 */
departmentRoute.put("/:id", updateDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   delete:
 *     summary: ลบแผนก
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสแผนก
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบแผนกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ลบแผนกเรียบร้อย
 *       400:
 *         description: ไม่สามารถลบได้ เพราะยังมีผู้ใช้งานอยู่ในแผนกนี้
 *       404:
 *         description: ไม่พบแผนก
 *       500:
 *         description: Server error
 */
departmentRoute.delete("/:id", deleteDepartment);

export default departmentRoute;