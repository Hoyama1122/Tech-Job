"use client";

import { useRef, useState, useEffect, use } from "react";
import React from "react";
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
import { authService } from "@/services/auth.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [role, setRole] = useState("");

  const pdfRef = useRef<HTMLDivElement>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imgStore, setImgStore] = useState<any>({});
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await authService.me();
        setRole(res.user.role);
      } catch {
        setRole("");
      }
    };

    fetchMe();
  }, []);
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);

      try {
        const res = await jobService.getJobById(slug);
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
      <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
        <Header
          job={job}
          role={role}
          pdfRef={pdfRef}
          setShowEditModal={setShowEditModal}
          onApprove={handleApprove}
          onReject={handleRejectClick}
          canApproveOrReject={canApproveOrReject}
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

      {showRejectModal && (
        <RejectModal
          isOpen={showRejectModal}
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
