"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CirclePlus,
  ClipboardList,
  Clock,
  File,
  Share,
  UserCog,
  Users,
  Users2,
  Search,
  X,
  Filter,
} from "lucide-react";
import CardWork from "@/components/Dashboard/CardWork";
import Activities from "@/components/Dashboard/Activities";

const MainDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [card, setCard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        const cardData = localStorage.getItem("CardWork");
        const usersData = localStorage.getItem("Users");

        if (!cardData || !usersData) {
          console.warn("ไม่พบข้อมูลใน localStorage");
          setCard([]);
          return;
        }

        const parsedCards = JSON.parse(cardData);
        const parsedUsers = JSON.parse(usersData);

        const joined = parsedCards.map((job) => {
          const supervisor = parsedUsers.find(
            (u) =>
              u.role === "supervisor" &&
              String(u.id) === String(job.supervisorId)
          );

          const technicians = parsedUsers.filter(
            (u) =>
              u.role === "technician" &&
              Array.isArray(job.technicianId) &&
              job.technicianId.some((tid) => String(tid) === String(u.id))
          );

          return {
            ...job,
            supervisor: supervisor || null,
            technicians: technicians || [],
          };
        });

        setCard(joined);
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // กรองข้อมูลตามสถานะและคำค้นหา
  const filteredCard = useMemo(() => {
    return card.filter((job) => {
      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.JobId.toLowerCase().includes(searchLower) ||
        job.technicians?.some((t) =>
          t.name.toLowerCase().includes(searchLower)
        ) ||
        job.supervisor?.name.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [card, searchTerm, statusFilter]);

  // คำนวณสถิติ (เปลี่ยนเป็นข้อมูลที่กรองแล้วเมื่อมีการกรอง)
  const summary = useMemo(() => {
    const baseStats = [
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
    ];

    // ถ้ามีการกรอง ให้แสดงจำนวนที่กรอง
    if (searchTerm || statusFilter !== "all") {
      return [
        ...baseStats,
        {
          title: "จำนวนใบงาน (กรองแล้ว)",
          value: filteredCard.length,
          icon: <ClipboardList className="w-8 h-8" />,
          bg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
        {
          title: "ใบงานที่รอดำเนินการ",
          value: filteredCard.filter((j) => j.status === "รอการตรวจสอบ").length,
          icon: <Clock className="w-8 h-8" />,
          bg: "bg-orange-50",
          iconColor: "text-orange-600",
        },
      ];
    }

    // ถ้าไม่มีการกรอง แสดงทั้งหมด
    return [
      ...baseStats,
      {
        title: "จำนวนใบงานทั้งหมด",
        value: card.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        title: "ใบงานที่รอดำเนินการ",
        value: card.filter((j) => j.status === "รอการตรวจสอบ").length,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [card, filteredCard, searchTerm, statusFilter]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCard = filteredCard.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        ก่อนหน้า
      </button>
      <span className="text-sm text-gray-600">
        หน้า {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        ถัดไป
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        {summary.map((item, index) => (
          <div
            key={`summary-${index}`}
            className={`${item.bg} ${item.iconColor} rounded-xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-300  cursor-pointer border border-transparent hover:border-primary/20`}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
        {/*  */}
        <div>
          <div className="bg-white/90 rounded-t-lg shadow-md p-4 ">
            <h1 className="text-base md:text-lg font-bold text-text  gap-2 flex items-center mb-2">
              ใบงานล่าสุด <File size={20} />
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วย หมายเลขงาน, ชื่องาน, ชื่อช่าง, หรือผู้รับผิดชอบ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all")}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="สำเร็จ">สำเร็จ</option>
                  <option value="กำลังทำงาน">กำลังทำงาน</option>
                  <option value="ตีกลับ">ตีกลับ</option>
                  <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
                  <option value="รอการมอบหมายงาน">รอการมอบหมายงาน</option>
                </select>
              </div>
            </div>

            {/* Active Filters Info */}
            <div className="mt-2 text-sm text-gray-600">
              {searchTerm && <span> คำค้น: "{searchTerm}" </span>}
              {statusFilter !== "all" && <span> สถานะ: {statusFilter}</span>}
              {filteredCard.length > 0 && (
                <span className="ml-2">({filteredCard.length} รายการ)</span>
              )}
            </div>
          </div>
          <div className="bg-white/90 rounded-b-lg shadow-md px-4 pb-4">
            {filteredCard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg"> ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                <p className="text-sm mt-2">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะ</p>
              </div>
            ) : (
              <>
                <CardWork card={paginatedCard} />
                <PaginationControls />
              </>
            )}
          </div>
        </div>
           <Activities/>             
      </div>
    </div>
  );
};

export default MainDashboard;
