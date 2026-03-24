import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../util/cloudinaryUpload.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json({ message: "ดึงข้อมูลใบงานสําเร็จ", jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, supervisorId, technicianId, departmentId } = req.body;

    // validation
    if (!title) return res.status(400).json({ message: "กรุณากรอกชื่องาน" });
    if (!departmentId) return res.status(400).json({ message: "กรุณาเลือกแผนก" });

    const job = await prisma.job.create({
      data: {
        title,
        description,
        status: "PENDING",
        department: {
          connect: { id: Number(departmentId) } // เชื่อมโยงกับ ID แผนกที่มีอยู่แล้ว
        },
        createdBy: {
          connect: {id: 3}
        },
        assignment:{
          create: [
            // ถ้ามี supervisorId ส่งมา ให้สร้าง record ใน JobAssignment
            ...(supervisorId ? [{
              userId: Number(supervisorId),
              role: "SUPERVISOR"
            }] : []),
            // ถ้ามี technicianId ส่งมา ให้สร้าง record ใน JobAssignment
            ...(technicianId ? [{
              userId: Number(technicianId),
              role: "TECHNICIAN"
            }] : [])
          ]
        }
      },
      include: {
        department: true,
        assignment: {
          include: { 
            user: {
              select: { empno: true, profile: true}
            }
          }
        }
      }
    });

    res.json({ message: "สร้างใบงานสำเร็จ", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
