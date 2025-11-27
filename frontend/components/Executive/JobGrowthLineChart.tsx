"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: any[];
  years: string[]; // รับปีที่ต้องการแสดงผล เช่น ["2024", "2025"]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const JobGrowthLineChart = ({ data, years }: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        แนวโน้มปริมาณงานรายเดือน
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" style={{ fontSize: '0.8rem' }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {years.map((year, index) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              name={`ปี ${year}`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobGrowthLineChart;