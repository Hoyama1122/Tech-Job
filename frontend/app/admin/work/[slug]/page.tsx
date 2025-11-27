/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
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
import { PDFWorkOrder } from "../../workorder/PDFWorkOrder";
import EditWorkModal from "@/components/Dashboard/Work/Slug/EditJob";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = React.use(params);

  const pdfRef = useRef<HTMLDivElement>(null);

  const [job, setJob] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showEditModal, setShowEditModal] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    try {
      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (cardData) {
        const jobs = JSON.parse(cardData);
        const users = usersData ? JSON.parse(usersData) : [];

        const found = jobs.find((j: any) => j.JobId === slug);

        if (found) {
          const supervisor = users.find(
            (u: any) =>
              u.role === "supervisor" &&
              String(u.id) === String(found.supervisorId)
          );

          const technicians = users.filter(
            (u: any) =>
              u.role === "technician" && found.technicianId?.includes(u.id)
          );

          setJob({
            ...found,
            supervisor: supervisor || null,
            technician: technicians || [],
          });
        } else {
          setJob(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("โหลดข้อมูลล้มเหลว");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [slug]);

  const imgStore = JSON.parse(localStorage.getItem("ImagesStore") || "{}");

  const imagesBefore = imgStore[job?.technicianReport?.imagesBeforeKey] || [];

  const imagesAfter = imgStore[job?.technicianReport?.imagesAfterKey] || [];
  const adminImages = imgStore[job?.imageKey] || [];
  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <NotFoundPage jobId={slug} />;

  return (
    <div>
      <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
        <Header job={job} pdfRef={pdfRef} setShowEditModal={setShowEditModal} />

        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4 mt-6">
          <div className="space-y-4">
            <BasicInfoCard job={job} />
            <DescriptionCard job={job} />

            {/* EvidenceCard */}
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

      <div
        ref={pdfRef}
        className="absolute opacity-0 pointer-events-none -z-50 top-0 left-0"
      >
        <PDFWorkOrder job={job} />
      </div>
    </div>
  );
}
