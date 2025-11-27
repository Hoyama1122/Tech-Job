"use client";

import { AlertCircle, FileDiff, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { WorkFormValues, workSchema } from "@/lib/Validations/SchemaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import JobInfoSection from "./JobInfoSection";
import DateRangeSection from "./DateRangeSection";
import ImageUpload from "./ImageUpload";
import LocationSection from "./LocationSection";
import CustomerSection from "./CustomerSection";
import { sendNotificationToTechnicians } from "@/lib/Noti/SendNoti";


const LS = {
  USERS: "Users",
  WORK: "CardWork",
  IMAGES: "ImagesStore",
};


const parseThaiDate = (str: string | null) => {
  if (!str) return null;

  const months: Record<string, number> = {
    มกราคม: 0,
    กุมภาพันธ์: 1,
    มีนาคม: 2,
    เมษายน: 3,
    พฤษภาคม: 4,
    มิถุนายน: 5,
    กรกฎาคม: 6,
    สิงหาคม: 7,
    กันยายน: 8,
    ตุลาคม: 9,
    พฤศจิกายน: 10,
    ธันวาคม: 11,
  };

  const match = str.match(/(\d{1,2}) (\S+) (\d{4})/);
  if (!match) return null;

  const [, d, m, y] = match;
  const year = Number(y) - 543;
  return new Date(year, months[m], Number(d));
};

const generateJobId = (count: number) =>
  `JOB_${String(count + 1).padStart(3, "0")}`;

const createImageKey = (jobId: string) => `${jobId}_ADMIN`;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });


const getTechnicians = () => {
  const users = JSON.parse(localStorage.getItem(LS.USERS) || "[]");
  return users.filter((u: any) => u.role === "technician");
};


const WorkForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([]);
  const [loc, setLoc] = useState({ lat: 13.85, lng: 100.58 });

  // Form
  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      technicianId: [],
      dateRange: { startAt: "", endAt: "" },
      location: { lat: null, lng: null },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    setAvailableTechnicians(getTechnicians());
  }, []);

  const onSubmit = async (data: WorkFormValues) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));

      const users = JSON.parse(localStorage.getItem(LS.USERS) || "[]");
      const jobs = JSON.parse(localStorage.getItem(LS.WORK) || "[]");

      const jobId = generateJobId(jobs.length);
      const imageKey = createImageKey(jobId);

      const images = data.image?.length
        ? await Promise.all(Array.from(data.image).map(fileToBase64))
        : [];

      // map technicians
      const techIds = data.technicianId.map(Number);

      const technicianObjects = users.filter((u: any) =>
        techIds.includes(Number(u.id))
      );

      // Date
      const startDate = parseThaiDate(data.dateRange.startAt);
      const endDate = parseThaiDate(data.dateRange.endAt);

      const startISO =
        startDate &&
        `${startDate.toISOString().split("T")[0]}T${
          data.startTime || "00:00"
        }:00`;

      const endISO =
        endDate &&
        `${endDate.toISOString().split("T")[0]}T${data.endTime || "00:00"}:00`;

      const now = new Date();

      // New job 
      const newJob = {
        id: jobs.length + 1,
        JobId: jobId,
        title: data.title,
        description: data.description,
        category: data.category,
        status: "รอการดำเนินงาน",
        createdAt: now.toISOString(),
        dateRange: { startAt: startISO, endAt: endISO },
        supervisorId: Number(data.supervisorId) || null,
        technicianId: data.technicianId.map(Number),
        technician: technicianObjects,
        customer: {
          name: data.customerName,
          phone: data.customerPhone,
          address: data.address,
        },
        imageKey,
        loc,
      };

      // Save Jobs
      localStorage.setItem(LS.WORK, JSON.stringify([...jobs, newJob]));
      const imgStore = JSON.parse(localStorage.getItem(LS.IMAGES) || "{}");
      imgStore[imageKey] = images;
      localStorage.setItem(LS.IMAGES, JSON.stringify(imgStore));
      // send noti
      sendNotificationToTechnicians(newJob.technicianId, newJob);
      reset();
      toast.success("เพิ่มใบงานสำเร็จ!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการสร้างใบงาน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* left */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <JobInfoSection register={register} errors={errors} />
            <DateRangeSection
              errors={errors}
              technicians={availableTechnicians}
            />
            <ImageUpload setValue={setValue} register={register} />
          </div>

          {/* right */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <LocationSection
              onLocationSelect={(pos) => setLoc(pos)}
              setLoc={setLoc}
              setValue={setValue}
            />

            {errors.location?.message && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                <AlertCircle className="w-4 h-4" />
                {errors.location.message}
              </div>
            )}

            <CustomerSection register={register} errors={errors} />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" disabled={loading} className="button-create">
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FileDiff size={18} />
            )}
            {loading ? "กำลังสร้าง" : "สร้างใบงาน"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkForm;
