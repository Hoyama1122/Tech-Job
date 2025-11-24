// components/Dashboard/Work/SearchBar.tsx
import { Search, CirclePlus } from "lucide-react";
import Link from "next/link";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export default function SearchBar({ search, setSearch, filterStatus, setFilterStatus }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาใบงานด้วยชื่อ, รหัส, หรือรายละเอียด..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="ทั้งหมด">สถานะ: ทั้งหมด</option>
            <option value="กำลังทำงาน">กำลังทำงาน</option>
            <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
            <option value="สำเร็จ">สำเร็จ</option>
            <option value="ตีกลับ">ตีกลับ</option>
          </select>
        </div>
      </div>
    </div>
  );
}