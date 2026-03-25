import { prisma } from "../lib/prisma.js";
import { uploadImages } from "../util/upload.helper.js";
import { formatJobId, getFullName } from "../util/job.helper.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        start_available_at: true,
        end_available_at: true,

        createdBy: {
          select: {
            id: true,
            empno: true,
            profile: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },

        assignment: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                empno: true,
                profile: {
                  select: {
                    firstname: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedJobs = jobs.map((job) => {
      const supervisor = job.assignment.find((a) => a.role === "SUPERVISOR");

      const technicians = job.assignment.filter((a) => a.role === "TECHNICIAN");

      return {
        id: job.id,
        JobId: formatJobId(job.id),
        title: job.title,
        description: job.description,
        status: job.status,
        start_available_at: job.start_available_at,
        end_available_at: job.end_available_at,
        createdAt: job.createdAt,
        supervisor: supervisor
          ? {
              id: supervisor.user.id,
              name: getFullName(supervisor.user),
            }
          : null,

        technicians: technicians.map((tech) => ({
          id: tech.user.id,
          name: getFullName(tech.user),
        })),
      };
    });

    res.json({
      message: "ดึงข้อมูลใบงานสำเร็จ",
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("getJobs error:", error);
    res.status(500).json({
      error: error.message,
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
            department: true,
          },
        },
        assignment: {
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
        reports: true,
      },
    });

    if (!job) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    const supervisor = job.assignment.find((a) => a.role === "SUPERVISOR");
    const technicians = job.assignment.filter((a) => a.role === "TECHNICIAN");

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

      location: {
        latitude: job.latitude,
        longitude: job.longitude,
        location_name: job.location_name,
      },

      department: job.department,

      createdBy: {
        id: job.createdBy.id,
        name: getFullName(job.createdBy),
        department: job.createdBy.department?.name,
      },

      supervisor: supervisor
        ? {
            id: supervisor.user.id,
            name: getFullName(supervisor.user),
            department: supervisor.user.department?.name,
          }
        : null,

      technicians: technicians.map((tech) => ({
        id: tech.user.id,
        name: getFullName(supervisor.user),
        department: tech.user.department?.name,
      })),

      images: job.images.map((image) => ({
        id: image.Id,
        url: image.url,
        publicId: image.publicId,
        createdAt: image.createdAt,
      })),

      reports: job.reports,
    };

    res.json({
      message: "ดึงข้อมูลใบงานสำเร็จ",
      job: formattedJob,
    });
  } catch (error) {
    res.status(500).json({ error: error });
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

    // validation
    if (!title) return res.status(400).json({ message: "กรุณากรอกชื่องาน" });
    if (!departmentId)
      return res.status(400).json({ message: "กรุณาเลือกแผนก" });

    if (
      start_available_at &&
      end_available_at &&
      new Date(end_available_at) < new Date(start_available_at)
    ) {
      return res.status(400).json({
        message: "วันเวลาสิ้นสุดต้องมากกว่าหรือเท่ากับวันเวลาเริ่มต้น",
      });
    }
    const imageFiles = req.files?.images || [];

    const uploadedImages = await uploadImages(
          imageFiles,
          "techjob/job-reports"
    );

    const job = await prisma.job.create({
      data: {
        title,
        description,
        status: "PENDING",

        start_available_at: start_available_at
          ? new Date(start_available_at)
          : null,

        end_available_at: end_available_at ? new Date(end_available_at) : null,

        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        location_name: location_name || null,

        department: {
          connect: { id: Number(departmentId) }, // เชื่อมโยงกับ ID แผนกที่มีอยู่แล้ว
        },
        createdBy: {
          connect: { id: 3 },
        },
        assignment: {
          create: [
            // ถ้ามี supervisorId ส่งมา ให้สร้าง record ใน JobAssignment
            ...(supervisorId
              ? [
                  {
                    userId: Number(supervisorId),
                    role: "SUPERVISOR",
                  },
                ]
              : []),
            // ถ้ามี technicianId ส่งมา ให้สร้าง record ใน JobAssignment
            ...(technicianId
              ? [
                  {
                    userId: Number(technicianId),
                    role: "TECHNICIAN",
                  },
                ]
              : []),
          ],
        },
          images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
          })),
        },
      },
      include: {
        department: true,
        images: true,
        assignment: {
          include: {
            user: {
              select: { empno: true, profile: true },
            },
          },
        },
      },
    });

    res.json({ message: "สร้างใบงานสำเร็จ", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    } = req.body;

    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingJob) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    if (
      start_available_at &&
      end_available_at &&
      new Date(end_available_at) < new Date(start_available_at)
    ) {
      return res.status(400).json({
        error: "วันเวลาสิ้นสุดต้องมากกว่าหรือเท่ากับวันเวลาเริ่มต้น",
      });
    }

    const imageFiles = req.files?.images || [];

    const uploadedImages = await uploadImages(
      imageFiles,
      "techjob/jobs"
    );

    const data = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(location_name !== undefined && { location_name }),

      ...(latitude !== undefined && {
        latitude: latitude === "" ? null : Number(latitude),
      }),

      ...(longitude !== undefined && {
        longitude: longitude === "" ? null : Number(longitude),
      }),

      ...(start_available_at !== undefined && {
        start_available_at: start_available_at
          ? new Date(start_available_at)
          : null,
      }),

      ...(end_available_at !== undefined && {
        end_available_at: end_available_at ? new Date(end_available_at) : null,
      }),

      ...(departmentId !== undefined &&
        departmentId !== "" && {
          department: {
            connect: { id: Number(departmentId) },
          },
        }),
      ...(uploadedImages.length > 0 && {
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId
          })),
        },
      }),
    };

    const job = await prisma.job.update({
      where: { id },
      data,
      include: {
        department: true,
        images: true,
        assignment: {
          include: {
            user: {
              include: {
                profile: true,
                department: true,
              },
            },
          },
        },
      },
    });

    res.json({
      message: "อัปเดตใบงานสำเร็จ",
      job,
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

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        error: "ไม่พบใบงาน",
      });
    }

    await prisma.job.delete({
      where: { id },
    });

    res.json({
      message: "ลบใบงานสำเร็จ",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: {
        assignment: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        assignment: true,
        department: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};