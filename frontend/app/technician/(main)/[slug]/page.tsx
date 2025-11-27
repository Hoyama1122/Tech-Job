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
import { log } from "console";

const LS = {
  WORK: "CardWork",
  IMAGES: "ImagesStore",
};

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;

  //  STATES
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("");

  // admin images
  const [adminImages, setAdminImages] = useState<string[]>([]);

  // technician stored images
  const [storedBeforeImages, setStoredBeforeImages] = useState<string[]>([]);
  const [storedAfterImages, setStoredAfterImages] = useState<string[]>([]);

  // technician form modal
  const [showFormModal, setShowFormModal] = useState(false);

  // data in modal
  const [formData, setFormData] = useState<TechnicianReportForm>({
    detail: "",
    inspectionResults: "",
    repairOperations: "",
    summaryOfOperatingResults: "",
    technicianSignature: "",
    customerSignature: "",
  });

  // form errors
  const [errors, setErrors] = useState({});

  // form images
  const [formBeforeImages, setFormBeforeImages] = useState<string[]>([]);
  const [formAfterImages, setFormAfterImages] = useState<string[]>([]);

  const saveImagesToStore = (key: string, images: string[]) => {
    const store = JSON.parse(localStorage.getItem(LS.IMAGES) || "{}");
    store[key] = images;
    localStorage.setItem(LS.IMAGES, JSON.stringify(store));
  };

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

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const loadJobAndImages = () => {
    const cardData = localStorage.getItem(LS.WORK);
    const imgStore = JSON.parse(localStorage.getItem(LS.IMAGES) || "{}");

    if (!cardData) return;

    const jobs = JSON.parse(cardData);
    const found = jobs.find((j: any) => j.JobId === slug);

    if (!found) {
      setJob(null);
      return;
    }

    setJob(found);
    setCurrentStatus(found.status);

    //  admin images
    setAdminImages(imgStore[found.imageKey] || []);

    //  technician stored images
    setStoredBeforeImages(
      imgStore[found.technicianReport?.imagesBeforeKey] || []
    );
    setStoredAfterImages(
      imgStore[found.technicianReport?.imagesAfterKey] || []
    );
  };

  useEffect(() => {
    setIsLoading(true);
    loadJobAndImages();
    setTimeout(() => setIsLoading(false), 250);
  }, [slug]);

  //  update job status
  const updateJobStatus = (newStatus: string, reportData?: any) => {
    const cardData = localStorage.getItem(LS.WORK);
    if (!cardData) return;

    const jobs = JSON.parse(cardData);

    const updatedJobs = jobs.map((j: any) =>
      j.JobId === slug
        ? {
            ...j,
            status: newStatus,
            completedAt:
              newStatus === "รอการตรวจสอบ"
                ? new Date().toISOString()
                : j.completedAt,
            technicianReport: reportData || j.technicianReport,
          }
        : j
    );

    localStorage.setItem(LS.WORK, JSON.stringify(updatedJobs));
    setJob(updatedJobs.find((x: any) => x.JobId === slug));
    setCurrentStatus(newStatus);
  };

  //  start job
  const handleStartJob = () => {
    if (!navigator.geolocation) {
      toast.error("ไม่รองรับการหาตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const distance = getDistanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          job.loc?.lat,
          job.loc?.lng
        );

        if (distance > 1000000) {
          toast.error(`คุณอยู่ห่างจากจุดงาน ${Math.floor(distance)} เมตร`);
          return;
        }
        const now = new Date().toISOString();

        updateJobStatus("กำลังทำงาน", {
          ...(job.technicianReport || {}),
          startTime: now,
        });
        toast.success("เริ่มงานสำเร็จ!");
      },
      () => toast.error("เปิดพิกัดไม่สำเร็จ กรุณาอนุญาต Location")
    );
  };

  //  sumbit report
  const handleSubmitReport = () => {
    const validated = technicianReportSchema.safeParse({
      ...formData,
      imagesBefore: formBeforeImages,
      imagesAfter: formAfterImages,
    });

    if (!validated.success) {
      const errObj: Record<string, string> = {};
      validated.error.issues.forEach((issue) => {
        errObj[issue.path[0]] = issue.message;
      });
      setErrors(errObj);
      toast.warning("กรุณาตรวจสอบข้อมูลอีกครั้ง");
      return;
    }

    setErrors({});
    const now = new Date().toISOString();

    const beforeKey = `before_${slug}_${Date.now()}`;
    const afterKey = `after_${slug}_${Date.now()}`;

    saveImagesToStore(beforeKey, formBeforeImages);
    saveImagesToStore(afterKey, formAfterImages);

    const reportData = {
      ...validated.data,
      imagesBeforeKey: beforeKey,
      imagesAfterKey: afterKey,
      submittedAt: new Date().toISOString(),
      endTime: now, 
      startTime: job?.technicianReport?.startTime, 
    };

    updateJobStatus("รอการตรวจสอบ", reportData);
    setShowFormModal(false);
    toast.success("บันทึกรายงานปิดงานสำเร็จ!");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
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
      <JobsDetail job={job} adminImages={adminImages} />

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
          onClick={() => setShowFormModal(true)}
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
