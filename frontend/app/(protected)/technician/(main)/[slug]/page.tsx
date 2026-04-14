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
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const { slug } = React.use(params);

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

  const fetchJobDetail = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getMyJobDetail(slug);
      const found = res.job;

      if (!found) {
        setJob(null);
        return;
      }

      setJob(found);
      setCurrentStatus(found.status);
      setAdminImages(found.images?.map((img: any) => img.url) || []);


      const report = found.reports?.[0];
      setStoredBeforeImages(report?.images?.filter((i: any) => i.type === 'BEFORE' || !i.type).map((i: any) => i.url) || []);
      setStoredAfterImages(report?.images?.filter((i: any) => i.type === 'AFTER').map((i: any) => i.url) || []);
  
    
    } catch (error: any) {
      console.error("โหลดรายละเอียดงานไม่สำเร็จ:", error);
      setJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [slug]);

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
    if (!navigator.geolocation) {
      toast.error("ไม่รองรับการหาตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const distance = getDistanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          job.latitude,
          job.longitude
        );

        if (distance > 10000000) {
          toast.error(`คุณอยู่ห่างจากจุดงาน ${Math.floor(distance)} เมตร`);
          return;
        }

        try {
          await jobService.updateMyJobStatus(slug, JobStatus.IN_PROGRESS);
          updateJobStateLocally(JobStatus.IN_PROGRESS, {
            ...(job.technicianReport || {}),
            startTime: new Date().toISOString(),
          });
          toast.success("เริ่มงานสำเร็จ!");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "ไม่สามารถเริ่มงานได้");
        }
      },
      () => toast.error("เปิดพิกัดไม่สำเร็จ กรุณาอนุญาต Location")
    );
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
      // Prepare files
      const beforeFiles = formBeforeImages
        .map((base64, i) => dataURLtoFile(base64, `before_${i}.jpg`))
        .filter((f): f is File => !!f);
      
      const afterFiles = formAfterImages
        .map((base64, i) => dataURLtoFile(base64, `after_${i}.jpg`))
        .filter((f): f is File => !!f);

      const signFile = formData.customerSignature 
        ? dataURLtoFile(formData.customerSignature, "customer_sign.png")
        : undefined;

      
      const payload: CreateReportPayload = {
        jobId: job.id, // numeric ID from job object
        status: JobReportStatus.SUBMITTED,
        detail: formData.detail,
        repair_operations: formData.repairOperations,
        inspection_results: formData.inspectionResults,
        summary: formData.summaryOfOperatingResults,
        images: [...beforeFiles, ...afterFiles],
        cus_sign: signFile || undefined,
        start_time: job?.technicianReport?.startTime,
        end_time: new Date().toISOString(),
      };

      await reportService.createReport(payload);
      
      updateJobStateLocally(JobStatus.IN_PROGRESS, { 
        ...job.technicianReport, 
        status: JobReportStatus.SUBMITTED 
      });
      setShowFormModal(false);
      toast.success("บันทึกรายงานปิดงานสำเร็จ!");
      
      // Refresh data
      fetchJobDetail();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "บันทึกรายงานไม่สำเร็จ");
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

      {currentStatus === JobStatus.IN_PROGRESS && (!job.technicianReport?.status || job.technicianReport.status === JobReportStatus.REJECTED) && (
        <button
          onClick={() => setShowFormModal(true)}
          className="fixed bottom-6 right-6 px-4 py-2.5 bg-green-600 text-white rounded-full shadow-lg font-medium flex items-center gap-2"
        >
          ส่งรายงานปิดงาน
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
