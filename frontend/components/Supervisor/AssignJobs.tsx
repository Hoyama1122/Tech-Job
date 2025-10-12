import Image from "next/image";
import React from "react";
import profile from "@/public/profile/profile.jpg";

const AssignJobs = () => {
  const JobAsssign = [
    { id: 1, name: "JOB_231", category: "ไฟฟ้า", location: "ตึกใบหยก", time: "09:00 - 12:00" },
    { id: 2, name: "JOB_232", category: "อินเตอร์เน็ต", location: "ตึกใบหยก", time: "09:00 - 12:00" },
    { id: 3, name: "JOB_233", category: "ประปา", location: "อาคาร A", time: "13:00 - 16:00" },
    { id: 4, name: "JOB_234", category: "เครื่องปรับอากาศ", location: "อาคาร B", time: "08:00 - 11:00" },
    { id: 5, name: "JOB_235", category: "ระบบความปลอดภัย", location: "อาคาร C", time: "10:00 - 13:00" },
  ];

  const teamMembers = [
    { id: 1, name: "จักปู", jobToday: 2, pending: 1 },
    { id: 2, name: "มอส", jobToday: 3, pending: 0 },
    { id: 3, name: "แบงค์", jobToday: 1, pending: 2 },
    { id: 4, name: "จูน", jobToday: 2, pending: 1 },
    { id: 5, name: "โอ๊ต", jobToday: 4, pending: 1 },
    { id: 6, name: "นัท", jobToday: 2, pending: 0 },
  ];

  return (
    <div className="mt-5 bg-white rounded-lg p-3 md:p-5 shadow-md">
      <h1 className="text-base md:text-lg font-bold text-gray-700 mb-4">
        มอบหมายงาน
      </h1>

      <div className="flex flex-col md:flex-row gap-5">
        {/* งานที่ยังไม่ถูกมอบหมาย */}
        <div className="flex-1">
          <h1 className="font-semibold mb-2 text-gray-800">
            งานที่ยังไม่ถูกมอบหมาย
          </h1>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {JobAsssign.map((job) => (
              <div
                key={job.id}
                className="bg-accent/10 border border-accent/40 p-3 rounded-md flex justify-between items-center hover:bg-accent/20 transition-all duration-300"
              >
                <div className="text-gray-700">
                  <h1 className="font-semibold text-accent">{job.name}</h1>
                  <p className="md:text-sm">{job.category}</p>
                  <p className="md:text-sm">{job.location}</p>
                  <p className="md:text-sm">{job.time}</p>
                </div>

                <button className="bg-accent px-3  cursor-pointer py-1.5 rounded text-white text-sm hover:bg-accent-hover transition-all duration-300">
                  มอบหมาย
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* เส้นแบ่ง */}
        <div className="hidden md:block w-[1px] bg-gray-200"></div>

        {/* ช่างในทีม */}
        <div className="flex-1">
          <h1 className="font-semibold mb-3 text-gray-800">ช่างในทีม</h1>

          {/* ✅ Scroll container */}
          <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md hover:bg-gray-100 transition-all duration-300"
              >
                <Image
                  src={profile}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-700">{member.name}</p>
                  <div className="flex text-sm text-gray-600 gap-3">
                    <p>
                      งานวันนี้:{" "}
                      <span className="font-medium text-green-600">
                        {member.jobToday}
                      </span>
                    </p>
                    <p>
                      งานค้าง:{" "}
                      <span className="font-medium text-red-500">
                        {member.pending}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default AssignJobs;
