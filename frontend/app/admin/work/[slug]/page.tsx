"use client";

import { useRef, useState, useEffect, use } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import NotFoundPage from "@/components/Dashboard/Work/Slug/NotFoundPage";
import Header from "@/components/Dashboard/Work/Slug/Header";
import BasicInfoCard from "@/components/Dashboard/Work/Slug/BasicInfo";
import DescriptionCard from "@/components/Dashboard/Work/Slug/DescriptionCard";
import EvidenceCard from "@/components/Dashboard/Work/Slug/EvidenceCard";
import Sidebar from "@/components/Dashboard/Work/Slug/Sidebar";
import LoadingSkeleton from "@/components/Dashboard/Work/Slug/LoadingSkeleton";
import EditWorkModal from "@/components/Dashboard/Work/Slug/EditJob";
import RejectModal from "@/components/Modal/RejectModal";
import { PDFWorkOrder } from "@/app/admin/WorkOrder/PDFWorkOrder";
import { jobService } from "@/services/job.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const mapStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "รอการดำเนินงาน";
    case "IN_PROGRESS":
      return "กำลังทำงาน";
    case "COMPLETED":
      return "สำเร็จ";
    case "REJECTED":
      return "ตีกลับ";
    default:
      return "รอการตรวจสอบ";
  }
};

export default function WorkDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imgStore, setImgStore] = useState<any>({});
  const [ShowRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);

      try {
        const res = await jobService.getJobById(slug);
        const found = res.job;

        if (!found) {
          setJob(null);
          return;
        }

        setJob({
          ...found,
          status: mapStatus(found.status),
          technician: found.technicians || [],
          technicianId: (found.technicians || []).map((t: any) => t.id),
          date: found.start_available_at || found.createdAt,
        });
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        setJob(null);
        toast.error("โหลดข้อมูลล้มเหลว");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [slug]);
console.log(job);

  const handleApprove = () => {
    if (job.status !== "รอการตรวจสอบ") {
      toast.error("ไม่สามารถอนุมัติได้ เนื่องจากสถานะไม่ใช่ 'รอการตรวจสอบ'");
      return;
    }

    toast.success("อนุมัติงานสำเร็จ");
    setJob({ ...job, status: "สำเร็จ", approvedAt: new Date().toISOString() });
  };

  const handleRejectClick = () => {
    if (job.status !== "รอการตรวจสอบ") {
      toast.error("ไม่สามารถตีกลับได้ เนื่องจากสถานะไม่ใช่ 'รอการตรวจสอบ'");
      return;
    }
    setShowRejectModal(true);
  };

  const onConfirmReject = (reason: string) => {
    toast.success("ตีกลับงานเรียบร้อยแล้ว");

    setJob({
      ...job,
      status: "ตีกลับ",
      rejectReason: reason,
      rejectedAt: new Date().toISOString(),
    });

    setShowRejectModal(false);
  };

  const imagesBefore = imgStore[job?.technicianReport?.imagesBeforeKey] || [];
  const imagesAfter = imgStore[job?.technicianReport?.imagesAfterKey] || [];
  const adminImages = imgStore[job?.imageKey] || [];

  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <NotFoundPage jobId={slug} />;

  return (
    <div>
      <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
        <Header
          job={job}
          pdfRef={pdfRef}
          setShowEditModal={setShowEditModal}
          onApprove={() => handleApprove()}
          onReject={() => handleRejectClick()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4 mt-6">
          <div className="space-y-4">
            <BasicInfoCard job={job} />
            <DescriptionCard job={job} />
            <EvidenceCard
              job={job}
              adminImages={adminImages}
              imagesBefore={imagesBefore}
              imagesAfter={imagesAfter}
            />
          </div>

          <Sidebar job={job} />
        </div>
      </div>

      {showEditModal && (
        <EditWorkModal
          job={job}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => setJob(updated)}
        />
      )}

      {ShowRejectModal && (
        <RejectModal
          isOpen={ShowRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={onConfirmReject}
        />
      )}

      <div
        ref={pdfRef}
        className="absolute opacity-0 pointer-events-none -z-50 top-0 left-0"
      >
        <PDFWorkOrder job={job} />
      </div>
    </div>
  );
}