import React from 'react'

import ReviewDashboard from '@/components/Supervisor/ReviewDashboard';
import { LayoutDashboard } from 'lucide-react';
import ReviewCharts from '@/components/Supervisor/ReviewChart';

const page = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" />
            ภาพรวมการตรวจสอบงาน
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            สรุปสถิติและรายการงานที่ต้องตรวจสอบ/อนุมัติ
          </p>
        </div>
      </div>

      {/* 1. ส่วนกราฟและสถิติ */}
      <ReviewCharts />

      {/* 2. ส่วนตารางรายการตรวจสอบ (Component เดิมที่มีอยู่) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-accent pl-3">
          รายการที่รอตรวจสอบ
        </h2>
        <ReviewDashboard />
      </div>
    </div>
  )
}

export default page;