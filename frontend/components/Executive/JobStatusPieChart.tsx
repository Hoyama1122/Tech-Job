"use client";

import React from "react";
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
  totalJobs: number;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function JobStatusPieChart({ data, totalJobs }: JobStatusPieChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
        <PieIcon size={20} className="text-purple-500" />
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
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            ไม่มีข้อมูล
          </div>
        )}
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
          <div className="text-center">
            <span className="text-3xl font-bold text-slate-700">
              {totalJobs}
            </span>
            <p className="text-xs text-slate-500">Jobs</p>
          </div>
        </div>
      </div>
    </div>
  );
}