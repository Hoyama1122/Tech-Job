import { Clock, FileText, ImageIcon } from "lucide-react";
import React from "react";
import Location from "./Location";
import Team from "./Team";
import DateFormatWork from "@/lib/Format/DateForWork";

const JobsDetail = ({ job, adminImages }) => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mt-2">
        {/* Detail */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-700" />
            รายละเอียดงาน
          </h2>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ชื่องาน: {job.title}
          </h2>

          <div className="rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {job.description}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-xl flex items-center gap-1 font-semibold">
            <Clock className="w-4 h-4 text-accent" />
            ระยะเวลาการทำงาน
          </h1>
          <div className="flex space-x-2">
            <p>{DateFormatWork(job.dateRange?.startAt)}</p>
            <p>-</p>
            <p>{DateFormatWork(job.dateRange?.endAt)}</p>
          </div>
        </div>
        {/* Admin Images */}
        {adminImages && adminImages.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              รูปภาพประกอบ
              <span className="text-sm font-normal text-gray-500">
                ({adminImages.length} รูป)
              </span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {adminImages.map((img, index) => (
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

        {/* Location  Team */}
        <Location job={job} />
        <Team job={job} />
      </div>
    </div>
  );
};

export default JobsDetail;
