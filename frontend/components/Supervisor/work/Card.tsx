import { CardWorkTypes } from "@/lib/Mock/CardWork";
import Image from "next/image";
import React from "react";
import NotFound from "@/public/assets/notfounddata.webp";
import { Clock, Eye, User } from "lucide-react";
type CardProps = {
  CardWork: CardWorkTypes[];
};

const Card = ({ CardWork }: CardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "รอการตรวจสอบ":
        return "bg-accent text-white";
      case "ตีกลับ":
        return "bg-red-100 text-red-700";
      case "รอการอนุมัติ":
        return "bg-blue-100 text-blue-700";
      case "สำเร็จ":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //  No data
  if (CardWork.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
        <p className="text-2xl font-semibold">ไม่พบข้อมูล</p>
        <p className="text-xl text-gray-400">ไม่มีใบงานในสถานะนี้</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {CardWork.map((data, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg overflow-hidden shadow-2xl"
        >
          <div className="relative">
            <Image
              src={data.image}
              alt={data.JobId}
              className="h-48 w-full object-cover rounded-t-xl"
            />
            <span
              className={`absolute top-3 right-3 ${getStatusClass(
                data.status
              )} font-semibold text-xs px-3 py-1 rounded-full shadow`}
            >
              {data.status}
            </span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-text-secondaryfont-medium">
                {data.JobId}
              </p>
              {/* <span className="text-sm font-semibold">{data.sla}</span> */}
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                {data.title}
              </p>
            </div>
            <div className="flex items-center mt-2 justify-between px-1">
              <div className="flex items-center  justify-center gap-2">
                <User size={18} />
                <p>{data.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-accent"/>
                <p className="text-sm">{data.date}</p>
              </div>
            </div>
            <div className="flex justify-end items-center mt-3 ">
              
              <button className="flex items-center bg-primary px-4 py-2 rounded-lg hover:bg-primary-hover duration-300 transition-all text-white cursor-pointer gap-2">
                <Eye />
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
