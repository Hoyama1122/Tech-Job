"use client";

import DetailFromTech from "@/components/Technician/slug/DetailFromTech";
import FormModal from "@/components/Technician/slug/FormModal";
import HeaderSlugTechni from "@/components/Technician/slug/HeaderSlugTechni";
import JobsDetail from "@/components/Technician/slug/JobsDetail";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { JobStatus, JobReportStatus, getStatusThai } from "@/types/job";

import {
  technicianReportSchema,
  TechnicianReportForm,
} from "@/lib/Validations/technicianReportSchema";
import { jobService } from "@/services/job.service";
import { reportService, CreateReportPayload } from "@/services/report.service";

const LS = {
  WORK: "CardWork",
  IMAGES: "ImagesStore",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);

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
  const [isStarting, setIsStarting] = useState(false);

  // data in modal
  const [formData, setFormData] = useState<TechnicianReportForm>({
    detail: "",
    inspectionResults: "",
    repairOperations: "",
    summaryOfOperatingResults: "",
    customerSignature: "",
    items: [],
  });

  // form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // form images
  const [formBeforeImages, setFormBeforeImages] = useState<string[]>([]);
  const [formAfterImages, setFormAfterImages] = useState<string[]>([]);

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

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getMyJobDetail(id);
      const found = res.job;

      if (!found) {
        setJob(null);
        return;
      }

      setJob(found);
      setCurrentStatus(found.status);
      setAdminImages(found.images?.map((img: any) => img.url) || []);

      // Get the existing report (using the clean structure from backend)
      const report = found.technicianReport;
      if (report) {
        // Extract images by type (if your backend includes type in images nested in report)
        // or just use storedBeforeImages/storedAfterImages logic
        setStoredBeforeImages(
          report.images
            ?.filter((i: any) => i.type === "BEFORE" || !i.type)
            .map((i: any) => i.url) || []
        );
        setStoredAfterImages(
          report.images
            ?.filter((i: any) => i.type === "AFTER")
            .map((i: any) => i.url) || []
        );

        setFormData({
          detail: report.detail || "",
          inspectionResults: report.inspectionResults || "",
          repairOperations: report.repairOperations || "",
          summaryOfOperatingResults: report.summaryOfOperatingResults || "",
          customerSignature: report.customerSignature || "",
          items: report.itemUsages?.map((u: any) => ({
             id: u.item.id,
             name: u.item.name,
             code: u.item.code,
             quantity: Number(u.usedQuantity),
             unit: u.item.unit,
             type: u.item.type,
          })) || [],
        });
      }
    } catch (error: any) {
      console.error("โหลดรายละเอียดงานไม่สำเร็จ:", error);
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  // Helper to convert base64 to File for upload
  const dataURLtoFile = (dataurl: string, filename: string) => {
    try {
      const arr = dataurl.split(',');
      if (arr.length < 2) return null;
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      return null;
    }
  };

  const updateJobStateLocally = (newStatus: string, reportData?: any) => {
    setJob((prev: any) => ({
      ...prev,
      status: newStatus,
      technicianReport: reportData || prev.technicianReport,
    }));
    setCurrentStatus(newStatus);
  };

  //  start job
  const handleStartJob = async () => {
    if (isStarting) return;

    if (!navigator.geolocation) {
      toast.error("ไม่รองรับการหาตำแหน่ง");
      return;
    }

    if (!job?.latitude || !job?.longitude) {
      toast.error("บันทึกพิกัดใบงานไม่สมบูรณ์ ไม่สามารถตรวจสอบระยะทางได้");
      return;
    }

    setIsStarting(true);
    const toastId = toast.loading("กำลังตรวจสอบพิกัด...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const distance = getDistanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          job.latitude,
          job.longitude
        );

        // Limit to 100km for example or keep it large but check if logic holds
        if (distance > 500000) {
          toast.update(toastId, {
            render: `คุณอยู่ห่างจากจุดงานมากเกินไป (${Math.floor(distance / 1000)} กม.)`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsStarting(false);
          return;
        }

        try {
          await jobService.updateMyJobStatus(id, JobStatus.IN_PROGRESS);
          updateJobStateLocally(JobStatus.IN_PROGRESS, {
            ...(job.technicianReport || {}),
            start_time: new Date().toISOString(),
          });
          toast.update(toastId, {
            render: "เริ่มงานสำเร็จ!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (err: any) {
          toast.update(toastId, {
            render: err.response?.data?.message || "ไม่สามารถเริ่มงานได้",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        } finally {
          setIsStarting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "หาพิกัดไม่สำเร็จ กรุณาอนุญาตเข้าถึงตำแหน่งและลองอีกครั้ง";
        if (error.code === 1) msg = "กรุณาอนุญาตให้เข้าถึงตำแหน่งที่ตั้ง (Location Permission)";
        if (error.code === 3) msg = "หาพิกัดล่าช้าเกินไป (Timeout) กรุณาลองใหม่อีกครั้งในที่โล่ง";
        
        toast.update(toastId, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setIsStarting(false);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
    );
  };

  const openFormModal = () => {
    if (job?.technicianReport) {
      setFormData({
        detail: job.technicianReport.detail || "",
        inspectionResults: job.technicianReport.inspectionResults || "",
        repairOperations: job.technicianReport.repairOperations || "",
        summaryOfOperatingResults:
          job.technicianReport.summaryOfOperatingResults || "",
        customerSignature: job.technicianReport.customerSignature || "",
      });
      // Load existing images if any
      setFormBeforeImages(storedBeforeImages);
      setFormAfterImages(storedAfterImages);
    }
    setShowFormModal(true);
  };

  //  sumbit report
  const handleSubmitReport = async () => {
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
    
    try {
      // Filter only NEW images (base64) to upload. Ignore existing URLs.
      const beforeFiles = formBeforeImages
        .filter((img) => img.startsWith("data:"))
        .map((base64, i) => dataURLtoFile(base64, `before_${Date.now()}_${i}.jpg`))
        .filter((f): f is File => !!f);
      
      const afterFiles = formAfterImages
        .filter((img) => img.startsWith("data:"))
        .map((base64, i) => dataURLtoFile(base64, `after_${Date.now()}_${i}.jpg`))
        .filter((f): f is File => !!f);

      const signFile = formData.customerSignature && formData.customerSignature.startsWith("data:")
        ? dataURLtoFile(formData.customerSignature, "customer_sign.png")
        : null;

      
      const payload: CreateReportPayload = {
        jobId: job.id, // numeric ID from job object
        status: JobReportStatus.SUBMITTED,
        detail: formData.detail,
        repair_operations: formData.repairOperations,
        inspection_results: formData.inspectionResults,
        summary: formData.summaryOfOperatingResults,
        beforeImages: beforeFiles,
        afterImages: afterFiles,
        cus_sign: signFile || undefined,
        start_time: job?.technicianReport?.start_time,
        end_time: new Date().toISOString(),
        items: formData.items,
      };

      await reportService.createReport(payload);
      
      // Refresh job data to see the new submitted status and all images
      const freshJob = await jobService.getMyJobDetail(id);
      const found = freshJob.job;
      if (found) {
        setJob(found);
        setCurrentStatus(found.status);
        if (found.technicianReport?.images) {
          setStoredBeforeImages(
            found.technicianReport.images
              ?.filter((i: any) => i.type === "BEFORE")
              .map((i: any) => i.url) || []
          );
          setStoredAfterImages(
            found.technicianReport.images
              ?.filter((i: any) => i.type === "AFTER")
              .map((i: any) => i.url) || []
          );
        }
      }
      
      setShowFormModal(false);
      toast.success("ส่งรายงานสำเร็จ!");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "ไม่สามารถส่งรายงานได้");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    const displayStatus = getStatusThai(status);
    
    const styles: Record<string, string> = {
      [JobStatus.PENDING]: "bg-blue-100 text-blue-700 border-blue-200",
      [JobStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-700 border-yellow-200",
      [JobStatus.COMPLETED]: "bg-green-100 text-green-700 border-green-200",
      [JobStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
      [JobReportStatus.SUBMITTED]: "bg-indigo-100 text-indigo-700 border-indigo-200",
      [JobReportStatus.APPROVED]: "bg-green-100 text-green-700 border-green-200",
      [JobReportStatus.REJECTED]: "bg-orange-100 text-orange-700 border-orange-200",
    };

    const style = styles[s] || styles[status] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
      >
        {displayStatus}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse font-medium">
          กำลังโหลดรายละเอียดงาน...
        </p>
      </div>
    );

  if (!job)
    return (
      <div className="p-6 text-center text-gray-600">
        ไม่พบข้อมูลงานหมายเลข {id}
      </div>
    );
    
  return (
    <div className="max-w-4xl mx-auto p-2">
      <HeaderSlugTechni job={job} getStatusBadge={getStatusBadge} />
      <JobsDetail job={job} adminImages={adminImages} />

      {job.technicianReport && (
        <DetailFromTech
          job={job}
          imagesBefore={storedBeforeImages}
          imagesAfter={storedAfterImages}
        />
      )}

      {currentStatus === JobStatus.PENDING && (
        <button
          onClick={handleStartJob}
          className="fixed bottom-6 right-6 px-4 py-2.5 bg-primary text-white rounded-full shadow-lg font-medium flex items-center gap-2"
        >
          เริ่มเข้าจุดปฏิบัติงาน
        </button>
      )}

      {currentStatus === JobStatus.IN_PROGRESS && 
        (!job.technicianReport?.status || 
         job.technicianReport.status === JobReportStatus.IN_PROGRESS || 
         job.technicianReport.status === JobReportStatus.REJECTED) && (
        <button
          onClick={openFormModal}
          className="fixed bottom-6 right-8 px-5 py-3 bg-green-600 text-white rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all z-40 animate-bounce-subtle"
        >
          สรุปงานและส่งรายงาน
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
