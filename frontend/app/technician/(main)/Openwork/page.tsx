import Calendar from "@/components/ui/Calendar";
import React from "react";

export const Openwork = () => {
  return (
    <div className="">
      <div className="rounded-lg p-1 flex justify-between">
        <div>
          <p className="text-2xl">ลูกค้า : บริษัทกำลังสร้าง</p>
          <p className="text-m mt-2">
            วันจันทร์ที่ 11 กุมภาพันธ์ 2568 เวลา 12:00
          </p>
        </div>

        <div className="flex flex-col justify-between text-right opacity-50">
          <p>เลขที่ใบงาน : 0001</p>
        </div>
      </div>

      <div className="mt-4">
        <p>รายละเอียดงาน</p>
        <div className="rounded-lg bg-gray-300 p-3 my-2">
          <p className="">
            - ติดตั้งแอร์ 10 เครื่อง <br />- ล้างแอร์ 20 เครื่อง
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p>map</p>
        <div className="bg-gray-300 rounded-lg p-3 my-2">map</div>
        <p>สถานที่ : บริษัทกำลังสร้าง</p>
      </div>

      <div className="mt-4">
        <p>ทีม: 5หัวหน้าสมิง</p>
        <div>
            <p>สมิง แซ่ลิ้ม (หัวหน้าทีม)</p>
        </div>
        <div>
            <p>สมิง แซ่ลิ้ม (หัวหน้าทีม)</p>
        </div>
        <div>
            <p>สมิง แซ่ลิ้ม (หัวหน้าทีม)</p>
        </div>
        <div>
            <p>สมิง แซ่ลิ้ม (หัวหน้าทีม)</p>
        </div>
      </div>

      <button
        className="rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none position-fixed bottom-4 w-full md:w-1/2 md:mx-auto block mt-6"
        type="button">
        เริ่มงาน
      </button>
    </div>
  );
};

export default Openwork;
