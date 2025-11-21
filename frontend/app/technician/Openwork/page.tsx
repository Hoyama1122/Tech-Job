"use client";
import React, { useState, useEffect } from "react";

export const Openwork = () => {
  const [open, setOpen] = useState(false); // ปุ่มกดเริ่มงาน

  const [name, setName] = useState(""); // ชื่อพนักงานรอดึงจากโปรไฟล์อีกที
  const [code, setCode] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [time, setTime] = useState("");

  // ฟังก์ชันดึงพิกัดปัจจุบัน
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่ง");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("กรุณาเปิด GPS ของคุณ");
      }
    );
  };

  // ฟังก์ชันเริ่มงาน
  const handleStartWork = () => {
    if (!name || !code) {
      alert("กรุณากรอกชื่อและรหัสพนักงานให้ครบ");
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleString("th-TH", {
      dateStyle: "full",
      timeStyle: "medium",
    });
    setTime(currentTime);

    getCurrentLocation();

    const data = {
      name,
      code,
      time: currentTime,
      location: { latitude, longitude },
    };

    console.log("ข้อมูลเริ่มงาน:", data);
    alert("เริ่มงานสำเร็จ!");
    setOpen(false);
  };

  // อัปเดตเวลาแบบเรียลไทม์
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ดึงพิกัดปัจจุบันเมื่อกดเริ่มงาน
  useEffect(() => {
    if (open) {
      getCurrentLocation();
    }
  }, [open]);

  return (
    <div className="">
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-xl font-bold mb-3 text-center">
              กรุณากรอกข้อมูลพนักงาน
            </h2>

            <div className="mb-4">
              <label className="text-sm">ชื่อพนักงาน</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="กรอกชื่อ"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm">รหัสพนักงาน</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="กรอกรหัส"
              />
            </div>

            <div className="mb-5">
              <label className="">เวลาเข้างาน</label>
              <input
                type=""
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={time}
              />
            </div>

            <div className="mb-5">
              <label className="">พิกัด</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={
                  latitude && longitude
                    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    : ""
                }
                readOnly
                placeholder="กำลังดึงพิกัด..."
              />
            </div>

            <button
              onClick={handleStartWork}
              className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              ยืนยันเริ่มงาน
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 mt-3 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

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
          <p>สมิง แซ่ลิ้ม</p>
        </div>
        <div>
          <p>สมิง แซ่ลิ้ม</p>
        </div>
        <div>
          <p>สมิง แซ่ลิ้ม</p>
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none position-fixed bottom-4 w-full md:w-1/2 md:mx-auto block mt-6"
        type="button"
      >
        เริ่มงาน
      </button>
    </div>
  );
};

export default Openwork;
