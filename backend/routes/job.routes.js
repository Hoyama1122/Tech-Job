import Router from "express";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  getMyJobs,
  updateJob,
} from "../controller/job.controller.js";
import { upload } from "../lib/upload.js";
import { verifyToken } from "../lib/middleware.js";

const jobRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Jobs
 *     description: Job management endpoints จ้าาาาาาาาาาาาาาาาาา
 */

/**
 * @swagger
 * /api/jobs/my:
 *   get:
 *     summary: ดึงรายการงานของผู้ใช้ที่ล็อกอินอยู่
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
jobRouter.get("/my", verifyToken, getMyJobs);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: ดึงรายการใบงานทั้งหมด
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลใบงานสำเร็จ
 *       500:
 *         description: Server error
 */
jobRouter.get("/", getJobs);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: สร้างใบงานใหม่
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - departmentId
 *             properties:
 *               title:
 *                 type: string
 *                 example: ซ่อมระบบไฟชั้น 3
 *               description:
 *                 type: string
 *                 example: ตรวจสอบและซ่อมวงจรไฟ
 *               supervisorId:
 *                 type: integer
 *                 example: 2
 *               technicianId:
 *                 type: integer
 *                 example: 5
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               start_available_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T09:00:00.000Z
 *               end_available_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T17:00:00.000Z
 *               latitude:
 *                 type: number
 *                 example: 13.736717
 *               longitude:
 *                 type: number
 *                 example: 100.523186
 *               location_name:
 *                 type: string
 *                 example: อาคารสำนักงานใหญ่
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: สร้างใบงานสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: Server error
 */
jobRouter.post(
  "/",
  upload.fields([{ name: "images", maxCount: 10 }]),
  createJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: ดึงรายละเอียดใบงานตาม id
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสใบงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงข้อมูลใบงานสำเร็จ
 *       400:
 *         description: Invalid job id
 *       404:
 *         description: ไม่พบใบงาน
 *       500:
 *         description: Server error
 */
jobRouter.get("/:id", getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: อัปเดตใบงาน
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสใบงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: ซ่อมระบบไฟชั้น 3
 *               description:
 *                 type: string
 *                 example: เปลี่ยนรายละเอียดงาน
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: IN_PROGRESS
 *               latitude:
 *                 type: number
 *                 example: 13.736717
 *               longitude:
 *                 type: number
 *                 example: 100.523186
 *               location_name:
 *                 type: string
 *                 example: อาคาร A ชั้น 2
 *               start_available_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T09:00:00.000Z
 *               end_available_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T17:00:00.000Z
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: อัปเดตใบงานสำเร็จ
 *       400:
 *         description: Invalid job id หรือข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบใบงาน
 *       500:
 *         description: Server error
 */
jobRouter.put(
  "/:id",
  upload.fields([{ name: "images", maxCount: 10 }]),
  updateJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: ลบใบงาน
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสใบงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบใบงานสำเร็จ
 *       400:
 *         description: Invalid job id
 *       404:
 *         description: ไม่พบใบงาน
 *       500:
 *         description: Server error
 */
jobRouter.delete("/:id", deleteJob);

export default jobRouter;