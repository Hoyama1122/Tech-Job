import React from 'react'
import { CheckCircle2, ClipboardList, Clock, RotateCcw } from "lucide-react";

const Statistic = () => {
    const stats = [
    {
      title: "ทั้งหมด",
      value: 32,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "รอตรวจสอบ",
      value: 5,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      title: "สำเร็จ",
      value: 20,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "ตีกลับ",
      value: 2,
      icon: RotateCcw,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
   <div className="flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col items-center p-4 rounded-lg ${item.bg} shadow-md`}
              >
                <item.icon className={`${item.color} w-8 h-8`} />
                <p className={`${item.color} text-lg font-semibold`}>
                  {item.title}
                </p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
  )
}

export default Statistic