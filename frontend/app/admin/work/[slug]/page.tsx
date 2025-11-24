/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import NotFoundPage from "@/components/Dashboard/Work/Slug/NotFoundPage";
import Header from "@/components/Dashboard/Work/Slug/Header";
import BasicInfoCard from "@/components/Dashboard/Work/Slug/BasicInfo";
import DescriptionCard from "@/components/Dashboard/Work/Slug/DescriptionCard";
import EvidenceCard from "@/components/Dashboard/Work/Slug/EvidenceCard";
import Sidebar from "@/components/Dashboard/Work/Slug/Sidebar";
import LoadingSkeleton from "@/components/Dashboard/Work/Slug/LoadingSkeleton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkDetailPage({ params }: PageProps) {
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { slug } = React.use(params);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [job, setJob] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    try {
      const fetchJobByid = localStorage.getItem("CardWork");
      if (!fetchJobByid) return notFound();
      const job = JSON.parse(fetchJobByid).find(
        (job: any) => job.JobId === slug
      );
      if (!job) return notFound();
      setJob(job);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารโหลดข้อมูลได้", error);
    }
  }, [slug]);
  console.log(job);

  const [isLoading, setIsLoading] = useState(true);
  if (isLoading)
    return (
      <div className="grid grid-cols-[1.8fr_1fr] gap-4 p-4">
        <div className=" mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse  h-[600px]">
            <div className="h-6 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[500px] bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
        <div className=" mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse  h-[600px]">
            <div className="h-6 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[500px] bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h1>{job?.title}</h1>
      </div>
    </div>
  );
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setJob] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);

    try {
      const cardData = localStorage.getItem("CardWork");
      const usersData = localStorage.getItem("Users");

      if (cardData) {
        const jobs = JSON.parse(cardData);
        const users = usersData ? JSON.parse(usersData) : [];

        const found = jobs.find((j: any) => j.JobId === slug);

        if (found) {
          const supervisor = users.find(
            (u: any) =>
              u.role === "supervisor" &&
              String(u.id) === String(found.supervisorId)
          );

          const technicians = users.filter(
            (u: any) =>
              u.role === "technician" &&
              found.technicianId?.includes(u.id)
          );

          setJob({
            ...found,
            supervisor: supervisor || null,
            technician: technicians || [],
          });
        } else {
          setJob(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [slug]);
  console.log(job);
  
  if (isLoading) return <LoadingSkeleton />;
  if (!job) return <NotFoundPage jobId={slug} />;

  return (
    <div className="p-4">
      <Header job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-4 mt-6">
        <div className="space-y-4">
          <BasicInfoCard job={job} />
          <DescriptionCard job={job} />
          <EvidenceCard job={job} />
        </div>
        <Sidebar job={job} />
        
      </div>
    </div>
  );
}
