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
    const { title, description, supervisorId, technicianId } = req.body;

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
          connect: {id: 2}
        },
        assignment:{
          create: [
            
          ]
        }
      },
      include: {
        department:true
      }
    });

    res.json({ message: "สร้างใบงานสำเร็จ", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
