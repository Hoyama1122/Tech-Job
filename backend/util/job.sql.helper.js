import { prisma, Prisma } from "../lib/prisma.js";
import { getFullName } from "./job.helper.js";


/**
 * map rows จาก SQL join -> jobs list
 * ใช้กับ getJobs / getMyJobs
 */
export const mapJobsRows = (rows = [], formatJobId) => {
  const jobsMap = new Map();

  for (const row of rows) {
    if (!jobsMap.has(row.id)) {
      jobsMap.set(row.id, {
        id: row.id,
        JobId: formatJobId(row.id),
        title: row.title,
        description: row.description,
        status: row.status,
        start_available_at: row.start_available_at,
        end_available_at: row.end_available_at,
        createdAt: row.createdAt,
        location_name: row.location_name,
        latitude: row.latitude,
        longitude: row.longitude,
        customer: {
            address: row.location_name || "ไม่ระบุสถานที่"
        },
        category: row.department_name || "ไม่ระบุ",
        supervisor: null,
        technicians: [], // del
      });
    }

    const job = jobsMap.get(row.id);

    if (!row.assignment_user_id || !row.assignment_role) continue;

    const fullName = getFullName(
      row.assignment_user_firstname,
      row.assignment_user_lastname
    );

    if (row.assignment_role === "SUPERVISOR") {
      job.supervisor = {
        id: row.assignment_user_id,
        name: fullName,
      };
    }

    if (row.assignment_role === "TECHNICIAN") {
      const exists = job.technicians.some(
        (tech) => tech.id === row.assignment_user_id
      );

      if (!exists) {
        job.technicians.push({
          id: row.assignment_user_id,
          name: fullName,
          phone: row.assignment_user_phone,
        });
      }
    }
  }

  return Array.from(jobsMap.values());
};

/**
 * map rows จาก SQL join -> job detail
 */
export const mapJobDetailRows = (rows = [], formatJobId) => {
  if (!rows.length) return null;

  const first = rows[0];

  const job = {
    id: first.id,
    JobId: formatJobId(first.id),
    title: first.title,
    description: first.description,
    status: first.status,
    createdAt: first.createdAt,
    updatedAt: first.updatedAt,

    start_available_at: first.start_available_at,
    end_available_at: first.end_available_at,

    location: {
      latitude: first.latitude,
      longitude: first.longitude,
      location_name: first.location_name,
    },

    department: first.department_id
      ? {
          id: first.department_id,
          name: first.department_name,
        }
      : null,

    createdBy: first.created_by_id
      ? {
          id: first.created_by_id,
          name: getFullName(
            first.created_by_firstname,
            first.created_by_lastname
          )
        }
      : null,

    supervisor: null,
    technicians: [],
    images: [],
    reports: [],
  };

  const technicianMap = new Map();
  const imageMap = new Map();
  const reportMap = new Map();

  for (const row of rows) {
    if (row.assignment_user_id && row.assignment_role) {
      const fullName = getFullName(
        row.assignment_user_firstname,
        row.assignment_user_lastname
      );

      if (row.assignment_role === "SUPERVISOR") {
        job.supervisor = {
          id: row.assignment_user_id,
          name: fullName,
          department: row.assignment_department_name || null,
        };
      }

      if (row.assignment_role === "TECHNICIAN") {
        if (!technicianMap.has(row.assignment_user_id)) {
          technicianMap.set(row.assignment_user_id, {
            id: row.assignment_user_id,
            name: fullName,
            department: row.assignment_department_name || null,
          });
        }
      }
    }

    if (row.image_id && !imageMap.has(row.image_id)) {
      imageMap.set(row.image_id, {
        id: row.image_id,
        url: row.image_url,
        publicId: row.image_public_id,
        createdAt: row.image_created_at,
      });
    }

    if (row.report_id && !reportMap.has(row.report_id)) {
      reportMap.set(row.report_id, {
        id: row.report_id,
        status: row.report_status,
        detail: row.report_detail,
        summary: row.report_summary,
        repair_operations: row.report_repair_operations,
        inspection_results: row.report_inspection_results,
        cus_sign: row.report_cus_sign,
        rejectReason: row.report_reject_reason,
        start_time: row.report_start_time,
        end_time: row.report_end_time,
        createdAt: row.report_created_at,
      });
    }
  }

  job.technicians = Array.from(technicianMap.values());
  job.images = Array.from(imageMap.values());
  job.reports = Array.from(reportMap.values());

  return job;
};

/**
 * สร้าง dynamic update fields
 */
