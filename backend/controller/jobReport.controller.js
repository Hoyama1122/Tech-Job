import { prisma } from "../lib/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { uploadImages, uploadSingleImage } from "../util/upload.helper.js";
import {
  mapJobReportDetailRows,
  mapJobReportListRows,
  buildReportUpdateQueryInput,
  validateReportTimeRange,
  insertReportImages,
} from "../util/jobreport.sql.helper.js";

export const createJobReport = async (req, res) => {
  try {
    const {
      jobId,
      status,
      start_time,
      end_time,
      detail,
      repair_operations,
      inspection_results,
      summary,
    } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "กรุณาระบุ jobId",
      });
    }

    const createdById = req.user?.id;

    if (!createdById) {
      return res.status(401).json({
        message: "กรุณาเข้าสู่ระบบก่อนส่งรายงาน",
      });
    }

    const rangeValidation = validateReportTimeRange({
      start_time,
      end_time,
    });

    if (!rangeValidation.valid) {
      return res.status(400).json({
        message: rangeValidation.message,
      });
    }

    const imageFiles = req.files?.images || [];
    const signFile = req.files?.cus_sign?.[0];

    const uploadedImages = await uploadImages(
      imageFiles,
      "techjob/job-reports"
    );

    const uploadedSignature = await uploadSingleImage(
      signFile,
      "techjob/job-reports/sign"
    );

    const report = await prisma.$transaction(async (tx) => {
      const existingJobRows = await tx.$queryRaw`
        SELECT id
        FROM "Job"
        WHERE id = ${Number(jobId)}
        LIMIT 1;
      `;

      if (!existingJobRows.length) {
        throw new Error("ไม่พบใบงาน");
      }

      const insertedReports = await tx.$queryRaw`
        INSERT INTO "JobReport" (
          "jobId",
          "status",
          "start_time",
          "end_time",
          "detail",
          "repair_operations",
          "inspection_results",
          "summary",
          "cus_sign",
          "createdById",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${Number(jobId)},
          ${status ?? "COMPLETED"},
          ${start_time ? new Date(start_time) : null},
          ${end_time ? new Date(end_time) : null},
          ${detail ?? null},
          ${repair_operations ?? null},
          ${inspection_results ?? null},
          ${summary ?? null},
          ${uploadedSignature?.url ?? null},
          ${Number(createdById)},
          NOW(),
          NOW()
        )
        RETURNING id;
      `;

      const reportId = insertedReports?.[0]?.id;

      if (!reportId) {
        throw new Error("ไม่สามารถสร้างรายงานได้");
      }

      await insertReportImages({
        tx,
        reportId,
        uploadedImages,
      });

      const rows = await tx.$queryRaw`
        SELECT
          jr.id,
          jr."jobId",
          jr.status,
          jr.start_time,
          jr.end_time,
          jr.detail,
          jr.repair_operations,
          jr.inspection_results,
          jr.summary,
          jr.cus_sign,
          jr."createdById",
          jr."createdAt",
          jr."updatedAt",

          j.id AS job_id,
          j.title AS job_title,
          j.description AS job_description,
          j.status AS job_status,
          j.start_available_at,
          j.end_available_at,
          j.latitude,
          j.longitude,
          j.location_name,

          d.name AS department_name,

          cb.id AS created_by_id,
          cb.empno AS created_by_empno,
          cbp.firstname AS created_by_firstname,
          cbp.lastname AS created_by_lastname,

          ru.id AS report_user_id,
          ru.empno AS report_user_empno,
          rup.firstname AS report_user_firstname,
          rup.lastname AS report_user_lastname,

          ri.id AS image_id,
          ri.url AS image_url,
          ri."publicId" AS image_public_id,
          ri."createdAt" AS image_created_at

        FROM "JobReport" jr
        LEFT JOIN "Job" j
          ON j.id = jr."jobId"
        LEFT JOIN "Department" d
          ON d.id = j."departmentId"

        LEFT JOIN "User" cb
          ON cb.id = j."createdById"
        LEFT JOIN "Profile" cbp
          ON cbp."userId" = cb.id

        LEFT JOIN "User" ru
          ON ru.id = jr."createdById"
        LEFT JOIN "Profile" rup
          ON rup."userId" = ru.id

        LEFT JOIN "ReportImage" ri
          ON ri."reportId" = jr.id
        WHERE jr.id = ${reportId}
        ORDER BY ri.id ASC;
      `;

      return mapJobReportDetailRows(rows);
    });

    res.json({
      message: "สร้างรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("createJobReport error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getJobReports = async (req, res) => {
  try {
    const rows = await prisma.$queryRaw`
      SELECT
        jr.id,
        jr."jobId",
        jr.status,
        jr.start_time,
        jr.end_time,
        jr.detail,
        jr.repair_operations,
        jr.inspection_results,
        jr.summary,
        jr.cus_sign,
        jr."createdById",
        jr."createdAt",
        jr."updatedAt",

        j.id AS job_id,
        j.title AS job_title,
        j.description AS job_description,
        j.status AS job_status,

        d.name AS department_name,

        ru.id AS report_user_id,
        ru.empno AS report_user_empno,
        rup.firstname AS report_user_firstname,
        rup.lastname AS report_user_lastname,

        ri.id AS image_id,
        ri.url AS image_url,
        ri."publicId" AS image_public_id,
        ri."createdAt" AS image_created_at

      FROM "JobReport" jr
      LEFT JOIN "Job" j
        ON j.id = jr."jobId"
      LEFT JOIN "Department" d
        ON d.id = j."departmentId"
      LEFT JOIN "User" ru
        ON ru.id = jr."createdById"
      LEFT JOIN "Profile" rup
        ON rup."userId" = ru.id
      LEFT JOIN "ReportImage" ri
        ON ri."reportId" = jr.id
      ORDER BY jr."createdAt" DESC, ri.id ASC;
    `;

    const reports = mapJobReportListRows(rows);

    res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      reports,
    });
  } catch (error) {
    console.error("getJobReports error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getJobReportById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid report id",
      });
    }

    const rows = await prisma.$queryRaw`
      SELECT
        jr.id,
        jr."jobId",
        jr.status,
        jr.start_time,
        jr.end_time,
        jr.detail,
        jr.repair_operations,
        jr.inspection_results,
        jr.summary,
        jr.cus_sign,
        jr."createdById",
        jr."createdAt",
        jr."updatedAt",

        j.id AS job_id,
        j.title AS job_title,
        j.description AS job_description,
        j.status AS job_status,
        j.start_available_at,
        j.end_available_at,
        j.latitude,
        j.longitude,
        j.location_name,

        d.name AS department_name,

        cb.id AS created_by_id,
        cb.empno AS created_by_empno,
        cbp.firstname AS created_by_firstname,
        cbp.lastname AS created_by_lastname,

        ru.id AS report_user_id,
        ru.empno AS report_user_empno,
        rup.firstname AS report_user_firstname,
        rup.lastname AS report_user_lastname,

        ri.id AS image_id,
        ri.url AS image_url,
        ri."publicId" AS image_public_id,
        ri."createdAt" AS image_created_at

      FROM "JobReport" jr
      LEFT JOIN "Job" j
        ON j.id = jr."jobId"
      LEFT JOIN "Department" d
        ON d.id = j."departmentId"
      LEFT JOIN "User" cb
        ON cb.id = j."createdById"
      LEFT JOIN "Profile" cbp
        ON cbp."userId" = cb.id
      LEFT JOIN "User" ru
        ON ru.id = jr."createdById"
      LEFT JOIN "Profile" rup
        ON rup."userId" = ru.id
      LEFT JOIN "ReportImage" ri
        ON ri."reportId" = jr.id
      WHERE jr.id = ${id}
      ORDER BY ri.id ASC;
    `;

    if (!rows.length) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    const report = mapJobReportDetailRows(rows);

    res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("getJobReportById error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getJobReportByJobId = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!jobId) {
      return res.status(400).json({
        error: "Invalid job id",
      });
    }

    const rows = await prisma.$queryRaw`
      SELECT
        jr.id,
        jr."jobId",
        jr.status,
        jr.start_time,
        jr.end_time,
        jr.detail,
        jr.repair_operations,
        jr.inspection_results,
        jr.summary,
        jr.cus_sign,
        jr."createdById",
        jr."createdAt",
        jr."updatedAt",

        j.id AS job_id,
        j.title AS job_title,
        j.description AS job_description,
        j.status AS job_status,

        d.name AS department_name,

        ru.id AS report_user_id,
        ru.empno AS report_user_empno,
        rup.firstname AS report_user_firstname,
        rup.lastname AS report_user_lastname,

        ri.id AS image_id,
        ri.url AS image_url,
        ri."publicId" AS image_public_id,
        ri."createdAt" AS image_created_at

      FROM "JobReport" jr
      LEFT JOIN "Job" j
        ON j.id = jr."jobId"
      LEFT JOIN "Department" d
        ON d.id = j."departmentId"
      LEFT JOIN "User" ru
        ON ru.id = jr."createdById"
      LEFT JOIN "Profile" rup
        ON rup."userId" = ru.id
      LEFT JOIN "ReportImage" ri
        ON ri."reportId" = jr.id
      WHERE jr."jobId" = ${jobId}
      ORDER BY jr."createdAt" DESC, ri.id ASC;
    `;

    if (!rows.length) {
      return res.status(404).json({
        error: "ไม่พบรายงานของใบงานนี้",
      });
    }

    const reports = mapJobReportListRows(rows);

    res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      reports,
    });
  } catch (error) {
    console.error("getJobReportByJobId error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid report id",
      });
    }

    const {
      status,
      start_time,
      end_time,
      detail,
      repair_operations,
      inspection_results,
      summary,
    } = req.body;

    const rangeValidation = validateReportTimeRange({
      start_time,
      end_time,
    });

    if (!rangeValidation.valid) {
      return res.status(400).json({
        error: rangeValidation.message,
      });
    }

    const existingRows = await prisma.$queryRaw`
      SELECT
        jr.id,
        jr."jobId"
      FROM "JobReport" jr
      WHERE jr.id = ${id}
      LIMIT 1;
    `;

    const existingReport = existingRows[0];

    if (!existingReport) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    const imageFiles = req.files?.images || [];
    const signFile = req.files?.cus_sign?.[0];

    const uploadedImages = await uploadImages(
      imageFiles,
      "techjob/job-reports"
    );

    const uploadedSignature = await uploadSingleImage(
      signFile,
      "techjob/job-reports/sign"
    );

    const updateInput = buildReportUpdateQueryInput({
      status,
      start_time,
      end_time,
      detail,
      repair_operations,
      inspection_results,
      summary,
      uploadedSignature,
    });

    const report = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`
        UPDATE "JobReport"
        SET
          status = COALESCE(${updateInput.status}, status),
          start_time = CASE
            WHEN ${updateInput.hasStartTime} THEN ${updateInput.start_time}
            ELSE start_time
          END,
          end_time = CASE
            WHEN ${updateInput.hasEndTime} THEN ${updateInput.end_time}
            ELSE end_time
          END,
          detail = CASE
            WHEN ${updateInput.hasDetail} THEN ${updateInput.detail}
            ELSE detail
          END,
          repair_operations = CASE
            WHEN ${updateInput.hasRepairOperations} THEN ${updateInput.repair_operations}
            ELSE repair_operations
          END,
          inspection_results = CASE
            WHEN ${updateInput.hasInspectionResults} THEN ${updateInput.inspection_results}
            ELSE inspection_results
          END,
          summary = CASE
            WHEN ${updateInput.hasSummary} THEN ${updateInput.summary}
            ELSE summary
          END,
          cus_sign = CASE
            WHEN ${updateInput.hasSignature} THEN ${updateInput.cus_sign}
            ELSE cus_sign
          END,
          "updatedAt" = NOW()
        WHERE id = ${id};
      `;

      await insertReportImages({
        tx,
        reportId: id,
        uploadedImages,
      });

      if (status) {
        await tx.$queryRaw`
          UPDATE "Job"
          SET
            status = ${status},
            "updatedAt" = NOW()
          WHERE id = ${existingReport.jobId};
        `;
      }

      const rows = await tx.$queryRaw`
        SELECT
          jr.id,
          jr."jobId",
          jr.status,
          jr.start_time,
          jr.end_time,
          jr.detail,
          jr.repair_operations,
          jr.inspection_results,
          jr.summary,
          jr.cus_sign,
          jr."createdById",
          jr."createdAt",
          jr."updatedAt",

          j.id AS job_id,
          j.title AS job_title,
          j.description AS job_description,
          j.status AS job_status,
          j.start_available_at,
          j.end_available_at,
          j.latitude,
          j.longitude,
          j.location_name,

          d.name AS department_name,

          cb.id AS created_by_id,
          cb.empno AS created_by_empno,
          cbp.firstname AS created_by_firstname,
          cbp.lastname AS created_by_lastname,

          ru.id AS report_user_id,
          ru.empno AS report_user_empno,
          rup.firstname AS report_user_firstname,
          rup.lastname AS report_user_lastname,

          ri.id AS image_id,
          ri.url AS image_url,
          ri."publicId" AS image_public_id,
          ri."createdAt" AS image_created_at

        FROM "JobReport" jr
        LEFT JOIN "Job" j
          ON j.id = jr."jobId"
        LEFT JOIN "Department" d
          ON d.id = j."departmentId"
        LEFT JOIN "User" cb
          ON cb.id = j."createdById"
        LEFT JOIN "Profile" cbp
          ON cbp."userId" = cb.id
        LEFT JOIN "User" ru
          ON ru.id = jr."createdById"
        LEFT JOIN "Profile" rup
          ON rup."userId" = ru.id
        LEFT JOIN "ReportImage" ri
          ON ri."reportId" = jr.id
        WHERE jr.id = ${id}
        ORDER BY ri.id ASC;
      `;

      return mapJobReportDetailRows(rows);
    });

    res.json({
      message: "อัปเดตรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("updateJobReport error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const deleteJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid report id",
      });
    }

    const rows = await prisma.$queryRaw`
      SELECT
        jr.id,
        jr."jobId",
        jr.status,
        jr.start_time,
        jr.end_time,
        jr.detail,
        jr.repair_operations,
        jr.inspection_results,
        jr.summary,
        jr.cus_sign,
        jr."createdById",
        jr."createdAt",
        jr."updatedAt",

        ri.id AS image_id,
        ri.url AS image_url,
        ri."publicId" AS image_public_id,
        ri."createdAt" AS image_created_at
      FROM "JobReport" jr
      LEFT JOIN "ReportImage" ri
        ON ri."reportId" = jr.id
      WHERE jr.id = ${id};
    `;

    if (!rows.length) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    const report = mapJobReportDetailRows(rows);

    await Promise.all(
      report.images.map(async (image) => {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      })
    );

    await prisma.$executeRaw`
      DELETE FROM "JobReport"
      WHERE id = ${id};
    `;

    res.json({
      message: "ลบรายงานสำเร็จ",
    });
  } catch (error) {
    console.error("deleteJobReport error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const approveJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid report id",
      });
    }

    const report = await prisma.$transaction(async (tx) => {
      const reportRows = await tx.$queryRaw`
        SELECT id, "jobId"
        FROM "JobReport"
        WHERE id = ${id}
        LIMIT 1;
      `;

      const existingReport = reportRows[0];

      if (!existingReport) {
        throw new Error("REPORT_NOT_FOUND");
      }

      const updatedRows = await tx.$queryRaw`
        UPDATE "JobReport"
        SET
          status = 'COMPLETED',
          "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;

      await tx.$queryRaw`
        UPDATE "Job"
        SET
          status = 'COMPLETED',
          "updatedAt" = NOW()
        WHERE id = ${existingReport.jobId};
      `;

      return updatedRows[0];
    });

    res.json({
      message: "อนุมัติรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("approveJobReport error:", error);

    if (error instanceof Error && error.message === "REPORT_NOT_FOUND") {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const rejectJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid report id",
      });
    }

    const report = await prisma.$transaction(async (tx) => {
      const reportRows = await tx.$queryRaw`
        SELECT id, "jobId"
        FROM "JobReport"
        WHERE id = ${id}
        LIMIT 1;
      `;

      const existingReport = reportRows[0];

      if (!existingReport) {
        throw new Error("REPORT_NOT_FOUND");
      }

      const updatedRows = await tx.$queryRaw`
        UPDATE "JobReport"
        SET
          status = 'REJECTED',
          "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;

      await tx.$queryRaw`
        UPDATE "Job"
        SET
          status = 'IN_PROGRESS',
          "updatedAt" = NOW()
        WHERE id = ${existingReport.jobId};
      `;

      return updatedRows[0];
    });

    res.json({
      message: "ปฏิเสธรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("rejectJobReport error:", error);

    if (error instanceof Error && error.message === "REPORT_NOT_FOUND") {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};