"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AppLoader } from "@/store/AppLoader"; // ใช้ Store ที่โหลดข้อมูลตอนเริ่ม
import { useAuthStore } from "@/store/useAuthStore"; // ใช้ Store เพื่อเอา department ของ super
import { Users } from "@/lib/Mock/UserMock"; // ใช้ Type
import { CardWorkTypes } from "@/lib/Mock/CardWork";
import AssignTechnicianModal from "./AssignTechnicianModal"; // Modal ที่จะสร้างถัดไป
import { toast } from "react-toastify";
import { Loader2, UserPlus } from "lucide-react";

// สร้าง Type สำหรับ User และ Job (อาจจะดึงมาจากที่อื่น)
type User = typeof Users[0];
type Job = CardWorkTypes;

const AssignJobsClient = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State สำหรับ Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ดึงข้อมูล Supervisor ที่กำลัง login
    const supervisorDepartment = useAuthStore((state) => state.department);

  // 1. โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    try {
      const jobsData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (jobsData) {
        setAllJobs(JSON.parse(jobsData));
      }
      if (usersData) {
        setAllTechnicians(JSON.parse(usersData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. กรองเฉพาะงานที่ "รอการมอบหมายงาน"
  const unassignedJobs = useMemo(() => {
    return allJobs.filter((job) => job.status === "รอการมอบหมายงาน");
  }, [allJobs]);

  // 3. กรองช่างเฉพาะที่อยู่ในแผนกเดียวกับ Supervisor
  const availableTechnicians = useMemo(() => {
    return allTechnicians.filter(
      (user) =>
        user.role === "technician" &&
        user.department === supervisorDepartment
    );
  }, [allTechnicians, supervisorDepartment]);

  // 4. ฟังก์ชันสำหรับยืนยันการมอบหมายงาน
  const handleAssignJob = (jobId: string, technicianIds: number[]) => {
    if (technicianIds.length === 0) {
      toast.warn("กรุณาเลือกช่างอย่างน้อย 1 คน");
      return;
    }

    try {
      // อัปเดต State
      const updatedJobs = allJobs.map((job) => {
        if (job.JobId === jobId) {
          return {
            ...job,
            technicianId: technicianIds,
            status: "กำลังทำงาน", // เปลี่ยนสถานะเป็น "กำลังทำงาน"
            assignedAt: new Date().toISOString(), // บันทึกเวลาที่มอบหมาย
          };
        }
        return job;
      });

      // อัปเดต localStorage
      localStorage.setItem("CardWork", JSON.stringify(updatedJobs));
      setAllJobs(updatedJobs); // อัปเดต State หลักเพื่อให้ UI re-render
      setSelectedJob(null); // ปิด Modal
      toast.success(`มอบหมายงาน #${jobId} สำเร็จ!`);
      
    } catch (error) {
      console.error("Failed to assign job", error);
      toast.error("เกิดข้อผิดพลาดในการมอบหมายงาน");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4">
        {unassignedJobs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            ไม่มีใบงานที่รอการมอบหมายในขณะนี้
          </p>
        ) : (
          <div className="space-y-3">
            {unassignedJobs.map((job) => (
              <div
                key={job.JobId}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div>
                  <p className="font-bold text-primary">{job.JobId}</p>
                  <p className="text-lg font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="button-create mt-3 sm:mt-0 flex items-center gap-2 bg-accent hover:bg-accent-hover text-white"
                >
                  <UserPlus size={16} />
                  เลือกช่าง
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Modal สำหรับเลือกช่าง */}
      {selectedJob && (
        <AssignTechnicianModal
          job={selectedJob}
          technicians={availableTechnicians}
          onClose={() => setSelectedJob(null)}
          onAssign={handleAssignJob}
        />
      )}
    </>
  );
};

export default AssignJobsClient;