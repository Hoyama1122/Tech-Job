import DateFormat from "@/lib/Format/DateFormat";
import { CirclePlus } from "lucide-react";
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
          <button className="button-create">
            สร้างงานใหม่ <CirclePlus />
          </button>
        </div>
      </div>
      {/* Work */}
    </div>
  );
};

export default Work;
