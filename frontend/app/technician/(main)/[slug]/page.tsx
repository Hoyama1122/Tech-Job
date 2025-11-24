"use client";

import FormModal from "@/components/Technician/slug/FormModal";
import HeaderSlugTechni from "@/components/Technician/slug/HeaderSlugTechni";
import JobsDetail from "@/components/Technician/slug/JobsDetail";
import Location from "@/components/Technician/slug/Location";
import { FileText, Loader2, MapPin, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PageProps {
  params: { slug: string };
}

const page = ({ params }: PageProps) => {
  const { slug } = params;
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    detail: "",
    inspectionResults: "",
    repairOperations: "",
    summaryOfOperatingResults: "",
    technicianSignature: "",
    customerSignature: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [time, setTime] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Load job data
  useEffect(() => {
    setIsLoading(true);
    const cardData = localStorage.getItem("CardWork");
    if (cardData) {
      const jobs = JSON.parse(cardData);
      const found = jobs.find((j: any) => j.JobId === slug);
      setJob(found || null);
      setCurrentStatus(found?.status || "");
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (
      !formData.detail ||
      !formData.technicianSignature ||
      !formData.customerSignature
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const reportData = {
      ...formData,
      images,
      submittedAt: new Date().toISOString(),
    };

    updateJobStatus("รอการตรวจสอบ", reportData);
    setShowFormModal(false);
    alert("บันทึกข้อมูลสำเร็จ!");
  };
  const handleStartJob = () => {
    updateJobStatus("กำลังทำงาน");
    alert("เริ่มงานแล้ว!");
  };

  const handleCompleteJob = () => {
    setShowFormModal(true);
  };
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      กำลังทำงาน: "bg-yellow-100 text-yellow-700 border-yellow-200",
      สำเร็จ: "bg-green-100 text-green-700 border-green-200",
      รอการดำเนินงาน: "bg-primary text-white ",
      รอการตรวจสอบ: "bg-blue-100 text-blue-700 border-blue-200",
      รอการมอบหมายงาน: "bg-purple-100 text-purple-700 border-purple-200",
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

  return (
    <div className="max-w-4xl mx-auto p-2 ">
      <div className="relative space-y-2">
        <HeaderSlugTechni job={job} getStatusBadge={getStatusBadge} />

        <JobsDetail job={job} />
      </div>

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

      {showFormModal && (
        <FormModal
          formData={formData}
          setFormData={setFormData}
          images={images}
          setImages={setImages}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          setShowFormModal={setShowFormModal}
        />
      )}
    </div>
  );
};

export default page;
