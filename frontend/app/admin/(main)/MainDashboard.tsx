"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CirclePlus,
  ClipboardList,
  Clock,
  File,
  Search,
  Filter,
  Home,
  UserCog,
  Users,
} from "lucide-react";

import CardWork from "@/components/Dashboard/CardWork";
import Activities from "@/components/Dashboard/Activities";
import Summary from "@/components/Dashboard/Summary/Summary";
import RenderModal from "@/components/Dashboard/Summary/RenderModal";

const MainDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [card, setCard] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      const cardData = JSON.parse(localStorage.getItem("CardWork") || "[]");
      const usersData = JSON.parse(localStorage.getItem("Users") || "[]");

      setUsers(usersData);

      const joined = cardData.map((job) => {
        const supervisor = usersData.find(
          (u) =>
            u.role === "supervisor" && String(u.id) === String(job.supervisorId)
        );

        const technicians = usersData.filter(
          (u) =>
            u.role === "technician" &&
            job.technicianId?.some((tid) => String(tid) === String(u.id))
        );

        return { ...job, supervisor, technicians };
      });

      setCard(joined);
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว:", err);
    }
    setIsLoading(false);
  }, []);

  // Filter Serach
  const filteredCard = card.filter((job) => {
    const search = searchTerm.toLowerCase();

    const matchSearch =
      job.title.toLowerCase().includes(search) ||
      job.description.toLowerCase().includes(search) ||
      job.JobId.toLowerCase().includes(search) ||
      job.supervisor?.name?.toLowerCase().includes(search) ||
      job.technicians?.some((t) => t.name.toLowerCase().includes(search));

    const matchStatus = statusFilter === "all" || job.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const summary = [
    {
      type: "technicians",
      title: "จำนวนช่างทั้งหมด",
      value: users.filter((u) => u.role === "technician").length,
      icon: <Users className="w-8 h-8" />,
      bg: "bg-blue-200",
      iconColor: "text-blue-700",
    },
    {
      type: "supervisors",
      title: "จำนวนหัวหน้าทีมทั้งหมด",
      value: users.filter((u) => u.role === "supervisor").length,
      icon: <UserCog className="w-8 h-8" />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
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
      value: card.filter((j) => j.status === "รอการตรวจสอบ").length,
      icon: <Clock className="w-8 h-8" />,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCard.length / itemsPerPage);
  const paginatedCard = filteredCard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ก่อนหน้า
      </button>
      <span className="text-sm text-gray-600">
        หน้า {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ถัดไป
      </button>
    </div>
  );

  // Loading screen
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Home className="w-8 h-8" />
            หน้าหลัก
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            ภาพรวมระบบจัดการงานช่าง
          </p>
        </div>
        <Link
          href="/admin/add-work"
          className="button-create flex items-center gap-2 bg-accent hover:bg-accent/80 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md"
        >
          <CirclePlus className="w-5 h-5" />
          สร้างงานใหม่
        </Link>
      </div>

      <Summary summary={summary} onSelect={(item) => setDetail(item)} />

      <RenderModal
        detail={detail}
        users={users}
        card={card}
        onClose={() => setDetail(null)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
        <div>
          <div className="bg-white/90 rounded-t-lg shadow-md px-4 pt-4">
            <h1 className="text-base md:text-lg font-bold flex items-center gap-2 mb-2">
              ใบงานล่าสุด <File size={20} />
            </h1>

            {/* Search + Filter  */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border rounded-lg"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="สำเร็จ">สำเร็จ</option>
                  <option value="กำลังทำงาน">กำลังทำงาน</option>
                  <option value="ตีกลับ">ตีกลับ</option>
                  <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
                  <option value="รอการดำเนินงาน">รอการดำเนินงาน</option>
                </select>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600 pb-4">
              {searchTerm && <span>คำค้น: "{searchTerm}" </span>}
              {statusFilter !== "all" && <span>สถานะ: {statusFilter}</span>}
              {filteredCard.length > 0 && (
                <span className="ml-2">({filteredCard.length} รายการ)</span>
              )}
            </div>
          </div>

          <div className="bg-white/90 rounded-b-lg shadow-md px-4 pb-4">
            {filteredCard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
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
