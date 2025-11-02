import DateFormat from "@/lib/Format/DateFormat";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const Work = () => {
  return (
    <div>
      <h1 className="font-title">ใบงานของทั้งหมด</h1>
      {/* Date and create button */}
      <div className="mt-4 flex items-center justify-between ">
        <div>
          <h1 className="">
            <DateFormat />
          </h1>
        </div>
        <div>
          <Link href="/dashboard/add-work" className="button-create" >
            สร้างงานใหม่ <CirclePlus />
          </Link>
        </div>
      </div>
      {/* Work */}
    </div>
  );
};

export default Work;
