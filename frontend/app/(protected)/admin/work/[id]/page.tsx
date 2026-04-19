"use client";

import { useRef, useState, useEffect, use, useMemo } from "react";
import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/components/Dashboard/Work/Slug/NotFoundPage";
import Header from "@/components/Dashboard/Work/Slug/Header";
import BasicInfoCard from "@/components/Dashboard/Work/Slug/BasicInfo";
import DescriptionCard from "@/components/Dashboard/Work/Slug/DescriptionCard";
import EvidenceCard from "@/components/Dashboard/Work/Slug/EvidenceCard";
import Sidebar from "@/components/Dashboard/Work/Slug/Sidebar";
import LoadingSkeleton from "@/components/Dashboard/Work/Slug/LoadingSkeleton";
import EditWorkModal from "@/components/Dashboard/Work/Slug/EditJob";
import RejectModal from "@/components/Modal/RejectModal";
import { jobService } from "@/services/job.service";
import { useAuthStore } from "@/store/useAuthStore";
import { PDFWorkOrder } from "../../workorder/PDFWorkOrder";
import { JobStatus, JobStatusThai, getStatusThai } from "@/types/job";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  const { user, fetchMe } = useAuthStore();
  const role = user?.role || "";

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);

      try {
        const res = await jobService.getJobById(id);
        const found = res.job;

        console.log("FOUND:", found);

        if (!found) {
          setJob(null);
          return;
        }

        setJob({
          ...found,
          technician: found.technicians || [],
          technicianId: (found.technicians || []).map((t: any) => t.id),
          date: found.start_available_at || found.createdAt,
          status: found.status,
        });
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        setJob(null);
        toast.error("Load job failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

 

  const statusStr = job?.status?.toUpperCase() || "";
  const canApproveOrReject = statusStr === JobStatus.SUBMITTED || statusStr === "ส่งงานแล้ว" || statusStr === JobStatus.PENDING;

  const handleApprove = async () => {
    if (!canApproveOrReject) {
      toast.error("ไม่สามารถอนุมัติใบงานนี้ได้");
      return;
    }

    try {
      setJob((prev: any) => ({
        ...prev,
        status: JobStatus.COMPLETED,
        approvedAt: new Date().toISOString(),
      }));

      toast.success("อนุมัติใบงานสำเร็จ");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "การอนุมัติล้มเหลว");
    }
  };

  const handleRejectClick = () => {
    if (!canApproveOrReject) {
      toast.error("ไม่สามารถตีกลับใบงานนี้ได้");
      return;
    }

    setShowRejectModal(true);
  };

  const onConfirmReject = async (reason: string) => {
    try {
      setJob((prev: any) => ({
        ...prev,
        status: JobStatus.REJECTED,
        rejectReason: reason,
        rejectedAt: new Date().toISOString(),
      }));

      setShowRejectModal(false);
      toast.success("ตีกลับใบงานสำเร็จ");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "การตีกลับล้มเหลว");
    }
  };

  const imagesBefore = job?.technicianReport?.imagesBefore || [];
  const imagesAfter = job?.technicianReport?.imagesAfter || [];
  const adminImages = job?.images?.map((img: any) => img.url) || [];

  // Memoize detail cards to prevent lag during state updates
  const DetailContent = useMemo(() => (
    <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4 mt-6">
      <div className="space-y-4">
        <BasicInfoCard job={job} />
        <DescriptionCard job={job} />
        <EvidenceCard
          job={job}
        />
      </div>
      <Sidebar job={job} />
    </div>
  ), [job, adminImages, imagesBefore, imagesAfter]);

  // Memoize PDF Generation Container above early returns to follow Rules of Hooks
  const PDFContainer = useMemo(() => (
    <div className="fixed left-[-9999px] top-0 -z-50 pointer-events-none opacity-0">
      <div ref={pdfRef}>
        <PDFWorkOrder job={job} />
      </div>
    </div>
  ), [job]);

  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <NotFoundPage jobId={id} />;

  return (
    <div className="p-4">
      <Header
          job={job}
          role={role}
          pdfRef={pdfRef}
          setShowEditModal={setShowEditModal}
          setShowCancelModal={setShowCancelModal}
          onApprove={handleApprove}
          onReject={handleRejectClick}
          canApproveOrReject={canApproveOrReject}
        />
        {DetailContent}

      {showEditModal && (
        <EditWorkModal
          job={job}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => setJob(updated)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={onConfirmReject}
        />
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-gray-900">ยืนยันการลบใบงาน</h2>
            <p className="mb-6 text-sm text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลบใบงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={async () => {
                  try {
                    await jobService.deleteJob(job.id || job.JobId);
                    toast.success("ลบใบงานสำเร็จ!");
                    router.push(`/${role.toLowerCase()}/work`);
                  } catch (err: any) {
                    toast.error(err.response?.data?.message || "ลบใบงานไม่สำเร็จ");
                  }
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PDF Generation Container */}
      {PDFContainer}
    </div>
  );
}
