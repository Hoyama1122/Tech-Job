"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

interface JobStatusPieChartProps {
  data: { name: string; value: number }[];
}

// กำหนดสีตายตัวตามสถานะเพื่อให้สื่อความหมายง่ายขึ้น
const STATUS_COLORS: Record<string, string> = {
  "สำเร็จ": "#10B981",         // เขียว (Emerald-500)
  "กำลังทำงาน": "#3B82F6",     // ฟ้า (Blue-500)
  "รอการตรวจสอบ": "#F59E0B",   // เหลือง (Amber-500)
  "ตีกลับ": "#EF4444",         // แดง (Red-500)
  "รอการดำเนินงาน": "#8B5CF6", // ม่วง (Violet-500)
  "อื่นๆ": "#94A3B8"           // เทา (Slate-400)
};

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function JobStatusPieChart({ data }: JobStatusPieChartProps) {
  // คำนวณยอดรวมเพื่อแสดงตรงกลาง Donut
  const total = useMemo(() => data.reduce((acc, cur) => acc + cur.value, 0), [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <PieIcon size={24} className="text-primary" />
        สัดส่วนสถานะงาน
      </h3>
      
      <div className="flex-1 min-h-[300px] relative">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60} // ทำให้เป็น Donut
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [value, 'จำนวนงาน']}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            ไม่มีข้อมูล
          </div>
        )}
        
        {/* แสดงตัวเลขยอดรวมตรงกลาง */}
        {data.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-14">
                <span className="text-4xl font-bold text-slate-700">{total}</span>
                <span className="text-xs text-slate-500">งานทั้งหมด</span>
            </div>
        )}
      </div>
    </div>
  );
}