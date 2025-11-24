"use client";

import { Loader, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PageProps {
  params: { slug: string };
}

const page = ({ params }: PageProps) => {
  const { slug } = params;

  const [job, setJob] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState("none");
  const [time, setTime] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // ดึง jobStatus
  useEffect(() => {
    const saved = localStorage.getItem("jobStatus");
    if (saved) setJobStatus(saved);
  }, []);

  // โหลดงานตาม slug
  useEffect(() => {
    const cardData = localStorage.getItem("CardWork");
    if (!cardData) return;

    const jobs = JSON.parse(cardData);
    const found = jobs.find((j: any) => j.JobId === slug);
    setJob(found || null);
  }, [slug]);

  if (!job)
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col">
          <Loader2
            className="animate-spin items-center flex justify-center"
            size={20}
          />{" "}
          กำลังโหลดข้อมูลงาน...
        </div>
      </div>
    );
  const updateJobStatus = (newStatus: string) => {
    const cardData = localStorage.getItem("CardWork");
    if (!cardData) return;

    const jobs = JSON.parse(cardData);

    const updated = jobs.map((j: any) =>
      j.JobId === slug ? { ...j, status: newStatus } : j
    );

    localStorage.setItem("CardWork", JSON.stringify(updated));
    setJob((prev: any) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="">
      {/* ลูกค้า + เวลา */}
      <div className="rounded-lg p-1 flex justify-between">
        <div>
          <p className="text-2xl">ลูกค้า : {job.customer?.name}</p>
          <p className="text-m mt-2">
            {new Date(job.createdAt).toLocaleString("th-TH")}
          </p>
        </div>

        <div className="flex flex-col justify-between text-right opacity-50">
          <p>เลขที่ใบงาน : {job.JobId}</p>
        </div>
      </div>

      {/* รายละเอียดงาน */}
      <div className="mt-4">
        <p>รายละเอียดงาน</p>
        <div className="rounded-lg bg-gray-300 p-3 my-2">
          <p>{job.description}</p>
        </div>
      </div>

      {/* สถานที่ */}
      <div className="mt-4">
        <p>map</p>
        <div className="bg-gray-300 rounded-lg p-3 my-2">map</div>
        <p>สถานที่ : {job.customer?.address || "ไม่ระบุสถานที่"}</p>
      </div>

      {/* ทีมงาน */}
      <div className="mt-4">
        <p>ทีม: {job.technicianId.join(", ")}</p>
      </div>

      {/* ปุ่มเริ่มงาน / จบงาน */}
      {job.status === "กำลังทำงาน" ? (
        <button
          onClick={() => {
            updateJobStatus("สำเร็จ");
            alert("งานเสร็จสมบูรณ์!");
            history.back();
          }}
          className="rounded-md bg-red-700 text-white py-2 px-4 w-full mt-6"
        >
          จบงาน
        </button>
      ) : (
        <button
          onClick={() => {
            updateJobStatus("กำลังทำงาน");
            alert("เริ่มงานแล้ว!");
          }}
          className="rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 w-full mt-6 text-white"
        >
          เริ่มงาน
        </button>
      )}
    </div>
  );
};

export default page;
