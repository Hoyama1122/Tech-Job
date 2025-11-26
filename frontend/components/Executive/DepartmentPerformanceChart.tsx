
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepartmentPerformanceChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <BarChart3 size={24} className="text-primary" />
                ประสิทธิภาพรายแผนก
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                        dataKey="name" 
                        angle={-30} 
                        textAnchor="end" 
                        interval={0} 
                        height={50}
                        style={{ fontSize: '0.8rem' }}

                    />
                    <YAxis allowDecimals={false} /> 
                    <Tooltip formatter={(value, name) => [value, 'จำนวนงาน']} />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="จำนวนใบงาน" fill="#007BFF" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default DepartmentPerformanceChart;