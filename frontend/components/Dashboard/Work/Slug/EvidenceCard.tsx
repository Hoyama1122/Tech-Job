import { Image as ImageIcon, Signature } from "lucide-react";

interface EvidenceCardProps {
  job: any;

  // รูปจริงที่ส่งมาจาก page.tsx
  imagesBefore: string[];
  imagesAfter: string[];
}

export default function EvidenceCard({
  job,
  imagesBefore,
  imagesAfter,
}: EvidenceCardProps) {
  const hasImages =
    (imagesBefore && imagesBefore.length > 0) ||
    (imagesAfter && imagesAfter.length > 0);

  const hasSign =
    job.technicianReport?.technicianSignature ||
    job.technicianReport?.customerSignature;

  if (!hasImages && !hasSign) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ImageIcon className="w-6 h-6 text-primary" />
        รูปภาพ / ลายเซ็น
      </h2>

      <div className="flex flex-col gap-8">
        {/* BEFORE IMAGES */}
        <div className="flex items-center gap-4">
          {imagesBefore.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">รูปก่อนทำงาน</p>

              <div className="flex gap-4 flex-wrap">
                {imagesBefore.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-36 h-36 object-cover shadow cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AFTER IMAGES */}
          {imagesAfter.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">รูปหลังทำงาน</p>

              <div className="flex gap-4 flex-wrap">
                {imagesAfter.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-36 h-36 object-cover shadow cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIGNATURES */}
        {(job.technicianReport?.customerSignature ||
          job.technicianReport?.technicianSignature) && (
          <div className="flex items-start gap-8 flex-wrap">
            {/* Customer Sign */}
            {job.technicianReport?.customerSignature && (
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Signature className="w-5 h-5 text-primary" />
                  ลายเซ็นลูกค้า
                </p>

                <img
                  src={job.technicianReport.customerSignature}
                  alt="ลายเซ็นลูกค้า"
                  className="w-56 h-auto object-contain bg-gray-50 rounded-xl p-3 shadow"
                />
              </div>
            )}

            {/* Technician Sign */}
            {job.technicianReport?.technicianSignature && (
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Signature className="w-5 h-5 text-primary" />
                  ลายเซ็นช่าง
                </p>

                <img
                  src={job.technicianReport.technicianSignature}
                  alt="ลายเซ็นช่าง"
                  className="w-56 h-auto object-contain bg-gray-50 rounded-xl p-3 shadow"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
