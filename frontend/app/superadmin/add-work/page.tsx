import WorkForm from "@/components/Dashboard/Form/WorkForm";
import { FileDiff } from "lucide-react";
import React from "react";

export const metadata = {
  title: "สร้างใบงาน",
};

const Page = () => {
  return (
    <div className="p-4">
      {/* Title */}
      <h1 className="font-title flex items-center gap-2  text-primary font-semibold">
        <FileDiff size={28} className="text-primary" />
        สร้างใบงาน
      </h1>

      {/* Form */}
      <WorkForm />
    </div>
  );
};

export default Page;
