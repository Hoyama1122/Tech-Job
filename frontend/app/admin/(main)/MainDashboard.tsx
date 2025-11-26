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
  Home,
} from "lucide-react";
import CardWork from "@/components/Dashboard/CardWork";
import Activities from "@/components/Dashboard/Activities";
import Summary from "@/components/Dashboard/Summary/Summary";
import SummaryModal from "@/components/Dashboard/Summary/SummaryModal";
import RenderModal from "@/components/Dashboard/Summary/RenderModal";

const MainDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [card, setCard] = useState([]);
  const [users, setUsers] = useState([]); // 👈 เพิ่ม state ของ users
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState(null);


  useEffect(() => {
    try {
      setIsLoading(true);

      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (!cardData || !usersData) {
        console.warn("ไม่พบข้อมูลใน localStorage");
        setCard([]);
        setUsers([]);
        return;
      }

      const parsedCards = JSON.parse(cardData);
      const parsedUsers = JSON.parse(usersData);

      setUsers(parsedUsers); // 👈 เซ็ต users

      const joined = parsedCards.map((job) => {
        const supervisor = parsedUsers.find(
          (u) =>
            u.role === "supervisor" && String(u.id) === String(job.supervisorId)
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
  }, []);

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

  const summary = useMemo(() => {
    const technicians = users.filter((u) => u.role === "technician").length;
    const supervisors = users.filter((u) => u.role === "supervisor").length;

    const waitingJobs = card.filter((j) => j.status === "รอการตรวจสอบ").length;

    const baseStats = [
      {
        type: "technicians",
        title: "จำนวนช่างทั้งหมด",
        value: technicians,
        icon: <Users className="w-8 h-8" />,
        bg: "bg-blue-200",
        iconColor: "text-blue-700",
      },
      {
        type: "supervisors",
        title: "จำนวนหัวหน้าทีมทั้งหมด",
        value: supervisors,
        icon: <UserCog className="w-8 h-8" />,
        bg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ];

    if (searchTerm || statusFilter !== "all") {
      return [
        ...baseStats,
        {
          type: "jobs_all",
          title: "จำนวนใบงานทั้งหมด",
          value: card.length,
          icon: <ClipboardList className="w-8 h-8" />,
          bg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
        {
          type: "jobs_waiting",
          title: "ใบงานที่รอการตรวจสอบ",
          value: waitingJobs,
          icon: <Clock className="w-8 h-8" />,
          bg: "bg-orange-50",
          iconColor: "text-orange-600",
        },
      ];
    }

    return [
      ...baseStats,
      {
        title: "จำนวนใบงานทั้งหมด",
        type: "jobs_all",
        value: card.length,
        icon: <ClipboardList className="w-8 h-8" />,
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        type: "jobs_waiting",
        title: "ใบงานที่รอการตรวจสอบ",
        value: waitingJobs,
        icon: <Clock className="w-8 h-8" />,
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [users, card, filteredCard, searchTerm, statusFilter]);

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
    <div className="px-4 pt-4 pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3"><Home className="w-8 h-8"/>หน้าหลัก</h1>
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
        </div>
      </div>

      {/* Summary Cards */}
      <Summary summary={summary} onSelect={(item) => setDetail(item)} />
    
      <RenderModal
        detail={detail}
        users={users}
        card={card}
        onClose={() => setDetail(null)}
      />
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
        {/*  */}
        <div className="">
          <div className="bg-white/90 rounded-t-lg shadow-md px-4 pt-4">
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
                  className="w-full pl-10 pr-4 py-2.5 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
            <div className="mt-2 text-sm text-gray-600 pb-4">
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
        <Activities />
      </div>
    </div>
  );
};

export default MainDashboard;
