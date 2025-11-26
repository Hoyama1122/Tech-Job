import { FileText, ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Location from "./Location";
import Team from "./Team";

const JobsDetail = ({ job }) => {
 

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mt-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-700" />
            รายละเอียดงาน
          </h2>

          <h2 className="text-base font-semibold text-gray-900 mb-2">
            ชื่องาน: {job.title}
          </h2>

          <div className="rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {job.description}
            </p>
          </div>
        </div>
        {job.image && job.image.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              รูปภาพประกอบ{" "}
              <span className="text-sm font-normal text-gray-500">
                ({job.image.length} รูป)
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {job.image.map((img, index) => (
                <div key={index} className="group relative">
                  <img
                    src={img}
                    alt={`รูปภาพ ${index + 1}`}
                    className="w-full h-32 md:h-36 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.open(img, "_blank")}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
        <Location job={job} />
        <Team job={job}  />
      </div>
    </div>
  );
};

export default JobsDetail;
