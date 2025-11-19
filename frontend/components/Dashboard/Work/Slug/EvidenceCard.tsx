import { Image as ImageIcon } from "lucide-react";

export default function EvidenceCard({ job }: any) {
  if (!job.image) return null;

  const images = Array.isArray(job.image) ? job.image : [job.image];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ImageIcon className="w-6 h-6 text-primary" />
        รูปภาพ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img: any, i: number) => {
          const src = typeof img === "object" ? img.src || img.blurDataURL : img;

          return (
            <img
              key={i}
              src={src}
              alt={`หลักฐาน ${i + 1}`}
              className="w-full object-cover rounded-xl shadow cursor-pointer hover:opacity-90"
              onClick={() => window.open(src, "_blank")}
            />
          );
        })}
      </div>
    </div>
  );
}
