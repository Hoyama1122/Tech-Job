// components/Dashboard/Work/StatsSummary.tsx
import { Clock, FileText, User } from "lucide-react";

interface Props {
  stats: {
    "รอการตรวจสอบ": number;
    "รอการดำเนินงาน": number;
    "กำลังทำงาน": number;
    "สำเร็จ": number;
    "ตีกลับ": number;
  };
}

const STATUS_ITEMS = [
  {
    key: "รอการตรวจสอบ",
    label: "รอการตรวจสอบ",
    Icon: Clock,
    style: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      textDark: "text-blue-800",
      iconBg: "bg-blue-200",
      icon: "text-blue-600",
    },
  },
  {
    key: "รอการดำเนินงาน",
    label: "รอการดำเนินงาน",
    Icon: Clock,
    style: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      textDark: "text-orange-800",
      iconBg: "bg-orange-200",
      icon: "text-orange-600",
    },
  },
  {
    key: "กำลังทำงาน",
    label: "กำลังทำงาน",
    Icon: Clock,
    style: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      textDark: "text-yellow-800",
      iconBg: "bg-yellow-200",
      icon: "text-yellow-600",
    },
  },
  {
    key: "สำเร็จ",
    label: "สำเร็จ",
    Icon: FileText,
    style: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      textDark: "text-emerald-800",
      iconBg: "bg-emerald-200",
      icon: "text-emerald-600",
    },
  },
  {
    key: "ตีกลับ",
    label: "ตีกลับ",
    Icon: User,
    style: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      textDark: "text-red-800",
      iconBg: "bg-red-200",
      icon: "text-red-600",
    },
  },
];

export default function StatsSummary({ stats }: Props) {

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {STATUS_ITEMS.map(({ key, label, Icon, style }) => (
        <div
          key={key}
          className={`${style.bg} ${style.border} rounded-xl p-4 border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${style.text} font-medium`}>{label}</p>
              <p className={`text-2xl font-bold ${style.textDark}`}>
                {stats[key] || 0}
              </p>
            </div>
            <div className={`p-2 ${style.iconBg} rounded-lg`}>
              <Icon className={`w-5 h-5 ${style.icon}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
