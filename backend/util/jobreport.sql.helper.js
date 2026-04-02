export const formatReportWithImages = (rows) => {
  if (!rows || rows.length === 0) return null;

  const report = {
    id: rows[0].id,
    jobId: rows[0].jobId,
    status: rows[0].status,
    start_time: rows[0].start_time,
    end_time: rows[0].end_time,
    detail: rows[0].detail,
    repair_operations: rows[0].repair_operations,
    inspection_results: rows[0].inspection_results,
    summary: rows[0].summary,
    cus_sign: rows[0].cus_sign,
    createdAt: rows[0].createdAt,
    updatedAt: rows[0].updatedAt,
    images: [],
  };

  rows.forEach((row) => {
    if (row.image_id) {
      report.images.push({
        id: row.image_id,
        url: row.image_url,
        createdAt: row.image_created_at,
      });
    }
  });

  return report;
};