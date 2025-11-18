import { FileText, Download } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ job }: any) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-primary">รายละเอียดใบงาน</h1>
          <p className="text-sm text-gray-500 mt-1">หมายเลข: #{job.JobId}</p>
        </div>
      </div>

      <button
        onClick={() => alert("กำลังดาวน์โหลด...")}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-3 rounded-lg text-sm"
      >
        <Download className="w-4 h-4" />
        ดาวน์โหลด
      </button>
    </div>
  );
}
