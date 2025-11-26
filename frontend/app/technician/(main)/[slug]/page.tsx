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

  // รูปก่อน/หลังทำงานใหม่ (เก็บในฟอร์ม)
  const [formBeforeImages, setFormBeforeImages] = useState<string[]>([]);
  const [formAfterImages, setFormAfterImages] = useState<string[]>([]);

  // รูปเก็บจริงใน store หลัง submit
  const [storedBeforeImages, setStoredBeforeImages] = useState<string[]>([]);
  const [storedAfterImages, setStoredAfterImages] = useState<string[]>([]);

  const [currentStatus, setCurrentStatus] = useState("");

  const getDistanceMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // โหลดข้อมูลงาน + โหลดรูปจาก ImagesStore
  useEffect(() => {
    setIsLoading(true);

    const cardData = localStorage.getItem("CardWork");
    const imgStore = JSON.parse(localStorage.getItem("ImagesStore") || "{}");

    if (cardData) {
      const jobs = JSON.parse(cardData);
      const found = jobs.find((j: any) => j.JobId === slug);

      if (found) {
        setJob(found);
        setCurrentStatus(found.status);

    
        const beforeKey = found.technicianReport?.imagesBeforeKey;
        const afterKey = found.technicianReport?.imagesAfterKey;

        setStoredBeforeImages(imgStore[beforeKey] || []);
        setStoredAfterImages(imgStore[afterKey] || []);
      } else {
        setJob(null);
      }
    }

    setTimeout(() => setIsLoading(false), 250);
  }, [slug]);

  // อัปเดตสถานะงาน
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

  // เริ่มงาน
  const handleStartJob = () => {
    if (!navigator.geolocation) {
      toast.error("ไม่รองรับการหาตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myLat = pos.coords.latitude;
        const myLng = pos.coords.longitude;

        const jobLat = job.loc?.lat;
        const jobLng = job.loc?.lng;

        if (!jobLat || !jobLng) {
          toast.error("ไม่พบตำแหน่งของงาน");
          return;
        }

        const distance = getDistanceMeters(myLat, myLng, jobLat, jobLng);

        if (distance > 200) {
          toast.error(
            `คุณอยู่ห่างจากจุดงาน ${Math.floor(
              distance
            )} เมตร — ไม่สามารถเริ่มงานได้`
          );
          return;
        }

        updateJobStatus("กำลังทำงาน");
        toast.success("เริ่มงานสำเร็จ!");
      },
      () => toast.error("เปิดพิกัดไม่สำเร็จ กรุณาอนุญาต Location")
    );
  };

  // เปิดฟอร์มปิดงาน
  const handleCompleteJob = () => {
    setShowFormModal(true);
  };

  // Submit รายงาน & เก็บรูปลง ImagesStore
  const handleSubmitReport = () => {
    const result = technicianReportSchema.safeParse({
      ...formData,
      imagesBefore: formBeforeImages,
      imagesAfter: formAfterImages,
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

    // สร้าง key สำหรับรูป
    const beforeKey = `before_${slug}_${Date.now()}`;
    const afterKey = `after_${slug}_${Date.now()}`;

    // เซฟรูปลง ImagesStore
    const store = JSON.parse(localStorage.getItem("ImagesStore") || "{}");

    store[beforeKey] = formBeforeImages;
    store[afterKey] = formAfterImages;

    localStorage.setItem("ImagesStore", JSON.stringify(store));

    const reportData = {
      ...result.data,
      imagesBeforeKey: beforeKey,
      imagesAfterKey: afterKey,
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
      ตีกลับ: "bg-red-100 text-red-700 border-red-200",
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
        <p className="text-gray-600 animate-pulse">กำลังโหลดข้อมูลงาน...</p>
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
      <HeaderSlugTechni job={job} getStatusBadge={getStatusBadge} />
      <JobsDetail job={job} />

      {(currentStatus === "รอการตรวจสอบ" || currentStatus === "สำเร็จ") && (
        <DetailFromTech
          job={job}
          imagesBefore={storedBeforeImages}
          imagesAfter={storedAfterImages}
        />
      )}

      {(currentStatus === "รอการดำเนินงาน" || currentStatus === "ตีกลับ") && (
        <button
          onClick={handleStartJob}
          className="fixed bottom-6 right-6 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          เริ่มงาน
        </button>
      )}

      {currentStatus === "กำลังทำงาน" && (
        <button
          onClick={handleCompleteJob}
          className="fixed bottom-6 right-6 px-5 py-3 bg-green-600 text-white rounded-full shadow-lg"
        >
          บันทึกเพื่อปิดงาน
        </button>
      )}

      {showFormModal && (
        <FormModal
          formData={formData}
          setFormData={setFormData}
          imagesBefore={formBeforeImages}
          setImagesBefore={setFormBeforeImages}
          imagesAfter={formAfterImages}
          setImagesAfter={setFormAfterImages}
          handleSubmit={handleSubmitReport}
          setShowFormModal={setShowFormModal}
          errors={errors}
        />
      )}
    </div>
  );
}
