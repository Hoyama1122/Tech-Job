"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import NotFoundPage from "@/components/Dashboard/Work/Slug/NotFoundPage";
import LoadingSkeleton from "@/components/Dashboard/Work/Slug/LoadingSkeleton";
import DescriptionCard from "@/components/Dashboard/Work/Slug/DescriptionCard";
import EvidenceCard from "@/components/Dashboard/Work/Slug/EvidenceCard";
import AssignActionPanel from "./AssignActionPanel"; // 👈 คอมโพเนนต์ใหม่
import { CardWorkTypes } from "@/lib/Mock/CardWork";
import { Users as MockUsers } from "@/lib/Mock/UserMock";
import { useAuthStore } from "@/store/useAuthStore";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import { FileText, UserPlus, ChevronLeft, UserCheck } from "lucide-react";
import InfoRow from "@/components/Dashboard/Work/Slug/InfoRow";
import Link from "next/link";
import AssignTechnicianModal from "./AssignTechnicianModal";

type User = typeof MockUsers[0];
type Job = CardWorkTypes & { supervisor?: User };

interface Props {
  jobId: string;
}

const AssignmentDetail = ({ jobId }: Props) => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const supervisorDepartment = useAuthStore((state) => state.department);
  const [job, setJob] = useState<Job | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. โหลดข้อมูลงานและผู้ใช้ (คล้ายกับ AdminDetail page)
  useEffect(() => {
    setIsLoading(true);
    try {
      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (cardData && usersData) {
        const jobs = JSON.parse(cardData);
        const users = JSON.parse(usersData);
        setAllUsers(users);

        const foundJob = jobs.find((j: any) => j.JobId === jobId);

        if (foundJob) {
          const supervisor = users.find(
            (u: any) => u.role === "supervisor" && String(u.id) === String(foundJob.supervisorId)
          );
          
          setJob({
            ...foundJob,
            supervisor: supervisor || null,
          });
        } else {
          setJob(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [jobId, refreshKey]);

  // 2. กรองช่างเฉพาะที่อยู่ในแผนกเดียวกับ Supervisor
  const availableTechnicians = useMemo(() => {
    if (!supervisorDepartment) return [];
    return allUsers.filter(
      (user) => user.role === "technician" && user.department === supervisorDepartment
    );
  }, [allUsers, supervisorDepartment]);

  // 3. ฟังก์ชันยืนยันการมอบหมายงาน (ใช้ Logic เดิม)
  const handleAssignJob = (jobId: string, technicianIds: number[]) => {
    if (technicianIds.length === 0) {
      toast.warn("กรุณาเลือกช่างอย่างน้อย 1 คน");
      return;
    }

    try {
      const cardData = localStorage.getItem("CardWork");
      if (!cardData) return;

      const allJobs = JSON.parse(cardData);

      const updatedJobs = allJobs.map((j: CardWorkTypes) => {
        if (j.JobId === jobId) {
          return {
            ...j,
            technicianId: technicianIds,
            status: "กำลังทำงาน", 
            assignedAt: new Date().toISOString(), 
          };
        }
        return j;
      });

      localStorage.setItem("CardWork", JSON.stringify(updatedJobs));
      setIsModalOpen(false);
      // Trigger re-fetch/re-render and navigate back to the list page
      toast.success(`มอบหมายงาน #${jobId} สำเร็จ!`);
      router.push("/supervisor/assign"); 
      
    } catch (error) {
      console.error("Failed to assign job", error);
      toast.error("เกิดข้อผิดพลาดในการมอบหมายงาน");
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!job) {
    return <NotFoundPage jobId={jobId} />;
  }
  
  // ตรวจสอบสถานะว่ามอบหมายได้หรือไม่
  const isAssignable = job.status === "รอการมอบหมายงาน";

  return (
    <>
      <div className="flex items-center gap-2 text-primary font-medium mb-4 hover:underline">
        <Link href="/supervisor/assign" className="flex items-center gap-2">
          <ChevronLeft size={20} /> 
          กลับไปหน้ารายการงาน
        </Link>
      </div>
      
      {/* Title Section (คล้ายในรูป) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">รายละเอียดใบงาน</h1>
            <p className="text-sm text-gray-500 mt-1">หมายเลข: #{job.JobId}</p>
          </div>
        </div>
        {/* ปุ่มดาวน์โหลด (อ้างอิงจากรูป) */}
        <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-3 rounded-lg text-sm">
          <FileText className="w-4 h-4" />
          ดาวน์โหลด
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Job Details (คล้ายรูป) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
               <FileText className="w-6 h-6 text-primary" />
               ข้อมูลพื้นฐาน
             </h2>
             
             {/* Matching the User's Image Layout: Two Columns in the Info Card */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div>
                   <InfoRow label="หมายเลขใบงาน" value={`#${job.JobId}`} />
                   <InfoRow label="ชื่องาน" value={job.title} />
                   {/* แสดงสถานะด้วย Badge */}
                   <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                       <span className="text-sm text-gray-600">สถานะ</span>
                       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                           isAssignable 
                           ? "bg-yellow-100 text-yellow-700 border-yellow-200" 
                           : job.status === "กำลังทำงาน" ? "bg-primary/10 text-primary border-primary" : "bg-gray-100 text-gray-700 border-gray-200"
                       }`}>
                         {job.status}
                       </span>
                   </div>
                   <InfoRow label="วันที่แจ้งงาน" value={job.createdAt ? formatThaiDateTime(job.createdAt).split(' เวลา')[0] : "-"} />
                </div>
                <div>
                  <InfoRow label="วันที่สร้าง" value={job.createdAt ? formatThaiDateTime(job.createdAt).split(' ')[0] : "-"} />
                  <InfoRow label="เวลาสร้าง" value={job.createdAt ? formatThaiDateTime(job.createdAt).split(' เวลา ')[1] : "-"} />
                  <InfoRow label="วันที่นัดหมาย" value={job.date ? formatThaiDateTime(job.date).split(' ')[0] : "-"} />
                  <InfoRow label="เวลา (โดยประมาณ)" value={job.startTime && job.endTime ? `${job.startTime} - ${job.endTime} น.` : "-"} />
                </div>
             </div>
          </div>
          
          <DescriptionCard job={job} />
          <EvidenceCard job={job} />
        </div>

        {/* Right Column: Supervisor Actions */}
        <div className="lg:col-span-1 space-y-6">
          <AssignActionPanel 
            job={job} 
            onOpenModal={() => isAssignable ? setIsModalOpen(true) : toast.info("งานนี้ถูกมอบหมายไปแล้ว")}
            isAssignable={isAssignable}
            availableTechnicians={availableTechnicians}
          />
        </div>
      </div>
      
      {/* The Assignment Modal */}
      {isModalOpen && (
        <AssignTechnicianModal
          job={job}
          technicians={availableTechnicians}
          onClose={() => setIsModalOpen(false)}
          onAssign={handleAssignJob}
        />
      )}
    </>
  );
};

export default AssignmentDetail;