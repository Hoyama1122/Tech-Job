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
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "จำนวนหัวหน้าทีมทั้งหมด",
      value: 28,
      icon: <UserCog className="w-8 h-8 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      title: "จำนวนทีมทั้งหมด",
      value: 48,
      icon: <Users2 className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "จำนวนใบงานทั้งหมด",
      value: 254,
      icon: <ClipboardList className="w-8 h-8 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "ใบงานที่รอดำเนินการ",
      value: 12,
      icon: <Clock className="w-8 h-8 text-amber-600" />,
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-5  gap-4">
        {summary.map((item, index) => (
          <div key={index}>
            <div>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
