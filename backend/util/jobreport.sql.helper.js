export const mapJobReportDetailRows = (rows = []) => {
  if (!rows.length) return null;

  const firstRow = rows[0];

  return {
    id: firstRow.id,
    jobId: firstRow.jobId,
    status: firstRow.status,
    start_time: firstRow.start_time,
    end_time: firstRow.end_time,
    detail: firstRow.detail,
    repair_operations: firstRow.repair_operations,
    inspection_results: firstRow.inspection_results,
    summary: firstRow.summary,
    cus_sign: firstRow.cus_sign,
    createdById: firstRow.createdById,
    createdAt: firstRow.createdAt,
    updatedAt: firstRow.updatedAt,

    reportedBy: firstRow.report_user_id
      ? {
          id: firstRow.report_user_id,
          empno: firstRow.report_user_empno,
          name: [
            firstRow.report_user_firstname,
            firstRow.report_user_lastname,
          ]
            .filter(Boolean)
            .join(" "),
        }
      : null,

    job: firstRow.job_id
      ? {
          id: firstRow.job_id,
          JobId: `JOB-${String(firstRow.job_id).padStart(4, "0")}`,
          title: firstRow.job_title,
          description: firstRow.job_description,
          status: firstRow.job_status,
          start_available_at: firstRow.start_available_at,
          end_available_at: firstRow.end_available_at,
          location: {
            latitude: firstRow.latitude,
            longitude: firstRow.longitude,
            location_name: firstRow.location_name,
          },
          department: firstRow.department_name,
          createdBy: firstRow.created_by_id
            ? {
                id: firstRow.created_by_id,
                empno: firstRow.created_by_empno,
                name: [
                  firstRow.created_by_firstname,
                  firstRow.created_by_lastname,
                ]
                  .filter(Boolean)
                  .join(" "),
              }
            : null,
        }
      : null,

    images: rows
      .filter((row) => row.image_id)
      .map((row) => ({
        id: row.image_id,
        url: row.image_url,
        publicId: row.image_public_id ?? null,
        createdAt: row.image_created_at,
      })),
  };
};

export const mapJobReportListRows = (rows = []) => {
  const reportsMap = new Map();

  for (const row of rows) {
    if (!reportsMap.has(row.id)) {
      reportsMap.set(row.id, {
        id: row.id,
        jobId: row.jobId,
        status: row.status,
        start_time: row.start_time,
        end_time: row.end_time,
        detail: row.detail,
        repair_operations: row.repair_operations,
        inspection_results: row.inspection_results,
        summary: row.summary,
        cus_sign: row.cus_sign,
        createdById: row.createdById,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,

        reportedBy: row.report_user_id
          ? {
              id: row.report_user_id,
              empno: row.report_user_empno,
              name: [
                row.report_user_firstname,
                row.report_user_lastname,
              ]
                .filter(Boolean)
                .join(" "),
            }
          : null,

        job: row.job_id
          ? {
              id: row.job_id,
              JobId: `JOB-${String(row.job_id).padStart(4, "0")}`,
              title: row.job_title,
              description: row.job_description ?? null,
              status: row.job_status,
              department: row.department_name ?? null,
            }
          : null,

        images: [],
      });
    }

    if (row.image_id) {
      reportsMap.get(row.id).images.push({
        id: row.image_id,
        url: row.image_url,
        publicId: row.image_public_id ?? null,
        createdAt: row.image_created_at,
      });
    }
  }

  return Array.from(reportsMap.values());
};

export const buildReportUpdateQueryInput = ({
  status,
  start_time,
  end_time,
  detail,
  repair_operations,
  inspection_results,
  summary,
  uploadedSignature,
}) => {
  return {
    status: status ?? null,

    hasStartTime: start_time !== undefined,
    start_time: start_time ? new Date(start_time) : null,

    hasEndTime: end_time !== undefined,
    end_time: end_time ? new Date(end_time) : null,

    hasDetail: detail !== undefined,
    detail: detail ?? null,

    hasRepairOperations: repair_operations !== undefined,
    repair_operations: repair_operations ?? null,

    hasInspectionResults: inspection_results !== undefined,
    inspection_results: inspection_results ?? null,

    hasSummary: summary !== undefined,
    summary: summary ?? null,

    hasSignature: Boolean(uploadedSignature?.url),
    cus_sign: uploadedSignature?.url ?? null,
  };
};

export const validateReportTimeRange = ({ start_time, end_time }) => {
  if (start_time && Number.isNaN(new Date(start_time).getTime())) {
    return {
      valid: false,
      message: "start_time ไม่ถูกต้อง",
    };
  }

  if (end_time && Number.isNaN(new Date(end_time).getTime())) {
    return {
      valid: false,
      message: "end_time ไม่ถูกต้อง",
    };
  }

  if (start_time && end_time) {
    const start = new Date(start_time);
    const end = new Date(end_time);

    if (end < start) {
      return {
        valid: false,
        message: "เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น",
      };
    }
  }

  return { valid: true };
};

export const insertReportImages = async ({ tx, reportId, uploadedImages = [] }) => {
  if (!uploadedImages.length) return;

  for (const img of uploadedImages) {
    await tx.$queryRaw`
      INSERT INTO "ReportImage" (
        url,
        "publicId",
        "reportId",
        "createdAt"
      )
      VALUES (
        ${img.url},
        ${img.publicId ?? null},
        ${reportId},
        NOW()
      );
    `;
  }
};