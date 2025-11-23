export default function DescriptionCard({ job }: any) {
  if (!job.description) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col">
        <div>
          <h2 className="text-xl font-bold mb-4">รายละเอียดงาน</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </p>
        </div>
        {/* From Technician */}
        {job.technicianReport ? (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">รายละเอียดจากช่างเทคนิค</h2>

            <div className="bg-gray-50 p-4 rounded-lg border leading-relaxed text-gray-700 whitespace-pre-wrap">
              {job.technicianReport}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">รายละเอียดจากช่างเทคนิค</h2>
            <p className="text-gray-500 italic">
              ยังไม่มีรายละเอียดจากช่างเทคนิค
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
