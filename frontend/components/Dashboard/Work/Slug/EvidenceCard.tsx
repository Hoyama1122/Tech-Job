import { Image as ImageIcon, Signature } from "lucide-react";

interface EvidenceCardProps {
  job: any;
}

export default function EvidenceCard({ job }: EvidenceCardProps) {
  const adminImages = job?.images?.map((item: any) => item.url).filter(Boolean) || [];
  const latestReport = job?.reports?.[0] || null;

  const hasAdmin = adminImages.length > 0;
  const hasCustomerSign = !!latestReport?.cus_sign;

  const hasAnyEvidence = hasAdmin || hasCustomerSign;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ImageIcon className="w-6 h-6 text-primary" />
        รูปภาพ / ลายเซ็น
      </h2>

      {!hasAnyEvidence ? (
        <p className="text-gray-500">ยังไม่มีรูปภาพหรือหลักฐาน</p>
      ) : (
        <div className="space-y-8">
          {hasAdmin && (
            <div>
              <p className="font-semibold text-gray-700 mb-3">
                รูปจากผู้ดูแล (Admin)
              </p>

              <div className="flex gap-4 flex-wrap">
                {adminImages.map((src: string, i: number) => (
                  <img
                    key={i}
                    src={src}
                    alt={`admin-image-${i + 1}`}
                    className="w-36 h-36 object-cover shadow rounded-lg cursor-pointer hover:opacity-90"
                    onClick={() => window.open(src, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {hasCustomerSign && (
            <div className="flex items-start gap-8 flex-wrap">
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Signature className="w-6 h-6 text-green-700" />
                  ลายเซ็นลูกค้า
                </p>
                <img
                  src={latestReport.cus_sign}
                  alt="customer-signature"
                  className="w-56 h-auto object-contain bg-gray-50 rounded-lg p-3 shadow"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}