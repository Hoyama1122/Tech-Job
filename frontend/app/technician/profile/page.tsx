"use client";
// ลบการ import 'next/image' ออกเพื่อแก้ไขปัญหาการคอมไพล์ในสภาพแวดล้อมนี้
import React, { useState, useRef, useEffect } from "react";
import { NextResponse } from "next/server";

// URL รูปภาพเริ่มต้น (ในโปรเจกต์ Next.js ต้องอยู่ในโฟลเดอร์ public)
const INITIAL_IMAGE_SRC = "https://placehold.co/150x150/0000FF/FFFFFF?text=PROFILE"; 

// -------------------------------------------------------------
// Component ย่อย: รูปโปรไฟล์ที่สามารถเปลี่ยนได้และจัดการการอัปโหลด
// -------------------------------------------------------------
type EditableProfilePictureProps = {
  initialSrc: string;
  alt: string;
  size?: number;
  onUploadSuccess: (url: string) => void;
};

const EditableProfilePicture: React.FC<EditableProfilePictureProps> = ({ initialSrc, alt, size = 100, onUploadSuccess }) => {
  // 1. State สำหรับเก็บ URL ของรูปภาพที่จะแสดง (Client-side Preview)
  const [imageSrc, setImageSrc] = useState(initialSrc);
  
  // 2. State สำหรับการจัดการสถานะการอัปโหลด (idle, loading, error)
  const [status, setStatus] = useState('idle'); 

  // 3. Ref สำหรับอ้างอิงถึง input type="file" ที่ซ่อนไว้
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // URL ปลอมสำหรับจำลองการเรียก API (ในความเป็นจริงคือ /api/upload-profile-picture)
  const API_ENDPOINT = '/api/mock-upload'; 
  const MAX_UPLOAD_ATTEMPTS = 3;

  // ฟังก์ชันจัดการเมื่อคลิกที่รูปภาพ (เปิด File Dialog)
  const handleImageClick = () => {
    // ไม่อนุญาตให้คลิกขณะกำลังโหลด
    if (status !== 'loading') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  /**
   * จำลองการอัปโหลดไฟล์ไปยังเซิร์ฟเวอร์ด้วย Exponential Backoff
   * @param {File} file - ไฟล์รูปภาพที่เลือก
   */
  const uploadFileToServer = async (file: File) => {
    setStatus('loading');
    const formData = new FormData();
    formData.append('profileImage', file);
    
    let attempts = 0;
    let permanentUrl = null;

    while (attempts < MAX_UPLOAD_ATTEMPTS) {
        try {
            // --------------------------------------------------
            // ** การจำลองการ Fetch ข้อมูลไปยัง API Route **
            // --------------------------------------------------
            // ในโปรเจกต์จริง ต้องมี Next.js API Route ที่จัดการการอัปโหลด
            // เช่น: /app/api/upload-profile-picture/route.js
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                // ในชีวิตจริง: body: formData,
                // สำหรับการจำลอง: เราใช้ setTimeout เพื่อจำลองเวลาหน่วงในการอัปโหลด
            });

            // --------------------------------------------------
            // ** การจำลองคำตอบจากเซิร์ฟเวอร์ **
            // --------------------------------------------------
            // สมมติว่าเซิร์ฟเวอร์ตอบกลับด้วย URL ถาวรใหม่
            await new Promise(resolve => setTimeout(resolve, 2000)); // หน่วง 2 วินาที
            // สร้าง URL Placeholder ใหม่ให้ดูเหมือนถูกอัปโหลด
            permanentUrl = `https://placehold.co/${size}x${size}/FF7F50/000000?text=${Date.now()}`;
            
            // หากสำเร็จ
            setStatus('idle');
            onUploadSuccess(permanentUrl); // ส่ง URL ถาวรกลับไปยัง Component แม่
            return;

        } catch (error) {
            attempts++;
            if (attempts < MAX_UPLOAD_ATTEMPTS) {
                const delay = Math.pow(2, attempts) * 500; // หน่วงเวลาเพิ่มขึ้น: 1s, 2s...
                console.warn(`Upload failed. Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // หากพยายามครบจำนวนครั้งแล้ว
                console.error("Failed to upload image after max retries:", error);
                setStatus('error');
                return;
            }
        }
    }
  };

  // ฟังก์ชันจัดการเมื่อมีการเลือกไฟล์
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && !status.includes('loading')) {
        // 1. Client-side Preview
        // Clean up Object URL เก่าเพื่อป้องกัน Memory Leak
        if (imageSrc && imageSrc !== initialSrc && imageSrc.startsWith("blob:")) {
          URL.revokeObjectURL(imageSrc); 
        }
        
        const newImageURL = URL.createObjectURL(file);
        setImageSrc(newImageURL);
  
        // 2. Start Upload process
        uploadFileToServer(file);
        
        // ล้างค่า input เพื่อให้สามารถเลือกไฟล์เดิมซ้ำได้
        event.target.value = ""; 
      }
    };
  
  // อัปเดต imageSrc เมื่อ initialSrc (จาก parent) เปลี่ยนไป (คือเมื่ออัปโหลดสำเร็จ)
  useEffect(() => {
      setImageSrc(initialSrc);
  }, [initialSrc]);


  return (
    <div className="flex flex-col items-center">
      {/* 1. Input Type File ที่ซ่อนไว้ */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/webp" // อนุญาตเฉพาะไฟล์รูปภาพ
        disabled={status === 'loading'}
      />

      {/* 2. Profile Picture Container */}
      <div
        onClick={handleImageClick} // เมื่อคลิกที่รูปภาพ -> เปิด File Dialog
        className={`relative transition-opacity ${status === 'loading' ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90 cursor-pointer'}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // เพิ่มเงาเพื่อความสวยงาม
        }}
        aria-busy={status === 'loading'}
      >
        {/* Spinner/Loading Overlay */}
        {status === 'loading' && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
        )}

        {/* Image Display - เปลี่ยนจาก Next/Image เป็นแท็ก <img> มาตรฐาน */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-700 text-xs">
            ไม่มีรูปภาพ
          </div>
        )}

        {/* Overlay สำหรับการแก้ไข (แสดงเมื่อไม่ได้กำลังโหลด) */}
        {status !== 'loading' && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.863-1.44A2 2 0 0110.125 4h3.75a2 2 0 011.664.89l.863 1.44a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
        )}
      </div>
      
      {/* Feedback Messages */}
      <p className={`mt-2 text-sm font-medium ${status === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
        {status === 'loading' ? (
            <span className="text-blue-600">กำลังอัปโหลด... โปรดรอสักครู่</span>
        ) : status === 'error' ? (
            '❌ อัปโหลดไม่สำเร็จ! กรุณาลองใหม่'
        ) : (
            'คลิกเพื่อเปลี่ยนรูปโปรไฟล์'
        )}
      </p>
    </div>
  );
};


// -------------------------------------------------------------
// Component หลัก: Profile
// -------------------------------------------------------------
export const Profile = () => {
    
  // State สำหรับข้อมูลพนักงาน
  const [name, setName] = useState("สมชาย ใจดี");
  const [code, setCode] = useState("TECH12345");
  const [email, setEmail] = useState("hR4kW@example.com");
  const [phone, setPhone] = useState("1234567890");

  // State สำหรับ URL รูปภาพโปรไฟล์ปัจจุบัน (จะเปลี่ยนเมื่ออัปโหลดสำเร็จ)
  const [profileImageUrl, setProfileImageUrl] = useState(INITIAL_IMAGE_SRC);

  // ⚠️ การจัดการ Memory Leak: Revoke Object URL เมื่อ Component ถูกยกเลิก
  useEffect(() => {
    return () => {
        // หากมีการสร้าง Object URL ชั่วคราว (สำหรับการ Preview) ให้ยกเลิกเมื่อ component ถูกถอดออก
        if (profileImageUrl && profileImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(profileImageUrl);
        }
    };
  }, [profileImageUrl]);


  // ฟังก์ชันที่จะถูกเรียกเมื่อการอัปโหลดไฟล์สำเร็จและได้ URL ถาวรแล้ว
  const handleUploadSuccess = (newPermanentUrl: string) => {
    // อัปเดต state หลักด้วย URL ถาวรใหม่ที่ได้จากเซิร์ฟเวอร์
    setProfileImageUrl(newPermanentUrl);
    console.log("Profile picture updated successfully to:", newPermanentUrl);
    // ณ จุดนี้คุณอาจจะต้องเรียก API เพื่อบันทึก URL ใหม่ลงในฐานข้อมูลผู้ใช้ด้วย
  };


  return (
    <div className="max-w-lg mx-auto my-2 p-6 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        ข้อมูลโปรไฟล์พนักงาน
      </h2>
      
      {/* ส่วนแสดงรูปภาพโปรไฟล์ที่เปลี่ยนได้ */}
      <div className="mb-10 flex justify-center">
        <EditableProfilePicture 
          initialSrc={profileImageUrl} // ส่ง URL รูปภาพปัจจุบันเข้าไป
          alt={`รูปโปรไฟล์ของ ${name}`} 
          size={180} // ขนาดใหญ่ขึ้นเพื่อให้ดูสวยงาม
          onUploadSuccess={handleUploadSuccess} // ส่งฟังก์ชันสำหรับอัปเดต URL ถาวร
        />
      </div>

      {/* ส่วนแสดงข้อมูลพนักงาน */}
      <div className="space-y-5">
        <div className="rounded-lg bg-indigo-50 p-4">
            <label className="text-sm font-medium text-indigo-700 block mb-1">ชื่อ - นามสกุล:</label>
            <p className="text-gray-900 text-xl font-bold">{name}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">รหัสพนักงาน:</label>
            <p className="text-gray-800 font-mono">{code}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">อีเมล:</label>
            <p className="text-gray-800">{email}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">เบอร์โทรศัพท์:</label>
            <p className="text-gray-800">{phone}</p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        *การอัปโหลดนี้เป็นการจำลองการส่งไฟล์ไปยังเซิร์ฟเวอร์
      </div>
    </div>
  );
};

export default Profile;