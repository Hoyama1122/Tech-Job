'use client';

import { CardWorkTypes } from '@/lib/Mock/CardWork';
import { Users } from '@/lib/Mock/UserMock';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { FileText, User, Clock, ChevronRight } from "lucide-react";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import Link from "next/link";


type User = typeof Users;
type Job = CardWorkTypes;


const AssignJobsClient = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    try {
      const jobsData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (jobsData) {
        setAllJobs(JSON.parse(jobsData));
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false)
    }
  }, []);

  const unassignedJobs = useMemo(() => {
    return allJobs.filter((job) => job.status === "รอการมอบหมายงาน")
  }, [allJobs]);

  if (isLoading) {
    <div className='flex justify-center items-center h-40'>
      <Loader2 className='animate-spin text-primary' size={32} />
    </div>
  }
  return (
    <>
      <div className='bg-white rounded-lg shadow-mb p-4'>
        {unassignedJobs.length === 0 ? (
          <p className='text-center text-gray-500 py-10'>
            ไม่มีใบงานที่รอการมอบหมายในขณะนี้
          </p>
        ) : (
          <div className='space-y-3'>
            {unassignedJobs.map((job) => (
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden group flex flex-col h-full">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm font-mono font-bold text-primary">
                        #{job.JobId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Content Area */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    {job.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Metadata */}
                  </div>
                  <div className="space-y-3 mb-2">

                    <div className="flex items-center justify-end text-sm">
                      <div className="flex gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>วันที่สร้าง:</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatThaiDateTime(job.createdAt)}
                      </span>
                    </div>

                  </div>

                  {/* Action Button - อยู่ล่างสุดเสมอ */}
                  <Link
                    href={`/supervisor/assign/${job.JobId}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg mt-auto"
                  >
                    หมอบหมายงาน
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AssignJobsClient