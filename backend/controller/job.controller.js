import { prisma } from "../lib/prisma.js";

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
    res.json({message:"ดึงข้อมูลใบงานสําเร็จ",jobs});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const craeteJob = async (req, res) => {
  try {
    const { title, description, departmentId } = req.body;
    if (!title) return res.status(400).json({ message: "กรุณากรอกชื่องาน" });
    if (!departmentId)
      return res.status(400).json({ message: "กรุณาเลือกแผนก" });

    const job = await prisma.job.create({
      data: {
        title,
        description,
        departmentId,
      },
    });
    res.json({ message: "สร้างใบงานสำเร็จ", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
