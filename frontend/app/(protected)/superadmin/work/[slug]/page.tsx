"use client";

import { useRef, useState, useEffect, use } from "react";
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imgStore, setImgStore] = useState<any>({});
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
        const res = await jobService.getJobById(slug);
        const found = res.job;

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
  }, [slug]);

  const canApproveOrReject = job?.status === "PENDING";

  const handleApprove = async () => {
    if (!canApproveOrReject) {
      toast.error("This job cannot be approved");
      return;
    }

    try {
      setJob((prev: any) => ({
        ...prev,
        status: "COMPLETED",
        approvedAt: new Date().toISOString(),
      }));

      toast.success("Job approved successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approve failed");
    }
  };

  const handleRejectClick = () => {
    if (!canApproveOrReject) {
      toast.error("This job cannot be rejected");
      return;
    }

    setShowRejectModal(true);
  };

  const onConfirmReject = async (reason: string) => {
    try {
      setJob((prev: any) => ({
        ...prev,
        status: "REJECTED",
        rejectReason: reason,
        rejectedAt: new Date().toISOString(),
      }));

      setShowRejectModal(false);
      toast.success("Job rejected successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reject failed");
    }
  };

  const imagesBefore = imgStore[job?.technicianReport?.imagesBeforeKey] || [];
  const imagesAfter = imgStore[job?.technicianReport?.imagesAfterKey] || [];
  const adminImages = imgStore[job?.imageKey] || [];

  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <NotFoundPage jobId={slug} />;

  return (
    <div>
      <div className="p-4 overflow-y-auto h-[100vh]">
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

        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4 mt-6">
          <div className="space-y-4">
            <BasicInfoCard job={job} />
            <DescriptionCard job={job} />
            <EvidenceCard job={job} />
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
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              ยืนยันการลบใบงาน
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลบใบงานนี้?
              การกระทำนี้ไม่สามารถย้อนกลับได้
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
                    toast.error(
                      err.response?.data?.message || "ลบใบงานไม่สำเร็จ",
                    );
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

      <div
        ref={pdfRef}
        className="absolute opacity-0 pointer-events-none -z-50 top-0 left-0"
      >
        <PDFWorkOrder job={job} />
      </div>
    </div>
  );
}
