import { useRouter } from "next/router";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;

  return <h1>Slug: {slug}</h1>;
}
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
    getCurrentLocation();
  }, []);
  return (
    <div>
      <h1>Openwork</h1>
      <button onClick={() => setOpen(true)}>เริ่มงาน</button>
      {open && (
        <div>
          <input
            type="text"
            placeholder="ชื่อพนักงาน"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="รหัสพนักงาน"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <p>เวลา: {time}</p>
          <button onClick={handleStartWork}>เริ่มงาน</button>
        </div>
      )}
    </div>
  );
};
