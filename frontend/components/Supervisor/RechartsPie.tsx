import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TeamPerformance = () => {
  const data = [
    { name: "สำเร็จ", value: 20 },
    { name: "รอตรวจสอบ", value: 5 },
    { name: "ตีกลับ", value: 2 },
  ];

  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  return (
    <div className="shadow-xl bg-white rounded-lg p-3 md:p-4 text-center">
      <h2 className="text-base md:text-lg font-bold text-gray-700 mb-4">
        Team Performance
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamPerformance;
