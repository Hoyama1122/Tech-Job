import { uploadImages, uploadSingleImage } from "../util/upload.helper.js";
import { prisma } from "../lib/prisma.js";
import { getFullName } from "../util/job.helper.js";

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

    const report = await prisma.jobReport.create({
      data: {
        jobId: Number(jobId),
        status,
        start_time: start_time ? new Date(start_time) : null,
        end_time: end_time ? new Date(end_time) : null,
        detail,
        repair_operations,
        inspection_results,
        summary,
        cus_sign: uploadedSignature?.url,

        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    res.json({
      message: "สร้างรายงานสำเร็จ",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getJobReports = async (req, res) => {
  try {
    const reports = await prisma.jobReport.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      jobId: report.jobId,

      status: report.status,
      start_time: report.start_time,
      end_time: report.end_time,

      detail: report.detail,
      repair_operations: report.repair_operations,
      inspection_results: report.inspection_results,
      summary: report.summary,

      cus_sign: report.cus_sign,

      createdAt: report.createdAt,
      updatedAt: report.updatedAt,

      job: {
        id: report.job.id,
        title: report.job.title,
        status: report.job.status,
        department: report.job.department?.name,
      },

      images: report.images.map((image) => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt,
      })),
    }));

    res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      reports: formattedReports,
    });
  } catch (error) {
    console.error("getJobReports error:", error);
    res.status(500).json({
      error: error.message,
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

    const report = await prisma.jobReport.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            department: true,
            createdBy: {
              include: {
                profile: true,
              },
            },
          },
        },
        images: true,
      },
    });

    if (!report) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    const formattedReport = {
      id: report.id,
      jobId: report.jobId,
      status: report.status,

      start_time: report.start_time,
      end_time: report.end_time,

      detail: report.detail,
      repair_operations: report.repair_operations,
      inspection_results: report.inspection_results,
      summary: report.summary,

      cus_sign: report.cus_sign,

      createdAt: report.createdAt,
      updatedAt: report.updatedAt,

      job: {
        id: report.job.id,
        JobId: `JOB-${String(report.job.id).padStart(4, "0")}`,
        title: report.job.title,
        description: report.job.description,
        status: report.job.status,

        start_available_at: report.job.start_available_at,
        end_available_at: report.job.end_available_at,

        location: {
          latitude: report.job.latitude,
          longitude: report.job.longitude,
          location_name: report.job.location_name,
        },

        department: report.job.department?.name,

        createdBy: report.job.createdBy
          ? {
              id: report.job.createdBy.id,
              name: getFullName(job.createdBy),
            }
          : null,
      },

      images: report.images.map((image) => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt,
      })),
    };

    res.json({
      message: "ดึงข้อมูลรายงานสำเร็จ",
      report: formattedReport,
    });
  } catch (error) {
    console.error("getJobReportById error:", error);
    res.status(500).json({
      error: error.message,
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

    const existingReport = await prisma.jobReport.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!existingReport) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    if (start_time && end_time && new Date(end_time) < new Date(start_time)) {
      return res.status(400).json({
        error: "เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น",
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

    const data = {
      ...(status !== undefined && { status }),
      ...(start_time !== undefined && {
        start_time: start_time ? new Date(start_time) : null,
      }),
      ...(end_time !== undefined && {
        end_time: end_time ? new Date(end_time) : null,
      }),
      ...(detail !== undefined && { detail }),
      ...(repair_operations !== undefined && { repair_operations }),
      ...(inspection_results !== undefined && { inspection_results }),
      ...(summary !== undefined && { summary }),
      ...(uploadedSignature?.url && { cus_sign: uploadedSignature.url }),
      ...(uploadedImages.length > 0 && {
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
          })),
        },
      }),
    };

    const report = await prisma.jobReport.update({
      where: { id },
      data,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        images: true,
      },
    });

    if (status) {
      await prisma.job.update({
        where: { id: report.jobId },
        data: {
          status,
        },
      });
    }

    res.json({
      message: "อัปเดตรายงานสำเร็จ",
      report: {
        id: report.id,
        jobId: report.jobId,
        status: report.status,
        start_time: report.start_time,
        end_time: report.end_time,
        detail: report.detail,
        repair_operations: report.repair_operations,
        inspection_results: report.inspection_results,
        summary: report.summary,
        cus_sign: report.cus_sign,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        job: report.job,
        images: report.images.map((image) => ({
          id: image.id,
          url: image.url,
          createdAt: image.createdAt,
        })),
      },
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

    const report = await prisma.jobReport.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!report) {
      return res.status(404).json({
        error: "ไม่พบรายงาน",
      });
    }

    // ลบรูปจาก cloudinary
    await Promise.all(
      report.images.map(async (image) => {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      })
    );

    // ลบ report (cascade จะลบ images ให้อัตโนมัติ)
    await prisma.jobReport.delete({
      where: { id },
    });

    res.json({
      message: "ลบรายงานสำเร็จ",
    });
  } catch (error) {
    console.error("deleteJobReport error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};
export const approveJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid report id" });
    }

    const report = await prisma.jobReport.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({ error: "ไม่พบรายงาน" });
    }

    const updatedReport = await prisma.jobReport.update({
      where: { id },
      data: {
        status: "APPROVED",
      },
    });

    // อัปเดต job ด้วย
    await prisma.job.update({
      where: { id: report.jobId },
      data: {
        status: "COMPLETED",
      },
    });

    res.json({
      message: "อนุมัติรายงานสำเร็จ",
      report: updatedReport,
    });
  } catch (error) {
    console.error("approveJobReport error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const rejectJobReport = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { reason } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Invalid report id" });
    }

    const report = await prisma.jobReport.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({ error: "ไม่พบรายงาน" });
    }

    const updatedReport = await prisma.jobReport.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectReason: reason || null, 
      },
    });

   
    await prisma.job.update({
      where: { id: report.jobId },
      data: {
        status: "IN_PROGRESS",
      },
    });

    res.json({
      message: "ปฏิเสธรายงานสำเร็จ",
      report: updatedReport,
    });
  } catch (error) {
    console.error("rejectJobReport error:", error);
    res.status(500).json({ error: error.message });
  }
};
