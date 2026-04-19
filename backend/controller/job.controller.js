import { prisma, Prisma } from "../lib/prisma.js"; // trigger restart
import { uploadImages, deleteImages } from "../util/upload.helper.js";
import {
  formatJobId,
  normalizeTechnicianIds,
  validateAvailableRange,
  normalizeLocationFields,
  normalizeDateFields,
} from "../util/job.helper.js";
import {
  mapJobsRows,
  mapJobDetailRows,
  buildJobUpdateFields,
  insertAssignments,
  updateAssignments,
  insertJobImages,
  deleteJobRelations,
  getJobImagesPublicIds,
} from "../util/job.sql.helper.js";

export const getJobs = async (req, res) => {
  try {
    const { role, departmentId } = req.user;

    // Only ADMIN, SUPERADMIN, and SUPERVISOR can access this
    if (!["ADMIN", "SUPERADMIN", "SUPERVISOR"].includes(role)) {
      return res
        .status(403)
        .json({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูลส่วนนี้" });
    }

    let query = Prisma.sql`
      SELECT
        j.id,
        j.title,
        j.description,
        j.status,
        j."createdAt",
        j.start_available_at,
        j.end_available_at,
        j.latitude,
        j.longitude,
        j.location_name,
        j."departmentId",

        ja.role AS assignment_role,
        au.id AS assignment_user_id,
        au.empno AS assignment_user_empno,
        ap.firstname AS assignment_user_firstname,
        ap.lastname AS assignment_user_lastname,
        ap.phone AS assignment_user_phone

      FROM "Job" j
      LEFT JOIN "JobAssignment" ja
        ON ja."jobId" = j.id
      LEFT JOIN "User" au
        ON au.id = ja."userId"
      LEFT JOIN "Profile" ap
        ON ap."userId" = au.id
    `;

    // Filter by departmentId if it exists (for all roles as requested)
    // Note: If SUPERADMIN should see all, we'd check if role !== 'SUPERADMIN'
    // But user said: "fetch เฉพาะjob departmentId ตัวเอง" for all three roles.
    if (departmentId) {
      query = Prisma.sql`${query} WHERE j."departmentId" = ${departmentId}`;
    }

    query = Prisma.sql`${query} ORDER BY j."createdAt" DESC`;

    const rows = await prisma.$queryRaw(query);

    const formattedJobs = mapJobsRows(rows, formatJobId);

    res.json({
      message: "ดึงข้อมูลใบงานสำเร็จ",
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("getJobs error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid job id",
      });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        department: true,
        createdBy: {
          include: {
            profile: true,
          },
        },
        assignments: {
          include: {
            user: {
              include: {
                profile: true,
                department: true,
              },
            },
          },
        },
        images: true,
        reports: {
          include: {
            createdBy: {
              include: {
                profile: true,
              },
            },
            images: true,
            itemUsages: {
              include: { item: true }
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: "ไม่พบใบงาน" });
    }

    // Transform to a clean, flat structure for the frontend
    const formattedJob = {
      id: job.id,
      JobId: formatJobId(job.id),
      title: job.title,
      description: job.description,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      start_available_at: job.start_available_at,
      end_available_at: job.end_available_at,
      latitude: job.latitude,
      longitude: job.longitude,
      location_name: job.location_name,

      department: job.department,

      createdBy: {
        id: job.createdBy.id,
        fullname:
          `${job.createdBy.profile?.firstname || ""} ${job.createdBy.profile?.lastname || ""}`.trim(),
      },

      supervisor: job.assignments.find((a) => a.role === "SUPERVISOR")
        ? {
            id: job.assignments.find((a) => a.role === "SUPERVISOR").user.id,
            fullname:
              `${job.assignments.find((a) => a.role === "SUPERVISOR").user.profile?.firstname || ""} ${job.assignments.find((a) => a.role === "SUPERVISOR").user.profile?.lastname || ""}`.trim(),
            phone: job.assignments.find((a) => a.role === "SUPERVISOR").user.profile?.phone || "-",
            email: job.assignments.find((a) => a.role === "SUPERVISOR").user.email || "-",
            department: job.assignments.find((a) => a.role === "SUPERVISOR")
              .user.department?.name,
            role: "SUPERVISOR",
          }
        : null,

      technicians: job.assignments
        .filter((a) => a.role === "TECHNICIAN")
        .map((a) => ({
          id: a.user.id,
          fullname:
            `${a.user.profile?.firstname || ""} ${a.user.profile?.lastname || ""}`.trim(),
          phone: a.user.profile?.phone || "-",
          email: a.user.email || "-",
          department: a.user.department?.name,
          role: "TECHNICIAN",
        })),

      assignments: job.assignments.map((a) => ({
        id: a.user.id,
        fullname:
          `${a.user.profile?.firstname || ""} ${a.user.profile?.lastname || ""}`.trim(),
        phone: a.user.profile?.phone || "-",
        email: a.user.email || "-",
        role: a.role,
        department: a.user.department?.name,
      })),

      images: job.images,

      reports: job.reports.map((r) => ({
        id: r.id,
        status: r.status,
        start_time: r.start_time,
        end_time: r.end_time,
        detail: r.detail,
        repairOperations: r.repair_operations,
        inspectionResults: r.inspection_results,
        summaryOfOperatingResults: r.summary,
        customerSignature: r.cus_sign,
        rejectReason: r.rejectReason,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        images: r.images,
        reportedBy: {
          id: r.createdBy?.id,
          fullname:
            `${r.createdBy?.profile?.firstname || ""} ${r.createdBy?.profile?.lastname || ""}`.trim(),
        },
      })),

      loc: {
        lat: job.latitude,
        lng: job.longitude,
      },
      customer: {
        address: job.location_name || "ไม่ระบุสถานที่",
      },
      location: {
        latitude: job.latitude,
        longitude: job.longitude,
        location_name: job.location_name,
      },
      // For Admin consistency (some screens might still look for technicianReport)
      technicianReport: job.reports[0]
        ? {
            ...job.reports[0],
            repairOperations: job.reports[0].repair_operations,
            inspectionResults: job.reports[0].inspection_results,
            summaryOfOperatingResults: job.reports[0].summary,
            customerSignature: job.reports[0].cus_sign,
            reportedBy: {
              id: job.reports[0].createdBy?.id,
              fullname:
                `${job.reports[0].createdBy?.profile?.firstname || ""} ${job.reports[0].createdBy?.profile?.lastname || ""}`.trim(),
            },
            images: job.reports[0].images,
          }
        : null,
    };

    res.json({
      message: "ดึงข้อมูลใบงานสำเร็จ",
      job: formattedJob,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      supervisorId,
      technicianId,
      departmentId,
      start_available_at,
      end_available_at,
      latitude,
      longitude,
      location_name,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "กรุณากรอกชื่องาน",
      });
    }

    if (!departmentId) {
      return res.status(400).json({
        message: "กรุณาเลือกแผนก",
      });
    }

    const rangeValidation = validateAvailableRange({
      start_available_at,
      end_available_at,
    });

    if (!rangeValidation.valid) {
      return res.status(400).json({
        message: rangeValidation.message,
      });
    }

    const technicianIds = normalizeTechnicianIds(technicianId);

    const locationFields = normalizeLocationFields({
      latitude,
      longitude,
      location_name,
    });

    const dateFields = normalizeDateFields({
      start_available_at,
      end_available_at,
    });

    console.log("createJob req.body:", req.body);
    console.log("createJob req.files:", req.files);

    const imageFiles = req.files?.images || [];
    console.log("createJob imageFiles:", imageFiles.length);

    const uploadedImages = await uploadImages(imageFiles, "techjob/jobs");
    const createdById = req.user?.id || 3;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Insert Job using Raw SQL with proper quoting
      const insertedJobs = await tx.$queryRaw`
        INSERT INTO "Job" (
          title,
          description,
          status,
          start_available_at,
          end_available_at,
          latitude,
          longitude,
          location_name,
          "departmentId",
          "createdById",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${title},
          ${description || null},
          'PENDING',
          ${dateFields.start_available_at},
          ${dateFields.end_available_at},
          ${locationFields.latitude},
          ${locationFields.longitude},
          ${locationFields.location_name},
          ${Number(departmentId)},
          ${Number(createdById)},
          NOW(),
          NOW()
        )
        RETURNING id;
      `;

      const jobId = insertedJobs?.[0]?.id;

      if (!jobId) {
        throw new Error("ไม่สามารถสร้างใบงานได้");
      }

      // 2. Insert Assignments via manual helpers
      await insertAssignments({
        tx,
        jobId: Number(jobId),
        supervisorId,
        technicianIds,
      });

      // 3. Insert Images via manual helpers
      await insertJobImages({
        tx,
        jobId: Number(jobId),
        uploadedImages,
      });

      // 4. Fetch the fully mapped result using our SQL helper for consistent output format
      const rows = await tx.$queryRaw`
        SELECT
          j.id, j.title, j.description, j.status, j."createdAt", j."updatedAt",
          j.start_available_at, j.end_available_at, j.latitude, j.longitude, j.location_name,
          d.id AS department_id, d.name AS department_name,
          cb.id AS created_by_id, cb.empno AS created_by_empno,
          cbp.firstname AS created_by_firstname, cbp.lastname AS created_by_lastname,
          ja.role AS assignment_role, au.id AS assignment_user_id, au.empno AS assignment_user_empno,
          ad.name AS assignment_department_name, ap.firstname AS assignment_user_firstname, ap.lastname AS assignment_user_lastname,
          ji.id AS image_id, ji.url AS image_url, ji."publicId" AS image_public_id, ji."createdAt" AS image_created_at,
          jr.id AS report_id, jr.status AS report_status, jr.detail AS report_detail, jr.summary AS report_summary,
          jr.repair_operations AS report_repair_operations, jr.inspection_results AS report_inspection_results,
          jr.cus_sign AS report_cus_sign, jr."rejectReason" AS report_reject_reason,
          jr.start_time AS report_start_time, jr.end_time AS report_end_time,
          jr."createdAt" AS report_created_at
        FROM "Job" j
        LEFT JOIN "Department" d ON d.id = j."departmentId"
        LEFT JOIN "User" cb ON cb.id = j."createdById"
        LEFT JOIN "Profile" cbp ON cbp."userId" = cb.id
        LEFT JOIN "JobAssignment" ja ON ja."jobId" = j.id
        LEFT JOIN "User" au ON au.id = ja."userId"
        LEFT JOIN "Profile" ap ON ap."userId" = au.id
        LEFT JOIN "Department" ad ON ad.id = au."departmentId"
        LEFT JOIN "JobImage" ji ON ji."jobId" = j.id
        LEFT JOIN "JobReport" jr ON jr."jobId" = j.id
        WHERE j.id = ${jobId}
      `;

      return mapJobDetailRows(rows, formatJobId);
    });

    res.json({
      message: "สร้างใบงานสำเร็จ",
      job: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid job id",
      });
    }

    const {
      title,
      description,
      departmentId,
      status,
      latitude,
      longitude,
      location_name,
      start_available_at,
      end_available_at,
      supervisorId,
      technicianId,
    } = req.body;

    const existingJob = await prisma.$queryRaw`
      SELECT id
      FROM "Job"
      WHERE id = ${id}
    `;

    if (!existingJob.length) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    const rangeValidation = validateAvailableRange({
      start_available_at,
      end_available_at,
    });

    if (!rangeValidation.valid) {
      return res.status(400).json({
        error: rangeValidation.message,
      });
    }

    const technicianIds = normalizeTechnicianIds(technicianId);

    const locationFields = normalizeLocationFields({
      latitude,
      longitude,
      location_name,
    });

    const dateFields = normalizeDateFields({
      start_available_at,
      end_available_at,
    });

    const imageFiles = req.files?.images || [];
    const uploadedImages = await uploadImages(imageFiles, "techjob/jobs");

    // NEW IMAGE LOGIC: If a field for 'images' was provided but is empty,
    // it usually means we want to REPLACE or CLEAR them in PUT.
    // However, since we might want to ONLY clear if empty as per user request:
    const shouldClearImages =
      imageFiles.length === 0 && req.body.images === undefined;
    // Wait, the user said "If no images ... delete".
    // Usually if req.files.images is missing AND there's no mention of it in body,
    // it might be accidental. But if they EXPLICITLY send an update,
    // often frontends only send things they want to change.

    // I'll stick to: if zero uploaded AND it's a PUT update, we'll follow user's request.
    const isImageUpdate = req.files?.images !== undefined;

    const shouldUpdateAssignments =
      supervisorId !== undefined || technicianId !== undefined;

    let oldPublicIds = [];

    await prisma.$transaction(async (tx) => {
      // 1. Fetch old images if we are updating them
      if (isImageUpdate) {
        oldPublicIds = await getJobImagesPublicIds(tx, id);

        // 2. Clear old ones from DB
        await tx.$executeRaw`
          DELETE FROM "JobImage"
          WHERE "jobId" = ${id}
        `;
      }

      const updateFields = buildJobUpdateFields({
        title,
        description,
        status,
        location_name: locationFields.location_name,
        latitude: locationFields.latitude,
        longitude: locationFields.longitude,
        start_available_at: dateFields.start_available_at,
        end_available_at: dateFields.end_available_at,
        departmentId,
      });

      if (updateFields.length > 0) {
        await tx.$executeRaw`
            UPDATE "Job"
            SET ${Prisma.join(updateFields, ", ")}
            WHERE id = ${id}
        `;
      }

      if (shouldUpdateAssignments) {
        await updateAssignments({
          tx,
          jobId: id,
          supervisorId,
          technicianIds:
            technicianId !== undefined
              ? normalizeTechnicianIds(technicianId)
              : undefined,
        });
      }

      // 3. Insert new ones if any
      if (uploadedImages.length > 0) {
        await insertJobImages({
          tx,
          jobId: id,
          uploadedImages,
        });
      }
    });

    // 4. Cleanup Cloudinary AFTER transaction
    if (oldPublicIds.length > 0) {
      await deleteImages(oldPublicIds);
    }

    const rows = await prisma.$queryRaw`
      SELECT
        j.id,
        j.title,
        j.description,
        j.status,
        j."createdAt",
        j."updatedAt",
        j.start_available_at,
        j.end_available_at,
        j.latitude,
        j.longitude,
        j.location_name,

        d.id AS department_id,
        d.name AS department_name,

        cb.id AS created_by_id,
        cb.empno AS created_by_empno,
        cbp.firstname AS created_by_firstname,
        cbp.lastname AS created_by_lastname,

        ja.role AS assignment_role,
        au.id AS assignment_user_id,
        au.empno AS assignment_user_empno,
        ad.name AS assignment_department_name,
        ap.firstname AS assignment_user_firstname,
        ap.lastname AS assignment_user_lastname,

        ji.id AS image_id,
        ji.url AS image_url,
        ji."publicId" AS image_public_id,
        ji."createdAt" AS image_created_at,

        jr.id AS report_id,
        jr.status AS report_status,
        jr.detail AS report_detail,
        jr.summary AS report_summary,
        jr.repair_operations AS report_repair_operations,
        jr.inspection_results AS report_inspection_results,
        jr.cus_sign AS report_cus_sign,
        jr."rejectReason" AS report_reject_reason,
        jr.start_time AS report_start_time,
        jr.end_time AS report_end_time,
        jr."createdAt" AS report_created_at

      FROM "Job" j
      LEFT JOIN "Department" d
        ON d.id = j."departmentId"

      LEFT JOIN "User" cb
        ON cb.id = j."createdById"
      LEFT JOIN "Profile" cbp
        ON cbp."userId" = cb.id

      LEFT JOIN "JobAssignment" ja
        ON ja."jobId" = j.id
      LEFT JOIN "User" au
        ON au.id = ja."userId"
      LEFT JOIN "Profile" ap
        ON ap."userId" = au.id
      LEFT JOIN "Department" ad
        ON ad.id = au."departmentId"

      LEFT JOIN "JobImage" ji
        ON ji."jobId" = j.id

      LEFT JOIN "JobReport" jr
        ON jr."jobId" = j.id

      WHERE j.id = ${id}
    `;

    const formattedJob = mapJobDetailRows(rows, formatJobId);

    res.json({
      message: "อัปเดตใบงานสำเร็จ",
      job: formattedJob,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    res.status(500).json({
      error: message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Invalid job id",
      });
    }

    const existingJob = await prisma.$queryRaw`
      SELECT id
      FROM "Job"
      WHERE id = ${id}
    `;

    if (!existingJob.length) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    const oldPublicIds = await getJobImagesPublicIds(prisma, id);

    await prisma.$transaction(async (tx) => {
      await deleteJobRelations({
        tx,
        jobId: id,
      });

      await tx.$executeRaw`
        DELETE FROM "Job"
        WHERE id = ${id}
      `;
    });

    if (oldPublicIds.length > 0) {
      await deleteImages(oldPublicIds);
    }

    res.json({
      message: "ลบใบงานสำเร็จ",
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const rows = await prisma.$queryRaw`
      SELECT
        j.id,
        j.title,
        j.description,
        j.status,
        j."createdAt",
        j.start_available_at,
        j.end_available_at,
        j.location_name,

        ja.role AS assignment_role,
        au.id AS assignment_user_id,
        au.empno AS assignment_user_empno,
        ap.firstname AS assignment_user_firstname,
        ap.lastname AS assignment_user_lastname

      FROM "Job" j
      INNER JOIN "JobAssignment" myja
        ON myja."jobId" = j.id
      LEFT JOIN "JobAssignment" ja
        ON ja."jobId" = j.id
      LEFT JOIN "User" au
        ON au.id = ja."userId"
      LEFT JOIN "Profile" ap
        ON ap."userId" = au.id
      WHERE myja."userId" = ${userId}
      ORDER BY j."createdAt" DESC
    `;

    const formattedJobs = mapJobsRows(rows, formatJobId);

    res.json({
      message: "ดึงข้อมูลใบงานของฉันสำเร็จ",
      jobs: formattedJobs,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMyJobDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: jobIdOrSlug } = req.params;
    let jobId;

    // Handle JOB-0001 format
    if (typeof jobIdOrSlug === "string" && jobIdOrSlug.startsWith("JOB-")) {
      jobId = parseInt(jobIdOrSlug.split("-")[1]);
    } else {
      jobId = parseInt(jobIdOrSlug);
    }

    if (isNaN(jobId)) {
      return res.status(400).json({ message: "รูปแบบรหัสใบงานไม่ถูกต้อง" });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        assignments: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        department: true,
        createdBy: {
          include: {
            profile: true,
          },
        },
        assignments: {
          include: {
            user: {
              include: {
                profile: true,
                department: true,
              },
            },
          },
        },
        images: true,
        reports: {
          include: {
            images: true,
            itemUsages: {
              include: { item: true }
            },
            createdBy: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: "ไม่พบใบงานที่ได้รับมอบหมาย" });
    }

    // Transform to a clean, flat structure for the frontend
    const formattedJob = {
      id: job.id,
      JobId: formatJobId(job.id),
      title: job.title,
      description: job.description,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      start_available_at: job.start_available_at,
      end_available_at: job.end_available_at,

      department: job.department,

      createdBy: {
        id: job.createdBy.id,
        fullname:
          `${job.createdBy.profile?.firstname || ""} ${job.createdBy.profile?.lastname || ""}`.trim(),
      },

      supervisor: job.assignments.find((a) => a.role === "SUPERVISOR")
        ? {
            id: job.assignments.find((a) => a.role === "SUPERVISOR").user.id,
            fullname:
              `${job.assignments.find((a) => a.role === "SUPERVISOR").user.profile?.firstname || ""} ${job.assignments.find((a) => a.role === "SUPERVISOR").user.profile?.lastname || ""}`.trim(),
            department: job.assignments.find((a) => a.role === "SUPERVISOR")
              .user.department?.name,
            role: "SUPERVISOR",
          }
        : null,

      technicians: job.assignments
        .filter((a) => a.role === "TECHNICIAN")
        .map((a) => ({
          id: a.user.id,
          fullname:
            `${a.user.profile?.firstname || ""} ${a.user.profile?.lastname || ""}`.trim(),
          department: a.user.department?.name,
          role: "TECHNICIAN",
        })),

      assignments: job.assignments.map((a) => ({
        id: a.user.id,
        fullname:
          `${a.user.profile?.firstname || ""} ${a.user.profile?.lastname || ""}`.trim(),
        role: a.role,
        department: a.user.department?.name,
      })),

      images: job.images,

      reports: job.reports.map((r) => ({
        id: r.id,
        status: r.status,
        start_time: r.start_time,
        end_time: r.end_time,
        detail: r.detail,
        repairOperations: r.repair_operations,
        inspectionResults: r.inspection_results,
        summaryOfOperatingResults: r.summary,
        customerSignature: r.cus_sign,
        rejectReason: r.rejectReason,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        images: r.images,
        reportedBy: {
          id: r.createdBy?.id,
          fullname:
            `${r.createdBy?.profile?.firstname || ""} ${r.createdBy?.profile?.lastname || ""}`.trim(),
        },
      })),

      latitude: job.latitude,
      longitude: job.longitude,
      location_name: job.location_name,

      loc: {
        lat: job.latitude,
        lng: job.longitude,
      },
      customer: {
        address: job.location_name || "ไม่ระบุสถานที่",
      },
      location: {
        latitude: job.latitude,
        longitude: job.longitude,
        location_name: job.location_name,
      },
      // Backward compatibility
      technicianReport: job.reports[0]
        ? {
            id: job.reports[0].id,
            status: job.reports[0].status,
            start_time: job.reports[0].start_time,
            end_time: job.reports[0].end_time,
            detail: job.reports[0].detail,
            repairOperations: job.reports[0].repair_operations,
            inspectionResults: job.reports[0].inspection_results,
            summaryOfOperatingResults: job.reports[0].summary,
            customerSignature: job.reports[0].cus_sign,
            createdAt: job.reports[0].createdAt,
            reportedBy: {
              id: job.reports[0].createdBy?.id,
              fullname:
                `${job.reports[0].createdBy?.profile?.firstname || ""} ${job.reports[0].createdBy?.profile?.lastname || ""}`.trim(),
            },
            images: job.reports[0].images,
          }
        : null,
    };

    res.json({
      message: "ดึงรายละเอียดงานสำเร็จ",
      job: formattedJob,
    });
  } catch (error) {
    console.error("getMyJobDetail error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

/**
 * อัปเดตสถานะงานโดย Technician (งานที่ตนเองได้รับมอบหมายเท่านั้น)
 */
export const updateMyJobStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: jobIdOrSlug } = req.params;
    const { status } = req.body;
    let jobId;

    if (typeof jobIdOrSlug === "string" && jobIdOrSlug.startsWith("JOB-")) {
      jobId = parseInt(jobIdOrSlug.split("-")[1]);
    } else {
      jobId = parseInt(jobIdOrSlug);
    }

    if (isNaN(jobId)) {
      return res.status(400).json({ message: "รูปแบบรหัสใบงานไม่ถูกต้อง" });
    }

    // Check if the job is assigned to this user
    const assignment = await prisma.jobAssignment.findFirst({
      where: {
        jobId: jobId,
        userId: userId,
      },
    });

    if (!assignment) {
      return res
        .status(403)
        .json({ message: "คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขงานนี้" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    // Automatically record start_time when state changes to IN_PROGRESS
    if (status === "IN_PROGRESS" || status === "กำลังทำงาน") {
      const existingReport = await prisma.jobReport.findFirst({
        where: {
          jobId: jobId,
          createdById: userId,
        },
      });

      if (existingReport) {
        if (!existingReport.start_time) {
          await prisma.jobReport.update({
            where: { id: existingReport.id },
            data: {
              start_time: new Date(),
              status: "IN_PROGRESS",
            },
          });
        }
      } else {
        await prisma.jobReport.create({
          data: {
            jobId: jobId,
            createdById: userId,
            status: "IN_PROGRESS",
            start_time: new Date(),
          },
        });
      }
    }

    res.json({
      message: "อัปเดตสถานะงานสำเร็จ",
      job: updatedJob,
    });
  } catch (error) {
    console.error("updateMyJobStatus error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getJobsWithLocation = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        assignments: {
          where: { role: "TECHNICIAN" },
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
        reports: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const result = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      status: job.status,
      lat: job.latitude,
      lng: job.longitude,
      location_name: job.location_name,
      reports: job.reports,
      technicians: job.assignments.map((a) => ({
        id: a.user.id,
        name: `${a.user.profile?.firstname ?? ""} ${a.user.profile?.lastname ?? ""}`.trim(),
        phone: a.user.profile?.phone ?? "-",
      })),
    }));

    res.json({ jobs: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs with location" });
  }
};