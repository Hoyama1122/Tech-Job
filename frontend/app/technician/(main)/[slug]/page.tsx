"use client";

import DetailFromTech from "@/components/Technician/slug/DetailFromTech";
import FormModal from "@/components/Technician/slug/FormModal";
import HeaderSlugTechni from "@/components/Technician/slug/HeaderSlugTechni";
import JobsDetail from "@/components/Technician/slug/JobsDetail";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  technicianReportSchema,
  TechnicianReportForm,
} from "@/lib/Validations/technicianReportSchema";

interface PageProps {
  params: { slug: string };
}

export default function page({ params }: PageProps) {
  const { slug } = params;

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState<TechnicianReportForm>({
    detail: "",
    inspectionResults: "",
    repairOperations: "",
    summaryOfOperatingResults: "",
    technicianSignature: "",
    customerSignature: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [imagesBefore, setImagesBefore] = useState<string[]>([]);
  const [imagesAfter, setImagesAfter] = useState<string[]>([]);

  const [currentStatus, setCurrentStatus] = useState("");

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    setIsLoading(true);

    const cardData = localStorage.getItem("CardWork");
    if (cardData) {
      const jobs = JSON.parse(cardData);
      const found = jobs.find((j: any) => j.JobId === slug);

      if (found) {
        setJob(found);
        setCurrentStatus(found.status);
      } else {
        setJob(null);
      }
    }

    setTimeout(() => setIsLoading(false), 300);
  }, [slug]);

  const updateJobStatus = (newStatus: string, reportData?: any) => {
    const cardData = localStorage.getItem("CardWork");
    if (!cardData) return;

    const jobs = JSON.parse(cardData);

    const updated = jobs.map((j: any) => {
      if (j.JobId === slug) {
        return {
          ...j,
          status: newStatus,

          // ใส่เวลาปิดงานเมื่อกดส่งรายงาน
          completedAt:
            newStatus === "รอการตรวจสอบ"
              ? new Date().toISOString()
              : j.completedAt,

          technicianReport: reportData || j.technicianReport,
        };
      }
      return j;
    });

    localStorage.setItem("CardWork", JSON.stringify(updated));

    // update หน้า
    setJob((prev: any) => ({
      ...prev,
      status: newStatus,
      completedAt:
        newStatus === "รอการตรวจสอบ"
          ? new Date().toISOString()
          : prev?.completedAt,
      technicianReport: reportData || prev?.technicianReport,
    }));

    setCurrentStatus(newStatus);
  };

  const handleStartJob = () => {
    updateJobStatus("กำลังทำงาน");
    toast.success("เริ่มงานสำเร็จ!");
  };

  const handleCompleteJob = () => {
    setShowFormModal(true);
  };

  const handleSubmitReport = () => {
    const result = technicianReportSchema.safeParse({
      ...formData,
      imagesBefore,
      imagesAfter,
    });

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formErrors[issue.path[0]] = issue.message;
      });
      setErrors(formErrors);
      toast.warning("กรุณาตรวจสอบข้อมูลอีกครั้ง");
      return;
    }

    setErrors({});

    const validData = result.data;

    const reportData = {
      ...validData,
      imagesBefore,
      imagesAfter,
      submittedAt: new Date().toISOString(),
    };

    updateJobStatus("รอการตรวจสอบ", reportData);

    setShowFormModal(false);
    toast.success("บันทึกรายงานปิดงานสำเร็จ!");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
      สำเร็จ: "bg-green-100 text-green-700 border-green-200",
      รอการดำเนินงาน: "bg-orange-100 text-orange-700 border-orange-200",
      รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-0 w-14 h-14 rounded-full blur-xl bg-blue-500 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 text-sm animate-pulse">
            กำลังโหลดข้อมูลงาน...
          </p>
        </div>
      </div>
    );

  if (!job)
    return (
      <div className="p-6 text-center text-gray-600">
        ไม่พบข้อมูลงานหมายเลข {slug}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="relative space-y-2">
        <HeaderSlugTechni job={job} getStatusBadge={getStatusBadge} />
        <JobsDetail job={job} />
      </div>

      {currentStatus === "รอการตรวจสอบ" && <DetailFromTech job={job} />}

      {currentStatus === "รอการดำเนินงาน" && (
        <button
          onClick={handleStartJob}
          className="fixed bottom-6 right-6 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          เริ่มงาน
        </button>
      )}

      {currentStatus === "กำลังทำงาน" && (
        <button
          onClick={handleCompleteJob}
          className="fixed bottom-6 right-6 px-5 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
        >
          บันทึกเพื่อปิดงาน
        </button>
      )}

      {/* MODAL FORM */}
      {showFormModal && (
        <FormModal
          formData={formData}
          setFormData={setFormData}
          imagesBefore={imagesBefore}
          setImagesBefore={setImagesBefore}
          imagesAfter={imagesAfter}
          setImagesAfter={setImagesAfter}
          handleSubmit={handleSubmitReport}
          setShowFormModal={setShowFormModal}
          errors={errors}
        />
      )}
    </div>
  );
}
