import React from "react";

const CardWork = ({ card }) => {
  //  badge
  const BadgeStatus = (status: string) => {
    switch (status) {
      case "สำเร็จ":
        return "bg-green-100 text-green-700";
      case "กำลังทำงาน":
        return "bg-yellow-100 text-yellow-700";
      case "ตีกลับ":
        return "bg-red-100 text-red-700";
      case "รอการตรวจสอบ":
        return "bg-blue-100 text-blue-700";
      case "รอการหมอบหมายงาน":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="hidden md:block overflow-x-auto mt-4">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
        <thead className=" ">
          <tr className="bg-primary border-gray-300  rounded-lg ">
            <th className="px-3 py-3 w-1/10 text-left font-semibold text-white">
              หมายเลข
            </th>
            <th className="px-3 py-3 text-left font-semibold text-white">
              ผู้ทำงาน
            </th>
            <th className="px-3 py-3 text-left font-semibold text-white">
              งาน
            </th>
            <th className="px-3 py-3 text-left font-semibold text-white">
              ผู้รับผิดชอบ
            </th>
            <th className="px-3 py-3 text-left font-semibold text-white">
              สถานะ
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {card.length > 0 ? (
            card.map((work: any,index) => (
              <tr
                key={work.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-2 text-sm font-semibold text-gray-800">
                  {work.JobId}
                </td>

                {/* แสดงชื่อช่างทั้งหมด */}
                <td className="px-3 py-3 text-sm text-gray-700">
                  {work.technicians?.length > 0
                    ? work.technicians.map((t: any) => t.name).join(", ")
                    : "-"}
                </td>

                <td className="px-3 py-3 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">{work.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {work.description}
                    </p>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700">
                  {work.supervisor?.name}
                </td>
                <td className={`px-3 py-3 text-sm  text-gray-700 `}>
                  <div>
                    <span
                      className={`px-2 inline-flex text-sm  font-semibold rounded-lg ${BadgeStatus(
                        work.status
                      )}`}
                    >
                      {work.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center text-gray-400 py-6 text-sm italic"
              >
                ไม่มีข้อมูลใบงาน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CardWork;
