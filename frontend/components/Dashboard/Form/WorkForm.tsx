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

const WorkForm = () => {
  const [loc, setLoc] = useState({ lat: 13.85, lng: 100.58 });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([]);

  const methods = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      technicianId: [],
      dateRange: {
        startAt: "",
        endAt: "",
      },
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
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const technicians = users.filter((u) => u.role === "technician");
    setAvailableTechnicians(technicians);
  }, []);

  // Convert file to Base64
  const convertToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async (data: WorkFormValues) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));

      const users = JSON.parse(localStorage.getItem("Users") || "[]");
      const current = JSON.parse(localStorage.getItem("CardWork") || "[]");

      // Convert uploaded images → base64
      const images = data.image?.length
        ? await Promise.all(Array.from(data.image).map(convertToBase64))
        : [];

      // Map technicians
      const technicianObjects = users.filter((u) =>
        data.technicianId?.map(Number).includes(u.id)
      );

      // Parse Thai Date → JS Date
      const parseThaiDate = (str: string) => {
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
        return new Date(Number(y) - 543, months[m], Number(d));
      };

      const startObj = parseThaiDate(data.dateRange.startAt);
      const endObj = parseThaiDate(data.dateRange.endAt);

      const startISO = startObj
        ? `${startObj.toISOString().split("T")[0]}T${
            data.startTime || "00:00"
          }:00`
        : null;

      const endISO = endObj
        ? `${endObj.toISOString().split("T")[0]}T${data.endTime || "00:00"}:00`
        : null;

      const now = new Date();

      // Generate imageKey สำหรับเก็บรูป admin
      const imageKey = `JOB_${String(current.length + 1).padStart(
        3,
        "0"
      )}_ADMIN`;

      const newWork = {
        id: current.length + 1,
        JobId: `JOB_${String(current.length + 1).padStart(3, "0")}`,
        title: data.title,
        description: data.description,
        dateRange: { startAt: startISO, endAt: endISO },
        status: "รอการดำเนินงาน",
        createdAt: now.toISOString(),
        assignedAt: null,
        dueDate: null,
        completedAt: null,
        approvedAt: null,
        category: data.category,
        userId: 1,
        supervisorId: Number(data.supervisorId) || 0,
        technicianId: data.technicianId?.map(Number) || [],
        technician: technicianObjects,
        customer: {
          name: data.customerName,
          phone: data.customerPhone,
          address: data.address,
        },

        // รูปเก็บแบบ key
        imageKey,
        image: [],

        loc: loc,
      };

      localStorage.setItem("CardWork", JSON.stringify([...current, newWork]));

      const imgStore = JSON.parse(localStorage.getItem("ImagesStore") || "{}");
      imgStore[imageKey] = images;
      localStorage.setItem("ImagesStore", JSON.stringify(imgStore));

      sendNotificationToTechnicians(newWork.technicianId, newWork);

      reset();
      toast.success("เพิ่มใบงานสำเร็จ!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("เพิ่มใบงานไม่สำเร็จ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* LEFT */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <JobInfoSection register={register} errors={errors} />
            <DateRangeSection
              errors={errors}
              technicians={availableTechnicians}
            />
            <ImageUpload setValue={setValue} register={register} />
          </div>

          {/* RIGHT */}
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
