import Router from "express";
import { upload } from "../lib/upload.js";
import {
  approveJobReport,
  createJobReport,
  deleteJobReport,
  getJobReportById,
  getJobReportByJobId,
  getJobReports,
  rejectJobReport,
  updateJobReport,
} from "../controller/jobreport.controller.js";

const jobReportRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Job Reports
 *     description: Job report management endpoints
 */

/**
 * @swagger
 * /api/job-reports:
 *   get:
 *     summary: ดึงรายการรายงานงานทั้งหมด
 *     tags: [Job Reports]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลรายงานสำเร็จ
 *       500:
 *         description: Server error
 */
jobReportRouter.get("/", getJobReports);

/**
 * @swagger
 * /api/job-reports/{id}:
 *   get:
 *     summary: ดึงรายละเอียดรายงานตาม id
 *     tags: [Job Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสรายงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ดึงข้อมูลรายงานสำเร็จ
 *       400:
 *         description: Invalid report id
 *       404:
 *         description: ไม่พบรายงาน
 *       500:
 *         description: Server error
 */
jobReportRouter.get("/:id", getJobReportById);

/**
 * @swagger
 * /api/job-reports/{id}:
 *   delete:
 *     summary: ลบรายงานงาน
 *     tags: [Job Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสรายงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ลบรายงานสำเร็จ
 *       400:
 *         description: Invalid report id
 *       404:
 *         description: ไม่พบรายงาน
 *       500:
 *         description: Server error
 */
jobReportRouter.delete("/:id", deleteJobReport);

/**
 * @swagger
 * /api/job-reports:
 *   post:
 *     summary: สร้างรายงานงานใหม่
 *     tags: [Job Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: IN_PROGRESS
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T09:00:00.000Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T17:00:00.000Z
 *               detail:
 *                 type: string
 *                 example: ตรวจสอบอุปกรณ์และซ่อมแซมเรียบร้อย
 *               repair_operations:
 *                 type: string
 *                 example: เปลี่ยนสายไฟและทดสอบระบบ
 *               inspection_results:
 *                 type: string
 *                 example: ระบบกลับมาใช้งานได้ปกติ
 *               summary:
 *                 type: string
 *                 example: งานเสร็จสมบูรณ์
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               cus_sign:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: สร้างรายงานสำเร็จ
 *       500:
 *         description: Server error
 */
jobReportRouter.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "cus_sign", maxCount: 1 },
  ]),
  createJobReport
);

/**
 * @swagger
 * /api/job-reports/{id}:
 *   put:
 *     summary: อัปเดตรายงานงาน
 *     tags: [Job Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสรายงาน
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
 *               status:
 *                 type: string
 *                 example: IN_PROGRESS
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T09:00:00.000Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-25T17:00:00.000Z
 *               detail:
 *                 type: string
 *                 example: แก้ไขรายละเอียดการซ่อม
 *               repair_operations:
 *                 type: string
 *                 example: เปลี่ยนอะไหล่เพิ่มเติม
 *               inspection_results:
 *                 type: string
 *                 example: ผลตรวจสอบผ่าน
 *               summary:
 *                 type: string
 *                 example: อัปเดตรายงานแล้ว
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               cus_sign:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: อัปเดตรายงานสำเร็จ
 *       400:
 *         description: Invalid report id หรือเวลาไม่ถูกต้อง
 *       404:
 *         description: ไม่พบรายงาน
 *       500:
 *         description: Server error
 */
jobReportRouter.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "cus_sign", maxCount: 1 },
  ]),
  updateJobReport
);

/**
 * @swagger
 * /api/job-reports/{id}/approve:
 *   patch:
 *     summary: อนุมัติรายงานงาน
 *     tags: [Job Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสรายงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: อนุมัติรายงานสำเร็จ
 *       400:
 *         description: Invalid report id
 *       404:
 *         description: ไม่พบรายงาน
 *       500:
 *         description: Server error
 */
jobReportRouter.patch("/:id/approve", approveJobReport);

/**
 * @swagger
 * /api/job-reports/{id}/reject:
 *   patch:
 *     summary: ปฏิเสธรายงานงาน
 *     tags: [Job Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: รหัสรายงาน
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ปฏิเสธรายงานสำเร็จ
 *       400:
 *         description: Invalid report id
 *       404:
 *         description: ไม่พบรายงาน
 *       500:
 *         description: Server error
 */
jobReportRouter.patch("/:id/reject", rejectJobReport);

jobReportRouter.get("/:jobId", getJobReportByJobId)

export default jobReportRouter;