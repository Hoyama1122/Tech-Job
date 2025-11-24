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

const colorClasses = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", textDark: "text-blue-800", iconBg: "bg-blue-200", icon: "text-blue-600" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", textDark: "text-yellow-800", iconBg: "bg-yellow-200", icon: "text-yellow-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", textDark: "text-purple-800", iconBg: "bg-purple-200", icon: "text-purple-600" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", textDark: "text-emerald-800", iconBg: "bg-emerald-200", icon: "text-emerald-600" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", textDark: "text-red-800", iconBg: "bg-red-200", icon: "text-red-600" },
};


const items = [
  { key: "รอการตรวจสอบ", label: "รอการตรวจสอบ", Icon: Clock, color: "blue" as const },
  { key: "รอการดำเนินงาน", label: "รอการดำเนินงาน", Icon: Clock, color: "purple" as const }, 
  { key: "กำลังทำงาน", label: "กำลังทำงาน", Icon: Clock, color: "yellow" as const },
  { key: "สำเร็จ", label: "สำเร็จ", Icon: FileText, color: "emerald" as const },
  { key: "ตีกลับ", label: "ตีกลับ", Icon: User, color: "red" as const },
];

export default function StatsSummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {items.map(({ key, label, Icon, color }) => {
        const cls = colorClasses[color];
        return (
          <div key={key} className={`${cls.bg} ${cls.border} rounded-xl p-4 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${cls.text} font-medium`}>{label}</p>
                <p className={`text-2xl font-bold ${cls.textDark}`}>{stats[key as keyof typeof stats] || 0}</p>
              </div>
              <div className={`p-2 ${cls.iconBg} rounded-lg`}>
                <Icon className={`w-5 h-5 ${cls.icon}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}