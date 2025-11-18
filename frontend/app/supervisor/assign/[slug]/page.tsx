import AssignDetail from "@/components/Supervisor/work/AssignDetail";
import { Metadata } from "next";
import React from "react";

interface PageProps {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: "มอบหมายงาน"
}
export default function AssignDetailRoute({ params } : PageProps) {

  const jobId = params.slug;
  return (
    <div className="p-4">
      <AssignDetail jobId={jobId}/>
    </div>
  )
}