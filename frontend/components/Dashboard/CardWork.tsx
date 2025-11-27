"use client";
import { Eye } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const getBadgeStatusClass = (status): string => {
  const statusMap = {
    สำเร็จ: "bg-green-100 text-green-700",
    กำลังทำงาน: "bg-yellow-100 text-yellow-700",
    ตีกลับ: "bg-red-100 text-red-700",
    รอการตรวจสอบ: "bg-blue-100 text-blue-700",
    รอการดำเนินงาน: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return statusMap[status] || "bg-gray-50 text-gray-600";
};

export const getStatusClass = (status: JobStatus): string => {
  return getBadgeStatusClass(status);
};

const CardWork = ({ card }) => {
  const [role, setRole] = useState<string | null>(null);
  

  useEffect(() => {
    try {
      const auth = localStorage.getItem("auth-storage");
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth?.state?.role) {
          setRole(parsedAuth.state.role);
        }
      }
    } catch (error) {
      console.error("Error parsing auth storage:", error);
    }
  }, []);

  const DesktopView = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-primary rounded-lg text-white">
            <th className="w-[100px] px-4 py-2 text-left font-semibold">
              หมายเลข
            </th>
            <th className="w-[160px] px-4 py-2 text-left font-semibold">
              ผู้ทำงาน
            </th>
            <th className="w-[280px] px-4 py-2 text-left font-semibold">งาน</th>
            <th className="w-[150px] px-4 py-2 text-left font-semibold text-sm">
              ผู้รับผิดชอบ
            </th>
            <th className="w-[120px] px-4 py-2 text-left font-semibold">
              สถานะ
            </th>
            <th className="w-[100px] px-4 py-2 text-left font-semibold">
              ดำเนินการ
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {card.length > 0 ? (
            card.map((work, index) => (
              <tr
                key={work.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
              >
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">
                  {work.JobId}
                </td>
                <td
                  className="px-4 py-2 text-sm text-gray-700 max-w-[150px] truncate"

                >
                  {work.technicians?.map((t) => t.name).join(", ") || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">{work.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {work.description?.slice(0, 40) + "..."}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {work.supervisor?.name || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-lg ${getBadgeStatusClass(
                      work.status
                    )}`}
                  >
                    {work.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 text-center">

                  <Link
                    href={`/${role}/work/${work.JobId}`}
                    className="flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary cursor-pointer" />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center text-gray-400 py-6 text-sm italic"
              >
                ไม่มีข้อมูลใบงาน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );


  const MobileView = () => (
    <div className="md:hidden space-y-3 mt-4">
      {card.length > 0 ? (
        card.map((work) => (
          <div
            key={work.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold text-sm text-primary">
                {work.JobId}
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${getBadgeStatusClass(
                  work.status
                )}`}
              >
                {work.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{work.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {work.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">ช่าง:</span>
                <span className="text-gray-700 text-right">
                  {work.technicians?.map((t) => t.name).join(", ") || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">ผู้รับผิดชอบ:</span>
                <span className="text-gray-700">
                  {work.supervisor?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8 text-sm italic">
          ไม่มีข้อมูลใบงาน
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
};

export default CardWork;
