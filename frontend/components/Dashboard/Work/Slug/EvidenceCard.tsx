import { Image as ImageIcon, Signature } from "lucide-react";

interface EvidenceCardProps {
  job: any;
  adminImages: string[];
  imagesBefore: string[];
  imagesAfter: string[];
}

export default function EvidenceCard({
  job,
  adminImages,
  imagesBefore,
  imagesAfter,
}: EvidenceCardProps) {
  const hasAdmin = adminImages.length > 0;
  const hasBefore = imagesBefore.length > 0;
  const hasAfter = imagesAfter.length > 0;

  const hasSign =
    job?.technicianReport?.technicianSignature ||
    job?.technicianReport?.customerSignature;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ImageIcon className="w-6 h-6 text-primary" />
        รูปภาพ / ลายเซ็น
      </h2>

      <div className="space-y-8 ">
        {/* ADMIN IMAGES */}
        <div className="flex gap-2">
          {hasAdmin && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                รูปจากผู้ดูแล (Admin)
              </p>

              <div className="flex gap-4 flex-wrap">
                {adminImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-36 h-36 object-cover shadow rounded-lg cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BEFORE IMAGES */}
          {hasBefore && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">รูปก่อนทำงาน</p>

              <div className="flex gap-4 flex-wrap">
                {imagesBefore.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-36 h-36 object-cover shadow rounded-lg cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AFTER IMAGES */}
          {hasAfter && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">รูปหลังทำงาน</p>

              <div className="flex gap-4 flex-wrap">
                {imagesAfter.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-36 h-36 object-cover shadow rounded-lg cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIGNATURES */}
        {hasSign && (
          <div className="flex items-start gap-8 flex-wrap">
            {job.technicianReport?.customerSignature && (
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Signature className="w-6 h-6 text-green-700" /> ลายเซ็นลูกค้า
                </p>
                <img
                  src={job.technicianReport.customerSignature}
                  className="w-56 h-auto object-contain bg-gray-50 rounded-lg p-3 shadow"
                />
              </div>
            )}

            {job.technicianReport?.technicianSignature && (
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Signature className="w-6 h-6 text-primary" />
                  ลายเซ็นช่าง
                </p>
                <img
                  src={job.technicianReport.technicianSignature}
                  className="w-56 h-auto object-contain bg-gray-50 rounded-lg p-3 shadow"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
