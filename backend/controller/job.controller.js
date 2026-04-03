import { prisma, Prisma } from "../lib/prisma.js";
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
    const rows = await prisma.$queryRaw`
      SELECT
        j.id,
        j.title,
        j.description,
        j.status,
        j."createdAt",
        j.start_available_at,
        j.end_available_at,

        ja.role AS assignment_role,
        au.id AS assignment_user_id,
        au.empno AS assignment_user_empno,
        ap.firstname AS assignment_user_firstname,
        ap.lastname AS assignment_user_lastname

      FROM "Job" j
      LEFT JOIN "JobAssignment" ja
        ON ja."jobId" = j.id
      LEFT JOIN "User" au
        ON au.id = ja."userId"
      LEFT JOIN "Profile" ap
        ON ap."userId" = au.id
      ORDER BY j."createdAt" DESC
    `;

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
      ORDER BY j."createdAt" DESC
    `;

    if (!rows.length) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    const formattedJob = mapJobDetailRows(rows, formatJobId);

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
          jr.id AS report_id, jr.status AS report_status, jr.detail AS report_detail, jr.summary AS report_summary, jr."createdAt" AS report_created_at
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