export const buildJobUpdateFields = ({
  title,
  description,
  status,
  location_name,
  latitude,
  longitude,
  start_available_at,
  end_available_at,
  departmentId,
}) => {
  const fields = [];

  if (title !== undefined && title !== null && title !== "" ) {
    fields.push(Prisma.sql`title = ${title}`);
  }

  if (description !== undefined && description !== null && description !== "" ) {
    fields.push(Prisma.sql`description = ${description}`);
  }

  if (status !== undefined && status !== null && status !== "" ) {
    fields.push(Prisma.sql`status = ${status}`);
  }

  if (location_name !== undefined && location_name !== null && location_name !== "") {
    fields.push(Prisma.sql`location_name = ${location_name}`);
  }

  if (latitude !== undefined && latitude !== null && latitude !== "") {
    fields.push(Prisma.sql`latitude = ${latitude}`);
  }

  if (longitude !== undefined && longitude !== null && longitude !== "") {
    fields.push(Prisma.sql`longitude = ${longitude}`);
  }

  if (start_available_at !== undefined && start_available_at !== null && start_available_at !== "") {
    fields.push(Prisma.sql`start_available_at = ${start_available_at}`);
  }

  if (end_available_at !== undefined && end_available_at !== null && end_available_at !== "") {
    fields.push(Prisma.sql`end_available_at = ${end_available_at}`);
  }

  if (departmentId !== undefined && departmentId !== "") {
    fields.push(Prisma.sql`"departmentId" = ${Number(departmentId)}`);
  }

  fields.push(Prisma.sql`"updatedAt" = NOW()`);

  return fields;
};

export const insertAssignments = async ({
  tx,
  jobId,
  supervisorId,
  technicianIds = [],
}) => {
  if (supervisorId !== undefined && supervisorId !== null && supervisorId !== "") {
    await tx.$executeRaw`
      INSERT INTO "JobAssignment" ("jobId", "userId", role)
      VALUES (${jobId}, ${Number(supervisorId)}, 'SUPERVISOR')
    `;
  }

  for (const technicianId of technicianIds) {
    await tx.$executeRaw`
      INSERT INTO "JobAssignment" ("jobId", "userId", role)
      VALUES (${jobId}, ${Number(technicianId)}, 'TECHNICIAN')
    `;
  }
};

export const updateAssignments = async ({
  tx,
  jobId,
  supervisorId,
  technicianIds,
}) => {
  if (supervisorId !== undefined) {
    await tx.$executeRaw`
      DELETE FROM "JobAssignment"
      WHERE "jobId" = ${jobId}
      AND role = 'SUPERVISOR'
    `;

    if (supervisorId !== null && supervisorId !== "") {
      await tx.$executeRaw`
        INSERT INTO "JobAssignment" ("jobId", "userId", role)
        VALUES (${jobId}, ${Number(supervisorId)}, 'SUPERVISOR')
      `;
    }
  }

  if (technicianIds !== undefined) {
    await tx.$executeRaw`
      DELETE FROM "JobAssignment"
      WHERE "jobId" = ${jobId}
      AND role = 'TECHNICIAN'
    `;

    for (const technicianId of technicianIds) {
      await tx.$executeRaw`
        INSERT INTO "JobAssignment" ("jobId", "userId", role)
        VALUES (${jobId}, ${Number(technicianId)}, 'TECHNICIAN')
      `;
    }
  }
};


export const insertJobImages = async ({
  tx,
  jobId,
  uploadedImages = [],
}) => {
  if (!uploadedImages || uploadedImages.length === 0) return;

  for (const image of uploadedImages) {
    // Ensure we don't pass undefined to SQL
    const imageUrl = image.url || null;
    const publicId = image.publicId || null;

    if (!jobId || !imageUrl) continue;

    await tx.$executeRaw`
      INSERT INTO "JobImage" ("jobId", "url", "publicId", "createdAt")
      VALUES (${Number(jobId)}, ${imageUrl}, ${publicId}, NOW())
    `;
  }
};

export const deleteJobRelations = async ({ tx, jobId }) => {
  await tx.$executeRaw`
    DELETE FROM "JobAssignment"
    WHERE "jobId" = ${jobId}
  `;

  await tx.$executeRaw`
    DELETE FROM "JobImage"
    WHERE "jobId" = ${jobId}
  `;

  await tx.$executeRaw`
    DELETE FROM "JobReport"
    WHERE "jobId" = ${jobId}
  `;
};

export const getJobImagesPublicIds = async (prismaInstance, jobId) => {
  const images = await prismaInstance.$queryRaw`
    SELECT "publicId"
    FROM "JobImage"
    WHERE "jobId" = ${jobId}
  `;
  return images.map((img) => img.publicId).filter(Boolean);
};