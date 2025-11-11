"use client";

import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Download,
  Share2,
  MapPin,
  Image as ImageIcon,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Technician {
  id: string;
  name: string;
  avatar?: string;
}

interface Job {
  id: string;
  JobId: string;
  title: string;
  description: string;
  status:
    | "รอการตรวจสอบ"
    | "รอการมอบหมายงาน"
    | "กำลังทำงาน"
    | "สำเร็จ"
    | "ตีกลับ";
  supervisor?: { name: string };
  technician?: Technician[];
  date: string;
  images?: string[];
  location?: string;
  notes?: string;
}

interface PageProps {
  params: { slug: string };
}

export default function WorkDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = params;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const cardData = localStorage.getItem("CardWork");
      const supervisorData = localStorage.getItem("Supervisor");
      const technicianData = localStorage.getItem("Technician");

      if (cardData) {
        const parsedJobs = JSON.parse(cardData);
        const foundJob = parsedJobs.find((j: any) => j.JobId === slug);

        if (foundJob) {
          const supervisors = supervisorData ? JSON.parse(supervisorData) : [];
          const technicians = technicianData ? JSON.parse(technicianData) : [];

          const supervisor = supervisors.find(
            (sup: any) => String(sup.id) === String(foundJob.supervisorId)
          );
          const assignedTechnicians = technicians.filter((tech: any) =>
            foundJob.technicianId?.includes(tech.id)
          );

          setJob({
            ...foundJob,
            supervisor: supervisor || null,
            technician: assignedTechnicians || [],
          });
        } else {
          setJob(null);
        }
      }
    } catch (error) {
      console.error("❌ Error loading job details:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [slug]);

  const getStatusStyle = (status: string) => {
    switch (status?.trim()) {
      case "สำเร็จ":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "กำลังทำงาน":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ตีกลับ":
        return "bg-red-100 text-red-700 border-red-200";
      case "รอการตรวจสอบ":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "รอการมอบหมายงาน":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!job) {
    return <NotFoundPage jobId={slug} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปยังรายการ
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("📥 กำลังดาวน์โหลดรายงาน...")}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลด
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">รายละเอียดใบงาน</h1>
            <p className="text-sm text-gray-500 mt-1">หมายเลข: #{job.JobId}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              ข้อมูลพื้นฐาน
            </h2>
            <div className="space-y-4">
              <InfoRow
                label="หมายเลขใบงาน"
                value={`#${job.JobId}`}
                valueClass="font-mono font-bold text-primary"
              />
              <InfoRow
                label="ชื่องาน"
                value={job.title}
                valueClass="font-semibold text-gray-900 text-right max-w-xs"
              />
              <InfoRow
                label="สถานะ"
                value={job.status}
                valueClass={getStatusStyle(job.status)}
                isBadge
              />
              <InfoRow
                label="วันที่สร้าง"
                value={job.date || job.createdAt || "-"}
              />
              {job.location && <InfoRow label="สถานที่" value={job.location} />}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                รายละเอียดงาน
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Evidence Images */}
          {job.images && job.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-primary" />
                หลักฐานการทำงาน ({job.images.length} รูป)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`หลักฐาน ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.open(img, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Supervisor & Technicians */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              ผู้รับผิดชอบ
            </h3>

            {job.supervisor && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">หัวหน้างาน</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {job.supervisor.name?.charAt(0) || "?"}
                  </div>
                  <span className="font-medium text-gray-900">
                    {job.supervisor.name}
                  </span>
                </div>
              </div>
            )}

            {job.technician && job.technician.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">
                  ช่างที่รับผิดชอบ ({job.technician.length} คน)
                </p>
                <div className="space-y-2">
                  {job.technician.map((tech) => (
                    <div key={tech.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm">
                        {tech.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-sm text-gray-700">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">การจัดการ</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/work/${job.JobId}/edit`}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                <Edit className="w-5 h-5" />
                แก้ไขใบงาน
              </Link>
              <button
                onClick={() => alert("✅ อนุมัติใบงานเรียบร้อย")}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                อนุมัติงาน
              </button>
              <button
                onClick={() => alert("🔄 ส่งกลับเพื่อแก้ไข")}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                <XCircle className="w-5 h-5" />
                ส่งกลับแก้ไข
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// แยก Components ย่อย
function InfoRow({
  label,
  value,
  valueClass = "",
  isBadge = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  isBadge?: boolean;
}) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      {isBadge ? (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${valueClass}`}
        >
          {value}
        </span>
      ) : (
        <span className={`text-sm font-medium text-gray-900 ${valueClass}`}>
          {value}
        </span>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </>
  );
}

function NotFoundPage({ jobId }: { jobId: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">ไม่พบใบงาน</h1>
      <p className="text-gray-600 mb-8">
        ไม่พบใบงานที่มีหมายเลข{" "}
        <span className="font-mono font-bold text-primary">#{jobId}</span>
      </p>
      <Link
        href="/admin/work"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        กลับไปยังรายการใบงาน
      </Link>
    </div>
  );
}
