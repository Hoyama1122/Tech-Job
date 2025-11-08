"use client";
import CardWork from "@/components/Dashboard/CardWork";
import { getStatusClass } from "@/components/getStatusclass";
import {
  CirclePlus,
  ClipboardList,
  Clock,
  File,
  Share,
  UserCog,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MainDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [card, setcard] = useState([]);
  const summary = [
    {
      title: "จำนวนช่างทั้งหมด",
      value: 132,
      icon: <Users className="w-8 h-8" />,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "จำนวนหัวหน้าทีมทั้งหมด",
      value: 28,
      icon: <UserCog className="w-8 h-8" />,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "จำนวนทีมทั้งหมด",
      value: 48,
      icon: <Users2 className="w-8 h-8" />,
      bg: "bg-gray-50",
      iconColor: "text-gray-700",
    },
    {
      title: "จำนวนใบงานทั้งหมด",
      value: card.length || 254,
      icon: <ClipboardList className="w-8 h-8" />,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "ใบงานที่รอดำเนินการ",
      value: card.filter((j) => j.status === "รอการตรวจสอบ").length || 12,
      icon: <Clock className="w-8 h-8" />,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  useEffect(() => {
    const CardData = localStorage.getItem("CardWork");
    const TechnicianData = localStorage.getItem("Technician");
    const SuervisorData = localStorage.getItem("Supervisor");

    if (CardData && TechnicianData && SuervisorData) {
      const parsedCard = JSON.parse(CardData);
      const parsedTech = JSON.parse(TechnicianData);
      const parsedSupervisor = JSON.parse(SuervisorData);

      // Join ใบงาน + Technician
      const joined = parsedCard.map((job: any) => {
        const technicians = parsedTech.filter((tech: any) =>
          Array.isArray(job.technicianId)
            ? job.technicianId.includes(tech.id)
            : false
        );
        const supervisor = parsedSupervisor.find(
          (sup: any) => sup.id === job.supervisorId
        );

        return { ...job, technicians, supervisor: supervisor || null };
      });

      setcard(joined);
    }
  }, [setcard]);

//  Pagination
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCard = card.slice(startIndex, endIndex);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">หน้าหลัก</h1>
          <p className="text-sm text-text-secondary mt-1">
            ภาพรวมระบบจัดการงานช่าง
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/admin/add-work"
            className="button-create flex items-center gap-2 bg-accent hover:bg-accent/80 transition-all duration-200 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <CirclePlus className="w-5 h-5" />
            สร้างงานใหม่
          </Link>

          <button className="flex items-center gap-2 bg-primary/90 hover:bg-primary-hover transition-all duration-200 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <Share strokeWidth={2.5} className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>
      {/*  */}
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {summary.map((item, index) => (
            <div
              key={`${item.JobId}-${index}`}
              className={`${item.bg} ${item.iconColor} rounded-xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-transparent hover:border-primary/20`}
            >
              <div className="p-3 bg-white/40 rounded-lg backdrop-blur-sm">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary">
                  {item.title}
                  
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/*  */}
      </div>
      {/* Main */}
      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mt-4">
          <div className="bg-white/90 rounded-lg shadow-md p-4">
            <h1 className="text-base md:text-lg font-bold text-text  gap-2 flex items-center">
              ใบงานล่าสุด <File size={20} />
            </h1>
            <div>
              <CardWork card={paginatedCard} />
            </div>
          </div>
          <div className="flex flex-col space-y-2 ">
            <div className="bg-white h-1/2 p-4">
              <h1>กิจกรรม</h1>
            </div>
            <div className="bg-white h-1/2 p-4">
              <h1>กิจกรรม</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
