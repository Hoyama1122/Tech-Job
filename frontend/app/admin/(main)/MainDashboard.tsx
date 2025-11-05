import {
  ClipboardList,
  Clock,
  UserCog,
  Users,
  Users2,
} from "lucide-react";
import React from "react";

const MainDashboard = () => {
  const summary = [
    {
      title: "จำนวนช่างทั้งหมด",
      value: 132,
      icon: <Users className="w-10 h-10 text-[color:var(--color-primary)]" />,
      bg: "bg-neutral",
    },
    {
      title: "จำนวนหัวหน้าทีมทั้งหมด",
      value: 28,
      icon: <UserCog className="w-10 h-10 text-[color:var(--color-accent)]" />,
      bg: "bg-[color:var(--color-neutral)]",
    },
    {
      title: "จำนวนทีมทั้งหมด",
      value: 48,
      icon: <Users2 className="w-10 h-10 text-[color:var(--color-secondary)]" />,
      bg: "bg-[color:var(--color-neutral)]",
    },
    {
      title: "จำนวนใบงานทั้งหมด",
      value: 254,
      icon: <ClipboardList className="w-10 h-10 text-[color:var(--color-hover)]" />,
      bg: "bg-[color:var(--color-neutral)]",
    },
    {
      title: "ใบงานที่รอดำเนินการ",
      value: 12,
      icon: <Clock className="w-10 h-10 text-amber-600" />,
      bg: "bg-[color:var(--color-neutral)]",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {summary.map((item, index) => (
          <div
            key={index}
            className={`transition-all duration-200 ease-in-out ${item.bg}  rounded-xl p-5 flex flex-col justify-between shadow-md cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              {item.icon}
              <span className="text-3xl font-bold">{item.value}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-[color:var(--color-text-secondary)]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
