"use client";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = ({ params }) => {
  const router = useRouter();
  const { slug } = React.use(params);
  const [job, setJob] = useState(null);
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
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse h-[600px]">
            <div className="h-6 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[800px] bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[800px] bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[800px] bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center  space-x-4">
              <div className="h-48 w-[400px] bg-gray-200 rounded mb-4"></div>
              <div className="h-48 w-[400px] bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
        <div className=" mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse h-[600px]">
            <div className="h-6 w-full bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-[500px] bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-4 mt-6 p-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h1>{job?.title}</h1>
        <Image src={job.image}/>
      </div>
    </div>
  );
};

export default page;
