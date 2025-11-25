import { Image as ImageIcon, Signature } from "lucide-react";

export default function EvidenceCard({ job }: any) {
  if (!job.image && !job.customerSignature) return null;

  const images = Array.isArray(job.image) ? job.image : [job.image];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ImageIcon className="w-6 h-6 text-primary" />
        รูปภาพ / ลายเซ็นลูกค้า
      </h2>

      <div className="flex flex-col gap-6">
        {/* รูปภาพ */}
        {images.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {images.map((img: any, i: number) => {
              const src =
                typeof img === "object" ? img.src || img.blurDataURL : img;

              return (
                <img
                  key={i}
                  src={src}
                  alt={`หลักฐาน ${i + 1}`}
                  className="w-36 h-36 object-cover rounded-xl shadow cursor-pointer hover:opacity-90"
                  onClick={() => window.open(src, "_blank")}
                />
              );
            })}
          </div>
        )}

        {/* ลายเซ็นลูกค้า */}
        <div className="flex items-center gap-4">
          {job.technicianReport?.customerSignature && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Signature className="w-5 h-5 text-primary" />
                ลายเซ็นลูกค้า
              </p>

              <img
                src={job.technicianReport?.customerSignature}
                alt="ลายเซ็นลูกค้า"
                className="w-56 h-auto object-contain bg-gray-50  rounded-xl p-3 shadow"
              />
            </div>
          )}
          {job.technicianReport?.technicianSignature && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Signature className="w-5 h-5 text-primary" />
                ลายเซ็นช่าง
              </p>

              <img
                src={job.technicianReport?.technicianSignature}
                alt="ลายเซ็นลูกค้า"
                className="w-56 h-auto object-contain bg-gray-50  rounded-xl p-3 shadow"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
