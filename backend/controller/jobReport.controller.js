import { prisma, Prisma } from "../lib/prisma.js"; // trigger restart
import {
  uploadImages,
  uploadSingleImage,
  deleteImages,
  extractCloudinaryPublicId,
} from "../util/upload.helper.js";
import {
  mapJobReportDetailRows,
  mapJobReportListRows,
  validateReportTimeRange,
  insertReportImages,
  getReportImagesPublicIds,
  buildReportUpdateFields,
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
      items: rawItems,
    } = req.body;

    let items = [];
    if (typeof rawItems === 'string') {
      try {
        items = JSON.parse(rawItems);
      } catch (e) {
        console.error("Parse items error:", e);
      }
    } else if (Array.isArray(rawItems)) {
      items = rawItems;
    }

    if (!jobId) {
      return res.status(400).json({ message: "กรุณาระบุ jobId" });
    }

    const createdById = req.user?.id;
    if (!createdById) {
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อนส่งรายงาน" });
    }

    const rangeValidation = validateReportTimeRange({ start_time, end_time });
    if (!rangeValidation.valid) {
      return res.status(400).json({ message: rangeValidation.message });
    }

    const beforeFiles = req.files?.beforeImages || [];
    const afterFiles = req.files?.afterImages || [];
    const signFile = req.files?.cus_sign?.[0];

    // Upload to Cloudinary
    const [uploadedBefore, uploadedAfter, uploadedSignature] = await Promise.all([
      uploadImages(beforeFiles, "techjob/job-reports/before"),
      uploadImages(afterFiles, "techjob/job-reports/after"),
      uploadSingleImage(signFile, "techjob/job-reports/sign")
    ]);

    const reportResult = await prisma.$transaction(async (tx) => {
      // 1. Verify Job existence
      const job = await tx.job.findUnique({
        where: { id: Number(jobId) }
      });

      if (!job) {
        throw new Error("ไม่พบใบงาน");
      }

      // 2. Check for existing 'IN_PROGRESS' report by this user
      const existingReport = await tx.jobReport.findFirst({
        where: {
          jobId: Number(jobId),
          createdById: Number(createdById),
          status: 'IN_PROGRESS'
        }
      });

      let report;
      const reportData = {
        status: (status || 'SUBMITTED'),
        start_time: start_time ? new Date(start_time) : (existingReport?.start_time || new Date()),
        end_time: end_time ? new Date(end_time) : new Date(),
        detail: detail || null,
        repair_operations: repair_operations || null,
        inspection_results: inspection_results || null,
        summary: summary || null,
        cus_sign: uploadedSignature?.url || existingReport?.cus_sign || null,
        updatedAt: new Date(),
      };

      if (existingReport) {
        // Update existing draft
        report = await tx.jobReport.update({
          where: { id: existingReport.id },
          data: reportData,
        });
      } else {
        // Create new report
        report = await tx.jobReport.create({
          data: {
            ...reportData,
            jobId: Number(jobId),
            createdById: Number(createdById),
            createdAt: new Date(),
          },
        });
      }

      // 3. Insert Images
      await insertReportImages({
        tx,
        reportId: report.id,
        uploadedImages: uploadedBefore,
        type: "BEFORE"
      });

      await insertReportImages({
        tx,
        reportId: report.id,
        uploadedImages: uploadedAfter,
        type: "AFTER"
      });

      // 4. Handle Item Usages
      if (items && Array.isArray(items)) {
        for (const itemUsage of items) {
          // Record usage
          await tx.itemUsage.create({
            data: {
              itemId: Number(itemUsage.id),
              userId: Number(createdById),
              jobId: Number(jobId),
              reportId: Number(report.id),
              usedQuantity: Number(itemUsage.quantity),
              usedAt: new Date(),
            }
          });

          // Decrement quantity ONLY for MATERIAL
          if (itemUsage.type === 'MATERIAL') {
            await tx.item.update({
              where: { id: Number(itemUsage.id) },
              data: {
                quantity: {
                  decrement: Number(itemUsage.quantity)
                }
              }
            });
          }
        }
      }

      // 5. Update Job Status to SUBMITTED if status matches
      if (report.status === 'SUBMITTED') {
        await tx.job.update({
          where: { id: Number(jobId) },
          data: { 
            status: 'SUBMITTED',
            updatedAt: new Date()
          }
        });
      }

      // 5. Return full report details
      const reportFull = await tx.jobReport.findUnique({
        where: { id: report.id },
        include: {
          images: true,
          itemUsages: {
            include: { item: true }
          },
          createdBy: {
            include: { profile: true }
          },
          job: {
            include: {
              department: true,
              createdBy: { include: { profile: true } }
            }
          }
        }
      });

      // Map to camelCase for frontend consistency
      return {
        ...reportFull,
        repairOperations: reportFull.repair_operations,
        inspectionResults: reportFull.inspection_results,
        summaryOfOperatingResults: reportFull.summary,
        customerSignature: reportFull.cus_sign,
        reportedBy: {
          id: reportFull.createdBy?.id,
          fullname: `${reportFull.createdBy?.profile?.firstname || ""} ${reportFull.createdBy?.profile?.lastname || ""}`.trim()
        }
      };
    });

    return res.json({
      message: "สรุปงานสำเร็จ",
      report: reportResult,
    });

  } catch (error) {
    console.error("createJobReport error:", error);
    return res.status(500).json({
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
        ri.type AS image_type,
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

    return res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      reports,
    });
  } catch (error) {
    console.error("getJobReports error:", error);
    return res.status(500).json({
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
        ri.type AS image_type,
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

    return res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("getJobReportById error:", error);
    return res.status(500).json({
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
        ri.type AS image_type,
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

    return res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      reports,
    });
  } catch (error) {
    console.error("getJobReportByJobId error:", error);
    return res.status(500).json({
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
        jr."jobId",
        jr.cus_sign
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

    const beforeFiles = req.files?.beforeImages || [];
    const afterFiles = req.files?.afterImages || [];
    const signFile = req.files?.cus_sign?.[0];

    const uploadedBefore = await uploadImages(beforeFiles, "techjob/job-reports/before");
    const uploadedAfter = await uploadImages(afterFiles, "techjob/job-reports/after");

    const uploadedSignature = await uploadSingleImage(
      signFile,
      "techjob/job-reports/sign"
    );

    const isImageUpdate = req.files?.beforeImages !== undefined || req.files?.afterImages !== undefined;

    let oldImagePublicIds = [];
    let oldSignaturePublicIds = [];

    const report = await prisma.$transaction(async (tx) => {
      if (isImageUpdate) {
        oldImagePublicIds = await getReportImagesPublicIds(tx, id);

        await tx.$executeRaw`
          DELETE FROM "ReportImage"
          WHERE "reportId" = ${id}
        `;
      }

      const newSignatureUrl =
        uploadedSignature?.secure_url || uploadedSignature?.url;

      if (newSignatureUrl && existingReport.cus_sign) {
        const maybePublicId = extractCloudinaryPublicId(existingReport.cus_sign);
        if (maybePublicId) {
          oldSignaturePublicIds = [maybePublicId];
        }
      }

      const updateFields = buildReportUpdateFields({
        status,
        start_time,
        end_time,
        detail,
        repair_operations,
        inspection_results,
        summary,
        cus_sign: newSignatureUrl,
      });

      if (updateFields.length > 0) {
        await tx.$executeRaw`
          UPDATE "JobReport"
          SET ${Prisma.join(updateFields, ", ")},
              "updatedAt" = NOW()
          WHERE id = ${id}
        `;
      }

      if (uploadedBefore.length > 0) {
        await insertReportImages({
          tx,
          reportId: id,
          uploadedImages: uploadedBefore,
          type: "BEFORE"
        });
      }

      if (uploadedAfter.length > 0) {
        await insertReportImages({
          tx,
          reportId: id,
          uploadedImages: uploadedAfter,
          type: "AFTER"
        });
      }

      if (status !== undefined) {
        await tx.$executeRaw`
          UPDATE "Job"
          SET status = ${status},
              "updatedAt" = NOW()
          WHERE id = ${existingReport.jobId}
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
          ri.type AS image_type,
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

    const deletePublicIds = [
      ...oldImagePublicIds.filter(Boolean),
      ...oldSignaturePublicIds.filter(Boolean),
    ];

    if (deletePublicIds.length > 0) {
      await deleteImages(deletePublicIds);
    }

    return res.json({
      message: "อัปเดตรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error("updateJobReport error:", error);

    return res.status(500).json({
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
        ri.type AS image_type,
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

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        DELETE FROM "ReportImage"
        WHERE "reportId" = ${id}
      `;

      await tx.$executeRaw`
        DELETE FROM "JobReport"
        WHERE id = ${id}
      `;
    });

    const publicIds = [
      ...(report.images || []).map((image) => image.publicId).filter(Boolean),
    ];

    if (report.cus_sign) {
      const signPublicId = extractCloudinaryPublicId(report.cus_sign);
      if (signPublicId) {
        publicIds.push(signPublicId);
      }
    }

    if (publicIds.length > 0) {
      await deleteImages(publicIds);
    }

    return res.json({
      message: "ลบรายงานสำเร็จ",
    });
  } catch (error) {
    console.error("deleteJobReport error:", error);
    return res.status(500).json({
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
          status = 'APPROVED',
          "approvedById" = ${req.user.id},
          "approvedAt" = NOW(),
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

    return res.json({
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

    return res.status(500).json({
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

      const { rejectReason } = req.body;

      const updatedRows = await tx.$queryRaw`
        UPDATE "JobReport"
        SET
          status = 'REJECTED',
          "rejectedById" = ${req.user.id},
          "rejectedAt" = NOW(),
          "rejectReason" = ${rejectReason || null},
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

    return res.json({
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

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

