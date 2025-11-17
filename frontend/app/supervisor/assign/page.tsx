import React from "react";

import { Metadata } from "next";
import AssignJobsClient from "@/components/Supervisor/work/AssignJobsCilent";

export const metadata: Metadata = {
  title: "มอบหมายงาน",
};

const AssignPage = () => {
  return (
    <div className="p-4">
      <h1 className="font-title text-primary mb-4">มอบหมายงานให้ช่าง</h1>
      <p className="text-text-secondary mb-6">
        เลือกใบงานที่ "รอการมอบหมายงาน" และเลือกช่างในทีมของคุณเพื่อรับผิดชอบงาน
      </p>
      
      {/* คอมโพเนนต์นี้จะจัดการ Logic ทั้งหมด */}
      <AssignJobsClient/>
    </div>
  );
};

export default AssignPage;