/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  const { slug } = use(params);

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
